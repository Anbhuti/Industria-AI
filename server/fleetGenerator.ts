/**
 * ============================================================================
 * INDUSTRIX AI // HIGH-FIDELITY SYNTHETIC INDUSTRIAL DATASET & SEED GENERATOR
 * ============================================================================
 * Generates 150+ realistic industrial machinery assets across 5 worldwide facilities,
 * complete with 25 Firestore-compatible data models:
 * - Plants & Production Lines
 * - 150+ Machinery Assets with components, thresholds, RUL, and MTBF
 * - 1,200+ SCADA Sensor Channels (Vibration, RTD Temp, Pressure, RPM, NAS Oil, Acoustic, Stator Current)
 * - Hourly Telemetry Time-Series with diurnal curves & realistic excursion spikes
 * - Machine Health & Risk Scoring Matrices
 * - Anomaly Events & Root-Cause Failure Incidents
 * - Preventative & Corrective Maintenance Work Orders
 * - Prescriptive AI Recommendations & RCA Dossiers
 * - Regulatory Compliance Reports (ISO 55001 / ISO 10816 / API 670)
 * 
 * NOTICE:
 * SIMULATED INDUSTRIAL DATA — For demonstration and reliability operations testing.
 * ============================================================================
 */

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  title: string;
  clearance: string;
  badgeId: string;
  avatar: string;
  workspaceId: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface DbWorkspace {
  id: string;
  userId: string;
  name: string;
  description: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface DbPlant {
  id: string;
  workspaceId: string;
  code: string;
  name: string;
  location: string;
  country: string;
  industry: string;
  description: string;
  productionLinesCount: number;
  plantManager: string;
  operationalStatus: 'optimal' | 'alert' | 'maintenance' | 'commissioning';
  unitsCount: number;
  activeLoadMW: number;
  targetLoadMW: number;
  overallOEE: number;
  status: 'optimal' | 'alert' | 'maintenance';
  areas: string[];
  telemetryStreamStatus: string;
  ambientTempC: number;
  lastSyncTimestamp: string;
}

export interface DbProductionLine {
  id: string;
  workspaceId: string;
  plantId: string;
  name: string;
  lineCode: string;
  description: string;
  status: 'operational' | 'degraded' | 'maintenance';
  throughputUnitsPerHour: number;
  targetThroughput: number;
  activeMachinesCount: number;
}

export interface DbMachineThresholds {
  tempWarning: number;
  tempCritical: number;
  vibWarning: number;
  vibCritical: number;
  pressWarning: number;
  pressCritical: number;
  rpmLimit: number;
  energyThreshold: number;
}

export interface DbMachineComponent {
  name: string;
  health: number;
  status: 'nominal' | 'warning' | 'critical' | 'maintenance';
  detail: string;
}

export interface DbMachineNote {
  id: string;
  machineId: string;
  userId: string;
  userName: string;
  note: string;
  timestamp: string;
}

export interface DbMachine {
  id: string;
  workspaceId: string;
  plantId: string;
  productionLineId?: string;
  name: string;
  type: string;
  tag: string;
  productionLine?: string;
  plantArea: string;
  location?: string;
  manufacturer: string;
  installationDate: string;
  maintenanceInterval: string;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  criticality: 'Tier 1 Critical' | 'Tier 2 Essential' | 'Tier 3 Balance';
  healthScore: number;
  status: 'nominal' | 'warning' | 'critical' | 'maintenance';
  metrics: {
    vibrationRMS: number;
    bearingTemp: number;
    suctionPressure: number;
    dischargePressure: number;
    rotorRPM: number;
    lubeOilNAS: number;
    acousticDB: number;
    motorCurrent: number;
  };
  customThresholds?: DbMachineThresholds;
  notes?: DbMachineNote[];
  isArchived?: boolean;
  rulDays: number;
  mtbfHours: number;
  runtimeHours: number;
  lastOverhaul: string;
  nextScheduledService: string;
  alarm: string | null;
  components: DbMachineComponent[];
  oem: string;
  model: string;
  operatingLoadPct: number;
  energyKW: number;
  novaInsight?: string;
}

export interface DbSensor {
  id: string;
  workspaceId: string;
  machineId: string;
  plantId: string;
  channelName: string;
  scadaTag: string;
  measurementType: 'vibration' | 'temperature' | 'pressure' | 'speed' | 'oil_cleanliness' | 'acoustic' | 'current' | 'power';
  unit: string;
  currentValue: number;
  warningLimit: number;
  criticalLimit: number;
  samplingRateHz: number;
  lastReadingTimestamp: string;
  status: 'nominal' | 'warning' | 'critical';
}

export interface DbTelemetryPoint {
  id: string;
  workspaceId: string;
  machineId: string;
  timestamp: string;
  vibrationRMS: number;
  bearingTemp: number;
  suctionPressure: number;
  dischargePressure: number;
  rotorRPM: number;
  lubeOilNAS: number;
  acousticDB: number;
  motorCurrent: number;
  energyKW: number;
  operatingLoadPct: number;
}

export interface DbMachineHealth {
  id: string;
  workspaceId: string;
  machineId: string;
  overallScore: number;
  mechanicalHealth: number;
  electricalHealth: number;
  thermalHealth: number;
  lubricationHealth: number;
  rulDays: number;
  calculatedAt: string;
}

export interface DbMachineRisk {
  id: string;
  workspaceId: string;
  machineId: string;
  riskCategory: 'HIGH' | 'MEDIUM' | 'LOW';
  failureProbabilityPct: number;
  consequenceRating: number; // 1-10
  financialExposurePerHourUSD: number;
  primaryRiskDriver: string;
  evaluatedAt: string;
}

export interface DbAnomaly {
  id: string;
  workspaceId: string;
  machineId: string;
  plantId: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'mitigated' | 'resolved';
  detectedMetric: string;
  observedValue: string;
  baselineValue: string;
  timestamp: string;
  rootCauseHypothesis?: string;
}

export interface DbIncident {
  id: string;
  workspaceId: string;
  machineId: string;
  plantId: string;
  incidentNumber: string;
  title: string;
  severity: 'critical' | 'warning' | 'moderate';
  status: 'active' | 'investigating' | 'mitigated' | 'resolved' | 'closed';
  summary: string;
  reportedBy: string;
  assignedEngineer: string;
  openedAt: string;
  resolvedAt?: string;
  downtimeMinutes?: number;
}

export interface DbMaintenanceRecord {
  id: string;
  workspaceId: string;
  machineId: string;
  workOrderNumber: string;
  type: 'Preventive Overhaul' | 'Corrective Alignment' | 'Lubrication Service' | 'Bearing Replacement' | 'Emergency Inspection';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Deferred';
  priority: 'Critical' | 'High' | 'Medium' | 'Routine';
  dueDate: string;
  completedDate?: string;
  technician: string;
  description: string;
  partsReplaced?: string[];
  estimatedHours: number;
  actualHours?: number;
}

export interface DbInvestigation {
  id: string;
  workspaceId: string;
  userId?: string;
  incidentId?: string;
  plantId?: string;
  title: string;
  assetId: string;
  assetName: string;
  tag: string;
  severity: 'critical' | 'warning' | 'moderate';
  status: 'draft' | 'in_progress' | 'under_review' | 'resolved' | 'archived' | 'root_cause_found' | 'action_pending';
  currentStep?: number;
  stepsCompleted?: boolean[];
  timestamp: string;
  updatedAt?: string;
  shift?: string;
  summary: string;
  fiveWhys: string[];
  rootCauseDirect: string;
  rootCauseRoot: string;
  confidence: number;
  hypotheses?: Array<{
    id: string;
    title: string;
    probability: number;
    status: 'confirmed' | 'disproven' | 'investigating';
    evidence: string;
  }>;
  sensorEvidence?: Array<{
    parameter: string;
    value: string;
    baseline: string;
    deviation: string;
    severity: string;
  }>;
  capaActions: Array<{
    id: string;
    action: string;
    owner: string;
    deadline: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }>;
  operatorNotes?: string;
  notes?: Array<{
    id: string;
    investigationId: string;
    userId: string;
    userName: string;
    note: string;
    timestamp: string;
  }>;
}

export interface DbRecommendation {
  id: string;
  workspaceId: string;
  machineId: string;
  title: string;
  action: string;
  urgency: 'Immediate' | 'Within 24 Hours' | 'Next Scheduled Turnaround';
  expectedImpact: string;
  confidencePct: number;
  status: 'Proposed' | 'Applied' | 'Dismissed';
  appliedBy?: string;
  appliedAt?: string;
}

export interface DbReportVersion {
  versionNumber: number;
  date: string;
  author: string;
  summary: string;
  changes?: string;
}

export interface DbReport {
  id: string;
  workspaceId: string;
  reportNumber: string;
  name: string;
  type: string;
  typeLabel: string;
  plantId: string;
  machineId?: string;
  machineOrPlant: string;
  createdDate: string;
  updatedDate?: string;
  version: number;
  versions: DbReportVersion[];
  isArchived?: boolean;
  status: 'Final / Approved' | 'Generated' | 'Under Review' | 'Archived';
  generatedBy: string;
  summary: string;
  standardsCompliance: string[];
  sections: any;
}

export interface DbSavedView {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  filters: any;
  createdAt: string;
}

export interface DbDashboardConfig {
  id: string;
  workspaceId: string;
  userId: string;
  visibleKpis: string[];
  preferredMetrics: string[];
  defaultTimeRange: '1h' | '8h' | '24h' | '7d';
  defaultPlantId: string;
  widgetOrder?: string[];
}

export interface DbAlertPreference {
  id: string;
  workspaceId: string;
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

export interface DbNotification {
  id: string;
  workspaceId: string;
  userId?: string;
  type: 'success' | 'warning' | 'critical' | 'info';
  severity?: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  description?: string;
  timestamp: string;
  relatedMachineId?: string;
  relatedIncidentId?: string;
  isRead?: boolean;
}

export interface DbActivityLog {
  id: string;
  workspaceId: string;
  userId: string;
  userName?: string;
  action: string;
  date: string;
  relatedObjectType: string;
  relatedObjectId: string;
  details?: string;
}

export interface DbNovaConversation {
  id: string;
  userId: string;
  workspaceId: string;
  plantId: string;
  title: string;
  selectedMachineId?: string;
  selectedIncidentId?: string;
  selectedInvestigationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbNovaMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  intent?: string;
  toolsUsed?: string[];
  contextSnapshot?: any;
  metadata?: any;
}

export const ARCHETYPES = [
  {
    type: 'Centrifugal Process Compressor',
    prefix: 'CMP',
    oems: ['Siemens Energy', 'Atlas Copco Gas & Process', 'MAN Energy Solutions', 'Elliott Group'],
    baseRPM: 11400,
    baseTemp: 72.0,
    baseVib: 2.1,
    baseLoad: 85,
    baseKW: 1800,
    criticality: 'Tier 1 Critical' as const,
    components: ['Tilt-Pad Journal Bearing DE', 'Dry Gas Seal Stage 1 & 2', 'Impeller Balance Drum', 'High-Speed Flexible Disc Coupling']
  },
  {
    type: 'Multi-Stage Boiler Feed Pump',
    prefix: 'BFP',
    oems: ['Sulzer Pumps AG', 'Flowserve Corporation', 'KSB Group', 'Ebara Corporation'],
    baseRPM: 2980,
    baseTemp: 68.0,
    baseVib: 1.8,
    baseLoad: 78,
    baseKW: 850,
    criticality: 'Tier 1 Critical' as const,
    components: ['Balance Piston & Bushing', 'Mechanical Cartridge Seal', 'Radial Thrust Bearing', 'Shaft Wear Sleeve']
  },
  {
    type: 'High-Torque Induction Motor Drive',
    prefix: 'MTR',
    oems: ['ABB Industrial Drives', 'Siemens Simotics', 'WEG Electric', 'Toshiba Energy'],
    baseRPM: 1485,
    baseTemp: 62.0,
    baseVib: 1.4,
    baseLoad: 80,
    baseKW: 620,
    criticality: 'Tier 2 Essential' as const,
    components: ['Stator Winding Class H Insulation', 'Drive-End Deep Groove Ball Bearing', 'Cast Rotor Cage Bars', 'Cooling Cowl Fan']
  },
  {
    type: 'Heavy Slag Conveyor Dual Drive',
    prefix: 'CNV',
    oems: ['Flender Mechanical Drives', 'Metso Outotec', 'TAKRAF Group', 'Continental Conveyor'],
    baseRPM: 740,
    baseTemp: 58.0,
    baseVib: 2.4,
    baseLoad: 75,
    baseKW: 340,
    criticality: 'Tier 2 Essential' as const,
    components: ['Planetary Bevel Gearbox Pinion', 'Fluid Torque Coupler', 'Drive Pulley Pillow Block', 'Labyrinth Dust Seal']
  },
  {
    type: 'Induced Draft Cooling Tower Fan',
    prefix: 'FAN',
    oems: ['Howden Industrial', 'SPX Cooling Technologies', 'Hamon & Cie', 'FläktGroup'],
    baseRPM: 480,
    baseTemp: 52.0,
    baseVib: 2.0,
    baseLoad: 68,
    baseKW: 220,
    criticality: 'Tier 3 Balance' as const,
    components: ['FRP Aerodynamic Blades', 'Right-Angle Gearbox Unit', 'Cardan Drive Shaft', 'Vibration Cutoff Sensor']
  },
  {
    type: 'Industrial Gas Turbine Generator',
    prefix: 'GT',
    oems: ['GE Vernova', 'Siemens Energy', 'Mitsubishi Power', 'Solar Turbines'],
    baseRPM: 5100,
    baseTemp: 84.0,
    baseVib: 1.9,
    baseLoad: 92,
    baseKW: 4500,
    criticality: 'Tier 1 Critical' as const,
    components: ['Axial Compressor Section', 'Low-NOx Combustor Cans', 'Multi-Stage Power Turbine', 'Lube Oil Skid Heat Exchanger']
  },
  {
    type: 'Continuous Twin-Screw Extruder',
    prefix: 'EXT',
    oems: ['Coperion', 'KraussMaffei Berstorff', 'Leistritz', 'Toshiba Machine'],
    baseRPM: 600,
    baseTemp: 76.0,
    baseVib: 2.2,
    baseLoad: 82,
    baseKW: 480,
    criticality: 'Tier 2 Essential' as const,
    components: ['Nitrided Bi-Metallic Barrel', 'Co-Rotating Screw Shafts', 'High-Torque Distribution Gearbox', 'Vacuum Venting Stuffer']
  },
  {
    type: 'Chemical Agitator Reactor Drive',
    prefix: 'AGT',
    oems: ['Ekato Group', 'SPX FLOW Lightnin', 'Philadelphia Mixing', 'Chemineer'],
    baseRPM: 120,
    baseTemp: 56.0,
    baseVib: 1.6,
    baseLoad: 70,
    baseKW: 180,
    criticality: 'Tier 2 Essential' as const,
    components: ['Double Mechanical Seal Barrier', 'Rigid Flange Coupling', 'Hydrofoil Impeller Blades', 'Speed Reducer Drive']
  },
  {
    type: 'High-Pressure Hydraulic Power Unit',
    prefix: 'HPU',
    oems: ['Bosch Rexroth', 'Parker Hannifin', 'Moog Industrial', 'Eaton Vickers'],
    baseRPM: 1750,
    baseTemp: 54.0,
    baseVib: 1.3,
    baseLoad: 72,
    baseKW: 160,
    criticality: 'Tier 2 Essential' as const,
    components: ['Axial Piston Variable Pump', '10-Micron Pressure Filter', 'Piston Accumulator Bank', 'Proportional Directional Valves']
  },
  {
    type: 'Centrifugal Chiller Refrigeration Compressor',
    prefix: 'CHL',
    oems: ['York (Johnson Controls)', 'Trane Technologies', 'Carrier Commercial', 'Daikin Applied'],
    baseRPM: 8200,
    baseTemp: 48.0,
    baseVib: 1.2,
    baseLoad: 74,
    baseKW: 520,
    criticality: 'Tier 3 Balance' as const,
    components: ['Magnetic Levitation Bearings', 'Variable Geometry Inlet Vanes', 'Semi-Hermetic Motor Stator', 'Flash Economizer Vessel']
  },
  {
    type: '5-Axis Titanium Aerospace Gantry CNC',
    prefix: 'CNC',
    oems: ['DMG MORI', 'Mazak Corporation', 'Makino Milling', 'Okuma Europe'],
    baseRPM: 18000,
    baseTemp: 42.0,
    baseVib: 0.88,
    baseLoad: 76,
    baseKW: 45,
    criticality: 'Tier 1 Critical' as const,
    components: ['Hybrid Ceramic Spindle Bearings', 'Linear Glass Optical Encoders', 'High-Pressure Coolant Delivery', 'Rotary Table Worm Gear']
  }
];

export function generateSeedDataset(workspaceId: string, userId: string) {
  const plants: DbPlant[] = [
    {
      id: 'lucknow-mf',
      workspaceId,
      code: 'LKO-AUTO-01',
      name: 'Lucknow Manufacturing Facility',
      location: 'Lucknow Industrial Corridor, Uttar Pradesh, India',
      country: 'India',
      industry: 'Automotive Powertrain & Heavy Machinery Casting',
      description: 'Advanced powertrain casting, stamping, CNC machining, and automated chassis assembly complex with 4 continuous lines.',
      productionLinesCount: 4,
      plantManager: 'Sanjay Verma, VP Operations',
      operationalStatus: 'alert',
      unitsCount: 38,
      activeLoadMW: 124.6,
      targetLoadMW: 130.0,
      overallOEE: 91.2,
      status: 'alert',
      areas: ['Train 1 (Engine Block Stamping)', 'Train 2 (Chassis Rig)', 'Train 3 (Powertrain Machining)', 'Compressor House Bay 2', 'Utilities & Boiler Island'],
      telemetryStreamStatus: 'ONLINE (10 kHz)',
      ambientTempC: 31.4,
      lastSyncTimestamp: new Date().toISOString()
    },
    {
      id: 'rotterdam-b4',
      workspaceId,
      code: 'RTM-SYNTH-B',
      name: 'Rotterdam Synthesis Complex — Train B4',
      location: 'Port of Rotterdam, Netherlands',
      country: 'Netherlands',
      industry: 'Continuous Petrochemical Synthesis & Gas Fractionation',
      description: 'Continuous synthesis trains with high-pressure centrifugal turbocompressors and cryogenic fractionation columns.',
      productionLinesCount: 3,
      plantManager: 'Elena Vance, Reliability Director',
      operationalStatus: 'alert',
      unitsCount: 32,
      activeLoadMW: 142.8,
      targetLoadMW: 145.0,
      overallOEE: 89.4,
      status: 'alert',
      areas: ['Synthesis Train B4', 'Cryogenic Fractionation Loop', 'Primary Extrusion Bay', 'Utilities & Cogeneration'],
      telemetryStreamStatus: 'ONLINE (10 kHz)',
      ambientTempC: 17.8,
      lastSyncTimestamp: new Date().toISOString()
    },
    {
      id: 'detroit-ev02',
      workspaceId,
      code: 'DET-PROP-02',
      name: 'Detroit Propulsion Gigafactory — Line 02',
      location: 'Detroit, Michigan, USA',
      country: 'United States',
      industry: 'Electric Propulsion & High-Torque Stator Assembly',
      description: 'Automated electric motor winding, high-speed balancing, dyno testing, and battery pack chassis integration.',
      productionLinesCount: 4,
      plantManager: 'Marcus Brody, Operations Director',
      operationalStatus: 'optimal',
      unitsCount: 34,
      activeLoadMW: 88.2,
      targetLoadMW: 92.0,
      overallOEE: 93.6,
      status: 'optimal',
      areas: ['Motor Stator Winding Train', 'High-Speed Balancing Cells', 'Dyno Test Benches', 'Chiller Mechanical Room'],
      telemetryStreamStatus: 'ONLINE (10 kHz)',
      ambientTempC: 22.4,
      lastSyncTimestamp: new Date().toISOString()
    },
    {
      id: 'permian-st7',
      workspaceId,
      code: 'PERM-GAS-07',
      name: 'Permian Cryogenic Gas Processing — Station 7',
      location: 'Midland, Texas, USA',
      country: 'United States',
      industry: 'Cryogenic Natural Gas Processing & Fractionation',
      description: 'Supercritical gas turbo-expanders, molecular sieve dehydration beds, and gas turbine co-generation blocks.',
      productionLinesCount: 3,
      plantManager: 'Clint Halloway, Site Superintendent',
      operationalStatus: 'optimal',
      unitsCount: 26,
      activeLoadMW: 210.4,
      targetLoadMW: 215.0,
      overallOEE: 91.2,
      status: 'optimal',
      areas: ['Gas Turbine Cogeneration', 'Cryogenic Turbo-Expander Block', 'Dehydration & Sweetening Island', 'Cooling Tower Battery'],
      telemetryStreamStatus: 'ONLINE (10 kHz)',
      ambientTempC: 28.5,
      lastSyncTimestamp: new Date().toISOString()
    },
    {
      id: 'yokohama-p1',
      workspaceId,
      code: 'YOK-AERO-01',
      name: 'Yokohama High-Tolerance Aerospace Facility',
      location: 'Yokohama, Kanagawa, Japan',
      country: 'Japan',
      industry: 'Precision Aerospace Tooling & 5-Axis Machining',
      description: 'High-precision 5-axis CNC machining centers, coordinate measuring labs, and clean-room hydraulic testing rigs.',
      productionLinesCount: 3,
      plantManager: 'Kenji Sato, Plant Director',
      operationalStatus: 'optimal',
      unitsCount: 28,
      activeLoadMW: 45.0,
      targetLoadMW: 48.0,
      overallOEE: 95.8,
      status: 'optimal',
      areas: ['Precision 5-Axis Gantry Bay', 'CMM Inspection Lab', 'Hydraulic Servo Actuator Test Skid', 'Additive Titanium Cell'],
      telemetryStreamStatus: 'ONLINE (10 kHz)',
      ambientTempC: 21.0,
      lastSyncTimestamp: new Date().toISOString()
    }
  ];

  const productionLines: DbProductionLine[] = [
    { id: 'line-lko-01', workspaceId, plantId: 'lucknow-mf', name: 'Train 1 (Engine Block Stamping)', lineCode: 'LKO-L1', description: 'Heavy mechanical presses and compressor pneumatic feeds', status: 'operational', throughputUnitsPerHour: 140, targetThroughput: 150, activeMachinesCount: 12 },
    { id: 'line-lko-02', workspaceId, plantId: 'lucknow-mf', name: 'Train 2 (Chassis Rig)', lineCode: 'LKO-L2', description: 'Chassis robotic welding and hydraulic clamping stations', status: 'operational', throughputUnitsPerHour: 95, targetThroughput: 100, activeMachinesCount: 10 },
    { id: 'line-lko-03', workspaceId, plantId: 'lucknow-mf', name: 'Train 3 (Powertrain Machining)', lineCode: 'LKO-L3', description: 'High-precision CNC crankshaft line and wash stations', status: 'operational', throughputUnitsPerHour: 110, targetThroughput: 115, activeMachinesCount: 8 },
    { id: 'line-lko-04', workspaceId, plantId: 'lucknow-mf', name: 'Utilities & Steam Cogeneration', lineCode: 'LKO-UTL', description: 'Supercritical boiler feed pumps, chillers, and air supply', status: 'degraded', throughputUnitsPerHour: 300, targetThroughput: 300, activeMachinesCount: 8 },

    { id: 'line-rtm-01', workspaceId, plantId: 'rotterdam-b4', name: 'Synthesis Train B4', lineCode: 'RTM-L1', description: 'Primary continuous polymer synthesis and turbocompression loop', status: 'degraded', throughputUnitsPerHour: 820, targetThroughput: 850, activeMachinesCount: 12 },
    { id: 'line-rtm-02', workspaceId, plantId: 'rotterdam-b4', name: 'Cryogenic Fractionation Loop', lineCode: 'RTM-L2', description: 'Multi-stage distillation columns and liquid transfer pumps', status: 'operational', throughputUnitsPerHour: 640, targetThroughput: 650, activeMachinesCount: 10 },
    { id: 'line-rtm-03', workspaceId, plantId: 'rotterdam-b4', name: 'Primary Extrusion Bay', lineCode: 'RTM-L3', description: 'High-torque twin-screw extruders and pelletizers', status: 'operational', throughputUnitsPerHour: 450, targetThroughput: 460, activeMachinesCount: 10 },

    { id: 'line-det-01', workspaceId, plantId: 'detroit-ev02', name: 'Motor Stator Winding Train', lineCode: 'DET-L1', description: 'Hairpin copper stator winding and impregnation ovens', status: 'operational', throughputUnitsPerHour: 220, targetThroughput: 225, activeMachinesCount: 12 },
    { id: 'line-det-02', workspaceId, plantId: 'detroit-ev02', name: 'High-Speed Balancing & Dyno Cells', lineCode: 'DET-L2', description: '22,000 RPM rotor dynamic balancing and torque cell', status: 'operational', throughputUnitsPerHour: 180, targetThroughput: 180, activeMachinesCount: 12 },
    { id: 'line-det-03', workspaceId, plantId: 'detroit-ev02', name: 'Plant HVAC & Chiller Network', lineCode: 'DET-UTL', description: 'Centrifugal magnetic levitation chillers and pumps', status: 'operational', throughputUnitsPerHour: 500, targetThroughput: 500, activeMachinesCount: 10 },

    { id: 'line-prm-01', workspaceId, plantId: 'permian-st7', name: 'Gas Turbine Cogeneration', lineCode: 'PRM-L1', description: 'Heavy industrial gas turbine generators 45MW and HRSG steam', status: 'operational', throughputUnitsPerHour: 45, targetThroughput: 45, activeMachinesCount: 10 },
    { id: 'line-prm-02', workspaceId, plantId: 'permian-st7', name: 'Cryogenic Turbo-Expander Block', lineCode: 'PRM-L2', description: 'Supercritical methane turbo-expanders and cryogenic separation', status: 'operational', throughputUnitsPerHour: 1200, targetThroughput: 1250, activeMachinesCount: 10 },
    { id: 'line-prm-03', workspaceId, plantId: 'permian-st7', name: 'Cooling Tower Battery & Utilities', lineCode: 'PRM-UTL', description: 'Induced draft cooling towers and recirculation pumps', status: 'operational', throughputUnitsPerHour: 800, targetThroughput: 800, activeMachinesCount: 6 },

    { id: 'line-yok-01', workspaceId, plantId: 'yokohama-p1', name: 'Precision 5-Axis Gantry Bay', lineCode: 'YOK-L1', description: 'High-speed titanium impellers and aerospace blisk milling', status: 'operational', throughputUnitsPerHour: 35, targetThroughput: 35, activeMachinesCount: 12 },
    { id: 'line-yok-02', workspaceId, plantId: 'yokohama-p1', name: 'Hydraulic Servo Actuator Test Skid', lineCode: 'YOK-L2', description: 'Proportional servo valves and flight control endurance testing', status: 'operational', throughputUnitsPerHour: 60, targetThroughput: 60, activeMachinesCount: 8 },
    { id: 'line-yok-03', workspaceId, plantId: 'yokohama-p1', name: 'Additive Titanium & Heat Treatment', lineCode: 'YOK-L3', description: 'Electron beam melting and vacuum stress relief furnaces', status: 'operational', throughputUnitsPerHour: 20, targetThroughput: 20, activeMachinesCount: 8 }
  ];

  // Curated prominent machines
  const coreMachines: DbMachine[] = [
    {
      id: 'C-204',
      workspaceId,
      plantId: 'lucknow-mf',
      productionLineId: 'line-lko-01',
      name: 'Centrifugal Turbocompressor C-204',
      type: 'Centrifugal Turbocompressor',
      tag: 'CMP-HP-204A',
      productionLine: 'Train 1 (Engine Block Stamping)',
      plantArea: 'Compressor House Bay 2',
      location: 'Lucknow Plant - Block B',
      manufacturer: 'Siemens Industrial Turbomachinery',
      installationDate: '2021-04-15',
      maintenanceInterval: '4000 Operating Hours',
      risk: 'HIGH',
      criticality: 'Tier 1 Critical',
      healthScore: 68,
      status: 'warning',
      metrics: {
        vibrationRMS: 4.12,
        bearingTemp: 88.4,
        suctionPressure: 34.8,
        dischargePressure: 182.4,
        rotorRPM: 11420,
        lubeOilNAS: 7,
        acousticDB: 89.2,
        motorCurrent: 342
      },
      customThresholds: {
        tempWarning: 80.0,
        tempCritical: 90.0,
        vibWarning: 3.5,
        vibCritical: 4.5,
        pressWarning: 175.0,
        pressCritical: 190.0,
        rpmLimit: 12000,
        energyThreshold: 450
      },
      notes: [
        {
          id: 'nt-01',
          machineId: 'C-204',
          userId,
          userName: 'Anubhuti Pal',
          note: 'Bearing inspection scheduled; tilt pad hydrodynamic oil wedge showing early thermal shearing under 94% load.',
          timestamp: '2026-09-21T14:30:00.000Z'
        }
      ],
      isArchived: false,
      rulDays: 18,
      mtbfHours: 4280,
      runtimeHours: 14820,
      lastOverhaul: '2025-11-12',
      nextScheduledService: '2026-10-05',
      alarm: 'High 1X/2X shaft vibration amplitude exceeding ISO 10816-3 Zone B limit (4.5 mm/s critical)',
      components: [
        { name: 'DE Journal Tilt-Pad Bearing', health: 62, status: 'warning', detail: 'Sub-synchronous fluid whirl harmonic detected at 0.46X' },
        { name: 'Flexible Disc Pack Coupling', health: 82, status: 'nominal', detail: 'Laser alignment within 0.03 mm tolerance' },
        { name: 'Dry Gas Seals Stage 1 & 2', health: 91, status: 'nominal', detail: 'Buffer nitrogen differential 3.2 bar stable' },
        { name: 'Anti-Surge Control Valve', health: 89, status: 'nominal', detail: 'Step response 140ms under calibrated standard' }
      ],
      oem: 'Siemens Energy SGT-400 / STC-SV',
      model: 'STC-SV (12-5-A)',
      operatingLoadPct: 94,
      energyKW: 420,
      novaInsight: 'Vibration elevation correlated with lube oil supply thermal spike (56°C). Recommend inspecting heat exchanger HEX-204 and verifying oil viscosity.'
    },
    {
      id: 'CV-109',
      workspaceId,
      plantId: 'lucknow-mf',
      productionLineId: 'line-lko-01',
      name: 'Heavy Slag Conveyor Dual Drive CV-109',
      type: 'Heavy Slag Conveyor Dual Drive',
      tag: 'CNV-SLAG-109B',
      productionLine: 'Train 1 (Engine Block Stamping)',
      plantArea: 'Foundry & Slag Processing Bay',
      location: 'Lucknow Plant - Foundry',
      manufacturer: 'Flender / Siemens Mechanical',
      installationDate: '2019-11-05',
      maintenanceInterval: '3000 Operating Hours',
      risk: 'HIGH',
      criticality: 'Tier 2 Essential',
      healthScore: 59,
      status: 'critical',
      metrics: {
        vibrationRMS: 5.85,
        bearingTemp: 94.6,
        suctionPressure: 0,
        dischargePressure: 0,
        rotorRPM: 1480,
        lubeOilNAS: 9,
        acousticDB: 96.1,
        motorCurrent: 210
      },
      customThresholds: {
        tempWarning: 85.0,
        tempCritical: 95.0,
        vibWarning: 4.5,
        vibCritical: 6.0,
        pressWarning: 10,
        pressCritical: 20,
        rpmLimit: 1800,
        energyThreshold: 220
      },
      notes: [
        {
          id: 'nt-02',
          machineId: 'CV-109',
          userId,
          userName: 'Anubhuti Pal',
          note: 'High temperature on drive end stator. Transfer chute 4B rubber skirting needs replacement.',
          timestamp: '2026-09-20T10:15:00.000Z'
        }
      ],
      isArchived: false,
      rulDays: 12,
      mtbfHours: 2900,
      runtimeHours: 19200,
      lastOverhaul: '2025-08-14',
      nextScheduledService: '2026-09-28',
      alarm: 'Motor stator thermal peak (94.6°C) and gearbox pinion mesh gear pass vibration excursion',
      components: [
        { name: 'Planetary Gearbox Pinion', health: 54, status: 'critical', detail: 'Tooth mesh acoustic frequency 2.4 kHz spike' },
        { name: 'Electric Motor Stator RTD', health: 58, status: 'warning', detail: 'Class F thermal limit approaching (94.6°C)' },
        { name: 'Fluid Torque Coupler', health: 74, status: 'nominal', detail: 'Fusible plug intact; oil level 85%' },
        { name: 'Labyrinth Dust Seal', health: 60, status: 'warning', detail: 'Abrasive slag particle ingress suspected' }
      ],
      oem: 'Flender Industrial Drives',
      model: 'FZP Planetary High-Torque 450',
      operatingLoadPct: 92,
      energyKW: 210,
      novaInsight: 'Abrasive slag particle ingress suspected at labyrinth seal. Gearbox oil NAS 9 indicates high particulate count.'
    },
    {
      id: 'BFP-01',
      workspaceId,
      plantId: 'lucknow-mf',
      productionLineId: 'line-lko-04',
      name: 'Supercritical Boiler Feed Pump BFP-01',
      type: 'Multi-Stage Boiler Feed Pump',
      tag: 'PMP-BFP-010',
      productionLine: 'Utilities & Steam Cogeneration',
      plantArea: 'High-Pressure Steam Island',
      location: 'Lucknow Plant - Utilities',
      manufacturer: 'Sulzer Pumps AG',
      installationDate: '2020-08-20',
      maintenanceInterval: '8000 Operating Hours',
      risk: 'LOW',
      criticality: 'Tier 1 Critical',
      healthScore: 88,
      status: 'nominal',
      metrics: {
        vibrationRMS: 2.18,
        bearingTemp: 64.2,
        suctionPressure: 8.2,
        dischargePressure: 245.0,
        rotorRPM: 2985,
        lubeOilNAS: 5,
        acousticDB: 74.5,
        motorCurrent: 185
      },
      customThresholds: {
        tempWarning: 75.0,
        tempCritical: 85.0,
        vibWarning: 3.0,
        vibCritical: 4.5,
        pressWarning: 260.0,
        pressCritical: 280.0,
        rpmLimit: 3200,
        energyThreshold: 250
      },
      notes: [],
      isArchived: false,
      rulDays: 94,
      mtbfHours: 8500,
      runtimeHours: 21300,
      lastOverhaul: '2026-01-10',
      nextScheduledService: '2026-11-20',
      alarm: null,
      components: [
        { name: 'Balance Drum & Bushing', health: 88, status: 'nominal', detail: 'Axial thrust within 1.2 kN envelope' },
        { name: 'Mechanical Cartridge Seal', health: 84, status: 'nominal', detail: 'Quench leakage rate < 5 ml/hr' },
        { name: 'Radial Tilting Pad Bearing', health: 90, status: 'nominal', detail: 'Hydrodynamic oil film thickness 22 µm' },
        { name: 'Diffuser Barrel Casing', health: 92, status: 'nominal', detail: 'No erosion patterns observed on casing' }
      ],
      oem: 'Sulzer Pumps AG',
      model: 'GSG Supercritical 150-250',
      operatingLoadPct: 82,
      energyKW: 195,
      novaInsight: 'Baseline telemetry highly stable. Balance drum delta pressure steady at 236 bar.'
    },
    {
      id: 'CNC-05',
      workspaceId,
      plantId: 'yokohama-p1',
      productionLineId: 'line-yok-01',
      name: '5-Axis Titanium Aerospace Gantry CNC-05',
      type: '5-Axis Titanium Aerospace Gantry CNC',
      tag: 'MCH-CNC-005X',
      productionLine: 'Precision 5-Axis Gantry Bay',
      plantArea: 'Precision 5-Axis Gantry Bay',
      location: 'Yokohama Facility',
      manufacturer: 'DMG MORI',
      installationDate: '2022-02-18',
      maintenanceInterval: '2000 Operating Hours',
      risk: 'LOW',
      criticality: 'Tier 1 Critical',
      healthScore: 94,
      status: 'nominal',
      metrics: {
        vibrationRMS: 0.88,
        bearingTemp: 42.1,
        suctionPressure: 0,
        dischargePressure: 140.0,
        rotorRPM: 18000,
        lubeOilNAS: 3,
        acousticDB: 68.0,
        motorCurrent: 45
      },
      customThresholds: {
        tempWarning: 55.0,
        tempCritical: 65.0,
        vibWarning: 1.5,
        vibCritical: 2.5,
        pressWarning: 160.0,
        pressCritical: 180.0,
        rpmLimit: 20000,
        energyThreshold: 60
      },
      notes: [],
      isArchived: false,
      rulDays: 140,
      mtbfHours: 9200,
      runtimeHours: 6400,
      lastOverhaul: '2026-03-01',
      nextScheduledService: '2026-12-15',
      alarm: null,
      components: [
        { name: 'Spindle Ceramic Hybrid Bearings', health: 95, status: 'nominal', detail: 'Vibration < 0.9 mm/s across 18k RPM envelope' },
        { name: 'Heidenhain Linear Optical Encoders', health: 93, status: 'nominal', detail: 'Positional repeatability ±1.2 µm' },
        { name: 'Direct Drive Rotary C-Axis', health: 94, status: 'nominal', detail: 'Backlash < 0.002 degrees' },
        { name: 'High-Pressure Coolant Delivery', health: 92, status: 'nominal', detail: 'Flow rate 38 L/min at 140 bar steady' }
      ],
      oem: 'DMG MORI',
      model: 'DMU 95 monoBLOCK',
      operatingLoadPct: 76,
      energyKW: 45,
      novaInsight: 'Spindle dynamic balance excellent. Coolant high pressure stable at 140 bar.'
    },
    {
      id: 'P-118',
      workspaceId,
      plantId: 'rotterdam-b4',
      productionLineId: 'line-rtm-02',
      name: 'High-Pressure Cryogenic Liquid Transfer Pump P-118',
      type: 'Multi-Stage Boiler Feed Pump',
      tag: 'PMP-CRY-118',
      productionLine: 'Cryogenic Fractionation Loop',
      plantArea: 'Cryogenic Fractionation Loop',
      location: 'Rotterdam Facility - Loop 2',
      manufacturer: 'Flowserve Corporation',
      installationDate: '2021-09-10',
      maintenanceInterval: '6000 Operating Hours',
      risk: 'MEDIUM',
      criticality: 'Tier 1 Critical',
      healthScore: 79,
      status: 'warning',
      metrics: {
        vibrationRMS: 3.74,
        bearingTemp: 76.5,
        suctionPressure: 14.2,
        dischargePressure: 112.0,
        rotorRPM: 2950,
        lubeOilNAS: 6,
        acousticDB: 82.4,
        motorCurrent: 142
      },
      customThresholds: {
        tempWarning: 75.0,
        tempCritical: 85.0,
        vibWarning: 3.5,
        vibCritical: 4.8,
        pressWarning: 120.0,
        pressCritical: 135.0,
        rpmLimit: 3400,
        energyThreshold: 180
      },
      notes: [],
      isArchived: false,
      rulDays: 45,
      mtbfHours: 5100,
      runtimeHours: 16400,
      lastOverhaul: '2025-10-04',
      nextScheduledService: '2026-10-18',
      alarm: 'Vibration excursion on outboard bearing (3.74 mm/s). Mechanical seal buffer pressure fluctuation.',
      components: [
        { name: 'Cryogenic Mechanical Seal', health: 72, status: 'warning', detail: 'Buffer nitrogen differential slightly elevated' },
        { name: 'Radial Roller Bearing Outboard', health: 76, status: 'warning', detail: 'BPFO outer race defect frequency detected' },
        { name: 'Stainless Steel Impeller Stack', health: 88, status: 'nominal', detail: 'Hydraulic flow smooth' }
      ],
      oem: 'Flowserve Corporation',
      model: 'WXB Cryo-Pump 80-160',
      operatingLoadPct: 86,
      energyKW: 142,
      novaInsight: 'Outer race bearing frequency BPFO detected in FFT spectrum. Monitor trend over next 14 days.'
    },
    {
      id: 'GT-401',
      workspaceId,
      plantId: 'permian-st7',
      productionLineId: 'line-prm-01',
      name: 'Industrial Gas Turbine Generator GT-401',
      type: 'Industrial Gas Turbine Generator',
      tag: 'TURB-GT-401',
      productionLine: 'Gas Turbine Cogeneration',
      plantArea: 'Gas Turbine Cogeneration',
      location: 'Permian Gas Station 7',
      manufacturer: 'GE Vernova',
      installationDate: '2020-03-12',
      maintenanceInterval: '8000 Operating Hours',
      risk: 'LOW',
      criticality: 'Tier 1 Critical',
      healthScore: 91,
      status: 'nominal',
      metrics: {
        vibrationRMS: 1.85,
        bearingTemp: 82.3,
        suctionPressure: 42.0,
        dischargePressure: 210.0,
        rotorRPM: 5100,
        lubeOilNAS: 4,
        acousticDB: 88.0,
        motorCurrent: 520
      },
      customThresholds: {
        tempWarning: 90.0,
        tempCritical: 105.0,
        vibWarning: 3.2,
        vibCritical: 4.8,
        pressWarning: 230.0,
        pressCritical: 250.0,
        rpmLimit: 5500,
        energyThreshold: 4800
      },
      notes: [],
      isArchived: false,
      rulDays: 120,
      mtbfHours: 9400,
      runtimeHours: 24100,
      lastOverhaul: '2025-12-01',
      nextScheduledService: '2026-11-15',
      alarm: null,
      components: [
        { name: 'Axial Compressor Blades', health: 93, status: 'nominal', detail: 'Leading edges clean, no stall flutter' },
        { name: 'Combustion Chamber Liners', health: 89, status: 'nominal', detail: 'Thermal barrier coating intact' },
        { name: 'Power Turbine Rotor', health: 92, status: 'nominal', detail: 'Vibration 1.85 mm/s well below ISO limits' }
      ],
      oem: 'GE Vernova',
      model: 'LM2500+ DLE Aeroderivative',
      operatingLoadPct: 91,
      energyKW: 4200,
      novaInsight: 'Gas turbine operating at 91% continuous base rating. Exhaust gas temperature spread is < 12°C.'
    }
  ];

  const machines: DbMachine[] = [...coreMachines];
  const existingIds = new Set(machines.map(m => m.id.toUpperCase()));

  // Target fleet of 158 realistic machines
  const targetCount = 158;
  const plantIds = ['lucknow-mf', 'rotterdam-b4', 'detroit-ev02', 'permian-st7', 'yokohama-p1'];
  let seq = 1;

  while (machines.length < targetCount) {
    const archIdx = (seq - 1) % ARCHETYPES.length;
    const arch = ARCHETYPES[archIdx];
    const plantId = plantIds[(seq - 1) % plantIds.length];
    const targetPlant = plants.find(p => p.id === plantId)!;
    const plantLines = productionLines.filter(l => l.plantId === plantId);
    const prodLine = plantLines[(seq - 1) % plantLines.length];

    const machineNum = 100 + seq;
    const id = `${arch.prefix}-${machineNum}`;

    if (existingIds.has(id.toUpperCase())) {
      seq++;
      continue;
    }

    const isWarning = seq % 8 === 0;
    const isCritical = seq % 37 === 0;
    const isMaintenance = seq % 23 === 0;

    let vib = arch.baseVib + ((seq * 7) % 15) * 0.1;
    let temp = arch.baseTemp + ((seq * 11) % 18) * 0.5;
    let loadPct = Math.min(94, Math.max(65, arch.baseLoad + ((seq * 5) % 15) - 7));
    let lubeNAS = 3 + (seq % 5);

    if (isCritical) {
      vib += 3.2;
      temp += 16.5;
      lubeNAS = 8;
    } else if (isWarning) {
      vib += 1.8;
      temp += 9.0;
      lubeNAS = 7;
    }

    // Calculate health
    let score = 100;
    if (vib > 5.5) score -= 35;
    else if (vib > 4.0) score -= 22;
    else if (vib > 2.8) score -= 8;

    if (temp > 88) score -= 25;
    else if (temp > 78) score -= 14;
    else if (temp > 70) score -= 5;

    if (lubeNAS > 7) score -= 12;
    if (loadPct > 90) score -= 6;
    if (isWarning || isCritical) score -= 10;

    score = Math.max(25, Math.min(98, Math.round(score)));

    let risk: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let status: 'nominal' | 'warning' | 'critical' | 'maintenance' = 'nominal';

    if (score < 65 || isCritical) {
      risk = 'HIGH';
      status = 'critical';
    } else if (score < 82 || isWarning) {
      risk = 'MEDIUM';
      status = 'warning';
    }

    if (isMaintenance) {
      status = 'maintenance';
      risk = 'MEDIUM';
    }

    const oem = arch.oems[seq % arch.oems.length];
    const components: DbMachineComponent[] = arch.components.map((cName, cIdx) => {
      let cHealth = Math.min(100, Math.max(35, score + (cIdx === 0 && status !== 'nominal' ? -18 : (cIdx * 3) - 4)));
      let cStatus: 'nominal' | 'warning' | 'critical' | 'maintenance' = cHealth < 60 ? 'critical' : cHealth < 80 ? 'warning' : 'nominal';
      return {
        name: cName,
        health: cHealth,
        status: cStatus,
        detail: cHealth < 65 ? 'Elevated dynamic stress / harmonic peak' : 'Operating within nominal limits'
      };
    });

    const runtimeHours = 3200 + (seq * 191) % 22000;
    const rulDays = Math.max(14, Math.round((score / 100) * 160));
    const mtbfHours = Math.round(3400 + (score * 40));

    let alarm: string | null = null;
    let novaInsight: string | undefined = undefined;

    if (status === 'critical') {
      alarm = `Critical telemetry trip: Vibration surge (+${Math.round((vib / arch.baseVib - 1) * 100)}%) and thermal peak. Exceeds ISO Zone D.`;
      novaInsight = `Multi-signal divergence detected by NOVA. Harmonic vibration escalation correlated with bearing thermal surge. Immediate inspection recommended.`;
    } else if (status === 'warning') {
      alarm = `Warning excursion: Thermal rise and secondary vibration harmonic. Check lubrication delivery.`;
      novaInsight = `Moderate thermal slope divergence detected during duty cycle. Inspect heat dissipation and verify fluid viscosity.`;
    }

    const thresh: DbMachineThresholds = {
      tempWarning: Math.round(arch.baseTemp + 12),
      tempCritical: Math.round(arch.baseTemp + 22),
      vibWarning: Number((arch.baseVib * 1.5).toFixed(1)),
      vibCritical: Number((arch.baseVib * 2.2).toFixed(1)),
      pressWarning: Math.round(arch.baseRPM > 5000 ? 185 : 28),
      pressCritical: Math.round(arch.baseRPM > 5000 ? 210 : 35),
      rpmLimit: Math.round(arch.baseRPM * 1.15),
      energyThreshold: Math.round(arch.baseKW * 1.2)
    };

    machines.push({
      id,
      workspaceId,
      plantId,
      productionLineId: prodLine.id,
      name: `${arch.type} ${id}`,
      type: arch.type,
      tag: `${arch.prefix}-${machineNum}`,
      productionLine: prodLine.name,
      plantArea: `${targetPlant.areas[(seq - 1) % targetPlant.areas.length]}`,
      location: `${targetPlant.name} - Bay 0${((seq - 1) % 4) + 1}`,
      manufacturer: oem,
      installationDate: `202${(seq % 4) + 1}-0${((seq % 8) + 1)}-15`,
      maintenanceInterval: `${3000 + (seq % 3) * 1000} Operating Hours`,
      risk,
      criticality: arch.criticality,
      healthScore: score,
      status,
      metrics: {
        vibrationRMS: Number(vib.toFixed(2)),
        bearingTemp: Number(temp.toFixed(1)),
        suctionPressure: Number((arch.baseRPM > 5000 ? 28.0 + (seq % 8) : 4.0 + (seq % 3)).toFixed(1)),
        dischargePressure: Number((arch.baseRPM > 5000 ? 165.0 + (seq % 20) : 18.0 + (seq % 6)).toFixed(1)),
        rotorRPM: arch.baseRPM + ((seq * 13) % 80) - 40,
        lubeOilNAS: lubeNAS,
        acousticDB: Number((76 + ((seq * 3) % 18)).toFixed(1)),
        motorCurrent: Math.round((arch.baseKW / 1.732 / 0.4 / 0.9) * (loadPct / 100))
      },
      customThresholds: thresh,
      notes: [],
      isArchived: false,
      rulDays,
      mtbfHours,
      runtimeHours,
      lastOverhaul: `2025-0${Math.max(1, 12 - (seq % 8))}-10`,
      nextScheduledService: `2026-1${(seq % 3) + 0}-15`,
      alarm,
      components,
      oem,
      model: `${oem.split(' ')[0]}-${arch.prefix}-Model-${(seq % 6) + 1}`,
      operatingLoadPct: loadPct,
      energyKW: Math.round(arch.baseKW * (loadPct / 100)),
      novaInsight
    });

    existingIds.add(id.toUpperCase());
    seq++;
  }

  // Update units count on plants
  plants.forEach(p => {
    p.unitsCount = machines.filter(m => m.plantId === p.id).length;
  });

  // Generate 8 SCADA sensors per machine
  const sensors: DbSensor[] = [];
  machines.forEach(m => {
    const sVib: DbSensor = {
      id: `SEN-${m.id}-VIB`,
      workspaceId,
      machineId: m.id,
      plantId: m.plantId,
      channelName: 'Overall Vibration RMS',
      scadaTag: `${m.tag}:VIB.RMS`,
      measurementType: 'vibration',
      unit: 'mm/s',
      currentValue: m.metrics.vibrationRMS,
      warningLimit: m.customThresholds?.vibWarning || 3.5,
      criticalLimit: m.customThresholds?.vibCritical || 4.5,
      samplingRateHz: 10000,
      lastReadingTimestamp: new Date().toISOString(),
      status: m.metrics.vibrationRMS >= (m.customThresholds?.vibCritical || 4.5) ? 'critical' : m.metrics.vibrationRMS >= (m.customThresholds?.vibWarning || 3.5) ? 'warning' : 'nominal'
    };

    const sTemp: DbSensor = {
      id: `SEN-${m.id}-TEMP`,
      workspaceId,
      machineId: m.id,
      plantId: m.plantId,
      channelName: 'Drive End Bearing Metal Temperature',
      scadaTag: `${m.tag}:TEMP.RTD_DE`,
      measurementType: 'temperature',
      unit: '°C',
      currentValue: m.metrics.bearingTemp,
      warningLimit: m.customThresholds?.tempWarning || 80,
      criticalLimit: m.customThresholds?.tempCritical || 90,
      samplingRateHz: 1,
      lastReadingTimestamp: new Date().toISOString(),
      status: m.metrics.bearingTemp >= (m.customThresholds?.tempCritical || 90) ? 'critical' : m.metrics.bearingTemp >= (m.customThresholds?.tempWarning || 80) ? 'warning' : 'nominal'
    };

    const sPres: DbSensor = {
      id: `SEN-${m.id}-PRES`,
      workspaceId,
      machineId: m.id,
      plantId: m.plantId,
      channelName: 'Discharge Process Pressure',
      scadaTag: `${m.tag}:PRES.DISCHARGE`,
      measurementType: 'pressure',
      unit: 'bar',
      currentValue: m.metrics.dischargePressure,
      warningLimit: m.customThresholds?.pressWarning || 180,
      criticalLimit: m.customThresholds?.pressCritical || 200,
      samplingRateHz: 10,
      lastReadingTimestamp: new Date().toISOString(),
      status: 'nominal'
    };

    const sRpm: DbSensor = {
      id: `SEN-${m.id}-RPM`,
      workspaceId,
      machineId: m.id,
      plantId: m.plantId,
      channelName: 'Shaft Speed Keyphasor',
      scadaTag: `${m.tag}:SPEED.RPM`,
      measurementType: 'speed',
      unit: 'RPM',
      currentValue: m.metrics.rotorRPM,
      warningLimit: m.customThresholds?.rpmLimit ? m.customThresholds.rpmLimit * 0.95 : 12000,
      criticalLimit: m.customThresholds?.rpmLimit || 13000,
      samplingRateHz: 100,
      lastReadingTimestamp: new Date().toISOString(),
      status: 'nominal'
    };

    const sOil: DbSensor = {
      id: `SEN-${m.id}-OIL`,
      workspaceId,
      machineId: m.id,
      plantId: m.plantId,
      channelName: 'Lube Oil Particulate Cleanliness',
      scadaTag: `${m.tag}:OIL.NAS`,
      measurementType: 'oil_cleanliness',
      unit: 'NAS 1638 Class',
      currentValue: m.metrics.lubeOilNAS,
      warningLimit: 6,
      criticalLimit: 8,
      samplingRateHz: 0.1,
      lastReadingTimestamp: new Date().toISOString(),
      status: m.metrics.lubeOilNAS >= 8 ? 'critical' : m.metrics.lubeOilNAS >= 6 ? 'warning' : 'nominal'
    };

    const sAcu: DbSensor = {
      id: `SEN-${m.id}-ACU`,
      workspaceId,
      machineId: m.id,
      plantId: m.plantId,
      channelName: 'High-Frequency Acoustic Emission',
      scadaTag: `${m.tag}:ACU.DB`,
      measurementType: 'acoustic',
      unit: 'dB',
      currentValue: m.metrics.acousticDB,
      warningLimit: 85,
      criticalLimit: 95,
      samplingRateHz: 25000,
      lastReadingTimestamp: new Date().toISOString(),
      status: m.metrics.acousticDB >= 95 ? 'critical' : m.metrics.acousticDB >= 85 ? 'warning' : 'nominal'
    };

    const sCurr: DbSensor = {
      id: `SEN-${m.id}-CURR`,
      workspaceId,
      machineId: m.id,
      plantId: m.plantId,
      channelName: 'Stator Motor Phase Current',
      scadaTag: `${m.tag}:ELEC.CURRENT`,
      measurementType: 'current',
      unit: 'A',
      currentValue: m.metrics.motorCurrent,
      warningLimit: 400,
      criticalLimit: 500,
      samplingRateHz: 50,
      lastReadingTimestamp: new Date().toISOString(),
      status: 'nominal'
    };

    const sPwr: DbSensor = {
      id: `SEN-${m.id}-PWR`,
      workspaceId,
      machineId: m.id,
      plantId: m.plantId,
      channelName: 'Electrical Power Consumption',
      scadaTag: `${m.tag}:ELEC.KW`,
      measurementType: 'power',
      unit: 'kW',
      currentValue: m.energyKW,
      warningLimit: (m.customThresholds?.energyThreshold || 500) * 0.9,
      criticalLimit: m.customThresholds?.energyThreshold || 500,
      samplingRateHz: 1,
      lastReadingTimestamp: new Date().toISOString(),
      status: 'nominal'
    };

    sensors.push(sVib, sTemp, sPres, sRpm, sOil, sAcu, sCurr, sPwr);
  });

  // Generate 24 hourly telemetry points per machine
  const telemetry: DbTelemetryPoint[] = [];
  const now = Date.now();
  machines.forEach(m => {
    for (let i = 23; i >= 0; i--) {
      const ts = new Date(now - i * 3600 * 1000).toISOString();
      const rad = ((23 - i) / 23) * Math.PI * 2;
      const diurnal = Math.sin(rad) * 1.5;
      const noise = (Math.sin(i * 3.7) + Math.cos(i * 1.3)) * 0.15;

      let vib = m.metrics.vibrationRMS + noise;
      let temp = m.metrics.bearingTemp + diurnal + noise * 2;
      let kw = m.energyKW + noise * 10;
      let load = m.operatingLoadPct + noise * 1.5;

      // Excursion in last 4 hours for warning/critical machines
      if ((m.status === 'warning' || m.status === 'critical') && i <= 4) {
        const factor = (5 - i) / 5;
        vib += factor * (m.status === 'critical' ? 1.8 : 0.9);
        temp += factor * (m.status === 'critical' ? 8.5 : 4.0);
      }

      telemetry.push({
        id: `TEL-${m.id}-${i}`,
        workspaceId,
        machineId: m.id,
        timestamp: ts,
        vibrationRMS: Number(vib.toFixed(2)),
        bearingTemp: Number(temp.toFixed(1)),
        suctionPressure: m.metrics.suctionPressure,
        dischargePressure: m.metrics.dischargePressure,
        rotorRPM: m.metrics.rotorRPM,
        lubeOilNAS: m.metrics.lubeOilNAS,
        acousticDB: m.metrics.acousticDB,
        motorCurrent: m.metrics.motorCurrent,
        energyKW: Math.round(kw),
        operatingLoadPct: Math.round(load)
      });
    }
  });

  // Machine Health & Risk collections
  const machineHealthList: DbMachineHealth[] = machines.map(m => ({
    id: `HLT-${m.id}`,
    workspaceId,
    machineId: m.id,
    overallScore: m.healthScore,
    mechanicalHealth: Math.min(100, Math.max(30, Math.round(m.healthScore + (m.metrics.vibrationRMS > 4.0 ? -15 : 5)))),
    electricalHealth: Math.min(100, Math.max(40, Math.round(m.healthScore + 4))),
    thermalHealth: Math.min(100, Math.max(25, Math.round(m.healthScore + (m.metrics.bearingTemp > 85 ? -20 : 2)))),
    lubricationHealth: Math.min(100, Math.max(30, Math.round(m.healthScore + (m.metrics.lubeOilNAS > 6 ? -18 : 6)))),
    rulDays: m.rulDays,
    calculatedAt: new Date().toISOString()
  }));

  const machineRiskList: DbMachineRisk[] = machines.map(m => {
    const isCritical = m.status === 'critical';
    const isWarning = m.status === 'warning';
    const prob = isCritical ? 78 : isWarning ? 42 : 8;
    const consequence = m.criticality === 'Tier 1 Critical' ? 9 : m.criticality === 'Tier 2 Essential' ? 6 : 3;
    const exposure = consequence * (isCritical ? 4200 : isWarning ? 1800 : 250);

    return {
      id: `RSK-${m.id}`,
      workspaceId,
      machineId: m.id,
      riskCategory: m.risk,
      failureProbabilityPct: prob,
      consequenceRating: consequence,
      financialExposurePerHourUSD: exposure,
      primaryRiskDriver: isCritical ? 'Hydrodynamic bearing tilt-pad thermal fatigue & sub-synchronous vibration whirl' : isWarning ? 'Lubrication breakdown & acoustic defect harmonics' : 'Nominal wear trajectory',
      evaluatedAt: new Date().toISOString()
    };
  });

  // Anomalies collection
  const anomalies: DbAnomaly[] = [
    {
      id: 'ANOM-204-01',
      workspaceId,
      machineId: 'C-204',
      plantId: 'lucknow-mf',
      title: 'Bearing Hydrodynamic Wedge Thermal Shearing',
      description: 'Sub-synchronous 0.46X fluid whirl vibration harmonic detected on DE tilt-pad journal bearing under 94% operating load.',
      severity: 'critical',
      status: 'active',
      detectedMetric: 'vibrationRMS',
      observedValue: '4.12 mm/s',
      baselineValue: '2.10 mm/s',
      timestamp: '2026-09-24T06:15:00.000Z',
      rootCauseHypothesis: 'Lube oil supply temperature elevated to 56°C leading to viscosity reduction and hydrodynamic wedge instability.'
    },
    {
      id: 'ANOM-109-01',
      workspaceId,
      machineId: 'CV-109',
      plantId: 'lucknow-mf',
      title: 'Planetary Gearbox Pinion Tooth Acoustic Spike',
      description: 'Ultrasonic acoustic emission spike at 2.4 kHz tooth mesh frequency correlated with motor stator Class F thermal threshold breach.',
      severity: 'critical',
      status: 'active',
      detectedMetric: 'bearingTemp',
      observedValue: '94.6 °C',
      baselineValue: '58.0 °C',
      timestamp: '2026-09-24T04:30:00.000Z',
      rootCauseHypothesis: 'Slag dust particle ingress through labyrinth seal into planetary gearbox drive loop.'
    },
    {
      id: 'ANOM-118-01',
      workspaceId,
      machineId: 'P-118',
      plantId: 'rotterdam-b4',
      title: 'Cryogenic Pump Outboard Outer Race Defect',
      description: 'BPFO outer race defect harmonic 142 Hz detected on roller bearing with buffer pressure oscillation.',
      severity: 'warning',
      status: 'active',
      detectedMetric: 'vibrationRMS',
      observedValue: '3.74 mm/s',
      baselineValue: '1.80 mm/s',
      timestamp: '2026-09-23T18:20:00.000Z',
      rootCauseHypothesis: 'Thermal contraction unevenness during cold start sequence.'
    }
  ];

  // Incidents collection
  const incidents: DbIncident[] = [
    {
      id: 'INC-7041',
      workspaceId,
      machineId: 'C-204',
      plantId: 'lucknow-mf',
      incidentNumber: 'INC-2026-7041',
      title: 'C-204 Turbocompressor Axial Vibration & Thermal Surge Alarm',
      severity: 'critical',
      status: 'investigating',
      summary: 'DE journal tilt-pad bearing temperature elevated to 88.4°C with 1X/2X shaft vibration exceeding ISO 10816-3 Zone B limit (4.12 mm/s).',
      reportedBy: 'SCADA Alarm Telemetry Engine',
      assignedEngineer: 'Anubhuti Pal',
      openedAt: '2026-09-21T08:14:00.000Z',
      downtimeMinutes: 0
    },
    {
      id: 'INC-5102',
      workspaceId,
      machineId: 'CV-109',
      plantId: 'lucknow-mf',
      incidentNumber: 'INC-2026-5102',
      title: 'CV-109 Slag Conveyor Dual Drive Gearbox Thermal Trip Alarm',
      severity: 'critical',
      status: 'investigating',
      summary: 'Drive-end stator temperature surged to 94.6°C with 5.85 mm/s vibration excursion on planetary pinion mesh.',
      reportedBy: 'Foundry Shift Operator Rajesh',
      assignedEngineer: 'Elena Vance',
      openedAt: '2026-09-23T11:05:00.000Z',
      downtimeMinutes: 45
    }
  ];

  // Maintenance records collection
  const maintenance: DbMaintenanceRecord[] = [
    {
      id: 'WO-8821',
      workspaceId,
      machineId: 'C-204',
      workOrderNumber: 'WO-2026-8821',
      type: 'Preventive Overhaul',
      status: 'Scheduled',
      priority: 'Critical',
      dueDate: '2026-10-05',
      technician: 'Anubhuti Pal (Lead Diagnostics)',
      description: 'Lube oil skid heat exchanger cleaning and tilt-pad bearing hydrodynamic clearance measurement.',
      partsReplaced: ['Lube oil cartridge 10µm', 'Dry gas seal buffer filter'],
      estimatedHours: 6.0
    },
    {
      id: 'WO-8794',
      workspaceId,
      machineId: 'CV-109',
      workOrderNumber: 'WO-2026-8794',
      type: 'Corrective Alignment',
      status: 'Scheduled',
      priority: 'High',
      dueDate: '2026-09-28',
      technician: 'Sanjay Verma (Mechanical Team)',
      description: 'Replace transfer chute 4B skirting and flush planetary gearbox lubrication loop to eliminate abrasive slag ingress.',
      partsReplaced: ['Labyrinth seal rings', 'Planetary oil ISO VG 320 (200L)'],
      estimatedHours: 4.5
    },
    {
      id: 'WO-8650',
      workspaceId,
      machineId: 'BFP-01',
      workOrderNumber: 'WO-2026-8650',
      type: 'Preventive Overhaul',
      status: 'Completed',
      priority: 'Routine',
      dueDate: '2026-01-10',
      completedDate: '2026-01-10',
      technician: 'Rajesh Kulkarni',
      description: 'Annual supercritical boiler feed pump baseline inspection. Laser shaft alignment and mechanical seal leakage check.',
      partsReplaced: ['Mechanical seal secondary O-rings', 'Alignment shims 0.05mm'],
      estimatedHours: 5.0,
      actualHours: 4.5
    }
  ];

  // Prescriptive recommendations
  const recommendations: DbRecommendation[] = [
    {
      id: 'REC-204-01',
      workspaceId,
      machineId: 'C-204',
      title: 'De-rate C-204 Operating Load to 84% & Verify Lube Cooler HEX-204',
      action: 'Temporarily reduce compressor throughput from 94% to 84% to drop tilt-pad bearing temperature below 80°C until lube oil heat exchanger cleaning is performed.',
      urgency: 'Immediate',
      expectedImpact: 'Prevents hydrodynamic oil wedge collapse and eliminates risk of catastrophic bearing wipe ($320k replacement cost).',
      confidencePct: 94,
      status: 'Proposed'
    },
    {
      id: 'REC-109-01',
      workspaceId,
      machineId: 'CV-109',
      title: 'Flush Planetary Gearbox & Install Pressurized Air Purge Labyrinth Seal',
      action: 'Flush planetary gearbox oil to eliminate NAS 9 slag dust particulate and install positive air-purge line on labyrinth dust seal.',
      urgency: 'Within 24 Hours',
      expectedImpact: 'Extends gearbox pinion remaining useful life by 6 months and reduces tooth mesh acoustic vibration by 45%.',
      confidencePct: 91,
      status: 'Proposed'
    }
  ];

  // RCA Investigations
  const investigations: DbInvestigation[] = [
    {
      id: 'INV-2048',
      workspaceId,
      userId,
      incidentId: 'INC-7041',
      plantId: 'lucknow-mf',
      title: 'C-204 Turbocompressor Axial Vibration & Thermal Surge Investigation',
      assetId: 'C-204',
      assetName: 'Centrifugal Turbocompressor C-204',
      tag: 'CMP-HP-204A',
      severity: 'critical',
      status: 'in_progress',
      currentStep: 3,
      stepsCompleted: [true, true, false, false],
      timestamp: '2026-09-21T08:30:00.000Z',
      updatedAt: '2026-09-24T06:45:00.000Z',
      shift: 'Morning Shift A (06:00 - 14:00)',
      summary: 'Centrifugal turbocompressor C-204 experienced an unpredicted 1X/2X shaft vibration elevation to 4.12 mm/s coupled with drive-end tilt pad metal temperature surge to 88.4°C under 94% continuous base load.',
      fiveWhys: [
        'Why did vibration alarm trigger? → Shaft vibration escalated to 4.12 mm/s exceeding ISO 10816-3 Zone B limit (4.5 mm/s critical threshold).',
        'Why did shaft vibration escalate? → Drive-end tilt-pad journal bearing developed hydrodynamic oil wedge destabilization (0.46X fluid whirl).',
        'Why did oil wedge destabilize? → Lube oil supply temperature rose from 42°C baseline to 56°C, causing dynamic oil film viscosity thinning.',
        'Why did lube oil temperature rise? → Primary Shell-and-Tube Heat Exchanger HEX-204 cooling water side suffered biological fouling and mineral scaling.',
        'Why was cooling water fouling unmitigated? → Secondary biocide metering pump on auxiliary cooling loop failed 72 hours prior without SCADA differential alert.'
      ],
      rootCauseDirect: 'Lube oil supply temperature rise to 56°C leading to dynamic hydrodynamic oil wedge thinning and sub-synchronous fluid whirl.',
      rootCauseRoot: 'Cooling tower secondary biocide chemical metering pump failure combined with delayed tube-bundle delta-T differential alarming on HEX-204.',
      confidence: 94,
      hypotheses: [
        {
          id: 'hyp-01',
          title: 'Mechanical Rotor Unbalance or Impeller Mass Loss',
          probability: 12,
          status: 'disproven',
          evidence: 'FFT vibration spectrum lacks dominant 1X synchronous phase angle shift. Dynamic balance signature remains within 0.04 mm/s tolerance.'
        },
        {
          id: 'hyp-02',
          title: 'Hydrodynamic Tilt-Pad Oil Film Thinning due to Cooling Exchanger Loss',
          probability: 94,
          status: 'confirmed',
          evidence: 'Thermal correlation r=0.96 between HEX-204 oil supply temperature and tilt-pad bearing RTD temperature. Oil viscosity decreased by 28%.'
        },
        {
          id: 'hyp-03',
          title: 'Flexible Disc Pack Coupling Misalignment',
          probability: 18,
          status: 'disproven',
          evidence: 'Laser alignment check confirmed axial offset < 0.02 mm and angular deflection < 0.04 degrees.'
        }
      ],
      sensorEvidence: [
        { parameter: 'DE Bearing Temperature', value: '88.4 °C', baseline: '68.0 °C', deviation: '+20.4 °C (+30%)', severity: 'Critical' },
        { parameter: 'Overall Vibration RMS', value: '4.12 mm/s', baseline: '2.10 mm/s', deviation: '+2.02 mm/s (+96%)', severity: 'Critical' },
        { parameter: 'Lube Oil Supply Temp', value: '56.2 °C', baseline: '42.0 °C', deviation: '+14.2 °C (+34%)', severity: 'Warning' },
        { parameter: 'Sub-synchronous Whirl Harmonic', value: '0.46X', baseline: '0.00X', deviation: 'Fluid Whirl Peak', severity: 'Critical' }
      ],
      capaActions: [
        { id: 'capa-01', action: 'Immediately clean Shell-and-Tube Heat Exchanger HEX-204 tube bundle and flush cooling water side', owner: 'Sanjay Verma', deadline: '2026-09-26', status: 'In Progress' },
        { id: 'capa-02', action: 'Install continuous redundant SCADA differential temperature alert on lube oil heat exchanger inlet/outlet', owner: 'Elena Vance', deadline: '2026-10-02', status: 'Pending' },
        { id: 'capa-03', action: 'De-rate C-204 to 84% load until oil temperature normalizes below 44°C', owner: 'Anubhuti Pal', deadline: '2026-09-24', status: 'Completed' }
      ],
      operatorNotes: 'Operator verified local lube skid pressure at 3.2 bar. Oil sample pulled for ICP-OES spectrometry.',
      notes: [
        {
          id: 'in-nt-01',
          investigationId: 'INV-2048',
          userId,
          userName: 'Anubhuti Pal',
          note: 'Spectrometry lab preliminary report confirms no babbitt metal wear particles in oil, indicating hydrodynamic oil film has not collapsed entirely.',
          timestamp: '2026-09-23T14:10:00.000Z'
        }
      ]
    }
  ];

  // Regulatory Dossiers and Reports
  const reports: DbReport[] = [
    {
      id: 'rep-iso-204',
      workspaceId,
      reportNumber: 'REP-2026-ISO-0941',
      name: 'ISO 55001 Turbomachinery Integrity Dossier — C-204',
      type: 'iso_dossier',
      typeLabel: 'ISO 55001 Asset Integrity Audit',
      plantId: 'lucknow-mf',
      machineId: 'C-204',
      machineOrPlant: 'Centrifugal Turbocompressor C-204',
      createdDate: '2026-09-22',
      updatedDate: '2026-09-23',
      version: 2,
      versions: [
        {
          versionNumber: 1,
          date: '2026-09-22',
          author: 'Anubhuti Pal',
          summary: 'Initial incident audit and ISO 10816 Zone B excursion telemetry capture.'
        },
        {
          versionNumber: 2,
          date: '2026-09-23',
          author: 'Anubhuti Pal',
          summary: 'Updated with HEX-204 heat exchanger thermal correlation and CAPA actions.'
        }
      ],
      isArchived: false,
      status: 'Under Review',
      generatedBy: 'Anubhuti Pal',
      summary: 'Formal asset condition assessment following high-vibration event. Verifies alignment with ISO 10816-3 Zone B and API 670 vibration shutdown thresholds.',
      standardsCompliance: ['ISO 55001:2014 Asset Management', 'ISO 10816-3 Mechanical Vibration', 'API 670 Machinery Protection Systems'],
      sections: {
        executiveSummary: 'Centrifugal process compressor C-204 operates within elevated risk threshold pending heat exchanger overhaul. Current RUL calculated at 18 days.',
        telemetryAudit: 'Vibration RMS 4.12 mm/s, bearing metal temperature 88.4°C.',
        correctiveActionPlan: 'Heat exchanger tube bundle clean scheduled for Sep 26, 2026.'
      }
    }
  ];

  // Notifications
  const notifications: DbNotification[] = [
    {
      id: 'notif-01',
      workspaceId,
      userId,
      type: 'critical',
      severity: 'critical',
      title: 'Critical Alarm: Turbocompressor C-204 Vibration Excursion',
      message: 'C-204 DE journal bearing vibration escalated to 4.12 mm/s (critical limit: 4.50 mm/s).',
      description: 'ISO 10816 Zone B exceeded. Correlated with 88.4°C bearing metal temperature.',
      timestamp: '2026-09-24T06:15:00.000Z',
      relatedMachineId: 'C-204',
      relatedIncidentId: 'INC-7041',
      isRead: false
    },
    {
      id: 'notif-02',
      workspaceId,
      userId,
      type: 'warning',
      severity: 'warning',
      title: 'Thermal Drift: Slag Conveyor CV-109 Stator Peak',
      message: 'CV-109 motor stator temperature surged to 94.6°C approaching Class F insulation limit.',
      timestamp: '2026-09-24T04:30:00.000Z',
      relatedMachineId: 'CV-109',
      relatedIncidentId: 'INC-5102',
      isRead: false
    }
  ];

  // Activity logs
  const activityLogs: DbActivityLog[] = [
    {
      id: 'act-01',
      workspaceId,
      userId,
      userName: 'Anubhuti Pal',
      action: 'Opened Root Cause Investigation INV-2048 for C-204',
      date: '2026-09-21T08:30:00.000Z',
      relatedObjectType: 'investigation',
      relatedObjectId: 'INV-2048',
      details: 'Assessed 5-Whys and confirmed oil supply temperature correlation.'
    },
    {
      id: 'act-02',
      workspaceId,
      userId,
      userName: 'Anubhuti Pal',
      action: 'Configured custom vibration threshold for C-204 (4.50 mm/s)',
      date: '2026-09-22T10:15:00.000Z',
      relatedObjectType: 'threshold',
      relatedObjectId: 'C-204'
    }
  ];

  return {
    plants,
    productionLines,
    machines,
    sensors,
    telemetry,
    machineHealthList,
    machineRiskList,
    anomalies,
    incidents,
    maintenance,
    recommendations,
    investigations,
    reports,
    notifications,
    activityLogs
  };
}
