import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import setupRoutes from './routes/index.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "17kb" }));

// Routes
setupRoutes(app);

const PORT = process.env.PORT || 8355;

app.listen(PORT, () => {
    console.log(`\n\nAPI Gateway running on port ${PORT} || [http://localhost:${PORT}]\n\n`);
});

export default app;