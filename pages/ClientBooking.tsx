
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useCart, useSettings, useAuth } from '../App';
import { Lock, Calendar as CalIcon, Clock, CheckCircle, ChevronLeft, ChevronRight, Star, AlertCircle, X, Plus, RefreshCw, Layers } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];

interface Session {
    id: string;
    title: string;
    date: Date;
    time: string;
}

export const ClientBooking: React.FC = () => {
  const navigate = useNavigate();
  const { hasMembership } = useCart();
  const { user } = useAuth();
  const { themeMode } = useSettings();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Mock State for Booked Sessions
  const [mySessions, setMySessions] = useState<Session[]>([
      { id: '1', title: 'Unboxing Setup', date: new Date(new Date().setDate(new Date().getDate() + 2)), time: '4:00 PM' }
  ]);

  const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay(); 
      const days = [];
      for (let i = 0; i < firstDay; i++) days.push(null);
      for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
      return days;
  };

  const changeMonth = (delta: number) => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const handleBookSession = () => {
      if (selectedDate && selectedTime) {
          const newSession: Session = {
              id: Math.random().toString(36).substr(2, 9),
              title: 'Consultation',
              date: selectedDate,
              time: selectedTime
          };
          setMySessions([...mySessions, newSession]);
          setSelectedDate(null);
          setSelectedTime(null);
      }
  };

  const handleCancel = (id: string) => {
      if (window.confirm("Are you sure you want to cancel this session?")) {
          setMySessions(prev => prev.filter(s => s.id !== id));
      }
  };

  const isDark = themeMode === 'dark';
  const isAutumn = themeMode === 'autumn';
  const t = {
      text: isDark ? 'text-white' : isAutumn ? 'text-amber-900' : 'text-slate-900',
      subText: isDark ? 'text-slate-400' : isAutumn ? 'text-amber-700/70' : 'text-slate-500',
      panel: isDark ? 'bg-black/40 border-white/10' : isAutumn ? 'bg-white/80 border-orange-200 shadow-sm' : 'bg-white/80 border-slate-200 shadow-sm',
      accent: isDark ? 'text-cyan-400' : isAutumn ? 'text-orange-600' : 'text-cyan-600',
      dayBtn: isDark ? 'bg-white/5 border-white/5 text-white hover:bg-white/10' : isAutumn ? 'bg-white border-orange-100 text-amber-900 hover:bg-orange-50' : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50',
      selectedDay: isDark ? 'bg-cyan-500 border-cyan-400 text-black' : isAutumn ? 'bg-orange-500 border-orange-400 text-white' : 'bg-cyan-500 border-cyan-400 text-white',
      disabledDay: isDark ? 'opacity-30 cursor-not-allowed' : 'opacity-40 bg-slate-100 text-slate-300 cursor-not-allowed',
  };
  
  const canAccess = hasMembership || user?.isAdmin;

  if (!canAccess) {
      return (
          <Layout>
              <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
                  <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20"><Lock size={40} className="text-red-400" /></div>
                  <h1 className={`text-3xl font-light uppercase tracking-widest mb-4 ${t.text}`}>Member Access Only</h1>
                  <p className={`max-w-md mb-8 ${t.subText}`}>The booking calendar is reserved for our active members. Join the Inner Circle to schedule your live sessions and manage your gift timeline.</p>
                  <button onClick={() => navigate('/checkout')} className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 tracking-widest flex items-center gap-2"><Star size={18} /> GET MEMBERSHIP</button>
              </div>
          </Layout>
      );
  }

  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto px-6 pb-20">
          
          <div className={`flex flex-col md:flex-row justify-between items-end mb-8 border-b pb-6 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div>
                  <h1 className={`text-3xl font-light uppercase tracking-widest ${t.text}`}>Unified Calendar</h1>
                  <div className="flex items-center gap-2 mt-2">
                      <span className={`text-sm ${t.accent} flex items-center gap-2`}><Layers size={14} /> Layering My Schedule + App Events</span>
                  </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className={`text-sm font-bold ${t.text}`}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                  <div className="flex gap-1">
                      <button onClick={() => changeMonth(-1)} className={`p-2 rounded-lg ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white border hover:bg-slate-50'}`}><ChevronLeft size={16} className={t.text}/></button>
                      <button onClick={() => changeMonth(1)} className={`p-2 rounded-lg ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white border hover:bg-slate-50'}`}><ChevronRight size={16} className={t.text}/></button>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar Grid */}
              <div className={`lg:col-span-2 rounded-2xl p-6 backdrop-blur-md border ${t.panel}`}>
                  <div className="grid grid-cols-7 mb-4">
                      {DAYS.map(d => (<div key={d} className={`text-center text-xs font-bold uppercase py-2 ${t.subText}`}>{d}</div>))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                      {getDaysInMonth(currentDate).map((dayDate, i) => {
                          if (!dayDate) return <div key={i} />;
                          const isBooked = dayDate.getDate() % 5 === 0;
                          const isPast = dayDate < new Date(new Date().setHours(0,0,0,0));
                          const isSelected = selectedDate?.toDateString() === dayDate.toDateString();
                          const hasAdminEvent = dayDate.getDate() % 4 === 0; 
                          
                          return (
                              <button
                                key={i}
                                disabled={isPast || isBooked}
                                onClick={() => { setSelectedDate(dayDate); setSelectedTime(null); }}
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all border
                                    ${isSelected ? `${t.selectedDay} transform scale-105 z-10 shadow-lg` : isBooked ? 'bg-red-900/10 border-transparent text-red-500/30 cursor-not-allowed' : isPast ? t.disabledDay : t.dayBtn}
                                `}
                              >
                                  <span className="text-sm font-bold">{dayDate.getDate()}</span>
                                  {/* Dots for Events */}
                                  <div className="flex gap-1 absolute bottom-2">
                                      {isBooked && <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />}
                                      {hasAdminEvent && !isPast && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" title="App Event" />}
                                  </div>
                              </button>
                          )
                      })}
                  </div>
                  <div className="mt-4 flex gap-6 text-[10px] uppercase font-bold text-slate-500 justify-center">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500/50" /> Booked</div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> App Event (Auto)</div>
                      <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} /> My Selection</div>
                  </div>
              </div>

              {/* Booking Slot Details */}
              <div className={`rounded-2xl p-6 h-fit flex flex-col border ${t.panel}`}>
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${t.text}`}><Clock size={16} className={t.accent} /> Available Slots</h3>
                  {selectedDate ? (
                      <div className="space-y-3 animate-fade-in-up">
                          <p className={`text-xs mb-4 flex items-center justify-between ${t.subText}`}><span>Availability for {selectedDate.toLocaleDateString()}</span><span className={`font-bold ${t.accent}`}>{TIME_SLOTS.length} Slots</span></p>
                          <div className="space-y-2">
                            {TIME_SLOTS.map((time) => (
                                <button key={time} onClick={() => setSelectedTime(time)} className={`w-full p-3 rounded-lg border text-sm font-bold text-left transition-all flex justify-between items-center group ${selectedTime === time ? `${t.selectedDay} shadow-lg` : `${isDark ? 'border-white/10 bg-black/20 hover:border-cyan-500' : 'border-slate-200 bg-white hover:border-cyan-500'} ${t.subText}`}`}>
                                    {time}{selectedTime === time ? <CheckCircle size={16} /> : <span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase">Select</span>}
                                </button>
                            ))}
                          </div>
                          {selectedTime && (
                              <button onClick={handleBookSession} className={`w-full mt-4 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 animate-pulse ${isAutumn ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-green-500 text-black hover:bg-green-400'}`}><Plus size={18} /> CONFIRM BOOKING</button>
                          )}
                      </div>
                  ) : (
                      <div className={`text-center py-10 text-sm border border-dashed rounded-xl ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-300 text-slate-400'}`}><CalIcon size={24} className="mx-auto mb-2 opacity-50" />Select a date to view instructor availability.</div>
                  )}
                  <div className={`mt-8 pt-8 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                       <h4 className={`text-xs font-bold uppercase mb-4 tracking-widest ${t.subText}`}>My Upcoming Sessions</h4>
                       {mySessions.length > 0 ? (
                           <div className="space-y-3">
                               {mySessions.map(session => (
                                   <div key={session.id} className={`p-3 rounded-lg flex items-start gap-3 relative overflow-hidden group border transition-colors ${isDark ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                       <div className="mt-1 p-1 bg-green-500/20 rounded-full text-green-500"><CheckCircle size={12} /></div>
                                       <div className="flex-1"><p className={`text-xs font-bold ${t.text}`}>{session.title}</p><p className={`text-[10px] ${t.subText}`}>{session.date.toLocaleDateString()} @ {session.time}</p></div>
                                       <button onClick={() => handleCancel(session.id)} className="text-[10px] text-red-500/60 hover:text-red-500 hover:underline absolute bottom-2 right-2 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity"><X size={10} /> Cancel</button>
                                   </div>
                               ))}
                           </div>
                       ) : <p className={`text-[10px] italic ${t.subText}`}>No upcoming sessions booked.</p>}
                  </div>
              </div>
          </div>
      </div>
    </Layout>
  );
};
