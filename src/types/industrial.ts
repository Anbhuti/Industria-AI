export type AppRoute = 
  | '/' 
  | '/login' 
  | '/dashboard' 
  | '/nova' 
  | '/monitoring' 
  | '/machines' 
  | '/investigations' 
  | '/intelligence' 
  | '/reports' 
  | '/technology';

export type MachineStatus = 'nominal' | 'warning' | 'critical' | 'maintenance';
export type MachineRisk = 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentSeverity = 'critical' | 'warning' | 'moderate' | 'advisory';
export type IncidentStatus = 'active' | 'investigating' | 'mitigated' | 'resolved' | 'closed';
export type InvestigationStatus = 'in_progress' | 'root_cause_found' | 'action_pending' | 'resolved';

// ==========================================
// 1. USER & WORKSPACE MODEL
// ==========================================
export interface WorkspaceModel {
  id: string;
  userId: string;
  name: string;
  description?: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface UserModel {
  id?: string;
  name: string;
  email: string;
  title: string;
  role: 'Chief Reliability Engineer' | 'Plant Operations Director' | 'Vibration Specialist' | 'Field Maintenance Lead' | 'Plant Manager' | 'Data Analyst' | 'Viewer' | string;
  clearance: string;
  badgeId: string;
  avatar: string;
  plant?: string;
  plantId?: string;
  plantName?: string;
  shift?: string;
  permissions?: string[];
  sessionToken?: string;
  lastLoginAt?: string;
  workspaceId?: string;
}
export type UserProfile = UserModel;

// ==========================================
// 2. PLANT MODEL
// ==========================================
export interface PlantModel {
  id: string;
  code?: string;
  name: string;
  location: string;
  country?: string;
  industry?: string;
  description?: string;
  productionLinesCount?: number;
  plantManager?: string;
  operationalStatus?: 'optimal' | 'alert' | 'maintenance' | 'commissioning';
  unitsCount: number;
  activeLoadMW: number;
  targetLoadMW?: number;
  overallOEE: number;
  status: 'optimal' | 'alert' | 'maintenance';
  areas?: string[];
  telemetryStreamStatus?: 'ONLINE (10 kHz)' | 'SYNCHRONIZED' | 'STANDBY' | string;
  ambientTempC?: number;
  lastSyncTimestamp?: string;
  workspaceId?: string;
}
export type IndustrialPlant = PlantModel;

// ==========================================
// 3. MACHINE MODEL & CONFIGURATION
// ==========================================
export interface MachineThresholds {
  tempWarning: number;     // °C
  tempCritical: number;    // °C
  vibWarning: number;      // mm/s
  vibCritical: number;     // mm/s
  pressWarning: number;    // bar or PSI
  pressCritical: number;   // bar or PSI
  rpmLimit: number;        // RPM
  energyThreshold: number; // kWh or kW
}

export interface MachineNote {
  id: string;
  machineId: string;
  userId: string;
  userName: string;
  note: string;
  timestamp: string;
}

export interface MachineComponent {
  name: string;
  health: number;
  status: MachineStatus;
  detail: string;
}

export interface TelemetryMetrics {
  vibrationRMS: number;      // mm/s
  bearingTemp: number;       // °C
  suctionPressure: number;   // bar
  dischargePressure: number; // bar
  rotorRPM: number;
  lubeOilNAS: number;        // ISO 4406 / NAS 1638 class
  acousticDB?: number;       // dB ultrasonic
  motorCurrent?: number;     // Amps
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'Preventive Overhaul' | 'Corrective Inspection' | 'Vibration Alignment' | 'Lubrication Service' | 'Emergency Repair';
  description: string;
  technician: string;
  hoursSpent: number;
  partsReplaced?: string[];
  status: 'Completed' | 'Scheduled' | 'In Progress';
}

export interface MachineTrendPoint {
  timestamp: string;
  temperature: number;      // °C
  vibration: number;        // mm/s
  pressure: number;         // bar
  energyKW: number;         // kW
  operatingLoadPct: number; // %
}

export interface MachineModel {
  id: string;
  plantId?: string;
  workspaceId?: string;
  name: string;
  type: string;
  tag: string;
  productionLine?: string;
  plantArea: string;
  location?: string;
  manufacturer?: string;
  installationDate?: string;
  maintenanceInterval?: string;
  risk?: MachineRisk;
  criticality: 'Tier 1 Critical' | 'Tier 2 Essential' | 'Tier 3 Balance';
  healthScore: number;
  status: MachineStatus;
  metrics: TelemetryMetrics;
  customThresholds?: MachineThresholds;
  notes?: MachineNote[];
  isArchived?: boolean;
  rulDays: number;           // Remaining Useful Life
  mtbfHours: number;
  runtimeHours?: number;     // Operating runtime
  lastOverhaul: string;
  nextScheduledService: string;
  alarm: string | null;
  components: MachineComponent[];
  oem: string;
  model: string;
  operatingLoadPct?: number;
  energyKW?: number;
  novaInsight?: string;
  maintenanceHistory?: MaintenanceRecord[];
  trends?: MachineTrendPoint[];
}
export type IndustrialMachine = MachineModel;

// ==========================================
// 4. SENSOR MODEL
// ==========================================
export interface SensorModel {
  id: string;
  machineId?: string;
  tag: string;
  name: string;
  type: 'Vibration' | 'Temperature' | 'Pressure' | 'Acoustic' | 'Flow' | 'Current' | 'Level';
  unit: string;
  currentValue: number;
  baseline: number;
  warningThreshold: number;
  criticalThreshold: number;
  status: MachineStatus;
  samplingRate?: string; // e.g. "10 kHz", "100 Hz"
  protocol?: 'OPC-UA' | 'MQTT' | 'Modbus TCP' | 'EtherNet/IP' | 'WirelessHART' | string;
  locationOnMachine?: string;
  history: number[];
}
export type SensorChannel = SensorModel;

// ==========================================
// 5. INCIDENT MODEL
// ==========================================
export interface IncidentModel {
  id: string;
  plantId?: string;
  machineId: string;
  machineName: string;
  machineTag: string;
  code: string; // e.g., "INC-7041"
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  timestamp: string;
  shift?: string;
  deviationMetric: string; // e.g. "+28.0% Vibration Velocity"
  summary: string;
  assignedTo?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  investigationId?: string;
}
export type IndustrialIncident = IncidentModel;

// ==========================================
// 6. INVESTIGATION MODEL
// ==========================================
export interface CapaActionItem {
  id: string;
  action: string;
  owner: string;
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface HypothesisItem {
  id: string;
  title: string;
  probability: number;
  status: 'confirmed' | 'disproven' | 'investigating';
  evidence: string;
}

export interface SensorEvidenceItem {
  parameter: string;
  value: string;
  baseline: string;
  deviation: string;
  severity: string;
}

export interface InvestigationNote {
  id: string;
  investigationId: string;
  userId: string;
  userName: string;
  note: string;
  timestamp: string;
}

export interface InvestigationModel {
  id: string;
  incidentId?: string;
  userId?: string;
  workspaceId?: string;
  plantId?: string;
  title?: string;
  assetId: string;
  assetName: string;
  tag: string;
  severity: 'critical' | 'warning' | 'moderate';
  status: InvestigationStatus | 'draft' | 'in_progress' | 'under_review' | 'resolved' | 'archived';
  currentStep?: number; // 1 to 7
  stepsCompleted?: boolean[]; // 7 booleans
  timestamp: string;
  updatedAt?: string;
  shift?: string;
  summary: string;
  fiveWhys: string[];
  rootCauseDirect: string;
  rootCauseRoot: string;
  confidence: number;
  hypotheses?: HypothesisItem[];
  sensorEvidence?: SensorEvidenceItem[];
  capaActions: CapaActionItem[];
  operatorNotes?: string;
  notes?: InvestigationNote[];
}
export type IncidentInvestigation = InvestigationModel;

// ==========================================
// 7. RECOMMENDATION MODEL
// ==========================================
export interface RecommendationModel {
  id: string;
  machineId: string;
  machineName: string;
  machineTag: string;
  title: string;
  priority: 'P1 Critical' | 'P2 High' | 'P3 Medium' | 'P4 Advisory';
  category: 'Operational Throttling' | 'Lubrication Mitigation' | 'Component Replacement' | 'PID Loop Restructure';
  rationale: string;
  impact: {
    uptimeGainDays: number;
    costSavingsUSD: number;
    loadAdjustmentPct?: number;
  };
  safeOperatingLimit: string;
  status: 'Active' | 'Applied' | 'Dismissed';
  appliedAt?: string;
  appliedBy?: string;
}
export type IndustrialRecommendation = RecommendationModel;

// ==========================================
// 8. REPORT MODEL & VERSIONING
// ==========================================
export type ReportType = 
  | 'incident-investigation'
  | 'machine-health'
  | 'maintenance-summary'
  | 'plant-performance'
  | 'energy-analysis'
  | 'executive-operations';

export interface ReportVersionItem {
  versionNumber: number;
  date: string;
  author: string;
  summary: string;
  changes?: string;
}

export interface ReportSectionData {
  incidentSummary?: string;
  timeline?: { time: string; event: string; severity: 'info' | 'warning' | 'critical' }[];
  sensorEvidence?: SensorEvidenceItem[];
  detectedCorrelations?: { pair: string; coefficient: number; interpretation: string }[];
  potentialCauses?: { rank: number; cause: string; probability: number; notes: string }[];
  aiAnalysis?: string;
  recommendedActions?: { priority: string; action: string; owner: string; deadline: string }[];
  maintenanceNotes?: string;
  investigationConclusion?: string;
}

export interface ReportModel {
  id: string;
  reportNumber: string;
  name: string;
  type: ReportType;
  typeLabel: string;
  plantId: string;
  workspaceId?: string;
  machineId?: string;
  machineOrPlant: string;
  createdDate: string;
  updatedDate?: string;
  version?: number;
  versions?: ReportVersionItem[];
  isArchived?: boolean;
  status: 'Final / Approved' | 'Generated' | 'Under Review' | 'Archived';
  generatedBy: string;
  summary: string;
  standardsCompliance: string[];
  sections: ReportSectionData;
}
export type IndustrialReportItem = ReportModel;

// ==========================================
// 9. SAVED VIEWS & DASHBOARD PERSONALIZATION
// ==========================================
export interface SavedViewFilter {
  risk?: string;
  plantId?: string;
  productionLine?: string;
  status?: string;
  area?: string;
  search?: string;
}

export interface SavedView {
  id: string;
  userId: string;
  workspaceId?: string;
  name: string;
  filters: SavedViewFilter;
  createdAt: string;
}

export interface DashboardConfig {
  id?: string;
  userId: string;
  workspaceId?: string;
  visibleKpis: string[]; // e.g. ['health', 'efficiency', 'availability', 'anomalies', 'incidents', 'energy']
  preferredMetrics: string[];
  defaultTimeRange: '1h' | '8h' | '24h' | '7d';
  defaultPlantId: string;
  widgetOrder?: string[];
}

export interface AlertPreference {
  id?: string;
  userId: string;
  temperature: boolean;
  vibration: boolean;
  pressure: boolean;
  rpm: boolean;
  energy: boolean;
  maintenance: boolean;
  critical: boolean;
  minSeverity: 'warning' | 'critical';
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  userName?: string;
  action: string;
  date: string;
  relatedObjectType: 'plant' | 'machine' | 'threshold' | 'investigation' | 'report' | 'dashboard' | 'auth';
  relatedObjectId: string;
  details?: string;
}

export interface NovaInteractionItem {
  id: string;
  userId: string;
  plantId?: string;
  machineId?: string;
  question: string;
  response: string;
  relatedInvestigationId?: string;
  timestamp: string;
}

// ==========================================
// CHAT & NOTIFICATION TYPES
// ==========================================
export interface NovaChatMessage {
  id: string;
  sender: 'user' | 'nova';
  text: string;
  timestamp: string;
  metadata?: {
    model?: string;
    confidence?: number;
    toolsUsed?: string[];
    dataSources?: any;
    source?: string;
    statusNotice?: string;
    recommendedActions?: string[];
    workOrderId?: string;
  };
}

export interface AppNotification {
  id: string;
  userId?: string;
  type: 'success' | 'warning' | 'critical' | 'info';
  severity?: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  description?: string;
  timestamp: string;
  autoCloseMs?: number;
  relatedMachineId?: string;
  relatedIncidentId?: string;
  isRead?: boolean;
}
export type NotificationItem = AppNotification;
