import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  ShieldAlert,
  Plus
} from 'lucide-react';
import { IndustrialMachine } from '../../types/industrial';

interface MaintenanceTaskModalProps {
  machine: IndustrialMachine;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: (task: {
    title: string;
    priority: string;
    assignee: string;
    dueDate: string;
    parts: string[];
    description: string;
  }) => void;
}

export const MaintenanceTaskModal: React.FC<MaintenanceTaskModalProps> = ({
  machine,
  isOpen,
  onClose,
  onTaskCreated
}) => {
  const [title, setTitle] = useState(
    machine.risk === 'HIGH' 
      ? `Emergency Inspection: ${machine.id} Bearing Vibration Excursion`
      : `Preventive Calibration: ${machine.id} Telemetry Check`
  );
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ROUTINE'>(
    machine.risk === 'HIGH' ? 'CRITICAL' : machine.risk === 'MEDIUM' ? 'HIGH' : 'MEDIUM'
  );
  const [assignee, setAssignee] = useState('Rajesh Verma (Lead Turbomachinery Analyst)');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [description, setDescription] = useState(
    machine.novaInsight 
      ? `Work order initiated per NOVA AI diagnostic: "${machine.novaInsight}" Verify alignment, replace suspect tilt-pads if clearance exceeded.`
      : `Standard inspection order for ${machine.name} (${machine.tag}) in ${machine.location || machine.plantArea}.`
  );
  const [parts, setParts] = useState<string[]>(
    machine.id === 'C-204'
      ? ['Tilt-pad bearing kit #2', 'Synthetic ISO VG 46 lube oil (50L)', 'Laser alignment target set']
      : machine.id === 'P-118'
      ? ['Plan 53A barrier fluid seal kit', 'Kingsbury thrust bearing shoes']
      : ['Synthetic polyurea grease', 'Vibration accelerometer probe']
  );
  const [newPartInput, setNewPartInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleAddPart = () => {
    if (newPartInput.trim()) {
      setParts([...parts, newPartInput.trim()]);
      setNewPartInput('');
    }
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onTaskCreated) {
      onTaskCreated({
        title,
        priority,
        assignee,
        dueDate,
        parts,
        description
      });
    }
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#0e1219] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Create Maintenance Task</span>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-white/[0.06] text-amber-300">
                  {machine.id}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                SCADA Asset Work Order & SAP PM Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-base font-bold text-white">Work Order Dispatched</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Work order <strong>WO-2026-{Math.floor(1000 + Math.random() * 9000)}</strong> has been synchronized with the plant SAP PM system. Technicians notified via radio pager.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Work Order Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Grid 2 Col: Priority & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Severity Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121620] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="CRITICAL">CRITICAL (Immediate Turnaround)</option>
                  <option value="HIGH">HIGH (Next Shift 4h window)</option>
                  <option value="MEDIUM">MEDIUM (Within 48 hours)</option>
                  <option value="ROUTINE">ROUTINE (Planned cycle)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Target Resolution Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Responsible Field Lead</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#121620] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="Rajesh Verma (Lead Turbomachinery Analyst)">Rajesh Verma (Lead Turbomachinery Analyst)</option>
                <option value="Marcus Lindqvist (Senior Reliability Engineer)">Marcus Lindqvist (Senior Reliability Engineer)</option>
                <option value="Sunita Rao (Electrical Drive Specialist)">Sunita Rao (Electrical Drive Specialist)</option>
                <option value="Vikram Singh (Mechanical Shift Supervisor)">Vikram Singh (Mechanical Shift Supervisor)</option>
              </select>
            </div>

            {/* Parts Required */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Requisite Tooling & Spare Parts</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {parts.map((part, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-zinc-300"
                  >
                    <span>{part}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePart(idx)}
                      className="text-zinc-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPartInput}
                  onChange={(e) => setNewPartInput(e.target.value)}
                  placeholder="Add stock item code or part name..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPart();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs text-white font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Diagnostic Scope & Work Instructions</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none"
              />
            </div>

            {/* Submit & Cancel */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs text-zinc-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Dispatch Work Order</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
