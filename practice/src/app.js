import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();

// Middleware setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "17kb" }));
app.use(express.urlencoded({ extended: true, limit: "15kb" }));
app.use(express.static("public"));

// Define routes
app.get("/", (req, res) => {
  res.status(200).json({
    data: {
      message: "Fetched URL '/' with method 'GET'",
      status: "success (200)",
    },
  });
})
app.use("/auth", authRouter)
app.use("/user", userRouter)

export { app };
