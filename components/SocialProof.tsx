import React, { useState } from 'react';
import { REVIEWS_BY_CATEGORY, REVIEWS as DEFAULT_REVIEWS } from '../constants';
import { Star, CheckCircle, MessageCircle, PenLine, X } from 'lucide-react';
import { Product } from '../types';

interface SocialProofProps {
    product?: Product | null;
}

const SocialProof: React.FC<SocialProofProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
        setIsSuccess(true);
    }, 500);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // Reset after closing
    setTimeout(() => {
        setIsSuccess(false);
        setRating(5);
    }, 300);
  };

  // Determine which reviews to show based on product category
  let activeReviews = DEFAULT_REVIEWS;
  
  if (product) {
      if (product.isKit) {
          activeReviews = REVIEWS_BY_CATEGORY['kits'];
      } else if (product.category === 'Conjuntos') {
          activeReviews = REVIEWS_BY_CATEGORY['conjuntos'];
      } else if (product.category === 'Vestidos') {
          activeReviews = REVIEWS_BY_CATEGORY['vestidos'];
      }
  }

  return (
    <section className="py-12 px-4 bg-gray-50 border-t border-gray-200">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-3">
                <MessageCircle size={14} />
                Avaliações de Clientes
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
            Quem comprou, amou!
            </h2>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-bold text-rose-600 border border-rose-200 bg-white px-6 py-2 rounded-full shadow-sm hover:bg-rose-50 transition-colors flex items-center gap-2 mx-auto"
            >
                <PenLine size={16} /> Escrever Avaliação
            </button>
        </div>

        <div className="space-y-4">
          {activeReviews.map((review, idx) => (
            <div key={review.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
                        <img src={`https://randomuser.me/api/portraits/women/${55+review.id % 50}.jpg`} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-900">{review.name}</span>
                        <span className="text-[10px] text-gray-400">~ {review.timeAgo}</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 inline-block relative">
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">{review.text}</p>
                        {review.rating === 5 && (
                             <div className="flex items-center gap-1 border-t border-gray-100 pt-2 mt-1">
                                <div className="flex text-yellow-400">
                                    <Star size={10} fill="currentColor" />
                                    <Star size={10} fill="currentColor" />
                                    <Star size={10} fill="currentColor" />
                                    <Star size={10} fill="currentColor" />
                                    <Star size={10} fill="currentColor" />
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium">Recomendado</span>
                             </div>
                        )}
                    </div>
                </div>
            </div>
          ))}

          {/* Fake typing indicator for immersion */}
          <div className="flex gap-3 mt-2 opacity-60">
             <div className="w-8 h-8 rounded-full bg-gray-200"></div>
             <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                 <div className="flex gap-1">
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                 </div>
             </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
                <CheckCircle size={12} className="inline mr-1 text-green-500" />
                Compra verificada via WhatsApp Oficial
            </p>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleClose}>
            <div 
                className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden" 
                onClick={e => e.stopPropagation()}
            >
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>

                {!isSuccess ? (
                    <>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Avaliar Produto</h3>
                        <p className="text-sm text-gray-500 mb-6">Conte para nós o que achou da sua compra.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Sua Nota</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            type="button" 
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
                                        >
                                            <Star size={28} fill="currentColor" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Seu Nome</label>
                                <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Ex: Maria Silva" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Seu Comentário</label>
                                <textarea required rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="O que você achou do produto?"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                                ENVIAR AVALIAÇÃO
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4 animate-bounce">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Avaliação Enviada!</h3>
                        <p className="text-gray-600 text-sm mb-6">Obrigado pelo seu feedback. Sua avaliação foi enviada para nossa equipe.</p>
                        <button onClick={handleClose} className="text-sm font-bold text-gray-500 hover:text-gray-900 underline">
                            Fechar Janela
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </section>
  );
};

export default SocialProof;