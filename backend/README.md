# Bigscreen Backend

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
   `git clone https://url-de-ton-depot.git`
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

## ✉️ Variables d’Environnement

Variables principales à définir dans `.env` :
- `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL`
- `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `CACHE_STORE`, `SESSION_DRIVER`, `SESSION_LIFETIME`
- `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`
- `JWT_SECRET`, `JWT_TTL`, `JWT_BLACKLIST_ENABLED`
- `LOG_CHANNEL`, `LOG_LEVEL`
- (optionnel) `REDIS_*`, `MEMCACHED_*`, `AWS_*`, `SLACK_*`, etc.


---

## 🛡 Sécurité

- Garder Laravel et les dépendances à jour
- Ne jamais exposer le fichier `.env` en production
- Générer des clés uniques pour `APP_KEY` et `JWT_SECRET`
- Restreindre l’accès aux routes d’administration via JWT
- Utiliser HTTPS en production

---


## ❓ Support

- Pour toute question, ouvrir une issue sur le dépôt GitHub
- Documentation Laravel : https://laravel.com/docs
- Contact : [à compléter]

---

## 📜 Licence

MIT

## test unitaire 


   PASS  Tests\Unit\Services\ResponseServiceTest
  ✓ create response stores survey response with answers                                       0.38s  
  ✓ create response with empty answers                                                        0.03s  

   PASS  Tests\Unit\Services\StatisticsServiceTest
  ✓ get dashboard stats returns correct counts                                                0.03s  
  ✓ get dashboard stats returns zero counts when no data                                      0.01s  

   PASS  Tests\Unit\Services\SurveyServiceTest
  ✓ get active surveys returns only active surveys                                            0.02s  
  ✓ get active surveys returns empty collection when no active surveys                        0.02s  

   PASS  Tests\Unit\Services\TokenServiceTest
  ✓ generate returns valid uuid                                                               0.02s  
  ✓ generate returns unique tokens

  Tests:    8 passed (23 assertions)
  Duration: 0.74s

