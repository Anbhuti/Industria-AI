import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Radio, 
  Gauge, 
  Droplet, 
  Thermometer, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface SensorProbe {
  id: string;
  name: string;
  tag: string;
  type: 'vibration' | 'temperature' | 'pressure' | 'load';
  value: string;
  baseline: string;
  deviation: string;
  status: 'critical' | 'warning' | 'nominal';
  x: number; // percentage in diagram SVG
  y: number;
  description: string;
  harmonic: string;
}

export const IndustrialMachineDiagram: React.FC = () => {
  const probes: SensorProbe[] = [
    {
      id: 'de-bearing',
      name: 'Drive-End Tilt-Pad Bearing',
      tag: 'VB-DE-204A',
      type: 'vibration',
      value: '5.76 mm/s RMS',
      baseline: '4.50 mm/s',
      deviation: '+28.0%',
      status: 'critical',
      x: 32,
      y: 48,
      description: 'Localized oil whirl instability. Exceeds ISO 10816 Zone B trip limit.',
      harmonic: '0.44X Running Speed (Fluid Whirl)'
    },
    {
      id: 'bearing-temp',
      name: 'Journal Babbit Temperature RTD',
      tag: 'TT-DE-204B',
      type: 'temperature',
      value: '82.1 °C',
      baseline: '72.0 °C',
      deviation: '+14.0%',
      status: 'warning',
      x: 42,
      y: 35,
      description: 'Thinning hydrodynamic wedge generating elevated frictional shear heat.',
      harmonic: 'Thermal gradient: +0.4°C/min'
    },
    {
      id: 'lube-header',
      name: 'Lubrication Header Delivery',
      tag: 'PT-OIL-204',
      type: 'pressure',
      value: '2.94 bar',
      baseline: '3.20 bar',
      deviation: '-8.1%',
      status: 'warning',
      x: 58,
      y: 65,
      description: 'Downstream delivery drop causing intermittent boundary lubrication.',
      harmonic: 'Supply filter differential: 0.35 bar'
    },
    {
      id: 'motor-stator',
      name: '12MW Induction Motor Stator',
      tag: 'IT-MTR-204',
      type: 'load',
      value: '384 A (88% Load)',
      baseline: '346 A (78%)',
      deviation: '+11.0%',
      status: 'nominal',
      x: 78,
      y: 48,
      description: 'Continuous peak compression throughput. Rotor slip nominal at 0.8%.',
      harmonic: 'Supply Frequency: 50.02 Hz'
    }
  ];

  const [selectedProbeId, setSelectedProbeId] = useState<string>('de-bearing');
  const activeProbe = probes.find(p => p.id === selectedProbeId) || probes[0];

  return (
    <div className="w-full rounded-3xl bg-[#0b0e14] border border-white/[0.08] overflow-hidden shadow-2xl">
      {/* Top Diagram Action & Status Bar */}
      <div className="px-5 sm:px-8 py-4 bg-[#0e121a] border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech text-amber-400 font-bold tracking-wider">
                SCHEMATIC // COMPRESSOR C-204
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-mono-tech text-rose-400 font-semibold uppercase">
                1 Active Excursion
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">
              Sulzer 12MW Multi-Stage Centrifugal Turbocompressor • Line A
            </div>
          </div>
        </div>

        {/* Sensor Probe Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono-tech no-scrollbar">
          {probes.map(probe => {
            const isSelected = probe.id === selectedProbeId;
            return (
              <button
                key={probe.id}
                onClick={() => setSelectedProbeId(probe.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  probe.status === 'critical' ? 'bg-rose-500 animate-pulse' :
                  probe.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <span>{probe.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="p-6 sm:p-10 relative bg-fine-grid">
        {/* Subtle background grid gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/40 via-transparent to-[#0b0e14]/90 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Machine Cutaway SVG Diagram */}
          <div className="lg:col-span-7 relative flex flex-col items-center justify-center p-4 min-h-[300px]">
            <svg 
              viewBox="0 0 700 320" 
              className="w-full h-auto max-h-[300px] select-none filter drop-shadow-lg"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Machine Foundation & Bedplate */}
              <rect x="50" y="240" width="600" height="24" rx="6" fill="#131822" stroke="#2a3342" strokeWidth="1.5" />
              <line x1="80" y1="264" x2="620" y2="264" stroke="#1f2733" strokeWidth="2" strokeDasharray="8 8" />

              {/* Electric Motor Stator Body (Right) */}
              <rect x="470" y="70" width="160" height="170" rx="14" fill="#121721" stroke="#2c3747" strokeWidth="1.5" />
              <rect x="485" y="85" width="130" height="140" rx="8" fill="#161c28" stroke="#252f3e" strokeWidth="1" />
              {/* Motor cooling fins */}
              {[100, 118, 136, 154, 172, 190, 208].map(y => (
                <line key={y} x1="470" y1={y} x2="630" y2={y} stroke="#222b3a" strokeWidth="1.5" />
              ))}
              <text x="550" y="160" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                12MW INDUCTION MOTOR
              </text>

              {/* Flexible Disc Coupling */}
              <rect x="425" y="125" width="45" height="60" rx="4" fill="#1f2736" stroke="#3e4c63" strokeWidth="1.5" />
              <circle cx="447" cy="155" r="16" fill="#151b24" stroke="#334155" strokeWidth="1" />
              <circle cx="447" cy="155" r="4" fill="#f59e0b" />

              {/* Centrifugal Compressor Casing (Left) */}
              <path 
                d="M 100 90 L 400 90 L 400 220 L 100 220 Z" 
                fill="#111620" 
                stroke="#2f3b4d" 
                strokeWidth="2" 
                rx="12" 
              />
              
              {/* Internal Gas Compression Volute Cavities */}
              <path d="M 140 105 Q 180 155 140 205" stroke="#202938" strokeWidth="16" strokeLinecap="round" />
              <path d="M 220 105 Q 260 155 220 205" stroke="#202938" strokeWidth="16" strokeLinecap="round" />
              <path d="M 300 105 Q 340 155 300 205" stroke="#202938" strokeWidth="16" strokeLinecap="round" />

              {/* High-Speed Rotating Shaft */}
              <rect x="90" y="146" width="370" height="18" fill="#242e3d" stroke="#3d4c63" strokeWidth="1" />
              <line x1="90" y1="155" x2="460" y2="155" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="12 6" className="animate-signal-flow" />

              {/* 3 Impeller Discs */}
              {[150, 230, 310].map((cx, i) => (
                <g key={cx}>
                  <rect x={cx - 10} y="112" width="20" height="86" rx="4" fill="#1c2432" stroke="#475569" strokeWidth="1" />
                  <text x={cx} y="102" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                    STAGE {i + 1}
                  </text>
                </g>
              ))}

              {/* Bearings Blocks */}
              {/* Drive-End Bearing (Focus of active excursion) */}
              <g>
                <rect x="375" y="130" width="35" height="50" rx="4" fill="#1d2433" stroke={selectedProbeId === 'de-bearing' ? '#f59e0b' : '#3d4d65'} strokeWidth={selectedProbeId === 'de-bearing' ? 2 : 1.5} />
                <circle cx="392" cy="155" r="10" fill="#263143" stroke="#f43f5e" strokeWidth="1.5" />
                <circle cx="392" cy="155" r="3" fill="#f43f5e" className="animate-ping" />
              </g>

              {/* Non-Drive-End Bearing */}
              <rect x="105" y="130" width="30" height="50" rx="4" fill="#1a202c" stroke="#2e3a4e" strokeWidth="1.2" />

              {/* Lubrication Line Header */}
              <path 
                d="M 392 235 L 392 185 M 392 235 L 490 235" 
                stroke="#f59e0b" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
                className="animate-signal-flow" 
              />

              {/* Dynamic Interactive Sensor Probe Overlays */}
              {probes.map(probe => {
                const isSelected = probe.id === selectedProbeId;
                const posX = (probe.x / 100) * 700;
                const posY = (probe.y / 100) * 320;

                return (
                  <g 
                    key={probe.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedProbeId(probe.id)}
                  >
                    {/* Pulsing ring */}
                    <circle 
                      cx={posX} 
                      cy={posY} 
                      r={isSelected ? 18 : 12} 
                      fill={probe.status === 'critical' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)'}
                      stroke={probe.status === 'critical' ? '#f43f5e' : '#f59e0b'}
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    {/* Center point */}
                    <circle 
                      cx={posX} 
                      cy={posY} 
                      r={4} 
                      fill={probe.status === 'critical' ? '#f43f5e' : probe.status === 'warning' ? '#f59e0b' : '#10b981'}
                    />

                    {/* Sensor Callout Tag */}
                    <rect 
                      x={posX - 40} 
                      y={posY - 32} 
                      width="80" 
                      height="18" 
                      rx="4" 
                      fill="#0d1117" 
                      stroke={isSelected ? '#f59e0b' : '#273142'} 
                      strokeWidth={1}
                    />
                    <text 
                      x={posX} 
                      y={posY - 20} 
                      fill={isSelected ? '#fbbf24' : '#cbd5e1'} 
                      fontSize="9" 
                      fontFamily="JetBrains Mono" 
                      fontWeight="bold" 
                      textAnchor="middle"
                    >
                      {probe.tag}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="text-[11px] font-mono-tech text-zinc-400 mt-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Telemetry Hotspots: Click any sensor tag to inspect live telemetry dynamics.</span>
            </div>
          </div>

          {/* Active Sensor Live Waveform & Diagnostic Panel */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0e131c] border border-white/[0.08] shadow-xl space-y-4">
            
            {/* Header of selected probe */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-tech text-amber-400 font-bold">{activeProbe.tag}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase border ${
                    activeProbe.status === 'critical' ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' :
                    activeProbe.status === 'warning' ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' :
                    'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  }`}>
                    {activeProbe.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{activeProbe.name}</h4>
              </div>

              <div className="text-right shrink-0">
                <div className="text-lg font-extrabold font-mono-tech text-white">
                  {activeProbe.value}
                </div>
                <div className={`text-[11px] font-mono-tech font-bold ${
                  activeProbe.deviation.startsWith('+') ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {activeProbe.deviation} vs Baseline
                </div>
              </div>
            </div>

            {/* Real-Time Micro Oscilloscope Signal */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400">
                <span>SPECTRAL WAVEFORM (TIME-SERIES)</span>
                <span className="text-amber-400">{activeProbe.harmonic}</span>
              </div>

              <div className="h-16 w-full rounded-xl bg-[#080a0f] border border-white/[0.06] p-2 relative overflow-hidden flex items-center">
                {/* Simulated live SVG waveform */}
                <svg viewBox="0 0 300 50" className="w-full h-full" fill="none">
                  <path 
                    d={
                      activeProbe.id === 'de-bearing'
                        ? "M 0 25 Q 25 2 50 25 T 100 25 T 150 48 T 200 25 T 250 2 T 300 25"
                        : activeProbe.id === 'bearing-temp'
                        ? "M 0 35 L 50 32 L 100 28 L 150 26 L 200 24 L 250 20 L 300 18"
                        : activeProbe.id === 'lube-header'
                        ? "M 0 20 Q 30 18 60 22 T 120 20 T 180 24 T 240 28 T 300 30"
                        : "M 0 25 Q 15 10 30 25 T 60 25 T 90 25 T 120 25 T 150 25 T 180 25 T 210 25 T 240 25 T 270 25 T 300 25"
                    }
                    stroke={activeProbe.status === 'critical' ? '#f43f5e' : '#f59e0b'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-signal-flow"
                  />
                  {/* Baseline indicator line */}
                  <line x1="0" y1="25" x2="300" y2="25" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
              </div>
            </div>

            {/* Diagnostic Interpretation */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
              <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Physics Diagnosis:</div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeProbe.description}
              </p>
            </div>

            {/* Baseline comparison stats */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-zinc-400 block">Nominal Baseline:</span>
                <span className="text-zinc-200 font-bold">{activeProbe.baseline}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-zinc-400 block">Safety Margin:</span>
                <span className={activeProbe.status === 'critical' ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                  {activeProbe.status === 'critical' ? '14 Days Safe RUL' : 'Within Limits'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
