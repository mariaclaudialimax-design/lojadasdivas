import React, { useState } from 'react';
import { Product, Size } from '../types';
import { Truck, ShieldCheck, Ruler } from 'lucide-react';
import SizeGuide from './SizeGuide';

interface StandardProductSelectorProps {
  product: Product;
  onAddToCart: (size: Size) => void;
}

const StandardProductSelector: React.FC<StandardProductSelectorProps> = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleBuy = () => {
    if (!selectedSize) {
      setShowError(true);
      return;
    }
    onAddToCart(selectedSize);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
      
      {/* Price Header */}
      <div className="mb-6 border-b border-gray-100 pb-6">
         <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
         <div className="flex items-center gap-2 mb-1">
             <span className="text-gray-400 line-through text-sm">R$ {product.oldPrice.toFixed(2)}</span>
             <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded">-{(100 - (product.price/product.oldPrice)*100).toFixed(0)}%</span>
         </div>
         <div className="flex items-baseline gap-1">
             <span className="text-3xl font-bold text-gray-900">R$ {Math.floor(product.price)}</span>
             <span className="text-lg font-bold text-gray-900">,{(product.price % 1).toFixed(2).substring(2)}</span>
         </div>
         <p className="text-sm text-green-600 font-medium mt-1">{product.installments}</p>
         <p className="text-xs text-gray-500 mt-1">ou R$ {(product.price * 0.95).toFixed(2)} no Pix (5% OFF)</p>
      </div>

      {/* Description Preview */}
      <div className="mb-6 text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>

      {/* Size Selector */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-gray-900">Selecione o Tamanho:</span>
            <button 
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-gray-500 underline flex items-center gap-1 hover:text-green-600"
            >
                <Ruler size={14} /> Tabela de Medidas
            </button>
        </div>
        <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
                <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setShowError(false); }}
                    className={`
                        w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all
                        ${selectedSize === size 
                        ? 'border-black bg-black text-white shadow-md transform scale-105' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'}
                    `}
                >
                    {size}
                </button>
            ))}
        </div>
        {showError && (
            <p className="text-red-500 text-xs mt-2 font-bold animate-pulse">
                Por favor, selecione um tamanho para continuar.
            </p>
        )}
      </div>

      {/* CTA */}
      <button 
        onClick={handleBuy}
        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition-all text-lg mb-4 flex items-center justify-center gap-2"
      >
        COMPRAR AGORA
      </button>

      {/* Guarantees */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
         <div className="flex items-center gap-3 text-xs text-gray-500">
             <Truck size={16} className="text-green-600" />
             <span>Frete Grátis para todo Brasil</span>
         </div>
         <div className="flex items-center gap-3 text-xs text-gray-500">
             <ShieldCheck size={16} className="text-green-600" />
             <span>Garantia de 7 dias para troca ou devolução</span>
         </div>
      </div>

    </div>
  );
};

export default StandardProductSelector;