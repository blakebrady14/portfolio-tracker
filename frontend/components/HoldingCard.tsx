import React from 'react';

interface Holding {
  id: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice?: number;
  totalValue?: number;
}

interface HoldingCardProps {
  holding: Holding;
  onEdit: (holding: Holding) => void;
  onDelete: (id: string) => void;
}

export const HoldingCard: React.FC<HoldingCardProps> = ({
  holding,
  onEdit,
  onDelete
}) => {
  const { symbol, shares, avgPrice, currentPrice } = holding;
  const currentValue = currentPrice ? currentPrice * shares : 0;
  const gainLoss = currentValue - (avgPrice * shares);
  const gainLossPercent = ((currentValue - (avgPrice * shares)) / (avgPrice * shares)) * 100;
  
  const isGain = gainLoss >= 0;

  return (
    <div className="holding-card">
      <div className="holding-header">
        <h3 className="symbol">{symbol}</h3>
        <div className="actions">
          <button 
            onClick={() => onEdit(holding)}
            className="edit-btn"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(holding.id)}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="holding-details">
        <div className="detail-row">
          <span>Shares:</span>
          <span>{shares.toFixed(2)}</span>
        </div>
        
        <div className="detail-row">
          <span>Avg Price:</span>
          <span>${avgPrice.toFixed(2)}</span>
        </div>
        
        {currentPrice && (
          <>
            <div className="detail-row">
              <span>Current Price:</span>
              <span>${currentPrice.toFixed(2)}</span>
            </div>
            
            <div className="detail-row">
              <span>Total Value:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>${currentValue.toFixed(2)}</span>
            </div>
            
            <div className={`detail-row ${isGain ? 'gain' : 'loss'}`}>
              <span>Gain/Loss:</span>
              <span style={{ fontSize: '1.1rem' }}>
                {isGain ? '+' : ''}${gainLoss.toFixed(2)} ({isGain ? '+' : ''}{gainLossPercent.toFixed(2)}%)
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
