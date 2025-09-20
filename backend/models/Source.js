const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    domain: {
        type: String,
        required: true
    },
    credibility: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
    },
    category: {
        type: String,
        enum: ['news', 'social', 'blog', 'academic', 'government', 'unknown'],
        default: 'unknown'
    },
    verified: {
        type: Boolean,
        default: false
    },
    lastAnalyzed: {
        type: Date,
        default: Date.now
    },
    analysisCount: {
        type: Number,
        default: 0
    },
    metadata: {
        description: String,
        country: String,
        language: String,
        bias: {
            type: String,
            enum: ['left', 'center', 'right', 'unknown'],
            default: 'unknown'
        }
    }
}, {
    timestamps: true
});

// Index for faster queries
sourceSchema.index({ credibility: -1 });
sourceSchema.index({ category: 1 });
sourceSchema.index({ domain: 1 });

module.exports = mongoose.model('Source', sourceSchema);
