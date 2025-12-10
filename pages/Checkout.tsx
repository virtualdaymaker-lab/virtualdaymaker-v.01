
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useCart, useSettings } from '../App';
import { Shield, CreditCard, Lock, CheckCircle, Gift, ArrowLeft, AlertTriangle, DollarSign, Smartphone } from 'lucide-react';

export const Checkout: React.FC = () => {
  // # REGION: HOOKS & STATE
  const navigate = useNavigate();
  const { items, total, hasMembership, toggleMembership, removeFromCart } = useCart();
  const { apiKeys, orgProfile } = useSettings();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'confirmed' | 'error'>('idle');
  const [activeMethod, setActiveMethod] = useState<'paypal' | 'stripe' | 'manual' | 'demo'>('demo');
  // # END REGION: HOOKS

  // # REGION: EFFECTS
  // Auto-detect available gateways
  useEffect(() => {
      // Priority: PayPal > Stripe > Manual > Demo
      if (apiKeys.paypalClientId && apiKeys.paypalClientId.length > 5) {
          setActiveMethod('paypal');
      } else if (apiKeys.stripeKey && apiKeys.stripeKey.length > 5) {
          setActiveMethod('stripe');
      } else if (orgProfile?.policies.manual_payment_active) {
          setActiveMethod('manual');
      } else {
          setActiveMethod('demo');
      }
  }, [apiKeys, orgProfile]);
  // # END REGION: EFFECTS

  // # REGION: HANDLERS
  const handlePayment = () => {
    setPaymentStatus('processing');
    
    // SIMULATE API HANDSHAKE
    // In a production build, this is where you would call:
    // window.paypal.Buttons().render() OR stripe.confirmCardPayment()
    
    console.log(`Processing payment via ${activeMethod}`);

    setTimeout(() => {
      if (activeMethod === 'demo' || activeMethod === 'manual' || (activeMethod === 'paypal' && apiKeys.paypalClientId) || (activeMethod === 'stripe' && apiKeys.stripeKey)) {
          setPaymentStatus('confirmed');
      } else {
          setPaymentStatus('error');
      }
    }, 2000);
  };
  // # END REGION: HANDLERS

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full min-h-full px-4 md:px-0 pb-32">
        <div className="w-full max-w-md space-y-6">

          {/* 1️⃣ Membership Promo Panel */}
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-purple-900/10 backdrop-blur-md p-6">
            <div className="absolute top-0 right-0 p-2 bg-purple-500/20 rounded-bl-xl text-purple-300 text-xs font-bold uppercase tracking-wider">
              Limited Time
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Lifetime Membership</h3>
                <p className="text-purple-300 text-sm">$20.00 One-Time</p>
              </div>
            </div>
            <ul className="text-sm text-slate-300 space-y-2 mb-4">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-400"/> Includes 1 class for you</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-400"/> Includes 1 class to gift</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-400"/> Unlock premium wraps & colors</li>
            </ul>
            <button 
              onClick={toggleMembership}
              className={`w-full py-3 rounded-lg border transition-all font-bold tracking-wider ${
                hasMembership 
                ? 'bg-purple-500 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                : 'bg-transparent text-purple-300 border-purple-500/50 hover:bg-purple-500/10'
              }`}
            >
              {hasMembership ? 'MEMBERSHIP ADDED' : 'ADD MEMBERSHIP'}
            </button>
            {!hasMembership && (
              <p className="text-center text-xs text-purple-400/60 mt-2">Buy any gift today → Get first month FREE</p>
            )}
          </div>

          {/* 2️⃣ Review Order Panel */}
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar">
              {items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && <img src={item.imageUrl} alt="thumb" className="w-10 h-10 rounded object-cover opacity-70" />}
                    <div>
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    </div>
                  </div>
                  <span className="text-cyan-400 font-bold">${item.price.toFixed(2)}</span>
                </div>
              ))}
              {hasMembership && (
                <div className="flex justify-between items-center bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                  <span className="text-purple-300 text-sm font-medium">Lifetime Membership</span>
                  <span className="text-purple-300 font-bold">$20.00</span>
                </div>
              )}
            </div>
            <div className="h-px w-full bg-white/10 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Due</span>
              <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">No refunds. All purchases final.</p>
          </div>

          {/* 3️⃣ Payment & Confirmation Panel */}
          {paymentStatus === 'confirmed' ? (
            <div className="rounded-2xl border border-cyan-500/50 bg-cyan-900/20 backdrop-blur-md p-8 text-center flex flex-col items-center animate-fade-in-up">
              {/* Animated Gift Box */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-xl animate-box-glow blur-xl" />
                <div className="relative w-full h-full bg-black border border-cyan-400 rounded-xl flex items-center justify-center overflow-hidden">
                   {/* Lid */}
                   <div className="absolute top-0 w-full h-1/3 bg-cyan-900/80 border-b border-cyan-400 animate-lid-open z-10" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle size={48} className="text-cyan-400 animate-bounce" />
                   </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Payment Accepted!</h2>
              <p className="text-cyan-200/70 text-sm mb-6">Thank you for your purchase.</p>
              
              <button 
                onClick={() => navigate('/wrapping')}
                className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Gift size={20} /> PROCEED TO WRAPPING
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex justify-between">
                  <span>Payment Method</span>
                  {/* Selector for multiple methods if available */}
                  <div className="flex gap-2">
                       {apiKeys.paypalClientId && (
                           <button onClick={() => setActiveMethod('paypal')} className={`w-6 h-6 rounded flex items-center justify-center ${activeMethod === 'paypal' ? 'bg-white text-blue-600' : 'bg-white/10 text-slate-500'}`} title="PayPal"><span className="text-[8px] font-bold">PP</span></button>
                       )}
                       {apiKeys.stripeKey && (
                           <button onClick={() => setActiveMethod('stripe')} className={`w-6 h-6 rounded flex items-center justify-center ${activeMethod === 'stripe' ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-500'}`} title="Credit Card"><CreditCard size={12} /></button>
                       )}
                       {orgProfile?.policies.manual_payment_active && (
                           <button onClick={() => setActiveMethod('manual')} className={`w-6 h-6 rounded flex items-center justify-center ${activeMethod === 'manual' ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-500'}`} title="Manual/Custom"><Smartphone size={12} /></button>
                       )}
                  </div>
              </h3>
              
              <div className="space-y-4">
                 
                 {/* STRIPE VIEW (Credit Card) */}
                 {activeMethod === 'stripe' && (
                     <>
                        <input type="text" placeholder="Card Number" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 outline-none focus:border-cyan-500 transition-colors" />
                        <div className="flex gap-4">
                            <input type="text" placeholder="MM/YY" className="w-1/2 bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 outline-none focus:border-cyan-500 transition-colors" />
                            <input type="text" placeholder="CVC" className="w-1/2 bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 outline-none focus:border-cyan-500 transition-colors" />
                        </div>
                     </>
                 )}

                 {/* PAYPAL VIEW */}
                 {activeMethod === 'paypal' && (
                     <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl text-center">
                         <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="italic font-bold text-white text-lg">Pay</span><span className="text-cyan-400 font-bold text-lg">Pal</span>
                         </div>
                         <p className="text-white/80 text-xs font-bold mb-1">Secure Checkout</p>
                         <p className="text-white/50 text-[10px]">Pay with PayPal Balance, <strong>Debit Card</strong>, or <strong>Credit Card</strong>.</p>
                         <div className="mt-3 flex justify-center gap-2 opacity-60">
                             <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
                             <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">MC</div>
                             <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">AMEX</div>
                         </div>
                     </div>
                 )}

                 {/* MANUAL / CUSTOM VIEW */}
                 {activeMethod === 'manual' && (
                     <div className="p-4 bg-green-900/10 border border-green-500/30 rounded-xl">
                         <h4 className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Smartphone size={14}/> Payment Instructions</h4>
                         <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                             {orgProfile?.policies.manual_payment_instruction || "Please contact the store owner for payment details."}
                         </p>
                         <div className="mt-4 p-2 bg-black/40 rounded border border-white/5 text-[10px] text-slate-400 text-center">
                             Clicking "Mark Paid" confirms you have sent the funds.
                         </div>
                     </div>
                 )}

                 {/* DEMO VIEW */}
                 {activeMethod === 'demo' && (
                     <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                         <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
                         <div>
                             <p className="text-red-400 text-xs font-bold uppercase tracking-wide">NO KEYS DETECTED</p>
                             <p className="text-red-200/70 text-[10px] mt-1">Please configure PayPal or Stripe in the Admin Dashboard → Commerce Tab to take real payments.</p>
                         </div>
                     </div>
                 )}
                 
                 <button 
                  onClick={handlePayment}
                  disabled={paymentStatus === 'processing'}
                  className={`w-full py-4 mt-2 rounded-xl font-bold text-lg tracking-widest shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed
                    ${activeMethod === 'paypal' 
                        ? 'bg-[#FFC439] text-black hover:bg-[#F4BB30] shadow-[0_0_20px_rgba(255,196,57,0.3)]' 
                        : activeMethod === 'stripe' 
                            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                            : activeMethod === 'manual'
                                ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                : 'bg-white/10 text-slate-400 border border-white/10 hover:bg-white/20'
                    }
                  `}
                 >
                   {paymentStatus === 'processing' ? (
                     <span className="animate-pulse">CONNECTING...</span>
                   ) : activeMethod === 'paypal' ? (
                     <>
                        <span className="italic font-black">Pay</span><span className="font-light">Pal</span>
                     </>
                   ) : activeMethod === 'stripe' ? (
                     <>
                       <Lock size={16} /> PAY SECURELY
                     </>
                   ) : activeMethod === 'manual' ? (
                     <>
                       <CheckCircle size={16} /> I HAVE SENT PAYMENT
                     </>
                   ) : (
                     <>
                       <DollarSign size={16} /> DEMO PAY (CASH)
                     </>
                   )}
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="fixed bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 flex justify-between items-center z-50">
           <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
             <ArrowLeft size={16} /> Back
           </button>
           {/* Next button hidden here as flow is controlled by panels */}
        </div>
      </div>
    </Layout>
  );
};
