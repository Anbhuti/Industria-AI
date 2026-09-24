import React from 'react';
import { Mic, Radio, Volume2, Loader2, Sparkles } from 'lucide-react';
import { CopilotSpeechState } from '../../types/nova';

interface NovaSpeechStateBadgeProps {
  state: CopilotSpeechState;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NovaSpeechStateBadge: React.FC<NovaSpeechStateBadgeProps> = ({
  state,
  className = '',
  size = 'md'
}) => {
  const getBadgeConfig = () => {
    switch (state) {
      case 'LISTENING':
        return {
          label: 'LISTENING',
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          dot: 'bg-rose-500 animate-ping',
          icon: Mic,
          pulse: 'ring-rose-500/30 ring-4'
        };
      case 'PROCESSING':
        return {
          label: 'PROCESSING',
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400 animate-spin',
          icon: Loader2,
          pulse: 'ring-amber-500/30 ring-2'
        };
      case 'SPEAKING':
        return {
          label: 'SPEAKING',
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400 animate-pulse',
          icon: Volume2,
          pulse: 'ring-emerald-500/30 ring-4'
        };
      case 'IDLE':
      default:
        return {
          label: 'IDLE',
          bg: 'bg-zinc-800/80 border-white/[0.08] text-zinc-400',
          dot: 'bg-zinc-500',
          icon: Radio,
          pulse: ''
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 gap-1',
    md: 'text-[10px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2'
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-full font-mono-tech font-bold uppercase tracking-wider border shadow-sm transition-all ${config.bg} ${sizeClasses} ${config.pulse} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {state !== 'IDLE' && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${state === 'IDLE' ? 'bg-zinc-500' : config.dot}`} />
      </span>
      <Icon className={`w-3 h-3 ${state === 'PROCESSING' ? 'animate-spin' : ''}`} />
      <span>{config.label}</span>
    </div>
  );
};
