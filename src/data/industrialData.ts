import { IndustrialMachine, IncidentInvestigation, IndustrialPlant, UserProfile, SensorChannel } from '../types/industrial';

export const PLANTS: IndustrialPlant[] = [
  {
    id: 'lucknow-mf',
    name: 'Lucknow Manufacturing Facility',
    location: 'Lucknow Industrial Corridor, Uttar Pradesh, India',
    unitsCount: 32,
    activeLoadMW: 124.6,
    overallOEE: 91.2,
    status: 'alert'
  },
  {
    id: 'rotterdam-b4',
    name: 'Rotterdam Synthesis Complex — Train B4',
    location: 'Port of Rotterdam, Netherlands',
    unitsCount: 24,
    activeLoadMW: 142.8,
    overallOEE: 89.4,
    status: 'alert'
  },
  {
    id: 'detroit-ev02',
    name: 'Detroit Propulsion Gigafactory — Line 02',
    location: 'Detroit, Michigan, USA',
    unitsCount: 38,
    activeLoadMW: 88.2,
    overallOEE: 93.6,
    status: 'optimal'
  },
  {
    id: 'permian-st7',
    name: 'Permian Cryogenic Gas Processing — Station 7',
    location: 'Midland, Texas, USA',
    unitsCount: 16,
    activeLoadMW: 210.4,
    overallOEE: 91.2,
    status: 'optimal'
  },
  {
    id: 'yokohama-p1',
    name: 'Yokohama High-Tolerance Aerospace Facility',
    location: 'Yokohama, Kanagawa, Japan',
    unitsCount: 19,
    activeLoadMW: 45.0,
    overallOEE: 95.8,
    status: 'optimal'
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    name: 'Anubhuti',
    email: 'anubhutipal1002@gmail.com',
    title: 'Operations & Reliability Director',
    role: 'Plant Reliability & Operations Director',
    clearance: 'Level 4 — Executive Operations Authority',
    badgeId: 'DIR-2004-AP',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
    plant: 'Lucknow Manufacturing Facility'
  },
  {
    name: 'Dr. Elena Vance',
    email: 'elena.vance@industrix.com',
    title: 'Chief Reliability & Diagnostics Engineer',
    role: 'Vibration & Mechanical Reliability Specialist',
    clearance: 'Level 4 — Autonomous Process Control',
    badgeId: 'ENG-8804-NX',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop',
    plant: 'Lucknow Manufacturing Facility'
  },
  {
    name: 'Marcus Thorne',
    email: 'marcus.thorne@industrix.com',
    title: 'VP of Plant Operations & Asset Health',
    role: 'Plant Operations Director',
    clearance: 'Level 4 — Executive Operations Authority',
    badgeId: 'EXEC-1022-OP',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop',
    plant: 'Lucknow Manufacturing Facility'
  }
];

export const INITIAL_MACHINES: IndustrialMachine[] = [
  {
    id: 'C-204',
    name: 'Industrial Compressor',
    type: 'Centrifugal Process Compressor',
    tag: 'CMP-C-204',
    plantArea: 'Primary Synthesis & Compression Train',
    location: 'Production Line A',
    criticality: 'Tier 1 Critical',
    healthScore: 68,
    status: 'critical',
    risk: 'HIGH',
    runtimeHours: 4280,
    operatingLoadPct: 88,
    energyKW: 1840,
    novaInsight: 'The vibration pattern increased gradually during the last 6 operating cycles. The behavior is consistent with a possible bearing degradation pattern on Drive-End Tilt Pad Bearing #2.',
    metrics: {
      vibrationRMS: 5.76, // 28% above 4.5 mm/s ISO threshold
      bearingTemp: 92.4,
      suctionPressure: 34.8,
      dischargePressure: 182.4,
      rotorRPM: 11420,
      lubeOilNAS: 7,
      acousticDB: 96.4,
      motorCurrent: 384
    },
    rulDays: 24,
    mtbfHours: 4280,
    lastOverhaul: '2025-11-14',
    nextScheduledService: '2026-10-15',
    alarm: 'Vibration exceeded threshold by 28% (5.76 mm/s RMS vs 4.5 mm/s limit). Correlated bearing temperature rise detected.',
    oem: 'Sulzer-Siemens Industrial Turbomachinery',
    model: 'SGT-400 / STC-SV (12 MW)',
    maintenanceHistory: [
      {
        id: 'MNT-C204-01',
        date: '2026-08-14',
        type: 'Vibration Alignment',
        description: 'Laser alignment verification of input drive shaft and flexible disc coupling.',
        technician: 'Rajesh Verma (Senior Vibration Analyst)',
        hoursSpent: 4.5,
        partsReplaced: ['Shims 0.05mm x 4', 'Coupling grease pack'],
        status: 'Completed'
      },
      {
        id: 'MNT-C204-02',
        date: '2026-05-18',
        type: 'Lubrication Service',
        description: 'Turbine lube oil skid filtration cycle and pre-filter cartridge swap.',
        technician: 'Marcus Lindqvist (Reliability Eng)',
        hoursSpent: 3.0,
        partsReplaced: ['3-micron fiberglass cartridge HEX-204'],
        status: 'Completed'
      },
      {
        id: 'MNT-C204-03',
        date: '2025-11-14',
        type: 'Preventive Overhaul',
        description: 'Major Tier 1 scheduled turnaround. Tilt-pad journal inspection and dry gas seal refurbishment.',
        technician: 'Sulzer OEM Field Engineering Team',
        hoursSpent: 48.0,
        partsReplaced: ['Tilt-pad bearing shoes', 'Nitrogen face seals', 'O-ring elastomers'],
        status: 'Completed'
      }
    ],
    components: [
      { name: 'Drive-End Tilt Pad Bearing', health: 54, status: 'critical', detail: 'Vibration exceeded threshold by 28%. Fluid film instability and sub-synchronous whirl detected.' },
      { name: 'Non-Drive-End Radial Bearing', health: 88, status: 'nominal', detail: 'Vibration nominal at 1.8 mm/s RMS' },
      { name: 'Dry Gas Seal Primary Vent', health: 82, status: 'nominal', detail: 'Buffer nitrogen flow within 12 Nm3/h baseline' },
      { name: 'Multi-Stage Inconel Impeller Array', health: 76, status: 'warning', detail: 'Sub-synchronous frequency harmonics at 0.44X running speed' },
      { name: 'Lube Oil Skid HEX-204', health: 65, status: 'warning', detail: 'Elevated delta-P across pre-filter cartridge' }
    ]
  },
  {
    id: 'P-118',
    name: 'Process Pump',
    type: 'Multi-Stage Barrel Casing Pump',
    tag: 'PMP-P-118',
    plantArea: 'Fluid Circulation & Feed Loop',
    location: 'Production Line B',
    criticality: 'Tier 1 Critical',
    healthScore: 82,
    status: 'warning',
    risk: 'MEDIUM',
    runtimeHours: 5800,
    operatingLoadPct: 76,
    energyKW: 920,
    novaInsight: 'Temperature trend abnormal on Kingsbury thrust bearing (+1.4°C/hr drift). Early signs of viscous friction or seal flush throttling detected across Shift A/B transition.',
    metrics: {
      vibrationRMS: 2.84,
      bearingTemp: 84.6,
      suctionPressure: 8.2,
      dischargePressure: 145.0,
      rotorRPM: 2985,
      lubeOilNAS: 6,
      acousticDB: 88.1,
      motorCurrent: 275
    },
    rulDays: 62,
    mtbfHours: 5800,
    lastOverhaul: '2026-02-02',
    nextScheduledService: '2026-11-10',
    alarm: 'Temperature trend abnormal. Bearing metal temperature ascending +1.4°C/hr under steady load.',
    oem: 'KSB FlowServe Industrial Pumps',
    model: 'HGC 6/9 High-Pressure Feed (3.8 MW)',
    maintenanceHistory: [
      {
        id: 'MNT-P118-01',
        date: '2026-07-22',
        type: 'Corrective Inspection',
        description: 'Seal flush Plan 53A barrier fluid reservoir pressure and level inspection.',
        technician: 'Vikram Singh (Process Tech)',
        hoursSpent: 2.0,
        partsReplaced: ['Barrier oil top-up 5L', 'Pressure transmitter calibration'],
        status: 'Completed'
      },
      {
        id: 'MNT-P118-02',
        date: '2026-02-02',
        type: 'Preventive Overhaul',
        description: 'Annual scheduled barrel casing ultrasonic survey and mechanical seal swap.',
        technician: 'KSB Certified Service Team',
        hoursSpent: 24.0,
        partsReplaced: ['DE Silicon Carbide seal faces', 'Hydraulic balance disc'],
        status: 'Completed'
      }
    ],
    components: [
      { name: 'Mechanical Cartridge Seal DE', health: 74, status: 'warning', detail: 'Temperature trend abnormal on seal flush interface' },
      { name: 'Kingsbury Type Thrust Bearing', health: 78, status: 'warning', detail: 'Continuous thermal rise approaching Class B threshold' },
      { name: 'Cast Steel Barrel Outer Casing', health: 95, status: 'nominal', detail: 'Ultrasonic wall integrity certified' },
      { name: 'Hydraulic Balance Disk Assembly', health: 82, status: 'nominal', detail: 'Leak-off flow steady at 3.9 m3/h' }
    ]
  },
  {
    id: 'M-042',
    name: 'Electric Motor',
    type: 'High-Torque Induction Motor',
    tag: 'MTR-M-042',
    plantArea: 'Polymer Extrusion & Milling Cell',
    location: 'Assembly Line',
    criticality: 'Tier 2 Essential',
    healthScore: 91,
    status: 'nominal',
    risk: 'LOW',
    runtimeHours: 4950,
    operatingLoadPct: 64,
    energyKW: 310,
    novaInsight: 'Motor operational profile is within nominal bounds with slight harmonic current distortion. Clean rotor bar flux signatures with no high-frequency slip spikes.',
    metrics: {
      vibrationRMS: 2.45,
      bearingTemp: 74.2,
      suctionPressure: 0,
      dischargePressure: 0,
      rotorRPM: 1485,
      lubeOilNAS: 5,
      acousticDB: 82.5,
      motorCurrent: 412
    },
    rulDays: 85,
    mtbfHours: 4950,
    lastOverhaul: '2025-09-10',
    nextScheduledService: '2026-10-20',
    alarm: 'Efficiency declining. Active power factor dropped to 0.81 with elevated harmonic stator losses.',
    oem: 'ABB Industrial Heavy Drives',
    model: 'M3BP 400LA High-Torque (315 kW)',
    maintenanceHistory: [
      {
        id: 'MNT-M042-01',
        date: '2026-06-11',
        type: 'Lubrication Service',
        description: 'Drive end and non-drive end polyurea synthetic grease replenishment (60g each).',
        technician: 'Sunita Rao (Electrical Specialist)',
        hoursSpent: 1.5,
        partsReplaced: ['Mobil Polyrex EM Grease'],
        status: 'Completed'
      },
      {
        id: 'MNT-M042-02',
        date: '2025-09-10',
        type: 'Preventive Overhaul',
        description: 'VFD drive tuning, stator megger insulation resistance check (1.2 Gigaohms).',
        technician: 'ABB Drive Systems Engineer',
        hoursSpent: 6.0,
        partsReplaced: ['Terminal block lugs', 'Cooling fan shroud'],
        status: 'Completed'
      }
    ],
    components: [
      { name: 'Drive Motor Stator Windings', health: 88, status: 'nominal', detail: 'Efficiency nominal. Stator phase balance within 1.2%' },
      { name: 'Planetary Reduction Gearbox', health: 92, status: 'nominal', detail: 'Mesh frequency vibration within nominal zone' },
      { name: 'Drive-End Cylindrical Roller Bearing', health: 90, status: 'nominal', detail: 'Lubrication grease viscosity within range' },
      { name: 'Variable Frequency Inverter IGBT Stack', health: 94, status: 'nominal', detail: 'Switching frequency 4 kHz nominal' }
    ]
  },
  {
    id: 'TC-204',
    name: 'High-Pressure Synthesis Turbocompressor',
    type: 'Centrifugal Turbocompressor',
    tag: 'CMP-HP-204A',
    plantArea: 'Synthesis Gas Section — Train B',
    criticality: 'Tier 1 Critical',
    healthScore: 78,
    status: 'warning',
    metrics: {
      vibrationRMS: 4.12,
      bearingTemp: 88.4,
      suctionPressure: 34.8,
      dischargePressure: 182.4,
      rotorRPM: 11420,
      lubeOilNAS: 7,
      acousticDB: 96.4,
      motorCurrent: 384
    },
    rulDays: 38,
    mtbfHours: 4280,
    lastOverhaul: '2025-11-14',
    nextScheduledService: '2026-10-15',
    alarm: 'Vibration velocity 4.12 mm/s RMS on Drive End Tilt-Pad Bearing (ISO 10816-3 Zone B limit: 4.5 mm/s)',
    oem: 'Sulzer-Siemens Industrial Turbomachinery',
    model: 'SGT-400 / STC-SV (12 MW)',
    components: [
      { name: 'Drive-End Tilt Pad Bearing', health: 68, status: 'warning', detail: 'Sub-synchronous fluid whirl observed at 0.44X running frequency' },
      { name: 'Non-Drive-End Radial Bearing', health: 91, status: 'nominal', detail: 'Vibration normal at 1.4 mm/s RMS' },
      { name: 'Dry Gas Seal Primary Vent', health: 86, status: 'nominal', detail: 'Buffer nitrogen flow within 12 Nm3/h baseline' },
      { name: 'Multi-Stage Inconel Impeller Array', health: 82, status: 'nominal', detail: 'Light polymer buildup on stage 3 balance drum' },
      { name: 'Lube Oil Skid HEX-204', health: 74, status: 'warning', detail: 'Differential pressure elevated across pre-filter cartridge' }
    ]
  },
  {
    id: 'BFP-01',
    name: 'Supercritical Boiler Feed Pump',
    type: 'Multi-Stage Barrel Casing Pump',
    tag: 'PMP-BFP-010',
    plantArea: 'High-Pressure Steam Island 3',
    criticality: 'Tier 1 Critical',
    healthScore: 84,
    status: 'nominal',
    metrics: {
      vibrationRMS: 2.18,
      bearingTemp: 64.2,
      suctionPressure: 8.2,
      dischargePressure: 245.0,
      rotorRPM: 2985,
      lubeOilNAS: 5,
      acousticDB: 88.1,
      motorCurrent: 260
    },
    rulDays: 142,
    mtbfHours: 6100,
    lastOverhaul: '2026-02-02',
    nextScheduledService: '2026-12-10',
    alarm: null,
    oem: 'KSB FlowServe Nuclear & Energy',
    model: 'HGC 6/9 Supercritical Feed (4.2 MW)',
    components: [
      { name: 'Mechanical Cartridge Seal DE', health: 88, status: 'nominal', detail: 'Seal face flush temperature stable at 42°C' },
      { name: 'Kingsbury Type Thrust Bearing', health: 82, status: 'nominal', detail: 'Axial displacement 0.08 mm within API 610 limits' },
      { name: 'Cast Steel Barrel Outer Casing', health: 96, status: 'nominal', detail: 'Ultrasonic wall thickness certified at 48mm' },
      { name: 'Hydraulic Balance Disk System', health: 79, status: 'nominal', detail: 'Leak-off flow steady at 4.2 m3/h' }
    ]
  },
  {
    id: 'CV-109',
    name: 'Blast Furnace Heavy Slag Conveyor',
    type: 'High-Torque Dual Drive System',
    tag: 'CNV-SLAG-109B',
    plantArea: 'Pyrometallurgy Slag Quench Yard',
    criticality: 'Tier 2 Essential',
    healthScore: 69,
    status: 'warning',
    metrics: {
      vibrationRMS: 5.85,
      bearingTemp: 94.6,
      suctionPressure: 0,
      dischargePressure: 0,
      rotorRPM: 1480,
      lubeOilNAS: 9,
      acousticDB: 102.5,
      motorCurrent: 440
    },
    rulDays: 19,
    mtbfHours: 2950,
    lastOverhaul: '2025-08-10',
    nextScheduledService: '2026-09-28',
    alarm: 'Primary drive motor stator temperature 94.6°C approaching Class F insulation trip threshold',
    oem: 'ABB Industrial Heavy Drives',
    model: 'M3BP 400LA High-Torque (315 kW)',
    components: [
      { name: 'Drive Motor Stator Windings', health: 64, status: 'warning', detail: 'Continuous thermal rise under 92% sustained load' },
      { name: 'Planetary Reduction Gearbox', health: 68, status: 'warning', detail: 'High gear-mesh frequency harmonics at 2.4 kHz' },
      { name: 'Head Pulley Spherical Roller Bearing', health: 75, status: 'nominal', detail: 'Lube grease shows trace oxidation particulates' },
      { name: 'Steel-Cord Reinforced Belt Tensioner', health: 84, status: 'nominal', detail: 'Hydraulic take-up cylinder pressure at 85 bar' }
    ]
  },
  {
    id: 'P-8802',
    name: 'Heavy Hydro-Cracker Residue Pump',
    type: 'API 610 Heavy Duty Cantilever Pump',
    tag: 'PMP-HCK-8802',
    plantArea: 'Heavy Oil Refining Hydro-treater',
    criticality: 'Tier 1 Critical',
    healthScore: 95,
    status: 'nominal',
    metrics: {
      vibrationRMS: 1.65,
      bearingTemp: 58.9,
      suctionPressure: 12.4,
      dischargePressure: 98.6,
      rotorRPM: 1785,
      lubeOilNAS: 4,
      acousticDB: 82.3,
      motorCurrent: 195
    },
    rulDays: 310,
    mtbfHours: 7800,
    lastOverhaul: '2026-04-18',
    nextScheduledService: '2027-04-01',
    alarm: null,
    oem: 'Sulzer Process Pumps',
    model: 'OH2 Single-Stage Heavy Process',
    components: [
      { name: 'Tungsten Carbide Dual Seal Faces', health: 97, status: 'nominal', detail: 'Zero hydrocarbon vapor leakage detected' },
      { name: 'Hardened Chrome-Moly Impeller', health: 94, status: 'nominal', detail: 'No cavitation pitting or erosion channels' },
      { name: 'Magnetic Drive Lube Sump', health: 96, status: 'nominal', detail: 'ISO Cleanliness 14/12/09' }
    ]
  },
  {
    id: 'CNC-05',
    name: '5-Axis Titanium Aerospace Gantry Rig',
    type: 'High-Precision Machining Center',
    tag: 'MCH-CNC-005X',
    plantArea: 'Advanced Aerostructures Machine Bay 1',
    criticality: 'Tier 2 Essential',
    healthScore: 92,
    status: 'nominal',
    metrics: {
      vibrationRMS: 0.88,
      bearingTemp: 42.1,
      suctionPressure: 0,
      dischargePressure: 140.0,
      rotorRPM: 18000,
      lubeOilNAS: 3,
      acousticDB: 74.2,
      motorCurrent: 82
    },
    rulDays: 240,
    mtbfHours: 5400,
    lastOverhaul: '2026-01-12',
    nextScheduledService: '2027-01-10',
    alarm: null,
    oem: 'DMG Mori Precision Tech',
    model: 'DMU 340 Gantry 5-Axis Portal',
    components: [
      { name: 'Ceramic Hybrid High-Speed Spindle', health: 93, status: 'nominal', detail: 'Runout deviation under 0.8 microns' },
      { name: 'Linear Optical Encoders (X/Y/Z)', health: 98, status: 'nominal', detail: 'Positioning accuracy ±1.5 µm' },
      { name: 'High-Pressure Through-Spindle Coolant', health: 89, status: 'nominal', detail: 'Fluid particulate filtration 5 micron' }
    ]
  },
  {
    id: 'GT-401',
    name: 'Combined-Cycle Gas Turbine Generator',
    type: 'Heavy Frame Gas Turbine 60MW',
    tag: 'GEN-GT-401C',
    plantArea: 'On-Site Cogeneration Island',
    criticality: 'Tier 1 Critical',
    healthScore: 88,
    status: 'nominal',
    metrics: {
      vibrationRMS: 2.84,
      bearingTemp: 76.5,
      suctionPressure: 1.01,
      dischargePressure: 22.4,
      rotorRPM: 3600,
      lubeOilNAS: 5,
      acousticDB: 91.0,
      motorCurrent: 1420
    },
    rulDays: 185,
    mtbfHours: 6850,
    lastOverhaul: '2025-10-05',
    nextScheduledService: '2026-11-20',
    alarm: null,
    oem: 'GE Vernova Heavy Duty Turbines',
    model: 'Frame 6B Gas Turbine (44 MW ISO)',
    components: [
      { name: 'Combustor Can Array (10 Cans)', health: 86, status: 'nominal', detail: 'Dynamic pressure pulsation margin > 18%' },
      { name: 'Stage 1 Turbine Nozzle & Blades', health: 85, status: 'nominal', detail: 'Thermal barrier coating intact at 92%' },
      { name: 'Generator Stator & Hydrogen Cooler', health: 92, status: 'nominal', detail: 'Hydrogen purity at 99.2%, seal oil delta-P nominal' }
    ]
  }
];

export const INITIAL_INCIDENTS: IncidentInvestigation[] = [
  {
    id: 'INV-8841',
    title: 'Unscheduled High-Frequency Axial Vibration Spike on Turbocompressor TC-204',
    assetId: 'TC-204',
    assetName: 'High-Pressure Synthesis Turbocompressor',
    tag: 'CMP-HP-204A',
    severity: 'critical',
    status: 'root_cause_found',
    timestamp: '2026-09-20 06:42 UTC',
    shift: 'Shift Alpha (00:00 - 08:00)',
    summary: 'At 06:42 UTC, drive-end tilt pad bearing experienced rapid vibration rise to 4.12 mm/s RMS with sub-synchronous oil whirl frequency peaks. Automated anti-surge controller adjusted bypass valve to avert trip.',
    confidence: 0.96,
    fiveWhys: [
      'Why did axial vibration alarm trip? → Drive-end tilt pad bearing experienced 4.12 mm/s RMS oscillation.',
      'Why did the tilt pad bearing oscillate? → Hydrodynamic fluid film wedge thickness collapsed from 22 µm to 9 µm.',
      'Why did the oil wedge thickness collapse? → Lubricating oil inlet temperature rose to 56°C due to cooling water restriction.',
      'Why was cooling water restricted? → Shell-and-tube lube oil heat exchanger HEX-204 tube bundle was fouled with river silt.',
      'Why was silt present in HEX-204? → River cooling water pre-filtration backwash cycle actuator failed in closed position during night shift.'
    ],
    rootCauseDirect: 'Lube oil heat exchanger cooling water inlet starvation due to failed backwash valve actuator.',
    rootCauseRoot: 'Lack of automated differential pressure alarm integration between river intake filter and DCS alarm matrix.',
    capaActions: [
      { id: 'CAPA-1', action: 'Replace pneumatic actuator solenoid on Backwash Filter F-102', owner: 'J. De Vries (Mechanical)', deadline: '2026-09-21', status: 'In Progress' },
      { id: 'CAPA-2', action: 'Inspect and flush HEX-204 shell & tube bundle with organic descaler', owner: 'M. Bakker (Turnaround)', deadline: '2026-09-22', status: 'Pending' },
      { id: 'CAPA-3', action: 'Implement predictive differential pressure alarm in Yokogawa DCS logic', owner: 'Dr. E. Vance (Reliability)', deadline: '2026-09-25', status: 'Pending' }
    ]
  },
  {
    id: 'INV-8839',
    title: 'Slag Conveyor CV-109 Drive Motor Thermal Peak under Continuous Blast Furnace Draw',
    assetId: 'CV-109',
    assetName: 'Blast Furnace Heavy Slag Conveyor',
    tag: 'CNV-SLAG-109B',
    severity: 'warning',
    status: 'in_progress',
    timestamp: '2026-09-19 19:15 UTC',
    shift: 'Shift Bravo (08:00 - 16:00)',
    summary: 'Stator winding RTD sensors logged 94.6°C during continuous heavy slag tapping run. Current draw spiked to 440A against 410A rated nameplate.',
    confidence: 0.89,
    fiveWhys: [
      'Why did motor stator overheat? → Motor operated at 108% nameplate current for 3.5 hours continuously.',
      'Why was the motor overloaded? → Trough belt friction load increased by 35%.',
      'Why did friction load increase? → Return idler rollers seized in zone 3 under heavy slag dust buildup.',
      'Why did dust accumulate on idler rollers? → Primary belt cleaner scraper blade wore past replacement indicator.',
      'Why was scraper wear not caught? → PM inspection interval was stretched from 7 days to 21 days during turnaround.'
    ],
    rootCauseDirect: 'Idler roller freeze resulting in belt drag overload.',
    rootCauseRoot: 'Preventive maintenance schedule drift during major plant turnaround.',
    capaActions: [
      { id: 'CAPA-4', action: 'Emergency replacement of 6 frozen return idlers in Zone 3', owner: 'P. Hansen (Millwright)', deadline: '2026-09-20', status: 'In Progress' },
      { id: 'CAPA-5', action: 'Replace primary tungsten carbide scraper blade assembly', owner: 'P. Hansen (Millwright)', deadline: '2026-09-21', status: 'Pending' },
      { id: 'CAPA-6', action: 'Lock PM schedule integrity in SAP PM to prevent extension beyond 7 days', owner: 'S. Thorne (Operations)', deadline: '2026-09-24', status: 'Pending' }
    ]
  },
  {
    id: 'INV-8824',
    title: 'Transient Acoustic Cavitation Spike on Supercritical Boiler Feed Pump BFP-01',
    assetId: 'BFP-01',
    assetName: 'Supercritical Boiler Feed Pump',
    tag: 'PMP-BFP-010',
    severity: 'moderate',
    status: 'resolved',
    timestamp: '2026-09-15 11:30 UTC',
    shift: 'Shift Charlie (16:00 - 00:00)',
    summary: 'High-frequency acoustic ultrasonic transducer detected micro-bubble collapse bursts near 1st stage suction eye during boiler load ramp-up.',
    confidence: 0.97,
    fiveWhys: [
      'Why was cavitation detected? → Net Positive Suction Head Available (NPSHa) dropped below NPSHr (Required).',
      'Why did NPSHa drop? → Deaerator storage tank level experienced rapid 400mm drop.',
      'Why did deaerator level drop? → Boiler feedwater demand ramped at 15 t/h/min, exceeding condensate return pump lag.',
      'Why did condensate pumps lag? → Lead-lag sequencer PID derivative gain was de-tuned.',
      'Why was derivative gain de-tuned? → Temporary tuning override left active following commissioning.'
    ],
    rootCauseDirect: 'Condensate feed delay causing transient NPSHa starvation at deaerator outlet.',
    rootCauseRoot: 'Procedural failure to restore standard PID parameters after loop testing.',
    capaActions: [
      { id: 'CAPA-7', action: 'Restore baseline PID parameters in Emerson DeltaV DCS', owner: 'T. Kowalski (Controls)', deadline: '2026-09-15', status: 'Completed' },
      { id: 'CAPA-8', action: 'Implement automated tuning audit tool in INDUSTRIX AI', owner: 'Dr. E. Vance (Reliability)', deadline: '2026-09-18', status: 'Completed' }
    ]
  }
];

export const SENSOR_CHANNELS: SensorChannel[] = [
  {
    id: 'ACCEL-TC204-DE-X',
    tag: 'VIB-DE-X204',
    name: 'TC-204 Drive-End Radial Vibration X',
    type: 'Vibration',
    unit: 'mm/s RMS',
    currentValue: 4.12,
    baseline: 1.80,
    warningThreshold: 4.50,
    criticalThreshold: 7.10,
    status: 'warning',
    history: [1.8, 1.9, 2.1, 2.3, 2.8, 3.2, 3.6, 3.9, 4.12, 4.08, 4.15, 4.12]
  },
  {
    id: 'TEMP-TC204-BRG',
    tag: 'TE-BRG-204',
    name: 'TC-204 Drive-End Bearing Metal Temp',
    type: 'Temperature',
    unit: '°C',
    currentValue: 88.4,
    baseline: 68.0,
    warningThreshold: 90.0,
    criticalThreshold: 105.0,
    status: 'warning',
    history: [68.0, 69.2, 71.5, 74.0, 78.4, 82.1, 85.6, 87.2, 88.4, 88.2, 88.6, 88.4]
  },
  {
    id: 'PT-TC204-DISCH',
    tag: 'PT-DISCH-204',
    name: 'TC-204 Synthesis Gas Discharge Pressure',
    type: 'Pressure',
    unit: 'bar',
    currentValue: 182.4,
    baseline: 180.0,
    warningThreshold: 195.0,
    criticalThreshold: 210.0,
    status: 'nominal',
    history: [180.1, 180.5, 181.0, 181.2, 181.9, 182.1, 182.5, 182.4, 182.4, 182.3, 182.5, 182.4]
  },
  {
    id: 'AC-BFP01-US',
    tag: 'US-SUCT-BFP01',
    name: 'BFP-01 Suction Ultrasonic Acoustic Waveform',
    type: 'Acoustic',
    unit: 'dBµV',
    currentValue: 34.2,
    baseline: 28.0,
    warningThreshold: 45.0,
    criticalThreshold: 60.0,
    status: 'nominal',
    history: [28.0, 28.5, 29.1, 31.0, 32.4, 33.1, 34.0, 34.2, 34.1, 34.3, 34.2, 34.2]
  },
  {
    id: 'CURR-CV109-DRV',
    tag: 'IE-MTR-109',
    name: 'CV-109 Main Inverter Motor Phase Current',
    type: 'Current',
    unit: 'Amps',
    currentValue: 440.0,
    baseline: 380.0,
    warningThreshold: 420.0,
    criticalThreshold: 480.0,
    status: 'warning',
    history: [380.0, 385.0, 395.0, 410.0, 422.0, 431.0, 438.0, 442.0, 440.0, 439.0, 441.0, 440.0]
  },
  {
    id: 'VIB-CNC05-SPNDL',
    tag: 'VIB-SPN-005',
    name: 'CNC-05 High-Speed Spindle Radial Velocity',
    type: 'Vibration',
    unit: 'mm/s RMS',
    currentValue: 0.88,
    baseline: 0.75,
    warningThreshold: 2.20,
    criticalThreshold: 4.50,
    status: 'nominal',
    history: [0.75, 0.76, 0.78, 0.81, 0.83, 0.85, 0.87, 0.88, 0.88, 0.87, 0.89, 0.88]
  }
];

export const RISK_INTELLIGENCE = {
  fleetRiskScore: 32, // out of 100 (Low-Moderate)
  activeVulnerabilities: 4,
  financialExposureAtRisk: '$1,480,000 / day',
  preventedDowntimeMTD: '42.5 Hours',
  fmeaMatrix: [
    { failureMode: 'Tilt-Pad Oil Whirl Fluid Dynamic Collapse', asset: 'TC-204 Turbocompressor', severity: 9, occurrence: 4, detection: 3, rpn: 108, mitigation: 'Automated oil temp regulation & phase monitoring' },
    { failureMode: 'Planetary Gearbox Pinion Flank Micro-Spalling', asset: 'CV-109 Slag Conveyor', severity: 7, occurrence: 6, detection: 4, rpn: 168, mitigation: 'Labyrinth seal replacement & ISO 4406 oil flush' },
    { failureMode: 'Transient NPSHa Suction Cavitation Erosion', asset: 'BFP-01 Boiler Feed Pump', severity: 8, occurrence: 2, detection: 2, rpn: 32, mitigation: 'DCS Condensate feed-forward derivative control' },
    { failureMode: 'Cantilever Heavy Mechanical Seal Face Vaporization', asset: 'P-8802 Residue Pump', severity: 9, occurrence: 2, detection: 2, rpn: 36, mitigation: 'Dual Plan 53B pressurized barrier fluid loop' }
  ]
};
