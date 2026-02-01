# 🔐 Configuration de l'authentification Google - MonColis.express

## 📋 Vue d'ensemble

Ce guide vous accompagne pas à pas dans la configuration de l'authentification Google OAuth pour MonColis.express via Supabase.

**Durée estimée :** 10-15 minutes

---

## ✅ Prérequis

- ✅ Un projet Supabase actif
- ✅ Un compte Google (Gmail)
- ✅ Accès à la Google Cloud Console
- ✅ MonColis.express déployé ou en développement

---

## 🚀 Étape 1 : Configuration Supabase

### 1.1 Accéder aux paramètres d'authentification

1. Connectez-vous à [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet MonColis.express
3. Dans le menu latéral, cliquez sur **Authentication** > **Providers**
4. Cherchez et cliquez sur **Google**

### 1.2 Récupérer l'URL de callback

Vous verrez une URL comme :
```
https://mqntuaxzsqfymmvszkji.supabase.co/auth/v1/callback
```

**⚠️ IMPORTANT :** Copiez cette URL, vous en aurez besoin pour Google Cloud Console.

---

## 🌐 Étape 2 : Configuration Google Cloud Console

### 2.1 Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur le sélecteur de projet en haut
3. Cliquez sur **New Project**
4. Nommez-le : `MonColis Express Auth`
5. Cliquez sur **Create**

### 2.2 Activer l'API Google+

1. Dans le menu latéral, allez à **APIs & Services** > **Library**
2. Recherchez : `Google+ API`
3. Cliquez dessus, puis cliquez sur **Enable**

### 2.3 Configurer l'écran de consentement OAuth

1. Allez à **APIs & Services** > **OAuth consent screen**
2. Sélectionnez **External** (pour tester avec n'importe quel compte Google)
3. Cliquez sur **Create**

**Remplissez le formulaire :**

| Champ | Valeur |
|-------|--------|
| **App name** | MonColis Express |
| **User support email** | Votre email Gmail |
| **App logo** | (Optionnel) Logo MonColis.express |
| **Application home page** | `https://votre-domaine.com` |
| **Authorized domains** | `supabase.co` |
| **Developer contact** | Votre email |

4. Cliquez sur **Save and Continue**
5. **Scopes** : Cliquez sur **Add or Remove Scopes**
   - Ajoutez : `email`
   - Ajoutez : `profile`
   - Ajoutez : `openid`
6. Cliquez sur **Save and Continue**
7. **Test users** : Ajoutez les emails Gmail de test (en développement)
8. Cliquez sur **Save and Continue**

### 2.4 Créer les identifiants OAuth 2.0

1. Allez à **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth client ID**
3. Type d'application : **Web application**
4. Nom : `MonColis Express Web Client`

**Origines JavaScript autorisées :**
```
http://localhost:5173
https://votre-domaine.com
```

**URI de redirection autorisés :**
```
https://mqntuaxzsqfymmvszkji.supabase.co/auth/v1/callback
http://localhost:5173
```

⚠️ **Remplacez** `mqntuaxzsqfymmvszkji` par votre vrai projet ID Supabase !

5. Cliquez sur **Create**

### 2.5 Récupérer les identifiants

Vous obtenez :
- **Client ID** : `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

**⚠️ IMPORTANT :** Gardez ces informations secrètes !

---

## 🔌 Étape 3 : Configurer Supabase avec Google

### 3.1 Activer le provider Google

1. Retournez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. **Authentication** > **Providers** > **Google**
3. **Enable** : Activez le toggle

### 3.2 Entrer les identifiants Google

Collez vos identifiants Google :

| Champ Supabase | Valeur |
|----------------|--------|
| **Client ID** | `123456789-abcdef...apps.googleusercontent.com` |
| **Client Secret** | `GOCSPX-xxxxxxxxxxxxx` |

### 3.3 Configurer les options avancées (optionnel)

**Scopes supplémentaires :**
```
email profile openid
```

**Skip nonce check :** Laissez décoché (plus sécurisé)

4. Cliquez sur **Save**

---

## ✅ Étape 4 : Tester l'authentification

### 4.1 Test en développement local

1. Démarrez votre application :
   ```bash
   npm run dev
   ```

2. Ouvrez : `http://localhost:5173`

3. Cliquez sur **Connexion**

4. Cliquez sur le bouton **Continuer avec Google**

5. Vous êtes redirigé vers Google OAuth

6. Sélectionnez votre compte Google

7. Acceptez les permissions

8. Vous êtes redirigé vers MonColis.express, connecté ✅

### 4.2 Vérifier la session

Ouvrez la console développeur :
```javascript
// Doit afficher vos infos
console.log(localStorage.getItem('moncolis_token'));
console.log(localStorage.getItem('moncolis_user'));
```

### 4.3 Vérifier la base de données

1. Allez sur Supabase Dashboard
2. **Table Editor** > Affichez le contenu KV
3. Vous devriez voir un utilisateur créé avec :
   - `provider: "google"`
   - `email: "votre@gmail.com"`

---

## 🐛 Dépannage

### Erreur : "Redirect URI mismatch"

**Cause :** L'URL de callback ne correspond pas

**Solution :**
1. Vérifiez que l'URL dans Google Cloud Console est exactement :
   ```
   https://VOTRE-PROJECT-ID.supabase.co/auth/v1/callback
   ```
2. Pas d'espace, pas de slash final

### Erreur : "Access blocked: This app's request is invalid"

**Cause :** Scopes non configurés ou app non publiée

**Solution :**
1. Retournez sur Google Cloud Console
2. **OAuth consent screen** > Ajoutez les scopes `email`, `profile`, `openid`
3. Ou ajoutez votre email en "Test user"

### Erreur : "provider is not enabled"

**Cause :** Google provider pas activé dans Supabase

**Solution :**
1. Supabase Dashboard > **Authentication** > **Providers**
2. Activez le toggle **Google**
3. Sauvegardez

### L'utilisateur ne voit pas son compte après connexion

**Cause :** La route backend `/auth/oauth-callback` n'a pas créé l'utilisateur

**Solution :**
1. Vérifiez les logs Supabase Edge Functions
2. Vérifiez que la route est accessible :
   ```bash
   curl https://VOTRE-PROJECT-ID.supabase.co/functions/v1/make-server-8b692521/auth/oauth-callback
   ```

---

## 🔒 Sécurité en production

### Pour passer en production

1. **Google Cloud Console :**
   - Allez sur **OAuth consent screen**
   - Cliquez sur **Publish App**
   - Complétez la vérification Google (peut prendre 1-2 semaines)

2. **Domaines autorisés :**
   - Ajoutez votre domaine production : `moncolis.express`
   - Dans **Authorized domains** de l'écran de consentement
   - Dans **Authorized JavaScript origins** des credentials

3. **URI de redirection production :**
   ```
   https://moncolis.express
   https://app.moncolis.express
   https://VOTRE-PROJECT-ID.supabase.co/auth/v1/callback
   ```

4. **Variables d'environnement :**
   ```bash
   VITE_SUPABASE_URL=https://VOTRE-PROJECT-ID.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

---

## 📊 Monitoring et analytics

### Logs à surveiller

#### Supabase Dashboard

1. **Authentication** > **Users** : Liste des utilisateurs connectés
2. **Logs** > Filtrer par `auth.signInWithOAuth`

#### Console développeur navigateur

```javascript
// Vérifier la connexion
const { data: { session } } = await supabase.auth.getSession()
console.log('Session Google:', session)
```

### Métriques clés

| Métrique | Description | Où la voir |
|----------|-------------|------------|
| **Nouveaux users Google** | Utilisateurs créés via Google | Supabase > Users |
| **Taux de conversion** | % de clics qui aboutissent | Google Analytics |
| **Erreurs OAuth** | Redirections échouées | Supabase Logs |

---

## 🎯 Fonctionnalités avancées

### Personnaliser le profil utilisateur

Le backend récupère automatiquement :

```typescript
{
  email: session.user.email,
  fullName: session.user.user_metadata?.full_name,
  avatar: session.user.user_metadata?.avatar_url,
  provider: 'google'
}
```

Pour récupérer plus d'infos, modifiez `/supabase/functions/server/index.tsx` :

```typescript
// Route: /auth/oauth-callback
const userData = {
  id: providerId,
  email,
  fullName: session.user.user_metadata?.full_name || email.split('@')[0],
  phone: '',
  userType: 'client',
  provider,
  // Nouveaux champs :
  avatar: session.user.user_metadata?.avatar_url,
  emailVerified: session.user.email_verified,
  locale: session.user.user_metadata?.locale,
  // ...
};
```

### Forcer la re-sélection du compte

```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin,
    queryParams: {
      prompt: 'select_account' // Force le choix du compte
    }
  }
});
```

### Demander des scopes supplémentaires

```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    scopes: 'email profile https://www.googleapis.com/auth/calendar.readonly'
  }
});
```

---

## 📚 Ressources utiles

### Documentation officielle

- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

### Tutoriels vidéo

- [Supabase Google Auth Tutorial](https://www.youtube.com/watch?v=dU7GwCOgvNY)
- [OAuth 2.0 Explained](https://www.youtube.com/watch?v=996OiexHze0)

### Support

- **Email :** support@moncolis.express
- **Documentation technique :** `/BACKEND_INTEGRATION_GUIDE.md`
- **Code source :** `/src/contexts/AuthContext.tsx`

---

## ✨ Checklist de validation

Avant de passer en production, vérifiez :

- [ ] ✅ Google Cloud Project créé
- [ ] ✅ OAuth consent screen configuré
- [ ] ✅ Credentials OAuth 2.0 créés
- [ ] ✅ Redirect URIs corrects
- [ ] ✅ Supabase provider Google activé
- [ ] ✅ Client ID et Secret configurés dans Supabase
- [ ] ✅ Test de connexion réussi en dev
- [ ] ✅ Utilisateur créé dans la base de données
- [ ] ✅ Session persistante après refresh
- [ ] ✅ Déconnexion fonctionnelle
- [ ] ✅ Domaines production autorisés
- [ ] ✅ App Google publiée (pour production)

---

## 🎉 Félicitations !

Vous avez configuré avec succès l'authentification Google pour MonColis.express !

Vos utilisateurs peuvent maintenant se connecter en un clic avec leur compte Google.

**Développé avec ❤️ pour l'Afrique de l'Ouest**

---

**Version :** 1.0.0  
**Dernière mise à jour :** 28 Janvier 2026  
**Testé avec :** Supabase v2.93.2 | Google OAuth 2.0
