import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    quizId:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    quizName: {
        type: String,
        required: true,
        trim: true,
    },
    teacherId: {
        type: String,
        required: true,
        trim: true,
    },
    filePath: {
        type: String,
        // required: true,
        // trim: true,
    },
    quiz:{
        type: Array,
        // required: true,
    },
});