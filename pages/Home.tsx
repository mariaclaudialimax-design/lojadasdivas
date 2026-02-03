
import React from 'react';
import { Product, Category } from '../types';
import { PRODUCTS, CATEGORIES as FALLBACK_CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Star, Loader2 } from 'lucide-react';
import { useHomeSections } from '../hooks/useHomeSections';
import { useCategories } from '../hooks/useCategories';

interface HomeProps {
    products?: Product[];
    onProductClick: (product: Product) => void;
    onCategoryClick: (categoryId: string) => void;
}

const Home: React.FC<HomeProps> = ({ products = PRODUCTS, onProductClick, onCategoryClick }) => {
    const { sections, loading: sectionsLoading } = useHomeSections();
    const { categories: apiCategories, loading: catsLoading } = useCategories();

    const displayProducts = products.length > 0 ? products : PRODUCTS;

    const categories = apiCategories.length > 0 ? apiCategories : FALLBACK_CATEGORIES.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.id,
        imageUrl: c.image,
        active: true,
        orderPosition: 0
    }));

    if ((sectionsLoading || catsLoading) && sections.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-rose-500 w-10 h-10" />
                <p className="text-gray-400 text-sm animate-pulse">Carregando sua vitrine...</p>
            </div>
        );
    }

    return (
        <div className="pb-12">
            {/* Dynamic Sections from Backend */}
            {sections.length > 0 ? (
                sections.map((section) => (
                    <div key={section.id}>
                        {section.section_type === 'banner' && section.data && (
                            <section
                                className="relative w-full cursor-pointer group overflow-hidden"
                                onClick={() => {
                                    if (section.data.link) {
                                        // Logic to handle link navigation could be passed as prop if needed
                                        // For now, if it's a product handle, we could find it
                                        if (section.data.link.includes('/product/')) {
                                            const handle = section.data.link.split('/product/')[1];
                                            const p = displayProducts.find(p => p.handle === handle);
                                            if (p) onProductClick(p);
                                        } else if (section.data.link.includes('/category/')) {
                                            const catId = section.data.link.split('/category/')[1];
                                            onCategoryClick(catId);
                                        }
                                    }
                                }}
                            >
                                <img
                                    src={section.data.image_mobile || section.data.image}
                                    alt={section.title}
                                    className="w-full h-auto object-cover md:hidden min-h-[500px]"
                                />
                                <img
                                    src={section.data.image_desktop || section.data.image}
                                    alt={section.title}
                                    className="hidden md:block w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-end md:items-center pb-12 md:pb-0">
                                    <div className="container mx-auto px-4 md:px-8">
                                        <div className="max-w-lg text-white md:pl-12">
                                            <h1 className="text-5xl md:text-7xl font-serif mb-4 leading-tight">{section.title}</h1>
                                            <p className="text-gray-100 text-sm md:text-lg mb-8 max-w-sm">{section.description || section.data.description}</p>
                                            {section.data.button_text && (
                                                <button className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full flex items-center gap-2">
                                                    {section.data.button_text} <ArrowRight size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {section.section_type === 'grid' && section.data && (
                            <section className="py-12 px-4 max-w-7xl mx-auto">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">{section.title}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {displayProducts
                                        .filter(p => !section.data.category || section.data.category === 'all' || p.category === section.data.category || p.categoryId === section.data.category)
                                        .slice(0, section.data.limit || 4)
                                        .map(product => (
                                            <ProductCard key={product.id} product={product} onClick={onProductClick} />
                                        ))}
                                </div>
                            </section>
                        )}
                    </div>
                ))
            ) : (
                /* Fallback Static Content (Original Layout) */
                <>
                    <section className="relative w-full cursor-pointer group overflow-hidden">
                        <img src="https://cdn.shopify.com/s/files/1/0809/1274/4673/files/heronew.png?v=1770054480" className="w-full h-auto object-cover md:hidden min-h-[500px]" onClick={() => onProductClick(displayProducts[0])} />
                        <img src="https://cdn.shopify.com/s/files/1/0773/0148/1696/files/bannerdesktopibiza-698133c8acf7c.webp?v=1770075089" className="hidden md:block w-full h-auto object-cover" onClick={() => onProductClick(displayProducts[0])} />
                    </section>

                    <section className="py-10 px-4">
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Categorias</h2>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {categories.map(cat => (
                                    <div key={cat.id} onClick={() => onCategoryClick(cat.id)} className="flex-shrink-0 w-28 md:w-40 cursor-pointer">
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border shadow-sm">
                                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-center mt-2 text-sm font-medium">{cat.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="py-12 px-4 max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Destaques</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                            {displayProducts.slice(0, 8).map(product => (
                                <ProductCard key={product.id} product={product} onClick={onProductClick} />
                            ))}
                        </div>
                    </section>
                </>
            )}

            {/* Trust Banner - Static */}
            <section className="bg-gray-900 text-white py-12 px-4 mt-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Loja Física</h3>
                        <p className="text-sm text-gray-400">Compre com segurança.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Envio Rápido</h3>
                        <p className="text-sm text-gray-400">Postagem em 24h.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Troca Fácil</h3>
                        <p className="text-sm text-gray-400">Primeira troca grátis.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;