import express from 'express';
import { healthCheck } from '../controllers/health-check.controller.js';

const router = express.Router();

// Healthcheck route
router.route('/').get(healthCheck);

export default router;