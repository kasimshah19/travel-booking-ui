require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/bookings');
const webhooksRoutes = require('./routes/webhooks');
const destinationsRoutes = require('./routes/destinations');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Setting credentials to true for HTTP-Only cookies
// Origin is set dynamically for local dev, but should be explicit in prod
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/destinations', destinationsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Phase 1 - 2.6: Lightweight expiry sweep every 2 mins
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    setInterval(async () => {
        try {
            const expired = await prisma.booking.updateMany({
                where: {
                    status: 'PENDING',
                    reservationExpiresAt: { lt: new Date() }
                },
                data: { status: 'EXPIRED', activeSlotKey: null }
            });
            if (expired.count > 0) console.log(`[Sweep] Cleared ${expired.count} expired bookings.`);
        } catch (e) {
            console.error("[Sweep Error]", e.message);
        }
    }, 2 * 60 * 1000);
});
