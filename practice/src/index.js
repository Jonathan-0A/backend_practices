import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3131;

// Connect to the database
connectDB()
  .then(() => {
    // Start the app
    app.listen(PORT, () => {
      console.log(`\nServer is running on PORT: ${PORT} ||  [ http://localhost:${PORT} ]`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
