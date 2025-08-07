const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ token: string; userId: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string) {
    return this.request<{ message: string; userId: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Holdings methods
  async getHoldings() {
    return this.request<any[]>('/holdings');
  }

  async createHolding(data: { symbol: string; shares: number; avgPrice: number }) {
    return this.request<any>('/holdings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHolding(id: string, data: { shares: number; avgPrice: number }) {
    return this.request<any>(`/holdings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHolding(id: string) {
    return this.request<void>(`/holdings/${id}`, {
      method: 'DELETE',
    });
  }

  // Quote methods
  async getQuote(symbol: string) {
    return this.request<{
      symbol: string;
      price: number;
      change: number;
      changePercent: number;
      lastUpdated: string;
    }>(`/quotes/${symbol}`);
  }

  async getChartData(symbol: string, period: string = '1y') {
    return this.request<{
      date: string;
      price: number;
    }[]>(`/quotes/${symbol}/chart?period=${period}`);
  }
}

export const api = new ApiService();
