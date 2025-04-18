import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Upload as UploadIcon, PlayArrow as PlayArrowIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

// Predefined features for the iris dataset
const IRIS_FEATURES = ['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)', 'species'];

const DatasetSelection = ({ 
  dataset, 
  setDataset, 
  customData,
  features, 
  targetFeature, 
  handleTargetChange, 
  selectedFeatures, 
  handleFeatureToggle, 
  handleFileUpload,
  modelType,
  columnsToDiscard = [],
  setColumnsToDiscard = () => {}
}) => {
  // Store available features based on the selected dataset
  const [availableFeatures, setAvailableFeatures] = useState([]);
  
  // Debug info
  console.log('DatasetSelection rendered');
  console.log('Dataset:', dataset);
  console.log('Features passed to component:', features);
  console.log('CustomData:', customData ? `${customData.length} rows` : 'None');
  console.log('Available features state:', availableFeatures);

  // Update available features when dataset changes or features are loaded
  useEffect(() => {
    console.log('DatasetSelection useEffect - dataset or features changed');
    
    if (dataset === 'iris') {
      console.log('Setting Iris features');
      setAvailableFeatures(IRIS_FEATURES);
    } else if (dataset === 'custom' && features && features.length > 0) {
      console.log('Setting custom features:', features);
      setAvailableFeatures(features);
    } else {
      console.log('No features available, setting empty array');
      setAvailableFeatures([]);
    }
  }, [dataset, features]);

  // Feature selection guidance based on model type
  const getFeatureGuidance = () => {
    if (modelType === 'decision_tree') {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Decision Tree Feature Selection:</strong> Choose features that might influence the classification. 
            Decision trees work by finding optimal splits in your data based on these features.
          </Typography>
        </Alert>
      );
    } else if (modelType === 'knn') {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>KNN Feature Selection:</strong> Select features that help distinguish between classes. 
            KNN uses these features to calculate distances between data points.
          </Typography>
        </Alert>
      );
    }
    return null;
  };

  // Handle toggling a column to discard
  const handleDiscardToggle = (feature) => {
    if (columnsToDiscard.includes(feature)) {
      setColumnsToDiscard(columnsToDiscard.filter(f => f !== feature));
    } else {
      setColumnsToDiscard([...columnsToDiscard, feature]);
    }
  };

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 4,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: '1px solid rgba(25, 118, 210, 0.1)',
      borderRadius: '16px'
    }}>
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: '#1976d2',
        mb: 3
      }}>
        <PlayArrowIcon /> Dataset Selection
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Dataset</InputLabel>
        <Select
          value={dataset}
          onChange={(e) => setDataset(e.target.value)}
          label="Dataset"
        >
          <MenuItem value="iris">Iris Dataset</MenuItem>
          <MenuItem value="custom">Custom Dataset</MenuItem>
        </Select>
      </FormControl>

      {dataset === 'custom' && (
        <Box sx={{ mb: 3 }}>
          {/* File uploader */}
          {handleFileUpload}
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Supported format: .csv files only
          </Typography>
          
          {/* CSV formatting tips */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>CSV TIPS:</strong>
              <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                <li>First row must contain column headers</li>
                <li>Values should be comma-separated</li>
                <li>Use quotes for values containing commas</li>
                <li>Save Excel files as "CSV (Comma delimited) (*.csv)"</li>
              </ul>
            </Typography>
          </Alert>
        </Box>
      )}

      {dataset === 'custom' && features && features.length === 0 && customData === null && (
        <Alert severity="info" sx={{ my: 2 }}>
          Please upload a dataset file to continue
        </Alert>
      )}

      {availableFeatures && availableFeatures.length > 0 ? (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: '#1976d2', mt: 3 }}>
            Feature Configuration
          </Typography>
          
          {/* Display model-specific feature selection guidance */}
          {getFeatureGuidance()}
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Target Feature</InputLabel>
            <Select
              value={targetFeature}
              onChange={handleTargetChange}
              label="Target Feature"
            >
              {availableFeatures.map((feature) => (
                <MenuItem key={feature} value={feature}>
                  {feature}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Target feature should have 5 or fewer unique values for classification tasks
            </Typography>
          </FormControl>

          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
              sx={{ backgroundColor: 'rgba(211, 47, 47, 0.04)' }}
            >
              <Typography variant="subtitle2">Discard Features from Training</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Selected features will be excluded from the model training process
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Checked features will not be used when training the model. The target feature cannot be discarded.
                </Typography>
              </Alert>
              <FormGroup>
                {availableFeatures.map((feature) => (
                  <FormControlLabel
                    key={`discard-${feature}`}
                    control={
                      <Checkbox
                        checked={!selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        disabled={feature === targetFeature}
                      />
                    }
                    label={feature}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </>
      ) : dataset === 'custom' && customData ? (
        <Alert severity="warning" sx={{ my: 2 }}>
          No features were detected in your dataset. Please ensure your file has headers in the first row.
        </Alert>
      ) : null}
    </Paper>
  );
};

export default DatasetSelection; 

