import React from 'react';
import { 
  Sparkles, 
  CheckSquare, 
  ArrowRight, 
  Wrench, 
  FileText, 
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Volume2
} from 'lucide-react';
import { novaVoiceService } from '../../services/novaVoiceService';

interface NovaReasoningPanelProps {
  onGenerateReport: () => void;
  onCreateMaintenanceRecommendation: () => void;
  onAskNova: (prompt?: string) => void;
}

export const NovaReasoningPanel: React.FC<NovaReasoningPanelProps> = ({
  onGenerateReport,
  onCreateMaintenanceRecommendation,
  onAskNova
}) => {
  const recommendedChecks = [
    {
      id: 'chk-1',
      title: 'Inspect bearing condition',
      detail: 'Conduct borescope examination of drive-end tilt-pad shoes 1 through 4. Check for babbitt metal smearing, wiping, or fatigue pitting.',
      priority: 'CRITICAL',
      assignedTo: 'Turbomachinery Specialist'
    },
    {
      id: 'chk-2',
      title: 'Verify lubrication system',
      detail: 'Measure differential pressure across dual basket pre-filter HEX-204. Inspect cooling water inlet temperature control valve and lube pump relief setting.',
      priority: 'HIGH',
      assignedTo: 'Lube Oil Technician'
    },
    {
      id: 'chk-3',
      title: 'Check shaft alignment',
      detail: 'Perform hot laser alignment survey across flexible disc pack coupling between compressor and electric motor driver to check thermal offset growth.',
      priority: 'MEDIUM',
      assignedTo: 'Vibration Analyst'
    },
    {
      id: 'chk-4',
      title: 'Review recent maintenance activity',
      detail: 'Cross-check CMMS logs from last turnaround (2025-11-14) regarding lube oil flush procedures, seal oil barrier top-ups, and bearing torque specs.',
      priority: 'STANDARD',
      assignedTo: 'Reliability Engineer'
    }
  ];

  const handleSpeakAnalysis = () => {
    const text = `NOVA Analysis: NOVA identified a temporal relationship between increasing vibration and bearing temperature. The lubrication pressure decline occurred shortly before the vibration acceleration. Immediate physical verification of tilt-pad bearings and lubrication pre-filter is strongly advised.`;
    novaVoiceService.speak(text);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#131722] via-[#0f131a] to-[#0a0d13] border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-6">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Voice Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                NOVA Analysis & Cognitive Reasoning Engine
              </h3>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Continuous Multi-Variate Inference
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Causal AI reconstruction synthesized across physics parameters and SCADA state transitions.
            </p>
          </div>
        </div>

        <button
          onClick={handleSpeakAnalysis}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-mono-tech flex items-center gap-2 transition-colors self-start sm:self-center"
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Vocalize NOVA Finding</span>
        </button>
      </div>

      {/* User Requested Core Quote & Finding */}
      <div className="p-4 sm:p-5 rounded-xl bg-amber-500/[0.05] border border-amber-500/25 space-y-2 relative z-10">
        <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 flex items-center gap-2">
          <span>NOVA Analysis Finding</span>
          <span>•</span>
          <span className="text-zinc-400 font-normal">Confidence: 94.8%</span>
        </div>
        <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed italic">
          "NOVA identified a temporal relationship between increasing vibration and bearing temperature. The lubrication pressure decline occurred shortly before the vibration acceleration."
        </p>
        <div className="text-[11px] font-mono-tech text-zinc-400 pt-1 flex flex-wrap items-center gap-4">
          <span>Sequence: <strong className="text-zinc-200">Lube Pressure Drop (-18 min) → Thermal Rise (-9 min) → Vibration Spike (T-0)</strong></span>
          <span>•</span>
          <span>Physical Mechanism: <strong className="text-amber-300">Hydrodynamic Film Starvation & Boundary Friction</strong></span>
        </div>
      </div>

      {/* Recommended Next Checks (User Requested) */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono-tech uppercase font-bold text-white tracking-wider flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <span>Recommended Next Checks</span>
          </div>
          <span className="text-[10px] font-mono-tech text-zinc-400">
            Mandatory Physical Safeguards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendedChecks.map((chk) => (
            <div
              key={chk.id}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    chk.priority === 'CRITICAL' ? 'bg-rose-500' :
                    chk.priority === 'HIGH' ? 'bg-amber-400' : 'bg-blue-400'
                  }`} />
                  <h4 className="text-xs font-bold text-white">
                    * {chk.title}
                  </h4>
                </div>
                <span className={`text-[9px] font-mono-tech font-bold px-1.5 py-0.5 rounded ${
                  chk.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                  chk.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-white/[0.06] text-zinc-400'
                }`}>
                  {chk.priority}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed pl-4">
                {chk.detail}
              </p>
              <div className="text-[10px] font-mono-tech text-zinc-500 pl-4 pt-1">
                Designated Role: <strong className="text-zinc-400">{chk.assignedTo}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons: [Generate Investigation Report] [Create Maintenance Recommendation] [Ask NOVA] */}
      <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="text-xs text-zinc-400 font-mono-tech">
          Incident Case: <strong className="text-white">Compressor C-204 (20 Sep 2026 — 22:31)</strong>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Button 1: Generate Investigation Report */}
          <button
            onClick={onGenerateReport}
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-sm"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Generate Investigation Report</span>
          </button>

          {/* Button 2: Create Maintenance Recommendation */}
          <button
            onClick={onCreateMaintenanceRecommendation}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-amber-500/20"
          >
            <Wrench className="w-4 h-4" />
            <span>Create Maintenance Recommendation</span>
          </button>

          {/* Button 3: Ask NOVA */}
          <button
            onClick={() => onAskNova("NOVA, explain why the lubrication pressure drop preceded the vibration surge on Compressor C-204 and what specific bearing checks are required.")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Ask NOVA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
