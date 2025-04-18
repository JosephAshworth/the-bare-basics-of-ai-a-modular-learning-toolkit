import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Button,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';

const ModelConfiguration = ({
  modelType,
  setModelType,
  testSize,
  setTestSize,
  minSamplesSplit,
  setMinSamplesSplit,
  nNeighbors,
  setNNeighbors,
  handleTrainModel,
  loading
}) => {
  // Model-specific description and parameter guidance
  const renderModelGuidance = () => {
    if (modelType === 'decision_tree') {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Decision Tree</strong> builds a tree-like model of decisions based on feature values. It splits the data into subsets based on the most significant attributes.
          </Typography>
          <Typography variant="body2">
            <strong>Min Samples Split:</strong> The minimum number of samples required to split an internal node. Higher values prevent overfitting but might underfit.
          </Typography>
        </Alert>
      );
    } else if (modelType === 'knn') {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>K-Nearest Neighbors</strong> classifies data points based on the majority class of their k nearest neighbors. It uses distance metrics to determine similarity.
          </Typography>
          <Typography variant="body2">
            <strong>N Neighbors:</strong> The number of neighbors to consider. Lower values are more sensitive to noise, while higher values make the classification smoother.
          </Typography>
        </Alert>
      );
    }
    return null;
  };

  return (
    <>
      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Model Configuration
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Model Type</InputLabel>
        <Select
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          label="Model Type"
        >
          <MenuItem value="decision_tree">Decision Tree</MenuItem>
          <MenuItem value="knn">K-Nearest Neighbors</MenuItem>
        </Select>
      </FormControl>

      {renderModelGuidance()}

      <Typography gutterBottom>
        Test Size: {testSize}
      </Typography>
      <Slider
        value={testSize}
        onChange={(e, newValue) => setTestSize(newValue)}
        min={0.1}
        max={0.5}
        step={0.1}
        sx={{ mb: 2 }}
      />

      {modelType === 'decision_tree' ? (
        <TextField
          fullWidth
          type="number"
          label="Min Samples Split"
          value={minSamplesSplit}
          onChange={(e) => setMinSamplesSplit(Number(e.target.value))}
          sx={{ mb: 2 }}
        />
      ) : (
        <TextField
          fullWidth
          type="number"
          label="N Neighbors"
          value={nNeighbors}
          onChange={(e) => setNNeighbors(Number(e.target.value))}
          sx={{ mb: 2 }}
        />
      )}

      {typeof handleTrainModel === 'function' ? (
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          onClick={handleTrainModel}
          disabled={loading}
          fullWidth
        >
          Train Model
        </Button>
      ) : (
        handleTrainModel
      )}
    </>
  );
};

export default ModelConfiguration; 