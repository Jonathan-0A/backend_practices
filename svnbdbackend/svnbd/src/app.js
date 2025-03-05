import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dataRouter from "./routes/data.route.js";
import http from "http";

dotenv.config();

const app = express();
// Allow multiple origins dynamically
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  "http://localhost:5173", 
  "https://5173-idx-svnbd-1740153114569.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev"
];

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "17kb" }));
// Routes
app.use("/data", dataRouter);

// Create HTTP server and listen on the specified port
const server = http.createServer(app);

export default server;