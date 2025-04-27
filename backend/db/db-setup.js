import mongoose from "mongoose";
import createError from "http-errors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected... ${conn.connection.host}`);
  } catch (error) {
    // Instead of console.error and process.exit:
    throw createError(500, `Database connection error: ${error.message}`);
  }
};

export default connectDB;
