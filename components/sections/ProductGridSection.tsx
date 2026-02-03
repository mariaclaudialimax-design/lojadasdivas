
import React from 'react';
import { SectionSchema, SectionProps } from '../../types/theme';
import ProductCard from '../ProductCard';
import { useProducts } from '../../hooks/useProducts';

// In a real scenario, this would probably receive products from a context or prop 
// populated by the renderer which fetches data server-side or effectively.
// For now, we use the hook directly, but in a "real" section engine, data fetching strategy matters.

const ProductGridSection: React.FC<SectionProps> = ({ settings }) => {
    const { products: allProducts, loading } = useProducts();

    const {
        title,
        limit,
        columns_desktop,
        columns_mobile,
        category_filter,
        show_view_all
    } = settings;

    // Filter logic
    let displayProducts = allProducts;
    if (category_filter && category_filter !== 'all') {
        displayProducts = allProducts.filter(p =>
            p.category === category_filter ||
            p.categoryId === category_filter ||
            (category_filter === 'kits' && p.isKit)
        );
    }

    // Limit
    displayProducts = displayProducts.slice(0, limit || 8);

    const gridColsDesktop = columns_desktop === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';
    const gridColsMobile = columns_mobile === 1 ? 'grid-cols-1' : 'grid-cols-2';

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            {title && (
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
                    {show_view_all && (
                        <a href="#" className="text-rose-600 font-medium hover:text-rose-700 text-sm hidden md:block">
                            Ver todos
                        </a>
                    )}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-gray-100 rounded-lg aspect-[3/4] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className={`grid ${gridColsMobile} ${gridColsDesktop} gap-x-4 gap-y-8`}>
                    {displayProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => { }} // Navigation handled by card link usually
                        />
                    ))}
                </div>
            )}

            {show_view_all && (
                <div className="mt-8 text-center md:hidden">
                    <a href="#" className="inline-block border border-gray-300 px-6 py-2 rounded-full text-sm font-medium text-gray-700">
                        Ver todos
                    </a>
                </div>
            )}
        </section>
    );
};

export const productGridSchema: SectionSchema = {
    name: "Grid de Produtos",
    settings: [
        {
            id: "title",
            type: "text",
            label: "Título da Seção",
            default: "Destaques"
        },
        {
            id: "category_filter",
            type: "select",
            label: "Categoria",
            default: "all",
            options: [
                { value: "all", label: "Todas" },
                { value: "kits", label: "Kits" },
                { value: "conjuntos", label: "Conjuntos" },
                { value: "vestidos", label: "Vestidos" }
            ]
        },
        {
            id: "limit",
            type: "range",
            label: "Quantidade de Produtos",
            min: 4,
            max: 24,
            step: 4,
            default: 8
        },
        {
            id: "columns_desktop",
            type: "select",
            label: "Colunas (Desktop)",
            default: "4",
            options: [
                { value: "3", label: "3 Colunas" },
                { value: "4", label: "4 Colunas" }
            ]
        },
        {
            id: "columns_mobile",
            type: "select",
            label: "Colunas (Mobile)",
            default: "2",
            options: [
                { value: "1", label: "1 Coluna" },
                { value: "2", label: "2 Colunas" }
            ]
        },
        {
            id: "show_view_all",
            type: "checkbox",
            label: "Mostrar botão 'Ver Todos'",
            default: true
        }
    ]
};

export default ProductGridSection;
