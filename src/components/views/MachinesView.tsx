import React, { useState, useMemo, useEffect } from 'react';
import { 
  Cpu, 
  Search, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  Wrench, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  Sliders, 
  CheckCircle2, 
  X, 
  ExternalLink,
  Activity,
  Layers,
  FileText,
  Table as TableIcon,
  LayoutGrid,
  Radio,
  Flame,
  Gauge,
  Clock,
  TrendingUp,
  ArrowUpDown,
  UploadCloud
} from 'lucide-react';
import { IndustrialMachine, AppRoute, MachineRisk } from '../../types/industrial';
import { MachineDetailPage } from '../machines/MachineDetailPage';
import { useIndustrialApp } from '../../context/IndustrialAppContext';

interface MachinesViewProps {
  machines: IndustrialMachine[];
  onNavigate: (route: AppRoute) => void;
  onAskNovaWithMachine: (machine: IndustrialMachine, prompt?: string) => void;
  selectedMachineId?: string | null;
}

export const MachinesView: React.FC<MachinesViewProps> = ({
  machines,
  onNavigate,
  onAskNovaWithMachine,
  selectedMachineId
}) => {
  const { importCsvData, selectedPlantId } = useIndustrialApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedAssetType, setSelectedAssetType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('priority');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const text = await file.text();
      let rows: any[] = [];
      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(text);
        rows = Array.isArray(parsed) ? parsed : (parsed.machines || [parsed]);
      } else {
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length > 1) {
          const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
            const rowObj: Record<string, any> = {};
            headers.forEach((h, idx) => {
              rowObj[h] = cols[idx] || '';
            });
            rows.push(rowObj);
          }
        }
      }
      if (rows.length > 0) {
        await importCsvData(selectedPlantId || 'plant-lucknow', rows);
      }
    } catch (err: any) {
      console.error('Failed to import data:', err);
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };
  
  // Selected machine for detailed page view
  const [detailedMachine, setDetailedMachine] = useState<IndustrialMachine | null>(() => {
    if (selectedMachineId) {
      return machines.find(m => m.id.toLowerCase() === selectedMachineId.toLowerCase()) || null;
    }
    return null;
  });

  // Sync when selectedMachineId changes externally from NOVA copilot command
  useEffect(() => {
    if (selectedMachineId) {
      const match = machines.find(m => m.id.toLowerCase() === selectedMachineId.toLowerCase());
      if (match) {
        setDetailedMachine(match);
      }
    }
  }, [selectedMachineId, machines]);

  // Extract unique filter options
  const locations = useMemo(() => {
    const locSet = new Set<string>();
    machines.forEach(m => {
      if (m.location) locSet.add(m.location);
      if (m.plantArea) locSet.add(m.plantArea);
    });
    return ['all', ...Array.from(locSet)];
  }, [machines]);

  const assetTypes = useMemo(() => {
    const typeSet = new Set<string>();
    machines.forEach(m => {
      if (m.type) typeSet.add(m.type);
    });
    return ['all', ...Array.from(typeSet)];
  }, [machines]);

  // Filter and sort machines based on query, location, risk, type, and sortBy
  const filteredMachines = useMemo(() => {
    const list = machines.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q) ||
        (m.location && m.location.toLowerCase().includes(q)) ||
        m.plantArea.toLowerCase().includes(q) ||
        m.tag.toLowerCase().includes(q);

      const matchesLocation = selectedLocation === 'all' || 
        m.location === selectedLocation || 
        m.plantArea === selectedLocation;

      const machineRisk = m.risk || (m.status === 'critical' ? 'HIGH' : m.status === 'warning' ? 'MEDIUM' : 'LOW');
      const matchesRisk = selectedRisk === 'all' || machineRisk === selectedRisk;

      const matchesType = selectedAssetType === 'all' || m.type === selectedAssetType;

      return matchesSearch && matchesLocation && matchesRisk && matchesType;
    });

    return list.sort((a, b) => {
      if (sortBy === 'priority') {
        const riskWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const aRisk = a.risk || (a.status === 'critical' ? 'HIGH' : a.status === 'warning' ? 'MEDIUM' : 'LOW');
        const bRisk = b.risk || (b.status === 'critical' ? 'HIGH' : b.status === 'warning' ? 'MEDIUM' : 'LOW');
        if (riskWeight[aRisk] !== riskWeight[bRisk]) {
          return riskWeight[bRisk] - riskWeight[aRisk];
        }
        return a.healthScore - b.healthScore;
      }
      if (sortBy === 'health-asc') return a.healthScore - b.healthScore;
      if (sortBy === 'health-desc') return b.healthScore - a.healthScore;
      if (sortBy === 'vibration-desc') return (b.metrics.vibrationRMS || 0) - (a.metrics.vibrationRMS || 0);
      if (sortBy === 'temp-desc') return (b.metrics.bearingTemp || 0) - (a.metrics.bearingTemp || 0);
      if (sortBy === 'runtime-desc') return (b.runtimeHours || 0) - (a.runtimeHours || 0);
      if (sortBy === 'id-asc') return a.id.localeCompare(b.id);
      return 0;
    });
  }, [machines, searchQuery, selectedLocation, selectedRisk, selectedAssetType, sortBy]);

  // If a detailed machine is selected, render the complete Detailed Machine Page
  if (detailedMachine) {
    return (
      <MachineDetailPage
        machine={detailedMachine}
        onBack={() => setDetailedMachine(null)}
        onInvestigate={(id) => onNavigate('/investigations')}
        onAskNovaWithMachine={(m, customPrompt) => {
          onAskNovaWithMachine(m, customPrompt);
        }}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span>ENTERPRISE ASSET REGISTRY & DIGITAL TWINS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Industrial Machine Registry
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Searchable live telemetry and diagnostic telemetry registry for plant rotating and static equipment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-mono-tech transition-colors flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white/[0.12] text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-mono-tech transition-colors flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white/[0.12] text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono-tech text-zinc-300">
            Registered Assets: <span className="text-amber-400 font-bold">{machines.length}</span>
          </div>

          <label className="cursor-pointer px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono-tech text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors">
            <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
            <span>{isImporting ? 'Ingesting...' : 'Import Data'}</span>
            <input
              type="file"
              accept=".csv,.json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Query */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Machine ID (e.g. C-204, P-118, M-042), Name, or Tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter assets by location"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e1219] border border-white/[0.08] text-xs text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">All Locations</option>
              {locations.filter(l => l !== 'all').map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              aria-label="Filter assets by risk"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e1219] border border-white/[0.08] text-xs text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">All Risk Levels</option>
              <option value="HIGH">HIGH Risk</option>
              <option value="MEDIUM">MEDIUM Risk</option>
              <option value="LOW">LOW Risk</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort asset fleet"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e1219] border border-white/[0.08] text-xs text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="priority">Sort: Priority (Risk & Health)</option>
              <option value="health-asc">Sort: Lowest Health First</option>
              <option value="health-desc">Sort: Highest Health First</option>
              <option value="vibration-desc">Sort: Highest Vibration (mm/s)</option>
              <option value="temp-desc">Sort: Highest Temp (°C)</option>
              <option value="runtime-desc">Sort: Longest Runtime Hours</option>
              <option value="id-asc">Sort: Machine ID (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pill Shortcuts for Example Machines */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono-tech text-zinc-500">Quick Access:</span>
          {['C-204', 'P-118', 'M-042'].map(quickId => {
            const m = machines.find(item => item.id === quickId);
            if (!m) return null;
            return (
              <button
                key={quickId}
                onClick={() => setDetailedMachine(m)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono-tech text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span className="font-bold text-amber-300">{m.id}</span>
                <span className="text-zinc-400">({m.name})</span>
                <span className={`text-[9px] px-1 rounded ${
                  (m.risk === 'HIGH' || m.status === 'critical') ? 'bg-rose-500/20 text-rose-300' :
                  (m.risk === 'MEDIUM' || m.status === 'warning') ? 'bg-amber-500/20 text-amber-300' :
                  'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {m.risk || 'NOMINAL'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Results Count */}
      <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
        <span>Showing {filteredMachines.length} of {machines.length} monitored equipment assets</span>
        {filteredMachines.length === 0 && (
          <span className="text-amber-400">No assets match your search parameters.</span>
        )}
      </div>

      {/* CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMachines.map(machine => {
            const risk = machine.risk || (machine.status === 'critical' ? 'HIGH' : machine.status === 'warning' ? 'MEDIUM' : 'LOW');
            const riskConfig = risk === 'HIGH' 
              ? { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' }
              : risk === 'MEDIUM'
              ? { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' }
              : { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };

            const isHighRisk = risk === 'HIGH';

            return (
              <div
                key={machine.id}
                onClick={() => setDetailedMachine(machine)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isHighRisk 
                    ? 'bg-[#12161f] border-amber-500/30 hover:border-amber-400/60 shadow-lg' 
                    : 'bg-[#10141b] border-white/[0.06] hover:border-white/[0.16] hover:bg-[#121721]'
                }`}
              >
                <div>
                  {/* Card Header: ID, Name, Location, Risk */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/[0.05]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono-tech text-white bg-white/[0.08] px-2 py-0.5 rounded">
                          {machine.id}
                        </span>
                        <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded border ${riskConfig.bg} ${riskConfig.text} ${riskConfig.border}`}>
                          RISK: {risk}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1.5">
                        {machine.name}
                      </h3>
                      <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
                        <span>{machine.type}</span>
                        <span>•</span>
                        <span className="text-zinc-300">{machine.location || machine.plantArea}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-mono-tech uppercase text-zinc-400">Health</div>
                      <div className={`text-xl font-black font-mono-tech ${
                        machine.healthScore < 70 ? 'text-rose-400' :
                        machine.healthScore < 85 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {machine.healthScore}%
                      </div>
                    </div>
                  </div>

                  {/* Core Telemetry Grid (Temp, Vib, Press, Runtime) */}
                  <div className="grid grid-cols-4 gap-2 my-3.5">
                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-[9px] font-mono-tech text-zinc-400 uppercase">Temp</div>
                      <div className="text-xs font-bold font-mono-tech text-orange-400 mt-0.5">
                        {machine.metrics.bearingTemp}°C
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-[9px] font-mono-tech text-zinc-400 uppercase">Vibration</div>
                      <div className={`text-xs font-bold font-mono-tech mt-0.5 ${
                        machine.metrics.vibrationRMS > 4.5 ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {machine.metrics.vibrationRMS} <span className="text-[9px]">mm/s</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-[9px] font-mono-tech text-zinc-400 uppercase">Pressure</div>
                      <div className="text-xs font-bold font-mono-tech text-cyan-400 mt-0.5">
                        {machine.metrics.dischargePressure || 0} <span className="text-[9px]">bar</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-[9px] font-mono-tech text-zinc-400 uppercase">Runtime</div>
                      <div className="text-xs font-bold font-mono-tech text-white mt-0.5">
                        {machine.runtimeHours || machine.mtbfHours || 4280}h
                      </div>
                    </div>
                  </div>

                  {/* Alarm / NOVA Insight preview */}
                  {machine.alarm ? (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 line-clamp-2">
                      <span className="font-bold text-amber-400 font-mono-tech">ALERT:</span> {machine.alarm}
                    </div>
                  ) : machine.novaInsight ? (
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-300 line-clamp-2">
                      <span className="font-bold text-amber-300 font-mono-tech">NOVA:</span> {machine.novaInsight}
                    </div>
                  ) : null}
                </div>

                {/* Footer: Last Maintenance & Open Details CTA */}
                <div className="pt-3 border-t border-white/[0.05] mt-3 flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Last Mnt: <strong className="text-zinc-300">{machine.lastOverhaul}</strong></span>
                  </div>
                  <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-xs font-semibold">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW (User Requested Columns) */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c1017]">
          <table className="w-full text-left border-collapse text-xs font-mono-tech">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Machine ID</th>
                <th className="py-3.5 px-4 font-semibold">Machine Name</th>
                <th className="py-3.5 px-4 font-semibold">Asset Type</th>
                <th className="py-3.5 px-4 font-semibold">Location</th>
                <th className="py-3.5 px-4 font-semibold">Health</th>
                <th className="py-3.5 px-4 font-semibold">Temperature</th>
                <th className="py-3.5 px-4 font-semibold">Vibration</th>
                <th className="py-3.5 px-4 font-semibold">Pressure</th>
                <th className="py-3.5 px-4 font-semibold">Runtime</th>
                <th className="py-3.5 px-4 font-semibold">Last Maint</th>
                <th className="py-3.5 px-4 font-semibold">Risk</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredMachines.map(machine => {
                const risk = machine.risk || (machine.status === 'critical' ? 'HIGH' : machine.status === 'warning' ? 'MEDIUM' : 'LOW');
                const riskBadge = risk === 'HIGH'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : risk === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

                return (
                  <tr
                    key={machine.id}
                    onClick={() => setDetailedMachine(machine)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-amber-300">
                      {machine.id}
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-white group-hover:text-amber-300">
                      {machine.name}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {machine.type}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {machine.location || machine.plantArea}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        machine.healthScore < 70 ? 'text-rose-400' :
                        machine.healthScore < 85 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {machine.healthScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-orange-400 font-bold">
                      {machine.metrics.bearingTemp}°C
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${machine.metrics.vibrationRMS > 4.5 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {machine.metrics.vibrationRMS} mm/s
                      </span>
                    </td>
                    <td className="py-3 px-4 text-cyan-400">
                      {machine.metrics.dischargePressure || 0} bar
                    </td>
                    <td className="py-3 px-4 text-zinc-200">
                      {machine.runtimeHours || machine.mtbfHours || 4280} hrs
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {machine.lastOverhaul}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskBadge}`}>
                        {risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailedMachine(machine);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-amber-400 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
