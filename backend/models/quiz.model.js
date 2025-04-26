import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    quizId: {
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
    fileName: {
        type: String,
        // required: true,
        // trim: true,
    },
    quiz: {
        type: Array,
        default: [],
        // required: true,
    },
},
    {
        timestamps: true,
    });
export const Quiz = mongoose.model("Quiz", quizSchema);