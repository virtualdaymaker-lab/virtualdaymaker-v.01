import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../App';
import { Lock, CreditCard } from 'lucide-react';
import { Layout } from '../components/Layout';

export const PayNow: React.FC = () => {
  const navigate = useNavigate();
  const { total, items } = useCart();
  const tax = total * 0.08;
  const grandTotal = total + tax;

  return (
    <Layout hideNav>
      <div className="flex items-center justify-center w-full h-full p-4">
        
        {/* Central Standalone Module */}
        <div className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden animate-fade-in-up">
          
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

          <div className="text-center mb-8">
            <h2 className="text-3xl font-light tracking-[0.2em] text-white">CHECKOUT</h2>
            <div className="flex justify-center items-center gap-2 mt-2 text-green-400 text-xs uppercase tracking-widest">
               <Lock size={12} /> Secure Encryption
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Items ({items.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Taxes & Processing</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="h-px w-full bg-white/10 my-2" />
            <div className="flex justify-between text-white text-xl font-bold">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Display */}
          <div className="bg-white/5 rounded-xl p-4 mb-8 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded">
                      <CreditCard className="text-cyan-400 w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-sm text-white font-medium">Visa ending in 4242</p>
                      <p className="text-xs text-slate-500">Exp 09/28</p>
                  </div>
              </div>
              <button className="text-xs text-cyan-400 hover:text-cyan-300">CHANGE</button>
          </div>

          {/* Pay Button */}
          <button 
            onClick={() => navigate('/orbit')}
            className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg tracking-widest transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transform hover:-translate-y-1"
          >
            PAY ${grandTotal.toFixed(2)}
          </button>

          <button 
             onClick={() => navigate('/customize')}
             className="w-full mt-4 text-xs text-slate-500 hover:text-white transition-colors"
          >
              CANCEL ORDER
          </button>

        </div>
      </div>
    </Layout>
  );
};