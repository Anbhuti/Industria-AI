import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  User, 
  ShieldCheck, 
  ExternalLink,
  Filter,
  Activity,
  Plus,
  Share2,
  Eye,
  Sparkles,
  Search,
  AlertTriangle,
  Wrench,
  Zap,
  Factory,
  ShieldAlert,
  Layers,
  ArrowRight,
  Sliders,
  Check
} from 'lucide-react';
import { AppRoute, IndustrialMachine, IndustrialPlant, UserProfile } from '../../types/industrial';
import { INITIAL_REPORTS, IndustrialReportItem, ReportType } from '../../data/reportsData';
import { ReportDetailModal } from '../reports/ReportDetailModal';
import { ReportGenerationModal } from '../reports/ReportGenerationModal';
import { ReportShareModal } from '../reports/ReportShareModal';

interface ReportsViewProps {
  machines: IndustrialMachine[];
  currentPlant: IndustrialPlant;
  currentUser: UserProfile;
  onNavigate?: (route: AppRoute) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  machines,
  currentPlant,
  currentUser,
  onNavigate
}) => {
  const [reports, setReports] = useState<IndustrialReportItem[]>(INITIAL_REPORTS);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [activeReportForView, setActiveReportForView] = useState<IndustrialReportItem | null>(null);
  const [activeReportForShare, setActiveReportForShare] = useState<IndustrialReportItem | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listen for copilot trigger 'nova:open-report'
  useEffect(() => {
    const handleNovaOpenReport = () => {
      setIsGenerateModalOpen(true);
    };

    window.addEventListener('nova:open-report', handleNovaOpenReport);
    return () => {
      window.removeEventListener('nova:open-report', handleNovaOpenReport);
    };
  }, []);

  const reportCategories: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Reports', count: reports.length },
    { id: 'incident-investigation', label: 'Incident Investigation', count: reports.filter(r => r.type === 'incident-investigation').length },
    { id: 'machine-health', label: 'Machine Health', count: reports.filter(r => r.type === 'machine-health').length },
    { id: 'maintenance-summary', label: 'Maintenance Summary', count: reports.filter(r => r.type === 'maintenance-summary').length },
    { id: 'plant-performance', label: 'Plant Performance', count: reports.filter(r => r.type === 'plant-performance').length },
    { id: 'energy-analysis', label: 'Energy Analysis', count: reports.filter(r => r.type === 'energy-analysis').length },
    { id: 'executive-operations', label: 'Executive Operations', count: reports.filter(r => r.type === 'executive-operations').length }
  ];

  const filteredReports = reports.filter(r => {
    const matchesCategory = selectedTypeFilter === 'all' || r.type === selectedTypeFilter;
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.machineOrPlant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadReport = (report: IndustrialReportItem) => {
    const reportContent = `
================================================================================
                    INDUSTRIX AI // INDUSTRIAL AUDIT DOSSIER
================================================================================
DOCUMENT ID:     ${report.reportNumber}
TITLE:           ${report.name}
TYPE:            ${report.typeLabel}
CREATED DATE:    ${report.createdDate}
FACILITY/ASSET:  ${report.machineOrPlant}
STATUS:          ${report.status}
AUTHOR:          ${report.generatedBy}
DATA INTEGRITY:  SIMULATED INDUSTRIAL DATA (ISO 14224 / API 670 COMPLIANT SPEC)
--------------------------------------------------------------------------------

1. EXECUTIVE INCIDENT SUMMARY
${report.sections.incidentSummary || report.summary}

2. TELEMETRY SENSOR EVIDENCE
${report.sections.sensorEvidence?.map(e => `• ${e.parameter}: ${e.value} (Baseline: ${e.baseline}, Deviation: ${e.deviation}, Severity: ${e.severity})`).join('\n') || 'N/A'}

3. DETECTED CORRELATIONS
${report.sections.detectedCorrelations?.map(c => `• ${c.pair}: Pearson Coefficient = ${c.coefficient} (${c.interpretation})`).join('\n') || 'N/A'}

4. POTENTIAL CAUSES (PROBABILISTIC ANALYSIS)
${report.sections.potentialCauses?.map(p => `• [Rank ${p.rank}] ${p.cause} - Likelihood: ${Math.round(p.probability * 100)}%\n  Notes: ${p.notes}`).join('\n') || 'N/A'}

5. NOVA AI DIAGNOSTIC ANALYSIS
${report.sections.aiAnalysis || 'N/A'}

6. RECOMMENDED PREVENTIVE & CORRECTIVE ACTIONS
${report.sections.recommendedActions?.map(a => `• [${a.priority}] ${a.action} (Owner: ${a.owner}, Due: ${a.deadline})`).join('\n') || 'N/A'}

7. MAINTENANCE NOTES
${report.sections.maintenanceNotes || 'N/A'}

8. INVESTIGATION CONCLUSION & SIGN-OFF
${report.sections.investigationConclusion || 'N/A'}

================================================================================
              CONFIDENTIAL & PROPRIETARY — INDUSTRIX AI SUITE
================================================================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.reportNumber}_${report.type}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Downloaded ${report.reportNumber} dossier.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReportGenerated = (newReport: IndustrialReportItem) => {
    setReports(prev => [newReport, ...prev]);
    setIsGenerateModalOpen(false);
    setActiveReportForView(newReport);
    setToastMessage(`Successfully generated ${newReport.reportNumber}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'incident-investigation':
        return AlertTriangle;
      case 'machine-health':
        return Wrench;
      case 'maintenance-summary':
        return Sliders;
      case 'plant-performance':
        return Factory;
      case 'energy-analysis':
        return Zap;
      case 'executive-operations':
        return ShieldCheck;
      default:
        return FileText;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 mb-1.5">
            <FileText className="w-4 h-4" />
            <span>INDUSTRIX AI // FORMAL COMPLIANCE & INCIDENT DOSSIERS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Industrial Reports & Audit Engine
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Generate, inspect, download, and share official regulatory documentation across incident investigations, machine health, maintenance, plant OEE, energy consumption, and executive summaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mandatory Simulated Industrial Data Notice */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono-tech flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>SIMULATED INDUSTRIAL DATA</span>
          </div>

          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Generate New Report</span>
          </button>
        </div>
      </div>

      {/* Action Toast Feedback Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-tech flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-zinc-400">Archived to CMMS</span>
        </div>
      )}

      {/* Featured Example Dossier Banner: Incident Investigation Compressor C-204 */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#121824] via-[#0f141e] to-[#0c1017] border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono-tech text-amber-400 font-bold">
              <span>PRIORITY DOSSIER // COMPRESSOR C-204</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>RPT-2026-INV-8841</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              Incident Investigation: Compressor C-204 Bearing Vibration Surge (+28%)
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              Complete 9-section root cause dossier containing multi-sensor correlation (r = -0.89), Pearson matrix, tilt-pad wear hypotheses, and planned CAPA changeover.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={() => {
              const target = reports.find(r => r.id === 'rpt-c204-inv') || reports[0];
              setActiveReportForView(target);
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Full Investigation</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, ID, machine, or author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 font-mono-tech"
            />
          </div>

          <div className="text-xs font-mono-tech text-zinc-400">
            Showing <span className="text-amber-400 font-bold">{filteredReports.length}</span> of {reports.length} Reports
          </div>
        </div>

        {/* 6 Report Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono-tech no-scrollbar">
          {reportCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedTypeFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors border ${
                selectedTypeFilter === cat.id
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className="ml-1.5 text-[10px] opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => {
          const Icon = getTypeIcon(report.type);

          return (
            <div
              key={report.id}
              className="p-5 rounded-3xl bg-[#0e121a] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              {/* Card Header */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono-tech text-amber-400 font-semibold">
                        {report.reportNumber}
                      </div>
                      <div className="text-[11px] font-mono-tech text-zinc-400">
                        {report.typeLabel}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase border shrink-0 ${
                    report.status === 'Final / Approved'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : report.status === 'Generated'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : report.status === 'Under Review'
                      ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                      : 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
                  }`}>
                    {report.status}
                  </span>
                </div>

                {/* Report Name */}
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                  {report.name}
                </h3>

                {/* Machine / Plant */}
                <div className="text-xs text-zinc-400 flex items-center gap-1.5 pt-1">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{report.machineOrPlant}</span>
                </div>

                {/* Created Date */}
                <div className="text-[11px] font-mono-tech text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>Created: {report.createdDate}</span>
                </div>

                {/* Generated By */}
                <div className="text-[11px] font-mono-tech text-zinc-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">By: {report.generatedBy}</span>
                </div>
              </div>

              {/* Action Buttons: View, Generate, Download, Share */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setActiveReportForView(report)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-1 transition-colors"
                  title="View Report"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => {
                    setIsGenerateModalOpen(true);
                  }}
                  className="p-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                  title="Generate New from Template"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDownloadReport(report)}
                  className="p-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                  title="Download Dossier"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveReportForShare(report)}
                  className="p-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                  title="Share Report"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {activeReportForView && (
        <ReportDetailModal
          report={activeReportForView}
          isOpen={true}
          onClose={() => setActiveReportForView(null)}
          onShare={(rep) => {
            setActiveReportForView(null);
            setActiveReportForShare(rep);
          }}
        />
      )}

      {isGenerateModalOpen && (
        <ReportGenerationModal
          isOpen={true}
          onClose={() => setIsGenerateModalOpen(false)}
          machines={machines}
          currentPlant={currentPlant}
          currentUser={currentUser}
          onReportGenerated={handleReportGenerated}
        />
      )}

      {activeReportForShare && (
        <ReportShareModal
          report={activeReportForShare}
          isOpen={true}
          onClose={() => setActiveReportForShare(null)}
        />
      )}
    </div>
  );
};
