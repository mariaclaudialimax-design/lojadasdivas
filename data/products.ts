import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // O Produto Original (Mantido com destaque)
  {
    id: 'kit-ibiza',
    externalId: 'e3284dde-2a39-490b-9b41-28305d2e0a77', // ID específico para DataLayer/Checkout
    handle: 'kit-3-camisas-ibiza-em-linho-de-algodao',
    title: 'Kit 3 Camisas Ibiza em Linho de Algodão',
    description: 'O Kit 3 Camisas Ibiza em Linho de Algodão é ideal para quem busca leveza, conforto e elegância no dia a dia.',
    category: 'Kits Promocionais',
    price: 109.90,
    oldPrice: 297.00,
    images: [
      'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_3si0m13si0m13si0.png?v=1770007798', // Principal: Verde Sálvia (Frente)
      'https://cdn.shopify.com/s/files/1/0773/0148/1696/files/gemini-generated-image-1udnr91udnr91udn-6981409358279-698141d2dd466.jpg?v=1770078753', // Modelo Pousada
      'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_6uri3j6uri3j6uri.png?v=1770007797', // Azul Sereno (Frente)
      'https://cdn.shopify.com/s/files/1/0773/0148/1696/files/gemini-generated-image-wcpin0wcpin0wcpi-698141d272f87.webp?v=1770078753', // Modelo Close
      'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/Gemini_Generated_Image_asp7k2asp7k2asp7.png?v=1770007797', // Terracota (Frente)
      'https://cdn.shopify.com/s/files/1/0773/0148/1696/files/gemini-generated-image-qxbfkqxbfkqxbfkq-698141d331125.webp?v=1770078753', // Modelo Detalhe
      'https://cdn.shopify.com/s/files/1/0773/0148/1696/files/gemini-generated-image-x1c9oex1c9oex1c9-698141d24e2f3.webp?v=1770078753'  // Modelo Textura
    ],
    sizes: ['PP', 'P', 'M', 'G', 'GG', '3G', '4G', '5G'],
    installments: '12x de R$ 10,96',
    isKit: true,
    checkoutUrl: 'https://compra.lojadasdivas.com.br/pay/b6ba4039-5b33-4ba4-aaea-8a3e8d10098a'
  },
  // Conjuntos
  {
    id: 'cj-babados-marrom',
    handle: 'conjunto-regata-e-saia-longa-babados-marrom',
    title: 'Conjunto Regata e Saia Longa Babados Marrom',
    description: 'A Saia Longa Babados é a escolha perfeita para quem busca elegância e conforto nos dias quentes.',
    category: 'Conjuntos',
    price: 99.90,
    oldPrice: 142.71,
    images: [
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/marrom1_18731aac-7308-47ff-8098-6868edcc6d56.jpg?v=1769027431',
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/marrom2_68664ec8-5c57-4c88-8a5d-4a7691332c11.jpg?v=1769027431'
    ],
    sizes: ['PPP', 'PP', 'P', 'M', 'GG'],
    installments: '3x sem juros',
    isKit: false,
    variantUrls: {
      'PPP': 'https://compra.lojadasdivas.com.br/pay/5c3b8ead-c039-451f-99bd-29e424708dc1',
      'PP': 'https://compra.lojadasdivas.com.br/pay/90956b83-0c3b-4e30-a015-1ceff0906ed8',
      'P': 'https://compra.lojadasdivas.com.br/pay/a0bff8b6-7004-4373-b649-9d5afef4c891',
      'M': 'https://compra.lojadasdivas.com.br/pay/31144fa0-631b-4106-9c98-b41987767be1',
      'GG': 'https://compra.lojadasdivas.com.br/pay/64f05064-9f8a-4397-89d9-9ad111413d08'
    }
  },
  {
    id: 'cj-babados-lima',
    handle: 'conjunto-regata-e-saia-longa-babados-lima',
    title: 'Conjunto Regata e Saia Longa Babados Lima',
    description: 'Confeccionada em um tecido leve e respirável, esta saia proporciona frescor e liberdade de movimentos.',
    category: 'Conjuntos',
    price: 99.90,
    oldPrice: 142.71,
    images: [
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/2_c8e9ecc9-ce1c-421f-b040-2457818ea6af.jpg?v=1769027348',
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/lima1.jpg?v=1769027348'
    ],
    sizes: ['PPP', 'PP', 'P', 'M', 'G', 'GG'],
    installments: '3x sem juros',
    isKit: false,
    variantUrls: {
      'PPP': 'https://compra.lojadasdivas.com.br/pay/bf608024-f079-4441-a0ac-03b5c6aec618',
      'PP': 'https://compra.lojadasdivas.com.br/pay/b5b2bad0-5dec-4a73-9ceb-c6d7331daf59',
      'P': 'https://compra.lojadasdivas.com.br/pay/bad6bce5-ac7e-452a-ae6f-5cd174a9cb90',
      'M': 'https://compra.lojadasdivas.com.br/pay/8f711a44-ca11-433a-bad7-9a905b48354e',
      'G': 'https://compra.lojadasdivas.com.br/pay/ebc3617d-f437-4a11-b79f-452c71d31d60',
      'GG': 'https://compra.lojadasdivas.com.br/pay/f9ae17e3-5ea2-4f11-aca9-dca3ee626c24'
    }
  },
  {
    id: 'cj-colete-amarelo',
    handle: 'conjunto-colete-e-calca-amarelo-manteiga',
    title: 'Conjunto Colete e Calça Amarelo Manteiga',
    description: 'O Conjunto Colete e Calça é a união entre elegância e leveza. O colete de alfaiataria valoriza a silhueta.',
    category: 'Conjuntos',
    price: 300.30,
    oldPrice: 420.00,
    images: [
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/amarelo1_81bd7c4d-2681-47b1-a7b7-7c66c39bcebb.jpg?v=1769025994',
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/amarelo2_a8dae40f-b1b9-4967-9464-a4933139c9b2.jpg?v=1769025995'
    ],
    sizes: ['PPP', 'PP', 'P', 'M', 'G', 'GG'],
    installments: '12x de R$ 30,03',
    isKit: false,
    variantUrls: {
      'PPP': 'https://compra.lojadasdivas.com.br/pay/947762e2-6aca-4c00-8f2d-622d96a39386',
      'PP': 'https://compra.lojadasdivas.com.br/pay/cf472969-041b-4cb7-bf52-52be3ea5cd87',
      'P': 'https://compra.lojadasdivas.com.br/pay/99a7f471-9579-45a6-9e1a-5739fcfd3793',
      'M': 'https://compra.lojadasdivas.com.br/pay/d4232dbc-ffdc-4c89-8501-39e37d844f2b',
      'G': 'https://compra.lojadasdivas.com.br/pay/8add8948-a922-4b87-84c7-ecd3204578d4',
      'GG': 'https://compra.lojadasdivas.com.br/pay/aac55639-2856-4dd5-b619-065b41011ce2'
    }
  },
  {
    id: 'cj-assimetrico-azul',
    handle: 'conjunto-assimetrico-babados-azul-marinho',
    title: 'Conjunto Assimétrico Babados Azul Marinho',
    description: 'Composto por saia e blusa assimétricos, este conjunto é confeccionado em malha leve, fluida e com movimento.',
    category: 'Conjuntos',
    price: 272.30,
    oldPrice: 497.00,
    images: [
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/azul3_42a6b23c-b468-44ea-8a29-62d331249b64.jpg?v=1769025823',
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/azul1_8950efac-004e-4779-8dbb-d6839fa89cf0.jpg?v=1769025823'
    ],
    sizes: ['PPP', 'PP', 'P', 'M', 'G', 'GG'],
    installments: '12x de R$ 27,23',
    isKit: false,
    variantUrls: {
      'PPP': 'https://compra.lojadasdivas.com.br/pay/c06a202b-fe79-4ec0-8ab9-27ab9c27715f',
      'PP': 'https://compra.lojadasdivas.com.br/pay/6c20fca7-37a0-4a9b-b6bf-c88104b7422b',
      'P': 'https://compra.lojadasdivas.com.br/pay/b2e4c712-8df1-47c4-96e4-a100a6527f97',
      'M': 'https://compra.lojadasdivas.com.br/pay/d0254290-0aa3-4dd0-81dd-f925148ae957',
      'G': 'https://compra.lojadasdivas.com.br/pay/3f788e5e-64bd-495d-b640-845d9491c9e4',
      'GG': 'https://compra.lojadasdivas.com.br/pay/0eb89c8f-d6bb-4cb5-a44e-074df1a3373e'
    }
  },
  // Vestidos
  {
    id: 'vest-midi-rami-vermelho',
    handle: 'vestido-midi-rami-vermelho',
    title: 'Vestido Midi Rami Vermelho',
    description: 'Confeccionado em tecido rami, conhecido pela sua textura natural e leveza, este vestido combina conforto com um corte elegante.',
    category: 'Vestidos',
    price: 244.30,
    oldPrice: 500.00,
    images: [
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/vermelho1_5e09aea8-c814-4ad3-b0ab-3d727043a6d8.jpg?v=1769025311',
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/vermelho2_4d9aaa88-3be8-4c0c-ab44-971743add11c.jpg?v=1769025311'
    ],
    sizes: ['PPP', 'PP', 'P', 'M', 'G', 'GG'],
    installments: '12x de R$ 24,43',
    isKit: false,
    variantUrls: {
      'PPP': 'https://compra.lojadasdivas.com.br/pay/4c2cf727-926d-42dd-8378-f5f24133ec3c',
      'PP': 'https://compra.lojadasdivas.com.br/pay/b4eeb35b-876e-40d3-ae6b-e08b5757ccb3',
      'P': 'https://compra.lojadasdivas.com.br/pay/728c2ae3-6115-4d3f-b478-d94bc95e0cfc',
      'M': 'https://compra.lojadasdivas.com.br/pay/e621d241-d243-481c-a149-6537a9c04144',
      'G': 'https://compra.lojadasdivas.com.br/pay/38105af3-342b-46fa-8cca-704ed6387a39',
      'GG': 'https://compra.lojadasdivas.com.br/pay/90f553d8-ff4e-4974-a157-66eb7180a094'
    }
  },
  {
    id: 'vest-longo-creme',
    handle: 'vestido-longo-alca-ajustavel-creme',
    title: 'Vestido Longo Alça Ajustável Creme',
    description: 'Fluido e feminino, o Vestido Longo Alças Ajustáveis é ideal para composições leves e cheias de movimento.',
    category: 'Vestidos',
    price: 209.30,
    oldPrice: 500.00,
    images: [
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/creme1.jpg?v=1769025013',
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/creme2.jpg?v=1769025013'
    ],
    sizes: ['PPP', 'PP', 'P', 'M', 'G', 'GG'],
    installments: '12x de R$ 20,93',
    isKit: false,
    variantUrls: {
      'PPP': 'https://compra.lojadasdivas.com.br/pay/35a8cabb-6c3d-4610-bce2-4ce2b47094a5',
      'PP': 'https://compra.lojadasdivas.com.br/pay/bde69051-4d13-4edb-889d-f22d1bd9c654',
      'P': 'https://compra.lojadasdivas.com.br/pay/a802df93-4dcb-4e25-875e-9d6f4066b9cc',
      'M': 'https://compra.lojadasdivas.com.br/pay/7964b150-0537-4c28-8828-c1f9f55fd671',
      'G': 'https://compra.lojadasdivas.com.br/pay/7dfe86b7-662f-438a-a576-43f8a7bad2c4',
      'GG': 'https://compra.lojadasdivas.com.br/pay/48b7ec21-1d6f-4d89-ae54-8b6a9f115865'
    }
  },
  {
    id: 'vest-viscose-azul',
    handle: 'vestido-midi-de-viscose-azul-claro',
    title: 'Vestido Midi de Viscose Azul Claro',
    description: 'Com modelagem ampla e marcações sutis na cintura, valoriza a silhueta sem perder o movimento.',
    category: 'Vestidos',
    price: 195.00,
    oldPrice: 500.00,
    images: [
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/azul1.jpg?v=1769024589',
      'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/azul2.jpg?v=1769024589'
    ],
    sizes: ['PPP', 'PP', 'P', 'M', 'G', 'GG'],
    installments: '12x de R$ 19,50',
    isKit: false,
    variantUrls: {
      'PPP': 'https://compra.lojadasdivas.com.br/pay/50c5029b-674d-4949-8239-e12ee2fa3d6a',
      'PP': 'https://compra.lojadasdivas.com.br/pay/9460d9d8-b29e-4a12-b43a-9bf4677f9ff7',
      'P': 'https://compra.lojadasdivas.com.br/pay/f9b89f89-2d3c-4670-b434-c65534b06a11',
      'M': 'https://compra.lojadasdivas.com.br/pay/d967da85-ef5d-4929-8777-2131ae8b45e8',
      'G': 'https://compra.lojadasdivas.com.br/pay/d3f74f30-af43-40b1-9f60-65154ef45996',
      'GG': 'https://compra.lojadasdivas.com.br/pay/75b34ce3-ae20-4b1d-adea-f950f3e16a73'
    }
  }
];

export const CATEGORIES = [
  { id: 'kits', name: 'Kits Promocionais', image: 'https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480' },
  { id: 'conjuntos', name: 'Conjuntos', image: 'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/marrom1_18731aac-7308-47ff-8098-6868edcc6d56.jpg?v=1769027431' },
  { id: 'vestidos', name: 'Vestidos', image: 'https://cdn.shopify.com/s/files/1/0805/6055/4224/files/vermelho1_5e09aea8-c814-4ad3-b0ab-3d727043a6d8.jpg?v=1769025311' },
];