
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Mail, MessageSquare, Link as LinkIcon, ArrowLeft, Send, CheckCircle, Smartphone, Globe, Star, Video, Copy } from 'lucide-react';

export const Delivery: React.FC = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'email' | 'sms' | 'link'>('email');
  const [copied, setCopied] = useState(false);

  // Generate the current host URL + the receiver booking path
  const shareableLink = `${window.location.origin}/#/receiver/booking`;

  const handleSend = () => {
    navigate('/final');
  };

  const handleCopyLink = () => {
      navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const OptionCard = ({ id, label, icon: Icon, desc }: { id: 'email' | 'sms' | 'link', label: string, icon: any, desc: string }) => (
      <button 
        onClick={() => setMethod(id)}
        className={`w-full relative p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group ${
            method === id 
            ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
            : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
      >
          <div className={`p-3 rounded-xl ${method === id ? 'bg-cyan-500 text-black' : 'bg-black/40 text-slate-400'}`}>
              <Icon size={24} />
          </div>
          <div className="flex-1">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${method === id ? 'text-white' : 'text-slate-300'}`}>{label}</h3>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
          </div>
          {method === id && <CheckCircle size={20} className="text-cyan-400" />}
      </button>
  );

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full min-h-full px-6 md:px-0 pb-32 pt-10">
        <div className="w-full max-w-md space-y-6">
            
            <div className="text-center mb-6 animate-fade-in-up">
              <h1 className="text-2xl font-light text-white tracking-widest uppercase">Select Delivery</h1>
              <p className="text-cyan-400/60 text-sm mt-1">How should we send this experience?</p>
            </div>

            {/* Premium Vertical Stack for Mobile */}
            <div className="space-y-3 animate-fade-in-up">
                <OptionCard id="email" label="Direct Email" icon={Mail} desc="Send a beautiful HTML invite." />
                <OptionCard id="sms" label="Text Message" icon={Smartphone} desc="Instant mobile notification." />
                <OptionCard id="link" label="Secure Link" icon={LinkIcon} desc="Copy and paste personally." />
            </div>

            {/* Input Field Area */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md animate-fade-in-up shadow-xl transition-all">
                {method === 'email' && (
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Recipient Email</label>
                        <input type="email" placeholder="friend@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                )}
                {method === 'sms' && (
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Phone Number</label>
                        <input type="tel" placeholder="(555) 123-4567" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                )}
                {method === 'link' && (
                    <div className="space-y-4 text-center">
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto text-cyan-400 mb-2 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                            <Globe size={32} />
                        </div>
                        <p className="text-sm text-slate-300">Generate a unique, encrypted link to share manually.</p>
                        
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
                             <div className="flex-1 text-xs font-mono text-cyan-500 truncate px-2 text-left">
                                 {shareableLink}
                             </div>
                             <button 
                                onClick={handleCopyLink}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors relative"
                             >
                                 {copied ? <CheckCircle size={16} className="text-green-400"/> : <Copy size={16} />}
                             </button>
                        </div>
                        {copied && <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider animate-pulse">Link Copied to Clipboard!</p>}
                    </div>
                )}
            </div>

            {/* --- LAST CHANCE AD PANEL --- */}
            <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-900/10 to-black p-4 relative overflow-hidden group cursor-pointer hover:border-yellow-500/50 transition-all">
                <div className="absolute top-0 right-0 px-2 py-1 bg-yellow-500 text-black text-[10px] font-bold uppercase">Special Offer</div>
                <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-black rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
                        {/* Placeholder for Media/Video */}
                        <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
                        <Video size={24} className="text-yellow-500 z-10" />
                        <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[8px] text-white">0:15</div>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold uppercase text-sm mb-1">Gift a Class?</h4>
                        <p className="text-xs text-slate-400 mb-2 leading-tight">Add a live session to this gift for only $10.</p>
                        <button className="text-[10px] font-bold text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-full hover:bg-yellow-500 hover:text-black transition-colors">
                            + ADD TO GIFT
                        </button>
                    </div>
                </div>
            </div>

            {/* Send Button */}
            <button 
                onClick={handleSend}
                className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg tracking-widest shadow-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
                {method === 'link' ? 'FINISH & CLOSE' : 'SEND GIFT'} <Send size={20} />
            </button>

        </div>

        {/* Navigation Footer */}
        <div className="fixed bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 flex justify-between items-center z-50">
           <button onClick={() => navigate('/wrapping')} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
             <ArrowLeft size={16} /> Back
           </button>
        </div>

      </div>
    </Layout>
  );
};
