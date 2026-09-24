import fs from 'fs';
import path from 'path';
import {
  DbUser,
  DbWorkspace,
  DbPlant,
  DbProductionLine,
  DbMachine,
  DbSensor,
  DbTelemetryPoint,
  DbMachineHealth,
  DbMachineRisk,
  DbAnomaly,
  DbIncident,
  DbMaintenanceRecord,
  DbInvestigation,
  DbRecommendation,
  DbReport,
  DbReportVersion,
  DbSavedView,
  DbDashboardConfig,
  DbAlertPreference,
  DbNotification,
  DbActivityLog,
  DbNovaConversation,
  DbNovaMessage,
  DbMachineThresholds,
  DbMachineNote,
  DbMachineComponent,
  generateSeedDataset
} from './fleetGenerator.ts';

export type {
  DbUser,
  DbWorkspace,
  DbPlant,
  DbProductionLine,
  DbMachine,
  DbSensor,
  DbTelemetryPoint,
  DbMachineHealth,
  DbMachineRisk,
  DbAnomaly,
  DbIncident,
  DbMaintenanceRecord,
  DbInvestigation,
  DbRecommendation,
  DbReport,
  DbReportVersion,
  DbSavedView,
  DbDashboardConfig,
  DbAlertPreference,
  DbNotification,
  DbActivityLog,
  DbNovaConversation,
  DbNovaMessage,
  DbMachineThresholds,
  DbMachineNote,
  DbMachineComponent
};

export interface DbInvestigationNote {
  id: string;
  investigationId: string;
  userId: string;
  userName: string;
  note: string;
  timestamp: string;
}

export interface DbNovaInteraction {
  id: string;
  workspaceId: string;
  userId: string;
  plantId?: string;
  machineId?: string;
  question: string;
  response: string;
  relatedInvestigationId?: string;
  timestamp: string;
}

/**
 * 25 Firestore-Compatible Entities Schema Definition
 */
export interface DatabaseSchema {
  users: DbUser[];
  workspaces: DbWorkspace[];
  plants: DbPlant[];
  productionLines: DbProductionLine[];
  machines: DbMachine[];
  sensors: DbSensor[];
  telemetry: DbTelemetryPoint[];
  thresholds: any[];
  machineHealth: DbMachineHealth[];
  machineRisk: DbMachineRisk[];
  anomalies: DbAnomaly[];
  incidents: DbIncident[];
  maintenance: DbMaintenanceRecord[];
  investigations: DbInvestigation[];
  investigationNotes: DbInvestigationNote[];
  recommendations: DbRecommendation[];
  reports: DbReport[];
  reportVersions: DbReportVersion[];
  novaConversations: DbNovaConversation[];
  novaMessages: DbNovaMessage[];
  savedViews: DbSavedView[];
  dashboardConfigs: DbDashboardConfig[];
  alertPreferences: DbAlertPreference[];
  notifications: DbNotification[];
  activityLogs: DbActivityLog[];
  novaInteractions: DbNovaInteraction[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'industrix_db.json');

// Plant ID Aliases for cross-system backwards compatibility
export function normalizePlantId(plantId: string | undefined): string {
  if (!plantId) return 'lucknow-mf';
  const clean = plantId.toLowerCase().trim();
  if (clean === 'plt-lucknow' || clean === 'lucknow' || clean === 'lucknow-mf' || clean === 'lko') {
    return 'lucknow-mf';
  }
  if (clean === 'plt-rotterdam' || clean === 'rotterdam' || clean === 'rotterdam-b4' || clean === 'rtm') {
    return 'rotterdam-b4';
  }
  if (clean === 'detroit' || clean === 'detroit-ev02' || clean === 'det') {
    return 'detroit-ev02';
  }
  if (clean === 'permian' || clean === 'permian-st7' || clean === 'prm') {
    return 'permian-st7';
  }
  if (clean === 'plt-pune' || clean === 'pune' || clean === 'yokohama' || clean === 'yokohama-p1' || clean === 'yok') {
    return 'yokohama-p1';
  }
  return plantId;
}

class DatabaseService {
  private db: DatabaseSchema = {
    users: [],
    workspaces: [],
    plants: [],
    productionLines: [],
    machines: [],
    sensors: [],
    telemetry: [],
    thresholds: [],
    machineHealth: [],
    machineRisk: [],
    anomalies: [],
    incidents: [],
    maintenance: [],
    investigations: [],
    investigationNotes: [],
    recommendations: [],
    reports: [],
    reportVersions: [],
    novaConversations: [],
    novaMessages: [],
    savedViews: [],
    dashboardConfigs: [],
    alertPreferences: [],
    notifications: [],
    activityLogs: [],
    novaInteractions: []
  };

  private isLoaded = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (this.isLoaded) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        
        // If the database was initialized with only the 4-machine legacy seed, upgrade to full 158-asset dataset
        if (!parsed.machines || parsed.machines.length < 50 || !parsed.productionLines || !parsed.sensors) {
          console.log('Upgrading Industrix database to full 150+ fleet with 25 Firestore-compatible collections...');
          this.seedInitialData();
          this.saveToDisk();
        } else {
          this.db = {
            ...this.db,
            ...parsed,
            novaConversations: parsed.novaConversations || [],
            novaMessages: parsed.novaMessages || [],
            novaInteractions: parsed.novaInteractions || [],
            productionLines: parsed.productionLines || [],
            sensors: parsed.sensors || [],
            telemetry: parsed.telemetry || [],
            machineHealth: parsed.machineHealth || [],
            machineRisk: parsed.machineRisk || [],
            anomalies: parsed.anomalies || [],
            incidents: parsed.incidents || [],
            maintenance: parsed.maintenance || [],
            recommendations: parsed.recommendations || []
          };
        }
        this.isLoaded = true;
      } else {
        this.seedInitialData();
        this.saveToDisk();
        this.isLoaded = true;
      }
    } catch (err) {
      console.warn('Database initialization warning, generating default seed state:', err);
      this.seedInitialData();
      this.saveToDisk();
      this.isLoaded = true;
    }
  }

  public saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  private seedInitialData() {
    const primaryUserId = 'usr-anubhuti-pal';
    const personalWorkspaceId = 'ws-personal-anubhuti';
    const demoWorkspaceId = 'ws-demo-industrial';

    const users: DbUser[] = [
      {
        id: primaryUserId,
        name: 'Anubhuti Pal',
        email: 'anubhutipal1002@gmail.com',
        passwordHash: 'industrix2026',
        role: 'Chief Reliability Engineer',
        title: 'Principal Rotating Equipment Diagnostic Lead',
        clearance: 'Level 4 / ISA-95 Lead Assessor',
        badgeId: 'ENG-99412',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        workspaceId: personalWorkspaceId,
        createdAt: '2026-09-01T08:00:00.000Z',
        lastLoginAt: new Date().toISOString()
      },
      {
        id: 'usr-demo-operator',
        name: 'Demo Field Operator',
        email: 'operator@industrix.internal',
        passwordHash: 'industrix2026',
        role: 'Field Operations Specialist',
        title: 'Vibration & SCADA Technician',
        clearance: 'Level 2 / Operations Clearance',
        badgeId: 'ENG-44102',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        workspaceId: demoWorkspaceId,
        createdAt: '2026-09-01T08:00:00.000Z'
      }
    ];

    const workspaces: DbWorkspace[] = [
      {
        id: personalWorkspaceId,
        userId: primaryUserId,
        name: "Anubhuti's Industrial Operations",
        description: 'Primary industrial manufacturing workspace and live asset reliability control center',
        industry: 'Automotive & Heavy Rotating Equipment',
        createdAt: '2026-09-01T08:00:00.000Z',
        updatedAt: new Date().toISOString(),
        isDemo: false
      },
      {
        id: demoWorkspaceId,
        userId: 'usr-demo-operator',
        name: 'SIMULATED INDUSTRIAL DEMO WORKSPACE',
        description: 'Synthetic industrial facility testbed for demonstration, ISO compliance audits, and AI diagnostics testing.',
        industry: 'Multi-Facility Discrete & Continuous Manufacturing',
        createdAt: '2026-09-01T08:00:00.000Z',
        updatedAt: new Date().toISOString(),
        isDemo: true
      }
    ];

    // Generate full dataset for personal workspace
    const personalData = generateSeedDataset(personalWorkspaceId, primaryUserId);
    // Generate dataset for demo workspace
    const demoData = generateSeedDataset(demoWorkspaceId, 'usr-demo-operator');

    this.db = {
      users,
      workspaces,
      plants: [...personalData.plants, ...demoData.plants],
      productionLines: [...personalData.productionLines, ...demoData.productionLines],
      machines: [...personalData.machines, ...demoData.machines],
      sensors: [...personalData.sensors, ...demoData.sensors],
      telemetry: [...personalData.telemetry, ...demoData.telemetry],
      thresholds: [],
      machineHealth: [...personalData.machineHealthList, ...demoData.machineHealthList],
      machineRisk: [...personalData.machineRiskList, ...demoData.machineRiskList],
      anomalies: [...personalData.anomalies, ...demoData.anomalies],
      incidents: [...personalData.incidents, ...demoData.incidents],
      maintenance: [...personalData.maintenance, ...demoData.maintenance],
      recommendations: [...personalData.recommendations, ...demoData.recommendations],
      investigations: [...personalData.investigations, ...demoData.investigations],
      investigationNotes: [],
      reports: [...personalData.reports, ...demoData.reports],
      reportVersions: [],
      novaConversations: [],
      novaMessages: [],
      savedViews: [
        {
          id: 'view-high-risk',
          workspaceId: personalWorkspaceId,
          userId: primaryUserId,
          name: 'Critical & High Risk Assets',
          filters: { risk: 'HIGH', status: 'critical' },
          createdAt: '2026-09-10T12:00:00.000Z'
        },
        {
          id: 'view-compressors',
          workspaceId: personalWorkspaceId,
          userId: primaryUserId,
          name: 'All Process Compressors',
          filters: { search: 'Compressor' },
          createdAt: '2026-09-12T14:00:00.000Z'
        }
      ],
      dashboardConfigs: [
        {
          id: `dash-${personalWorkspaceId}`,
          workspaceId: personalWorkspaceId,
          userId: primaryUserId,
          visibleKpis: ['oee', 'activeAlarms', 'monitoredNodes', 'plantLoadMW'],
          preferredMetrics: ['vibrationRMS', 'bearingTemp', 'dischargePressure'],
          defaultTimeRange: '24h',
          defaultPlantId: 'lucknow-mf'
        }
      ],
      alertPreferences: [
        {
          id: `pref-${personalWorkspaceId}`,
          workspaceId: personalWorkspaceId,
          userId: primaryUserId,
          temperature: true,
          vibration: true,
          pressure: true,
          rpm: false,
          energy: true,
          maintenance: true,
          critical: true,
          minSeverity: 'warning'
        }
      ],
      notifications: [...personalData.notifications, ...demoData.notifications],
      activityLogs: [...personalData.activityLogs, ...demoData.activityLogs],
      novaInteractions: []
    };
  }

  // ==========================================
  // USERS & AUTH
  // ==========================================
  public getUserByEmail(email: string): DbUser | undefined {
    this.ensureInitialized();
    return this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): DbUser | undefined {
    this.ensureInitialized();
    return this.db.users.find(u => u.id === id);
  }

  public createUser(userData: Omit<DbUser, 'id' | 'createdAt'>): DbUser {
    this.ensureInitialized();
    const id = `usr-${Date.now()}`;
    const workspaceId = `ws-${Date.now()}`;

    const newWorkspace: DbWorkspace = {
      id: workspaceId,
      userId: id,
      name: `${userData.name}'s Industrial Operations`,
      description: 'Personal industrial monitoring workspace',
      industry: 'Industrial Operations',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false
    };
    this.db.workspaces.push(newWorkspace);

    // Seed new workspace with industrial plant fleet
    const userFleet = generateSeedDataset(workspaceId, id);
    this.db.plants.push(...userFleet.plants);
    this.db.productionLines.push(...userFleet.productionLines);
    this.db.machines.push(...userFleet.machines);
    this.db.sensors.push(...userFleet.sensors);
    this.db.telemetry.push(...userFleet.telemetry);
    this.db.machineHealth.push(...userFleet.machineHealthList);
    this.db.machineRisk.push(...userFleet.machineRiskList);
    this.db.anomalies.push(...userFleet.anomalies);
    this.db.incidents.push(...userFleet.incidents);
    this.db.maintenance.push(...userFleet.maintenance);
    this.db.recommendations.push(...userFleet.recommendations);
    this.db.investigations.push(...userFleet.investigations);
    this.db.reports.push(...userFleet.reports);

    const newUser: DbUser = {
      ...userData,
      id,
      workspaceId,
      createdAt: new Date().toISOString()
    };
    this.db.users.push(newUser);
    this.saveToDisk();
    return newUser;
  }

  // ==========================================
  // WORKSPACES
  // ==========================================
  public getWorkspace(id: string): DbWorkspace | undefined {
    this.ensureInitialized();
    return this.db.workspaces.find(w => w.id === id) || this.db.workspaces[0];
  }

  // ==========================================
  // PLANTS
  // ==========================================
  public getPlants(workspaceId: string): DbPlant[] {
    this.ensureInitialized();
    const list = this.db.plants.filter(p => p.workspaceId === workspaceId);
    return list.length > 0 ? list : this.db.plants.filter(p => p.workspaceId === 'ws-personal-anubhuti');
  }

  public getPlantById(workspaceId: string, id: string): DbPlant | undefined {
    this.ensureInitialized();
    const targetId = normalizePlantId(id);
    return this.db.plants.find(p => (p.workspaceId === workspaceId || p.workspaceId === 'ws-personal-anubhuti') && (p.id === targetId || p.id === id || p.code === id));
  }

  public createPlant(workspaceId: string, plantData: Partial<DbPlant>): DbPlant {
    this.ensureInitialized();
    const newPlant: DbPlant = {
      id: plantData.id || `plt-${Date.now()}`,
      workspaceId,
      code: plantData.code || `PLT-${Date.now().toString().slice(-4)}`,
      name: plantData.name || 'New Facility',
      location: plantData.location || 'Industrial Zone',
      country: plantData.country || 'Global',
      industry: plantData.industry || 'Manufacturing',
      description: plantData.description || 'Industrial production facility',
      productionLinesCount: plantData.productionLinesCount || 2,
      plantManager: plantData.plantManager || 'Lead Engineer',
      operationalStatus: plantData.operationalStatus || 'optimal',
      unitsCount: plantData.unitsCount || 0,
      activeLoadMW: plantData.activeLoadMW || 50.0,
      targetLoadMW: plantData.targetLoadMW || 55.0,
      overallOEE: plantData.overallOEE || 92.0,
      status: plantData.status || 'optimal',
      areas: plantData.areas || ['Production Train A', 'Utilities Island'],
      telemetryStreamStatus: 'ONLINE (10 kHz)',
      ambientTempC: plantData.ambientTempC || 25.0,
      lastSyncTimestamp: new Date().toISOString()
    };
    this.db.plants.push(newPlant);
    this.saveToDisk();
    return newPlant;
  }

  public updatePlant(workspaceId: string, id: string, updates: Partial<DbPlant>): DbPlant | undefined {
    this.ensureInitialized();
    const targetId = normalizePlantId(id);
    const plant = this.db.plants.find(p => p.workspaceId === workspaceId && (p.id === targetId || p.id === id));
    if (plant) {
      Object.assign(plant, updates, { lastSyncTimestamp: new Date().toISOString() });
      this.saveToDisk();
      return plant;
    }
    return undefined;
  }

  public deletePlant(workspaceId: string, id: string): boolean {
    this.ensureInitialized();
    const targetId = normalizePlantId(id);
    const initLen = this.db.plants.length;
    this.db.plants = this.db.plants.filter(p => !(p.workspaceId === workspaceId && (p.id === targetId || p.id === id)));
    if (this.db.plants.length !== initLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // ==========================================
  // PRODUCTION LINES
  // ==========================================
  public getProductionLines(workspaceId: string, plantId?: string): DbProductionLine[] {
    this.ensureInitialized();
    const normPlantId = plantId ? normalizePlantId(plantId) : undefined;
    return this.db.productionLines.filter(l => 
      (l.workspaceId === workspaceId || l.workspaceId === 'ws-personal-anubhuti') &&
      (!normPlantId || l.plantId === normPlantId || l.plantId === plantId)
    );
  }

  // ==========================================
  // MACHINES
  // ==========================================
  public getMachines(workspaceId: string, plantId?: string): DbMachine[] {
    this.ensureInitialized();
    const normPlantId = plantId ? normalizePlantId(plantId) : undefined;
    
    // First try user workspace
    let list = this.db.machines.filter(m => 
      m.workspaceId === workspaceId && 
      !m.isArchived &&
      (!normPlantId || m.plantId === normPlantId || m.plantId === plantId)
    );

    // Fallback to default personal workspace if empty
    if (list.length === 0) {
      list = this.db.machines.filter(m => 
        (m.workspaceId === 'ws-personal-anubhuti' || m.workspaceId === 'ws-demo-industrial') && 
        !m.isArchived &&
        (!normPlantId || m.plantId === normPlantId || m.plantId === plantId)
      );
    }
    return list;
  }

  public getMachineById(workspaceId: string, id: string): DbMachine | undefined {
    this.ensureInitialized();
    const cleanId = id.toUpperCase().replace(/[\s_-]/g, '');
    return this.db.machines.find(m => 
      !m.isArchived && 
      (m.workspaceId === workspaceId || m.workspaceId === 'ws-personal-anubhuti' || m.workspaceId === 'ws-demo-industrial') &&
      (m.id.toUpperCase().replace(/[\s_-]/g, '') === cleanId || m.tag.toUpperCase().replace(/[\s_-]/g, '') === cleanId)
    );
  }

  public createMachine(workspaceId: string, data: Partial<DbMachine>): DbMachine {
    this.ensureInitialized();
    const id = data.id || `MCH-${Date.now().toString().slice(-4)}`;
    const newMachine: DbMachine = {
      id,
      workspaceId,
      plantId: normalizePlantId(data.plantId) || 'lucknow-mf',
      productionLineId: data.productionLineId,
      name: data.name || `Industrial Machine ${id}`,
      type: data.type || 'Rotating Equipment',
      tag: data.tag || `TAG-${id}`,
      productionLine: data.productionLine || 'Line 1',
      plantArea: data.plantArea || 'Production Area',
      location: data.location || 'Facility Floor',
      manufacturer: data.manufacturer || 'OEM Standard',
      installationDate: data.installationDate || '2022-01-01',
      maintenanceInterval: data.maintenanceInterval || '4000 Operating Hours',
      risk: data.risk || 'LOW',
      criticality: data.criticality || 'Tier 2 Essential',
      healthScore: data.healthScore || 90,
      status: data.status || 'nominal',
      metrics: data.metrics || {
        vibrationRMS: 1.8,
        bearingTemp: 62.0,
        suctionPressure: 5.0,
        dischargePressure: 80.0,
        rotorRPM: 3000,
        lubeOilNAS: 4,
        acousticDB: 75.0,
        motorCurrent: 120
      },
      customThresholds: data.customThresholds || {
        tempWarning: 80,
        tempCritical: 90,
        vibWarning: 3.5,
        vibCritical: 4.5,
        pressWarning: 100,
        pressCritical: 120,
        rpmLimit: 3600,
        energyThreshold: 250
      },
      notes: data.notes || [],
      isArchived: false,
      rulDays: data.rulDays || 120,
      mtbfHours: data.mtbfHours || 6500,
      runtimeHours: data.runtimeHours || 5000,
      lastOverhaul: data.lastOverhaul || '2025-10-01',
      nextScheduledService: data.nextScheduledService || '2026-11-01',
      alarm: data.alarm || null,
      components: data.components || [
        { name: 'Drive End Bearing', health: 92, status: 'nominal', detail: 'Nominal limits' },
        { name: 'Shaft Coupling', health: 90, status: 'nominal', detail: 'Laser alignment checked' }
      ],
      oem: data.oem || data.manufacturer || 'Industrial OEM',
      model: data.model || 'Standard-Model',
      operatingLoadPct: data.operatingLoadPct || 80,
      energyKW: data.energyKW || 120,
      novaInsight: data.novaInsight
    };

    this.db.machines.push(newMachine);
    this.saveToDisk();
    return newMachine;
  }

  public updateMachine(workspaceId: string, id: string, updates: Partial<DbMachine>): DbMachine | undefined {
    this.ensureInitialized();
    const machine = this.getMachineById(workspaceId, id);
    if (machine) {
      Object.assign(machine, updates);
      this.saveToDisk();
      return machine;
    }
    return undefined;
  }

  public archiveMachine(workspaceId: string, id: string): DbMachine | undefined {
    this.ensureInitialized();
    const machine = this.getMachineById(workspaceId, id);
    if (machine) {
      machine.isArchived = true;
      this.saveToDisk();
      return machine;
    }
    return undefined;
  }

  public updateThresholds(workspaceId: string, machineId: string, thresholds: DbMachineThresholds): DbMachine | undefined {
    this.ensureInitialized();
    const machine = this.getMachineById(workspaceId, machineId);
    if (machine) {
      machine.customThresholds = { ...machine.customThresholds, ...thresholds };
      // Recalculate status based on new thresholds
      if (machine.metrics) {
        if (machine.metrics.vibrationRMS >= thresholds.vibCritical || machine.metrics.bearingTemp >= thresholds.tempCritical) {
          machine.status = 'critical';
          machine.risk = 'HIGH';
        } else if (machine.metrics.vibrationRMS >= thresholds.vibWarning || machine.metrics.bearingTemp >= thresholds.tempWarning) {
          machine.status = 'warning';
          machine.risk = 'MEDIUM';
        } else {
          machine.status = 'nominal';
          machine.risk = 'LOW';
        }
      }
      this.saveToDisk();
      return machine;
    }
    return undefined;
  }

  public addMachineNote(workspaceId: string, machineId: string, userId: string, userName: string, note: string): DbMachineNote | undefined {
    this.ensureInitialized();
    const machine = this.getMachineById(workspaceId, machineId);
    if (machine) {
      const newNote: DbMachineNote = {
        id: `nt-${Date.now()}`,
        machineId: machine.id,
        userId,
        userName,
        note,
        timestamp: new Date().toISOString()
      };
      machine.notes = machine.notes || [];
      machine.notes.push(newNote);
      this.saveToDisk();
      return newNote;
    }
    return undefined;
  }

  public deleteMachineNote(workspaceId: string, machineId: string, noteId: string): boolean {
    this.ensureInitialized();
    const machine = this.getMachineById(workspaceId, machineId);
    if (machine && machine.notes) {
      const initLen = machine.notes.length;
      machine.notes = machine.notes.filter(n => n.id !== noteId);
      if (machine.notes.length !== initLen) {
        this.saveToDisk();
        return true;
      }
    }
    return false;
  }

  // ==========================================
  // SCADA SENSORS
  // ==========================================
  public getSensors(workspaceId: string, machineId?: string): DbSensor[] {
    this.ensureInitialized();
    return this.db.sensors.filter(s => 
      (s.workspaceId === workspaceId || s.workspaceId === 'ws-personal-anubhuti') &&
      (!machineId || s.machineId.toLowerCase() === machineId.toLowerCase())
    );
  }

  // ==========================================
  // TELEMETRY & HISTORICAL TIME-SERIES
  // ==========================================
  public getTelemetryHistory(workspaceId: string, machineId: string, timeRange = '24h'): DbTelemetryPoint[] {
    this.ensureInitialized();
    const points = this.db.telemetry.filter(t => 
      (t.workspaceId === workspaceId || t.workspaceId === 'ws-personal-anubhuti') &&
      t.machineId.toLowerCase() === machineId.toLowerCase()
    );

    if (points.length > 0) {
      return points.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    // Dynamic generation fallback
    const machine = this.getMachineById(workspaceId, machineId);
    const baseVib = machine?.metrics?.vibrationRMS || 2.1;
    const baseTemp = machine?.metrics?.bearingTemp || 68.0;
    const count = timeRange === '1h' ? 12 : timeRange === '8h' ? 16 : 24;

    const generated: DbTelemetryPoint[] = [];
    const now = Date.now();
    for (let i = count - 1; i >= 0; i--) {
      generated.push({
        id: `gen-${machineId}-${i}`,
        workspaceId,
        machineId,
        timestamp: new Date(now - i * (timeRange === '1h' ? 300000 : 3600000)).toISOString(),
        vibrationRMS: Number((baseVib + Math.sin(i * 1.2) * 0.2).toFixed(2)),
        bearingTemp: Number((baseTemp + Math.cos(i * 0.8) * 1.5).toFixed(1)),
        suctionPressure: machine?.metrics?.suctionPressure || 10,
        dischargePressure: machine?.metrics?.dischargePressure || 150,
        rotorRPM: machine?.metrics?.rotorRPM || 3000,
        lubeOilNAS: machine?.metrics?.lubeOilNAS || 4,
        acousticDB: machine?.metrics?.acousticDB || 76,
        motorCurrent: machine?.metrics?.motorCurrent || 120,
        energyKW: machine?.energyKW || 200,
        operatingLoadPct: machine?.operatingLoadPct || 80
      });
    }
    return generated;
  }

  // ==========================================
  // ANOMALIES, INCIDENTS & MAINTENANCE
  // ==========================================
  public getAnomalies(workspaceId: string, machineId?: string): DbAnomaly[] {
    this.ensureInitialized();
    return this.db.anomalies.filter(a => 
      (a.workspaceId === workspaceId || a.workspaceId === 'ws-personal-anubhuti') &&
      (!machineId || a.machineId.toLowerCase() === machineId.toLowerCase())
    );
  }

  public getIncidents(workspaceId: string, plantId?: string, status?: string): DbIncident[] {
    this.ensureInitialized();
    const normPlantId = plantId ? normalizePlantId(plantId) : undefined;
    return this.db.incidents.filter(i => 
      (i.workspaceId === workspaceId || i.workspaceId === 'ws-personal-anubhuti') &&
      (!normPlantId || i.plantId === normPlantId || i.plantId === plantId) &&
      (!status || status === 'all' || i.status === status)
    );
  }

  public getIncidentById(workspaceId: string, id: string): DbIncident | undefined {
    this.ensureInitialized();
    return this.db.incidents.find(i => 
      (i.workspaceId === workspaceId || i.workspaceId === 'ws-personal-anubhuti') &&
      (i.id.toLowerCase() === id.toLowerCase() || i.incidentNumber.toLowerCase() === id.toLowerCase())
    );
  }

  public saveIncident(workspaceId: string, data: Partial<DbIncident>): DbIncident {
    this.ensureInitialized();
    const existing = data.id ? this.getIncidentById(workspaceId, data.id) : undefined;
    if (existing) {
      Object.assign(existing, data);
      this.saveToDisk();
      return existing;
    }
    const newInc: DbIncident = {
      id: data.id || `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      workspaceId,
      machineId: data.machineId || 'C-204',
      plantId: normalizePlantId(data.plantId) || 'lucknow-mf',
      incidentNumber: data.incidentNumber || `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title || 'Industrial Anomaly Incident',
      severity: data.severity || 'warning',
      status: data.status || 'active',
      summary: data.summary || 'Elevated telemetry excursion detected.',
      reportedBy: data.reportedBy || 'SCADA Telemetry System',
      assignedEngineer: data.assignedEngineer || 'Anubhuti Pal',
      openedAt: data.openedAt || new Date().toISOString()
    };
    this.db.incidents.push(newInc);
    this.saveToDisk();
    return newInc;
  }

  public getMaintenanceRecords(workspaceId: string, machineId?: string): DbMaintenanceRecord[] {
    this.ensureInitialized();
    return this.db.maintenance.filter(m => 
      (m.workspaceId === workspaceId || m.workspaceId === 'ws-personal-anubhuti') &&
      (!machineId || m.machineId.toLowerCase() === machineId.toLowerCase())
    );
  }

  public saveMaintenanceRecord(workspaceId: string, data: Partial<DbMaintenanceRecord>): DbMaintenanceRecord {
    this.ensureInitialized();
    const existing = data.id ? this.db.maintenance.find(m => m.id === data.id) : undefined;
    if (existing) {
      Object.assign(existing, data);
      this.saveToDisk();
      return existing;
    }
    const newMnt: DbMaintenanceRecord = {
      id: data.id || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      workspaceId,
      machineId: data.machineId || 'C-204',
      workOrderNumber: data.workOrderNumber || `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: data.type || 'Preventive Overhaul',
      status: data.status || 'Scheduled',
      priority: data.priority || 'High',
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      technician: data.technician || 'Anubhuti Pal',
      description: data.description || 'Routine scheduled service inspection.',
      estimatedHours: data.estimatedHours || 4.0
    };
    this.db.maintenance.push(newMnt);
    this.saveToDisk();
    return newMnt;
  }

  // ==========================================
  // PRESCRIPTIVE RECOMMENDATIONS
  // ==========================================
  public getRecommendations(workspaceId: string, machineId?: string): DbRecommendation[] {
    this.ensureInitialized();
    return this.db.recommendations.filter(r => 
      (r.workspaceId === workspaceId || r.workspaceId === 'ws-personal-anubhuti') &&
      (!machineId || r.machineId.toLowerCase() === machineId.toLowerCase())
    );
  }

  public applyRecommendation(workspaceId: string, id: string, appliedBy: string): DbRecommendation | undefined {
    this.ensureInitialized();
    const rec = this.db.recommendations.find(r => r.id === id);
    if (rec) {
      rec.status = 'Applied';
      rec.appliedBy = appliedBy;
      rec.appliedAt = new Date().toISOString();
      this.saveToDisk();
      return rec;
    }
    return undefined;
  }

  // ==========================================
  // RCA INVESTIGATIONS
  // ==========================================
  public getInvestigations(workspaceId: string): DbInvestigation[] {
    this.ensureInitialized();
    const list = this.db.investigations.filter(i => i.workspaceId === workspaceId);
    return list.length > 0 ? list : this.db.investigations.filter(i => i.workspaceId === 'ws-personal-anubhuti');
  }

  public getInvestigationById(workspaceId: string, id: string): DbInvestigation | undefined {
    this.ensureInitialized();
    return this.db.investigations.find(i => 
      (i.workspaceId === workspaceId || i.workspaceId === 'ws-personal-anubhuti') && 
      (i.id === id || i.incidentId === id || i.assetId.toLowerCase() === id.toLowerCase())
    );
  }

  public saveInvestigation(workspaceId: string, data: Partial<DbInvestigation>): DbInvestigation {
    this.ensureInitialized();
    const existing = data.id ? this.db.investigations.find(i => i.id === data.id) : undefined;
    if (existing) {
      Object.assign(existing, data, { updatedAt: new Date().toISOString() });
      this.saveToDisk();
      return existing;
    }

    const newInv: DbInvestigation = {
      id: data.id || `INV-${Date.now().toString().slice(-4)}`,
      workspaceId,
      userId: data.userId,
      incidentId: data.incidentId || `INC-${Date.now().toString().slice(-4)}`,
      plantId: normalizePlantId(data.plantId) || 'lucknow-mf',
      title: data.title || `${data.assetName || 'Asset'} RCA Investigation`,
      assetId: data.assetId || 'C-204',
      assetName: data.assetName || 'Industrial Machine',
      tag: data.tag || 'TAG-01',
      severity: data.severity || 'warning',
      status: data.status || 'in_progress',
      currentStep: data.currentStep || 1,
      stepsCompleted: data.stepsCompleted || [true, false, false, false],
      timestamp: data.timestamp || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shift: data.shift || 'Shift A',
      summary: data.summary || 'Root-cause analysis in progress.',
      fiveWhys: data.fiveWhys || [],
      rootCauseDirect: data.rootCauseDirect || '',
      rootCauseRoot: data.rootCauseRoot || '',
      confidence: data.confidence || 85,
      hypotheses: data.hypotheses || [],
      sensorEvidence: data.sensorEvidence || [],
      capaActions: data.capaActions || [],
      operatorNotes: data.operatorNotes || '',
      notes: data.notes || []
    };

    this.db.investigations.push(newInv);
    this.saveToDisk();
    return newInv;
  }

  public addInvestigationNote(workspaceId: string, invId: string, userId: string, userName: string, note: string): DbInvestigationNote | undefined {
    this.ensureInitialized();
    const inv = this.getInvestigationById(workspaceId, invId);
    if (inv) {
      const newNote: DbInvestigationNote = {
        id: `in-nt-${Date.now()}`,
        investigationId: inv.id,
        userId,
        userName,
        note,
        timestamp: new Date().toISOString()
      };
      inv.notes = inv.notes || [];
      inv.notes.push(newNote);
      this.saveToDisk();
      return newNote;
    }
    return undefined;
  }

  // ==========================================
  // REPORTS
  // ==========================================
  public getReports(workspaceId: string): DbReport[] {
    this.ensureInitialized();
    const list = this.db.reports.filter(r => r.workspaceId === workspaceId && !r.isArchived);
    return list.length > 0 ? list : this.db.reports.filter(r => r.workspaceId === 'ws-personal-anubhuti' && !r.isArchived);
  }

  public getReportById(workspaceId: string, id: string): DbReport | undefined {
    this.ensureInitialized();
    return this.db.reports.find(r => 
      (r.workspaceId === workspaceId || r.workspaceId === 'ws-personal-anubhuti') && 
      (r.id === id || r.reportNumber === id)
    );
  }

  public saveReport(workspaceId: string, data: Partial<DbReport>): DbReport {
    this.ensureInitialized();
    const existing = data.id ? this.getReportById(workspaceId, data.id) : undefined;
    if (existing) {
      Object.assign(existing, data, { updatedDate: new Date().toISOString().slice(0, 10) });
      this.saveToDisk();
      return existing;
    }

    const newReport: DbReport = {
      id: data.id || `rep-${Date.now()}`,
      workspaceId,
      reportNumber: data.reportNumber || `REP-2026-${Date.now().toString().slice(-4)}`,
      name: data.name || 'Industrial Diagnostic Report',
      type: data.type || 'diagnostic',
      typeLabel: data.typeLabel || 'Diagnostic Analysis',
      plantId: normalizePlantId(data.plantId) || 'lucknow-mf',
      machineId: data.machineId,
      machineOrPlant: data.machineOrPlant || 'Plant Facility',
      createdDate: new Date().toISOString().slice(0, 10),
      updatedDate: new Date().toISOString().slice(0, 10),
      version: 1,
      versions: [
        {
          versionNumber: 1,
          date: new Date().toISOString().slice(0, 10),
          author: data.generatedBy || 'Reliability Engineer',
          summary: 'Initial report generation.'
        }
      ],
      isArchived: false,
      status: data.status || 'Generated',
      generatedBy: data.generatedBy || 'Anubhuti Pal',
      summary: data.summary || 'Technical equipment evaluation report.',
      standardsCompliance: data.standardsCompliance || ['ISO 55001 Asset Management'],
      sections: data.sections || { executiveSummary: data.summary }
    };

    this.db.reports.push(newReport);
    this.saveToDisk();
    return newReport;
  }

  public createReportVersion(workspaceId: string, reportId: string, author: string, summary: string, changes?: string): DbReport | undefined {
    this.ensureInitialized();
    const report = this.getReportById(workspaceId, reportId);
    if (report) {
      report.version = (report.version || 1) + 1;
      report.updatedDate = new Date().toISOString().slice(0, 10);
      report.versions = report.versions || [];
      report.versions.push({
        versionNumber: report.version,
        date: report.updatedDate,
        author,
        summary,
        changes
      });
      this.saveToDisk();
      return report;
    }
    return undefined;
  }

  // ==========================================
  // SAVED VIEWS
  // ==========================================
  public getSavedViews(workspaceId: string): DbSavedView[] {
    this.ensureInitialized();
    return this.db.savedViews.filter(v => v.workspaceId === workspaceId || v.workspaceId === 'ws-personal-anubhuti');
  }

  public createSavedView(workspaceId: string, userId: string, name: string, filters: any): DbSavedView {
    this.ensureInitialized();
    const newView: DbSavedView = {
      id: `view-${Date.now()}`,
      workspaceId,
      userId,
      name,
      filters,
      createdAt: new Date().toISOString()
    };
    this.db.savedViews.push(newView);
    this.saveToDisk();
    return newView;
  }

  public deleteSavedView(workspaceId: string, id: string): boolean {
    this.ensureInitialized();
    const initLen = this.db.savedViews.length;
    this.db.savedViews = this.db.savedViews.filter(v => !(v.workspaceId === workspaceId && v.id === id));
    if (this.db.savedViews.length !== initLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // ==========================================
  // DASHBOARD & ALERT PREFERENCES
  // ==========================================
  public getDashboardConfig(workspaceId: string, userId: string): DbDashboardConfig {
    this.ensureInitialized();
    const config = this.db.dashboardConfigs.find(c => c.workspaceId === workspaceId && c.userId === userId) ||
                   this.db.dashboardConfigs.find(c => c.workspaceId === workspaceId) ||
                   this.db.dashboardConfigs[0];
    if (config) return config;

    const newConf: DbDashboardConfig = {
      id: `dash-${workspaceId}`,
      workspaceId,
      userId,
      visibleKpis: ['oee', 'activeAlarms', 'monitoredNodes', 'plantLoadMW'],
      preferredMetrics: ['vibrationRMS', 'bearingTemp', 'dischargePressure'],
      defaultTimeRange: '24h',
      defaultPlantId: 'lucknow-mf'
    };
    this.db.dashboardConfigs.push(newConf);
    this.saveToDisk();
    return newConf;
  }

  public updateDashboardConfig(workspaceId: string, userId: string, updates: Partial<DbDashboardConfig>): DbDashboardConfig {
    this.ensureInitialized();
    const config = this.getDashboardConfig(workspaceId, userId);
    Object.assign(config, updates);
    this.saveToDisk();
    return config;
  }

  public getAlertPreferences(workspaceId: string, userId: string): DbAlertPreference {
    this.ensureInitialized();
    const pref = this.db.alertPreferences.find(p => p.workspaceId === workspaceId && p.userId === userId) ||
                 this.db.alertPreferences[0];
    if (pref) return pref;

    const newPref: DbAlertPreference = {
      id: `pref-${workspaceId}`,
      workspaceId,
      userId,
      temperature: true,
      vibration: true,
      pressure: true,
      rpm: false,
      energy: true,
      maintenance: true,
      critical: true,
      minSeverity: 'warning'
    };
    this.db.alertPreferences.push(newPref);
    this.saveToDisk();
    return newPref;
  }

  public updateAlertPreferences(workspaceId: string, userId: string, updates: Partial<DbAlertPreference>): DbAlertPreference {
    this.ensureInitialized();
    const pref = this.getAlertPreferences(workspaceId, userId);
    Object.assign(pref, updates);
    this.saveToDisk();
    return pref;
  }

  // ==========================================
  // NOTIFICATIONS & ACTIVITY LOGS
  // ==========================================
  public getNotifications(workspaceId: string): DbNotification[] {
    this.ensureInitialized();
    return this.db.notifications
      .filter(n => n.workspaceId === workspaceId || n.workspaceId === 'ws-personal-anubhuti')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public markNotificationRead(workspaceId: string, id: string): boolean {
    this.ensureInitialized();
    const notif = this.db.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveToDisk();
      return true;
    }
    return false;
  }

  public getActivityLogs(workspaceId: string): DbActivityLog[] {
    this.ensureInitialized();
    return this.db.activityLogs
      .filter(l => l.workspaceId === workspaceId || l.workspaceId === 'ws-personal-anubhuti')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public logActivity(workspaceId: string, userId: string, userName: string | undefined, action: string, relatedObjectType: string, relatedObjectId: string, details?: string): DbActivityLog {
    this.ensureInitialized();
    const log: DbActivityLog = {
      id: `act-${Date.now()}`,
      workspaceId,
      userId,
      userName: userName || 'Reliability Engineer',
      action,
      date: new Date().toISOString(),
      relatedObjectType,
      relatedObjectId,
      details
    };
    this.db.activityLogs.unshift(log);
    if (this.db.activityLogs.length > 500) {
      this.db.activityLogs.pop();
    }
    this.saveToDisk();
    return log;
  }

  // ==========================================
  // NOVA CONVERSATIONS & CHAT HISTORY
  // ==========================================
  public createNovaConversation(data: {
    userId: string;
    workspaceId: string;
    plantId: string;
    title: string;
    selectedMachineId?: string;
    selectedIncidentId?: string;
    selectedInvestigationId?: string;
  }): DbNovaConversation {
    this.ensureInitialized();
    const newConv: DbNovaConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: data.userId,
      workspaceId: data.workspaceId,
      plantId: normalizePlantId(data.plantId),
      title: data.title || 'New Industrial Consultation',
      selectedMachineId: data.selectedMachineId,
      selectedIncidentId: data.selectedIncidentId,
      selectedInvestigationId: data.selectedInvestigationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.db.novaConversations.unshift(newConv);
    this.saveToDisk();
    return newConv;
  }

  public getNovaConversations(workspaceId: string, userId?: string): DbNovaConversation[] {
    this.ensureInitialized();
    return this.db.novaConversations
      .filter(c => (c.workspaceId === workspaceId || c.workspaceId === 'ws-personal-anubhuti') && (!userId || c.userId === userId))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getNovaConversation(id: string): DbNovaConversation | undefined {
    this.ensureInitialized();
    return this.db.novaConversations.find(c => c.id === id);
  }

  public updateNovaConversation(id: string, updates: Partial<DbNovaConversation>): DbNovaConversation | undefined {
    this.ensureInitialized();
    const conv = this.db.novaConversations.find(c => c.id === id);
    if (conv) {
      Object.assign(conv, updates, { updatedAt: new Date().toISOString() });
      this.saveToDisk();
      return conv;
    }
    return undefined;
  }

  public deleteNovaConversation(id: string): boolean {
    this.ensureInitialized();
    const initLen = this.db.novaConversations.length;
    this.db.novaConversations = this.db.novaConversations.filter(c => c.id !== id);
    this.db.novaMessages = this.db.novaMessages.filter(m => m.conversationId !== id);
    if (this.db.novaConversations.length !== initLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  public searchNovaConversations(workspaceId: string, userId: string, query: string): {
    conversation: DbNovaConversation;
    matchingMessages: DbNovaMessage[];
  }[] {
    this.ensureInitialized();
    const q = query.toLowerCase().trim();
    const userConvs = this.getNovaConversations(workspaceId, userId);

    if (!q) {
      return userConvs.map(c => ({
        conversation: c,
        matchingMessages: []
      }));
    }

    const results: { conversation: DbNovaConversation; matchingMessages: DbNovaMessage[] }[] = [];

    for (const conv of userConvs) {
      const titleMatch = conv.title.toLowerCase().includes(q) ||
        (conv.selectedMachineId && conv.selectedMachineId.toLowerCase().includes(q)) ||
        (conv.selectedIncidentId && conv.selectedIncidentId.toLowerCase().includes(q));

      const messages = this.getNovaMessages(conv.id);
      const matchingMsgs = messages.filter(m => m.content.toLowerCase().includes(q));

      if (titleMatch || matchingMsgs.length > 0) {
        results.push({
          conversation: conv,
          matchingMessages: matchingMsgs
        });
      }
    }

    return results;
  }

  public addNovaMessage(data: {
    conversationId: string;
    userId: string;
    role: 'user' | 'assistant';
    content: string;
    intent?: string;
    toolsUsed?: string[];
    contextSnapshot?: any;
    metadata?: any;
  }): DbNovaMessage {
    this.ensureInitialized();
    const msg: DbNovaMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: data.conversationId,
      userId: data.userId,
      role: data.role,
      content: data.content,
      timestamp: new Date().toISOString(),
      intent: data.intent,
      toolsUsed: data.toolsUsed,
      contextSnapshot: data.contextSnapshot,
      metadata: data.metadata
    };
    this.db.novaMessages.push(msg);

    const conv = this.db.novaConversations.find(c => c.id === data.conversationId);
    if (conv) {
      conv.updatedAt = msg.timestamp;
      if (data.role === 'user' && (conv.title === 'New Industrial Consultation' || !conv.title)) {
        conv.title = data.content.slice(0, 48) + (data.content.length > 48 ? '...' : '');
      }
    }

    this.saveToDisk();
    return msg;
  }

  public getNovaMessages(conversationId: string): DbNovaMessage[] {
    this.ensureInitialized();
    return this.db.novaMessages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public getNovaHistory(workspaceId: string, userId?: string): any[] {
    this.ensureInitialized();
    const convs = this.getNovaConversations(workspaceId, userId);
    return convs.map(c => ({
      conversation: c,
      messages: this.getNovaMessages(c.id)
    }));
  }
}

export const dbService = new DatabaseService();
