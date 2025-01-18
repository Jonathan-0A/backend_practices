import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dataRouter from "./routes/data.route.js";

const app = express();

//Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json({limit: "17kb"}));
app.use(express.urlencoded({extended: true, limit: "17kb"}));
app.use(express.static("public"));

//Routes
app.get("/", (req, res) => {
    res.status(200).json({
        data: {
            message: "Fetched URL '/' with method 'GET'",
            status: "success (200)",
        },
    });
});
app.use("/data", dataRouter);

export default app;