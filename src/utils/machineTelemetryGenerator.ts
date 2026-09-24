import { IndustrialMachine, MachineTrendPoint } from '../types/industrial';

// Generates realistic timeseries for machine metrics
export function generateMachineTrends(machine: IndustrialMachine, dataPointsCount: number = 24): MachineTrendPoint[] {
  const points: MachineTrendPoint[] = [];
  const now = new Date();
  
  // Baseline values based on machine properties
  const baseTemp = machine.metrics.bearingTemp || 75;
  const baseVib = machine.metrics.vibrationRMS || 2.5;
  const basePress = machine.metrics.dischargePressure || (machine.metrics.suctionPressure ? machine.metrics.suctionPressure * 2 : 12);
  const baseEnergy = machine.energyKW || 450;
  const baseLoad = machine.operatingLoadPct || (machine.healthScore < 70 ? 88 : machine.healthScore < 85 ? 75 : 62);
  
  const isHighRisk = machine.risk === 'HIGH' || machine.status === 'critical';
  const isMedRisk = machine.risk === 'MEDIUM' || machine.status === 'warning';

  for (let i = dataPointsCount - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000);
    const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Progression factor: if high risk, upward drift during recent cycles
    const progress = (dataPointsCount - i) / dataPointsCount;
    
    // Sine harmonic fluctuation + random noise
    const cycleNoise = Math.sin((i / 4) * Math.PI) * 0.4;
    const randNoise = (Math.random() - 0.5) * 0.25;

    let vibDrift = 0;
    let tempDrift = 0;
    let pressDrift = 0;

    if (isHighRisk) {
      // gradual upward trend in last 6 cycles as described in user prompt
      if (i <= 6) {
        vibDrift = (6 - i) * 0.35;
        tempDrift = (6 - i) * 1.8;
      }
    } else if (isMedRisk) {
      if (i <= 8) {
        tempDrift = (8 - i) * 0.9;
      }
    }

    const temperature = Number((baseTemp - (isHighRisk ? 6 : 2) + tempDrift + cycleNoise * 2 + randNoise * 2).toFixed(1));
    const vibration = Number(Math.max(0.2, baseVib - (isHighRisk ? 1.4 : 0.2) + vibDrift + (cycleNoise * 0.3) + randNoise * 0.2).toFixed(2));
    const pressure = Number(Math.max(1, basePress + pressDrift + Math.cos(i) * 1.5 + randNoise * 0.5).toFixed(1));
    const loadVariation = Math.sin(i / 2) * 5 + randNoise * 3;
    const operatingLoadPct = Math.min(100, Math.max(20, Math.round(baseLoad + loadVariation + (isHighRisk ? 4 : 0))));
    const energyKW = Math.round(baseEnergy * (operatingLoadPct / 100) + randNoise * 15);

    points.push({
      timestamp: timeLabel,
      temperature,
      vibration,
      pressure,
      energyKW,
      operatingLoadPct
    });
  }

  return points;
}
