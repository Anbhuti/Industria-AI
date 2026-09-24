import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  UserModel, 
  PlantModel, 
  MachineModel, 
  SensorModel, 
  IncidentModel, 
  InvestigationModel, 
  RecommendationModel, 
  ReportModel, 
  TelemetryMetrics,
  MachineTrendPoint,
  MachineStatus,
  IncidentStatus,
  AppNotification,
  AppRoute,
  MachineThresholds,
  MachineNote,
  InvestigationNote,
  ReportVersionItem,
  SavedView,
  DashboardConfig,
  AlertPreference,
  ActivityLogItem,
  WorkspaceModel
} from '../types/industrial';

import { industrialApi, MachineFilterParams } from '../services/api/industrialApiAdapter';
import { DEMO_USERS } from '../data/industrialData';

export interface IndustrialAppContextType {
  // Workspace
  workspace: WorkspaceModel | null;
  setWorkspace: (ws: WorkspaceModel | null) => void;

  // Authentication & Session
  currentUser: UserModel;
  setCurrentUser: (user: UserModel) => void;
  isAuthenticated: boolean;
  login: (emailOrBadge: string) => boolean;
  loginWithCredentials: (email: string, password?: string) => Promise<boolean>;
  signUp: (name: string, email: string, password?: string, role?: string, title?: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (badgeId: string) => void;

  // Plants (CRUD)
  plants: PlantModel[];
  selectedPlantId: string;
  selectedPlant: PlantModel | null;
  setSelectedPlantId: (plantId: string) => void;
  createPlant: (data: Partial<PlantModel>) => Promise<PlantModel>;
  updatePlant: (plantId: string, updates: Partial<PlantModel>) => Promise<PlantModel>;
  deletePlant: (plantId: string) => Promise<boolean>;

  // Machines & Fleet (CRUD + Notes + Thresholds)
  machines: MachineModel[];
  filteredMachines: MachineModel[];
  selectedMachineId: string;
  selectedMachine: MachineModel | null;
  setSelectedMachineId: (machineId: string) => void;
  createMachine: (data: Partial<MachineModel>) => Promise<MachineModel>;
  updateMachine: (machineId: string, updates: Partial<MachineModel>) => Promise<MachineModel>;
  archiveMachine: (machineId: string) => Promise<MachineModel>;
  updateMachineThresholds: (machineId: string, thresholds: MachineThresholds) => Promise<void>;
  addMachineNote: (machineId: string, noteText: string) => Promise<void>;
  deleteMachineNote: (machineId: string, noteId: string) => Promise<void>;
  liveTelemetry: TelemetryMetrics | null;
  telemetryTrends: MachineTrendPoint[];
  timeRange: '1h' | '8h' | '24h' | '7d';
  setTimeRange: (range: '1h' | '8h' | '24h' | '7d') => void;

  // Sensors
  sensors: SensorModel[];

  // Incidents
  incidents: IncidentModel[];
  filteredIncidents: IncidentModel[];
  selectedIncidentId: string;
  selectedIncident: IncidentModel | null;
  setSelectedIncidentId: (incidentId: string) => void;
  acknowledgeIncident: (incidentId: string) => Promise<void>;
  resolveIncident: (incidentId: string, notes: string) => Promise<void>;
  activeIncidentCount: number;

  // Investigation Workflow (Persistent 7-Step State + Notes)
  activeInvestigation: InvestigationModel | null;
  currentStep: number;
  setInvestigationStep: (step: number) => void;
  advanceInvestigationStep: () => void;
  toggleStepCompleted: (stepIndex: number, completed?: boolean) => void;
  toggleCapaAction: (actionId: string, status: 'Pending' | 'In Progress' | 'Completed') => void;
  updateOperatorNotes: (notes: string) => void;
  addInvestigationNote: (investigationId: string, noteText: string) => Promise<void>;
  saveInvestigationState: (updates: Partial<InvestigationModel>) => Promise<void>;

  // AI Prescriptive Recommendations
  recommendations: RecommendationModel[];
  applyRecommendation: (recommendationId: string) => Promise<void>;

  // Reports & Versions
  reports: ReportModel[];
  generateReport: (payload: Partial<ReportModel>) => Promise<ReportModel>;
  createReportVersion: (reportId: string, summary: string) => Promise<void>;
  viewingReport: ReportModel | null;
  setViewingReport: (report: ReportModel | null) => void;

  // Saved Views
  savedViews: SavedView[];
  createSavedView: (name: string, filters: any) => Promise<void>;
  deleteSavedView: (id: string) => Promise<void>;
  applySavedView: (view: SavedView) => void;

  // Dashboard Personalization
  dashboardConfig: DashboardConfig | null;
  updateDashboardConfig: (config: Partial<DashboardConfig>) => Promise<void>;

  // Alert Preferences
  alertPreferences: AlertPreference | null;
  updateAlertPreferences: (prefs: Partial<AlertPreference>) => Promise<void>;

  // Activity Logs
  activityLogs: ActivityLogItem[];
  refreshActivityLogs: () => Promise<void>;

  // Import / Export
  importCsvData: (plantId: string, rows: any[]) => Promise<{ count: number }>;
  exportUserData: () => Promise<any>;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: MachineStatus | 'all';
  setStatusFilter: (status: MachineStatus | 'all') => void;
  areaFilter: string;
  setAreaFilter: (area: string) => void;
  resetFilters: () => void;

  // Command Bar
  isCommandBarOpen: boolean;
  setIsCommandBarOpen: (open: boolean) => void;
  toggleCommandBar: () => void;

  // Toast Notifications
  notifications: AppNotification[];
  addNotification: (type: AppNotification['type'], title: string, message: string, autoCloseMs?: number) => void;
  dismissNotification: (id: string) => void;

  // Loading & Diagnostics
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  telemetryProtocol: string;
}

const IndustrialAppContext = createContext<IndustrialAppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'industrix_session_user';
const LOCAL_STORAGE_KEY_PLANT = 'industrix_active_plant';
const LOCAL_STORAGE_KEY_MACHINE = 'industrix_active_machine';
const LOCAL_STORAGE_KEY_TOKEN = 'industrix_auth_token';
const LOCAL_STORAGE_KEY_WORKSPACE = 'industrix_workspace_id';

export const IndustrialAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Session & Auth State
  const [currentUser, setCurrentUserState] = useState<UserModel>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      ...DEMO_USERS[0],
      id: 'usr-001',
      plantId: 'lucknow-mf',
      plantName: 'Lucknow Manufacturing Facility',
      shift: 'Shift Alpha (00:00 - 08:00)',
      permissions: ['ALL_ACCESS', 'ALARM_ACK', 'RCA_EXECUTE', 'CAPA_APPROVE', 'REPORT_EXPORT'],
      sessionToken: 'sess-industrix-2026-auth',
      lastLoginAt: new Date().toISOString()
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [workspace, setWorkspace] = useState<WorkspaceModel | null>(null);

  // 2. Plants State
  const [plants, setPlants] = useState<PlantModel[]>([]);
  const [selectedPlantId, setSelectedPlantIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_PLANT) || 'lucknow-mf';
    } catch {
      return 'lucknow-mf';
    }
  });

  // 3. Machines State
  const [machines, setMachines] = useState<MachineModel[]>([]);
  const [selectedMachineId, setSelectedMachineIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_MACHINE) || 'C-204';
    } catch {
      return 'C-204';
    }
  });
  const [liveTelemetry, setLiveTelemetry] = useState<TelemetryMetrics | null>(null);
  const [telemetryTrends, setTelemetryTrends] = useState<MachineTrendPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'1h' | '8h' | '24h' | '7d'>('24h');

  // 4. Sensors State
  const [sensors, setSensors] = useState<SensorModel[]>([]);

  // 5. Incidents State
  const [incidents, setIncidents] = useState<IncidentModel[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-7041');

  // 6. Investigation State
  const [activeInvestigation, setActiveInvestigation] = useState<InvestigationModel | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(4);

  // 7. Recommendations State
  const [recommendations, setRecommendations] = useState<RecommendationModel[]>([]);

  // 8. Reports State
  const [reports, setReports] = useState<ReportModel[]>([]);
  const [viewingReport, setViewingReport] = useState<ReportModel | null>(null);

  // 9. Personalization: Saved Views, Dashboard Config, Alerts, Activity
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null);
  const [alertPreferences, setAlertPreferences] = useState<AlertPreference | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<MachineStatus | 'all'>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  // Command Bar & UI Overlays
  const [isCommandBarOpen, setIsCommandBarOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'init-1',
      type: 'warning',
      title: 'Active Excursion on C-204',
      message: 'Drive-end radial vibration is +28% above ISO 10816 limit (5.76 mm/s RMS). Simulated edge data streaming.',
      timestamp: 'Just now',
      autoCloseMs: 8000
    }
  ]);

  // Loading & Diagnostics
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const telemetryProtocol = 'OPC-UA / MQTT (SIMULATED 10 kHz)';

  // ==========================================
  // NOTIFICATIONS HELPER
  // ==========================================
  const addNotification = useCallback((
    type: AppNotification['type'], 
    title: string, 
    message: string, 
    autoCloseMs = 5000
  ) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setNotifications(prev => [{ id, type, title, message, timestamp: 'Just now', autoCloseMs }, ...prev]);

    if (autoCloseMs > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, autoCloseMs);
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // ==========================================
  // INITIAL DATA FETCHING VIA API ADAPTER
  // ==========================================
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        fetchedWorkspace,
        fetchedPlants, 
        fetchedMachines, 
        fetchedIncidents, 
        fetchedRecs, 
        fetchedReports,
        fetchedViews,
        fetchedDash,
        fetchedAlerts,
        fetchedLogs
      ] = await Promise.all([
        industrialApi.getWorkspace(),
        industrialApi.getPlants(),
        industrialApi.getMachines(),
        industrialApi.getIncidents(),
        industrialApi.getRecommendations(),
        industrialApi.getReports(),
        industrialApi.getSavedViews(),
        industrialApi.getDashboardConfig(),
        industrialApi.getAlertPreferences(),
        industrialApi.getActivityLogs()
      ]);

      if (fetchedWorkspace) setWorkspace(fetchedWorkspace);
      setPlants(fetchedPlants);
      setMachines(fetchedMachines);
      setIncidents(fetchedIncidents);
      setRecommendations(fetchedRecs);
      setReports(fetchedReports);
      setSavedViews(fetchedViews);
      setDashboardConfig(fetchedDash);
      setAlertPreferences(fetchedAlerts);
      setActivityLogs(fetchedLogs);

      // Load initial investigation for active machine/incident
      const inv = await industrialApi.getInvestigation(selectedMachineId);
      if (inv) {
        setActiveInvestigation(inv);
        setCurrentStep(inv.currentStep || 4);
      }

      // Load initial sensors
      const machSensors = await industrialApi.getSensors(selectedMachineId);
      setSensors(machSensors);

      // Load trend points
      const trends = await industrialApi.getTelemetryHistory(selectedMachineId, timeRange);
      setTelemetryTrends(trends);

    } catch (err: any) {
      setError(err?.message || 'Failed to initialize industrial telemetry stream');
      addNotification('critical', 'Telemetry Link Failure', 'Could not establish connection to edge SCADA adapter.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMachineId, timeRange, addNotification]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ==========================================
  // PLANT SWITCHING & CRUD
  // ==========================================
  const setSelectedPlantId = useCallback((plantId: string) => {
    setSelectedPlantIdState(plantId);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PLANT, plantId);
    } catch {}

    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      addNotification('info', `Switched Facility`, `Now viewing ${plant.name} telemetry stream.`);
      
      const plantMachines = machines.filter(m => m.plantId === plantId);
      if (plantMachines.length > 0 && !plantMachines.some(m => m.id === selectedMachineId)) {
        setSelectedMachineIdState(plantMachines[0].id);
      }
    }
  }, [plants, machines, selectedMachineId, addNotification]);

  const createPlant = useCallback(async (data: Partial<PlantModel>): Promise<PlantModel> => {
    const saved = await industrialApi.createPlant(data);
    setPlants(prev => [saved, ...prev]);
    addNotification('success', 'Facility Created', `${saved.name} added to your industrial workspace.`);
    return saved;
  }, [addNotification]);

  const updatePlant = useCallback(async (plantId: string, updates: Partial<PlantModel>): Promise<PlantModel> => {
    const saved = await industrialApi.updatePlant(plantId, updates);
    setPlants(prev => prev.map(p => p.id === plantId ? saved : p));
    addNotification('success', 'Facility Updated', `${saved.name} configuration saved.`);
    return saved;
  }, [addNotification]);

  const deletePlant = useCallback(async (plantId: string): Promise<boolean> => {
    const ok = await industrialApi.deletePlant(plantId);
    if (ok) {
      setPlants(prev => prev.filter(p => p.id !== plantId));
      addNotification('info', 'Facility Removed', `Plant ${plantId} decommissioned.`);
    }
    return ok;
  }, [addNotification]);

  // ==========================================
  // MACHINE SWITCHING, LIVE TELEMETRY & FLEET CRUD
  // ==========================================
  const setSelectedMachineId = useCallback((machineId: string) => {
    setSelectedMachineIdState(machineId);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_MACHINE, machineId);
    } catch {}

    industrialApi.getSensors(machineId).then(setSensors);
    industrialApi.getTelemetryHistory(machineId, timeRange).then(setTelemetryTrends);
    industrialApi.getInvestigation(machineId).then(inv => {
      if (inv) {
        setActiveInvestigation(inv);
        setCurrentStep(inv.currentStep || 1);
      }
    });

    const m = machines.find(item => item.id === machineId);
    if (m) {
      setLiveTelemetry(m.metrics);
    }
  }, [machines, timeRange]);

  const createMachine = useCallback(async (data: Partial<MachineModel>): Promise<MachineModel> => {
    const saved = await industrialApi.createMachine({ ...data, plantId: data.plantId || selectedPlantId });
    setMachines(prev => [saved, ...prev]);
    addNotification('success', 'Asset Commissioned', `${saved.name} (${saved.tag}) registered in fleet.`);
    return saved;
  }, [selectedPlantId, addNotification]);

  const updateMachine = useCallback(async (machineId: string, updates: Partial<MachineModel>): Promise<MachineModel> => {
    const saved = await industrialApi.updateMachine(machineId, updates);
    setMachines(prev => prev.map(m => m.id === machineId ? saved : m));
    if (selectedMachineId === machineId) {
      setLiveTelemetry(saved.metrics);
    }
    addNotification('success', 'Asset Updated', `${saved.name} parameters saved.`);
    return saved;
  }, [selectedMachineId, addNotification]);

  const archiveMachine = useCallback(async (machineId: string): Promise<MachineModel> => {
    const saved = await industrialApi.archiveMachine(machineId);
    setMachines(prev => prev.map(m => m.id === machineId ? saved : m));
    addNotification('info', 'Asset Archived', `${saved.name} decommissioned to archive state.`);
    return saved;
  }, [addNotification]);

  const updateMachineThresholds = useCallback(async (machineId: string, thresholds: MachineThresholds) => {
    const updated = await industrialApi.updateMachineThresholds(machineId, thresholds);
    setMachines(prev => prev.map(m => m.id === machineId ? updated : m));
    addNotification('success', 'Thresholds Updated', `Custom operational limits applied to ${updated.tag}.`);
  }, [addNotification]);

  const addMachineNote = useCallback(async (machineId: string, noteText: string) => {
    const newNote = await industrialApi.addMachineNote(machineId, noteText, currentUser.id, currentUser.name);
    setMachines(prev => prev.map(m => {
      if (m.id === machineId) {
        return { ...m, notes: [newNote, ...(m.notes || [])] };
      }
      return m;
    }));
    addNotification('success', 'Note Logged', 'Operator journal entry recorded.');
  }, [currentUser, addNotification]);

  const deleteMachineNote = useCallback(async (machineId: string, noteId: string) => {
    await industrialApi.deleteMachineNote(machineId, noteId);
    setMachines(prev => prev.map(m => {
      if (m.id === machineId && m.notes) {
        return { ...m, notes: m.notes.filter(n => n.id !== noteId) };
      }
      return m;
    }));
  }, []);

  // Subscribe to live simulated OPC-UA/MQTT ticks
  useEffect(() => {
    if (!selectedMachineId) return;
    const unsub = industrialApi.subscribeLiveTelemetry(selectedMachineId, (metrics) => {
      setLiveTelemetry(metrics);
    });
    return unsub;
  }, [selectedMachineId]);

  // Update telemetry trends when timeRange changes
  useEffect(() => {
    if (!selectedMachineId) return;
    industrialApi.getTelemetryHistory(selectedMachineId, timeRange).then(setTelemetryTrends);
  }, [selectedMachineId, timeRange]);

  // ==========================================
  // AUTH & SESSION METHODS
  // ==========================================
  const setCurrentUser = useCallback((user: UserModel) => {
    setCurrentUserState(user);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    } catch {}
  }, []);

  const loginWithCredentials = useCallback(async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'Industrial2026!' })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, data.token);
        localStorage.setItem(LOCAL_STORAGE_KEY_WORKSPACE, data.workspace.id);
        setWorkspace(data.workspace);

        const loggedUser: UserModel = {
          ...DEMO_USERS[0],
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          badgeId: data.user.badgeId || 'ID-7041',
          title: data.user.title || 'Lead Reliability Engineer',
          role: (data.user.role as any) || 'reliability-lead',
          clearance: data.user.clearance || 'Level 4 / Plant Lead Engineer',
          plantId: selectedPlantId,
          plantName: plants.find(p => p.id === selectedPlantId)?.name || 'Lucknow Manufacturing Facility',
          shift: 'Shift Alpha (00:00 - 08:00)',
          permissions: ['ALL_ACCESS', 'ALARM_ACK', 'RCA_EXECUTE', 'CAPA_APPROVE', 'REPORT_EXPORT'],
          sessionToken: data.token,
          lastLoginAt: new Date().toISOString()
        };

        setCurrentUser(loggedUser);
        setIsAuthenticated(true);
        addNotification('success', 'Secure Handshake Established', `Welcome back, ${loggedUser.name}. Connected to workspace "${data.workspace.name}".`);
        await refreshData();
        return true;
      }
    } catch {}

    return login(email);
  }, [selectedPlantId, plants, setCurrentUser, addNotification, refreshData]);

  const signUp = useCallback(async (
    name: string, 
    email: string, 
    password?: string, 
    role?: string, 
    title?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password || 'Industrial2026!', role: role || 'reliability-lead', title })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, data.token);
        localStorage.setItem(LOCAL_STORAGE_KEY_WORKSPACE, data.workspace.id);
        setWorkspace(data.workspace);

        const newUser: UserModel = {
          ...DEMO_USERS[0],
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          badgeId: data.user.badgeId || 'ID-9901',
          title: data.user.title || title || 'Lead Reliability Engineer',
          role: (data.user.role as any) || 'reliability-lead',
          clearance: 'Level 4 / Plant Lead Engineer',
          plantId: selectedPlantId,
          plantName: plants.find(p => p.id === selectedPlantId)?.name || 'Lucknow Manufacturing Facility',
          shift: 'Shift Alpha (00:00 - 08:00)',
          permissions: ['ALL_ACCESS', 'ALARM_ACK', 'RCA_EXECUTE', 'CAPA_APPROVE', 'REPORT_EXPORT'],
          sessionToken: data.token,
          lastLoginAt: new Date().toISOString()
        };

        setCurrentUser(newUser);
        setIsAuthenticated(true);
        addNotification('success', 'Industrial Workspace Provisioned', `Welcome ${newUser.name}. Your dedicated SCADA workspace is ready.`);
        await refreshData();
        return true;
      }
    } catch {}
    return false;
  }, [selectedPlantId, plants, setCurrentUser, addNotification, refreshData]);

  const login = useCallback((emailOrBadge: string): boolean => {
    const matched = DEMO_USERS.find(u => 
      u.email?.toLowerCase() === emailOrBadge.toLowerCase() || 
      u.badgeId.toLowerCase() === emailOrBadge.toLowerCase() ||
      u.name.toLowerCase().includes(emailOrBadge.toLowerCase())
    ) || DEMO_USERS[0];

    const loggedUser: UserModel = {
      ...matched,
      id: `usr-${matched.badgeId}`,
      plantId: selectedPlantId,
      plantName: plants.find(p => p.id === selectedPlantId)?.name || 'Lucknow Manufacturing Facility',
      shift: 'Shift Alpha (00:00 - 08:00)',
      permissions: ['ALL_ACCESS', 'ALARM_ACK', 'RCA_EXECUTE', 'CAPA_APPROVE', 'REPORT_EXPORT'],
      sessionToken: `token-${Date.now()}`,
      lastLoginAt: new Date().toISOString()
    };

    localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, matched.email || 'anubhutipal1002@gmail.com');
    setCurrentUser(loggedUser);
    setIsAuthenticated(true);
    addNotification('success', 'Authenticated', `Welcome back, ${loggedUser.name} (${loggedUser.badgeId}). Session initialized.`);
    return true;
  }, [selectedPlantId, plants, setCurrentUser, addNotification]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
      localStorage.removeItem(LOCAL_STORAGE_KEY_TOKEN);
    } catch {}
    addNotification('info', 'Signed Out', 'Your session has been securely closed.');
  }, [addNotification]);

  const switchUser = useCallback((badgeId: string) => {
    login(badgeId);
  }, [login]);

  // ==========================================
  // INCIDENT ACTIONS
  // ==========================================
  const acknowledgeIncident = useCallback(async (incidentId: string) => {
    try {
      const updated = await industrialApi.acknowledgeIncident(incidentId, currentUser.name);
      setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i));
      addNotification(
        'success', 
        `Alarm Acknowledged // ${updated.code}`, 
        `Logged by ${currentUser.name}. Status updated to "${updated.status.toUpperCase()}".`
      );
    } catch (err: any) {
      addNotification('critical', 'Error', err?.message || 'Could not acknowledge incident');
    }
  }, [currentUser, addNotification]);

  const resolveIncident = useCallback(async (incidentId: string, notes: string) => {
    try {
      const updated = await industrialApi.resolveIncident(incidentId, notes);
      setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i));
      addNotification('success', `Incident Resolved`, `${updated.code} closed and marked in permanent compliance audit log.`);
    } catch (err: any) {
      addNotification('critical', 'Error', err?.message || 'Failed to resolve incident');
    }
  }, [addNotification]);

  // ==========================================
  // INVESTIGATION WORKFLOW ACTIONS & AUTO-SAVE
  // ==========================================
  const setInvestigationStep = useCallback((step: number) => {
    setCurrentStep(step);
    if (activeInvestigation) {
      const updated = {
        ...activeInvestigation,
        currentStep: step
      };
      setActiveInvestigation(updated);
      industrialApi.updateInvestigation(updated);
    }
  }, [activeInvestigation]);

  const advanceInvestigationStep = useCallback(() => {
    if (currentStep < 7) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (activeInvestigation) {
        const newCompleted = [...(activeInvestigation.stepsCompleted || [false, false, false, false, false, false, false])];
        newCompleted[currentStep - 1] = true;
        const updated: InvestigationModel = {
          ...activeInvestigation,
          currentStep: nextStep,
          stepsCompleted: newCompleted
        };
        setActiveInvestigation(updated);
        industrialApi.updateInvestigation(updated);
        addNotification('info', `Investigation Step ${nextStep}`, `Advanced to Step ${nextStep} of 7 in Root Cause Analysis.`);
      }
    }
  }, [currentStep, activeInvestigation, addNotification]);

  const toggleStepCompleted = useCallback((stepIndex: number, completed?: boolean) => {
    if (!activeInvestigation) return;
    const newCompleted = [...(activeInvestigation.stepsCompleted || [false, false, false, false, false, false, false])];
    newCompleted[stepIndex] = completed !== undefined ? completed : !newCompleted[stepIndex];

    const updated: InvestigationModel = {
      ...activeInvestigation,
      stepsCompleted: newCompleted
    };
    setActiveInvestigation(updated);
    industrialApi.updateInvestigation(updated);
  }, [activeInvestigation]);

  const toggleCapaAction = useCallback((actionId: string, status: 'Pending' | 'In Progress' | 'Completed') => {
    if (!activeInvestigation) return;
    const updatedCapa = activeInvestigation.capaActions.map(a => 
      a.id === actionId ? { ...a, status } : a
    );
    const updated: InvestigationModel = {
      ...activeInvestigation,
      capaActions: updatedCapa
    };
    setActiveInvestigation(updated);
    industrialApi.updateInvestigation(updated);
    addNotification('success', 'CAPA Action Updated', `Action ${actionId} status changed to ${status}.`);
  }, [activeInvestigation, addNotification]);

  const updateOperatorNotes = useCallback((notes: string) => {
    if (!activeInvestigation) return;
    const updated: InvestigationModel = {
      ...activeInvestigation,
      operatorNotes: notes
    };
    setActiveInvestigation(updated);
    industrialApi.updateInvestigation(updated);
  }, [activeInvestigation]);

  const addInvestigationNote = useCallback(async (investigationId: string, noteText: string) => {
    const newNote = await industrialApi.addInvestigationNote(investigationId, noteText, currentUser.id, currentUser.name);
    if (activeInvestigation && activeInvestigation.id === investigationId) {
      setActiveInvestigation(prev => prev ? {
        ...prev,
        notes: [newNote, ...(prev.notes || [])]
      } : null);
    }
    addNotification('success', 'Investigation Note Saved', 'Logged to RCA audit record.');
  }, [currentUser, activeInvestigation, addNotification]);

  const saveInvestigationState = useCallback(async (updates: Partial<InvestigationModel>) => {
    if (!activeInvestigation) return;
    const merged = { ...activeInvestigation, ...updates };
    setActiveInvestigation(merged);
    await industrialApi.updateInvestigation(merged);
  }, [activeInvestigation]);

  // ==========================================
  // RECOMMENDATIONS ACTIONS
  // ==========================================
  const applyRecommendation = useCallback(async (recommendationId: string) => {
    try {
      const { recommendation, updatedMachine } = await industrialApi.applyRecommendation(recommendationId, currentUser.name);
      
      setRecommendations(prev => prev.map(r => r.id === recommendation.id ? recommendation : r));
      
      if (updatedMachine) {
        setMachines(prev => prev.map(m => m.id === updatedMachine.id ? updatedMachine : m));
        setLiveTelemetry(updatedMachine.metrics);
      }

      addNotification(
        'success', 
        `Recommendation Executed`, 
        `${recommendation.title} applied. Gained +${recommendation.impact.uptimeGainDays} days safe RUL, saved $${recommendation.impact.costSavingsUSD.toLocaleString()}.`
      );
    } catch (err: any) {
      addNotification('critical', 'Mitigation Failed', err?.message || 'Could not apply recommendation');
    }
  }, [currentUser, addNotification]);

  // ==========================================
  // REPORTS ACTIONS & VERSIONING
  // ==========================================
  const generateReport = useCallback(async (payload: Partial<ReportModel>): Promise<ReportModel> => {
    try {
      const newReport = await industrialApi.generateReport({
        ...payload,
        plantId: selectedPlantId,
        generatedBy: `${currentUser.name} (${currentUser.title})`
      });

      setReports(prev => [newReport, ...prev]);
      setViewingReport(newReport);
      addNotification('success', 'Report Dossier Generated', `${newReport.reportNumber} compiled according to ISO 14224 & API 670.`);
      return newReport;
    } catch (err: any) {
      addNotification('critical', 'Report Failed', err?.message || 'Could not generate report');
      throw err;
    }
  }, [selectedPlantId, currentUser, addNotification]);

  const createReportVersion = useCallback(async (reportId: string, summary: string) => {
    const updated = await industrialApi.createReportVersion(reportId, summary, currentUser.name);
    setReports(prev => prev.map(r => r.id === reportId ? updated : r));
    if (viewingReport && viewingReport.id === reportId) {
      setViewingReport(updated);
    }
    addNotification('success', 'Report Version Created', `Dossier revised to Version ${updated.version}.`);
  }, [currentUser, viewingReport, addNotification]);

  // ==========================================
  // SAVED VIEWS
  // ==========================================
  const createSavedView = useCallback(async (name: string, filters: any) => {
    const newView = await industrialApi.createSavedView(name, filters);
    setSavedViews(prev => [newView, ...prev]);
    addNotification('success', 'Saved View Created', `Quick preset "${name}" added.`);
  }, [addNotification]);

  const deleteSavedView = useCallback(async (id: string) => {
    await industrialApi.deleteSavedView(id);
    setSavedViews(prev => prev.filter(v => v.id !== id));
    addNotification('info', 'View Removed', 'Custom view removed.');
  }, [addNotification]);

  const applySavedView = useCallback((view: SavedView) => {
    if (view.filters?.status) setStatusFilter(view.filters.status as MachineStatus | 'all');
    if (view.filters?.area) setAreaFilter(view.filters.area);
    if (view.filters?.plantId) setSelectedPlantId(view.filters.plantId);
    if (view.filters?.search) setSearchQuery(view.filters.search);
    addNotification('info', 'View Applied', `Now filtering by preset "${view.name}".`);
  }, [setSelectedPlantId, addNotification]);

  // ==========================================
  // DASHBOARD & ALERT PREFERENCES
  // ==========================================
  const updateDashboardConfig = useCallback(async (config: Partial<DashboardConfig>) => {
    const updated = await industrialApi.updateDashboardConfig(config);
    setDashboardConfig(updated);
    addNotification('success', 'Dashboard Personalized', 'Layout preferences saved permanently.');
  }, [addNotification]);

  const updateAlertPreferences = useCallback(async (prefs: Partial<AlertPreference>) => {
    const updated = await industrialApi.updateAlertPreferences(prefs);
    setAlertPreferences(updated);
    addNotification('success', 'Alert Preferences Saved', 'Alarm routing rules updated.');
  }, [addNotification]);

  const refreshActivityLogs = useCallback(async () => {
    const logs = await industrialApi.getActivityLogs();
    setActivityLogs(logs);
  }, []);

  // ==========================================
  // DATA IMPORT / EXPORT
  // ==========================================
  const importCsvData = useCallback(async (plantId: string, rows: any[]): Promise<{ count: number }> => {
    const result = await industrialApi.importCsvData(plantId, rows);
    setMachines(prev => [...result.machines, ...prev]);
    addNotification('success', 'Data Imported', `Successfully ingested ${result.count} industrial asset records.`);
    return { count: result.count };
  }, [addNotification]);

  const exportUserData = useCallback(async (): Promise<any> => {
    const data = await industrialApi.exportUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `industrix-workspace-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('success', 'Data Export Ready', 'Downloaded full workspace JSON dossier.');
    return data;
  }, [addNotification]);

  // ==========================================
  // FILTERING & SEARCH LOGIC
  // ==========================================
  const filteredMachines = useMemo(() => {
    return machines.filter(m => {
      if (m.isArchived) return false;
      if (selectedPlantId && selectedPlantId !== 'all' && m.plantId !== selectedPlantId) {
        return false;
      }
      if (statusFilter !== 'all' && m.status !== statusFilter) {
        return false;
      }
      if (areaFilter !== 'all' && !m.plantArea.toLowerCase().includes(areaFilter.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchTag = m.tag.toLowerCase().includes(q);
        const matchType = m.type.toLowerCase().includes(q);
        const matchArea = m.plantArea.toLowerCase().includes(q);
        const matchOem = m.oem.toLowerCase().includes(q);
        if (!matchName && !matchTag && !matchType && !matchArea && !matchOem) return false;
      }
      return true;
    });
  }, [machines, selectedPlantId, statusFilter, areaFilter, searchQuery]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(i => {
      if (selectedPlantId && selectedPlantId !== 'all' && i.plantId !== selectedPlantId) {
        return false;
      }
      return true;
    });
  }, [incidents, selectedPlantId]);

  const activeIncidentCount = useMemo(() => {
    return filteredIncidents.filter(i => i.status === 'active' || !i.acknowledged).length;
  }, [filteredIncidents]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setAreaFilter('all');
  }, []);

  const toggleCommandBar = useCallback(() => {
    setIsCommandBarOpen(prev => !prev);
  }, []);

  // Memoized current objects
  const selectedPlant = useMemo(() => {
    return plants.find(p => p.id === selectedPlantId) || plants[0] || null;
  }, [plants, selectedPlantId]);

  const selectedMachine = useMemo(() => {
    return machines.find(m => m.id === selectedMachineId) || machines[0] || null;
  }, [machines, selectedMachineId]);

  const selectedIncident = useMemo(() => {
    return incidents.find(i => i.id === selectedIncidentId) || incidents[0] || null;
  }, [incidents, selectedIncidentId]);

  // Global Keyboard listener for Command Bar (⌘K or '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      } else if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsCommandBarOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <IndustrialAppContext.Provider
      value={{
        workspace,
        setWorkspace,

        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        loginWithCredentials,
        signUp,
        logout,
        switchUser,

        plants,
        selectedPlantId,
        selectedPlant,
        setSelectedPlantId,
        createPlant,
        updatePlant,
        deletePlant,

        machines,
        filteredMachines,
        selectedMachineId,
        selectedMachine,
        setSelectedMachineId,
        createMachine,
        updateMachine,
        archiveMachine,
        updateMachineThresholds,
        addMachineNote,
        deleteMachineNote,
        liveTelemetry,
        telemetryTrends,
        timeRange,
        setTimeRange,

        sensors,

        incidents,
        filteredIncidents,
        selectedIncidentId,
        selectedIncident,
        setSelectedIncidentId,
        acknowledgeIncident,
        resolveIncident,
        activeIncidentCount,

        activeInvestigation,
        currentStep,
        setInvestigationStep,
        advanceInvestigationStep,
        toggleStepCompleted,
        toggleCapaAction,
        updateOperatorNotes,
        addInvestigationNote,
        saveInvestigationState,

        recommendations,
        applyRecommendation,

        reports,
        generateReport,
        createReportVersion,
        viewingReport,
        setViewingReport,

        savedViews,
        createSavedView,
        deleteSavedView,
        applySavedView,

        dashboardConfig,
        updateDashboardConfig,

        alertPreferences,
        updateAlertPreferences,

        activityLogs,
        refreshActivityLogs,

        importCsvData,
        exportUserData,

        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        areaFilter,
        setAreaFilter,
        resetFilters,

        isCommandBarOpen,
        setIsCommandBarOpen,
        toggleCommandBar,

        notifications,
        addNotification,
        dismissNotification,

        isLoading,
        error,
        refreshData,
        telemetryProtocol
      }}
    >
      {children}
    </IndustrialAppContext.Provider>
  );
};

export const useIndustrialApp = (): IndustrialAppContextType => {
  const context = useContext(IndustrialAppContext);
  if (!context) {
    throw new Error('useIndustrialApp must be used within an IndustrialAppProvider');
  }
  return context;
};
