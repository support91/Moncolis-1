import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, Phone, ArrowLeft, Shield, Key } from 'lucide-react';
import { toast } from 'sonner';

export const AdminRegisterScreen: React.FC<{ onToggleMode: () => void; onBack: () => void }> = ({ onToggleMode, onBack }) => {
  const { signUp } = useAuth();
  const [step, setStep] = useState<'code' | 'register'>('code');
  const [invitationCode, setInvitationCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validCodes = ['ADMIN-MC-2026-SN', 'ADMIN-MC-2026-CI', 'SUPER-ADMIN-2026'];

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (validCodes.includes(invitationCode)) {
      setStep('register');
      toast.success('Code valide! Complétez votre inscription.');
    } else {
      toast.error('Code d\'invitation invalide');
    }
  };

  const validatePassword = (pwd: string): boolean => {
    if (pwd.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      toast.error('Le mot de passe doit contenir au moins une majuscule');
      return false;
    }
    if (!/[a-z]/.test(pwd)) {
      toast.error('Le mot de passe doit contenir au moins une minuscule');
      return false;
    }
    if (!/[0-9]/.test(pwd)) {
      toast.error('Le mot de passe doit contenir au moins un chiffre');
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      toast.error('Le mot de passe doit contenir au moins un caractère spécial');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, fullName, phone, 'admin', {
        invitationCode,
      });
      toast.success('Compte administrateur créé avec succès!');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e5631] to-[#0f3319] p-4">
      <div className="w-full max-w-md bg-[#1a4229] rounded-2xl shadow-2xl p-8 border border-[#2d6f42]">
        <button
          onClick={step === 'code' ? onBack : () => setStep('code')}
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
          <p className="text-green-200">
            {step === 'code' ? 'Entrez votre code d\'invitation' : 'Complétez vos informations'}
          </p>
        </div>

        {step === 'code' ? (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">Code d'invitation</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-300" />
                <input
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f3319] border border-[#2d6f42] text-white rounded-lg focus:ring-2 focus:ring-[#f39c12] focus:border-transparent uppercase"
                  placeholder="ADMIN-MC-2026-XX"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#f39c12] text-white py-3 rounded-lg font-medium hover:bg-[#e67e22] transition-colors"
            >
              Vérifier le code
            </button>

            <div className="mt-4 p-4 bg-[#0f3319] rounded-lg border border-[#2d6f42]">
              <p className="text-xs text-green-200 mb-2">Codes valides:</p>
              <ul className="text-xs text-green-300 space-y-1">
                <li>ADMIN-MC-2026-SN (Sénégal)</li>
                <li>ADMIN-MC-2026-CI (Côte d'Ivoire)</li>
                <li>SUPER-ADMIN-2026 (Super Admin)</li>
              </ul>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-300" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f3319] border border-[#2d6f42] text-white rounded-lg focus:ring-2 focus:ring-[#f39c12] focus:border-transparent"
                  placeholder="Mamadou Diallo"
                  required
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-green-200 mb-2">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-300" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f3319] border border-[#2d6f42] text-white rounded-lg focus:ring-2 focus:ring-[#f39c12] focus:border-transparent"
                  placeholder="+221775207171"
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
              <p className="text-xs text-green-300 mt-1">
                8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-300" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Inscription...' : 'Créer le compte'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onToggleMode}
            className="text-[#f39c12] hover:text-[#e67e22] font-medium text-sm"
          >
            Déjà un compte ? Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};
