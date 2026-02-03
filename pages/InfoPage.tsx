import React, { useState, useEffect } from 'react';
import { InfoPageType } from '../types';
import { Search, ShieldCheck, Truck, RotateCcw, Lock, Headphones, MapPin, CheckCircle, Send } from 'lucide-react';

interface InfoPageProps {
  type: InfoPageType;
}

declare global {
    interface Window {
      YQV5: any;
    }
}

const InfoPage: React.FC<InfoPageProps> = ({ type }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  
  // Contact Form State
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // Load Tracking Script if needed
  useEffect(() => {
    if (type === 'tracking') {
      const script = document.createElement('script');
      script.src = "//www.17track.net/externalcall.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [type]);

  const handleTrackOrder = () => {
    if (!trackingNumber.trim()) {
      alert("Por favor, insira seu código de rastreio.");
      return;
    }
    if (window.YQV5) {
      window.YQV5.trackSingle({
        YQ_ContainerId: "YQContainer",
        YQ_Height: 560,
        YQ_Fc: "0",
        YQ_Lang: "pt-br",
        YQ_Num: trackingNumber.trim()
      });
    } else {
      alert("O sistema de rastreio está carregando. Tente novamente em 5 segundos.");
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API submission
    setTimeout(() => {
        setContactSuccess(true);
    }, 800);
  };

  const getContent = () => {
    switch (type) {
      case 'trust':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-serif text-gray-900 mb-6">Por que somos um Site Confiável?</h1>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-green-50 rounded-xl border border-green-100 text-center">
                    <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Segurança de Dados</h3>
                    <p className="text-sm text-gray-600">Utilizamos criptografia SSL de 256 bits (a mesma de bancos) para proteger seus dados pessoais e de cartão.</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Entrega Garantida</h3>
                    <p className="text-sm text-gray-600">Todas as encomendas possuem código de rastreio e seguro contra extravio. Se não chegar, devolvemos seu dinheiro.</p>
                </div>
                <div className="p-6 bg-rose-50 rounded-xl border border-rose-100 text-center">
                    <Headphones className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Suporte Humanizado</h3>
                    <p className="text-sm text-gray-600">Nada de robôs. Nossa equipe de atendimento está disponível no WhatsApp para tirar todas as suas dúvidas.</p>
                </div>
            </div>
            <div className="prose max-w-none text-gray-600">
                <p>A Loja das Divas atua no mercado de moda feminina com o compromisso de levar elegância e conforto para mulheres de todo o Brasil. Somos uma empresa registrada (CNPJ: 41.873.753/0001-99) e transparente.</p>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-serif text-gray-900 mb-4">Sobre a Loja das Divas</h1>
            <img src="https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480" alt="Nossa História" className="w-full h-64 object-cover rounded-2xl shadow-sm mb-6" />
            <div className="prose max-w-none text-gray-600 space-y-4">
                <p>Nascemos de um desejo simples: criar roupas que unam a sofisticação da alfaiataria com o conforto que a mulher brasileira precisa para enfrentar o dia a dia.</p>
                <p>Acreditamos que elegância não precisa ser desconfortável. Por isso, nossas coleções são desenvolvidas com tecidos naturais, como o linho e o algodão, e modelagens pensadas para valorizar todos os tipos de corpos, do PP ao 5G.</p>
                <p><strong>Nossa Missão:</strong> Empoderar mulheres através da moda, oferecendo peças versáteis que transitam do trabalho ao happy hour com facilidade.</p>
                <p>Mais do que uma loja online, somos uma comunidade de mulheres que buscam praticidade sem abrir mão do estilo.</p>
            </div>
          </div>
        );

      case 'exchanges':
      case 'refund':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-serif text-gray-900 mb-6">Trocas, Devoluções e Reembolso</h1>
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg mb-6">
                <h3 className="font-bold text-rose-800">Garantia Incondicional</h3>
                <p className="text-rose-700 text-sm">Você tem 7 dias corridos após o recebimento para devolver o produto por arrependimento e receber 100% do valor de volta.</p>
            </div>
            <div className="prose max-w-none text-gray-600 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">1. Troca Fácil</h3>
                <p>Se o tamanho não serviu, a <strong>primeira troca é por nossa conta</strong>. Basta entrar em contato com nosso suporte informando o número do pedido. Enviaremos um código de postagem reversa para você levar o produto aos Correios sem custo.</p>
                
                <h3 className="text-xl font-bold text-gray-900">2. Defeito de Fabricação</h3>
                <p>Nossos produtos passam por rigoroso controle de qualidade. Caso receba algo com defeito, você tem até 90 dias para solicitar a troca ou devolução.</p>

                <h3 className="text-xl font-bold text-gray-900">3. Reembolso</h3>
                <p>O reembolso é feito na mesma forma de pagamento da compra:</p>
                <ul className="list-disc pl-5">
                    <li><strong>Cartão de Crédito:</strong> O estorno aparecerá em até duas faturas subsequentes.</li>
                    <li><strong>PIX/Boleto:</strong> Transferência em conta corrente em até 5 dias úteis após a chegada da devolução em nosso centro de distribuição.</li>
                </ul>
            </div>
          </div>
        );

      case 'tracking':
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8">
             <h1 className="text-3xl font-serif text-gray-900">Rastreie seu Pedido</h1>
             <p className="text-gray-600">Insira o código de rastreamento enviado para o seu e-mail (Ex: BR123456789CN).</p>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Digite seu código aqui..." 
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 uppercase focus:ring-2 focus:ring-rose-500 outline-none w-full min-w-0"
                    />
                    <button 
                        onClick={handleTrackOrder}
                        className="bg-rose-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2 shrink-0"
                    >
                        <Search size={20} /> <span className="hidden sm:inline">Rastrear</span>
                    </button>
                </div>
             </div>

             {/* Adicionado CSS inline para forçar responsividade do iframe interno */}
             <div 
                id="YQContainer" 
                className="min-h-[200px] mt-8 bg-gray-50 rounded-xl overflow-hidden [&>iframe]:max-w-full [&>iframe]:w-full"
             ></div>
             
             <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                <p><strong>Nota:</strong> Pode levar até 48 horas após a postagem para que as primeiras atualizações apareçam no sistema.</p>
             </div>
          </div>
        );
      
      case 'privacy':
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-serif text-gray-900 mb-6">Política de Privacidade</h1>
                <div className="prose max-w-none text-gray-600 text-sm">
                    <p>A Loja das Divas respeita a sua privacidade. Esta política descreve como coletamos e usamos seus dados.</p>
                    <h3 className="font-bold text-gray-900 mt-4">1. Coleta de Dados</h3>
                    <p>Coletamos apenas as informações necessárias para processar seu pedido: Nome, CPF (para Nota Fiscal), Endereço e Dados de Contato. Não armazenamos números completos de cartão de crédito.</p>
                    <h3 className="font-bold text-gray-900 mt-4">2. Uso das Informações</h3>
                    <p>Seus dados são usados exclusivamente para: Processamento de compras, entrega logística e comunicação sobre o status do pedido.</p>
                    <h3 className="font-bold text-gray-900 mt-4">3. Segurança</h3>
                    <p>Adotamos medidas técnicas de segurança para proteger suas informações contra acesso não autorizado.</p>
                </div>
            </div>
        );

      case 'shipping':
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-serif text-gray-900 mb-6">Política de Envio e Prazos</h1>
                <div className="prose max-w-none text-gray-600">
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-bold text-gray-900 mb-1">Processamento</h4>
                            <p className="text-sm">Seu pedido é separado e embalado em até 24 horas úteis após a confirmação do pagamento.</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-bold text-gray-900 mb-1">Código de Rastreio</h4>
                            <p className="text-sm">Enviado automaticamente para seu e-mail e WhatsApp assim que o pacote é postado.</p>
                        </div>
                    </div>
                    <p>Nossos prazos estimados de entrega variam conforme a região:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Sul e Sudeste:</strong> 5 a 10 dias úteis.</li>
                        <li><strong>Centro-Oeste:</strong> 7 a 12 dias úteis.</li>
                        <li><strong>Norte e Nordeste:</strong> 10 a 18 dias úteis.</li>
                    </ul>
                    <p className="mt-4 text-sm bg-yellow-50 p-3 rounded text-yellow-800">
                        *Em períodos de alta demanda (como Black Friday e Natal), os prazos podem sofrer um acréscimo de até 3 dias úteis.
                    </p>
                </div>
            </div>
        );

      case 'legal':
      case 'terms':
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-serif text-gray-900 mb-6">Termos de Serviço e Aviso Legal</h1>
                <div className="prose max-w-none text-gray-600 text-sm">
                    <p>Ao utilizar este site, você concorda com os termos abaixo:</p>
                    <h3 className="font-bold text-gray-900 mt-4">Propriedade Intelectual</h3>
                    <p>Todo o conteúdo deste site (imagens, textos, logos) é propriedade exclusiva da Loja das Divas. É proibida a reprodução sem autorização.</p>
                    <h3 className="font-bold text-gray-900 mt-4">Produtos e Cores</h3>
                    <p>Nos esforçamos para exibir as cores dos produtos com a maior precisão possível. No entanto, as cores podem variar dependendo do monitor do seu dispositivo.</p>
                    <h3 className="font-bold text-gray-900 mt-4">Isenção de Responsabilidade</h3>
                    <p>Não nos responsabilizamos por danos diretos ou indiretos decorrentes do uso ou impossibilidade de uso deste site.</p>
                </div>
            </div>
        );

      case 'contact':
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-serif text-gray-900 mb-6">Fale Conosco</h1>
                
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            {!contactSuccess ? (
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Envie uma mensagem</h3>
                                    <p className="text-sm text-gray-500 mb-4">Respondemos em até 24 horas úteis.</p>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo</label>
                                        <input 
                                            required 
                                            type="text" 
                                            value={contactForm.name}
                                            onChange={e => setContactForm({...contactForm, name: e.target.value})}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all" 
                                            placeholder="Seu nome" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">E-mail</label>
                                        <input 
                                            required 
                                            type="email" 
                                            value={contactForm.email}
                                            onChange={e => setContactForm({...contactForm, email: e.target.value})}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all" 
                                            placeholder="seu@email.com" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Mensagem</label>
                                        <textarea 
                                            required 
                                            rows={4}
                                            value={contactForm.message}
                                            onChange={e => setContactForm({...contactForm, message: e.target.value})}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none" 
                                            placeholder="Como podemos ajudar?" 
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <Send size={18} /> ENVIAR MENSAGEM
                                    </button>
                                </form>
                            ) : (
                                <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensagem Enviada!</h3>
                                    <p className="text-gray-600 mb-6">Obrigado pelo contato. Nossa equipe responderá em breve no e-mail informado.</p>
                                    <button 
                                        onClick={() => {
                                            setContactSuccess(false);
                                            setContactForm({name: '', email: '', message: ''});
                                        }}
                                        className="text-sm font-bold text-rose-600 hover:text-rose-800 underline"
                                    >
                                        Enviar nova mensagem
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="space-y-6 text-gray-600">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shrink-0">
                                <Headphones size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">WhatsApp</p>
                                <p>(21) 96555-4423</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shrink-0">
                                <RotateCcw size={24} /> 
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">E-mail</p>
                                <p>contato@lojadasdivas.com.br</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Endereço Físico</p>
                                <p>Av. Piraí, 351, São Cristóvão,<br/>Lajeado-RS CEP: 95913-148</p>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-2">Horário de Atendimento</h3>
                            <p className="text-sm text-gray-600">Segunda a Sexta: 09:00 às 18:00</p>
                            <p className="text-sm text-gray-600">Sábado: 09:00 às 13:00</p>
                        </div>
                    </div>
                </div>
            </div>
        );

      default:
        return <div>Página não encontrada.</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {getContent()}
    </div>
  );
};

export default InfoPage;