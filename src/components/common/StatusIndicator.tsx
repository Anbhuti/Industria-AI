import React from 'react';
import { MachineStatus } from '../../types/industrial';

interface StatusIndicatorProps {
  status: MachineStatus | 'optimal' | 'alert' | 'active' | 'resolved' | 'in_progress';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  pulse = true,
  className = ''
}) => {
  const getColors = () => {
    switch (status) {
      case 'critical':
      case 'alert':
        return {
          dot: 'bg-rose-500',
          ping: 'bg-rose-400',
          text: 'text-rose-400',
          badge: 'bg-rose-500/10 border-rose-500/25 text-rose-300'
        };
      case 'warning':
      case 'in_progress':
        return {
          dot: 'bg-amber-400',
          ping: 'bg-amber-300',
          text: 'text-amber-400',
          badge: 'bg-amber-500/10 border-amber-500/25 text-amber-300'
        };
      case 'maintenance':
        return {
          dot: 'bg-sky-400',
          ping: 'bg-sky-300',
          text: 'text-sky-400',
          badge: 'bg-sky-500/10 border-sky-500/25 text-sky-300'
        };
      case 'nominal':
      case 'optimal':
      case 'resolved':
      default:
        return {
          dot: 'bg-emerald-400',
          ping: 'bg-emerald-300',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
        };
    }
  };

  const colors = getColors();
  const displayLabel = label || status.toUpperCase();

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm'
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border font-mono-tech ${colors.badge} ${className}`}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      <span className="relative flex items-center justify-center">
        {pulse && (
          <span 
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.ping}`} 
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSizes[size]} ${colors.dot}`} />
      </span>
      <span className={`font-bold tracking-wider ${textSizes[size]}`}>
        {displayLabel}
      </span>
    </div>
  );
};
