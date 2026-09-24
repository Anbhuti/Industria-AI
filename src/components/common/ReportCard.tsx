import React from 'react';
import { 
  FileText, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Download, 
  Eye, 
  Share2, 
  ShieldCheck 
} from 'lucide-react';
import { ReportModel } from '../../types/industrial';

interface ReportCardProps {
  report: ReportModel;
  onView?: (report: ReportModel) => void;
  onDownload?: (report: ReportModel) => void;
  onShare?: (report: ReportModel) => void;
  className?: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onView,
  onDownload,
  onShare,
  className = ''
}) => {
  const getStatusBadge = () => {
    switch (report.status) {
      case 'Final / Approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Generated':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div
      id={`report-card-${report.id}`}
      className={`p-5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/70 backdrop-blur-sm transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Header: Report Code, Type & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono-tech text-xs font-bold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                {report.reportNumber}
              </span>
              <span className="text-[11px] font-mono-tech text-emerald-400 uppercase font-semibold">
                {report.typeLabel}
              </span>
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight line-clamp-2">
              {report.name}
            </h3>
          </div>

          <span className={`text-[11px] font-mono-tech uppercase font-bold px-2.5 py-1 rounded-lg border shrink-0 ${getStatusBadge()}`}>
            {report.status}
          </span>
        </div>

        {/* Machine / Plant & Date Metadata */}
        <div className="space-y-1.5 text-xs text-zinc-400 font-mono-tech mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{report.machineOrPlant}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>Created: {report.createdDate}</span>
          </div>
          <div className="text-[11px] text-zinc-500">
            Author: <strong className="text-zinc-400 font-medium">{report.generatedBy}</strong>
          </div>
        </div>

        {/* Executive Summary Excerpt */}
        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2 mb-4">
          {report.summary}
        </p>

        {/* Standards Compliance Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {report.standardsCompliance.map((std, i) => (
            <span 
              key={i} 
              className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800"
            >
              {std}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-800/80">
        {onView && (
          <button
            type="button"
            onClick={() => onView(report)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono-tech font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Dossier</span>
          </button>
        )}

        <div className="flex items-center gap-1.5">
          {onDownload && (
            <button
              type="button"
              onClick={() => onDownload(report)}
              title="Download Compliance PDF"
              className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {onShare && (
            <button
              type="button"
              onClick={() => onShare(report)}
              title="Share Dossier with Audit Committee"
              className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
