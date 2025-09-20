const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import configurations
const config = require('./config/app');
const connectDB = require('./config/database');
const redisClient = require('./config/redis');

// Import middleware
const { generalLimiter, analysisLimiter, authLimiter } = require('./middleware/rateLimit');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

// Import routes
const routes = require('./routes');

// Import services
const WebSocketService = require('./services/websocketService');

const app = express();

// Initialize database connections
connectDB();
redisClient.connect();

// Middleware
app.use(helmet());
app.use(cors(config.cors));

// Rate limiting
app.use('/api/', generalLimiter);
app.use('/api/detection', analysisLimiter);
app.use('/api/auth', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
});

// Initialize WebSocket service
const wsService = new WebSocketService(server);

module.exports = app;
