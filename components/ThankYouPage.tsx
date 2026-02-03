import React from 'react';
import { CheckCircle, Package, Mail, MessageCircle, ArrowRight } from 'lucide-react';

interface ThankYouPageProps {
  onNavigateHome: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Success Icon */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
        <div className="relative bg-green-50 rounded-full p-6 border-4 border-white shadow-xl">
            <CheckCircle size={64} className="text-green-500" />
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl md:text-4xl font-serif text-gray-900 text-center mb-4 leading-tight">
        Pedido Pago com <span className="text-green-600">Sucesso!</span>
      </h1>
      
      <p className="text-gray-600 text-center max-w-lg mb-10 text-lg leading-relaxed">
        Obrigado por comprar na Loja das Divas. Sua ordem foi confirmada e já estamos separando suas peças com todo carinho.
      </p>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl mb-10">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0">
                <Mail size={24} />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 mb-1">Confirmação por E-mail</h3>
                <p className="text-sm text-gray-500">Você receberá todos os detalhes do pedido e a Nota Fiscal no e-mail cadastrado em instantes.</p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-lg text-green-600 shrink-0">
                <Package size={24} />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 mb-1">Código de Rastreio</h3>
                <p className="text-sm text-gray-500">Assim que seu pedido for postado (em até 24h úteis), enviaremos o código de rastreio via WhatsApp e E-mail.</p>
            </div>
        </div>
      </div>

      {/* WhatsApp Support Box */}
      <div className="bg-gray-50 rounded-2xl p-6 max-w-md w-full text-center border border-gray-200 mb-10">
        <p className="text-sm font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <MessageCircle size={16} className="text-green-600" />
            Precisa de ajuda?
        </p>
        <p className="text-xs text-gray-500 mb-0">
            Nossa equipe de suporte está disponível para tirar qualquer dúvida sobre sua entrega no WhatsApp: <strong className="text-gray-800">(21) 96555-4423</strong>
        </p>
      </div>

      {/* Back to Home CTA */}
      <button 
        onClick={onNavigateHome}
        className="group bg-gray-900 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-rose-600 transition-all active:scale-95 flex items-center gap-2"
      >
        VOLTAR PARA A LOJA <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
};

export default ThankYouPage;