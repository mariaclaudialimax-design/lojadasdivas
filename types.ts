
export type Size = 'PPP' | 'PP' | 'P' | 'M' | 'G' | 'GG' | '3G' | '4G' | '5G';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface ProductVariant {
  size: Size;
  price: number;
  compareAtPrice: number;
  sku: string;
}

export interface Product {
  id: string;
  externalId?: string; // ID específico para integração com checkout/tracking (ex: ID da Yampi/Cartpanda)
  handle: string;
  title: string;
  description: string;
  category: string;
  price: number;
  oldPrice: number;
  images: string[];
  sizes: Size[];
  installments: string;
  isKit: boolean; // True for the Ibiza Kit special logic
  checkoutUrl?: string; // Optional direct checkout URL
  variantUrls?: Record<string, string>; // Maps Size to Checkout URL
  active?: boolean; // New: for admin control
}

export interface CartItem {
  product: Product;
  size: Size;
  colors?: string[]; // Only for kits
  quantity: number;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  timeAgo: string;
  verified: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ShippingOption {
  id: 'correios' | 'jadlog' | 'loggi';
  name: string;
  price: number;
  days: string;
  logo: string;
}

// Added 'admin' to page views
export type PageView = 'home' | 'product' | 'category' | 'info' | 'thank_you' | 'admin';

// Admin Sub-views
export type AdminView = 'login' | 'dashboard' | 'products' | 'cms' | 'orders';

export type InfoPageType = 
  | 'trust' 
  | 'about' 
  | 'exchanges' 
  | 'tracking' 
  | 'privacy' 
  | 'shipping' 
  | 'refund' 
  | 'legal' 
  | 'terms' 
  | 'contact';

export type LegalPage = 'tracking' | 'returns' | 'privacy' | 'terms';

// --- NEW TYPES FOR BACKEND & TRACKING ---

export interface Order {
    id: string;
    externalId?: string;
    customer: string;
    email?: string;
    total: number;
    status: 'paid' | 'pending' | 'shipped';
    date: string;
    items?: any[];
    trackingCode?: string;
}

export interface TrackingEvent {
    eventName: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
    eventId?: string; // Critical for deduplication
    products?: Product[];
    value?: number;
    currency?: string;
    contentIds?: string[];
}

// Global Declaration
declare global {
  interface Window {
    YQV5: any; // For tracking script
    pixelId: string; // UTMify
    fbq?: any; // Facebook Pixel
  }
}
