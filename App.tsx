
import React, { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartContextType, GifItem, AuthContextType, User, SettingsContextType, AppThemeMode, AppDecoration, BotConfig, ConnectedDevice, SystemStatus, ApiKeys, VpnConfig, LicenseTier, ExternalService, ThemeOverrides, ScheduledPost, Lead, CRMContact, OrgProfile, SystemMode, UsageMetrics } from './types';
import { Zap } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';

// --- LAZY LOADED PAGES (Defined at top level for stability) ---
const Auth = React.lazy(() => import('./pages/Auth').then(module => ({ default: module.Auth })));
const GifSelection = React.lazy(() => import('./pages/GifSelection').then(module => ({ default: module.GifSelection })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const WrappingLab = React.lazy(() => import('./pages/WrappingLab').then(module => ({ default: module.WrappingLab })));
const Delivery = React.lazy(() => import('./pages/Delivery').then(module => ({ default: module.Delivery })));
const FinalPromo = React.lazy(() => import('./pages/FinalPromo').then(module => ({ default: module.FinalPromo })));
const ReceiverBooking = React.lazy(() => import('./pages/ReceiverBooking').then(module => ({ default: module.ReceiverBooking })));
const LiveSession = React.lazy(() => import('./pages/LiveSession').then(module => ({ default: module.LiveSession })));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ClientBooking = React.lazy(() => import('./pages/ClientBooking').then(module => ({ default: module.ClientBooking })));
const SystemSetup = React.lazy(() => import('./pages/SystemSetup').then(module => ({ default: module.SystemSetup })));
const Workstation = React.lazy(() => import('./pages/Workstation').then(module => ({ default: module.Workstation })));
const Logout = React.lazy(() => import('./pages/Logout').then(module => ({ default: module.Logout })));

// Dynamic imports that were previously inline
const PayNow = React.lazy(() => import('./pages/PayNow').then(module => ({ default: module.PayNow })));
const OrbitReview = React.lazy(() => import('./pages/OrbitReview').then(module => ({ default: module.OrbitReview })));
const CustomizationHub = React.lazy(() => import('./pages/CustomizationHub').then(module => ({ default: module.CustomizationHub })));

// --- FACTORY DEFAULTS (VdM CREDENTIALS) ---
const MASTER_KEYS: ApiKeys = {
  masterNexusKey: 'dm2d_nexus_master_key_v1',
  paypalClientId: 'dm2d_master_paypal_client_id_x8z9',
  stripeKey: 'pk_live_dm2d_master_stripe_key_v2',
  vercelToken: 'dm2d_master_vercel_token',
  supabaseUrl: 'https://master.supabase.co',
  supabaseKey: 'dm2d_master_supabase_key',
  googleGemini: 'dm2d_master_gemini_api_key',
  googleAds: 'dm2d_master_google_ads_id',
  backupGeminiKeys: []
};

const EMPTY_KEYS: ApiKeys = {
  masterNexusKey: '',
  paypalClientId: '',
  stripeKey: '',
  vercelToken: '',
  supabaseUrl: '',
  supabaseKey: '',
  googleGemini: '',
  googleAds: '',
  backupGeminiKeys: []
};

// Default Services
const DEFAULT_SERVICES: ExternalService[] = [
    { id: 'vercel', name: 'Vercel', provider: 'Vercel Inc', type: 'hosting', status: 'active', icon: 'server' },
    { id: 'supabase', name: 'Supabase', provider: 'Supabase', type: 'database', status: 'inactive', icon: 'database' },
    { id: 'gmail', name: 'Workspace', provider: 'Google', type: 'marketing', status: 'inactive', icon: 'mail' },
    { id: 'gemini', name: 'Gemini 2.5', provider: 'Google', type: 'ai', status: 'active', icon: 'brain' }
];

// DEFAULT INVENTORY (If none exists)
const DEFAULT_INVENTORY: GifItem[] = [
  { id: '1', title: 'Cosmic Cat', price: 1.99, imageUrl: 'https://picsum.photos/300/200?random=1', description: 'A cat traversing the neon galaxies.' },
  { id: '2', title: 'Glitch City', price: 2.50, imageUrl: 'https://picsum.photos/300/200?random=2', description: 'Cyberpunk city vibes with heavy glitch effects.' },
  { id: 'APP_COST', title: 'VdM Digital Launch Kit', price: 49.99, imageUrl: '', description: 'Complete Store Software Package. Includes Hub access and Concierge Setup. (Software Only - No Legal/LLC included).', isSpecialPanel: true },
  { id: '3', title: 'Retro Wave', price: 0.99, imageUrl: 'https://picsum.photos/300/200?random=3', description: 'Sunset overdrive in a retro grid world.' },
  { id: '4', title: 'Neon Rain', price: 3.99, imageUrl: 'https://picsum.photos/300/200?random=4', description: 'Soothing neon rain falling on asphalt.' },
  { id: '5', title: 'Digital Skull', price: 1.50, imageUrl: 'https://picsum.photos/300/200?random=5', description: 'Rotating 3D wireframe skull.' }
];

// DEFAULT THEME OVERRIDES
const DEFAULT_THEME_OVERRIDES: ThemeOverrides = {
    dark: { text: '#ffffff', accent: '#06b6d4' }, // White text, Cyan accent
    light: { text: '#0f172a', accent: '#06b6d4' }, // Slate-900 text, Cyan accent
    autumn: { text: '#451a03', accent: '#f97316' } // Amber-950 text, Orange accent
};

// Helper for Tomorrow Morning
const getTomorrowMorning = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d.toISOString();
};

// DEFAULT SCHEDULED POSTS
const DEFAULT_POSTS: ScheduledPost[] = [
    {
        id: 'auto-insta-1',
        platform: 'instagram',
        content: "✨ Unbox the impossible. The VdM Glass Store is now live. Tap to explore the future of digital ownership. 📦💎 #VdM #NextGen #Retail",
        hashtags: ['#VdM', '#NextGen', '#Retail'],
        status: 'scheduled',
        scheduledTime: getTomorrowMorning()
    },
    // NEW POST HERE
    {
        id: 'auto-insta-2',
        platform: 'instagram',
        content: "🤖 Say hello to your new best employee. \n\nAIin5 doesn't sleep, doesn't take breaks, and sells to every customer who visits your site. \n\nUpgrade your VdM terminal today. #AIin5 #SalesBot #Automation #FutureOfCommerce",
        hashtags: ['#AIin5', '#SalesBot', '#Automation'],
        status: 'scheduled',
        scheduledTime: getTomorrowMorning()
    }
];

// Context Setup
const CartContext = createContext<CartContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

// Scroll To Top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Loading Spinner for Lazy Routes
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen w-full bg-black text-cyan-500">
    <div className="flex flex-col items-center gap-4">
      <Zap size={48} className="animate-pulse" />
      <p className="text-xs font-mono tracking-widest uppercase">Initializing Visual Core...</p>
    </div>
  </div>
);

// --- SAFE PARSE HELPER ---
const safeParse = <T,>(key: string, fallback: T): T => {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    try {
        return JSON.parse(saved);
    } catch (e) {
        console.warn(`[App] Data corruption detected in ${key}. Resetting to defaults to prevent crash.`);
        localStorage.removeItem(key); // Wipe the bad data
        return fallback;
    }
};

const App: React.FC = () => {
  // System Status State (Detached vs Active)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(() => 
      safeParse('gifos_system_status', 'active')
  );

  // System Mode State (Owner vs Client vs Brochure)
  const [systemMode, setSystemModeState] = useState<SystemMode>(() => 
      safeParse('gifos_system_mode', 'owner')
  );

  const setSystemMode = (mode: SystemMode) => {
      setSystemModeState(mode);
      localStorage.setItem('gifos_system_mode', mode);
  };

  // License Tier State
  const [licenseTier, setLicenseTierState] = useState<LicenseTier>(() => 
      safeParse('gifos_license_tier', 'enterprise')
  );

  const setLicenseTier = (tier: LicenseTier) => {
      setLicenseTierState(tier);
      localStorage.setItem('gifos_license_tier', tier);
  };

  // API Keys State
  const [apiKeys, setApiKeysState] = useState<ApiKeys>(() => {
    const savedKeys = safeParse<ApiKeys | null>('gifos_api_keys', null);
    if (savedKeys) return savedKeys;
    
    const status = safeParse('gifos_system_status', 'active');
    return status === 'active' ? MASTER_KEYS : EMPTY_KEYS;
  });

  // VPN State
  const [vpnConfig, setVpnConfig] = useState<VpnConfig>(() => 
      safeParse('gifos_vpn_config', {
          enabled: false,
          provider: 'custom',
          serverAddress: '',
          protocol: 'wireguard',
          status: 'disconnected'
      })
  );

  // Usage Metrics State
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics>(() => 
      safeParse('gifos_usage_metrics', {
          requests_1_5: 0,
          requests_2_5: 0,
          map_loads: 0,
          emails_sent: 0,
          storage_used_mb: 15, // Base usage
          last_reset: new Date().toISOString()
      })
  );

  const trackUsage = (type: '1.5' | '2.5' | 'map' | 'email' | 'storage', amount: number = 1) => {
      setUsageMetrics(prev => {
          const updated = { ...prev };
          if(type === '1.5') {
              updated.requests_1_5 += amount;
          } else if (type === '2.5') {
              updated.requests_2_5 += amount;
          } else if (type === 'map') {
              updated.map_loads += amount;
          } else if (type === 'email') {
              updated.emails_sent += amount;
          } else if (type === 'storage') {
              updated.storage_used_mb += amount;
          }
          localStorage.setItem('gifos_usage_metrics', JSON.stringify(updated));
          return updated;
      });
  };

  // Inventory State
  const [inventory, setInventory] = useState<GifItem[]>(() => 
      safeParse('gifos_inventory', DEFAULT_INVENTORY)
  );

  const addInventoryItem = (item: GifItem) => {
      setInventory(prev => {
          const updated = [...prev, item];
          localStorage.setItem('gifos_inventory', JSON.stringify(updated));
          return updated;
      });
  };

  const removeInventoryItem = (id: string) => {
      setInventory(prev => {
          const updated = prev.filter(i => i.id !== id);
          localStorage.setItem('gifos_inventory', JSON.stringify(updated));
          return updated;
      });
  };

  const updateInventoryItem = (id: string, updates: Partial<GifItem>) => {
      setInventory(prev => {
          const updated = prev.map(i => i.id === id ? { ...i, ...updates } : i);
          localStorage.setItem('gifos_inventory', JSON.stringify(updated));
          return updated;
      });
  };

  // Service Management State
  const [services, setServices] = useState<ExternalService[]>(() => 
      safeParse('gifos_services', DEFAULT_SERVICES)
  );

  const addService = (service: ExternalService) => {
      setServices(prev => {
          const updated = [...prev, service];
          localStorage.setItem('gifos_services', JSON.stringify(updated));
          return updated;
      });
  };

  const removeService = (id: string) => {
      setServices(prev => {
          const updated = prev.filter(s => s.id !== id);
          localStorage.setItem('gifos_services', JSON.stringify(updated));
          return updated;
      });
  };

  const updateService = (id: string, updates: Partial<ExternalService>) => {
      setServices(prev => {
          const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
          localStorage.setItem('gifos_services', JSON.stringify(updated));
          return updated;
      });
  };

  // Scheduled Posts State
  const [posts, setPosts] = useState<ScheduledPost[]>(() => 
      safeParse('gifos_posts', DEFAULT_POSTS)
  );

  const addPost = (post: ScheduledPost) => {
      setPosts(prev => {
          const updated = [...prev, post];
          localStorage.setItem('gifos_posts', JSON.stringify(updated));
          return updated;
      });
  };

  const updatePost = (id: string, updates: Partial<ScheduledPost>) => {
      setPosts(prev => {
          const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
          localStorage.setItem('gifos_posts', JSON.stringify(updated));
          return updated;
      });
  };

  const removePost = (id: string) => {
      setPosts(prev => {
          const updated = prev.filter(p => p.id !== id);
          localStorage.setItem('gifos_posts', JSON.stringify(updated));
          return updated;
      });
  };

  // Lead Management State
  const [leads, setLeads] = useState<Lead[]>(() => 
      safeParse('gifos_leads', [])
  );

  const addLead = (lead: Lead) => {
      setLeads(prev => {
          const updated = [lead, ...prev]; // Newest first
          localStorage.setItem('gifos_leads', JSON.stringify(updated));
          return updated;
      });
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
      setLeads(prev => {
          const updated = prev.map(l => l.id === id ? { ...l, status } : l);
          localStorage.setItem('gifos_leads', JSON.stringify(updated));
          return updated;
      });
  };

  // CRM Contacts State
  const [contacts, setContacts] = useState<CRMContact[]>(() => {
    const saved = safeParse<CRMContact[] | null>('gifos_contacts', null);
    if (saved) return saved;
    
    const scriptEl = document.getElementById('JSONbusiness_suite');
    if (scriptEl && scriptEl.textContent) {
        try {
            const data = JSON.parse(scriptEl.textContent);
            if (data.crm_operations && data.crm_operations.contacts) {
                return data.crm_operations.contacts.map((c: any, idx: number) => ({
                    id: `contact-${idx}`,
                    name: c.name,
                    phone: c.phone,
                    email: c.email,
                    platforms: c.platforms || [],
                    tags: c.tags || [],
                    lastInteraction: c.last_interaction,
                    properties: c.properties?.map((p: any, pIdx: number) => ({
                        id: `prop-${idx}-${pIdx}`,
                        address: p.address,
                        estimatedValue: p.estimated_value,
                        type: p.type,
                        tags: p.tags || [],
                        notes: p.notes
                    })) || [],
                    messages: c.messages?.map((m: any, mIdx: number) => ({
                        id: `msg-${idx}-${mIdx}`,
                        text: m.message_text,
                        schedule: m.schedule,
                        status: m.status
                    })) || [],
                    status: 'active',
                    notes: ''
                }));
            }
        } catch (e) { console.error("Error parsing CRM Seed", e); }
    }
    return [];
  });

  const addContact = (contact: CRMContact) => {
      setContacts(prev => {
          const updated = [contact, ...prev];
          localStorage.setItem('gifos_contacts', JSON.stringify(updated));
          return updated;
      });
  };

  const updateContact = (id: string, updates: Partial<CRMContact>) => {
      setContacts(prev => {
          const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
          localStorage.setItem('gifos_contacts', JSON.stringify(updated));
          return updated;
      });
  };

  const removeContact = (id: string) => {
      setContacts(prev => {
          const updated = prev.filter(c => c.id !== id);
          localStorage.setItem('gifos_contacts', JSON.stringify(updated));
          return updated;
      });
  };

  // --- ORG PROFILE (New) ---
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(() => {
      const saved = safeParse<OrgProfile | null>('gifos_org_profile', null);
      if (saved) return saved;

      const scriptEl = document.getElementById('JSONorg_profile');
      if (scriptEl && scriptEl.textContent) {
          try {
              return JSON.parse(scriptEl.textContent);
          } catch (e) { console.error("Error parsing Org Profile", e); }
      }
      return null;
  });

  const updateOrgProfile = (updates: Partial<OrgProfile>) => {
      setOrgProfile(prev => {
          if (!prev) return prev;
          const updated = { ...prev, ...updates };
          localStorage.setItem('gifos_org_profile', JSON.stringify(updated));
          return updated;
      });
  };

  // Check if we are running on Master Keys
  const isMasterMode = apiKeys.stripeKey === MASTER_KEYS.stripeKey;

  const setApiKeys = (keys: ApiKeys) => {
    setApiKeysState(keys);
    localStorage.setItem('gifos_api_keys', JSON.stringify(keys));
  };

  // Cart State
  const [items, setItems] = useState<GifItem[]>([]);
  const [hasMembership, setHasMembership] = useState(false);

  const addToCart = (item: GifItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleMembership = () => {
    setHasMembership(!hasMembership);
  };

  const total = items.reduce((acc, item) => acc + item.price, 0) + (hasMembership ? 20 : 0);

  // Auth State
  const [user, setUser] = useState<User | null>(() => 
      safeParse('gifos_user', null)
  );

  const login = (email: string) => {
    const newUser: User = { email, isVerified: false, isAdmin: email.includes('admin') };
    setUser(newUser);
    localStorage.setItem('gifos_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gifos_user');
  };

  const verifyEmail = () => {
    if (user) {
      const updated = { ...user, isVerified: true };
      setUser(updated);
      localStorage.setItem('gifos_user', JSON.stringify(updated));
    }
  };

  const markWelcomeSeen = () => {
      if (user) {
          const updated = { ...user, hasSeenWelcome: true };
          setUser(updated);
          localStorage.setItem('gifos_user', JSON.stringify(updated));
      }
  }

  // Settings State
  const [themeMode, setThemeMode] = useState<AppThemeMode>('dark');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Theme Overrides (Owner Colors)
  const [themeOverrides, setThemeOverridesState] = useState<ThemeOverrides>(() => 
      safeParse('gifos_theme_overrides', DEFAULT_THEME_OVERRIDES)
  );

  const setThemeOverrides = (overrides: ThemeOverrides) => {
      setThemeOverridesState(overrides);
      localStorage.setItem('gifos_theme_overrides', JSON.stringify(overrides));
  };

  // Promo Video
  const [promoVideo, setPromoVideoState] = useState<string>(() => {
      return localStorage.getItem('gifos_promo_video') || '';
  });

  const setPromoVideo = (url: string) => {
      setPromoVideoState(url);
      localStorage.setItem('gifos_promo_video', url);
  };

  // Accessibility State
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(() => {
      return localStorage.getItem('gifos_accessibility') === 'true';
  });

  const toggleAccessibilityMode = () => {
      setAccessibilityMode(prev => {
          const next = !prev;
          localStorage.setItem('gifos_accessibility', String(next));
          return next;
      });
  };

  // --- SEASONAL LOGIC ---
  const [decoration, setDecoration] = useState<AppDecoration>(() => {
      const now = new Date();
      const isPastHoliday = now.getMonth() >= 0 && now.getDate() >= 1 && now.getFullYear() >= 2024; 
      
      if (isPastHoliday) return 'neon'; 
      return 'christmas'; 
  });

  const [customThemeData, setCustomThemeData] = useState<any>(null);
  
  // LOGO STATE
  const [activeLogo, setActiveLogo] = useState<string | null>(() => {
      return localStorage.getItem('gifos_active_logo') || null;
  });

  const updateActiveLogo = (url: string | null) => {
      setActiveLogo(url);
      if(url) localStorage.setItem('gifos_active_logo', url);
      else localStorage.removeItem('gifos_active_logo');
  };

  // --- DYNAMIC FAVICON UPDATE ---
  useEffect(() => {
      const faviconLink = document.getElementById('dynamic-favicon') as HTMLLinkElement;
      if (faviconLink && activeLogo) {
          faviconLink.href = activeLogo;
      } else if (faviconLink) {
          // Default Icon if none set
          faviconLink.href = "https://cdn-icons-png.flaticon.com/512/1179/1179069.png";
      }
  }, [activeLogo]);

  // New Profile Settings
  const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem('gifos_profile_img'));
  const [profilePosition, setProfilePosition] = useState<{ x: number; y: number }>(() => 
      safeParse('gifos_profile_pos', { x: 20, y: 100 })
  );

  const toggleMotion = () => setReduceMotion(!reduceMotion);
  const toggleSound = () => setSoundEnabled(!soundEnabled);

  // Bot & Admin Settings
  const [botConfig, setBotConfig] = useState<BotConfig>(() => 
      safeParse('gifos_bot_config', { 
          provider: 'google', 
          apiKey: '', 
          modelName: 'gemini-2.5-flash', 
          systemInstruction: 'You are SEP, a helpful AI assistant for the GIF.OS platform.',
          temperature: 0.7,
          ollamaUrl: 'http://localhost:11434/api/generate' // Default Ollama
      })
  );

  const [welcomeMessage, setWelcomeMessage] = useState<string>(() => {
      return localStorage.getItem('gifos_welcome_msg') || "Welcome to GIF.OS! \n\nWe are thrilled to have you in our visual ecosystem. Explore, create, and share.";
  });

  // Device Management State
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);

  const addDevice = (device: ConnectedDevice) => {
      setDevices(prev => [...prev, device]);
  };

  const removeDevice = (id: string) => {
      setDevices(prev => prev.filter(d => d.id !== id));
  };

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // --- SYSTEM DETACH PROTOCOL (The "Wash Hands" Function) ---
  const detachSystem = () => {
    console.log("System Detach Initiated: Wiping all VdM Data");
    
    // 1. Dynamic Wipe of ALL VdM Data (Everything with gifos_ prefix)
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('gifos_')) {
            localStorage.removeItem(key);
        }
    });

    // 2. Hard Reset States to Defaults/Empty
    setApiKeysState(EMPTY_KEYS);
    setVpnConfig({ enabled: false, provider: 'custom', serverAddress: '', protocol: 'wireguard', status: 'disconnected' });
    setServices(DEFAULT_SERVICES); // Restore factory default services
    setSystemStatus('detached');
    setSystemMode('owner'); // Default to owner logic for re-setup
    setInventory(DEFAULT_INVENTORY); // Reset Inventory to default
    setPosts(DEFAULT_POSTS); // Reset Posts to DEFAULTS
    setLeads([]); // Reset Leads
    setContacts([]); // Reset Contacts
    updateActiveLogo(null); // Reset Logo
    setThemeOverrides(DEFAULT_THEME_OVERRIDES); // Reset Theme
    setPromoVideo(''); // Reset Video
    setAccessibilityMode(false);
    setOrgProfile(null); // Reset Org Profile
    setUsageMetrics({ requests_1_5: 0, requests_2_5: 0, map_loads: 0, emails_sent: 0, storage_used_mb: 15, last_reset: new Date().toISOString() }); // Reset Usage
    
    localStorage.setItem('gifos_system_status', 'detached'); // Manually ensure status is detached
    
    // 3. Clear Session Data
    setUser(null);
    setProfileImage(null);
    setDevices([]);
    setItems([]);
  };

  const completeSetup = (phone: string, adminPass: string, vpn: VpnConfig, tier: LicenseTier, mode: SystemMode = 'owner') => {
      // 1. Initialize with new Defaults for NEW OWNER
      setSystemStatus('active');
      setSystemMode(mode);
      localStorage.setItem('gifos_system_status', 'active');
      localStorage.setItem('gifos_system_mode', mode);
      localStorage.setItem('gifos_owner_phone', phone);
      
      // 2. Save VPN
      setVpnConfig(vpn);
      localStorage.setItem('gifos_vpn_config', JSON.stringify(vpn));

      // 3. Set License Tier
      setLicenseTier(tier);
      localStorage.setItem('gifos_license_tier', tier);
  };

  return (
    <ErrorBoundary>
        <SettingsContext.Provider value={{
        themeMode, setThemeMode,
        systemMode, setSystemMode, // NEW
        themeOverrides, setThemeOverrides,
        reduceMotion, toggleMotion,
        soundEnabled, toggleSound,
        decoration, setDecoration,
        customThemeData, setCustomThemeData,
        activeLogo, setActiveLogo: updateActiveLogo,
        promoVideo, setPromoVideo,
        accessibilityMode, toggleAccessibilityMode,
        profileImage, setProfileImage,
        profilePosition, setProfilePosition,
        botConfig, setBotConfig,
        welcomeMessage, setWelcomeMessage,
        devices, addDevice, removeDevice,
        deferredPrompt, installApp,
        systemStatus, licenseTier, setLicenseTier, detachSystem, completeSetup,
        apiKeys, setApiKeys, isMasterMode,
        vpnConfig, setVpnConfig,
        services, addService, removeService, updateService,
        inventory, addInventoryItem, removeInventoryItem,
        updateInventoryItem, // ADDED HERE
        posts, addPost, updatePost, removePost,
        leads, addLead, updateLeadStatus,
        contacts, addContact, updateContact, removeContact,
        orgProfile, updateOrgProfile,
        usageMetrics, trackUsage
        }}>
        <AuthContext.Provider value={{ user, login, logout, verifyEmail, markWelcomeSeen }}>
            <CartContext.Provider value={{ items, addToCart, removeFromCart, hasMembership, toggleMembership, total }}>
            <HashRouter>
                <ScrollToTop />
                <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    {/* PUBLIC ROUTES */}
                    <Route path="/" element={user ? <Navigate to="/shop" /> : <Auth />} />
                    
                    {/* PROTECTED ROUTES */}
                    <Route path="/shop" element={user ? <GifSelection /> : <Navigate to="/" />} />
                    <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/" />} />
                    <Route path="/wrapping" element={user ? <WrappingLab /> : <Navigate to="/" />} />
                    <Route path="/delivery" element={user ? <Delivery /> : <Navigate to="/" />} />
                    <Route path="/final" element={user ? <FinalPromo /> : <Navigate to="/" />} />
                    
                    {/* Correctly using top-level lazy components */}
                    <Route path="/pay" element={user ? <PayNow /> : <Navigate to="/" />} />
                    <Route path="/orbit" element={user ? <OrbitReview /> : <Navigate to="/" />} />
                    <Route path="/customize" element={user ? <CustomizationHub /> : <Navigate to="/" />} />
                    
                    {/* CLIENT & RECEIVER PORTALS */}
                    <Route path="/receiver/booking" element={<ReceiverBooking />} />
                    <Route path="/session" element={<LiveSession />} />
                    <Route path="/member-calendar" element={user ? <ClientBooking /> : <Navigate to="/" />} />

                    {/* ADMIN & WORKSTATION ROUTES */}
                    <Route path="/admin" element={
                        systemStatus === 'detached' ? <SystemSetup /> : (user ? <AdminDashboard /> : <Navigate to="/" />)
                    } />
                    <Route path="/workstation" element={user ? <Workstation /> : <Navigate to="/" />} />
                    <Route path="/logout" element={<Logout />} />

                </Routes>
                </Suspense>
            </HashRouter>
            </CartContext.Provider>
        </AuthContext.Provider>
        </SettingsContext.Provider>
    </ErrorBoundary>
  );
};

export default App;
