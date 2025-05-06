// src/context/DataContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [datasets, setDatasets] = useState([]);
  const [currentDataset, setCurrentDataset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger la liste des datasets disponibles
  useEffect(() => {
    const fetchDatasets = async () => {
      if (!localStorage.getItem('token')) return;
      
      try {
        setIsLoading(true);
        const response = await dataService.getDatasets();
        setDatasets(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des datasets:', err);
        setError(err.response?.data?.message || 'Une erreur est survenue lors du chargement des datasets.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDatasets();
  }, []);

  // Charger un dataset spécifique
  const loadDataset = async (datasetId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dataService.getDatasetById(datasetId);
      setCurrentDataset(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Erreur lors du chargement du dataset ${datasetId}:`, err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors du chargement du dataset.');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Importer un nouveau dataset
  const importDataset = async (file, options) => {
    try {
      setIsLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));
      
      const response = await dataService.importDataset(formData);
      
      // Mettre à jour la liste des datasets
      setDatasets(prevDatasets => [...prevDatasets, response.data]);
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erreur lors de l\'importation du dataset:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'importation du dataset.');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un dataset
  const deleteDataset = async (datasetId) => {
    try {
      setError(null);
      await dataService.deleteDataset(datasetId);
      
      // Mettre à jour la liste des datasets
      setDatasets(prevDatasets => prevDatasets.filter(dataset => dataset.id !== datasetId));
      
      // Si le dataset supprimé est le dataset courant, réinitialiser
      if (currentDataset && currentDataset.id === datasetId) {
        setCurrentDataset(null);
      }
      
      return { success: true };
    } catch (err) {
      console.error(`Erreur lors de la suppression du dataset ${datasetId}:`, err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la suppression du dataset.');
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Mettre à jour un dataset
  const updateDataset = async (datasetId, updates) => {
    try {
      setError(null);
      const response = await dataService.updateDataset(datasetId, updates);
      
      // Mettre à jour la liste des datasets
      setDatasets(prevDatasets => 
        prevDatasets.map(dataset => 
          dataset.id === datasetId ? response.data : dataset
        )
      );
      
      // Mettre à jour le dataset courant s'il s'agit du même
      if (currentDataset && currentDataset.id === datasetId) {
        setCurrentDataset(response.data);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Erreur lors de la mise à jour du dataset ${datasetId}:`, err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du dataset.');
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Obtenir les statistiques d'un dataset
  const getDatasetStats = async (datasetId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dataService.getDatasetStats(datasetId);
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Erreur lors de l'obtention des statistiques du dataset ${datasetId}:`, err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'obtention des statistiques.');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    datasets,
    currentDataset,
    isLoading,
    error,
    loadDataset,
    importDataset,
    deleteDataset,
    updateDataset,
    getDatasetStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
