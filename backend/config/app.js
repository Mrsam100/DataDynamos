const path = require('path');
require('dotenv').config();

const config = {
    // Server configuration
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    
    // Database configuration
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/misinfodetector',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    
    // Redis configuration
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        options: {
            retry_strategy: (options) => {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    return new Error('Redis server connection refused');
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    return new Error('Retry time exhausted');
                }
                if (options.attempt > 10) {
                    return undefined;
                }
                return Math.min(options.attempt * 100, 3000);
            }
        }
    },
    
    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    
    // CORS configuration
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    },
    
    // Rate limiting configuration
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        analysisWindowMs: 1 * 60 * 1000, // 1 minute
        analysisMax: 10, // limit each IP to 10 analysis requests per minute
        authWindowMs: 15 * 60 * 1000, // 15 minutes
        authMax: 5 // limit each IP to 5 auth requests per 15 minutes
    },
    
    // File upload configuration
    upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['.pdf', '.doc', '.docx', '.txt'],
        uploadPath: path.join(__dirname, '../uploads')
    },
    
    // AI/ML configuration
    ai: {
        modelVersion: process.env.AI_MODEL_VERSION || 'Gemini-2.0-Flash',
        confidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD) || 0.8,
        processingTimeout: parseInt(process.env.PROCESSING_TIMEOUT) || 30000,
        geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyBOWgesX0RJvb2pXV8SMSJhmezxNko8QQo'
    },
    
    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined'
    },
    
    // Security configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
        sessionSecret: process.env.SESSION_SECRET || 'session_secret',
        cookieMaxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

module.exports = config;
