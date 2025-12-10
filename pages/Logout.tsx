
import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { Power, Terminal } from 'lucide-react';

export const Logout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Run the shutdown sequence
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        logout();
                        navigate('/');
                    }, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [logout, navigate]);

    return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white font-mono overflow-hidden relative">
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent pointer-events-none" style={{backgroundSize: '100% 4px'}} />

            <div className="relative z-10 text-center space-y-8 animate-pulse">
                <div className="w-24 h-24 mx-auto bg-red-900/20 rounded-full flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                    <Power size={48} className="text-red-500" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-[0.2em] mb-2 uppercase text-red-500">System Shutdown</h1>
                    <p className="text-xs text-red-400/60 uppercase tracking-widest">Terminating Secure Session...</p>
                </div>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-red-900/30 mx-auto rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.8)]" 
                        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                    />
                </div>

                <div className="text-[10px] text-red-500/40">
                    <Terminal size={12} className="inline mr-2" />
                    CLOSE_SOCKET: {progress}% COMPLETE
                </div>
            </div>
        </div>
    );
};
