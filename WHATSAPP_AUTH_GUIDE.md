# Guide d'Authentification WhatsApp - MonColis.express

## Vue d'ensemble

MonColis.express intègre maintenant l'**authentification par WhatsApp** via code OTP, permettant aux utilisateurs de se connecter et s'inscrire facilement avec leur numéro de téléphone.

---

## 🎯 Fonctionnalités

✅ **Envoi de code OTP** via WhatsApp  
✅ **Vérification OTP** avec 3 tentatives maximum  
✅ **Renvoi de code** avec limitation de 60 secondes  
✅ **Création automatique de compte** si nouveau numéro  
✅ **Session persistante** de 30 jours  
✅ **Rate limiting** pour éviter les abus  

---

## 🔧 Architecture Backend

### Routes API

#### 1. **Envoyer un code OTP**
```http
POST /make-server-8b692521/auth/whatsapp/send-otp
```

**Requête :**
```json
{
  "phone": "+221775207171"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Code OTP envoyé via WhatsApp",
  "otp": "123456"  // Uniquement en développement
}
```

**Fonctionnement :**
- Génère un code OTP à 6 chiffres
- Stocke le code avec expiration de 5 minutes
- En production, envoie via WhatsApp Business API
- En développement, retourne le code dans la réponse

---

#### 2. **Vérifier le code OTP**
```http
POST /make-server-8b692521/auth/whatsapp/verify-otp
```

**Requête :**
```json
{
  "phone": "+221775207171",
  "otp": "123456",
  "fullName": "Mamadou Diallo"  // Optionnel, pour nouveaux utilisateurs
}
```

**Réponse :**
```json
{
  "success": true,
  "accessToken": "uuid-session-token",
  "user": {
    "id": "user-uuid",
    "email": "+221775207171@whatsapp.moncolis.sn",
    "fullName": "Mamadou Diallo",
    "phone": "+221775207171",
    "userType": "client"
  }
}
```

**Fonctionnement :**
- Vérifie le code OTP
- Si nouveau numéro, crée un compte automatiquement
- Si utilisateur existant, connecte simplement
- Génère un token de session de 30 jours
- Limite à 3 tentatives de vérification

---

#### 3. **Renvoyer un code OTP**
```http
POST /make-server-8b692521/auth/whatsapp/resend-otp
```

**Requête :**
```json
{
  "phone": "+221775207171"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Nouveau code OTP envoyé",
  "otp": "654321"  // Uniquement en développement
}
```

**Fonctionnement :**
- Vérifie qu'au moins 60 secondes se sont écoulées
- Génère un nouveau code
- Réinitialise le compteur de tentatives

---

## 💻 Utilisation Frontend

### 1. **Contexte d'authentification**

Le `AuthContext` expose ces méthodes :

```tsx
const {
  sendWhatsAppOTP,      // Envoyer le code
  resendWhatsAppOTP,    // Renvoyer le code
  loginWithWhatsApp     // Vérifier et connecter
} = useAuth();
```

### 2. **Exemple d'utilisation**

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

function WhatsAppLogin() {
  const { sendWhatsAppOTP, loginWithWhatsApp } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  // Étape 1 : Envoyer le code
  const handleSendOTP = async () => {
    try {
      const response = await sendWhatsAppOTP(phone);
      toast.success('Code OTP envoyé !');
      
      // En développement, affiche le code
      if (response.otp) {
        toast.info(`Code de test : ${response.otp}`);
      }
      
      setStep('otp');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Étape 2 : Vérifier le code et connecter
  const handleVerifyOTP = async () => {
    try {
      await loginWithWhatsApp(phone, otp);
      toast.success('Connexion réussie !');
      // Redirection automatique
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {step === 'phone' ? (
        <div>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+221 77 520 71 71"
          />
          <button onClick={handleSendOTP}>
            Envoyer le code
          </button>
        </div>
      ) : (
        <div>
          <input 
            type="text" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
          />
          <button onClick={handleVerifyOTP}>
            Vérifier
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 🔐 Sécurité

### Mesures en place :

1. **Expiration OTP** : 5 minutes
2. **Tentatives limitées** : 3 essais maximum
3. **Rate limiting** : 60 secondes entre chaque envoi
4. **Session sécurisée** : Token UUID stocké en KV
5. **Validation du format** : Numéro de téléphone requis

### Format des numéros :

```
✅ Acceptés :
+221775207171
+225071234567
+22212345678

❌ Non recommandés :
775207171 (sans indicatif)
0775207171 (avec 0)
```

---

## 🌍 Intégration WhatsApp Business API (Production)

Pour activer l'envoi réel de messages WhatsApp, suivez ces étapes :

### 1. **Créer un compte WhatsApp Business**

Rendez-vous sur : https://business.facebook.com/

### 2. **Obtenir les credentials**

Vous aurez besoin de :
- `WHATSAPP_ACCESS_TOKEN` : Token d'accès à l'API
- `WHATSAPP_PHONE_NUMBER_ID` : ID du numéro WhatsApp Business

### 3. **Configurer les variables d'environnement**

Ajoutez dans Supabase :
```bash
WHATSAPP_ACCESS_TOKEN=votre_token
WHATSAPP_PHONE_NUMBER_ID=votre_phone_id
ENVIRONMENT=production
```

### 4. **Code d'intégration (déjà dans index.tsx)**

Le code suivant est déjà préparé dans `/supabase/functions/server/index.tsx` :

```typescript
const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messaging_product: 'whatsapp',
    to: phone,
    type: 'template',
    template: {
      name: 'authentication_otp',
      language: { code: 'fr' },
      components: [{
        type: 'body',
        parameters: [{ type: 'text', text: otp }]
      }]
    }
  })
});
```

### 5. **Créer un template de message**

Dans le Manager WhatsApp Business, créez un template nommé `authentication_otp` :

```
Votre code de vérification MonColis.express est : {{1}}

Ce code expire dans 5 minutes. Ne le partagez avec personne.
```

---

## 📱 Interface utilisateur

### Composants mis à jour :

#### 1. **LoginScreen.tsx**
- ✅ Bouton "Continuer avec WhatsApp" ajouté
- ✅ Intégration du flux OTP
- ✅ Design cohérent avec les couleurs MonColis

#### 2. **RegisterScreen.tsx**
- Peut également être mis à jour pour accepter l'inscription par WhatsApp

### Design du bouton WhatsApp :

```tsx
<Button
  variant="outline"
  className="w-full h-12 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
>
  <WhatsAppIcon className="mr-2 h-5 w-5" />
  Continuer avec WhatsApp
</Button>
```

---

## 🧪 Tests en développement

### 1. **Tester l'envoi d'OTP**

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8b692521/auth/whatsapp/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+221775207171"}'
```

Réponse :
```json
{
  "success": true,
  "message": "Code OTP envoyé via WhatsApp",
  "otp": "123456"
}
```

### 2. **Tester la vérification**

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8b692521/auth/whatsapp/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+221775207171",
    "otp": "123456",
    "fullName": "Test User"
  }'
```

---

## 🐛 Dépannage

### Problème : "Code OTP expiré"
**Solution :** Le code expire après 5 minutes. Demandez un nouveau code.

### Problème : "Trop de tentatives"
**Solution :** Attendez 60 secondes et demandez un nouveau code.

### Problème : "Numéro de téléphone requis"
**Solution :** Vérifiez que le numéro inclut l'indicatif pays (+221, +225, etc.)

### Problème : Le code ne s'envoie pas en production
**Solution :** 
1. Vérifiez les variables d'environnement `WHATSAPP_ACCESS_TOKEN` et `WHATSAPP_PHONE_NUMBER_ID`
2. Vérifiez que le template WhatsApp est approuvé
3. Consultez les logs de l'API WhatsApp Business

---

## 📊 Métriques et logs

### Logs disponibles :

```typescript
// Dans la console serveur
console.log(`WhatsApp OTP for ${phone}: ${otp}`);
console.log(`New WhatsApp user registered: ${phone}`);
```

### Données stockées en KV :

```typescript
// OTP temporaire
`whatsapp_otp:${phone}` → {
  code: string,
  phone: string,
  expiresAt: string,
  attempts: number,
  createdAt: string
}

// Session
`session:${token}` → {
  userId: string,
  phone: string,
  expiresAt: string,
  createdAt: string
}
```

---

## ✅ Checklist de déploiement

- [x] Routes API WhatsApp créées
- [x] Fonctions frontend implémentées
- [x] AuthContext mis à jour
- [x] Interface utilisateur ajoutée
- [ ] Variables d'environnement configurées (WHATSAPP_*)
- [ ] Template WhatsApp créé et approuvé
- [ ] Tests en production effectués
- [ ] Documentation utilisateur créée

---

## 📞 Support

Pour toute question concernant l'authentification WhatsApp :
- Email : tech@moncolis.express
- Téléphone : +221 77 123 45 67
- Documentation WhatsApp Business API : https://developers.facebook.com/docs/whatsapp

---

**MonColis.express** © 2026 - Authentification WhatsApp v1.0
