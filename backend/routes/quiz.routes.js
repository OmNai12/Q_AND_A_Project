import express from 'express';
import { uploadPdf, handleMulterError } from '../middleware/pdf-uploads.js';
import { createQuiz, submitQuizQuestion, viewQuiz, viewQuizById } from '../controllers/quiz.controller.js';
import isAuthenticated from '../middleware/is-authenticated.js';


const router = express.Router();

// Create Quiz route
router.post(
    '/create',
    isAuthenticated,                    // 1. Check valid token
    uploadPdf.single('pdfFile'),        // 2. Upload the PDF file
    handleMulterError,                  // 3. Handle multer errors
    createQuiz                          // 4. Save quiz + file name
);

// Submit quiz questions
router.put('/submit', submitQuizQuestion);

// View quiz
router.get('/view-all-quiz', isAuthenticated, viewQuiz);

// View quiz by ID
router.get('/view-quiz/:quizId', viewQuizById);

export default router;