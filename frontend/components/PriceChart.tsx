import React, { useEffect, useRef } from 'react';

interface ChartData {
  date: Date;
  price: number;
}

interface PriceChartProps {
  data: ChartData[];
  symbol: string;
  width?: number;
  height?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  symbol,
  width = 600,
  height = 300
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate data bounds
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Setup margins
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();

    // Draw price line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = margin.left + (index / (data.length - 1)) * chartWidth;
      const y = margin.top + (1 - (point.price - minPrice) / priceRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#3b82f6';
    data.forEach((point, index) => {
      const x = margin.left + (index / (data.length - 1)) * chartWidth;
      const y = margin.top + (1 - (point.price - minPrice) / priceRange) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    
    // Y-axis labels
    const numYTicks = 5;
    for (let i = 0; i <= numYTicks; i++) {
      const price = minPrice + (priceRange * i / numYTicks);
      const y = height - margin.bottom - (i / numYTicks) * chartHeight;
      ctx.textAlign = 'right';
      ctx.fillText(`$${price.toFixed(2)}`, margin.left - 10, y + 4);
    }

    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${symbol} Price Chart`, width / 2, 20);

  }, [data, symbol, width, height]);

  if (!data.length) {
    return (
      <div className="card empty-state">
        <div className="icon">📈</div>
        <h3>No price data available for {symbol}</h3>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="price-chart">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
      </div>
      <div style={{ 
        marginTop: '1rem', 
        textAlign: 'center', 
        fontSize: '0.875rem', 
        color: '#64748b' 
      }}>
        Showing {data.length} data points for {symbol}
      </div>
    </div>
  );
};
