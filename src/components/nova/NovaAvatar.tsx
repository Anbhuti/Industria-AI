import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Activity, 
  RotateCcw, 
  Settings2, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Sliders, 
  Cpu
} from 'lucide-react';
import { NovaExpression, NovaPresenceMode } from '../../types/nova';
import { novaVoiceService } from '../../services/novaVoiceService';

// Image assets generated for high-fidelity photorealistic digital human NOVA
const AVATAR_IMAGES = {
  idle: '/src/assets/images/nova_avatar_base_1789925716459.jpg',
  welcome: '/src/assets/images/nova_smile_welcome_1789925738737.jpg',
  analysis: '/src/assets/images/nova_focused_analysis_1789925751711.jpg',
  warning: '/src/assets/images/nova_warning_alert_1789925770183.jpg',
  critical: '/src/assets/images/nova_warning_alert_1789925770183.jpg',
  success: '/src/assets/images/nova_smile_welcome_1789925738737.jpg',
  speaking: '/src/assets/images/nova_speaking_mouth_1789925783821.jpg'
};

interface NovaAvatarProps {
  mode?: NovaPresenceMode;
  currentExpression?: NovaExpression;
  isSpeaking?: boolean;
  activeSentence?: string;
  onExpressionChange?: (exp: NovaExpression) => void;
  onVoiceSettingsClick?: () => void;
  className?: string;
  showControls?: boolean;
  statusText?: string;
}

export const NovaAvatar: React.FC<NovaAvatarProps> = ({
  mode = 'welcome',
  currentExpression = 'idle',
  isSpeaking: externalIsSpeaking,
  activeSentence: externalActiveSentence,
  onExpressionChange,
  onVoiceSettingsClick,
  className = '',
  showControls = true,
  statusText = 'Operational // Telemetry Bound'
}) => {
  // Voice service speech sync state
  const [internalSpeechState, setInternalSpeechState] = useState({
    isSpeaking: false,
    currentSentence: '',
    audioLevel: 0,
    visemeOpenness: 0
  });

  const [isMuted, setIsMuted] = useState(novaVoiceService.getMuted());
  const [isBlinking, setIsBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState({ rotateZ: 0, rotateY: 0, translateY: 0 });
  const [eyeGaze, setEyeGaze] = useState({ x: 0, y: 0 });

  // Subscribe to real-time voice and viseme updates
  useEffect(() => {
    const unsubscribe = novaVoiceService.subscribe((state) => {
      setInternalSpeechState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const isSpeaking = externalIsSpeaking ?? internalSpeechState.isSpeaking;
  const currentSentence = externalActiveSentence ?? internalSpeechState.currentSentence;
  const audioLevel = internalSpeechState.audioLevel;
  const visemeOpenness = internalSpeechState.visemeOpenness;

  // 1. Natural Organic Blinking Engine (stochastic interval 2.8s to 6.2s with micro-double-blink)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      const nextInterval = 2800 + Math.random() * 3400;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        // Eyelid closes for 120ms
        setTimeout(() => {
          setIsBlinking(false);
          // 25% chance of realistic double-blink
          if (Math.random() < 0.25) {
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                scheduleNextBlink();
              }, 100);
            }, 120);
          } else {
            scheduleNextBlink();
          }
        }, 120);
      }, nextInterval);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // 2. Natural Head Movement & Micro-Saccades (shifts subtly while speaking or idle)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSpeaking) {
        // Natural speaking head micro-movements (slight nodding & gentle tilt)
        const rotZ = (Math.random() - 0.5) * 1.8;
        const rotY = (Math.random() - 0.5) * 2.4;
        const transY = Math.sin(Date.now() / 250) * 1.5;
        setHeadTilt({ rotateZ: rotZ, rotateY: rotY, translateY: transY });
      } else {
        // Subtle resting idle head posture
        const rotZ = (Math.random() - 0.5) * 0.8;
        const rotY = (Math.random() - 0.5) * 1.2;
        setHeadTilt({ rotateZ: rotZ, rotateY: rotY, translateY: 0 });
      }

      // Natural eye gaze shifts
      setEyeGaze({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 2.5
      });
    }, isSpeaking ? 800 : 3500);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    novaVoiceService.setMuted(next);
  };

  // Determine active visual expression image
  const getExpressionImage = () => {
    switch (currentExpression) {
      case 'welcome':
        return AVATAR_IMAGES.welcome;
      case 'analysis':
        return AVATAR_IMAGES.analysis;
      case 'warning':
      case 'critical':
        return AVATAR_IMAGES.warning;
      case 'success':
        return AVATAR_IMAGES.success;
      case 'idle':
      default:
        return AVATAR_IMAGES.idle;
    }
  };

  const expressionBadgeInfo = {
    welcome: { label: 'WELCOME // GREETING', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    analysis: { label: 'ANALYZING // FOCUS', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
    warning: { label: 'WARNING // CONCERN', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
    critical: { label: 'CRITICAL // TRIP ALERT', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
    success: { label: 'VERIFIED // STABLE', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    idle: { label: 'STANDBY // READY', color: 'text-zinc-400 border-white/[0.08] bg-white/[0.04]' }
  }[currentExpression];

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Outer Halo / Digital Human Frame */}
      <div className="relative group w-full flex flex-col items-center">
        {/* Audio-Reactive Ambient Glow Ring */}
        <div 
          className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-xl transition-all duration-300 pointer-events-none"
          style={{
            opacity: isSpeaking ? 0.8 + audioLevel * 0.5 : 0.35,
            transform: `scale(${isSpeaking ? 1.02 + audioLevel * 0.05 : 1})`
          }}
        />

        {/* Main Avatar Stage */}
        <div 
          className={`relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0b0e14] shadow-2xl transition-all duration-300 ${
            mode === 'welcome' 
              ? 'w-full max-w-[380px] aspect-[3/4]' 
              : mode === 'investigation'
              ? 'w-full max-w-[310px] aspect-[3/4]'
              : 'w-full max-w-[240px] aspect-[3/4]'
          }`}
        >
          {/* Subtle Industrial HUD Grid Overlay in Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#amber-500_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-10" />

          {/* Animated Avatar Container (Breathing + Head Tilt + Eye Gaze Saccades) */}
          <div 
            className="w-full h-full relative transition-transform duration-700 ease-out origin-bottom"
            style={{
              transform: `translateY(${headTilt.translateY}px) rotateZ(${headTilt.rotateZ}deg) rotateY(${headTilt.rotateY}deg)`,
              // Breathing keyframe style applied inline
              animation: 'nova-breathe 4.5s ease-in-out infinite'
            }}
          >
            {/* Primary Base Expression Layer */}
            <img
              src={getExpressionImage()}
              alt="NOVA Industrial AI Operations Specialist"
              className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500"
              style={{
                filter: currentExpression === 'critical' ? 'contrast(1.08) saturate(0.95)' : 'none'
              }}
            />

            {/* Speaking Mouth Articulation Morph Layer */}
            {/* Blends smoothly over the face based on real-time syllable energy */}
            <img
              src={AVATAR_IMAGES.speaking}
              alt="NOVA Speaking Articulation"
              className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none transition-opacity duration-100"
              style={{
                opacity: isSpeaking ? Math.min(0.95, visemeOpenness * 1.1) : 0,
                mixBlendMode: 'normal'
              }}
            />

            {/* Natural Organic Eyelid Occlusion Layer (Blink) */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-75 z-20"
              style={{
                // Eyelid closes over the eye region (approx 36% down from top)
                background: isBlinking 
                  ? 'radial-gradient(ellipse at 50% 38%, rgba(20, 16, 14, 0.94) 0%, rgba(20, 16, 14, 0.9) 24%, transparent 32%)' 
                  : 'transparent',
                opacity: isBlinking ? 1 : 0
              }}
            />

            {/* Subtle Industrial Tech Shoulder Badge Glow ("INDUSTRIX AI // NOVA-01") */}
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-[9px] font-mono-tech text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>INDUSTRIX AI // NOVA-01</span>
            </div>
          </div>

          {/* Real-time Industrial Audio Spectrum Visualizer at Bottom of Stage */}
          {isSpeaking && (
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center gap-1 pb-2 z-20">
              {[0.4, 0.8, 0.6, 1.0, 0.7, 0.9, 0.5, 0.75, 0.95, 0.6, 0.85, 0.4].map((multiplier, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-amber-400/90 rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(4, audioLevel * multiplier * 24)}px`,
                    opacity: 0.6 + audioLevel * 0.4
                  }}
                />
              ))}
            </div>
          )}

          {/* Top Status Bar Inside Avatar */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono-tech font-semibold uppercase border backdrop-blur-md ${expressionBadgeInfo.color}`}>
              {expressionBadgeInfo.label}
            </span>

            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/[0.08]">
              <span className="text-[9px] font-mono-tech text-zinc-300">
                {isSpeaking ? 'VOCALIZING' : 'LISTENING'}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            </div>
          </div>
        </div>

        {/* Live Subtitle / Spoken Sentence Caption Bar */}
        {isSpeaking && currentSentence && (
          <div className="w-full mt-3 p-2.5 rounded-xl bg-[#111620] border border-amber-500/30 shadow-lg text-xs leading-relaxed text-amber-200 font-medium flex items-start gap-2 animate-in fade-in duration-200">
            <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <span className="text-[9px] font-mono-tech text-amber-400/70 block uppercase">
                Verbal Transmission
              </span>
              <span>"{currentSentence}"</span>
            </div>
          </div>
        )}

        {/* Interactive Controls & Expression Selector */}
        {showControls && (
          <div className="w-full mt-3 space-y-2">
            {/* Quick Action Buttons */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5">
                {/* Voice Mute / Unmute Button */}
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isMuted 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20' 
                      : 'bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                  title={isMuted ? 'Unmute NOVA voice' : 'Mute NOVA voice'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="text-[11px] font-mono-tech">{isMuted ? 'MUTED' : 'VOICE ON'}</span>
                </button>

                {/* Stop Speech */}
                {isSpeaking && (
                  <button
                    onClick={() => novaVoiceService.stop()}
                    className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-[11px] font-mono-tech text-zinc-300"
                  >
                    Halt Speech
                  </button>
                )}
              </div>

              {/* Settings Trigger */}
              {onVoiceSettingsClick && (
                <button
                  onClick={onVoiceSettingsClick}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-1"
                  title="Voice & Model Configuration"
                >
                  <Settings2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[11px] font-mono-tech hidden sm:inline">Settings</span>
                </button>
              )}
            </div>

            {/* Expression State Switcher (for previewing and contextual responsiveness) */}
            {onExpressionChange && (
              <div className="p-2 rounded-xl bg-[#0c1017] border border-white/[0.06]">
                <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 mb-1.5 px-1">
                  <span>EXPRESSION STATE:</span>
                  <span className="text-amber-400 uppercase font-semibold">{currentExpression}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {(['welcome', 'analysis', 'warning', 'critical'] as NovaExpression[]).map((exp) => (
                    <button
                      key={exp}
                      onClick={() => onExpressionChange(exp)}
                      className={`px-1.5 py-1 rounded text-[10px] font-mono-tech uppercase transition-all ${
                        currentExpression === exp
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                          : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 border border-white/[0.04]'
                      }`}
                    >
                      {exp === 'welcome' ? 'Smile' : exp === 'analysis' ? 'Focus' : exp === 'warning' ? 'Alert' : 'Crisis'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global CSS keyframes for natural breathing */}
      <style>{`
        @keyframes nova-breathe {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-2px) scale(1.008);
          }
        }
      `}</style>
    </div>
  );
};
