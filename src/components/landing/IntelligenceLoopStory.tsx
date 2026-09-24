import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  GitMerge, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sliders,
  Layers,
  Zap,
  Gauge
} from 'lucide-react';

export const IntelligenceLoopStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: '01',
      title: 'Millisecond Edge Ingestion',
      category: 'HIGH-FREQUENCY SCADA ACQUISITION',
      icon: Radio,
      headline: 'Continuous 10 kHz signal sampling across 32 rotating trains.',
      description: 'Raw high-frequency vibration velocity, triaxial acceleration, journal bearing RTDs, and lube header pressure are streamed through local edge gateways without cloud latency.',
      metricLabel: 'Telemetry Ingestion Rate',
      metricValue: '14,800 Pts / Sec',
      status: 'IEC 62443 Certified',
      badgeColor: 'emerald'
    },
    {
      id: '02',
      title: 'Physics-Informed Anomaly Detection',
      category: 'PINN NEURAL KINETICS',
      icon: Cpu,
      headline: 'Detecting fatigue kinetics weeks before mechanical seizure.',
      description: 'Rather than black-box statistical heuristics, our Physics-Informed Neural Networks model hydrodynamic Navier-Stokes equations and oil-film shear to pinpoint true micro-spalling.',
      metricLabel: 'Model Confidence',
      metricValue: '99.4% Physical Fit',
      status: 'API 670 Standard',
      badgeColor: 'amber'
    },
    {
      id: '03',
      title: 'Multi-Sensor Causal Correlation',
      category: 'PEARSON MATRIX REASONING',
      icon: GitMerge,
      headline: 'Eliminating false alarms by cross-correlating thermodynamics.',
      description: 'Automatically proves that a vibration surge (+28%) is mechanically coupled to a lube pressure drop (-8%), distinguishing real bearing wear from baseline process noise.',
      metricLabel: 'Correlation Coefficient',
      metricValue: 'r = -0.89 (High)',
      status: 'Verified Invariant',
      badgeColor: 'sky'
    },
    {
      id: '04',
      title: 'Autonomous Operational Mitigation',
      category: 'DYNAMIC ASSET PROTECTION',
      icon: ShieldCheck,
      headline: 'Preserving uptime with intelligent operational throttling.',
      description: 'NOVA calculates that an 8% load reduction extends safe operating life by +14 days, scheduling replacement during normal planned shifts and avoiding catastrophic emergency trips.',
      metricLabel: 'Avoided Emergency Downtime',
      metricValue: '$68,400 Saved / Incident',
      status: 'Zero Production Trips',
      badgeColor: 'amber'
    }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Step Navigation Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const isSelected = idx === activeStep;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#141924] border-amber-500/60 shadow-xl'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
              )}
              
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-mono-tech font-bold ${
                  isSelected ? 'text-amber-400' : 'text-zinc-400'
                }`}>
                  STEP {step.id}
                </span>
                <div className={`p-2 rounded-xl ${
                  isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-white/[0.04] text-zinc-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className={`text-xs sm:text-sm font-bold leading-snug ${
                  isSelected ? 'text-white' : 'text-zinc-300'
                }`}>
                  {step.title}
                </div>
                <div className="text-[11px] font-mono-tech text-zinc-400 mt-1">
                  {step.category}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Content Stage */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#0e121a] border border-white/[0.08] relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono-tech text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{steps[activeStep].category}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {steps[activeStep].headline}
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {steps[activeStep].description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] font-mono-tech">
                <div className="text-[10px] text-zinc-400 uppercase">{steps[activeStep].metricLabel}</div>
                <div className="text-lg font-extrabold text-amber-400 mt-0.5">{steps[activeStep].metricValue}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] font-mono-tech">
                <div className="text-[10px] text-zinc-400 uppercase">Compliance Standard</div>
                <div className="text-lg font-bold text-zinc-200 mt-0.5">{steps[activeStep].status}</div>
              </div>
            </div>
          </div>

          {/* Right Visual Animation Panel */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090c10] border border-white/[0.06] flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400 pb-2 border-b border-white/[0.06]">
              <span>DIAGNOSTIC PIPELINE FLOW</span>
              <span className="text-amber-400">STEP {activeStep + 1} OF 4</span>
            </div>

            {/* Interactive Progress Graphic */}
            <div className="space-y-3 py-2">
              {steps.map((s, i) => (
                <div 
                  key={s.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    i === activeStep
                      ? 'bg-amber-500/10 border-amber-500/40 text-white'
                      : i < activeStep
                      ? 'bg-white/[0.02] border-white/[0.06] text-zinc-400'
                      : 'bg-transparent border-transparent text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[10px] font-mono-tech flex items-center justify-center font-bold">
                      {s.id}
                    </span>
                    <span className="text-xs font-medium">{s.title}</span>
                  </div>
                  {i <= activeStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  )}
                </div>
              ))}
            </div>

            <div className="text-[11px] text-zinc-400 font-mono-tech pt-2 border-t border-white/[0.06]">
              Engineered with zero-drift telemetry persistence and real-time neural inference.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
