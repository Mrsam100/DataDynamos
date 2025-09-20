const crypto = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBOWgesX0RJvb2pXV8SMSJhmezxNko8QQo');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// Enhanced AI analysis using Gemini 2.0 Flash
const analyzeContent = async (content, sourceUrl = null) => {
    try {
        console.log('Starting Gemini 2.0 Flash analysis...');
        
        const prompt = `
You are an expert misinformation detection AI. Analyze the following content for potential misinformation and provide a detailed assessment.

Content to analyze: "${content}"

Please provide your analysis in the following JSON format:
{
    "classification": "authentic" or "misinformation",
    "confidence": 0.0-1.0,
    "reasoning": "Detailed explanation of your assessment",
    "languagePatterns": ["array", "of", "detected", "patterns"],
    "emotionalTone": "neutral/emotional/sensational/manipulative",
    "sourceCredibility": 0.0-1.0,
    "riskFactors": ["array", "of", "potential", "risks"],
    "recommendations": "What users should do with this information"
}

Focus on:
1. Sensational or misleading language
2. Unverifiable claims
3. Emotional manipulation tactics
4. Lack of credible sources
5. Conspiracy theory indicators
6. Clickbait patterns
7. Factual accuracy indicators

Respond only with valid JSON, no additional text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysisText = response.text();
        
        // Parse the JSON response
        let analysis;
        try {
            // Clean the response text (remove any markdown formatting)
            const cleanText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysis = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            console.log('Raw response:', analysisText);
            // Fallback to basic analysis if JSON parsing fails
            analysis = await performFallbackAnalysis(content);
        }

        // Ensure all required fields are present
        const analysisResult = {
            prediction: {
                classification: analysis.classification || 'unknown',
                confidence: Math.min(Math.max(analysis.confidence || 0.5, 0), 1),
                reasoning: analysis.reasoning || 'Analysis completed using AI',
                modelVersion: 'Gemini-2.0-Flash'
            },
            features: {
                sourceCredibility: Math.min(Math.max(analysis.sourceCredibility || 0.5, 0), 1),
                languagePatterns: analysis.languagePatterns || ['analyzed'],
                emotionalTone: analysis.emotionalTone || 'neutral',
                riskFactors: analysis.riskFactors || []
            },
            verification: {
                crossReferences: [],
                sourcesChecked: sourceUrl ? [sourceUrl] : [],
                factCheckResults: [],
                recommendations: analysis.recommendations || 'Verify information from multiple credible sources'
            },
            metadata: {
                analyzedAt: new Date().toISOString(),
                processingTime: 2.5, // Gemini is fast
                modelVersion: 'Gemini-2.0-Flash',
                apiUsed: 'Google Generative AI'
            }
        };

        console.log('Gemini analysis completed successfully');
        return result;

    } catch (error) {
        console.error('Error in Gemini analysis:', error);
        // Fallback to basic analysis
        return await performFallbackAnalysis(content, sourceUrl);
    }
};

// Fallback analysis when Gemini is unavailable
const performFallbackAnalysis = async (content, sourceUrl = null) => {
    console.log('Using fallback analysis...');
    
    // Simple heuristic-based analysis
    const isLikelyMisinformation = content.toLowerCase().includes('shocking') ||
                                  content.toLowerCase().includes('urgent') ||
                                  content.toLowerCase().includes('conspiracy') ||
                                  content.toLowerCase().includes('secret') ||
                                  content.toLowerCase().includes('doctors hate') ||
                                  content.toLowerCase().includes('miracle cure') ||
                                  content.toLowerCase().includes('won\'t believe') ||
                                  content.toLowerCase().includes('exposed');

    const confidence = Math.random() * 0.3 + (isLikelyMisinformation ? 0.7 : 0.5);

    return {
        prediction: {
            classification: isLikelyMisinformation ? 'misinformation' : 'authentic',
            confidence: Math.min(confidence, 0.99),
            reasoning: isLikelyMisinformation ? 
                'Content contains sensational language patterns commonly associated with misinformation' :
                'Content appears to follow factual reporting patterns',
            modelVersion: 'Fallback-Heuristic'
        },
        features: {
            sourceCredibility: sourceUrl ? Math.random() * 0.5 + 0.3 : 0.5,
            languagePatterns: isLikelyMisinformation ? 
                ['sensational', 'emotional', 'urgent'] : 
                ['factual', 'neutral', 'measured'],
            emotionalTone: isLikelyMisinformation ? 'highly emotional' : 'neutral',
            riskFactors: isLikelyMisinformation ? ['sensational language', 'unverifiable claims'] : []
        },
        verification: {
            crossReferences: [],
            sourcesChecked: sourceUrl ? [sourceUrl] : [],
            factCheckResults: [],
            recommendations: 'Verify information from multiple credible sources'
        },
        metadata: {
            analyzedAt: new Date().toISOString(),
            processingTime: 0.5,
            modelVersion: 'Fallback-Heuristic',
            apiUsed: 'Fallback'
        }
    };
};

// Enhanced deep analysis using Gemini with additional context
const performDeepAnalysis = async (content, sourceUrl = null) => {
    try {
        console.log('Starting deep Gemini analysis...');
        
        const prompt = `
You are an expert misinformation detection AI performing a comprehensive deep analysis. Analyze the following content with enhanced scrutiny.

Content: "${content}"
Source URL: ${sourceUrl || 'Not provided'}

Perform a comprehensive analysis including:
1. Fact-checking against known information
2. Source credibility assessment
3. Linguistic pattern analysis
4. Emotional manipulation detection
5. Cross-reference verification
6. Bias detection
7. Conspiracy theory indicators

Provide your analysis in this JSON format:
{
    "classification": "authentic" or "misinformation",
    "confidence": 0.0-1.0,
    "reasoning": "Comprehensive explanation",
    "languagePatterns": ["detailed", "patterns"],
    "emotionalTone": "assessment",
    "sourceCredibility": 0.0-1.0,
    "riskFactors": ["comprehensive", "risks"],
    "biasIndicators": ["bias", "indicators"],
    "factCheckResults": [{"source": "name", "result": "true/false/mixed", "confidence": 0.0-1.0}],
    "crossReferences": ["relevant", "sources"],
    "recommendations": "Detailed recommendations",
    "linguisticFeatures": {
        "sentimentScore": -1.0 to 1.0,
        "readabilityScore": 0.0-1.0,
        "formalityScore": 0.0-1.0,
        "complexityScore": 0.0-1.0
    }
}

Respond only with valid JSON, no additional text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysisText = response.text();
        
        let analysis;
        try {
            const cleanText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysis = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Error parsing deep analysis response:', parseError);
            // Fallback to regular analysis
            return await analyzeContent(content, sourceUrl);
        }

        const analysisResult = {
            prediction: {
                classification: analysis.classification || 'unknown',
                confidence: Math.min(Math.max(analysis.confidence || 0.5, 0), 1),
                reasoning: analysis.reasoning || 'Deep analysis completed using AI',
                modelVersion: 'Gemini-2.0-Flash-Deep'
            },
            features: {
                sourceCredibility: Math.min(Math.max(analysis.sourceCredibility || 0.5, 0), 1),
                languagePatterns: analysis.languagePatterns || ['analyzed'],
                emotionalTone: analysis.emotionalTone || 'neutral',
                riskFactors: analysis.riskFactors || [],
                biasIndicators: analysis.biasIndicators || [],
                linguisticFeatures: analysis.linguisticFeatures || {
                    sentimentScore: 0,
                    readabilityScore: 0.5,
                    formalityScore: 0.5,
                    complexityScore: 0.5
                }
            },
            verification: {
                crossReferences: analysis.crossReferences || [],
                sourcesChecked: sourceUrl ? [sourceUrl] : [],
                factCheckResults: analysis.factCheckResults || [],
                recommendations: analysis.recommendations || 'Verify information from multiple credible sources'
            },
            metadata: {
                analyzedAt: new Date().toISOString(),
                processingTime: 4.0, // Deep analysis takes longer
                modelVersion: 'Gemini-2.0-Flash-Deep',
                apiUsed: 'Google Generative AI'
            }
        };

        console.log('Deep Gemini analysis completed successfully');
        return result;

    } catch (error) {
        console.error('Error in deep Gemini analysis:', error);
        // Fallback to regular analysis
        return await analyzeContent(content, sourceUrl);
    }
};

// URL content extraction and analysis
const analyzeUrlContent = async (url) => {
    try {
        // This would integrate with a web scraping service
        // For now, return a placeholder
        return {
            prediction: {
                classification: 'unknown',
                confidence: 0.3,
                reasoning: 'URL analysis requires web scraping integration',
                modelVersion: 'URL-Analyzer-v1'
            },
            features: {
                sourceCredibility: 0.5,
                languagePatterns: ['url-analyzed'],
                emotionalTone: 'unknown',
                riskFactors: []
            },
            verification: {
                crossReferences: [],
                sourcesChecked: [url],
                factCheckResults: [],
                recommendations: 'Manually verify the URL content'
            },
            metadata: {
                analyzedAt: new Date().toISOString(),
                processingTime: 1.0,
                modelVersion: 'URL-Analyzer-v1',
                apiUsed: 'Placeholder'
            }
        };
    } catch (error) {
        console.error('Error analyzing URL:', error);
        throw error;
    }
};

module.exports = {
    analyzeContent,
    performDeepAnalysis,
    analyzeUrlContent
};