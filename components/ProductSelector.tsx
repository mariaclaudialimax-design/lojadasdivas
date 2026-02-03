import React, { useState, useEffect } from 'react';
import { Size, Product } from '../types';
import { AVAILABLE_COLORS } from '../constants';
import { Check, AlertCircle, Ruler, X, Truck, Lock, Gift } from 'lucide-react';
import SizeGuide from './SizeGuide';
import { trackAddToCart } from '../utils/tracking';

interface ProductSelectorProps {
  product: Product;
  onSelectionComplete: (isValid: boolean) => void;
  onAddToCart: (size: Size, colors: string[]) => void;
  id?: string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ product, onSelectionComplete, onAddToCart, id }) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const isValid = selectedSize !== null && selectedColors.length === 3;
    onSelectionComplete(isValid);
    if (isValid) setShowError(false);
  }, [selectedSize, selectedColors, onSelectionComplete]);

  const handleColorToggle = (colorId: string) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(prev => prev.filter(c => c !== colorId));
    } else {
      if (selectedColors.length < 3) {
        setSelectedColors(prev => [...prev, colorId]);
      }
    }
  };

  const handleRemoveColor = (indexToRemove: number) => {
     setSelectedColors(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddToCartClick = () => {
    if (!selectedSize || selectedColors.length !== 3) {
      setShowError(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      const el = document.getElementById('selection-error');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Trigger Tracking
    trackAddToCart(product, selectedSize);

    onAddToCart(selectedSize, selectedColors);
  };

  const isFull = selectedColors.length === 3;
  const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div id={id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 w-full">
      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
      
      {/* Header Standardized */}
      <div className="mb-6 border-b border-gray-100 pb-6">
         <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
         <div className="flex items-center gap-2 mb-1">
             <span className="text-gray-400 line-through text-sm">R$ {product.oldPrice.toFixed(2)}</span>
             <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded">-{(discountPercent)}% OFF</span>
         </div>
         <div className="flex items-baseline gap-1">
             <span className="text-3xl font-bold text-gray-900">R$ {Math.floor(product.price)}</span>
             <span className="text-lg font-bold text-gray-900">,{(product.price % 1).toFixed(2).substring(2)}</span>
         </div>
         <p className="text-sm text-green-600 font-medium mt-1">{product.installments}</p>
         
         {/* Kit Special Message */}
         <div className="mt-3 bg-green-50 border border-green-100 text-green-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
             <Gift size={14} />
             PREÇO DE ATACADO: SAI A R$ 36,63 CADA PEÇA
         </div>
      </div>

      <div className="mb-6 text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
          <p>Selecione <strong>1 Tamanho</strong> e <strong>3 Cores</strong> abaixo para montar seu kit personalizado.</p>
      </div>

      {/* Visual Kit Preview - RESPONSIVE GRID FIXED */}
      <div className="bg-gray-50 rounded-xl p-3 md:p-4 mb-8 border border-gray-100">
        <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((idx) => {
                const colorId = selectedColors[idx];
                const colorData = colorId ? AVAILABLE_COLORS.find(c => c.id === colorId) : null;
                
                return (
                    <div 
                        key={idx} 
                        className={`
                            relative w-full aspect-[3/4] rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-white shadow-sm
                            ${colorData ? 'border-green-500' : 'border-gray-300'}
                        `}
                    >
                        {colorData ? (
                            <>
                                <button 
                                    onClick={() => handleRemoveColor(idx)}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 text-gray-400 hover:text-red-500 z-10 shadow-md border border-gray-100"
                                >
                                    <X size={10} />
                                </button>
                                {colorData.imageUrl ? (
                                    <img src={colorData.imageUrl} alt={colorData.name} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="w-full h-full" style={{ backgroundColor: colorData.hex }}></div>
                                )}
                            </>
                        ) : (
                            <div className="text-center p-1 opacity-40">
                                <span className="text-[9px] font-bold uppercase block">Cor {idx + 1}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>

        {/* Size Selector */}
        <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
                <label className="text-sm font-bold text-gray-900">
                    1. Escolha o Tamanho
                </label>
                <button 
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs text-gray-500 underline flex items-center gap-1 hover:text-green-600"
                >
                    <Ruler size={14} /> Medidas
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
                <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                    w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all border
                    ${selectedSize === size 
                    ? 'bg-black text-white border-black shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}
                `}
                >
                {size}
                </button>
            ))}
            </div>
        </div>

        {/* Color Selector */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-900">
                    2. Escolha 3 Cores
                </label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${isFull ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selectedColors.length}/3
                </span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {AVAILABLE_COLORS.map((color) => {
                const isSelected = selectedColors.includes(color.id);
                const isDisabled = !isSelected && isFull;

                return (
                <button
                    key={color.id}
                    onClick={() => handleColorToggle(color.id)}
                    disabled={isDisabled}
                    className={`
                    flex flex-col items-center p-1.5 rounded-lg border transition-all relative group
                    ${isSelected ? 'border-green-500 bg-green-50/30' : 'border-transparent hover:bg-gray-50'}
                    ${isDisabled ? 'opacity-30 grayscale' : 'cursor-pointer active:scale-95'}
                    `}
                >
                    <div 
                    className={`w-10 h-10 rounded-full shadow-sm mb-1 relative overflow-hidden transition-transform ${isSelected ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    >
                        {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                                <Check size={16} className="text-white" strokeWidth={3} />
                            </div>
                        )}
                    </div>
                    <span className={`text-[9px] font-bold text-center leading-tight truncate w-full ${isSelected ? 'text-green-700' : 'text-gray-500'}`}>
                        {color.name.split(' ')[0]}
                    </span>
                </button>
                );
            })}
            </div>
        </div>

        {/* Error Message */}
        {showError && (
            <div id="selection-error" className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} />
                <span>Selecione <strong>1 tamanho</strong> e <strong>3 cores</strong> para continuar.</span>
            </div>
        )}

        {/* CTA Button */}
        <button
            onClick={handleAddToCartClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-4 uppercase tracking-wide"
        >
            COMPRAR AGORA
        </button>

        {/* Guarantees */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
             <div className="flex items-center gap-2 text-xs text-gray-500">
                 <Lock size={14} className="text-green-600" />
                 <span>Pagamento 100% Seguro</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-gray-500">
                 <Truck size={14} className="text-green-600" />
                 <span>Frete Grátis para todo Brasil</span>
             </div>
        </div>
    </div>
  );
};

export default ProductSelector;