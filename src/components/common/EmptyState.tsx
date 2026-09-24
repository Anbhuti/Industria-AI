import React from 'react';
import { SearchX, RefreshCw, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Industrial Assets Found',
  description = 'No equipment matches the active filter criteria or search query.',
  icon: Icon = SearchX,
  actionLabel = 'Reset Filters',
  onAction,
  className = ''
}) => {
  return (
    <div className={`p-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 backdrop-blur-sm flex flex-col items-center justify-center ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 mb-4">
        <Icon className="w-6 h-6 text-zinc-500" />
      </div>

      <h4 className="text-base font-bold text-white tracking-tight mb-1">
        {title}
      </h4>

      <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-5 font-mono-tech">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-mono-tech font-semibold text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
