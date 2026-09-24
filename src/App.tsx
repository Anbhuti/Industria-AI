import React, { useState, useEffect } from 'react';
import { AppRoute, IndustrialMachine, IndustrialPlant, UserProfile, ReportModel, PlantModel } from './types/industrial';
import { PLANTS } from './data/industrialData';
import { IndustrialAppProvider, useIndustrialApp } from './context/IndustrialAppContext';
import { AppShell } from './components/layout/AppShell';
import { LandingView } from './components/views/LandingView';
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { NovaView } from './components/views/NovaView';
import { MonitoringView } from './components/views/MonitoringView';
import { MachinesView } from './components/views/MachinesView';
import { InvestigationsView } from './components/views/InvestigationsView';
import { IntelligenceView } from './components/views/IntelligenceView';
import { ReportsView } from './components/views/ReportsView';
import { TechnologyView } from './components/views/TechnologyView';
import { NovaCopilotFloating } from './components/nova/NovaCopilotFloating';
import { NovaCopilotProvider } from './context/NovaCopilotContext';
import { CommandBar } from './components/common/CommandBar';
import { NotificationToast } from './components/common/NotificationToast';
import { ReportDossierModal } from './components/reports/ReportDossierModal';
import { GenerateReportModal } from './components/reports/GenerateReportModal';
import { InvestigationDemoController } from './components/demo/InvestigationDemoController';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';

function AppContent() {
  const {
    currentUser,
    selectedPlant,
    selectedMachine,
    machines,
    plants,
    setSelectedPlantId,
    setSelectedMachineId,
    setCurrentUser,
    viewingReport,
    setViewingReport,
    isCommandBarOpen,
    setIsCommandBarOpen,
    toggleCommandBar,
    activeInvestigation
  } = useIndustrialApp();

  const activePlant: PlantModel = selectedPlant || plants[0] || (PLANTS[0] as PlantModel);

  // Initialize route from current window path if valid, otherwise default to '/'
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const path = window.location.pathname as AppRoute;
    const validRoutes: AppRoute[] = [
      '/',
      '/login',
      '/dashboard',
      '/nova',
      '/monitoring',
      '/machines',
      '/investigations',
      '/intelligence',
      '/reports',
      '/technology'
    ];
    return validRoutes.includes(path) ? path : '/';
  });

  const [selectedMachineForContext, setSelectedMachineForContext] = useState<IndustrialMachine | null>(null);
  const [isQuickNovaOpen, setIsQuickNovaOpen] = useState(false);
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [novaInitialPrompt, setNovaInitialPrompt] = useState<string | undefined>(undefined);
  const [isDemoActive, setIsDemoActive] = useState(false);

  // Global listener to launch AI Investigation Demo
  useEffect(() => {
    const handleStartDemo = () => setIsDemoActive(true);
    window.addEventListener('industrix:start-demo', handleStartDemo);
    return () => window.removeEventListener('industrix:start-demo', handleStartDemo);
  }, []);

  // Sync route with browser history
  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as AppRoute;
      setCurrentRoute(path || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut: Command/Ctrl + K opens CommandBar palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandBar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandBar]);

  // Keep selectedMachineForContext synchronized with global selectedMachine
  useEffect(() => {
    if (selectedMachine) {
      setSelectedMachineForContext(selectedMachine);
    }
  }, [selectedMachine]);

  const handleAskNovaWithMachine = (machine: IndustrialMachine, customPrompt?: string) => {
    setSelectedMachineForContext(machine);
    setSelectedMachineId(machine.id);
    setNovaInitialPrompt(customPrompt);
    navigate('/nova');
  };

  const handleSelectMachineForInvestigation = (machine: IndustrialMachine) => {
    setSelectedMachineForContext(machine);
    setSelectedMachineId(machine.id);
    navigate('/investigations');
  };

  // Render view depending on route
  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/':
        return <LandingView onNavigate={navigate} />;

      case '/login':
        return (
          <LoginView
            onNavigate={navigate}
            currentUser={currentUser}
            onSelectUser={setCurrentUser}
            currentPlant={activePlant}
            onSelectPlant={(p) => setSelectedPlantId(p.id)}
            onInvestigateMachine={(id) => {
              setSelectedMachineId(id || 'C-204');
              const target = machines.find(m => m.id.toLowerCase() === (id || 'C-204').toLowerCase()) || machines[0];
              setSelectedMachineForContext(target);
            }}
          />
        );

      case '/dashboard':
        return (
          <DashboardView
            onNavigate={navigate}
            machines={machines}
            currentPlant={activePlant}
            onSelectMachineForInvestigation={handleSelectMachineForInvestigation}
            onAskNovaWithMachine={handleAskNovaWithMachine}
            onRunInvestigationDemo={() => setIsDemoActive(true)}
          />
        );

      case '/nova':
        return (
          <NovaView
            machines={machines}
            initialMachineContext={selectedMachineForContext || selectedMachine || machines[0]}
            initialPrompt={novaInitialPrompt}
            onNavigate={navigate}
          />
        );

      case '/monitoring':
        return (
          <MonitoringView 
            machines={machines} 
            onNavigate={navigate}
            onSelectMachine={handleSelectMachineForInvestigation}
          />
        );

      case '/machines':
        return (
          <MachinesView
            machines={machines}
            onNavigate={navigate}
            onAskNovaWithMachine={handleAskNovaWithMachine}
            selectedMachineId={selectedMachineForContext?.id || selectedMachine?.id}
          />
        );

      case '/investigations':
        return (
          <InvestigationsView 
            onNavigate={navigate} 
            onAskNovaWithMachine={handleAskNovaWithMachine}
            machines={machines}
          />
        );

      case '/intelligence':
        return (
          <IntelligenceView 
            machines={machines} 
            onNavigate={navigate} 
            onAskNovaWithMachine={handleAskNovaWithMachine}
          />
        );

      case '/reports':
        return (
          <ReportsView
            machines={machines}
            currentPlant={activePlant}
            currentUser={currentUser}
            onNavigate={navigate}
          />
        );

      case '/technology':
        return <TechnologyView onNavigate={navigate} />;

      default:
        return <LandingView onNavigate={navigate} />;
    }
  };

  // Persistent application shell wraps authenticated routes
  const isAuthRoute = currentRoute !== '/' && currentRoute !== '/login';

  return (
    <NovaCopilotProvider
      currentRoute={currentRoute}
      currentUser={currentUser}
      currentPlant={activePlant}
      machines={machines}
      onNavigate={navigate}
      onSelectMachineId={(id) => {
        setSelectedMachineId(id);
        const target = machines.find(m => m.id.toLowerCase() === id.toLowerCase());
        if (target) setSelectedMachineForContext(target);
      }}
    >
      <div className="min-h-screen bg-[#090c10] text-[#e3e8ef] selection:bg-amber-500/20 selection:text-white">
        {isAuthRoute ? (
          <AppShell
            currentRoute={currentRoute}
            onNavigate={navigate}
            currentUser={currentUser}
            currentPlant={activePlant}
            onSelectPlant={(p) => setSelectedPlantId(p.id)}
            onSelectUser={setCurrentUser}
            machines={machines}
            onOpenQuickNova={() => setIsCommandBarOpen(true)}
          >
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <ErrorBoundary fallbackTitle="Industrial View Rendering Fault">
                {renderCurrentView()}
              </ErrorBoundary>
            </motion.div>
          </AppShell>
        ) : (
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <ErrorBoundary fallbackTitle="Authentication & Onboarding Fault">
              {renderCurrentView()}
            </ErrorBoundary>
          </motion.div>
        )}

        {/* Global Command Bar (⌘K) */}
        <CommandBar onNavigate={navigate} />

        {/* Global Notification Toast Container */}
        <NotificationToast />

        {/* Global Report Dossier Modal */}
        <ReportDossierModal
          report={viewingReport}
          onClose={() => setViewingReport(null)}
          onDownload={() => {
            const blob = new Blob([JSON.stringify(viewingReport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${viewingReport?.reportNumber || 'report'}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          onShare={() => {
            navigator.clipboard?.writeText(window.location.href);
          }}
        />

        {/* Global Generate Report Workflow Modal */}
        <GenerateReportModal
          isOpen={isGenerateReportOpen}
          onClose={() => setIsGenerateReportOpen(false)}
          onReportGenerated={(rpt) => {
            setViewingReport(rpt);
            navigate('/reports');
          }}
        />

        {/* Global One-Click AI Investigation Demo Controller */}
        <InvestigationDemoController
          isActive={isDemoActive}
          onClose={() => setIsDemoActive(false)}
          onNavigate={navigate}
          onSelectMachine={(machineId) => {
            setSelectedMachineId(machineId);
            const target = machines.find(m => m.id.toLowerCase() === machineId.toLowerCase()) || machines[0];
            setSelectedMachineForContext(target);
          }}
        />

        {/* Persistent Floating NOVA Copilot on all authenticated screens */}
        {isAuthRoute && currentRoute !== '/nova' && (
          <NovaCopilotFloating
            currentRoute={currentRoute}
            machines={machines}
            onNavigateToNova={() => navigate('/nova')}
          />
        )}

        {/* Floating Quick NOVA Drawer / Modal */}
        {isQuickNovaOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-xl h-full bg-[#0d1016] border-l border-white/[0.1] shadow-2xl flex flex-col">
              <div className="h-14 px-4 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white text-sm">Quick NOVA Diagnostic Overlay</span>
                  <span className="text-[10px] font-mono-tech text-zinc-400">[ESC to close]</span>
                </div>
                <button
                  onClick={() => setIsQuickNovaOpen(false)}
                  className="p-1.5 rounded-lg bg-white/[0.05] text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <NovaView
                  machines={machines}
                  initialMachineContext={selectedMachineForContext || selectedMachine || machines[0]}
                  onNavigate={navigate}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </NovaCopilotProvider>
  );
}

export default function App() {
  return (
    <IndustrialAppProvider>
      <AppContent />
    </IndustrialAppProvider>
  );
}
