import axios from 'axios';
import cacheService from './cacheService';
import { Quote, ChartData } from '../types';

export const quoteService = {
  async getQuote(symbol: string): Promise<Quote> {
    const cacheKey = `quote:${symbol}`;
    const cached = await cacheService.get<Quote>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Using Alpha Vantage API as an example
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      );

      const data = response.data['Global Quote'];
      const quote: Quote = {
        symbol,
        price: parseFloat(data['05. price']),
        change: parseFloat(data['09. change']),
        changePercent: parseFloat(data['10. change percent'].replace('%', '')),
        lastUpdated: new Date(),
      };

      await cacheService.set(cacheKey, quote, { ttl: 300 }); // Cache for 5 minutes
      return quote;
    } catch (error) {
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
  },

  async getChartData(symbol: string, period: string): Promise<ChartData[]> {
    const cacheKey = `chart:${symbol}:${period}`;
    const cached = await cacheService.get<ChartData[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Using Alpha Vantage API for historical data
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      );

      const timeSeries = response.data['Time Series (Daily)'];
      const chartData: ChartData[] = Object.entries(timeSeries)
        .slice(0, period === '1y' ? 252 : 30) // 1 year or 1 month
        .map(([date, data]: [string, any]) => ({
          date: new Date(date),
          price: parseFloat(data['4. close']),
        }))
        .reverse();

      await cacheService.set(cacheKey, chartData, { ttl: 3600 }); // Cache for 1 hour
      return chartData;
    } catch (error) {
      throw new Error(`Failed to fetch chart data for ${symbol}`);
    }
  },
};
