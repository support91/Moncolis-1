# Configuration WhatsApp Business API - MonColis.express

## 📋 Guide de mise en place rapide

Ce guide vous accompagne pas à pas pour activer l'authentification WhatsApp sur MonColis.express.

---

## ✅ Étape 1 : Prérequis

Avant de commencer, assurez-vous d'avoir :

- [ ] Un compte Facebook Business Manager
- [ ] Un numéro de téléphone dédié pour WhatsApp Business
- [ ] Accès à la console Supabase de votre projet
- [ ] Carte bancaire pour vérification (gratuit jusqu'à 1000 conversations/mois)

---

## 🔧 Étape 2 : Créer un compte WhatsApp Business

### 2.1 Accéder à Facebook Business Manager

1. Allez sur : https://business.facebook.com
2. Cliquez sur **"Créer un compte"**
3. Remplissez les informations de votre entreprise :
   - Nom : **MonColis.express**
   - Adresse email professionnelle
   - Site web : votre domaine

### 2.2 Configurer WhatsApp Business

1. Dans le menu, allez à **"WhatsApp Business"**
2. Cliquez sur **"Commencer"**
3. Sélectionnez **"Créer un compte WhatsApp Business"**

### 2.3 Ajouter un numéro de téléphone

1. Entrez votre numéro dédié (ex: +221 77 XXX XX XX)
2. Vérifiez le numéro via SMS ou appel
3. Choisissez le nom d'affichage : **MonColis.express**

---

## 🔑 Étape 3 : Obtenir les credentials API

### 3.1 Créer une application

1. Allez dans **"Paramètres de l'application"**
2. Cliquez sur **"Ajouter une application"**
3. Choisissez **"Business"**
4. Nommez l'application : **MonColis Auth**

### 3.2 Activer l'API WhatsApp

1. Dans le tableau de bord de l'application
2. Cherchez **"WhatsApp"** dans les produits
3. Cliquez sur **"Configurer"**

### 3.3 Générer un token d'accès

1. Dans la section **"API Setup"**
2. Cliquez sur **"Generate Token"**
3. Sélectionnez les permissions :
   - ✅ `whatsapp_business_messaging`
   - ✅ `whatsapp_business_management`
4. **Copiez le token** (vous ne le reverrez plus !)

**Format du token :**
```
EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3.4 Récupérer le Phone Number ID

1. Toujours dans **"API Setup"**
2. Trouvez **"Phone Number ID"** sous votre numéro
3. **Copiez l'ID** (format : 15-20 chiffres)

**Exemple :**
```
123456789012345
```

---

## 🌐 Étape 4 : Configurer Supabase

### 4.1 Accéder aux variables d'environnement

1. Connectez-vous à https://supabase.com
2. Sélectionnez votre projet MonColis
3. Allez dans **"Settings"** → **"Edge Functions"** → **"Environment Variables"**

### 4.2 Ajouter les variables

Créez ces 3 variables :

| Nom | Valeur | Description |
|-----|--------|-------------|
| `WHATSAPP_ACCESS_TOKEN` | `EAAxxxxx...` | Token copié à l'étape 3.3 |
| `WHATSAPP_PHONE_NUMBER_ID` | `123456789012345` | ID copié à l'étape 3.4 |
| `ENVIRONMENT` | `production` | Active l'envoi réel |

### 4.3 Redéployer les Edge Functions

```bash
# Si vous utilisez la CLI Supabase
supabase functions deploy make-server-8b692521
```

Ou utilisez le bouton **"Redeploy"** dans le dashboard Supabase.

---

## 📝 Étape 5 : Créer le template de message

### 5.1 Accéder aux templates

1. Dans WhatsApp Business Manager
2. Allez dans **"Message Templates"**
3. Cliquez sur **"Create Template"**

### 5.2 Configurer le template

**Nom du template :**
```
authentication_otp
```

**Catégorie :**
- Sélectionnez : **"Authentication"**

**Langue :**
- Sélectionnez : **"Français"**

**Corps du message :**
```
Votre code de vérification MonColis.express est : {{1}}

Ce code expire dans 5 minutes. Ne le partagez avec personne.

⚠️ MonColis ne vous demandera JAMAIS votre code par téléphone.
```

**Variables :**
- `{{1}}` : Le code OTP (sera remplacé automatiquement)

### 5.3 Soumettre pour approbation

1. Cliquez sur **"Submit"**
2. Attendez l'approbation (généralement 1-24h)
3. Vous recevrez un email de confirmation

---

## 🧪 Étape 6 : Tester l'intégration

### 6.1 Test en mode développement

Avant l'approbation du template, testez avec les logs :

```bash
# Surveillez les logs Supabase
# Le code OTP sera affiché dans la console
```

### 6.2 Test en production

Une fois le template approuvé :

1. Ouvrez l'application MonColis
2. Cliquez sur **"Continuer avec WhatsApp"**
3. Entrez votre numéro de test : `+221 XX XXX XX XX`
4. Vérifiez la réception du message WhatsApp
5. Entrez le code reçu

### 6.3 Vérifier le fonctionnement

✅ **Succès si :**
- Vous recevez le message WhatsApp en moins de 5 secondes
- Le code a 6 chiffres
- La connexion fonctionne après saisie du code
- Un nouveau compte est créé si c'est votre première fois

❌ **Problème si :**
- Pas de message reçu → Vérifiez les credentials
- Erreur "Template not approved" → Attendez l'approbation
- Code invalide → Vérifiez l'expiration (5 min max)

---

## 📊 Étape 7 : Monitoring et quotas

### 7.1 Quotas gratuits

WhatsApp Business API offre :
- ✅ **1000 conversations gratuites/mois**
- ✅ Messages d'authentification à tarif réduit
- ✅ Conversations de 24h avec les utilisateurs

### 7.2 Surveiller l'utilisation

1. Dans le tableau de bord WhatsApp Business
2. Allez dans **"Analytics"**
3. Consultez :
   - Nombre de messages envoyés
   - Taux de livraison
   - Taux de lecture

### 7.3 Configurer les alertes

Recevez des alertes quand :
- Vous atteignez 80% du quota
- Un message échoue
- Le template est rejeté

---

## 🔐 Sécurité et bonnes pratiques

### ✅ À faire :

- **Gardez le token secret** : Ne le commitez JAMAIS dans Git
- **Utilisez HTTPS** : Toujours pour les webhooks
- **Limitez les tentatives** : Notre système limite à 3 essais
- **Validez les numéros** : Format international requis (+221...)
- **Loggez les erreurs** : Pour debug et monitoring
- **Respectez les quotas** : Évitez les envois massifs

### ❌ À éviter :

- Partager le token d'accès
- Utiliser le même numéro pour test et prod
- Envoyer des messages promotionnels (interdit pour auth)
- Ignorer les taux d'échec
- Stocker les codes OTP trop longtemps

---

## 🆘 Résolution de problèmes

### Problème : "Invalid access token"

**Solutions :**
1. Vérifiez que le token est correct dans Supabase
2. Régénérez un nouveau token
3. Vérifiez l'expiration du token (90 jours par défaut)

### Problème : "Phone number not registered"

**Solutions :**
1. Vérifiez que le numéro est bien enregistré dans WhatsApp Business
2. Vérifiez le Phone Number ID
3. Assurez-vous que le numéro est vérifié

### Problème : "Template not found"

**Solutions :**
1. Vérifiez que le template est approuvé
2. Vérifiez le nom exact : `authentication_otp`
3. Vérifiez la langue : `fr`

### Problème : Messages non reçus

**Solutions :**
1. Vérifiez que le numéro destinataire a WhatsApp installé
2. Vérifiez le format du numéro (+221...)
3. Consultez les logs de l'API WhatsApp
4. Vérifiez le statut du message dans le dashboard

---

## 📞 Support

### Documentation officielle :

- WhatsApp Business API : https://developers.facebook.com/docs/whatsapp
- Guide d'authentification : https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates
- API Reference : https://developers.facebook.com/docs/whatsapp/cloud-api/reference

### Support MonColis :

- Email : tech@moncolis.express
- Téléphone : +221 77 123 45 67
- Documentation : `/WHATSAPP_AUTH_GUIDE.md`

---

## ✅ Checklist finale

Avant de passer en production, vérifiez :

- [ ] Token d'accès configuré dans Supabase
- [ ] Phone Number ID configuré dans Supabase
- [ ] Variable ENVIRONMENT = "production"
- [ ] Template "authentication_otp" approuvé
- [ ] Test réussi avec un numéro réel
- [ ] Monitoring configuré
- [ ] Quotas vérifiés
- [ ] Logs activés
- [ ] Documentation équipe complétée

---

## 🎉 Félicitations !

Votre authentification WhatsApp est maintenant opérationnelle ! 

Les utilisateurs de MonColis.express peuvent désormais se connecter en quelques secondes avec leur numéro WhatsApp.

**Prochaines étapes recommandées :**
1. Configurer les webhooks pour recevoir les réponses
2. Ajouter des analytics personnalisés
3. Créer d'autres templates pour notifications
4. Implémenter le support client via WhatsApp

---

**MonColis.express** © 2026 - Configuration WhatsApp Business v1.0
