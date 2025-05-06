// src/pages/VisualizationPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useData } from '../hooks/useData';
import { chartService } from '../services/chartService';
import BarChart from '../components/visualization/BarChart';
import LineChart from '../components/visualization/LineChart';
import PieChart from '../components/visualization/PieChart';
import ChartContainer from '../components/visualization/ChartContainer';

// Étapes du processus de création de graphique
const steps = ['Sélection du jeu de données', 'Configuration du graphique', 'Aperçu et enregistrement'];

const VisualizationPage = () => {
  const location = useLocation();
  const { datasets, loadDataset, currentDataset, isLoading } = useData();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDatasetId, setSelectedDatasetId] = useState('');
  const [chartConfig, setChartConfig] = useState({
    title: '',
    description: '',
    type: 'bar',
    xAxisKey: '',
    yAxisKeys: [],
    dataKeys: [],
    options: {
      stacked: false,
      horizontal: false,
      showLabels: false,
      donut: false,
    },
  });
  const [previewData, setPreviewData] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setError] = useState(null);

  // Vérifier si un dataset est spécifié dans l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const datasetId = params.get('dataset');
    
    if (datasetId) {
      setSelectedDatasetId(datasetId);
      handleDatasetSelect(datasetId);
    }
  }, [location.search]);

  // Chargement de la liste des colonnes lorsque le dataset change
  useEffect(() => {
    if (currentDataset) {
      // Dans une application réelle, ces données viendraient du backend
      if (currentDataset.data && currentDataset.data.length > 0) {
        const columns = Object.keys(currentDataset.data[0]);
        setAvailableColumns(columns);
        
        // Si c'est la première fois qu'on charge ce dataset, définir une colonne X par défaut
        if (!chartConfig.xAxisKey && columns.length > 0) {
          setChartConfig(prevConfig => ({
            ...prevConfig,
            xAxisKey: columns[0],
          }));
        }
        
        setPreviewData(currentDataset.data.slice(0, 100)); // Limiter à 100 lignes pour l'aperçu
      }
    }
  }, [currentDataset]);

  // Gérer la sélection d'un dataset
  const handleDatasetSelect = async (datasetId) => {
    if (datasetId) {
      try {
        await loadDataset(datasetId);
        setSelectedDatasetId(datasetId);
      } catch (error) {
        console.error('Erreur lors du chargement du dataset:', error);
      }
    }
  };

  // Passer à l'étape suivante
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Revenir à l'étape précédente
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Réinitialiser le processus
  const handleReset = () => {
    setActiveStep(0);
    setSelectedDatasetId('');
    setChartConfig({
      title: '',
      description: '',
      type: 'bar',
      xAxisKey: '',
      yAxisKeys: [],
      options: {
        stacked: false,
        horizontal: false,
        showLabels: false,
        donut: false,
      },
    });
  };

  // Gérer les changements de configuration du graphique
  const handleConfigChange = (event) => {
    const { name, value, checked, type } = event.target;
    
    if (name.startsWith('options.')) {
      const optionName = name.split('.')[1];
      
      setChartConfig(prevConfig => ({
        ...prevConfig,
        options: {
          ...prevConfig.options,
          [optionName]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setChartConfig(prevConfig => ({
        ...prevConfig,
        [name]: value,
      }));
    }
  };

  // Sauvegarder le graphique
  const handleSaveChart = async () => {
    try {
      // Simuler un appel API pour sauvegarder le graphique
      const chartData = {
        ...chartConfig,
        datasetId: selectedDatasetId,
      };
      
      console.log('Sauvegarde du graphique:', chartData);
      
      // Dans une application réelle, cette fonction appellerait l'API
      // const response = await chartService.createChart(chartData);
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du graphique:', error);
      setError('Une erreur est survenue lors de la sauvegarde du graphique.');
    }
  };

  // Contenu de l'étape 1: Sélection du jeu de données
  const renderStep1 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sélectionnez un jeu de données
      </Typography>
      
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="dataset-select-label">Jeu de données</InputLabel>
        <Select
          labelId="dataset-select-label"
          id="dataset-select"
          value={selectedDatasetId}
          label="Jeu de données"
          onChange={(e) => handleDatasetSelect(e.target.value)}
        >
          <MenuItem value="">
            <em>Sélectionnez un jeu de données</em>
          </MenuItem>
          {datasets.map((dataset) => (
            <MenuItem key={dataset.id} value={dataset.id}>
              {dataset.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <Typography>Chargement des données...</Typography>
        ) : currentDataset ? (
          <Alert severity="success">
            Jeu de données "{currentDataset.name}" sélectionné avec {currentDataset.rowCount || 'N/A'} enregistrements.
          </Alert>
        ) : (
          <Alert severity="info">
            Veuillez sélectionner un jeu de données pour continuer.
          </Alert>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!selectedDatasetId}
        >
          Suivant
        </Button>
      </Box>
    </Box>
  );

  // Contenu de l'étape 2: Configuration du graphique
  const renderStep2 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configuration du graphique
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Titre du graphique"
            name="title"
            value={chartConfig.title}
            onChange={handleConfigChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={chartConfig.description}
            onChange={handleConfigChange}
            multiline
            rows={2}
            margin="normal"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Type de graphique
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Card 
                onClick={() => setChartConfig({ ...chartConfig, type: 'bar' })}
                sx={{ 
                  maxWidth: 120, 
                  cursor: 'pointer',
                  border: chartConfig.type === 'bar' ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <BarChartIcon fontSize="large" color={chartConfig.type === 'bar' ? 'primary' : 'action'} />
                  <Typography variant="body2">Barres</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card 
                onClick={() => setChartConfig({ ...chartConfig, type: 'line' })}
                sx={{ 
                  maxWidth: 120, 
                  cursor: 'pointer',
                  border: chartConfig.type === 'line' ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <ShowChartIcon fontSize="large" color={chartConfig.type === 'line' ? 'primary' : 'action'} />
                  <Typography variant="body2">Lignes</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card 
                onClick={() => setChartConfig({ ...chartConfig, type: 'pie' })}
                sx={{ 
                  maxWidth: 120, 
                  cursor: 'pointer',
                  border: chartConfig.type === 'pie' ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <PieChartIcon fontSize="large" color={chartConfig.type === 'pie' ? 'primary' : 'action'} />
                  <Typography variant="body2">Camembert</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>
        
        {chartConfig.type !== 'pie' && (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="x-axis-label">Axe X</InputLabel>
                <Select
                  labelId="x-axis-label"
                  id="x-axis-select"
                  name="xAxisKey"
                  value={chartConfig.xAxisKey}
                  label="Axe X"
                  onChange={handleConfigChange}
                >
                  {availableColumns.map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="y-axis-label">Séries (Axe Y)</InputLabel>
                <Select
                  labelId="y-axis-label"
                  id="y-axis-select"
                  name="yAxisKeys"
                  multiple
                  value={chartConfig.yAxisKeys}
                  label="Séries (Axe Y)"
                  onChange={handleConfigChange}
                >
                  {availableColumns
                    .filter(column => column !== chartConfig.xAxisKey)
                    .map((column) => (
                      <MenuItem key={column} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
        
        {chartConfig.type === 'pie' && (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="name-key-label">Étiquettes</InputLabel>
                <Select
                  labelId="name-key-label"
                  id="name-key-select"
                  name="xAxisKey" // On réutilise xAxisKey pour le nameKey
                  value={chartConfig.xAxisKey}
                  label="Étiquettes"
                  onChange={handleConfigChange}
                >
                  {availableColumns.map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="value-key-label">Valeurs</InputLabel>
                <Select
                  labelId="value-key-label"
                  id="value-key-select"
                  name="yAxisKeys" // On réutilise yAxisKeys pour le valueKey
                  value={chartConfig.yAxisKeys.length > 0 ? chartConfig.yAxisKeys[0] : ''}
                  label="Valeurs"
                  onChange={(e) => setChartConfig({
                    ...chartConfig,
                    yAxisKeys: [e.target.value],
                  })}
                >
                  {availableColumns
                    .filter(column => column !== chartConfig.xAxisKey)
                    .map((column) => (
                      <MenuItem key={column} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Options
          </Typography>
          
          {chartConfig.type === 'bar' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.options.stacked}
                    onChange={handleConfigChange}
                    name="options.stacked"
                  />
                }
                label="Barres empilées"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.options.horizontal}
                    onChange={handleConfigChange}
                    name="options.horizontal"
                  />
                }
                label="Barres horizontales"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.options.showLabels}
                    onChange={handleConfigChange}
                    name="options.showLabels"
                  />
                }
                label="Afficher les étiquettes"
              />
            </Box>
          )}
          
          {chartConfig.type === 'line' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.options.showLabels}
                    onChange={handleConfigChange}
                    name="options.showLabels"
                  />
                }
                label="Afficher les points"
              />
            </Box>
          )}
          
          {chartConfig.type === 'pie' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.options.donut}
                    onChange={handleConfigChange}
                    name="options.donut"
                  />
                }
                label="Graphique en anneau"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.options.showLabels}
                    onChange={handleConfigChange}
                    name="options.showLabels"
                  />
                }
                label="Afficher les pourcentages"
              />
            </Box>
          )}
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack}>Retour</Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!chartConfig.title || !chartConfig.xAxisKey || (chartConfig.type !== 'pie' && chartConfig.yAxisKeys.length === 0)}
        >
          Aperçu
        </Button>
      </Box>
    </Box>
  );

  // Contenu de l'étape 3: Aperçu et enregistrement
  const renderStep3 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Aperçu du graphique
      </Typography>
      
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Le graphique a été enregistré avec succès !
        </Alert>
      )}
      
      {saveError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {saveError}
        </Alert>
      )}
      
      <Box sx={{ height: 500, mb: 3 }}>
        <ChartContainer
          title={chartConfig.title || 'Titre du graphique'}
          description={chartConfig.description || 'Description du graphique'}
        >
          {chartConfig.type === 'bar' && (
            <BarChart
              data={previewData}
              xAxisKey={chartConfig.xAxisKey}
              availableKeys={availableColumns}
              initialYAxisKeys={chartConfig.yAxisKeys}
              stacked={chartConfig.options.stacked}
              horizontal={chartConfig.options.horizontal}
              showLabels={chartConfig.options.showLabels}
            />
          )}
          
          {chartConfig.type === 'line' && (
            <LineChart
              data={previewData}
              xAxisKey={chartConfig.xAxisKey}
              availableKeys={availableColumns}
              initialYAxisKeys={chartConfig.yAxisKeys}
            />
          )}
          
          {chartConfig.type === 'pie' && (
            <PieChart
              data={previewData}
              nameKey={chartConfig.xAxisKey}
              valueKey={chartConfig.yAxisKeys[0]}
              donut={chartConfig.options.donut}
            />
          )}
        </ChartContainer>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack}>Retour</Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveChart}
        >
          Enregistrer
        </Button>
      </Box>
    </Box>
  );

  // Rendu de l'étape active
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Container maxWidth="xl">
              <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Visualisation
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            href="/dashboard"
          >
            Retour au tableau de bord
          </Button>
        </Box>

        <Paper sx={{ width: '100%', p: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 4 }}>
            {getStepContent(activeStep)}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VisualizationPage;