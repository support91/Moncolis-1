import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ClientLoginScreen } from '@/components/auth/ClientLoginScreen';
import { ClientRegisterScreen } from '@/components/auth/ClientRegisterScreen';
import { PartnerLoginScreen } from '@/components/auth/PartnerLoginScreen';
import { PartnerRegisterScreen } from '@/components/auth/PartnerRegisterScreen';
import { AdminLoginScreen } from '@/components/auth/AdminLoginScreen';
import { AdminRegisterScreen } from '@/components/auth/AdminRegisterScreen';
import { ClientDashboard } from '@/components/dashboards/ClientDashboard';
import { PartnerDashboard } from '@/components/dashboards/PartnerDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { Toaster } from 'sonner';

type UserSelection = 'client' | 'partner' | 'admin' | null;
type AuthMode = 'login' | 'register';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [userSelection, setUserSelection] = useState<UserSelection>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user) {
    switch (user.userType) {
      case 'client':
        return <ClientDashboard />;
      case 'partner':
        return <PartnerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ClientDashboard />;
    }
  }

  if (!userSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">MonColis.express</h1>
            <p className="text-xl text-gray-600">Plateforme de livraison pour l'Afrique de l'Ouest</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setUserSelection('client')}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Client</h3>
              <p className="text-gray-600 text-sm">
                Envoyez et suivez vos colis en toute simplicité
              </p>
            </button>

            <button
              onClick={() => setUserSelection('partner')}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-orange-500"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Partenaire</h3>
              <p className="text-gray-600 text-sm">
                Gérez vos livraisons et développez votre activité
              </p>
            </button>

            <button
              onClick={() => setUserSelection('admin')}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-red-500"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admin</h3>
              <p className="text-gray-600 text-sm">
                Accédez au tableau de bord administrateur
              </p>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2026 MonColis.express - Sénégal & Côte d'Ivoire</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleBack = () => {
    setUserSelection(null);
    setAuthMode('login');
  };

  if (userSelection === 'client') {
    return authMode === 'login' ? (
      <ClientLoginScreen
        onToggleMode={toggleAuthMode}
        onSwitchTo={(type) => setUserSelection(type as UserSelection)}
      />
    ) : (
      <ClientRegisterScreen onToggleMode={toggleAuthMode} />
    );
  }

  if (userSelection === 'partner') {
    return authMode === 'login' ? (
      <PartnerLoginScreen onToggleMode={toggleAuthMode} onBack={handleBack} />
    ) : (
      <PartnerRegisterScreen onToggleMode={toggleAuthMode} onBack={handleBack} />
    );
  }

  if (userSelection === 'admin') {
    return authMode === 'login' ? (
      <AdminLoginScreen onToggleMode={toggleAuthMode} onBack={handleBack} />
    ) : (
      <AdminRegisterScreen onToggleMode={toggleAuthMode} onBack={handleBack} />
    );
  }

  return null;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
