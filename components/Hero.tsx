import React from 'react';
import { Star, Truck, ShieldCheck, CreditCard, ShoppingBag } from 'lucide-react';
import { PRICE_NEW, PRICE_OLD, INSTALLMENTS } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="pt-6 pb-8 px-4 bg-[#FFFBFB] overflow-hidden">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Store Brand Tag */}
        <div className="mx-auto w-fit mb-4 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5 flex items-center gap-2">
           <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
           <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">Coleção Ibiza 2026</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 leading-[1.1] mb-3 tracking-tight">
          Liquidação de <br/>
          <span className="italic text-rose-900 font-normal">Verão</span>
        </h1>
        
        <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed px-4 font-light">
          A elegância do Linho com o conforto do Algodão. <br className="hidden md:block"/>
          Peças selecionadas com corte de alfaiataria que <strong className="font-medium text-gray-900">não amassam</strong>.
        </p>

        {/* Product Image - LCP OPTIMIZED */}
        <div className="relative mb-8 max-w-[280px] md:max-w-xs mx-auto group cursor-pointer">
           <div className="absolute inset-0 border-[1px] border-rose-200 rounded-t-[100px] rounded-b-[20px] transform translate-x-2 translate-y-2"></div>
           
           <div className="relative rounded-t-[100px] rounded-b-[20px] overflow-hidden shadow-xl aspect-[4/5] bg-white">
             <img 
              src="https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480" 
              alt="Kit 3 Camisas Ibiza em Linho" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
              fetchPriority="high"
              loading="eager"
              width="320"
              height="400"
            />
            
            {/* Price Tag */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 text-left min-w-[120px] animate-in slide-in-from-right-4 fade-in duration-700">
                <p className="text-[10px] text-gray-400 line-through">De R$ {PRICE_OLD}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-xs text-green-700 font-bold">Por</span>
                    <span className="text-xl font-bold text-gray-900">R$ {Math.floor(PRICE_NEW)}</span>
                    <span className="text-xs font-bold text-gray-900">,{(PRICE_NEW % 1).toFixed(2).substring(2)}</span>
                </div>
                <p className="text-[9px] text-gray-500 font-medium border-t border-gray-100 mt-1 pt-1">
                    Kit com 3 Peças
                </p>
            </div>
          </div>

           {/* Floating Badge */}
          <div className="absolute top-6 -left-4 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 shadow-md rotate-[-6deg] z-10 flex items-center gap-1">
            <Star size={10} fill="currentColor" />
            TOP VENDAS NA LOJA
          </div>
        </div>

        {/* Offer Box */}
        <div className="bg-white border border-rose-100 p-0 rounded-2xl shadow-sm mb-6 max-w-sm mx-auto overflow-hidden">
            <div className="bg-rose-50 px-4 py-2 border-b border-rose-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-rose-800 uppercase">Promoção Relâmpago</span>
                <span className="bg-white text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-100">-63% OFF</span>
            </div>
            
            <div className="p-4">
                <div className="flex flex-col items-center justify-center mb-3">
                    <p className="text-gray-500 text-xs mb-1">Leve 3 Camisas por apenas:</p>
                    <span className="text-gray-900 text-4xl font-serif font-medium tracking-tight">
                        <span className="text-lg align-top font-bold text-gray-400 mr-1">R$</span>
                        {Math.floor(PRICE_NEW)}
                        <span className="text-lg align-top font-bold text-gray-900">,{(PRICE_NEW % 1).toFixed(2).substring(2)}</span>
                    </span>
                    <p className="text-green-600 text-xs font-bold mt-1 bg-green-50 px-2 py-1 rounded">
                        Sai a R$ 36,63 cada peça
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-600 text-xs border-t border-dashed border-gray-200 pt-3">
                    <CreditCard size={14} className="text-gray-400" />
                    <span>{INSTALLMENTS}</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-bold text-green-700">5% OFF no Pix</span>
                </div>
            </div>
        </div>

        {/* Social Proof Text */}
        <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <img key={i} src={`https://randomuser.me/api/portraits/women/${40+i}.jpg`} alt="User" className="w-6 h-6 rounded-full border border-white" loading="lazy" width="24" height="24" />
                ))}
            </div>
            <p className="text-xs text-gray-500">
                <strong className="text-gray-900">Ana, Carla</strong> e outras 1.400 clientes compraram.
            </p>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-3 gap-2 text-[9px] text-gray-500 uppercase tracking-wide font-medium max-w-xs mx-auto opacity-70">
          <div className="flex flex-col items-center gap-1">
            <ShoppingBag size={16} strokeWidth={1.5} />
            <span>Loja Verificada</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck size={16} strokeWidth={1.5} />
            <span>Entrega Rápida</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck size={16} strokeWidth={1.5} />
            <span>Garantia Total</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;