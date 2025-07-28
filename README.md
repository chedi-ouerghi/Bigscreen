# Bigscreen

## Description du Projet
Bigscreen est une application web complète composée de trois parties principales :
- Un front-office (interface utilisateur)
- Un back-office (interface d'administration)
- Une API backend construite avec Laravel

## Structure du Projet

### Front-office (`/front_office`)
Interface utilisateur principale développée avec :
- React + TypeScript
- Vite comme bundler
- Tailwind CSS pour le styling
- Components UI personnalisés

### Back-office (`/back_office`)
Interface d'administration développée avec :
- React + TypeScript
- Vite comme bundler
- Tailwind CSS
- Système d'authentification
- Dashboard administrateur

### Backend (`/backend`)
API REST développée avec :
- Laravel 
- JWT pour l'authentification
- Base de données MySQL/PostgreSQL
- Tests unitaires et fonctionnels avec PHPUnit

## Prérequis
- Node.js (version LTS recommandée)
- PHP 8.x
- Composer
- MySQL/PostgreSQL
- Bun (pour le front-office)

## Installation

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Back-office
```bash
cd back_office
npm install
npm run dev
```

### Front-office
```bash
cd front_office
bun install
bun run dev
```

## Fonctionnalités principales
- Authentification utilisateur et administrateur
- Gestion des utilisateurs
- Dashboard d'administration
- Interface utilisateur responsive

## Tests
```bash
# Backend
cd backend
php artisan test

# Front-office & Back-office
npm run test
```

## Documentation API
Une collection Postman est disponible dans le dossier `backend/postman_collection.json`

## Contribution
1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence
Ce projet est sous licence MIT
