import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Gauge, 
  Sliders, 
  Building2,
  Server,
  Zap,
  TrendingDown,
  FileText,
  AlertTriangle,
  Play,
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import { AppRoute } from '../../types/industrial';
import { IndustrialMachineDiagram } from '../landing/IndustrialMachineDiagram';
import { IntelligenceLoopStory } from '../landing/IntelligenceLoopStory';

interface LandingViewProps {
  onNavigate: (route: AppRoute) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#07090d] text-[#e3e8ef] selection:bg-amber-500/30 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Editorial Minimal Navigation */}
      <nav className="border-b border-white/[0.08] bg-[#0c0f15]/80 backdrop-blur-2xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => onNavigate('/')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 via-zinc-800 to-zinc-950 border border-amber-500/40 flex items-center justify-center shadow-md">
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg">INDUSTRIX</span>
              <span className="text-[10px] font-mono-tech uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/25">
                INDUSTRIAL AI
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition-colors">Command Center</button>
            <button onClick={() => onNavigate('/nova')} className="hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NOVA Copilot</span>
            </button>
            <button onClick={() => onNavigate('/investigations')} className="hover:text-white transition-colors">Root Cause RCA</button>
            <button onClick={() => onNavigate('/intelligence')} className="hover:text-white transition-colors">Risk Intelligence</button>
            <button onClick={() => onNavigate('/reports')} className="hover:text-white transition-colors">Reports</button>
            <button onClick={() => onNavigate('/machines')} className="hover:text-white transition-colors">Asset Fleet</button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section: Large Typography & Editorial Composition */}
      <section className="relative pt-20 pb-28 overflow-hidden border-b border-white/[0.06] bg-fine-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07090d]/60 to-[#07090d] pointer-events-none" />
        
        {/* Subtle Ambient Radial Light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl space-y-6"
          >
            {/* Technical Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono-tech text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>IEC 62443 & API 670 COMPLIANT ARCHITECTURE</span>
              <span className="text-zinc-600">/</span>
              <span className="text-amber-400/90 font-medium">EDGE TELEMETRY REASONING</span>
            </div>

            {/* Apple-grade Display Typography */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.04]">
              Autonomous Intelligence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                For Heavy Industry.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed max-w-3xl">
              INDUSTRIX AI combines Physics-Informed Neural Networks (PINNs) with high-frequency SCADA telemetry to eliminate catastrophic rotating asset failures, automate 7-step root-cause investigations, and empower plant engineers with millisecond diagnostic foresight.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:opacity-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 group"
              >
                <span>Enter Operational Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/nova')}
                className="px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] transition-all flex items-center gap-2.5 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Consult NOVA Copilot</span>
              </button>

              <button
                onClick={() => onNavigate('/investigations')}
                className="px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>Root Cause Console</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          </motion.div>

          {/* Machine Cutaway Telemetry Interactive Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <IndustrialMachineDiagram />
          </motion.div>
        </div>
      </section>

      {/* Section 2: Visual Storytelling — The 4-Stage Autonomous Intelligence Loop */}
      <section className="py-28 border-b border-white/[0.06] bg-[#090c12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14">
          
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-mono-tech uppercase text-amber-400 tracking-wider">
              OPERATIONAL WORKFLOW // 4-STAGE REASONING LOOP
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              From continuous sensor micro-pulses to automated root cause isolation.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Replacing disconnected condition-monitoring dashboards with an intelligent, physics-informed feedback cycle that protects turbomachinery without human delay.
            </p>
          </div>

          <IntelligenceLoopStory />
        </div>
      </section>

      {/* Section 3: Core Enterprise Capabilities (Progressive Cards) */}
      <section className="py-28 border-b border-white/[0.06] bg-[#07090d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-mono-tech uppercase text-amber-400 tracking-wider">
              ENTERPRISE CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Engineered for the demands of 24/7 mission-critical operations.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Standardized across rotating turbomachinery, cryogenic gas compressors, slurry pumping trains, and industrial utility grids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Predictive Maintenance */}
            <div className="p-8 rounded-3xl bg-[#0c1017] border border-white/[0.08] hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-6 shadow-xl group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                  <Gauge className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                  Predictive Maintenance & RUL
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Physics-informed Remaining Useful Life (RUL) modeling tracking mechanical fatigue kinetics across bearings, impellers, and seals weeks before failure occurs.
                </p>
              </div>

              <button 
                onClick={() => onNavigate('/intelligence')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 self-start pt-4 border-t border-white/[0.06] w-full"
              >
                <span>Explore Predictive Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: 7-Step Incident Investigation */}
            <div className="p-8 rounded-3xl bg-[#0c1017] border border-white/[0.08] hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-6 shadow-xl group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                  Root Cause Investigation
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Interactive 7-step investigation workstation with multi-sensor Pearson cross-correlations, probabilistic causal trees, and verified CAPA action plans.
                </p>
              </div>

              <button 
                onClick={() => onNavigate('/investigations')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 self-start pt-4 border-t border-white/[0.06] w-full"
              >
                <span>Launch RCA Workstation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Formal Industrial Reporting */}
            <div className="p-8 rounded-3xl bg-[#0c1017] border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-6 shadow-xl group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  Industrial Regulatory Reports
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Automated ISO 14224 and API 670 audit dossiers covering incident forensics, fleet machinery health, OEE performance, and executive reliability briefings.
                </p>
              </div>

              <button 
                onClick={() => onNavigate('/reports')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 self-start pt-4 border-t border-white/[0.06] w-full"
              >
                <span>Open Reports Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Global Deployment Matrix */}
      <section className="py-28 border-b border-white/[0.06] bg-[#090c12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono-tech uppercase text-amber-400 tracking-wider">
                DEPLOYMENT MATRIX
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Operating across leading global facilities.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              Connected across major chemical synthesis trains, EV gigafactories, cryogenic gas processing, and aerospace machining centers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/[0.06] hover:border-amber-500/40 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="text-base font-bold text-white">Lucknow Complex</div>
                <div className="text-xs text-zinc-400 mt-0.5">Synthesis Train B4</div>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-tech">
                <span className="text-zinc-400">32 Units</span>
                <span className="text-amber-400 font-bold">1 Active Alert</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/[0.06] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <div className="text-base font-bold text-white">Detroit Gigafactory</div>
                <div className="text-xs text-zinc-400 mt-0.5">Propulsion Line 02</div>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-tech">
                <span className="text-zinc-400">38 Units</span>
                <span className="text-emerald-400 font-bold">OEE 93.6%</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/[0.06] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <div className="text-base font-bold text-white">Permian Station 7</div>
                <div className="text-xs text-zinc-400 mt-0.5">Cryogenic Gas Plant</div>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-tech">
                <span className="text-zinc-400">16 Units</span>
                <span className="text-emerald-400 font-bold">OEE 91.2%</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/[0.06] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <div className="text-base font-bold text-white">Yokohama Facility</div>
                <div className="text-xs text-zinc-400 mt-0.5">Precision Machining</div>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-tech">
                <span className="text-zinc-400">19 Units</span>
                <span className="text-emerald-400 font-bold">OEE 95.8%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Editorial Call to Action */}
      <section className="py-24 bg-gradient-to-b from-[#090c12] to-[#07090d] border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-mono-tech text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>ENTERPRISE AIR-GAPPED & ON-PREMISE COMPLIANT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to deploy intelligence to your rotating fleet?
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Access the live industrial command console or connect directly with the NOVA copilot to review live plant telemetry and root cause investigations.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <span>Launch Industrial Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/login')}
              className="px-8 py-4 rounded-2xl text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all"
            >
              Plant Engineer Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#05070a] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-zinc-400">
          <div>
            INDUSTRIX AI &copy; 2026. Heavy Industrial Systems Intelligence.
          </div>
          <div className="flex items-center gap-6">
            <span>ISO 55000 / API 670</span>
            <span>IEC 62443 Certified</span>
            <span>SIMULATED INDUSTRIAL DATA</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
