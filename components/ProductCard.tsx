import React from 'react';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';
import { trackViewContent } from '../utils/tracking';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  const handleClick = () => {
    trackViewContent(product);
    onClick(product);
  };

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-3">
        {/* Image */}
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm">
            -{discount}% OFF
          </div>
        )}

        {/* Quick Add Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
            <button className="w-full bg-white/90 backdrop-blur-sm text-gray-900 font-bold py-3 rounded-lg shadow-lg hover:bg-white flex items-center justify-center gap-2 text-sm">
                <ShoppingBag size={16} /> VER DETALHES
            </button>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-sm text-gray-700 font-medium line-clamp-2 leading-snug mb-1 group-hover:text-rose-700 transition-colors">
          {product.title}
        </h3>
        
        <div className="mt-auto">
          <p className="text-xs text-gray-400 line-through">R$ {product.oldPrice.toFixed(2).replace('.', ',')}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-900">R$ {Math.floor(product.price)}</span>
            <span className="text-[10px] font-bold text-gray-900">,{(product.price % 1).toFixed(2).substring(2)}</span>
          </div>
          <p className="text-[10px] text-green-600 font-medium mt-0.5">{product.installments}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;