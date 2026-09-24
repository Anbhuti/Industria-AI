export type ReportType = 
  | 'incident-investigation'
  | 'machine-health'
  | 'maintenance-summary'
  | 'plant-performance'
  | 'energy-analysis'
  | 'executive-operations';

export interface IndustrialReportItem {
  id: string;
  reportNumber: string;
  name: string;
  type: ReportType;
  typeLabel: string;
  createdDate: string;
  machineOrPlant: string;
  status: 'Final / Approved' | 'Generated' | 'Under Review' | 'Archived';
  generatedBy: string;
  summary: string;
  sections: {
    incidentSummary?: string;
    timeline?: { time: string; event: string; severity: 'info' | 'warning' | 'critical' }[];
    sensorEvidence?: { parameter: string; value: string; baseline: string; deviation: string; severity: string }[];
    detectedCorrelations?: { pair: string; coefficient: number; interpretation: string }[];
    potentialCauses?: { rank: number; cause: string; probability: number; notes: string }[];
    aiAnalysis?: string;
    recommendedActions?: { priority: string; action: string; owner: string; deadline: string }[];
    maintenanceNotes?: string;
    investigationConclusion?: string;
  };
}

export const INITIAL_REPORTS: IndustrialReportItem[] = [
  {
    id: 'rpt-c204-inv',
    reportNumber: 'RPT-2026-INV-8841',
    name: 'Incident Investigation: Compressor C-204 Drive-End Bearing Vibration Surge',
    type: 'incident-investigation',
    typeLabel: 'Incident Investigation',
    createdDate: '21 Sep 2026',
    machineOrPlant: 'Compressor C-204 // Production Line A (Lucknow Plant)',
    status: 'Final / Approved',
    generatedBy: 'NOVA AI Copilot & Lead Reliability Eng. Rajesh Kumar',
    summary: 'Comprehensive root cause investigation into abnormal vibration excursion on industrial compressor C-204 exceeding ISO 10816-3 Zone B threshold by 28%.',
    sections: {
      incidentSummary: 'On 20 Sep 2026 at 22:31 IST, telemetry supervisory monitoring triggered an automated high-severity alarm (INC-7041) on Compressor C-204. Drive-end radial vibration spiked from nominal baseline 4.50 mm/s RMS to 5.76 mm/s RMS (+28%), accompanied by concurrent bearing metal temperature rise to 82.1°C (+14%) and lube header pressure drop to 2.94 bar (-8%). The unit remained operational under partial throttling to prevent emergency trip.',
      timeline: [
        { time: '20 Sep 2026 — 21:15', event: 'Baseline lubrication header pressure drops slightly from 3.20 bar to 3.08 bar (-3.7%).', severity: 'info' },
        { time: '20 Sep 2026 — 22:04', event: 'Drive-end radial bearing temperature begins upward trend from 72.0°C toward 78.5°C.', severity: 'warning' },
        { time: '20 Sep 2026 — 22:31', event: 'High-severity vibration trip alarm trips at 5.76 mm/s RMS (+28% excursion over ISO limit). Automated alert INC-7041 broadcasted.', severity: 'critical' },
        { time: '20 Sep 2026 — 22:42', event: 'Operator throttles Line A compression throughput from 78 tons/hr to 72 tons/hr to arrest thermal runaway.', severity: 'warning' },
        { time: '21 Sep 2026 — 00:15', event: 'Vibration stabilizes at 5.12 mm/s RMS. Multi-sensor cross-correlation initiated by NOVA.', severity: 'info' },
        { time: '21 Sep 2026 — 09:30', event: 'Formal RCA completed. Spare tilt pad kit staged for planned weekend changeover.', severity: 'info' }
      ],
      sensorEvidence: [
        { parameter: 'Vibration Velocity (Drive-End)', value: '5.76 mm/s RMS', baseline: '4.50 mm/s RMS', deviation: '+28.0%', severity: 'Critical' },
        { parameter: 'Bearing Metal Temperature', value: '82.1°C', baseline: '72.0°C', deviation: '+14.0%', severity: 'Warning' },
        { parameter: 'Lubrication Header Pressure', value: '2.94 bar', baseline: '3.20 bar', deviation: '-8.1%', severity: 'Warning' },
        { parameter: 'Motor Current / Load', value: '384 A (88% load)', baseline: '346 A (78% load)', deviation: '+11.0%', severity: 'Advisory' }
      ],
      detectedCorrelations: [
        { pair: 'Lubrication Pressure vs Vibration Velocity', coefficient: -0.89, interpretation: 'Strong negative correlation: as oil film pressure declined, radial shaft vibration immediately increased.' },
        { pair: 'Bearing Temperature vs Vibration Velocity', coefficient: 0.84, interpretation: 'Strong positive correlation: mechanical friction in bearing babbit lining generated simultaneous heat and vibration.' },
        { pair: 'Operating Load vs Vibration Velocity', coefficient: 0.76, interpretation: 'Moderate positive correlation: peak compressor throughput intensified hydrodynamic oil-film instability.' }
      ],
      potentialCauses: [
        { rank: 1, cause: 'Hydrodynamic Tilt-Pad Bearing Degradation & Micro-Spalling', probability: 0.78, notes: 'Sub-synchronous 0.44X rotational frequency peaks confirm fluid whirl and babbit surface wear.' },
        { rank: 2, cause: 'Lubrication Viscosity Breakdown / Oil Shearing', probability: 0.54, notes: 'Oil sample shows particle count NAS Class 8 with mild thermal oxidation.' },
        { rank: 3, cause: 'Shaft Misalignment / Coupling Wear', probability: 0.28, notes: 'Coupling strobe check shows alignment within API 670 tolerances; unbalance unlikely.' },
        { rank: 4, cause: 'Excessive Operating Load & Recirculation Surge', probability: 0.18, notes: 'Anti-surge valve was slightly open (3%), contributing minor gas recirculation backpressure.' }
      ],
      aiAnalysis: 'NOVA physics-informed diagnostic model isolated the root cause to hydrodynamic fluid-film breakdown in the drive-end tilt-pad bearing. Fast Fourier Transform (FFT) spectrogram reveals dominant vibration energy concentrated at 0.44X running frequency, classic signature of oil whirl resulting from excessive clearance and degraded oil viscosity. The machine can be safely operated at 80% throttled load for up to 14 days without risk of sudden seizure.',
      recommendedActions: [
        { priority: 'P1 - Immediate', action: 'Maintain compression load below 80% to keep vibration below 5.2 mm/s RMS.', owner: 'Shift Alpha Supervisor', deadline: 'Continuous' },
        { priority: 'P1 - High', action: 'Inspect drive-end tilt pad bearing and verify journal babbit clearance during scheduled Friday changeover.', owner: 'Mechanical Reliability Team', deadline: '24 Sep 2026' },
        { priority: 'P2 - Medium', action: 'Flush lube oil filter elements and top up with ISO VG 46 synthetic turbine oil.', owner: 'Lube Technician', deadline: '22 Sep 2026' },
        { priority: 'P3 - Low', action: 'Calibrate anti-surge bypass valve actuator seat closure.', owner: 'Instrumentation Specialist', deadline: '26 Sep 2026' }
      ],
      maintenanceNotes: 'Work Order #WO-9024 generated in plant CMMS. Spare tilt-pad bearing set (Part #SLZ-PAD-204B) has been verified in stock at Warehouse Bay 4 and transferred to Line A staging rack. Estimated job duration: 3.5 hours.',
      investigationConclusion: 'The root cause of Incident INC-7041 is mechanical degradation of the drive-end hydrodynamic bearing combined with slight lubrication pressure decline under sustained peak load. Catastrophic machine failure was averted through automated threshold alerting and prompt load throttling. Planned replacement during the upcoming weekend shift eliminates any risk of unscheduled factory downtime.'
    }
  },
  {
    id: 'rpt-fleet-mha',
    reportNumber: 'RPT-2026-MHA-1049',
    name: 'Machine Health Audit: Rotating Asset Fleet Mechanical Integrity',
    type: 'machine-health',
    typeLabel: 'Machine Health',
    createdDate: '20 Sep 2026',
    machineOrPlant: 'Fleetwide (32 Assets) // Lucknow Manufacturing Complex',
    status: 'Final / Approved',
    generatedBy: 'NOVA AI Diagnostic Engine & Senior Reliability Team',
    summary: 'Comprehensive ISO 55000 & API 670 health scorecard across all 32 operational rotating assets, detailing Remaining Useful Life (RUL) and vibration baselines.',
    sections: {
      incidentSummary: 'Routine monthly machinery health assessment covering 32 critical turbomachinery trains. Overall fleet health index is calculated at 88.4 / 100. 28 machines are operating in pristine condition (Health > 85%), 3 machines are in advisory status (CV-109, P-118, M-042), and 1 machine (C-204) is flagged for priority bearing service.',
      sensorEvidence: [
        { parameter: 'Fleet Average Health Score', value: '88.4 / 100', baseline: '85.0 / 100', deviation: '+3.4 Pts', severity: 'Normal' },
        { parameter: 'Assets in ISO Zone A/B (Good/Acceptable)', value: '31 of 32 (96.9%)', baseline: '95.0%', deviation: '+1.9%', severity: 'Normal' },
        { parameter: 'Assets in ISO Zone C (Alert)', value: '1 of 32 (Compressor C-204)', baseline: '0', deviation: '+1 Asset', severity: 'Warning' },
        { parameter: 'Fleet Vibration Velocity Mean', value: '2.14 mm/s RMS', baseline: '2.20 mm/s RMS', deviation: '-2.7%', severity: 'Normal' }
      ],
      aiAnalysis: 'NOVA health degradation models demonstrate positive trend across process pumps and utility motors following Q2 synthetic lubrication transition. Only two assets exhibit accelerated wear kinetics: Compressor C-204 bearing and Process Pump P-118 mechanical seal.',
      recommendedActions: [
        { priority: 'High', action: 'Complete scheduled C-204 bearing changeover.', owner: 'Mechanical Reliability', deadline: '24 Sep 2026' },
        { priority: 'Medium', action: 'Inspect P-118 mechanical seal flush line.', owner: 'Pumping Systems Specialist', deadline: '28 Sep 2026' }
      ],
      investigationConclusion: 'Fleet overall health is robust and meeting enterprise uptime benchmarks. With planned interventions on C-204 and P-118, estimated fleet availability will exceed 98.2% for the remainder of Q3.'
    }
  },
  {
    id: 'rpt-mnt-summary',
    reportNumber: 'RPT-2026-MNT-4022',
    name: 'Bi-Weekly Maintenance Execution & Backlog Status Report',
    type: 'maintenance-summary',
    typeLabel: 'Maintenance Summary',
    createdDate: '19 Sep 2026',
    machineOrPlant: 'All Production Trains // Lucknow Plant',
    status: 'Under Review',
    generatedBy: 'Chief Maintenance Officer Priya Nair',
    summary: 'Execution summary of 48 planned preventive work orders, mean time to repair (MTTR) performance, and spares inventory buffer status.',
    sections: {
      incidentSummary: 'Bi-weekly review of maintenance work order completion. 47 of 48 scheduled preventive maintenance tasks were completed on time (97.9% execution rate). Unplanned corrective maintenance accounted for only 0.8 hours of plant downtime.',
      sensorEvidence: [
        { parameter: 'PM Schedule Compliance', value: '97.9%', baseline: '95.0%', deviation: '+2.9%', severity: 'Normal' },
        { parameter: 'Active Maintenance Backlog', value: '18.4 Hours', baseline: '24.0 Hours', deviation: '-23.3%', severity: 'Normal' },
        { parameter: 'Mean Time to Repair (MTTR)', value: '1.4 Hours', baseline: '2.0 Hours', deviation: '-30.0%', severity: 'Normal' },
        { parameter: 'Critical Spares Stock Ratio', value: '96.5%', baseline: '95.0%', deviation: '+1.5%', severity: 'Normal' }
      ],
      aiAnalysis: 'Predictive work order generation via NOVA saved an estimated 14 hours of emergency downtime this cycle by prioritizing high-vibration equipment before catastrophic failure occurred.',
      recommendedActions: [
        { priority: 'Medium', action: 'Restock mechanical seal rebuild kits for Goulds 3196 pumps.', owner: 'Warehouse Procurement', deadline: '30 Sep 2026' }
      ],
      investigationConclusion: 'Maintenance execution remains highly disciplined with near-zero backlog spillover. Reliability metrics are currently at a 12-month best.'
    }
  },
  {
    id: 'rpt-plant-perf',
    reportNumber: 'RPT-2026-OEE-7712',
    name: 'Plant Operations & Overall Equipment Effectiveness (OEE) Analysis',
    type: 'plant-performance',
    typeLabel: 'Plant Performance',
    createdDate: '18 Sep 2026',
    machineOrPlant: 'Production Lines A, B & Furnace // Lucknow Plant',
    status: 'Final / Approved',
    generatedBy: 'Operations Director Vikram Malhotra',
    summary: 'Comprehensive analysis of production throughput (148.5 tons/hr), availability (96.4%), performance (95.8%), and product quality (98.8%).',
    sections: {
      incidentSummary: 'Plant-wide OEE benchmark reached 91.2% for the operating week, exceeding the operational target of 90.0%. Total finished product output was 24,948 tons against a 25,200-ton target (99.0% realization).',
      sensorEvidence: [
        { parameter: 'Plant OEE', value: '91.2%', baseline: '90.0%', deviation: '+1.2%', severity: 'Normal' },
        { parameter: 'Availability Factor', value: '96.4%', baseline: '95.0%', deviation: '+1.4%', severity: 'Normal' },
        { parameter: 'Performance Factor', value: '95.8%', baseline: '95.0%', deviation: '+0.8%', severity: 'Normal' },
        { parameter: 'Quality Yield Rate', value: '98.8%', baseline: '98.0%', deviation: '+0.8%', severity: 'Normal' }
      ],
      aiAnalysis: 'The primary bottleneck to increasing daily output from 148.5 to 155 tons/hr remains Compressor C-204 throughput ceiling due to bearing vibration limits. Addressing C-204 unlocks an estimated $34,000/week in surge revenue.',
      recommendedActions: [
        { priority: 'High', action: 'De-bottleneck Line A by completing C-204 planned bearing overhaul.', owner: 'Production & Reliability Team', deadline: '25 Sep 2026' }
      ],
      investigationConclusion: 'Production consistency and product quality are exemplary. Sustained OEE above 90% demonstrates strong process control across all units.'
    }
  },
  {
    id: 'rpt-energy-ana',
    reportNumber: 'RPT-2026-ENG-3094',
    name: 'Facility Energy Consumption, Peak Demand & Tariff Audit',
    type: 'energy-analysis',
    typeLabel: 'Energy Analysis',
    createdDate: '17 Sep 2026',
    machineOrPlant: 'Electrical Substation & Train B // Lucknow Plant',
    status: 'Final / Approved',
    generatedBy: 'Energy Optimization Lead Amit Sharma & NOVA',
    summary: 'Plant-wide electrical power analysis, peak tariff management (5,340 kW peak vs 5,500 kW ceiling), and 184 kW recoverable efficiency opportunities.',
    sections: {
      incidentSummary: 'Energy audit across 4,820 kW active plant electrical load. Identified 184 kW in recoverable electrical waste ($9,400/month) resulting from compressor bypass micro-leakage and uncoordinated slurry pump starting.',
      sensorEvidence: [
        { parameter: 'Active Power Draw', value: '4,820 kW', baseline: '4,650 kW', deviation: '+3.6%', severity: 'Advisory' },
        { parameter: 'Peak Demand Peak', value: '5,340 kW', baseline: '5,500 kW Limit', deviation: '-160 kW Buffer', severity: 'Normal' },
        { parameter: 'Specific Energy Consumption', value: '42.1 kWh/ton', baseline: '40.0 kWh/ton', deviation: '+5.2%', severity: 'Advisory' },
        { parameter: 'Power Factor', value: '0.94 PF', baseline: '0.95 PF', deviation: '-0.01', severity: 'Normal' }
      ],
      aiAnalysis: 'Compressor C-204 anti-surge valve is cracked open 3% during steady-state runs, wasting 110 kW in gas recirculation. Staggering large slurry pump starts by 20 minutes will save $3,200/month in peak demand billing.',
      recommendedActions: [
        { priority: 'Medium', action: 'Reseat C-204 bypass valve actuator to recover 110 kW.', owner: 'Instrumentation', deadline: '24 Sep 2026' },
        { priority: 'Low', action: 'Implement PLC staggered pump start logic.', owner: 'Automation Controls Eng.', deadline: '30 Sep 2026' }
      ],
      investigationConclusion: 'Facility is operating within contracted power limits. Executing the two zero-cost software/calibration tweaks will generate $112,800 in annualized energy savings.'
    }
  },
  {
    id: 'rpt-exec-ops',
    reportNumber: 'RPT-2026-EXEC-0926',
    name: 'Executive Monthly Operations & Reliability Briefing',
    type: 'executive-operations',
    typeLabel: 'Executive Operations Report',
    createdDate: '16 Sep 2026',
    machineOrPlant: 'Lucknow Manufacturing Complex (Whole Facility)',
    status: 'Archived',
    generatedBy: 'VP of Industrial Manufacturing & NOVA AI',
    summary: 'Executive-level summary of equipment reliability, safety compliance, financial exposure reduction, and plant operational risk index (28 / 100).',
    sections: {
      incidentSummary: 'Executive overview for corporate stakeholders. Lucknow Manufacturing Facility completed 720 continuous operating hours with zero lost-time injuries (LTI) and 99.8% customer delivery fulfillment.',
      sensorEvidence: [
        { parameter: 'Overall Facility Risk Index', value: '28 / 100', baseline: '< 40 / 100', deviation: '-12 Pts (Safe)', severity: 'Normal' },
        { parameter: 'Net Production Volume', value: '104,200 Tons', baseline: '102,000 Tons', deviation: '+2.1%', severity: 'Normal' },
        { parameter: 'Total Prevented Downtime', value: '38.5 Hours', baseline: '20.0 Hours', deviation: '+92.5%', severity: 'Normal' },
        { parameter: 'Cost Avoidance from Proactive RCA', value: '$68,400', baseline: '$50,000 Target', deviation: '+$18,400', severity: 'Normal' }
      ],
      aiAnalysis: 'Deployment of NOVA copilot and predictive sensor correlation has reduced catastrophic trip likelihood by 64% year-over-year. Asset capital expenditure forecasting is now aligned with physical machine degradation curves.',
      recommendedActions: [
        { priority: 'Medium', action: 'Authorize Q4 precision bearing replacement budget allocation.', owner: 'Executive Committee', deadline: '15 Oct 2026' }
      ],
      investigationConclusion: 'Plant operations are financially sound, mechanically disciplined, and operating at industry-leading reliability metrics.'
    }
  }
];
