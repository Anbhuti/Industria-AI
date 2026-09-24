import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  X,
  ExternalLink
} from 'lucide-react';
import { IncidentInvestigation } from '../../types/industrial';

interface InvestigationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
}

export const InvestigationReportModal: React.FC<InvestigationReportModalProps> = ({
  isOpen,
  onClose,
  incidentId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-[#0e1219] border border-white/[0.12] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Official Industrial Incident Investigation Report
                </h2>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  EXPORT READY
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono-tech mt-0.5">
                Docket: RCA-2026-C204-VIB01 • Compliance Standard: ISO 10816 / API 670 / OSHA 1910
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 leading-relaxed font-mono-tech">
          {/* Document Masthead */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] uppercase text-zinc-500">Incident Target</div>
              <div className="text-sm font-bold text-white mt-0.5">Compressor C-204</div>
              <div className="text-[10px] text-zinc-400">Tag: CMP-HP-204A</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-zinc-500">Timestamp</div>
              <div className="text-sm font-bold text-white mt-0.5">20 Sep 2026 — 22:31</div>
              <div className="text-[10px] text-zinc-400">Shift: Night Shift (22:00 - 06:00)</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-zinc-500">Severity Tier</div>
              <div className="text-sm font-bold text-rose-400 mt-0.5">HIGH (Tier 1 Critical)</div>
              <div className="text-[10px] text-zinc-400">Excursion: ISO Zone B Limit</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-zinc-500">AI Lead Investigator</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">NOVA Industrial Core</div>
              <div className="text-[10px] text-zinc-400">Synthesized Confidence: 94.8%</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider text-amber-400 border-b border-white/[0.06] pb-1">
              1. Executive Summary & Problem Definition
            </h3>
            <p className="text-zinc-200 font-sans">
              On 20 Sep 2026 at 22:31:00 UTC, the primary synthesis turbocompressor C-204 triggered a high-priority vibration excursion alarm. Vibration levels surged by +28% to 5.76 mm/s RMS on Drive-End Tilt-Pad Bearing #2, exceeding the ISO 10816-3 threshold of 4.50 mm/s. Fast Fourier Transform (FFT) analysis isolated a pronounced sub-synchronous peak at 0.44X running frequency (83.7 Hz), characteristic of oil film whip. Automated anti-surge bypass modulation intervened to stabilize shaft displacement and prevent an emergency shutdown.
            </p>
          </div>

          {/* Section 2: Evidence & Multi-Signal Telemetry Audit */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider text-amber-400 border-b border-white/[0.06] pb-1">
              2. Forensic Telemetry Evidence Audit
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech">
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <div className="text-[10px] text-zinc-400">Vibration Velocity</div>
                <div className="text-sm font-bold text-rose-300 mt-1">5.76 mm/s (+28%)</div>
                <div className="text-[9px] text-zinc-500">Sensor: ACC-DE-01</div>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="text-[10px] text-zinc-400">Bearing Temperature</div>
                <div className="text-sm font-bold text-orange-300 mt-1">82.1°C (+14%)</div>
                <div className="text-[9px] text-zinc-500">Sensor: TE-204B</div>
              </div>
              <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <div className="text-[10px] text-zinc-400">Lubrication Pressure</div>
                <div className="text-sm font-bold text-sky-300 mt-1">2.94 bar (-8%)</div>
                <div className="text-[9px] text-zinc-500">Sensor: PT-LO-204</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="text-[10px] text-zinc-400">Motor Load Current</div>
                <div className="text-sm font-bold text-purple-300 mt-1">384 A (+11%)</div>
                <div className="text-[9px] text-zinc-500">Sensor: CT-STATOR-PHB</div>
              </div>
            </div>
          </div>

          {/* Section 3: Causal Sequence & Temporal Lead-Lag */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider text-amber-400 border-b border-white/[0.06] pb-1">
              3. Chronological Temporal Sequence
            </h3>
            <p className="text-zinc-300 font-sans">
              Temporal cross-correlation revealed that the lubrication pressure decay was the true initiating anomaly, preceding the bearing vibration by 18 minutes:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-zinc-300">
              <li><strong>22:13:00 (-18 min):</strong> Lubrication pre-filter differential pressure rose +1.4 bar, causing header supply pressure to slip from 3.20 to 2.94 bar.</li>
              <li><strong>22:21:40 (-9 min):</strong> Reduced cooling flow initiated thermal gradient escalation on bearing tilt pads at +1.8°C/hr.</li>
              <li><strong>22:31:00 (T-0 PEAK):</strong> Hydrodynamic fluid wedge collapsed below minimum film thickness, triggering 0.44X oil whirl vibration surge to 5.76 mm/s.</li>
              <li><strong>22:31:45 (+45 sec):</strong> Thermal expansion of journal sleeve increased boundary friction, driving motor load current up by +11%.</li>
            </ul>
          </div>

          {/* Section 4: AI Hypothesis Ranking */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider text-amber-400 border-b border-white/[0.06] pb-1">
              4. Probabilistic Root Cause Hypotheses
            </h3>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5 text-zinc-300">
              <div>• <strong>Bearing Degradation (Likelihood: 78% | 95% CI: 68%–84%):</strong> Primary mechanism is tilt-pad shoe hydrodynamic breakdown under compromised lubrication.</div>
              <div>• <strong>Lubrication Degradation (Likelihood: 64% | 95% CI: 54%–72%):</strong> Pre-filter blockage starved header flow.</div>
              <div>• <strong>Shaft Misalignment (Likelihood: 38% | 95% CI: 28%–46%):</strong> Thermal expansion offset across flexible disc coupling.</div>
              <div>• <strong>Excessive Operating Load (Likelihood: 24% | 95% CI: 16%–32%):</strong> Aerodynamic throughput fluctuation.</div>
            </div>
          </div>

          {/* Section 5: Mandatory Recommended Checks & CAPA */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider text-amber-400 border-b border-white/[0.06] pb-1">
              5. Immediate Corrective Actions & Physical Verification
            </h3>
            <div className="space-y-1.5 text-zinc-300">
              <div>[ ] <strong>Action 1:</strong> Inspect bearing condition via borescope; check tilt pads 1-4 for babbitt wiping.</div>
              <div>[ ] <strong>Action 2:</strong> Verify lubrication system; execute cartridge switchover on dual basket filter HEX-204.</div>
              <div>[ ] <strong>Action 3:</strong> Check shaft alignment using hot laser alignment survey across flexible disc pack coupling.</div>
              <div>[ ] <strong>Action 4:</strong> Review recent maintenance activity logs from last major turnaround.</div>
            </div>
          </div>

          {/* Signoff Blocks */}
          <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Reliability Director</div>
              <div className="text-xs font-bold text-white mt-1">Anubhuti (DIR-2004-AP)</div>
              <div className="text-[10px] text-emerald-400">Electronic Sign-off Pending</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Turbomachinery Lead</div>
              <div className="text-xs font-bold text-white mt-1">J. De Vries, PE</div>
              <div className="text-[10px] text-zinc-400">Assigned 20 Sep 2026</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">NOVA Engine ID</div>
              <div className="text-xs font-bold text-amber-300 mt-1">NOVA-IND-9.4</div>
              <div className="text-[10px] text-emerald-400">Verified Model Output</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <div className="text-xs text-zinc-400 font-mono-tech">
            Report Format: PDF / JSON-LD Dossier
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const dossierData = {
                  docket: "RCA-2026-C204-VIB01",
                  incident: "Compressor C-204 Bearing Vibration Surge (+28%)",
                  standards: ["ISO 10816-3", "API 670", "OSHA 1910.119"],
                  signoff: "Anubhuti (DIR-2004-AP)",
                  timestamp: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `RCA-2026-C204-VIB01-dossier.json`;
                a.click();
                URL.revokeObjectURL(url);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
