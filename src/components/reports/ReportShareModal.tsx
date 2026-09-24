import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  Users, 
  ShieldCheck, 
  Mail, 
  FileCheck,
  Building2
} from 'lucide-react';
import { IndustrialReportItem } from '../../data/reportsData';

interface ReportShareModalProps {
  report: IndustrialReportItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportShareModal: React.FC<ReportShareModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('reliability-team');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !report) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/reports?view=${report.id}&doc=${report.reportNumber}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDispatchShare = () => {
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  const recipients = [
    { id: 'reliability-team', label: 'Plant Reliability Engineering Group', count: '6 Engineers' },
    { id: 'shift-supervisor', label: 'Shift Alpha & Beta Operations Supervisors', count: '2 Leads' },
    { id: 'maintenance-dispatch', label: 'Mechanical Maintenance CMMS Dispatch', count: 'Direct Work Order' },
    { id: 'plant-director', label: 'Plant Operations Director & Corporate Safety', count: 'Executive Desk' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-lg bg-[#0d1118] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#111622] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Share Industrial Dossier
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono-tech">
                {report.reportNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Target Report Info */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="text-[10px] font-mono-tech uppercase text-amber-400 font-bold">
              {report.typeLabel}
            </div>
            <div className="text-xs font-bold text-white leading-snug">
              {report.name}
            </div>
            <div className="text-[11px] text-zinc-400 font-mono-tech">
              Target: {report.machineOrPlant}
            </div>
          </div>

          {/* Secure Internal Link */}
          <div className="space-y-2">
            <label className="text-xs font-mono-tech uppercase text-zinc-400">
              Direct Clearance Document Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/reports?view=${report.id}&doc=${report.reportNumber}`}
                className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs font-mono-tech text-zinc-300 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Department Distribution Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono-tech uppercase text-zinc-400">
              Departmental Distribution Group
            </label>
            <div className="space-y-2">
              {recipients.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => setSelectedRecipient(rec.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedRecipient === rec.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-white'
                      : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold">{rec.label}</span>
                  </div>
                  <span className="text-[10px] font-mono-tech text-zinc-400">{rec.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Dispatch */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <div className="text-[10px] font-mono-tech text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Logging Active</span>
            </div>

            <button
              onClick={handleDispatchShare}
              disabled={sentSuccess}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              {sentSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Dispatched to Team!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>Transmit Dossier</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
