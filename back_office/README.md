# Bigscreen Back Office

## 🚀 Présentation

**Interface d’administration pour la gestion et l’analyse des sondages**  
Ce back office permet aux administrateurs de piloter l’ensemble des sondages Bigscreen : visualisation des statistiques en temps réel, gestion des questionnaires, consultation des réponses et authentification sécurisée. L’application est construite avec React, TypeScript, Vite et Tailwind CSS pour une expérience moderne et performante.

---

## 📋 Prérequis

- Node.js (>= 18)
- npm (>= 9) ou yarn/pnpm
- Accès à l’API backend Bigscreen (voir README backend)

---

## 🛠 Installation

1. **Cloner le dépôt**  
   `git clone https://url-de-ton-depot.git`
2. **Installer les dépendances**  
   `npm install`  
   ou  
   `yarn install`
3. **Configurer l’environnement**  
   Adapter le fichier `.env` si besoin (API_URL, etc.)
4. **Lancer le serveur de développement**  
   `npm run dev`  
   ou  
   `yarn dev`
5. **Accéder à l’application**  
   Ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur

---

## 📂 Structure du Projet

- `/src/components` : Composants UI réutilisables (boutons, tableaux, formulaires, etc.)
- `/src/pages` : Pages principales (Dashboard, Questions, Réponses, Login)
- `/src/services` : Services d’appel API (auth, admin, etc.)
- `/src/context` : Contextes React (authentification)
- `/src/hooks` : Hooks personnalisés (ex : notifications)
- `/src/lib` : Fonctions utilitaires
- `/src/routes` : Définition des routes et protections d’accès
- `/src` : Fichiers d’entrée (App.tsx, main.tsx, styles)

---

## 🔌 Déploiement

- Builder l’application pour la production :  
  `npm run build`  
  ou  
  `yarn build`
- Les fichiers statiques seront générés dans `/dist`
- Déployer le contenu de `/dist` sur un serveur web (Vercel, Netlify, Nginx, etc.)
- Configurer le reverse proxy pour rediriger les appels API vers le backend

---

## 🤖 Commandes Utiles

- `npm run dev` : Lancer le serveur de développement
- `npm run build` : Générer la version production
- `npm run preview` : Prévisualiser la build
- `npm run lint` : Linter le code

---

## ✉️ Variables d’Environnement

- `VITE_API_URL` : URL de l’API backend (par défaut : http://127.0.0.1:8000/api)
- (Autres variables à ajouter selon vos besoins)

---

## 🚦 Tests

Des tests unitaires peuvent être ajoutés avec Jest, React Testing Library ou Vitest.  
(À compléter selon la stack de test choisie)

---

## 🛡 Sécurité

- Les accès au back office sont protégés par authentification JWT
- Les tokens sont stockés en sessionStorage
- Toujours utiliser HTTPS en production
- Ne jamais exposer d’informations sensibles dans le front

---

## 👥 Contribution

- Forker le projet et créer une branche dédiée
- Respecter les conventions de code (ESLint, Prettier)
- Soumettre une Pull Request détaillée
- Utiliser des messages de commit explicites

---

## ❓ Support

- Pour toute question, ouvrir une issue sur le dépôt GitHub
- Documentation React : https://react.dev
- Documentation Vite : https://vitejs.dev
- Documentation Tailwind : https://tailwindcss.com
- Contact : [à compléter]

---

## 📜 Licence

MIT

---

> _N’hésitez pas à ajouter un logo, badge CI ou schéma d’architecture selon vos besoins !_ 