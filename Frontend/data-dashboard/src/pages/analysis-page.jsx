// src/pages/AnalysisPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { useData } from '../hooks/useData';
import { dataService } from '../services/dataService';
import LineChart from '../components/visualization/LineChart';

const AnalysisPage = () => {
  const { datasets, loadDataset, currentDataset, isLoading } = useData();
  const [selectedDatasetId, setSelectedDatasetId] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [correlationMatrix, setCorrelationMatrix] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Charger les colonnes disponibles lorsque le dataset change
  useEffect(() => {
    if (currentDataset) {
      if (currentDataset.data && currentDataset.data.length > 0) {
        const columns = Object.keys(currentDataset.data[0]).filter(
          // Filtrer les colonnes numériques (pour simplifier)
          column => typeof currentDataset.data[0][column] === 'number'
        );
        setAvailableColumns(columns);
        setSelectedColumns(columns.slice(0, 3)); // Sélectionner les 3 premières colonnes par défaut
      }
    }
  }, [currentDataset]);

  // Gérer la sélection d'un dataset
  const handleDatasetSelect = async (datasetId) => {
    if (datasetId) {
      try {
        await loadDataset(datasetId);
        setSelectedDatasetId(datasetId);
        // Réinitialiser les statistiques
        setStatistics(null);
        setCorrelationMatrix(null);
      } catch (error) {
        console.error('Erreur lors du chargement du dataset:', error);
      }
    } else {
      setSelectedDatasetId('');
      setStatistics(null);
      setCorrelationMatrix(null);
    }
  };

  // Gérer le changement des colonnes sélectionnées
  const handleColumnChange = (event) => {
    setSelectedColumns(event.target.value);
  };

  // Effectuer l'analyse statistique des données
  const performAnalysis = async () => {
    if (!currentDataset || selectedColumns.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Dans une application réelle, cette fonction appellerait l'API
      // const response = await dataService.getDatasetStats(selectedDatasetId, selectedColumns);
      
      // Simuler une analyse statistique
      const stats = {};
      const matrix = [];
      
      // Calculer les statistiques de base pour chaque colonne
      selectedColumns.forEach(column => {
        const values = currentDataset.data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
        
        if (values.length > 0) {
          // Moyenne
          const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
          
          // Médiane
          const sortedValues = [...values].sort((a, b) => a - b);
          const median = sortedValues.length % 2 === 0
            ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
            : sortedValues[Math.floor(sortedValues.length / 2)];
          
          // Min, max
          const min = Math.min(...values);
          const max = Math.max(...values);
          
          // Écart-type
          const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
          const stdDev = Math.sqrt(variance);
          
          stats[column] = {
            count: values.length,
            mean: mean.toFixed(2),
            median: median.toFixed(2),
            min: min.toFixed(2),
            max: max.toFixed(2),
            stdDev: stdDev.toFixed(2),
          };
        }
      });
      
      // Calculer la matrice de corrélation
      for (let i = 0; i < selectedColumns.length; i++) {
        const col1 = selectedColumns[i];
        const row = [];
        
        for (let j = 0; j < selectedColumns.length; j++) {
          const col2 = selectedColumns[j];
          
          if (i === j) {
            row.push(1); // Corrélation d'une colonne avec elle-même est toujours 1
          } else {
            // Calculer la corrélation entre col1 et col2
            const values1 = currentDataset.data.map(row => parseFloat(row[col1])).filter(val => !isNaN(val));
            const values2 = currentDataset.data.map(row => parseFloat(row[col2])).filter(val => !isNaN(val));
            
            // Limiter aux valeurs qui existent dans les deux colonnes
            const validPairs = currentDataset.data
              .filter(row => !isNaN(parseFloat(row[col1])) && !isNaN(parseFloat(row[col2])))
              .map(row => ({
                x: parseFloat(row[col1]),
                y: parseFloat(row[col2]),
              }));
            
            if (validPairs.length > 0) {
              const meanX = validPairs.reduce((sum, pair) => sum + pair.x, 0) / validPairs.length;
              const meanY = validPairs.reduce((sum, pair) => sum + pair.y, 0) / validPairs.length;
              
              let numerator = 0;
              let denominatorX = 0;
              let denominatorY = 0;
              
              validPairs.forEach(pair => {
                const diffX = pair.x - meanX;
                const diffY = pair.y - meanY;
                
                numerator += diffX * diffY;
                denominatorX += diffX * diffX;
                denominatorY += diffY * diffY;
              });
              
              const correlation = denominatorX === 0 || denominatorY === 0
                ? 0
                : numerator / (Math.sqrt(denominatorX) * Math.sqrt(denominatorY));
              
              row.push(correlation);
            } else {
              row.push(0);
            }
          }
        }
        
        matrix.push(row);
      }
      
      setStatistics(stats);
      setCorrelationMatrix(matrix);
    } catch (error) {
      console.error('Erreur lors de l\'analyse des données:', error);
      setAnalysisError('Une erreur est survenue lors de l\'analyse des données.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Rendre le tableau des statistiques
  const renderStatisticsTable = () => {
    if (!statistics || Object.keys(statistics).length === 0) {
      return <Typography>Aucune statistique disponible.</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Colonne</TableCell>
              <TableCell align="right">Count</TableCell>
              <TableCell align="right">Moyenne</TableCell>
              <TableCell align="right">Médiane</TableCell>
              <TableCell align="right">Min</TableCell>
              <TableCell align="right">Max</TableCell>
              <TableCell align="right">Écart-type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(statistics).map(([column, stats]) => (
              <TableRow key={column}>
                <TableCell component="th" scope="row">
                  {column}
                </TableCell>
                <TableCell align="right">{stats.count}</TableCell>
                <TableCell align="right">{stats.mean}</TableCell>
                <TableCell align="right">{stats.median}</TableCell>
                <TableCell align="right">{stats.min}</TableCell>
                <TableCell align="right">{stats.max}</TableCell>
                <TableCell align="right">{stats.stdDev}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Rendre la matrice de corrélation
  const renderCorrelationMatrix = () => {
    if (!correlationMatrix || correlationMatrix.length === 0) {
      return <Typography>Aucune matrice de corrélation disponible.</Typography>;
    }

    // Fonction pour obtenir une couleur en fonction de la valeur de corrélation
    const getCorrelationColor = (value) => {
      if (value >= 0.8) return '#c8e6c9'; // Très forte corrélation positive (vert)
      if (value >= 0.5) return '#e8f5e9'; // Forte corrélation positive (vert clair)
      if (value <= -0.8) return '#ffcdd2'; // Très forte corrélation négative (rouge)
      if (value <= -0.5) return '#ffebee'; // Forte corrélation négative (rouge clair)
      return '#ffffff'; // Corrélation faible ou modérée (blanc)
    };

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              {selectedColumns.map((column) => (
                <TableCell key={column} align="center">{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {correlationMatrix.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell component="th" scope="row">
                  {selectedColumns[rowIndex]}
                </TableCell>
                {row.map((value, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align="center"
                    sx={{
                      backgroundColor: getCorrelationColor(value),
                      fontWeight: Math.abs(value) >= 0.7 ? 'bold' : 'normal',
                    }}
                  >
                    {value.toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Générer des données de distribution pour le graphique
  const generateDistributionData = () => {
    if (!currentDataset || !selectedColumns || selectedColumns.length === 0) {
      return [];
    }

    // Pour simplifier, on prend la première colonne sélectionnée
    const column = selectedColumns[0];
    const values = currentDataset.data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    
    if (values.length === 0) {
      return [];
    }
    
    // Trier les valeurs
    const sortedValues = [...values].sort((a, b) => a - b);
    
    // Diviser en intervalles (10 buckets)
    const min = sortedValues[0];
    const max = sortedValues[sortedValues.length - 1];
    const range = max - min;
    const bucketSize = range / 10;
    
    const distribution = [];
    for (let i = 0; i < 10; i++) {
      const bucketMin = min + i * bucketSize;
      const bucketMax = bucketMin + bucketSize;
      const count = sortedValues.filter(val => val >= bucketMin && val < bucketMax).length;
      
      distribution.push({
        interval: `${bucketMin.toFixed(1)}-${bucketMax.toFixed(1)}`,
        count: count,
        percentage: (count / values.length * 100).toFixed(1),
      });
    }
    
    return distribution;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analyse de données
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
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
            </Grid>
            
            {selectedDatasetId && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="column-select-label">Colonnes à analyser</InputLabel>
                  <Select
                    labelId="column-select-label"
                    id="column-select"
                    multiple
                    value={selectedColumns}
                    label="Colonnes à analyser"
                    onChange={handleColumnChange}
                    disabled={isLoading || !currentDataset}
                  >
                    {availableColumns.map((column) => (
                      <MenuItem key={column} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={performAnalysis}
                  disabled={isAnalyzing || isLoading || !currentDataset || selectedColumns.length === 0}
                >
                  {isAnalyzing ? 'Analyse en cours...' : 'Analyser les données'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {isAnalyzing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {analysisError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {analysisError}
          </Alert>
        )}

        {statistics && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Statistiques descriptives" 
                  action={
                    <Tooltip title="Télécharger les statistiques">
                      <IconButton>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <Divider />
                <CardContent>
                  {renderStatisticsTable()}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader 
                  title="Matrice de corrélation" 
                  subheader="Corrélation entre les variables numériques"
                  action={
                    <Tooltip title="La corrélation mesure la relation linéaire entre deux variables. Une valeur proche de 1 indique une forte corrélation positive, proche de -1 une forte corrélation négative, et proche de 0 une faible corrélation.">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <Divider />
                <CardContent>
                  {renderCorrelationMatrix()}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader 
                  title="Distribution des données" 
                  subheader={selectedColumns.length > 0 ? `Distribution de ${selectedColumns[0]}` : ''}
                />
                <Divider />
                <CardContent sx={{ height: 300 }}>
                  <LineChart
                    data={generateDistributionData()}
                    xAxisKey="interval"
                    availableKeys={['count', 'percentage']}
                    initialYAxisKeys={['count']}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default AnalysisPage;
