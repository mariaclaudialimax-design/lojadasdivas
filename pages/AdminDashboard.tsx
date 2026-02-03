import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutGrid, Package, Layers, FileText, Home, Settings } from 'lucide-react';

interface AdminDashboardProps {
  onNavigateAdmin?: (section: string) => void;
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateAdmin, onLogout }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
    { icon: Package, label: 'Produtos', id: 'products' },
    { icon: Layers, label: 'Categorias', id: 'categories' },
    { icon: Home, label: 'Home (CMS)', id: 'home' },
    { icon: FileText, label: 'Páginas', id: 'pages' },
    { icon: LayoutGrid, label: 'Pedidos', id: 'orders' },
    { icon: Settings, label: 'Configurações', id: 'settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
              <span className="font-bold">L</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Loja Admin</h1>
              <p className="text-xs text-gray-400">v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigateAdmin?.(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-left text-gray-300 hover:text-white"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4">
          <div className="mb-4 p-3 bg-gray-800 rounded-lg text-sm">
            <p className="text-gray-400 text-xs mb-1">Logado como</p>
            <p className="text-white font-medium truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-white text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600 mb-8">Bem-vindo ao painel de administração</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Produtos', value: '0', color: 'bg-blue-100 text-blue-600' },
              { label: 'Categorias', value: '0', color: 'bg-green-100 text-green-600' },
              { label: 'Pedidos', value: '0', color: 'bg-purple-100 text-purple-600' },
              { label: 'Páginas', value: '0', color: 'bg-yellow-100 text-yellow-600' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color.split(' ')[1]}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Start */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">🚀 Próximos Passos</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                Criar primeiro produto
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                Configurar categorias
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                Personalizar home
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                Adicionar páginas estáticas
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
