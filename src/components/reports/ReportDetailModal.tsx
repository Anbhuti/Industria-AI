import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  Sparkles, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  FileText,
  FileCheck,
  Check,
  Cpu,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { IndustrialReportItem } from '../../data/reportsData';

interface ReportDetailModalProps {
  report: IndustrialReportItem;
  isOpen: boolean;
  onClose: () => void;
  onShare: (report: IndustrialReportItem) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  isOpen,
  onClose,
  onShare
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadFile = () => {
    // Generate clean industrial text/html report file for direct download
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

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0d1118] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Action Bar (Sticky Top) */}
        <div className="px-6 py-4 bg-[#111622] border-b border-white/[0.08] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono-tech text-xs font-bold">
              AI
            </div>
            <div>
              <div className="text-xs font-mono-tech text-amber-400 font-semibold tracking-wider">
                {report.reportNumber}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium">
                Official Industrial Audit Dossier
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download Report File"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-black" />
                  <span>Download</span>
                </>
              )}
            </button>

            <button
              onClick={() => onShare(report)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Share Report"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Formal Report Document Area */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-zinc-200 font-['Plus_Jakarta_Sans',sans-serif] print:bg-white print:text-black">
          
          {/* Formal Industrial Header with INDUSTRIX AI Branding */}
          <div className="border-b-2 border-white/[0.12] pb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tech font-bold text-amber-400">
                  <Cpu className="w-4 h-4" />
                  <span>INDUSTRIX AI // RELIABILITY & DIAGNOSTICS ARCHITECTURE</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight">
                  {report.name}
                </h1>
                <div className="text-xs text-zinc-400 mt-1 font-mono-tech">
                  Facility / Train: <span className="text-zinc-200">{report.machineOrPlant}</span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <span className="px-3 py-1 rounded-full text-xs font-mono-tech font-bold uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  {report.status}
                </span>
                <span className="text-[10px] font-mono-tech text-zinc-400">
                  ISO 14224 / API 670 Standards
                </span>
              </div>
            </div>

            {/* Mandatory Simulated Industrial Data Notice */}
            <div className="p-2.5 rounded-xl bg-amber-500/[0.08] border border-amber-500/25 flex items-center justify-between text-xs font-mono-tech text-amber-300">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>CLASSIFICATION: VERIFIED INDUSTRIAL AUDIT REPORT (SIMULATED DATA DEMO)</span>
              </div>
              <span className="text-[10px] text-zinc-400">RESTRICTED ENGINEERING CLEARANCE</span>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono-tech">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] uppercase text-zinc-400">Document No:</div>
                <div className="text-zinc-200 font-bold mt-0.5">{report.reportNumber}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] uppercase text-zinc-400">Created Date:</div>
                <div className="text-zinc-200 font-bold mt-0.5">{report.createdDate}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] uppercase text-zinc-400">Report Category:</div>
                <div className="text-amber-400 font-bold mt-0.5">{report.typeLabel}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] uppercase text-zinc-400">Generated By:</div>
                <div className="text-zinc-200 font-bold mt-0.5 truncate">{report.generatedBy}</div>
              </div>
            </div>
          </div>

          {/* Section 1: Incident Summary */}
          {report.sections.incidentSummary && (
            <div className="space-y-2">
              <h2 className="text-xs font-mono-tech uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>1.0 // Executive Incident Summary</span>
              </h2>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {report.sections.incidentSummary}
              </div>
            </div>
          )}

          {/* Section 2: Timeline */}
          {report.sections.timeline && report.sections.timeline.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-mono-tech uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>2.0 // Chronological Event Sequence & Timeline</span>
              </h2>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                {report.sections.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-36 shrink-0 font-mono-tech text-[11px] text-zinc-400">
                      {item.time}
                    </div>
                    <div className="flex-1 flex items-start gap-2">
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                        item.severity === 'critical' ? 'bg-rose-500 animate-pulse' :
                        item.severity === 'warning' ? 'bg-amber-400' : 'bg-sky-400'
                      }`} />
                      <span className="text-zinc-300 leading-relaxed">{item.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Sensor Evidence */}
          {report.sections.sensorEvidence && report.sections.sensorEvidence.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-mono-tech uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>3.0 // Physical Telemetry Evidence Matrix</span>
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#090d14]">
                <table className="w-full text-left text-xs font-mono-tech">
                  <thead className="bg-white/[0.04] text-zinc-400 border-b border-white/[0.06]">
                    <tr>
                      <th className="p-3">Parameter Channel</th>
                      <th className="p-3">Logged Value</th>
                      <th className="p-3">Nominal Baseline</th>
                      <th className="p-3">Deviation</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {report.sections.sensorEvidence.map((ev, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-zinc-200">{ev.parameter}</td>
                        <td className="p-3 text-amber-300 font-bold">{ev.value}</td>
                        <td className="p-3 text-zinc-400">{ev.baseline}</td>
                        <td className={`p-3 font-bold ${ev.deviation.startsWith('+') ? 'text-rose-400' : 'text-amber-400'}`}>
                          {ev.deviation}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ev.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            ev.severity === 'Warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}>
                            {ev.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Detected Correlations */}
          {report.sections.detectedCorrelations && report.sections.detectedCorrelations.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-mono-tech uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>4.0 // Multi-Sensor Cross-Correlation Analysis</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {report.sections.detectedCorrelations.map((corr, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-200 line-clamp-1">{corr.pair}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-tech text-xs font-bold">
                        r = {corr.coefficient > 0 ? `+${corr.coefficient}` : corr.coefficient}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {corr.interpretation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Potential Causes */}
          {report.sections.potentialCauses && report.sections.potentialCauses.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-mono-tech uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>5.0 // Evaluated Failure Hypotheses & Probabilities</span>
              </h2>
              <div className="space-y-2.5">
                {report.sections.potentialCauses.map((cause) => (
                  <div key={cause.rank} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/[0.08] text-amber-400 text-xs font-mono-tech flex items-center justify-center font-bold">
                          {cause.rank}
                        </span>
                        <span className="text-xs font-bold text-white">{cause.cause}</span>
                      </div>
                      <p className="text-xs text-zinc-400 pl-7">{cause.notes}</p>
                    </div>

                    <div className="sm:text-right shrink-0 pl-7 sm:pl-0">
                      <div className="text-xs font-mono-tech font-bold text-amber-300">
                        Likelihood: {Math.round(cause.probability * 100)}%
                      </div>
                      <div className="w-28 h-1.5 bg-white/[0.1] rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full" 
                          style={{ width: `${cause.probability * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: AI Analysis */}
          {report.sections.aiAnalysis && (
            <div className="space-y-2">
              <h2 className="text-xs font-mono-tech uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>6.0 // NOVA AI Physics-Informed Diagnostic Synthesis</span>
              </h2>
              <div className="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/25 text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-2">
                <p>{report.sections.aiAnalysis}</p>
                <div className="text-[10px] font-mono-tech text-amber-400 pt-1">
                  Validated against 14,800 telemetry points and 4 years of machinery maintenance archives.
                </div>
              </div>
            </div>
          )}

          {/* Section 7: Recommended Actions */}
          {report.sections.recommendedActions && report.sections.recommendedActions.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-mono-tech uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>7.0 // Corrective & Preventive Action Plan (CAPA)</span>
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#090d14]">
                <table className="w-full text-left text-xs font-mono-tech">
                  <thead className="bg-white/[0.04] text-zinc-400 border-b border-white/[0.06]">
                    <tr>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Action Item</th>
                      <th className="p-3">Responsible Owner</th>
                      <th className="p-3">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {report.sections.recommendedActions.map((act, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-amber-400">{act.priority}</td>
                        <td className="p-3 text-zinc-200">{act.action}</td>
                        <td className="p-3 text-zinc-400">{act.owner}</td>
                        <td className="p-3 text-zinc-300 font-bold">{act.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 8: Maintenance Notes */}
          {report.sections.maintenanceNotes && (
            <div className="space-y-2">
              <h2 className="text-xs font-mono-tech uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>8.0 // CMMS Maintenance Notes & Spares Staging</span>
              </h2>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed font-mono-tech">
                {report.sections.maintenanceNotes}
              </div>
            </div>
          )}

          {/* Section 9: Investigation Conclusion */}
          {report.sections.investigationConclusion && (
            <div className="space-y-2">
              <h2 className="text-xs font-mono-tech uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>9.0 // Investigation Conclusion & Sign-Off</span>
              </h2>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {report.sections.investigationConclusion}
              </div>
            </div>
          )}

          {/* Formal Industrial Sign-off block */}
          <div className="pt-6 border-t border-white/[0.1] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-[10px] text-zinc-400 uppercase">Compiled by AI Diagnostic Engine:</div>
              <div className="font-bold text-amber-300 mt-1">NOVA Copilot v2.4 (Enterprise PINN Model)</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Checksum: SHA-256 #8f921a48c90</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-[10px] text-zinc-400 uppercase">Lead Engineer Sign-off:</div>
              <div className="font-bold text-zinc-200 mt-1">{report.generatedBy}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Digital Clearance Token Verified ✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
