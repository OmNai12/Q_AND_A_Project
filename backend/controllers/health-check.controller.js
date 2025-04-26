import createError from 'http-errors';
import { sendResponse } from '../utils/send-response.js';
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
