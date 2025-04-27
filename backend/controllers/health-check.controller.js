import createError from 'http-errors';
import { sendResponse } from '../utils/send-response.js';
import { redisClient } from '../db/db-redis.js';

export const healthCheck = async (req, res, next) => {
    try {
        sendResponse(res, {
            statusCode: 200,
            message: 'Health check passed',
            data: {
                uptime: process.uptime(),
                message: 'Service is healthy',
            },
        });
    } catch (error) {
        next(createError(500, 'Health check failed'));
    }
};

export const healthCheckRedis = async (req, res, next) => {
    try {
        const redisStatus = await redisClient.ping();
        sendResponse(res, {
            statusCode: 200,
            message: 'Redis health check passed',
            data: {
                redisStatus,
            },
        });
    } catch (error) {
        next(createError(500, 'Redis health check failed'));
    }
}