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

        const { userId, message } = req.body;
        if (!userId || !message) {
            return next(createError(400, 'User ID and message are required'));
        }

        const jobPayload = {
            userId,
            message,
            status: 'pending',
            createdAt: Date.now()
        };

        const redisStatus = await redisClient.ping();
        await redisClient.lPush('health_check_job', JSON.stringify(jobPayload));
        const queueLength = await redisClient.lLen('pdf_jobs');


        sendResponse(res, {
            statusCode: 200,
            message: 'Redis health check passed',
            data: {
                redisStatus,
                message: 'Job added to queue',
                jobPayload,
                queueLength: `Your job has been added to the queue. Current queue length is ${queueLength}.`,
            },
        });
    } catch (error) {
        next(createError(500, 'Redis health check failed'));
    }
}