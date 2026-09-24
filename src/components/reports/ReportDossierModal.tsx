import React from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Printer, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  X
} from 'lucide-react';
import { ReportModel } from '../../types/industrial';

interface ReportDossierModalProps {
  report: ReportModel | null;
  onClose: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export const ReportDossierModal: React.FC<ReportDossierModalProps> = ({
  report,
  onClose,
  onDownload,
  onShare
}) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const sections = report.sections;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden z-10 my-6 font-sans">
        {/* Top Control Header */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-zinc-800 bg-zinc-950 text-xs font-mono-tech">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-white tracking-wider">INDUSTRIX AI // AUDIT DOSSIER VIEWER</span>
            <span className="text-zinc-500">• {report.reportNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>

            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            )}

            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Industrial Report Paper Body */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto bg-zinc-950 text-zinc-200 space-y-8 font-sans">
          {/* Document Header with INDUSTRIX Branding */}
          <div className="border-b border-zinc-800 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 text-xs font-mono-tech font-extrabold tracking-wider">
                    INDUSTRIX AI
                  </span>
                  <span className="text-xs font-mono-tech text-zinc-400">
                    AUTONOMOUS INDUSTRIAL INTELLIGENCE
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {report.name}
                </h1>
                <p className="text-sm font-mono-tech text-emerald-400 mt-1">
                  Report Classification: {report.typeLabel} • {report.status}
                </p>
              </div>

              <div className="text-right font-mono-tech text-xs text-zinc-400 space-y-1">
                <div>Document ID: <strong className="text-white">{report.reportNumber}</strong></div>
                <div>Created: <span className="text-zinc-300">{report.createdDate}</span></div>
                <div>Author: <span className="text-zinc-300">{report.generatedBy}</span></div>
                <div>Facility: <span className="text-zinc-300">{report.machineOrPlant}</span></div>
              </div>
            </div>

            {/* Compliance Standards Badges */}
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-800/80">
              <span className="text-xs font-mono-tech text-zinc-500 uppercase">Certified Standards:</span>
              {report.standardsCompliance.map((std, i) => (
                <span key={i} className="text-xs font-mono-tech px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {std}
                </span>
              ))}
            </div>
          </div>

          {/* 1. Incident / Executive Summary */}
          <section className="space-y-2">
            <h2 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              1. Incident & Operational Summary
            </h2>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm leading-relaxed text-zinc-300">
              {sections.incidentSummary || report.summary}
            </div>
          </section>

          {/* 2. Chronological Timeline */}
          {sections.timeline && sections.timeline.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                2. Chronological Sequence of Events
              </h2>
              <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
                {sections.timeline.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-start gap-4 text-xs font-mono-tech">
                    <span className="text-zinc-500 shrink-0">{item.time}</span>
                    <div className="flex-1 font-sans text-zinc-200">
                      {item.event}
                    </div>
                    <span className={`px-2 py-0.5 rounded uppercase text-[10px] font-bold shrink-0 ${
                      item.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      item.severity === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Sensor Evidence Table */}
          {sections.sensorEvidence && sections.sensorEvidence.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                3. High-Frequency SCADA Sensor Evidence
              </h2>
              <div className="border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono-tech">
                  <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase">
                    <tr>
                      <th className="p-3">Parameter Channel</th>
                      <th className="p-3">Observed Value</th>
                      <th className="p-3">Baseline</th>
                      <th className="p-3">Deviation</th>
                      <th className="p-3 text-right">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-950">
                    {sections.sensorEvidence.map((ev, i) => (
                      <tr key={i}>
                        <td className="p-3 text-zinc-200 font-sans font-medium">{ev.parameter}</td>
                        <td className="p-3 text-white font-bold">{ev.value}</td>
                        <td className="p-3 text-zinc-400">{ev.baseline}</td>
                        <td className="p-3 text-rose-400 font-bold">{ev.deviation}</td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            ev.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {ev.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 4. Detected Correlations */}
          {sections.detectedCorrelations && sections.detectedCorrelations.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                4. Thermodynamic Cross-Parameter Correlations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sections.detectedCorrelations.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
                      <span className="font-bold text-white">{c.pair}</span>
                      <span className="text-emerald-400 font-bold">r = {c.coefficient}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {c.interpretation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. Potential Causes & AI Diagnostics */}
          <section className="space-y-3">
            <h2 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              5. Physics-Informed Neural Network Analysis
            </h2>
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm leading-relaxed text-zinc-200">
              {sections.aiAnalysis || 'NOVA multi-physics solver verified fluid film collapse on Drive-End Tilt Pad bearing shoes resulting from heat exchanger cooling water silt restriction.'}
            </div>

            {sections.potentialCauses && sections.potentialCauses.length > 0 && (
              <div className="space-y-2 mt-3">
                {sections.potentialCauses.map((pc, i) => (
                  <div key={i} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs font-mono-tech">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                        {pc.rank}
                      </span>
                      <span className="text-zinc-200 font-sans">{pc.cause}</span>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {(pc.probability * 100).toFixed(0)}% Probability
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 6. Recommended Actions & Maintenance Notes */}
          {sections.recommendedActions && sections.recommendedActions.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                6. Corrective Actions (CAPA) & Dispatch Schedule
              </h2>
              <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
                {sections.recommendedActions.map((act, i) => (
                  <div key={i} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-tech">
                    <div className="flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 font-bold text-zinc-300">
                        {act.priority}
                      </span>
                      <span className="font-sans text-zinc-200">{act.action}</span>
                    </div>
                    <div className="text-zinc-400">
                      Owner: <strong className="text-zinc-300">{act.owner}</strong> • Due: {act.deadline}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. Formal Investigation Conclusion & Sign-Off */}
          <section className="pt-4 border-t border-zinc-800 space-y-4">
            <h2 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              7. Formal Sign-Off & ISO 14224 Compliance
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {sections.investigationConclusion || 'This investigation was conducted with continuous automated telemetry streaming conforming to API 670 Standard for Machinery Protection Systems and ISO 14224. Root cause verified and mitigations enacted.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/60 text-xs font-mono-tech text-zinc-400">
              <div>
                <span className="text-zinc-500">Lead Reliability Director:</span>
                <div className="text-white font-bold mt-1">Anubhuti (DIR-2004-AP)</div>
                <div className="text-[10px] text-zinc-500">Digital Certificate Verified • Level 4 Clearance</div>
              </div>
              <div className="sm:text-right">
                <span className="text-zinc-500">Execution Status:</span>
                <div className="text-emerald-400 font-bold mt-1">APPROVED & LOGGED IN DCS AUDIT REPO</div>
                <div className="text-[10px] text-zinc-500">Timestamp: {report.createdDate}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
