import React from 'react';
import { BENEFITS } from '../constants';

const Benefits: React.FC = () => {
  return (
    <section className="py-10 px-4 bg-white border-y border-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg font-serif text-center mb-8 text-gray-900 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gray-300"></span>
          Nossos Diferenciais
          <span className="h-px w-8 bg-gray-300"></span>
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {BENEFITS.map((benefit, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4 rounded-lg bg-[#FFFBFB] border border-rose-50 hover:border-rose-100 transition-colors">
              <div className="text-rose-400 mb-3 opacity-80">
                <benefit.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{benefit.title}</h3>
              <p className="text-xs text-gray-500 leading-snug max-w-[140px]">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* "Vendedora" Tip */}
        <div className="mt-8 p-4 bg-rose-50 rounded-xl flex gap-4 items-center max-w-md mx-auto">
           <div className="shrink-0 w-12 h-12 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden">
             <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Gerente" className="w-full h-full object-cover" />
           </div>
           <div>
             <p className="text-[10px] uppercase font-bold text-rose-400 mb-0.5">Dica da Gerente</p>
             <p className="text-xs text-gray-700 leading-snug">
               "Meninas, a cor <span className="font-bold text-rose-700">Terracota</span> está saindo muito na loja física hoje. Aproveitem enquanto ainda temos no estoque do site!"
             </p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;