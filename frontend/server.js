const express = require('express');
const path = require('path');
const pino = require('pino');

// Initialize the structured JSON logger
const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    mixin() {
        return { service: 'frontend-server' };
    }
});

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Log initialization data safely
logger.info({ BACKEND_URL, PORT }, 'Initializing frontend server variables');

// Basic middleware to log incoming HTTP requests in a clean structure
app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Incoming request');
    next();
});

// Expose static files out of the public folder mapping routes automatically
app.use(express.static(path.join(__dirname, 'public')));

// Environment endpoint to allow the browser client to fetch backend routing details dynamically
app.get('/config', (req, res) => {
    res.json({ BACKEND_URL });
});

// Clean infrastructure health endpoint for load balancers and container health checks
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Explicit error tracking fallback middleware
app.use((err, req, res, next) => {
    logger.error({ error: err.message, stack: err.stack }, 'Unhandled frontend server exception');
    res.status(500).json({ error: 'Internal Server Error' });
});

// Bootstrap the web server engine
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Frontend application runtime live on port ${PORT}`);
});
