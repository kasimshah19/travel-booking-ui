const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all destinations
router.get('/', async (req, res) => {
    try {
        const destinations = await prisma.destination.findMany();
        const mapped = destinations.map(d => ({
            ...d,
            image: d.imagePath,
            country: "India", // fallback
            rating: 4.8 // fallback
        }));
        res.json(mapped);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch destinations' });
    }
});

// Get a single destination by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await prisma.destination.findUnique({
            where: { id }
        });
        if (!destination) return res.status(404).json({ error: 'Destination not found' });

        res.json({
            ...destination,
            image: destination.imagePath,
            country: "India",
            rating: 4.8
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch destination' });
    }
});

module.exports = router;
