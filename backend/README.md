# Bigscreen Backend 🎮

## 🚀 Présentation

**Plateform## 📂 Structure du Projet

### Core
```
/app
├── Http/
│   ├── Controllers/    # Contrôleurs de l'application
│   ├── Middleware/     # Middleware personnalisés
│   └── Requests/       # Form requests pour la validation
├── Models/            # Modèles Eloquent
├── Services/         # Services métier
└── Exceptions/       # Gestionnaires d'exceptions
```

### Configuration et Resources
```
/config               # Fichiers de configuration
/database
├── factories/        # Factories pour les tests
├── migrations/       # Migrations de base de données
└── seeders/         # Seeders de données
/resources           # Assets et vues
/routes
├── api.php          # Routes de l'API
├── web.php          # Routes web
└── console.php      # Commandes Artisan
```

### Tests et Documentation
```
/tests
├── Unit/            # Tests unitaires
│   └── Services/    # Tests des services
├── Feature/         # Tests fonctionnels
└── TestCase.php    # Classe de base des tests
/docs               # Documentation API
/storage/logs       # Logs d'applicationn et d'analyse de sondages VR**  
Ce backend propulse une application de gestion de sondages pour Bigscreen, permettant la création, la diffusion et l'analyse de questionnaires. Il offre :

- 🔐 API sécurisée avec authentification JWT
- 👥 Gestion complète des utilisateurs
- 📊 Collecte et analyse des réponses
- 📈 Génération de statistiques en temps réel
- 🔄 Intégration avec le front-office React

Destiné aux administrateurs et analystes, il facilite le suivi en temps réel de la participation et l'extraction de données pour la prise de décision.creen Backend

## 🚀 Présentation

**Plateforme de gestion et d’analyse de sondages**  
Ce backend propulse une application de gestion de sondages, permettant la création, la diffusion et l’analyse de questionnaires. Il propose une API sécurisée pour l’authentification (JWT), la gestion des utilisateurs, la collecte des réponses et la génération de statistiques. Destiné aux administrateurs et analystes, il facilite le suivi en temps réel de la participation et l’extraction de données pour la prise de décision.

---

## 📋 Prérequis

- PHP (>= 8.2)
- Composer
- MySQL/MariaDB/PostgreSQL/SQLite
- Laravel (>= 12.0)
- Node.js & npm (pour le développement front, optionnel)
- Redis/Memcached (optionnel, pour le cache)

---

## 🛠 Installation

1. **Cloner le dépôt**  
   `git clone https://github.com/chedi-ouerghi/Bigscreen/tree/main/backend.git`
2. **Installer les dépendances**  
   `composer install`
3. **Configurer l’environnement**  
   Créer/copier le fichier `.env` et l’adapter  
   `cp .env.example .env`
4. **Générer la clé d’application**  
   `php artisan key:generate`
5. **Configurer la base de données**  
   Modifier les variables DB_* dans `.env`
6. **Générer la clé JWT**  
   `php artisan jwt:secret`
7. **Lancer les migrations et seeders**  
   `php artisan migrate --seed`
8. **Lancer le serveur local**  
   `php artisan serve`

---

## 📂 Structure du Projet

- `/app` : Contrôleurs, modèles, services, exceptions
- `/bootstrap` : Fichiers de démarrage de l’application
- `/config` : Fichiers de configuration (base de données, mail, cache, etc.)
- `/database` : Migrations, seeders, factories
- `/public` : Point d’entrée HTTP (index.php), ressources publiques
- `/resources` : Vues Blade, assets (CSS, JS)
- `/routes` : Définition des routes API, web et console
- `/storage` : Logs, fichiers générés, sessions, cache
- `/tests` : Tests unitaires et fonctionnels

---


## 🤖 Commandes Utiles

- `php artisan migrate`  
- `php artisan db:seed`  
- `php artisan test`  
- `php artisan optimize`  
- `php artisan jwt:secret`  
- `php artisan config:cache`  
- `php artisan route:list`  

---


## 🛡 Sécurité

- Garder Laravel et les dépendances à jour
- Ne jamais exposer le fichier `.env` en production
- Générer des clés uniques pour `APP_KEY` et `JWT_SECRET`
- Restreindre l’accès aux routes d’administration via JWT
- Utiliser HTTPS en production

---


## 👥 Contribution

Pour contribuer au projet :

1. Forker le projet
2. Créer une branche pour votre fonctionnalité
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```
3. Commiter vos changements
   ```bash
   git commit -m "feat: ajout d'une nouvelle fonctionnalité"
   ```
4. Pousser vers la branche
   ```bash
   git push origin feature/nouvelle-fonctionnalite
   ```
5. Ouvrir une Pull Request

### 📝 Convention de Commit
Nous suivons la convention [Conventional Commits](https://www.conventionalcommits.org/) :
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `test:` Ajout ou modification de tests
- `refactor:` Refactoring de code
- `style:` Changements de style (formatage)

## ❓ Support

- Pour toute question technique : ouvrir une issue sur le dépôt GitHub
- Documentation Laravel : https://laravel.com/docs
- Documentation API : `/api/documentation`
- Contact équipe : bigscreen-support@example.com

## 📜 Licence

MIT License - Copyright (c) 2025 Bigscreen VR

La permission est accordée, gratuitement, à toute personne obtenant une copie de ce logiciel et des fichiers de documentation associés.

## 🧪 Tests Unitaires

L'application est couverte par une suite complète de tests unitaires. Voici la structure et les résultats des tests :

### 📊 Résumé des Tests
- **Total Tests**: 8 tests réussis
- **Assertions**: 23 assertions validées
- **Durée**: 0.74 secondes

### 🔍 Détails par Service

#### ResponseService
Tests de gestion des réponses aux sondages :
```bash
✓ Création d'une réponse complète avec réponses (0.38s)
✓ Création d'une réponse sans réponses (0.03s)
```

#### StatisticsService
Tests des fonctionnalités statistiques :
```bash
✓ Récupération correcte des statistiques du tableau de bord (0.03s)
✓ Gestion des statistiques avec base de données vide (0.01s)
```

#### SurveyService
Tests de gestion des sondages :
```bash
✓ Récupération uniquement des sondages actifs (0.02s)
✓ Gestion d'une liste vide de sondages actifs (0.02s)
```

#### TokenService
Tests de génération des tokens :
```bash
✓ Génération d'UUID valides (0.02s)
✓ Unicité des tokens générés
```

### 🔄 Exécution des Tests
Pour lancer les tests :
```bash
php artisan test
```

Pour lancer les tests avec couverture de code :
```bash
php artisan test --coverage
```

### 📝 Convention de Tests
- Chaque service a sa propre classe de test
- Nomenclature : `{ServiceName}Test`
- Les tests suivent le pattern Arrange-Act-Assert
- Utilisation de factories pour les données de test
- Tests isolés avec RefreshDatabase

