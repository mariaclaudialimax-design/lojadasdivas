import { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products'; // Fallback

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/.netlify/functions/products');
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Map database fields to Product interface (snake_case to camelCase)
        const mappedProducts = Array.isArray(data) ? data.map((p: any) => ({
          id: p.id,
          handle: p.handle,
          title: p.title,
          description: p.description,
          category: p.category,
          price: p.price,
          oldPrice: p.old_price || p.oldPrice,
          images: p.images,
          sizes: p.sizes,
          installments: p.installments,
          isKit: p.is_kit || p.isKit,
          variantUrls: p.variant_urls || p.variantUrls,
          checkoutUrl: p.checkout_url || p.checkoutUrl,
          externalId: p.external_id || p.externalId,
          active: p.active !== false
        })) : PRODUCTS;

        setProducts(mappedProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        // Fallback to local data on error
        setProducts(PRODUCTS);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
