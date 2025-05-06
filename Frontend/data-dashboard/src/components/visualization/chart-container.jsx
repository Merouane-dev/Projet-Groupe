// src/components/visualization/ChartContainer.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const ChartContainer = ({
  title,
  description,
  children,
  onEdit,
  onDelete,
  onRefresh,
  onDownload,
  loading,
  error,
  lastUpdated,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleAction = (actionFn) => {
    handleMenuClose();
    if (actionFn) {
      actionFn();
    }
  };
  
  useEffect(() => {
    if (lastUpdated) {
      const date = new Date(lastUpdated);
      setFormattedDate(
        date.toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }
  }, [lastUpdated]);
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={title}
        subheader={description}
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'body2' }}
        action={
          <IconButton
            aria-label="options"
            aria-controls="chart-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
        }
      />
      <Menu
        id="chart-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {onRefresh && (
          <MenuItem onClick={() => handleAction(onRefresh)}>
            <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
            Actualiser
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={() => handleAction(onEdit)}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Modifier
          </MenuItem>
        )}
        {onDownload && (
          <MenuItem onClick={() => handleAction(onDownload)}>
            <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
            Télécharger
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={() => handleAction(onDelete)}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Supprimer
          </MenuItem>
        )}
      </Menu>
      <Divider />
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          position: 'relative',
        }}
      >
        {loading ? (
          <Typography variant="body2" color="textSecondary">
            Chargement...
          </Typography>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : (
          children
        )}
      </CardContent>
      {formattedDate && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Dernière mise à jour : {formattedDate}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

ChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  lastUpdated: PropTypes.string,
};

export default ChartContainer;
