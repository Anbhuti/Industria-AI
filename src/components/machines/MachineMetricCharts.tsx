import React, { useState } from 'react';
import { MachineTrendPoint } from '../../types/industrial';

interface MachineMetricChartsProps {
  trends: MachineTrendPoint[];
  machineId: string;
}

type MetricKey = 'temperature' | 'vibration' | 'pressure' | 'energyKW' | 'operatingLoadPct';

interface MetricConfig {
  key: MetricKey;
  label: string;
  unit: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  threshold?: number;
  thresholdLabel?: string;
  minDomain?: number;
}

const METRIC_CONFIGS: Record<MetricKey, MetricConfig> = {
  temperature: {
    key: 'temperature',
    label: 'Temperature Over Time',
    unit: '°C',
    color: '#f97316', // Orange
    gradientFrom: 'rgba(249, 115, 22, 0.4)',
    gradientTo: 'rgba(249, 115, 22, 0.02)',
    threshold: 85,
    thresholdLabel: 'Alarm Limit (85°C)'
  },
  vibration: {
    key: 'vibration',
    label: 'Vibration Over Time',
    unit: 'mm/s RMS',
    color: '#eab308', // Amber
    gradientFrom: 'rgba(234, 179, 8, 0.4)',
    gradientTo: 'rgba(234, 179, 8, 0.02)',
    threshold: 4.5,
    thresholdLabel: 'ISO 10816 Limit (4.5 mm/s)'
  },
  pressure: {
    key: 'pressure',
    label: 'Pressure Over Time',
    unit: 'bar',
    color: '#06b6d4', // Cyan
    gradientFrom: 'rgba(6, 182, 212, 0.4)',
    gradientTo: 'rgba(6, 182, 212, 0.02)',
    threshold: 175,
    thresholdLabel: 'Relief Limit (175 bar)'
  },
  energyKW: {
    key: 'energyKW',
    label: 'Energy Consumption',
    unit: 'kW',
    color: '#a855f7', // Purple
    gradientFrom: 'rgba(168, 85, 247, 0.4)',
    gradientTo: 'rgba(168, 85, 247, 0.02)',
    threshold: 1800,
    thresholdLabel: 'Peak Demand (1,800 kW)'
  },
  operatingLoadPct: {
    key: 'operatingLoadPct',
    label: 'Operating Load',
    unit: '%',
    color: '#10b981', // Emerald
    gradientFrom: 'rgba(16, 185, 129, 0.4)',
    gradientTo: 'rgba(16, 185, 129, 0.02)',
    threshold: 90,
    thresholdLabel: 'Rated Continuous (90%)'
  }
};

export const MachineMetricCharts: React.FC<MachineMetricChartsProps> = ({ trends, machineId }) => {
  const [activeTab, setActiveTab] = useState<MetricKey>('vibration');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeConfig = METRIC_CONFIGS[activeTab];

  // Calculate SVG scales
  const values = trends.map(t => t[activeTab]);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values, activeConfig.threshold || 0);
  const padding = (rawMax - rawMin) * 0.15 || 5;
  const minVal = Math.max(0, rawMin - padding);
  const maxVal = rawMax + padding;

  const chartWidth = 720;
  const chartHeight = 220;
  const margin = { top: 20, right: 30, bottom: 35, left: 50 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const getX = (index: number) => {
    if (trends.length <= 1) return margin.left;
    return margin.left + (index / (trends.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    if (maxVal === minVal) return margin.top + innerHeight / 2;
    const norm = (val - minVal) / (maxVal - minVal);
    return margin.top + innerHeight - norm * innerHeight;
  };

  // Build SVG Path
  const points = trends.map((t, idx) => ({
    x: getX(idx),
    y: getY(t[activeTab]),
    data: t
  }));

  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx1 = prev.x + (curr.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (curr.x - prev.x) / 2;
      const cy2 = curr.y;
      pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }
  }

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${margin.top + innerHeight} L ${points[0].x} ${margin.top + innerHeight} Z`
    : '';

  const thresholdY = activeConfig.threshold ? getY(activeConfig.threshold) : null;
  const latestValue = trends.length > 0 ? trends[trends.length - 1][activeTab] : 0;
  const initialValue = trends.length > 0 ? trends[0][activeTab] : 0;
  const delta = Number((latestValue - initialValue).toFixed(2));
  const isUp = delta > 0;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-5">
      {/* Top Header & Chart Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono-tech uppercase text-zinc-400">
            Historical Sensor Excursion & Physics Curves
          </div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>{activeConfig.label}</span>
            <span className="text-xs font-mono-tech font-normal text-zinc-400">
              ({trends.length} Observation Windows)
            </span>
          </h3>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {(Object.keys(METRIC_CONFIGS) as MetricKey[]).map((key) => {
            const cfg = METRIC_CONFIGS[key];
            const isSelected = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  setHoveredIndex(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white/[0.12] text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                />
                <span>
                  {key === 'temperature' ? 'Temp' :
                   key === 'vibration' ? 'Vibration' :
                   key === 'pressure' ? 'Pressure' :
                   key === 'energyKW' ? 'Energy' : 'Load'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Metric Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Current Reading</div>
          <div className="text-lg font-bold font-mono-tech text-white mt-0.5" style={{ color: activeConfig.color }}>
            {latestValue} <span className="text-xs text-zinc-400">{activeConfig.unit}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Cycle Delta</div>
          <div className={`text-lg font-bold font-mono-tech mt-0.5 ${isUp ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isUp ? `+${delta}` : delta} <span className="text-xs text-zinc-400">{activeConfig.unit}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Baseline Target</div>
          <div className="text-lg font-bold font-mono-tech text-zinc-300 mt-0.5">
            {initialValue} <span className="text-xs text-zinc-400">{activeConfig.unit}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Excursion Threshold</div>
          <div className="text-lg font-bold font-mono-tech text-amber-400 mt-0.5">
            {activeConfig.threshold ? `${activeConfig.threshold} ${activeConfig.unit}` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#080b10] border border-white/[0.06] p-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeConfig.color} stopOpacity="0.38" />
              <stop offset="100%" stopColor={activeConfig.color} stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = margin.top + innerHeight * (1 - pct);
            const val = (minVal + (maxVal - minVal) * pct).toFixed(1);
            return (
              <g key={i}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={margin.left + innerWidth}
                  y2={y}
                  stroke="#ffffff"
                  strokeOpacity="0.06"
                  strokeDasharray="2 3"
                />
                <text
                  x={margin.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Safety threshold line */}
          {thresholdY !== null && thresholdY >= margin.top && thresholdY <= margin.top + innerHeight && (
            <g>
              <line
                x1={margin.left}
                y1={thresholdY}
                x2={margin.left + innerWidth}
                y2={thresholdY}
                stroke="#ef4444"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                strokeOpacity="0.75"
              />
              <text
                x={margin.left + innerWidth - 6}
                y={thresholdY - 4}
                textAnchor="end"
                fill="#f87171"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {activeConfig.thresholdLabel}
              </text>
            </g>
          )}

          {/* Area under curve */}
          {areaD && (
            <path
              d={areaD}
              fill={`url(#grad-${activeTab})`}
            />
          )}

          {/* Main curve line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={activeConfig.color}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points & hover interactive triggers */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Hit area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={12}
                  fill="transparent"
                />
                {/* Visible point */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5 : 2.5}
                  fill="#0c1017"
                  stroke={activeConfig.color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  filter={isHovered ? "url(#glow)" : undefined}
                />
              </g>
            );
          })}

          {/* X Axis Time Labels */}
          {points.filter((_, idx) => idx % Math.ceil(points.length / 6) === 0 || idx === points.length - 1).map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={margin.top + innerHeight + 16}
              textAnchor="middle"
              fill="#71717a"
              fontSize="9"
              fontFamily="monospace"
            >
              {p.data.timestamp}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full bg-[#141923] border border-white/[0.15] shadow-2xl rounded-xl p-2.5 text-[11px] font-mono-tech text-white z-30 transition-all duration-75"
            style={{
              left: `${(points[hoveredIndex].x / chartWidth) * 100}%`,
              top: `${(points[hoveredIndex].y / chartHeight) * 100}%`,
              marginTop: '-10px'
            }}
          >
            <div className="text-zinc-400 text-[10px] pb-1 border-b border-white/[0.08]">
              {points[hoveredIndex].data.timestamp}
            </div>
            <div className="font-bold text-white mt-1 flex items-center justify-between gap-3">
              <span>{activeConfig.label}:</span>
              <span style={{ color: activeConfig.color }}>
                {points[hoveredIndex].data[activeTab]} {activeConfig.unit}
              </span>
            </div>
            <div className="text-zinc-400 text-[10px] flex items-center justify-between gap-3 mt-0.5">
              <span>Load:</span>
              <span className="text-emerald-400">{points[hoveredIndex].data.operatingLoadPct}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Mini 5-Metric Quick Spark Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-white/[0.06]">
        {(Object.keys(METRIC_CONFIGS) as MetricKey[]).map(key => {
          const cfg = METRIC_CONFIGS[key];
          const isSelected = activeTab === key;
          const currentVal = trends.length > 0 ? trends[trends.length - 1][key] : 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`p-2 rounded-xl text-left transition-all ${
                isSelected 
                  ? 'bg-white/[0.08] border border-white/[0.15]' 
                  : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05]'
              }`}
            >
              <div className="text-[9px] font-mono-tech text-zinc-400 uppercase truncate">
                {cfg.label.replace(' Over Time', '')}
              </div>
              <div className="text-xs font-bold font-mono-tech mt-0.5" style={{ color: cfg.color }}>
                {currentVal} <span className="text-[10px] text-zinc-500 font-normal">{cfg.unit}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
