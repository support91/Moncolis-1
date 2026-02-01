# 📱 Authentification WhatsApp - MonColis.express

## 🎯 Vue d'ensemble

MonColis.express intègre désormais l'**authentification par WhatsApp**, permettant aux utilisateurs de se connecter en quelques secondes avec un simple code OTP.

### ✨ Avantages

- ⚡ **Connexion instantanée** : Pas besoin de mémoriser un mot de passe
- 🔐 **Sécurisé** : Vérification à deux facteurs native
- 🌍 **Accessible** : Fonctionne partout où WhatsApp est disponible
- 📱 **Familier** : Processus connu de tous les utilisateurs WhatsApp
- 🚀 **Conversion élevée** : Réduit les frictions à l'inscription

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Utilisateur   │
│   (WhatsApp)    │
└────────┬────────┘
         │
         │ 1. Demande code OTP
         ▼
┌─────────────────────────┐
│   Frontend React App    │
│  (LoginScreen.tsx)      │
└────────┬────────────────┘
         │
         │ 2. API: sendWhatsAppOTP()
         ▼
┌─────────────────────────────┐
│   Backend Supabase Edge     │
│   (index.tsx)               │
├─────────────────────────────┤
│ • Génère OTP à 6 chiffres   │
│ • Stocke en KV (5 min TTL)  │
│ • Envoie via WhatsApp API   │
└────────┬────────────────────┘
         │
         │ 3. WhatsApp Business API
         ▼
┌─────────────────────────────┐
│   Meta Graph API            │
│   (graph.facebook.com)      │
├─────────────────────────────┤
│ • Valide le template        │
│ • Envoie le message         │
│ • Retourne le statut        │
└────────┬────────────────────┘
         │
         │ 4. Message WhatsApp
         ▼
┌─────────────────┐
│   Utilisateur   │
│  Reçoit le code │
└────────┬────────┘
         │
         │ 5. Saisit le code
         ▼
┌─────────────────────────┐
│   Frontend React App    │
└────────┬────────────────┘
         │
         │ 6. API: verifyOTP()
         ▼
┌─────────────────────────────┐
│   Backend Supabase Edge     │
├─────────────────────────────┤
│ • Vérifie le code           │
│ • Crée/récupère user        │
│ • Génère session token      │
└────────┬────────────────────┘
         │
         │ 7. Session créée
         ▼
┌─────────────────┐
│   Utilisateur   │
│   Connecté ✓    │
└─────────────────┘
```

---

## 📂 Fichiers modifiés/créés

### Backend (Supabase Edge Functions)

| Fichier | Modifications |
|---------|---------------|
| `/supabase/functions/server/index.tsx` | ✅ Ajout de 3 routes WhatsApp Auth |

**Nouvelles routes :**
- `POST /auth/whatsapp/send-otp` - Envoie le code OTP
- `POST /auth/whatsapp/verify-otp` - Vérifie et authentifie
- `POST /auth/whatsapp/resend-otp` - Renvoie un code

### Frontend (React)

| Fichier | Modifications |
|---------|---------------|
| `/src/utils/api.ts` | ✅ Ajout `whatsappAuthAPI` avec 3 méthodes |
| `/src/contexts/AuthContext.tsx` | ✅ Ajout `loginWithWhatsApp()`, `sendWhatsAppOTP()`, `resendWhatsAppOTP()` |
| `/src/app/components/client/LoginScreen.tsx` | ✅ Ajout bouton WhatsApp + UX |

### Documentation

| Fichier | Description |
|---------|-------------|
| `/WHATSAPP_AUTH_GUIDE.md` | 📘 Guide technique complet |
| `/WHATSAPP_SETUP.md` | 🔧 Guide de configuration pas à pas |
| `/INSCRIPTION_GUIDE.md` | ✏️ Mis à jour avec WhatsApp |
| `/README_WHATSAPP.md` | 📄 Ce fichier |

---

## 🚀 Démarrage rapide

### Mode développement (sans WhatsApp Business)

L'authentification WhatsApp fonctionne dès maintenant en mode développement :

```typescript
// Le code OTP est retourné dans la réponse API
{
  "success": true,
  "message": "Code OTP envoyé via WhatsApp",
  "otp": "123456"  // ← Visible uniquement en dev
}
```

**Tester localement :**

1. Cliquez sur "Continuer avec WhatsApp"
2. Entrez un numéro : `+221775207171`
3. Le code OTP s'affiche dans :
   - Console navigateur (Network tab)
   - Logs Supabase Edge Functions
4. Entrez le code pour vous connecter

### Mode production (avec WhatsApp Business)

Pour activer l'envoi réel via WhatsApp :

1. **Configurez WhatsApp Business API**  
   Suivez le guide : `/WHATSAPP_SETUP.md`

2. **Ajoutez les variables d'environnement**
   ```bash
   WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
   WHATSAPP_PHONE_NUMBER_ID=123456789012345
   ENVIRONMENT=production
   ```

3. **Créez le template de message**
   - Nom : `authentication_otp`
   - Langue : Français
   - Attendez l'approbation Meta

4. **Testez !**
   Les utilisateurs recevront les codes par WhatsApp

---

## 💡 Utilisation par les développeurs

### Frontend - Envoyer un code OTP

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { sendWhatsAppOTP } = useAuth();
  
  const handleSendCode = async () => {
    try {
      const response = await sendWhatsAppOTP('+221775207171');
      
      // En dev, affiche le code
      if (response.otp) {
        console.log('Code de test:', response.otp);
      }
      
      toast.success('Code envoyé !');
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return <button onClick={handleSendCode}>Envoyer code</button>;
}
```

### Frontend - Vérifier le code

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { loginWithWhatsApp } = useAuth();
  
  const handleVerify = async (phone: string, otp: string) => {
    try {
      await loginWithWhatsApp(phone, otp, 'Mamadou Diallo');
      toast.success('Connecté !');
      // Redirection automatique
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <input 
      onChange={(e) => handleVerify(phone, e.target.value)}
      maxLength={6}
    />
  );
}
```

### Backend - API directe

```bash
# Envoyer un code
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8b692521/auth/whatsapp/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+221775207171"}'

# Vérifier un code
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8b692521/auth/whatsapp/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+221775207171",
    "otp": "123456",
    "fullName": "Mamadou Diallo"
  }'
```

---

## 🔒 Sécurité

### Mesures implémentées

| Mesure | Description | Valeur |
|--------|-------------|--------|
| **Expiration OTP** | Le code expire automatiquement | 5 minutes |
| **Tentatives limitées** | Limite les essais incorrects | 3 tentatives max |
| **Rate limiting** | Empêche le spam de codes | 60 secondes entre envois |
| **Format strict** | Validation du numéro de téléphone | Format international requis |
| **Session sécurisée** | Token UUID stocké côté serveur | 30 jours de validité |
| **Logs complets** | Traçabilité de toutes les actions | Console Supabase |

### Format des numéros acceptés

```javascript
// ✅ Valides
"+221775207171"   // Sénégal
"+225071234567"   // Côte d'Ivoire  
"+22212345678"    // Générique

// ❌ Invalides
"775207171"       // Pas d'indicatif
"0775207171"      // Commence par 0
"221775207171"    // Pas de +
```

---

## 📊 Données stockées

### Table KV : `whatsapp_otp:{phone}`

```typescript
{
  code: "123456",              // Code à 6 chiffres
  phone: "+221775207171",      // Numéro formaté
  expiresAt: "2026-01-28...",  // Dans 5 minutes
  attempts: 0,                 // Compteur d'essais (max 3)
  createdAt: "2026-01-28..."   // Timestamp création
}
```

**TTL :** 5 minutes (auto-suppression)

### Table KV : `session:{token}`

```typescript
{
  userId: "uuid-123-456",      // ID utilisateur
  phone: "+221775207171",      // Numéro associé
  expiresAt: "2026-02-27...",  // Dans 30 jours
  createdAt: "2026-01-28..."   // Timestamp création
}
```

**TTL :** 30 jours

### Table KV : `user:{userId}`

```typescript
{
  id: "uuid-123-456",
  email: "+221775207171@whatsapp.moncolis.sn",  // Email virtuel
  fullName: "Mamadou Diallo",
  phone: "+221775207171",
  userType: "client",
  authMethod: "whatsapp",       // Nouveau champ
  createdAt: "2026-01-28...",
  orders: [],
  packages: []
}
```

---

## 🧪 Tests

### Scénarios de test

#### ✅ Test 1 : Nouvel utilisateur

```
1. Cliquer "Continuer avec WhatsApp"
2. Entrer +221770000001
3. Recevoir code 123456
4. Entrer le code
→ Compte créé + Connexion réussie
```

#### ✅ Test 2 : Utilisateur existant

```
1. Cliquer "Continuer avec WhatsApp"
2. Entrer +221770000001 (déjà inscrit)
3. Recevoir code 654321
4. Entrer le code
→ Connexion réussie (pas de nouveau compte)
```

#### ✅ Test 3 : Code expiré

```
1. Demander un code
2. Attendre 6 minutes
3. Essayer de se connecter
→ Erreur "Code expiré"
```

#### ✅ Test 4 : Mauvais code

```
1. Demander un code (ex: 123456)
2. Entrer 000000 (3 fois)
→ Erreur "Trop de tentatives"
```

#### ✅ Test 5 : Rate limiting

```
1. Demander un code
2. Demander immédiatement un autre code
→ Erreur "Veuillez attendre XX secondes"
```

---

## 📈 Métriques et monitoring

### Logs à surveiller

```bash
# Console Supabase Edge Functions

[LOG] WhatsApp OTP for +221775207171: 123456
[LOG] New WhatsApp user registered: +221775207171
[LOG] WhatsApp OTP resent for +221775207171: 654321
[ERROR] WhatsApp OTP send error: Rate limit exceeded
```

### KPIs recommandés

| Métrique | Description | Objectif |
|----------|-------------|----------|
| **Taux de conversion** | % d'OTP vérifiés / envoyés | > 80% |
| **Temps moyen** | De l'envoi à la vérification | < 30 sec |
| **Taux d'échec** | % d'erreurs d'envoi | < 5% |
| **Nouveaux users** | Comptes créés via WhatsApp | Suivi quotidien |

---

## 🌟 Fonctionnalités futures

### À venir (Q1 2026)

- [ ] **Webhooks WhatsApp** : Recevoir les statuts de livraison
- [ ] **Support multilingue** : Templates en Wolof, Anglais, etc.
- [ ] **Analytics avancés** : Dashboard dédié WhatsApp
- [ ] **Notifications** : Envoi de notifications de colis
- [ ] **Support client** : Chat WhatsApp intégré

### Idées

- [ ] Paiement via WhatsApp Pay
- [ ] Partage de tracking par WhatsApp
- [ ] Groupes WhatsApp pour partenaires
- [ ] Bot conversationnel pour FAQ

---

## 🤝 Contribution

Pour contribuer à l'amélioration de l'authentification WhatsApp :

1. **Signaler un bug :**  
   Créez une issue avec le tag `whatsapp-auth`

2. **Proposer une amélioration :**  
   Pull request avec tests

3. **Documentation :**  
   Améliorez ce guide ou créez des tutoriels

---

## 📞 Support

### Pour les développeurs

- **Documentation technique :** `/WHATSAPP_AUTH_GUIDE.md`
- **Guide de setup :** `/WHATSAPP_SETUP.md`
- **Code source :** `/supabase/functions/server/index.tsx`

### Pour les utilisateurs

- **Email :** support@moncolis.express
- **Téléphone :** +221 77 123 45 67
- **WhatsApp :** +221 77 123 45 67 (bientôt !)

### Ressources externes

- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [React Auth Best Practices](https://reactjs.org/docs/authentication.html)

---

## 📄 Licence

MonColis.express © 2026 - Tous droits réservés

---

## ✨ Remerciements

Merci à toute l'équipe MonColis.express pour cette intégration réussie !

**Développé avec ❤️ pour l'Afrique de l'Ouest**

---

**Version :** 1.0.0  
**Dernière mise à jour :** 28 Janvier 2026  
**Status :** ✅ Production Ready
