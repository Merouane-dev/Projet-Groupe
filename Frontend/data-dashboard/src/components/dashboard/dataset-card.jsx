// src/components/dashboard/DatasetCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BarChartIcon from '@mui/icons-material/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import StorageIcon from '@mui/icons-material/Storage';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../hooks/useData';

const DatasetCard = ({ dataset }) => {
  const navigate = useNavigate();
  const { deleteDataset } = useData();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDelete = async () => {
    handleMenuClose();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le jeu de données "${dataset.name}" ?`)) {
      try {
        await deleteDataset(dataset.id);
      } catch (error) {
        console.error('Erreur lors de la suppression du jeu de données:', error);
      }
    }
  };
  
  const handleEdit = () => {
    handleMenuClose();
    navigate(`/data/${dataset.id}/edit`);
  };
  
  const handleVisualize = () => {
    handleMenuClose();
    navigate(`/visualization?dataset=${dataset.id}`);
  };
  
  const handleDownload = () => {
    handleMenuClose();
    // Implémenter la logique de téléchargement ici
    console.log(`Télécharger le jeu de données ${dataset.id}`);
  };
  
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'csv':
        return '📊';
      case 'xlsx':
      case 'xls':
        return '📈';
      default:
        return '📄';
    }
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date inconnue';
    }
  };
  
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 4,
      },
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                fontSize: '2rem', 
                mr: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getFileTypeIcon(dataset.fileType)}
            </Box>
            <Typography variant="h6" component="div" noWrap>
              {dataset.name}
            </Typography>
          </Box>
          <IconButton 
            aria-label="options" 
            onClick={handleMenuOpen}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleVisualize}>
            <ListItemIcon>
              <BarChartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Visualiser</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Modifier</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDownload}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Télécharger</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary="Supprimer" primaryTypographyProps={{ color: 'error' }} />
          </MenuItem>
        </Menu>
        
        {dataset.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {dataset.description}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            icon={<StorageIcon />} 
            label={`${dataset.rowCount || 0} enregistrements`} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            label={dataset.fileType.toUpperCase()} 
            size="small" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          Importé le {formatDate(dataset.createdAt)}
          {dataset.createdBy && ` par ${dataset.createdBy.username}`}
        </Typography>
        
        {dataset.updatedAt && dataset.updatedAt !== dataset.createdAt && (
          <Typography variant="caption" color="text.secondary" display="block">
            Mis à jour le {formatDate(dataset.updatedAt)}
            {dataset.updatedBy && ` par ${dataset.updatedBy.username}`}
          </Typography>
        )}
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          onClick={() => navigate(`/data/${dataset.id}`)}
        >
          Détails
        </Button>
        <Button 
          size="small" 
          onClick={handleVisualize}
          startIcon={<BarChartIcon />}
        >
          Visualiser
        </Button>
      </CardActions>
    </Card>
  );
};

DatasetCard.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    fileType: PropTypes.string.isRequired,
    rowCount: PropTypes.number,
    createdAt: PropTypes.string,
    createdBy: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
    }),
    updatedAt: PropTypes.string,
    updatedBy: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
    }),
  }).isRequired,
};

export default DatasetCard;
