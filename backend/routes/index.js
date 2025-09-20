const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const detectionRoutes = require('./detection');
const analyticsRoutes = require('./analytics');
const realtimeRoutes = require('./realtime');

// Mount routes
router.use('/auth', authRoutes);
router.use('/detection', detectionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/realtime', realtimeRoutes);

module.exports = router;
