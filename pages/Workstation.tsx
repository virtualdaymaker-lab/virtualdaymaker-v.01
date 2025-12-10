
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useSettings } from '../App'; // Imported useSettings to access global state
import { 
    Video, Mic, MicOff, VideoOff, 
    PenTool, Eraser, Monitor, PhoneOff, 
    MessageSquare, Users, Calendar, CheckCircle, ArrowLeft,
    Maximize2, Minimize2, Laptop, MousePointer2, Smartphone, Clock, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Workstation: React.FC = () => {
    const navigate = useNavigate();
    const { leads, updateLeadStatus, contacts } = useSettings(); // Hook into real data
    
    // Session State
    const [isLive, setIsLive] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [teachMode, setTeachMode] = useState(false); // Hides Sidebar/Header for drawing space
    const [activeClient, setActiveClient] = useState<any>(null); // Track who we are talking to
    
    // Tools State
    const [activeTool, setActiveTool] = useState<'cursor' | 'highlighter'>('cursor');
    
    // Canvas (Highlighter) State
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // --- LIVE DATA INTEGRATION ---
    const pendingLeads = leads.filter(l => l.status === 'new');
    const upcomingAppointments = contacts.filter(c => c.status === 'active').slice(0, 3);

    const handleAcceptLead = (lead: any) => {
        setActiveClient(lead);
        updateLeadStatus(lead.id, 'contacted'); // Mark as contacted in CRM
        setIsLive(true); // Auto-start session
    };

    // --- CANVAS LOGIC (HIGH-DPI SUPPORT + TOUCH) ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const parent = canvas.parentElement;
        if (!parent) return;

        // Handle Resize with Pixel Ratio
        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = parent.getBoundingClientRect();
            
            // Set display size (css)
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            // Set actual size in memory (scaled to account for retina/high-dpi)
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Scale all drawing operations by the dpr
                ctx.scale(dpr, dpr);
                ctx.strokeStyle = '#FDE047'; // Bright Highlighter Yellow
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#FDE047';
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [teachMode]); // Re-calc when teach mode changes layout

    // --- UNIFIED COORDINATE HELPER ---
    const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            // Touch Event
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            // Mouse Event
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (activeTool !== 'highlighter') return;
        
        setIsDrawing(true);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            const { x, y } = getCoordinates(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || activeTool !== 'highlighter') return;
        
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            const { x, y } = getCoordinates(e);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.closePath();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear scaled rect
        }
    };

    return (
        <Layout hideNav={teachMode}>
            <div className={`flex flex-col h-screen bg-black text-white overflow-hidden ${teachMode ? 'p-0' : 'p-4 md:p-6'}`}>
                
                {/* TOP BAR (Hidden in Teach Mode) */}
                {!teachMode && (
                    <div className="flex justify-between items-center mb-6 animate-fade-in-up">
                        <div>
                            <h1 className="text-2xl font-light uppercase tracking-widest flex items-center gap-2">
                                <Monitor className="text-cyan-400" /> Workstation
                            </h1>
                            <p className="text-slate-500 text-xs mt-1">
                                {activeClient ? `Session Active: ${activeClient.name}` : 'Live Sales & Support Terminal'}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => navigate('/admin')}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider"
                            >
                                Back to HQ
                            </button>
                            <button 
                                onClick={() => setIsLive(!isLive)}
                                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 ${isLive ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`}
                            >
                                {isLive ? '🔴 LIVE ON AIR' : '🟢 GO LIVE'}
                            </button>
                        </div>
                    </div>
                )}

                {/* MAIN WORKSPACE GRID */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                    
                    {/* LEFT: TOOLS & CALENDAR (Hidden in Teach Mode) */}
                    {!teachMode && (
                        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                            
                            {/* PRESENCE MONITOR (REAL LEADS) */}
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Users size={14} className="text-cyan-400" /> Lobby (New Leads)
                                </h3>
                                <div className="space-y-2">
                                    {pendingLeads.length > 0 ? (
                                        pendingLeads.map(lead => (
                                            <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 animate-fade-in-up">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                                                        {lead.name.substring(0,2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{lead.name}</p>
                                                        <p className="text-[10px] text-green-400 flex items-center gap-1"><Clock size={8} /> Just Now</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleAcceptLead(lead)} className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors">
                                                    ACCEPT
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center border border-dashed border-white/10 rounded-xl">
                                            <p className="text-xs text-slate-600">Lobby Empty</p>
                                            <p className="text-[10px] text-slate-700 mt-1">AI is scouting for visitors...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* APPOINTMENTS (REAL CONTACTS) */}
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 flex-1">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Calendar size={14} className="text-purple-400" /> Active Clients
                                </h3>
                                <div className="space-y-3">
                                    {upcomingAppointments.length > 0 ? (
                                        upcomingAppointments.map(contact => (
                                            <div key={contact.id} className="p-3 border-l-2 border-purple-500 bg-white/5 rounded-r-lg group hover:bg-white/10 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-xs font-mono text-purple-400">Active</span>
                                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                                                        {contact.platforms[0] || 'Email'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold mt-1 text-white">{contact.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{contact.email}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-slate-600 italic text-center py-4">No active clients in CRM.</div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* CENTER: SCREEN SHARE / WHITEBOARD */}
                    <div className={`${teachMode ? 'col-span-1 lg:col-span-4 h-full' : 'lg:col-span-3'} relative flex flex-col gap-4`}>
                        
                        {/* THE CANVAS CONTAINER */}
                        <div className="relative flex-1 bg-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl group">
                            
                            {/* Video Underlay (Simulated Screen Share) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                {isLive ? (
                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                        <div className="text-center animate-pulse">
                                            <Laptop size={64} className="text-cyan-600 mx-auto mb-4" />
                                            <p className="text-cyan-500 font-mono text-xs tracking-widest uppercase">Signal Established</p>
                                            <p className="text-slate-600 text-[10px] mt-1">Screen Share Active</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Laptop size={64} className="text-slate-800 mx-auto mb-4" />
                                        <p className="text-slate-700 font-mono text-xs">OFFLINE</p>
                                    </div>
                                )}
                            </div>

                            {/* THE INTERACTIVE LAYER */}
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className={`absolute inset-0 w-full h-full z-10 cursor-crosshair ${activeTool === 'highlighter' ? 'touch-none' : ''}`}
                                style={{ touchAction: 'none' }} // CRITICAL for mobile drawing
                            />

                            {/* TOOLBAR OVERLAY */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-20">
                                <button 
                                    onClick={() => setActiveTool('cursor')}
                                    className={`p-2 rounded-full transition-all ${activeTool === 'cursor' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}
                                    title="Cursor Mode"
                                >
                                    <MousePointer2 size={20} />
                                </button>
                                <button 
                                    onClick={() => setActiveTool('highlighter')}
                                    className={`p-2 rounded-full transition-all ${activeTool === 'highlighter' ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'text-slate-400 hover:text-white'}`}
                                    title="Highlighter (Draw)"
                                >
                                    <PenTool size={20} />
                                </button>
                                <div className="w-px h-6 bg-white/10" />
                                <button 
                                    onClick={clearCanvas}
                                    className="p-2 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                                    title="Clear Screen"
                                >
                                    <Eraser size={20} />
                                </button>
                                <button 
                                    onClick={() => setTeachMode(!teachMode)}
                                    className="p-2 rounded-full text-slate-400 hover:text-white transition-colors"
                                    title={teachMode ? "Exit Fullscreen" : "Enter Fullscreen"}
                                >
                                    {teachMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                </button>
                            </div>

                            {/* TEACH MODE EXIT BUTTON (Mobile Friendly) */}
                            {teachMode && (
                                <button 
                                    onClick={() => setTeachMode(false)}
                                    className="absolute top-4 left-4 p-3 bg-black/50 backdrop-blur rounded-full text-white/50 hover:text-white border border-white/10 z-30"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                            )}

                        </div>

                        {/* BOTTOM CONTROL BAR (Hidden in Teach Mode) */}
                        {!teachMode && (
                            <div className="h-20 bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setMicOn(!micOn)} className={`p-3 rounded-xl transition-all ${micOn ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-500'}`}>
                                        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                                    </button>
                                    <button onClick={() => setVideoOn(!videoOn)} className={`p-3 rounded-xl transition-all ${videoOn ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-500'}`}>
                                        {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                        <MessageSquare size={14} /> Scripts
                                    </button>
                                    <button onClick={() => setIsLive(false)} className="w-12 h-10 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                                        <PhoneOff size={20} />
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
};
