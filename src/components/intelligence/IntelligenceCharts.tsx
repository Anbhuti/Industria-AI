import React, { useState } from 'react';
import { HistoricalTrendPoint } from '../../data/intelligenceData';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface AreaChartProps {
  data: HistoricalTrendPoint[];
  seriesLabels: { primary: string; secondary?: string; baseline?: string };
  height?: number;
}

export const IndustrialAreaChart: React.FC<AreaChartProps> = ({
  data,
  seriesLabels,
  height = 220
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const allValues = data.flatMap(d => [
    d.value,
    d.secondaryValue ?? d.value,
    d.baseline ?? d.value
  ]);
  const minVal = Math.floor(Math.min(...allValues) * 0.85);
  const maxVal = Math.ceil(Math.max(...allValues) * 1.15);
  const range = maxVal - minVal || 1;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / range) * chartHeight;

  // Generate SVG Path for primary series
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `M ${points[0]} L ${points.join(' L ')} L ${getX(data.length - 1)},${padding.top + chartHeight} L ${padding.left},${padding.top + chartHeight} Z`;

  // Optional secondary series path
  let secondaryLinePath = '';
  if (data.some(d => d.secondaryValue !== undefined)) {
    const secPoints = data.map((d, i) => `${getX(i)},${getY(d.secondaryValue ?? d.value)}`);
    secondaryLinePath = `M ${secPoints.join(' L ')}`;
  }

  // Baseline line Y
  const baselineVal = data[0]?.baseline;
  const baselineY = baselineVal !== undefined ? getY(baselineVal) : null;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible font-mono-tech"
      >
        <defs>
          <linearGradient id="areaGradientPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="areaGradientSecondary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * ratio;
          const val = Math.round(maxVal - ratio * range);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                fill="#71717a"
                fontSize="9"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Baseline Target Line if available */}
        {baselineY !== null && (
          <g>
            <line
              x1={padding.left}
              y1={baselineY}
              x2={width - padding.right}
              y2={baselineY}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              opacity="0.75"
            />
            <text
              x={width - padding.right}
              y={baselineY - 5}
              fill="#f87171"
              fontSize="8"
              textAnchor="end"
              fontWeight="bold"
            >
              LIMIT: {baselineVal} {data[0]?.unit || ''}
            </text>
          </g>
        )}

        {/* Primary Area Fill */}
        <path d={areaPath} fill="url(#areaGradientPrimary)" />

        {/* Secondary Line if present */}
        {secondaryLinePath && (
          <path
            d={secondaryLinePath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="3 2"
          />
        )}

        {/* Primary Trend Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Data Points and Interaction Circles */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.value);
          const isHovered = hoverIndex === i;

          return (
            <g key={i}>
              {/* X Axis Label */}
              <text
                x={cx}
                y={padding.top + chartHeight + 18}
                fill={isHovered ? '#f59e0b' : '#a1a1aa'}
                fontSize="9"
                textAnchor="middle"
                fontWeight={isHovered ? 'bold' : 'normal'}
              >
                {d.label}
              </text>

              {/* Point */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 5.5 : 3.5}
                fill="#0d1118"
                stroke="#f59e0b"
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />

              {/* Secondary Point if present */}
              {d.secondaryValue !== undefined && (
                <circle
                  cx={cx}
                  cy={getY(d.secondaryValue)}
                  r={isHovered ? 4.5 : 3}
                  fill="#0d1118"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Card */}
      {hoverIndex !== null && data[hoverIndex] && (
        <div
          className="absolute top-2 right-2 bg-[#121722] border border-amber-500/40 rounded-lg p-2.5 shadow-xl text-xs font-mono-tech pointer-events-none z-10"
        >
          <div className="text-[10px] text-zinc-400 font-bold uppercase mb-1">
            {data[hoverIndex].label}
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{seriesLabels.primary}:</span>
            <span>
              {data[hoverIndex].value} {data[hoverIndex].unit || ''}
            </span>
          </div>
          {data[hoverIndex].secondaryValue !== undefined && (
            <div className="flex items-center gap-2 text-sky-300 font-medium mt-0.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>{seriesLabels.secondary || 'Secondary'}:</span>
              <span>
                {data[hoverIndex].secondaryValue} {data[hoverIndex].unit || ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Series Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] font-mono-tech text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-amber-400 rounded-full" />
          <span>{seriesLabels.primary}</span>
        </div>
        {seriesLabels.secondary && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-400 rounded-full" />
            <span>{seriesLabels.secondary}</span>
          </div>
        )}
        {seriesLabels.baseline && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-400 border-t border-dashed" />
            <span>{seriesLabels.baseline}</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface BarChartProps {
  data: HistoricalTrendPoint[];
  seriesLabels: { primary: string; secondary?: string };
  height?: number;
}

export const IndustrialBarChart: React.FC<BarChartProps> = ({
  data,
  seriesLabels,
  height = 200
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 580;
  const padding = { top: 20, right: 25, bottom: 35, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => Math.max(d.value, d.secondaryValue || 0)), 6);
  const barGroupWidth = chartWidth / data.length;
  const barWidth = Math.min(barGroupWidth * 0.35, 24);

  return (
    <div className="relative w-full overflow-hidden select-none font-mono-tech">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * (1 - ratio);
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const groupX = padding.left + i * barGroupWidth + barGroupWidth / 2;
          const h1 = (d.value / maxVal) * chartHeight;
          const y1 = padding.top + chartHeight - h1;

          const h2 = d.secondaryValue ? (d.secondaryValue / maxVal) * chartHeight : 0;
          const y2 = padding.top + chartHeight - h2;
          const isHovered = hoverIndex === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className="cursor-pointer"
            >
              {/* Primary Bar (Amber) */}
              <rect
                x={groupX - barWidth - 2}
                y={y1}
                width={barWidth}
                height={h1}
                rx="3"
                fill={isHovered ? '#fbbf24' : '#f59e0b'}
                className="transition-colors"
              />

              {/* Secondary Bar (Rose/Red) */}
              {d.secondaryValue !== undefined && (
                <rect
                  x={groupX + 2}
                  y={y2}
                  width={barWidth}
                  height={h2}
                  rx="3"
                  fill={isHovered ? '#f43f5e' : '#e11d48'}
                  className="transition-colors"
                />
              )}

              {/* X-axis Label */}
              <text
                x={groupX}
                y={padding.top + chartHeight + 16}
                fill={isHovered ? '#ffffff' : '#a1a1aa'}
                fontSize="9"
                textAnchor="middle"
                fontWeight={isHovered ? 'bold' : 'normal'}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded" />
          <span>{seriesLabels.primary}</span>
        </div>
        {seriesLabels.secondary && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded" />
            <span>{seriesLabels.secondary}</span>
          </div>
        )}
      </div>
    </div>
  );
};
