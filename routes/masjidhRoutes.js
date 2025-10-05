// routes/masjidRoutes.js
import express from 'express';
import { supabase } from '../config/supabaseClient.js';
import { verifyRole } from '../middleware/authMiddleware.js'; // Your role-checking middleware

const router = express.Router();

// Route to create a new Masjid. Only a 'super_admin' can do this.
// The verifyRole middleware will handle security.
router.post('/', verifyRole('super_admin'), async (req, res) => {
    const { name, address } = req.body;

    // Insert the new Masjid into the 'masjids' table
    const { data, error } = await supabase
        .from('masjids')
        .insert([{ name, address }])
        .select();

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.status(201).json({ message: 'Masjid created successfully', masjid: data[0] });
});

export default router;