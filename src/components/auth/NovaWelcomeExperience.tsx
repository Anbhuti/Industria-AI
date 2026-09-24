import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Radio, 
  Volume2, 
  VolumeX, 
  FastForward, 
  CheckCircle2, 
  Sliders, 
  Cpu, 
  ChevronRight,
  ShieldAlert,
  Flame,
  Gauge
} from 'lucide-react';
import { UserProfile, IndustrialPlant, AppRoute } from '../../types/industrial';
import { NovaExpression } from '../../types/nova';
import { NovaAvatar } from '../nova/NovaAvatar';
import { novaVoiceService } from '../../services/novaVoiceService';

interface NovaWelcomeExperienceProps {
  user: UserProfile;
  plant: IndustrialPlant;
  onComplete: (destination: 'investigation' | 'dashboard' | 'nova') => void;
  onSkip: () => void;
}

export const NovaWelcomeExperience: React.FC<NovaWelcomeExperienceProps> = ({
  user,
  plant,
  onComplete,
  onSkip
}) => {
  // Check if this user has previously completed the introduction
  const [isReturningUser, setIsReturningUser] = useState<boolean>(() => {
    try {
      return localStorage.getItem('industrix_nova_has_seen_intro') === 'true';
    } catch {
      return false;
    }
  });

  // Steps in sequence:
  // 0: Initial environment fade in
  // 1: NOVA appears (resting idle posture)
  // 2: NOVA looks toward the user (head and eye gaze alignment)
  // 3: NOVA naturally smiles (expression morphs to 'welcome')
  // 4: NOVA speaks greeting ("Welcome back." / verbal message)
  // 5: Display Plant Status HUD cards
  // 6: NOVA detects anomaly & speaks ("I've detected one high-priority anomaly...")
  // 7: Display Anomaly Card (Compressor C-204) & Action Buttons
  const [step, setStep] = useState<number>(0);
  const [currentExpression, setCurrentExpression] = useState<NovaExpression>('idle');
  const [activeCaption, setActiveCaption] = useState<string>('');
  const [displayedHeadline, setDisplayedHeadline] = useState<string>('');
  const [isMuted, setIsMuted] = useState(novaVoiceService.getMuted());
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Safe timeout helper
  const scheduleTimeout = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
    return t;
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    // Mark that the user has encountered the welcome sequence
    try {
      localStorage.setItem('industrix_nova_has_seen_intro', 'true');
    } catch {
      // ignore
    }

    // Sequence execution:
    // If returning user, speed up the transition while still delivering the personal greeting
    const speedMultiplier = isReturningUser ? 0.6 : 1.0;

    // Step 1: Industrial environment visualization appears (immediate)
    setStep(0);

    // Step 2: NOVA appears after environment settles
    scheduleTimeout(() => {
      setStep(1);
      setCurrentExpression('idle');
    }, 450 * speedMultiplier);

    // Step 3: NOVA looks toward user
    scheduleTimeout(() => {
      setStep(2);
    }, 1100 * speedMultiplier);

    // Step 4: NOVA naturally smiles
    scheduleTimeout(() => {
      setStep(3);
      setCurrentExpression('welcome');
    }, 1700 * speedMultiplier);

    // Step 5: NOVA speaks welcome
    scheduleTimeout(() => {
      setStep(4);
      const firstName = user?.name ? user.name.split(' ')[0] : 'Anubhuti';
      setDisplayedHeadline(`Welcome back, ${firstName}.`);

      const welcomeSpoken = `Welcome back, ${firstName}. I'm NOVA, your industrial intelligence assistant.`;

      setActiveCaption(welcomeSpoken);

      if (!novaVoiceService.getMuted()) {
        novaVoiceService.speak(welcomeSpoken, (s) => setActiveCaption(s));
      }
    }, 2200 * speedMultiplier);

    // Step 6: Display Plant Status HUD
    scheduleTimeout(() => {
      setStep(5);
    }, (isReturningUser ? 3600 : 5400) * speedMultiplier);

    // Step 7: NOVA shifts expression to warning/analysis & announces anomaly
    scheduleTimeout(() => {
      setStep(6);
      setCurrentExpression('warning');

      const anomalySpoken = "I've checked the current plant status. Operations are stable, but I detected one high-priority anomaly that may require your attention.";
      setActiveCaption(anomalySpoken);

      if (!novaVoiceService.getMuted()) {
        novaVoiceService.speak(anomalySpoken, (s) => setActiveCaption(s));
      }
    }, (isReturningUser ? 5000 : 7600) * speedMultiplier);

    // Step 8: Show Anomaly Card & Interactive Buttons
    scheduleTimeout(() => {
      setStep(7);
    }, (isReturningUser ? 6200 : 9200) * speedMultiplier);

    return () => {
      clearAllTimeouts();
      novaVoiceService.stop();
    };
  }, [isReturningUser]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    novaVoiceService.setMuted(next);
  };

  const handleSkip = () => {
    clearAllTimeouts();
    novaVoiceService.stop();
    onSkip();
  };

  const handleInvestigate = () => {
    clearAllTimeouts();
    novaVoiceService.stop();
    onComplete('investigation');
  };

  const handleGoToControlCenter = () => {
    clearAllTimeouts();
    novaVoiceService.stop();
    onComplete('dashboard');
  };

  const handleAskNova = () => {
    clearAllTimeouts();
    novaVoiceService.stop();
    onComplete('nova');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070a0f] text-[#e3e8ef] overflow-hidden flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] select-none animate-in fade-in duration-500">
      {/* Background Industrial Environment Visualization */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Cinematic Control Room Backdrop Image */}
        <img
          src="/src/assets/images/control_room_backdrop_1789926148954.jpg"
          alt="Control Room Backdrop"
          className={`w-full h-full object-cover object-center transition-all duration-1000 ${
            step >= 0 ? 'opacity-35 scale-100 blur-[1px]' : 'opacity-0 scale-105'
          }`}
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a0f] via-[#070a0f]/80 to-[#070a0f]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#070a0f_85%)]" />

        {/* Industrial Telemetry Grid & Scanning Beam */}
        <div className="absolute inset-0 bg-[radial-gradient(#amber-500_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent animate-[pulse_3s_ease-in-out_infinite] top-1/3" />
      </div>

      {/* Top Bar: Facility Status & Controls */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        {/* Facility Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-sm sm:text-base">
                INDUSTRIX AI
              </span>
              <span className="text-[10px] font-mono-tech uppercase font-semibold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                SCADA ONBOARDING
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono-tech">
              {plant.name} • Protocol v4.8 Active
            </div>
          </div>
        </div>

        {/* Quick Controls: Mute & Skip Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isReturningUser && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono-tech text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Returning Engineer Recognized
            </span>
          )}

          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
              isMuted 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : 'bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute NOVA' : 'Mute NOVA'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span className="text-[11px] font-mono-tech hidden sm:inline">{isMuted ? 'MUTED' : 'VOICE'}</span>
          </button>

          <button
            onClick={handleSkip}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono-tech text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all shadow-sm group"
            title="Skip to Plant Dashboard"
          >
            <span>Skip Introduction</span>
            <FastForward className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Stage: NOVA Avatar + Telemetry Teleprompter */}
      <div className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 py-4">
        {/* Left/Center: Digital Human NOVA Avatar Stage */}
        <div 
          className={`relative transition-all duration-1000 flex flex-col items-center ${
            step >= 1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {/* Subtle Ambient Halo */}
          <div className="absolute -inset-4 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* NOVA Digital Human Component */}
          <div className="relative">
            <NovaAvatar
              mode="welcome"
              currentExpression={currentExpression}
              showControls={false}
              className="w-[260px] sm:w-[320px] md:w-[340px]"
            />

            {/* Status Beacon Indicator */}
            <div className="absolute -bottom-2 inset-x-0 flex justify-center">
              <div className="px-3 py-1 rounded-full bg-[#0d121c] border border-amber-500/30 text-[10px] font-mono-tech text-amber-300 shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NOVA // INDUSTRIAL INTELLIGENCE ASSISTANT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Narration, Telemetry Cards & Anomaly Alerts */}
        <div className="w-full lg:max-w-lg space-y-5">
          {/* Dynamic Spoken Headline ("Welcome back.") */}
          {step >= 4 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono-tech text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OPERATIONAL BRIEFING IN PROGRESS</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {displayedHeadline}
              </h1>

              {/* Subtitle / Spoken Statement */}
              <div className="p-3.5 rounded-2xl bg-[#0f141d]/90 border border-white/[0.08] shadow-lg text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-2.5">
                <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <p className="font-normal italic">
                  "{activeCaption}"
                </p>
              </div>
            </div>
          )}

          {/* Plant Status Grid (Appears at Step 5) */}
          {step >= 5 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-[10px] font-mono-tech uppercase text-zinc-400 tracking-wider">
                Fleet Telemetry Overview
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Plant Status */}
                <div className="p-3 rounded-xl bg-[#0e131c] border border-emerald-500/30 shadow-md">
                  <div className="text-[9px] font-mono-tech uppercase text-zinc-400">PLANT STATUS</div>
                  <div className="text-xs sm:text-sm font-bold font-mono-tech text-emerald-400 flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Operational</span>
                  </div>
                </div>

                {/* Active Machines */}
                <div className="p-3 rounded-xl bg-[#0e131c] border border-white/[0.08] shadow-md">
                  <div className="text-[9px] font-mono-tech uppercase text-zinc-400">ACTIVE MACHINES</div>
                  <div className="text-base sm:text-lg font-bold font-mono-tech text-white mt-0.5">
                    142
                  </div>
                </div>

                {/* Anomalies */}
                <div className="p-3 rounded-xl bg-[#0e131c] border border-amber-500/30 shadow-md">
                  <div className="text-[9px] font-mono-tech uppercase text-zinc-400">ANOMALIES</div>
                  <div className="text-base sm:text-lg font-bold font-mono-tech text-amber-400 mt-0.5">
                    04
                  </div>
                </div>

                {/* Critical Incidents */}
                <div className="p-3 rounded-xl bg-[#0e131c] border border-rose-500/30 shadow-md">
                  <div className="text-[9px] font-mono-tech uppercase text-zinc-400">CRITICAL INCIDENTS</div>
                  <div className="text-base sm:text-lg font-bold font-mono-tech text-rose-400 mt-0.5">
                    01
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* High Priority Anomaly Card (Appears at Step 6 & 7) */}
          {step >= 6 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/40 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Compressor C-204
                    </h3>
                    <div className="text-[10px] font-mono-tech text-amber-300">
                      High vibration anomaly detected on Bearing #2
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-tech font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                  Severity: HIGH
                </span>
              </div>

              {/* Anomaly Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/[0.06] text-xs font-mono-tech">
                <div>
                  <div className="text-[9px] text-zinc-400">Vibration Velocity</div>
                  <div className="text-amber-300 font-bold">4.12 mm/s RMS</div>
                </div>
                <div>
                  <div className="text-[9px] text-zinc-400">Bearing Metal</div>
                  <div className="text-orange-300 font-bold">88.4°C</div>
                </div>
                <div>
                  <div className="text-[9px] text-zinc-400">ISO 10816-3</div>
                  <div className="text-rose-400 font-bold">Zone C (Restricted)</div>
                </div>
              </div>
            </div>
          )}

          {/* Final Action Buttons (Step 7) */}
          {step >= 7 && (
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Investigate Incident */}
              <button
                onClick={handleInvestigate}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Investigate Incident</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* View Plant */}
              <button
                onClick={handleGoToControlCenter}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Activity className="w-4 h-4 text-amber-400" />
                <span>View Plant</span>
              </button>

              {/* Ask NOVA */}
              <button
                onClick={handleAskNova}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask NOVA</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-8 py-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>SUPERVISORY SCADA BRIDGE ONLINE</span>
        </div>
        <div>
          AUTONOMOUS IEC-62443 TELEMETRY MESH
        </div>
      </div>
    </div>
  );
};
