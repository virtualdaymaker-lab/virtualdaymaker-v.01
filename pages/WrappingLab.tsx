
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Gift, Tag, Maximize2, ArrowRight, Sparkles, X, Box, Wand2, Calendar, CheckCircle, Play, RefreshCw, Eye } from 'lucide-react';

// --- Types ---
interface CanvasItem {
  id: string;
  type: 'present' | 'tag';
  styleId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  rotation: number;
  animation?: string;
}

// --- Assets ---
const PRESENT_STYLES = [
  'bg-gradient-to-br from-red-500 to-red-900',
  'bg-gradient-to-br from-blue-500 to-blue-900',
  'bg-gradient-to-br from-green-500 to-green-900',
  'bg-gradient-to-br from-purple-500 to-purple-900',
  'bg-gradient-to-br from-amber-400 to-amber-700',
  'bg-gradient-to-br from-pink-500 to-pink-900',
];

const TAG_STYLES = [
  'bg-white text-black',
  'bg-amber-100 text-amber-900 border-amber-300',
  'bg-slate-900 text-white border-slate-700',
  'bg-pink-100 text-pink-900 border-pink-300',
  'bg-cyan-100 text-cyan-900 border-cyan-300',
  'bg-black/60 backdrop-blur border-white/20 text-white',
];

const ANIMATIONS = [
  { name: 'Quantum', class: 'animate-quantum-fold' },
  { name: 'Gravity', class: 'animate-gravity-spin' },
  { name: 'Hologram', class: 'animate-hologram-bloom' },
  { name: 'Pulse', class: 'animate-crystal-pulse' },
];

export const WrappingLab: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Tag Inputs
  const [tagTo, setTagTo] = useState('');
  const [tagFrom, setTagFrom] = useState('');
  const [tagNote, setTagNote] = useState('');
  const [isTagFlipped, setIsTagFlipped] = useState(false);

  // FX / Preview State
  const [fxStage, setFxStage] = useState<'idle' | 'playing' | 'revealed'>('idle');
  const [selectedAnim, setSelectedAnim] = useState<string>('');

  // Dragging State
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    isResizing: boolean;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialW: number;
    initialH: number;
  }>({ isDragging: false, isResizing: false, startX: 0, startY: 0, initialX: 0, initialY: 0, initialW: 0, initialH: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize with one default gift
  useEffect(() => {
    if (items.length === 0) {
       addItem('present', 0);
    }
  }, []);

  // --- Actions ---
  const handleBackgroundClick = () => {
      setSelectedId(null);
  };

  const addItem = (type: 'present' | 'tag', styleId: number) => {
    // If present, remove existing present to enforce "one main gift" focus for this specific flow request
    // or allow multiple. The prompt says "adapt to each one added". We'll allow replacing current selection or adding new.
    
    // Logic: If user selects a style from the grid, update the *selected* item if it matches type, else add new.
    let targetId = selectedId;
    
    // If nothing selected, or selected type differs, check if we already have one of this type to update instead of spamming
    if (!targetId) {
        const existing = items.find(i => i.type === type);
        if (existing) targetId = existing.id;
    }

    if (targetId) {
        const existing = items.find(i => i.id === targetId);
        if (existing && existing.type === type) {
             setItems(items.map(i => i.id === targetId ? { ...i, styleId } : i));
             return;
        }
    }

    // Create New
    const id = Math.random().toString(36).substr(2, 9);
    const canvasCenter = canvasRef.current ? canvasRef.current.clientWidth / 2 : 150;
    const canvasMiddle = canvasRef.current ? canvasRef.current.clientHeight / 2 : 150;
    
    const newItem: CanvasItem = {
      id,
      type,
      styleId,
      x: canvasCenter - (type === 'present' ? 60 : 40),
      y: canvasMiddle - (type === 'present' ? 60 : 20),
      width: type === 'present' ? 120 : 80,
      height: type === 'present' ? 120 : 40,
      rotation: 0,
      text: type === 'tag' ? '' : undefined,
      animation: '',
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(id);
  };

  const handleTagUpdate = () => {
     // Find the tag item and update its internal text for the canvas
     const tagItem = items.find(i => i.type === 'tag');
     if (tagItem) {
         const fullText = `To: ${tagTo}\nFrom: ${tagFrom}`;
         setItems(items.map(i => i.id === tagItem.id ? { ...i, text: fullText } : i));
     } else {
         // Create tag if not exists
         addItem('tag', 0);
         // Then update
         setTimeout(() => handleTagUpdate(), 100);
     }
  };

  const playFx = (animClass: string) => {
      setSelectedAnim(animClass);
      setFxStage('playing');
      
      // Simulation Sequence
      setTimeout(() => {
          setFxStage('revealed');
      }, 2500); // Wait for animation
  };

  const handleDelete = () => {
      if(selectedId) {
          setItems(items.filter(i => i.id !== selectedId));
          setSelectedId(null);
      }
  }

  // --- Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, id: string, isResizeHandle = false) => {
    e.stopPropagation(); // Prevent background click
    setSelectedId(id);
    const item = items.find(i => i.id === id);
    if (!item) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    setDragState({
      isDragging: !isResizeHandle,
      isResizing: isResizeHandle,
      startX: clientX,
      startY: clientY,
      initialX: item.x,
      initialY: item.y,
      initialW: item.width,
      initialH: item.height,
    });
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!selectedId) return;
      if (!dragState.isDragging && !dragState.isResizing) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const dx = clientX - dragState.startX;
      const dy = clientY - dragState.startY;

      setItems(prev => prev.map(item => {
        if (item.id !== selectedId) return item;

        if (dragState.isDragging) {
          return { ...item, x: dragState.initialX + dx, y: dragState.initialY + dy };
        }
        if (dragState.isResizing) {
          return { 
            ...item, 
            width: Math.max(50, dragState.initialW + dx), 
            height: Math.max(30, dragState.initialH + dy) 
          };
        }
        return item;
      }));
    };

    const handleEnd = () => {
      setDragState(prev => ({ ...prev, isDragging: false, isResizing: false }));
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragState, selectedId]);

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-full px-4 md:px-6 pb-40 pt-4 gap-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
             <h1 className="text-xl font-light uppercase tracking-widest text-white">Wrapping Studio</h1>
             <button 
                onClick={() => navigate('/receiver/booking')} 
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase hover:bg-white/10 flex items-center gap-2"
             >
                 <Eye size={12} /> Simulate Receiver
             </button>
        </div>

        {/* --- MAIN STUDIO CANVAS --- */}
        <div 
            ref={canvasRef}
            onMouseDown={handleBackgroundClick}
            onTouchStart={handleBackgroundClick}
            className="relative w-full aspect-square md:aspect-[21/9] rounded-3xl border border-white/10 bg-slate-950 overflow-hidden shadow-2xl ring-1 ring-white/5 group"
        >
            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
            
            <div className="absolute top-4 left-4 pointer-events-none opacity-40">
                <span className="text-[10px] font-mono text-cyan-500 border border-cyan-500/30 px-2 py-1 rounded">CAM_01 // LIVE VIEW</span>
            </div>

            {items.map(item => (
                <div
                key={item.id}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
                onTouchStart={(e) => handleMouseDown(e, item.id)}
                className={`absolute group/item cursor-move transition-shadow ${selectedId === item.id ? 'z-10' : 'z-0'}`}
                style={{
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: item.height,
                }}
                >
                <div className={`w-full h-full ${item.animation || 'animate-fade-in-up'}`}>
                    {/* Present */}
                    {item.type === 'present' && (
                    <div className={`w-full h-full rounded-xl ${PRESENT_STYLES[item.styleId]} shadow-2xl relative ${selectedId === item.id ? 'ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]' : ''}`}>
                        <div className="absolute left-1/2 top-0 bottom-0 w-[12%] -ml-[6%] bg-white/20 backdrop-blur-sm" />
                        <div className="absolute top-1/2 left-0 right-0 h-[12%] -mt-[6%] bg-white/20 backdrop-blur-sm" />
                        <div className="absolute top-1/2 left-1/2 -ml-3 -mt-3 w-6 h-6 rounded-full bg-white/40 backdrop-blur-md shadow-sm" />
                    </div>
                    )}
                    {/* Tag */}
                    {item.type === 'tag' && (
                    <div className={`w-full h-full rounded px-2 py-1 flex flex-col items-center justify-center ${TAG_STYLES[item.styleId]} shadow-xl relative ${selectedId === item.id ? 'ring-2 ring-cyan-400' : ''}`}>
                        <div className="absolute top-1/2 -left-1.5 w-2 h-2 rounded-full bg-slate-900 border border-white/20" />
                        <p className="text-[8px] md:text-[10px] text-center font-bold whitespace-pre-wrap leading-tight pointer-events-none">
                            {item.text || "To: ..."}
                        </p>
                    </div>
                    )}
                </div>

                {selectedId === item.id && (
                    <>
                        <div 
                        onMouseDown={(e) => handleMouseDown(e, item.id, true)}
                        onTouchStart={(e) => handleMouseDown(e, item.id, true)}
                        className="absolute -bottom-3 -right-3 w-6 h-6 bg-cyan-500 text-black rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 z-20 cursor-se-resize"
                        >
                        <Maximize2 size={12} />
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                            className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg border border-white z-20 hover:scale-110 transition-transform"
                        >
                            <X size={12} className="text-white" />
                        </button>
                    </>
                )}
                </div>
            ))}
        </div>

        {/* --- 1. PRESENTS PANEL (2 Rows, 3 Cols) --- */}
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Gift size={16} className="text-purple-400"/> Select Box Style
            </h3>
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
                {PRESENT_STYLES.map((style, idx) => (
                    <button 
                        key={idx}
                        onClick={() => addItem('present', idx)}
                        className={`w-full aspect-square rounded-xl ${style} border-2 relative shadow-lg transition-transform active:scale-95 group ${selectedId && items.find(i=>i.id===selectedId)?.styleId === idx && items.find(i=>i.id===selectedId)?.type === 'present' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-white/10 hover:border-white/40'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent rounded-xl" />
                    </button>
                ))}
            </div>
        </div>

        {/* --- 2. TAGS PANEL (2 Rows, 3 Cols) --- */}
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag size={16} className="text-amber-400"/> Select Tag Style
            </h3>
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
                {TAG_STYLES.map((style, idx) => (
                    <button 
                        key={idx}
                        onClick={() => addItem('tag', idx)}
                        className={`w-full h-12 rounded-lg ${style} border relative shadow-md transition-transform active:scale-95 flex items-center justify-center group ${selectedId && items.find(i=>i.id===selectedId)?.styleId === idx && items.find(i=>i.id===selectedId)?.type === 'tag' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-white/10 hover:border-white/40'}`}
                    >
                        <span className="text-[8px] font-bold uppercase opacity-80">Style {idx+1}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* --- 3. TAG INPUT PANEL (Flip Card) --- */}
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 perspective-1000 group">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Wand2 size={16} className="text-cyan-400"/> Personalize
                </h3>
                <button onClick={() => setIsTagFlipped(!isTagFlipped)} className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1">
                    <RefreshCw size={10} /> {isTagFlipped ? 'Show Front' : 'Show Back (Note)'}
                </button>
             </div>

             <div className={`relative transition-all duration-500 transform-style-3d ${isTagFlipped ? 'rotate-y-180' : ''}`}>
                 
                 {/* FRONT (To/From) */}
                 <div className="backface-hidden space-y-3">
                    <input 
                        type="text" 
                        value={tagTo} 
                        onChange={(e) => setTagTo(e.target.value)} 
                        placeholder="To: (Name)" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                    <input 
                        type="text" 
                        value={tagFrom} 
                        onChange={(e) => setTagFrom(e.target.value)} 
                        placeholder="From: (Name)" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                 </div>

                 {/* BACK (Note) */}
                 <div className="absolute inset-0 backface-hidden rotate-y-180 h-full">
                     <textarea 
                        value={tagNote}
                        onChange={(e) => setTagNote(e.target.value)}
                        placeholder="Write a secret note on the back..."
                        className="w-full h-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none resize-none"
                     />
                 </div>
             </div>

             <button 
                onClick={handleTagUpdate}
                className="w-full mt-4 py-3 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold uppercase hover:bg-cyan-600 hover:text-white transition-all"
             >
                Apply Text to Tag
             </button>
        </div>

        {/* --- 4. PREVIEW & FX LIVE BOX --- */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/10 to-black p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 bg-purple-500/20 rounded-bl-xl text-purple-300 text-[9px] font-bold uppercase tracking-wider">Live Simulation</div>
             
             <div className="mb-4">
                 <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                     <Sparkles size={16} className="text-purple-400" /> FX Reveal
                 </h3>
                 <p className="text-[10px] text-slate-400 mt-1">Select an animation to preview the unboxing experience.</p>
             </div>

             {/* FX Selector */}
             <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
                {ANIMATIONS.map((anim, idx) => (
                    <button 
                        key={idx}
                        onClick={() => playFx(anim.class)}
                        className={`flex-shrink-0 w-16 h-16 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${selectedAnim === anim.class ? 'bg-purple-500 text-white border-purple-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Play size={16} />
                        <span className="text-[8px] font-bold uppercase">{anim.name}</span>
                    </button>
                ))}
             </div>

             {/* SIMULATION STAGE */}
             <div className="w-full aspect-video bg-black/50 rounded-xl border border-white/10 relative flex items-center justify-center overflow-hidden">
                 {fxStage === 'idle' && (
                     <div className="text-center opacity-50">
                         <Box size={40} className="mx-auto mb-2 text-slate-600" />
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest">Waiting for Input...</p>
                     </div>
                 )}

                 {fxStage === 'playing' && (
                     <div className={`w-32 h-32 bg-cyan-500 rounded-xl ${selectedAnim} shadow-[0_0_50px_rgba(6,182,212,0.6)] flex items-center justify-center`}>
                         <div className="w-full h-1/4 bg-black/20 absolute top-1/2 -translate-y-1/2" />
                         <div className="h-full w-1/4 bg-black/20 absolute left-1/2 -translate-x-1/2" />
                     </div>
                 )}

                 {fxStage === 'revealed' && (
                     <div className="w-full h-full bg-white/5 backdrop-blur-md p-6 flex flex-col items-center justify-center animate-fade-in-up text-center">
                         <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-2 animate-bounce text-green-400">
                             <CheckCircle size={32} />
                         </div>
                         <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-1">It's Open!</h4>
                         <p className="text-[10px] text-slate-400 mb-4 max-w-[200px]">The client sees your gift and is prompted to book.</p>
                         <button className="px-6 py-2 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-2">
                             <Calendar size={12} /> Book Session
                         </button>
                     </div>
                 )}
             </div>
        </div>

        {/* FINISH BUTTON (Sticky Bottom) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
            <button 
                onClick={() => navigate('/delivery')}
                className="w-full max-w-md mx-auto py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg tracking-widest shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/30 flex items-center justify-center gap-3 transition-all"
            >
                FINISH WRAPPING <ArrowRight />
            </button>
        </div>

      </div>
    </Layout>
  );
};
