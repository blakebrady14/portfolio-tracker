import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import holdingsRoutes from './routes/holdings';
import quoteRoutes from './routes/quote';
import { errorHandler } from './middleware/errorHandler';
import cacheService from './services/cacheService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/holdings', holdingsRoutes);
app.use('/api/quotes', quoteRoutes);

// Health check
app.get('/health', async (req, res) => {
  const cacheStats = await cacheService.getStats();
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cache: cacheStats
  });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
