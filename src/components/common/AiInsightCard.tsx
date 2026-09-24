import React from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Check, 
  Clock 
} from 'lucide-react';
import { RecommendationModel } from '../../types/industrial';

interface AiInsightCardProps {
  recommendation: RecommendationModel;
  onApply?: (recId: string) => void;
  className?: string;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({
  recommendation,
  onApply,
  className = ''
}) => {
  const isApplied = recommendation.status === 'Applied';

  return (
    <div 
      id={`ai-insight-card-${recommendation.id}`}
      className={`p-5 rounded-xl border transition-all duration-200 backdrop-blur-sm relative overflow-hidden ${
        isApplied 
          ? 'border-emerald-500/40 bg-emerald-950/10' 
          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/70'
      } ${className}`}
    >
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono-tech font-bold text-emerald-400 uppercase tracking-wide">
                {recommendation.category}
              </span>
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                {recommendation.priority}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
              {recommendation.title}
            </h4>
          </div>
        </div>

        {isApplied ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono-tech font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            <Check className="w-3.5 h-3.5" />
            <span>APPLIED</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono-tech font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
            <span>READY TO DISPATCH</span>
          </span>
        )}
      </div>

      {/* Rationale Body */}
      <p className="text-xs text-zinc-300 leading-relaxed mb-4">
        {recommendation.rationale}
      </p>

      {/* Impact Metric Chips */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
        <div>
          <div className="flex items-center gap-1 text-[10px] font-mono-tech text-zinc-500 uppercase">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>RUL Life Extension</span>
          </div>
          <div className="text-sm font-bold font-mono-tech text-emerald-400 mt-0.5">
            +{recommendation.impact.uptimeGainDays} Days
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[10px] font-mono-tech text-zinc-500 uppercase">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Downtime Cost Avoided</span>
          </div>
          <div className="text-sm font-bold font-mono-tech text-white mt-0.5">
            ${recommendation.impact.costSavingsUSD.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Safe Operating Limits & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
        <div className="text-xs font-mono-tech text-zinc-400">
          <span className="text-zinc-500">Operating Limit:</span>{' '}
          <strong className="text-zinc-200">{recommendation.safeOperatingLimit}</strong>
        </div>

        {!isApplied && onApply && (
          <button
            id={`apply-rec-btn-${recommendation.id}`}
            type="button"
            onClick={() => onApply(recommendation.id)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono-tech text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Apply Mitigation via DCS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
