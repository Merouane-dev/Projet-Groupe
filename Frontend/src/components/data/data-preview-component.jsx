// src/components/data/DataPreview.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const DataPreview = ({ data, headers }) => {
  if (!data || data.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        Aucune donnée disponible pour l'aperçu.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
        Affichage des {data.length} premières lignes
      </Typography>
      
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                #
              </TableCell>
              {headers.map((header, index) => (
                <TableCell 
                  key={index}
                  sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                <TableCell>{rowIndex + 1}</TableCell>
                {headers.map((header, colIndex) => (
                  <TableCell key={colIndex}>
                    {typeof row === 'object' ? row[header] || '' : row[colIndex] || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

DataPreview.propTypes = {
  data: PropTypes.array,
  headers: PropTypes.array.isRequired,
};

export default DataPreview;
