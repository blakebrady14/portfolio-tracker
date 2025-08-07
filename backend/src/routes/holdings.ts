import express, { Request, Response, NextFunction } from 'express';
import { holdingsService } from '../services/holdingsService';
import { authMiddleware } from '../middleware/authMiddleware';
import { AuthRequest } from '../types/auth';

const router = express.Router();

router.use(authMiddleware as any);

router.get('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const holdings = await holdingsService.getUserHoldings(authReq.userId);
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch holdings' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { symbol, shares, avgPrice } = req.body;
    const holding = await holdingsService.createHolding(authReq.userId, symbol, shares, avgPrice);
    res.status(201).json(holding);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create holding' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const { shares, avgPrice } = req.body;
    const holding = await holdingsService.updateHolding(id, authReq.userId, shares, avgPrice);
    res.json(holding);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update holding' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    await holdingsService.deleteHolding(id, authReq.userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete holding' });
  }
});

export default router;
