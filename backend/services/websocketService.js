const WebSocket = require('ws');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map();
        this.monitoringIntervals = new Map();
        
        this.setupWebSocketServer();
    }

    setupWebSocketServer() {
        this.wss.on('connection', (ws, req) => {
            console.log('New WebSocket connection');
            
            const clientId = this.generateClientId();
            this.clients.set(clientId, ws);
            
            ws.clientId = clientId;
            ws.isAlive = true;

            // Send welcome message
            ws.send(JSON.stringify({
                type: 'CONNECTION_ESTABLISHED',
                clientId,
                timestamp: new Date().toISOString()
            }));

            // Handle ping/pong for connection health
            ws.on('pong', () => {
                ws.isAlive = true;
            });

            // Handle incoming messages
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleMessage(ws, data);
                } catch (error) {
                    ws.send(JSON.stringify({ 
                        type: 'ERROR', 
                        message: 'Invalid message format' 
                    }));
                }
            });

            // Handle connection close
            ws.on('close', () => {
                console.log(`WebSocket connection closed: ${clientId}`);
                this.clients.delete(clientId);
                
                // Stop monitoring if active
                if (this.monitoringIntervals.has(clientId)) {
                    clearInterval(this.monitoringIntervals.get(clientId));
                    this.monitoringIntervals.delete(clientId);
                }
            });

            // Handle errors
            ws.on('error', (error) => {
                console.error(`WebSocket error for client ${clientId}:`, error);
                this.clients.delete(clientId);
            });
        });

        // Ping clients every 30 seconds
        setInterval(() => {
            this.pingClients();
        }, 30000);
    }

    handleMessage(ws, data) {
        switch (data.type) {
            case 'START_MONITORING':
                this.startMonitoring(ws, data);
                break;
            case 'STOP_MONITORING':
                this.stopMonitoring(ws);
                break;
            case 'PING':
                ws.send(JSON.stringify({ type: 'PONG' }));
                break;
            default:
                ws.send(JSON.stringify({ 
                    type: 'ERROR', 
                    message: 'Unknown message type' 
                }));
        }
    }

    startMonitoring(ws, data) {
        const clientId = ws.clientId;
        
        // Stop existing monitoring if any
        this.stopMonitoring(ws);
        
        // Start new monitoring
        const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                const mockContent = this.generateMockContent();
                const analysisResult = this.simulateAIAnalysis(mockContent);
                
                ws.send(JSON.stringify({
                    type: 'ANALYSIS_RESULT',
                    data: analysisResult
                }));
            }
        }, 3000);
        
        this.monitoringIntervals.set(clientId, interval);
        
        ws.send(JSON.stringify({
            type: 'MONITORING_STARTED',
            message: 'Real-time monitoring started'
        }));
    }

    stopMonitoring(ws) {
        const clientId = ws.clientId;
        
        if (this.monitoringIntervals.has(clientId)) {
            clearInterval(this.monitoringIntervals.get(clientId));
            this.monitoringIntervals.delete(clientId);
            
            ws.send(JSON.stringify({
                type: 'MONITORING_STOPPED',
                message: 'Real-time monitoring stopped'
            }));
        }
    }

    generateMockContent() {
        const mockContents = [
            "Breaking: New scientific study reveals important findings about climate change",
            "SHOCKING: This one weird trick doctors don't want you to know!",
            "Local weather forecast predicts sunny weekend ahead",
            "URGENT: Government conspiracy exposed by anonymous whistleblower",
            "University researchers publish peer-reviewed study on renewable energy",
            "Miracle cure discovered by local doctor - FDA doesn't want you to know!",
            "Stock market update: Tech companies show strong growth",
            "Celebrity scandal rocks social media with explosive allegations"
        ];

        return {
            content: mockContents[Math.floor(Math.random() * mockContents.length)],
            source: Math.random() > 0.5 ? 'Twitter' : 'Facebook',
            timestamp: new Date().toISOString(),
            id: Math.random().toString(36).substr(2, 9)
        };
    }

    simulateAIAnalysis(content) {
        const isLikelyMisinformation = content.content.includes('SHOCKING') || 
                                      content.content.includes('URGENT') ||
                                      content.content.includes('conspiracy') ||
                                      content.content.includes('Miracle') ||
                                      content.content.includes('doesn\'t want you to know');

        return {
            id: content.id,
            content: content.content,
            source: content.source,
            timestamp: content.timestamp,
            prediction: {
                classification: isLikelyMisinformation ? 'misinformation' : 'authentic',
                confidence: Math.random() * 0.3 + (isLikelyMisinformation ? 0.7 : 0.5),
                reasoning: isLikelyMisinformation ? 
                    'Content contains sensational language and unverified claims' :
                    'Content appears factual with credible source patterns'
            },
            features: {
                sourceCredibility: Math.random() * 0.5 + (isLikelyMisinformation ? 0.1 : 0.5),
                languagePatterns: isLikelyMisinformation ? 
                    ['sensational', 'emotional', 'clickbait'] : ['factual', 'neutral'],
                emotionalTone: isLikelyMisinformation ? 'highly emotional' : 'neutral'
            },
            metadata: {
                analyzedAt: new Date().toISOString(),
                processingTime: Math.random() * 2 + 0.5,
                modelVersion: 'BERT-v2.1'
            }
        };
    }

    pingClients() {
        this.clients.forEach((ws, clientId) => {
            if (ws.isAlive === false) {
                console.log(`Terminating dead connection: ${clientId}`);
                this.clients.delete(clientId);
                ws.terminate();
                return;
            }
            
            ws.isAlive = false;
            ws.ping();
        });
    }

    generateClientId() {
        return Math.random().toString(36).substr(2, 9);
    }

    broadcast(message) {
        this.clients.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
            }
        });
    }
}

module.exports = WebSocketService;
