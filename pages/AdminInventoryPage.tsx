import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { AdminForm } from '../components/AdminForm';
import { useAdminAPI } from '../hooks/useAdminAPI';
import { useProducts } from '../hooks/useProducts';

interface InventoryLog {
  id: string;
  product_id: string;
  quantity_change: number;
  reason: string;
  admin_email: string;
  created_at: string;
}

interface AdminInventoryPageProps {
  onNavigateHome: () => void;
}

export default function AdminInventoryPage({ onNavigateHome }: AdminInventoryPageProps) {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { fetchInventoryLogs, createInventoryLog, loading, error } = useAdminAPI();
  const { products } = useProducts();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchInventoryLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load inventory logs:', err);
    }
  };

  const handleCreateLog = async (formData: Record<string, any>) => {
    try {
      await createInventoryLog(formData.productId, formData.quantity, formData.reason);
      setShowForm(false);
      await loadLogs();
    } catch (err) {
      console.error('Failed to create inventory log:', err);
    }
  };

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.title} (${p.stock || 0} em estoque)`,
  }));

  const reasonOptions = [
    { value: 'addition', label: 'Adição de Estoque' },
    { value: 'removal', label: 'Remoção de Estoque' },
    { value: 'damaged', label: 'Produtos Danificados' },
    { value: 'lost', label: 'Produtos Perdidos' },
    { value: 'return', label: 'Devolução' },
    { value: 'adjustment', label: 'Ajuste de Inventário' },
  ];

  const columns = [
    { header: 'Produto', accessor: (row: InventoryLog) => {
      const product = products.find(p => p.id === row.product_id);
      return product?.title || 'Produto não encontrado';
    }},
    { header: 'Quantidade', accessor: (row: InventoryLog) => {
      const sign = row.quantity_change > 0 ? '+' : '';
      return `${sign}${row.quantity_change}`;
    }},
    { header: 'Razão', accessor: (row: InventoryLog) => {
      const reason = reasonOptions.find(r => r.value === row.reason)?.label || row.reason;
      return reason;
    }},
    { header: 'Admin', accessor: 'admin_email' as const },
    { header: 'Data', accessor: (row: InventoryLog) => new Date(row.created_at).toLocaleDateString('pt-BR') },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventário</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          <Plus size={18} />
          Novo Ajuste
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      <AdminTable columns={columns} data={logs} loading={loading} />

      {showForm && (
        <AdminForm
          title="Novo Ajuste de Inventário"
          fields={[
            {
              name: 'productId',
              label: 'Produto',
              type: 'select',
              required: true,
              options: productOptions,
            },
            {
              name: 'quantity',
              label: 'Quantidade (positivo = adição, negativo = remoção)',
              type: 'number',
              required: true,
            },
            {
              name: 'reason',
              label: 'Razão',
              type: 'select',
              required: true,
              options: reasonOptions,
            },
          ]}
          onSubmit={handleCreateLog}
          onCancel={() => setShowForm(false)}
          submitLabel="Registrar"
        />
      )}
    </div>
  );
}
