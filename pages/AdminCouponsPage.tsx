import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { AdminForm } from '../components/AdminForm';
import { useAdminAPI } from '../hooks/useAdminAPI';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses?: number;
  used_count?: number;
  expires_at?: string;
  active: boolean;
  created_at: string;
}

interface AdminCouponsPageProps {
  onNavigateHome: () => void;
}

export default function AdminCouponsPage({ onNavigateHome }: AdminCouponsPageProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const { fetchCoupons, createCoupon, updateCoupon, deleteCoupon, loading, error } = useAdminAPI();

  useEffect(() => {
    loadCoupons();
  }, [filter]);

  const loadCoupons = async () => {
    try {
      const active = filter === 'active' ? true : filter === 'expired' ? false : undefined;
      const data = await fetchCoupons(active);
      setCoupons(data);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    }
  };

  const handleCreateOrUpdate = async (formData: Record<string, any>) => {
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, formData);
      } else {
        await createCoupon(formData);
      }
      setShowForm(false);
      setEditingCoupon(null);
      await loadCoupons();
    } catch (err) {
      console.error('Failed to save coupon:', err);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (confirm('Tem certeza que deseja deletar este cupom?')) {
      try {
        await deleteCoupon(couponId);
        await loadCoupons();
      } catch (err) {
        console.error('Failed to delete coupon:', err);
      }
    }
  };

  const openEditForm = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const columns = [
    { header: 'Código', accessor: 'code' as const },
    {
      header: 'Desconto',
      accessor: (row: Coupon) =>
        row.discount_type === 'percentage'
          ? `${row.discount_value}%`
          : `R$ ${row.discount_value.toFixed(2)}`,
    },
    {
      header: 'Usos',
      accessor: (row: Coupon) => `${row.used_count || 0}${row.max_uses ? ` / ${row.max_uses}` : ''}`,
    },
    {
      header: 'Validade',
      accessor: (row: Coupon) =>
        row.expires_at ? new Date(row.expires_at).toLocaleDateString('pt-BR') : 'Sem validade',
    },
    { header: 'Status', accessor: (row: Coupon) => (row.active ? '✓ Ativo' : '✗ Inativo') },
    {
      header: 'Ações',
      accessor: (row: Coupon) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditForm(row)}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Cupons</h1>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          <Plus size={18} />
          Novo Cupom
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'expired'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-rose-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Expirados'}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      <AdminTable columns={columns} data={coupons} loading={loading} />

      {showForm && (
        <AdminForm
          title={editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
          fields={[
            { name: 'code', label: 'Código', type: 'text', required: true, placeholder: 'ex: DESCONTO10' },
            {
              name: 'discountType',
              label: 'Tipo de Desconto',
              type: 'select',
              required: true,
              options: [
                { value: 'percentage', label: 'Percentual (%)' },
                { value: 'fixed', label: 'Valor Fixo (R$)' },
              ],
            },
            {
              name: 'discountValue',
              label: 'Valor do Desconto',
              type: 'number',
              required: true,
              placeholder: 'ex: 10 (para 10%) ou 50 (para R$ 50)',
            },
            { name: 'maxUses', label: 'Máximo de Usos', type: 'number', placeholder: 'Deixe vazio para ilimitado' },
            { name: 'expiresAt', label: 'Data de Expiração', type: 'text', placeholder: 'YYYY-MM-DD' },
            { name: 'active', label: 'Ativo', type: 'checkbox' },
          ]}
          initialData={editingCoupon || { active: true }}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setShowForm(false)}
          submitLabel={editingCoupon ? 'Atualizar' : 'Criar'}
        />
      )}
    </div>
  );
}
