import React, { useState, useEffect } from 'react';
import { X, Volume2, Sparkles, Check, Sliders, Cpu, Radio, Shield } from 'lucide-react';
import { novaVoiceService } from '../../services/novaVoiceService';
import { NovaVoiceConfig, NovaVoiceOption } from '../../types/nova';

interface NovaVoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovaVoiceSettingsModal: React.FC<NovaVoiceSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [config, setConfig] = useState<NovaVoiceConfig>(novaVoiceService.getConfig());
  const [voices, setVoices] = useState<NovaVoiceOption[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(novaVoiceService.getConfig());
      const loadedVoices = novaVoiceService.getAvailableVoices();
      setVoices(loadedVoices);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    setIsTesting(true);
    novaVoiceService.updateConfig(config);
    novaVoiceService.speak(
      "Diagnostics online. I am NOVA, your industrial operations specialist. Telemetry telemetry streams are synchronized.",
      () => {}
    ).finally(() => setIsTesting(false));
  };

  const handleSave = () => {
    novaVoiceService.updateConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0e1219] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#121620]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                NOVA Voice & Synthesizer Configuration
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono-tech">
                Industrial Speech Synthesis & TTS Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Provider Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Speech Synthesis Provider</span>
              <span className="text-[10px] font-mono-tech text-amber-400">ACTIVE: Browser Neural</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, provider: 'browser-speech' }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  config.provider === 'browser-speech'
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-200">Browser Neural / Web Speech</span>
                  {config.provider === 'browser-speech' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <div className="text-[10px] text-zinc-400">
                  Zero-latency local neural voice, natural female cadences.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, provider: 'elevenlabs' }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  config.provider === 'elevenlabs'
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-200">Cloud TTS / ElevenLabs / Azure</span>
                  {config.provider === 'elevenlabs' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <div className="text-[10px] text-zinc-400">
                  External studio API integration ready for deployment.
                </div>
              </button>
            </div>
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">
              Selected Natural Female Voice
            </label>
            <select
              value={config.voiceName}
              onChange={(e) => setConfig(prev => ({ ...prev, voiceName: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-mono-tech text-white focus:outline-none focus:border-amber-500/40"
            >
              {voices.length > 0 ? (
                voices.map((v) => (
                  <option key={v.id} value={v.id} className="bg-[#121620] text-white">
                    {v.name} ({v.lang}) {v.quality === 'neural' ? '★ Natural' : ''}
                  </option>
                ))
              ) : (
                <option value="" className="bg-[#121620] text-white">
                  Default System Female Voice
                </option>
              )}
            </select>
            <p className="text-[10px] text-zinc-500 font-mono-tech">
              NOVA prioritizes high-clarity natural female vocal models for technical operations.
            </p>
          </div>

          {/* Rate & Pitch Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span>Cadence / Speed</span>
                <span className="font-mono-tech text-amber-400">{config.rate}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.3"
                step="0.05"
                value={config.rate}
                onChange={(e) => setConfig(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono-tech">
                <span>Deliberate</span>
                <span>Brisk</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span>Warmth / Pitch</span>
                <span className="font-mono-tech text-amber-400">{config.pitch}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={config.pitch}
                onChange={(e) => setConfig(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono-tech">
                <span>Authoritative</span>
                <span>Bright</span>
              </div>
            </div>
          </div>

          {/* Auto Speak Toggle */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                Auto-Vocalize Incident Findings
              </div>
              <div className="text-[10px] text-zinc-400">
                When NOVA answers telemetry questions, automatically speak the briefing.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, autoSpeak: !prev.autoSpeak }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                config.autoSpeak ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  config.autoSpeak ? 'left-6' : 'left-1'
                }`} 
              />
            </button>
          </div>

          {/* Enterprise Provider API Hook notice */}
          {config.provider === 'elevenlabs' && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <Shield className="w-3.5 h-3.5" />
                <span>Enterprise API Pipeline Ready</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Connect ElevenLabs, Azure Neural, or Gemini 3.1 TTS via environment variables (<code className="font-mono-tech text-amber-300">ELEVENLABS_API_KEY</code> or <code className="font-mono-tech text-amber-300">AZURE_SPEECH_KEY</code>). While in browser mode, high-fidelity neural fallback is active.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#121620] flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestVoice}
            disabled={isTesting}
            className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-zinc-200 flex items-center gap-1.5"
          >
            <Volume2 className={`w-3.5 h-3.5 text-amber-400 ${isTesting ? 'animate-pulse' : ''}`} />
            <span>{isTesting ? 'Testing Audio...' : 'Test Verbal Output'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Applied</span>
                </>
              ) : (
                <span>Save Voice Profile</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
