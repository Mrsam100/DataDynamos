const { analyzeContent } = require('./backend/services/aiService');

async function testGeminiIntegration() {
    console.log('🧪 Testing Gemini 2.0 Flash Integration...\n');
    
    const testCases = [
        {
            name: "Misinformation Test",
            content: "SHOCKING: Scientists discover miracle cure that doctors don't want you to know! This secret treatment can cure any disease in just 3 days!"
        },
        {
            name: "Authentic Content Test", 
            content: "The weather forecast shows sunny skies for the weekend with temperatures reaching 25°C. Local authorities have confirmed all safety measures are in place."
        },
        {
            name: "Conspiracy Theory Test",
            content: "URGENT: Government conspiracy exposed! Anonymous whistleblower reveals shocking truth about COVID-19 vaccines that mainstream media won't tell you!"
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n📝 Testing: ${testCase.name}`);
        console.log(`Content: "${testCase.content}"`);
        console.log('⏳ Analyzing...\n');
        
        try {
            const result = await analyzeContent(testCase.content);
            
            console.log('✅ Analysis Complete:');
            console.log(`   Classification: ${result.prediction.classification}`);
            console.log(`   Confidence: ${(result.prediction.confidence * 100).toFixed(1)}%`);
            console.log(`   Model: ${result.prediction.modelVersion}`);
            console.log(`   Reasoning: ${result.prediction.reasoning}`);
            console.log(`   Language Patterns: ${result.features.languagePatterns.join(', ')}`);
            console.log(`   Emotional Tone: ${result.features.emotionalTone}`);
            console.log(`   Processing Time: ${result.metadata.processingTime}s`);
            console.log(`   API Used: ${result.metadata.apiUsed}`);
            
            if (result.features.riskFactors && result.features.riskFactors.length > 0) {
                console.log(`   Risk Factors: ${result.features.riskFactors.join(', ')}`);
            }
            
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
        
        console.log('\n' + '='.repeat(80));
    }
    
    console.log('\n🎉 Gemini 2.0 Flash Integration Test Complete!');
}

// Run the test
testGeminiIntegration().catch(console.error);
