// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Tooltip,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { auditService } from '../services/auditService';

// Composant TabPanel pour gérer les onglets
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

const AdminPage = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    role: 'user',
    active: true,
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDatasets: 0,
    totalCharts: 0,
    totalReports: 0,
    totalAuditLogs: 0,
  });

  // Charger les données au montage
  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
    fetchStats();
  }, []);

  // Simuler le chargement des utilisateurs (à remplacer par un appel API)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Dans une application réelle, cette fonction appellerait l'API
      // const response = await authService.getUsers();
      
      // Simuler des données d'utilisateurs
      const mockUsers = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          active: true,
          createdAt: new Date(2024, 0, 1).toISOString(),
          lastLogin: new Date(2024, 4, 1).toISOString(),
        },
        {
          id: '2',
          username: 'jean.dupont',
          email: 'jean.dupont@example.com',
          role: 'user',
          active: true,
          createdAt: new Date(2024, 1, 15).toISOString(),
          lastLogin: new Date(2024, 3, 25).toISOString(),
        },
        {
          id: '3',
          username: 'marie.martin',
          email: 'marie.martin@example.com',
          role: 'user',
          active: true,
          createdAt: new Date(2024, 2, 10).toISOString(),
          lastLogin: new Date(2024, 3, 28).toISOString(),
        },
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError('Une erreur est survenue lors du chargement des logs d\'audit.');
    } finally {
      setLoading(false);
    }
  };

  // Simuler le chargement des statistiques (à remplacer par un appel API)
  const fetchStats = async () => {
    setLoading(true);
    try {
      // Dans une application réelle, cette fonction appellerait l'API
      
      // Simuler des statistiques
      const mockStats = {
        totalUsers: 18,
        activeUsers: 15,
        totalDatasets: 26,
        totalCharts: 57,
        totalReports: 12,
        totalAuditLogs: 1435,
      };
      
      setStats(mockStats);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Une erreur est survenue lors du chargement des statistiques.');
    } finally {
      setLoading(false);
    }
  };

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gérer le changement de page pour la pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Gérer le changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Ouvrir le dialogue pour créer/éditer un utilisateur
  const handleOpenUserDialog = (user = null) => {
    if (user) {
      // Mode édition
      setCurrentUser(user);
      setUserForm({
        username: user.username,
        email: user.email,
        role: user.role,
        active: user.active,
        password: '', // Ne pas remplir le mot de passe pour des raisons de sécurité
      });
    } else {
      // Mode création
      setCurrentUser(null);
      setUserForm({
        username: '',
        email: '',
        role: 'user',
        active: true,
        password: '',
      });
    }
    setOpenUserDialog(true);
  };

  // Fermer le dialogue
  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setCurrentUser(null);
  };

  // Gérer les changements dans le formulaire utilisateur
  const handleUserFormChange = (event) => {
    const { name, value, checked, type } = event.target;
    setUserForm({
      ...userForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Soumettre le formulaire utilisateur
  const handleSubmitUserForm = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (currentUser) {
        // Mode édition
        // const response = await authService.updateUser(currentUser.id, userForm);
        console.log('Mise à jour de l\'utilisateur', currentUser.id, userForm);
        
        // Mettre à jour la liste des utilisateurs
        setUsers(users.map(user => 
          user.id === currentUser.id 
            ? { ...user, ...userForm } 
            : user
        ));
        
        setSuccess('L\'utilisateur a été mis à jour avec succès.');
      } else {
        // Mode création
        // const response = await authService.createUser(userForm);
        console.log('Création de l\'utilisateur', userForm);
        
        // Ajouter le nouvel utilisateur à la liste
        const newUser = {
          id: (users.length + 1).toString(),
          ...userForm,
          createdAt: new Date().toISOString(),
          lastLogin: null,
        };
        
        setUsers([...users, newUser]);
        setSuccess('L\'utilisateur a été créé avec succès.');
      }
      
      handleCloseUserDialog();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', err);
      setError('Une erreur est survenue lors de la sauvegarde de l\'utilisateur.');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setLoading(true);
      try {
        // Dans une application réelle, cette fonction appellerait l'API
        // await authService.deleteUser(userId);
        
        // Supprimer l'utilisateur de la liste
        setUsers(users.filter(user => user.id !== userId));
        setSuccess('L\'utilisateur a été supprimé avec succès.');
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', err);
        setError('Une erreur est survenue lors de la suppression de l\'utilisateur.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Date inconnue';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Administration
        </Typography>

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

        {/* Statistiques */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  UTILISATEURS
                </Typography>
                <Typography variant="h4">{stats.totalUsers}</Typography>
                <Typography variant="caption" display="block">
                  {stats.activeUsers} actifs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  DATASETS
                </Typography>
                <Typography variant="h4">{stats.totalDatasets}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  GRAPHIQUES
                </Typography>
                <Typography variant="h4">{stats.totalCharts}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  RAPPORTS
                </Typography>
                <Typography variant="h4">{stats.totalReports}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  LOGS D'AUDIT
                </Typography>
                <Typography variant="h4">{stats.totalAuditLogs}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="tabs d'administration"
          >
            <Tab 
              icon={<PersonAddIcon />} 
              iconPosition="start" 
              label="Utilisateurs" 
              id="admin-tab-0" 
              aria-controls="admin-tabpanel-0" 
            />
            <Tab 
              icon={<HistoryIcon />} 
              iconPosition="start" 
              label="Logs d'audit" 
              id="admin-tab-1" 
              aria-controls="admin-tabpanel-1" 
            />
          </Tabs>

          {/* Onglet des utilisateurs */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenUserDialog()}
              >
                Nouvel utilisateur
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom d'utilisateur</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rôle</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Créé le</TableCell>
                    <TableCell>Dernière connexion</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role === 'admin' ? 'Administrateur' : 'Utilisateur'} 
                            color={user.role === 'admin' ? 'primary' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.active ? 'Actif' : 'Inactif'} 
                            color={user.active ? 'success' : 'error'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenUserDialog(user)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          {user.id !== '1' && ( // Empêcher la suppression de l'admin principal
                            <Tooltip title="Supprimer">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </TabPanel>

          {/* Onglet des logs d'audit */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Horodatage</TableCell>
                    <TableCell>Utilisateur</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Ressource</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>IP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{formatDate(log.timestamp)}</TableCell>
                        <TableCell>{log.username}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.resource || '-'}</TableCell>
                        <TableCell>
                          {log.resourceType ? (
                            <Chip 
                              label={log.resourceType} 
                              size="small" 
                              variant="outlined"
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{log.ip}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={auditLogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </TabPanel>
        </Paper>
      </Box>

      {/* Dialogue pour créer/éditer un utilisateur */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom d'utilisateur"
                name="username"
                value={userForm.username}
                onChange={handleUserFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">Rôle</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  name="role"
                  value={userForm.role}
                  label="Rôle"
                  onChange={handleUserFormChange}
                >
                  <MenuItem value="user">Utilisateur</MenuItem>
                  <MenuItem value="admin">Administrateur</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userForm.active}
                    onChange={handleUserFormChange}
                    name="active"
                  />
                }
                label="Utilisateur actif"
                sx={{ mt: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={currentUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleUserFormChange}
                required={!currentUser}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmitUserForm} 
            variant="contained" 
            disabled={!userForm.username || !userForm.email || (!currentUser && !userForm.password) || loading}
          >
            {loading ? 'Enregistrement...' : currentUser ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage; survenue lors du chargement des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  // Simuler le chargement des logs d'audit (à remplacer par un appel API)
  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      // Dans une application réelle, cette fonction appellerait l'API
      // const response = await auditService.getAuditLogs({ page, rowsPerPage });
      
      // Simuler des données de logs d'audit
      const mockAuditLogs = Array.from({ length: 50 }, (_, i) => ({
        id: (i + 1).toString(),
        userId: (i % 3 + 1).toString(),
        username: ['admin', 'jean.dupont', 'marie.martin'][i % 3],
        action: [
          'Connexion',
          'Création de jeu de données',
          'Création de graphique',
          'Édition de rapport',
          'Suppression de graphique',
          'Exportation de données',
          'Modification de profil',
        ][i % 7],
        resource: i % 7 === 0 ? null : `resource-${i % 10 + 1}`,
        resourceType: [
          null,
          'dataset',
          'chart',
          'report',
          'user',
          'dataset',
          'chart',
        ][i % 7],
        ip: `192.168.1.${i % 255}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        timestamp: new Date(2024, 4, 1, 10, i % 60).toISOString(),
      }));
      
      setAuditLogs(mockAuditLogs);
    } catch (err) {
      console.error('Erreur lors du chargement des logs d\'audit:', err);
      setError('Une erreur est