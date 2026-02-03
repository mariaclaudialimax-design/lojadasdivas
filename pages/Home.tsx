import React from 'react';
import { Product } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Star } from 'lucide-react';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onCategoryClick: (categoryId: string) => void;
}

const Home: React.FC<HomeProps> = ({ onProductClick, onCategoryClick }) => {
  return (
    <div className="pb-12">
      {/* Main Hero Banner - Responsive */}
      <section className="relative w-full cursor-pointer group overflow-hidden">
        {/* Mobile Image */}
        <img 
          src="https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480" 
          alt="Nova Coleção Ibiza" 
          className="w-full h-auto object-cover md:hidden min-h-[500px]"
          onClick={() => {
             const kit = PRODUCTS.find(p => p.isKit);
             if (kit) onProductClick(kit);
          }}
        />
        
        {/* Desktop Image - High Quality */}
        <img 
          src="https://cdn.shopify.com/s/files/1/0773/0148/1696/files/bannerdesktopibiza-698133c8acf7c.webp?v=1770075089" 
          alt="Nova Coleção Ibiza Desktop" 
          className="hidden md:block w-full h-auto object-cover"
          onClick={() => {
             const kit = PRODUCTS.find(p => p.isKit);
             if (kit) onProductClick(kit);
          }}
        />

        {/* Text Overlay - Restored */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none flex items-end md:items-center pb-12 md:pb-0">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-lg text-white md:pl-12 pointer-events-auto animate-in slide-in-from-left-10 duration-700">
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block shadow-lg">
                        Lançamento 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif mb-4 leading-tight drop-shadow-lg">
                        Coleção <br/><span className="italic font-light text-rose-200">Ibiza</span>
                    </h1>
                    <p className="text-gray-100 text-sm md:text-lg mb-8 max-w-sm leading-relaxed drop-shadow-md">
                        A elegância do linho com o conforto do algodão. Peças que não amassam para você brilhar.
                    </p>
                    <button 
                        className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-rose-50 transition-colors inline-flex items-center gap-2 shadow-xl"
                        onClick={() => {
                            const kit = PRODUCTS.find(p => p.isKit);
                            if (kit) onProductClick(kit);
                        }}
                    >
                        VER COLEÇÃO <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
                Navegue por Categoria
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <div 
                        key={cat.id} 
                        onClick={() => onCategoryClick(cat.id)}
                        className="flex-shrink-0 w-28 md:w-40 flex flex-col items-center gap-3 group cursor-pointer"
                    >
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-rose-300 transition-all shadow-md">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-rose-600 text-center">{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Highlight Product (The Kit) */}
      <section className="py-12 bg-rose-50/50 border-y border-rose-100">
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div 
                className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                onClick={() => {
                    const kit = PRODUCTS.find(p => p.isKit);
                    if (kit) onProductClick(kit);
                }}
            >
                 <img src="https://cdn.shopify.com/s/files/1/0773/0148/1696/files/kitfavorito-698145394d8e9.webp?v=1770079574" alt="Kit Camisas" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-900 font-bold px-3 py-1 rounded-lg text-xs shadow-sm flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" /> Mais Vendido
                 </div>
            </div>
            <div className="md:pl-8">
                <h2 className="text-3xl font-serif text-gray-900 mb-4">O Kit Queridinho do Brasil</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Mais de 15.000 unidades vendidas. O Kit de Camisas Ibiza une versatilidade e economia. Leve 3 peças pagando preço de atacado.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-gray-700">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Tecido que não amassa</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Modelagem que não marca</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Frete Grátis hoje</li>
                </ul>
                <button 
                    onClick={() => {
                        const kit = PRODUCTS.find(p => p.isKit);
                        if (kit) onProductClick(kit);
                    }}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-700 transition-all w-full md:w-auto"
                >
                    COMPRAR AGORA
                </button>
            </div>
         </div>
      </section>

      {/* Product Grid - "Liquidação" */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
         <div className="flex justify-between items-end mb-8">
             <div>
                <span className="text-rose-500 text-xs font-bold uppercase tracking-widest">Ofertas Relâmpago</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">Liquidação de Verão</h2>
             </div>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {PRODUCTS.filter(p => !p.isKit).map(product => (
                <ProductCard key={product.id} product={product} onClick={onProductClick} />
            ))}
         </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-gray-900 text-white py-12 px-4 mt-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-4 border border-white/10 rounded-xl">
                  <h3 className="font-bold text-lg mb-2">Loja Física em RS</h3>
                  <p className="text-sm text-gray-400">Compre com quem tem endereço e história.</p>
              </div>
              <div className="p-4 border border-white/10 rounded-xl">
                  <h3 className="font-bold text-lg mb-2">Envio Rápido</h3>
                  <p className="text-sm text-gray-400">Postagem em até 24h úteis.</p>
              </div>
              <div className="p-4 border border-white/10 rounded-xl">
                  <h3 className="font-bold text-lg mb-2">Troca Grátis</h3>
                  <p className="text-sm text-gray-400">Não serviu? A primeira troca é por nossa conta.</p>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Home;