import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { sendErrorResponse } from '../utils/send-error-response.js'; // Standardized error response

// Setup Uploads Folder
const uploadFolder = process.env.PDF_UPLOAD_PATH ||  `/home/omnai/Q_AND_A_Project/model_dev/file_loader/PDF_Store`;

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder); // Store PDFs inside /uploads/pdfs
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extname = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname); // e.g., pdfFile-1714091000123-123456789.pdf
    }
});

// Multer File Filter: Allow only PDF files
const fileFilter = (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf';
    if (isPdf) {
        cb(null, true); // Accept file
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF files are allowed!')); // Reject file
    }
};

// Multer Upload Instance
export const uploadPdf = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5 MB file size
});

// Multer Error Handler Middleware (Standardized Errors)
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors (invalid file type, size limit exceeded, etc.)
        return sendErrorResponse(res, {
            statusCode: 400,
            message: err.message || 'File upload error',
        });
    }
    next(err); // Forward non-Multer errors
};
