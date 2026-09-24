import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Calendar, 
  Flame, 
  Gauge, 
  Layers, 
  Radio, 
  Sparkles, 
  Wrench, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { IndustrialMachine, AppRoute, MachineTrendPoint } from '../../types/industrial';
import { generateMachineTrends } from '../../utils/machineTelemetryGenerator';
import { MachineMetricCharts } from './MachineMetricCharts';
import { MaintenanceTaskModal } from './MaintenanceTaskModal';

interface MachineDetailPageProps {
  machine: IndustrialMachine;
  onBack: () => void;
  onInvestigate: (machineId: string) => void;
  onAskNovaWithMachine: (machine: IndustrialMachine, customPrompt?: string) => void;
  onNavigate: (route: AppRoute) => void;
}

export const MachineDetailPage: React.FC<MachineDetailPageProps> = ({
  machine,
  onBack,
  onInvestigate,
  onAskNovaWithMachine,
  onNavigate
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [trends] = useState<MachineTrendPoint[]>(() => generateMachineTrends(machine, 24));
  const [activeTab, setActiveTab] = useState<'telemetry' | 'anomalies' | 'predictions' | 'maintenance'>('telemetry');

  // Risk styling
  const riskBadge = machine.risk === 'HIGH' 
    ? { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/40', label: 'HIGH RISK' }
    : machine.risk === 'MEDIUM'
    ? { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', label: 'MEDIUM RISK' }
    : { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', label: 'LOW RISK' };

  // Health Score Color
  const healthColor = machine.healthScore < 70 
    ? 'text-rose-400' 
    : machine.healthScore < 85 
    ? 'text-amber-400' 
    : 'text-emerald-400';

  const healthBg = machine.healthScore < 70 
    ? 'from-rose-500/20 to-transparent' 
    : machine.healthScore < 85 
    ? 'from-amber-500/20 to-transparent' 
    : 'from-emerald-500/20 to-transparent';

  // Detected anomalies list
  const anomalies = [
    ...(machine.id === 'C-204' ? [
      {
        id: 'ANO-C204-01',
        title: 'Drive-End Bearing Sub-synchronous Fluid Whirl',
        severity: 'CRITICAL',
        timestamp: '12 min ago',
        description: 'Vibration velocity rose to 5.76 mm/s RMS (28% above ISO 10816 Class IV 4.5 mm/s threshold). FFT spectral peaks at 0.44X running speed indicate oil film whip.',
        sensor: 'ACC-DE-01 (Drive End Accelerometer)'
      },
      {
        id: 'ANO-C204-02',
        title: 'Correlated Temperature Drift on Tilt-Pad #2',
        severity: 'HIGH',
        timestamp: '28 min ago',
        description: 'Embedded duplex RTD shows 92.4°C bearing metal temperature, climbing at +1.8°C/hr under steady 88% compressor load.',
        sensor: 'RTD-TP-02 (Tilt-Pad Thermocouple)'
      },
      {
        id: 'ANO-C204-03',
        title: 'Differential Pressure Surge on Lube Oil Filter',
        severity: 'MEDIUM',
        timestamp: '1.2 hrs ago',
        description: 'Delta-P exceeded 1.4 bar across pre-filter cartridge HEX-204. Trace varnish particulates suspected.',
        sensor: 'DPT-LO-204 (Differential Pressure)'
      }
    ] : machine.id === 'P-118' ? [
      {
        id: 'ANO-P118-01',
        title: 'Kingsbury Thrust Bearing Thermal Excursion',
        severity: 'HIGH',
        timestamp: '24 min ago',
        description: 'Thrust shoe temperature climbing steadily at +1.4°C/hr. Currently at 84.6°C approaching Class B insulation limit.',
        sensor: 'RTD-THRUST-01'
      },
      {
        id: 'ANO-P118-02',
        title: 'Seal Flush Plan 53A Pressure Fluctuations',
        severity: 'MEDIUM',
        timestamp: '1.8 hrs ago',
        description: 'Barrier fluid pressure cycling ±1.8 bar around setpoint, possible micro-throttling in buffer line.',
        sensor: 'PT-SEAL-118'
      }
    ] : machine.id === 'M-042' ? [
      {
        id: 'ANO-M042-01',
        title: 'Active Power Factor Dropped to 0.81',
        severity: 'MEDIUM',
        timestamp: '46 min ago',
        description: 'Elevated stator phase harmonic losses. Phase B current reading 412A vs 394A average.',
        sensor: 'CT-STATOR-PHB'
      }
    ] : [
      {
        id: `ANO-${machine.id}-01`,
        title: 'Minor Shaft Harmonic Oscillation',
        severity: 'LOW',
        timestamp: '3.4 hrs ago',
        description: 'Transient excitation during shift load change, returning to baseline damping envelope.',
        sensor: 'ACC-01'
      }
    ])
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono-tech"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Registry</span>
          </button>
          <div className="h-4 w-px bg-white/[0.1]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {machine.name}
              </h1>
              <span className="text-xs font-mono-tech font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                {machine.id}
              </span>
              <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                {riskBadge.label}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
              <span>{machine.type}</span>
              <span>•</span>
              <span className="text-zinc-300">{machine.location || machine.plantArea}</span>
              <span>•</span>
              <span>Tag: <strong className="font-mono-tech text-white">{machine.tag}</strong></span>
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onAskNovaWithMachine(machine)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask NOVA</span>
          </button>

          <button
            onClick={() => onInvestigate(machine.id)}
            className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Investigate</span>
          </button>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* NOVA Insight Panel (User Requested) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#131722] via-[#0f131c] to-[#0a0d13] border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-zinc-900 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-lg text-amber-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-tech uppercase font-bold text-amber-400 tracking-wider">
                  NOVA AI Operational Insight
                </span>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Physics Model Synchronized
                </span>
              </div>
              <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed max-w-3xl">
                {machine.novaInsight || 
                  `NOVA: The vibration pattern increased gradually during the last 6 operating cycles. The behavior is consistent with a possible bearing degradation pattern.`}
              </p>
              <div className="text-[11px] font-mono-tech text-zinc-400 flex items-center gap-3 pt-0.5">
                <span>Confidence: <strong className="text-white">94.8%</strong></span>
                <span>•</span>
                <span>Physics Engine: <strong className="text-amber-300">ISO 10816 + Navier-Stokes Hydrodynamics</strong></span>
              </div>
            </div>
          </div>

          {/* Action buttons inside the NOVA panel */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onInvestigate(machine.id)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Investigate Root Cause</span>
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-xs font-semibold text-white transition-colors flex items-center gap-2"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Create Work Order</span>
            </button>
            <button
              onClick={() => onAskNovaWithMachine(machine, `NOVA, explain why the vibration pattern on ${machine.id} indicates bearing degradation and what specific checks we should run.`)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-amber-300 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Follow-up</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Machine Overview & Health Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Health Score Card */}
        <div className="p-5 rounded-2xl bg-[#0e1219] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Composite Asset Health</div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-4xl font-extrabold font-mono-tech ${healthColor}`}>
                {machine.healthScore}%
              </span>
              <span className="text-xs text-zinc-400 font-mono-tech">
                {machine.healthScore < 70 ? 'Degraded' : machine.healthScore < 85 ? 'Watchlist' : 'Optimal'}
              </span>
            </div>
            {/* Health Bar */}
            <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full ${
                  machine.healthScore < 70 ? 'bg-rose-500' : machine.healthScore < 85 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${machine.healthScore}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] font-mono-tech text-zinc-400 pt-3 border-t border-white/[0.05] mt-4 flex items-center justify-between">
            <span>RUL: <strong className="text-white">{machine.rulDays} Days</strong></span>
            <span>MTBF: <strong className="text-white">{machine.mtbfHours} hrs</strong></span>
          </div>
        </div>

        {/* Operating Runtime Card */}
        <div className="p-5 rounded-2xl bg-[#0e1219] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Operating Runtime</div>
            <div className="mt-3 text-3xl font-extrabold font-mono-tech text-white">
              {machine.runtimeHours || machine.mtbfHours || 4280} <span className="text-xs font-normal text-zinc-400">hours</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              Since last overhaul on <strong className="text-zinc-300 font-mono-tech">{machine.lastOverhaul}</strong>
            </p>
          </div>
          <div className="text-[11px] font-mono-tech text-zinc-400 pt-3 border-t border-white/[0.05] mt-4 flex items-center justify-between">
            <span>Next Overhaul:</span>
            <span className="text-amber-300">{machine.nextScheduledService}</span>
          </div>
        </div>

        {/* Energy Consumption Card */}
        <div className="p-5 rounded-2xl bg-[#0e1219] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Energy Consumption</div>
            <div className="mt-3 text-3xl font-extrabold font-mono-tech text-purple-300">
              {machine.energyKW || 1840} <span className="text-xs font-normal text-zinc-400">kW</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              Specific power draw under {machine.operatingLoadPct || 88}% operating load
            </p>
          </div>
          <div className="text-[11px] font-mono-tech text-zinc-400 pt-3 border-t border-white/[0.05] mt-4 flex items-center justify-between">
            <span>Motor Current:</span>
            <span className="text-white font-mono-tech">{machine.metrics.motorCurrent || 384} A</span>
          </div>
        </div>

        {/* Operating Load Card */}
        <div className="p-5 rounded-2xl bg-[#0e1219] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Operating Load Factor</div>
            <div className="mt-3 text-3xl font-extrabold font-mono-tech text-emerald-400">
              {machine.operatingLoadPct || 88}%
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              Rotor Speed: <strong className="text-zinc-200 font-mono-tech">{machine.metrics.rotorRPM?.toLocaleString()} RPM</strong>
            </p>
          </div>
          <div className="text-[11px] font-mono-tech text-zinc-400 pt-3 border-t border-white/[0.05] mt-4 flex items-center justify-between">
            <span>Criticality:</span>
            <span className="text-amber-300 font-mono-tech">{machine.criticality}</span>
          </div>
        </div>
      </div>

      {/* Live Telemetry Gauges Strip */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono-tech uppercase font-bold text-white tracking-wider">
              Live Sensor Telemetry Bus
            </span>
          </div>
          <span className="text-[10px] font-mono-tech text-zinc-400">
            Sampling: 1,000 Hz • Latency: 24ms
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Temperature */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Bearing Temp</div>
            <div className="text-xl font-bold font-mono-tech text-orange-400 mt-1">
              {machine.metrics.bearingTemp}°C
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 mt-0.5">Threshold: 85.0°C</div>
          </div>

          {/* Vibration */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Vibration Velocity</div>
            <div className="text-xl font-bold font-mono-tech text-amber-400 mt-1">
              {machine.metrics.vibrationRMS} <span className="text-xs">mm/s</span>
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 mt-0.5">ISO Limit: 4.50</div>
          </div>

          {/* Pressure */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Discharge Pressure</div>
            <div className="text-xl font-bold font-mono-tech text-cyan-400 mt-1">
              {machine.metrics.dischargePressure || 182.4} <span className="text-xs">bar</span>
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 mt-0.5">Suction: {machine.metrics.suctionPressure || 34.8} bar</div>
          </div>

          {/* Shaft RPM */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Shaft Speed</div>
            <div className="text-xl font-bold font-mono-tech text-white mt-1">
              {machine.metrics.rotorRPM?.toLocaleString()} <span className="text-xs">RPM</span>
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 mt-0.5">1X: {( (machine.metrics.rotorRPM || 3000) / 60 ).toFixed(1)} Hz</div>
          </div>

          {/* Lube Oil NAS */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Lube Oil NAS</div>
            <div className="text-xl font-bold font-mono-tech text-purple-300 mt-1">
              Class {machine.metrics.lubeOilNAS || 7}
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 mt-0.5">ISO 4406: 18/16/13</div>
          </div>

          {/* Acoustic Decibels */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Acoustic SPL</div>
            <div className="text-xl font-bold font-mono-tech text-rose-300 mt-1">
              {machine.metrics.acousticDB || 96.4} <span className="text-xs">dB</span>
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 mt-0.5">Ultrasonic: Nominal</div>
          </div>
        </div>
      </div>

      {/* Historical Trends Charts (User Requested: Temperature, Vibration, Pressure, Energy, Load) */}
      <MachineMetricCharts trends={trends} machineId={machine.id} />

      {/* Secondary Detailed Panels Tabs */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/[0.08] gap-4">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`pb-3 text-xs font-mono-tech uppercase font-bold border-b-2 transition-colors ${
              activeTab === 'telemetry'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Root Cause Signals & Sub-Components
          </button>
          <button
            onClick={() => setActiveTab('anomalies')}
            className={`pb-3 text-xs font-mono-tech uppercase font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'anomalies'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Detected Anomalies</span>
            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px]">
              {anomalies.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`pb-3 text-xs font-mono-tech uppercase font-bold border-b-2 transition-colors ${
              activeTab === 'predictions'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            AI Predictive Degradation
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`pb-3 text-xs font-mono-tech uppercase font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'maintenance'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Maintenance History</span>
            <span className="px-1.5 py-0.2 rounded bg-white/[0.08] text-zinc-300 text-[10px]">
              {machine.maintenanceHistory?.length || 0}
            </span>
          </button>
        </div>

        {/* Tab 1: Root Cause Signals & Components */}
        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sub-Components Health Table */}
            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Sub-Component Integrity Matrix</span>
                </h3>
                <span className="text-[10px] font-mono-tech text-zinc-400">
                  {machine.components.length} Monitored Assemblies
                </span>
              </div>

              <div className="space-y-2.5">
                {machine.components.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          comp.status === 'critical' ? 'bg-rose-500 animate-ping' :
                          comp.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        <span className="text-xs font-bold text-white">{comp.name}</span>
                      </div>
                      <span className={`text-xs font-mono-tech font-bold ${
                        comp.health < 65 ? 'text-rose-400' : comp.health < 80 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {comp.health}%
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {comp.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Root Cause Signals */}
            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span>Root Cause Harmonic Signals</span>
                </h3>
                <span className="text-[10px] font-mono-tech text-amber-300">
                  FFT Peak Extraction
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-white font-bold">1X Running Speed Fundamental</span>
                    <span className="text-amber-400">190.3 Hz • 2.45 mm/s</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Slight residual unbalance; within normal operational dynamic balancing envelope.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-rose-300 font-bold">0.44X Sub-Synchronous Whirl</span>
                    <span className="text-rose-400 font-bold">83.7 Hz • 4.12 mm/s (ALERT)</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <p className="text-[10px] text-zinc-300">
                    Direct evidence of fluid-film instability in hydrodynamic tilt-pad journal bearing #2.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-white font-bold">Blade Pass Frequency (BPF)</span>
                    <span className="text-emerald-400">2,664 Hz • 0.35 mm/s</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    No aerodynamic surge or acoustic vortex whistling detected on impeller stage 1-4.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Detected Anomalies */}
        {activeTab === 'anomalies' && (
          <div className="space-y-3">
            {anomalies.map((ano) => (
              <div
                key={ano.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                      ano.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      ano.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {ano.severity}
                    </span>
                    <h4 className="text-sm font-bold text-white">{ano.title}</h4>
                    <span className="text-[10px] font-mono-tech text-zinc-400">({ano.id})</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                    {ano.description}
                  </p>
                  <div className="text-[10px] font-mono-tech text-zinc-400 flex items-center gap-3 pt-1">
                    <span>Origin: <strong className="text-zinc-200">{ano.sensor}</strong></span>
                    <span>•</span>
                    <span>Timestamp: <strong>{ano.timestamp}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <button
                    onClick={() => onInvestigate(machine.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Investigate RCA</span>
                  </button>
                  <button
                    onClick={() => onAskNovaWithMachine(machine, `Diagnose anomaly ${ano.id}: ${ano.title}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-amber-300 transition-colors"
                  >
                    Ask NOVA
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: AI Predictions */}
        {activeTab === 'predictions' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-3">
              <div className="text-[10px] font-mono-tech uppercase text-zinc-400">
                Remaining Useful Life (RUL)
              </div>
              <div className="text-3xl font-extrabold font-mono-tech text-amber-400">
                {machine.rulDays} Days
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Projected until bearing fluid film degradation reaches ISO 10816 Zone D trip threshold (7.1 mm/s RMS).
              </p>
              <div className="pt-2 border-t border-white/[0.05] text-[10px] font-mono-tech text-zinc-500">
                Model: Weibull Accelerated Life Prediction
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-3">
              <div className="text-[10px] font-mono-tech uppercase text-zinc-400">
                Primary Failure Mode
              </div>
              <div className="text-xl font-bold font-mono-tech text-rose-400">
                Tilt-Pad Hydrodynamic Film Breakdown
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Probability: <strong className="text-white">87.4%</strong>. Secondary risk of dry gas seal face contact if radial shaft displacement exceeds 45 microns.
              </p>
              <div className="pt-2 border-t border-white/[0.05] text-[10px] font-mono-tech text-zinc-500">
                Physics engine calibrated via OEM tolerance charts
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-3">
              <div className="text-[10px] font-mono-tech uppercase text-zinc-400">
                Recommended Mitigations
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc pl-4">
                <li>Derate compression load to 75% for 48 hours</li>
                <li>Inspect lube oil cooling bypass valve V-204</li>
                <li>Conduct acoustic ultrasonic survey on bearing #2</li>
              </ul>
              <div className="pt-2 border-t border-white/[0.05]">
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-colors"
                >
                  Create Maintenance Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Maintenance History */}
        {activeTab === 'maintenance' && (
          <div className="space-y-3">
            {machine.maintenanceHistory && machine.maintenanceHistory.length > 0 ? (
              machine.maintenanceHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase bg-white/[0.06] text-amber-300 border border-white/[0.08]">
                        {item.type}
                      </span>
                      <h4 className="text-sm font-bold text-white">{item.description}</h4>
                    </div>
                    <div className="text-xs font-mono-tech text-zinc-400 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-4">
                    <span>Lead Tech: <strong className="text-zinc-200">{item.technician}</strong></span>
                    <span>•</span>
                    <span>Duration: <strong className="text-zinc-200">{item.hoursSpent} hrs</strong></span>
                    {item.partsReplaced && item.partsReplaced.length > 0 && (
                      <>
                        <span>•</span>
                        <span>Parts Replaced: <strong className="text-zinc-300">{item.partsReplaced.join(', ')}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl bg-[#0c1017] border border-white/[0.08] text-zinc-400 text-xs">
                No past maintenance interventions logged for this asset.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <MaintenanceTaskModal
        machine={machine}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
};
