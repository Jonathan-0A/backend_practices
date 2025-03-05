import mongoose from "mongoose";
import app from "../app.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  console.log("\n");
  try {
    // Connect to MongoDB
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI_USERS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`\nConnected to MongoDB || DB Host: ${connectionInstance.connection.host}`);

    // Handle global app-level errors
    app.on("error", (err) => {
      console.error("\nMongoDB Application Error: ", err);
    });
  } catch (err) {
    console.error("\nFailed to connect to MongoDB(users):", err.message);
    process.exit(1); // Exit process with failure code
  }
};

export default connectDB;