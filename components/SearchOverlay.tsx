import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onProductClick }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const filteredProducts = query.trim() === '' 
    ? [] 
    : PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-12 h-full flex flex-col">
        
        {/* Header Search Bar */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
            <Search className="text-gray-400 shrink-0" size={28} />
            <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos..." 
                className="w-full text-2xl md:text-3xl font-light bg-transparent outline-none placeholder:text-gray-300 text-gray-900"
            />
            <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
                <X size={28} />
            </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto py-8">
            {query.trim() === '' ? (
                <div className="text-center text-gray-400 mt-12">
                    <p>Digite para buscar...</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        <span className="text-xs font-bold uppercase text-gray-300 w-full mb-2">Populares</span>
                        {['Kit Ibiza', 'Vestido', 'Conjunto', 'Linho'].map(term => (
                            <button 
                                key={term}
                                onClick={() => setQuery(term)}
                                className="px-4 py-2 bg-gray-50 rounded-full text-sm hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="col-span-full text-xs font-bold uppercase text-gray-400 mb-2">
                        {filteredProducts.length} Resultados encontrados
                    </p>
                    {filteredProducts.map(product => (
                        <div 
                            key={product.id}
                            onClick={() => {
                                onProductClick(product);
                                onClose();
                            }}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100"
                        >
                            <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">{product.title}</h4>
                                <p className="text-sm text-gray-500">{product.category}</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-sm font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                                    {product.oldPrice > product.price && (
                                        <span className="text-xs text-gray-400 line-through">R$ {product.oldPrice.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-rose-400" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-12">
                    <p>Nenhum produto encontrado para "{query}".</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SearchOverlay;