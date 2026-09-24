import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  Cpu, 
  AlertTriangle, 
  ShieldAlert,
  ShieldCheck, 
  Gauge, 
  TrendingUp, 
  ArrowUpRight, 
  Radio, 
  ChevronRight, 
  Zap, 
  Clock,
  ArrowRight,
  RotateCw,
  SlidersHorizontal,
  CheckCircle2,
  AlertOctagon,
  Layers,
  Thermometer,
  Wrench,
  Flame,
  Info,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Workflow,
  Search,
  Crosshair,
  BarChart2,
  Play,
  X,
  Settings
} from 'lucide-react';
import { AppRoute, IndustrialMachine, IndustrialPlant } from '../../types/industrial';
import { useIndustrialApp } from '../../context/IndustrialAppContext';

interface DashboardViewProps {
  onNavigate: (route: AppRoute) => void;
  machines: IndustrialMachine[];
  currentPlant: IndustrialPlant;
  onSelectMachineForInvestigation: (machine: IndustrialMachine) => void;
  onAskNovaWithMachine: (machine: IndustrialMachine) => void;
  onRunInvestigationDemo?: () => void;
}

// Plant production lines for industrial visualization
interface PlantLine {
  id: string;
  name: string;
  code: string;
  status: 'optimal' | 'warning' | 'critical';
  load: string;
  throughput: string;
  machineIds: string[];
}

const PRODUCTION_LINES: PlantLine[] = [
  {
    id: 'line-1',
    name: 'Synthesis & Gas Compression Train',
    code: 'TRAIN-A1',
    status: 'critical',
    load: '94.2% Capacity',
    throughput: '1,420 Nm³/hr',
    machineIds: ['C-204', 'TC-204', 'GT-401']
  },
  {
    id: 'line-2',
    name: 'Supercritical Fluid Circulation Loop',
    code: 'LOOP-B2',
    status: 'warning',
    load: '88.6% Capacity',
    throughput: '3,850 L/min',
    machineIds: ['P-118', 'BFP-01', 'P-8802']
  },
  {
    id: 'line-3',
    name: 'Precision Extrusion & Milling Cell',
    code: 'CELL-C3',
    status: 'warning',
    load: '81.4% Capacity',
    throughput: '98.5 ppm',
    machineIds: ['M-042', 'CNC-05', 'CV-109']
  }
];

interface AttentionIncident {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  machineId: string;
  machineName: string;
  title: string;
  description: string;
  detectedTime: string;
  variance: string;
  actionRequired: string;
  sensors: string[];
  recommendation: string;
}

const ATTENTION_INCIDENTS: AttentionIncident[] = [
  {
    id: 'INC-01',
    severity: 'CRITICAL',
    machineId: 'C-204',
    machineName: 'Compressor C-204',
    title: 'Vibration Exceeded Threshold by 28%',
    description: 'Radial vibration velocity on Drive-End Tilt-Pad bearing spiked to 5.76 mm/s RMS (exceeding ISO 10816-3 Zone B limit of 4.5 mm/s by 28%). Detected 12 minutes ago.',
    detectedTime: 'Detected 12 minutes ago',
    variance: '+28% over limit',
    actionRequired: 'Inspect lube oil heat exchanger HEX-204 delta-P and verify oil inlet temp.',
    sensors: ['VIB-DE-01 (5.76 mm/s)', 'TEMP-BEAR-DE (92.4°C)', 'PRES-DISCH (182.4 bar)'],
    recommendation: 'Initiate automated anti-surge bypass modulation and dispatch reliability tech for lube flush.'
  },
  {
    id: 'INC-02',
    severity: 'HIGH',
    machineId: 'P-118',
    machineName: 'Pump P-118',
    title: 'Temperature Trend Abnormal',
    description: 'Thrust bearing metal temperature is exhibiting continuous linear ascension (+1.4°C/hr under constant process load). Approaching Class B insulation warning trip.',
    detectedTime: 'Detected 24 minutes ago',
    variance: '+1.4°C/hr drift',
    actionRequired: 'Verify secondary seal flush pressure (Plan 53B) and check mechanical seal cooling loop.',
    sensors: ['RTD-THRUST-01 (84.6°C)', 'SEAL-FLUSH-P (8.2 bar)', 'SUCT-PRES (8.2 bar)'],
    recommendation: 'Cross-reference axial displacement sensor. Possible mechanical seal face vaporization or micro-rub.'
  },
  {
    id: 'INC-03',
    severity: 'MEDIUM',
    machineId: 'M-042',
    machineName: 'Motor M-042',
    title: 'Efficiency Declining',
    description: 'Stator power factor degraded to 0.81 with elevated Phase B resistance and harmonic stator losses (+4.8% kW draw for identical extrusion throughput).',
    detectedTime: 'Detected 46 minutes ago',
    variance: '-6.2% efficiency',
    actionRequired: 'Audit variable frequency inverter IGBT switching and schedule thermographic scan.',
    sensors: ['PF-MTR-042 (0.81)', 'CURR-PH-B (412 A)', 'VIB-MOTOR (2.45 mm/s)'],
    recommendation: 'Schedule dynamic motor circuit analysis (MCA) during upcoming shift change window.'
  }
];

interface TimelineEvent {
  id: string;
  time: string;
  machineId: string;
  type: 'telemetry' | 'nova_ai' | 'scada_trip' | 'operator_action' | 'automated_fix';
  title: string;
  detail: string;
  severity?: 'critical' | 'warning' | 'nominal';
}

const LIVE_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-1',
    time: '12:04:18',
    machineId: 'C-204',
    type: 'nova_ai',
    title: 'NOVA Diagnostic Formulated',
    detail: 'Correlated C-204 vibration surge with HEX-204 heat exchanger valve lag. 94% confidence root cause.',
    severity: 'critical'
  },
  {
    id: 'tl-2',
    time: '12:01:05',
    machineId: 'C-204',
    type: 'scada_trip',
    title: 'Telemetry Excursion Alarm: C-204',
    detail: 'Drive-End bearing RMS crossed 4.5 mm/s alarm threshold to 5.76 mm/s (+28%).',
    severity: 'critical'
  },
  {
    id: 'tl-3',
    time: '11:52:40',
    machineId: 'P-118',
    type: 'telemetry',
    title: 'Thermal Drift Detected: P-118',
    detail: 'Continuous upward slope confirmed over 300 data points on secondary thrust bearing RTD.',
    severity: 'warning'
  },
  {
    id: 'tl-4',
    time: '11:44:12',
    machineId: 'M-042',
    type: 'nova_ai',
    title: 'Efficiency Anomaly Flagged: M-042',
    detail: 'NOVA detected power factor drop to 0.81. Identified early phase resistance asymmetry.',
    severity: 'warning'
  },
  {
    id: 'tl-5',
    time: '11:30:00',
    machineId: 'BFP-01',
    type: 'operator_action',
    title: 'Scheduled Telemetry Sync Completed',
    detail: 'Supercritical feed pump baseline recalculated. 142 days remaining useful life (nominal).',
    severity: 'nominal'
  }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  machines,
  currentPlant,
  onSelectMachineForInvestigation,
  onAskNovaWithMachine,
  onRunInvestigationDemo
}) => {
  const { currentUser, dashboardConfig, updateDashboardConfig } = useIndustrialApp();
  // Active selected machine for details drawer / modal
  const [selectedMachine, setSelectedMachine] = useState<IndustrialMachine | null>(null);
  // Active production line filter in visualization
  const [selectedLineId, setSelectedLineId] = useState<string>('all');
  // AI summary expanded states
  const [isAiSummaryExpanded, setIsAiSummaryExpanded] = useState<boolean>(true);
  const [activeAttentionTab, setActiveAttentionTab] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);

  const activeKpis = dashboardConfig?.visibleKpis || ['health', 'efficiency', 'availability', 'anomalies', 'incidents', 'energy'];

  const toggleKpi = (id: string) => {
    const updated = activeKpis.includes(id)
      ? activeKpis.filter(k => k !== id)
      : [...activeKpis, id];
    updateDashboardConfig({
      visibleKpis: updated,
      widgetOrder: updated
    });
  };

  const isKpiVisible = (id: string) => activeKpis.includes(id);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Anubhuti';

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredAttention = ATTENTION_INCIDENTS.filter(inc => {
    if (activeAttentionTab === 'all') return true;
    return inc.severity.toLowerCase() === activeAttentionTab;
  });

  return (
    <div className="p-3 sm:p-5 lg:p-7 space-y-6 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Operational Lifecycle Pipeline Guide */}
      <div className="rounded-2xl bg-[#0c1017]/90 border border-white/[0.08] p-3.5 sm:p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-[11px] font-mono-tech text-amber-400 font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Operational Decision & Investigation Flow</span>
          </div>
          <div className="flex items-center gap-2">
            {onRunInvestigationDemo && (
              <button
                type="button"
                onClick={onRunInvestigationDemo}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-mono-tech font-bold flex items-center gap-1.5 transition-all shadow-sm group"
                title="Run automated 11-step AI Investigation Demo"
              >
                <Play className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>1-Click AI Demo</span>
              </button>
            )}
            <span className="text-[10px] font-mono-tech text-zinc-400 hidden sm:inline">
              End-to-End Enterprise Standard
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono-tech select-none no-scrollbar">
          {[
            { label: '1. LOGIN', route: '/login' as AppRoute, status: 'done' },
            { label: '2. NOVA GREETING', route: '/dashboard' as AppRoute, status: 'done' },
            { label: '3. CONTROL CENTER', route: '/dashboard' as AppRoute, status: 'active' },
            { label: '4. PLANT MONITORING', route: '/monitoring' as AppRoute, status: 'next' },
            { label: '5. MACHINE', route: '/machines' as AppRoute, status: 'next' },
            { label: '6. INCIDENT', route: '/investigations' as AppRoute, status: 'next' },
            { label: '7. ROOT CAUSE', route: '/investigations' as AppRoute, status: 'next' },
            { label: '8. NOVA ANALYSIS', route: '/nova' as AppRoute, status: 'next' },
            { label: '9. RECOMMENDED ACTION', route: '/investigations' as AppRoute, status: 'next' },
            { label: '10. REPORT', route: '/reports' as AppRoute, status: 'next' },
          ].map((step, idx, arr) => (
            <React.Fragment key={step.label}>
              <button
                type="button"
                onClick={() => onNavigate(step.route)}
                className={`px-2.5 py-1 rounded-lg shrink-0 whitespace-nowrap transition-all border ${
                  step.status === 'active'
                    ? 'bg-amber-400 text-black font-bold border-amber-300 shadow-sm'
                    : step.status === 'done'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                    : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {step.label}
              </button>
              {idx < arr.length - 1 && (
                <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 1. Main Hero Section */}
      <div className="relative rounded-2xl bg-[#111622] border border-white/[0.08] p-5 sm:p-7 overflow-hidden shadow-2xl">
        {/* Ambient Industrial Glows */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-gradient-to-bl from-amber-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-wider uppercase font-semibold">PLANT SUPERVISORY CONTROL & TELEMETRY</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300 font-medium">{currentPlant.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {getGreeting()}, {firstName}.
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-300 mt-1.5 font-normal">
              Here's what's happening across your operation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onRunInvestigationDemo && (
              <button
                type="button"
                onClick={onRunInvestigationDemo}
                className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md group"
                title="Run 11-step interactive AI Investigation Demo"
              >
                <Play className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Run AI Investigation Demo</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('/nova')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Ask NOVA</span>
            </button>

            <button
              onClick={handleRefreshTelemetry}
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-zinc-200 text-xs font-medium flex items-center gap-2 transition-colors"
              title="Poll live sensor nodes"
            >
              <RotateCw className={`w-3.5 h-3.5 text-zinc-400 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Sync Telemetry</span>
            </button>

            <button
              onClick={() => onNavigate('/monitoring')}
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-zinc-200 text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telemetry Streams</span>
            </button>

            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-zinc-200 text-xs font-medium flex items-center gap-2 transition-colors"
              title="Personalize and customize dashboard KPIs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* Live Facility Context Bar */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tech text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="text-zinc-500">FACILITY:</span>
            <span className="text-zinc-200 font-semibold">{currentPlant.name}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">SUPERVISOR:</span>
            <span className="text-zinc-200">{currentUser?.name || 'Anubhuti Pal'} ({currentUser?.title || 'Level 4 Authority'})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500">ACTIVE SHIFT:</span>
            <span className="text-amber-300">Shift Bravo (16:00 – 00:00 IST)</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              DCS Bus Sync 100%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Large Operational KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1: Overall Plant Health */}
        {isKpiVisible('health') && (
          <div className="p-4 rounded-2xl bg-[#111622] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between shadow-md group">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono-tech uppercase font-medium tracking-wide">Overall Plant Health</span>
              <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl sm:text-3xl font-bold font-mono-tech text-white tracking-tight">
                94.7%
              </div>
              <div className="text-[11px] font-mono-tech text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+0.8% vs last shift</span>
              </div>
            </div>
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.7%' }} />
            </div>
          </div>
        )}

        {/* KPI 2: Production Efficiency */}
        {isKpiVisible('efficiency') && (
          <div className="p-4 rounded-2xl bg-[#111622] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between shadow-md group">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono-tech uppercase font-medium tracking-wide">Production Efficiency</span>
              <Gauge className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl sm:text-3xl font-bold font-mono-tech text-white tracking-tight">
                91.2%
              </div>
              <div className="text-[11px] font-mono-tech text-zinc-400 flex items-center gap-1 mt-1">
                <span>Target: 90.0% benchmark</span>
              </div>
            </div>
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full" style={{ width: '91.2%' }} />
            </div>
          </div>
        )}

        {/* KPI 3: Equipment Availability */}
        {isKpiVisible('availability') && (
          <div className="p-4 rounded-2xl bg-[#111622] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between shadow-md group">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono-tech uppercase font-medium tracking-wide">Equipment Availability</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl sm:text-3xl font-bold font-mono-tech text-white tracking-tight">
                97.4%
              </div>
              <div className="text-[11px] font-mono-tech text-emerald-400 flex items-center gap-1 mt-1">
                <span>138 / 142 Assets Online</span>
              </div>
            </div>
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '97.4%' }} />
            </div>
          </div>
        )}

        {/* KPI 4: Active Anomalies */}
        {isKpiVisible('anomalies') && (
          <div className="p-4 rounded-2xl bg-[#16141a] border border-amber-500/30 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-md shadow-amber-500/5 group">
            <div className="flex items-center justify-between text-amber-300">
              <span className="text-[11px] font-mono-tech uppercase font-semibold tracking-wide">Active Anomalies</span>
              <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl sm:text-3xl font-bold font-mono-tech text-amber-300 tracking-tight">
                04
              </div>
              <div className="text-[11px] font-mono-tech text-amber-400/90 flex items-center gap-1 mt-1">
                <span>3 rotating + 1 thermal</span>
              </div>
            </div>
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {/* KPI 5: Critical Incidents */}
        {isKpiVisible('incidents') && (
          <div className="p-4 rounded-2xl bg-[#191215] border border-rose-500/40 hover:border-rose-500/60 transition-all flex flex-col justify-between shadow-md shadow-rose-500/5 group">
            <div className="flex items-center justify-between text-rose-300">
              <span className="text-[11px] font-mono-tech uppercase font-bold tracking-wide">Critical Incidents</span>
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl sm:text-3xl font-bold font-mono-tech text-rose-400 tracking-tight">
                01
              </div>
              <div className="text-[11px] font-mono-tech text-rose-300 flex items-center gap-1 mt-1 font-semibold">
                <span>C-204 Vibration Surge</span>
              </div>
            </div>
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {/* KPI 6: Energy Efficiency */}
        {isKpiVisible('energy') && (
          <div className="p-4 rounded-2xl bg-[#111622] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between shadow-md group">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono-tech uppercase font-medium tracking-wide">Energy Efficiency</span>
              <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl sm:text-3xl font-bold font-mono-tech text-white tracking-tight">
                88.6%
              </div>
              <div className="text-[11px] font-mono-tech text-zinc-400 flex items-center gap-1 mt-1">
                <span>124.6 MW active draw</span>
              </div>
            </div>
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full" style={{ width: '88.6%' }} />
            </div>
          </div>
        )}
      </div>

      {/* 3. Industrial Plant Visualization (Production Lines, Machines, Sensors, Data Flow, Active Anomaly Markers) */}
      <div className="rounded-2xl bg-[#111622] border border-white/[0.08] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Industrial Plant Flow & Asset Topology
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase font-semibold">
                Interactive Schematic
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Live telemetry stream mapping production lines, rotating machinery, sensor telemetry nodes, and active anomaly triggers. Click any machine for root diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 text-[11px]">Filter Train:</span>
            <div className="flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <button
                onClick={() => setSelectedLineId('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-tech transition-colors ${
                  selectedLineId === 'all' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                ALL
              </button>
              {PRODUCTION_LINES.map(line => (
                <button
                  key={line.id}
                  onClick={() => setSelectedLineId(line.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-tech transition-colors ${
                    selectedLineId === line.id ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {line.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Production Lines Visual Topology */}
        <div className="space-y-4">
          {PRODUCTION_LINES.filter(line => selectedLineId === 'all' || selectedLineId === line.id).map(line => {
            const lineMachines = line.machineIds
              .map(id => machines.find(m => m.id === id))
              .filter((m): m is IndustrialMachine => Boolean(m));

            return (
              <div 
                key={line.id} 
                className="p-4 sm:p-5 rounded-xl bg-[#0d1017] border border-white/[0.06] relative overflow-hidden group"
              >
                {/* Header of Line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-xs font-bold font-mono-tech bg-white/[0.05] text-white border border-white/[0.1]">
                      {line.code}
                    </span>
                    <span className="text-sm font-bold text-white tracking-tight">
                      {line.name}
                    </span>
                    <span className={`text-[10px] font-mono-tech uppercase font-semibold px-2 py-0.5 rounded border ${
                      line.status === 'critical'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : line.status === 'warning'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {line.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono-tech text-zinc-400">
                    <div>
                      LOAD: <span className="text-zinc-200 font-semibold">{line.load}</span>
                    </div>
                    <span className="text-zinc-700">|</span>
                    <div>
                      THROUGHPUT: <span className="text-amber-300 font-semibold">{line.throughput}</span>
                    </div>
                  </div>
                </div>

                {/* Industrial Process Flow Conveyor with Data Flow Indicators */}
                <div className="relative">
                  {/* Subtle Connecting Process Pipe Line */}
                  <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500/30 via-emerald-500/20 to-blue-500/30 -translate-y-1/2 z-0" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
                    {lineMachines.map(machine => {
                      const isCritical = machine.status === 'critical';
                      const isWarning = machine.status === 'warning';
                      const hasAnomaly = isCritical || isWarning;

                      return (
                        <div
                          key={machine.id}
                          onClick={() => setSelectedMachine(machine)}
                          className={`cursor-pointer p-4 rounded-xl border transition-all relative overflow-hidden group/machine ${
                            isCritical
                              ? 'bg-gradient-to-b from-[#1b1216] to-[#120f13] border-rose-500/50 hover:border-rose-400 shadow-lg shadow-rose-950/20'
                              : isWarning
                              ? 'bg-gradient-to-b from-[#17151a] to-[#111319] border-amber-500/40 hover:border-amber-400 shadow-md shadow-amber-950/20'
                              : 'bg-[#121620] border-white/[0.08] hover:border-white/[0.2] hover:bg-[#141a26]'
                          }`}
                        >
                          {/* Anomaly Indicator Marker */}
                          {hasAnomaly && (
                            <div className="absolute -top-1 -right-1 flex items-center gap-1">
                              <span className="relative flex h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCritical ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                              </span>
                            </div>
                          )}

                          {/* Machine ID Tag & Status */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold font-mono-tech text-white bg-white/[0.08] px-2 py-0.5 rounded border border-white/[0.1]">
                                {machine.id}
                              </span>
                              <span className="text-[10px] font-mono-tech text-zinc-400">
                                {machine.tag}
                              </span>
                            </div>

                            <span className={`text-[10px] font-mono-tech uppercase font-bold px-1.5 py-0.5 rounded ${
                              isCritical ? 'text-rose-400 bg-rose-950/60' : isWarning ? 'text-amber-400 bg-amber-950/60' : 'text-emerald-400 bg-emerald-950/60'
                            }`}>
                              {machine.status}
                            </span>
                          </div>

                          {/* Machine Name */}
                          <div className="text-sm font-semibold text-white group-hover/machine:text-amber-300 transition-colors line-clamp-1">
                            {machine.name}
                          </div>
                          <div className="text-[11px] text-zinc-400 mb-3 truncate">
                            {machine.type}
                          </div>

                          {/* Sensors & Real-time Telemetry Indicators */}
                          <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs font-mono-tech">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-zinc-400">Vibration RMS:</span>
                              <span className={`font-semibold ${machine.metrics.vibrationRMS > 4.5 ? 'text-rose-400' : machine.metrics.vibrationRMS > 3.5 ? 'text-amber-400' : 'text-zinc-200'}`}>
                                {machine.metrics.vibrationRMS} mm/s
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-zinc-400">Bearing Temp:</span>
                              <span className={`font-semibold ${machine.metrics.bearingTemp > 88 ? 'text-rose-400' : machine.metrics.bearingTemp > 80 ? 'text-amber-400' : 'text-zinc-200'}`}>
                                {machine.metrics.bearingTemp} °C
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-zinc-400">Remaining Life:</span>
                              <span className="text-zinc-200 font-semibold">{machine.rulDays} Days</span>
                            </div>
                          </div>

                          {/* Health Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-[10px] font-mono-tech mb-1">
                              <span className="text-zinc-500">Asset Health</span>
                              <span className={`font-bold ${machine.healthScore < 75 ? 'text-rose-400' : machine.healthScore < 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {machine.healthScore}%
                              </span>
                            </div>
                            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  machine.healthScore < 75 ? 'bg-rose-500' : machine.healthScore < 85 ? 'bg-amber-400' : 'bg-emerald-500'
                                }`} 
                                style={{ width: `${machine.healthScore}%` }} 
                              />
                            </div>
                          </div>

                          {/* Click CTA */}
                          <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-zinc-400 group-hover/machine:text-amber-300">
                            <span>Open Asset Diagnostics</span>
                            <ChevronRight className="w-3 h-3 group-hover/machine:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Attention Required Section (CRITICAL, HIGH, MEDIUM Incidents) */}
      <div className="rounded-2xl bg-[#111622] border border-white/[0.08] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Attention Required
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold uppercase">
                Active Operational Anomalies
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Immediate triage queue prioritized by physical severity, production risk, and ISO standards excursion.
            </p>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveAttentionTab('all')}
              className={`px-3 py-1 rounded-lg transition-colors font-mono-tech ${
                activeAttentionTab === 'all' ? 'bg-white/[0.1] text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ALL ({ATTENTION_INCIDENTS.length})
            </button>
            <button
              onClick={() => setActiveAttentionTab('critical')}
              className={`px-3 py-1 rounded-lg transition-colors font-mono-tech ${
                activeAttentionTab === 'critical' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              CRITICAL
            </button>
            <button
              onClick={() => setActiveAttentionTab('high')}
              className={`px-3 py-1 rounded-lg transition-colors font-mono-tech ${
                activeAttentionTab === 'high' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              HIGH
            </button>
            <button
              onClick={() => setActiveAttentionTab('medium')}
              className={`px-3 py-1 rounded-lg transition-colors font-mono-tech ${
                activeAttentionTab === 'medium' ? 'bg-yellow-500/20 text-yellow-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              MEDIUM
            </button>
          </div>
        </div>

        {/* Incident Cards */}
        <div className="space-y-3">
          {filteredAttention.map(item => {
            const isCrit = item.severity === 'CRITICAL';
            const isHigh = item.severity === 'HIGH';
            const isMed = item.severity === 'MEDIUM';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  isCrit
                    ? 'bg-gradient-to-r from-rose-950/20 via-[#151217] to-[#121622] border-rose-500/40 hover:border-rose-500/60 shadow-lg shadow-rose-950/10'
                    : isHigh
                    ? 'bg-gradient-to-r from-amber-950/20 via-[#16141a] to-[#121622] border-amber-500/30 hover:border-amber-500/50'
                    : 'bg-[#0e1219] border-white/[0.08] hover:border-white/[0.14]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2">
                    {/* Badge & Meta */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono-tech font-extrabold tracking-wider uppercase border ${
                        isCrit
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isHigh
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                      }`}>
                        {item.severity}
                      </span>

                      <span className="text-xs font-bold font-mono-tech text-white bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.08]">
                        {item.machineName}
                      </span>

                      <span className="text-xs font-mono-tech text-zinc-400">
                        {item.detectedTime}
                      </span>

                      <span className="text-[11px] font-mono-tech text-amber-400 font-semibold">
                        ({item.variance})
                      </span>
                    </div>

                    {/* Incident Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Sensor channels breakdown */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono-tech">
                      <span className="text-zinc-500">CORRELATED SENSORS:</span>
                      {item.sensors.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-black/40 text-zinc-300 border border-white/[0.08] text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Action required */}
                    <div className="text-xs text-amber-300/90 font-medium flex items-center gap-1.5 pt-1">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Action: {item.actionRequired}</span>
                    </div>
                  </div>

                  {/* Incident Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 self-start">
                    <button
                      onClick={() => {
                        const m = machines.find(mach => mach.id === item.machineId) || machines[0];
                        onSelectMachineForInvestigation(m);
                        onNavigate('/investigations');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Investigate RCA</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        const m = machines.find(mach => mach.id === item.machineId);
                        if (m) onAskNovaWithMachine(m);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Triage with NOVA</span>
                    </button>

                    <button
                      onClick={() => {
                        const m = machines.find(mach => mach.id === item.machineId);
                        if (m) setSelectedMachine(m);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs font-medium transition-colors"
                    >
                      Inspect Twin
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. AI Operational Summary (NOVA Insights) & Live Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: AI Operational Summary (NOVA Insights) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#111622] border border-amber-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      AI Operational Summary
                    </h2>
                    <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold uppercase">
                      NOVA Synthesis
                    </span>
                  </div>
                  <p className="text-[11px] font-mono-tech text-zinc-400">
                    Continuous multi-modal physics & SCADA inference (Generated 42 sec ago)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiSummaryExpanded(!isAiSummaryExpanded)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/[0.03] border border-white/[0.06]"
              >
                {isAiSummaryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* AI Narrative Body */}
            {isAiSummaryExpanded && (
              <div className="space-y-4 pt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 text-zinc-200">
                  <span className="font-bold text-amber-300 font-mono-tech mr-1.5">[EXECUTIVE SUMMARY]:</span>
                  Plant Lucknow is operating at <strong className="text-white">94.7% Health</strong> with stable baseline power draw (<strong className="text-white">124.6 MW</strong>). A singular critical anomaly on <strong className="text-amber-300 font-mono-tech">Compressor C-204</strong> requires immediate attention: Drive-End bearing vibration crossed the ISO 10816 threshold to 5.76 mm/s RMS (+28%) due to restricted cooling flow in HEX-204.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                    <div className="text-[11px] font-mono-tech text-amber-400 uppercase font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Thermodynamic & Electrical Impact</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-normal">
                      Motor M-042 efficiency dropped 6.2% due to Phase B stator resistance drift. Correcting power factor will recover ~$18,400/mo in harmonic power losses.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                    <div className="text-[11px] font-mono-tech text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Prevented Downtime Impact</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-normal">
                      Automated surge valve mitigation on C-204 prevented an uncommanded DCS trip, preserving ~42 metric tons of synthesis throughput.
                    </p>
                  </div>
                </div>

                {/* Key Recommended Actions */}
                <div className="pt-2">
                  <div className="text-xs font-mono-tech text-zinc-400 uppercase tracking-wider mb-2">
                    Priority Automated Next Steps:
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300 font-mono-tech">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">1.</span>
                      <span>Adjust HEX-204 cooling water bypass valve to lower oil inlet temp below 48°C.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">2.</span>
                      <span>Dispatch Shift Bravo mechanic to check Pump P-118 Plan 53B reservoir pressure.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">3.</span>
                      <span>Schedule offline thermography on Extruder Motor M-042 inverter stage.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action */}
          <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="text-[11px] font-mono-tech text-zinc-500">
              Model: Gemini 2.5 Industrial Physics Engine
            </div>

            <button
              onClick={() => onNavigate('/nova')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Consult with NOVA Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Live Activity Timeline */}
        <div className="rounded-2xl bg-[#111622] border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  Live Activity Timeline
                </h2>
              </div>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="mt-4 relative pl-4 space-y-4 border-l border-white/[0.08]">
              {LIVE_TIMELINE.map(event => (
                <div key={event.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#111622] ${
                    event.severity === 'critical' ? 'bg-rose-500' : event.severity === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-mono-tech">
                      <span className="text-zinc-500">{event.time}</span>
                      <span className="text-amber-400 font-semibold">{event.machineId}</span>
                    </div>

                    <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {event.title}
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-snug">
                      {event.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.06]">
            <button
              onClick={() => onNavigate('/investigations')}
              className="w-full py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-mono-tech text-zinc-300 hover:text-white transition-colors text-center"
            >
              View Full Incident Dossiers →
            </button>
          </div>
        </div>

      </div>

      {/* 6. Machine Details Modal (when user clicks on any machine in topology) */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131722] border border-white/[0.12] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-xs font-bold font-mono-tech bg-white/[0.08] text-white">
                    {selectedMachine.id}
                  </span>
                  <span className="text-xs font-mono-tech text-zinc-400">
                    {selectedMachine.tag}
                  </span>
                  <span className={`text-[10px] font-mono-tech uppercase font-bold px-2 py-0.5 rounded ${
                    selectedMachine.status === 'critical' ? 'bg-rose-500/20 text-rose-300' : selectedMachine.status === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {selectedMachine.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedMachine.name}
                </h3>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {selectedMachine.plantArea} • {selectedMachine.oem}
                </div>
              </div>

              <button
                onClick={() => setSelectedMachine(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Health & Remaining Life */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Health Score</div>
                <div className={`text-lg font-bold font-mono-tech mt-0.5 ${
                  selectedMachine.healthScore < 75 ? 'text-rose-400' : selectedMachine.healthScore < 85 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {selectedMachine.healthScore}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Vibration RMS</div>
                <div className="text-lg font-bold font-mono-tech text-amber-400 mt-0.5">
                  {selectedMachine.metrics.vibrationRMS} mm/s
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Bearing Metal</div>
                <div className="text-lg font-bold font-mono-tech text-white mt-0.5">
                  {selectedMachine.metrics.bearingTemp} °C
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Remaining Life</div>
                <div className="text-lg font-bold font-mono-tech text-emerald-400 mt-0.5">
                  {selectedMachine.rulDays} Days
                </div>
              </div>
            </div>

            {/* Sub-component Integrity Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-mono-tech uppercase text-zinc-400 tracking-wider">
                Sub-Component Integrity & Diagnostics:
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedMachine.components.map((comp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-white">{comp.name}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{comp.detail}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-mono-tech font-bold ${
                        comp.status === 'critical' ? 'text-rose-400' : comp.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {comp.health}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => {
                  onAskNovaWithMachine(selectedMachine);
                  setSelectedMachine(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Ask NOVA for Diagnostics</span>
              </button>

              <button
                onClick={() => {
                  onSelectMachineForInvestigation(selectedMachine);
                  setSelectedMachine(null);
                  onNavigate('/machines');
                }}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 transition-colors"
              >
                Open Full Digital Twin →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Customize Dashboard Modal */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#111622] border border-white/[0.12] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Personalize Control Center</h3>
                  <p className="text-xs text-zinc-400">Select active KPI telemetry cards for your role.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="text-[11px] font-mono-tech uppercase text-zinc-400 font-semibold">
                Visible KPI Cards ({activeKpis.length}/6 active)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'health', label: 'Overall Plant Health', desc: 'Composite health % & shift trend' },
                  { id: 'efficiency', label: 'Production Efficiency', desc: 'Plant benchmark capacity vs output' },
                  { id: 'availability', label: 'Equipment Availability', desc: 'Online asset uptime ratio' },
                  { id: 'anomalies', label: 'Active Anomalies', desc: 'Vibration & thermal triggers' },
                  { id: 'incidents', label: 'Critical Incidents', desc: 'Active trip & trip prevention' },
                  { id: 'energy', label: 'Energy Efficiency', desc: 'Active MW draw & load variance' },
                ].map(item => {
                  const checked = isKpiVisible(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleKpi(item.id)}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                        checked
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                          : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/[0.12]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">{item.label}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{item.desc}</div>
                      </div>
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-colors ${
                        checked ? 'bg-amber-400 border-amber-300 text-black' : 'border-zinc-600'
                      }`}>
                        {checked && <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div className="text-[11px] text-emerald-400 font-mono-tech flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auto-saved to your personal workspace</span>
              </div>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
