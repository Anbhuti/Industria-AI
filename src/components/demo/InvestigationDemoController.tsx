/**
 * ============================================================================
 * INDUSTRIX AI // ONE-CLICK AI INVESTIGATION DEMO CONTROLLER
 * ============================================================================
 * 
 * Implements Section 18: "ONE-CLICK AI INVESTIGATION DEMO"
 * Walks through the full 11-step portfolio presentation:
 * 
 * 1. Plant appears normal
 * 2. Anomaly is detected
 * 3. C-204 becomes high priority
 * 4. Nova announces the anomaly
 * 5. Machine details open
 * 6. Sensor trends appear
 * 7. Investigation begins
 * 8. Signals are correlated
 * 9. AI hypotheses appear
 * 10. Recommended actions appear
 * 11. Report is generated
 * 
 * Provides automated sequence, manual step scrubbing, and voice narration.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Volume2, 
  VolumeX,
  ChevronRight,
  RotateCcw,
  Sliders,
  FileText,
  Layers,
  Gauge
} from 'lucide-react';
import { AppRoute, IndustrialMachine } from '../../types/industrial';
import { novaVoiceService } from '../../services/novaVoiceService';

export interface InvestigationDemoControllerProps {
  isActive: boolean;
  onClose: () => void;
  onNavigate: (route: AppRoute) => void;
  onSelectMachine: (machineId: string) => void;
}

export interface DemoStep {
  index: number; // 1 - 11
  name: string;
  badge: string;
  route: AppRoute;
  narration: string;
  durationSeconds: number;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    index: 1,
    name: 'Plant Status Nominal',
    badge: '1. NORMAL',
    route: '/dashboard',
    narration: "Facility telemetry mesh initialized. Supervisory SCADA status is nominal across all 150+ fleet units.",
    durationSeconds: 4
  },
  {
    index: 2,
    name: 'Telemetry Anomaly Detected',
    badge: '2. ANOMALY',
    route: '/dashboard',
    narration: "Dynamic telemetry excursion logged. Sensor nodes detect anomalous vibration signature diverging from baseline.",
    durationSeconds: 4
  },
  {
    index: 3,
    name: 'Compressor C-204 High Priority',
    badge: '3. C-204 CRITICAL',
    route: '/dashboard',
    narration: "Compressor C-204 prioritized to Critical Status. Drive-end vibration velocity reaches 5.76 mm/s RMS (+28%).",
    durationSeconds: 4
  },
  {
    index: 4,
    name: 'NOVA Anomaly Announcement',
    badge: '4. NOVA ANNOUNCE',
    route: '/dashboard',
    narration: "High-priority anomaly detected on Compressor C-204. Drive-end vibration velocity has exceeded ISO Zone B limit by 28% with simultaneous thermal drift. Opening telemetry diagnostics.",
    durationSeconds: 6
  },
  {
    index: 5,
    name: 'Machine Asset Details Opened',
    badge: '5. MACHINE DETAIL',
    route: '/machines',
    narration: "Navigating to Compressor C-204 asset register and mechanical subsystem health architecture.",
    durationSeconds: 4
  },
  {
    index: 6,
    name: 'Multi-Sensor Trends Correlated',
    badge: '6. SENSOR TRENDS',
    route: '/machines',
    narration: "Analyzing 24-hour multi-sensor trends: Vibration (+28%), Bearing Metal (+14%), Lube Header (-8%), Motor Current (+11%).",
    durationSeconds: 5
  },
  {
    index: 7,
    name: 'Investigation Workflow Initialized',
    badge: '7. INVESTIGATION',
    route: '/investigations',
    narration: "Root-cause investigation session initialized for Incident INC-2026-C204. Establishing incident timeline.",
    durationSeconds: 4
  },
  {
    index: 8,
    name: 'Signals Temporal Correlation Matrix',
    badge: '8. SIGNALS CORRELATED',
    route: '/investigations',
    narration: "Multi-signal cross-correlation calculated. Telemetry confirms lubrication pressure dropped 18 minutes prior to vibration rise.",
    durationSeconds: 5
  },
  {
    index: 9,
    name: 'AI Hypotheses Ranked',
    badge: '9. AI HYPOTHESES',
    route: '/investigations',
    narration: "AI-generated hypotheses ranked: Bearing Degradation at 78% probability, Lubrication Degradation at 64%.",
    durationSeconds: 5
  },
  {
    index: 10,
    name: 'Prescriptive Action Dispatched',
    badge: '10. RECOMMENDED ACTION',
    route: '/investigations',
    narration: "Prescriptive mitigation generated: Verify duplex lube filter differential pressure and inspect tilt-pad radial clearances.",
    durationSeconds: 5
  },
  {
    index: 11,
    name: 'Engineering RCA Report Generated',
    badge: '11. REPORT GENERATED',
    route: '/reports',
    narration: "Regulatory Root Cause Engineering Report RPT-2026-C204-01 compiled and ready for operational sign-off.",
    durationSeconds: 6
  }
];

export const InvestigationDemoController: React.FC<InvestigationDemoControllerProps> = ({
  isActive,
  onClose,
  onNavigate,
  onSelectMachine
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(novaVoiceService.getMuted());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = DEMO_STEPS[currentStepIndex - 1] || DEMO_STEPS[0];

  // Execute step state mutations
  const executeStep = (stepNum: number) => {
    const step = DEMO_STEPS[stepNum - 1];
    if (!step) return;

    // 1. Navigate to target route
    onNavigate(step.route);

    // 2. Specialized step actions
    if (stepNum >= 5 && stepNum <= 6) {
      onSelectMachine('C-204');
    }

    if (stepNum === 7) {
      window.dispatchEvent(new CustomEvent('nova:start-investigation', { detail: { step: 1 } }));
    } else if (stepNum === 8) {
      window.dispatchEvent(new CustomEvent('nova:start-investigation', { detail: { step: 3 } }));
    } else if (stepNum === 9) {
      window.dispatchEvent(new CustomEvent('nova:start-investigation', { detail: { step: 4 } }));
    } else if (stepNum === 10) {
      window.dispatchEvent(new CustomEvent('nova:start-investigation', { detail: { step: 6 } }));
    } else if (stepNum === 11) {
      window.dispatchEvent(new CustomEvent('nova:open-report'));
    }

    // 3. Voice narration
    if (!novaVoiceService.getMuted()) {
      novaVoiceService.speak(step.narration);
    }
  };

  // When step changes, trigger execution and reset countdown
  useEffect(() => {
    if (!isActive) return;
    executeStep(currentStepIndex);
    setSecondsRemaining(currentStep.durationSeconds);
  }, [currentStepIndex, isActive]);

  // Interval timer for auto-play
  useEffect(() => {
    if (!isActive || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          if (currentStepIndex < 11) {
            setCurrentStepIndex(curr => curr + 1);
          } else {
            // Reached end of presentation
            setIsPlaying(false);
          }
          return currentStep.durationSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPlaying, currentStepIndex]);

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleNext = () => {
    if (currentStepIndex < 11) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 1) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(1);
    setIsPlaying(true);
  };

  const handleToggleMute = () => {
    const next = !isVoiceMuted;
    setIsVoiceMuted(next);
    novaVoiceService.setMuted(next);
    if (next) {
      novaVoiceService.stop();
    } else {
      novaVoiceService.speak(currentStep.narration);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl font-['Plus_Jakarta_Sans',sans-serif] animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl bg-[#0c1017]/95 border border-amber-500/40 p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-white space-y-3.5">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-tight text-white">
                  ONE-CLICK AI INVESTIGATION DEMO
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Step {currentStepIndex} of 11
                </span>
              </div>
              <div className="text-[11px] font-mono-tech text-zinc-400">
                {currentStep.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {/* Voice Mute/Unmute */}
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-2 rounded-lg border transition-colors ${
                isVoiceMuted 
                  ? 'bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:text-white' 
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
              title={isVoiceMuted ? "Unmute NOVA narration" : "Mute NOVA narration"}
            >
              {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Restart */}
            <button
              type="button"
              onClick={handleRestart}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white transition-colors"
              title="Restart Demo from Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={() => {
                novaVoiceService.stop();
                onClose();
              }}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 border border-white/[0.08] hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-colors"
              title="Exit Demo Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Step Spoken Narration */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
          <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-200 leading-relaxed font-mono-tech">
            <strong className="text-amber-400 font-semibold uppercase">NOVA Narration: </strong>
            {currentStep.narration}
          </div>
        </div>

        {/* Step Progress Visualizer (11 Steps) */}
        <div className="grid grid-cols-11 gap-1">
          {DEMO_STEPS.map((s) => {
            const isCompleted = s.index < currentStepIndex;
            const isCurrent = s.index === currentStepIndex;
            return (
              <button
                key={s.index}
                type="button"
                onClick={() => setCurrentStepIndex(s.index)}
                className={`h-2 rounded-full transition-all ${
                  isCurrent 
                    ? 'bg-amber-400 shadow-md shadow-amber-400/50 scale-y-125' 
                    : isCompleted 
                    ? 'bg-emerald-500/80 hover:bg-emerald-400' 
                    : 'bg-white/[0.1] hover:bg-white/[0.2]'
                }`}
                title={`Step ${s.index}: ${s.name}`}
              />
            );
          })}
        </div>

        {/* Bottom Playback Controls */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="text-[11px] font-mono-tech text-zinc-400">
            {isPlaying ? (
              <span>Next step in <strong className="text-amber-300">{secondsRemaining}s</strong></span>
            ) : (
              <span className="text-amber-400">Paused (Manual Scrubbing)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStepIndex <= 1}
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-40 disabled:pointer-events-none border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStepIndex >= 11}
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-40 disabled:pointer-events-none border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
