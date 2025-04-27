import { app } from './app.js';
import connectDB from './db/db-setup.js';
// import { connectRedis } from './db/db-setup.js';
import { connectRedis } from './db/db-redis.js';
import createError from 'http-errors';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

const startServer = async () => {
  try {
    await connectDB();       // MongoDB Connection
    await connectRedis();    // Redis Connection

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });

  } catch (error) {
    console.error('❌ Startup failure:', error.message);
    const startupError = createError(500, `Startup failed: ${error.message}`);
    console.error(startupError);
    process.exit(1);
  }
};

startServer();
