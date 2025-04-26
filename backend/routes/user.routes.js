import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controller.js';
import isAuthenticated from '../middleware/is-authenticated.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.get('/profile', isAuthenticated, getUserProfile);

export default router;