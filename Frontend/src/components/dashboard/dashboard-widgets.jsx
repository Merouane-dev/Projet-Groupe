// src/components/dashboard/DashboardWidgets.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {value}
            </Typography>
          </Grid>
          <Grid item>
            <Box
              sx={{
                backgroundColor: color,
                borderRadius: 1,
                p: 1,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

const DashboardWidgets = ({ stats }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <StatCard
          title="JEUX DE DONNÉES"
          value={stats.totalDatasets}
          icon={<StorageIcon fontSize="large" />}
          color={theme.palette.primary.main}
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <StatCard
          title="GRAPHIQUES"
          value={stats.totalCharts}
          icon={<BarChartIcon fontSize="large" />}
          color={theme.palette.secondary.main}
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <StatCard
          title="RAPPORTS"
          value={stats.totalReports}
          icon={<DescriptionIcon fontSize="large" />}
          color={theme.palette.success.main}
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <StatCard
          title="UTILISATEURS"
          value={stats.totalUsers}
          icon={<PeopleIcon fontSize="large" />}
          color={theme.palette.info.main}
        />
      </Grid>
    </Grid>
  );
};

DashboardWidgets.propTypes = {
  stats: PropTypes.shape({
    totalDatasets: PropTypes.number.isRequired,
    totalCharts: PropTypes.number.isRequired,
    totalReports: PropTypes.number.isRequired,
    totalUsers: PropTypes.number.isRequired,
  }).isRequired,
};

export default DashboardWidgets;
