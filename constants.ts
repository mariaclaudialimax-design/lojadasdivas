import { ColorOption, FAQItem, Review, Size } from './types';
import { Truck, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export const PRODUCT_NAME = "Kit 3 Camisas Ibiza Premium";
export const SUB_HEADLINE = "O Kit Mais Vendido da Internet";
export const PRICE_OLD = 297.00; // Preço âncora psicológico
export const PRICE_NEW = 109.90;
export const PRICE_PIX = 104.40;
export const INSTALLMENTS = "12x de R$ 10,96";

export const AVAILABLE_SIZES: Size[] = ['PP', 'P', 'M', 'G', 'GG', '3G', '4G', '5G'];

export const AVAILABLE_COLORS: ColorOption[] = [
  { 
    id: 'rosa-malva', 
    name: 'Rosa Malva', 
    hex: '#C6739C',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_8biioq8biioq8bii.png?v=1770007796'
  },
  { 
    id: 'preto-ebano', 
    name: 'Preto Luxo',
    hex: '#1D1D1B',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_eg9mjqeg9mjqeg9m.png?v=1770007796'
  },
  { 
    id: 'vermelho-terracota', 
    name: 'Terracota (Esgotando)', 
    hex: '#B3412E',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_asp7k2asp7k2asp7.png?v=1770007797'
  },
  { 
    id: 'roxo-ametista', 
    name: 'Roxo Festa', 
    hex: '#9342B1',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_wrkgq5wrkgq5wrkg.png?v=1770007796'
  },
  { 
    id: 'amarelo-mostarda', 
    name: 'Mostarda', 
    hex: '#D9B743',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_jelwbdjelwbdjelw.png?v=1770007797'
  },
  { 
    id: 'branco-neve', 
    name: 'Branco Renda', 
    hex: '#F3F4F9',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_gon8c7gon8c7gon8.png?v=1770007796'
  },
  { 
    id: 'azul-sereno', 
    name: 'Azul Sereno', 
    hex: '#5D82A6',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_6uri3j6uri3j6uri.png?v=1770007797'
  },
  { 
    id: 'bege-fendi', 
    name: 'Bege Fendi', 
    hex: '#A39C81',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_lszsbhlszsbhlszs.png?v=1770007796'
  },
  { 
    id: 'verde-salvia', 
    name: 'Verde Sálvia', 
    hex: '#66998E',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_3si0m13si0m13si0.png?v=1770007798'
  },
];

// Organized reviews by category/type
export const REVIEWS_BY_CATEGORY: Record<string, Review[]> = {
  // Reviews for the Kit
  'kits': [
    {
      id: 1,
      name: "Cláudia Ribeiro",
      rating: 5,
      text: "Meninas, podem comprar sem medo! Eu tenho pavor de roupa que aperta a barriga e essa camisa ficou soltinha e elegante. Peguei o kit com 3 cores.",
      timeAgo: "há 22 min",
      verified: true
    },
    {
      id: 2,
      name: "Patrícia Gomes",
      rating: 5,
      text: "Vale muito a pena pelo preço. Só uma dessas no shopping aqui da minha cidade é R$ 200. A cor Terracota é a coisa mais linda do mundo.",
      timeAgo: "há 2 horas",
      verified: true
    },
    {
      id: 3,
      name: "Sônia Maria",
      rating: 5,
      text: "Amei que não precisa passar ferro! Lavei, coloquei no cabide e pronto. O tecido linho com algodão é fresquinho demais.",
      timeAgo: "há 1 dia",
      verified: true
    }
  ],
  
  // Reviews for Sets (Conjuntos)
  'conjuntos': [
    {
      id: 101,
      name: "Fernanda Costa",
      rating: 5,
      text: "Gente, que caimento é esse? O conjunto vestiu super bem, parece roupa de alfaiataria cara. Usei num jantar e recebi vários elogios.",
      timeAgo: "há 5 horas",
      verified: true
    },
    {
      id: 102,
      name: "Roberta Alves",
      rating: 5,
      text: "Comprei o conjunto marrom e a cor é idêntica à foto. O tecido tem um toque macio, não pinica nada. Super recomendo!",
      timeAgo: "há 1 dia",
      verified: true
    },
    {
      id: 103,
      name: "Juliana Martins",
      rating: 4,
      text: "Chegou em 4 dias aqui em Minas. A qualidade da costura me surpreendeu. Vou comprar outras cores com certeza.",
      timeAgo: "há 2 dias",
      verified: true
    }
  ],

  // Reviews for Dresses (Vestidos)
  'vestidos': [
    {
      id: 201,
      name: "Mariana Silva",
      rating: 5,
      text: "Estava com medo de ficar curto pois tenho 1,75m, mas o comprimento midi ficou perfeito! Elegante e comportado na medida.",
      timeAgo: "há 3 horas",
      verified: true
    },
    {
      id: 202,
      name: "Carla Dias",
      rating: 5,
      text: "Tecido encorpado, não marca a celulite e não é transparente (comprei o creme). Me senti uma diva com ele, super fluido.",
      timeAgo: "há 10 horas",
      verified: true
    },
    {
      id: 203,
      name: "Beatriz Lima",
      rating: 5,
      text: "Fresquinho para o verão! Usei com rasteirinha e ficou lindo, mas com salto também fica chique. Entrega super rápida.",
      timeAgo: "há 1 dia",
      verified: true
    }
  ]
};

// Default reviews fallback
export const REVIEWS = REVIEWS_BY_CATEGORY['kits'];

export const FAQS: FAQItem[] = [
  {
    question: "O tecido é transparente?",
    answer: "Não! Nossa trama Premium é encorpada na medida certa. Você pode usar as peças claras sem medo."
  },
  {
    question: "Marca a barriga?",
    answer: "Não. A modelagem 'Confort' foi desenhada justamente para não marcar nada e alongar a silhueta."
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "Postamos em 24h. Para Sul e Sudeste chega em média em 5 dias. Norte e Nordeste cerca de 8 a 10 dias."
  },
  {
    question: "É seguro comprar?",
    answer: "Totalmente. Usamos o mesmo sistema de segurança dos grandes bancos e você recebe código de rastreio no seu WhatsApp."
  }
];

export const BENEFITS = [
  {
    icon: RefreshCw,
    title: "Adeus Ferro de Passar",
    desc: "Tecido tecnológico que não amassa fácil."
  },
  {
    icon: ShieldCheck,
    title: "Disfarça a Barriguinha",
    desc: "Caimento solto que valoriza o corpo."
  },
  {
    icon: Zap,
    title: "Frescor Imediato",
    desc: "Linho com Algodão: sua pele respira."
  },
  {
    icon: Truck,
    title: "Frete Grátis Hoje",
    desc: "Últimas unidades com envio gratuito."
  }
];