
import React, { useState } from 'react';

interface GlassCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  heightClass?: string;
  isSpecial?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  frontContent, 
  backContent, 
  heightClass = "h-64",
  isSpecial = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`group relative w-full ${heightClass} perspective-1000 cursor-pointer my-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-2xl`}
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Product Details revealed. Press Enter to flip back." : "Product Card. Press Enter to see details."}
    >
      <div 
        className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face */}
        <div className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border ${isSpecial ? 'border-purple-500/40 bg-purple-900/10' : 'border-white/10 bg-white/5'} backdrop-blur-md shadow-lg overflow-hidden flex flex-col`}>
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          {frontContent}
        </div>

        {/* Back Face */}
        <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl border ${isSpecial ? 'border-purple-500/40 bg-purple-900/20' : 'border-cyan-500/30 bg-slate-900/80'} backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col`}>
          {backContent}
        </div>
      </div>
    </div>
  );
};
