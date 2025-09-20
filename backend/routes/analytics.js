const express = require('express');
const router = express.Router();
const Analysis = require('../models/Analysis');

// Get analytics data
router.get('/dashboard', async (req, res) => {
    try {
        const totalAnalyses = await Analysis.countDocuments();
        const misinformationCount = await Analysis.countDocuments({ classification: 'misinformation' });
        const accuracyRate = totalAnalyses > 0 ? (totalAnalyses - misinformationCount) / totalAnalyses : 0;
        
        // Get recent analyses
        const recentAnalyses = await Analysis.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .select('content classification confidence source timestamp');
        
        // Get trend data (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const trendsData = await Analysis.aggregate([
            {
                $match: {
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                    },
                    totalAnalyses: { $sum: 1 },
                    misinformationCount: {
                        $sum: { $cond: [{ $eq: ["$classification", "misinformation"] }, 1, 0] }
                    }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);
        
        res.json({
            dashboardStats: {
                totalAnalyses,
                misinformationDetected: misinformationCount,
                accuracyRate,
                avgProcessingTime: 1.2,
                topSources: await getTopSources()
            },
            recentAnalyses,
            trendsData
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Error fetching analytics data' });
    }
});

// Get top sources by credibility
async function getTopSources() {
    try {
        const sources = await Analysis.aggregate([
            {
                $group: {
                    _id: "$source",
                    analyses: { $sum: 1 },
                    avgCredibility: { $avg: "$features.sourceCredibility" }
                }
            },
            {
                $sort: { avgCredibility: -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    name: "$_id",
                    credibility: "$avgCredibility",
                    analyses: 1,
                    _id: 0
                }
            }
        ]);
        
        return sources;
    } catch (error) {
        console.error('Error fetching top sources:', error);
        return [];
    }
}

module.exports = router;
