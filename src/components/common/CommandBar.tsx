import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Command, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  FileText, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  X 
} from 'lucide-react';
import { useIndustrialApp } from '../../context/IndustrialAppContext';
import { AppRoute } from '../../types/industrial';

interface CommandBarProps {
  onNavigate?: (route: AppRoute) => void;
}

interface CommandItem {
  id: string;
  category: 'Views' | 'Machines' | 'Facilities' | 'Incidents' | 'Actions';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({ onNavigate }) => {
  const { 
    isCommandBarOpen, 
    setIsCommandBarOpen, 
    machines, 
    plants, 
    incidents, 
    setSelectedMachineId, 
    setSelectedPlantId, 
    setSelectedIncidentId, 
    generateReport 
  } = useIndustrialApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isCommandBarOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandBarOpen]);

  // Build command palette items
  const items: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [];

    // Views
    const views: { route: AppRoute; title: string; subtitle: string }[] = [
      { route: '/dashboard', title: 'Telemetry Dashboard', subtitle: 'Overview of fleet health, OEE and critical alerts' },
      { route: '/monitoring', title: 'Real-Time Edge SCADA', subtitle: 'High-frequency telemetry waveforms and vibration spectral' },
      { route: '/machines', title: 'Asset Fleet Directory', subtitle: 'Complete inventory of compressors, pumps and turbines' },
      { route: '/investigations', title: '7-Step Root Cause Analysis', subtitle: 'Detailed causal attribution and CAPA dispatch' },
      { route: '/nova', title: 'NOVA Industrial Copilot', subtitle: 'Interactive physics-informed diagnostic chat' },
      { route: '/reports', title: 'Compliance & Audit Reports', subtitle: 'Generate and review ISO 14224 / API 670 dossiers' },
      { route: '/intelligence', title: 'Fleet Risk Intelligence', subtitle: 'FMEA failure mode matrix and financial exposure' },
      { route: '/technology', title: 'System Architecture', subtitle: 'Edge computing pipeline and air-gapped security stack' }
    ];

    views.forEach(v => {
      list.push({
        id: `view-${v.route}`,
        category: 'Views',
        title: v.title,
        subtitle: v.subtitle,
        icon: Activity,
        action: () => {
          if (onNavigate) onNavigate(v.route);
          setIsCommandBarOpen(false);
        }
      });
    });

    // Machines
    machines.forEach(m => {
      list.push({
        id: `mach-${m.id}`,
        category: 'Machines',
        title: `${m.name} (${m.tag})`,
        subtitle: `${m.plantArea} • Health: ${m.healthScore}% • Status: ${m.status.toUpperCase()}`,
        icon: Cpu,
        action: () => {
          setSelectedMachineId(m.id);
          if (onNavigate) onNavigate('/monitoring');
          setIsCommandBarOpen(false);
        }
      });
    });

    // Facilities
    plants.forEach(p => {
      list.push({
        id: `plant-${p.id}`,
        category: 'Facilities',
        title: p.name,
        subtitle: `${p.location} • Load: ${p.activeLoadMW} MW • OEE: ${p.overallOEE}%`,
        icon: Building2,
        action: () => {
          setSelectedPlantId(p.id);
          if (onNavigate) onNavigate('/dashboard');
          setIsCommandBarOpen(false);
        }
      });
    });

    // Incidents
    incidents.forEach(inc => {
      list.push({
        id: `inc-${inc.id}`,
        category: 'Incidents',
        title: `${inc.code}: ${inc.title}`,
        subtitle: `${inc.machineTag} • Severity: ${inc.severity.toUpperCase()} • ${inc.deviationMetric}`,
        icon: ShieldAlert,
        action: () => {
          setSelectedIncidentId(inc.id);
          setSelectedMachineId(inc.machineId);
          if (onNavigate) onNavigate('/investigations');
          setIsCommandBarOpen(false);
        }
      });
    });

    // Quick Actions
    list.push({
      id: 'act-gen-rpt',
      category: 'Actions',
      title: 'Generate Incident Investigation Dossier',
      subtitle: 'Instantly compile ISO 14224 audit dossier for active asset',
      icon: FileText,
      action: () => {
        generateReport({
          type: 'incident-investigation',
          name: 'Incident Investigation: Turbomachinery Dynamic Whirl',
          machineOrPlant: 'Compressor C-204'
        });
        if (onNavigate) onNavigate('/reports');
        setIsCommandBarOpen(false);
      }
    });

    list.push({
      id: 'act-ask-nova',
      category: 'Actions',
      title: 'Query NOVA Copilot on Active Telemetry',
      subtitle: 'Open physics-informed reasoning drawer',
      icon: Sparkles,
      action: () => {
        if (onNavigate) onNavigate('/nova');
        setIsCommandBarOpen(false);
      }
    });

    return list;
  }, [machines, plants, incidents, onNavigate, setSelectedMachineId, setSelectedPlantId, setSelectedIncidentId, generateReport, setIsCommandBarOpen]);

  // Filter items by query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, 12);
    const q = query.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsCommandBarOpen(false);
    }
  };

  if (!isCommandBarOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pb-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="fixed inset-0" 
        onClick={() => setIsCommandBarOpen(false)} 
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden z-10 font-sans">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/80">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, machine tag (e.g. C-204), facility, or action..."
            className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 focus:outline-none text-sm font-sans"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-tech text-zinc-400 bg-zinc-800 rounded border border-zinc-700">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-mono-tech text-xs">
              No matching assets, views, or commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-3 rounded-xl text-left flex items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate tracking-tight">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono-tech truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/90 text-xs font-mono-tech text-zinc-500 flex items-center justify-between">
          <span>Navigate with ↑ ↓ • Select with Enter</span>
          <span className="text-zinc-400">INDUSTRIX AI // Command Bar</span>
        </div>
      </div>
    </div>
  );
};
