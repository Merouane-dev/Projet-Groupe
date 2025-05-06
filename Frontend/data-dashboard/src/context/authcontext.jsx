// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        // Vérifier si le token est expiré
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
          setIsLoading(false);
          return;
        }
        
        // Vérifier la validité du token avec le backend
        const response = await authService.validateToken();
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Erreur d\'authentification:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      const { token, user } = response.data;
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', token);
      
      // Mettre à jour l'état
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion.');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await authService.updateProfile(userData);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du profil.');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
