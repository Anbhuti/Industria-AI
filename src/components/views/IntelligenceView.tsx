import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  BarChart3, 
  Layers, 
  Zap, 
  Activity,
  ArrowRight,
  Clock,
  Wrench,
  Cpu,
  CheckCircle2,
  Sparkles,
  AlertOctagon,
  Gauge,
  Sliders,
  FileText,
  Search,
  Check,
  ShieldAlert,
  Flame,
  Factory
} from 'lucide-react';
import { AppRoute, IndustrialMachine } from '../../types/industrial';
import { INTELLIGENCE_MODULES, IntelligenceModuleData } from '../../data/intelligenceData';
import { IndustrialAreaChart, IndustrialBarChart } from '../intelligence/IntelligenceCharts';
import { useNovaCopilot } from '../../context/NovaCopilotContext';

interface IntelligenceViewProps {
  machines: IndustrialMachine[];
  onNavigate: (route: AppRoute) => void;
  onAskNovaWithMachine?: (machine: IndustrialMachine, prompt?: string) => void;
}

export const IntelligenceView: React.FC<IntelligenceViewProps> = ({ 
  machines, 
  onNavigate,
  onAskNovaWithMachine 
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('predictive-maintenance');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const { executeCommand } = useNovaCopilot();

  const activeModule: IntelligenceModuleData = INTELLIGENCE_MODULES[activeModuleId] || INTELLIGENCE_MODULES['predictive-maintenance'];

  const handleActionClick = (actionTitle: string, assetTarget?: string) => {
    setActionSuccessMessage(`Work order initiated: "${actionTitle}" for ${assetTarget || 'Plant Operations'}`);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4000);
  };

  const handleAskNovaAboutModule = () => {
    const prompt = `Give me an operational intelligence briefing on ${activeModule.title}.`;
    executeCommand(prompt, false);
  };

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'predictive-maintenance':
        return Wrench;
      case 'anomaly-detection':
        return AlertTriangle;
      case 'failure-prediction':
        return AlertOctagon;
      case 'energy-intelligence':
        return Zap;
      case 'production-intelligence':
        return Factory;
      case 'operational-risk':
        return ShieldCheck;
      default:
        return Activity;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>INDUSTRIX AI // FLEET INTELLIGENCE SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Industrial Operations & Predictive Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Six unified operational modules monitoring machinery wear, multi-sensor anomalies, failure likelihoods, power consumption, line throughput, and plant risks using plain-English explanations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mandatory Simulated Industrial Data Notice */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono-tech flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>SIMULATED INDUSTRIAL DATA</span>
          </div>

          <button
            onClick={handleAskNovaAboutModule}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Ask NOVA for an AI operational briefing on this module"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Vocalize Briefing</span>
          </button>
        </div>
      </div>

      {/* Action Confirmation Banner */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-tech flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <span className="text-[10px] text-zinc-400">CMMS Dispatched</span>
        </div>
      )}

      {/* 6 Modules Quick Selection Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400 uppercase">
          <span>Select Operational Intelligence Module:</span>
          <span className="text-amber-400">6 Modules Active</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {Object.values(INTELLIGENCE_MODULES).map((mod) => {
            const isSelected = activeModuleId === mod.id;
            const Icon = getModuleIcon(mod.id);

            return (
              <button
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#141924] border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                    : 'bg-[#0f131a] hover:bg-[#131822] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-xl ${
                      isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-white/[0.04] text-zinc-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                  <div className={`text-xs font-bold tracking-tight line-clamp-1 ${
                    isSelected ? 'text-white' : 'text-zinc-300'
                  }`}>
                    {mod.title}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono-tech">
                  <span className={`truncate font-semibold ${
                    mod.statusColor === 'rose'
                      ? 'text-rose-400'
                      : mod.statusColor === 'amber'
                      ? 'text-amber-400'
                      : mod.statusColor === 'blue'
                      ? 'text-sky-400'
                      : 'text-emerald-400'
                  }`}>
                    {mod.statusBadge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Container */}
      <div className="space-y-8 bg-[#0c1017] border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-2xl">
        {/* Module Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              {React.createElement(getModuleIcon(activeModule.id), { className: 'w-5 h-5' })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {activeModule.title}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase border ${
                  activeModule.statusColor === 'rose'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : activeModule.statusColor === 'amber'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : activeModule.statusColor === 'blue'
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  {activeModule.statusBadge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activeModule.shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 1: OVERVIEW */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-bold text-white">01 // Overview</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#101520] border border-white/[0.06] space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white">
              {activeModule.overview.headline}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {activeModule.overview.summaryText}
            </p>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {activeModule.overview.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#10141d] border border-white/[0.06] flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono-tech uppercase text-zinc-400">
                    {metric.label}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono-tech text-white mt-1.5">
                    {metric.value}
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 truncate max-w-[170px]">{metric.detail}</span>
                  {metric.change && (
                    <span className={`font-mono-tech font-bold ${
                      metric.positive ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {metric.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: CURRENT SIGNALS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="font-bold text-white">02 // Current Signals</span>
            </div>
            <span className="text-[11px] font-mono-tech text-zinc-400">
              Live Sensor Telemetry vs Safe Nominal Baselines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeModule.currentSignals.map((sig) => (
              <div
                key={sig.id}
                className={`p-4 rounded-2xl border transition-all ${
                  sig.status === 'critical'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : sig.status === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : sig.status === 'advisory'
                    ? 'bg-sky-950/20 border-sky-500/30'
                    : 'bg-[#10141d] border-white/[0.06]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-white">{sig.name}</div>
                    <div className="text-[10px] font-mono-tech text-zinc-400 mt-0.5">
                      Nominal: {sig.nominal} {sig.unit}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-base font-bold font-mono-tech ${
                      sig.status === 'critical'
                        ? 'text-rose-400'
                        : sig.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-zinc-200'
                    }`}>
                      {sig.value} <span className="text-xs font-normal text-zinc-400">{sig.unit}</span>
                    </div>
                    <div className={`text-[10px] font-mono-tech font-bold flex items-center justify-end gap-1 ${
                      sig.status === 'critical'
                        ? 'text-rose-400'
                        : sig.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {sig.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : sig.trend === 'down' ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      <span>{sig.deviation}</span>
                    </div>
                  </div>
                </div>

                {/* Plain English Explanation */}
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] text-xs text-zinc-300 leading-relaxed">
                  <span className="text-zinc-400 font-medium">Plain Explanation: </span>
                  {sig.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: DETECTED PATTERNS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-bold text-white">03 // Detected Patterns</span>
            </div>
            <span className="text-[11px] font-mono-tech text-zinc-400">
              Pattern Recognition & Physical Behavior Analysis
            </span>
          </div>

          <div className="space-y-3">
            {activeModule.detectedPatterns.map((pat) => (
              <div
                key={pat.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#111622] border border-white/[0.08] hover:border-white/[0.14] transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      pat.severity === 'high'
                        ? 'bg-rose-500 animate-ping'
                        : pat.severity === 'medium'
                        ? 'bg-amber-400'
                        : 'bg-sky-400'
                    }`} />
                    <span className="text-sm font-bold text-white tracking-tight">
                      {pat.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono-tech">
                    <span className="text-zinc-400">
                      First Detected: <span className="text-zinc-200">{pat.firstDetected}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-amber-300 border border-white/[0.08]">
                      Confidence: {Math.round(pat.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs leading-relaxed">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] font-mono-tech uppercase text-zinc-400 mb-1">
                      What is Happening:
                    </div>
                    <p className="text-zinc-200">{pat.plainExplanation}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/[0.03] border border-amber-500/20">
                    <div className="text-[10px] font-mono-tech uppercase text-amber-400 mb-1">
                      Operational Consequence if Unaddressed:
                    </div>
                    <p className="text-zinc-300">{pat.impactExplanation}</p>
                  </div>
                </div>

                {pat.machineId === 'C-204' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onNavigate('/investigations')}
                      className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Full C-204 RCA Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: AI INSIGHTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-white">04 // AI Insights</span>
            </div>
            <span className="text-[11px] font-mono-tech text-zinc-400">
              Supervisory Guidance & Decision Support
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121824] to-[#0d121b] border border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {activeModule.aiInsights.title}
                  </h4>
                  <div className="text-[10px] font-mono-tech text-zinc-400">
                    Confidence: {Math.round(activeModule.aiInsights.confidence * 100)}% // Evaluated across 14,800 SCADA telemetry points
                  </div>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-mono-tech font-bold uppercase border ${
                activeModule.aiInsights.urgencyLevel === 'immediate'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                  : activeModule.aiInsights.urgencyLevel === 'within-week'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}>
                {activeModule.aiInsights.urgencyLevel}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-normal">
              {activeModule.aiInsights.narrative}
            </p>

            {/* Key Actionable Takeaways */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
              <div className="text-[10px] font-mono-tech uppercase text-amber-400 font-bold">
                Operational Takeaways:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                {activeModule.aiInsights.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05] flex items-start gap-2 text-zinc-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: HISTORICAL TRENDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-bold text-white">05 // Historical Trends</span>
            </div>
            <span className="text-[11px] font-mono-tech text-zinc-400">
              Continuous Telemetry Timeline & Limit Thresholds
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#10141d] border border-white/[0.08] space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white">
                {activeModule.historicalTrends.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activeModule.historicalTrends.description}
              </p>
            </div>

            {/* Industrial SVG Chart Rendering */}
            <div className="bg-[#090c12] p-4 rounded-xl border border-white/[0.06]">
              {activeModule.historicalTrends.chartType === 'bar' ? (
                <IndustrialBarChart
                  data={activeModule.historicalTrends.data}
                  seriesLabels={activeModule.historicalTrends.seriesLabels}
                  height={220}
                />
              ) : (
                <IndustrialAreaChart
                  data={activeModule.historicalTrends.data}
                  seriesLabels={activeModule.historicalTrends.seriesLabels}
                  height={220}
                />
              )}
            </div>
          </div>
        </div>

        {/* SECTION 6: RECOMMENDED ACTIONS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-white">06 // Recommended Actions</span>
            </div>
            <span className="text-[11px] font-mono-tech text-zinc-400">
              Prioritized Preventive Mitigations & One-Click Work Orders
            </span>
          </div>

          <div className="space-y-3">
            {activeModule.recommendedActions.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-2xl bg-[#10141d] border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                      act.priority === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : act.priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}>
                      {act.priority} Priority
                    </span>
                    <span className="text-xs font-mono-tech text-zinc-400">
                      Timeframe: <span className="text-zinc-200">{act.timeframe}</span>
                    </span>
                    {act.targetAsset && (
                      <span className="text-xs font-mono-tech text-amber-400">
                        Asset: {act.targetAsset}
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-bold text-white tracking-tight">
                    {act.title}
                  </h5>

                  <p className="text-xs text-zinc-300">
                    <span className="text-zinc-500">Expected Outcome: </span>
                    {act.expectedOutcome}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => handleActionClick(act.title, act.targetAsset)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Execute Action</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
