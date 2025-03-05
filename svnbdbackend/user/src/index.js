import connectDB from "./db/connectDB.js";
import server from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.USER_PORT || 8359;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\nUser Microservice running on port ${PORT} || [ http://localhost:${PORT} ]\n\n`);
  });
});