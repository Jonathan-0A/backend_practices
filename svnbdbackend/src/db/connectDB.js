// import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import app from "../app.js";

// const connectDB = async () => {
//     try {
//         const client = new MongoClient(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             socketTimeoutMS: 30000, // 30 seconds
//             serverSelectionTimeoutMS: 30000,
//         });
//         // Connect to MongoDB
//         await client.connect();
//         // Get the database instance (change "mydatabase" to your database name)
//         const db = client.db("svnbd");
//         console.log(`\nConnected to MongoDB || DB Name: ${db.databaseName}`);
//         // Handle application-level errors
//         app.on("error", (err) => {
//             console.error("\nMongoDB Application Error: ", err);
//         });
//         // Export the database instance if needed elsewhere
//         app.locals.db = db;
//     } catch (err) {
//         console.error("\nFailed to connect to MongoDB:", err.message);
//         process.exit(1); // Exit process with failure code
//     }
// };


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\nConnected to MongoDB || DB Host: ${connectionInstance.connection.host}`);
        app.on("error", (err) => {
            console.error("\nMongoDB Application Error: ", err);
        });
    } catch (err) {
        console.error("\nFailed to connect to MongoDB:", err.message);
        process.exit(1); // Exit process with failure code
    }
}

export default connectDB;
