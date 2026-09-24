import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  FileText, 
  RotateCcw, 
  Activity, 
  ShieldCheck, 
  User, 
  Building2,
  Calendar,
  AlertOctagon,
  ArrowRight,
  Play,
  Volume2,
  Square,
  MessageSquare,
  Wrench,
  Layers,
  Thermometer,
  Droplets,
  Zap,
  Gauge,
  Info,
  HelpCircle,
  Network
} from 'lucide-react';
import { IncidentInvestigation, AppRoute, IndustrialMachine } from '../../types/industrial';
import { INITIAL_INCIDENTS } from '../../data/industrialData';
import { NovaAvatar } from '../nova/NovaAvatar';
import { NovaExpression } from '../../types/nova';
import { novaVoiceService } from '../../services/novaVoiceService';
import { NovaVoiceSettingsModal } from '../nova/NovaVoiceSettingsModal';
import { InvestigationTimeline } from '../investigations/InvestigationTimeline';
import { SignalCorrelationMatrix } from '../investigations/SignalCorrelationMatrix';
import { PossibleCausesSection, PossibleCauseItem } from '../investigations/PossibleCausesSection';
import { NovaReasoningPanel } from '../investigations/NovaReasoningPanel';
import { InvestigationReportModal } from '../investigations/InvestigationReportModal';
import { MaintenanceTaskModal } from '../machines/MaintenanceTaskModal';

interface InvestigationsViewProps {
  onNavigate: (route: AppRoute) => void;
  onAskNovaWithMachine?: (machine: IndustrialMachine, prompt?: string) => void;
  machines?: IndustrialMachine[];
}

export type InvestigationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({ 
  onNavigate,
  onAskNovaWithMachine,
  machines = []
}) => {
  // Current active step in the 7-step investigation workflow
  const [activeStep, setActiveStep] = useState<InvestigationStep>(1);
  const [selectedIncident, setSelectedIncident] = useState<IncidentInvestigation>(INITIAL_INCIDENTS[0]);
  const [isReinvestigating, setIsReinvestigating] = useState(false);
  const [expression, setExpression] = useState<NovaExpression>('warning');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpeakingBriefing, setIsSpeakingBriefing] = useState(false);
  
  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  // Target machine object for C-204
  const c204Machine: IndustrialMachine = machines.find(m => m.id === 'C-204') || {
    id: 'C-204',
    name: 'Compressor C-204',
    type: 'Centrifugal Turbocompressor',
    tag: 'CMP-HP-204A',
    plantArea: 'Synthesis Gas Section — Train B',
    location: 'Production Line A',
    criticality: 'Tier 1 Critical',
    healthScore: 68,
    status: 'critical',
    risk: 'HIGH',
    runtimeHours: 4280,
    operatingLoadPct: 88,
    energyKW: 1840,
    novaInsight: 'Vibration pattern increased gradually during last 6 operating cycles. Drive-end tilt-pad sub-synchronous fluid whirl observed at 0.44X running frequency.',
    metrics: {
      vibrationRMS: 5.76,
      bearingTemp: 82.1,
      suctionPressure: 34.8,
      dischargePressure: 182.4,
      rotorRPM: 11420,
      lubeOilNAS: 7,
      acousticDB: 96.4,
      motorCurrent: 384
    },
    rulDays: 14,
    mtbfHours: 4280,
    lastOverhaul: '2025-11-14',
    nextScheduledService: '2026-10-15',
    alarm: 'HIGH SEVERITY: Drive-end tilt-pad vibration surge to 5.76 mm/s RMS (ISO Zone B limit exceeded by +28%)',
    oem: 'Sulzer-Siemens Industrial Turbomachinery',
    model: 'SGT-400 / STC-SV (12 MW)',
    components: [
      { name: 'Drive-End Tilt Pad Bearing', health: 54, status: 'critical', detail: 'Sub-synchronous fluid whirl observed at 0.44X running frequency' },
      { name: 'Lube Oil Skid HEX-204', health: 62, status: 'warning', detail: 'Differential pressure elevated across pre-filter cartridge' }
    ]
  };

  // Set NOVA expression to match incident severity
  useEffect(() => {
    if (activeStep >= 5) {
      setExpression('analysis');
    } else {
      setExpression('warning');
    }
  }, [activeStep]);

  // Listen to Copilot triggers from NOVA voice/text commands
  useEffect(() => {
    const handleOpenReport = () => {
      setIsReportModalOpen(true);
    };

    const handleStartInvestigation = (e: any) => {
      if (e?.detail?.step) {
        setActiveStep(e.detail.step as InvestigationStep);
      } else {
        setActiveStep(3);
      }
    };

    window.addEventListener('nova:open-report', handleOpenReport);
    window.addEventListener('nova:start-investigation', handleStartInvestigation);

    return () => {
      window.removeEventListener('nova:open-report', handleOpenReport);
      window.removeEventListener('nova:start-investigation', handleStartInvestigation);
    };
  }, []);

  const handleDeliverVerbalBriefing = () => {
    setIsSpeakingBriefing(true);
    setExpression('warning');

    const briefing = `Delivering root cause briefing for Incident on Compressor C-204. Timestamp: 20 September 2026, 22:31 UTC. Severity: HIGH. Problem: Abnormal vibration detected. Multi-signal analysis indicates vibration increased by 28 percent, bearing temperature increased by 14 percent, lubrication pressure fell by 8 percent, and motor load rose by 11 percent. NOVA identified a temporal relationship: lubrication pressure decline occurred 18 minutes prior to the vibration surge, indicating hydrodynamic fluid film breakdown.`;

    novaVoiceService.speak(briefing, () => {})
      .finally(() => setIsSpeakingBriefing(false));
  };

  const handleAskNova = (customPrompt?: string) => {
    if (onAskNovaWithMachine) {
      onAskNovaWithMachine(c204Machine, customPrompt || `Explain the root cause findings on Compressor C-204 and why lubrication pressure loss preceded the vibration surge.`);
    } else {
      onNavigate('/nova');
    }
  };

  const handleSelectCauseForNova = (cause: PossibleCauseItem) => {
    handleAskNova(`NOVA, explain in detail hypothesis #${cause.id}: ${cause.title}. Provide physical justification for its ${cause.probabilityScore}% likelihood score on Compressor C-204.`);
  };

  // 7 Workflow Steps Definition
  const steps = [
    { number: 1, label: 'STEP 01', title: 'Incident Detection', icon: AlertTriangle },
    { number: 2, label: 'STEP 02', title: 'Evidence Collection', icon: Activity },
    { number: 3, label: 'STEP 03', title: 'Signal Correlation', icon: Network },
    { number: 4, label: 'STEP 04', title: 'Root Cause Analysis', icon: Layers },
    { number: 5, label: 'STEP 05', title: 'AI Explanation', icon: Sparkles },
    { number: 6, label: 'STEP 06', title: 'Recommended Action', icon: Wrench },
    { number: 7, label: 'STEP 07', title: 'Investigation Report', icon: FileText }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Workstation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>ROOT CAUSE INVESTIGATION CONSOLE • HIGH-FIDELITY DIAGNOSTIC WORKSTATION</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Incident Root Cause Investigation Workstation
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Structured 7-step forensic diagnostic engine for rotating equipment excursions and telemetry reconstruction.
          </p>
        </div>

        {/* Global Workstation Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDeliverVerbalBriefing}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
          >
            <Volume2 className="w-3.5 h-3.5 fill-current" />
            <span>NOVA Briefing</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-white transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>View Dossier</span>
          </button>

          <button
            onClick={() => handleAskNova()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask NOVA</span>
          </button>
        </div>
      </div>

      {/* Target Incident Banner: Compressor C-204 (User Requested) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#10141c] border border-rose-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono-tech font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  INCIDENT: Compressor C-204
                </span>
                <span className="text-xs font-mono-tech text-zinc-400">
                  Timestamp: <strong className="text-white">20 Sep 2026 — 22:31</strong>
                </span>
                <span className="text-[10px] font-mono-tech uppercase font-bold px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-500/50">
                  SEVERITY: HIGH
                </span>
                <span className="text-xs font-mono-tech text-amber-400">
                  Tag: CMP-HP-204A
                </span>
              </div>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 font-mono-tech">Problem:</span>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Abnormal vibration detected (Velocity surged +28% to 5.76 mm/s RMS on Drive-End Bearing #2).
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            <span className="text-xs font-mono-tech text-zinc-400 hidden lg:inline">Quick Jump:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveStep(3)}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono-tech text-zinc-300"
              >
                Correlation
              </button>
              <button
                onClick={() => setActiveStep(4)}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono-tech text-amber-300"
              >
                Causes
              </button>
              <button
                onClick={() => setActiveStep(5)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono-tech text-amber-400"
              >
                NOVA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Step Horizontal Investigation Stepper Bar */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-2 min-w-[760px]">
          {steps.map((step) => {
            const isActive = activeStep === step.number;
            const isCompleted = activeStep > step.number;
            const Icon = step.icon;

            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(step.number as InvestigationStep)}
                className={`flex-1 p-3 rounded-xl border text-left transition-all relative ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : isCompleted
                    ? 'bg-white/[0.03] border-emerald-500/30 text-zinc-300'
                    : 'bg-[#0f131a] border-white/[0.06] text-zinc-400 hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono-tech font-bold ${
                    isActive ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-zinc-500'
                  }`}>
                    {step.label}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400 animate-pulse' : 'text-zinc-600'}`} />
                  )}
                </div>
                <div className={`text-xs font-bold mt-1.5 truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT SWITCHER */}
      
      {/* STEP 01: Incident Detection */}
      {activeStep === 1 && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e1219] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-mono-tech text-amber-400 font-bold uppercase">STEP 01: INCIDENT DETECTION & INITIAL TRIP ALARM</span>
                <h3 className="text-base font-bold text-white mt-0.5">Automated Event Identification & Telemetry Anomaly Capture</h3>
              </div>
              <span className="text-xs font-mono-tech px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                HIGH SEVERITY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Detection Time</div>
                <div className="text-base font-bold text-white font-mono-tech">20 Sep 2026 — 22:31:00 UTC</div>
                <div className="text-[10px] text-zinc-500 font-mono-tech">Latency: 24 ms to DCS Bus</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Equipment Tag</div>
                <div className="text-base font-bold text-amber-300 font-mono-tech">Compressor C-204 (CMP-HP-204A)</div>
                <div className="text-[10px] text-zinc-500 font-mono-tech">Area: Synthesis Gas Train B</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Alarm Threshold Exceeded</div>
                <div className="text-base font-bold text-rose-400 font-mono-tech">ISO 10816 Zone B (4.50 mm/s)</div>
                <div className="text-[10px] text-rose-300 font-mono-tech">Actual Peak: 5.76 mm/s (+28%)</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/[0.06] border border-rose-500/25 space-y-2">
              <h4 className="text-xs font-bold text-rose-300 font-mono-tech uppercase">Alarm Diagnostics:</h4>
              <p className="text-xs text-zinc-200 leading-relaxed">
                Accelerometer ACC-DE-01 on Drive-End Tilt-Pad Bearing #2 recorded a sudden escalation from steady baseline of 4.12 mm/s to 5.76 mm/s RMS. The DCS anti-surge system registered localized hydrodynamic vibration excursion. Centrifugal turbocompressor load was locked at 88% while automated alarm routing initiated incident docket RCA-2026-C204-VIB01.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Proceed to Step 02: Evidence Collection</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Incident Timeline Component */}
          <InvestigationTimeline />
        </div>
      )}

      {/* STEP 02: Evidence Collection (User Requested Specific Values) */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e1219] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-mono-tech text-amber-400 font-bold uppercase">STEP 02: FORENSIC EVIDENCE COLLECTION</span>
                <h3 className="text-base font-bold text-white mt-0.5">Multi-Sensor Telemetry Excursions & Baseline Divergence</h3>
              </div>
              <span className="text-xs font-mono-tech text-zinc-400">
                4 Primary Evidentiary Channels
              </span>
            </div>

            {/* Core Evidence Cards (User Requested: Vibration +28%, Bearing temp +14%, Lubrication pressure -8%, Motor load +11%) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Evidence 1: Vibration +28% */}
              <div className="p-4 rounded-xl bg-rose-500/[0.08] border border-rose-500/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech uppercase text-zinc-400">Vibration Velocity</span>
                    <Activity className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono-tech text-rose-400">+28%</span>
                    <span className="text-xs text-zinc-400 font-mono-tech">Excursion</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono-tech mt-1">
                    5.76 mm/s RMS
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono-tech mt-0.5">
                    Baseline: 4.50 mm/s ISO Zone B Limit
                  </div>
                </div>
                <div className="text-[10px] font-mono-tech text-zinc-400 pt-2 border-t border-rose-500/20">
                  Sensor: ACC-DE-01 (Drive End)
                </div>
              </div>

              {/* Evidence 2: Bearing Temperature +14% */}
              <div className="p-4 rounded-xl bg-orange-500/[0.08] border border-orange-500/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech uppercase text-zinc-400">Bearing Temperature</span>
                    <Thermometer className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono-tech text-orange-400">+14%</span>
                    <span className="text-xs text-zinc-400 font-mono-tech">Thermal Drift</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono-tech mt-1">
                    82.1°C
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono-tech mt-0.5">
                    Baseline: 72.0°C Bedplate Nominal
                  </div>
                </div>
                <div className="text-[10px] font-mono-tech text-zinc-400 pt-2 border-t border-orange-500/20">
                  Sensor: TE-204B (Duplex RTD Shoe 2)
                </div>
              </div>

              {/* Evidence 3: Lubrication Pressure -8% */}
              <div className="p-4 rounded-xl bg-sky-500/[0.08] border border-sky-500/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech uppercase text-zinc-400">Lubrication Pressure</span>
                    <Droplets className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono-tech text-sky-400">-8%</span>
                    <span className="text-xs text-zinc-400 font-mono-tech">Decay (Leading)</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono-tech mt-1">
                    2.94 bar
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono-tech mt-0.5">
                    Baseline: 3.20 bar Supply Header
                  </div>
                </div>
                <div className="text-[10px] font-mono-tech text-zinc-400 pt-2 border-t border-sky-500/20">
                  Sensor: PT-LO-204 (Header Feed)
                </div>
              </div>

              {/* Evidence 4: Motor Load +11% */}
              <div className="p-4 rounded-xl bg-purple-500/[0.08] border border-purple-500/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech uppercase text-zinc-400">Motor Load Current</span>
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono-tech text-purple-400">+11%</span>
                    <span className="text-xs text-zinc-400 font-mono-tech">Parasitic Drag</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono-tech mt-1">
                    384 A
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono-tech mt-0.5">
                    Baseline: 346 A Continuous Draw
                  </div>
                </div>
                <div className="text-[10px] font-mono-tech text-zinc-400 pt-2 border-t border-purple-500/20">
                  Sensor: CT-STATOR-PHB (Phase B CT)
                </div>
              </div>
            </div>

            {/* Evidence Narrative */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
              <h4 className="text-xs font-bold text-zinc-200 font-mono-tech uppercase">Forensic Evidence Summary:</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Evidence collection logs show that the lubrication pressure dropped from 3.20 bar down to 2.94 bar (-8%) at 22:13 UTC, approximately 18 minutes before the high vibration trip. This was followed by a +14% bearing metal thermal increase to 82.1°C, and culminating in the +28% vibration surge (5.76 mm/s RMS) and an associated +11% motor electrical current spike (384 A) caused by mechanical boundary friction.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setActiveStep(1)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] text-xs font-mono-tech text-zinc-400 hover:text-white"
              >
                ← Back to Step 01
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Proceed to Step 03: Signal Correlation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* High-Resolution Timeline */}
          <InvestigationTimeline />
        </div>
      )}

      {/* STEP 03: Signal Correlation (User Requested: Relationships between Vibration, Bearing Temperature, Lubrication, Motor Load, Operating Speed) */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <SignalCorrelationMatrix
            onAskNovaAboutCorrelation={(src, tgt) => {
              handleAskNova(`NOVA, explain the physical cross-correlation between ${src} and ${tgt} observed during the Compressor C-204 vibration event.`);
            }}
          />

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveStep(2)}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] text-xs font-mono-tech text-zinc-400 hover:text-white"
            >
              ← Back to Step 02: Evidence Collection
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Proceed to Step 04: Possible Causes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 04: Root Cause Analysis & Possible Causes */}
      {activeStep === 4 && (
        <div className="space-y-6">
          <PossibleCausesSection onSelectCauseForNova={handleSelectCauseForNova} />

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveStep(3)}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] text-xs font-mono-tech text-zinc-400 hover:text-white"
            >
              ← Back to Step 03: Correlation
            </button>
            <button
              onClick={() => setActiveStep(5)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Proceed to Step 05: AI Explanation (NOVA)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 05: AI Explanation (NOVA Analysis Panel) */}
      {activeStep === 5 && (
        <div className="space-y-6">
          <NovaReasoningPanel
            onGenerateReport={() => setIsReportModalOpen(true)}
            onCreateMaintenanceRecommendation={() => setIsMaintenanceModalOpen(true)}
            onAskNova={(prompt) => handleAskNova(prompt)}
          />

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveStep(4)}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] text-xs font-mono-tech text-zinc-400 hover:text-white"
            >
              ← Back to Step 04: Possible Causes
            </button>
            <button
              onClick={() => setActiveStep(6)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Proceed to Step 06: Recommended Action</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 06: Recommended Action (CAPA & Work Orders) */}
      {activeStep === 6 && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e1219] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-mono-tech text-amber-400 font-bold uppercase">STEP 06: RECOMMENDED ACTION & DISPATCH</span>
                <h3 className="text-base font-bold text-white mt-0.5">Corrective Maintenance Dispatch & Safeguard SOP Execution</h3>
              </div>
              <button
                onClick={() => setIsMaintenanceModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Create Maintenance Task</span>
              </button>
            </div>

            {/* Immediate Required Actions List */}
            <div className="space-y-3">
              {[
                {
                  id: 'ACT-01',
                  title: 'Inspect Bearing Condition',
                  detail: 'Conduct non-destructive ultrasonic and borescope evaluation of Drive-End Tilt-Pad Bearing #2 shoes 1-4 for babbitt smearing and thermal wiping.',
                  status: 'Immediate Action Required',
                  assignee: 'Turbomachinery Field Specialist',
                  timeEstimate: '2.5 hrs'
                },
                {
                  id: 'ACT-02',
                  title: 'Verify Lubrication System',
                  detail: 'Perform emergency cartridge switchover on dual basket filter HEX-204. Inspect cooling water inlet temperature control valve and lube pump relief setting.',
                  status: 'Immediate Action Required',
                  assignee: 'Lube Oil Technician',
                  timeEstimate: '1.0 hr'
                },
                {
                  id: 'ACT-03',
                  title: 'Check Shaft Alignment',
                  detail: 'Execute hot laser alignment survey across flexible disc pack coupling between compressor and electric motor driver.',
                  status: 'Scheduled Verification',
                  assignee: 'Vibration Analyst',
                  timeEstimate: '3.0 hrs'
                },
                {
                  id: 'ACT-04',
                  title: 'Review Recent Maintenance Activity',
                  detail: 'Cross-check CMMS records from turnaround (2025-11-14) regarding oil flushing specs and filter differential pressure calibration.',
                  status: 'Administrative Audit',
                  assignee: 'Reliability Engineer',
                  timeEstimate: '1.5 hrs'
                }
              ].map(action => (
                <div
                  key={action.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech text-amber-400 font-bold">{action.id}</span>
                      <h4 className="text-white font-bold">{action.title}</h4>
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                        {action.status}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed max-w-3xl">
                      {action.detail}
                    </p>
                    <div className="text-[10px] font-mono-tech text-zinc-500 pt-1 flex items-center gap-3">
                      <span>Owner: <strong className="text-zinc-300">{action.assignee}</strong></span>
                      <span>•</span>
                      <span>Estimated Duration: <strong className="text-zinc-300">{action.timeEstimate}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMaintenanceModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 text-xs font-mono-tech shrink-0 self-start sm:self-center"
                  >
                    Dispatch Work Order
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setActiveStep(5)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] text-xs font-mono-tech text-zinc-400 hover:text-white"
              >
                ← Back to Step 05: AI Explanation
              </button>
              <button
                onClick={() => setActiveStep(7)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Proceed to Step 07: Investigation Report</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 07: Investigation Report (Formal Dossier) */}
      {activeStep === 7 && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e1219] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-mono-tech text-amber-400 font-bold uppercase">STEP 07: FORMAL INVESTIGATION REPORT</span>
                <h3 className="text-base font-bold text-white mt-0.5">Auditable Forensic Dossier & Regulatory Sign-off</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Open Full-Screen Dossier</span>
              </button>
            </div>

            {/* Embedded Report Summary */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono-tech text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Docket Number</div>
                  <div className="text-sm font-bold text-white">RCA-2026-C204-VIB01</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase">Status</div>
                  <div className="text-sm font-bold text-emerald-400">READY FOR SIGN-OFF</div>
                </div>
              </div>

              <div className="space-y-2 text-zinc-300 font-sans">
                <p>
                  <strong>Case Summary:</strong> High-severity vibration event on Compressor C-204 at 22:31 UTC (20 Sep 2026). Multi-sensor forensic correlation proved that lubrication supply pressure decay preceded bearing metal overheating and subsequent hydrodynamic oil whirl vibration.
                </p>
                <p>
                  <strong>Validated Finding:</strong> Direct root-cause classified under Bayesian hypothesis #01 (Bearing Degradation, 78% probability) precipitated by pre-filter restriction (Hypothesis #02, 64% probability).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-[10px] text-zinc-500 uppercase">Vibration</div>
                  <div className="text-sm font-bold text-rose-400">+28% (5.76 mm/s)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-[10px] text-zinc-500 uppercase">Bearing Temp</div>
                  <div className="text-sm font-bold text-orange-400">+14% (82.1°C)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-[10px] text-zinc-500 uppercase">Lube Pressure</div>
                  <div className="text-sm font-bold text-cyan-400">-8% (2.94 bar)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-[10px] text-zinc-500 uppercase">Motor Current</div>
                  <div className="text-sm font-bold text-purple-400">+11% (384 A)</div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-3">
                <span className="text-zinc-500 text-[11px]">
                  Generated by INDUSTRIX AI Forensic Engine • ISO 10816 / API 670
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => onNavigate('/reports')}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open in Reports Hub →</span>
                  </button>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs"
                  >
                    View Official Document
                  </button>
                  <button
                    onClick={() => handleAskNova("Summarize the final incident investigation report for Compressor C-204 in bullet points.")}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 font-semibold text-xs"
                  >
                    Ask NOVA to Summarize
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setActiveStep(6)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] text-xs font-mono-tech text-zinc-400 hover:text-white"
              >
                ← Back to Step 06: Recommended Action
              </button>
              <button
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return to Step 01</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <InvestigationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        incidentId="INV-C204-01"
      />

      {/* Maintenance Task Creation Modal */}
      <MaintenanceTaskModal
        machine={c204Machine}
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
      />

      {/* Voice Settings Modal */}
      <NovaVoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
