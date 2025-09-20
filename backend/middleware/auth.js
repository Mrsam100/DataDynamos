const jwt = require('jsonwebtoken');

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

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

const requirePremium = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
        next();
    } else {
        res.status(403).json({ message: 'Premium access required' });
    }
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requirePremium
};
