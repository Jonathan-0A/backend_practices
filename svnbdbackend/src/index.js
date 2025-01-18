import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT} || [ http://localhost:${PORT} ]`);
        });
    }).catch((err) => {
        console.error(err);
        process.exit(1); // Exit process with failure code
    })