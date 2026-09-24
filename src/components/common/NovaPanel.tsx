import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Cpu, 
  ShieldCheck, 
  CornerDownLeft, 
  Layers, 
  Activity 
} from 'lucide-react';
import { useIndustrialApp } from '../../context/IndustrialAppContext';
import { NovaChatMessage } from '../../types/industrial';

interface NovaPanelProps {
  compact?: boolean;
  className?: string;
}

export const NovaPanel: React.FC<NovaPanelProps> = ({
  compact = false,
  className = ''
}) => {
  const { 
    selectedPlant, 
    selectedMachine, 
    selectedIncident, 
    liveTelemetry, 
    applyRecommendation, 
    recommendations 
  } = useIndustrialApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<NovaChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'nova',
      text: `NOVA Industrial Copilot synchronized with ${selectedPlant?.name || 'facility'} telemetry stream. Active asset target: ${selectedMachine?.name || 'Asset'} (${selectedMachine?.tag || 'TAG'}). Live vibration: ${liveTelemetry?.vibrationRMS || selectedMachine?.metrics.vibrationRMS || 5.76} mm/s RMS. How can I assist with diagnostic telemetry or root-cause synthesis?`,
      timestamp: 'Active Now',
      metadata: {
        model: 'NOVA Physics-Informed Neural Diagnostics v4.2',
        confidence: 0.96,
        recommendedActions: [
          'Throttling throughput by 8% will restore bearing hydrodynamic film thickness.',
          'Flush cooling water heat exchanger HEX-204 to eliminate silt fouling.'
        ]
      }
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: NovaChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate physics-informed copilot synthesis
    setTimeout(() => {
      let reply = '';
      let recommendedActions: string[] | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('vibration') || lower.includes('bearing') || lower.includes('rca') || lower.includes('spike')) {
        reply = `Analysis for ${selectedMachine?.name} (${selectedMachine?.tag}): Vibration is currently running at ${liveTelemetry?.vibrationRMS || selectedMachine?.metrics.vibrationRMS} mm/s RMS. Fast Fourier Transform (FFT) reveals sub-synchronous frequency energy at 0.44X running speed, indicating fluid-film oil whirl in the drive-end tilt-pad bearing. Lubricating oil inlet temperature has risen to 56°C due to cooling water restriction in HEX-204.`;
        recommendedActions = [
          'Execute 8% speed/throughput throttling immediately.',
          'Issue SAP PM work order for solenoid replacement on Filter F-102.',
          'Compile ISO 14224 compliance investigation dossier.'
        ];
      } else if (lower.includes('rul') || lower.includes('life') || lower.includes('throttle')) {
        reply = `Under current unmitigated operating conditions, remaining useful life (RUL) is estimated at ${selectedMachine?.rulDays || 24} days before babbitt wiping. Applying an 8% throughput throttle reduces shear heating by 32% and extends safe operating life by +14 days (to ${((selectedMachine?.rulDays || 24) + 14)} days).`;
        recommendedActions = ['Apply 8% protective throttling via DCS'];
      } else if (lower.includes('report') || lower.includes('dossier') || lower.includes('iso')) {
        reply = `I have structured an Incident Investigation Dossier for ${selectedMachine?.name} conforming to ISO 14224, API 670, and IEC 62443. The dossier includes complete multi-sensor time-series logs, causal 5-Whys attribution, and CAPA action tracking.`;
      } else {
        reply = `Acknowledged query regarding ${selectedMachine?.name} (${selectedMachine?.tag}) at ${selectedPlant?.name}. Real-time SCADA telemetry shows bearing metal temperature at ${liveTelemetry?.bearingTemp || selectedMachine?.metrics.bearingTemp}°C and discharge pressure at ${selectedMachine?.metrics.dischargePressure} bar. All physics boundary models are active.`;
      }

      const novaMsg: NovaChatMessage = {
        id: `nova-${Date.now()}`,
        sender: 'nova',
        text: reply,
        timestamp: 'Just now',
        metadata: {
          model: 'NOVA Neural Physics Engine',
          confidence: 0.94,
          recommendedActions
        }
      };

      setMessages(prev => [...prev, novaMsg]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts = [
    `Run causal RCA on ${selectedMachine?.tag} vibration`,
    'Calculate RUL under 8% throttle',
    'Generate ISO 14224 investigation summary',
    'Verify lubrication pressure vs OEM baseline'
  ];

  return (
    <div className={`flex flex-col h-full rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md overflow-hidden ${className}`}>
      {/* Top Context Bar */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/60">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>NOVA Industrial Copilot</span>
                <span className="text-[10px] font-mono-tech px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                  CONTEXT AWARE
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono-tech text-zinc-400">
            <Cpu className="w-3.5 h-3.5 text-zinc-500" />
            <span>PI-NN v4.2</span>
          </div>
        </div>

        {/* Dynamic Context Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono-tech">
          <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
            Plant: <strong className="text-white">{selectedPlant?.name || 'Lucknow MF'}</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
            Asset: <strong className="text-emerald-400">{selectedMachine?.tag || 'C-204'}</strong>
          </span>
          {selectedIncident && (
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
              Incident: <strong className="text-rose-400">{selectedIncident.code}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm font-sans">
        {messages.map((m) => (
          <div 
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'nova' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-xl p-3.5 text-sm leading-relaxed ${
              m.sender === 'user'
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-200'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>

              {/* NOVA Recommended Actions Chip */}
              {m.metadata?.recommendedActions && m.metadata.recommendedActions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] font-mono-tech text-emerald-400 font-semibold uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Prescribed Operational Actions:</span>
                  </div>
                  {m.metadata.recommendedActions.map((act, i) => (
                    <div 
                      key={i} 
                      className="text-xs text-zinc-300 bg-zinc-900/90 p-2 rounded border border-zinc-800 font-mono-tech flex items-start justify-between gap-2"
                    >
                      <span>• {act}</span>
                      {act.includes('8%') && recommendations.length > 0 && (
                        <button
                          type="button"
                          onClick={() => applyRecommendation(recommendations[0].id)}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 shrink-0"
                        >
                          Execute
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[10px] font-mono-tech text-zinc-400 mt-2 text-right">
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-400 pl-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>NOVA is cross-referencing multi-sensor waveforms...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-zinc-950/40 border-t border-zinc-800/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-xs font-mono-tech text-zinc-300 whitespace-nowrap transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950/80">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="nova-input-query"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask NOVA regarding ${selectedMachine?.tag || 'asset'} telemetry...`}
            className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-lg px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-zinc-950 font-bold transition-colors shrink-0"
            title="Send query to NOVA"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
