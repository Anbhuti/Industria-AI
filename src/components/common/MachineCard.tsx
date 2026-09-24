import React from 'react';
import { 
  Activity, 
  Thermometer, 
  Gauge, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles, 
  Search 
} from 'lucide-react';
import { MachineModel } from '../../types/industrial';
import { StatusIndicator } from './StatusIndicator';

interface MachineCardProps {
  machine: MachineModel;
  isSelected?: boolean;
  onSelect?: (machineId: string) => void;
  onInvestigate?: (machineId: string) => void;
  onAskNova?: (machine: MachineModel) => void;
  className?: string;
}

export const MachineCard: React.FC<MachineCardProps> = ({
  machine,
  isSelected = false,
  onSelect,
  onInvestigate,
  onAskNova,
  className = ''
}) => {
  const getHealthColor = (score: number) => {
    if (score < 70) return 'text-rose-400 stroke-rose-500';
    if (score < 85) return 'text-amber-400 stroke-amber-500';
    return 'text-emerald-400 stroke-emerald-500';
  };

  const getBorderColor = () => {
    if (isSelected) return 'border-emerald-500 ring-1 ring-emerald-500/50 bg-zinc-900/90';
    if (machine.status === 'critical') return 'border-rose-500/40 hover:border-rose-500/60 bg-zinc-900/60';
    if (machine.status === 'warning') return 'border-amber-500/30 hover:border-amber-500/50 bg-zinc-900/60';
    return 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/60';
  };

  return (
    <div
      id={`machine-card-${machine.id}`}
      className={`relative p-5 rounded-xl border transition-all duration-200 backdrop-blur-sm ${getBorderColor()} ${className}`}
    >
      {/* Top Bar: Tag, Status & Health Score */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-tech text-xs font-bold text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
              {machine.tag}
            </span>
            <span className="text-[11px] font-mono-tech text-zinc-500 uppercase">
              {machine.criticality}
            </span>
          </div>
          <h3 className="text-base font-semibold text-white truncate tracking-tight">
            {machine.name}
          </h3>
          <p className="text-xs text-zinc-400 truncate mt-0.5">
            {machine.plantArea} • {machine.oem}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusIndicator status={machine.status} size="sm" />
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-[10px] font-mono-tech text-zinc-500 uppercase">Health</span>
            <span className={`text-lg font-mono-tech font-extrabold ${getHealthColor(machine.healthScore)}`}>
              {machine.healthScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Alarm Banner if Machine has an active alarm */}
      {machine.alarm && (
        <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <p className="line-clamp-2 leading-relaxed font-sans">
            {machine.alarm}
          </p>
        </div>
      )}

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800/80 mb-4 bg-zinc-950/40 rounded-lg px-2.5">
        <div>
          <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-mono-tech uppercase mb-1">
            <Activity className="w-3 h-3 text-zinc-400" />
            <span>Vibration</span>
          </div>
          <div className="font-mono-tech font-bold text-sm text-white">
            {machine.metrics.vibrationRMS.toFixed(2)}
            <span className="text-[10px] font-normal text-zinc-400 ml-1">mm/s</span>
          </div>
          <div className="text-[10px] font-mono-tech text-zinc-500">
            Limit: 4.5
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-mono-tech uppercase mb-1">
            <Thermometer className="w-3 h-3 text-zinc-400" />
            <span>Bearing T</span>
          </div>
          <div className="font-mono-tech font-bold text-sm text-white">
            {machine.metrics.bearingTemp.toFixed(1)}
            <span className="text-[10px] font-normal text-zinc-400 ml-1">°C</span>
          </div>
          <div className="text-[10px] font-mono-tech text-zinc-500">
            Limit: 85°C
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-mono-tech uppercase mb-1">
            <Gauge className="w-3 h-3 text-zinc-400" />
            <span>RUL</span>
          </div>
          <div className="font-mono-tech font-bold text-sm text-white">
            {machine.rulDays}
            <span className="text-[10px] font-normal text-zinc-400 ml-1">Days</span>
          </div>
          <div className="text-[10px] font-mono-tech text-zinc-500">
            MTBF: {machine.mtbfHours}h
          </div>
        </div>
      </div>

      {/* Footer Action Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span className="font-mono-tech text-[11px]">
            Run: {machine.runtimeHours || 4280}h
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onAskNova && (
            <button
              id={`ask-nova-${machine.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAskNova(machine);
              }}
              title="Query NOVA Industrial Copilot on this unit"
              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {machine.status === 'critical' && onInvestigate && (
            <button
              id={`investigate-btn-${machine.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInvestigate(machine.id);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono-tech text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Search className="w-3 h-3" />
              <span>RCA Dossier</span>
            </button>
          )}

          {onSelect && (
            <button
              id={`select-machine-${machine.id}`}
              type="button"
              onClick={() => onSelect(machine.id)}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700/80 text-white font-mono-tech text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>{isSelected ? 'Inspecting' : 'Inspect'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
