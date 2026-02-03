import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { AdminForm } from '../components/AdminForm';
import { useAdminAPI } from '../hooks/useAdminAPI';
import { Category } from '../types';

interface AdminCategoriesPageProps {
  onNavigateHome: () => void;
}

export default function AdminCategoriesPage({ onNavigateHome }: AdminCategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { fetchCategories, createCategory, loading, error } = useAdminAPI();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleCreateOrUpdate = async (formData: Record<string, any>) => {
    try {
      await createCategory(formData);
      setShowForm(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const columns = [
    { header: 'Nome', accessor: 'name' as const },
    { header: 'Slug', accessor: 'slug' as const },
    { header: 'Posição', accessor: 'order_position' as const },
    { header: 'Ativo', accessor: (row: Category) => row.active ? 'Sim' : 'Não' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Categorias</h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          <Plus size={18} />
          Nova Categoria
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      <AdminTable columns={columns} data={categories} loading={loading} />

      {showForm && (
        <AdminForm
          title="Nova Categoria"
          fields={[
            { name: 'name', label: 'Nome', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text', required: true },
            { name: 'description', label: 'Descrição', type: 'textarea' },
            { name: 'imageUrl', label: 'URL da Imagem', type: 'image' },
            { name: 'orderPosition', label: 'Posição', type: 'number' },
            { name: 'active', label: 'Ativo', type: 'checkbox' },
          ]}
          initialData={editingCategory || {}}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setShowForm(false)}
          submitLabel="Criar"
        />
      )}
    </div>
  );
}
