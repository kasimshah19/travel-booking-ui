const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { z } = require('zod');

const prisma = new PrismaClient();

const createBookingSchema = z.object({
    destinationId: z.string().uuid(),
    date: z.string(),
    slot: z.string(),
});

const createBooking = async (req, res) => {
    try {
        const { destinationId, date, slot } = createBookingSchema.parse(req.body);
        const userId = req.user.userId;

        // Prevent booking dates in the past
        const bookingDate = new Date(date);
        const serverNow = new Date();
        serverNow.setHours(0, 0, 0, 0); // Need to compare date-only
        if (bookingDate < serverNow) {
            return res.status(400).json({ error: 'Cannot book a date in the past.' });
        }

        const activeSlotKey = `${destinationId}|${bookingDate.toISOString().split('T')[0]}|${slot}`;

        // Use transaction for safe checking and creation
        const newBooking = await prisma.$transaction(async (tx) => {
            // 1. Explicit availability check for clean UI error (Check based on activeSlotKey!)
            const existing = await tx.booking.findUnique({
                where: { activeSlotKey }
            });

            if (existing) { // If it exists with a key, it's either PENDING (alive) or CONFIRMED
                // Don't just rely on the cron, check expiry ad-hoc
                if (existing.status === 'PENDING' && existing.reservationExpiresAt && new Date() > existing.reservationExpiresAt) {
                    // It's technically expired, but the cron hasn't removed the key yet. We can preemptively expire it.
                    await tx.booking.update({
                        where: { id: existing.id },
                        data: { status: 'EXPIRED', activeSlotKey: null }
                    });
                    // Now the slot is free, we can continue to create!
                } else {
                    throw new Error('SLOT_UNAVAILABLE');
                }
            }

            // 2. Create pending booking (with 10 min lock)
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            return tx.booking.create({
                data: {
                    userId,
                    destinationId,
                    date: bookingDate,
                    slot,
                    status: 'PENDING',
                    activeSlotKey,
                    reservationExpiresAt: expiresAt
                }
            });
        });

        res.status(201).json({ booking: newBooking });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }

        if (error.message === 'SLOT_UNAVAILABLE') {
            return res.status(409).json({ error: 'This slot is already booked.' });
        }

        // Prisma Unique Constraint Violation (Catch race conditions slipping past step 1)
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'This slot was just booked, please choose another.' });
        }

        console.error(error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentOrder = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const userId = req.user.userId;

        // Verify booking belongs to user & is pending
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { destination: true, payment: true }
        });

        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (booking.userId !== userId) return res.status(403).json({ error: 'Unauthorized booking access' });
        if (booking.status !== 'PENDING') return res.status(400).json({ error: 'Booking is not in a payable state' });

        // Expiry guard check
        if (booking.reservationExpiresAt && new Date() > booking.reservationExpiresAt) {
            return res.status(400).json({ error: 'This booking reservation has expired. Please create a new booking.' });
        }

        // Point 2: Reuse existing pending payment order to prevent duplicates!
        if (booking.payment && booking.payment.status === 'PENDING' && booking.payment.gatewayOrderId) {
            return res.json({
                razorpay_order_id: booking.payment.gatewayOrderId,
                amount: booking.payment.amount,
                currency: booking.payment.currency,
                key_id: process.env.RAZORPAY_KEY_ID
            });
        }

        // Assuming basePrice is the total cost here (Point 1: Server-side calculation)
        const amountInPaise = Math.round(booking.destination.basePrice * 100);

        // Call Razorpay API (Receipt string must be <= 40 chars max!)
        const shortReceipt = bookingId.replace(/-/g, '').substring(0, 30);
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `rcp_${shortReceipt}`,
            payment_capture: 1 // Auto-capture (or handled via webhook)
        });

        // Create/Update Payment record linked to booking
        await prisma.payment.upsert({
            where: { bookingId: bookingId },
            update: {
                gatewayOrderId: order.id,
                amount: booking.destination.basePrice,
                status: 'PENDING'
            },
            create: {
                bookingId: bookingId,
                gatewayOrderId: order.id,
                amount: booking.destination.basePrice,
                currency: 'INR',
                status: 'PENDING'
            }
        });

        // DO NOT send razorpay_key_secret!
        res.json({
            razorpay_order_id: order.id,
            amount: booking.destination.basePrice,
            currency: 'INR',
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Payment error detail:", error);
        res.status(500).json({ error: 'Failed to create payment order', details: error.message || error });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const userId = req.user.userId;

        // Verify signature using HMAC SHA256 (CRITICAL SECURITY)
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            // Signature mismatch - Log it and fail the payment
            await prisma.payment.updateMany({
                where: { bookingId, gatewayOrderId: razorpay_order_id, status: 'PENDING' },
                data: { status: 'FAILED' }
            });
            return res.status(400).json({ error: 'Invalid Payment Signature. Potential tampering detected.' });
        }

        // Point 4: Race condition check. If a webhook already processed this, return success immediately.
        const currentPayment = await prisma.payment.findUnique({ where: { bookingId } });
        if (currentPayment && currentPayment.status === 'SUCCESS') {
            return res.json({ message: "Payment verified successfully", redirect: "/confirmation" });
        }

        // Atomic update of both Payment & Booking (Transaction safety)
        await prisma.$transaction([
            prisma.payment.updateMany({
                where: { bookingId, gatewayOrderId: razorpay_order_id },
                data: { status: 'SUCCESS', gatewayPaymentId: razorpay_payment_id }
            }),
            prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CONFIRMED' }
            })
        ]);

        res.json({ message: "Payment verified successfully", redirect: "/confirmation" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error verifying payment' });
    }
};

const CANCELLATION_FULL_REFUND_HOURS = 48;

const cancelBooking = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const userId = req.user.userId;

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { payment: true }
        });

        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (booking.userId !== userId) return res.status(403).json({ error: 'Unauthorized user' });

        if (booking.status === 'CANCELLED') {
            return res.json({ message: 'Booking is already cancelled', booking });
        }

        if (booking.status !== 'CONFIRMED') {
            return res.status(400).json({ error: 'Only confirmed bookings can go through the cancellation flow' });
        }

        // Determine if eligible for full refund
        const msUntilTrip = booking.date.getTime() - Date.now();
        const hoursUntilTrip = msUntilTrip / (1000 * 60 * 60);
        const isEligibleForRefund = hoursUntilTrip >= CANCELLATION_FULL_REFUND_HOURS;

        const { payment } = booking;

        let refundOutcomeMessage = '';

        await prisma.$transaction(async (tx) => {
            // 1. Free the slot and cancel booking
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { status: 'CANCELLED', activeSlotKey: null }
            });

            // 2. Refund logic
            if (isEligibleForRefund && payment && payment.gatewayPaymentId) {
                // Call Razorpay Refunds API
                const refund = await razorpay.payments.refund(payment.gatewayPaymentId, {
                    amount: Math.round(payment.amount * 100),
                    notes: { bookingId: booking.id }
                });

                await tx.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'PENDING_REFUND',
                        refundId: refund.id,
                        refundInitiatedAt: new Date(),
                        refundedAmount: Math.round(payment.amount * 100)
                    }
                });
                refundOutcomeMessage = `Cancellation successful. Full refund of ₹${payment.amount} initiated.`;
            } else if (payment) {
                await tx.payment.update({
                    where: { id: payment.id },
                    data: { status: 'NOT_REFUNDED' }
                });
                refundOutcomeMessage = `Cancellation successful. No refund per policy (< 48 hrs).`;
            }
        });

        res.json({ message: refundOutcomeMessage });
    } catch (error) {
        console.error('Cancellation error:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const includeExpired = req.query.includeExpired === 'true';

        // 1. Single Prisma query fetching bookings & relations
        const bookings = await prisma.booking.findMany({
            where: {
                userId,
                status: includeExpired ? undefined : { not: 'EXPIRED' }
            },
            include: { destination: true, payment: true },
            // We order descending by default to grab the most recent relevant chunks
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit + 1 // +1 to determine if there are more records
        });

        const hasMore = bookings.length > limit;
        const retrievedItems = bookings.slice(0, limit);

        const now = new Date();
        const upcoming = [];
        const history = [];

        // 2. Group into upcoming vs history
        retrievedItems.forEach(b => {
            const isPast = b.date < now;
            if (b.status === 'CANCELLED' || isPast) {
                history.push(b);
            } else {
                upcoming.push(b);
            }
        });

        // 3. Apply requested sorting rules computationally per group 
        // Upcoming = Date Ascending (soonest trip first)
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        // History = Date Descending (most recent past trip first)
        history.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ upcoming, history, hasMore });
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

module.exports = { createBooking, createPaymentOrder, verifyPayment, cancelBooking, getMyBookings };
