import { Router } from 'express';
import Contact from '../models/Contact';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, message, budget } = req.body;

        if (!name || !phone || !email || !message || !budget) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newContact = new Contact({
            name,
            phone,
            email,
            message,
            budget
        });

        await newContact.save();

        res.status(201).json({ message: 'Contact message saved successfully', contact: newContact });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/contact (Protected)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/contact/:id (Protected)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH /api/contact/:id/status (Protected)
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'converted'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updatedContact = await Contact.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedContact) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        res.json(updatedContact);
    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
