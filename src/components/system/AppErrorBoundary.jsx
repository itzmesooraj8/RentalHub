import React from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
export class AppErrorBoundary extends React.Component {
  props;
  state;
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("RentalHub AppErrorBoundary caught an uncaught exception:", error, errorInfo);
  }
  handleReload = () => {
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#111111] border border-[#222222] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                Application Recovery State
              </span>
              <h1 className="text-2xl font-serif font-bold italic text-white">Something Went Wrong</h1>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                RentalHub encountered an unexpected UI rendering exception. Your database connection and backend state remain safe.
              </p>
            </div>

            {this.state.error && <div className="p-3 bg-[#181818] border border-[#282828] rounded-xl text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>}

            <button
        onClick={this.handleReload}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F27D26] hover:bg-[#d96c1e] text-white font-mono font-bold text-sm transition shadow-lg shadow-[#F27D26]/20 cursor-pointer"
      >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>;
    }
    return this.props.children;
  }
}
