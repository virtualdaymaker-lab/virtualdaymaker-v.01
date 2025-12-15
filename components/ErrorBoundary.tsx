import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Power } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public handleReload = () => {
      // Clear cache and reload
      localStorage.removeItem('gifos_user'); // Optional: Logout on crash to fix stuck state
      window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-6 font-mono relative overflow-hidden">
            {/* Background Noise */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
            
            <div className="max-w-md w-full border border-red-500/50 bg-red-900/10 rounded-2xl p-8 backdrop-blur-xl relative z-10 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>
                    
                    <h1 className="text-2xl font-bold uppercase tracking-widest text-red-500 mb-2">System Failure</h1>
                    <p className="text-xs text-red-300/70 mb-6 uppercase tracking-wide">Critical Rendering Error Detected</p>
                    
                    <div className="w-full bg-black/50 p-4 rounded-lg border border-red-500/20 mb-8 text-left overflow-auto max-h-32">
                        <p className="text-[10px] text-red-400 font-mono break-all">
                            {this.state.error?.message || JSON.stringify(this.state.error) || "Unknown Error"}
                        </p>
                    </div>

                    <button 
                        onClick={this.handleReload}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                        <RefreshCw size={18} /> Reboot System
                    </button>
                    
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
                        <Power size={10} />
                        <span>AUTO_DIAGNOSTIC_V2.5.0</span>
                    </div>
                </div>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}