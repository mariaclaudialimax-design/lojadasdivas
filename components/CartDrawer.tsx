import React, { useEffect, useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { AVAILABLE_COLORS } from '../constants';
import { PRODUCTS } from '../data/products';
import { trackInitiateCheckout } from '../utils/tracking';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems, onRemoveItem }) => {
  const [baseCheckoutUrl, setBaseCheckoutUrl] = useState<string>('#');
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Calculate Base URL (without dynamic params)
  useEffect(() => {
    if (cartItems.length > 0) {
        const item = cartItems[0];
        const product = PRODUCTS.find(p => p.id === item.product.id) || item.product;
        let url = product.checkoutUrl;

        if (product.variantUrls && item.size && product.variantUrls[item.size]) {
            url = product.variantUrls[item.size];
        }
        setBaseCheckoutUrl(url || '#');
    }
  }, [cartItems]);

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (baseCheckoutUrl === '#' || cartItems.length === 0) {
        alert("Erro ao processar checkout. Tente novamente.");
        return;
    }

    const item = cartItems[0];
    
    // 1. Fire Pixel/GA4 Event and get the unique Deduplication ID
    const eventId = trackInitiateCheckout(item.product, baseCheckoutUrl);

    // 2. Construct the final URL with parameters
    // We pass 'event_id' so the webhook can use it for the Purchase event (Server-Side)
    let finalUrl = baseCheckoutUrl;
    const separator = finalUrl.includes('?') ? '&' : '?';
    
    // Append UTMs
    const currentParams = window.location.search.substring(1);
    
    // Append Event ID for Deduplication (Corvex usually accepts custom params like 'xcod' or 'metadata')
    // Assuming 'external_id' or a generic param for now. 
    // IMPORTANT: Verify with Corvex docs which parameter they reflect back in webhooks.
    // Common pattern: src, utm_content, or a specific custom field.
    const trackingParams = `event_id=${eventId}&fbp=${getCookie('_fbp')}&fbc=${getCookie('_fbc')}`;

    finalUrl = `${finalUrl}${separator}${currentParams ? currentParams + '&' : ''}${trackingParams}`;

    // 3. Redirect
    window.location.href = finalUrl;
  };

  // Helper to get cookies for CAPI
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return '';
  }

  const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
                <ShoppingBag className="text-rose-600" />
                <h2 className="text-lg font-bold text-gray-900">Seu Carrinho</h2>
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartItems.length} itens
                </span>
            </div>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
                <X size={24} />
            </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <ShoppingBag size={32} className="opacity-30" />
                    </div>
                    <p>Seu carrinho está vazio.</p>
                    <button onClick={onClose} className="text-rose-600 font-bold text-sm hover:underline">
                        Continuar Comprando
                    </button>
                </div>
            ) : (
                cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                        {/* Image */}
                        <div className="w-20 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                                    {item.product.title}
                                </h3>
                                <button 
                                    onClick={() => onRemoveItem(idx)}
                                    className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            
                            <div className="mt-1 text-xs text-gray-500 space-y-1">
                                <p><span className="font-medium">Tamanho:</span> {item.size}</p>
                                {item.colors && item.colors.length > 0 && (
                                    <div className="flex flex-wrap gap-1 items-center">
                                        <span className="font-medium">Cores:</span>
                                        {item.colors.map(cId => {
                                            const color = AVAILABLE_COLORS.find(ac => ac.id === cId);
                                            return (
                                                <span key={cId} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: color?.hex }} title={color?.name}></span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto flex justify-between items-end">
                                <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                                    Em estoque
                                </div>
                                <p className="font-bold text-gray-900">
                                    R$ {item.product.price.toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer Actions */}
        {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-xl font-bold text-gray-900">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                
                {/* Use button with handler for tracking */}
                <button
                    onClick={handleCheckoutClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                    FINALIZAR COMPRA <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-4 flex justify-center gap-4 text-[10px] text-gray-400">
                    <div className="flex items-center gap-1">
                        <Lock size={12} /> Compra Segura
                    </div>
                    <div className="flex items-center gap-1">
                        <ShieldCheck size={12} /> Dados Protegidos
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
