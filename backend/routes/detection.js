const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Analysis = require('../models/Analysis');
const { analyzeContent, performDeepAnalysis } = require('../services/aiService');
const { validateAnalysisRequest } = require('../middleware/validation');

router.post('/analyze', validateAnalysisRequest, async (req, res) => {
    try {
        const { content, url, analysisType = 'quick' } = req.body;
        const startTime = Date.now();

        const contentHash = crypto.createHash('sha256').update(content).digest('hex');

        let analysisResult;
        if (analysisType === 'deep') {
            analysisResult = await performDeepAnalysis(content, url);
        } else {
            analysisResult = await analyzeContent(content, url);
        }

        const processingTime = Date.now() - startTime;

        const analysis = new Analysis({
            userId: req.user.id,
            content,
            contentHash,
            sourceUrl: url,
            analysisType,
            prediction: analysisResult.prediction,
            features: analysisResult.features,
            processingTime,
            status: 'completed'
        });

        await analysis.save();
        res.json(analysis);

    } catch (error) {
        res.status(500).json({ message: 'Analysis failed', error: error.message });
    }
});

module.exports = router;