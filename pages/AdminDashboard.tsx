
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useSettings, useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { 
    Settings, CreditCard, Bot, Shield, Save, 
    LogOut, Image as ImageIcon, AlertTriangle, 
    Upload, Briefcase, MapPin,
    Monitor, Menu, X, Users, MessageSquare, Tag, Trash2,
    Megaphone, Calendar, Plus, Sparkles,
    Volume2, Phone, Mail, Home, Search, ArrowLeft, ArrowRight,
    Smartphone, MessageCircle, Send, Target, Clock, Building,
    ShieldCheck, Network, Lock, Globe, Instagram, Linkedin, Video,
    Facebook, Radio, Hash, Eye, EyeOff, Terminal as TerminalIcon, Check, AlertCircle,
    Link, Unlink, Server, Key, Map as MapIcon, Crosshair, Navigation,
    BookOpen, LayoutTemplate, PenTool, Image, Download, Copy, Cpu, Zap,
    Scissors, ShoppingBag, Briefcase as BriefcaseIcon, FileBox, Eye as ViewIcon,
    Flame, BarChart3, MousePointerClick, HardDrive, RefreshCw, Activity, Layers, Repeat,
    BrainCircuit, Wand2, FileCode, Beaker, DollarSign, LayoutGrid, Smartphone as MobileIcon,
    Wifi, Database, HelpCircle, FileJson, ExternalLink, Box, QrCode
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CRMMessage, CRMProperty, OrgProfile } from '../types';

export const AdminDashboard: React.FC = () => {
    // # REGION: HOOKS & STATE
    const navigate = useNavigate();
    const { 
        apiKeys, setApiKeys, 
        botConfig, setBotConfig,
        activeLogo, setActiveLogo,
        detachSystem,
        systemStatus, systemMode, setSystemMode,
        themeMode, decoration, licenseTier, vpnConfig,
        leads, addLead, updateLeadStatus,
        posts, addPost, removePost,
        contacts, addContact, updateContact, removeContact,
        orgProfile, updateOrgProfile,
        usageMetrics, trackUsage
    } = useSettings();
    const { logout } = useAuth();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'commerce' | 'marketing' | 'bot' | 'system' | 'ventures' | 'crm' | 'library' | 'prototypes'>('general');
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [localApiKeys, setLocalApiKeys] = useState(apiKeys);
    const [localOrg, setLocalOrg] = useState<OrgProfile | null>(orgProfile);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // # END REGION: HOOKS

    // # REGION: INITIALIZATION
    useEffect(() => {
        if (!localOrg && orgProfile) setLocalOrg(orgProfile);
        else if (!localOrg && !orgProfile) {
            // Default Structure
            setLocalOrg({
                identity: { display_name: '', legal_name: '', structure: 'Sole Proprietorship', jurisdiction: '', founded: '', tax_id_type: 'SSN' },
                contact: { support_email: '', sales_email: '', phone_primary: '', website: '' },
                location: { address_line_1: '', address_line_2: '', city: '', state: '', zip: '', coordinates: { lat: 0, lng: 0 }, is_residential: true, hide_on_site: true },
                socials: { instagram: '', linkedin: '', tiktok: '' },
                policies: { currency: 'USD', payment_methods: [], cancellation_policy: '', manual_payment_active: false, manual_payment_instruction: '' }
            });
        }
    }, [orgProfile]);
    // # END REGION: INITIALIZATION

    // # REGION: HANDLERS
    const handleSave = () => {
        setApiKeys(localApiKeys);
        if(localOrg) updateOrgProfile(localOrg);
        setUnsavedChanges(false);
        alert("Configuration Saved.");
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setActiveLogo(reader.result as string);
                setUnsavedChanges(true);
            };
            reader.readAsDataURL(file);
        }
    };
    // # END REGION: HANDLERS

    return (
        <Layout>
            <div className="flex h-screen overflow-hidden bg-black text-white">
                
                {/* # REGION: SIDEBAR */}
                <aside className={`fixed md:relative z-20 w-64 h-full bg-zinc-900 border-r border-white/10 flex flex-col transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center">
                                <Monitor size={16} />
                            </div>
                            <span className="font-bold tracking-widest uppercase text-sm">BOSS HQ</span>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="md:hidden text-slate-400"><X size={20} /></button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {[
                            { id: 'general', icon: Briefcase, label: 'Identity & Brand' },
                            { id: 'commerce', icon: CreditCard, label: 'Commerce & PayPal' },
                            { id: 'marketing', icon: Megaphone, label: 'Universal Intake' },
                            { id: 'crm', icon: Users, label: 'CRM & Clients' },
                            { id: 'bot', icon: Bot, label: 'AI Intelligence' },
                            { id: 'system', icon: Server, label: 'System & Keys' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id as any); setIsMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === item.id ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <item.icon size={16} /> {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <button onClick={logout} className="w-full py-3 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase transition-colors">
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </aside>
                {/* # END REGION: SIDEBAR */}

                {/* # REGION: MAIN CONTENT */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    {/* Header */}
                    <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md">
                        <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-white"><Menu size={24} /></button>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            {activeTab} Module
                            {unsavedChanges && <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertCircle size={10} /> Unsaved</span>}
                        </h2>
                        <button onClick={handleSave} className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-slate-200">
                            <Save size={14} /> Save Changes
                        </button>
                    </header>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 pb-20">
                        
                        {/* --- TAB: GENERAL (Identity) --- */}
                        {activeTab === 'general' && localOrg && (
                            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                                
                                {/* Logo Section */}
                                <div className="p-6 bg-zinc-900 border border-white/10 rounded-2xl flex items-center gap-6">
                                    <div className="w-24 h-24 bg-black border border-white/20 rounded-xl flex items-center justify-center overflow-hidden relative group">
                                        {activeLogo ? <img src={activeLogo} className="w-full h-full object-contain" /> : <Monitor size={32} className="text-slate-600" />}
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                            <Upload size={20} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-1">Brand Identity</h3>
                                        <p className="text-xs text-slate-400 mb-4">Upload your logo. This will appear on the storefront and invoices.</p>
                                        <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase text-white">Upload New Logo</button>
                                    </div>
                                </div>

                                {/* Legal Structure */}
                                <div className="p-6 bg-zinc-900 border border-white/10 rounded-2xl">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Building size={16} className="text-cyan-400" /> Legal Entity
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Business Name (DBA)</label>
                                            <input 
                                                value={localOrg.identity.display_name} 
                                                onChange={(e) => { setLocalOrg({...localOrg, identity: {...localOrg.identity, display_name: e.target.value}}); setUnsavedChanges(true); }}
                                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500" 
                                                placeholder="My Cool Shop"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Legal Name (For Tax/PayPal)</label>
                                            <input 
                                                value={localOrg.identity.legal_name}
                                                onChange={(e) => { setLocalOrg({...localOrg, identity: {...localOrg.identity, legal_name: e.target.value}}); setUnsavedChanges(true); }}
                                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500" 
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Structure</label>
                                            <select 
                                                value={localOrg.identity.structure}
                                                onChange={(e) => { setLocalOrg({...localOrg, identity: {...localOrg.identity, structure: e.target.value}}); setUnsavedChanges(true); }}
                                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500"
                                            >
                                                <option>Sole Proprietorship</option>
                                                <option>LLC</option>
                                                <option>Corporation</option>
                                                <option>Non-Profit</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Website URL</label>
                                            <input 
                                                value={localOrg.contact.website}
                                                onChange={(e) => { setLocalOrg({...localOrg, contact: {...localOrg.contact, website: e.target.value}}); setUnsavedChanges(true); }}
                                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500" 
                                                placeholder="https://my-app.vercel.app"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address / Privacy Section */}
                                <div className="p-6 bg-zinc-900 border border-white/10 rounded-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 bg-yellow-500/10 rounded-bl-xl text-yellow-500 flex items-center gap-2">
                                        <ShieldCheck size={14} /> <span className="text-[10px] font-bold uppercase">Privacy Control Active</span>
                                    </div>
                                    
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <MapPin size={16} className="text-cyan-400" /> Physical Address
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-6 max-w-lg">
                                        PayPal and Stripe <strong>require</strong> a valid physical address to prevent fraud. 
                                        If you are a Sole Proprietor, use your home address. 
                                        Use the "Privacy" toggle below to prevent it from showing on your public website.
                                    </p>

                                    <div className="space-y-4">
                                        <input 
                                            value={localOrg.location.address_line_1}
                                            onChange={(e) => { setLocalOrg({...localOrg, location: {...localOrg.location, address_line_1: e.target.value}}); setUnsavedChanges(true); }}
                                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500" 
                                            placeholder="1234 Home Street (Required for Payments)"
                                        />
                                        <div className="flex gap-4">
                                            <input 
                                                value={localOrg.location.city}
                                                onChange={(e) => { setLocalOrg({...localOrg, location: {...localOrg.location, city: e.target.value}}); setUnsavedChanges(true); }}
                                                className="w-1/3 bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500" 
                                                placeholder="City"
                                            />
                                            <input 
                                                value={localOrg.location.state}
                                                onChange={(e) => { setLocalOrg({...localOrg, location: {...localOrg.location, state: e.target.value}}); setUnsavedChanges(true); }}
                                                className="w-1/3 bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500" 
                                                placeholder="State"
                                            />
                                            <input 
                                                value={localOrg.location.zip}
                                                onChange={(e) => { setLocalOrg({...localOrg, location: {...localOrg.location, zip: e.target.value}}); setUnsavedChanges(true); }}
                                                className="w-1/3 bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500" 
                                                placeholder="Zip"
                                            />
                                        </div>
                                    </div>

                                    {/* PRIVACY TOGGLES */}
                                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                                        <button 
                                            onClick={() => { setLocalOrg({...localOrg, location: {...localOrg.location, is_residential: !localOrg.location.is_residential}}); setUnsavedChanges(true); }}
                                            className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all text-xs font-bold uppercase ${localOrg.location.is_residential ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-black border-white/10 text-slate-500'}`}
                                        >
                                            <Home size={14} /> Residential / Home Office
                                        </button>

                                        <button 
                                            onClick={() => { setLocalOrg({...localOrg, location: {...localOrg.location, hide_on_site: !localOrg.location.hide_on_site}}); setUnsavedChanges(true); }}
                                            className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all text-xs font-bold uppercase ${localOrg.location.hide_on_site ? 'bg-green-500/10 border-green-500 text-green-400 shadow-lg' : 'bg-red-500/10 border-red-500 text-red-400'}`}
                                        >
                                            {localOrg.location.hide_on_site ? <ShieldCheck size={14} /> : <Globe size={14} />} 
                                            {localOrg.location.hide_on_site ? 'Address is PRIVATE (PayPal Only)' : 'Address is PUBLIC (Visible)'}
                                        </button>
                                    </div>
                                    {localOrg.location.hide_on_site && (
                                        <p className="mt-2 text-[10px] text-green-400 text-center animate-pulse">
                                            Safe Mode: Address will only be sent to PayPal/Stripe API. Not shown to visitors.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- TAB: COMMERCE (Keys) --- */}
                        {activeTab === 'commerce' && localOrg && (
                            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                                <div className="p-6 bg-zinc-900 border border-white/10 rounded-2xl">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <CreditCard size={16} className="text-cyan-400" /> Payment Gateways
                                    </h3>
                                    
                                    {/* PayPal Config */}
                                    <div className="mb-8 p-4 bg-blue-900/10 border border-blue-500/30 rounded-xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="text-xl font-bold italic text-white"><span className="text-blue-400">Pay</span>Pal</div>
                                            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">Recommended</span>
                                        </div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Client ID</label>
                                        <input 
                                            type="password"
                                            value={localApiKeys.paypalClientId}
                                            onChange={(e) => { setLocalApiKeys({...localApiKeys, paypalClientId: e.target.value}); setUnsavedChanges(true); }}
                                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500 font-mono"
                                            placeholder="Paste PayPal Client ID here..."
                                        />
                                        <div className="mt-2 text-[10px] text-slate-500 flex gap-2">
                                            <a href="https://developer.paypal.com/dashboard/" target="_blank" className="hover:text-white underline">Get Key</a>
                                            <span>•</span>
                                            <span>Must match Legal Name entered in Identity tab</span>
                                        </div>
                                    </div>

                                    {/* Stripe Config */}
                                    <div className="mb-8 p-4 bg-purple-900/10 border border-purple-500/30 rounded-xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="text-xl font-bold text-white">Stripe</div>
                                        </div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Publishable Key</label>
                                        <input 
                                            type="password"
                                            value={localApiKeys.stripeKey}
                                            onChange={(e) => { setLocalApiKeys({...localApiKeys, stripeKey: e.target.value}); setUnsavedChanges(true); }}
                                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-purple-500 font-mono"
                                            placeholder="pk_live_..."
                                        />
                                    </div>

                                    {/* Manual Payment Config */}
                                    <div className="p-4 bg-green-900/10 border border-green-500/30 rounded-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-xl font-bold text-white flex items-center gap-2"><DollarSign size={20} className="text-green-400"/> Manual / Custom</div>
                                            </div>
                                            <button 
                                                onClick={() => { setLocalOrg({...localOrg, policies: {...localOrg.policies, manual_payment_active: !localOrg.policies.manual_payment_active}}); setUnsavedChanges(true); }}
                                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${localOrg.policies.manual_payment_active ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-500'}`}
                                            >
                                                {localOrg.policies.manual_payment_active ? 'Active' : 'Disabled'}
                                            </button>
                                        </div>
                                        
                                        <div className={`transition-all duration-300 ${localOrg.policies.manual_payment_active ? 'opacity-100 max-h-64' : 'opacity-40 max-h-20 pointer-events-none'}`}>
                                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Instructions for Client</label>
                                            <textarea 
                                                value={localOrg.policies.manual_payment_instruction || ''}
                                                onChange={(e) => { setLocalOrg({...localOrg, policies: {...localOrg.policies, manual_payment_instruction: e.target.value}}); setUnsavedChanges(true); }}
                                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-green-500 min-h-[80px]"
                                                placeholder="e.g. Please Venmo @MyStore or Zelle to 555-0199. Orders processed upon receipt."
                                            />
                                            <p className="text-[10px] text-slate-500 mt-2">
                                                Use this for Zelle, Venmo, CashApp, or Bank Transfers. This text will appear at checkout.
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* --- OTHER TABS PLACEHOLDERS (To keep code valid) --- */}
                        {activeTab !== 'general' && activeTab !== 'commerce' && (
                             <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
                                 Module {activeTab.toUpperCase()} is active but hidden for address edit view.
                             </div>
                        )}

                    </div>
                </main>
                {/* # END REGION: MAIN CONTENT */}

            </div>
        </Layout>
    );
};
