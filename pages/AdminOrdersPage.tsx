import React, { useState, useEffect } from 'react';
import { Eye, Download } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { useAdminAPI } from '../hooks/useAdminAPI';
import { Order } from '../types';

interface AdminOrdersPageProps {
  onNavigateHome: () => void;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  limit: number;
  offset: number;
}

export default function AdminOrdersPage({ onNavigateHome }: AdminOrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'shipped'>('all');
  const [loading, setLoading] = useState(false);
  const { loading: apiLoading, error } = useAdminAPI();

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      if (!token) throw new Error('Not authenticated');

      const query = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/.netlify/functions/orders${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load orders');

      const data: OrdersResponse = await response.json();
      setOrders(data.orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      refunded: 'bg-gray-100 text-gray-800',
      canceled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { header: 'ID', accessor: 'id' as const, width: 'w-24' },
    { header: 'Cliente', accessor: 'customerName' as const },
    { header: 'Email', accessor: 'customerEmail' as const },
    { header: 'Total', accessor: (row: Order) => `R$ ${row.totalPrice.toFixed(2)}` },
    {
      header: 'Status',
      accessor: (row: Order) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(row.status)}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      header: 'Data',
      accessor: (row: Order) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString('pt-BR') : '-',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pedidos</h1>
        <button
          onClick={() => {
            const csv = generateCSV(orders);
            downloadCSV(csv, 'pedidos.csv');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download size={18} />
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'paid', 'shipped'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-rose-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      <AdminTable columns={columns} data={orders} loading={loading || apiLoading} onRowClick={setSelectedOrder} />

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Pedido #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Informações do Cliente</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Nome</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{selectedOrder.customerEmail}</p>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div>
                      <p className="text-gray-600">Telefone</p>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Informações do Pedido</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className={`font-medium ${getStatusBadge(selectedOrder.status).split(' ')[1]}`}>
                      {selectedOrder.status.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-medium">R$ {selectedOrder.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Data</p>
                    <p className="font-medium">
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')
                        : '-'}
                    </p>
                  </div>
                  {selectedOrder.trackingCode && (
                    <div>
                      <p className="text-gray-600">Código de Rastreio</p>
                      <p className="font-medium">{selectedOrder.trackingCode}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                        <p className="font-medium text-gray-900">{item.name || 'Produto'}</p>
                        <p className="text-gray-600">Quantidade: {item.quantity}</p>
                        {item.price && <p className="text-gray-600">Preço: R$ {item.price.toFixed(2)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Notas</h3>
                  <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateCSV(orders: Order[]): string {
  const headers = ['ID', 'Cliente', 'Email', 'Telefone', 'Total', 'Status', 'Data'];
  const rows = orders.map((order) => [
    order.id,
    order.customerName,
    order.customerEmail,
    order.customerPhone || '-',
    order.totalPrice.toFixed(2),
    order.status,
    order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : '-',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}
