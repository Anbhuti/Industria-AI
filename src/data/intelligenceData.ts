export interface IntelligenceSignal {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  nominal: string | number;
  deviation: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'advisory' | 'warning' | 'critical';
  explanation: string;
}

export interface DetectedPattern {
  id: string;
  title: string;
  machineId?: string;
  machineName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  firstDetected: string;
  plainExplanation: string;
  impactExplanation: string;
}

export interface RecommendedAction {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAsset?: string;
  timeframe: string;
  expectedOutcome: string;
  actionType: 'inspection' | 'operational_tweak' | 'work_order' | 'lubrication' | 'optimization';
}

export interface HistoricalTrendPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  baseline?: number;
  target?: number;
  unit?: string;
}

export interface IntelligenceModuleData {
  id: 'predictive-maintenance' | 'anomaly-detection' | 'failure-prediction' | 'energy-intelligence' | 'production-intelligence' | 'operational-risk';
  title: string;
  shortDescription: string;
  statusBadge: string;
  statusColor: 'emerald' | 'amber' | 'rose' | 'blue';
  overview: {
    headline: string;
    summaryText: string;
    metrics: { label: string; value: string; detail: string; change?: string; positive?: boolean }[];
  };
  currentSignals: IntelligenceSignal[];
  detectedPatterns: DetectedPattern[];
  aiInsights: {
    title: string;
    narrative: string;
    confidence: number;
    keyTakeaways: string[];
    urgencyLevel: 'immediate' | 'within-week' | 'scheduled' | 'optimized';
  };
  historicalTrends: {
    title: string;
    description: string;
    chartType: 'area' | 'line' | 'bar';
    data: HistoricalTrendPoint[];
    seriesLabels: { primary: string; secondary?: string; baseline?: string };
  };
  recommendedActions: RecommendedAction[];
}

export const INTELLIGENCE_MODULES: Record<string, IntelligenceModuleData> = {
  'predictive-maintenance': {
    id: 'predictive-maintenance',
    title: 'Predictive Maintenance',
    shortDescription: 'Upcoming maintenance scheduling and component health lifespans based on wear patterns',
    statusBadge: '2 Tasks Due Soon',
    statusColor: 'amber',
    overview: {
      headline: 'Proactive Maintenance Schedule & Component Life Tracking',
      summaryText: 'Instead of waiting for machines to break or following rigid calendar dates, predictive maintenance watches real operational wear to schedule service right before problems escalate.',
      metrics: [
        { label: 'Upcoming Tasks', value: '2 Overdue/Pending', detail: 'C-204 & P-118 requiring inspection', change: 'Urgent', positive: false },
        { label: 'Average Component Life', value: '88.4%', detail: 'Fleet mechanical health index', change: '+2.1%', positive: true },
        { label: 'Prevented Breakdowns', value: '14 MTD', detail: 'Catastrophic failures avoided this month', change: '99.2% accuracy', positive: true },
        { label: 'Saved Maintenance Cost', value: '$42,800', detail: 'Saved through planned vs emergency repairs', change: 'This quarter', positive: true }
      ]
    },
    currentSignals: [
      {
        id: 'sig-c204-vib',
        name: 'Compressor C-204 Bearing Vibration',
        value: 5.76,
        unit: 'mm/s RMS',
        nominal: 4.50,
        deviation: '+28%',
        trend: 'up',
        status: 'critical',
        explanation: 'Drive-end bearing is shaking 28% harder than safety guidelines allow. Indicates bearing surface wear.'
      },
      {
        id: 'sig-p118-temp',
        name: 'Pump P-118 Seal Cavity Temp',
        value: 78.4,
        unit: '°C',
        nominal: 68.0,
        deviation: '+15.3%',
        trend: 'up',
        status: 'warning',
        explanation: 'Mechanical seal chamber is running hotter than normal, showing slight fluid recirculation and seal face friction.'
      },
      {
        id: 'sig-m042-load',
        name: 'Motor M-042 Current Draw',
        value: 142.1,
        unit: 'Amperes',
        nominal: 140.0,
        deviation: '+1.5%',
        trend: 'stable',
        status: 'normal',
        explanation: 'Motor electrical current is very close to standard baseline, indicating smooth healthy rotor operation.'
      },
      {
        id: 'sig-cv109-oil',
        name: 'Conveyor CV-109 Gearbox Oil Cleanliness',
        value: 'NAS 8',
        unit: 'NAS Standard',
        nominal: 'NAS 6',
        deviation: '+2 Classes',
        trend: 'up',
        status: 'advisory',
        explanation: 'Gearbox oil contains slightly more fine particulate dust than ideal. Filter replacement is advisable.'
      }
    ],
    detectedPatterns: [
      {
        id: 'pat-c204-bearing',
        title: 'Compressor C-204 — Bearing Inspection Required',
        machineId: 'C-204',
        machineName: 'Industrial Compressor C-204',
        severity: 'high',
        confidence: 0.94,
        firstDetected: '18 Sep 2026',
        plainExplanation: 'Vibration velocity has steadily climbed over the last 6 operating days. The bearing is experiencing increased metal friction in the drive-end tilt pads.',
        impactExplanation: 'If ignored, the bearing could overheat and seize, causing an unplanned plant shutdown costing up to $18,000 per hour.'
      },
      {
        id: 'pat-p118-seal',
        title: 'Pump P-118 — Seal Inspection Required',
        machineId: 'P-118',
        machineName: 'Process Pump P-118',
        severity: 'medium',
        confidence: 0.88,
        firstDetected: '19 Sep 2026',
        plainExplanation: 'Micro-fluctuations in seal chamber pressure and temperature indicate the mechanical shaft seal faces are beginning to wear.',
        impactExplanation: 'Early inspection and seal replacement prevents hazardous process chemical leakage onto the pump skid.'
      }
    ],
    aiInsights: {
      title: 'NOVA Predictive Scheduling Assessment',
      narrative: 'Both scheduled inspections can be completed during the planned Friday evening shift change with zero production loss. Compressor C-204 should be scheduled first because its vibration velocity is growing at 0.22 mm/s per day. Pump P-118 has approximately 8 days of safe margin before seal weeping turns into liquid leakage.',
      confidence: 0.93,
      keyTakeaways: [
        'Compressor C-204: Inspect drive-end tilt pad bearing within 72 hours.',
        'Pump P-118: Inspect mechanical seal flush and face clearance within 8 days.',
        'Total estimated downtime for both jobs: 3.5 hours during scheduled changeover.'
      ],
      urgencyLevel: 'within-week'
    },
    historicalTrends: {
      title: 'Remaining Useful Life (RUL) Days Remaining Over Time',
      description: 'Tracks estimated days of safe operation remaining on critical wear parts before mandatory servicing.',
      chartType: 'line',
      seriesLabels: { primary: 'Compressor C-204 Bearing', secondary: 'Pump P-118 Seal', baseline: 'Safe Operating Buffer' },
      data: [
        { label: 'Day 1', value: 42, secondaryValue: 60, baseline: 14, unit: 'Days' },
        { label: 'Day 5', value: 38, secondaryValue: 56, baseline: 14, unit: 'Days' },
        { label: 'Day 10', value: 32, secondaryValue: 48, baseline: 14, unit: 'Days' },
        { label: 'Day 15', value: 25, secondaryValue: 39, baseline: 14, unit: 'Days' },
        { label: 'Day 20', value: 18, secondaryValue: 28, baseline: 14, unit: 'Days' },
        { label: 'Day 25', value: 16, secondaryValue: 18, baseline: 14, unit: 'Days' },
        { label: 'Today', value: 14, secondaryValue: 8, baseline: 14, unit: 'Days' }
      ]
    },
    recommendedActions: [
      {
        id: 'act-c204-inspect',
        title: 'Schedule Bearing Inspection on Compressor C-204',
        priority: 'high',
        targetAsset: 'Compressor C-204',
        timeframe: 'Next 48–72 Hours',
        expectedOutcome: 'Inspect tilt pads, verify oil clearance, and avoid emergency trip during peak production.',
        actionType: 'inspection'
      },
      {
        id: 'act-p118-seal',
        title: 'Inspect Mechanical Seal on Process Pump P-118',
        priority: 'medium',
        targetAsset: 'Pump P-118',
        timeframe: 'Within 8 Days',
        expectedOutcome: 'Check flush line differential pressure and replace elastomer O-rings if cracked.',
        actionType: 'inspection'
      },
      {
        id: 'act-cv109-oil',
        title: 'Dispatch Lube Oil Filter Replacement for Conveyor CV-109',
        priority: 'low',
        targetAsset: 'Conveyor CV-109',
        timeframe: 'Next Routine PM Cycle',
        expectedOutcome: 'Restore lubricant cleanliness to NAS 6 and protect spur gear teeth from abrasive wear.',
        actionType: 'lubrication'
      }
    ]
  },

  'anomaly-detection': {
    id: 'anomaly-detection',
    title: 'Anomaly Detection',
    shortDescription: 'Multi-sensor anomaly detection catching strange machine behavior before alarms sound',
    statusBadge: '4 Anomalies Active',
    statusColor: 'rose',
    overview: {
      headline: '4 Active Anomalies Detected (1 High, 2 Medium, 1 Low)',
      summaryText: 'The anomaly detector constantly checks thousands of data points against baseline normal behavior to find subtle irregularities that standard threshold alarms miss.',
      metrics: [
        { label: 'Total Anomalies', value: '4 Active', detail: '1 High, 2 Medium, 1 Low severity', change: 'Active now', positive: false },
        { label: 'High Severity', value: '1 Asset', detail: 'Compressor C-204 vibration surge', change: 'Needs Action', positive: false },
        { label: 'Medium Severity', value: '2 Assets', detail: 'CV-109 thermal & P-118 cavitation', change: 'Advisory', positive: false },
        { label: 'Low Severity', value: '1 Asset', detail: 'M-042 minor phase ripple', change: 'Monitored', positive: true }
      ]
    },
    currentSignals: [
      {
        id: 'anom-sig-1',
        name: 'C-204 Drive-End Vibration Velocity',
        value: 5.76,
        unit: 'mm/s RMS',
        nominal: 4.50,
        deviation: '+28.0%',
        trend: 'up',
        status: 'critical',
        explanation: 'Severe vibration anomaly. Vibration energy is concentrated at 0.44X rotational speed.'
      },
      {
        id: 'anom-sig-2',
        name: 'CV-109 Conveyor Stator Temperature',
        value: 94.6,
        unit: '°C',
        nominal: 80.0,
        deviation: '+18.2%',
        trend: 'up',
        status: 'warning',
        explanation: 'Conveyor drive motor is heating up faster than conveyor belt weight alone would explain.'
      },
      {
        id: 'anom-sig-3',
        name: 'P-118 Inlet Pressure Vacuum',
        value: 2.1,
        unit: 'bar',
        nominal: 3.0,
        deviation: '-30.0%',
        trend: 'down',
        status: 'warning',
        explanation: 'Inlet pressure drop creates microscopic vapor bubbles that collapse and erode pump impellers (cavitation).'
      },
      {
        id: 'anom-sig-4',
        name: 'M-042 Phase Current Imbalance',
        value: 1.2,
        unit: '% Imbalance',
        nominal: 0.5,
        deviation: '+0.7%',
        trend: 'stable',
        status: 'advisory',
        explanation: 'Slight electrical current difference between supply phases. Well within safe motor operating limits.'
      }
    ],
    detectedPatterns: [
      {
        id: 'anom-pat-1',
        title: 'Compressor C-204 — Abnormal Vibration Surge (HIGH)',
        machineId: 'C-204',
        machineName: 'Industrial Compressor C-204',
        severity: 'high',
        confidence: 0.96,
        firstDetected: 'Today 22:31',
        plainExplanation: 'Vibration jumped by +28% while lube oil pressure slipped by -8%. The oil film inside the bearing is wobbling under high load.',
        impactExplanation: 'High risk of bearing surface scoring if left running without adjustment.'
      },
      {
        id: 'anom-pat-2',
        title: 'Conveyor CV-109 — Motor Overheating Under Slag Load (MEDIUM)',
        machineId: 'CV-109',
        machineName: 'Slag Conveyor CV-109',
        severity: 'medium',
        confidence: 0.89,
        firstDetected: 'Today 18:45',
        plainExplanation: 'Motor cooling fan airflow is partially restricted by furnace slag dust, leading to gradual thermal buildup.',
        impactExplanation: 'Motor insulation life will degrade prematurely if heat remains above 90°C for extended shifts.'
      },
      {
        id: 'anom-pat-3',
        title: 'Pump P-118 — Suction Cavitation Micro-Shock (MEDIUM)',
        machineId: 'P-118',
        machineName: 'Process Pump P-118',
        severity: 'medium',
        confidence: 0.85,
        firstDetected: 'Today 14:10',
        plainExplanation: 'Clogged upstream basket strainer is choking suction flow, causing cavitation sound spikes at high frequencies.',
        impactExplanation: 'Impeller pitting and seal chatter will worsen if the strainer is not cleared.'
      },
      {
        id: 'anom-pat-4',
        title: 'Motor M-042 — Minor Phase Current Ripple (LOW)',
        machineId: 'M-042',
        machineName: 'Electric Motor M-042',
        severity: 'low',
        confidence: 0.79,
        firstDetected: 'Yesterday 09:15',
        plainExplanation: 'Minor utility grid supply voltage ripple is causing 1.2% current imbalance across motor phases.',
        impactExplanation: 'Zero immediate danger. Automatic alert logged for tracking during monthly electrical audits.'
      }
    ],
    aiInsights: {
      title: 'NOVA Anomaly Triage & Prioritization',
      narrative: 'Out of 4 active anomalies across 14,800 monitored data channels, only 1 requires immediate operator intervention today: Compressor C-204. The two medium anomalies on CV-109 and P-118 can be handled through routine operator rounds (cleaning cooling fins and backwashing suction filters). Motor M-042 requires no physical action.',
      confidence: 0.95,
      keyTakeaways: [
        '1 High severity anomaly: Compressor C-204 (act now).',
        '2 Medium severity anomalies: Conveyor CV-109 & Pump P-118 (act on next shift).',
        '1 Low severity anomaly: Motor M-042 (harmless electrical ripple, log only).'
      ],
      urgencyLevel: 'immediate'
    },
    historicalTrends: {
      title: 'Anomaly Counts Detected Over Last 7 Days (By Severity)',
      description: 'Shows daily breakdown of detected anomalies across the plant, highlighting quick resolution of minor issues.',
      chartType: 'bar',
      seriesLabels: { primary: 'Total Anomalies', secondary: 'High Severity Only' },
      data: [
        { label: 'Mon', value: 2, secondaryValue: 0 },
        { label: 'Tue', value: 3, secondaryValue: 0 },
        { label: 'Wed', value: 5, secondaryValue: 1 },
        { label: 'Thu', value: 4, secondaryValue: 0 },
        { label: 'Fri', value: 6, secondaryValue: 1 },
        { label: 'Sat', value: 3, secondaryValue: 0 },
        { label: 'Today', value: 4, secondaryValue: 1 }
      ]
    },
    recommendedActions: [
      {
        id: 'anom-act-1',
        title: 'Reduce C-204 Compression Load by 8% to Stabilize Bearing',
        priority: 'high',
        targetAsset: 'Compressor C-204',
        timeframe: 'Immediate (Next 15 min)',
        expectedOutcome: 'Stabilizes hydrodynamic oil film, bringing vibration down from 5.76 to ~4.6 mm/s.',
        actionType: 'operational_tweak'
      },
      {
        id: 'anom-act-2',
        title: 'Backwash Suction Basket Strainer on Pump P-118',
        priority: 'medium',
        targetAsset: 'Pump P-118',
        timeframe: 'Next 4 Hours',
        expectedOutcome: 'Restores inlet suction pressure to 3.0 bar, ending cavitation and preventing impeller pitting.',
        actionType: 'work_order'
      },
      {
        id: 'anom-act-3',
        title: 'Blow Down CV-109 Stator Cooling Fins with Shop Air',
        priority: 'medium',
        targetAsset: 'Conveyor CV-109',
        timeframe: 'Current Shift',
        expectedOutcome: 'Lowers motor operating temperature by 12–15°C, protecting electrical winding life.',
        actionType: 'work_order'
      }
    ]
  },

  'failure-prediction': {
    id: 'failure-prediction',
    title: 'Failure Prediction',
    shortDescription: 'Probabilistic failure models estimating safe operating windows and breakdown risks',
    statusBadge: '1 Asset at Risk',
    statusColor: 'amber',
    overview: {
      headline: 'Probabilistic Failure Risk Models & Component Failure Horizons',
      summaryText: 'Machine failures do not happen randomly; they follow distinct physics-based wear curves. We calculate the probability of a mechanical fault developing over the coming weeks with confidence intervals.',
      metrics: [
        { label: 'Highest Risk Asset', value: 'Compressor C-204', detail: 'Bearing degradation mode', change: '78% Likelihood', positive: false },
        { label: 'Fleet Safe Window', value: '14 Days Minimum', detail: 'Before any critical threshold trip', change: 'Under current load', positive: true },
        { label: 'Model Confidence', value: '94.2%', detail: 'Validated against 4 years of history', change: 'Physics-informed', positive: true },
        { label: 'Avoidable Downtime', value: '38.5 Hours', detail: 'If planned maintenance occurs in window', change: 'Est. value $69k', positive: true }
      ]
    },
    currentSignals: [
      {
        id: 'fp-sig-1',
        name: 'Bearing Fatigue Stress Multiplier',
        value: '1.42x',
        unit: 'Baseline Stress',
        nominal: '1.00x',
        deviation: '+42%',
        trend: 'up',
        status: 'critical',
        explanation: 'Compressor C-204 bearing is absorbing 42% higher dynamic shear stress than design life specs.'
      },
      {
        id: 'fp-sig-2',
        name: 'Acoustic Shock Pulse Energy',
        value: 38.4,
        unit: 'dBm',
        nominal: 22.0,
        deviation: '+74.5%',
        trend: 'up',
        status: 'warning',
        explanation: 'High-frequency sound waves indicate microscopic surface friction inside the bearing cage.'
      },
      {
        id: 'fp-sig-3',
        name: 'Lubricant Film Thickness Estimate',
        value: 1.8,
        unit: 'Microns (μm)',
        nominal: 3.5,
        deviation: '-48.6%',
        trend: 'down',
        status: 'warning',
        explanation: 'The protective oil layer separating spinning metal parts has thinned to almost half its normal thickness.'
      },
      {
        id: 'fp-sig-4',
        name: 'Rotor Dynamic Runout Wobble',
        value: 18.2,
        unit: 'Microns (μm)',
        nominal: 12.0,
        deviation: '+51.7%',
        trend: 'up',
        status: 'advisory',
        explanation: 'Compressor shaft is running slightly off-center due to thermal expansion and bearing play.'
      }
    ],
    detectedPatterns: [
      {
        id: 'fp-pat-1',
        title: 'Hydrodynamic Tilt-Pad Bearing Degradation (Probabilistic: 78%)',
        machineId: 'C-204',
        machineName: 'Compressor C-204',
        severity: 'high',
        confidence: 0.78,
        firstDetected: '20 Sep 2026',
        plainExplanation: 'Statistical modeling gives a 78% probability that the drive-end bearing tilt pads are experiencing fluid-film breakdown, not an unbalance or misalignment.',
        impactExplanation: 'Safe operating window is 14 days before vibration reaches emergency shutdown limits (7.1 mm/s).'
      },
      {
        id: 'fp-pat-2',
        title: 'Pump Mechanical Seal Face Wear (Probabilistic: 54%)',
        machineId: 'P-118',
        machineName: 'Pump P-118',
        severity: 'medium',
        confidence: 0.54,
        firstDetected: '19 Sep 2026',
        plainExplanation: 'A 54% estimated probability that carbon-silicon carbide seal faces have minor microscopic grooving.',
        impactExplanation: 'Seal will remain safe for at least 8–10 days before visible dripping or fluid weep occurs.'
      }
    ],
    aiInsights: {
      title: 'NOVA Probabilistic Failure Horizon',
      narrative: 'Remember that probabilities represent risk likelihood, not a certainty of failure today. Compressor C-204 has a 78% chance of reaching the ISO emergency trip threshold within 14 days if operated at current 88% load. If load is reduced slightly to 80%, the safe window expands to 28 days, giving your team plenty of time to order parts and schedule a smooth changeover.',
      confidence: 0.91,
      keyTakeaways: [
        'C-204 failure probability reaches critical levels in 14 days at 88% load.',
        'Throttling load to 80% doubles the safe window to 28 days with only a 3% throughput impact.',
        'Order replacement bearing pad kit (Part #SLZ-PAD-204B, standard 3-day delivery).'
      ],
      urgencyLevel: 'within-week'
    },
    historicalTrends: {
      title: 'Failure Probability Curve vs Days of Continuous Operation',
      description: 'Probability density curve showing how breakdown risk rises over time if no maintenance is performed.',
      chartType: 'area',
      seriesLabels: { primary: 'Compressor C-204 Trip Risk %', baseline: 'Acceptable Risk Threshold (20%)' },
      data: [
        { label: 'Day 0', value: 12, baseline: 20, unit: '%' },
        { label: 'Day 3', value: 18, baseline: 20, unit: '%' },
        { label: 'Day 7', value: 34, baseline: 20, unit: '%' },
        { label: 'Day 10', value: 52, baseline: 20, unit: '%' },
        { label: 'Day 14', value: 78, baseline: 20, unit: '%' },
        { label: 'Day 18', value: 91, baseline: 20, unit: '%' },
        { label: 'Day 21', value: 98, baseline: 20, unit: '%' }
      ]
    },
    recommendedActions: [
      {
        id: 'fp-act-1',
        title: 'Stage Replacement Bearing Kit in Line A Parts Locker',
        priority: 'high',
        targetAsset: 'Compressor C-204',
        timeframe: 'Next 48 Hours',
        expectedOutcome: 'Ensures replacement parts are on hand before the 14-day safe maintenance window closes.',
        actionType: 'work_order'
      },
      {
        id: 'fp-act-2',
        title: 'Implement Load Shifting Protocol (88% → 80%)',
        priority: 'medium',
        targetAsset: 'Compressor C-204',
        timeframe: 'Next Operating Shift',
        expectedOutcome: 'Extends remaining useful life by +14 days while maintaining 97% of daily output targets.',
        actionType: 'operational_tweak'
      }
    ]
  },

  'energy-intelligence': {
    id: 'energy-intelligence',
    title: 'Energy Intelligence',
    shortDescription: 'Power consumption, peak electrical load management, and energy waste reduction',
    statusBadge: '184 kW Optimization Identified',
    statusColor: 'blue',
    overview: {
      headline: 'Plant Power Consumption, Peak Load Demands & Energy Optimization',
      summaryText: 'Energy is often the largest variable cost in a manufacturing plant. This module monitors live electricity draw, identifies peak power tariff spikes, and pinpoints where equipment is consuming more power than needed.',
      metrics: [
        { label: 'Total Plant Power', value: '4,820 kW', detail: 'Across 32 operational machines', change: '-3.2% vs yesterday', positive: true },
        { label: 'Peak Electrical Load', value: '5,340 kW', detail: 'Recorded today at 14:15 during furnace draw', change: '89% of contract limit', positive: true },
        { label: 'Specific Energy', value: '42.1 kWh/ton', detail: 'Energy consumed per ton of good product', change: 'Target: 40.0 kWh/ton', positive: false },
        { label: 'Identified Savings', value: '$9,400 / mo', detail: 'From 3 actionable motor/compressor tweaks', change: '184 kW recoverable', positive: true }
      ]
    },
    currentSignals: [
      {
        id: 'eng-sig-1',
        name: 'Compressor C-204 Motor Power Draw',
        value: 1840,
        unit: 'kW',
        nominal: 1680,
        deviation: '+9.5%',
        trend: 'up',
        status: 'warning',
        explanation: 'Compressor motor is drawing 160 kW more power than usual due to internal gas recirculation and bearing friction.'
      },
      {
        id: 'eng-sig-2',
        name: 'Facility Peak Demand Buffer',
        value: 660,
        unit: 'kW Remaining',
        nominal: 1000,
        deviation: '-34.0%',
        trend: 'down',
        status: 'advisory',
        explanation: 'Peak electric demand is approaching the utility demand penalty threshold. Heavy pump starts should be staggered.'
      },
      {
        id: 'eng-sig-3',
        name: 'Plant Power Factor',
        value: '0.94',
        unit: 'PF',
        nominal: '0.95',
        deviation: '-0.01',
        trend: 'stable',
        status: 'normal',
        explanation: 'Capacitor banks are keeping plant electrical efficiency high, avoiding utility reactive power penalties.'
      },
      {
        id: 'eng-sig-4',
        name: 'Off-Peak Energy Consumption Ratio',
        value: '58.2%',
        unit: 'Night/Weekend Share',
        nominal: '55.0%',
        deviation: '+3.2%',
        trend: 'up',
        status: 'normal',
        explanation: 'Over half of total energy is consumed during cheaper off-peak electricity hours, saving thousands in tariff fees.'
      }
    ],
    detectedPatterns: [
      {
        id: 'eng-pat-1',
        title: 'Compressor C-204 Anti-Surge Valve Micro-Bleed',
        machineId: 'C-204',
        machineName: 'Compressor C-204',
        severity: 'medium',
        confidence: 0.91,
        firstDetected: '17 Sep 2026',
        plainExplanation: 'The safety bypass valve is cracked open 3% when it should be fully shut, causing the compressor to re-compress hot gas and waste 110 kW.',
        impactExplanation: 'Wasting approximately $140 per day in unnecessary electricity.'
      },
      {
        id: 'eng-pat-2',
        title: 'Peak Load Coincidence on Line A and Line B Pumping',
        severity: 'low',
        confidence: 0.86,
        firstDetected: 'Yesterday 14:00',
        plainExplanation: 'Two large slurry pumps are currently started at the exact same 14:00 hour, creating an artificial peak demand spike.',
        impactExplanation: 'Triggers higher monthly utility capacity charges.'
      }
    ],
    aiInsights: {
      title: 'NOVA Energy Efficiency Recommendations',
      narrative: 'By re-calibrating the C-204 anti-surge bypass valve actuator to seal completely during steady-state runs, the plant can immediately recover 110 kW of lost power. Additionally, staggering the start times of the auxiliary slurry pumps by 25 minutes will lower peak billing demand by 340 kW, saving $3,200 on this month’s utility bill.',
      confidence: 0.94,
      keyTakeaways: [
        'Reseat C-204 bypass valve: Recovers 110 kW ($4,200/mo).',
        'Stagger slurry pump starts: Lowers utility peak charges ($3,200/mo).',
        'Optimize motor VFD setpoints: Recovers 74 kW ($2,000/mo).'
      ],
      urgencyLevel: 'optimized'
    },
    historicalTrends: {
      title: '24-Hour Energy Consumption (kW) vs Baseline Target',
      description: 'Hour-by-hour power draw profile across all plant operations showing the afternoon peak.',
      chartType: 'area',
      seriesLabels: { primary: 'Actual Power Draw (kW)', secondary: 'Target Efficient Profile (kW)', baseline: 'Peak Tariff Limit (5,500 kW)' },
      data: [
        { label: '00:00', value: 3900, secondaryValue: 3800, baseline: 5500, unit: 'kW' },
        { label: '04:00', value: 3750, secondaryValue: 3700, baseline: 5500, unit: 'kW' },
        { label: '08:00', value: 4420, secondaryValue: 4200, baseline: 5500, unit: 'kW' },
        { label: '12:00', value: 4950, secondaryValue: 4600, baseline: 5500, unit: 'kW' },
        { label: '14:15 (Peak)', value: 5340, secondaryValue: 4800, baseline: 5500, unit: 'kW' },
        { label: '18:00', value: 4680, secondaryValue: 4400, baseline: 5500, unit: 'kW' },
        { label: '22:00', value: 4120, secondaryValue: 3950, baseline: 5500, unit: 'kW' }
      ]
    },
    recommendedActions: [
      {
        id: 'eng-act-1',
        title: 'Calibrate C-204 Anti-Surge Bypass Valve Actuator',
        priority: 'medium',
        targetAsset: 'Compressor C-204',
        timeframe: 'Next Scheduled Stop',
        expectedOutcome: 'Eliminates 110 kW gas recirculation waste and lowers motor thermal load.',
        actionType: 'optimization'
      },
      {
        id: 'eng-act-2',
        title: 'Implement 20-Minute Staggered Pumping Start Logic in PLC',
        priority: 'low',
        timeframe: 'This Week',
        expectedOutcome: 'Shaves 340 kW off instantaneous peak demand, protecting utility contract limits.',
        actionType: 'operational_tweak'
      }
    ]
  },

  'production-intelligence': {
    id: 'production-intelligence',
    title: 'Production Intelligence',
    shortDescription: 'Line throughput, cycle times, bottleneck tracking, and Overall Equipment Effectiveness (OEE)',
    statusBadge: 'OEE: 91.2% (Target Exceeded)',
    statusColor: 'emerald',
    overview: {
      headline: 'Line Output Throughput, OEE Performance & Bottleneck Analysis',
      summaryText: 'Tracks how efficiently the plant converts raw materials into finished product. Analyzes equipment speed, minor micro-stops, and output quality to keep throughput steady.',
      metrics: [
        { label: 'Overall OEE', value: '91.2%', detail: 'Target: ≥ 90.0%', change: '+1.4% this week', positive: true },
        { label: 'Hourly Throughput', value: '148.5 Tons/hr', detail: 'Nominal nameplate: 150.0 Tons/hr', change: '99.0% of plan', positive: true },
        { label: 'Unplanned Downtime', value: '0.8 Hours', detail: 'This week across all 3 production lines', change: '-45% vs last week', positive: true },
        { label: 'Average Cycle Time', value: '24.2 min', detail: 'Batch synthesis and purification loop', change: '0.8 min faster', positive: true }
      ]
    },
    currentSignals: [
      {
        id: 'prod-sig-1',
        name: 'Production Line A Primary Throughput',
        value: 74.2,
        unit: 'Tons/hr',
        nominal: 75.0,
        deviation: '-1.1%',
        trend: 'stable',
        status: 'normal',
        explanation: 'Line A is running at nearly full capacity with consistent product density and purity.'
      },
      {
        id: 'prod-sig-2',
        name: 'Synthesis Gas Compression Bottleneck Index',
        value: '94%',
        unit: 'Capacity Used',
        nominal: '85%',
        deviation: '+9.0%',
        trend: 'up',
        status: 'warning',
        explanation: 'Compressor C-204 is the primary bottleneck stage. Any slowdown on C-204 directly caps Line A output.'
      },
      {
        id: 'prod-sig-3',
        name: 'Fleet Equipment Availability Factor',
        value: '96.4%',
        unit: 'Uptime %',
        nominal: '95.0%',
        deviation: '+1.4%',
        trend: 'up',
        status: 'normal',
        explanation: 'Rotating equipment has experienced minimal stoppage, supporting high daily production volumes.'
      },
      {
        id: 'prod-sig-4',
        name: 'Batch Product Quality Yield',
        value: '98.8%',
        unit: 'First-Pass Yield',
        nominal: '98.0%',
        deviation: '+0.8%',
        trend: 'stable',
        status: 'normal',
        explanation: 'Chemical purity and physical product consistency meet all laboratory quality release specs.'
      }
    ],
    detectedPatterns: [
      {
        id: 'prod-pat-1',
        title: 'Line A Throttle Headroom Constrained by C-204 Vibration',
        machineId: 'C-204',
        machineName: 'Compressor C-204',
        severity: 'medium',
        confidence: 0.92,
        firstDetected: 'Today 22:45',
        plainExplanation: 'Operators cannot push Line A throughput beyond 75 tons/hr because doing so increases C-204 vibration above safe trip limits.',
        impactExplanation: 'Caps potential plant surge production during high market price periods.'
      },
      {
        id: 'prod-pat-2',
        title: 'Furnace Feed Conveyor CV-109 Minor Speed Hunting',
        machineId: 'CV-109',
        machineName: 'Slag Conveyor CV-109',
        severity: 'low',
        confidence: 0.81,
        firstDetected: 'Yesterday 16:20',
        plainExplanation: 'Conveyor belt speed fluctuates slightly by ±2 RPM as heavy slag chunks drop from the primary hopper.',
        impactExplanation: 'Causes minor 1–2% variations in feed rate to downstream crushers.'
      }
    ],
    aiInsights: {
      title: 'NOVA Production Optimization Insights',
      narrative: 'Current plant OEE of 91.2% is healthy and beating the monthly benchmark. However, Compressor C-204 represents the single active constraint on further plant expansion. If the bearing is inspected and restored during the upcoming planned maintenance window, Line A can safely increase throughput by 4.5 tons/hr, delivering an extra $34,000 in weekly revenue.',
      confidence: 0.96,
      keyTakeaways: [
        'OEE is running at 91.2% (Availability 96.4%, Performance 95.8%, Quality 98.8%).',
        'Resolving C-204 bearing vibration unlocks +4.5 Tons/hr surge capacity.',
        'Total weekly downtime across all 3 production trains: only 0.8 hours.'
      ],
      urgencyLevel: 'scheduled'
    },
    historicalTrends: {
      title: '7-Day Overall Equipment Effectiveness (OEE) & Throughput Trend',
      description: 'Daily tracking of plant-wide OEE percentage compared against the 90.0% operational target.',
      chartType: 'line',
      seriesLabels: { primary: 'Plant OEE %', secondary: 'Throughput (Tons/hr)', baseline: 'Target OEE (90.0%)' },
      data: [
        { label: 'Mon', value: 89.4, secondaryValue: 142, baseline: 90.0, unit: '%' },
        { label: 'Tue', value: 90.1, secondaryValue: 144, baseline: 90.0, unit: '%' },
        { label: 'Wed', value: 90.8, secondaryValue: 146, baseline: 90.0, unit: '%' },
        { label: 'Thu', value: 91.5, secondaryValue: 148, baseline: 90.0, unit: '%' },
        { label: 'Fri', value: 91.0, secondaryValue: 147, baseline: 90.0, unit: '%' },
        { label: 'Sat', value: 92.3, secondaryValue: 151, baseline: 90.0, unit: '%' },
        { label: 'Today', value: 91.2, secondaryValue: 148.5, baseline: 90.0, unit: '%' }
      ]
    },
    recommendedActions: [
      {
        id: 'prod-act-1',
        title: 'Synchronize C-204 Bearing PM with Line A Product Changeover',
        priority: 'high',
        targetAsset: 'Compressor C-204',
        timeframe: 'Upcoming Friday 18:00',
        expectedOutcome: 'Allows full bearing inspection with zero lost production volume.',
        actionType: 'inspection'
      },
      {
        id: 'prod-act-2',
        title: 'Tune Feed Hopper VFD Dampening Parameter on CV-109',
        priority: 'low',
        targetAsset: 'Conveyor CV-109',
        timeframe: 'Next Instrumentation Walk',
        expectedOutcome: 'Smooths out belt speed hunting, delivering steady material feed to furnace crushers.',
        actionType: 'operational_tweak'
      }
    ]
  },

  'operational-risk': {
    id: 'operational-risk',
    title: 'Operational Risk',
    shortDescription: 'Holistic risk scoring spanning equipment, chemical process, maintenance backlog, and production output',
    statusBadge: 'Overall Risk: 28 / 100 (Low-Moderate)',
    statusColor: 'emerald',
    overview: {
      headline: 'Multi-Dimensional Operational Risk: Equipment, Process, Maintenance & Production',
      summaryText: 'Evaluates the combined operational risk facing the facility across four distinct categories. Pinpoints vulnerabilities before they can compound into costly downtime or safety events.',
      metrics: [
        { label: 'Equipment Risk', value: '38 / 100', detail: 'Driven by C-204 bearing vibration', change: 'Moderate', positive: false },
        { label: 'Process Risk', value: '18 / 100', detail: 'Pressures & temperatures in safe bands', change: 'Low / Safe', positive: true },
        { label: 'Maintenance Risk', value: '24 / 100', detail: 'Critical spares available in warehouse', change: 'Controlled', positive: true },
        { label: 'Production Risk', value: '32 / 100', detail: 'Financial exposure: $42.8k if C-204 trips', change: 'Monitored', positive: false }
      ]
    },
    currentSignals: [
      {
        id: 'risk-sig-1',
        name: 'Compressor C-204 Asset Health Index',
        value: '68 / 100',
        unit: 'Health Score',
        nominal: '90 / 100',
        deviation: '-22 Pts',
        trend: 'down',
        status: 'critical',
        explanation: 'Mechanical health has declined from nominal 90 to 68 due to elevated bearing vibration and oil temperature.'
      },
      {
        id: 'risk-sig-2',
        name: 'Synthesis Train Pressure Stability Index',
        value: '98.2%',
        unit: 'Stability %',
        nominal: '95.0%',
        deviation: '+3.2%',
        trend: 'stable',
        status: 'normal',
        explanation: 'Process gas pressures are rock solid across high-pressure reactors and separators.'
      },
      {
        id: 'risk-sig-3',
        name: 'Overdue Maintenance Work Orders',
        value: 1,
        unit: 'Overdue Tasks',
        nominal: 0,
        deviation: '+1 Task',
        trend: 'stable',
        status: 'advisory',
        explanation: 'Only 1 low-priority filter change task is past its due date. Maintenance team is on schedule.'
      },
      {
        id: 'risk-sig-4',
        name: 'Critical Spare Parts Availability in Stock',
        value: '96.5%',
        unit: 'Stock Availability',
        nominal: '95.0%',
        deviation: '+1.5%',
        trend: 'stable',
        status: 'normal',
        explanation: 'Spare mechanical seals, bearings, and motor control boards are stocked in the central warehouse.'
      }
    ],
    detectedPatterns: [
      {
        id: 'risk-pat-1',
        title: 'Single-Point Vulnerability on Synthesis Train B',
        machineId: 'C-204',
        machineName: 'Compressor C-204',
        severity: 'high',
        confidence: 0.95,
        firstDetected: 'Ongoing Assessment',
        plainExplanation: 'Compressor C-204 has no installed standby backup compressor on Line A. If it stops unexpectedly, the entire line halts.',
        impactExplanation: 'Concentrates 82% of current total plant financial risk onto this single machine.'
      },
      {
        id: 'risk-pat-2',
        title: 'Process Temperature Margin Buffer',
        severity: 'low',
        confidence: 0.91,
        firstDetected: 'Ongoing Assessment',
        plainExplanation: 'Exothermic reactor temperatures are operating with an 18°C safety margin below safety trip interlocks.',
        impactExplanation: 'Process risk remains very low under current atmospheric conditions.'
      }
    ],
    aiInsights: {
      title: 'NOVA Operational Risk Synthesis',
      narrative: 'Overall plant risk is low-to-moderate at 28 out of 100. Process safety and maintenance execution are both performing exceptionally well. However, equipment risk is elevated at 38/100 solely because Compressor C-204 is a single-point-of-failure without an online backup. Proactively inspecting C-204 during the upcoming scheduled changeover will drop overall plant risk down to a safe 16/100.',
      confidence: 0.93,
      keyTakeaways: [
        'Equipment Risk: 38/100 (elevated by C-204 bearing vibration).',
        'Process Risk: 18/100 (nominal, very safe margins).',
        'Maintenance Risk: 24/100 (healthy parts inventory & execution).',
        'Production Risk: 32/100 (manageable exposure if planned PM is kept).'
      ],
      urgencyLevel: 'within-week'
    },
    historicalTrends: {
      title: 'Overall Plant Operational Risk Index Trend (Last 6 Months)',
      description: 'Tracks overall plant risk score on a 0–100 scale, showing how predictive maintenance keeps risk low.',
      chartType: 'line',
      seriesLabels: { primary: 'Overall Risk Index (0–100)', baseline: 'Target Safe Ceiling (40 / 100)' },
      data: [
        { label: 'Apr', value: 34, baseline: 40, unit: '/100' },
        { label: 'May', value: 29, baseline: 40, unit: '/100' },
        { label: 'Jun', value: 22, baseline: 40, unit: '/100' },
        { label: 'Jul', value: 25, baseline: 40, unit: '/100' },
        { label: 'Aug', value: 20, baseline: 40, unit: '/100' },
        { label: 'Sep (Now)', value: 28, baseline: 40, unit: '/100' }
      ]
    },
    recommendedActions: [
      {
        id: 'risk-act-1',
        title: 'Execute Pre-Emptive Bearing Service on C-204',
        priority: 'high',
        targetAsset: 'Compressor C-204',
        timeframe: 'Next Scheduled Window',
        expectedOutcome: 'Reduces equipment risk score from 38 to 14, neutralizing the plant’s largest single vulnerability.',
        actionType: 'inspection'
      },
      {
        id: 'risk-act-2',
        title: 'Review Tier-1 Critical Spares Reorder Points for Q4',
        priority: 'low',
        timeframe: 'Next Month',
        expectedOutcome: 'Ensures lead-time safety buffers are maintained ahead of seasonal winter logistics delays.',
        actionType: 'work_order'
      }
    ]
  }
};
