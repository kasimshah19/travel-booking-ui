const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { z } = require('zod'); // Ideally share this from shared/schemas later

const prisma = new PrismaClient();

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    return { accessToken, refreshToken };
};

const setRefreshCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const register = async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { name, email, passwordHash }
        });

        // Trade-off decision: We will auto-login the user after registration to reduce friction.
        const { accessToken, refreshToken } = generateTokens(user.id);

        await prisma.refreshToken.create({
            data: {
                tokenHash: hashToken(refreshToken),
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        setRefreshCookie(res, refreshToken);
        res.status(201).json({ accessToken, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const { accessToken, refreshToken } = generateTokens(user.id);

        await prisma.refreshToken.create({
            data: {
                tokenHash: hashToken(refreshToken),
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        setRefreshCookie(res, refreshToken);
        res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const refresh = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    const hashedToken = hashToken(refreshToken);

    try {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { tokenHash: hashedToken },
            include: { user: true }
        });

        if (!storedToken || storedToken.isRevoked || new Date() > storedToken.expiresAt) {
            // Refresh token Reuse detection
            if (storedToken && storedToken.isRevoked) {
                // A revoked token was used -> revoke all tokens for this user!
                await prisma.refreshToken.updateMany({
                    where: { userId: storedToken.userId },
                    data: { isRevoked: true }
                });
            }
            res.clearCookie('refreshToken');
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        // Revoke the old token (rotation)
        await prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { isRevoked: true }
        });

        const { accessToken, refreshToken: newRefresh } = generateTokens(storedToken.user.id);

        await prisma.refreshToken.create({
            data: {
                tokenHash: hashToken(newRefresh),
                userId: storedToken.user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        setRefreshCookie(res, newRefresh);
        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        const hashed = hashToken(refreshToken);
        await prisma.refreshToken.updateMany({
            where: { tokenHash: hashed },
            data: { isRevoked: true }
        });
    }
    res.clearCookie('refreshToken');
    res.json({ success: true });
};

const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, login, refresh, logout, me };
