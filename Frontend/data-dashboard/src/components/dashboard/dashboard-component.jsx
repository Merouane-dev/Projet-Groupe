// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useData } from '../../hooks/useData';
import ChartContainer from '../visualization/ChartContainer';
import BarChart from '../visualization/BarChart';
import LineChart from '../visualization/LineChart';
import PieChart from '../visualization/PieChart';
import DatasetCard from './DatasetCard';
import DashboardWidgets from './DashboardWidgets';

const Dashboard = () => {
  const theme = useTheme();
  const { datasets, loadDataset, currentDataset, isLoading } = useData();
  const [recentDatasets, setRecentDatasets] = useState([]);
  const [recentCharts, setRecentCharts] = useState([]);
  const [stats, setStats] = useState({
    totalDatasets: 0,
    totalCharts: 0,
    totalReports: 0,
    totalUsers: 0,
  });

  // Simuler des données pour l'aperçu
  const sampleData = [
    { month: 'Jan', sales: 4000, profit: 2400, users: 240 },
    { month: 'Fév', sales: 3000, profit: 1398, users: 210 },
    { month: 'Mar', sales: 2000, profit: 9800, users: 290 },
    { month: 'Avr', sales: 2780, profit: 3908, users: 320 },
    { month: 'Mai', sales: 1890, profit: 4800, users: 340 },
    { month: 'Juin', sales: 2390, profit: 3800, users: 380 },
  ];

  const pieData = [
    { name: 'Groupe A', value: 400 },
    { name: 'Groupe B', value: 300 },
    { name: 'Groupe C', value: 300 },
    { name: 'Groupe D', value: 200 },
  ];

  // Charger les données au montage
  useEffect(() => {
    // Dans une application réelle, ces données viendraient du backend
    setRecentDatasets(datasets.slice(0, 3));
    setStats({
      totalDatasets: datasets.length,
      totalCharts: 8, // Exemple de données
      totalReports: 5, // Exemple de données
      totalUsers: 12, // Exemple de données
    });

    // Simuler des données pour les graphiques récents
    setRecentCharts([
      {
        id: 1,
        title: 'Ventes par mois',
        description: 'Évolution des ventes sur les 6 derniers mois',
        type: 'line',
        data: sampleData,
        xAxisKey: 'month',
        yAxisKeys: ['sales', 'profit'],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Répartition des revenus',
        description: 'Répartition des revenus par catégorie',
        type: 'pie',
        data: pieData,
        nameKey: 'name',
        valueKey: 'value',
        lastUpdated: new Date().toISOString(),
      },
    ]);
  }, [datasets]);

  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    // Dans une application réelle, cette fonction appellerait l'API
    console.log('Rafraîchissement des données du tableau de bord');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Tableau de bord
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Actualiser
          </Button>
        </Box>

        {/* Widgets du tableau de bord */}
        <DashboardWidgets stats={stats} />

        {/* Section des graphiques récents */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Graphiques récents</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              href="/visualization"
            >
              Nouveau graphique
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {recentCharts.map((chart) => (
              <Grid item key={chart.id} xs={12} md={6}>
                <ChartContainer
                  title={chart.title}
                  description={chart.description}
                  onEdit={() => console.log(`Éditer le graphique ${chart.id}`)}
                  onDelete={() => console.log(`Supprimer le graphique ${chart.id}`)}
                  onRefresh={() => console.log(`Rafraîchir le graphique ${chart.id}`)}
                  onDownload={() => console.log(`Télécharger le graphique ${chart.id}`)}
                  lastUpdated={chart.lastUpdated}
                >
                  {chart.type === 'line' && (
                    <LineChart
                      data={chart.data}
                      xAxisKey={chart.xAxisKey}
                      availableKeys={Object.keys(chart.data[0] || {}).filter(key => key !== chart.xAxisKey)}
                      initialYAxisKeys={chart.yAxisKeys}
                    />
                  )}
                  {chart.type === 'bar' && (
                    <BarChart
                      data={chart.data}
                      xAxisKey={chart.xAxisKey}
                      availableKeys={Object.keys(chart.data[0] || {}).filter(key => key !== chart.xAxisKey)}
                      initialYAxisKeys={chart.yAxisKeys}
                    />
                  )}
                  {chart.type === 'pie' && (
                    <PieChart
                      data={chart.data}
                      nameKey={chart.nameKey}
                      valueKey={chart.valueKey}
                    />
                  )}
                </ChartContainer>
              </Grid>
            ))}
            
            {recentCharts.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    Aucun graphique disponible. Créez votre premier graphique !
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    href="/visualization"
                    sx={{ mt: 2 }}
                  >
                    Créer un graphique
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Section des jeux de données récents */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Jeux de données récents</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              href="/data"
            >
              Importer des données
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {recentDatasets.map((dataset) => (
              <Grid item key={dataset.id} xs={12} sm={6} md={4}>
                <DatasetCard dataset={dataset} />
              </Grid>
            ))}
            
            {recentDatasets.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    Aucun jeu de données disponible. Importez votre premier jeu de données !
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    href="/data"
                    sx={{ mt: 2 }}
                  >
                    Importer des données
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
