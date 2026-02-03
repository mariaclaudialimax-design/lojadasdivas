
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { supabase } from './supabase';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- PRODUCTS ---

export const fetchAdminProducts = async (): Promise<Product[]> => {
  if (supabase) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error("Supabase Fetch Error:", error);
        return PRODUCTS; // Fallback to avoid breaking admin if table empty
    }
    
    // If DB is empty, return static so it doesn't look broken initially
    if (!data || data.length === 0) return PRODUCTS;

    return data.map(d => ({
        ...d,
        oldPrice: d.old_price, // map snake_case to camelCase
        isKit: d.is_kit,
        checkoutUrl: d.checkout_url,
        variantUrls: d.variant_urls
    })) as Product[];
  }
  
  // Local Mock
  const local = localStorage.getItem('admin_products');
  if (local) return JSON.parse(local);
  return PRODUCTS;
};

export const saveProduct = async (product: Product): Promise<void> => {
  if (supabase) {
    // Map to snake_case for DB
    const dbPayload = {
        id: product.id,
        handle: product.handle,
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        old_price: product.oldPrice,
        images: product.images,
        sizes: product.sizes,
        is_kit: product.isKit,
        checkout_url: product.checkoutUrl,
        variant_urls: product.variantUrls,
        active: product.active ?? true
    };

    const { error } = await supabase.from('products').upsert(dbPayload);
    if (error) throw error;
    return;
  }

  // Local Mock
  await delay(500);
  const current = await fetchAdminProducts();
  const index = current.findIndex(p => p.id === product.id);
  let updated = [...current];
  
  if (index >= 0) {
    updated[index] = product;
  } else {
    updated = [product, ...updated];
  }
  localStorage.setItem('admin_products', JSON.stringify(updated));
};

export const deleteProduct = async (id: string): Promise<void> => {
    if (supabase) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return;
    }

    // Local Mock
    await delay(300);
    const current = await fetchAdminProducts();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem('admin_products', JSON.stringify(updated));
}

// --- ORDERS ---

export interface Order {
    id: string;
    customer: string;
    total: number;
    status: 'paid' | 'pending' | 'shipped';
    date: string;
}

export const fetchRecentOrders = async (): Promise<Order[]> => {
    if (supabase) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (!error && data) {
            return data.map(o => ({
                id: o.external_id || o.id.substring(0,8),
                customer: o.customer_name || 'Cliente',
                total: o.total_price,
                status: o.status as any,
                date: new Date(o.created_at).toLocaleDateString('pt-BR')
            }));
        }
    }

    // Mock Data
    return [
        { id: '#10234', customer: 'Maria Silva', total: 109.90, status: 'paid', date: 'Hoje' },
        { id: '#10233', customer: 'Joana Dark', total: 299.70, status: 'shipped', date: 'Ontem' },
        { id: '#10232', customer: 'Fernanda Lima', total: 99.90, status: 'pending', date: 'Ontem' }
    ];
};
