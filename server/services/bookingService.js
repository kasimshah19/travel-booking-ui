const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * CONCURRENCY APPROACH:
 * To prevent double-booking of a single-capacity slot, we use two critical safety layers:
 * 
 * 1. Database-Level Constraint: The `Booking` table has an explicit `@@unique([destinationId, date, slot])`. 
 *    Even if two users bypass frontend checks and hit the server at the exact same millisecond, 
 *    Postgres will throw a Unique Constraint Violation error for one of them instead of allowing a duplicate insert.
 * 
 * 2. Prisma $transaction: The flow of (a) checking if pending/confirmed exists, (b) inserting a PENDING Booking, 
 *    and (c) inserting a PENDING Payment record is wrapped in a single database transaction. 
 *    This makes the process atomic—meaning if the payment intent fails to generate halfway through, the pending booking 
 *    is completely rolled back, leaving no orphaned data.
 * 
 * NOTE: If a single slot/destination is updated in the future to hold multiple capacities (e.g., booked seats out of total seats), 
 * this unique constraint must be replaced with optimistic concurrency control (version column) or a lock (`FOR UPDATE`), 
 * plus a threshold check before incrementing booking counts.
 */

async function createBookingAndPaymentIntent({ userId, destinationId, date, slot, amount }) {
    // We wrap the entire insertion flow in a transaction
    return prisma.$transaction(async (tx) => {

        // 1. Double check availability (Optional, relying on Unique Constraint is the hard barrier)
        const existing = await tx.booking.findUnique({
            where: {
                destinationId_date_slot: {
                    destinationId,
                    date: new Date(date),
                    slot
                }
            }
        });

        if (existing && existing.status !== 'CANCELLED') {
            throw new Error("This slot is already booked.");
        }

        // 2. Create the PENDING booking
        // If another transaction beats us to this, Postgres will throw a unique constraint error here.
        const newBooking = await tx.booking.create({
            data: {
                userId,
                destinationId,
                date: new Date(date),
                slot,
                status: 'PENDING'
            }
        });

        // 3. Mock Generation of payment intent from Stripe/Razorpay
        // const paymentIntent = await stripe.paymentIntents.create({ amount, currency: 'INR' })
        const mockGatewayOrderId = `order_${Date.now()}`;

        // 4. Create the PENDING payment record linked to the booking
        const newPayment = await tx.payment.create({
            data: {
                bookingId: newBooking.id,
                amount,
                currency: 'INR',
                gatewayOrderId: mockGatewayOrderId,
                status: 'PENDING'
            }
        });

        return { booking: newBooking, payment: newPayment };
    });
}

module.exports = {
    createBookingAndPaymentIntent
};
