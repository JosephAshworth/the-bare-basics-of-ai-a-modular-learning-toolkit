// the card that allows the user to define the model type and hyperparameters

import { useState } from 'react';

// material ui components
import { 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Divider,
  Alert,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useTheme } from '@mui/material/styles';

const ModelConfiguration = ({
  modelType,
  testSize,
  minSamplesSplit,
  nNeighbors,
  onModelTypeChange,
  onTestSizeChange,
  onMinSamplesSplitChange,
  onNNeighborsChange
}) => {
  const theme = useTheme();
  const [isTestSizeInfoOpen, setTestSizeInfoOpen] = useState(false);

  const handleOpenTestSizeInfo = () => setTestSizeInfoOpen(true);
  const handleCloseTestSizeInfo = () => setTestSizeInfoOpen(false);

  const handleMinSamplesSplitChange = (e) => {
    const value = parseInt(e.target.value, 10); // convert the value to an integer
    if (isNaN(value) || value < 2) {
      onMinSamplesSplitChange({ target: { value: 2 } }); // if the value is not a number or less than 2, set the value to 2
    } else {
      onMinSamplesSplitChange(e);
    }
  };

  const handleNNeighborsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      onNNeighborsChange({ target: { value: 1 } });
    } else {
      onNNeighborsChange(e);
    }
  };

  const renderModelGuidance = () => {
    if (modelType === 'decision_tree') {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Decision Tree:</strong> Imagine a flowchart or asking 20 questions. A Decision Tree asks yes/no questions about your data (such as 'Is petal length &gt; 5cm?') to sort it into categories. Each question splits the data into smaller groups.
          </Typography>
          <Typography variant="body2">
            <strong>Min Samples Split:</strong> How many data points must be in a group before the tree is allowed to ask another question to split it further? A higher number stops the tree from getting too specific and potentially memorising noise in the data.
          </Typography>
        </Alert>
      );
    } else if (modelType === 'knn') {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>K-Nearest Neighbours (KNN):</strong> KNN predicts the category of a new data point by looking at the categories of its 'k' closest neighbours in the existing data. It assumes similar things exist close to each other.
          </Typography>
          <Typography variant="body2">
            <strong>N Neighbours (k):</strong> How many neighbours get a 'vote' on the new point's category? A small number (like 1 or 3) means the prediction can be easily influenced by outliers. A larger number makes the prediction more general but might ignore local patterns.
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
          onChange={onModelTypeChange}
          label="Model Type"
        >
          <MenuItem value="decision_tree">Decision Tree</MenuItem>
          <MenuItem value="knn">K-Nearest Neighbors</MenuItem>
        </Select>
      </FormControl>

      {renderModelGuidance()}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton 
          size="small"
          sx={{ 
            color: theme.palette.grey[500],
            mr: 0.5,
          }}
          onClick={handleOpenTestSizeInfo}
          aria-label="Test Size Information"
        > 
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
        <Typography gutterBottom component="div" sx={{ mb: 0 }}>
          Test Size: {testSize}
        </Typography>
      </Box>

      <Slider
        value={testSize}
        onChange={onTestSizeChange}
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
          onChange={handleMinSamplesSplitChange}
          sx={{ mb: 2 }}
          inputProps={{ min: 2 }} // make sure users cannot enter a value less than 2 (as at least 2 are needed to split the data)
        />
      ) : (
        <TextField
          fullWidth
          type="number"
          label="N Neighbors"
          value={nNeighbors}
          onChange={handleNNeighborsChange}
          sx={{ mb: 2 }}
          inputProps={{ min: 1 }}
        />
      )}

      <Dialog
        open={isTestSizeInfoOpen}
        onClose={handleCloseTestSizeInfo}
        aria-labelledby="test-size-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="test-size-info-dialog-title" sx={{ color: 'text.primary' }}>Test Size Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            The proportion of the dataset to include in the test split. For example, a value of 0.2 means 20% of the data will be used for testing the trained model's performance, and the remaining 80% will be used for training the model.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTestSizeInfo}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModelConfiguration;
