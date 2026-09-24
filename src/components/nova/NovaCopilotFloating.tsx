import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Send, 
  Sliders, 
  Play, 
  Square,
  Activity,
  Layers,
  AlertTriangle,
  Cpu,
  FileText,
  Volume2,
  Mic,
  Info,
  ShieldAlert
} from 'lucide-react';
import { AppRoute, IndustrialMachine } from '../../types/industrial';
import { NovaExpression } from '../../types/nova';
import { NovaAvatar } from './NovaAvatar';
import { NovaVoiceSettingsModal } from './NovaVoiceSettingsModal';
import { useNovaCopilot } from '../../context/NovaCopilotContext';
import { NovaSpeechStateBadge } from './NovaSpeechStateBadge';
import { NovaMicrophoneButton } from './NovaMicrophoneButton';

interface NovaCopilotFloatingProps {
  currentRoute: AppRoute;
  machines: IndustrialMachine[];
  onNavigateToNova: () => void;
}

export const NovaCopilotFloating: React.FC<NovaCopilotFloatingProps> = ({
  currentRoute,
  machines,
  onNavigateToNova
}) => {
  const {
    assistantState,
    speechState,
    isMicAvailable,
    transcript,
    interimTranscript,
    latestOutput,
    errorMessage,
    isExpanded,
    setIsExpanded,
    startListening,
    stopListening,
    executeCommand,
    speak,
    stopSpeaking
  } = useNovaCopilot();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [expression, setExpression] = useState<NovaExpression>('idle');
  const [textQuery, setTextQuery] = useState('');

  // Dynamically set avatar expression depending on speech state and current alerts
  useEffect(() => {
    if (speechState === 'LISTENING') {
      setExpression('welcome');
    } else if (speechState === 'PROCESSING') {
      setExpression('analysis');
    } else if (speechState === 'SPEAKING') {
      if (latestOutput?.spokenText.toLowerCase().includes('critical') || latestOutput?.spokenText.toLowerCase().includes('alert')) {
        setExpression('critical');
      } else {
        setExpression('analysis');
      }
    } else {
      if (currentRoute === '/investigations') {
        setExpression('warning');
      } else {
        setExpression('idle');
      }
    }
  }, [speechState, currentRoute, latestOutput]);

  const handleSubmitText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textQuery.trim() || speechState === 'PROCESSING') return;
    const q = textQuery;
    setTextQuery('');
    await executeCommand(q, false);
  };

  const handleChipClick = async (prompt: string) => {
    await executeCommand(prompt, false);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 select-none font-['Plus_Jakarta_Sans',sans-serif]">
        {!isExpanded ? (
          /* Minimized Docked Badge with Live Speech State */
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsExpanded(true);
                setExpression('welcome');
              }}
              className="group flex items-center gap-3 p-1.5 pr-4 rounded-full bg-[#0d1118]/95 hover:bg-[#121622] border border-amber-500/30 hover:border-amber-500/60 shadow-2xl backdrop-blur-md transition-all hover:scale-105"
              title="Open NOVA Industrial Copilot"
            >
              {/* Avatar Miniature Thumbnail */}
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-500/50 shrink-0">
                <img
                  src="/src/assets/images/nova_avatar_base_1789925716459.jpg"
                  alt="NOVA Avatar"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight">NOVA Copilot</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <NovaSpeechStateBadge state={speechState} size="sm" />
                </div>
              </div>

              <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            </button>

            {/* Quick Microphone Button docked right next to pill */}
            <NovaMicrophoneButton
              state={speechState}
              isAvailable={isMicAvailable}
              onToggle={startListening}
              size="md"
            />
          </div>
        ) : (
          /* Expanded Floating Interactive Copilot Window */
          <div className="w-[360px] sm:w-[410px] bg-[#0c1017]/98 border border-white/[0.14] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="p-3 bg-[#111622] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-tight">
                  NOVA // Application Copilot
                </span>
                <NovaSpeechStateBadge state={speechState} size="sm" />
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors"
                  title="Voice & Speech Settings"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors"
                  title="Minimize Copilot"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mandatory Transparency Banner: SIMULATED INDUSTRIAL DATA */}
            <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-[10px] font-mono-tech">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>SIMULATED INDUSTRIAL DATA</span>
              </div>
              <span className="text-[9px] text-zinc-400">Demo Telemetry Model</span>
            </div>

            {/* Assistant State Live Context Inspector */}
            <div className="px-3 py-2 bg-[#080b10] border-b border-white/[0.06] grid grid-cols-2 gap-1.5 text-[10px] font-mono-tech">
              <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.05] flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="text-zinc-500">Page: </span>
                  <span className="text-zinc-300 font-semibold">{assistantState.currentPage}</span>
                </div>
              </div>
              <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.05] flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-rose-400 shrink-0" />
                <div className="truncate">
                  <span className="text-zinc-500">Asset: </span>
                  <span className="text-zinc-300 font-semibold">{assistantState.selectedMachine || 'C-204'}</span>
                </div>
              </div>
            </div>

            {/* Avatar & Voice Viseme Section */}
            <div className="p-3 bg-[#090d14] flex items-center gap-3">
              <NovaAvatar
                mode="copilot"
                currentExpression={expression}
                onExpressionChange={setExpression}
                showControls={false}
                className="w-24 shrink-0"
              />

              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-tech text-amber-400 uppercase font-semibold">
                    {speechState === 'LISTENING'
                      ? '🎙️ Listening to you...'
                      : speechState === 'PROCESSING'
                      ? '⚡ Processing intent...'
                      : speechState === 'SPEAKING'
                      ? '🔊 Vocalizing response'
                      : '🟢 Standing by'}
                  </span>
                  {speechState === 'SPEAKING' && (
                    <button
                      onClick={stopSpeaking}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono-tech bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 flex items-center gap-1"
                    >
                      <Square className="w-2.5 h-2.5 fill-current" />
                      <span>Stop</span>
                    </button>
                  )}
                </div>

                {/* Live Speech Recognition Transcript Indicator */}
                {(interimTranscript || transcript) && speechState === 'LISTENING' && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-200 italic animate-pulse">
                    "{interimTranscript || transcript}"
                  </div>
                )}

                {/* Error Notice */}
                {errorMessage && (
                  <div className="p-1.5 rounded bg-rose-950/60 border border-rose-500/30 text-[10px] text-rose-300">
                    {errorMessage}
                  </div>
                )}

                {/* Operator Badge */}
                <div className="text-[10px] text-zinc-400 truncate">
                  Operator: <span className="text-zinc-200 font-medium">{assistantState.userName}</span>
                </div>
              </div>
            </div>

            {/* Copilot Response Display Box */}
            <div className="px-3.5 py-2.5 bg-[#0d121b] border-t border-b border-white/[0.08] max-h-48 overflow-y-auto text-xs text-zinc-200 leading-relaxed font-normal space-y-1.5">
              <div className="text-[9px] font-mono-tech text-zinc-400 uppercase flex items-center justify-between">
                <span>Active Copilot Guidance:</span>
                {latestOutput?.actionTaken && (
                  <span className="text-amber-400 font-semibold">
                    Action: {latestOutput.actionTaken.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-zinc-300 whitespace-pre-line leading-relaxed">
                {latestOutput?.displayText || (
                  <span>
                    I am connected to supervisory telemetry for <strong>{assistantState.plantStatus.name}</strong>.
                    You can speak or type commands like: <em>"Show me the machines"</em>, <em>"Open compressor C-204"</em>, <em>"Why is C-204 showing an alert?"</em>, or <em>"Investigate this"</em>.
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Command Shortcut Chips */}
            <div className="p-2.5 bg-[#0a0d13] border-b border-white/[0.06] space-y-1.5">
              <div className="text-[9px] font-mono-tech text-zinc-500 uppercase">
                Tap to Say / Execute:
              </div>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => handleChipClick('Show me the machines.')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/40 text-[10px] font-mono-tech text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  "Show me the machines."
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('Open compressor C-204.')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/40 text-[10px] font-mono-tech text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  "Open compressor C-204."
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('Why is C-204 showing an alert?')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/40 text-[10px] font-mono-tech text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  "Why is C-204 showing an alert?"
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('Investigate this.')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/40 text-[10px] font-mono-tech text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  "Investigate this."
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('Generate a report.')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/40 text-[10px] font-mono-tech text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  "Generate a report."
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('What is happening in the plant?')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/40 text-[10px] font-mono-tech text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  "What is happening in the plant?"
                </button>
              </div>
            </div>

            {/* Input Bar: Voice Input + Text Input */}
            <div className="p-3 bg-[#0d1119]">
              <form onSubmit={handleSubmitText} className="flex items-center gap-2">
                {/* Dedicated Microphone Button */}
                <NovaMicrophoneButton
                  state={speechState}
                  isAvailable={isMicAvailable}
                  onToggle={startListening}
                  size="md"
                />

                {/* Text input */}
                <input
                  type="text"
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                  placeholder={
                    speechState === 'LISTENING'
                      ? 'Listening to microphone...'
                      : 'Ask NOVA or type a command...'
                  }
                  disabled={speechState === 'PROCESSING'}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.09] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                />

                <button
                  type="submit"
                  disabled={!textQuery.trim() || speechState === 'PROCESSING'}
                  className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold disabled:opacity-40 transition-colors flex items-center justify-center"
                  title="Send command"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Voice Settings Modal */}
      <NovaVoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
