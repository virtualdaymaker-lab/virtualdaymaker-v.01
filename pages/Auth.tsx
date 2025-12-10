
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useSettings } from '../App';
import { Mail, Lock, ArrowRight, ShieldCheck, Box, User } from 'lucide-react';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, markWelcomeSeen } = useAuth();
  const { welcomeMessage, activeLogo } = useSettings();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Welcome Modal State
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // NOTE: We do NOT login yet. We just show the modal.
      // This prevents the app from redirecting while this component tries to render the modal.
      setShowWelcome(true); 
      setIsLoading(false);
    }, 1500);
  };

  const handleWelcomeClose = () => {
      // NOW we login, immediately before navigating away.
      login(email);
      markWelcomeSeen();
      setShowWelcome(false);
      navigate('/shop');
  };

  if (showWelcome) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-6 animate-fade-in-up">
            <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-8 relative shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
                
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/10">
                        {activeLogo ? <img src={activeLogo} className="w-full h-full object-contain p-2" alt="Logo" /> : <Box size={32} className="text-white" />}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-4 uppercase tracking-wider">System Message</h2>
                <div className="bg-black/40 rounded-xl p-6 border border-white/5 mb-8 min-h-[100px] text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {welcomeMessage}
                </div>

                <button 
                    onClick={handleWelcomeClose}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-50 transition-colors shadow-lg"
                >
                    Enter System
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#000] text-white p-6 overflow-hidden font-sans">
        
        {/* --- SHOOTING STAR PERIMETER ANIMATION (SCREEN EDGE) --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
             <div className="star-line star-top" />
             <div className="star-line star-right" />
             <div className="star-line star-bottom" />
             <div className="star-line star-left" />
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="w-full max-w-sm relative z-10">
            
            {/* --- CUSTOM CSS LOGO RECREATION --- */}
            <div className="flex flex-col items-center justify-center mb-12 transform scale-100 hover:scale-105 transition-transform duration-500">
                
                {/* 1. TOP TEXT: VDM v1.0 (Chrome Gradient) */}
                <h1 
                    className="text-3xl font-bold mb-6 tracking-widest uppercase italic"
                    style={{
                        background: 'linear-gradient(to bottom, #ffffff 0%, #d1d1d1 50%, #a1a1a1 51%, #f2f2f2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                        fontFamily: 'Arial, sans-serif'
                    }}
                >
                    VDM v1.0
                </h1>

                {/* 2. THE APP ICON (Rounded Square with Orb or Custom Logo) */}
                <div className="relative">
                    {/* --- APPLE INTELLIGENCE STREAM AROUND LOGO --- */}
                    <div className="absolute -inset-1 rounded-[2.8rem] overflow-hidden z-0 pointer-events-none opacity-100">
                        <div className="star-line star-top" style={{animationDuration: '3s'}} />
                        <div className="star-line star-right" style={{animationDuration: '3s', animationDelay: '0.75s'}} />
                        <div className="star-line star-bottom" style={{animationDuration: '3s', animationDelay: '1.5s'}} />
                        <div className="star-line star-left" style={{animationDuration: '3s', animationDelay: '2.25s'}} />
                    </div>

                    {/* Outer Silver Bezel (The Logo Itself) */}
                    <div 
                        className="w-48 h-48 rounded-[2.5rem] p-[3px] shadow-2xl relative z-10"
                        style={{
                            background: 'linear-gradient(135deg, #e2e2e2 0%, #999999 50%, #444444 100%)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                        }}
                    >
                        {/* Inner Black Gap */}
                        <div className="w-full h-full bg-black rounded-[2.3rem] p-[4px] overflow-hidden flex items-center justify-center">
                            
                            {activeLogo ? (
                                // CUSTOM LOGO RENDER
                                <div className="w-full h-full rounded-[2rem] bg-black flex items-center justify-center p-4">
                                     <img src={activeLogo} alt="Brand" className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                // DEFAULT CYAN ORB
                                <div 
                                    className="w-full h-full rounded-[2rem] relative overflow-hidden flex items-center justify-center"
                                    style={{
                                        background: 'radial-gradient(circle at 50% 30%, #22d3ee 0%, #0891b2 40%, #000000 90%)',
                                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9)'
                                    }}
                                >
                                    {/* Top Gloss Reflection */}
                                    <div className="absolute top-0 w-full h-[45%] bg-gradient-to-b from-white/40 to-transparent opacity-80 rounded-t-[2rem]" />
                                    
                                    {/* Bottom Glow */}
                                    <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-cyan-500/30 to-transparent blur-md" />

                                    {/* CENTER TEXT: BOSS */}
                                    <h2 
                                        className="relative z-10 text-5xl font-black tracking-wider italic"
                                        style={{
                                            fontFamily: 'Arial, sans-serif',
                                            background: 'linear-gradient(to bottom, #ffffff 0%, #e2e2e2 45%, #888888 50%, #f2f2f2 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            filter: 'drop-shadow(0px 2px 0px rgba(0,0,0,0.8))'
                                        }}
                                    >
                                        BOSS
                                    </h2>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. BOTTOM TEXT: Secure Access Terminal (Chrome Gradient) */}
                <h3 
                    className="text-xl font-medium mt-6 tracking-[0.1em]"
                    style={{
                        background: 'linear-gradient(to bottom, #ffffff 0%, #cccccc 50%, #999999 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0px 2px 2px rgba(0,0,0,0.8)',
                        fontFamily: 'Arial, sans-serif'
                    }}
                >
                    Secure Access Terminal
                </h3>
            </div>

            {/* Form Container */}
            <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-1 backdrop-blur-md shadow-2xl">
                <div className="bg-[#050505] rounded-[20px] p-6 sm:p-8 relative">
                    
                    <form onSubmit={handleSignIn} className="space-y-5 relative z-10">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Identity</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={16} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-700 outline-none focus:border-white/50 transition-all font-medium text-sm shadow-inner"
                                    placeholder="admin@VdMv.01.com"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Passcode</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={16} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-700 outline-none focus:border-white/50 transition-all font-medium text-sm font-mono tracking-widest shadow-inner"
                                    placeholder="••••••"
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-4 mt-2 bg-white hover:bg-slate-200 text-black font-bold rounded-xl border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Verifying...</span>
                            ) : (
                                <>
                                    Initialize Session <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center">
                        <button className="text-[10px] font-bold text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 uppercase tracking-wider">
                            <ShieldCheck size={12} /> Encrypted Connection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
