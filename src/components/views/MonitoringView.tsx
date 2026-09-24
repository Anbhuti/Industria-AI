import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Activity, 
  Layers, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Settings2, 
  TrendingUp,
  Cpu
} from 'lucide-react';
import { SensorChannel, IndustrialMachine, AppRoute } from '../../types/industrial';
import { SENSOR_CHANNELS } from '../../data/industrialData';

interface MonitoringViewProps {
  machines: IndustrialMachine[];
  onNavigate?: (route: AppRoute) => void;
  onSelectMachine?: (machine: IndustrialMachine) => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({ 
  machines,
  onNavigate,
  onSelectMachine
}) => {
  const [sensors, setSensors] = useState<SensorChannel[]>(SENSOR_CHANNELS);
  const [selectedSensor, setSelectedSensor] = useState<SensorChannel>(SENSOR_CHANNELS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sampleRate, setSampleRate] = useState<'100Hz' | '1kHz' | '10kHz'>('1kHz');
  const [activeTab, setActiveTab] = useState<'timeSeries' | 'fftSpectrum'>('timeSeries');
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Find associated machine based on sensor machineId
  const associatedMachine = machines.find(m => m.id === selectedSensor.machineId) || machines[0];

  // Initialize waveform data buffer
  useEffect(() => {
    const initialPoints = Array.from({ length: 60 }, (_, i) => {
      const base = selectedSensor.currentValue;
      return base + Math.sin(i * 0.4) * (base * 0.15) + (Math.random() - 0.5) * (base * 0.08);
    });
    setWaveformData(initialPoints);
  }, [selectedSensor]);

  // Real-time animation loop when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setWaveformData(prev => {
        const nextTime = Date.now() / 300;
        const base = selectedSensor.currentValue;
        // High fidelity synthesis: fundamental 1X + 2X harmonic + noise
        const fundamental = Math.sin(nextTime * 1.8) * (base * 0.18);
        const secondHarmonic = Math.sin(nextTime * 3.6) * (base * 0.08);
        const noise = (Math.random() - 0.5) * (base * 0.05);
        const nextVal = Number((base + fundamental + secondHarmonic + noise).toFixed(2));
        
        return [...prev.slice(1), nextVal];
      });
    }, sampleRate === '10kHz' ? 50 : sampleRate === '1kHz' ? 100 : 250);

    return () => clearInterval(interval);
  }, [isPlaying, selectedSensor, sampleRate]);

  // Derived FFT Spectrum simulation (Harmonics: 0.44X oil whirl, 1X running speed 190Hz, 2X misalignment 380Hz, 3X)
  const fftPeaks = [
    { freq: '83.7 Hz (0.44X)', amp: (selectedSensor.currentValue * 0.42).toFixed(2), label: 'Sub-synchronous Oil Whirl' },
    { freq: '190.3 Hz (1X)', amp: (selectedSensor.currentValue * 0.88).toFixed(2), label: 'Rotor 1X Fundamental Unbalance' },
    { freq: '380.6 Hz (2X)', amp: (selectedSensor.currentValue * 0.35).toFixed(2), label: 'Coupling Alignment Harmonic' },
    { freq: '570.9 Hz (3X)', amp: (selectedSensor.currentValue * 0.12).toFixed(2), label: 'Blade Pass 3X' },
    { freq: '1,142 Hz (6X)', amp: (selectedSensor.currentValue * 0.08).toFixed(2), label: 'High-frequency Bearing Race' }
  ];

  const maxWaveform = Math.max(...waveformData, selectedSensor.criticalThreshold);
  const minWaveform = Math.min(...waveformData, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header & Oscilloscope Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>REAL-TIME HIGH-FREQUENCY OSCILLOSCOPE & FFT</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Condition Telemetry Streaming
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Active Channel: <span className="text-zinc-200 font-mono-tech font-semibold">{selectedSensor.tag}</span> — {selectedSensor.name}
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPlaying 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Stream' : 'Resume Live'}</span>
          </button>

          {/* Sample Rate Selector */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono-tech">
            {(['100Hz', '1kHz', '10kHz'] as const).map(rate => (
              <button
                key={rate}
                onClick={() => setSampleRate(rate)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  sampleRate === rate ? 'bg-white/[0.12] text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {rate}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Associated Machine & Incident Quick Actions */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0e131d] to-[#0e131d] border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech uppercase text-zinc-400">Associated Asset:</span>
              <span className="text-sm font-bold text-white">{associatedMachine.name}</span>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {associatedMachine.type}
              </span>
            </div>
            <div className="text-xs text-zinc-300 mt-0.5">
              Tag: <span className="font-mono-tech text-amber-300">{associatedMachine.tag}</span> • Criticality: <span className="text-zinc-200">{associatedMachine.criticality}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigate && onSelectMachine && (
            <>
              <button
                type="button"
                onClick={() => {
                  onSelectMachine(associatedMachine);
                  onNavigate('/machines');
                }}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Inspect Machine</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectMachine(associatedMachine);
                  onNavigate('/investigations');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Investigate Root Cause</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Oscilloscope & Waveform Panel */}
      <div className="rounded-2xl bg-[#0f131a] border border-white/[0.08] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Panel Header: View Switcher (Time Series vs FFT) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
              <button
                onClick={() => setActiveTab('timeSeries')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'timeSeries' ? 'bg-white/[0.1] text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Time-Domain Waveform
              </button>
              <button
                onClick={() => setActiveTab('fftSpectrum')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'fftSpectrum' ? 'bg-white/[0.1] text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                FFT Frequency Spectrum
              </button>
            </div>

            <span className="text-xs font-mono-tech text-zinc-400 hidden lg:inline">
              Sampling: {sampleRate} • Nyquist: {sampleRate === '10kHz' ? '5.0 kHz' : '500 Hz'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-tech text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-amber-400 inline-block" />
              <span>Warn: {selectedSensor.warningThreshold} {selectedSensor.unit}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-rose-500 inline-block" />
              <span>Trip: {selectedSensor.criticalThreshold} {selectedSensor.unit}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Display */}
        {activeTab === 'timeSeries' ? (
          <div className="pt-6">
            {/* SVG Interactive Oscilloscope Graph */}
            <div className="h-64 sm:h-72 w-full relative bg-[#090b10] rounded-xl border border-white/[0.06] p-4 flex flex-col justify-between overflow-hidden">
              {/* Technical Grid Overlay */}
              <div className="absolute inset-0 bg-industrial-grid opacity-60 pointer-events-none" />

              {/* Warning and Trip Threshold Overlay Lines */}
              <div 
                className="absolute w-full border-t border-dashed border-amber-500/50 pointer-events-none left-0 z-10"
                style={{
                  top: `${Math.max(10, Math.min(90, 100 - ((selectedSensor.warningThreshold - minWaveform) / (maxWaveform - minWaveform)) * 100))}%`
                }}
              >
                <span className="text-[9px] font-mono-tech text-amber-400 bg-black/60 px-1.5 py-0.5 rounded ml-2">
                  WARN ({selectedSensor.warningThreshold})
                </span>
              </div>

              {/* SVG Waveform Line */}
              <svg className="w-full h-full absolute inset-0 z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Polyline Path */}
                {waveformData.length > 1 && (
                  <>
                    <path
                      d={waveformData.reduce((acc, val, idx) => {
                        const x = (idx / (waveformData.length - 1)) * 500;
                        const y = 200 - ((val - minWaveform) / (maxWaveform - minWaveform || 1)) * 170 - 15;
                        return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }, '') + ' L 500 200 L 0 200 Z'}
                      fill="url(#waveGradient)"
                    />
                    <path
                      d={waveformData.reduce((acc, val, idx) => {
                        const x = (idx / (waveformData.length - 1)) * 500;
                        const y = 200 - ((val - minWaveform) / (maxWaveform - minWaveform || 1)) * 170 - 15;
                        return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>

              {/* Instantaneous Readout Badge */}
              <div className="relative z-20 self-end bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.1] text-xs font-mono-tech flex items-center gap-2">
                <span className="text-zinc-400">INSTANTANEOUS:</span>
                <span className="text-amber-400 font-bold text-sm">
                  {waveformData[waveformData.length - 1] || selectedSensor.currentValue} {selectedSensor.unit}
                </span>
              </div>
            </div>

            {/* ISO 10816-3 Guidance Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-[11px] font-mono-tech">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <div className="font-bold">ZONE A (Good)</div>
                <div className="text-zinc-400 mt-0.5">&lt; 2.3 mm/s RMS</div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <div className="font-bold">ZONE B (Acceptable)</div>
                <div className="text-zinc-400 mt-0.5">2.3 – 4.5 mm/s RMS</div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <div className="font-bold">ZONE C (Unsatisfactory)</div>
                <div className="text-zinc-400 mt-0.5">4.5 – 7.1 mm/s RMS</div>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <div className="font-bold">ZONE D (Unacceptable)</div>
                <div className="text-zinc-400 mt-0.5">&gt; 7.1 mm/s RMS</div>
              </div>
            </div>
          </div>
        ) : (
          /* FFT Spectrum Breakdown */
          <div className="pt-6 space-y-4">
            <div className="p-4 rounded-xl bg-[#090b10] border border-white/[0.06]">
              <div className="text-xs font-mono-tech uppercase text-zinc-400 mb-3">
                FFT Harmonic Peak Breakdown (Hanning Window, 3200 Lines)
              </div>
              <div className="space-y-3">
                {fftPeaks.map((peak, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono-tech font-semibold text-white">{peak.freq}</span>
                      <span className="font-mono-tech text-amber-400 font-bold">{peak.amp} mm/s</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                        style={{ width: `${Math.min(100, (Number(peak.amp) / selectedSensor.warningThreshold) * 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-zinc-400">{peak.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sensor Channel Fleet Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Monitored Sensor Array Channels</span>
          </h2>
          <span className="text-xs font-mono-tech text-zinc-400">
            {sensors.length} Connected Probes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sensors.map(sensor => {
            const isSelected = selectedSensor.id === sensor.id;
            return (
              <div
                key={sensor.id}
                onClick={() => setSelectedSensor(sensor)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-md' 
                    : 'bg-[#10141b] border-white/[0.06] hover:bg-white/[0.03]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono-tech text-white">
                      {sensor.tag}
                    </span>
                    <span className={`text-[9px] font-mono-tech uppercase px-1.5 py-0.2 rounded border ${
                      sensor.status === 'warning' 
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {sensor.status}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 mt-1 truncate max-w-[200px]">
                    {sensor.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono-tech mt-1">
                    Baseline: {sensor.baseline} {sensor.unit}
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-base font-bold font-mono-tech ${
                    sensor.status === 'warning' ? 'text-amber-400' : 'text-white'
                  }`}>
                    {sensor.currentValue}
                  </div>
                  <div className="text-[10px] text-zinc-400">{sensor.unit}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
