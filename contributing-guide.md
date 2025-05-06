# Guide de Contribution - Dashboard Collaboratif

Merci de votre intérêt pour contribuer au projet Dashboard Collaboratif ! Ce document explique comment participer au développement du projet, que ce soit pour corriger des bugs, ajouter des fonctionnalités ou améliorer la documentation.

## Prérequis

Avant de commencer à contribuer, assurez-vous d'avoir :

- Une compréhension de base de React et JavaScript/ES6
- Node.js et npm installés
- Git installé et configuré
- Un éditeur de code (VS Code recommandé)
- Une compréhension des principes de visualisation de données

## Mise en place de l'environnement de développement

1. **Fork du dépôt**

```bash
# Cloner votre fork
git clone https://github.com/Merouane-dev/Projet-Groupe.git
cd Projet-groupe

# Ajouter le dépôt d'origine comme remote
git remote add upstream https://github.com/organisation-principale/dashboard-collaboratif.git
```

2. **Installation des dépendances**

```bash
npm install
```

3. **Lancer l'application en mode développement**

```bash
npm start
```

## Workflow de contribution

1. **Créer une branche pour votre contribution**

```bash
# Assurez-vous d'être sur la branche principale
git checkout main

# Récupérer les dernières modifications
git pull upstream main

# Créer une nouvelle branche
git checkout -b feature/nom-de-votre-fonctionnalite
```

Conventions de nommage des branches :
- `feature/nom-de-la-fonctionnalite` pour les nouvelles fonctionnalités
- `fix/nom-du-bug` pour les corrections de bugs
- `docs/sujet` pour les mises à jour de documentation
- `refactor/description` pour les refactorisations

2. **Développer votre fonctionnalité**

- Assurez-vous de suivre les conventions de code du projet
- Commentez votre code lorsque nécessaire
- Écrivez des tests pour votre code

3. **Committer vos changements**

```bash
git add .
git commit -m "Description détaillée de vos changements"
```

Conventions pour les messages de commit :
- Utilisez le présent ("Add feature" et non "Added feature")
- Première ligne : résumé concis (max 50 caractères)
- Ligne suivante : ligne vide
- Lignes suivantes : description détaillée si nécessaire

4. **Soumettre une Pull Request**

- Poussez votre branche vers votre fork : `git push origin feature/nom-de-votre-fonctionnalite`
- Créez une Pull Request depuis GitHub
- Décrivez clairement vos changements dans la PR
- Référencez tout problème associé en utilisant les mots-clés (closes #123, fixes #456, etc.)

## Structure du Projet

Pour vous aider à naviguer dans le code, voici un rappel de la structure du projet :

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

## Directives de Développement

### Conventions de Code

- Utilisez des noms explicites pour les variables, fonctions et composants
- Préférez les fonctions fléchées pour les composants fonctionnels
- Utilisez la déstructuration pour les props et le state
- Écrivez des commentaires pour expliquer le "pourquoi", pas le "quoi"
- Utilisez PascalCase pour les composants et camelCase pour les variables et fonctions

### Composants

- Un composant par fichier
- Utilisez les composants fonctionnels avec les hooks
- Documentez les props avec PropTypes
- Extrayez la logique complexe dans des hooks personnalisés

### État et Effets

- Gardez l'état aussi local que possible
- Utilisez les contextes pour l'état global partagé
- Divisez les effets complexes en plusieurs effets plus simples
- Nettoyez les effets qui créent des souscriptions

## Ajout de Nouvelles Fonctionnalités

Voici quelques idées de fonctionnalités à développer pour le projet :

### Améliorations de l'Importation des Données

- Support de formats de fichiers supplémentaires (JSON, XML, etc.)
- Prétraitement des données (normalisation, traitement des valeurs manquantes, etc.)
- Import depuis des sources externes (Google Sheets, APIs publiques, etc.)

```jsx
// Exemple d'implémentation pour l'importation depuis Google Sheets
const GoogleSheetsImport = () => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleImport = async () => {
    setIsLoading(true);
    try {
      // Logique d'importation
      const sheetId = extractSheetIdFromUrl(sheetUrl);
      const response = await googleSheetsService.fetchSheet(sheetId);
      // Traitement des données
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Paper>
      <Typography variant="h6">Importer depuis Google Sheets</Typography>
      <TextField
        label="URL de la feuille"
        value={sheetUrl}
        onChange={(e) => setSheetUrl(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button 
        variant="contained" 
        onClick={handleImport} 
        disabled={isLoading || !sheetUrl}
      >
        {isLoading ? 'Importation...' : 'Importer'}
      </Button>
    </Paper>
  );
};
```

### Nouvelles Visualisations

- Diagrammes de dispersion (Scatter plots)
- Cartes géographiques
- Diagrammes de réseau
- Diagrammes en radar

```jsx
// Exemple d'implémentation d'un diagramme de dispersion
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScatterPlot = ({ data, xKey, yKey, pointColor = '#8884d8' }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey={xKey} name={xKey} />
        <YAxis type="number" dataKey={yKey} name={yKey} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name={`${xKey} vs ${yKey}`} data={data} fill={pointColor} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
```

### Fonctionnalités d'Analyse Avancée

- Détection d'anomalies
- Prédiction de tendances
- Analyse de corrélation avancée
- Clustering

### Amélioration des Rapports

- Templates de rapports personnalisables
- Planification de rapports automatiques
- Export dans différents formats (Excel, PowerPoint, etc.)
- Partage par email

### Intégration avec des Services Externes

- Connexion à des bases de données
- Intégration avec des services BI
- Exportation vers des services cloud

## Soumission de Bugs et Demandes de Fonctionnalités

Pour signaler un bug ou demander une nouvelle fonctionnalité :

1. Vérifiez d'abord si le problème ou la demande existe déjà dans les issues
2. Créez une nouvelle issue en utilisant le template approprié
3. Fournissez autant de détails que possible :
   - Pour les bugs : étapes pour reproduire, comportement attendu vs observé, environnement
   - Pour les fonctionnalités : description, cas d'utilisation, bénéfices attendus

## Processus de Revue de Code

Les Pull Requests seront examinées par les mainteneurs du projet. Voici ce que nous recherchons :

- Respect des conventions de code
- Tests appropriés
- Documentation mise à jour
- Pas de régressions
- Code lisible et maintenable

N'hésitez pas à demander de l'aide ou des clarifications pendant le processus de revue.

## Ressources Utiles

- [Documentation de React](https://reactjs.org/docs/getting-started.html)
- [Documentation de Material UI](https://mui.com/getting-started/usage/)
- [Documentation de Recharts](https://recharts.org/en-US/guide)
- [Meilleures pratiques pour les visualisations de données](https://www.tableau.com/learn/articles/data-visualization-tips)

Merci de contribuer à rendre ce projet meilleur !
