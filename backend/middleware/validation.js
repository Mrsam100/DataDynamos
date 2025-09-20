const joi = require('joi');

const validateAnalysisRequest = (req, res, next) => {
    const schema = joi.object({
        content: joi.string().required().min(10).max(10000),
        url: joi.string().uri().optional(),
        analysisType: joi.string().valid('quick', 'deep', 'real-time').optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            details: error.details[0].message
        });
    }

    next();
};

module.exports = {
    validateAnalysisRequest
};
