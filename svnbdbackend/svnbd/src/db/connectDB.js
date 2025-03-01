import mongoose from "mongoose";
import app from "../app.js";

const connectDB = async () => {
    console.log("\n");
    try {
        // Connect to the database
        let db = await mongoose.connect(process.env.MONGODB_URI_SVNBD, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`\nConnected to MongoDB || DB Host: ${db.connection.host}`);
        app.on("error", (err) => {
            console.error("MongoDB Application Error: ", err);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1); // Exit process with failure code
    }
};

export default connectDB;