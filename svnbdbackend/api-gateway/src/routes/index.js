import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const setupRoutes = (app) => {
    app.use('/api/svnbd', createProxyMiddleware({
        target: 'http://localhost:8357',
        changeOrigin: true,
    }));
    app.use('/api/user', createProxyMiddleware({
        target: 'http://localhost:8359',
        changeOrigin: true,
    }));
};

export default setupRoutes;