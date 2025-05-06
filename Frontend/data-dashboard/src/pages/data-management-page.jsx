// src/pages/DataManagementPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StorageIcon from '@mui/icons-material/Storage';
import { useData } from '../hooks/useData';
import DataImport from '../components/data/DataImport';
import DatasetCard from '../components/dashboard/DatasetCard';

// Composant TabPanel pour gérer les onglets
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`data-tabpanel-${index}`}
      aria-labelledby={`data-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const DataManagementPage = () => {
  const { datasets, isLoading } = useData();
  const [tabValue, setTabValue] = useState(0);
  const [filteredDatasets, setFilteredDatasets] = useState([]);

  // Mettre à jour les datasets filtrés lorsque les datasets changent
  useEffect(() => {
    setFilteredDatasets(datasets);
  }, [datasets]);

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Gestion des données
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setTabValue(1)} // Passer à l'onglet d'importation
          >
            Importer des données
          </Button>
        </Box>

        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="Onglets de gestion des données"
          >
            <Tab
              icon={<StorageIcon />}
              iconPosition="start"
              label="Mes jeux de données"
              id="data-tab-0"
              aria-controls="data-tabpanel-0"
            />
            <Tab
              icon={<AddIcon />}
              iconPosition="start"
              label="Importer des données"
              id="data-tab-1"
              aria-controls="data-tabpanel-1"
            />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Typography>Chargement des jeux de données...</Typography>
          ) : filteredDatasets.length > 0 ? (
            <Grid container spacing={3}>
              {filteredDatasets.map((dataset) => (
                <Grid item key={dataset.id} xs={12} sm={6} md={4} lg={3}>
                  <DatasetCard dataset={dataset} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center',
              }}
            >
              <StorageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Aucun jeu de données
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Vous n'avez pas encore importé de jeu de données.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setTabValue(1)}
              >
                Importer des données
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DataImport />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default DataManagementPage;
