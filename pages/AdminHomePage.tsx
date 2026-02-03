
import React, { useState, useEffect } from 'react';
import { HomeSection, useHomeSections } from '../hooks/useHomeSections';
import { Save, Loader2, Edit2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const AdminHomePage: React.FC = () => {
    const { sections: initialSections, loading, error } = useHomeSections();
    const [sections, setSections] = useState<HomeSection[]>([]);
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (initialSections) setSections(initialSections);
    }, [initialSections]);

    const handleUpdateSection = async (sectionId: string, updates: Partial<HomeSection>) => {
        setIsSaving(true);
        setSuccessMessage('');
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch(`/.netlify/functions/home-sections?id=${sectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) throw new Error('Falha ao salvar seção');

            setSections(prev => prev.map(s => s.id === sectionId ? { ...s, ...updates } : s));
            setSuccessMessage('Seção atualizada com sucesso!');
            setEditingSection(null);
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar no banco de dados.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Personalizar Home</h2>
                    <p className="text-gray-600">Gerencie banners e vitrines da página inicial</p>
                </div>
                {successMessage && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200 animate-in fade-in slide-in-from-top-4">
                        <CheckCircle2 size={18} /> {successMessage}
                    </div>
                )}
            </header>

            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{section.section_type}</span>
                                <h3 className="font-bold text-gray-800">{section.title || section.section_key}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        </div>

                        {editingSection === section.id ? (
                            <div className="p-6 space-y-4 animate-in slide-in-from-top-2">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Título da Seção</label>
                                        <input
                                            type="text"
                                            defaultValue={section.title}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            onChange={(e) => section.title = e.target.value}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Descrição / Subtítulo</label>
                                        <input
                                            type="text"
                                            defaultValue={section.description}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            onChange={(e) => section.description = e.target.value}
                                        />
                                    </div>
                                </div>

                                {section.section_type === 'banner' && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Link da Imagem (Desktop)</label>
                                            <input
                                                type="text"
                                                defaultValue={section.data.image_desktop}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-[10px]"
                                                onChange={(e) => section.data.image_desktop = e.target.value}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Link do Botão (URL)</label>
                                            <input
                                                type="text"
                                                defaultValue={section.data.link}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                onChange={(e) => section.data.link = e.target.value}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setEditingSection(null)}
                                        className="text-gray-500 text-sm font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleUpdateSection(section.id, section)}
                                        disabled={isSaving}
                                        className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 disabled:bg-gray-400"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Salvar Alterações
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6">
                                <p className="text-sm text-gray-500 italic">Visualização resumida. Clique em editar para alterar o conteúdo.</p>
                            </div>
                        )}
                    </div>
                ))}

                {sections.length === 0 && (
                    <div className="p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhuma seção configurada no banco de dados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHomePage;
