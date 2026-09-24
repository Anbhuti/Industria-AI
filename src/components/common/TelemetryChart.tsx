import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Thermometer, 
  Gauge, 
  Zap, 
  Maximize2, 
  Info 
} from 'lucide-react';
import { MachineTrendPoint, MachineModel } from '../../types/industrial';

interface TelemetryChartProps {
  machine: MachineModel;
  trendData: MachineTrendPoint[];
  selectedRange?: '1h' | '8h' | '24h' | '7d';
  onRangeChange?: (range: '1h' | '8h' | '24h' | '7d') => void;
  className?: string;
}

type TelemetryMetricKey = 'vibration' | 'temperature' | 'pressure' | 'energyKW';

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  machine,
  trendData,
  selectedRange = '24h',
  onRangeChange,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState<TelemetryMetricKey>('vibration');
  const [hoveredPoint, setHoveredPoint] = useState<MachineTrendPoint | null>(null);

  // Metric configuration
  const metricConfig = useMemo(() => {
    switch (selectedMetric) {
      case 'vibration':
        return {
          label: 'Radial Vibration Velocity',
          unit: 'mm/s RMS',
          color: 'stroke-rose-400 fill-rose-500/10',
          lineColor: '#f43f5e',
          areaColor: 'rgba(244, 63, 94, 0.12)',
          baseline: 2.8,
          warning: 4.5,
          critical: 7.1,
          standard: 'ISO 10816-3 Zone B/C Limit',
          getValue: (p: MachineTrendPoint) => p.vibration
        };
      case 'temperature':
        return {
          label: 'Journal Bearing Metal Temperature',
          unit: '°C',
          color: 'stroke-amber-400 fill-amber-500/10',
          lineColor: '#fbbf24',
          areaColor: 'rgba(251, 191, 36, 0.12)',
          baseline: 72.0,
          warning: 85.0,
          critical: 100.0,
          standard: 'API 670 Bearing Trip Setpoint',
          getValue: (p: MachineTrendPoint) => p.temperature
        };
      case 'pressure':
        return {
          label: 'Discharge Header Pressure',
          unit: 'bar',
          color: 'stroke-sky-400 fill-sky-500/10',
          lineColor: '#38bdf8',
          areaColor: 'rgba(56, 189, 248, 0.12)',
          baseline: 180.0,
          warning: 195.0,
          critical: 210.0,
          standard: 'ASME Section VIII Overpressure Setpoint',
          getValue: (p: MachineTrendPoint) => p.pressure
        };
      case 'energyKW':
        return {
          label: 'Active Electric Drive Power',
          unit: 'kW',
          color: 'stroke-emerald-400 fill-emerald-500/10',
          lineColor: '#10b981',
          areaColor: 'rgba(16, 185, 129, 0.12)',
          baseline: 1600,
          warning: 2000,
          critical: 2200,
          standard: 'Drive VFD Continuous Rating',
          getValue: (p: MachineTrendPoint) => p.energyKW
        };
    }
  }, [selectedMetric]);

  // SVG Chart Geometry
  const width = 800;
  const height = 260;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };

  const values = trendData.map(metricConfig.getValue);
  const minVal = Math.min(...values, metricConfig.baseline * 0.85);
  const maxVal = Math.max(...values, metricConfig.critical * 1.05);

  const getY = (val: number) => {
    const range = maxVal - minVal || 1;
    return height - padding.bottom - ((val - minVal) / range) * (height - padding.top - padding.bottom);
  };

  const getX = (index: number) => {
    const step = (width - padding.left - padding.right) / (trendData.length - 1 || 1);
    return padding.left + index * step;
  };

  // Build SVG Path string
  const points = trendData.map((p, idx) => ({
    x: getX(idx),
    y: getY(metricConfig.getValue(p)),
    point: p
  }));

  const pathD = points.length > 0 
    ? `M ${points.map(pt => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' L ')}`
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x},${height - padding.bottom} L ${points[0].x},${height - padding.bottom} Z`
    : '';

  const warningY = getY(metricConfig.warning);
  const criticalY = getY(metricConfig.critical);

  return (
    <div className={`p-5 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm ${className}`}>
      {/* Top Header: Title, Metric Tabs, Range Buttons & SIMULATED DATA BADGE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono-tech text-xs font-bold text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
              {machine.tag}
            </span>
            <span className="text-xs font-mono-tech text-zinc-400">
              {metricConfig.label}
            </span>
            
            {/* MANDATORY SIMULATED DATA NOTICE */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Info className="w-3 h-3" />
              <span>SIMULATED DATA</span>
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-mono-tech">
            {metricConfig.standard} • High-frequency edge stream
          </p>
        </div>

        {/* Controls: Metric Selection & Time Range */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Tabs */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setSelectedMetric('vibration')}
              className={`px-2.5 py-1 rounded text-xs font-mono-tech transition-colors flex items-center gap-1.5 ${
                selectedMetric === 'vibration' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-3 h-3 text-rose-400" />
              <span>Vib</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric('temperature')}
              className={`px-2.5 py-1 rounded text-xs font-mono-tech transition-colors flex items-center gap-1.5 ${
                selectedMetric === 'temperature' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Thermometer className="w-3 h-3 text-amber-400" />
              <span>Temp</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric('pressure')}
              className={`px-2.5 py-1 rounded text-xs font-mono-tech transition-colors flex items-center gap-1.5 ${
                selectedMetric === 'pressure' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Gauge className="w-3 h-3 text-sky-400" />
              <span>Press</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric('energyKW')}
              className={`px-2.5 py-1 rounded text-xs font-mono-tech transition-colors flex items-center gap-1.5 ${
                selectedMetric === 'energyKW' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Power</span>
            </button>
          </div>

          {/* Time Range Selector */}
          {onRangeChange && (
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono-tech">
              {(['1h', '8h', '24h', '7d'] as const).map(range => (
                <button
                  key={range}
                  type="button"
                  onClick={() => onRangeChange(range)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    selectedRange === range ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Chart Stage */}
      <div className="relative w-full overflow-hidden">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`grad-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metricConfig.lineColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={metricConfig.lineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Horizontal Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding.top + ratio * (height - padding.top - padding.bottom);
            const val = maxVal - ratio * (maxVal - minVal);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#27272a"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val.toFixed(selectedMetric === 'vibration' ? 1 : 0)}
                </text>
              </g>
            );
          })}

          {/* Critical Threshold Line */}
          {criticalY >= padding.top && criticalY <= height - padding.bottom && (
            <g>
              <line
                x1={padding.left}
                y1={criticalY}
                x2={width - padding.right}
                y2={criticalY}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="6 3"
                opacity="0.8"
              />
              <text
                x={width - padding.right}
                y={criticalY - 6}
                textAnchor="end"
                fill="#f43f5e"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                TRIP LIMIT ({metricConfig.critical} {metricConfig.unit})
              </text>
            </g>
          )}

          {/* Warning Threshold Line */}
          {warningY >= padding.top && warningY <= height - padding.bottom && (
            <g>
              <line
                x1={padding.left}
                y1={warningY}
                x2={width - padding.right}
                y2={warningY}
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <text
                x={width - padding.right}
                y={warningY - 5}
                textAnchor="end"
                fill="#fbbf24"
                fontSize="9"
                fontFamily="monospace"
              >
                WARN ({metricConfig.warning} {metricConfig.unit})
              </text>
            </g>
          )}

          {/* Area Fill */}
          <path d={areaD} fill={`url(#grad-${selectedMetric})`} />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke={metricConfig.lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint === pt.point ? 5 : 2.5}
              fill="#18181b"
              stroke={metricConfig.lineColor}
              strokeWidth="2"
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredPoint(pt.point)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Time Axis Labels */}
          {points.filter((_, i) => i % Math.ceil(points.length / 6) === 0).map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={height - 12}
              textAnchor="middle"
              fill="#71717a"
              fontSize="10"
              fontFamily="monospace"
            >
              {pt.point.timestamp}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 left-16 bg-zinc-950/95 border border-zinc-700 px-3 py-2 rounded-lg text-xs font-mono-tech shadow-xl pointer-events-none z-10">
            <div className="text-zinc-400 text-[10px]">TIMESTAMP: {hoveredPoint.timestamp}</div>
            <div className="text-white font-bold text-sm mt-0.5">
              {metricConfig.getValue(hoveredPoint)} {metricConfig.unit}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              Operating Load: {hoveredPoint.operatingLoadPct}%
            </div>
          </div>
        )}
      </div>

      {/* Footer Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono-tech text-zinc-400 mt-4 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-500 inline-block" />
            <span>Trip Threshold ({metricConfig.critical} {metricConfig.unit})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block" />
            <span>Alert Threshold ({metricConfig.warning} {metricConfig.unit})</span>
          </div>
        </div>

        <span className="text-zinc-500">
          Source: Edge SCADA OPC-UA (10 kHz Nyquist Filtered)
        </span>
      </div>
    </div>
  );
};
