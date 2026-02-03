
import React, { useState } from 'react';
import { UserPlus, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const AdminSignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!name || !email || !password) {
            setError('Preencha todos os campos');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/.netlify/functions/auth-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            // Handle non-JSON or empty responses gracefully
            const text = await response.text();
            let data: any = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('Response was not JSON:', text);
                throw new Error('O servidor de funções não respondeu corretamente. Verifique se você está acessando pela porta do Netlify (geralmente 8888).');
            }

            if (!response.ok) {
                throw new Error(data.error || data.details || 'Erro ao criar admin');
            }

            setSuccess(true);
            setName('');
            setEmail('');
            setPassword('');
        } catch (err: any) {
            setError(err.message || 'Erro de conexão com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Cadastrar Admin</h2>
                <p className="text-gray-600">Crie um novo usuário com acesso total ao painel administrativo</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">Admin cadastrado com sucesso! O usuário já pode fazer login.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: João Silva"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email de Acesso
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@empresa.com"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Senha Temporária
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                            disabled={isLoading}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            A senha deve conter no mínimo 6 caracteres.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Criar Novo Admin
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>Atenção:</strong> Ao criar um novo administrador, ele terá permissões totais para alterar produtos, preços e visualizar todos os pedidos da loja. Certifique-se de que o email informado está correto.
                </p>
            </div>
        </div>
    );
};

export default AdminSignupPage;
