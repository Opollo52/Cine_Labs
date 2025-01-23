
# Cine_Labs

Cine_Labs est un site web permettant de rechercher des films via une API. Il fournit des informations détaillées sur les films, notamment la description, le casting, les notes et bien plus encore. 

---

## 📝 Lien vers le github

[Github](https://github.com/Opollo52/Cine_Labs)

---

## 🚀 Fonctionnalités principales

- Recherche de films via une API externe.
- Affichage des détails d'un film : description, casting, genres, notes.
- Pages principales :
  - **Accueil** (`index.html`) : Présentation des films populaires.
  - **Recherche** (`search.html`) : Recherche de films.
  - **Détails du film** (`movie.html`) : Informations complètes sur un film.
  - **Contact** (`contact.html`) : Formulaire pour nous contacter.

---

## 📦 Installation

### Pré-requis

Assurez-vous d'avoir les outils suivants installés sur votre système :

- [Node.js](https://nodejs.org/).
- [Git](https://git-scm.com/).

### 🔧 Étapes d'installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/Cine_Labs
   ```

2. Configurez les variables d'environnement pour l'API :
   - Copiez le fichier `env-example.js` et renommez-le en `env.js`.
   - Aller sur le site de TMDb pour obtenir votre clé API. -> [The Movie Database (TMDb)](https://www.themoviedb.org/?language=fr)
   - Ajoutez votre clé API dans le fichier `env.js` :
     ```javascript
     export const API_KEY = 'your_api_key';
     ```

---

## 🔗 API utilisée

Ce projet utilise une API de films pour récupérer les informations. Voici les détails :

- **Nom de l'API** : [The Movie Database (TMDb)](https://www.themoviedb.org/)
- **Fonctionnalités** :
  - Recherche de films par titre.
  - Récupération des détails d'un film : description, casting, notes, genres.

---

## 🛠️ Languages utilisées

- **Frontend** : HTML5, CSS3, JavaScript (vanilla).
- **API** : [TMDb API](https://www.themoviedb.org/documentation/api).

---

## 📚 Ressources utiles

- [Documentation de l'API TMDb](https://www.themoviedb.org/documentation/api)
- [Tutoriel TMDb pour les développeurs](https://developers.themoviedb.org/3/getting-started/introduction)

---

## © Licence

© 2025 Cinelabs. Tous droits réservés.
