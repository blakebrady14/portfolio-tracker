import React, { useState, useEffect } from 'react';
import { HoldingCard } from '../components/HoldingCard';
import { HoldingForm } from '../components/HoldingForm';
import { PriceChart } from '../components/PriceChart';
import { api } from '../services/api';
import { useAuth } from '../services/auth';

interface Holding {
  id: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice?: number;
  totalValue?: number;
}

interface ChartData {
  date: Date;
  price: number;
}

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadHoldings();
    }
  }, [user]);

  const loadHoldings = async () => {
    try {
      setLoading(true);
      const data = await api.getHoldings();
      
      // Fetch current prices for each holding
      const holdingsWithPrices = await Promise.all(
        data.map(async (holding: Holding) => {
          try {
            const quote = await api.getQuote(holding.symbol);
            return {
              ...holding,
              currentPrice: quote.price,
              totalValue: quote.price * holding.shares
            };
          } catch (error) {
            return holding;
          }
        })
      );
      
      setHoldings(holdingsWithPrices);
    } catch (error) {
      console.error('Failed to load holdings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHolding = async (data: { symbol: string; shares: number; avgPrice: number }) => {
    try {
      setLoading(true);
      await api.createHolding(data);
      await loadHoldings();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add holding:', error);
      alert('Failed to add holding');
    } finally {
      setLoading(false);
    }
  };

  const handleEditHolding = async (data: { symbol: string; shares: number; avgPrice: number }) => {
    if (!editingHolding) return;
    
    try {
      setLoading(true);
      await api.updateHolding(editingHolding.id, { shares: data.shares, avgPrice: data.avgPrice });
      await loadHoldings();
      setEditingHolding(null);
    } catch (error) {
      console.error('Failed to update holding:', error);
      alert('Failed to update holding');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHolding = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holding?')) return;
    
    try {
      setLoading(true);
      await api.deleteHolding(id);
      await loadHoldings();
    } catch (error) {
      console.error('Failed to delete holding:', error);
      alert('Failed to delete holding');
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async (symbol: string) => {
    try {
      const data = await api.getChartData(symbol);
      setChartData(data.map((item: any) => ({
        date: new Date(item.date),
        price: item.price
      })));
      setSelectedSymbol(symbol);
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  };

  const totalPortfolioValue = holdings.reduce((sum, holding) => 
    sum + (holding.totalValue || 0), 0
  );

  const totalCost = holdings.reduce((sum, holding) => 
    sum + (holding.shares * holding.avgPrice), 0
  );

  const totalGainLoss = totalPortfolioValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div className="empty-state">
          <div className="icon">📊</div>
          <h3>Portfolio Tracker</h3>
          <p>Please log in to view your portfolio</p>
          <a 
            href="/login" 
            className="btn-primary"
            style={{ 
              display: 'inline-block',
              textDecoration: 'none',
              fontSize: '1.1rem',
              padding: '1rem 2rem'
            }}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header className="header">
        <h1>📊 Portfolio Tracker</h1>
        <div className="header-actions">
          <span>Welcome, {user.email}</span>
          <button onClick={logout} className="btn-outline">
            Logout
          </button>
        </div>
      </header>

      <div className="container" style={{ maxWidth: '1400px', padding: '2rem 1rem' }}>
        {/* Portfolio Summary */}
        <div className="portfolio-summary">
          <h2>Portfolio Summary</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Value</h3>
              <div className="value">${totalPortfolioValue.toFixed(2)}</div>
            </div>
            <div className="summary-card">
              <h3>Total Cost</h3>
              <div className="value">${totalCost.toFixed(2)}</div>
            </div>
            <div className={`summary-card ${totalGainLoss >= 0 ? 'gain' : 'loss'}`}>
              <h3>Gain/Loss</h3>
              <div className="value">
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
              </div>
              <div className="percentage">
                {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Holdings Section */}
        <div className="holdings-section">
          <div className="section-header">
            <h2>Your Holdings</h2>
            <button 
              onClick={() => setShowForm(true)} 
              className="btn-success"
              disabled={loading}
            >
              <span style={{ marginRight: '0.5rem' }}>+</span>
              Add Holding
            </button>
          </div>

          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading your holdings...</p>
            </div>
          )}

          {!loading && holdings.length === 0 && (
            <div className="empty-state">
              <div className="icon">📈</div>
              <h3>No holdings yet</h3>
              <p>Start building your portfolio by adding your first holding</p>
              <button 
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Add Your First Holding
              </button>
            </div>
          )}

          {!loading && holdings.length > 0 && (
            <div className="holdings-grid">
              {holdings.map(holding => (
                <div key={holding.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <HoldingCard
                    holding={holding}
                    onEdit={setEditingHolding}
                    onDelete={handleDeleteHolding}
                  />
                  <button
                    onClick={() => loadChartData(holding.symbol)}
                    className="chart-btn"
                  >
                    📊 View Price Chart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart Section */}
        {selectedSymbol && chartData.length > 0 && (
          <div className="chart-section">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem' 
            }}>
              <h2>Price Chart</h2>
              <button
                onClick={() => setSelectedSymbol('')}
                className="btn-outline"
                style={{ fontSize: '0.875rem' }}
              >
                Close Chart
              </button>
            </div>
            <PriceChart data={chartData} symbol={selectedSymbol} />
          </div>
        )}
      </div>

      {/* Modal */}
      {(showForm || editingHolding) && (
        <div className="modal-overlay">
          <div className="modal">
            <HoldingForm
              holding={editingHolding || undefined}
              onSubmit={editingHolding ? handleEditHolding : handleAddHolding}
              onCancel={() => {
                setShowForm(false);
                setEditingHolding(null);
              }}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
