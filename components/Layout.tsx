
import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Settings, Zap, ChevronLeft, ChevronRight, Lock, X, Terminal, Moon, Sun, Volume2, VolumeX, EyeOff, Eye, Palette, Globe, Shield, Mail, FileText, CloudSun, User, Upload, Download, Accessibility, Smartphone, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart, useSettings, useAuth } from '../App';
import { AIin5Widget } from './AIin5Widget';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideNav = false }) => {
  // # REGION: HOOKS & STATE
  const { items } = useCart();
  const { user } = useAuth();
  const { 
      themeMode, setThemeMode, reduceMotion, toggleMotion, 
      soundEnabled, toggleSound, decoration, setDecoration, customThemeData, activeLogo,
      profileImage, setProfileImage, profilePosition, setProfilePosition,
      deferredPrompt, installApp,
      themeOverrides,
      accessibilityMode, toggleAccessibilityMode
  } = useSettings();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showMobileConnect, setShowMobileConnect] = useState(false);
  
  // Admin Login State
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  // Profile Drag State
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated Global Admin State
  const isAdminRoute = location.pathname.includes('/admin');
  // # END REGION: HOOKS

  // # REGION: HANDLERS
  // Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'admin123') {
      setShowAdminLogin(false);
      setShowSettingsModal(false);
      setAdminPass('');
      setAdminError('');
      navigate('/admin');
    } else {
      setAdminError('Access Denied');
    }
  };
  
  // --- Profile Drag Logic ---
  const handleProfileMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDraggingProfile(true);
  };

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          if (!isDraggingProfile) return;
          const newX = e.clientX - 25;
          const newY = e.clientY - 25;
          setProfilePosition({ x: newX, y: newY });
      };

      const handleMouseUp = () => {
          setIsDraggingProfile(false);
      };

      if (isDraggingProfile) {
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      };
  }, [isDraggingProfile, setProfilePosition]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setProfileImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };
  // # END REGION: HANDLERS

  // # REGION: VISUALS
  // Theme Classes Logic
  const isDark = themeMode === 'dark';
  const isAutumn = themeMode === 'autumn';

  // Dynamic Backgrounds based on Theme Mode
  const bgClass = isDark 
    ? 'bg-slate-950 text-white' 
    : isAutumn
        ? 'bg-orange-50 text-amber-950'
        : 'bg-slate-50 text-slate-900';

  const headerClass = isDark ? 'bg-black/20 border-white/10' : 'bg-white/60 border-black/5 shadow-sm';
  const glassPanelClass = isDark ? 'bg-black border-white/10' : 'bg-white border-black/10';

  // Get active overrides for inline styles
  const activeOverride = themeOverrides[themeMode];

  // QR Code URL for current page
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}&color=${isDark ? 'ffffff' : '000000'}&bgcolor=transparent`;

  // --- AMBIENCE GENERATOR ---
  const getAmbience = () => {
    if (decoration === 'custom' && customThemeData) {
        return (
            <>
                <div 
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000" 
                    style={{ backgroundColor: customThemeData.primaryColor || 'rgba(100,100,100,0.2)' }} 
                />
                <div 
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000"
                    style={{ backgroundColor: customThemeData.secondaryColor || 'rgba(100,100,100,0.2)' }}
                />
            </>
        );
    }
    if (isAutumn) {
        return (
            <>
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-400/20 rounded-full blur-[120px]" />
                <div className="absolute top-[30%] right-[-20%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[10%] w-[700px] h-[600px] bg-rose-400/15 rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 to-stone-100/40 pointer-events-none mix-blend-overlay" />
            </>
        );
    }
    if (!isDark && !isAutumn) {
        return (
            <>
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-slate-200/30 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-white/20 pointer-events-none" />
            </>
        );
    }
    
    // Dark Mode Decorations
    switch (decoration) {
        case 'christmas': return (
            <>
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-600/20 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            </>
        );
        default: return (
            <>
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />
            </>
        );
    }
  };
  // # END REGION: VISUALS

  return (
    <div 
        className={`relative w-full h-screen overflow-hidden font-sans selection:bg-cyan-500/30 transition-colors duration-500 ${bgClass}`}
        style={{
            '--app-accent': activeOverride.accent,
            '--app-text': activeOverride.text,
            color: activeOverride.text, 
        } as React.CSSProperties}
    >
      <style>{`
        .text-cyan-400, .text-cyan-500, .text-cyan-600, .text-purple-400, .text-purple-500, .text-orange-400, .text-orange-500, .text-blue-400 { color: var(--app-accent) !important; }
        .bg-cyan-500, .bg-cyan-600, .bg-purple-500, .bg-orange-500, .bg-blue-500 { background-color: var(--app-accent) !important; }
        .border-cyan-400, .border-cyan-500, .border-purple-400, .border-orange-400 { border-color: var(--app-accent) !important; }
      `}</style>

      <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${reduceMotion ? 'opacity-50' : 'opacity-100'}`}>
        {getAmbience()}
      </div>

      {user && !isAdminRoute && <AIin5Widget />}

      {user && (
          <div 
            ref={profileRef}
            onMouseDown={handleProfileMouseDown}
            className="fixed z-[1000] w-12 h-12 rounded-full cursor-move shadow-2xl transition-transform active:scale-95 group hover:ring-2 hover:ring-cyan-500"
            style={{ left: profilePosition.x, top: profilePosition.y, touchAction: 'none' }}
          >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 relative bg-black/50">
                  {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" draggable={false} />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={20} /></div>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}>
                      <Upload size={14} className="text-white" />
                  </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
      )}

      {!hideNav && (
        <header className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 backdrop-blur-md border-b transition-colors duration-500 ${headerClass}`}>
          {/* # REGION: LOGO */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/shop')}>
            {activeLogo ? (
                <div className="flex items-center gap-2">
                    <img src={activeLogo} alt="Brand" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all hover:scale-105" />
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <div className={`relative px-4 py-2 rounded-xl border backdrop-blur-md shadow-xl overflow-hidden group transition-all hover:scale-105 ${isDark ? 'bg-gradient-to-br from-white/10 to-black/40 border-white/20' : 'bg-gradient-to-br from-white/60 to-white/30 border-white/60'}`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ transform: 'skewX(-20deg)' }} />
                        <h1 className={`text-2xl font-black tracking-widest italic select-none bg-clip-text text-transparent bg-gradient-to-b ${isDark ? 'from-white via-gray-300 to-gray-500' : 'from-slate-500 via-slate-700 to-black'}`}>VdM</h1>
                    </div>
                </div>
            )}
          </div>
          {/* # END REGION: LOGO */}

          <div className="flex items-center gap-4">
             {isAdminRoute && (
                 <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-mono text-yellow-400 uppercase tracking-wider animate-pulse">
                     <Globe size={10} /> SANDBOX ENV
                 </div>
             )}
            
            <button onClick={() => setShowMobileConnect(true)} className={`p-2 transition-colors rounded-full ${isDark ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-black/5 text-stone-600 hover:text-black'}`} title="Connect Mobile Device">
                <Smartphone className="w-6 h-6" />
            </button>

            <button onClick={() => setShowSettingsModal(true)} className={`p-2 transition-colors rounded-full ${isDark ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-black/5 text-stone-600 hover:text-black'}`}>
              <Settings className="w-6 h-6" />
            </button>
            <div onClick={() => navigate('/checkout')} className={`relative p-2 transition-colors rounded-full cursor-pointer ${isDark ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-black/5 text-stone-600 hover:text-black'}`}>
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-cyan-500 rounded-full animate-pulse">{items.length}</span>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="relative z-10 w-full h-full pt-20 pb-10 overflow-y-auto no-scrollbar scroll-smooth">
        {children}
      </main>
      
      {showMobileConnect && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in-up">
            <div className={`w-full max-w-sm rounded-3xl p-8 shadow-2xl relative border ${glassPanelClass} ${isDark ? 'text-white' : 'text-stone-900'} text-center`}>
                <button onClick={() => setShowMobileConnect(false)} className="absolute top-4 right-4 opacity-50 hover:opacity-100 p-2"><X size={24} /></button>
                <h2 className="text-xl font-bold tracking-widest uppercase mb-2">Mobile Link</h2>
                <p className="text-xs opacity-60 mb-6">Scan to open this session on your phone.</p>
                <div className="w-64 h-64 mx-auto bg-white p-2 rounded-xl shadow-inner mb-6 flex items-center justify-center overflow-hidden">
                    <img src={qrCodeUrl} alt="Scan to Open" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-left">
                    <p className="text-yellow-400 text-xs font-bold uppercase mb-1">Network Requirement</p>
                    <p className="text-yellow-200/70 text-[10px]">Ensure your mobile device is connected to the same Wi-Fi network as this computer.</p>
                </div>
            </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl relative border ${glassPanelClass} ${isDark ? 'text-white' : 'text-stone-900'}`}>
              <button onClick={() => { setShowSettingsModal(false); setShowAdminLogin(false); }} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X size={20} /></button>
              
              {!showAdminLogin ? (
                <>
                  <h2 className="text-lg font-bold tracking-widest uppercase mb-6 flex items-center gap-2"><Settings size={18} /> Preferences</h2>
                  <div className="space-y-4">
                    
                    {deferredPrompt && (
                        <button onClick={installApp} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 hover:bg-cyan-500/30' : 'bg-cyan-100 border-cyan-300 text-cyan-900 hover:bg-cyan-200'}`}>
                            <div className="flex items-center gap-3"><Download size={20} /><span className="text-sm font-bold">Install Application</span></div>
                        </button>
                    )}

                    <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5">
                        <div className="flex items-center gap-3"><Palette size={18} /><span className="text-sm">Appearance</span></div>
                        <button onClick={() => setThemeMode(isDark ? 'light' : themeMode === 'light' ? 'autumn' : 'dark')} className="p-2 bg-white/10 rounded-lg">{isDark ? <Moon size={16} /> : isAutumn ? <CloudSun size={16} /> : <Sun size={16} />}</button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5">
                        <div className="flex items-center gap-3"><Accessibility size={18} /><span className="text-sm">Accessibility Mode</span></div>
                        <button onClick={toggleAccessibilityMode} className={`p-2 rounded-lg ${accessibilityMode ? 'bg-green-500 text-white' : 'bg-white/10'}`}>{accessibilityMode ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5">
                        <div className="flex items-center gap-3"><Zap size={18} /><span className="text-sm">Reduce Motion</span></div>
                        <button onClick={toggleMotion} className={`p-2 rounded-lg ${reduceMotion ? 'bg-green-500 text-white' : 'bg-white/10'}`}>{reduceMotion ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border border-white/30" />}</button>
                    </div>

                    <button onClick={() => setShowAdminLogin(true)} className="w-full py-3 mt-4 border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2"><Lock size={14} /> Admin Access</button>
                  </div>
                </>
              ) : (
                  <>
                    <h2 className="text-lg font-bold tracking-widest uppercase mb-6 flex items-center gap-2 text-red-400"><Terminal size={18} /> Admin Access</h2>
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Passcode</label>
                            <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-red-500" autoFocus />
                            {adminError && <p className="text-red-500 text-xs mt-2">{adminError}</p>}
                        </div>
                        <button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-red-900/40">Unlock System</button>
                        <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full py-2 text-xs text-slate-500 hover:text-white">Cancel</button>
                    </form>
                  </>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
