import express from 'express';
import proxy from 'express-http-proxy';
import dotenv from "dotenv";

dotenv.config();

const setupRoutes = (app) => {
    app.use('/api/svnbd', proxy(process.env.SVNBD_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl.replace('/api/svnbd', ''),
    }));
    app.use('/api/user', proxy(process.env.USER_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl.replace('/api/user', ''),
    }));
};

export default setupRoutes;