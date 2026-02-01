import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Users, Package, Truck, LogOut, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Stats {
  totalUsers: number;
  totalClients: number;
  totalPartners: number;
  totalPackages: number;
  pendingPartners: number;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  partner_status?: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalClients: 0,
    totalPartners: 0,
    totalPackages: 0,
    pendingPartners: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersResult, packagesResult] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('packages').select('id'),
      ]);

      if (usersResult.error) throw usersResult.error;
      if (packagesResult.error) throw packagesResult.error;

      const usersData = usersResult.data || [];
      const packagesData = packagesResult.data || [];

      setUsers(usersData);
      setStats({
        totalUsers: usersData.length,
        totalClients: usersData.filter(u => u.user_type === 'client').length,
        totalPartners: usersData.filter(u => u.user_type === 'partner').length,
        totalPackages: packagesData.length,
        pendingPartners: usersData.filter(u => u.user_type === 'partner' && u.partner_status === 'pending').length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur de déconnexion');
    }
  };

  const handleApprovePartner = async (partnerId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ partner_status: 'approved' })
        .eq('id', partnerId);

      if (error) throw error;
      toast.success('Partenaire approuvé');
      loadDashboardData();
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleRejectPartner = async (partnerId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ partner_status: 'rejected' })
        .eq('id', partnerId);

      if (error) throw error;
      toast.success('Partenaire rejeté');
      loadDashboardData();
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-xl font-bold text-white">MonColis.express</h1>
                <p className="text-xs text-gray-400">Administration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white">
                <Shield className="w-4 h-4" />
                <div>
                  <div className="font-medium">{user?.fullName}</div>
                  <div className="text-xs text-gray-400">
                    {user?.adminLevel === 'super' ? 'Super Admin' : 'Admin'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Tableau de bord administrateur</h2>
          <p className="text-gray-400">Gérez la plateforme MonColis.express</p>
        </div>

        {stats.pendingPartners > 0 && (
          <div className="mb-6 bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-200">
                  {stats.pendingPartners} demande{stats.pendingPartners > 1 ? 's' : ''} de partenariat en attente
                </h3>
                <p className="text-sm text-yellow-300 mt-1">
                  Vérifiez et approuvez les nouvelles demandes ci-dessous.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Utilisateurs totaux</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Clients</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalClients}</p>
              </div>
              <Users className="w-12 h-12 text-blue-400 opacity-20" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Partenaires</p>
                <p className="text-3xl font-bold text-orange-400">{stats.totalPartners}</p>
              </div>
              <Truck className="w-12 h-12 text-orange-400 opacity-20" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Colis</p>
                <p className="text-3xl font-bold text-green-400">{stats.totalPackages}</p>
              </div>
              <Package className="w-12 h-12 text-green-400 opacity-20" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Gestion des utilisateurs</h3>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Chargement...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-400">Aucun utilisateur</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-750 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {u.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          u.user_type === 'admin' ? 'bg-red-900 text-red-200' :
                          u.user_type === 'partner' ? 'bg-orange-900 text-orange-200' :
                          'bg-blue-900 text-blue-200'
                        }`}>
                          {u.user_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.user_type === 'partner' && u.partner_status && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            u.partner_status === 'approved' ? 'bg-green-900 text-green-200' :
                            u.partner_status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                            'bg-red-900 text-red-200'
                          }`}>
                            {u.partner_status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(u.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {u.user_type === 'partner' && u.partner_status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprovePartner(u.id)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => handleRejectPartner(u.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              Rejeter
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
