# Create comprehensive backend implementation files for the AI misinformation detection system

# 1. Main server.js file
server_js = '''const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth');
const detectionRoutes = require('./routes/detection');
const analyticsRoutes = require('./routes/analytics');
const realtimeRoutes = require('./routes/realtime');

// Import models
const User = require('./models/User');
const Analysis = require('./models/Analysis');
const Source = require('./models/Source');

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/misinfodetector', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/detection', authenticateToken, detectionRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/realtime', authenticateToken, realtimeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// WebSocket server for real-time updates
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            // Handle real-time analysis requests
            handleRealtimeAnalysis(ws, data);
        } catch (error) {
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

// Real-time analysis handler
const handleRealtimeAnalysis = async (ws, data) => {
    if (data.type === 'START_MONITORING') {
        // Simulate real-time content monitoring
        const interval = setInterval(() => {
            const mockContent = generateMockContent();
            const analysisResult = simulateAIAnalysis(mockContent);
            
            ws.send(JSON.stringify({
                type: 'ANALYSIS_RESULT',
                data: analysisResult
            }));
        }, 3000);

        ws.monitoringInterval = interval;
    } else if (data.type === 'STOP_MONITORING') {
        if (ws.monitoringInterval) {
            clearInterval(ws.monitoringInterval);
            ws.monitoringInterval = null;
        }
    }
};

// Mock content generator for demo
const generateMockContent = () => {
    const mockContents = [
        "Breaking: New scientific study reveals important findings about climate change",
        "SHOCKING: This one weird trick doctors don't want you to know!",
        "Local weather forecast predicts sunny weekend ahead",
        "URGENT: Government conspiracy exposed by anonymous whistleblower",
        "University researchers publish peer-reviewed study on renewable energy"
    ];
    
    return {
        content: mockContents[Math.floor(Math.random() * mockContents.length)],
        source: Math.random() > 0.5 ? 'Twitter' : 'Facebook',
        timestamp: new Date().toISOString()
    };
};

// Simulate AI analysis for demo
const simulateAIAnalysis = (content) => {
    const isLikelyMisinformation = content.content.includes('SHOCKING') || 
                                  content.content.includes('URGENT') ||
                                  content.content.includes('conspiracy');
    
    return {
        id: Math.random().toString(36).substr(2, 9),
        content: content.content,
        prediction: {
            classification: isLikelyMisinformation ? 'misinformation' : 'authentic',
            confidence: Math.random() * 0.3 + (isLikelyMisinformation ? 0.7 : 0.5),
            reasoning: isLikelyMisinformation ? 
                'Content contains sensational language and unverified claims' :
                'Content appears factual with credible source patterns'
        },
        features: {
            sourceCredibility: Math.random() * 0.5 + (isLikelyMisinformation ? 0.1 : 0.5),
            languagePatterns: isLikelyMisinformation ? 
                ['sensational', 'emotional'] : ['factual', 'neutral'],
            emotionalTone: isLikelyMisinformation ? 'highly emotional' : 'neutral'
        },
        metadata: {
            analyzedAt: new Date().toISOString(),
            processingTime: Math.random() * 2 + 0.5,
            modelVersion: 'BERT-v2.1'
        }
    };
};

module.exports = app;
'''

# 2. Package.json
package_json = '''{
  "name": "ai-misinformation-detector-backend",
  "version": "1.0.0",
  "description": "Advanced AI-powered misinformation detection system backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint .",
    "docker:build": "docker build -t misinfodetector-api .",
    "docker:run": "docker run -p 5000:5000 misinfodetector-api"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "ws": "^8.14.2",
    "dotenv": "^16.3.1",
    "joi": "^17.9.2",
    "multer": "^1.4.5-lts.1",
    "redis": "^4.6.8",
    "axios": "^1.5.0",
    "@tensorflow/tfjs-node": "^4.10.0",
    "natural": "^6.4.0",
    "sentiment": "^5.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.4",
    "supertest": "^6.3.3",
    "eslint": "^8.48.0"
  },
  "keywords": [
    "ai",
    "misinformation",
    "detection",
    "nlp",
    "machine-learning"
  ],
  "author": "MisInfo Detector Team",
  "license": "MIT"
}'''

# 3. User model
user_model = '''const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'analyst'],
        default: 'user'
    },
    preferences: {
        notifications: {
            type: Boolean,
            default: true
        },
        analysisType: {
            type: String,
            enum: ['quick', 'deep', 'real-time'],
            default: 'quick'
        },
        dashboardLayout: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    usageStats: {
        totalAnalyses: {
            type: Number,
            default: 0
        },
        lastLogin: {
            type: Date,
            default: Date.now
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Update updatedAt before saving
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);
'''

# 4. Analysis model
analysis_model = '''const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentHash: {
        type: String,
        required: true,
        index: true
    },
    sourceUrl: {
        type: String,
        default: null
    },
    analysisType: {
        type: String,
        enum: ['quick', 'deep', 'real-time'],
        default: 'quick'
    },
    prediction: {
        classification: {
            type: String,
            enum: ['authentic', 'misinformation', 'suspicious', 'satire'],
            required: true
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            required: true
        },
        reasoning: {
            type: String,
            required: true
        },
        modelVersion: {
            type: String,
            required: true
        }
    },
    features: {
        sourceCredibility: {
            type: Number,
            min: 0,
            max: 1
        },
        languagePatterns: [{
            type: String
        }],
        factualClaims: [{
            claim: String,
            verified: Boolean,
            sources: [String]
        }],
        emotionalTone: {
            type: String,
            enum: ['neutral', 'positive', 'negative', 'highly emotional']
        },
        linguisticFeatures: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    verification: {
        crossReferences: [{
            type: String
        }],
        sourcesChecked: [{
            type: String
        }],
        factCheckResults: [{
            source: String,
            result: String,
            confidence: Number
        }]
    },
    processingTime: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for better query performance
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ contentHash: 1 });
analysisSchema.index({ 'prediction.classification': 1 });
analysisSchema.index({ sourceUrl: 1 });
analysisSchema.index({ status: 1 });

// Update updatedAt before saving
analysisSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Analysis', analysisSchema);
'''

# 5. Detection routes
detection_routes = '''const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Analysis = require('../models/Analysis');
const { analyzeContent, performDeepAnalysis } = require('../services/aiService');
const { validateAnalysisRequest } = require('../middleware/validation');

// Analyze single content
router.post('/analyze', validateAnalysisRequest, async (req, res) => {
    try {
        const { content, url, analysisType = 'quick' } = req.body;
        const startTime = Date.now();

        // Create content hash for deduplication
        const contentHash = crypto.createHash('sha256')
            .update(content)
            .digest('hex');

        // Check if this content was already analyzed recently
        const existingAnalysis = await Analysis.findOne({
            contentHash,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours
        }).sort({ createdAt: -1 });

        if (existingAnalysis) {
            return res.json({
                ...existingAnalysis.toObject(),
                fromCache: true
            });
        }

        // Perform AI analysis
        let analysisResult;
        if (analysisType === 'deep') {
            analysisResult = await performDeepAnalysis(content, url);
        } else {
            analysisResult = await analyzeContent(content, url);
        }

        const processingTime = Date.now() - startTime;

        // Save analysis to database
        const analysis = new Analysis({
            userId: req.user.id,
            content,
            contentHash,
            sourceUrl: url,
            analysisType,
            prediction: analysisResult.prediction,
            features: analysisResult.features,
            verification: analysisResult.verification,
            processingTime,
            status: 'completed'
        });

        await analysis.save();

        // Update user usage stats
        await Analysis.updateOne(
            { _id: req.user.id },
            { $inc: { 'usageStats.totalAnalyses': 1 } }
        );

        res.json(analysis);

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            message: 'Analysis failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Batch analysis
router.post('/batch', async (req, res) => {
    try {
        const { contents } = req.body;

        if (!Array.isArray(contents) || contents.length === 0) {
            return res.status(400).json({ message: 'Contents array is required' });
        }

        if (contents.length > 50) {
            return res.status(400).json({ message: 'Maximum 50 items per batch' });
        }

        const results = [];
        const startTime = Date.now();

        for (const item of contents) {
            try {
                const contentHash = crypto.createHash('sha256')
                    .update(item.content)
                    .digest('hex');

                const analysisResult = await analyzeContent(item.content, item.source);

                const analysis = new Analysis({
                    userId: req.user.id,
                    content: item.content,
                    contentHash,
                    sourceUrl: item.source,
                    analysisType: 'quick',
                    prediction: analysisResult.prediction,
                    features: analysisResult.features,
                    verification: analysisResult.verification,
                    processingTime: 0, // Will be updated below
                    status: 'completed'
                });

                await analysis.save();
                results.push({
                    id: item.id,
                    analysis: analysis.toObject()
                });

            } catch (error) {
                results.push({
                    id: item.id,
                    error: error.message
                });
            }
        }

        const totalProcessingTime = Date.now() - startTime;

        res.json({
            results,
            summary: {
                total: contents.length,
                successful: results.filter(r => !r.error).length,
                failed: results.filter(r => r.error).length,
                processingTime: totalProcessingTime
            }
        });

    } catch (error) {
        console.error('Batch analysis error:', error);
        res.status(500).json({
            message: 'Batch analysis failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get analysis history
router.get('/history', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = { userId: req.user.id };

        // Add classification filter if provided
        if (req.query.classification) {
            filter['prediction.classification'] = req.query.classification;
        }

        // Add date range filter if provided
        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) {
                filter.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filter.createdAt.$lte = new Date(req.query.endDate);
            }
        }

        const analyses = await Analysis.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Analysis.countDocuments(filter);

        res.json({
            analyses,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({
            message: 'Failed to fetch analysis history',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get single analysis
router.get('/:id', async (req, res) => {
    try {
        const analysis = await Analysis.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        res.json(analysis);

    } catch (error) {
        console.error('Analysis fetch error:', error);
        res.status(500).json({
            message: 'Failed to fetch analysis',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
'''

# Save all files
files_to_create = {
    'server.js': server_js,
    'package.json': package_json,
    'models/User.js': user_model,
    'models/Analysis.js': analysis_model,
    'routes/detection.js': detection_routes
}

for filename, content in files_to_create.items():
    with open(filename, 'w') as f:
        f.write(content)

print("Backend files created successfully!")
print("\nCreated files:")
for filename in files_to_create.keys():
    print(f"  - {filename}")

print("\nNext steps:")
print("1. npm install (to install dependencies)")
print("2. Set up environment variables (.env file)")
print("3. Configure MongoDB connection")
print("4. npm run dev (to start development server)")