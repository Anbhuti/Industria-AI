import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'critical';
  baseline?: string;
  statusText?: string;
  statusVariant?: 'nominal' | 'warning' | 'critical' | 'neutral';
  onClick?: () => void;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  unit,
  icon: Icon,
  change,
  changeType = 'neutral',
  baseline,
  statusText,
  statusVariant = 'neutral',
  onClick,
  className = ''
}) => {
  const getChangeStyle = () => {
    switch (changeType) {
      case 'positive':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'negative':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'critical':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/30 animate-pulse';
      default:
        return 'text-zinc-400 bg-zinc-800/60 border-zinc-700/40';
    }
  };

  const getVariantBorder = () => {
    switch (statusVariant) {
      case 'critical':
        return 'border-rose-500/40 hover:border-rose-500/60 bg-rose-950/10';
      case 'warning':
        return 'border-amber-500/40 hover:border-amber-500/60 bg-amber-950/10';
      case 'nominal':
        return 'border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-950/5';
      default:
        return 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/60';
    }
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-200 ${getVariantBorder()} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 shadow-sm hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shrink-0 text-zinc-300">
            <Icon className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs font-medium text-zinc-400 truncate tracking-wide">
            {title}
          </p>
        </div>

        {statusText && (
          <span className="text-[11px] font-mono-tech uppercase font-semibold tracking-wider text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/40 shrink-0">
            {statusText}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold font-mono-tech tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-mono-tech text-zinc-400 font-medium">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/80">
        {change ? (
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono-tech font-semibold text-[11px] ${getChangeStyle()}`}>
            <span>{change}</span>
          </div>
        ) : (
          <span className="text-[11px] font-mono-tech text-zinc-500">
            ISO 10816-3 COMPLIANT
          </span>
        )}

        {baseline && (
          <span className="text-[11px] font-mono-tech text-zinc-400">
            Target: <strong className="text-zinc-300">{baseline}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
