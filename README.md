# Dashboard Collaboratif - Frontend

Ce projet est un dashboard collaboratif permettant d'importer, analyser et visualiser des jeux de données, avec gestion multi-utilisateur, sécurité et traçabilité. Développé pour le Master 2 Data & Développement.

## 📋 Fonctionnalités

- **Authentification & rôles** : Connexion sécurisée avec JWT, gestion des rôles admin/utilisateur
- **Importation de données** : Support CSV et XLSX avec prévisualisation et nettoyage
- **Visualisation dynamique** : Graphiques interactifs (barres, lignes, camemberts)
- **Analyse de données** : Statistiques descriptives, matrices de corrélation
- **Rapports et exports** : Génération de rapports PDF, export des visualisations
- **Audit et traçabilité** : Historique des actions utilisateur, logs accessibles

## 🛠️ Technologies utilisées

- **React** pour le développement du frontend
- **Material UI** pour l'interface utilisateur
- **Recharts** pour les visualisations de données
- **React Router** pour la navigation
- **Axios** pour les requêtes HTTP
- **React Hook Form** pour la gestion des formulaires
- **PapaParse** et **SheetJS** pour le traitement des fichiers CSV et Excel

## 🚀 Installation

### Prérequis

- Node.js (version 16.x ou supérieure)
- npm (version 8.x ou supérieure)

### Étapes d'installation

1. **Cloner le dépôt**

```bash
git clone https://github.com/Merouane-dev/Projet-Groupe.git
cd dashboard-collaboratif
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Créer un fichier .env**

Créez un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :

```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Lancer l'application en mode développement**

```bash
npm start
```

L'application sera accessible à l'adresse http://localhost:3000.

## 📁 Structure du projet

La structure du projet est organisée comme suit:

```
src/
├── assets/              # Images, fonts, etc.
├── components/          # Composants réutilisables
│   ├── auth/            # Composants liés à l'authentification
│   ├── layout/          # Composants de mise en page
│   ├── dashboard/       # Composants du tableau de bord
│   ├── data/            # Composants de gestion des données
│   ├── visualization/   # Composants de visualisation
│   ├── analysis/        # Composants d'analyse
│   ├── reports/         # Composants de rapports
│   └── admin/           # Composants d'administration
├── context/             # Contextes React
├── hooks/               # Hooks personnalisés
├── services/            # Services d'API
├── utils/               # Fonctions utilitaires
├── pages/               # Pages principales
├── routes/              # Configuration des routes
├── App.jsx              # Composant racine
└── index.js             # Point d'entrée
```

## 🔐 Authentification

Pour tester l'application, utilisez les identifiants suivants :

- **Admin**
  - Email: admin@example.com
  - Mot de passe: admin123

- **Utilisateur**
  - Email: user@example.com
  - Mot de passe: user123

## 🔄 Flux de travail typique

1. **Connexion** à l'application
2. **Importer** un jeu de données (CSV ou XLSX)
3. **Visualiser** les données avec différents types de graphiques
4. **Analyser** les données avec des outils statistiques
5. **Générer** des rapports à partir des visualisations et analyses
6. **Partager** ou **exporter** les résultats

## 🎮 Utilisation

### Importation de données

1. Accédez à la page "Données" depuis le menu latéral
2. Cliquez sur "Importer des données"
3. Glissez-déposez un fichier CSV ou XLSX, ou cliquez pour sélectionner un fichier
4. Configurez les options d'importation (délimiteur, première ligne comme en-tête, etc.)
5. Vérifiez l'aperçu des données
6. Cliquez sur "Importer" pour finaliser

### Création de visualisations

1. Accédez à la page "Visualisation" depuis le menu latéral
2. Sélectionnez un jeu de données
3. Choisissez le type de graphique (barres, lignes, camembert, etc.)
4. Configurez les paramètres du graphique (axes, séries, options)
5. Prévisualisez et enregistrez le graphique

### Génération de rapports

1. Accédez à la page "Rapports" depuis le menu latéral
2. Cliquez sur "Nouveau rapport"
3. Sélectionnez un jeu de données et configurez les options du rapport
4. Ajoutez des visualisations et des analyses au rapport
5. Générez le rapport au format PDF

## 🧩 Composants principaux

### MainLayout

Composant de mise en page principal qui inclut la barre latérale, l'en-tête et le pied de page.

### Dashboard

Page d'accueil qui affiche un résumé des données et des visualisations récentes.

### DataImport

Composant pour importer et prévisualiser les fichiers CSV et XLSX.

### BarChart, LineChart, PieChart

Composants pour créer différents types de visualisations.

### DataPreview

Composant pour afficher un aperçu des données sous forme de tableau.

### ReportsPage

Page pour créer, gérer et télécharger des rapports.

### AdminPage

Page d'administration pour gérer les utilisateurs et consulter les logs d'audit.

## 📝 Notes de développement

- Cette application est actuellement en mode frontend uniquement. Un backend est nécessaire pour le fonctionnement complet des fonctionnalités.
- Les données affichées sont simulées pour démonstration.
- Pour connecter à un backend, modifiez les services dans le dossier `src/services/` pour qu'ils pointent vers vos API.

## 🚧 À venir

- Intégration avec un backend (Node.js/Express ou FastAPI)
- Implémentation des fonctionnalités d'analyse avancées
- Système de partage de rapports et de dashboards
- Fonctionnalités de collaboration en temps réel

## 👥 Contributeurs

- [Votre nom] - Développeur frontend
- [Autre contributeur] - Développeur backend
- [Autre contributeur] - Data scientist

## 📄 Licence

Ce projet est sous licence [à définir] - voir le fichier LICENSE pour plus de détails.
