import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Check, Star, Share2, Download, Home } from 'lucide-react';

const ORBIT_ITEMS = [
  { id: 1, label: 'Order Confirmed', icon: Check, color: 'text-green-400' },
  { id: 2, label: 'Assets Generated', icon: Star, color: 'text-yellow-400' },
  { id: 3, label: 'Receipt Sent', icon: Share2, color: 'text-blue-400' },
  { id: 4, label: 'Ready to Download', icon: Download, color: 'text-purple-400' },
  { id: 5, label: 'Return Home', icon: Home, color: 'text-cyan-400' },
];

export const OrbitReview: React.FC = () => {
  const navigate = useNavigate();
  const [activeMessage, setActiveMessage] = useState<string>('Processing...');
  const [orbitIndex, setOrbitIndex] = useState(0);

  // Cycle the "Inward" animation logic
  useEffect(() => {
    // Initial trigger
    handleOrbitCycle(0);

    const interval = setInterval(() => {
      setOrbitIndex((prev) => {
        const next = (prev + 1) % ORBIT_ITEMS.length;
        handleOrbitCycle(next);
        return next;
      });
    }, 30000); // 30 seconds as requested

    return () => clearInterval(interval);
  }, []);

  const handleOrbitCycle = (index: number) => {
    const item = ORBIT_ITEMS[index];
    setActiveMessage(item.label);
  };

  return (
    <Layout hideNav>
      <div className="flex flex-col items-center justify-center w-full h-screen overflow-hidden relative">
        
        {/* Central Glowing Box */}
        <div className="relative z-20 w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-cyan-500/30 bg-black/40 backdrop-blur-xl flex items-center justify-center shadow-[0_0_100px_rgba(6,182,212,0.2)]">
            <div className="text-center animate-pulse">
                <p className="text-cyan-400 text-xs tracking-[0.3em] uppercase mb-2">Status</p>
                <h2 className="text-white text-xl font-bold md:text-2xl tracking-wider px-4">
                    {activeMessage}
                </h2>
            </div>
            
            {/* Active Item Inward Animation Representation */}
            {/* We overlay a clone of the active icon fading in/out in center to simulate it entered */}
            <div key={orbitIndex} className="absolute inset-0 flex items-center justify-center animate-ping opacity-20">
               <div className="w-full h-full rounded-full border border-white/20"></div>
            </div>
        </div>

        {/* Orbit Path Container */}
        {/* We rotate this entire container slowly */}
        <div className="absolute z-10 w-[600px] h-[600px] rounded-full border border-white/5 animate-orbit-spin flex items-center justify-center pointer-events-none">
            {ORBIT_ITEMS.map((item, index) => {
                // Calculate position on circle
                const angle = (index / ORBIT_ITEMS.length) * 360;
                const radius = 250; // Distance from center
                const isActive = index === orbitIndex;

                return (
                    <div 
                        key={item.id}
                        className={`absolute w-16 h-16 rounded-xl border backdrop-blur-md flex items-center justify-center transition-all duration-1000 ${
                             isActive 
                             ? 'border-cyan-400 bg-cyan-900/40 shadow-[0_0_30px_rgba(6,182,212,0.5)] scale-110' 
                             : 'border-white/10 bg-white/5 opacity-50'
                        }`}
                        style={{
                            transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`, // Keep item upright relative to page? No, rotate(-angle) keeps it upright relative to screen while orbiting
                            // Actually, parent spins, so child needs counter-spin animation to stay upright? 
                            // Simplified: Just place them. The parent rotation handles movement.
                        }}
                    >
                         {/* Counter-rotate the icon itself so it stays upright as the parent spins */}
                         <div className="animate-counter-spin">
                            <item.icon className={`${item.color} w-6 h-6`} />
                         </div>
                    </div>
                );
            })}
        </div>
        
        <div className="absolute bottom-10 z-30 text-center">
            <button 
                onClick={() => navigate('/')} 
                className="text-white/40 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
            >
                Start New Order
            </button>
        </div>

      </div>
    </Layout>
  );
};