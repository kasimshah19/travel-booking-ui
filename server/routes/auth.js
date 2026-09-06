const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, refresh, logout, me } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
    message: { error: 'Too many requests from this IP, please try again later.' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;
