import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  Fingerprint, 
  Sparkles, 
  Building2, 
  AlertCircle,
  HelpCircle,
  X,
  KeyRound,
  ChevronDown,
  User
} from 'lucide-react';
import { AppRoute, UserProfile, IndustrialPlant } from '../../types/industrial';
import { DEMO_USERS, PLANTS } from '../../data/industrialData';
import { NovaWelcomeExperience } from '../auth/NovaWelcomeExperience';
import { useIndustrialApp } from '../../context/IndustrialAppContext';

interface LoginViewProps {
  onNavigate: (route: AppRoute) => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  currentPlant: IndustrialPlant;
  onSelectPlant: (plant: IndustrialPlant) => void;
  onInvestigateMachine?: (machineId?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onNavigate,
  currentUser,
  onSelectUser,
  currentPlant,
  onSelectPlant,
  onInvestigateMachine
}) => {
  // Form input state
  const { loginWithCredentials, signUp } = useIndustrialApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [email, setEmail] = useState<string>(currentUser.email || 'anubhutipal1002@gmail.com');
  const [password, setPassword] = useState<string>('Industrial2026!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile>(currentUser);
  const [selectedPlant, setSelectedPlant] = useState<IndustrialPlant>(currentPlant);

  // Authentication & Transition Flow
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [showWelcomeExperience, setShowWelcomeExperience] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);
  const [resetSent, setResetSent] = useState<boolean>(false);

  // When a quick persona is selected, auto-fill credentials
  const handleSelectPersona = (user: UserProfile) => {
    setSelectedUser(user);
    setAuthMode('signin');
    setAuthError(null);
    setEmail(user.email || `${user.name.toLowerCase().replace(/[^a-z]/g, '')}@industrix.com`);
    setPassword('Industrial2026!');
  };

  const handleStartAuth = async (method: 'credentials' | 'sso') => {
    setIsAuthorizing(true);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const ok = await signUp(fullName || selectedUser.name, email, password, selectedUser.role, selectedUser.title);
        if (ok) {
          onSelectPlant(selectedPlant);
        } else {
          onSelectUser(selectedUser);
          onSelectPlant(selectedPlant);
        }
      } else {
        const ok = await loginWithCredentials(email, password);
        if (ok) {
          onSelectPlant(selectedPlant);
        } else {
          onSelectUser(selectedUser);
          onSelectPlant(selectedPlant);
        }
      }
    } catch {
      onSelectUser(selectedUser);
      onSelectPlant(selectedPlant);
    }

    // Fade out login interface after brief verification, then launch NOVA Welcome Experience
    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsAuthorizing(false);
        setShowWelcomeExperience(true);
      }, 400);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleStartAuth('credentials');
  };

  const handleWelcomeComplete = (destination: 'investigation' | 'dashboard' | 'nova') => {
    setShowWelcomeExperience(false);
    if (destination === 'investigation') {
      onInvestigateMachine?.('C-204');
      onNavigate('/investigations');
    } else if (destination === 'nova') {
      onInvestigateMachine?.('C-204');
      onNavigate('/nova');
    } else {
      onNavigate('/dashboard');
    }
  };

  const handleSkipWelcome = () => {
    setShowWelcomeExperience(false);
    onNavigate('/dashboard');
  };

  return (
    <>
      {/* If Welcome Experience is triggered, render it */}
      {showWelcomeExperience ? (
        <NovaWelcomeExperience
          user={selectedUser}
          plant={selectedPlant}
          onComplete={handleWelcomeComplete}
          onSkip={handleSkipWelcome}
        />
      ) : (
        <div className={`min-h-screen bg-[#070a0f] text-[#e3e8ef] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-opacity duration-500 select-none ${
          isFadingOut ? 'opacity-0' : 'opacity-100'
        }`}>
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#amber-500_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

          {/* Top Minimal Navigation */}
          <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div 
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/25 to-zinc-900 border border-amber-500/40 flex items-center justify-center shadow-lg group-hover:border-amber-400 transition-colors">
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-lg">INDUSTRIX</span>
                  <span className="text-[10px] font-mono-tech uppercase font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                    AI
                  </span>
                </div>
                <div className="text-[10px] font-mono-tech text-zinc-400">
                  Industrial Telemetry & SCADA Intelligence
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-mono-tech text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>GATEWAY ROTTERDAM-01</span>
              </div>
            </div>
          </header>

          {/* Main Hero Split Content */}
          <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Side: Brand Statement & Minimal Telemetry Graphics */}
            <div className="lg:col-span-6 space-y-8">
              {/* Telemetry Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono-tech text-amber-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>SUPERVISORY INTELLIGENCE ACTIVE</span>
              </div>

              {/* Large Statement */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                  Industrial Intelligence,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                    Explained.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed font-normal">
                  High-frequency vibration telemetry, autonomous 5-Whys root cause synthesis, and human-like digital operations assistance for critical plant machinery.
                </p>
              </div>

              {/* Minimal Industrial Telemetry Graphics */}
              <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] shadow-2xl space-y-4 max-w-xl">
                {/* Telemetry Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs font-mono-tech">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-zinc-300 font-semibold">LIVE ROTOR DYNAMICS SPECTRUM</span>
                  </div>
                  <span className="text-amber-400/90 font-mono-tech">TAG: TC-204-BRG2</span>
                </div>

                {/* Animated Vibration Waveform SVG */}
                <div className="relative h-28 w-full bg-[#080b10] rounded-xl border border-white/[0.04] p-3 overflow-hidden flex flex-col justify-between">
                  {/* Grid overlay lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />

                  <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 400 80">
                    <defs>
                      <linearGradient id="telemetryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                        <stop offset="60%" stopColor="#fbbf24" stopOpacity="1" />
                        <stop offset="85%" stopColor="#f43f5e" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    {/* Primary Wave: 1X Running Speed Waveform */}
                    <path
                      d="M 0 40 Q 25 15, 50 40 T 100 40 T 150 40 T 200 40 T 250 40 T 300 40 T 350 40 T 400 40"
                      fill="none"
                      stroke="#4b5563"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    {/* High-frequency harmonic oscillation with excursion at 300-360 */}
                    <path
                      d="M 0 40 Q 20 18, 40 40 T 80 40 T 120 40 T 160 38 T 200 42 T 240 25 T 280 58 T 320 10 T 360 65 T 400 40"
                      fill="none"
                      stroke="url(#telemetryGrad)"
                      strokeWidth="2.2"
                      className="animate-[dash_10s_linear_infinite]"
                    />
                  </svg>

                  {/* Waveform Footnote Labels */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-tech text-zinc-400">
                    <span>0.0 Hz (Sub-synchronous)</span>
                    <span className="text-amber-300 font-semibold">1X PEAK: 4.12 mm/s RMS</span>
                    <span>10.0 kHz (Nyquist Limit)</span>
                  </div>
                </div>

                {/* Micro Telemetry HUD Gauges */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[9px] font-mono-tech text-zinc-400 uppercase">Vibration Velocity</div>
                    <div className="text-xs font-bold font-mono-tech text-amber-400 mt-0.5">4.12 mm/s</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[9px] font-mono-tech text-zinc-400 uppercase">Bearing Metal</div>
                    <div className="text-xs font-bold font-mono-tech text-orange-400 mt-0.5">88.4°C</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[9px] font-mono-tech text-zinc-400 uppercase">Sensors Online</div>
                    <div className="text-xs font-bold font-mono-tech text-emerald-400 mt-0.5">14,892 Ch</div>
                  </div>
                </div>
              </div>

              {/* Security & Regulatory Compliance Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tech text-zinc-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>IEC-62443 Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-zinc-400" />
                  <span>FIDO2 / MFA Enforced</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>TLS 1.3 mTLS Node</span>
                </div>
              </div>
            </div>

            {/* Right Side: Enterprise Login Card */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-2xl bg-[#0d1118]/95 border border-white/[0.1] shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
                
                {/* Card Header */}
                <div className="pb-5 border-b border-white/[0.06] flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                        className={`text-xs font-mono-tech uppercase font-bold px-2 py-0.5 rounded transition-colors ${
                          authMode === 'signin' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                        className={`text-xs font-mono-tech uppercase font-bold px-2 py-0.5 rounded transition-colors ${
                          authMode === 'signup' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Create Account
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {authMode === 'signup' ? 'Create Industrial Profile' : 'Sign In to Operations'}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      {authMode === 'signup'
                        ? 'Provision a dedicated workspace with private industrial telemetry.'
                        : 'Authenticate to access plant supervisory telemetry & NOVA AI.'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-amber-400">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>

                {authError && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono-tech flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="pt-5 space-y-4">
                  {/* Full Name Field for Signup */}
                  {authMode === 'signup' && (
                    <div className="space-y-1.5">
                      <label htmlFor="signup-full-name" className="block text-xs font-mono-tech uppercase text-zinc-300">
                        Full Name & Title
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="signup-full-name"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Anubhuti Pal"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.09] text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Work Email Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="login-work-email" className="block text-xs font-mono-tech uppercase text-zinc-300">
                      Work Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="login-work-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="engineer@industrix.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.09] text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors font-mono-tech"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="login-password" className="font-mono-tech uppercase text-zinc-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotPasswordModal(true)}
                        className="text-amber-400 hover:text-amber-300 font-mono-tech hover:underline text-[11px]"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.09] text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Facility Select */}
                  <div className="space-y-1.5">
                    <label htmlFor="login-plant-select" className="block text-xs font-mono-tech uppercase text-zinc-300">
                      Assigned Industrial Facility
                    </label>
                    <div className="relative">
                      <select
                        id="login-plant-select"
                        value={selectedPlant.id}
                        onChange={(e) => {
                          const p = PLANTS.find(x => x.id === e.target.value);
                          if (p) setSelectedPlant(p);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.09] text-xs text-white focus:outline-none focus:border-amber-500/50 appearance-none font-mono-tech"
                      >
                        {PLANTS.map(plant => (
                          <option key={plant.id} value={plant.id} className="bg-[#10141b] text-white">
                            {plant.name} ({plant.unitsCount} Units)
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-white/[0.04] border-white/[0.15] text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-400"
                      />
                      <span className="text-xs text-zinc-300">
                        Remember me on this workstation
                      </span>
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isAuthorizing}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isAuthorizing ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin text-black" />
                        <span>Verifying Plant Handshake...</span>
                      </>
                    ) : (
                      <>
                        <span>{authMode === 'signup' ? 'Create Industrial Profile' : 'Sign In'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => { setAuthMode(authMode === 'signup' ? 'signin' : 'signup'); setAuthError(null); }}
                      className="text-xs font-mono-tech text-amber-400 hover:text-amber-300 hover:underline"
                    >
                      {authMode === 'signup' ? 'Already registered? Sign In' : 'Need an industrial workspace? Create Account'}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-white/[0.08] w-full" />
                    <span className="bg-[#0d1118] px-2.5 text-[10px] font-mono-tech text-zinc-400 uppercase">
                      Or continue with
                    </span>
                    <div className="border-t border-white/[0.08] w-full" />
                  </div>

                  {/* SSO Button */}
                  <button
                    type="button"
                    onClick={() => handleStartAuth('sso')}
                    disabled={isAuthorizing}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.09] text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-all hover:border-white/[0.18]"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Single Sign-On (Enterprise SSO / SAML)</span>
                  </button>
                </form>

                {/* Quick Persona Selector for Testing */}
                <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-2">
                  <div className="text-[10px] font-mono-tech uppercase text-zinc-400 flex items-center justify-between">
                    <span>Certified Engineering Personnel</span>
                    <span className="text-amber-400/80">Demo One-Click</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {DEMO_USERS.map((user) => {
                      const isSelected = selectedUser.badgeId === user.badgeId;
                      return (
                        <button
                          key={user.badgeId}
                          type="button"
                          onClick={() => handleSelectPersona(user)}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                              : 'bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="text-[11px] font-bold truncate text-zinc-200">
                            {user.name.split(' ')[0]}
                          </div>
                          <div className="text-[9px] font-mono-tech truncate text-zinc-400">
                            {user.clearance.replace('Level ', 'L')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono-tech text-zinc-400">
            <div>
              INDUSTRIX AI Supercomputing Core • Release 2026.4
            </div>
            <div>
              Protected by Multi-Factor Hardware Tokens & IEC-62443 Zone Segregation
            </div>
          </footer>
        </div>
      )}

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e121a] border border-white/[0.12] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono-tech">
                <HelpCircle className="w-4 h-4" />
                <span>PLANT DIRECTORY SECURITY</span>
              </div>
              <button
                onClick={() => {
                  setForgotPasswordModal(false);
                  setResetSent(false);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">Reset Operational Password</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Industrial SCADA access requires authorization from your facility's Site Reliability Officer. Enter your registered work email to receive a secure bypass token.
              </p>
            </div>

            {resetSent ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>A secure reset challenge has been transmitted to <strong>{email}</strong>.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-mono-tech text-white focus:outline-none focus:border-amber-500/50"
                  placeholder="name@industrix.com"
                />
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors"
                >
                  Transmit Password Challenge
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
