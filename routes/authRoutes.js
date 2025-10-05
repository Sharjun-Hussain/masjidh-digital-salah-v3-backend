// routes/authRoutes.js
import express from 'express';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

// Define the POST route for login
router.post('/login', loginUser);

export default router;