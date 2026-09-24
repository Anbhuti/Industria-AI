import React from 'react';
import { 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Zap, 
  Lock, 
  Server, 
  Database, 
  CheckCircle2, 
  ArrowRight,
  GitBranch,
  Activity
} from 'lucide-react';
import { AppRoute } from '../../types/industrial';

interface TechnologyViewProps {
  onNavigate: (route: AppRoute) => void;
}

export const TechnologyView: React.FC<TechnologyViewProps> = ({ onNavigate }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>NEURAL ARCHITECTURE & PHYSICS-INFORMED MODELS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            The INDUSTRIX Technology Core
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Coupling first-principles physics equations with high-frequency edge telemetry.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/nova')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
        >
          <span>Test Live with NOVA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Core Technology Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1 */}
        <div className="p-6 rounded-2xl bg-[#10141b] border border-white/[0.08] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Physics-Informed Neural Networks (PINNs)
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Standard deep learning models hallucinate under rare industrial operating regimes. INDUSTRIX embeds Navier-Stokes fluid equations, Reynolds lubrication theory, and rotor-dynamic stiffness matrices directly into neural loss functions.
          </p>
          <div className="pt-2 border-t border-white/[0.05] text-[11px] font-mono-tech text-amber-400">
            Zero hallucinations on edge-case surge
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-6 rounded-2xl bg-[#10141b] border border-white/[0.08] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Sub-5ms Edge Telemetry Ingestion
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Direct hardware connectors for OPC-UA, MQTT Sparkplug B, Modbus TCP, Profinet, Emerson DeltaV, Siemens S7, and Honeywell Experion. Executes waveform FFTs and order-tracking locally before cloud aggregation.
          </p>
          <div className="pt-2 border-t border-white/[0.05] text-[11px] font-mono-tech text-emerald-400">
            10,000 samples/sec per sensor probe
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="p-6 rounded-2xl bg-[#10141b] border border-white/[0.08] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            IEC 62443 & SIL-3 Certification
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Designed for air-gapped, sovereign plant deployments. Hardware security module (HSM) mutual TLS authentication with strict role-based access control (RBAC) preventing unauthorized SCADA writes.
          </p>
          <div className="pt-2 border-t border-white/[0.05] text-[11px] font-mono-tech text-blue-400">
            Air-Gapped & Sovereign Ready
          </div>
        </div>
      </div>

      {/* Protocol Architecture Matrix */}
      <div className="p-6 rounded-2xl bg-[#10141b] border border-white/[0.08] shadow-xl space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-bold text-white tracking-tight">
            Industrial SCADA / DCS Protocol Compatibility
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Native bidirectional connectivity to plant distributed control systems.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-xs font-bold text-white">OPC-UA / DA</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Unified Architecture</div>
            <div className="mt-2 text-[10px] font-mono-tech text-emerald-400">Native Ingestion</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-xs font-bold text-white">MQTT Sparkplug B</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Edge Gateway Bus</div>
            <div className="mt-2 text-[10px] font-mono-tech text-emerald-400">Stateful Payload</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-xs font-bold text-white">Emerson DeltaV</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Process DCS Gateway</div>
            <div className="mt-2 text-[10px] font-mono-tech text-emerald-400">Continuous Sync</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-xs font-bold text-white">Siemens S7 / TIA</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Industrial PLCs</div>
            <div className="mt-2 text-[10px] font-mono-tech text-emerald-400">DB Block Read</div>
          </div>
        </div>
      </div>
    </div>
  );
};
