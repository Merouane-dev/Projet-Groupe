// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer l'URL de redirection si elle existe
  const from = location.state?.from?.pathname || '/dashboard';

  // Configuration du formulaire avec react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Fonction de soumission du formulaire
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setShowError(false);
    
    try {
      const result = await login(data);
      
      if (result.success) {
        // Redirection vers la page précédente ou le tableau de bord
        navigate(from, { replace: true });
      } else {
        setShowError(true);
        setErrorMessage(result.error || 'Une erreur est survenue lors de la connexion.');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setShowError(true);
      setErrorMessage('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            px: 4,
            py: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Connexion
          </Typography>
          
          {showError && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse e-mail"
              autoComplete="email"
              autoFocus
              {...register('email', {
                required: 'L\'adresse e-mail est requise',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse e-mail invalide',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Mot de passe oublié ?
                </Link>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  Pas encore de compte ?{' '}
                  <Link href="#" variant="body2" onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}>
                    S'inscrire
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          Dashboard Collaboratif • Master 2 Data & Développement • {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );