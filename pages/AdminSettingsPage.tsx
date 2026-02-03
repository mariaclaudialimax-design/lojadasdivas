
import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useSettings, SiteSettings } from '../hooks/useSettings';
import { AdminForm } from '../components/AdminForm';

interface AdminSettingsPageProps {
    onNavigateHome: () => void;
}

export default function AdminSettingsPage({ onNavigateHome }: AdminSettingsPageProps) {
    const { settings, loading, error, updateSettings } = useSettings();
    const [formData, setFormData] = useState<SiteSettings | null>(null);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setSaving(true);
        setSuccessMsg('');
        try {
            await updateSettings(formData);
            setSuccessMsg('Configurações salvas com sucesso!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin inline text-rose-500" /></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Configurações Gerais</h1>
                <p className="text-gray-500">Gerencie informações de contato, rodapé e dados da empresa.</p>
            </header>

            {successMsg && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-in fade-in slide-in-from-top-2">
                    {successMsg}
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {formData && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">

                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Contato</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
                                <input type="email" name="contact_email" value={formData.contact_email || ''} onChange={handleChange} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                <input type="text" name="contact_phone" value={formData.contact_phone || ''} onChange={handleChange} className="w-full border rounded-lg p-2" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                                <textarea name="address" rows={2} value={formData.address || ''} onChange={handleChange} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Atendimento</label>
                                <input type="text" name="working_hours" value={formData.working_hours || ''} onChange={handleChange} className="w-full border rounded-lg p-2" />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 mt-4">Rodapé & Empresa</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Texto "Sobre" no Rodapé</label>
                                <textarea name="footer_about" rows={3} value={formData.footer_about || ''} onChange={handleChange} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                                <input type="text" name="cnpj" value={formData.cnpj || ''} onChange={handleChange} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Texto de Copyright</label>
                                <input type="text" name="copyright" value={formData.copyright || ''} onChange={handleChange} className="w-full border rounded-lg p-2" />
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 border-t flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
