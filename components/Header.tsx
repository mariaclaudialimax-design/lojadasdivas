import React, { useState } from 'react';
import { Menu, X, Package, ShoppingBag, Home, Search, RefreshCw } from 'lucide-react';
import { LegalPage } from '../types';

interface HeaderProps {
  onOpenLegal: (page: LegalPage) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (categoryId: string) => void;
  cartCount?: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenLegal, 
  onNavigateHome, 
  onNavigateCategory, 
  cartCount = 0, 
  onOpenCart,
  onOpenSearch
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (page: LegalPage) => {
    onOpenLegal(page);
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    onNavigateHome();
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (catId: string) => {
    onNavigateCategory(catId);
    setIsMenuOpen(false);
  }

  return (
    // Alteração: z-index alterado de 40 para 50 para garantir sobreposição correta
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* LEFT SECTION: Navigation / Menu */}
          <div className="flex-1 flex justify-start items-center">
            {/* Mobile Hamburger (Left) */}
            <div className="flex items-center md:hidden">
                <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -ml-2 rounded-md text-gray-700 hover:text-rose-600 focus:outline-none"
                aria-label="Menu principal"
                >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Desktop Navigation (Left) */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                <button onClick={onNavigateHome} className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors uppercase tracking-wide">
                Home
                </button>
                <button onClick={() => onNavigateCategory('kits')} className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors uppercase tracking-wide">
                Kits
                </button>
                <button onClick={() => onNavigateCategory('conjuntos')} className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors uppercase tracking-wide">
                Conjuntos
                </button>
                <button onClick={() => onNavigateCategory('vestidos')} className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors uppercase tracking-wide">
                Vestidos
                </button>
            </nav>
          </div>

          {/* CENTER SECTION: Logo */}
          <div className="flex-shrink-0 flex justify-center cursor-pointer absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none md:flex-1 md:px-4" onClick={onNavigateHome}>
            {/* Logo Size Adjusted: h-12 mobile (restored), h-14 desktop (balanced) */}
            <img 
              className="h-12 md:h-14 w-auto object-contain transition-transform hover:scale-105" 
              src="https://cdn.shopify.com/s/files/1/0773/0148/1696/files/Design_sem_nome.pngSS.png?v=1770077794" 
              alt="Loja das Divas" 
            />
          </div>

          {/* RIGHT SECTION: Icons (Search & Cart) */}
          <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
             {/* Search Button */}
             <button 
                onClick={onOpenSearch}
                className="p-2 text-gray-700 hover:text-rose-600 transition-colors rounded-full hover:bg-gray-50"
                aria-label="Buscar"
             >
                <Search size={22} strokeWidth={2} />
             </button>

             {/* Cart Button */}
             <button 
                onClick={onOpenCart}
                className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors rounded-full hover:bg-gray-50 group"
                aria-label="Carrinho"
             >
                <ShoppingBag size={22} strokeWidth={2} />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                        {cartCount}
                    </span>
                )}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-in slide-in-from-top-5 z-50 md:hidden">
          <div className="px-4 py-6 space-y-4">
            <button 
                onClick={handleHomeClick}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left text-gray-800 font-medium"
            >
                <div className="bg-gray-100 p-2 rounded-full text-gray-700"><Home size={20} /></div>
                Início
            </button>

            <button 
                onClick={() => handleCategoryClick('kits')}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left text-gray-800 font-medium"
            >
                <div className="bg-rose-50 p-2 rounded-full text-rose-700"><ShoppingBag size={20} /></div>
                Kits Promocionais
            </button>

            <button 
                onClick={() => handleCategoryClick('conjuntos')}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left text-gray-800 font-medium"
            >
                <div className="bg-rose-50 p-2 rounded-full text-rose-700"><ShoppingBag size={20} /></div>
                Conjuntos
            </button>

             <button 
                onClick={() => handleCategoryClick('vestidos')}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left text-gray-800 font-medium"
            >
                <div className="bg-rose-50 p-2 rounded-full text-rose-700"><ShoppingBag size={20} /></div>
                Vestidos
            </button>

            <button 
                onClick={() => handleLinkClick('tracking')}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left text-gray-800 font-medium"
            >
                <div className="bg-green-100 p-2 rounded-full text-green-700"><Package size={20} /></div>
                Rastrear Pedido
            </button>

            <button 
                onClick={() => handleLinkClick('returns')}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left text-gray-800 font-medium"
            >
                <div className="bg-blue-100 p-2 rounded-full text-blue-700"><RefreshCw size={20} /></div>
                Trocas e Devoluções
            </button>
            
            <div className="pt-4 border-t border-gray-100 text-center">
                 <p className="text-xs text-gray-400">Loja das Divas © 2026</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;