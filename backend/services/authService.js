const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
    static async register(userData) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            // Create user
            const user = new User({
                ...userData,
                password: hashedPassword
            });

            await user.save();

            // Generate token
            const token = this.generateToken(user);

            return {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            };
        } catch (error) {
            throw error;
        }
    }

    static async login(email, password) {
        try {
            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            // Generate token
            const token = this.generateToken(user);

            return {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            };
        } catch (error) {
            throw error;
        }
    }

    static generateToken(user) {
        return jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
    }

    static async verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

module.exports = AuthService;
