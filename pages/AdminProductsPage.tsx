import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { AdminForm } from '../components/AdminForm';
import { useAdminAPI } from '../hooks/useAdminAPI';
import { Product } from '../types';

interface AdminProductsPageProps {
  onNavigateHome: () => void;
}

export default function AdminProductsPage({ onNavigateHome }: AdminProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { fetchProducts, createProduct, updateProduct, deleteProduct, loading, error } = useAdminAPI();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const handleCreateOrUpdate = async (formData: Record<string, any>) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await deleteProduct(productId);
        await loadProducts();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const columns = [
    { header: 'Título', accessor: 'title' as const },
    { header: 'Preço', accessor: (row: Product) => `R$ ${row.price.toFixed(2)}` },
    { header: 'Estoque', accessor: 'stock' as const },
    { header: 'Ativo', accessor: (row: Product) => row.active ? 'Sim' : 'Não' },
    {
      header: 'Ações',
      accessor: (row: Product) => (
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
        <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          <Plus size={18} />
          Novo Produto
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      <AdminTable columns={columns} data={products} loading={loading} />

      {showForm && (
        <AdminForm
          title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
          fields={[
            { name: 'title', label: 'Título', type: 'text', required: true },
            { name: 'handle', label: 'Handle (URL)', type: 'text', required: true },
            { name: 'description', label: 'Descrição', type: 'textarea' },
            { name: 'price', label: 'Preço', type: 'number', required: true },
            { name: 'stock', label: 'Estoque', type: 'number' },
            {
              name: 'active',
              label: 'Ativo',
              type: 'checkbox',
            },
          ]}
          initialData={editingProduct || {}}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setShowForm(false)}
          submitLabel={editingProduct ? 'Atualizar' : 'Criar'}
        />
      )}
    </div>
  );
}
