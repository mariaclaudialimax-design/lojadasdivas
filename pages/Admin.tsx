import React, { useState, useEffect } from 'react';
import { AdminView, Product } from '../types';
import { Package, Layout, ShoppingCart, Settings, LogOut, Plus, Search, Edit2, Trash2, ExternalLink, ArrowLeft, BarChart3, Users, DollarSign } from 'lucide-react';
import { fetchAdminProducts, saveProduct, deleteProduct, fetchRecentOrders, Order } from '../services/adminService';
import AdminSettingsPage from './AdminSettingsPage';

interface AdminProps {
  onNavigateHome: () => void;
}

const Admin: React.FC<AdminProps> = ({ onNavigateHome }) => {
  const [view, setView] = useState<AdminView>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth State (Mock)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Initialize Data
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    const p = await fetchAdminProducts();
    const o = await fetchRecentOrders();
    setProducts(p);
    setOrders(o);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'teste' && password === 'teste') {
      setIsAuthenticated(true);
      setView('dashboard');
    } else {
      setError('Credenciais inválidas. Tente teste/teste');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('login');
    setEmail('');
    setPassword('');
  };

  // --- SUB-COMPONENTS ---

  const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="opacity-80" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  // --- VIEWS ---

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Store</h1>
            <p className="text-sm text-gray-500">Acesso restrito a administradores</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Login</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">
              ENTRAR
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={onNavigateHome} className="text-sm text-gray-500 hover:text-gray-900 underline">
              Voltar para Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F2F4] flex font-sans">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 fixed h-full z-10">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>

        <nav className="p-4 space-y-1">
          <SidebarItem icon={BarChart3} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <SidebarItem icon={Package} label="Produtos" active={view === 'products'} onClick={() => setView('products')} />
          <SidebarItem icon={Layout} label="Conteúdo (CMS)" active={view === 'cms'} onClick={() => setView('cms')} />
          <SidebarItem icon={ShoppingCart} label="Pedidos" active={view === 'orders'} onClick={() => setView('orders')} />
          <SidebarItem icon={Settings} label="Configurações" active={view === 'settings'} onClick={() => setView('settings')} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onNavigateHome} className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3 px-2">
            <ExternalLink size={16} /> Ver Loja
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-2">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">

        {/* DASHBOARD VIEW */}
        {view === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
              <p className="text-gray-500">Bem-vindo de volta, Admin.</p>
            </header>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <StatCard title="Vendas Totais" value="R$ 12.450,00" icon={DollarSign} color="bg-green-100 text-green-700" />
              <StatCard title="Pedidos" value="142" icon={ShoppingCart} color="bg-blue-100 text-blue-700" />
              <StatCard title="Produtos Ativos" value={products.length} icon={Package} color="bg-purple-100 text-purple-700" />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Pedidos Recentes</h2>
                <button className="text-sm text-blue-600 hover:underline">Ver todos</button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Pedido</th>
                    <th className="px-6 py-3 font-medium">Cliente</th>
                    <th className="px-6 py-3 font-medium">Data</th>
                    <th className="px-6 py-3 font-medium">Total</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 text-gray-900 font-bold">R$ {order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {order.status === 'paid' ? 'Pago' : order.status === 'shipped' ? 'Enviado' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS VIEW */}
        {view === 'products' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
                <p className="text-gray-500">Gerencie seu catálogo</p>
              </div>
              <button
                onClick={() => alert("Funcionalidade de Criar Produto (Abre Modal de Edição Limpo)")}
                className="bg-gray-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> Adicionar Produto
              </button>
            </header>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100 flex gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder="Buscar produtos..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" />
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium w-16">Img</th>
                    <th className="px-6 py-3 font-medium">Título</th>
                    <th className="px-6 py-3 font-medium">Categoria</th>
                    <th className="px-6 py-3 font-medium">Preço</th>
                    <th className="px-6 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-3">
                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden">
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-3 text-gray-500">{product.category}</td>
                      <td className="px-6 py-3 text-gray-900">R$ {product.price.toFixed(2)}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Editar">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id).then(loadData)}
                            className="p-1 hover:bg-red-50 rounded text-red-500"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CMS VIEW (Placeholder) */}
        {view === 'cms' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Editor de Conteúdo</h1>
              <p className="text-gray-500">Personalize a Home e Páginas Institucionais</p>
            </header>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Layout size={24} />
                  </div>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">Home</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">Editar Homepage</h3>
                <p className="text-sm text-gray-500 mt-2">Alterar banners, textos de destaque e ordem das seções.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <Layout size={24} />
                  </div>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">Páginas</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600">Páginas Institucionais</h3>
                <p className="text-sm text-gray-500 mt-2">Gerenciar Sobre Nós, Políticas e FAQ.</p>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {view === 'settings' && (
          <div className="animate-in fade-in duration-300">
            <AdminSettingsPage onNavigateHome={onNavigateHome} />
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
