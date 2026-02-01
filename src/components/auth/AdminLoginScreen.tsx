import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLoginScreen: React.FC<{ onToggleMode: () => void; onBack: () => void }> = ({ onToggleMode, onBack }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Connexion administrateur réussie!');
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e5631] to-[#0f3319] p-4">
      <div className="w-full max-w-md bg-[#1a4229] rounded-2xl shadow-2xl p-8 border border-[#2d6f42]">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-green-200 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-[#f39c12]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MonColis<span className="text-[#f39c12]">.sn</span></h1>
          <p className="text-green-200">Accès Administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f3319] border border-[#2d6f42] text-white rounded-lg focus:ring-2 focus:ring-[#f39c12] focus:border-transparent"
                placeholder="admin@moncolis.sn"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f3319] border border-[#2d6f42] text-white rounded-lg focus:ring-2 focus:ring-[#f39c12] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f39c12] text-white py-3 rounded-lg font-medium hover:bg-[#e67e22] transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onToggleMode}
            className="text-[#f39c12] hover:text-[#e67e22] font-medium text-sm"
          >
            Nouvel administrateur ? S'inscrire
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#2d6f42]">
          <p className="text-xs text-green-300 text-center">
            Accès réservé au personnel autorisé uniquement
          </p>
        </div>
      </div>
    </div>
  );
};
