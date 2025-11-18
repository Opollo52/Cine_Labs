# Instructions de déploiement Vercel

## ✅ Préparatifs terminés

Votre projet est maintenant prêt pour le déploiement sur Vercel avec une clé API sécurisée !

## 🚀 Étapes de déploiement

### 1. Pousser le code sur GitHub
```bash
git add .
git commit -m "Préparation pour déploiement Vercel avec API sécurisée"
git push origin main
```

### 2. Déployer sur Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "New Project"
4. Sélectionnez votre repo `Cine_Labs`
5. Cliquez sur "Deploy"

### 3. Configurer la variable d'environnement
1. Dans le dashboard Vercel, allez dans votre projet
2. Settings → Environment Variables
3. Ajoutez :
   - **Name**: `TMDB_API_KEY`
   - **Value**: `6145ca8fc18ffdbfefeecbed20274aad`
   - **Environments**: Cochez tout (Production, Preview, Development)
4. Cliquez sur "Save"

### 4. Redéployer
1. Allez dans l'onglet "Deployments"
2. Cliquez sur le bouton "Redeploy" du dernier déploiement

## 🔒 Sécurité

- ✅ Le fichier `env.js` est exclu du déploiement (`.gitignore`)
- ✅ La clé API est stockée de manière sécurisée sur Vercel
- ✅ L'API proxy `/api/movies.js` gère les appels TMDB côté serveur
- ✅ Aucune clé API n'est exposée côté client en production

## 🧪 Test local

Votre site fonctionne déjà en local sur : http://localhost:8000

## 📁 Structure finale

```
api/
  movies.js          # API proxy sécurisée
env.js              # Clé API pour développement local (non déployée)
vercel.json         # Configuration Vercel
package.json        # Métadonnées du projet
.gitignore          # Exclusions Git (env.js, etc.)
```

Votre site sera disponible sur une URL comme : `https://cine-labs-xxx.vercel.app`