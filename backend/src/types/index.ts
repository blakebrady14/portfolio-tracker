export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Holding {
  id: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}

export interface ChartData {
  date: Date;
  price: number;
}

export interface Portfolio {
  holdings: (Holding & { currentPrice?: number; totalValue?: number })[];
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}
