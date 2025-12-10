
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { CheckCircle, Home, Download, FileText, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';
import { useCart } from '../App';

export const FinalPromo: React.FC = () => {
  const navigate = useNavigate();
  const { total } = useCart();
  const orderId = `VDM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const date = new Date().toLocaleDateString();

  return (
    <Layout hideNav>
      <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
        
        {/* Static Translucent Receipt Card */}
        <div className="w-full max-w-md bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            
            {/* Top Gloss */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 animate-pulse">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Kit Secured</h1>
                <p className="text-slate-400 text-xs mt-2 uppercase tracking-wide">Software Payment Secured. Activation Pending.</p>
            </div>

            {/* Receipt Details */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 mb-8 relative z-10">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">License Key ID</span>
                    <span className="text-white font-mono text-sm">{orderId}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Date</span>
                    <span className="text-white font-mono text-sm">{date}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Status</span>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold uppercase">
                        <ShieldCheck size={12} /> Awaiting Setup
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Total</span>
                    <span className="text-cyan-400 font-mono text-lg font-bold">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* MESSAGE TO BUYER */}
            <div className="mb-6 bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl text-center">
                <p className="text-cyan-400 text-xs font-bold uppercase mb-2">⚠ Action Required</p>
                <p className="text-slate-300 text-xs leading-relaxed">
                    We do not provide raw code downloads to ensure security. 
                    <br/><br/>
                    <strong>You must book your activation call.</strong> Our concierge will install the system for you remotely.
                </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 relative z-10">
                <button 
                    onClick={() => navigate('/receiver/booking')} 
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-bounce"
                >
                    <Calendar size={18} /> Schedule Setup Call
                </button>
                
                <button 
                    onClick={() => navigate('/shop')}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                    <Home size={14} /> Return to Store
                </button>
            </div>

            {/* Subtle Footer */}
            <div className="mt-8 text-center">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">MGTConsulting // Concierge Activation</p>
            </div>
        </div>

      </div>
    </Layout>
  );
};
