import React from 'react';
import { AVAILABLE_COLORS } from '../constants';
import { Briefcase, Coffee, Sun } from 'lucide-react';

const Usage: React.FC = () => {
  // Use all colors that have images
  const allColors = AVAILABLE_COLORS.filter(c => c.imageUrl);

  return (
    <section className="py-12 px-0 md:px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="px-4 text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Beleza em todas as cores
            </h2>
            <p className="text-gray-500">
                Deslize para ver todas as opções disponíveis.
            </p>
        </div>
        
        {/* Gallery Container */}
        <div className="
            flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-6 mb-12
            md:grid md:grid-cols-3 md:gap-6 md:pb-0 md:overflow-visible
            scrollbar-hide
        ">
            {allColors.map((color) => (
                <div 
                    key={color.id} 
                    className="
                        flex-shrink-0 w-[85vw] sm:w-[60vw] snap-center relative rounded-xl overflow-hidden aspect-[3/4] shadow-lg border border-gray-100
                        md:w-auto md:hover:scale-[1.02] transition-transform duration-300 bg-gray-100
                    "
                >
                    <img 
                        src={color.imageUrl} 
                        alt={`Camisa Ibiza ${color.name}`} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="533"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-4 left-4">
                        <span className="text-white text-xl font-bold shadow-sm tracking-wide">{color.name}</span>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Mobile Swipe Hint */}
        <div className="md:hidden text-center text-gray-400 text-sm -mt-10 mb-12 flex items-center justify-center gap-2 animate-pulse">
            <span>← Arraste para o lado →</span>
        </div>

        {/* New Editorial Section: Office to Happy Hour */}
        <div className="px-4">
            <div className="bg-rose-50/50 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center border border-rose-100">
                
                {/* Image Side */}
                <div className="relative order-2 md:order-1 h-full min-h-[300px] md:min-h-[400px]">
                    <div className="absolute inset-0 bg-white rounded-2xl rotate-3 shadow-md border border-gray-100"></div>
                    <img 
                        src="https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_lszsbhlszsbhlszs.png?v=1770007796" 
                        alt="Mulher elegante vestindo camisa linho bege" 
                        className="relative w-full h-full object-cover rounded-2xl shadow-xl -rotate-2 hover:rotate-0 transition-transform duration-500"
                    />
                </div>

                {/* Content Side */}
                <div className="order-1 md:order-2">
                    <span className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-2 block">Versatilidade Premium</span>
                    <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 leading-tight">
                        Uma Camisa.<br/>
                        <span className="italic text-rose-800">Três Ocasiões.</span>
                    </h3>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        A modelagem semi plissada traz o equilíbrio perfeito entre o formal e o despojado. Você não precisa trocar de roupa para mudar de ambiente.
                    </p>

                    <ul className="space-y-6">
                        <li className="flex gap-4 items-start">
                            <div className="bg-white p-2.5 rounded-lg shadow-sm text-rose-500 shrink-0">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">No Escritório</h4>
                                <p className="text-xs text-gray-500 mt-1">Use abotoada até o colarinho com calça de alfaiataria para um visual de autoridade e elegância.</p>
                            </div>
                        </li>
                        
                        <li className="flex gap-4 items-start">
                            <div className="bg-white p-2.5 rounded-lg shadow-sm text-orange-500 shrink-0">
                                <Coffee size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">No Happy Hour</h4>
                                <p className="text-xs text-gray-500 mt-1">Solte os dois primeiros botões e dobre as mangas. O tecido respira e mantém você fresca.</p>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <div className="bg-white p-2.5 rounded-lg shadow-sm text-yellow-500 shrink-0">
                                <Sun size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">No Final de Semana</h4>
                                <p className="text-xs text-gray-500 mt-1">Use aberta como terceira peça ou saída de praia. O linho traz o toque natural perfeito para o lazer.</p>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
      </div>
    </section>
  );
};

export default Usage;