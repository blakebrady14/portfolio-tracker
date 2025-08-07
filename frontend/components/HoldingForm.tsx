import React, { useState, useEffect } from 'react';

interface HoldingFormProps {
  holding?: {
    id?: string;
    symbol: string;
    shares: number;
    avgPrice: number;
  };
  onSubmit: (data: { symbol: string; shares: number; avgPrice: number }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const HoldingForm: React.FC<HoldingFormProps> = ({
  holding,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [symbol, setSymbol] = useState(holding?.symbol || '');
  const [shares, setShares] = useState(holding?.shares?.toString() || '');
  const [avgPrice, setAvgPrice] = useState(holding?.avgPrice?.toString() || '');

  useEffect(() => {
    if (holding) {
      setSymbol(holding.symbol);
      setShares(holding.shares.toString());
      setAvgPrice(holding.avgPrice.toString());
    }
  }, [holding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sharesNum = parseFloat(shares);
    const avgPriceNum = parseFloat(avgPrice);
    
    if (isNaN(sharesNum) || isNaN(avgPriceNum) || sharesNum <= 0 || avgPriceNum <= 0) {
      alert('Please enter valid positive numbers for shares and price');
      return;
    }

    onSubmit({
      symbol: symbol.toUpperCase(),
      shares: sharesNum,
      avgPrice: avgPriceNum
    });
  };

  return (
    <div className="holding-form">
      <h3>{holding?.id ? 'Edit Holding' : 'Add New Holding'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="symbol">Stock Symbol</label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g., AAPL"
            required
            disabled={loading || !!holding?.id}
            style={{ textTransform: 'uppercase' }}
          />
          {holding?.id && (
            <small style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              Symbol cannot be changed when editing
            </small>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="shares">Number of Shares</label>
          <input
            type="number"
            id="shares"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            step="0.01"
            min="0.01"
            placeholder="10.5"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="avgPrice">Average Price ($)</label>
          <input
            type="number"
            id="avgPrice"
            value={avgPrice}
            onChange={(e) => setAvgPrice(e.target.value)}
            step="0.01"
            min="0.01"
            placeholder="150.25"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="loading-spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                Saving...
              </span>
            ) : (
              holding?.id ? 'Update Holding' : 'Add Holding'
            )}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={loading}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
