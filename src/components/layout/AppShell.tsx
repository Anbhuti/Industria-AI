import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Flame, 
  Layers, 
  Wrench, 
  FileText, 
  ShieldCheck, 
  Radio, 
  Bell, 
  ChevronDown, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  ExternalLink,
  Power,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  LogOut,
  Building2,
  Clock,
  ShieldAlert,
  Download,
  HardDrive
} from 'lucide-react';
import { AppRoute, IndustrialPlant, UserProfile, IndustrialMachine } from '../../types/industrial';
import { PLANTS, DEMO_USERS } from '../../data/industrialData';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useIndustrialApp } from '../../context/IndustrialAppContext';

interface AppShellProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  currentUser: UserProfile;
  currentPlant: IndustrialPlant;
  onSelectPlant: (plant: IndustrialPlant) => void;
  onSelectUser: (user: UserProfile) => void;
  machines: IndustrialMachine[];
  children: React.ReactNode;
  onOpenQuickNova?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  currentUser,
  currentPlant,
  onSelectPlant,
  onSelectUser,
  machines,
  children,
  onOpenQuickNova
}) => {
  const { workspace, exportUserData, login } = useIndustrialApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [liveLatency, setLiveLatency] = useState(42);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPlantDropdownOpen(false);
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Periodic latency simulation for telemetry link
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(Math.floor(38 + Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { route: '/dashboard' as AppRoute, label: 'Control Center', icon: Activity, badge: 'LIVE' },
    { route: '/nova' as AppRoute, label: 'NOVA AI Core', icon: Sparkles, badge: 'AI' },
    { route: '/monitoring' as AppRoute, label: 'Telemetry Stream', icon: Radio, badge: null },
    { route: '/machines' as AppRoute, label: 'Asset Fleet', icon: Cpu, badge: `${machines.length}` },
    { route: '/investigations' as AppRoute, label: 'Incident RCA', icon: AlertTriangle, badge: '1 ACT' },
    { route: '/intelligence' as AppRoute, label: 'Risk Intelligence', icon: ShieldCheck, badge: null },
    { route: '/reports' as AppRoute, label: 'Industrial Reports', icon: FileText, badge: null },
    { route: '/technology' as AppRoute, label: 'Neural Architecture', icon: Layers, badge: null },
  ];

  const warningCount = machines.filter(m => m.status === 'warning').length;
  const criticalCount = machines.filter(m => m.status === 'critical').length;

  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#e1e7ef] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Operational Status Bar */}
      <header className="h-14 border-b border-white/[0.08] bg-[#10141b]/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between">
        {/* Left: Brand & Plant Status */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg bg-white/[0.04] border border-white/[0.08]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => onNavigate('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 via-zinc-800 to-zinc-950 border border-amber-500/40 flex items-center justify-center shadow-inner">
              <Activity className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold tracking-tight text-white text-base">INDUSTRIX AI</span>
            </div>
          </div>

          <div className="hidden lg:block h-4 w-px bg-white/10" />

          {/* Plant Selector */}
          <div className="relative hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400">Plant:</span>
            <button
              onClick={() => setIsPlantDropdownOpen(!isPlantDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] font-medium text-zinc-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="max-w-[210px] truncate">{currentPlant.name}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {isPlantDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-[#141922] border border-white/[0.12] rounded-xl shadow-2xl p-1.5 z-50">
                <div className="px-2.5 py-1.5 text-[10px] font-mono-tech uppercase text-zinc-400 border-b border-white/[0.06]">
                  Select Industrial Facility
                </div>
                <div className="py-1 space-y-0.5">
                  {PLANTS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPlant(p);
                        setIsPlantDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        p.id === currentPlant.id ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'text-zinc-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-[11px] text-zinc-500">{p.location}</div>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${p.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-400 ring-2 ring-amber-400/20'}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Operational Status & Simulated Telemetry Notice */}
        <div className="hidden md:flex items-center gap-3 text-xs font-mono-tech bg-white/[0.02] px-3.5 py-1.5 rounded-full border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-400 font-sans">SCADA:</span>
            <span className="font-semibold text-emerald-400">ONLINE</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1.5 text-amber-300 font-bold tracking-tight">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>SIMULATED INDUSTRIAL DATA</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span className="text-zinc-400 font-sans">Telemetry:</span>
            <span className="text-amber-300 font-mono-tech">Live</span>
          </div>
        </div>

        {/* Right: Quick NOVA button ("Ask NOVA"), Alert status, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* NOVA button: "Ask NOVA" */}
          <button
            onClick={() => {
              if (onOpenQuickNova) {
                onOpenQuickNova();
              } else {
                onNavigate('/nova');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all shadow-sm group"
            title="Ask NOVA Industrial AI Assistant (⌘K)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold tracking-wide">Ask NOVA</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.2 bg-black/40 rounded text-[9px] font-mono-tech text-amber-400/85 border border-amber-500/25 ml-0.5">
              ⌘K
            </kbd>
          </button>

          {/* Alarm Badge Button */}
          <button
            onClick={() => onNavigate('/dashboard')}
            className="relative p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-zinc-300"
            title={`${warningCount + criticalCount} active equipment anomalies`}
          >
            <Bell className="w-4 h-4 text-zinc-400" />
            {warningCount + criticalCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-black font-bold font-mono-tech text-[9px] rounded-full ring-2 ring-[#0b0e13]">
                {warningCount + criticalCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-colors"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20" 
              />
              <div className="text-left hidden xl:block">
                <div className="text-xs font-semibold text-zinc-200 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-zinc-400 font-mono-tech">{currentUser.badgeId}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden xl:block" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-72 bg-[#141922] border border-white/[0.12] rounded-xl shadow-2xl p-2 z-50">
                <div className="p-2 border-b border-white/[0.06] mb-1">
                  <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-zinc-400">{currentUser.title}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <span className="text-[9px] font-mono-tech text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {currentUser.clearance}
                    </span>
                    {workspace && (
                      <span className="text-[9px] font-mono-tech text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <HardDrive className="w-2.5 h-2.5" />
                        {workspace.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <div className="text-[10px] font-mono-tech uppercase text-zinc-500 px-2 py-1">
                    Switch Personnel Profile
                  </div>
                  {DEMO_USERS.map(u => (
                    <button
                      key={u.badgeId}
                      onClick={() => {
                        login(u.badgeId);
                        onSelectUser(u);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        u.badgeId === currentUser.badgeId ? 'bg-white/[0.08] text-white font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="truncate">
                        <div>{u.name}</div>
                        <div className="text-[10px] text-zinc-500">{u.role}</div>
                      </div>
                      {u.badgeId === currentUser.badgeId && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/[0.06] pt-1 mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      exportUserData();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.04] flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export Workspace JSON Dossier</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      setIsLogoutConfirmOpen(true);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock Session / Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body: Left Rail + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Navigation Rail */}
        <aside className="w-64 border-r border-white/[0.08] bg-[#0d1016] hidden md:flex flex-col justify-between py-4 px-3 select-none shrink-0">
          <div className="space-y-6">
            {/* Operational Location Badge */}
            <div className="px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-[10px] font-mono-tech uppercase text-zinc-400 tracking-wider">Active Station</div>
              <div className="text-xs font-semibold text-zinc-200 mt-0.5 truncate">{currentPlant.name}</div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 pt-2 border-t border-white/[0.04]">
                <span>Load: {currentPlant.activeLoadMW} MW</span>
                <span className="text-emerald-400 font-mono-tech">OEE {currentPlant.overallOEE}%</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono-tech uppercase text-zinc-400 px-3 pb-1 tracking-wider">
                Industrial Modules
              </div>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => onNavigate(item.route)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive 
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm' 
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-200'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono-tech px-1.5 py-0.2 rounded border ${
                        item.badge === 'AI' 
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                          : item.badge === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-white/[0.06] text-zinc-400 border-white/[0.08]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Left Rail Meta */}
          <div className="space-y-3 pt-3 border-t border-white/[0.06]">
            <button
              onClick={() => onNavigate('/')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                <span>Platform Overview</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono-tech">Public</span>
            </button>

            <div className="p-2.5 rounded-xl bg-gradient-to-b from-zinc-900/60 to-black/60 border border-white/[0.05] text-[11px]">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-medium text-zinc-300">Edge Gateway #04</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-zinc-400 text-[10px] mt-1 font-mono-tech">
                Buffer: 99.8% Sync • SIL-3 Certified
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden flex flex-col p-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.1]">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white">INDUSTRIX AI</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg bg-white/[0.08] text-zinc-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1.5 flex-1 overflow-y-auto">
              <div className="text-[10px] font-mono-tech uppercase text-zinc-500 px-3 pb-1">
                Navigation
              </div>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => {
                      onNavigate(item.route);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                      isActive ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'text-zinc-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-xs font-mono-tech px-2 py-0.5 rounded bg-white/[0.08] text-zinc-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => {
                    onNavigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-400"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Platform Overview (Landing)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto bg-[#090b0f] relative flex flex-col">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden border-t border-white/[0.08] bg-[#0d1016]/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around z-30 shrink-0">
        <button
          onClick={() => onNavigate('/dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            currentRoute === '/dashboard' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Ops</span>
        </button>
        <button
          onClick={() => onNavigate('/nova')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            currentRoute === '/nova' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>NOVA</span>
        </button>
        <button
          onClick={() => onNavigate('/monitoring')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            currentRoute === '/monitoring' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Stream</span>
        </button>
        <button
          onClick={() => onNavigate('/machines')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            currentRoute === '/machines' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Assets</span>
        </button>
        <button
          onClick={() => onNavigate('/investigations')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            currentRoute === '/investigations' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>RCA</span>
        </button>
      </nav>

      {/* Confirmation Dialog for Session Sign Out */}
      <ConfirmationDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => onNavigate('/login')}
        title="Lock Operational Terminal Session"
        message={`You are about to sign out of the active terminal session for ${currentUser.name} (${currentUser.role}) at ${currentPlant.name}.`}
        detailText="SIL-3 Guard Protocol: Active SCADA edge ingestion will continue running unhindered in the background."
        confirmLabel="Lock & Sign Out"
        cancelLabel="Stay in Control Center"
        severity="warning"
      />
    </div>
  );
};
