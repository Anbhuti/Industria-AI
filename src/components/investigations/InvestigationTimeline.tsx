import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  Activity, 
  Droplets, 
  Thermometer, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  time: string;
  timestamp: string;
  relativeMinutes: string;
  title: string;
  category: 'Telemetry' | 'Alarm' | 'Control' | 'Physical' | 'Intervention';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  sensorTag: string;
  reading: string;
  delta: string;
  description: string;
}

export const InvestigationTimeline: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>('EVT-03');

  const events: TimelineEvent[] = [
    {
      id: 'EVT-01',
      time: '22:13:00',
      timestamp: '20 Sep 2026 — 22:13:00',
      relativeMinutes: '-18 min',
      title: 'Lubrication Header Pressure Decay Begins',
      category: 'Telemetry',
      severity: 'MEDIUM',
      sensorTag: 'PT-LO-204 (Lube Header)',
      reading: '3.08 bar (Baseline: 3.20 bar)',
      delta: '-4.0%',
      description: 'Lube oil supply pressure dropped below nominal operational band following a differential pressure spike across pre-filter cartridge HEX-204.'
    },
    {
      id: 'EVT-02',
      time: '22:21:40',
      timestamp: '20 Sep 2026 — 22:21:40',
      relativeMinutes: '-9 min',
      title: 'Drive-End Tilt Pad Thermal Drift Detected',
      category: 'Telemetry',
      severity: 'HIGH',
      sensorTag: 'TE-204B (Bearing Metal RTD)',
      reading: '76.8°C (Baseline: 72.0°C)',
      delta: '+6.6%',
      description: 'Sub-surface duplex thermocouple logged thermal escalation rate of +1.8°C/hr. Viscous shear heat dissipation impaired by reduced lubricating fluid film flow.'
    },
    {
      id: 'EVT-03',
      time: '22:31:00',
      timestamp: '20 Sep 2026 — 22:31:00',
      relativeMinutes: '0 min (INCIDENT PEAK)',
      title: 'HIGH Severity Vibration Alert Triggered (ISO Zone B Excursion)',
      category: 'Alarm',
      severity: 'CRITICAL',
      sensorTag: 'ACC-DE-01 (Drive End Accelerometer)',
      reading: '5.76 mm/s RMS (Threshold: 4.50 mm/s)',
      delta: '+28%',
      description: 'Axial and radial vibration velocity surged abruptly. Fast Fourier Transform (FFT) extraction isolated sub-synchronous oil whip peaks at 0.44X running speed (83.7 Hz).'
    },
    {
      id: 'EVT-04',
      time: '22:31:45',
      timestamp: '20 Sep 2026 — 22:31:45',
      relativeMinutes: '+45 sec',
      title: 'Motor Phase Current & Load Factor Expansion',
      category: 'Telemetry',
      severity: 'HIGH',
      sensorTag: 'CT-STATOR-PHB (Phase B Current)',
      reading: '384 A (Baseline: 346 A)',
      delta: '+11%',
      description: 'Drive motor power consumption jumped by 11% due to increased mechanical drag from journal sleeve thermal expansion and orbital boundary friction.'
    },
    {
      id: 'EVT-05',
      time: '22:32:10',
      timestamp: '20 Sep 2026 — 22:32:10',
      relativeMinutes: '+1.1 min',
      title: 'Yokogawa Centum DCS Anti-Surge Bypass Trim Active',
      category: 'Control',
      severity: 'INFO',
      sensorTag: 'FV-204 (Recirculation Valve)',
      reading: 'Trim adjusted +12% Open',
      delta: 'Active Compensation',
      description: 'DCS anti-surge loop initiated partial bypass venting to prevent aerodynamic stall and relieve axial thrust loading across the rotor assembly.'
    },
    {
      id: 'EVT-06',
      time: '22:35:00',
      timestamp: '20 Sep 2026 — 22:35:00',
      relativeMinutes: '+4 min',
      title: 'NOVA AI Diagnostic Synthesis Complete',
      category: 'Physical',
      severity: 'INFO',
      sensorTag: 'INDUSTRIX AI Engine',
      reading: 'Confidence: 94.8%',
      delta: 'RCA Confirmed',
      description: 'Cross-correlated hydraulic lead-lag indicators and categorized root cause as hydrodynamic fluid whip initiated by pre-filter restriction.'
    }
  ];

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[2];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            High-Resolution Incident Sequence Timeline
          </h3>
          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Microsecond Telemetry Chronology
          </span>
        </div>
        <span className="text-xs font-mono-tech text-zinc-400">
          T-0 Baseline: 20 Sep 2026 — 22:31:00 UTC
        </span>
      </div>

      {/* Interactive Timeline Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Sequential Event Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          {events.map((evt, idx) => {
            const isSelected = evt.id === selectedEventId;
            const isPeak = evt.id === 'EVT-03';

            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected 
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg ring-1 ring-amber-500/30' 
                    : isPeak
                    ? 'bg-rose-500/[0.07] border-rose-500/30 hover:border-rose-500/50'
                    : 'bg-[#10141b] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded bg-white/[0.08] text-white">
                      {evt.time}
                    </span>
                    <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded border ${
                      evt.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      evt.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                      evt.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {evt.relativeMinutes}
                    </span>
                  </div>

                  <span className={`text-xs font-mono-tech font-bold ${
                    evt.delta.startsWith('+') ? 'text-rose-400' :
                    evt.delta.startsWith('-') ? 'text-cyan-400' : 'text-zinc-300'
                  }`}>
                    {evt.delta}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                    {evt.title}
                  </h4>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-amber-400 translate-x-1' : 'text-zinc-600'}`} />
                </div>

                <div className="text-[10px] font-mono-tech text-zinc-400 mt-1 flex items-center gap-2">
                  <span>{evt.sensorTag}</span>
                  <span>•</span>
                  <span className="text-zinc-300">{evt.reading}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Event Deep Dive Panel (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono-tech uppercase text-zinc-400">
                Timeline Step Details
              </span>
              <span className="text-xs font-mono-tech font-bold text-amber-400">
                {selectedEvent.id}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <span className={`text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded border ${
                  selectedEvent.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                  selectedEvent.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                  'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  Severity: {selectedEvent.severity}
                </span>
                <h3 className="text-sm font-bold text-white mt-2 leading-tight">
                  {selectedEvent.title}
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5 text-xs font-mono-tech">
                <div className="flex justify-between text-zinc-400">
                  <span>Timestamp:</span>
                  <span className="text-white">{selectedEvent.timestamp}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Instrument Tag:</span>
                  <span className="text-amber-300">{selectedEvent.sensorTag}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Logged Reading:</span>
                  <span className="text-white">{selectedEvent.reading}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Net Excursion:</span>
                  <span className="text-rose-400 font-bold">{selectedEvent.delta}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] font-mono-tech text-zinc-400">
            Correlation Tag: <strong className="text-zinc-200">ISO-10816-3-ZONE-B-ALARM</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
