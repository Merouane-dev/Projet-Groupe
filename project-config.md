# Configuration du Projet Dashboard Collaboratif

Ce document détaille la configuration complète du projet Dashboard Collaboratif et fournit des informations importantes pour adapter le projet à vos besoins.

## Structure des fichiers de configuration

Le projet utilise plusieurs fichiers de configuration importants :

- `package.json` : Configuration des dépendances et scripts npm
- `.env` : Variables d'environnement
- `jsconfig.json` : Configuration JavaScript pour l'éditeur
- `.gitignore` : Fichiers à ignorer par Git

## Configuration des dépendances (package.json)

Voici le contenu recommandé pour votre fichier `package.json` :

```json
{
  "name": "dashboard-collaboratif",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.18",
    "@mui/material": "^5.14.18",
    "@mui/x-data-grid": "^6.18.1",
    "@react-pdf/renderer": "^3.1.14",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "jwt-decode": "^4.0.0",
    "notistack": "^3.0.1",
    "papaparse": "^5.4.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "react-router-dom": "^6.19.0",
    "recharts": "^2.9.3",
    "xlsx": "^0.18.5",
    "zustand": "^4.4.6"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## Variables d'environnement (.env)

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```
# URL de l'API backend
REACT_APP_API_URL=http://localhost:5000/api

# Configuration de l'environnement
REACT_APP_ENV=development

# Durée de validité du token JWT (en jours)
REACT_APP_TOKEN_EXPIRY=1

# Chemin de base de l'application (utile pour le déploiement dans un sous-dossier)
REACT_APP_BASE_PATH=/
```

**Remarque** : Ne jamais inclure de secrets ou clés d'API sensibles dans le fichier `.env` qui est versionné. Pour les secrets, utilisez un fichier `.env.local` qui est ignoré par Git.

## Configuration JavaScript (jsconfig.json)

Pour faciliter les imports et améliorer l'expérience de développement, créez un fichier `jsconfig.json` à la racine :

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@pages/*": ["pages/*"],
      "@hooks/*": ["hooks/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@context/*": ["context/*"],
      "@assets/*": ["assets/*"]
    },
    "jsx": "react",
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "node",
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "build"]
}
```

Cette configuration vous permet d'utiliser des imports absolus comme :
```javascript
import Button from '@components/Button';
```
au lieu de :
```javascript
import Button from '../../components/Button';
```

## Configuration de Git (.gitignore)

Utilisez le fichier `.gitignore` suivant pour éviter de versionner les fichiers inutiles :

```
# Dépendances
/node_modules
/.pnp
.pnp.js

# Tests
/coverage

# Production
/build

# Environnement
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Éditeur
.idea/
.vscode/
*.swp
*.swo

# Système
.DS_Store
Thumbs.db
```

## Configuration du routeur (src/routes/AppRoutes.jsx)

Pour modifier les routes de l'application, éditez le fichier `src/routes/AppRoutes.jsx`. Vous pouvez ajouter, supprimer ou modifier les routes selon vos besoins.

## Configuration du thème (src/App.jsx)

Pour personnaliser l'apparence de l'application, modifiez la configuration du thème dans `src/App.jsx` :

```javascript
// Création du thème
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Couleur principale
    },
    secondary: {
      main: '#dc004e', // Couleur secondaire
    },
    background: {
      default: '#f5f5f5', // Couleur de fond
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  // Autres personnalisations...
});
```

## Configuration des services API (src/services/api.js)

Pour connecter l'application à votre backend, modifiez le fichier `src/services/api.js` :

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuration des intercepteurs...

export default api;
```

## Personnalisation et extension

### Ajouter de nouveaux types de graphiques

Pour ajouter un nouveau type de graphique :

1. Créez un nouveau composant dans `src/components/visualization/`
2. Intégrez-le dans le composant `VisualizationPage.jsx`
3. Ajoutez une nouvelle option dans la sélection du type de graphique

### Ajouter de nouvelles fonctionnalités d'analyse

Pour ajouter de nouvelles fonctionnalités d'analyse :

1. Créez un nouveau composant dans `src/components/analysis/`
2. Intégrez-le dans le composant `AnalysisPage.jsx`
3. Ajoutez les services correspondants dans `src/services/`

### Personnaliser le tableau de bord

Pour personnaliser le tableau de bord principal :

1. Modifiez le composant `src/components/dashboard/Dashboard.jsx`
2. Ajoutez ou modifiez les widgets dans `src/components/dashboard/DashboardWidgets.jsx`

## Déploiement

### Construire pour la production

```bash
npm run build
```

Cette commande génère une version optimisée de l'application dans le dossier `build`.

### Configuration pour un sous-dossier

Si vous souhaitez déployer l'application dans un sous-dossier, modifiez le fichier `package.json` :

```json
{
  "homepage": "/dashboard-collaboratif"
}
```

Et mettez à jour la variable d'environnement :

```
REACT_APP_BASE_PATH=/dashboard-collaboratif
```

### Déploiement sur un serveur

Copiez le contenu du dossier `build` sur votre serveur web. Pour un serveur Apache, ajoutez un fichier `.htaccess` dans le dossier build :

```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

Pour Nginx, utilisez la configuration suivante :

```
location /dashboard-collaboratif {
  try_files $uri $uri/ /dashboard-collaboratif/index.html;
}
```

## Intégration continue

Pour mettre en place une intégration continue, vous pouvez utiliser GitHub Actions. Créez un fichier `.github/workflows/ci.yml` :

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Build
      run: npm run build
```

Ce fichier configure GitHub Actions pour exécuter les tests et construire l'application à chaque push sur la branche principale ou à chaque pull request.
