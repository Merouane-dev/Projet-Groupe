// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  AlertTitle,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ShareIcon from '@mui/icons-material/Share';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useData } from '../hooks/useData';
import { reportService } from '../services/reportService';

const ReportsPage = () => {
  const { datasets } = useData();
  const [reports, setReports] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    datasetId: '',
    charts: [],
    includeStatistics: true,
    includeRawData: false,
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Charger les rapports au montage
  useEffect(() => {
    fetchReports();
  }, []);

  // Simuler le chargement des rapports (à remplacer par un appel API)
  const fetchReports = async () => {
    setLoading(true);
    try {
      // Dans une application réelle, cette fonction appellerait l'API
      // const response = await reportService.getReports();
      
      // Simuler des données de rapports
      const mockReports = [
        {
          id: '1',
          title: 'Rapport de ventes trimestriel',
          description: 'Analyse des ventes par région du premier trimestre 2024',
          createdAt: new Date(2024, 3, 15).toISOString(),
          updatedAt: new Date(2024, 3, 20).toISOString(),
          createdBy: { id: '1', username: 'admin' },
          datasetId: '1',
          dataset: { name: 'Ventes Q1 2024' },
          charts: ['chart1', 'chart2'],
          downloads: 12,
          isPublic: true,
        },
        {
          id: '2',
          title: 'Analyse de performance produits',
          description: 'Étude comparative des performances des produits',
          createdAt: new Date(2024, 4, 5).toISOString(),
          updatedAt: new Date(2024, 4, 5).toISOString(),
          createdBy: { id: '1', username: 'admin' },
          datasetId: '2',
          dataset: { name: 'Produits 2024' },
          charts: ['chart3'],
          downloads: 5,
          isPublic: false,
        },
      ];
      
      setReports(mockReports);
    } catch (err) {
      console.error('Erreur lors du chargement des rapports:', err);
      setError('Une erreur est survenue lors du chargement des rapports.');
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le dialogue pour créer/éditer un rapport
  const handleOpenDialog = (report = null) => {
    if (report) {
      // Mode édition
      setCurrentReport(report);
      setFormData({
        title: report.title,
        description: report.description,
        datasetId: report.datasetId,
        charts: report.charts || [],
        includeStatistics: true,
        includeRawData: false,
        isPublic: report.isPublic,
      });
    } else {
      // Mode création
      setCurrentReport(null);
      setFormData({
        title: '',
        description: '',
        datasetId: '',
        charts: [],
        includeStatistics: true,
        includeRawData: false,
        isPublic: false,
      });
    }
    setOpenDialog(true);
  };

  // Fermer le dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentReport(null);
  };

  // Gérer les changements dans le formulaire
  const handleFormChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (currentReport) {
        // Mode édition
        // const response = await reportService.updateReport(currentReport.id, formData);
        console.log('Mise à jour du rapport', currentReport.id, formData);
        
        // Mettre à jour la liste des rapports
        setReports(reports.map(report => 
          report.id === currentReport.id 
            ? { 
                ...report, 
                ...formData, 
                updatedAt: new Date().toISOString() 
              } 
            : report
        ));
        
        setSuccess('Le rapport a été mis à jour avec succès.');
      } else {
        // Mode création
        // const response = await reportService.createReport(formData);
        console.log('Création du rapport', formData);
        
        // Ajouter le nouveau rapport à la liste
        const newReport = {
          id: (reports.length + 1).toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: { id: '1', username: 'admin' },
          dataset: datasets.find(ds => ds.id === formData.datasetId) || { name: 'Dataset inconnu' },
          downloads: 0,
        };
        
        setReports([...reports, newReport]);
        setSuccess('Le rapport a été créé avec succès.');
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du rapport:', err);
      setError('Une erreur est survenue lors de la sauvegarde du rapport.');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un rapport
  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      setLoading(true);
      try {
        // Dans une application réelle, cette fonction appellerait l'API
        // await reportService.deleteReport(reportId);
        
        // Supprimer le rapport de la liste
        setReports(reports.filter(report => report.id !== reportId));
        setSuccess('Le rapport a été supprimé avec succès.');
      } catch (err) {
        console.error('Erreur lors de la suppression du rapport:', err);
        setError('Une erreur est survenue lors de la suppression du rapport.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Télécharger un rapport au format PDF
  const handleDownloadReport = async (reportId) => {
    try {
      // Dans une application réelle, cette fonction appellerait l'API
      // const response = await reportService.generatePDF(reportId);
      console.log('Téléchargement du rapport', reportId);
      
      // Simuler un téléchargement
      alert('Téléchargement du rapport au format PDF...');
      
      // Mettre à jour le compteur de téléchargements
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, downloads: report.downloads + 1 } 
          : report
      ));
    } catch (err) {
      console.error('Erreur lors du téléchargement du rapport:', err);
      setError('Une erreur est survenue lors du téléchargement du rapport.');
    }
  };

  // Dupliquer un rapport
  const handleDuplicateReport = (report) => {
    const duplicatedReport = {
      ...report,
      id: (reports.length + 1).toString(),
      title: `Copie de ${report.title}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloads: 0,
    };
    
    setReports([...reports, duplicatedReport]);
    setSuccess('Le rapport a été dupliqué avec succès.');
  };

  // Formatter une date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: fr });
    } catch (error) {
      return 'Date inconnue';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Rapports
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nouveau rapport
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {reports.length > 0 ? (
            reports.map((report) => (
              <Grid item key={report.id} xs={12} md={6} lg={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardHeader
                    title={report.title}
                    subheader={`Créé le ${formatDate(report.createdAt)}`}
                    action={
                      <IconButton aria-label="paramètres">
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {report.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Dataset: {report.dataset?.name || 'Non spécifié'}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Créé par: {report.createdBy?.username || 'Utilisateur inconnu'}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Téléchargements: {report.downloads}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        size="small" 
                        icon={<PictureAsPdfIcon />} 
                        label="PDF" 
                        variant="outlined" 
                      />
                      {report.isPublic ? (
                        <Chip 
                          size="small" 
                          icon={<ShareIcon />} 
                          label="Public" 
                          color="success" 
                          variant="outlined" 
                        />
                      ) : (
                        <Chip 
                          size="small" 
                          label="Privé" 
                          variant="outlined" 
                        />
                      )}
                      <Chip 
                        size="small" 
                        label={`${report.charts?.length || 0} graphiques`} 
                        variant="outlined" 
                      />
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Tooltip title="Voir le rapport">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => alert(`Affichage du rapport "${report.title}"`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Télécharger en PDF">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Dupliquer">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleDuplicateReport(report)}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDialog(report)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 5, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Aucun rapport disponible
                </Typography>
                <Typography variant="body1" paragraph>
                  Créez votre premier rapport pour visualiser et partager vos analyses.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Créer un rapport
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Dialogue de création/édition de rapport */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentReport ? 'Modifier le rapport' : 'Créer un nouveau rapport'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre du rapport"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="dataset-select-label">Jeu de données</InputLabel>
                <Select
                  labelId="dataset-select-label"
                  id="dataset-select"
                  name="datasetId"
                  value={formData.datasetId}
                  label="Jeu de données"
                  onChange={handleFormChange}
                  required
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="public-select-label">Visibilité</InputLabel>
                <Select
                  labelId="public-select-label"
                  id="public-select"
                  name="isPublic"
                  value={formData.isPublic}
                  label="Visibilité"
                  onChange={handleFormChange}
                >
                  <MenuItem value={false}>Privé</MenuItem>
                  <MenuItem value={true}>Public</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Options du rapport
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="statistics-select-label">Inclure les statistiques</InputLabel>
                  <Select
                    labelId="statistics-select-label"
                    id="statistics-select"
                    name="includeStatistics"
                    value={formData.includeStatistics}
                    label="Inclure les statistiques"
                    onChange={handleFormChange}
                  >
                    <MenuItem value={true}>Oui</MenuItem>
                    <MenuItem value={false}>Non</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="raw-data-select-label">Inclure les données brutes</InputLabel>
                  <Select
                    labelId="raw-data-select-label"
                    id="raw-data-select"
                    name="includeRawData"
                    value={formData.includeRawData}
                    label="Inclure les données brutes"
                    onChange={handleFormChange}
                  >
                    <MenuItem value={true}>Oui</MenuItem>
                    <MenuItem value={false}>Non</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          
          {/* Section pour ajouter des graphiques (simplifiée pour cet exemple) */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Graphiques
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Vous pourrez ajouter des graphiques après avoir créé le rapport.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!formData.title || !formData.datasetId || loading}
          >
            {loading ? 'Enregistrement...' : currentReport ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportsPage;
