import connectDB from "./db/connectDB.js";
import server from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.SVNBD_PORT || 8357;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\nSVNBD Microservice running on port ${PORT} || [ http://localhost:${PORT} ]\n\n`);
  });
});