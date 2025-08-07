import Redis from 'ioredis';

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  lazyConnect: true
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (error: any) => {
  console.error('❌ Redis connection error:', error);
});

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

export const cacheService = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      
      if (options.ttl) {
        await redis.setex(key, options.ttl, serialized);
      } else {
        await redis.set(key, serialized);
      }
      
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  /**
   * Delete from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key);
      return result > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },

  /**
   * Cache stock prices with smart TTL
   */
  async cacheStockPrice(symbol: string, price: number, ttl: number = 300): Promise<void> {
    const key = `stock:${symbol}:price`;
    await this.set(key, { price, timestamp: new Date() }, { ttl });
  },

  /**
   * Get cached stock price
   */
  async getCachedStockPrice(symbol: string): Promise<{ price: number; timestamp: Date } | null> {
    const key = `stock:${symbol}:price`;
    return await this.get(key);
  },

  /**
   * Cache user portfolio summary
   */
  async cachePortfolioSummary(userId: string, summary: any, ttl: number = 300): Promise<void> {
    const key = `portfolio:${userId}:summary`;
    await this.set(key, summary, { ttl });
  },

  /**
   * Get cached portfolio summary
   */
  async getCachedPortfolioSummary(userId: string): Promise<any | null> {
    const key = `portfolio:${userId}:summary`;
    return await this.get(key);
  },

  /**
   * Invalidate user cache
   */
  async invalidateUserCache(userId: string): Promise<void> {
    try {
      const keys = await redis.keys(`*:${userId}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  },

  /**
   * Get cache health/stats
   */
  async getStats(): Promise<{ connected: boolean; keyCount: number }> {
    try {
      const keyCount = await redis.dbsize();
      return { connected: true, keyCount };
    } catch (error) {
      return { connected: false, keyCount: 0 };
    }
  }
};

export default cacheService;
