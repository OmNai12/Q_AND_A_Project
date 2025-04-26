import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['teacher', 'student'],
        default: 'student',
    },
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);