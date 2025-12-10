
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, CheckCircle } from 'lucide-react';
import { useSettings } from '../App';
import { GoogleGenAI } from "@google/genai";
import { useNavigate } from 'react-router-dom';

export const AIin5Widget: React.FC = () => {
    // # REGION: HOOKS & STATE
    const { botConfig, addLead, accessibilityMode } = useSettings();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
        { role: 'model', text: "Welcome to the VdM Network! \n\nI am AIin5. \n\nAre you looking for a Haircut, a Gift from the Store, or to Buy this App?" }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [leadCaptured, setLeadCaptured] = useState(false);
    // # END REGION: HOOKS

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Simple Regex to extract contact info
    const extractContact = (text: string) => {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
        const emailMatch = text.match(emailRegex);
        const phoneMatch = text.match(phoneRegex);
        return emailMatch ? emailMatch[0] : (phoneMatch ? phoneMatch[0] : null);
    }

    // --- SMART ROUTER LOGIC ---
    const checkIntentAndRoute = (text: string) => {
        const lower = text.toLowerCase();
        
        // 1. SERVICE INTENT (Haircut/Class) -> [SERVICE] Lead -> Calendar
        if (lower.includes('hair') || lower.includes('cut') || lower.includes('appointment') || lower.includes('book') || lower.includes('class')) {
            return {
                reply: "I've logged your request in the Service Hub. Transferring you to the Booking Calendar now...",
                type: 'service',
                action: () => setTimeout(() => navigate('/member-calendar'), 2000)
            };
        }
        
        // 2. RETAIL INTENT (Store/Gift) -> [GENERAL] Lead -> Shop
        if (lower.includes('buy') || lower.includes('gift') || lower.includes('price') || lower.includes('store') || lower.includes('shop')) {
            return {
                reply: "Excellent choice. Our digital assets are top tier. Opening the Vault...",
                type: 'general',
                action: () => setTimeout(() => navigate('/shop'), 1500)
            };
        }

        // 3. B2B INTENT (Franchise/App) -> [SALES] Lead -> Brochure Mode
        if (lower.includes('app') || lower.includes('system') || lower.includes('business') || lower.includes('franchise') || lower.includes('crm')) {
            return {
                reply: "You want to own this system? I'm generating a Brochure View for you now. Please check the Admin panel (Demo Mode).",
                type: 'sales',
                action: () => setTimeout(() => navigate('/admin'), 2000) // Goes to Admin which will show Brochure Mode if configured, or login
            };
        }

        return null;
    };

    // # REGION: MESSAGE HANDLING
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsThinking(true);

        // --- CHECK ROUTING FIRST ---
        const routingResult = checkIntentAndRoute(userMsg);
        
        // --- LEAD CAPTURE LOGIC ---
        // Always capture lead if contact info found OR if intent is clear
        const contact = extractContact(userMsg) || "Anonymous Visitor";
        
        if (routingResult || extractContact(userMsg)) {
             if (!leadCaptured) {
                addLead({
                    id: Math.random().toString(36).substr(2, 9),
                    name: contact === "Anonymous Visitor" ? "Visitor (Intent)" : "Visitor (Contact)",
                    contact: contact,
                    source: 'AIin5 Widget',
                    type: routingResult ? (routingResult.type as any) : 'general',
                    status: 'new',
                    timestamp: new Date().toISOString(),
                    summary: `User said: "${userMsg}"`
                });
                setLeadCaptured(true);
            }
        }

        if (routingResult) {
            setIsThinking(false);
            setMessages(prev => [...prev, { role: 'model', text: routingResult.reply }]);
            routingResult.action();
            return;
        }

        // --- FALLBACK TO AI ---
        try {
            // SALES REP PERSONA
            const systemPrompt = `
                You are AIin5, a high-tech sales representative for MGTConsulting.
                Your goal is to triage the user to the right department.
                
                1. If they want a haircut -> Send them to Booking.
                2. If they want to buy items -> Send them to Shop.
                3. If they want to buy THIS SOFTWARE -> Pitch the Franchise License.
                4. Keep responses short (under 50 words). Futuristic, professional tone.
            `;

            let reply = "I am initializing. Please configure my Brain in the Admin Dashboard.";
            
            // CHECK ROBUSTNESS: If key is default/placeholder, do not try to fetch
            const isRealKey = botConfig.apiKey && !botConfig.apiKey.includes('dm2d_master');

            if (botConfig.provider === 'google' && isRealKey) {
                // GOOGLE GEMINI
                const ai = new GoogleGenAI({ apiKey: botConfig.apiKey });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [{ role: 'user', parts: [{ text: userMsg }] }],
                    config: {
                        systemInstruction: systemPrompt
                    }
                });
                reply = response.text || "No response generated.";

            } else if (botConfig.provider === 'ollama' && botConfig.ollamaUrl) {
                // LOCAL OLLAMA / CUSTOM LLM
                try {
                    const response = await fetch(botConfig.ollamaUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: botConfig.modelName || 'llama3', // Default to llama3 if not set
                            prompt: `${systemPrompt}\n\nUser: ${userMsg}\nAI:`,
                            stream: false
                        })
                    });
                    const data = await response.json();
                    reply = data.response;
                } catch (e) {
                    reply = "Error connecting to Local Neural Net (Ollama). Please check if your local server is running.";
                }
            } else {
                // FALLBACK IF NO KEY IS PRESENT (SAFE MODE)
                reply = "I'm detecting interest. Are you looking for services (Hair) or products (Store)?";
            }

            setMessages(prev => [...prev, { role: 'model', text: reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "Error: My neural link is unstable. Please check the API Key." }]);
        } finally {
            setIsThinking(false);
        }
    };
    // # END REGION: MESSAGE HANDLING

    return (
        <div className="fixed bottom-6 right-6 z-[200] font-sans">
            
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="mb-4 w-80 h-96 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="p-3 bg-cyan-900/30 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AIin5 Sales Rep</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/20 rounded-tr-none' 
                                    : 'bg-white/10 text-slate-300 border border-white/5 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                             <div className="flex justify-start">
                                <div className="bg-white/5 p-3 rounded-xl rounded-tl-none">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Lead Confirmation Toast */}
                        {leadCaptured && (
                            <div className="flex justify-center my-2">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 flex items-center gap-1 text-[10px] text-green-400">
                                    <CheckCircle size={10} /> Saved to Hub
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me about this store..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                        />
                        <button 
                            onClick={handleSend}
                            className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* TOGGLE BUTTON */}
            {accessibilityMode ? (
                // ACCESSIBILITY MODE: Big, High Contrast, Bulky
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-20 h-20 bg-white text-black border-4 border-slate-600 rounded-full shadow-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
                    aria-label="Open AI Chat"
                >
                    {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
                </button>
            ) : (
                // ORGANIC MODE: Subtle, Glowing Orb, "Screen Reaction" Style
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${
                        isOpen 
                        ? 'bg-cyan-900/80 text-cyan-400 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                        : 'bg-gradient-to-br from-cyan-500/80 to-blue-600/80 text-white shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-pulse-slow backdrop-blur-md'
                    }`}
                >
                    {isOpen ? <X size={24} /> : <Bot size={28} className="drop-shadow-md" />}
                </button>
            )}
        </div>
    );
};
