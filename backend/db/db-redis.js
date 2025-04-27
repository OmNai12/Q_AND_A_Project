import { createClient } from 'redis';
import createError from 'http-errors';

let redisClient;

const connectRedis = async () => {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error', err);
        });

        await redisClient.connect();
        console.log(`✅ Redis Connected... ${process.env.REDIS_URL}`);

    } catch (error) {
        throw createError(500, `Redis connection error: ${error.message}`);
    }
};

export { connectRedis, redisClient };
