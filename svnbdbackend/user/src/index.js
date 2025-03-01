import connectDB from "./db/connectDB.js";
import app from "./app.js";

const PORT = process.env.PORT || 8358;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\nUser Microservice running on port ${PORT} || [ http://localhost:${PORT} ]\n\n`);
  });
});