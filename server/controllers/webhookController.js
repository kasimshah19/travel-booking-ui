const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleRazorpayWebhook = async (req, res) => {
    try {
        // Razorpay sends stringified JSON. Ensure bodyParser.raw or similar was NOT used if req.body is already parsed,
        // Razorpay signature verification requires the raw body string or JSON.stringify representation.
        const signature = req.headers['x-razorpay-signature'];
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // Standard verification against the raw payload
        // Using stringify here assuming express.json() has already parsed it (caveat: order matters, best practice is raw body).
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest !== signature) {
            return res.status(400).json({ error: 'Invalid webhook signature' });
        }

        const event = req.body.event;
        const paymentEntity = req.body.payload.payment.entity;
        const orderId = paymentEntity.order_id;

        if (!orderId) {
            return res.status(200).send("No order_id present, ignoring.");
        }

        // Find the associated payment
        const payment = await prisma.payment.findFirst({
            where: { gatewayOrderId: orderId }
        });

        if (!payment) {
            return res.status(200).send("Payment record not found, ignoring.");
        }

        // Idempotency check: Don't process if already SUCCESS/FAILED definitively
        if (payment.status === 'SUCCESS' && event === 'payment.captured') {
            return res.status(200).json({ message: "Already processed as SUCCESS" });
        }

        if (event === 'payment.captured') {
            // Atomic Confirmation
            await prisma.$transaction([
                prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'SUCCESS', gatewayPaymentId: paymentEntity.id }
                }),
                prisma.booking.update({
                    where: { id: payment.bookingId },
                    data: { status: 'CONFIRMED' }
                })
            ]);
        } else if (event === 'payment.failed') {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED' }
            });
            // Keeping booking as PENDING allows user to retry
        } else if (event === 'refund.processed') {
            const refundEntity = req.body.payload.refund.entity;
            // Prevent duplicate updates
            if (payment.status !== 'REFUNDED') {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'REFUNDED', refundCompletedAt: new Date(refundEntity.created_at * 1000) }
                });
            }
        } else if (event === 'refund.failed') {
            if (payment.status !== 'REFUND_FAILED') {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'REFUND_FAILED' }
                });
                console.error(`Refund failed for payment ${payment.id}, needs manual intervention!`);
            }
        }

        res.status(200).json({ status: "ok" });
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).send('Webhook unhandled error');
    }
};

module.exports = { handleRazorpayWebhook };
