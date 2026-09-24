import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Clock, 
  Sliders, 
  Cpu, 
  Building2, 
  Check, 
  Loader2,
  Wrench,
  AlertTriangle,
  Zap,
  Factory,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { IndustrialMachine, IndustrialPlant, UserProfile } from '../../types/industrial';
import { IndustrialReportItem, ReportType } from '../../data/reportsData';

interface ReportGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  machines: IndustrialMachine[];
  currentPlant: IndustrialPlant;
  currentUser: UserProfile;
  onReportGenerated: (report: IndustrialReportItem) => void;
}

export const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({
  isOpen,
  onClose,
  machines,
  currentPlant,
  currentUser,
  onReportGenerated
}) => {
  const [reportType, setReportType] = useState<ReportType>('incident-investigation');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('C-204');
  const [customReportName, setCustomReportName] = useState<string>('');
  const [includedSections, setIncludedSections] = useState({
    summary: true,
    timeline: true,
    sensorEvidence: true,
    correlations: true,
    potentialCauses: true,
    aiAnalysis: true,
    recommendedActions: true,
    maintenanceNotes: true,
    conclusion: true
  });

  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState(0);

  if (!isOpen) return null;

  const reportTypeOptions: { id: ReportType; label: string; icon: any; desc: string }[] = [
    {
      id: 'incident-investigation',
      label: 'Incident Investigation',
      icon: AlertTriangle,
      desc: '7-step root cause analysis, multi-sensor excursions, and CAPA mitigation'
    },
    {
      id: 'machine-health',
      label: 'Machine Health',
      icon: Wrench,
      desc: 'Rotating asset ISO 10816 vibration baselines and Remaining Useful Life (RUL)'
    },
    {
      id: 'maintenance-summary',
      label: 'Maintenance Summary',
      icon: Sliders,
      desc: 'Preventive work orders, MTTR metrics, and critical spares staging'
    },
    {
      id: 'plant-performance',
      label: 'Plant Performance',
      icon: Factory,
      desc: 'Overall Equipment Effectiveness (OEE), line throughput, and cycle times'
    },
    {
      id: 'energy-analysis',
      label: 'Energy Analysis',
      icon: Zap,
      desc: 'Peak electrical power draw, tariff limits, and recoverable waste areas'
    },
    {
      id: 'executive-operations',
      label: 'Executive Operations Report',
      icon: ShieldCheck,
      desc: 'Enterprise risk index, financial exposure, and board-level reliability summary'
    }
  ];

  const handleGenerate = () => {
    setIsCompiling(true);
    setCompilingStep(1);

    setTimeout(() => {
      setCompilingStep(2);
    }, 600);

    setTimeout(() => {
      setCompilingStep(3);
    }, 1200);

    setTimeout(() => {
      setCompilingStep(4);
    }, 1800);

    setTimeout(() => {
      const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];
      const randomDocNum = Math.floor(1000 + Math.random() * 9000);
      const prefix = reportType === 'incident-investigation' ? 'INV' :
                     reportType === 'machine-health' ? 'MHA' :
                     reportType === 'maintenance-summary' ? 'MNT' :
                     reportType === 'plant-performance' ? 'OEE' :
                     reportType === 'energy-analysis' ? 'ENG' : 'EXEC';

      const typeLabel = reportTypeOptions.find(o => o.id === reportType)?.label || 'Incident Investigation';
      const defaultName = reportType === 'incident-investigation'
        ? `Incident Investigation: ${selectedMachine.name} ${selectedMachine.id} Vibration & Thermal Excursion`
        : `${typeLabel}: ${selectedMachine.id} ${selectedMachine.name} Operational Review`;

      const finalName = customReportName.trim() || defaultName;

      const newReport: IndustrialReportItem = {
        id: `rpt-gen-${Date.now()}`,
        reportNumber: `RPT-2026-${prefix}-${randomDocNum}`,
        name: finalName,
        type: reportType,
        typeLabel,
        createdDate: '21 Sep 2026',
        machineOrPlant: `${selectedMachine.name} (${selectedMachine.id}) // ${selectedMachine.location}`,
        status: 'Generated',
        generatedBy: `NOVA AI Copilot & ${currentUser.name}`,
        summary: `Automated industrial diagnostic dossier generated for ${selectedMachine.name} (${selectedMachine.id}). Evaluated across live SCADA telemetry, multi-sensor Pearson cross-correlations, and ISO 10816 standards.`,
        sections: {
          incidentSummary: includedSections.summary
            ? `Telemetry supervisory diagnostics completed for ${selectedMachine.name} (${selectedMachine.id}) on ${selectedMachine.location || selectedMachine.plantArea}. Telemetry shows operational health at ${selectedMachine.healthScore}%, current vibration at ${selectedMachine.metrics.vibrationRMS} mm/s, and bearing temperature at ${selectedMachine.metrics.bearingTemp}°C. Current risk level is classified as ${selectedMachine.risk || 'NORMAL'}.`
            : undefined,
          timeline: includedSections.timeline
            ? [
                { time: '21 Sep 2026 — 08:00', event: 'Shift handover verified telemetry parameters.', severity: 'info' },
                { time: '21 Sep 2026 — 09:15', event: `Operating load reached ${selectedMachine.operatingLoadPct || 80}%. Steady-state baselines maintained.`, severity: 'info' },
                { time: '21 Sep 2026 — 10:05', event: `NOVA automated correlation scan detected deviation in ${selectedMachine.id}.`, severity: selectedMachine.risk === 'HIGH' ? 'critical' : 'warning' },
                { time: '21 Sep 2026 — 10:10', event: 'Report compilation requested and verified by on-duty reliability engineer.', severity: 'info' }
              ]
            : undefined,
          sensorEvidence: includedSections.sensorEvidence
            ? [
                { parameter: 'Radial Vibration Velocity', value: `${selectedMachine.metrics.vibrationRMS} mm/s RMS`, baseline: '4.50 mm/s', deviation: selectedMachine.risk === 'HIGH' ? '+28%' : '+3.2%', severity: selectedMachine.risk === 'HIGH' ? 'Critical' : 'Normal' },
                { parameter: 'Bearing Metal Temperature', value: `${selectedMachine.metrics.bearingTemp}°C`, baseline: '72.0°C', deviation: '+14%', severity: selectedMachine.risk === 'HIGH' ? 'Warning' : 'Normal' },
                { parameter: 'Lubrication Header Pressure', value: `${selectedMachine.metrics.suctionPressure || 2.94} bar`, baseline: '3.20 bar', deviation: '-8.1%', severity: 'Warning' },
                { parameter: 'Operating Load', value: `${selectedMachine.operatingLoadPct || 85}%`, baseline: '80.0%', deviation: '+10%', severity: 'Advisory' }
              ]
            : undefined,
          detectedCorrelations: includedSections.correlations
            ? [
                { pair: 'Lube Pressure vs Vibration Velocity', coefficient: -0.89, interpretation: 'High negative correlation confirms fluid-film pressure reduction directly accelerates bearing vibration.' },
                { pair: 'Bearing Metal Temp vs Vibration', coefficient: 0.84, interpretation: 'Strong positive correlation indicates friction-induced thermal expansion in journal babbit.' }
              ]
            : undefined,
          potentialCauses: includedSections.potentialCauses
            ? [
                { rank: 1, cause: 'Hydrodynamic Tilt-Pad Bearing Micro-Spalling', probability: 0.78, notes: 'Sub-synchronous 0.44X rotational frequency peak confirmed.' },
                { rank: 2, cause: 'Lubrication Viscosity Breakdown / Shear', probability: 0.54, notes: 'Thermal degradation of synthetic ISO VG 46 lubricant.' },
                { rank: 3, cause: 'Shaft Misalignment / Coupling Wear', probability: 0.28, notes: 'Within allowable ISO tolerances; minor secondary contribution.' }
              ]
            : undefined,
          aiAnalysis: includedSections.aiAnalysis
            ? `NOVA AI synthesis confirms physical behavior of ${selectedMachine.name} is consistent with localized fluid-film bearing wear. Safe operating window is estimated at 14 continuous operating days under 80% throttled load before emergency vibration trip thresholds are reached.`
            : undefined,
          recommendedActions: includedSections.recommendedActions
            ? [
                { priority: 'P1 - High', action: `Schedule bearing and lubrication inspection for ${selectedMachine.id}.`, owner: 'Lead Reliability Eng.', deadline: 'Next 72 Hours' },
                { priority: 'P2 - Medium', action: 'Sample and analyze lubricant for particulate contamination.', owner: 'Lube Specialist', deadline: 'Within 5 Days' }
              ]
            : undefined,
          maintenanceNotes: includedSections.maintenanceNotes
            ? `Work order initiated under CMMS Tag #WO-AUTO-${randomDocNum}. Recommended replacement parts cross-referenced against Lucknow Central Stores inventory.`
            : undefined,
          investigationConclusion: includedSections.conclusion
            ? `Investigation completed and validated. Implementing recommended preventive actions prevents unscheduled line downtime and preserves machine health index.`
            : undefined
        }
      };

      setIsCompiling(false);
      onReportGenerated(newReport);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0d1118] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#111622] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Generate Industrial Report Dossier
              </h3>
              <p className="text-[11px] text-zinc-400">
                NOVA AI multi-channel telemetry synthesis & ISO compliance formatting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isCompiling}
            className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isCompiling ? (
          <div className="p-10 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <Cpu className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white tracking-tight">
                Compiling Industrial Report with NOVA...
              </h4>
              <p className="text-xs text-zinc-400 font-mono-tech">
                {compilingStep === 1 && 'Querying SCADA time-series sensor archive...'}
                {compilingStep === 2 && 'Executing multi-variable Pearson correlation matrix...'}
                {compilingStep === 3 && 'Synthesizing physics-informed root cause probabilities...'}
                {compilingStep === 4 && 'Formatting formal ISO 14224 / API 670 audit document...'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md mx-auto h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${(compilingStep / 4) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
            
            {/* Step 1: Select Report Type */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono-tech uppercase text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>1. Select Report Type</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {reportTypeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = reportType === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => setReportType(opt.id)}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#151a26] border-amber-500/60 ring-1 ring-amber-500/30'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-white/[0.04] text-zinc-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {opt.label}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Target Machine / Asset */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono-tech uppercase text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>2. Select Target Machinery / Production Train</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {machines.map((m) => {
                  const isSelected = selectedMachineId === m.id;

                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMachineId(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/50 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tech text-xs font-bold text-amber-400">{m.id}</span>
                        <span className="text-[10px] font-mono-tech">{m.healthScore}%</span>
                      </div>
                      <div className="text-xs font-bold text-zinc-200 mt-0.5 truncate">{m.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate mt-0.5">{m.location}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Custom Title (Optional) */}
            <div className="space-y-2">
              <label className="text-xs font-mono-tech uppercase text-zinc-400">
                Custom Report Title (Optional)
              </label>
              <input
                type="text"
                value={customReportName}
                onChange={(e) => setCustomReportName(e.target.value)}
                placeholder="Leave blank for auto-generated formal title..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 font-mono-tech"
              />
            </div>

            {/* Step 4: Sections to Include */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-tech uppercase text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>3. Sections to Include</span>
                </label>
                <span className="text-[10px] font-mono-tech text-amber-400">All 9 Standard Sections</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { key: 'summary', label: 'Incident Summary' },
                  { key: 'timeline', label: 'Timeline' },
                  { key: 'sensorEvidence', label: 'Sensor Evidence' },
                  { key: 'correlations', label: 'Detected Correlations' },
                  { key: 'potentialCauses', label: 'Potential Causes' },
                  { key: 'aiAnalysis', label: 'AI Analysis' },
                  { key: 'recommendedActions', label: 'Recommended Actions' },
                  { key: 'maintenanceNotes', label: 'Maintenance Notes' },
                  { key: 'conclusion', label: 'Investigation Conclusion' }
                ].map((sec) => {
                  const isChecked = includedSections[sec.key as keyof typeof includedSections];
                  return (
                    <button
                      key={sec.key}
                      onClick={() => setIncludedSections(prev => ({
                        ...prev,
                        [sec.key]: !isChecked
                      }))}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-colors ${
                        isChecked
                          ? 'bg-white/[0.04] border-white/[0.12] text-zinc-200'
                          : 'bg-white/[0.01] border-white/[0.04] text-zinc-500'
                      }`}
                    >
                      <span className="text-[11px] font-medium">{sec.label}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center ${
                        isChecked ? 'bg-amber-400 text-black' : 'border border-zinc-600'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Submission Button */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-4">
              <div className="text-[11px] font-mono-tech text-zinc-400">
                Author: <span className="text-zinc-200">{currentUser.name}</span> (Clearance: {currentUser.role})
              </div>

              <button
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Compile Official Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
