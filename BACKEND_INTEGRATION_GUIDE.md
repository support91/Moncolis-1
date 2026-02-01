# Guide d'Intégration Backend MonColis.express

## Vue d'ensemble

Le backend MonColis.express est maintenant complètement configuré avec Supabase. Il inclut:

- ✅ Authentification utilisateur (signup, login, profil)
- ✅ Gestion des commandes CRUD
- ✅ Gestion des colis avec numéro de tracking
- ✅ Tracking GPS en temps réel
- ✅ Contrôle qualité avec upload de photos
- ✅ Stockage de fichiers Supabase

## Architecture

```
Frontend (React) <-> API Routes (Hono/Deno) <-> Supabase (Auth + Storage) + KV Store
```

## Modules Disponibles

### 1. API Client (`/src/utils/api.ts`)

Module utilitaire qui expose toutes les fonctions API:

```typescript
import { authAPI, ordersAPI, packagesAPI, trackingAPI, qualityControlAPI } from '@/utils/api';

// Exemple: Connexion
const response = await authAPI.signin(email, password);
// Retourne: { success: true, accessToken: string, user: {...} }

// Exemple: Créer une commande
const order = await ordersAPI.create(token, {
  productName: "iPhone 14",
  quantity: 1,
  price: 850000,
  from: "Sénégal",
  to: "Côte d'Ivoire"
});

// Exemple: Tracking GPS
const location = await trackingAPI.getCurrentLocation("MC12345678");
```

### 2. Auth Context (`/src/contexts/AuthContext.tsx`)

Context React pour gérer l'état d'authentification:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // L'utilisateur est maintenant connecté
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Bonjour {user?.fullName}</p>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
}
```

## Routes API Disponibles

### Authentification

| Endpoint | Méthode | Description | Auth Required |
|----------|---------|-------------|---------------|
| `/auth/signup` | POST | Créer un compte | Non |
| `/auth/signin` | POST | Se connecter | Non |
| `/auth/profile` | GET | Obtenir le profil | Oui |
| `/auth/profile` | PUT | Mettre à jour le profil | Oui |
| `/auth/signout` | POST | Se déconnecter | Oui |

### Commandes

| Endpoint | Méthode | Description | Auth Required |
|----------|---------|-------------|---------------|
| `/orders` | POST | Créer une commande | Oui |
| `/orders` | GET | Liste des commandes | Oui |
| `/orders/:orderId` | GET | Détails d'une commande | Oui |
| `/orders/:orderId` | PUT | Mettre à jour | Oui (owner/partner/admin) |
| `/orders/:orderId` | DELETE | Supprimer | Oui (owner) |

### Colis

| Endpoint | Méthode | Description | Auth Required |
|----------|---------|-------------|---------------|
| `/packages` | POST | Créer un colis | Oui |
| `/packages` | GET | Liste des colis | Oui |
| `/packages/track/:trackingNumber` | GET | Tracking public | Non |
| `/packages/:packageId` | PUT | Mettre à jour | Oui (owner/partner/admin) |

### Tracking GPS

| Endpoint | Méthode | Description | Auth Required |
|----------|---------|-------------|---------------|
| `/tracking/:packageId/location` | POST | Mettre à jour GPS | Oui (partner/admin) |
| `/tracking/:trackingNumber/history` | GET | Historique GPS | Non |
| `/tracking/:trackingNumber/current` | GET | Position actuelle | Non |

### Contrôle Qualité

| Endpoint | Méthode | Description | Auth Required |
|----------|---------|-------------|---------------|
| `/quality-control/:packageId/photos` | POST | Upload photo | Oui (partner/admin) |
| `/quality-control/:packageId/photos` | GET | Liste des photos | Oui (owner/partner/admin) |
| `/quality-control/:packageId/status` | PUT | Mettre à jour statut | Oui (partner/admin) |

## Exemples d'Intégration

### 1. Intégrer l'Auth dans App.tsx

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* Votre app ici */}
    </AuthProvider>
  );
}
```

### 2. Mettre à jour LoginScreen avec le vrai backend

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      onLogin(); // Navigate to dashboard
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
```

### 3. Créer une commande

```typescript
import { ordersAPI } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

function NewOrderScreen() {
  const { token } = useAuth();

  const createOrder = async () => {
    try {
      const response = await ordersAPI.create(token!, {
        productName: "MacBook Pro",
        quantity: 1,
        price: 1500000,
        from: "Dakar, Sénégal",
        to: "Abidjan, Côte d'Ivoire",
        description: "Ordinateur portable"
      });

      console.log('Commande créée:', response.order);
      alert(`Commande créée avec succès! ID: ${response.order.id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la commande');
    }
  };

  return <button onClick={createOrder}>Créer une commande</button>;
}
```

### 4. Tracking GPS

```typescript
import { trackingAPI } from '@/utils/api';
import { useState, useEffect } from 'react';

function TrackingMap({ trackingNumber }: { trackingNumber: string }) {
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await trackingAPI.getCurrentLocation(trackingNumber);
        setLocation(response.currentLocation);
      } catch (error) {
        console.error('Erreur de tracking:', error);
      }
    };

    fetchLocation();
    // Actualiser toutes les 30 secondes
    const interval = setInterval(fetchLocation, 30000);
    return () => clearInterval(interval);
  }, [trackingNumber]);

  if (!location) return <p>Chargement de la position...</p>;

  return (
    <div>
      <h3>Position actuelle</h3>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      <p>Adresse: {location.address}</p>
      <p>Dernière mise à jour: {new Date(location.timestamp).toLocaleString()}</p>
    </div>
  );
}
```

### 5. Upload de photo de contrôle qualité

```typescript
import { qualityControlAPI } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

function QualityControlUpload({ packageId }: { packageId: string }) {
  const { token } = useAuth();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await qualityControlAPI.uploadPhoto(
        token!,
        packageId,
        file,
        'Vérification de l\'état du colis',
        'approved'
      );

      console.log('Photo uploadée:', response.photo);
      alert('Photo uploadée avec succès!');
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de la photo');
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handlePhotoUpload}
      />
    </div>
  );
}
```

## Types d'utilisateurs

- **client**: Peut créer des commandes/colis, voir ses propres données
- **partner**: Peut mettre à jour les statuts, GPS, uploader des photos
- **admin**: Accès complet à toutes les données

## Structure des données

### User
```typescript
{
  id: string;
  email: string;
  fullName: string;
  phone: string;
  userType: 'client' | 'partner' | 'admin';
  orders: string[];
  packages: string[];
}
```

### Order
```typescript
{
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  productName: string;
  quantity: number;
  price: number;
  from: string;
  to: string;
  createdAt: string;
  updatedAt: string;
}
```

### Package
```typescript
{
  id: string;
  userId: string;
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'delivered';
  currentLocation?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: string;
  };
  locationHistory: Array<LocationUpdate>;
  qualityPhotos?: Array<PhotoRecord>;
  qualityCheckStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
```

## Prochaines étapes

1. Intégrer AuthProvider dans `/src/app/App.tsx`
2. Mettre à jour LoginScreen pour utiliser le vrai backend
3. Implémenter la création de commandes dans NewOrderScreen
4. Ajouter le tracking GPS dans TrackingScreen
5. Intégrer l'upload de photos pour le contrôle qualité

## Notes importantes

- Tous les tokens sont stockés dans localStorage
- Les photos sont stockées dans Supabase Storage avec des URLs signées valides 1 an
- Le bucket de stockage est créé automatiquement au démarrage du serveur
- Les erreurs sont loggées dans la console côté serveur pour faciliter le debug
