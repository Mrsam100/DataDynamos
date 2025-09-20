# AI Misinformation Detector

Advanced AI-powered misinformation detection system with real-time monitoring capabilities.

## Project Structure

```
ai-misinformation-detector/
├── backend/                    # Node.js backend API
│   ├── models/                 # Database models
│   │   ├── User.js            # User model
│   │   ├── Analysis.js        # Analysis model
│   │   ├── Source.js          # Source model
│   │   └── index.js           # Model exports
│   ├── routes/                # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── detection.js       # Detection API routes
│   │   ├── analytics.js       # Analytics routes
│   │   ├── realtime.js        # WebSocket routes
│   │   └── index.js           # Route exports
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # Authentication middleware
│   │   ├── validation.js      # Input validation
│   │   ├── rateLimit.js       # Rate limiting
│   │   └── errorHandler.js    # Error handling
│   ├── services/              # Business logic
│   │   ├── aiService.js       # AI/ML processing
│   │   ├── authService.js     # Authentication logic
│   │   ├── analyticsService.js # Analytics processing
│   │   └── websocketService.js # WebSocket logic
│   ├── config/                # Configuration
│   │   ├── database.js        # Database config
│   │   ├── redis.js           # Redis config
│   │   └── app.js             # App configuration
│   ├── tests/                 # Test files
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── Dockerfile             # Backend container
└── frontend/                  # React.js frontend application
    ├── public/                # Static assets
    │   ├── index.html         # Main HTML template
    │   ├── favicon.ico        # App icon
    │   └── manifest.json      # PWA manifest
    ├── src/                   # Source code
    │   ├── components/        # Reusable components
    │   │   ├── common/        # Generic components
    │   │   ├── charts/        # Chart components
    │   │   ├── forms/         # Form components
    │   │   └── layout/        # Layout components
    │   ├── pages/             # Page components
    │   │   ├── Dashboard/     # Dashboard page
    │   │   ├── Analytics/     # Analytics page
    │   │   ├── Realtime/      # Real-time monitoring
    │   │   └── Settings/      # Settings page
    │   ├── hooks/             # Custom React hooks
    │   ├── services/          # API services
    │   ├── store/             # Redux store
    │   ├── utils/             # Utility functions
    │   ├── styles/            # Global styles
    │   ├── App.js             # Main App component
    │   └── package.json       # Dependencies
    ├── server.js              # Frontend server
    ├── package.json           # Frontend dependencies
    └── Dockerfile             # Frontend container
```

## Features

- **Real-time Analysis**: Monitor live content streams for misinformation
- **Advanced AI Detection**: Multiple ML models for accurate classification
- **Analytics Dashboard**: Comprehensive insights and trend analysis
- **User Authentication**: Secure user management system
- **WebSocket Support**: Real-time updates and notifications
- **Responsive Design**: Modern, mobile-friendly interface

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- Redis (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-misinformation-detector
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Backend (.env in backend directory)
MONGODB_URI=mongodb://localhost:27017/misinfodetector
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000

# Frontend (.env in frontend directory)
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

## Available Scripts

### Root Level
- `npm run install:all` - Install dependencies for all projects
- `npm start` - Start both frontend and backend in production mode
- `npm run dev` - Start both frontend and backend in development mode
- `npm test` - Run tests for both frontend and backend
- `npm run lint` - Run linting for both projects

### Backend Only
- `cd backend && npm start` - Start backend server
- `cd backend && npm run dev` - Start backend with nodemon
- `cd backend && npm test` - Run backend tests

### Frontend Only
- `cd frontend && npm start` - Start frontend server
- `cd frontend && npm run dev` - Start frontend with nodemon
- `cd frontend && npm run serve` - Serve static files

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Detection
- `POST /api/detection/analyze` - Analyze text content
- `POST /api/detection/analyze-url` - Analyze URL content
- `POST /api/detection/analyze-document` - Analyze document

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/trends` - Get trend data
- `GET /api/analytics/sources` - Get source statistics

### Real-time
- `WebSocket /ws` - Real-time monitoring connection
- `POST /api/realtime/start-monitoring` - Start monitoring
- `POST /api/realtime/stop-monitoring` - Stop monitoring

## Docker Support

### Backend
```bash
cd backend
docker build -t misinfodetector-backend .
docker run -p 5000:5000 misinfodetector-backend
```

### Frontend
```bash
cd frontend
docker build -t misinfodetector-frontend .
docker run -p 3000:3000 misinfodetector-frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
