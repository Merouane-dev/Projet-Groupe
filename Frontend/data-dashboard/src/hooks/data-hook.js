// src/hooks/useData.js
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

export const useData = () => {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useData doit être utilisé à l\'intérieur d\'un DataProvider');
  }
  
  return context;
};
