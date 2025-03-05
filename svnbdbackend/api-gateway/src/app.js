import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import setupRoutes from './routes/index.js';
import http from 'http';

dotenv.config();

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 8355;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "17kb" }));
// Routes
setupRoutes(app);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`\n\nAPI Gateway running on port ${PORT} || [http://localhost:${PORT}]\n\n`);
});

export default app;