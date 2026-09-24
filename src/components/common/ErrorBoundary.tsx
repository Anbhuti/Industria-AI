import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Terminal, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('INDUSTRIX AI Operational Uncaught Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[420px] w-full flex items-center justify-center p-6 bg-[#0c0f15] text-[#e1e7ef] font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="max-w-xl w-full p-6 sm:p-8 rounded-2xl bg-[#121620] border border-rose-500/30 shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase">
                    SIL-3 TELEMETRY INTERRUPT
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {this.props.fallbackTitle || 'Industrial Process Interface Error'}
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A transient rendering exception occurred in this industrial telemetry module. Safety telemetry buffers remain intact on the edge gateway.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] font-mono-tech text-xs text-rose-300/90 overflow-x-auto">
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Stack Trace Excerpt:</div>
                <div className="truncate font-semibold">{this.state.error.toString()}</div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08]">
              <span className="text-[11px] font-mono-tech text-zinc-500">
                Audit Code: ERR-SCADA-UI-408
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => window.location.href = '/'}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Platform Overview</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleReset}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Component</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
