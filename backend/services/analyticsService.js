const Analysis = require('../models/Analysis');
const Source = require('../models/Source');

class AnalyticsService {
    static async getDashboardStats() {
        try {
            const totalAnalyses = await Analysis.countDocuments();
            const misinformationCount = await Analysis.countDocuments({ 
                classification: 'misinformation' 
            });
            const accuracyRate = totalAnalyses > 0 ? 
                (totalAnalyses - misinformationCount) / totalAnalyses : 0;

            // Get processing time statistics
            const processingStats = await Analysis.aggregate([
                {
                    $group: {
                        _id: null,
                        avgProcessingTime: { $avg: '$metadata.processingTime' },
                        minProcessingTime: { $min: '$metadata.processingTime' },
                        maxProcessingTime: { $max: '$metadata.processingTime' }
                    }
                }
            ]);

            return {
                totalAnalyses,
                misinformationDetected: misinformationCount,
                accuracyRate: Math.round(accuracyRate * 100) / 100,
                avgProcessingTime: processingStats[0]?.avgProcessingTime || 1.2,
                processingStats: processingStats[0] || {}
            };
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            throw error;
        }
    }

    static async getTrendsData(days = 7) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const trendsData = await Analysis.aggregate([
                {
                    $match: {
                        timestamp: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                        },
                        analyses: { $sum: 1 },
                        misinformation: {
                            $sum: { $cond: [{ $eq: ["$classification", "misinformation"] }, 1, 0] }
                        }
                    }
                },
                {
                    $sort: { "_id": 1 }
                }
            ]);

            return trendsData.map(item => ({
                date: item._id,
                analyses: item.analyses,
                misinformation: item.misinformation
            }));
        } catch (error) {
            console.error('Error getting trends data:', error);
            throw error;
        }
    }

    static async getTopSources(limit = 5) {
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
                    $limit: limit
                },
                {
                    $project: {
                        name: "$_id",
                        credibility: { $round: ["$avgCredibility", 2] },
                        analyses: 1,
                        _id: 0
                    }
                }
            ]);

            return sources;
        } catch (error) {
            console.error('Error getting top sources:', error);
            throw error;
        }
    }

    static async getRecentAnalyses(limit = 10) {
        try {
            const analyses = await Analysis.find()
                .sort({ timestamp: -1 })
                .limit(limit)
                .select('content classification confidence source timestamp features')
                .lean();

            return analyses;
        } catch (error) {
            console.error('Error getting recent analyses:', error);
            throw error;
        }
    }

    static async getClassificationBreakdown() {
        try {
            const breakdown = await Analysis.aggregate([
                {
                    $group: {
                        _id: "$classification",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        classification: "$_id",
                        count: 1,
                        percentage: {
                            $round: [
                                { $multiply: [{ $divide: ["$count", { $sum: "$count" }] }, 100] },
                                1
                            ]
                        }
                    }
                }
            ]);

            return breakdown;
        } catch (error) {
            console.error('Error getting classification breakdown:', error);
            throw error;
        }
    }
}

module.exports = AnalyticsService;
