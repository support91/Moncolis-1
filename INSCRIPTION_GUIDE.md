# Guide d'Inscription MonColis.express

## Vue d'ensemble

MonColis.express dispose maintenant de **trois systèmes d'inscription distincts** pour chaque type d'utilisateur :

1. **Clients** - Pour les particuliers qui souhaitent envoyer et recevoir des colis
2. **Partenaires Logistiques** - Pour les entreprises de transport et logistique
3. **Administrateurs** - Pour la gestion de la plateforme (accès sécurisé)

---

## 1. Inscription Client

### Méthodes d'authentification disponibles :
- ✅ **Email + Mot de passe**
- ✅ **Téléphone + OTP**
- ✅ **Google OAuth**
- ✅ **WhatsApp OTP** ⭐ NOUVEAU

### Composants :
- **RegisterScreen** : `/src/app/components/client/RegisterScreen.tsx`
- **LoginScreen** : `/src/app/components/client/LoginScreen.tsx`

### Utilisation :
```tsx
import { RegisterScreen } from '@/app/components/client/RegisterScreen';
import { LoginScreen } from '@/app/components/client/LoginScreen';
```

### Données collectées :
- Nom complet
- Email ou Téléphone
- Mot de passe (min. 6 caractères)

### Authentification WhatsApp :
MonColis.express prend désormais en charge l'authentification via WhatsApp :
1. L'utilisateur entre son numéro de téléphone
2. Un code OTP à 6 chiffres est envoyé via WhatsApp
3. L'utilisateur entre le code pour se connecter
4. Si c'est un nouveau numéro, un compte est créé automatiquement

Voir le guide complet : `/WHATSAPP_AUTH_GUIDE.md`

---

## 2. Inscription Partenaire Logistique

### Méthodes d'authentification disponibles :
- ✅ **Email + Mot de passe**
- ✅ **Téléphone + OTP**
- ✅ **Google OAuth**
- ✅ **WhatsApp OTP** ⭐ NOUVEAU

### Composants :
- **PartnerRegisterScreen** : `/src/app/components/partner/PartnerRegisterScreen.tsx`
- **PartnerLoginScreen** : `/src/app/components/partner/PartnerLoginScreen.tsx`

### Utilisation :
```tsx
import { PartnerRegisterScreen } from '@/app/components/partner/PartnerRegisterScreen';
import { PartnerLoginScreen } from '@/app/components/partner/PartnerLoginScreen';
```

### Données collectées :
- Nom du responsable
- **Nom de l'entreprise** (obligatoire)
- **Adresse de l'entreprise** (obligatoire)
- Email ou Téléphone
- Mot de passe (min. 6 caractères)

### Statut initial :
- `partnerStatus: 'pending'` - En attente d'approbation par un administrateur

---

## 3. Inscription Administrateur

### Méthodes d'authentification disponibles :
- ✅ **Email + Mot de passe uniquement** (sécurité renforcée)
- ❌ Google OAuth désactivé pour les admins

### Composants :
- **AdminRegisterScreen** : `/src/app/components/admin/AdminRegisterScreen.tsx`
- **AdminLoginScreen** : `/src/app/components/admin/AdminLoginScreen.tsx`

### Utilisation :
```tsx
import { AdminRegisterScreen } from '@/app/components/admin/AdminRegisterScreen';
import { AdminLoginScreen } from '@/app/components/admin/AdminLoginScreen';
```

### Processus d'inscription en 2 étapes :

#### Étape 1 : Validation du code d'invitation
Codes valides (configurés côté backend) :
- `ADMIN-MC-2026-SN` - Admin standard Sénégal
- `ADMIN-MC-2026-CI` - Admin standard Côte d'Ivoire
- `SUPER-ADMIN-2026` - Super administrateur

#### Étape 2 : Formulaire d'inscription sécurisé
Données collectées :
- Nom complet
- Email professionnel
- Téléphone
- Mot de passe **sécurisé** (min. 8 caractères)
  - Au moins 1 majuscule
  - Au moins 1 minuscule
  - Au moins 1 chiffre
  - Au moins 1 caractère spécial
- **Question de sécurité** + Réponse

### Niveaux d'admin :
- `adminLevel: 'super'` - Super administrateur (code SUPER-ADMIN-2026)
- `adminLevel: 'standard'` - Administrateur standard (autres codes)

---

## Backend API

### Endpoint d'inscription unifié
**POST** `/make-server-8b692521/auth/signup`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "phone": "775207171",
  "userType": "client|partner|admin",
  
  // Pour les partenaires uniquement :
  "companyName": "Express Transport SN",
  "companyAddress": "Dakar, Plateau",
  
  // Pour les admins uniquement :
  "invitationCode": "ADMIN-MC-2026-SN"
}
```

### Validation backend :
1. **Clients** : Aucune validation spéciale
2. **Partenaires** : Vérification `companyName` et `companyAddress` requis
3. **Admins** : Vérification stricte du `invitationCode`

---

## Données stockées par type d'utilisateur

### Tous les utilisateurs :
```typescript
{
  id: string;
  email: string;
  fullName: string;
  phone: string;
  userType: 'client' | 'partner' | 'admin';
  createdAt: string;
  orders: string[];
  packages: string[];
}
```

### Partenaires (données additionnelles) :
```typescript
{
  companyName: string;
  companyAddress: string;
  partnerStatus: 'pending' | 'approved' | 'rejected';
  deliveries: string[];
}
```

### Admins (données additionnelles) :
```typescript
{
  adminLevel: 'super' | 'standard';
  permissions: string[];
  invitationCode: string;
}
```

---

## Sécurité

### Clients :
- Validation email standard
- Mot de passe min. 6 caractères
- Google OAuth activé

### Partenaires :
- Validation entreprise obligatoire
- Approbation manuelle par admin
- Mot de passe min. 6 caractères
- Google OAuth activé

### Admins :
- **Code d'invitation obligatoire**
- Mot de passe renforcé (min. 8 caractères + complexité)
- Question de sécurité
- Interface sombre sécurisée
- Google OAuth **désactivé**
- Vérification du rôle lors de la connexion

---

## Codes d'exemple

### Inscription client avec Google :
```typescript
const { loginWithGoogle } = useAuth();
await loginWithGoogle();
// Redirection automatique vers Google OAuth
```

### Inscription partenaire :
```typescript
const { signup } = useAuth();
await signup(
  email, 
  password, 
  fullName, 
  phone, 
  'partner'
);
```

### Inscription admin :
```typescript
const { signup } = useAuth();
await signup(
  email, 
  password, 
  fullName, 
  phone, 
  'admin'
);
```

---

## Contact

Pour obtenir un code d'invitation administrateur :
📧 **admin@moncolis.express**
☎️ **Support technique 24/7**

---

**MonColis.express © 2026**  
*Plateforme digitale de logistique Sénégal-Côte d'Ivoire*