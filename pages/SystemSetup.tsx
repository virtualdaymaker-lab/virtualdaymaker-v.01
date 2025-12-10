import React, { useState, useRef } from 'react';
import { useSettings } from '../App';
import { Smartphone, Shield, Key, CheckCircle, Lock, Server, Cpu, Radio, ArrowRight, Globe, Fingerprint, RefreshCw, FileText, ExternalLink, HelpCircle, BookOpen, AlertTriangle, Mail, Network, Briefcase, Zap, BrainCircuit, Mountain, Plane, Upload, Power, Play, RotateCcw } from 'lucide-react';
import { VpnConfig, LicenseTier, GifItem } from '../types';

interface SystemSetupProps {
    isPreview?: boolean;
    onClosePreview?: () => void;
}

export const SystemSetup: React.FC<SystemSetupProps> = ({ isPreview = false, onClosePreview }) => {
    const { completeSetup, setDecoration, setThemeMode, setActiveLogo } = useSettings();
    const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
    const [showGuide, setShowGuide] = useState(false);
    
    // File Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedConfig, setUploadedConfig] = useState<any>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    // Booting
    const [bootProgress, setBootProgress] = useState(0);

    // --- Handlers ---

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                // Validate it looks like a GIFOS key
                if (data.meta && data.config) {
                    setUploadedConfig(data);
                    setStep(1); // Move to confirm step
                } else {
                    alert("Invalid Identity Key. Missing metadata.");
                }
            } catch (err) {
                alert("Corrupt File. Please contact MGTConsulting.");
            }
        };
        reader.readAsText(file);
    };

    const handleManualBoot = () => {
        // Simulate a default config for manual overrides
        setUploadedConfig({
            meta: {
                tier: 'starter',
                license_key: 'MANUAL-OVERRIDE-01',
                target_os: 'VdM-CORE'
            },
            config: {
                gifos_theme_mode: 'dark',
                gifos_license_tier: 'starter',
                gifos_decoration: 'neon',
                gifos_vpn_config: { enabled: false, status: 'disconnected' },
                gifos_active_logo: null // No logo for manual boot
            }
        });
        setStep(1);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleFinalize = () => {
        if (!uploadedConfig) return;

        setStep(3); // Boot animation
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2; // Slower boot for dramatic effect
            setBootProgress(progress);
            
            // Inject visual settings during boot so they see the change immediately
            if (progress === 30) {
                 if(uploadedConfig.config.gifos_theme_mode) setThemeMode(uploadedConfig.config.gifos_theme_mode);
                 if(uploadedConfig.config.gifos_decoration) setDecoration(uploadedConfig.config.gifos_decoration);
                 if(uploadedConfig.config.gifos_active_logo) setActiveLogo(uploadedConfig.config.gifos_active_logo);
            }

            if (progress >= 100) {
                clearInterval(interval);
                
                // Inject the actual config
                const config = uploadedConfig.config;
                const tier = config.gifos_license_tier as LicenseTier;
                const vpn = config.gifos_vpn_config as VpnConfig;

                // Loop through all keys in config and inject into LocalStorage (simulating "Install")
                Object.keys(config).forEach(key => {
                    if (key.startsWith('gifos_')) {
                        if (typeof config[key] === 'object') {
                            localStorage.setItem(key, JSON.stringify(config[key]));
                        } else {
                            localStorage.setItem(key, config[key]);
                        }
                    }
                });
                
                // IMPORTANT: Ensure system status is active so we leave the detached screen
                localStorage.setItem('gifos_system_status', 'active');

                if (!isPreview) {
                    completeSetup('Verified-Owner', 'boot-sequence', vpn, tier);
                    // Force reload to apply all contexts fresh
                    setTimeout(() => window.location.reload(), 1000);
                } else if (onClosePreview) {
                    onClosePreview();
                }
            }
        }, 50);
    };

    const getBootText = (progress: number) => {
        if(progress < 30) return "DECOMPRESSING IDENTITY KEY...";
        if(progress < 60) {
             const tier = uploadedConfig?.config?.gifos_license_tier;
             if(tier === 'starter') return "INITIALIZING COMMERCE ENGINE...";
             if(tier === 'enterprise') return "CONNECTING COMMAND MODULES...";
             if(tier === 'estate') return "LINKING IOT SCANNERS...";
             return "CONFIGURING MODULES...";
        }
        if(progress < 90) return "SECURING LOCAL DATABASE...";
        return "BOOT SEQUENCE COMPLETE.";
    }

    return (
        <div className="w-full h-full min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans relative overflow-hidden">
            
            {/* Background Animations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            </div>

            {/* Header */}
            <div className="relative z-10 mb-8 text-center animate-fade-in-up">
                <div className="inline-flex items-center gap-2 p-3 rounded-full bg-cyan-900/30 border border-cyan-500/30 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <Cpu size={24} className="text-cyan-400" />
                </div>
                <h1 className="text-3xl font-light tracking-[0.2em] uppercase">System<span className="text-slate-500">Boot</span></h1>
                <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Awaiting Identity Key</p>
            </div>

            {/* Main Card */}
            <div className={`relative z-10 w-full max-w-lg transition-all duration-500 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl`}>
                
                {/* STEP 0: UPLOAD KEY */}
                {step === 0 && (
                    <div className="space-y-6">
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${isDragOver ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                        >
                            <div className="w-16 h-16 rounded-full bg-cyan-900/40 flex items-center justify-center mb-4 text-cyan-400">
                                <Upload size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Insert Identity Key</h2>
                            <p className="text-sm text-slate-400 text-center mb-6 max-w-xs">
                                Drag and drop the <strong>.JSON</strong> file provided by MGTConsulting to unlock this terminal.
                            </p>
                            
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                accept=".json" 
                                className="hidden" 
                            />
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-50 transition-colors text-xs"
                            >
                                Browse Files
                            </button>
                        </div>

                        <div className="relative flex items-center gap-4 py-2">
                            <div className="flex-grow h-px bg-white/10"></div>
                            <span className="text-xs text-slate-600 font-bold uppercase">OR</span>
                            <div className="flex-grow h-px bg-white/10"></div>
                        </div>

                        <button 
                            onClick={handleManualBoot}
                            className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold uppercase tracking-widest rounded-lg transition-colors text-xs flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={14} /> Quick Start / Manual Override
                        </button>
                    </div>
                )}

                {/* STEP 1: VERIFY & INSTALL */}
                {step === 1 && uploadedConfig && (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                            <CheckCircle size={24} className="text-green-500" />
                            <div>
                                <h3 className="text-sm font-bold text-white">Valid Key Detected</h3>
                                <p className="text-xs text-green-400">{uploadedConfig.meta.tier} LICENSE • {uploadedConfig.meta.license_key}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                                <span className="text-slate-500">TARGET OS</span>
                                <span className="text-white font-mono">{uploadedConfig.meta.target_os || 'VdM-CORE'}</span>
                            </div>
                            <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                                <span className="text-slate-500">THEME CONFIG</span>
                                <span className="text-white font-mono">{uploadedConfig.config.gifos_theme_mode.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                                <span className="text-slate-500">MODULES</span>
                                <span className="text-white font-mono">{uploadedConfig.config.gifos_license_tier.toUpperCase()}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleFinalize}
                            className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                        >
                            <Power size={18} /> Initialize System
                        </button>
                        
                        <button 
                            onClick={() => { setStep(0); setUploadedConfig(null); }}
                            className="w-full mt-3 py-2 text-xs text-slate-500 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* STEP 3: BOOTING */}
                {step === 3 && (
                    <div className="animate-fade-in-up text-center py-8">
                        <div className="w-20 h-20 mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                            <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                            <Server className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Installing...</h2>
                        <p className="text-slate-400 text-sm mb-6">Configuring Modules & Theme...</p>
                        
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                            <div 
                                className="h-full bg-cyan-500 transition-all duration-100 ease-out"
                                style={{ width: `${bootProgress}%` }}
                            />
                        </div>
                        
                        <div className="text-[10px] text-slate-500 font-mono animate-pulse">
                            {getBootText(bootProgress)}
                        </div>
                    </div>
                )}

            </div>
            
            <div className="absolute bottom-6 text-slate-600 text-xs font-mono">
                SECURE BOOTLOADER v2.5.0
            </div>

        </div>
    );
};