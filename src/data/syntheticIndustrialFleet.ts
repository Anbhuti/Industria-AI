/**
 * ============================================================================
 * INDUSTRIX AI // CENTRALIZED SYNTHETIC INDUSTRIAL FLEET GENERATOR
 * ============================================================================
 * 
 * Generates realistic synthetic telemetry, machine health, and operational
 * records for 150+ industrial assets across multiple plants and production lines.
 * 
 * NOTICE:
 * SIMULATED INDUSTRIAL DATA — For demonstration and reliability testing.
 * Does not represent live data from a real physical facility.
 * ============================================================================
 */

import { 
  IndustrialMachine, 
  MachineComponent, 
  MachineTrendPoint, 
  MaintenanceRecord,
  TelemetryMetrics,
  MachineRisk,
  MachineStatus
} from '../types/industrial';
import { INITIAL_MACHINES } from './industrialData';

export const PRODUCTION_LINE_NAMES = [
  'Production Line A',
  'Production Line B',
  'Production Line C',
  'Production Line D',
  'Production Line E',
  'Primary Synthesis Train',
  'Utilities & Cogeneration',
  'Finishing & Precision Cell'
] as const;

export const MACHINE_ARCHETYPES = [
  {
    type: 'Centrifugal Process Compressor',
    prefix: 'CMP',
    oems: ['Sulzer-Siemens', 'Elliott Group', 'Atlas Copco Gas & Process', 'MAN Energy Solutions'],
    baseRPM: 11400,
    baseTemp: 72,
    baseVib: 2.1,
    baseLoad: 85,
    baseKW: 1800,
    criticality: 'Tier 1 Critical' as const,
    components: ['Tilt-Pad Journal Bearings', 'Dry Gas Shaft Seal', 'Multi-Stage Shrouded Impellers', 'Horizontally-Split Casing', 'High-Speed Flexible Coupling']
  },
  {
    type: 'Multi-Stage Boiler Feed Pump',
    prefix: 'BFP',
    oems: ['Flowserve', 'Sulzer Pumps', 'KSB Group', 'Ebara Corporation'],
    baseRPM: 2980,
    baseTemp: 68,
    baseVib: 1.8,
    baseLoad: 78,
    baseKW: 850,
    criticality: 'Tier 1 Critical' as const,
    components: ['Balance Piston & Disc', 'Mechanical Seal Cartridge', 'Diffuser & Barrel Casing', 'Radial Thrust Bearing', 'Shaft Sleeve']
  },
  {
    type: 'High-Torque Induction Motor',
    prefix: 'MTR',
    oems: ['ABB Industrial Drives', 'Siemens Simotics', 'WEG Industries', 'Toshiba Energy'],
    baseRPM: 1485,
    baseTemp: 62,
    baseVib: 1.4,
    baseLoad: 80,
    baseKW: 620,
    criticality: 'Tier 2 Essential' as const,
    components: ['Stator Winding Insulation (Class H)', 'Cast Rotor Cage Bars', 'Drive-End Deep Groove Ball Bearing', 'Cooling Air Fan Cowl', 'Terminal Junction Box']
  },
  {
    type: 'Heavy Slurry Conveyor Drive',
    prefix: 'CNV',
    oems: ['Metso Outotec', 'TAKRAF Group', 'FLSmidth', 'Continental Conveyor'],
    baseRPM: 740,
    baseTemp: 58,
    baseVib: 2.4,
    baseLoad: 75,
    baseKW: 340,
    criticality: 'Tier 2 Essential' as const,
    components: ['Helical Bevel Gear Reducer', 'Fluid Coupler & Backstop', 'Drive Pulley Pillow Block', 'Tensioning Take-Up Carriage', 'Belt Alignment Sensors']
  },
  {
    type: 'Induced Draft Cooling Tower Fan',
    prefix: 'FAN',
    oems: ['Howden', 'SPX Cooling Technologies', 'Hamon & Cie', 'FläktGroup'],
    baseRPM: 480,
    baseTemp: 52,
    baseVib: 2.0,
    baseLoad: 68,
    baseKW: 220,
    criticality: 'Tier 3 Balance' as const,
    components: ['FRP Aerodynamic Blades', 'Right-Angle Gearbox Unit', 'Cardan Drive Shaft', 'Anti-Friction Spherical Roller Bearing', 'Vibration Cutoff Switch']
  },
  {
    type: 'Industrial Gas Turbine Generator',
    prefix: 'GT',
    oems: ['General Electric (GE Vernova)', 'Siemens Energy', 'Mitsubishi Power', 'Solar Turbines'],
    baseRPM: 5100,
    baseTemp: 84,
    baseVib: 1.9,
    baseLoad: 92,
    baseKW: 4500,
    criticality: 'Tier 1 Critical' as const,
    components: ['Axial Compressor Section', 'Low-NOx Combustor Cans', 'Multi-Stage Power Turbine', 'Auxiliary Lube Skid & Fin Fan', 'Hydraulic Stator Vane Actuator']
  },
  {
    type: 'Continuous Twin-Screw Extruder',
    prefix: 'EXT',
    oems: ['Coperion Werner & Pfleiderer', 'KraussMaffei Berstorff', 'Leistritz', 'Toshiba Machine'],
    baseRPM: 600,
    baseTemp: 76,
    baseVib: 2.2,
    baseLoad: 82,
    baseKW: 480,
    criticality: 'Tier 2 Essential' as const,
    components: ['Nitrided Bi-Metallic Barrel', 'Co-Rotating Intermeshing Screw Shafts', 'High-Torque Distribution Gearbox', 'Vacuum Venting Stuffer', 'Die Face Pelletizer']
  },
  {
    type: 'Chemical Agitator Reactor Drive',
    prefix: 'AGT',
    oems: ['Ekato Group', 'Philadelphia Mixing Solutions', 'SPX FLOW Lightnin', 'Chemineer'],
    baseRPM: 120,
    baseTemp: 56,
    baseVib: 1.6,
    baseLoad: 70,
    baseKW: 180,
    criticality: 'Tier 2 Essential' as const,
    components: ['Double Mechanical Seal with Barrier Fluid', 'Rigid Flange Coupling', 'Hydrofoil Mixing Impeller', 'Heavy Duty Thrust Bearing Block', 'Speed Reducer Drive']
  },
  {
    type: 'High-Pressure Hydraulic Power Unit',
    prefix: 'HPU',
    oems: ['Bosch Rexroth', 'Parker Hannifin', 'Moog Industrial', 'Eaton Vickers'],
    baseRPM: 1750,
    baseTemp: 54,
    baseVib: 1.3,
    baseLoad: 72,
    baseKW: 160,
    criticality: 'Tier 2 Essential' as const,
    components: ['Variable Displacement Axial Piston Pump', '10-Micron Pressure Line Filter', 'Bladder Accumulator Bank', 'Proportional Servo Directional Valves', 'Oil Cooler Heat Exchanger']
  },
  {
    type: 'Centrifugal Chiller Compressor',
    prefix: 'CHL',
    oems: ['York (Johnson Controls)', 'Trane Technologies', 'Carrier Commercial', 'Daikin Applied'],
    baseRPM: 8200,
    baseTemp: 48,
    baseVib: 1.2,
    baseLoad: 74,
    baseKW: 520,
    criticality: 'Tier 3 Balance' as const,
    components: ['Magnetic Levitation Active Bearings', 'Variable Geometry Inlet Guide Vanes', 'Semi-Hermetic Direct-Drive Motor', 'Economizer Flash Tank', 'Microchannel Condenser']
  }
];

/**
 * Calculates simulated health score using multi-signal physics correlation:
 * Vibration, Temperature, Pressure, Motor Load, Maintenance history, and Anomalies.
 */
export function calculateMachineHealthScore(metrics: {
  vibrationRMS: number;
  bearingTemp: number;
  motorCurrent?: number;
  lubeOilNAS: number;
  operatingLoadPct?: number;
  hasActiveAnomaly?: boolean;
}): { healthScore: number; risk: MachineRisk; status: MachineStatus } {
  // ISO 10816 Zone vibration limits
  // Zone A/B (< 4.5 mm/s) = Good, Zone C (4.5 - 7.1) = Warning, Zone D (> 7.1) = Critical
  let score = 100;

  // 1. Vibration Penalty
  if (metrics.vibrationRMS > 6.0) {
    score -= 35;
  } else if (metrics.vibrationRMS > 4.5) {
    score -= 22;
  } else if (metrics.vibrationRMS > 3.0) {
    score -= 8;
  }

  // 2. Temperature Penalty
  if (metrics.bearingTemp > 90) {
    score -= 25;
  } else if (metrics.bearingTemp > 80) {
    score -= 15;
  } else if (metrics.bearingTemp > 72) {
    score -= 6;
  }

  // 3. Oil cleanliness (NAS / ISO 4406)
  if (metrics.lubeOilNAS > 8) {
    score -= 12;
  } else if (metrics.lubeOilNAS > 6) {
    score -= 5;
  }

  // 4. Overload penalty
  if (metrics.operatingLoadPct && metrics.operatingLoadPct > 92) {
    score -= 8;
  }

  // 5. Active anomaly multiplier
  if (metrics.hasActiveAnomaly) {
    score -= 15;
  }

  score = Math.max(15, Math.min(99, Math.round(score)));

  let risk: MachineRisk = 'LOW';
  let status: MachineStatus = 'nominal';

  if (score < 70) {
    risk = 'HIGH';
    status = 'critical';
  } else if (score < 85) {
    risk = 'MEDIUM';
    status = 'warning';
  }

  return { healthScore: score, risk, status };
}

/**
 * Procedurally generates realistic 24-point time series trends
 */
export function generateMachineTrends(
  baseTemp: number, 
  baseVib: number, 
  basePressure: number, 
  baseKW: number, 
  loadPct: number,
  isExcursion = false
): MachineTrendPoint[] {
  const points: MachineTrendPoint[] = [];
  const now = Date.now();
  const stepMs = 3600 * 1000; // 1-hour intervals for 24h trend

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now - i * stepMs);
    const hourStr = time.toISOString().slice(11, 16);
    const rad = (23 - i) / 23 * Math.PI * 2;

    // Natural diurnal curve + low micro-jitter
    const diurnal = Math.sin(rad) * 1.8;
    const jitter = (Math.sin(i * 3.7) + Math.cos(i * 1.3)) * 0.25;

    let vib = baseVib + jitter * 0.4;
    let temp = baseTemp + diurnal + jitter;
    let pres = basePressure + jitter * 0.8;
    let kw = baseKW * (loadPct / 100) + jitter * 12;
    let load = loadPct + jitter * 1.2;

    // If unit has an excursion in recent hours, create sharp realistic divergence
    if (isExcursion && i <= 5) {
      const escalationFactor = (6 - i) / 6;
      vib += escalationFactor * 2.2;
      temp += escalationFactor * 14.5;
      pres -= escalationFactor * 0.35; // Lube pressure drop
      kw += escalationFactor * 180;
      load += escalationFactor * 7.5;
    }

    points.push({
      timestamp: hourStr,
      temperature: Number(temp.toFixed(1)),
      vibration: Number(vib.toFixed(2)),
      pressure: Number(pres.toFixed(2)),
      energyKW: Math.round(kw),
      operatingLoadPct: Math.round(load)
    });
  }

  return points;
}

/**
 * Builds the complete 150+ fleet catalog
 */
export function generateFullIndustrialFleet(): IndustrialMachine[] {
  // Preserve the curated core machines first (C-204, P-118, M-042, etc.)
  const fleet: IndustrialMachine[] = [...INITIAL_MACHINES];
  const existingIds = new Set(fleet.map(m => m.id.toUpperCase()));

  // We need at least 150 machines total
  const targetTotal = 158;
  let counter = 1;

  while (fleet.length < targetTotal) {
    const archetypeIndex = (counter - 1) % MACHINE_ARCHETYPES.length;
    const arch = MACHINE_ARCHETYPES[archetypeIndex];
    const lineIndex = (counter - 1) % PRODUCTION_LINE_NAMES.length;
    const prodLine = PRODUCTION_LINE_NAMES[lineIndex];

    const machineNumber = 100 + counter;
    const id = `${arch.prefix}-${machineNumber}`;

    if (existingIds.has(id.toUpperCase())) {
      counter++;
      continue;
    }

    // Determine realistic variability
    const isWarningSeed = counter % 9 === 0;
    const isMaintenanceSeed = counter % 23 === 0;
    const isCriticalSeed = counter % 41 === 0;

    let vib = arch.baseVib + ((counter * 7) % 15) * 0.1;
    let temp = arch.baseTemp + ((counter * 11) % 18) * 0.5;
    let loadPct = Math.min(94, Math.max(65, arch.baseLoad + ((counter * 5) % 15) - 7));
    let lubeNAS = 4 + (counter % 5);

    if (isWarningSeed) {
      vib += 1.8;
      temp += 8.5;
      lubeNAS = 7;
    } else if (isCriticalSeed) {
      vib += 3.2;
      temp += 16.0;
      lubeNAS = 8;
    }

    const { healthScore, risk, status } = calculateMachineHealthScore({
      vibrationRMS: vib,
      bearingTemp: temp,
      lubeOilNAS: lubeNAS,
      operatingLoadPct: loadPct,
      hasActiveAnomaly: isWarningSeed || isCriticalSeed
    });

    const finalStatus: MachineStatus = isMaintenanceSeed ? 'maintenance' : status;
    const finalRisk: MachineRisk = isMaintenanceSeed ? 'MEDIUM' : risk;

    const oem = arch.oems[counter % arch.oems.length];
    const components: MachineComponent[] = arch.components.map((cName, cIdx) => {
      let cHealth = Math.min(100, Math.max(40, healthScore + (cIdx === 0 && finalStatus !== 'nominal' ? -18 : (cIdx * 3) - 4)));
      let cStatus: MachineStatus = cHealth < 65 ? 'critical' : cHealth < 82 ? 'warning' : 'nominal';
      return {
        name: cName,
        health: cHealth,
        status: cStatus,
        detail: cHealth < 70 ? 'Elevated dynamic stress detected' : 'Operating within nominal limits'
      };
    });

    const runtimeHours = 2400 + (counter * 173) % 18000;
    const rulDays = Math.max(12, Math.round((healthScore / 100) * 180));
    const mtbfHours = Math.round(3200 + (healthScore * 35));

    const metrics: TelemetryMetrics = {
      vibrationRMS: Number(vib.toFixed(2)),
      bearingTemp: Number(temp.toFixed(1)),
      suctionPressure: Number((arch.baseRPM > 5000 ? 28.5 + (counter % 8) : 4.2 + (counter % 3)).toFixed(1)),
      dischargePressure: Number((arch.baseRPM > 5000 ? 165.0 + (counter % 20) : 18.5 + (counter % 6)).toFixed(1)),
      rotorRPM: arch.baseRPM + ((counter * 13) % 80) - 40,
      lubeOilNAS: lubeNAS,
      acousticDB: Number((78 + ((counter * 3) % 18)).toFixed(1)),
      motorCurrent: Math.round((arch.baseKW / 1.732 / 0.4 / 0.9) * (loadPct / 100))
    };

    const trends = generateMachineTrends(
      arch.baseTemp,
      arch.baseVib,
      metrics.dischargePressure,
      arch.baseKW,
      loadPct,
      finalStatus === 'critical'
    );

    const pastMonths = (counter % 8) + 1;
    const lastOverhaul = `2025-0${Math.max(1, 12 - pastMonths)}-15`;
    const nextService = `2026-1${(counter % 3) + 0}-10`;

    const maintenanceHistory: MaintenanceRecord[] = [
      {
        id: `MNT-${id}-01`,
        date: lastOverhaul,
        type: counter % 2 === 0 ? 'Preventive Overhaul' : 'Vibration Alignment',
        description: `Routine scheduled overhaul according to OEM interval. Cleaned lube filtration and verified tolerances.`,
        technician: counter % 2 === 0 ? 'Elena Vance (Lead Reliability Eng)' : 'Rajesh Verma (Senior Vibration Analyst)',
        hoursSpent: 4.5,
        partsReplaced: counter % 2 === 0 ? ['Lube filter element', 'Gaskets set'] : ['Alignment shims 0.1mm'],
        status: 'Completed'
      }
    ];

    let alarm: string | null = null;
    let novaInsight: string | undefined = undefined;

    if (finalStatus === 'critical') {
      alarm = `Vibration surge detected (+${Math.round((vib / arch.baseVib - 1) * 100)}% over ISO limit). Correlated bearing thermal drift.`;
      novaInsight = `NOVA diagnostic model flagged multi-signal divergence. Bearing metal temperature and RMS vibration trending upward concurrently.`;
    } else if (finalStatus === 'warning') {
      alarm = `Moderate thermal drift observed on primary sub-assembly. Recommended inspection within 7 days.`;
      novaInsight = `Elevated thermal slope detected during shift cycle. Telemetry cross-correlation indicates potential lubricant flow restriction.`;
    }

    fleet.push({
      id,
      name: `${arch.type} ${id}`,
      type: arch.type,
      tag: `${arch.prefix}-${machineNumber}`,
      plantArea: `${prodLine} — Sector 0${(counter % 4) + 1}`,
      location: prodLine,
      criticality: arch.criticality,
      healthScore,
      status: finalStatus,
      risk: finalRisk,
      runtimeHours,
      operatingLoadPct: loadPct,
      energyKW: Math.round(arch.baseKW * (loadPct / 100)),
      metrics,
      rulDays,
      mtbfHours,
      lastOverhaul,
      nextScheduledService: nextService,
      alarm,
      components,
      oem,
      model: `${oem.split(' ')[0]}-${arch.prefix}-Series ${counter % 5 + 1}`,
      novaInsight,
      maintenanceHistory,
      trends
    });

    existingIds.add(id.toUpperCase());
    counter++;
  }

  return fleet;
}
