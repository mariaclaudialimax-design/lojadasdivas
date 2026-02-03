
export type Size = 'PPP' | 'PP' | 'P' | 'M' | 'G' | 'GG' | '3G' | '4G' | '5G';
export type PageView = 'home' | 'product' | 'category' | 'info' | 'thank_you' | 'admin' | 'signup';
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
  | 'contact'
  | 'sobre' | 'trocas' | 'politica' | 'faq'; // Keeping old ones for compatibility

export type AdminView = 'login' | 'dashboard' | 'products' | 'categories' | 'home' | 'cms' | 'pages' | 'orders' | 'inventory' | 'coupons' | 'settings' | 'signup';

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
  externalId?: string;
  handle: string;
  title: string;
  description: string;
  category?: string;
  categoryId?: string;
  price: number;
  oldPrice?: number;
  compareAtPrice?: number;
  sku?: string;
  stock?: number;
  images: string[];
  sizes?: Size[];
  installments?: string;
  isKit?: boolean;
  checkoutUrl?: string;
  variantUrls?: Record<string, string>;
  active?: boolean;
  status?: 'active' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  size: Size;
  colors?: string[];
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  orderPosition: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  externalId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'refunded' | 'canceled';
  items: any[];
  trackingCode?: string;
  eventId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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

export type LegalPage = 'tracking' | 'returns' | 'privacy' | 'terms';

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
