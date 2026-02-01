import { Package, Truck, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#1e5631] to-[#2d6f42] rounded-2xl shadow-lg p-8 md:p-12 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Bienvenue sur MonColis<span className="text-[#f39c12]">.sn</span>
        </h2>
        <p className="text-lg md:text-xl text-green-50 mb-6 max-w-2xl">
          Votre partenaire de confiance pour l'envoi et le suivi de colis au Sénégal
        </p>
        <button className="bg-[#f39c12] hover:bg-[#e67e22] text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg">
          Commencer maintenant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Package className="w-6 h-6 text-[#1e5631]" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Envoi rapide</h3>
          <p className="text-gray-600">
            Expédiez vos colis en quelques clics avec notre service rapide et fiable
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <Truck className="w-6 h-6 text-[#f39c12]" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Suivi en temps réel</h3>
          <p className="text-gray-600">
            Suivez vos colis en temps réel et recevez des notifications à chaque étape
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-[#1e5631]" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Livraison partout</h3>
          <p className="text-gray-600">
            Nous livrons dans tout le Sénégal avec notre réseau de partenaires
          </p>
        </div>
      </div>
    </div>
  );
}
