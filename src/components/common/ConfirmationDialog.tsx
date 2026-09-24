import React from 'react';
import { AlertTriangle, AlertOctagon, Info, ShieldAlert, LucideIcon } from 'lucide-react';
import { Modal } from './Modal';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  severity?: 'critical' | 'warning' | 'info';
  icon?: LucideIcon;
  detailText?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  severity = 'warning',
  icon,
  detailText
}) => {
  const getSeverityIcon = () => {
    if (icon) return icon;
    switch (severity) {
      case 'critical':
        return AlertOctagon;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getButtonStyles = () => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-600 hover:bg-rose-500 text-white focus-visible:ring-rose-500';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-400 text-black font-bold focus-visible:ring-amber-400';
      default:
        return 'bg-sky-600 hover:bg-sky-500 text-white focus-visible:ring-sky-500';
    }
  };

  const getBorderColor = () => {
    switch (severity) {
      case 'critical':
        return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      default:
        return 'border-sky-500/30 bg-sky-500/10 text-sky-300';
    }
  };

  const SelectedIcon = getSeverityIcon();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      icon={SelectedIcon}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 ${getButtonStyles()}`}
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <p className="text-sm text-zinc-300 leading-relaxed">
          {message}
        </p>

        {detailText && (
          <div className={`p-3 rounded-xl border text-xs font-mono-tech ${getBorderColor()}`}>
            <span className="font-bold mr-1.5">[SAFETY AUDIT]:</span>
            <span>{detailText}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
