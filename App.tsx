import React, { useRef, useState, useEffect, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Hero from './components/Hero'; // Keep critical imports eager
import ProductSelector from './components/ProductSelector';
import StandardProductSelector from './components/StandardProductSelector';
import Home from './pages/Home';
import Benefits from './components/Benefits';
import SocialProof from './components/SocialProof';
import Usage from './components/Usage';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ProductGallery from './components/ProductGallery';
import RelatedProducts from './components/RelatedProducts';
import { ArrowDown, MapPin, ChevronLeft, Loader2 } from 'lucide-react';
import { Size, LegalPage, PageView, Product, InfoPageType, CartItem } from './types';
import { PRODUCTS, CATEGORIES } from './data/products';
import { useProducts } from './hooks/useProducts';
import ProductCard from './components/ProductCard';
import { AVAILABLE_COLORS } from './constants'; 

// Lazy Load Non-Critical Components
const CartDrawer = React.lazy(() => import('./components/CartDrawer'));
const SearchOverlay = React.lazy(() => import('./components/SearchOverlay'));
const InfoPage = React.lazy(() => import('./pages/InfoPage'));
const ThankYouPage = React.lazy(() => import('./components/ThankYouPage'));
const Admin = React.lazy(() => import('./pages/Admin'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// --- ROUTING HELPER FUNCTION ---
// Extracts state from URL synchronously to avoid "flashing" on load
const getInitialStateFromUrl = (products: Product[] = PRODUCTS) => {
    let path = window.location.pathname;
    
    // Normalize path: remove trailing slash if not root
    if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    // Default State
    let state = {
        page: 'home' as PageView,
        product: null as Product | null,
        category: null as string | null,
        infoPage: null as InfoPageType | null
    };

    if (path === '/' || path === '' || path === '/index.html') {
        return state;
    } 
    else if (path.startsWith('/product/')) {
        const handle = path.split('/product/')[1];
        const product = products.find(p => p.handle === handle);
        if (product) {
            state.page = 'product';
            state.product = product;
        } else {
            // 404 -> Home (will replace history later if needed, but for render, show home)
            state.page = 'home';
        }
    } 
    else if (path.startsWith('/category/')) {
        const catId = path.split('/category/')[1];
        const category = CATEGORIES.find(c => c.id === catId);
        if (category) {
            state.page = 'category';
            state.category = catId;
        }
    } 
    else if (path.startsWith('/pages/')) {
        const pageType = path.split('/pages/')[1] as InfoPageType;
        if (pageType) {
            state.page = 'info';
            state.infoPage = pageType;
        }
    }
    else if (path === '/obrigada') {
        state.page = 'thank_you';
    }
    else if (path === '/admin') {
        state.page = 'admin';
    }

    return state;
};

const App: React.FC = () => {
  const selectorRef = useRef<HTMLDivElement>(null);
  
  // --- FETCH PRODUCTS FROM API ---
  const { products: apiProducts, loading: productsLoading, error: productsError } = useProducts();
  
  // --- STATE MANAGEMENT ---

  // Cart State with LocalStorage Persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
        const saved = localStorage.getItem('cart_items');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  // Save to LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // --- NAVIGATION STATE INITIALIZATION ---
  // We initialize state using the helper function so the FIRST render matches the URL.
  // Use apiProducts if loaded, otherwise fallback to static PRODUCTS
  const initialState = getInitialStateFromUrl(apiProducts.length > 0 ? apiProducts : PRODUCTS);

  const [currentPage, setCurrentPage] = useState<PageView>(initialState.page);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(initialState.product);
  const [currentCategory, setCurrentCategory] = useState<string | null>(initialState.category);
  const [currentInfoPage, setCurrentInfoPage] = useState<InfoPageType | null>(initialState.infoPage);

  // Update state based on URL (for PopState/Back button)
  const updateStateFromUrl = () => {
      const newState = getInitialStateFromUrl(apiProducts.length > 0 ? apiProducts : PRODUCTS);
      setCurrentPage(newState.page);
      setCurrentProduct(newState.product);
      setCurrentCategory(newState.category);
      setCurrentInfoPage(newState.infoPage);
  };

  // Handle Browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
        updateStateFromUrl();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- NAVIGATION HELPER ---
  const navigateTo = (url: string) => {
    if (window.location.pathname !== url) {
        window.history.pushState({}, '', url);
        updateStateFromUrl();
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Actions wrapped with Navigation Logic
  const handleProductClick = (product: Product) => {
    navigateTo(`/product/${product.handle}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigateTo(`/category/${categoryId}`);
  };

  const handleNavigateHome = () => {
    navigateTo('/');
  };

  const handleNavigateInfo = (page: InfoPageType) => {
      navigateTo(`/pages/${page}`);
  };

  const handleNavigateThankYou = () => {
      navigateTo('/obrigada');
  };

  const handleNavigateAdmin = () => {
      navigateTo('/admin');
  };

  // Bridge for Header's "LegalPage" type to our new "InfoPageType"
  const handleHeaderLegalClick = (page: LegalPage) => {
      if (page === 'tracking') handleNavigateInfo('tracking');
      else if (page === 'returns') handleNavigateInfo('exchanges');
      else if (page === 'privacy') handleNavigateInfo('privacy');
      else if (page === 'terms') handleNavigateInfo('terms');
  };

  const handleAddToCart = (size: Size, colors?: string[]) => {
      if (!currentProduct) return;

      // LÓGICA DE SUBSTITUIÇÃO:
      // Removemos qualquer item anterior e deixamos apenas o novo item no carrinho.
      // Isso evita conflitos de checkout com múltiplos produtos.
      
      const newItem: CartItem = {
          product: currentProduct,
          size,
          colors,
          quantity: 1
      };

      setCartItems([newItem]); // Substitui o array inteiro pelo novo item
      setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
      setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // Render Admin separately to avoid layout wrapping
  if (currentPage === 'admin') {
      return (
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
              <Admin onNavigateHome={handleNavigateHome} />
          </Suspense>
      );
  }

  return (
    <AdminRouting
      currentPage={currentPage}
      handleNavigateHome={handleNavigateHome}
      handleNavigateInfo={handleNavigateInfo}
      handleNavigateThankYou={handleNavigateThankYou}
      handleNavigateAdmin={() => navigateTo('/admin')}
      currentProduct={currentProduct}
      currentCategory={currentCategory}
      currentInfoPage={currentInfoPage}
      cartItems={cartItems}
      isCartOpen={isCartOpen}
      isSearchOpen={isSearchOpen}
      setIsCartOpen={setIsCartOpen}
      setIsSearchOpen={setIsSearchOpen}
      handleProductClick={handleProductClick}
      handleCategoryClick={handleCategoryClick}
      handleAddToCart={handleAddToCart}
      handleRemoveFromCart={handleRemoveFromCart}
      handleHeaderLegalClick={handleHeaderLegalClick}
      apiProducts={apiProducts}
      selectorRef={selectorRef}
    />
  );
};

// === ADMIN ROUTING COMPONENT ===
interface AdminRoutingProps {
  currentPage: PageView;
  handleNavigateHome: () => void;
  handleNavigateInfo: (page: InfoPageType) => void;
  handleNavigateThankYou: () => void;
  handleNavigateAdmin: () => void;
  currentProduct: Product | null;
  currentCategory: string | null;
  currentInfoPage: InfoPageType | null;
  cartItems: CartItem[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  handleProductClick: (product: Product) => void;
  handleCategoryClick: (categoryId: string) => void;
  handleAddToCart: (size: Size, colors?: string[]) => void;
  handleRemoveFromCart: (index: number) => void;
  handleHeaderLegalClick: (page: LegalPage) => void;
  apiProducts: Product[];
  selectorRef: React.RefObject<HTMLDivElement>;
}

const AdminRouting: React.FC<AdminRoutingProps> = (props) => {
  const { isAuthenticated } = useAuth();

  // Admin Routes (no footer/header)
  if (props.currentPage === 'admin' && !isAuthenticated) {
    return (
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
        <AdminLogin onLoginSuccess={() => props.handleNavigateAdmin()} />
      </Suspense>
    );
  }

  if (props.currentPage === 'admin' && isAuthenticated) {
    return (
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
        <PrivateRoute>
          <AdminDashboard onNavigateHome={props.handleNavigateHome} />
        </PrivateRoute>
      </Suspense>
    );
  }

  // Store Routes (with footer/header)
  return (
    <div className="min-h-screen bg-[#FFFBFB] text-gray-900 font-sans pb-20 md:pb-0 selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden w-full">
      
      {/* Search Overlay (Lazy) */}
      <Suspense fallback={null}>
        {props.isSearchOpen && (
            <SearchOverlay 
                isOpen={props.isSearchOpen}
                onClose={() => props.setIsSearchOpen(false)}
                onProductClick={props.handleProductClick}
            />
        )}
      </Suspense>

      {/* Cart Drawer (Lazy) */}
      <Suspense fallback={null}>
        {props.isCartOpen && (
            <CartDrawer 
                isOpen={props.isCartOpen} 
                onClose={() => props.setIsCartOpen(false)} 
                cartItems={props.cartItems} 
                onRemoveItem={props.handleRemoveFromCart}
            />
        )}
      </Suspense>

      {/* Announcement Bar */}
      <div className="bg-gray-900 text-white text-center py-2 px-4 flex items-center justify-center gap-2">
        <MapPin size={12} className="text-rose-300" />
        <span className="text-[10px] md:text-xs font-medium tracking-wide">
          ENVIAMOS PARA TODO BRASIL <span className="mx-1 opacity-50">|</span> FRETE GRÁTIS
        </span>
      </div>

      {/* Header with Navigation */}
      <Header 
        onOpenLegal={props.handleHeaderLegalClick} 
        onNavigateHome={props.handleNavigateHome} 
        onNavigateCategory={props.handleCategoryClick}
        cartCount={props.cartItems.length}
        onOpenCart={() => props.setIsCartOpen(true)}
        onOpenSearch={() => props.setIsSearchOpen(true)}
      />

      {/* === HOMEPAGE === */}
      {props.currentPage === 'home' && (
        <Home products={props.apiProducts} onProductClick={props.handleProductClick} onCategoryClick={props.handleCategoryClick} />
      )}

      {/* === INFO / LEGAL PAGES === */}
      {props.currentPage === 'info' && props.currentInfoPage && (
          <div className="min-h-[60vh]">
             <div className="max-w-4xl mx-auto px-4 pt-8">
                <button onClick={props.handleNavigateHome} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-4">
                    <ChevronLeft size={16} /> Voltar para Loja
                </button>
             </div>
             <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400"/></div>}>
                <InfoPage type={props.currentInfoPage} />
             </Suspense>
          </div>
      )}

      {/* === THANK YOU PAGE === */}
      {props.currentPage === 'thank_you' && (
          <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400"/></div>}>
            <ThankYouPage onNavigateHome={props.handleNavigateHome} />
          </Suspense>
      )}

      {/* === CATEGORY PAGE === */}
      {props.currentPage === 'category' && props.currentCategory && (
         <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh] animate-in fade-in slide-in-from-bottom-2">
            <div className="mb-6">
                 <button onClick={props.handleNavigateHome} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-4">
                    <ChevronLeft size={16} /> Voltar para Loja
                </button>
                <h1 className="text-3xl font-serif text-gray-900">
                    {CATEGORIES.find(c => c.id === props.currentCategory)?.name}
                </h1>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                {props.apiProducts.filter(p => {
                    if (props.currentCategory === 'kits') return p.isKit;
                    if (props.currentCategory === 'conjuntos') return p.category === 'Conjuntos';
                    if (props.currentCategory === 'vestidos') return p.category === 'Vestidos';
                    return false;
                }).map(product => (
                    <ProductCard key={product.id} product={product} onClick={props.handleProductClick} />
                ))}
            </div>
            
            {props.apiProducts.filter(p => {
                 if (props.currentCategory === 'kits') return p.isKit;
                 if (props.currentCategory === 'conjuntos') return p.category === 'Conjuntos';
                 if (props.currentCategory === 'vestidos') return p.category === 'Vestidos';
                 return false;
            }).length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    Nenhum produto encontrado nesta categoria no momento.
                </div>
            )}
         </div>
      )}

      {/* === PRODUCT PAGE === */}
      {props.currentPage === 'product' && props.currentProduct && (
        <div className="animate-in fade-in duration-300">
            {/* Breadcrumb / Back */}
            <div className="px-4 py-4 max-w-7xl mx-auto">
                <button onClick={props.handleNavigateHome} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    <ChevronLeft size={16} /> Voltar para Loja
                </button>
            </div>

            {/* PRODUCT LAYOUT CONTAINER */}
            <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* LEFT COLUMN: IMAGES */}
                <div className="md:col-span-7 w-full flex flex-col items-center">
                    <ProductGallery images={props.currentProduct.images} title={props.currentProduct.title} />
                    
                    {/* Benefits shown below image on desktop */}
                    <div className="hidden md:block mt-8 w-full">
                        <Benefits />
                    </div>
                </div>

                {/* RIGHT COLUMN: BUY BOX */}
                <div className="md:col-span-5 w-full flex flex-col items-center">
                    {props.currentProduct.isKit ? (
                        <ProductSelector 
                            product={props.currentProduct}
                            onSelectionComplete={() => {}} 
                            onAddToCart={props.handleAddToCart}
                            id="main-selector" 
                        />
                    ) : (
                        <StandardProductSelector 
                            product={props.currentProduct}
                            onAddToCart={(size) => props.handleAddToCart(size)}
                        />
                    )}
                    
                    {/* Mobile Only Benefits position (Fixed Centering) */}
                    <div className="md:hidden mt-8 w-full">
                        <Benefits />
                    </div>
                </div>
            </div>

            {/* SECTIONS BELOW FOLD */}
            
            <div className="mt-12 border-t border-gray-100 pt-12">
                 <SocialProof product={props.currentProduct} /> 
                 {props.currentProduct.isKit && <Usage />} 
            </div>
            
            {/* Urgency Section (Common) */}
            <section className="py-12 px-4 bg-white text-center border-t border-gray-100 mt-8">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
                    <h2 className="text-2xl font-serif text-gray-900 mb-3">Últimas peças do estoque</h2>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                        Como nossa loja física tem muita saída, o estoque do site é compartilhado e pode acabar a qualquer momento.
                    </p>
                </div>
            </section>
            
            <FAQ />

            {/* Related Products */}
            <RelatedProducts 
                currentProduct={props.currentProduct}
                onProductClick={props.handleProductClick}
            />
        </div>
      )}

      {/* Footer */}
      <Footer 
        onNavigateInfo={props.handleNavigateInfo}
        onNavigateAdmin={() => props.handleNavigateAdmin()} 
      />
    </div>
  );
};
};

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
