const mongoose = require('mongoose');

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
    sourceUrl: String,
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
        reasoning: String,
        modelVersion: String
    },
    features: {
        sourceCredibility: Number,
        languagePatterns: [String],
        emotionalTone: String
    },
    processingTime: Number,
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Analysis', analysisSchema);
