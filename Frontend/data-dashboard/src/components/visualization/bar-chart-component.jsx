// src/components/visualization/BarChart.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';

const BarChart = ({
  data,
  xAxisKey,
  availableKeys,
  initialYAxisKeys = [],
  stacked = false,
  horizontal = false,
  showLabels = false,
  colorScheme = [],
}) => {
  const theme = useTheme();
  const [selectedKeys, setSelectedKeys] = useState(
    initialYAxisKeys.length > 0 ? initialYAxisKeys : availableKeys.slice(0, 1)
  );

  // Couleurs par défaut si aucune n'est fournie
  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
  ];

  // Utiliser les couleurs fournies ou les couleurs par défaut
  const colors = colorScheme.length > 0 ? colorScheme : defaultColors;

  const handleKeyChange = (event) => {
    setSelectedKeys(event.target.value);
  };

  // Formater les données pour le graphique
  const formatData = () => {
    if (!data || data.length === 0) return [];
    return data;
  };

  const chartData = formatData();

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="y-axis-keys-label">Séries à afficher</InputLabel>
            <Select
              labelId="y-axis-keys-label"
              id="y-axis-keys"
              multiple
              value={selectedKeys}
              onChange={handleKeyChange}
              renderValue={(selected) => selected.join(', ')}
              label="Séries à afficher"
            >
              {availableKeys
                .filter((key) => key !== xAxisKey) // Exclure la clé de l'axe X
                .map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ height: 400 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={chartData}
                layout={horizontal ? 'vertical' : 'horizontal'}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {horizontal ? (
                  <>
                    <XAxis type="number" />
                    <YAxis dataKey={xAxisKey} type="category" />
                  </>
                ) : (
                  <>
                    <XAxis dataKey={xAxisKey} />
                    <YAxis />
                  </>
                )}
                <Tooltip />
                <Legend />
                {selectedKeys.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId={stacked ? 'stack' : index}
                    fill={colors[index % colors.length]}
                    name={key}
                  >
                    {showLabels && (
                      <LabelList dataKey={key} position="top" />
                    )}
                  </Bar>
                ))}
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Aucune donnée disponible
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  xAxisKey: PropTypes.string.isRequired,
  availableKeys: PropTypes.array.isRequired,
  initialYAxisKeys: PropTypes.array,
  stacked: PropTypes.bool,
  horizontal: PropTypes.bool,
  showLabels: PropTypes.bool,
  colorScheme: PropTypes.array,
};

export default BarChart;
