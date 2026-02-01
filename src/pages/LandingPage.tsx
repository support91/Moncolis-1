import { Package, Truck, MapPin, Clock, Shield, CheckCircle, Phone, ArrowRight, Mail } from 'lucide-react';

interface LandingPageProps {
  onNavigateToAuth: () => void;
}

export default function LandingPage({ onNavigateToAuth }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Package className="w-10 h-10 text-[#f39c12]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-2 border-[#1e5631] rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                MonColis<span className="text-[#f39c12]">.sn</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-700 hover:text-[#1e5631] font-medium">Services</a>
              <a href="#couverture" className="text-gray-700 hover:text-[#1e5631] font-medium">Couverture</a>
              <a href="#tracking" className="text-gray-700 hover:text-[#1e5631] font-medium">Suivi</a>
              <a href="#contact" className="text-gray-700 hover:text-[#1e5631] font-medium">Contact</a>
              <button
                onClick={onNavigateToAuth}
                className="bg-[#1e5631] text-white px-6 py-2.5 rounded-lg hover:bg-[#2d6f42] transition-colors font-medium"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1e5631] via-[#2d6f42] to-[#1e5631] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#f39c12] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f39c12] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-[#f39c12]/20 rounded-full border border-[#f39c12]/30">
                <span className="text-[#f39c12] font-semibold text-sm">🚀 Livraison rapide et fiable</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Votre colis,<br />
                <span className="text-[#f39c12]">notre priorité</span>
              </h1>
              <p className="text-xl text-green-50 mb-8 leading-relaxed">
                Service de livraison express dans toute l'Afrique de l'Ouest.
                Suivez vos colis en temps réel et recevez des notifications à chaque étape.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onNavigateToAuth}
                  className="bg-[#f39c12] text-white px-8 py-4 rounded-xl hover:bg-[#e67e22] transition-all font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  Envoyer un colis
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onNavigateToAuth}
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all font-semibold text-lg border border-white/20 flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  Suivre un colis
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-[#f39c12]">15k+</div>
                  <div className="text-sm text-green-100 mt-1">Colis livrés</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#f39c12]">4</div>
                  <div className="text-sm text-green-100 mt-1">Pays couverts</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#f39c12]">98%</div>
                  <div className="text-sm text-green-100 mt-1">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-[#f39c12] rounded-3xl opacity-20 blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#1e5631] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-[#f39c12]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">MCL-2024-789456</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            En transit
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Dakar → Abidjan</p>
                        <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#f39c12] h-full w-3/4 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3 text-gray-900">
                      <Clock className="w-5 h-5 text-[#f39c12]" />
                      <span className="font-medium">Livraison estimée : 24-48h</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3 text-gray-900">
                      <Phone className="w-5 h-5 text-[#f39c12]" />
                      <span className="font-medium">Notifications SMS incluses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Couverture géographique */}
      <section id="couverture" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Présents dans toute l'<span className="text-[#f39c12]">Afrique de l'Ouest</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre réseau de partenaires vous garantit une livraison rapide et sécurisée dans 4 pays
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { city: 'Dakar', country: 'Sénégal', flag: '🇸🇳', color: 'bg-gradient-to-br from-green-600 to-yellow-500' },
              { city: 'Abidjan', country: 'Côte d\'Ivoire', flag: '🇨🇮', color: 'bg-gradient-to-br from-orange-500 to-green-600' },
              { city: 'Conakry', country: 'Guinée', flag: '🇬🇳', color: 'bg-gradient-to-br from-red-500 to-yellow-500' },
              { city: 'Bamako', country: 'Mali', flag: '🇲🇱', color: 'bg-gradient-to-br from-green-600 to-yellow-400' },
            ].map((location) => (
              <div key={location.city} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-105 group">
                <div className={`${location.color} h-32 flex items-center justify-center relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform">
                    {location.flag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{location.city}</h3>
                  <p className="text-gray-600 mb-4">{location.country}</p>
                  <div className="flex items-center gap-2 text-[#1e5631]">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Point de service actif</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos <span className="text-[#f39c12]">Services</span>
            </h2>
            <p className="text-xl text-gray-600">
              Une solution complète pour tous vos besoins de livraison
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all border border-gray-100 group hover:border-[#f39c12]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1e5631] to-[#2d6f42] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Envoi Express</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Expédiez vos colis en quelques clics. Service rapide et fiable avec prise en charge à domicile disponible.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
                  <span>Prise en charge à domicile</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
                  <span>Livraison 24-48h</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
                  <span>Assurance incluse</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all border border-gray-100 group hover:border-[#f39c12]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f39c12] to-[#e67e22] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Suivi en Temps Réel</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Recevez des notifications SMS à chaque étape. Suivez votre colis en temps réel sur notre plateforme.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
                  <span>Notifications SMS automatiques</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
                  <span>Suivi GPS en direct</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
                  <span>Historique complet</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all border border-gray-100 group hover:border-[#f39c12]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1e5631] to-[#2d6f42] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sécurisé & Fiable</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Vos colis sont entre de bonnes mains. Service professionnel avec garantie de livraison.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
                  <span>Livreurs certifiés</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
                  <span>Emballage sécurisé</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
                  <span>Support client 24/7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Demo */}
      <section id="tracking" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1e5631] to-[#2d6f42] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Suivez vos colis<br />
                <span className="text-[#f39c12]">où que vous soyez</span>
              </h2>
              <p className="text-xl text-green-50 mb-8 leading-relaxed">
                Recevez des notifications SMS à chaque étape du trajet. Notre système de suivi vous tient informé en temps réel de l'avancement de votre livraison.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f39c12] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Colis pris en charge</h4>
                    <p className="text-green-100">Confirmation de collecte avec numéro de suivi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f39c12] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">En cours de livraison</h4>
                    <p className="text-green-100">Notification avec estimation d'arrivée</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f39c12] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Colis livré</h4>
                    <p className="text-green-100">Confirmation de livraison avec signature</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-lg animate-fade-in">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📱</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">SMS - Jen</div>
                        <p className="text-sm text-gray-900">
                          Votre colis est en cours de livraison et arrivera bientôt ! Suivez-le ici: wa60-lw/p.é.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📱</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">SMS - Jen</div>
                        <p className="text-sm text-gray-900">
                          Votre colis arrive bientôt chez vous ! 📦 Livraison estimée dans 10 minutes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📱</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">SMS - Jen</div>
                        <p className="text-sm text-gray-900">
                          Votre colis vient d'être livré ! 📦
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Prêt à envoyer votre<br />
            <span className="text-[#f39c12]">premier colis ?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez des milliers de clients satisfaits qui nous font confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToAuth}
              className="bg-[#1e5631] text-white px-10 py-4 rounded-xl hover:bg-[#2d6f42] transition-all font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              Créer un compte
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:+221333333333"
              className="bg-white text-[#1e5631] px-10 py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-[#1e5631] flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              +221 33 XXX XX XX
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#1e5631] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                MonColis<span className="text-[#f39c12]">.sn</span>
              </h3>
              <p className="text-green-100">
                Votre partenaire de confiance pour la livraison de colis en Afrique de l'Ouest.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-[#f39c12]">Envoi de colis</a></li>
                <li><a href="#" className="hover:text-[#f39c12]">Suivi en ligne</a></li>
                <li><a href="#" className="hover:text-[#f39c12]">Tarifs</a></li>
                <li><a href="#" className="hover:text-[#f39c12]">Points de service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Entreprise</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-[#f39c12]">À propos</a></li>
                <li><a href="#" className="hover:text-[#f39c12]">Devenir partenaire</a></li>
                <li><a href="#" className="hover:text-[#f39c12]">Carrières</a></li>
                <li><a href="#" className="hover:text-[#f39c12]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-green-100">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+221 33 XXX XX XX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@moncolis.sn</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Dakar, Sénégal</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#2d6f42] pt-8 text-center text-green-100">
            <p>&copy; 2024 MonColis.sn - Tous droits réservés</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
