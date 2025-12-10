
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Mic, Video, PhoneOff, User, MessageSquare, MicOff, VideoOff, Settings, Activity, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LiveSession: React.FC = () => {
  const navigate = useNavigate();
  
  // --- State ---
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Toggle controls on tap
  const toggleControls = () => setShowControls(!showControls);

  return (
    <Layout hideNav>
      <div className="fixed inset-0 bg-black overflow-hidden font-sans">
        
        {/* --- MAIN VIDEO FEED (INSTRUCTOR) --- */}
        {/* Full screen background image simulating the host */}
        <div 
            onClick={toggleControls}
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' }}
        >
            {/* Dark Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* --- SELF VIEW (PiP) --- */}
        {/* Draggable-ish floating window */}
        <div className="absolute top-6 right-6 w-28 h-40 bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-20">
             {videoOn ? (
                 <div className="w-full h-full bg-zinc-800 flex items-center justify-center relative">
                     <User size={32} className="text-zinc-600" />
                     <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
                 </div>
             ) : (
                 <div className="w-full h-full bg-black flex items-center justify-center">
                     <VideoOff size={20} className="text-red-500" />
                 </div>
             )}
        </div>

        {/* --- UI OVERLAYS --- */}
        
        {/* Top Header */}
        <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                 <ArrowLeft size={20} />
             </button>
             <div className="flex flex-col items-center">
                 <span className="text-white font-bold tracking-widest uppercase text-sm drop-shadow-md">Unboxing Session</span>
                 <span className="text-green-400 text-[10px] font-bold tracking-wider flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full mt-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> LIVE 00:12</span>
             </div>
             <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                 <Settings size={20} />
             </button>
        </div>

        {/* Center Notifications (Optional) */}
        <div className="absolute top-1/2 left-0 right-0 text-center pointer-events-none z-10">
             {!micOn && <div className="inline-block px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold mb-4 animate-bounce">Microphone Muted</div>}
        </div>


        {/* Bottom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 p-8 pb-12 transition-transform duration-300 z-30 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
            
            {/* Action Bar */}
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex items-center justify-between shadow-2xl">
                
                {/* Mic Toggle */}
                <button 
                    onClick={(e) => { e.stopPropagation(); setMicOn(!micOn); }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
                >
                    {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>

                {/* Video Toggle */}
                <button 
                    onClick={(e) => { e.stopPropagation(); setVideoOn(!videoOn); }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoOn ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
                >
                    {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
                </button>

                 {/* Chat Toggle (Visual Only) */}
                 <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <MessageSquare size={24} />
                </button>

                {/* End Call */}
                <button 
                    onClick={() => navigate('/')}
                    className="w-16 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/50"
                >
                    <PhoneOff size={28} />
                </button>
            </div>
        </div>

      </div>
    </Layout>
  );
};
