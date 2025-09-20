const mongoose = require('mongoose');
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

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
