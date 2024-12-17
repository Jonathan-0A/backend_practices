import mongoose from "mongoose";
import express from "express";

const app = express();

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\nConnected to MongoDB || DB Host: ${connectionInstance.connection.host}`);

    // Handle global app-level errors
    app.on("error", (err) => {
      console.error("\nMongoDB Application Error: ", err);
    });
  } catch (err) {
    console.error("\nFailed to connect to MongoDB:", err.message);
    process.exit(1); // Exit process with failure code
  }
};

export default connectDB;
