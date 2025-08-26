# Portfolio Tracker

A full-stack web application for tracking stock portfolios with real-time quotes, charts, and portfolio analytics.

## Features

- **User Authentication**: Secure registration and login system
- **Portfolio Management**: Add, edit, and delete stock holdings
- **Real-time Quotes**: Get current stock prices and market data
- **Interactive Charts**: Visualize stock price history
- **Portfolio Analytics**: Track gains/losses and portfolio performance
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **Prisma** ORM with **PostgreSQL**
- **JWT** authentication
- **Alpha Vantage API** for market data
- **Jest** for testing

### Frontend
- **Next.js** with **TypeScript**
- **React** for UI components
- **CSS** for styling
- **Canvas API** for charts
- **Jest** for testing

### DevOps
- **Docker** & **Docker Compose** for containerization
- **GitHub Actions** for CI/CD
- **Prisma** migrations for database schema management


## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Alpha Vantage API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-tracker.git
   cd portfolio-tracker
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Update .env with your database URL and API keys
   # See detailed setup instructions below
   
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Start development server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/health

### Using Docker

1. **Start all services with Docker Compose**
   ```bash
   cd docker
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Holdings
- `GET /api/holdings` - Get user's holdings
- `POST /api/holdings` - Create new holding
- `PUT /api/holdings/:id` - Update holding
- `DELETE /api/holdings/:id` - Delete holding

### Quotes
- `GET /api/quotes/:symbol` - Get current quote
- `GET /api/quotes/:symbol/chart` - Get historical chart data

## Environment Variables Setup

### Database Setup Options

#### Option 1: Docker PostgreSQL (Recommended)
1. **Start PostgreSQL with Docker:**
   ```bash
   cd docker
   docker-compose up -d postgres
   ```
   
2. **Use this DATABASE_URL:**
   ```env
   DATABASE_URL="postgresql://portfolio_user:portfolio_password@localhost:5432/portfolio_tracker"
   ```


#### Option 2: Local PostgreSQL
1. **Install PostgreSQL:**
   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   
   # Create database and user
   createdb portfolio_tracker
   ```

2. **Use local connection:**
   ```env
   DATABASE_URL="postgresql://your_username@localhost:5432/portfolio_tracker"
   ```

### JWT Secret
Generate a secure random string for JWT signing:

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Or use any secure random string (minimum 32 characters):
```env
JWT_SECRET="your-super-secure-random-string-change-this-in-production"
```

### Alpha Vantage API Key
1. **For development/testing:**
   ```env
   ALPHA_VANTAGE_API_KEY="demo"
   ```
   
2. **For production (free tier):**
   - Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Click "Get your free API key today"
   - Fill out the form (takes 1 minute)
   - Use the provided API key:
   ```env
   ALPHA_VANTAGE_API_KEY="YOUR_ACTUAL_API_KEY"
   ```

### Complete .env Example
```env
DATABASE_URL="postgresql://portfolio_user:portfolio_password@localhost:5432/portfolio_tracker"
JWT_SECRET="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
ALPHA_VANTAGE_API_KEY="demo"
NODE_ENV="development"
PORT=3001
```

## Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:watch
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:watch
```

## Deployment

### Production Build

1. **Backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

### Docker Production
```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Rate Limits

- Alpha Vantage API: 5 requests per minute (free tier)
- Consider upgrading for production use

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention with Prisma

## Performance Optimizations

- API response caching
- Database query optimization
- Image optimization (Next.js)
- Code splitting and lazy loading

## Monitoring & Logging

- Health check endpoints
- Error logging
- Performance monitoring
- Database connection pooling
