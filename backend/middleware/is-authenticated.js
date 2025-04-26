import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '../utils/send-error-response.js';

/**
 * @desc Middleware to check if the user is authenticated
 * @access Protected
 */
const isAuthenticated = async (req, res, next) => {
  try {    
    // Retrieve token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    // If no token found, return Unauthorized
    if (!token) {
      return sendErrorResponse(res, {
        statusCode: 401,
        message: 'Unauthorized: No token provided',
      });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object for downstream middlewares/routes
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role // Include role if you're storing it in the token
    };

    next(); // Pass control to next middleware or route handler

  } catch (error) {
    // More specific error handling
    if (error.name === 'JsonWebTokenError') {
      return sendErrorResponse(res, {
        statusCode: 401,
        message: 'Unauthorized: Invalid token',
      });
    } else if (error.name === 'TokenExpiredError') {
      return sendErrorResponse(res, {
        statusCode: 401,
        message: 'Unauthorized: Token expired',
      });
    } else {
      return sendErrorResponse(res, {
        statusCode: 401,
        message: 'Unauthorized: Authentication failed',
      });
    }
  }
};

export default isAuthenticated;