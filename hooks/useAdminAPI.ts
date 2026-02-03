import { useState, useCallback } from 'react';
import { Product, Category, Page } from '../types';

export function useAdminAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    return sessionStorage.getItem('admin_token');
  };

  // PRODUCTS
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/products-list');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (product: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/.netlify/functions/products-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (productId: string, updates: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/.netlify/functions/products-detail?id=${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update product');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/.netlify/functions/products-detail?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // CATEGORIES
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (category: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/.netlify/functions/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create category');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // PAGES
  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/pages');
      if (!response.ok) throw new Error('Failed to fetch pages');
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createPage = useCallback(async (page: Partial<Page>) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/.netlify/functions/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(page),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create page');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // HOME SECTIONS
  const fetchHomeSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/home-sections');
      if (!response.ok) throw new Error('Failed to fetch home sections');
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHomeSection = useCallback(async (sectionId: string, updates: any) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/.netlify/functions/home-sections?id=${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update home section');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // INVENTORY
  const fetchInventoryLogs = useCallback(async (productId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const query = productId ? `?productId=${productId}` : '';
      const response = await fetch(`/.netlify/functions/inventory${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch inventory logs');
      const data = await response.json();
      return data.logs;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createInventoryLog = useCallback(async (productId: string, quantity: number, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/.netlify/functions/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
          reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create inventory log');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // COUPONS
  const fetchCoupons = useCallback(async (active?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const query = active !== undefined ? `?active=${active}` : '';
      const response = await fetch(`/.netlify/functions/coupons${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch coupons');
      const data = await response.json();
      return data.coupons;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCoupon = useCallback(async (coupon: any) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/.netlify/functions/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(coupon),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create coupon');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoupon = useCallback(async (couponId: string, updates: any) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/.netlify/functions/coupons?id=${couponId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update coupon');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCoupon = useCallback(async (couponId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/.netlify/functions/coupons?id=${couponId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete coupon');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    // Products
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Categories
    fetchCategories,
    createCategory,
    // Pages
    fetchPages,
    createPage,
    // Home Sections
    fetchHomeSections,
    updateHomeSection,
    // Inventory
    fetchInventoryLogs,
    createInventoryLog,
    // Coupons
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  };
}
