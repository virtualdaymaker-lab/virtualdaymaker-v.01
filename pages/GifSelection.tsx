
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, ArrowRight, Video, X, Save } from 'lucide-react';
import { Layout } from '../components/Layout';
import { GlassCard } from '../components/GlassCard';
import { useCart, useSettings } from '../App';
import { GifItem } from '../types';

export const GifSelection: React.FC = () => {
  // # REGION: HOOKS & STATE
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { inventory, promoVideo, updateInventoryItem } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  
  // EDIT MODE STATE
  const [editingItem, setEditingItem] = useState<GifItem | null>(null);
  const [editForm, setEditForm] = useState({ title: '', price: '', imageUrl: '' });
  // # END REGION: HOOKS

  // # REGION: EFFECTS
  useEffect(() => {
    // Simulate network fetch latency
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  // # END REGION: EFFECTS

  // # REGION: HANDLERS
  const handleAddToCart = (e: React.MouseEvent, item: GifItem) => {
    e.stopPropagation(); // Prevent card flip when clicking button
    addToCart(item);
  };

  const handleEditClick = (e: React.MouseEvent, item: GifItem) => {
      e.stopPropagation(); // Prevent card flip
      setEditingItem(item);
      setEditForm({ 
          title: item.title, 
          price: item.price.toString(), 
          imageUrl: item.imageUrl 
      });
  };

  const handleSaveEdit = () => {
      if (editingItem) {
          updateInventoryItem(editingItem.id, {
              title: editForm.title,
              price: parseFloat(editForm.price),
              imageUrl: editForm.imageUrl
          });
          setEditingItem(null);
      }
  };

  // Helper to extract YouTube ID
  const getYoutubeEmbed = (url: string) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&mute=1` : null;
  };

  const embedUrl = getYoutubeEmbed(promoVideo);
  // # END REGION: HANDLERS

  // # REGION: RENDER HELPERS
  // Glassmorphism Skeleton Loader
  const SkeletonCard = ({ isLarge = false }: { isLarge?: boolean }) => (
    <div className={`relative w-full ${isLarge ? 'h-96' : 'h-64'} my-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md overflow-hidden`}>
      {/* Shimmer Effect */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full animate-shimmer" />
      
      {/* Content Placeholders */}
      <div className="absolute top-4 right-4 w-16 h-6 rounded-full bg-white/10 animate-pulse" />
      
      {isLarge ? (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
           <div className="w-3/4 h-8 bg-white/10 rounded animate-pulse" />
           <div className="w-1/4 h-10 bg-white/10 rounded animate-pulse" />
        </div>
      ) : (
        <div className="absolute bottom-4 left-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
        </div>
      )}
    </div>
  );
  // # END REGION: RENDER HELPERS

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full min-h-full px-4 md:px-0">
        
        <div className="w-full max-w-md pb-32 space-y-8">
           {/* Header text for context */}
           <div className="text-center mb-8 animate-fade-in-up">
              <h1 className="text-3xl font-light text-white tracking-widest uppercase">Choose Your GIF</h1>
              <p className="text-cyan-400/60 text-sm mt-2">Tap card to inspect details</p>
           </div>

           {/* PROMO VIDEO (If Configured) */}
           {embedUrl && (
               <div className="w-full aspect-video rounded-2xl border border-cyan-500/30 bg-black overflow-hidden shadow-2xl relative mb-8 group">
                   <iframe 
                       src={embedUrl} 
                       className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" 
                       title="Promo Video" 
                       frameBorder="0" 
                       allowFullScreen
                   ></iframe>
                   <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[10px] text-white font-bold uppercase border border-white/10 flex items-center gap-1">
                       <Video size={10} /> Ad
                   </div>
               </div>
           )}

          {isLoading ? (
            // Render Skeleton Loaders
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            // Render Actual Content from Context
            inventory.map((gif) => (
              <GlassCard
                key={gif.id}
                heightClass={gif.isSpecialPanel ? "h-96" : "h-64"}
                isSpecial={gif.isSpecialPanel}
                frontContent={
                  <>
                    {/* --- QUICK EDIT TRIGGER (Clear Angle Line) --- */}
                    <div 
                        onClick={(e) => handleEditClick(e, gif)}
                        className="absolute bottom-0 right-0 w-8 h-8 z-30 cursor-pointer group/edit overflow-hidden"
                        title="Quick Edit Product"
                    >
                        {/* The clear angle line graphic */}
                        <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-white/30 group-hover/edit:border-cyan-400 group-hover/edit:border-white transition-colors rounded-br-sm" />
                    </div>

                    {gif.isSpecialPanel ? (
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <h3 className="text-2xl font-bold text-purple-300 uppercase tracking-widest">{gif.title}</h3>
                        <div className="mt-4 text-4xl font-light text-white">${gif.price}</div>
                        <p className="mt-4 text-sm text-purple-200/60">Tap for details</p>
                      </div>
                    ) : (
                      <>
                        <img src={gif.imageUrl} alt={gif.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Price Tag */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                          <span className="text-cyan-400 font-bold">${gif.price.toFixed(2)}</span>
                        </div>

                        {/* Interaction Icons */}
                        <div className="absolute bottom-4 left-4 flex gap-3">
                          <button className="p-2 rounded-full bg-black/40 hover:bg-green-500/20 hover:text-green-400 text-white/50 transition-colors backdrop-blur-sm">
                            <ThumbsUp size={16} />
                          </button>
                          <button className="p-2 rounded-full bg-black/40 hover:bg-red-500/20 hover:text-red-400 text-white/50 transition-colors backdrop-blur-sm">
                            <ThumbsDown size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </>
                }
                backContent={
                  <div className="flex flex-col h-full p-6 justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{gif.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{gif.description}</p>
                      {gif.isSpecialPanel && (
                        <ul className="mt-4 space-y-2 text-xs text-purple-200">
                          <li className="flex items-center">• Premium Bandwidth</li>
                          <li className="flex items-center">• 4K Export</li>
                          <li className="flex items-center">• No Watermark</li>
                        </ul>
                      )}
                    </div>
                    
                    <button 
                      onClick={(e) => handleAddToCart(e, gif)}
                      className="w-full py-3 mt-4 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 text-cyan-100 font-bold tracking-wider transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
                    >
                      ADD TO CART <span className="text-lg">+</span>
                    </button>
                  </div>
                }
              />
            ))
          )}
        </div>

        {/* Sticky Proceed Button - Elevated Z-Index for Mobile Touch */}
        <div className="fixed bottom-6 z-[60] w-full max-w-md px-4 pointer-events-none">
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg tracking-widest shadow-lg shadow-cyan-900/50 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform pointer-events-auto"
          >
            PROCEED TO CHECKOUT <ArrowRight />
          </button>
        </div>

        {/* --- EDIT MODAL --- */}
        {editingItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
                <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                    <button 
                        onClick={() => setEditingItem(null)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    
                    <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Configure Product</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Title</label>
                            <input 
                                value={editForm.title}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Price ($)</label>
                            <input 
                                type="number"
                                value={editForm.price}
                                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Image URL</label>
                            <input 
                                value={editForm.imageUrl}
                                onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-xs outline-none focus:border-cyan-500"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <button 
                            onClick={handleSaveEdit}
                            className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </Layout>
  );
};
