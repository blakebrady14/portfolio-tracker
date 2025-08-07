import express from 'express';
import { quoteService } from '../services/quoteService';

const router = express.Router();

router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await quoteService.getQuote(symbol);
    res.json(quote);
  } catch (error) {
    res.status(404).json({ error: 'Quote not found' });
  }
});

router.get('/:symbol/chart', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1y' } = req.query;
    const chartData = await quoteService.getChartData(symbol, period as string);
    res.json(chartData);
  } catch (error) {
    res.status(404).json({ error: 'Chart data not found' });
  }
});

export default router;
