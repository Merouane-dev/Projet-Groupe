# Guide d'installation - Dashboard Collaboratif

Ce document fournit des instructions détaillées pour installer et configurer le frontend du Dashboard Collaboratif pour le Master 2 Data & Développement.

## Installation rapide

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/dashboard-collaboratif.git

# Accéder au répertoire du projet
cd dashboard-collaboratif

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

## Installation détaillée

### 1. Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16.x ou supérieure)
  - Téléchargement : [https://nodejs.org/](https://nodejs.org/)
  - Vérification : `node --version`

- **npm** (version 8.x ou supérieure, inclus avec Node.js)
  - Vérification : `npm --version`

- **Git** pour cloner le dépôt
  - Téléchargement : [https://git-scm.com/](https://git-scm.com/)
  - Vérification : `git --version`

### 2. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/dashboard-collaboratif.git
cd dashboard-collaboratif
```

### 3. Installer les dépendances

```bash
npm install
```

Cette commande installera toutes les dépendances nécessaires définies dans le fichier `package.json`, notamment :

- React et React DOM
- React Router pour la navigation
- Material UI pour les composants d'interface
- Recharts pour les visualisations
- Axios pour les requêtes HTTP
- React Hook Form pour la gestion des formulaires
- PapaParse et SheetJS pour le traitement des fichiers

### 4. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
REACT_APP_API_URL=http://localhost:5000/api
```

Remarque : Pour le moment, le frontend utilise des données simulées. Lorsque vous développerez le backend, vous devrez mettre à jour cette URL.

### 5. Lancer l'application en mode développement

```bash
npm start
```

Cette commande lance l'application en mode développement. Ouvrez [http://localhost:3000](http://localhost:3000) pour la visualiser dans votre navigateur.

La page se rechargera automatiquement lorsque vous effectuez des modifications au code. Les erreurs de lint s'afficheront dans la console.

### 6. Créer une version de production

```bash
npm run build
```

Cette commande compile l'application pour la production dans le dossier `build`. Elle optimise la build pour les meilleures performances : les fichiers sont minifiés et les noms de fichiers incluent des hachages.

### 7. Tester l'application

Pour exécuter les tests, utilisez la commande :

```bash
npm test
```

## Résolution des problèmes courants

### Erreurs d'installation des dépendances

Si vous rencontrez des erreurs lors de l'installation des dépendances, essayez les solutions suivantes :

```bash
# Effacer le cache npm
npm cache clean --force

# Essayer à nouveau l'installation
npm install
```

### Problèmes de compatibilité de version Node.js

Si vous rencontrez des problèmes liés à la version de Node.js, envisagez d'utiliser nvm (Node Version Manager) pour installer et utiliser la version correcte :

```bash
# Installation de nvm (suivez les instructions sur https://github.com/nvm-sh/nvm)

# Installation de la version de Node.js recommandée
nvm install 16

# Utilisation de cette version
nvm use 16
```

### Port 3000 déjà utilisé

Si le port 3000 est déjà utilisé par une autre application, vous pouvez spécifier un port différent :

```bash
# Sur Windows
set PORT=3001 && npm start

# Sur macOS/Linux
PORT=3001 npm start
```

## Intégration avec un backend (à venir)

Cette application frontend est conçue pour fonctionner avec un backend RESTful. Pour l'intégrer avec votre backend :

1. Modifiez la variable `REACT_APP_API_URL` dans le fichier `.env` pour pointer vers votre API.
2. Mettez à jour les services dans le dossier `src/services/` pour correspondre aux endpoints de votre API.

## Pour aller plus loin

Pour plus d'informations sur :

- La configuration de React : [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- L'utilisation de Material UI : [Material UI documentation](https://mui.com/getting-started/usage/)
- La création de graphiques avec Recharts : [Recharts documentation](https://recharts.org/en-US/guide)
