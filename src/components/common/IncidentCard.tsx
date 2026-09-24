import React from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  User, 
  ArrowRight, 
  ShieldAlert,
  Flame
} from 'lucide-react';
import { IncidentModel } from '../../types/industrial';

interface IncidentCardProps {
  incident: IncidentModel;
  onAcknowledge?: (incidentId: string) => void;
  onInvestigate?: (incident: IncidentModel) => void;
  isSelected?: boolean;
  className?: string;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onAcknowledge,
  onInvestigate,
  isSelected = false,
  className = ''
}) => {
  const isCritical = incident.severity === 'critical';

  return (
    <div
      id={`incident-card-${incident.id}`}
      className={`relative p-5 rounded-xl border transition-all duration-200 backdrop-blur-sm ${
        isSelected
          ? 'border-rose-500 ring-1 ring-rose-500/50 bg-zinc-900/90'
          : isCritical
          ? 'border-rose-500/30 hover:border-rose-500/50 bg-rose-950/10'
          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/60'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border font-mono-tech text-xs font-bold ${
            isCritical 
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' 
              : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
          }`}>
            {isCritical ? <Flame className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
            <span>{incident.code}</span>
          </span>

          <span className="font-mono-tech text-xs text-zinc-400">
            {incident.machineTag} • <strong className="text-zinc-200">{incident.machineName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {incident.acknowledged ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono-tech text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>Acknowledged</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono-tech text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 animate-pulse">
              <ShieldAlert className="w-3 h-3" />
              <span>UNACKNOWLEDGED</span>
            </span>
          )}

          <span className="text-xs font-mono-tech text-zinc-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{incident.timestamp}</span>
          </span>
        </div>
      </div>

      <h4 className="text-base font-semibold text-white tracking-tight mb-2">
        {incident.title}
      </h4>

      <p className="text-sm text-zinc-300 leading-relaxed mb-4">
        {incident.summary}
      </p>

      {/* Metric deviation pill */}
      <div className="flex items-center gap-2 mb-4 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80">
        <span className="text-[11px] font-mono-tech text-zinc-500 uppercase">Telemetry Deviation:</span>
        <span className="text-xs font-mono-tech font-bold text-rose-400">
          {incident.deviationMetric}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <User className="w-3.5 h-3.5 text-zinc-500" />
          <span>Assigned: <strong className="text-zinc-300">{incident.assignedTo}</strong></span>
        </div>

        <div className="flex items-center gap-2.5">
          {!incident.acknowledged && onAcknowledge && (
            <button
              id={`ack-btn-${incident.id}`}
              type="button"
              onClick={() => onAcknowledge(incident.id)}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono-tech font-medium transition-colors"
            >
              Acknowledge
            </button>
          )}

          {onInvestigate && (
            <button
              id={`investigate-incident-${incident.id}`}
              type="button"
              onClick={() => onInvestigate(incident)}
              className="px-3.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-mono-tech font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Execute 7-Step RCA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
