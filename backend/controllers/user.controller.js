// Import necessary modules
import createError from 'http-errors'; // To create consistent HTTP errors
import { sendResponse } from '../utils/send-response.js'; // Utility to send formatted success responses
import { sendErrorResponse } from '../utils/send-error-response.js'; // Utility to send formatted error responses
import { User } from '../models/user.model.js'; // Mongoose User model
import bcrypt from 'bcryptjs'; // For hashing passwords
import { logError } from '../utils/logger.js'; // Utility to log errors
import jwt from 'jsonwebtoken'; // For creating JWT tokens

/**
 * @desc Register a new user
 * @route POST /api/v1/user/register
 * @access Public
 */
export const registerUser = async (req, res) => {
    try {
        // Extract user details from request body
        const { email, password } = req.body;

        // Check if all required fields are present
        if (!email || !password) {
            throw createError(400, 'All fields (email, password, role) are required');
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw createError(400, 'Invalid email format');
        }

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const conflictField = existingUser.email === email ? 'Email' : 'Username';
            throw createError(400, `${conflictField} already registered`);
        }

        // Extend password with environment variables (extra security layer)
        const extendedPassword = `${process.env.PASSWORD_EXTENDER_PREFIX}${password}${process.env.PASSWORD_EXTENDER_SUFFIX}`;

        // Hash the extended password using bcrypt
        const hashedPassword = await bcrypt.hash(extendedPassword, 12); // 12 salt rounds = stronger security

        // Create new user instance
        const newUser = new User({
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Send success response back
        sendResponse(res, {
            statusCode: 201,
            message: 'User registered successfully',
            data: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            },
        });

    } catch (error) {
        // Log the error properly for debugging
        logError(error);

        // Send standardized error response
        sendErrorResponse(res, {
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to register user',
        });
    }
};

/**
 * @desc Login an existing user
 * @route POST /api/v1/user/login
 * @access Public
 */
export const loginUser = async (req, res) => {
    try {
        // Extract credentials from request body
        const { email, password, role } = req.body;

        // Validate input fields
        if (!email || !password || !role) {
            throw createError(400, 'Email and password are required');
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(400, 'Invalid email or password');
        }

        // Compare input password with hashed password in database
        const extendedPassword = `${process.env.PASSWORD_EXTENDER_PREFIX}${password}${process.env.PASSWORD_EXTENDER_SUFFIX}`;
        const isPasswordCorrect = await bcrypt.compare(extendedPassword, user.password);

        if (!isPasswordCorrect) {
            throw createError(400, 'Invalid password');
        }


        // Ensure role matches expected role
        if (user.role !== role.toLowerCase()) {
            throw createError(403, 'Role mismatch');
        }

        // Generate JWT token storing user ID
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET
        );

        // Set JWT token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            // secure: true, // Uncomment if want secure cookies (HTTPS only)
            sameSite: 'Strict', // Protects against CSRF
            maxAge: Number(process.env.MAX_AGE) || 86400000  // Cookie expiry 
        });

        // Send success response with token and user info
        sendResponse(res, {
            statusCode: 200,
            message: 'Logged in successfully',
            data: {
                user: {
                    role: user.role
                }
            }
        });

    } catch (error) {
        // Log error for debugging purposes
        logError(error);

        // Send structured error response
        sendErrorResponse(res, {
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to login user'
        });
    }
};

/**
 * @desc Get the authenticated user's profile
 * @route GET /api/profile
 * @access Protected (Requires isAuthenticated middleware)
 */
export const getUserProfile = async (req, res) => {
    try {
        // req.user is populated by isAuthenticated middleware
        const userId = req.user.id;

        // Fetch user data from database (excluding sensitive fields like password)
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return sendErrorResponse(res, {
                statusCode: 404,
                message: 'User not found',
            });
        }

        // Send user profile data
        sendResponse(res, {
            statusCode: 200,
            message: 'User profile fetched successfully',
            data: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        // Log and send server error
        logError(error);
        sendErrorResponse(res, {
            statusCode: 500,
            message: 'Failed to fetch user profile',
        });
    }
};