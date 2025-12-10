
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Calendar, Clock, Video, User, CheckCircle, Gift, ChevronRight } from 'lucide-react';

const DATES = [
  { day: 'Mon', date: '12', slots: ['10:00 AM', '2:00 PM'] },
  { day: 'Tue', date: '13', slots: ['11:30 AM', '4:00 PM'] },
  { day: 'Wed', date: '14', slots: ['9:00 AM', '1:00 PM', '3:30 PM'] },
  { day: 'Thu', date: '15', slots: ['10:00 AM'] },
  { day: 'Fri', date: '16', slots: ['12:00 PM', '5:00 PM'] },
];

export const ReceiverBooking: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      setIsBooked(true);
    }
  };

  const handleJoinSession = () => {
    navigate('/session');
  };

  return (
    <Layout hideNav>
      <div className="flex flex-col w-full min-h-full px-6 py-10 pb-24">
        
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <Gift size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">You've Got a Gift</h2>
                    <p className="text-purple-300 text-xs">From: Anonymous Friend</p>
                </div>
            </div>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                Your custom digital experience is ready. Schedule a live unboxing session to reveal your assets.
            </p>
        </div>

        {isBooked ? (
            /* CONFIRMATION VIEW */
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up">
                 <div className="w-24 h-24 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                    <CheckCircle size={40} className="text-green-400" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Confirmed</h2>
                 <p className="text-slate-400 mb-8 text-sm">Session scheduled for {DATES.find(d => d.date === selectedDate)?.day} {selectedDate}th at {selectedTime}.</p>
                 
                 <div className="w-full bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-8">
                    <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">! Simulation Mode !</p>
                    <p className="text-yellow-200/60 text-[10px]">Session time matches system time.</p>
                 </div>

                 <button 
                   onClick={handleJoinSession}
                   className="w-full py-4 rounded-xl bg-cyan-600 text-white font-bold text-lg tracking-widest shadow-lg flex items-center justify-center gap-2 animate-pulse"
                 >
                   <Video size={20} /> ENTER LOBBY
                 </button>
            </div>
        ) : (
            /* SELECTION VIEW */
            <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">1. Select Date</h3>
                
                {/* Horizontal Scrollable Calendar */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 mb-6">
                  {DATES.map((item) => (
                    <button
                      key={item.date}
                      onClick={() => { setSelectedDate(item.date); setSelectedTime(null); }}
                      className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${
                          selectedDate === item.date 
                          ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg scale-105' 
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase opacity-60">{item.day}</span>
                      <span className="text-2xl font-bold">{item.date}</span>
                    </button>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">2. Select Time</h3>
                <div className="grid grid-cols-2 gap-3 mb-8">
                   {selectedDate ? (
                      DATES.find(d => d.date === selectedDate)?.slots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                              selectedTime === time 
                              ? 'border-cyan-400 bg-cyan-900/40 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                              : 'border-white/10 bg-white/5 text-slate-400'
                          }`}
                        >
                          {time}
                        </button>
                      ))
                   ) : (
                     <div className="col-span-2 py-8 text-center text-slate-600 text-sm border border-dashed border-white/10 rounded-xl">
                       Please choose a date first.
                     </div>
                   )}
                </div>

                <div className="mt-auto">
                    <button 
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors shadow-xl"
                    >
                    Book Session
                    </button>
                </div>
            </div>
        )}

      </div>
    </Layout>
  );
};
