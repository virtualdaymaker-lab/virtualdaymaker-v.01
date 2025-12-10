import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { CreditCard, Gift, Box, Tag, Film, CheckCircle, AlertCircle, ChevronDown, ChevronUp, User, Mail, DollarSign } from 'lucide-react';

// --- Types ---
interface FormData {
  fullName: string;
  email: string;
  paypalEmail: string;
  ccNumber: string;
  ccExpiry: string;
  ccCVC: string;
  wrapping: string;
  giftBox: string;
  tagMessage: string;
  animationStyle: string;
}

interface FormErrors {
  [key: string]: string;
}

// --- Component: Expandable Glass Panel ---
interface ExpandablePanelProps {
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  summary: string;
  hasError?: boolean;
  children: React.ReactNode;
}

const ExpandableGlassPanel: React.FC<ExpandablePanelProps> = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  summary,
  hasError,
  children
}) => {
  return (
    <div 
      className={`relative w-full transition-all duration-300 rounded-2xl border backdrop-blur-md overflow-hidden mb-4
        ${hasError ? 'border-red-500/50 bg-red-900/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 
          isOpen ? 'border-cyan-500/30 bg-slate-900/80 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
    >
      {/* Header / Summary View */}
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left outline-none focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${hasError ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-cyan-400'}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${hasError ? 'text-red-400' : 'text-white'}`}>{title}</h3>
            {!isOpen && (
              <p className={`text-sm ${hasError ? 'text-red-300/70' : 'text-cyan-200/80'}`}>{hasError ? 'Attention Required' : summary}</p>
            )}
          </div>
        </div>
        
        <div className="text-white/50">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Expanded Content / Form */}
      <div 
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-6 pt-0 border-t border-white/5">
          {children}
        </div>
      </div>
    </div>
  );
};

export const CustomizationHub: React.FC = () => {
  const navigate = useNavigate();
  
  // --- State ---
  const [openPanel, setOpenPanel] = useState<string>('info');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    paypalEmail: '',
    ccNumber: '',
    ccExpiry: '',
    ccCVC: '',
    wrapping: 'Standard',
    giftBox: 'Obsidian Black',
    tagMessage: '',
    animationStyle: 'Slow Fade',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const togglePanel = (panelId: string) => {
    setOpenPanel(openPanel === panelId ? '' : panelId);
  };

  // --- Validation Logic ---
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Info Validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required.';

    // Payment Validation (Simple Logic: Either PayPal OR CC must be partially filled to trigger check, or enforce one)
    // Here we enforce CC if PayPal is empty, or PayPal if CC is empty.
    const isPayPalFilled = formData.paypalEmail.trim().length > 0;
    const isCCFilled = formData.ccNumber.trim().length > 0;

    if (!isPayPalFilled && !isCCFilled) {
      newErrors.payment = 'Please provide a payment method (PayPal or Credit Card).';
      newErrors.ccNumber = 'Required';
      newErrors.paypalEmail = 'Required';
    } else if (isPayPalFilled) {
        if (!/\S+@\S+\.\S+/.test(formData.paypalEmail)) newErrors.paypalEmail = 'Invalid PayPal email address.';
    } else if (isCCFilled) {
        if (!/^\d{16}$/.test(formData.ccNumber.replace(/\s/g, ''))) newErrors.ccNumber = 'Invalid card number (16 digits).';
        if (!/^\d{2}\/\d{2}$/.test(formData.ccExpiry)) newErrors.ccExpiry = 'Format MM/YY required.';
        if (!/^\d{3,4}$/.test(formData.ccCVC)) newErrors.ccCVC = 'Invalid CVC.';
    }

    // Gift Tag Validation
    if (formData.tagMessage.length > 50) newErrors.tagMessage = 'Message too long (max 50 chars).';

    setErrors(newErrors);
    
    // Auto-open the first panel with an error
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
        if (['fullName', 'email'].includes(firstErrorKey)) setOpenPanel('info');
        else if (firstErrorKey === 'paypalEmail') setOpenPanel('paypal');
        else if (['ccNumber', 'ccExpiry', 'ccCVC'].includes(firstErrorKey)) setOpenPanel('cc');
        else if (firstErrorKey === 'tagMessage') setOpenPanel('tags');
        isValid = false;
    }

    return isValid;
  };

  const handleProceed = () => {
    if (validateForm()) {
      navigate('/pay');
    }
  };

  // Helper for Input Classes
  const inputClass = (errorKey?: string) => `
    w-full bg-black/40 border rounded-lg p-3 text-sm text-white placeholder-white/30 outline-none transition-all
    ${errorKey && errors[errorKey] ? 'border-red-500 focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-white/10 focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'}
  `;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full min-h-full px-4 md:px-0 pb-32">
         <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-2xl font-light text-white tracking-widest uppercase">Configuration Hub</h1>
            <p className="text-cyan-400/60 text-xs mt-1">Configure your digital assets & payment</p>
         </div>

         <div className="w-full max-w-md space-y-2">
            
            {/* 1. Information Panel */}
            <ExpandableGlassPanel 
              title="Personal Information" 
              icon={User} 
              isOpen={openPanel === 'info'} 
              onToggle={() => togglePanel('info')}
              summary={formData.fullName || "Guest Checkout"}
              hasError={!!errors.fullName || !!errors.email}
            >
              <div className="space-y-4">
                <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputClass('fullName')} placeholder="John Doe" />
                    {errors.fullName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.fullName}</p>}
                </div>
                <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className={inputClass('email')} placeholder="john@example.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
                </div>
              </div>
            </ExpandableGlassPanel>

            {/* 2. PayPal Panel */}
            <ExpandableGlassPanel 
              title="PayPal" 
              icon={DollarSign} 
              isOpen={openPanel === 'paypal'} 
              onToggle={() => togglePanel('paypal')}
              summary={formData.paypalEmail ? "Connected" : "Not connected"}
              hasError={!!errors.paypalEmail}
            >
              <div className="space-y-4">
                  <p className="text-xs text-slate-400">Connect your PayPal account for a secure checkout experience.</p>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">PayPal Email</label>
                    <input name="paypalEmail" value={formData.paypalEmail} onChange={handleInputChange} className={inputClass('paypalEmail')} placeholder="email@paypal.com" />
                    {errors.paypalEmail && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.paypalEmail}</p>}
                  </div>
              </div>
            </ExpandableGlassPanel>

            {/* 3. Credit Card Panel */}
            <ExpandableGlassPanel 
              title="Credit Card" 
              icon={CreditCard} 
              isOpen={openPanel === 'cc'} 
              onToggle={() => togglePanel('cc')}
              summary={formData.ccNumber ? `**** ${formData.ccNumber.slice(-4)}` : "Add Card"}
              hasError={!!errors.ccNumber || !!errors.ccExpiry || !!errors.ccCVC || !!errors.payment}
            >
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Card Number</label>
                    <input name="ccNumber" maxLength={16} value={formData.ccNumber} onChange={handleInputChange} className={inputClass('ccNumber')} placeholder="0000 0000 0000 0000" />
                    {errors.ccNumber && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.ccNumber}</p>}
                 </div>
                 <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Expiry</label>
                        <input name="ccExpiry" maxLength={5} value={formData.ccExpiry} onChange={handleInputChange} className={inputClass('ccExpiry')} placeholder="MM/YY" />
                        {errors.ccExpiry && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.ccExpiry}</p>}
                    </div>
                    <div className="w-1/2">
                        <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">CVC</label>
                        <input name="ccCVC" maxLength={4} value={formData.ccCVC} onChange={handleInputChange} className={inputClass('ccCVC')} placeholder="123" />
                        {errors.ccCVC && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.ccCVC}</p>}
                    </div>
                 </div>
              </div>
            </ExpandableGlassPanel>

            {/* 4. Wrapping Panel */}
            <ExpandableGlassPanel 
              title="Wrapping Service" 
              icon={Gift} 
              isOpen={openPanel === 'wrapping'} 
              onToggle={() => togglePanel('wrapping')}
              summary={formData.wrapping}
            >
                <div className="grid grid-cols-2 gap-3">
                    {['Standard', 'Premium (+$2)', 'Neon Tech (+$5)', 'Stealth Mode'].map((opt) => (
                        <button 
                            key={opt}
                            onClick={() => setFormData({...formData, wrapping: opt})}
                            className={`p-3 rounded-lg text-xs font-bold border transition-all ${formData.wrapping === opt ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-black/30 text-slate-400 border-white/10 hover:border-cyan-500/50'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </ExpandableGlassPanel>

             {/* 5. Gift Box Panel */}
             <ExpandableGlassPanel 
              title="Gift Box Style" 
              icon={Box} 
              isOpen={openPanel === 'box'} 
              onToggle={() => togglePanel('box')}
              summary={formData.giftBox}
            >
                <select 
                    name="giftBox" 
                    value={formData.giftBox} 
                    onChange={handleInputChange} 
                    className={inputClass()}
                >
                    <option value="Obsidian Black">Obsidian Black</option>
                    <option value="Frost Glass">Frost Glass</option>
                    <option value="Cyber Yellow">Cyber Yellow</option>
                </select>
            </ExpandableGlassPanel>

            {/* 6. Tags Panel */}
            <ExpandableGlassPanel 
              title="Gift Tag" 
              icon={Tag} 
              isOpen={openPanel === 'tags'} 
              onToggle={() => togglePanel('tags')}
              summary={formData.tagMessage ? "Message Added" : "No Message"}
              hasError={!!errors.tagMessage}
            >
               <div>
                 <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Custom Message</label>
                 <textarea 
                    name="tagMessage" 
                    value={formData.tagMessage} 
                    onChange={handleInputChange} 
                    className={`${inputClass('tagMessage')} h-24 resize-none`} 
                    placeholder="Enter your message here..." 
                 />
                 <div className="flex justify-between mt-1">
                     {errors.tagMessage ? 
                        <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={10} /> {errors.tagMessage}</span> 
                        : <span />}
                     <span className={`text-xs ${formData.tagMessage.length > 50 ? 'text-red-400' : 'text-slate-500'}`}>{formData.tagMessage.length}/50</span>
                 </div>
               </div>
            </ExpandableGlassPanel>

             {/* 7. Animation Panel */}
             <ExpandableGlassPanel 
              title="Animation Style" 
              icon={Film} 
              isOpen={openPanel === 'anim'} 
              onToggle={() => togglePanel('anim')}
              summary={formData.animationStyle}
            >
                 <div className="flex flex-col gap-2">
                    {['Slow Fade', 'Glitch Entry', 'Orbit Reveal', 'Pop-up'].map((anim) => (
                        <label key={anim} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-black/20 hover:bg-white/5 cursor-pointer">
                            <input 
                                type="radio" 
                                name="animationStyle" 
                                value={anim} 
                                checked={formData.animationStyle === anim} 
                                onChange={handleInputChange}
                                className="accent-cyan-400" 
                            />
                            <span className="text-sm text-white">{anim}</span>
                        </label>
                    ))}
                </div>
            </ExpandableGlassPanel>
            
            {/* 8. Final Review (Static Summary) */}
            <div className="py-4 border-t border-white/10 mt-6">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-400">Total Items</span>
                    <span className="text-white font-bold">3</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Estimated Total</span>
                    <span className="text-cyan-400 font-bold">$24.99</span>
                </div>
            </div>

            {/* Proceed Button */}
            <button 
                onClick={handleProceed}
                className="w-full py-4 mt-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-lg tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2"
            >
                <CheckCircle size={20} />
                CONFIRM & PAY
            </button>
            
            {/* Global Error Message */}
            {Object.keys(errors).length > 0 && (
                <div className="text-center mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-pulse">
                    <p className="text-red-400 text-xs font-bold uppercase tracking-widest">Please correct the errors above</p>
                </div>
            )}

         </div>
      </div>
    </Layout>
  );
};