import React from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  currentProduct: Product;
  onProductClick: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, onProductClick }) => {
  // Logic: 
  // 1. Filter out the current product
  // 2. Prioritize products from the same category
  // 3. Fill the rest with other products
  // 4. Limit to 4 items
  
  const sameCategory = PRODUCTS.filter(
    p => p.category === currentProduct.category && p.id !== currentProduct.id
  );
  
  const otherCategories = PRODUCTS.filter(
    p => p.category !== currentProduct.category && p.id !== currentProduct.id
  );

  const recommendations = [...sameCategory, ...otherCategories].slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <section className="py-12 px-4 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-serif text-gray-900 mb-8 flex items-center gap-2">
            <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
            Você também pode gostar
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {recommendations.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onClick={(p) => {
                    // Smooth scroll to top when clicking a related product
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onProductClick(p);
                }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;