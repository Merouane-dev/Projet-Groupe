// src/components/visualization/LineChart.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  useTheme,
} from '@mui/material';

const LineChart = ({
  data,
  xAxisKey,
  availableKeys,
  initialYAxisKeys = [],
  colorScheme = [],
}) => {
  const theme = useTheme();
  const [selectedKeys, setSelectedKeys] = useState(
    initialYAxisKeys.length > 0 ? initialYAxisKeys : availableKeys.slice(0, 1)
  );
  const [showPoints, setShowPoints] = useState(true);
  const [showArea, setShowArea] = useState(false);
  const [smoothCurve, setSmoothCurve] = useState(false);

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

  const handleShowPointsChange = (event) => {
    setShowPoints(event.target.checked);
  };

  const handleShowAreaChange = (event) => {
    setShowArea(event.target.checked);
  };

  const handleSmoothCurveChange = (event) => {
    setSmoothCurve(event.target.checked);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPoints}
                  onChange={handleShowPointsChange}
                  name="showPoints"
                  size="small"
                />
              }
              label="Afficher les points"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showArea}
                  onChange={handleShowAreaChange}
                  name="showArea"
                  size="small"
                />
              }
              label="Remplir l'aire"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={smoothCurve}
                  onChange={handleSmoothCurveChange}
                  name="smoothCurve"
                  size="small"
                />
              }
              label="Courbe lissée"
            />
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ height: 400 }}>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedKeys.map((key, index) => (
                  <Line
                    key={key}
                    type={smoothCurve ? 'monotone' : 'linear'}
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                    dot={showPoints}
                    name={key}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                    strokeWidth={2}
                    fill={showArea ? colors[index % colors.length] : undefined}
                    fillOpacity={showArea ? 0.1 : 0}
                  />
                ))}
              </RechartsLineChart>
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

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  xAxisKey: PropTypes.string.isRequired,
  availableKeys: PropTypes.array.isRequired,
  initialYAxisKeys: PropTypes.array,
  colorScheme: PropTypes.array,
};

export default LineChart;
