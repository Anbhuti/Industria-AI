import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  X 
} from 'lucide-react';
import { useIndustrialApp } from '../../context/IndustrialAppContext';
import { AppNotification } from '../../types/industrial';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useIndustrialApp();

  if (!notifications || notifications.length === 0) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'critical':
        return <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-400 shrink-0" />;
    }
  };

  const getStyle = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 bg-zinc-900/95 text-emerald-200';
      case 'warning':
        return 'border-amber-500/40 bg-zinc-900/95 text-amber-200';
      case 'critical':
        return 'border-rose-500/50 bg-zinc-900/95 text-rose-200 ring-1 ring-rose-500/20';
      default:
        return 'border-sky-500/40 bg-zinc-900/95 text-sky-200';
    }
  };

  return (
    <div 
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-200 flex items-start justify-between gap-3 ${getStyle(notif.type)}`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5">
              {getIcon(notif.type)}
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold font-mono-tech uppercase tracking-wide text-white">
                {notif.title}
              </h5>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-0.5">
                {notif.message}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dismissNotification(notif.id)}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
