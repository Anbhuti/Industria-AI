import React from 'react';
import { Mic, MicOff, Square, Loader2 } from 'lucide-react';
import { CopilotSpeechState } from '../../types/nova';

interface NovaMicrophoneButtonProps {
  state: CopilotSpeechState;
  isAvailable: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NovaMicrophoneButton: React.FC<NovaMicrophoneButtonProps> = ({
  state,
  isAvailable,
  onToggle,
  className = '',
  size = 'md'
}) => {
  const isListening = state === 'LISTENING';
  const isProcessing = state === 'PROCESSING';
  const isSpeaking = state === 'SPEAKING';

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2.5',
    lg: 'w-12 h-12 p-3'
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];

  if (!isAvailable) {
    return (
      <button
        disabled
        className={`rounded-full bg-zinc-800/50 border border-white/[0.06] text-zinc-600 flex items-center justify-center cursor-not-allowed opacity-50 ${sizeClasses} ${className}`}
        title="Microphone input not supported in this browser (Web Speech API). Please use text input."
      >
        <MicOff className={iconSizes} />
      </button>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Dynamic Soundwave Rings when Listening */}
      {isListening && (
        <>
          <span className="absolute -inset-1 rounded-full bg-rose-500/30 animate-ping opacity-75" />
          <span className="absolute -inset-2 rounded-full border border-rose-500/40 animate-pulse" />
        </>
      )}

      {/* Dynamic Wave when Speaking */}
      {isSpeaking && (
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-pulse" />
      )}

      <button
        type="button"
        onClick={onToggle}
        className={`relative z-10 rounded-full transition-all flex items-center justify-center shadow-lg ${sizeClasses} ${
          isListening
            ? 'bg-rose-600 text-white shadow-rose-900/50 hover:bg-rose-500 ring-2 ring-rose-400'
            : isProcessing
            ? 'bg-amber-500 text-black shadow-amber-900/50'
            : isSpeaking
            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
            : 'bg-[#181f2c] hover:bg-[#20293a] text-amber-400 border border-amber-500/30 hover:border-amber-400'
        } ${className}`}
        title={
          isListening
            ? 'Click to stop listening'
            : isSpeaking
            ? 'Click to interrupt NOVA speaking'
            : 'Click to speak to NOVA (Voice Command Input)'
        }
      >
        {isListening ? (
          <Square className={`${iconSizes} fill-current`} />
        ) : isProcessing ? (
          <Loader2 className={`${iconSizes} animate-spin text-black`} />
        ) : (
          <Mic className={iconSizes} />
        )}
      </button>
    </div>
  );
};
