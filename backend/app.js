import express from 'express';
import cors from 'cors';
import CORS_OPTIONS from './configs/cors-setup.js';
import cookieParser from 'cookie-parser';

// Connfigure of the express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    res.status(statusCode).json({
        status,
        message: err.message || 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});



/** API ROUTES WILL BE DECLARED */
import healthcheckRoutes from './routes/health-check.route.js';
import userRoutes from './routes/user.routes.js';
import quizRoutes from './routes/quiz.routes.js';

// Healthcheck route
app.use('/api/v1/healthcheck', healthcheckRoutes);
// User routes
app.use('/api/v1/user', userRoutes);
// Quiz routes
app.use('/api/v1/quiz', quizRoutes);
/** API ROUTES WILL BE DECLARED */


export { app };