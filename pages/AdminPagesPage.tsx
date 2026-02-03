import React, { useState, useEffect } from 'react';
import { Plus, Edit } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { AdminForm } from '../components/AdminForm';
import { useAdminAPI } from '../hooks/useAdminAPI';
import { Page } from '../types';

interface AdminPagesPageProps {
  onNavigateHome: () => void;
}

export default function AdminPagesPage({ onNavigateHome }: AdminPagesPageProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const { fetchPages, createPage, loading, error } = useAdminAPI();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const data = await fetchPages();
      setPages(data);
    } catch (err) {
      console.error('Failed to load pages:', err);
    }
  };

  const handleCreateOrUpdate = async (formData: Record<string, any>) => {
    try {
      await createPage(formData);
      setShowForm(false);
      setEditingPage(null);
      await loadPages();
    } catch (err) {
      console.error('Failed to save page:', err);
    }
  };

  const columns = [
    { header: 'Título', accessor: 'title' as const },
    { header: 'Slug', accessor: 'slug' as const },
    { header: 'Publicada', accessor: (row: Page) => row.isPublished ? 'Sim' : 'Não' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Páginas</h1>
        <button
          onClick={() => {
            setEditingPage(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          <Plus size={18} />
          Nova Página
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      <AdminTable columns={columns} data={pages} loading={loading} />

      {showForm && (
        <AdminForm
          title={editingPage ? 'Editar Página' : 'Nova Página'}
          fields={[
            { name: 'title', label: 'Título', type: 'text', required: true },
            { name: 'slug', label: 'Slug (URL)', type: 'text', required: true },
            { name: 'content', label: 'Conteúdo', type: 'textarea', required: true },
            { name: 'metaTitle', label: 'Meta Título (SEO)', type: 'text' },
            { name: 'metaDescription', label: 'Meta Descrição (SEO)', type: 'textarea' },
            { name: 'isPublished', label: 'Publicada', type: 'checkbox' },
          ]}
          initialData={editingPage || {}}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setShowForm(false)}
          submitLabel={editingPage ? 'Atualizar' : 'Criar'}
        />
      )}
    </div>
  );
}
