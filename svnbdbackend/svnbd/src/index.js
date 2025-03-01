import connectDB from "./db/connectDB.js";
import app from "./app.js";

const PORT = process.env.PORT || 8357;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\nSVNBD Microservice running on port ${PORT} || [ http://localhost:${PORT} ]\n\n`);
  });
});