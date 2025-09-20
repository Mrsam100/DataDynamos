// MisInfo Detector AI - Advanced Misinformation Detection Application
class MisInfoDetectorApp {
    constructor() {
        this.currentView = 'home';
        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.charts = {};
        this.initialized = false;
        this.sampleData = {
            sampleAnalyses: [
                {
                    id: "1",
                    content: "Breaking: Local authorities confirm new safety measures for downtown area following recent incidents.",
                    classification: "authentic",
                    confidence: 0.94,
                    source: "Local News Network",
                    timestamp: "2025-09-20T18:30:00Z",
                    features: {
                        sourceCredibility: 0.89,
                        languagePatterns: ["factual", "official"],
                        emotionalTone: "neutral"
                    }
                },
                {
                    id: "2", 
                    content: "SHOCKING: Scientists discover cure for aging that government doesn't want you to know!",
                    classification: "misinformation",
                    confidence: 0.97,
                    source: "Unknown Blog",
                    timestamp: "2025-09-20T15:45:00Z",
                    features: {
                        sourceCredibility: 0.12,
                        languagePatterns: ["sensational", "clickbait", "conspiracy"],
                        emotionalTone: "highly emotional"
                    }
                },
                {
                    id: "3",
                    content: "Weather forecast shows possible rain this weekend according to meteorological data.",
                    classification: "authentic", 
                    confidence: 0.91,
                    source: "Weather Service",
                    timestamp: "2025-09-20T12:15:00Z",
                    features: {
                        sourceCredibility: 0.95,
                        languagePatterns: ["factual", "scientific"],
                        emotionalTone: "neutral"
                    }
                }
            ],
            dashboardStats: {
                totalAnalyses: 12847,
                misinformationDetected: 3421,
                accuracyRate: 0.953,
                avgProcessingTime: 1.2,
                topSources: [
                    {name: "Reuters", credibility: 0.96, analyses: 234},
                    {name: "CNN", credibility: 0.87, analyses: 189},
                    {name: "Unknown Blogs", credibility: 0.23, analyses: 456}
                ]
            },
            trendsData: [
                {date: "2025-09-14", analyses: 234, misinformation: 67},
                {date: "2025-09-15", analyses: 189, misinformation: 45},
                {date: "2025-09-16", analyses: 298, misinformation: 89},
                {date: "2025-09-17", analyses: 267, misinformation: 71},
                {date: "2025-09-18", analyses: 312, misinformation: 94},
                {date: "2025-09-19", analyses: 276, misinformation: 82},
                {date: "2025-09-20", analyses: 298, misinformation: 76}
            ]
        };
    }

    init() {
        if (this.initialized) return;
        
        console.log('Initializing MisInfo Detector App...');
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
            return;
        }

        try {
            this.setupEventListeners();
            this.initializeStats();
            this.setupTabNavigation();
            this.setupAnalysisHandlers();
            this.setupRealtimeMonitoring();
            this.setupSettings();
            this.populateRecentAnalyses();
            this.startParticleAnimations();
            this.setup3DEffects();
            
            // Initialize charts after a short delay
            setTimeout(() => {
                this.initializeCharts();
            }, 500);
            
            this.initialized = true;
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation - use event delegation for better reliability
        document.addEventListener('click', (e) => {
            // Handle navigation links
            if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
                e.preventDefault();
                const link = e.target.matches('.nav-link') ? e.target : e.target.closest('.nav-link');
                const view = link.getAttribute('data-view');
                console.log('Navigation clicked:', view);
                if (view) {
                    this.switchView(view);
                }
                return;
            }
            
            // Handle CTA buttons
            if ((e.target.matches('[data-view]') || e.target.closest('[data-view]')) && 
                !e.target.matches('.nav-link') && !e.target.closest('.nav-link')) {
                e.preventDefault();
                const button = e.target.matches('[data-view]') ? e.target : e.target.closest('[data-view]');
                const view = button.getAttribute('data-view');
                console.log('CTA button clicked:', view);
                if (view) {
                    this.switchView(view);
                }
                return;
            }
            
            // Handle demo button
            if (e.target.matches('.demo-button') || e.target.closest('.demo-button')) {
                e.preventDefault();
                console.log('Demo button clicked');
                this.showDemo();
                return;
            }
            
            // Handle analyze buttons
            if (e.target.matches('.analyze-btn') || e.target.closest('.analyze-btn')) {
                e.preventDefault();
                console.log('Analyze button clicked');
                this.performAnalysis();
                return;
            }
            
            // Handle tab buttons
            if (e.target.matches('.tab-btn') || e.target.closest('.tab-btn')) {
                const btn = e.target.matches('.tab-btn') ? e.target : e.target.closest('.tab-btn');
                const tabName = btn.getAttribute('data-tab');
                console.log('Tab clicked:', tabName);
                this.switchTab(tabName);
                return;
            }
            
            // Handle monitoring toggle
            if (e.target.matches('#toggle-monitoring') || e.target.closest('#toggle-monitoring')) {
                console.log('Toggle monitoring clicked');
                if (this.isMonitoring) {
                    this.stopMonitoring();
                } else {
                    this.startMonitoring();
                }
                return;
            }
            
            // Handle file upload area
            if (e.target.matches('.file-upload-area') || e.target.closest('.file-upload-area')) {
                console.log('File upload area clicked');
                const fileInput = document.querySelector('.file-input');
                if (fileInput) fileInput.click();
                return;
            }
        });
        
        // File input change
        const fileInput = document.querySelector('.file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('File input changed');
                this.handleFileUpload(e);
            });
        }

        // Drag and drop
        const fileUploadArea = document.querySelector('.file-upload-area');
        if (fileUploadArea) {
            fileUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.style.background = 'var(--color-bg-1)';
            });

            fileUploadArea.addEventListener('dragleave', () => {
                fileUploadArea.style.background = '';
            });

            fileUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.style.background = '';
                console.log('Files dropped');
                this.handleFileUpload(e);
            });
        }
        
        console.log('Event listeners set up');
    }

    switchView(viewName) {
        console.log(`Switching to view: ${viewName} from ${this.currentView}`);
        
        try {
            // Update navigation active state
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-view') === viewName) {
                    link.classList.add('active');
                }
            });

            // Hide all views
            document.querySelectorAll('.view').forEach(view => {
                view.classList.remove('active');
                view.style.display = 'none';
            });
            
            // Show the target view
            const targetView = document.getElementById(`${viewName}-view`);
            if (targetView) {
                targetView.classList.add('active');
                targetView.style.display = 'block';
                console.log(`Successfully switched to ${viewName} view`);
            } else {
                console.error(`View not found: ${viewName}-view`);
                return;
            }

            this.currentView = viewName;

            // Initialize view-specific features
            setTimeout(() => {
                if (viewName === 'analytics') {
                    this.initializeCharts();
                }
                if (viewName === 'dashboard') {
                    this.populateRecentAnalyses();
                }
            }, 100);
            
        } catch (error) {
            console.error('Error switching view:', error);
        }
    }

    switchTab(tabName) {
        if (!tabName) return;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    initializeStats() {
        const stats = this.sampleData.dashboardStats;
        this.animateCounter('total-analyses', stats.totalAnalyses);
        this.animateCounter('accuracy-rate', stats.accuracyRate * 100, '%');
        this.animateCounter('detection-count', stats.misinformationDetected);
    }

    animateCounter(elementId, target, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix === '%') {
                element.textContent = `${current.toFixed(1)}${suffix}`;
            } else {
                element.textContent = `${Math.floor(current).toLocaleString()}${suffix}`;
            }
        }, 20);
    }

    setupTabNavigation() {
        console.log('Tab navigation handled by main event listener');
    }

    setupAnalysisHandlers() {
        console.log('Analysis handlers handled by main event listener');
    }

    async performAnalysis() {
        const resultsContainer = document.querySelector('.analysis-results');
        const activeTab = document.querySelector('.tab-content.active');
        const input = activeTab?.querySelector('.analysis-input');
        
        if (!input?.value.trim()) {
            alert('Please enter content to analyze');
            return;
        }

        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.style.display = 'block';
        }
        
        this.showAnalysisProgress();
        await this.sleep(3000);
        
        const sampleResult = this.sampleData.sampleAnalyses[
            Math.floor(Math.random() * this.sampleData.sampleAnalyses.length)
        ];
        
        this.displayAnalysisResults(sampleResult);
    }

    showAnalysisProgress() {
        const classificationBadge = document.querySelector('.classification-text');
        const confidenceText = document.querySelector('.confidence-text');
        const confidenceCircle = document.querySelector('.confidence-circle');
        
        if (classificationBadge) classificationBadge.textContent = 'Analyzing...';
        if (confidenceText) confidenceText.textContent = '...';
        if (confidenceCircle) {
            confidenceCircle.style.background = 'conic-gradient(var(--color-primary) 0deg, var(--color-border) 0deg)';
        }
        
        let progress = 0;
        const progressTimer = setInterval(() => {
            progress += 2;
            if (confidenceCircle) {
                confidenceCircle.style.background = `conic-gradient(var(--color-primary) ${progress * 3.6}deg, var(--color-border) ${progress * 3.6}deg)`;
            }
            if (progress >= 100) {
                clearInterval(progressTimer);
            }
        }, 60);
    }

    displayAnalysisResults(result) {
        const classificationBadge = document.querySelector('.classification-badge');
        const classificationText = document.querySelector('.classification-text');
        const confidenceText = document.querySelector('.confidence-text');
        const confidenceCircle = document.querySelector('.confidence-circle');
        const credibilityFill = document.querySelector('.credibility-fill');
        const patternsList = document.querySelector('.patterns-list');
        const toneIndicator = document.querySelector('.tone-indicator');
        
        if (classificationBadge && classificationText) {
            classificationBadge.className = `classification-badge ${result.classification}`;
            classificationText.textContent = result.classification === 'authentic' ? 'Authentic Content' : 'Potential Misinformation';
        }
        
        if (confidenceText && confidenceCircle) {
            const confidence = Math.round(result.confidence * 100);
            confidenceText.textContent = `${confidence}%`;
            
            const color = result.classification === 'authentic' ? 'var(--color-success)' : 'var(--color-error)';
            confidenceCircle.style.background = `conic-gradient(${color} ${confidence * 3.6}deg, var(--color-border) ${confidence * 3.6}deg)`;
        }
        
        if (credibilityFill) {
            credibilityFill.style.width = `${result.features.sourceCredibility * 100}%`;
        }
        
        if (patternsList) {
            patternsList.innerHTML = result.features.languagePatterns
                .map(pattern => `<span class="pattern-tag">${pattern}</span>`)
                .join('');
        }
        
        if (toneIndicator) {
            toneIndicator.textContent = result.features.emotionalTone;
            toneIndicator.className = `tone-indicator ${result.features.emotionalTone.replace(' ', '-')}`;
        }
    }

    setupRealtimeMonitoring() {
        console.log('Real-time monitoring handled by main event listener');
    }

    startMonitoring() {
        this.isMonitoring = true;
        const toggleBtn = document.getElementById('toggle-monitoring');
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.getElementById('feed-status-text');
        
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Monitoring';
            toggleBtn.classList.remove('btn--primary');
            toggleBtn.classList.add('btn--outline');
        }
        
        if (statusDot) statusDot.classList.add('active');
        if (statusText) statusText.textContent = 'Monitoring Active';
        
        this.monitoringInterval = setInterval(() => {
            this.addFeedItem();
        }, 3000);
        
        this.startPipelineAnimation();
    }

    stopMonitoring() {
        this.isMonitoring = false;
        const toggleBtn = document.getElementById('toggle-monitoring');
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.getElementById('feed-status-text');
        
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-play"></i> Start Monitoring';
            toggleBtn.classList.add('btn--primary');
            toggleBtn.classList.remove('btn--outline');
        }
        
        if (statusDot) statusDot.classList.remove('active');
        if (statusText) statusText.textContent = 'Monitoring Stopped';
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        this.stopPipelineAnimation();
    }

    addFeedItem() {
        const feedContent = document.getElementById('live-feed-content');
        if (!feedContent) return;
        
        const sampleContents = [
            "Breaking news update on local events...",
            "URGENT: Miracle cure discovered by doctors!",
            "Weather update for the weekend...", 
            "Celebrity scandal rocks the internet!",
            "Scientific study reveals new findings...",
            "You won't believe what happened next!"
        ];
        
        const sources = ['Twitter', 'Facebook', 'Instagram', 'News Site', 'Blog'];
        const content = sampleContents[Math.floor(Math.random() * sampleContents.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        
        const flagged = content.includes('URGENT') || content.includes('Miracle') || content.includes('won\'t believe');
        const confidence = flagged ? 0.85 + Math.random() * 0.1 : 0.1 + Math.random() * 0.2;
        
        const feedItem = document.createElement('div');
        feedItem.className = `feed-item ${flagged ? 'flagged' : ''}`;
        feedItem.innerHTML = `
            <div class="feed-item-content">
                <div class="feed-source">${source}</div>
                <div class="feed-text">${content}</div>
            </div>
            <div class="feed-status">
                ${flagged ? 
                    `<span class="status status--error">Flagged (${Math.round(confidence * 100)}%)</span>` :
                    `<span class="status status--success">Clear</span>`
                }
            </div>
        `;
        
        feedContent.insertBefore(feedItem, feedContent.firstChild);
        
        const items = feedContent.querySelectorAll('.feed-item');
        if (items.length > 10) {
            items[items.length - 1].remove();
        }
    }

    startPipelineAnimation() {
        document.querySelectorAll('.particle-flow').forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
        
        document.querySelectorAll('.stage-icon').forEach(icon => {
            icon.style.animationPlayState = 'running';
        });
    }

    stopPipelineAnimation() {
        document.querySelectorAll('.particle-flow').forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    }

    initializeCharts() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }
        
        this.createTrendsChart();
        this.createSourcesChart();
    }

    createTrendsChart() {
        const ctx = document.getElementById('trends-chart');
        if (!ctx) return;
        
        if (this.charts.trends) {
            this.charts.trends.destroy();
        }
        
        const data = this.sampleData.trendsData;
        
        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => new Date(d.date).toLocaleDateString()),
                datasets: [
                    {
                        label: 'Total Analyses',
                        data: data.map(d => d.analyses),
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Misinformation Detected',
                        data: data.map(d => d.misinformation),
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createSourcesChart() {
        const ctx = document.getElementById('sources-chart');
        if (!ctx) return;
        
        if (this.charts.sources) {
            this.charts.sources.destroy();
        }
        
        const data = this.sampleData.dashboardStats.topSources;
        
        this.charts.sources = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(s => s.name),
                datasets: [{
                    data: data.map(s => s.analyses),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    populateRecentAnalyses() {
        const container = document.getElementById('recent-analyses-list');
        if (!container) return;
        
        container.innerHTML = this.sampleData.sampleAnalyses.map(analysis => `
            <div class="analysis-item">
                <div class="analysis-header">
                    <span class="status status--${analysis.classification === 'authentic' ? 'success' : 'error'}">
                        ${analysis.classification === 'authentic' ? 'Authentic' : 'Misinformation'}
                    </span>
                    <span class="confidence">${Math.round(analysis.confidence * 100)}%</span>
                </div>
                <div class="analysis-content">
                    <p>${analysis.content.substring(0, 100)}${analysis.content.length > 100 ? '...' : ''}</p>
                    <div class="analysis-meta">
                        <span class="source">${analysis.source}</span>
                        <span class="timestamp">${new Date(analysis.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupSettings() {
        const enable3DEffects = document.getElementById('enable-3d-effects');
        if (enable3DEffects) {
            enable3DEffects.addEventListener('change', (e) => {
                document.body.classList.toggle('no-3d-effects', !e.target.checked);
            });
        }

        const enableParticles = document.getElementById('enable-particles');
        if (enableParticles) {
            enableParticles.addEventListener('change', (e) => {
                document.body.classList.toggle('no-particles', !e.target.checked);
            });
        }

        const reduceMotion = document.getElementById('reduce-motion');
        if (reduceMotion) {
            reduceMotion.addEventListener('change', (e) => {
                document.body.classList.toggle('reduce-motion', e.target.checked);
            });
        }

        const confidenceSlider = document.getElementById('confidence-threshold');
        const sliderValue = document.querySelector('.slider-value');
        if (confidenceSlider && sliderValue) {
            confidenceSlider.addEventListener('input', (e) => {
                sliderValue.textContent = e.target.value;
            });
        }
    }

    startParticleAnimations() {
        document.addEventListener('mousemove', (e) => {
            if (document.body.classList.contains('no-3d-effects')) return;
            
            const shapes = document.querySelectorAll('.floating-shape');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const xOffset = (mouseX - 0.5) * speed * 50;
                const yOffset = (mouseY - 0.5) * speed * 50;
                
                shape.style.transform = `translate(${xOffset}px, ${yOffset}px) rotateX(${xOffset * 0.1}deg) rotateY(${yOffset * 0.1}deg)`;
            });
        });
    }

    setup3DEffects() {
        document.querySelectorAll('.card, .analytics-card, .settings-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                if (document.body.classList.contains('no-3d-effects')) return;
                
                const rect = e.currentTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseMoveHandler = (moveEvent) => {
                    const mouseX = moveEvent.clientX - centerX;
                    const mouseY = moveEvent.clientY - centerY;
                    const rotateX = (mouseY / rect.height) * -10;
                    const rotateY = (mouseX / rect.width) * 10;
                    
                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                };
                
                e.currentTarget.addEventListener('mousemove', mouseMoveHandler);
            });
            
            card.addEventListener('mouseleave', (e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    showDemo() {
        const demoOverlay = document.createElement('div');
        demoOverlay.className = 'demo-overlay';
        demoOverlay.innerHTML = `
            <div class="demo-content">
                <div class="demo-header">
                    <h3>AI Detection Demo</h3>
                    <button class="demo-close">&times;</button>
                </div>
                <div class="demo-body">
                    <div class="demo-input">
                        <textarea class="form-control" placeholder="Try entering: 'SHOCKING: Scientists discover cure that doctors don't want you to know!'" rows="4">SHOCKING: Scientists discover cure that doctors don't want you to know!</textarea>
                        <button class="btn btn--primary demo-analyze">Analyze Demo Content</button>
                    </div>
                    <div class="demo-result hidden">
                        <div class="demo-classification">
                            <span class="status status--error">Potential Misinformation Detected</span>
                            <div class="demo-confidence">Confidence: 94%</div>
                        </div>
                        <div class="demo-details">
                            <p><strong>Detected Patterns:</strong></p>
                            <ul>
                                <li>Sensational language ("SHOCKING")</li>
                                <li>Conspiracy theory indicators</li>
                                <li>Emotional manipulation tactics</li>
                                <li>Lack of credible sources</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(demoOverlay);
        
        demoOverlay.querySelector('.demo-close').addEventListener('click', () => {
            demoOverlay.remove();
        });
        
        demoOverlay.querySelector('.demo-analyze').addEventListener('click', () => {
            const result = demoOverlay.querySelector('.demo-result');
            result.classList.remove('hidden');
        });
        
        demoOverlay.addEventListener('click', (e) => {
            if (e.target === demoOverlay) {
                demoOverlay.remove();
            }
        });
    }

    handleFileUpload(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const uploadArea = document.querySelector('.file-upload-area');
            
            if (uploadArea) {
                uploadArea.innerHTML = `
                    <i class="fas fa-file-check"></i>
                    <p>File selected: ${file.name}</p>
                    <small>Ready for analysis</small>
                `;
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    console.log('DOM ready, initializing app...');
    try {
        window.app = new MisInfoDetectorApp();
        window.app.init();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Additional CSS
const css = `
.demo-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7);
    display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(10px);
}
.demo-content {
    background: var(--color-surface); border-radius: var(--radius-lg); max-width: 600px; width: 90%;
    max-height: 80vh; overflow-y: auto; transform: perspective(1000px) rotateX(5deg);
    animation: demo-appear 0.3s ease-out; box-shadow: var(--shadow-lg);
}
@keyframes demo-appear {
    0% { opacity: 0; transform: perspective(1000px) rotateX(15deg) translateY(50px); }
    100% { opacity: 1; transform: perspective(1000px) rotateX(5deg) translateY(0); }
}
.demo-header { display: flex; justify-content: space-between; align-items: center; padding: var(--space-24); border-bottom: 1px solid var(--color-border); }
.demo-close { background: none; border: none; font-size: var(--font-size-2xl); cursor: pointer; color: var(--color-text-secondary); transition: color var(--duration-normal); padding: var(--space-4); }
.demo-close:hover { color: var(--color-error); transform: rotate(90deg); }
.demo-body { padding: var(--space-24); }
.demo-input { margin-bottom: var(--space-24); }
.demo-input textarea { margin-bottom: var(--space-16); }
.demo-analyze { width: 100%; }
.demo-result { background: var(--color-background); border-radius: var(--radius-base); padding: var(--space-20); animation: fade-in 0.5s ease-out; }
.demo-classification { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-16); flex-wrap: wrap; gap: var(--space-8); }
.demo-confidence { font-weight: var(--font-weight-bold); color: var(--color-error); }
.demo-details ul { margin: var(--space-8) 0; padding-left: var(--space-20); }
.demo-details li { margin-bottom: var(--space-4); color: var(--color-text-secondary); }
@keyframes fade-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
.pattern-tag { display: inline-block; background: var(--color-bg-2); color: var(--color-text); padding: var(--space-4) var(--space-8); border-radius: var(--radius-sm); font-size: var(--font-size-xs); margin-right: var(--space-4); margin-bottom: var(--space-4); }
.analysis-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-8); }
.confidence { font-weight: var(--font-weight-bold); color: var(--color-primary); }
.analysis-meta { display: flex; gap: var(--space-16); font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-8); }
.feed-item-content { flex: 1; }
.feed-source { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-4); font-weight: var(--font-weight-medium); }
.feed-text { font-size: var(--font-size-sm); }
.feed-status { margin-left: var(--space-16); }
.view { display: none; }
.view.active { display: block !important; }
.no-3d-effects .floating-shape, .no-3d-effects .card, .no-3d-effects .analytics-card, .no-3d-effects .settings-card, .no-3d-effects .tab-btn, .no-3d-effects .input-section { transform: none !important; }
.no-particles .particle { display: none; }
.reduce-motion * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
`;

const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

window.MisInfoDetectorApp = MisInfoDetectorApp;