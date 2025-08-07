import { prisma } from '../db';
import { Holding } from '../types';

export const holdingsService = {
  async getUserHoldings(userId: string): Promise<Holding[]> {
    const holdings = await prisma.holding.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Convert Decimal types to numbers for the interface
    return holdings.map((holding: any) => ({
      ...holding,
      shares: Number(holding.shares),
      avgPrice: Number(holding.avgPrice),
    }));
  },

  async createHolding(userId: string, symbol: string, shares: number, avgPrice: number): Promise<Holding> {
    const holding = await prisma.holding.create({
      data: {
        userId,
        symbol: symbol.toUpperCase(),
        shares,
        avgPrice,
      },
    });

    // Convert Decimal types to numbers for the interface
    return {
      ...holding,
      shares: Number(holding.shares),
      avgPrice: Number(holding.avgPrice),
    };
  },

  async updateHolding(id: string, userId: string, shares: number, avgPrice: number): Promise<Holding> {
    const holding = await prisma.holding.update({
      where: { id, userId },
      data: { shares, avgPrice },
    });

    // Convert Decimal types to numbers for the interface
    return {
      ...holding,
      shares: Number(holding.shares),
      avgPrice: Number(holding.avgPrice),
    };
  },

  async deleteHolding(id: string, userId: string): Promise<void> {
    await prisma.holding.delete({
      where: { id, userId },
    });
  },
};
