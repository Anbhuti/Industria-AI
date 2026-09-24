import React, { useState } from 'react';
import { 
  Network, 
  Activity, 
  Thermometer, 
  Droplets, 
  Zap, 
  Gauge, 
  Info, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CorrelationFactor {
  id: string;
  name: string;
  category: 'Vibration' | 'Temperature' | 'Lubrication' | 'Motor Load' | 'Speed';
  icon: any;
  currentDeviation: string;
  color: string;
  strokeColor: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  baseline: string;
  actual: string;
  status: 'critical' | 'warning' | 'nominal';
  temporalLeadMinutes: number; // e.g. -24 min (occurred 24 mins before peak)
}

interface CorrelationLink {
  source: string;
  target: string;
  strength: number; // 0 to 1
  label: string;
  mechanism: string;
  leadLag: string;
  direction: 'unidirectional' | 'bidirectional';
}

export const SignalCorrelationMatrix: React.FC<{
  onAskNovaAboutCorrelation?: (source: string, target: string) => void;
}> = ({ onAskNovaAboutCorrelation }) => {
  const [selectedFactor, setSelectedFactor] = useState<string | null>('vibration');
  const [hoveredLink, setHoveredLink] = useState<CorrelationLink | null>(null);

  const factors: CorrelationFactor[] = [
    {
      id: 'vibration',
      name: 'Vibration Velocity',
      category: 'Vibration',
      icon: Activity,
      currentDeviation: '+28%',
      color: '#f43f5e',
      strokeColor: 'stroke-rose-500',
      bgClass: 'bg-rose-500/10',
      borderClass: 'border-rose-500/40',
      textClass: 'text-rose-400',
      baseline: '4.50 mm/s ISO Zone B Limit',
      actual: '5.76 mm/s RMS (Drive End Bearing)',
      status: 'critical',
      temporalLeadMinutes: 0 // Reference peak at t=0
    },
    {
      id: 'temperature',
      name: 'Bearing Temperature',
      category: 'Temperature',
      icon: Thermometer,
      currentDeviation: '+14%',
      color: '#f97316',
      strokeColor: 'stroke-orange-500',
      bgClass: 'bg-orange-500/10',
      borderClass: 'border-orange-500/40',
      textClass: 'text-orange-400',
      baseline: '72.0°C Nominal Bedplate',
      actual: '82.1°C (Duplex RTD TE-204B)',
      status: 'warning',
      temporalLeadMinutes: 8 // Began rising 8 min after lube pressure drop
    },
    {
      id: 'lubrication',
      name: 'Lubrication Pressure',
      category: 'Lubrication',
      icon: Droplets,
      currentDeviation: '-8%',
      color: '#38bdf8',
      strokeColor: 'stroke-sky-500',
      bgClass: 'bg-sky-500/10',
      borderClass: 'border-sky-500/40',
      textClass: 'text-sky-400',
      baseline: '3.20 bar Supply Header',
      actual: '2.94 bar (Pre-filter Delta-P rise)',
      status: 'warning',
      temporalLeadMinutes: -18 // Leading indicator: occurred 18 mins before vibration trip
    },
    {
      id: 'motorLoad',
      name: 'Motor Load / Current',
      category: 'Motor Load',
      icon: Zap,
      currentDeviation: '+11%',
      color: '#a855f7',
      strokeColor: 'stroke-purple-500',
      bgClass: 'bg-purple-500/10',
      borderClass: 'border-purple-500/40',
      textClass: 'text-purple-400',
      baseline: '346 A Continuous Draw',
      actual: '384 A (Phase B Current Surge)',
      status: 'warning',
      temporalLeadMinutes: 12 // Lagging response to higher viscous drag
    },
    {
      id: 'operatingSpeed',
      name: 'Operating Speed (RPM)',
      category: 'Speed',
      icon: Gauge,
      currentDeviation: '±0.4%',
      color: '#10b981',
      strokeColor: 'stroke-emerald-500',
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/40',
      textClass: 'text-emerald-400',
      baseline: '11,420 RPM Setpoint',
      actual: '11,380 - 11,440 RPM (Governor Active)',
      status: 'nominal',
      temporalLeadMinutes: 0
    }
  ];

  const correlationLinks: CorrelationLink[] = [
    {
      source: 'lubrication',
      target: 'vibration',
      strength: 0.94,
      label: 'Oil Film Thinning → Hydrodynamic Whirl',
      mechanism: 'Header pressure drop from 3.20 to 2.94 bar reduced tilt-pad hydrodynamic wedge thickness, prompting sub-synchronous oil whip at 0.44X frequency.',
      leadLag: 'Lube drop preceded vibration acceleration by 18 minutes',
      direction: 'unidirectional'
    },
    {
      source: 'lubrication',
      target: 'temperature',
      strength: 0.88,
      label: 'Reduced Cooling Flow → Thermal Escalation',
      mechanism: 'Restricted lubricant flow decreased heat dissipation capacity across tilt pads, driving babbitt metal temperature from 72°C to 82.1°C.',
      leadLag: 'Thermal drift observed 10 minutes following lube pressure decay',
      direction: 'unidirectional'
    },
    {
      source: 'vibration',
      target: 'temperature',
      strength: 0.91,
      label: 'Radial Eccentricity ↔ Friction Heating',
      mechanism: 'Radial displacement oscillation (orbit diameter > 38 µm) created cyclic shear stresses and boundary friction in tilt-pad shoe 2.',
      leadLag: 'Synchronous temporal amplification with mutual positive feedback',
      direction: 'bidirectional'
    },
    {
      source: 'temperature',
      target: 'motorLoad',
      strength: 0.76,
      label: 'Viscous Shear Resistance → Drive Torque Draw',
      mechanism: 'Localized thermal expansion of journal sleeve reduced running clearance, increasing mechanical parasitic torque and drawing +38A.',
      leadLag: 'Motor load climbed steadily as bearing thermal gradient deepened',
      direction: 'unidirectional'
    },
    {
      source: 'vibration',
      target: 'operatingSpeed',
      strength: 0.52,
      label: 'Resonant Harmonic Boundary Proximity',
      mechanism: 'Operating at 11,420 RPM places 0.44X sub-synchronous excitation near first rotor critical bend mode (83.7 Hz vs 85.0 Hz natural frequency).',
      leadLag: 'Speed setpoint maintained by steam governor; amplifies whirl resonance',
      direction: 'unidirectional'
    }
  ];

  // Active links for selected factor
  const activeLinks = correlationLinks.filter(
    l => !selectedFactor || l.source === selectedFactor || l.target === selectedFactor
  );

  return (
    <div className="space-y-4">
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Multi-Signal Physics Correlation Graph
          </h3>
          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            5 State Variables Mapped
          </span>
        </div>
        <span className="text-xs text-zinc-400 font-mono-tech">
          Temporal Cross-Correlation Sampling: 100 Hz Sync
        </span>
      </div>

      {/* Signal Badges Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {factors.map(factor => {
          const isSelected = selectedFactor === factor.id;
          const Icon = factor.icon;

          return (
            <button
              key={factor.id}
              onClick={() => setSelectedFactor(isSelected ? null : factor.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected 
                  ? `${factor.bgClass} ${factor.borderClass} ring-1 ring-amber-400/40 shadow-lg` 
                  : 'bg-[#10141b] border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-1.5 rounded-lg ${factor.bgClass} ${factor.textClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-xs font-mono-tech font-bold ${factor.textClass}`}>
                  {factor.currentDeviation}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-white truncate">{factor.name}</div>
                <div className="text-[10px] font-mono-tech text-zinc-400 truncate mt-0.5">
                  {factor.actual}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Visual Graph & Flow Canvas */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0d13] border border-white/[0.08] relative overflow-hidden">
        <div className="text-xs font-mono-tech uppercase text-zinc-400 mb-3 flex items-center justify-between">
          <span>Observed Causal Signal Relationships</span>
          <span className="text-amber-400 text-[10px]">
            {selectedFactor ? `Filtering connections for: ${factors.find(f => f.id === selectedFactor)?.name}` : 'Click any signal above to isolate its causal web'}
          </span>
        </div>

        {/* Dynamic Correlation Links List */}
        <div className="space-y-2.5">
          {activeLinks.map((link, idx) => {
            const srcFactor = factors.find(f => f.id === link.source)!;
            const tgtFactor = factors.find(f => f.id === link.target)!;
            const isHovered = hoveredLink === link;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isHovered 
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-md' 
                    : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono-tech font-bold ${srcFactor.bgClass} ${srcFactor.textClass} border ${srcFactor.borderClass}`}>
                      {srcFactor.name} ({srcFactor.currentDeviation})
                    </span>

                    <span className="text-zinc-500 font-mono-tech text-xs flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono-tech font-bold ${tgtFactor.bgClass} ${tgtFactor.textClass} border ${tgtFactor.borderClass}`}>
                      {tgtFactor.name} ({tgtFactor.currentDeviation})
                    </span>

                    <span className="text-xs font-bold text-white ml-1">
                      {link.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Pearson r</div>
                      <div className="text-xs font-mono-tech font-bold text-amber-300">
                        r = {link.strength.toFixed(2)}
                      </div>
                    </div>
                    {/* Visual Strength Bar */}
                    <div className="w-16 bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${link.strength * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Mechanism Description & Temporal Lead */}
                <div className="mt-2.5 pt-2 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                  <p className="md:col-span-8 text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-200">Physical Coupling:</strong> {link.mechanism}
                  </p>
                  <div className="md:col-span-4 text-[11px] font-mono-tech text-amber-300/90 flex items-center justify-start md:justify-end gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>{link.leadLag}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Insight Footer */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300 leading-relaxed">
            <span className="font-bold text-amber-300 font-mono-tech">Hydrodynamic Vector Analysis:</span> High cross-correlation (r=0.94) indicates that the primary precipitating disturbance was hydraulic (lubrication header restriction), which consequently led to localized thermal build-up and structural vibration whip.
          </div>
        </div>
      </div>
    </div>
  );
};
