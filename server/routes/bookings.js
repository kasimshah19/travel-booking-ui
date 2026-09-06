const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { createBooking, createPaymentOrder, verifyPayment, cancelBooking, getMyBookings } = require('../controllers/bookingController');

// Secure Endpoints passing through auth middleware
router.get('/me', requireAuth, getMyBookings);
router.post('/', requireAuth, createBooking);
router.post('/:id/create-payment-order', requireAuth, createPaymentOrder);
router.post('/:id/verify-payment', requireAuth, verifyPayment);
router.post('/:id/cancel', requireAuth, cancelBooking);

module.exports = router;
