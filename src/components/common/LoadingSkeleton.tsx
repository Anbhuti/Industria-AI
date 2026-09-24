import React from 'react';

export interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'chart' | 'metric' | 'list';
  lines?: number;
  className?: string;
  label?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  lines = 3,
  className = '',
  label = 'Loading industrial telemetry data...'
}) => {
  if (variant === 'metric') {
    return (
      <div 
        role="status" 
        aria-label={label}
        className={`p-4 rounded-xl border border-white/[0.08] bg-[#11151e]/80 animate-pulse space-y-3 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="h-3 bg-white/[0.08] rounded w-24" />
          <div className="h-4 w-4 bg-white/[0.08] rounded-full" />
        </div>
        <div className="h-7 bg-amber-400/20 rounded w-32" />
        <div className="h-2.5 bg-white/[0.05] rounded w-20" />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div 
        role="status" 
        aria-label={label}
        className={`p-6 rounded-2xl border border-white/[0.08] bg-[#11151e]/80 animate-pulse space-y-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="h-4 bg-white/[0.08] rounded w-44" />
          <div className="flex gap-2">
            <div className="h-6 w-14 bg-white/[0.06] rounded-lg" />
            <div className="h-6 w-14 bg-white/[0.06] rounded-lg" />
          </div>
        </div>
        <div className="h-48 sm:h-64 w-full bg-[#090c12] rounded-xl border border-white/[0.04] p-4 flex items-end gap-3 justify-between">
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-amber-400/15 rounded-t w-full" 
              style={{ height: `${20 + ((i * 17) % 70)}%` }} 
            />
          ))}
        </div>
        <div className="flex justify-between items-center text-xs text-zinc-500 font-mono-tech">
          <div className="h-3 bg-white/[0.05] rounded w-28" />
          <div className="h-3 bg-white/[0.05] rounded w-36" />
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div 
        role="status" 
        aria-label={label}
        className={`rounded-2xl border border-white/[0.08] bg-[#11151e]/80 overflow-hidden animate-pulse ${className}`}
      >
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="h-4 bg-white/[0.08] rounded w-40" />
          <div className="h-8 bg-white/[0.05] rounded-xl w-48" />
        </div>
        <div className="divide-y divide-white/[0.04]">
          {Array.from({ length: lines || 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06]" />
                <div className="space-y-1 w-full">
                  <div className="h-3.5 bg-white/[0.08] rounded w-3/4" />
                  <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
                </div>
              </div>
              <div className="h-3.5 bg-white/[0.06] rounded w-20" />
              <div className="h-3.5 bg-white/[0.06] rounded w-24" />
              <div className="h-6 bg-white/[0.06] rounded-full w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      role="status" 
      aria-label={label}
      className={`p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#11151e]/80 animate-pulse space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 bg-white/[0.08] rounded w-1/3" />
        <div className="h-4 bg-white/[0.06] rounded w-1/6" />
      </div>
      <div className="h-7 bg-white/[0.1] rounded w-1/2" />
      <div className="space-y-2 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className="h-3 bg-white/[0.05] rounded" 
            style={{ width: `${95 - i * 18}%` }} 
          />
        ))}
      </div>
    </div>
  );
};
