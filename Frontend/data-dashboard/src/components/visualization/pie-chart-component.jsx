// src/components/visualization/PieChart.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  useTheme,
} from '@mui/material';

// Composant pour le secteur actif (animation lorsqu'on survole)
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    name,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-4} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill="#999">
        {`${value} (${(percent * 100).toFixed(1)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const PieChart = ({
  data,
  nameKey,
  valueKey,
  colorScheme = [],
  donut = false,
}) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);
  const [showPercentage, setShowPercentage] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

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
    '#a4de6c',
    '#d0ed57',
  ];

  // Utiliser les couleurs fournies ou les couleurs par défaut
  const colors = colorScheme.length > 0 ? colorScheme : defaultColors;

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const handleShowPercentageChange = (event) => {
    setShowPercentage(event.target.checked);
  };

  const handleShowLegendChange = (event) => {
    setShowLegend(event.target.checked);
  };

  // Calculer le total pour les pourcentages
  const total = data.reduce((sum, entry) => sum + (entry[valueKey] || 0), 0);

  // Formater les données pour le label
  const formatLabel = (entry) => {
    if (showPercentage) {
      return `${entry.name}: ${((entry.value / total) * 100).toFixed(1)}%`;
    }
    return entry.name;
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showPercentage}
                  onChange={handleShowPercentageChange}
                  name="showPercentage"
                  size="small"
                />
              }
              label="Afficher les pourcentages"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showLegend}
                  onChange={handleShowLegendChange}
                  name="showLegend"
                  size="small"
                />
              }
              label="Afficher la légende"
            />
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ height: 400 }}>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  dataKey={valueKey}
                  nameKey={nameKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={donut ? 120 : 150}
                  innerRadius={donut ? 60 : 0}
                  fill="#8884d8"
                  paddingAngle={2}
                  labelLine={true}
                  label={formatLabel}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  isAnimationActive={true}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [
                    `${value} (${((value / total) * 100).toFixed(1)}%)`,
                    'Valeur'
                  ]}
                />
                {showLegend && (
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                )}
              </RechartsPieChart>
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

PieChart.propTypes = {
  data: PropTypes.array.isRequired,
  nameKey: PropTypes.string.isRequired,
  valueKey: PropTypes.string.isRequired,
  colorScheme: PropTypes.array,
  donut: PropTypes.bool,
};

export default PieChart;
