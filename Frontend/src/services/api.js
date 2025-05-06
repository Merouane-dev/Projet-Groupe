// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// src/services/authService.js
import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  validateToken: () => api.get('/auth/validate-token'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  getUsers: () => api.get('/users'),
  getUserById: (userId) => api.get(`/users/${userId}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
};

// src/services/dataService.js
import api from './api';

export const dataService = {
  getDatasets: () => api.get('/datasets'),
  getDatasetById: (id) => api.get(`/datasets/${id}`),
  importDataset: (formData) => api.post('/datasets/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateDataset: (id, updates) => api.put(`/datasets/${id}`, updates),
  deleteDataset: (id) => api.delete(`/datasets/${id}`),
  getDatasetData: (id, params) => api.get(`/datasets/${id}/data`, { params }),
  getDatasetStats: (id) => api.get(`/datasets/${id}/stats`),
  getDatasetColumns: (id) => api.get(`/datasets/${id}/columns`),
};

// src/services/chartService.js
import api from './api';

export const chartService = {
  getCharts: () => api.get('/charts'),
  getChartById: (id) => api.get(`/charts/${id}`),
  createChart: (chartData) => api.post('/charts', chartData),
  updateChart: (id, chartData) => api.put(`/charts/${id}`, chartData),
  deleteChart: (id) => api.delete(`/charts/${id}`),
  getChartsByDataset: (datasetId) => api.get(`/charts/dataset/${datasetId}`),
};

// src/services/reportService.js
import api from './api';

export const reportService = {
  getReports: () => api.get('/reports'),
  getReportById: (id) => api.get(`/reports/${id}`),
  createReport: (reportData) => api.post('/reports', reportData),
  updateReport: (id, reportData) => api.put(`/reports/${id}`, reportData),
  deleteReport: (id) => api.delete(`/reports/${id}`),
  generatePDF: (id) => api.get(`/reports/${id}/pdf`, { responseType: 'blob' }),
};

// src/services/auditService.js
import api from './api';

export const auditService = {
  getAuditLogs: (params) => api.get('/audit-logs', { params }),
  getAuditLogById: (id) => api.get(`/audit-logs/${id}`),
  exportAuditLogs: (params) => api.get('/audit-logs/export', { 
    params,
    responseType: 'blob' 
  }),
};
