import express from 'express';
import { healthCheck, healthCheckRedis } from '../controllers/health-check.controller.js';

const router = express.Router();

// Healthcheck route
router.route('/').get(healthCheck);
// Healthcheck Redis route
router.route('/redis').get(healthCheckRedis);

export default router;