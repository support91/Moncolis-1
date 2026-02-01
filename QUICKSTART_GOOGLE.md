# 🚀 Guide de démarrage rapide - Authentification Google

## ⏱️ Temps total : 17 minutes

---

## Étape 1 : Google Cloud Console (10 min)

### 1. Créer le projet

```
🌐 https://console.cloud.google.com/

1. Cliquez sur le sélecteur de projet (en haut)
2. Cliquez "New Project"
3. Nom : "MonColis Express Auth"
4. Cliquez "Create"
5. Attendez 30 secondes
```

### 2. Activer Google+ API

```
📚 Dans le menu latéral :
   APIs & Services > Library

1. Cherchez : "Google+ API"
2. Cliquez sur le résultat
3. Cliquez "Enable"
4. Attendez l'activation
```

### 3. Configurer OAuth Consent

```
👥 Dans le menu latéral :
   APIs & Services > OAuth consent screen

1. Sélectionnez : "External"
2. Cliquez "Create"

Remplissez :
- App name : MonColis Express
- User support email : votre@email.com
- Developer email : votre@email.com

3. Cliquez "Save and Continue"

Scopes :
4. Cliquez "Add or Remove Scopes"
5. Cochez : email, profile, openid
6. Cliquez "Update" puis "Save and Continue"

Test users (optionnel en dev) :
7. Ajoutez votre email Gmail
8. Cliquez "Save and Continue"
```

### 4. Créer OAuth Credentials

```
🔑 Dans le menu latéral :
   APIs & Services > Credentials

1. Cliquez "Create Credentials"
2. Sélectionnez "OAuth client ID"
3. Type : "Web application"
4. Nom : "MonColis Express Web Client"

JavaScript origins :
5. Ajoutez : http://localhost:5173

Redirect URIs :
6. Ajoutez : https://VOTRE-PROJECT-ID.supabase.co/auth/v1/callback
7. Ajoutez : http://localhost:5173

⚠️ IMPORTANT : Remplacez VOTRE-PROJECT-ID par votre vrai ID Supabase !

8. Cliquez "Create"

9. ✅ Copiez le Client ID et Client Secret quelque part
```

**🎉 Google Cloud est configuré !**

---

## Étape 2 : Supabase Dashboard (5 min)

### 1. Ouvrir les paramètres d'auth

```
🌐 https://supabase.com/dashboard

1. Sélectionnez votre projet MonColis.express
2. Dans le menu latéral : Authentication
3. Cliquez sur "Providers"
4. Trouvez "Google" dans la liste
```

### 2. Activer et configurer

```
1. Activez le toggle "Enable Sign in with Google"

2. Collez vos identifiants Google :
   - Client ID : 123456789-abcd...apps.googleusercontent.com
   - Client Secret : GOCSPX-xxxxxxxxxxxxx

3. Cliquez "Save"
```

**🎉 Supabase est configuré !**

---

## Étape 3 : Test (2 min)

### 1. Lancer l'application

```bash
cd votre-projet
npm run dev
```

Ouvrez : `http://localhost:5173`

### 2. Tester la connexion

```
1. Sélectionnez "Mode Client"
2. Passez l'écran splash (ou skip)
3. Sur l'écran de connexion :
   👉 Cliquez "Continuer avec Google"
4. Sélectionnez votre compte Google
5. Acceptez les permissions

✅ Vous êtes connecté au dashboard client !
```

---

## 🐛 Problèmes courants

### "provider is not enabled"

```
❌ Cause : Toggle pas activé dans Supabase
✅ Solution : 
   Supabase > Authentication > Providers > Google
   Activez le toggle et sauvegardez
```

### "redirect_uri_mismatch"

```
❌ Cause : URI pas dans la liste autorisée
✅ Solution :
   Google Cloud Console > Credentials > Votre OAuth Client
   Ajoutez : https://VOTRE-PROJECT-ID.supabase.co/auth/v1/callback
   ⚠️ Pas d'espace, pas de slash final
```

### "Access blocked"

```
❌ Cause : Consent screen mal configuré
✅ Solution :
   Google Cloud Console > OAuth consent screen
   Vérifiez que email, profile, openid sont dans les scopes
   Ou ajoutez votre email en "Test user"
```

---

## 📝 Checklist finale

Avant de valider que tout fonctionne :

- [ ] Projet Google Cloud créé
- [ ] Google+ API activé
- [ ] OAuth consent screen rempli
- [ ] OAuth credentials créés
- [ ] Client ID et Secret copiés
- [ ] Redirect URI ajouté (avec vrai project ID)
- [ ] Supabase provider Google activé
- [ ] Client ID et Secret collés dans Supabase
- [ ] Sauvegardé dans Supabase
- [ ] Test de connexion réussi

---

## 🎯 Étapes suivantes

### Pour la production

Quand vous déployez MonColis.express :

1. **Ajoutez le domaine production** dans Google Cloud :
   ```
   Authorized JavaScript origins :
   - https://moncolis.express
   - https://app.moncolis.express
   
   Authorized redirect URIs :
   - https://VOTRE-PROJECT-ID.supabase.co/auth/v1/callback
   - https://moncolis.express
   - https://app.moncolis.express
   ```

2. **Publiez l'app Google** :
   ```
   Google Cloud Console > OAuth consent screen
   Cliquez "Publish App"
   Complétez le processus de vérification (1-2 semaines)
   ```

3. **Monitoring** :
   ```
   - Supabase Dashboard > Authentication > Users
   - Google Cloud Console > APIs & Services > Dashboard
   ```

---

## 📚 Documentation complète

Pour plus de détails :

- **Configuration détaillée** : `/GOOGLE_AUTH_SETUP.md`
- **Documentation développeur** : `/README_GOOGLE.md`
- **Récapitulatif implémentation** : `/GOOGLE_IMPLEMENTATION.md`

---

## 🎉 C'est terminé !

L'authentification Google est opérationnelle pour MonColis.express !

**Développé avec ❤️ pour l'Afrique de l'Ouest**

---

**Temps total réel :** 15-20 minutes  
**Difficulté :** ⭐⭐☆☆☆ (Facile)  
**Status :** ✅ Production Ready
