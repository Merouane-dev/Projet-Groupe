// src/components/data/DataImport.jsx
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DataPreview from './DataPreview';

const DataImport = () => {
  const { importDataset, isLoading, error } = useData();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [importOptions, setImportOptions] = useState({
    name: '',
    description: '',
    hasHeader: true,
    delimiter: ',',
    skipEmptyLines: true,
    trimFields: true,
  });
  const [previewData, setPreviewData] = useState(null);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [importSuccess, setImportSuccess] = useState(false);

  // Gérer le changement de fichier
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    
    // Déterminer le type de fichier
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    setFileType(fileExtension);
    
    // Mettre à jour le nom du dataset avec le nom du fichier
    setImportOptions({
      ...importOptions,
      name: selectedFile.name.replace(`.${fileExtension}`, ''),
    });
    
    // Générer l'aperçu des données
    generatePreview(selectedFile, fileExtension);
  };

  // Générer l'aperçu des données
  const generatePreview = (file, fileType) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      
      if (fileType === 'csv') {
        // Analyser le fichier CSV
        Papa.parse(content, {
          header: importOptions.hasHeader,
          delimiter: importOptions.delimiter,
          skipEmptyLines: importOptions.skipEmptyLines,
          preview: 10, // Limiter l'aperçu à 10 lignes
          complete: (results) => {
            if (importOptions.hasHeader) {
              setPreviewHeaders(results.meta.fields);
              setPreviewData(results.data);
            } else {
              // Si pas d'en-tête, créer des en-têtes génériques
              const headers = Object.keys(results.data[0]).map(key => `Column ${parseInt(key) + 1}`);
              setPreviewHeaders(headers);
              setPreviewData(results.data);
            }
          },
          error: (error) => {
            console.error('Erreur lors de l\'analyse du CSV:', error);
          }
        });
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        // Analyser le fichier Excel
        const workbook = XLSX.read(content, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: importOptions.hasHeader ? 1 : undefined,
          raw: false,
        });
        
        if (importOptions.hasHeader) {
          setPreviewHeaders(Object.keys(jsonData[0] || {}));
        } else {
          // Si pas d'en-tête, créer des en-têtes génériques
          const headers = Object.keys(jsonData[0] || {}).map(key => `Column ${key}`);
          setPreviewHeaders(headers);
        }
        
        // Limiter l'aperçu à 10 lignes
        setPreviewData(jsonData.slice(0, 10));
      }
    };
    
    if (fileType === 'csv') {
      reader.readAsText(file);
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      reader.readAsBinaryString(file);
    }
  };

  // Gérer le changement des options d'importation
  const handleOptionChange = (event) => {
    const { name, value, checked, type } = event.target;
    
    setImportOptions({
      ...importOptions,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Mettre à jour l'aperçu si nécessaire
    if (['hasHeader', 'delimiter', 'skipEmptyLines'].includes(name) && file) {
      generatePreview(file, fileType);
    }
  };

  // Gérer l'importation du fichier
  const handleImport = async () => {
    if (!file) {
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(importOptions));
      
      const result = await importDataset(file, importOptions);
      
      if (result.success) {
        setImportSuccess(true);
        // Réinitialiser le formulaire après un certain délai
        setTimeout(() => {
          setFile(null);
          setFileName('');
          setFileType('');
          setPreviewData(null);
          setPreviewHeaders([]);
          setImportOptions({
            name: '',
            description: '',
            hasHeader: true,
            delimiter: ',',
            skipEmptyLines: true,
            trimFields: true,
          });
          setImportSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Erreur lors de l\'importation:', err);
    }
  };

  return (
    <Card>
      <CardHeader title="Importer un nouveau jeu de données" />
      <Divider />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {importSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Importation réussie ! Le jeu de données a été ajouté.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              {fileName ? (
                <Typography variant="body1">{fileName}</Typography>
              ) : (
                <>
                  <Typography variant="h6">Glissez-déposez un fichier ou cliquez pour sélectionner</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Formats acceptés : CSV, XLSX, XLS
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
          
          {file && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom du jeu de données"
                  name="name"
                  value={importOptions.name}
                  onChange={handleOptionChange}
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={importOptions.description}
                  onChange={handleOptionChange}
                  multiline
                  rows={2}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Options d'importation</Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={importOptions.hasHeader}
                        onChange={handleOptionChange}
                        name="hasHeader"
                      />
                    }
                    label="La première ligne contient les en-têtes"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={importOptions.skipEmptyLines}
                        onChange={handleOptionChange}
                        name="skipEmptyLines"
                      />
                    }
                    label="Ignorer les lignes vides"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={importOptions.trimFields}
                        onChange={handleOptionChange}
                        name="trimFields"
                      />
                    }
                    label="Supprimer les espaces en début/fin de champ"
                  />
                </FormGroup>
              </Grid>
              
              {fileType === 'csv' && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <Typography variant="subtitle2" gutterBottom>
                      Délimiteur
                    </Typography>
                    <Select
                      value={importOptions.delimiter}
                      onChange={handleOptionChange}
                      name="delimiter"
                    >
                      <MenuItem value=",">Virgule (,)</MenuItem>
                      <MenuItem value=";">Point-virgule (;)</MenuItem>
                      <MenuItem value="\t">Tabulation</MenuItem>
                      <MenuItem value="|">Pipe (|)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </>
          )}
          
          {previewData && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Aperçu des données
              </Typography>
              <DataPreview data={previewData} headers={previewHeaders} />
            </Grid>
          )}
          
          {file && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleImport}
                  disabled={isLoading || !importOptions.name}
                >
                  {isLoading ? 'Importation en cours...' : 'Importer'}
                </Button>
              </Box>
              {isLoading && (
                <LinearProgress sx={{ mt: 2 }} />
              )}
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DataImport;