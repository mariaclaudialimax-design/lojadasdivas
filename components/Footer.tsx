import React, { useEffect } from 'react';
import { MapPin, Phone, Mail, Lock, ShieldCheck, Database } from 'lucide-react';
import { InfoPageType } from '../types';
import { useSettings } from '../hooks/useSettings';

interface FooterProps {
  onNavigateInfo: (page: InfoPageType) => void;
  onNavigateAdmin?: () => void; // Optional prop for admin navigation
}

const Footer: React.FC<FooterProps> = ({ onNavigateInfo, onNavigateAdmin }) => {
  const { settings, fetchSettings } = useSettings();

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-center md:text-left">

          {/* Column 1: Informações */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm border-b-2 border-rose-500 pb-1 inline-block md:block">Informações</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <button onClick={() => onNavigateInfo('trust')} className="hover:text-rose-600 transition-colors">Site Confiável</button>
              </li>
              <li>
                <button onClick={() => onNavigateInfo('about')} className="hover:text-rose-600 transition-colors">Sobre Nós</button>
              </li>
              <li>
                <button onClick={() => onNavigateInfo('exchanges')} className="hover:text-rose-600 transition-colors">Trocas e Devoluções</button>
              </li>
              <li>
                <button onClick={() => onNavigateInfo('tracking')} className="hover:text-rose-600 transition-colors">Rastrear Pedido</button>
              </li>
            </ul>
          </div>

          {/* Column 2: Políticas */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm border-b-2 border-rose-500 pb-1 inline-block md:block">Políticas</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <button onClick={() => onNavigateInfo('privacy')} className="hover:text-rose-600 transition-colors">Política de Privacidade</button>
              </li>
              <li>
                <button onClick={() => onNavigateInfo('shipping')} className="hover:text-rose-600 transition-colors">Política de Envio</button>
              </li>
              <li>
                <button onClick={() => onNavigateInfo('refund')} className="hover:text-rose-600 transition-colors">Política de Devolução e Reembolso</button>
              </li>
              <li>
                <button onClick={() => onNavigateInfo('legal')} className="hover:text-rose-600 transition-colors">Aviso Legal</button>
              </li>
              <li>
                <button onClick={() => onNavigateInfo('terms')} className="hover:text-rose-600 transition-colors">Termos de Serviço</button>
              </li>
              <li>
                <button onClick={() => onNavigateInfo('contact')} className="hover:text-rose-600 transition-colors">Informações de Contato</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Pagamento */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm border-b-2 border-rose-500 pb-1 inline-block md:block">Pagamento</h3>
            <p className="text-xs text-gray-500 mb-4">Aceitamos as principais bandeiras e PIX com 5% de desconto.</p>
            <div className="grid grid-cols-4 gap-3 items-center">
              <img src="https://compra.lojadasdivas.com.br/icones-pay/card-visa.svg" alt="Visa" className="h-6 w-auto mx-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
              <img src="https://compra.lojadasdivas.com.br/icones-pay/card-mastercard.svg" alt="Mastercard" className="h-6 w-auto mx-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
              <img src="https://compra.lojadasdivas.com.br/icones-pay/card-elo.svg" alt="Elo" className="h-6 w-auto mx-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
              <img src="https://compra.lojadasdivas.com.br/icones-pay/card-amex.svg" alt="Amex" className="h-6 w-auto mx-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
              <div className="col-span-4 mt-2 flex justify-center border-t border-gray-100 pt-3">
                <img src="https://img.icons8.com/color/200/pix.png" alt="Pagamento via Pix" className="h-8 w-auto" />
              </div>
            </div>
          </div>

          {/* Column 4: Atendimento */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm border-b-2 border-rose-500 pb-1 inline-block md:block">Atendimento</h3>
            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Mail className="shrink-0 text-rose-500" size={18} />
                <p>{settings?.contact_email || 'contato@lojadasdivas.com.br'}</p>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Phone className="shrink-0 text-rose-500" size={18} />
                <div>
                  <p>{settings?.contact_phone || '(21) 96555-4423'}</p>
                  {settings?.working_hours && <p className="text-xs text-gray-400 mt-1">{settings.working_hours}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="shrink-0 text-rose-500 mt-1" size={18} />
                <p className="text-xs text-left whitespace-pre-line">{settings?.address || 'Av. Piraí, 351, São Cristóvão,\nLajeado-RS'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                <Lock size={14} className="text-green-600" />
                <span className="text-[10px] font-bold text-gray-700">SSL Seguro</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-[10px] font-bold text-gray-700">Google Safe</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-100 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            {settings?.copyright || '© 2026 Loja das Divas. Todos os direitos reservados.'}<br />
            {settings?.cnpj && <span>CNPJ: {settings.cnpj}</span>}
          </p>

          <div className="flex items-center gap-4">
            <p className="text-[10px] text-gray-400 max-w-sm text-center md:text-right">
              Preços e condições de pagamento exclusivos para compras via internet.
            </p>
            {/* Discreet Admin Link */}
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="text-gray-200 hover:text-gray-400 transition-colors"
                title="Acesso Restrito"
              >
                <Database size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
