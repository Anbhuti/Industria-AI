import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Radio, 
  Clock, 
  FileText, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Wrench, 
  Sparkles 
} from 'lucide-react';

interface InvestigationTimelineProps {
  currentStep: number;
  stepsCompleted: boolean[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export const INVESTIGATION_STEPS = [
  {
    step: 1,
    title: 'Incident Ingestion',
    subtitle: 'High-frequency telemetry trigger',
    icon: ShieldAlert
  },
  {
    step: 2,
    title: 'Wavelet Decomposition',
    subtitle: 'Sub-synchronous frequency audit',
    icon: Activity
  },
  {
    step: 3,
    title: 'Sensor Correlation',
    subtitle: 'Cross-parameter thermodynamic links',
    icon: Layers
  },
  {
    step: 4,
    title: '5-Whys Root Cause',
    subtitle: 'Physical causal attribution',
    icon: Sparkles
  },
  {
    step: 5,
    title: 'Safe Operating Limits',
    subtitle: 'Speed & throughput throttling',
    icon: Radio
  },
  {
    step: 6,
    title: 'CAPA Action Plan',
    subtitle: 'Turnaround work orders & SAP PM',
    icon: Wrench
  },
  {
    step: 7,
    title: 'Compliance Dossier',
    subtitle: 'ISO 14224 formal sign-off',
    icon: FileText
  }
];

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({
  currentStep,
  stepsCompleted,
  onStepClick,
  className = ''
}) => {
  return (
    <div className={`p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-white tracking-tight">
            Root Cause Investigation Protocol
          </h4>
        </div>
        <span className="text-xs font-mono-tech text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold">
          STEP {currentStep} OF 7
        </span>
      </div>

      {/* Responsive Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {INVESTIGATION_STEPS.map((s, idx) => {
          const isCompleted = stepsCompleted[idx];
          const isCurrent = currentStep === s.step;
          const Icon = s.icon;

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => onStepClick && onStepClick(s.step)}
              className={`p-3 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between relative ${
                isCurrent
                  ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-emerald-950/20 text-white'
                  : isCompleted
                  ? 'border-zinc-700/80 bg-zinc-900/80 text-zinc-300 hover:border-zinc-600'
                  : 'border-zinc-800/60 bg-zinc-950/40 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded ${
                  isCurrent 
                    ? 'bg-emerald-500 text-zinc-950' 
                    : isCompleted 
                    ? 'bg-zinc-700 text-zinc-200' 
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  0{s.step}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <p className="text-xs font-semibold truncate leading-tight">
                    {s.title}
                  </p>
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed font-mono-tech">
                  {s.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
