
export interface GifItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  isSpecialPanel?: boolean;
}

export type AnimationStyle = 'Quantum Fold' | 'Gravity Spin' | 'Hologram Bloom' | 'Crystal Pulse';

export interface User {
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  hasSeenWelcome?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  verifyEmail: () => void;
  markWelcomeSeen: () => void;
}

export interface CartContextType {
  items: GifItem[];
  addToCart: (item: GifItem) => void;
  removeFromCart: (id: string) => void;
  hasMembership: boolean;
  toggleMembership: () => void;
  total: number;
}

export type AppThemeMode = 'dark' | 'light' | 'autumn';
export type LicenseTier = 'starter' | 'enterprise' | 'personal-ai' | 'estate'; 
export type SystemMode = 'owner' | 'client' | 'brochure'; 

export type AppDecoration = 
  | 'neon' 
  | 'gold' 
  | 'frost' 
  | 'black-friday' 
  | 'christmas' 
  | 'new-year'
  | 'valentines' 
  | 'halloween' 
  | 'independence' 
  | 'lunar-new-year' 
  | 'singles-day'
  | 'custom';

export interface BotConfig {
  provider: 'google' | 'custom' | 'ollama'; 
  apiKey: string;
  modelName: string; 
  systemInstruction: string;
  temperature: number;
  ollamaUrl?: string; 
}

// API USAGE METRICS (UPDATED FOR DUAL MODELS)
export interface UsageMetrics {
    requests_1_5: number; // Track 1.5 Flash
    requests_2_5: number; // Track 2.5 Flash
    map_loads: number;
    emails_sent: number;
    storage_used_mb: number;
    last_reset: string; // ISO Date
}

export interface Lead {
    id: string;
    name: string;
    contact: string; 
    source: string;
    type: 'service' | 'sales' | 'general'; 
    status: 'new' | 'contacted' | 'closed';
    timestamp: string;
    summary: string;
}

export interface CRMProperty {
  id: string;
  address: string;
  estimatedValue: number;
  type: string;
  tags: string[];
  notes: string;
}

export interface CRMMessage {
  id: string;
  text: string;
  schedule: string; 
  status: 'pending' | 'sent';
  platform?: 'sms' | 'whatsapp' | 'gvoice' | 'telegram'; 
}

export interface CRMContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  platforms: string[]; 
  tags: string[];
  lastInteraction: string; 
  properties: CRMProperty[];
  messages: CRMMessage[];
  status: 'lead' | 'active' | 'churned';
  notes: string;
}

export interface OrgProfile {
  identity: {
    display_name: string;
    legal_name: string;
    structure: string;
    jurisdiction: string;
    founded: string;
    tax_id_type: string;
  };
  contact: {
    support_email: string;
    sales_email: string;
    phone_primary: string;
    website: string;
  };
  location: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    zip: string;
    coordinates: { lat: number; lng: number };
    is_residential: boolean; 
    hide_on_site: boolean;   
  };
  socials: {
    instagram: string;
    linkedin: string;
    tiktok: string;
  };
  policies: {
    currency: string;
    payment_methods: string[];
    cancellation_policy: string;
    manual_payment_active?: boolean; // NEW
    manual_payment_instruction?: string; // NEW: Zelle, Venmo, Wire instructions
  };
  accounts?: {
      instagram_connected: boolean;
      linkedin_connected: boolean;
      tiktok_connected: boolean;
  }
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'camera' | 'mic' | 'speaker' | 'keyboard' | 'mobile' | 'display';
  connection: 'bluetooth' | 'usb' | 'wifi' | 'p2p';
  status: 'connected' | 'pairing' | 'error';
  battery?: number;
}

export type SystemStatus = 'active' | 'detached';

export interface ApiKeys {
  masterNexusKey: string; 
  paypalClientId: string;
  stripeKey: string;
  vercelToken: string;
  supabaseUrl: string;
  supabaseKey: string;
  googleGemini: string;
  googleAds: string;
  backupGeminiKeys: string[]; // NEW: Array for backup keys
}

export interface VpnConfig {
  enabled: boolean;
  provider: 'custom' | 'nord' | 'express' | 'private_internet_access';
  serverAddress: string;
  protocol: 'wireguard' | 'openvpn';
  status: 'connected' | 'disconnected' | 'connecting';
}

export interface ExternalService {
  id: string;
  name: string;
  provider: string; 
  type: 'ai' | 'hosting' | 'database' | 'storage' | 'marketing' | 'custom';
  status: 'active' | 'inactive' | 'error' | 'connecting';
  apiKey?: string;
  endpoint?: string;
  icon?: string; 
}

export interface ThemeOverrides {
    dark: { text: string; accent: string };
    light: { text: string; accent: string };
    autumn: { text: string; accent: string };
}

export interface ScheduledPost {
  id: string;
  platform: 'tiktok' | 'linkedin' | 'instagram' | 'twitter' | 'youtube';
  content: string;
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'posted';
  scheduledTime: string; 
  image?: string;
}

export interface SettingsContextType {
  themeMode: AppThemeMode;
  setThemeMode: (mode: AppThemeMode) => void;
  
  systemMode: SystemMode;
  setSystemMode: (mode: SystemMode) => void;

  themeOverrides: ThemeOverrides;
  setThemeOverrides: (overrides: ThemeOverrides) => void;

  reduceMotion: boolean;
  toggleMotion: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  decoration: AppDecoration;
  setDecoration: (dec: AppDecoration) => void;
  customThemeData: any;
  setCustomThemeData: (data: any) => void;
  activeLogo: string | null;
  setActiveLogo: (url: string | null) => void;
  
  promoVideo: string;
  setPromoVideo: (url: string) => void;

  accessibilityMode: boolean;
  toggleAccessibilityMode: () => void;

  profileImage: string | null;
  setProfileImage: (url: string | null) => void;
  profilePosition: { x: number; y: number };
  setProfilePosition: (pos: { x: number; y: number }) => void;

  botConfig: BotConfig;
  setBotConfig: (config: BotConfig) => void;
  welcomeMessage: string;
  setWelcomeMessage: (msg: string) => void;

  devices: ConnectedDevice[];
  addDevice: (device: ConnectedDevice) => void;
  removeDevice: (id: string) => void;

  deferredPrompt: any;
  installApp: () => void;

  systemStatus: SystemStatus;
  licenseTier: LicenseTier;
  setLicenseTier: (tier: LicenseTier) => void; 
  detachSystem: () => void;
  completeSetup: (phone: string, adminPass: string, vpn: VpnConfig, tier: LicenseTier, mode?: SystemMode) => void;
  
  apiKeys: ApiKeys;
  setApiKeys: (keys: ApiKeys) => void;
  isMasterMode: boolean;

  vpnConfig: VpnConfig;
  setVpnConfig: (config: VpnConfig) => void;

  services: ExternalService[];
  addService: (service: ExternalService) => void;
  removeService: (id: string) => void;
  updateService: (id: string, updates: Partial<ExternalService>) => void;

  inventory: GifItem[];
  addInventoryItem: (item: GifItem) => void;
  removeInventoryItem: (id: string) => void;
  updateInventoryItem: (id: string, updates: Partial<GifItem>) => void;

  posts: ScheduledPost[];
  addPost: (post: ScheduledPost) => void;
  updatePost: (id: string, updates: Partial<ScheduledPost>) => void;
  removePost: (id: string) => void;

  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;

  contacts: CRMContact[];
  addContact: (contact: CRMContact) => void;
  updateContact: (id: string, updates: Partial<CRMContact>) => void;
  removeContact: (id: string) => void;

  orgProfile: OrgProfile | null;
  updateOrgProfile: (updates: Partial<OrgProfile>) => void;

  // NEW: Usage Tracker with Model Specifics
  usageMetrics: UsageMetrics;
  trackUsage: (type: '1.5' | '2.5' | 'map' | 'email' | 'storage', amount?: number) => void;
}
