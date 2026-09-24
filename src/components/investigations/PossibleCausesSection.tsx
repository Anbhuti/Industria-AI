import React, { useState } from 'react';
import { 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  Info, 
  Wrench, 
  ArrowRight,
  TrendingUp,
  FileQuestion
} from 'lucide-react';

export interface PossibleCauseItem {
  id: string;
  rank: number;
  title: string;
  category: string;
  probabilityScore: number; // 0 - 100
  confidenceInterval: string;
  hypothesisRationale: string;
  telemetryAlignment: string[];
  keyInconsistencies?: string[];
  relatedSignals?: string[];
  recommendedCheck: string;
}

export const PossibleCausesSection: React.FC<{
  onSelectCauseForNova?: (cause: PossibleCauseItem) => void;
}> = ({ onSelectCauseForNova }) => {
  const [selectedCauseId, setSelectedCauseId] = useState<string>('01');

  const hypotheses: PossibleCauseItem[] = [
    {
      id: '01',
      rank: 1,
      title: 'Bearing Degradation',
      category: 'Mechanical / Hydrodynamic Sub-Assembly',
      probabilityScore: 78,
      confidenceInterval: '68% – 84%',
      hypothesisRationale: 'Tilt-pad journal bearing hydrodynamic oil wedge collapsed under elevated viscous friction. Rapid rise in sub-synchronous vibration (0.44X running frequency) aligns with fluid-film instability and babbitt metal thermal fatigue.',
      telemetryAlignment: [
        'Vibration velocity increased +28% (5.76 mm/s RMS vs 4.5 mm/s limit)',
        'Duplex RTD logged +14% thermal surge to 82.1°C',
        'FFT spectral signature shows 0.44X oil whirl peak'
      ],
      keyInconsistencies: [
        'No metal particulate shavings found in magnetic plug scan (yet)',
        'Non-drive-end bearing remains nominal (1.4 mm/s)'
      ],
      relatedSignals: [
        'ACC-DE-01 (Drive-End Vibration Accelerometer)',
        'TE-204B (Duplex RTD Journal Temperature)',
        'FFT-C204 (High-Frequency Spectral FFT Peak)'
      ],
      recommendedCheck: 'Conduct borescope inspection of tilt-pad shoes and measure radial clearance with feeler gauges.'
    },
    {
      id: '02',
      rank: 2,
      title: 'Lubrication Degradation',
      category: 'Fluid Mechanics & Filtration System',
      probabilityScore: 64,
      confidenceInterval: '54% – 72%',
      hypothesisRationale: 'Pre-filter cartridge restriction caused a -8% pressure loss across header (down to 2.94 bar). Reduced volumetric flow starved the wedge zone of fresh cooling oil, initiating thermal run-away.',
      telemetryAlignment: [
        'Lubrication pressure dropped -8% (leading vibration by 18 min)',
        'Differential pressure across pre-filter HEX-204 spiked +1.4 bar',
        'Lube oil viscosity shifted to ISO VG 46 boundary'
      ],
      keyInconsistencies: [
        'Lube oil temperature into skid remained within 44°C setpoint'
      ],
      relatedSignals: [
        'PT-LO-204 (Lube Oil Supply Header Pressure)',
        'DPT-FLT-204 (Pre-Filter Differential Pressure)',
        'TE-LO-IN (Oil Skid Ingress Thermocouple)'
      ],
      recommendedCheck: 'Perform emergency backwash or cartridge switchover on dual basket filter HEX-204.'
    },
    {
      id: '03',
      rank: 3,
      title: 'Misalignment',
      category: 'Rotor-Shaft Dynamic Coupling',
      probabilityScore: 38,
      confidenceInterval: '28% – 46%',
      hypothesisRationale: 'Differential thermal growth between synthesis compressor casing and electric drive motor could introduce angular or offset misalignment across the flexible disc coupling pack.',
      telemetryAlignment: [
        '2X rotational frequency harmonic elevated to 1.12 mm/s',
        'Motor Phase B current increased +11% under added parasitic load'
      ],
      keyInconsistencies: [
        'Predominant vibration spike is sub-synchronous (0.44X), not 2X',
        'Radial phase angle delta remains within 22 degrees across coupling'
      ],
      relatedSignals: [
        'PROX-CP-01 (Coupling Proximity Radial Probe)',
        'CT-STATOR-PHB (Drive Motor Phase B Current Transformer)',
        'ACC-AX-01 (Axial Casing Accelerometer)'
      ],
      recommendedCheck: 'Execute laser alignment survey across flexible disc pack coupling at operating temperature.'
    },
    {
      id: '04',
      rank: 4,
      title: 'Excessive Operating Load',
      category: 'Process Aerodynamics & Throughput',
      probabilityScore: 24,
      confidenceInterval: '16% – 32%',
      hypothesisRationale: 'Process gas molar mass variation or surge-line throttling pushing stage impellers into aerodynamic stall, causing acoustic vortex whistling and motor current draw.',
      telemetryAlignment: [
        'Motor load climbed +11% to 384 A',
        'Discharge pressure fluctuated ±2.2 bar during shift handover'
      ],
      keyInconsistencies: [
        'Rotor speed remained governed at 11,420 RPM without hunting',
        'Suction gas temperature and density remained steady within 2.4%'
      ],
      relatedSignals: [
        'KW-MOTOR-01 (Variable Frequency Drive Power Monitor)',
        'PT-DISCH-01 (High-Pressure Stage Discharge Gauge)',
        'SPD-TACH-01 (Rotor Magnetic Tachometer)'
      ],
      recommendedCheck: 'Review SCADA gas composition chromatograph for heavier hydrocarbon fraction transients.'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header with Mandatory Disclaimers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              AI-Generated Hypothesis Ranking (Possible Causes)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
              AI-GENERATED HYPOTHESES
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Probabilistic root-cause candidates ranked by multi-signal correlation. Not confirmed causes — human engineering verification required.
          </p>
        </div>

        {/* Essential Scientific Uncertainty Notice */}
        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono-tech text-amber-300 flex items-center gap-2 shrink-0">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Hypotheses — Not Factual Certainty</span>
        </div>
      </div>

      {/* Uncertainty Notice Box */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-zinc-200">Probability Disclaimer:</strong> Probability indicators represent probabilistic statistical likelihoods derived from telemetry vector matching, not empirical absolute certainty. Field maintenance teams must execute physical physical verification checks prior to mechanical teardown.
        </div>
      </div>

      {/* 4 Hypotheses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {hypotheses.map(hypo => {
          const isSelected = selectedCauseId === hypo.id;
          const probColor = hypo.probabilityScore >= 70 
            ? 'text-rose-400' 
            : hypo.probabilityScore >= 50 
            ? 'text-amber-400' 
            : 'text-zinc-400';

          const probBg = hypo.probabilityScore >= 70 
            ? 'bg-rose-500' 
            : hypo.probabilityScore >= 50 
            ? 'bg-amber-400' 
            : 'bg-zinc-500';

          return (
            <div
              key={hypo.id}
              onClick={() => setSelectedCauseId(hypo.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? 'bg-[#131722] border-amber-500/40 ring-1 ring-amber-500/30 shadow-xl' 
                  : 'bg-[#0f131a] border-white/[0.06] hover:border-white/[0.12] hover:bg-[#111620]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                  <span className="text-xs font-mono-tech font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    CAUSE {hypo.id}
                  </span>
                  <span className="text-[10px] font-mono-tech text-zinc-400">
                    Rank #{hypo.rank}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mt-3 leading-tight">
                  {hypo.title}
                </h4>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                  {hypo.category}
                </div>

                {/* Probability Indicator Gauge */}
                <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono-tech uppercase text-zinc-400">
                      Hypothesis Likelihood
                    </span>
                    <span className={`text-xl font-black font-mono-tech ${probColor}`}>
                      {hypo.probabilityScore}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${probBg}`}
                      style={{ width: `${hypo.probabilityScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 mt-2">
                    <span>95% CI:</span>
                    <span className="text-zinc-300 font-semibold">{hypo.confidenceInterval}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 mt-3 leading-relaxed line-clamp-3">
                  {hypo.hypothesisRationale}
                </p>
              </div>

              {/* Recommended Physical Verification */}
              <div className="pt-3 border-t border-white/[0.05] mt-4 space-y-2">
                <div className="text-[10px] font-mono-tech uppercase text-amber-300 flex items-center gap-1.5">
                  <Wrench className="w-3 h-3" />
                  <span>Physical Check</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  {hypo.recommendedCheck}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Drawer for Selected Cause */}
      {selectedCauseId && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-3">
          {(() => {
            const current = hypotheses.find(h => h.id === selectedCauseId)!;
            return (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-tech font-bold text-amber-400">
                      Deep Dive: Hypothesis #{current.id} — {current.title}
                    </span>
                    <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                      Confidence Interval: {current.confidenceInterval}
                    </span>
                  </div>
                  {onSelectCauseForNova && (
                    <button
                      onClick={() => onSelectCauseForNova(current)}
                      className="text-xs font-mono-tech text-amber-300 hover:text-amber-200 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ask NOVA to Expand</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* 1. Supporting Evidence */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                    <div className="text-[10px] font-mono-tech uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" />
                      <span>Supporting Evidence</span>
                    </div>
                    <ul className="space-y-1.5 text-zinc-300 list-disc pl-4">
                      {current.telemetryAlignment.map((sig, i) => (
                        <li key={i}>{sig}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 2. Contradicting Evidence */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                    <div className="text-[10px] font-mono-tech uppercase text-amber-400 font-bold flex items-center gap-1.5">
                      <FileQuestion className="w-3 h-3" />
                      <span>Contradicting Evidence</span>
                    </div>
                    <ul className="space-y-1.5 text-zinc-300 list-disc pl-4">
                      {current.keyInconsistencies && current.keyInconsistencies.length > 0 ? (
                        current.keyInconsistencies.map((inc, i) => (
                          <li key={i}>{inc}</li>
                        ))
                      ) : (
                        <li>No significant contradicting telemetry recorded.</li>
                      )}
                    </ul>
                  </div>

                  {/* 3. Related Sensor Signals */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                    <div className="text-[10px] font-mono-tech uppercase text-sky-400 font-bold flex items-center gap-1.5">
                      <Layers className="w-3 h-3" />
                      <span>Related Sensor Signals</span>
                    </div>
                    <ul className="space-y-1.5 text-zinc-300 list-disc pl-4 font-mono-tech text-[11px]">
                      {(current.relatedSignals || [
                        'ACC-DE-01 (Drive-End Vibration Accelerometer)',
                        'TE-204B (Duplex RTD Journal Temperature)'
                      ]).map((sig, i) => (
                        <li key={i}>{sig}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 4. Recommended Verification Step */}
                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <div className="text-[10px] font-mono-tech uppercase text-amber-300 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" />
                      <span>Recommended Verification Step</span>
                    </div>
                    <p className="text-zinc-200 leading-relaxed font-medium">
                      {current.recommendedCheck}
                    </p>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
