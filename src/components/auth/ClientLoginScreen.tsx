import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Phone, Chrome } from 'lucide-react';
import { toast } from 'sonner';

export const ClientLoginScreen: React.FC<{ onToggleMode: () => void; onSwitchTo: (type: string) => void }> = ({ onToggleMode, onSwitchTo }) => {
  const { signIn, loginWithGoogle, sendWhatsAppOTP, verifyWhatsAppOTP } = useAuth();
  const [mode, setMode] = useState<'email' | 'whatsapp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Connexion réussie!');
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      toast.error(error.message || 'Erreur Google OAuth');
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone.startsWith('+')) {
      toast.error('Le numéro doit commencer par + (ex: +221775207171)');
      return;
    }
    setLoading(true);
    try {
      const result = await sendWhatsAppOTP(phone);
      if (result.success) {
        setOtpSent(true);
        toast.success('Code envoyé!');
        if (result.otp) {
          toast.info(`Code de test: ${result.otp}`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur d\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      await verifyWhatsAppOTP(phone, otp, 'Client');
      toast.success('Connexion réussie!');
    } catch (error: any) {
      toast.error(error.message || 'Code incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MonColis.express</h1>
          <p className="text-gray-600">Connexion Client</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('email')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </button>
          <button
            onClick={() => setMode('whatsapp')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'whatsapp' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Phone className="w-4 h-4 inline mr-2" />
            WhatsApp
          </button>
        </div>

        {mode === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {!otpSent ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numéro WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+221775207171"
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Envoyer le code'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code de vérification</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="000000"
                    required
                  />
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Vérification...' : 'Vérifier'}
                </button>

                <button
                  onClick={() => setOtpSent(false)}
                  className="w-full text-sm text-gray-600 hover:text-gray-800"
                >
                  Modifier le numéro
                </button>
              </>
            )}
          </div>
        )}

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OU</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Chrome className="w-5 h-5" />
          Continuer avec Google
        </button>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Pas encore de compte ? S'inscrire
          </button>
          <div className="text-sm text-gray-600">
            Vous êtes un{' '}
            <button onClick={() => onSwitchTo('partner')} className="text-blue-600 hover:underline">
              partenaire
            </button>
            {' '}ou{' '}
            <button onClick={() => onSwitchTo('admin')} className="text-blue-600 hover:underline">
              admin
            </button>
            ?
          </div>
        </div>
      </div>
    </div>
  );
};
