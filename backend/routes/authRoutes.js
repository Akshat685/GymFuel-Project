import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser); // Add this line for login

export default router;
