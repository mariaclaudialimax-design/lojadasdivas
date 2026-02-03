import React from 'react';
import { X } from 'lucide-react';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuide: React.FC<SizeGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Tabela de Medidas</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6 overflow-x-auto">
          <p className="text-sm text-gray-500 mb-4 text-center">
            Medidas em centímetros. A modelagem é solta e confortável.
          </p>
          
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-2 px-3 rounded-l-lg">Tamanho</th>
                <th className="py-2 px-3">Busto</th>
                <th className="py-2 px-3">Ombro</th>
                <th className="py-2 px-3 rounded-r-lg">Comp.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="py-2 font-bold">PP</td><td>90</td><td>36</td><td>60</td></tr>
              <tr><td className="py-2 font-bold">P</td><td>95</td><td>37</td><td>61</td></tr>
              <tr><td className="py-2 font-bold">M</td><td>100</td><td>38</td><td>62</td></tr>
              <tr><td className="py-2 font-bold">G</td><td>105</td><td>39</td><td>63</td></tr>
              <tr><td className="py-2 font-bold">GG</td><td>110</td><td>40</td><td>64</td></tr>
              <tr><td className="py-2 font-bold">3G</td><td>115</td><td>41</td><td>65</td></tr>
              <tr><td className="py-2 font-bold">4G</td><td>120</td><td>42</td><td>66</td></tr>
              <tr><td className="py-2 font-bold">5G</td><td>125</td><td>43</td><td>67</td></tr>
            </tbody>
          </table>
          
          <div className="mt-6 flex gap-3 text-xs text-gray-500 items-start bg-blue-50 p-3 rounded-lg">
            <span className="text-xl">💡</span>
            <p>Dica: Se você prefere um caimento mais soltinho como na foto, sugerimos escolher um tamanho maior do que o habitual.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;