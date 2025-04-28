import createError from 'http-errors'; // For consistent HTTP errors
import { sendResponse } from '../utils/send-response.js'; // For standardized success responses
import { sendErrorResponse } from '../utils/send-error-response.js'; // For standardized error responses
import { logError } from '../utils/logger.js'; // For logging errors
import { Quiz } from '../models/quiz.model.js'; // Mongoose Quiz model
import { redisClient } from '../db/db-redis.js'; // Redis client for job queue

/**
 * @desc Create a new quiz with a PDF upload
 * @route POST /api/v1/quiz/create
 * @access Protected
 */
export const createQuiz = async (req, res) => {
    try {
        console.log('Creating quiz with file:', req.file);
        const teacherId = req.user.id; // Populated by isAuthenticated middleware
        const { quizName } = req.body;

        // Validate required fields
        if (!quizName) {
            throw createError(400, 'All fields (quizName) are required');
        }

        // Validate uploaded file
        if (!req.file) {
            throw createError(400, 'Quiz PDF file is required');
        }

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Save quiz along with uploaded PDF filename
        const createdQuiz = await Quiz.create({
            quizId: result,
            quizName,
            teacherId,
            fileName: req.file.filename, // Save filename
        });

        const jobPayload = {
            teacherId,
            quizId: result,
            quizName,
            fileName: req.file.filename, // Save filename
            status: 'pending',
            createdAt: Date.now()
        };

        await redisClient.lPush(process.env.REDIS_JOB_QUEUE, JSON.stringify(jobPayload));
        const queueLength = await redisClient.lLen(process.env.REDIS_JOB_QUEUE);

        sendResponse(res, {
            statusCode: 201,
            message: 'Quiz created successfully',
            data: {
                quizId: createdQuiz.quizId,
                quizName: createdQuiz.quizName,
                displayMessage: `Please wait till we generate the quiz. It will take 10 to 15 minutes. You can close this window and relax. You are at ${queueLength} in the queue.`,
            },
        });

    } catch (error) {
        logError(error);
        sendErrorResponse(res, {
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to create quiz',
        });
    }
};

/**
 * @desc Submit questions for a specific quiz
 * @route POST /api/v1/quiz/submit-questions
 * @access Protected
 */
export const submitQuizQuestion = async (req, res) => {
    try {
        const { quizId, quiz } = req.body;

        // Validate required fields
        if (!quizId) {
            throw createError(400, 'Quiz ID is required');
        }

        const quizSaved = await Quiz.findOne({ quizId });

        if (!quizSaved) {
            throw createError(404, 'Quiz not found');
        }

        // Validate quiz questions
        if (!Array.isArray(quiz) || quiz.length <= 1) {
            throw createError(400, 'Quiz must contain more than one question');
        }

        // Save the questions to the quiz
        quizSaved.quiz = quiz;
        await quizSaved.save();

        sendResponse(res, {
            statusCode: 200,
            message: 'Quiz questions submitted successfully',
            data: {
                quizId: quizSaved.quizId,
                quizName: quizSaved.quizName,
                displayMessage: 'Quiz is ready. You can now view the quiz.',
            },
        });

    } catch (error) {
        logError(error);
        sendErrorResponse(res, {
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to submit quiz questions',
        });
    }
};

/**
 * @desc View all quizzes created by the logged-in teacher
 * @route GET /api/v1/quiz/view
 * @access Protected
 */
export const viewQuiz = async (req, res) => {
    try {
        const teacherId = req.user.id; // Populated by isAuthenticated middleware

        // Find all quizzes by teacherId, selecting only necessary fields
        const allQuizByTeacherId = await Quiz.find({ teacherId }).select('quizId quizName quiz');

        // Process each quiz to add 'quizExists' field
        const processedQuizzes = allQuizByTeacherId.map((quiz) => {
            const hasQuizContent = Array.isArray(quiz.quiz) && quiz.quiz.length > 0;
            return {
                quizId: quiz.quizId,
                quizName: quiz.quizName,
                quizExists: hasQuizContent,
            };
        });

        sendResponse(res, {
            statusCode: 200,
            message: 'Quizzes fetched successfully',
            data: {
                quizzes: processedQuizzes,
            },
        });

    } catch (error) {
        logError(error);
        sendErrorResponse(res, {
            statusCode: 500,
            message: 'Failed to fetch quizzes',
        });
    }
};
