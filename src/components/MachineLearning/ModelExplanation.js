//for the 'model insights' tab, representing the model stats, feature importance and confusion matrix

import { useState } from 'react';

// material ui components
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  LinearProgress
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

const formatImportance = (value) => {
    return `${value.toFixed(2)}%`;
};

const ModelExplanation = ({ explanations, loading }) => {
  const theme = useTheme();

  const [activeConfusionMatrix, setActiveConfusionMatrix] = useState('train');

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Generating model insights...
        </Typography>
      </Box>
    );
  }

  if (!explanations) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Model insights are not available for this model or configuration.
      </Alert>
    );
  }

  const { 
      model_statistics,
      key_features,
      confusion_matrices
  } = explanations; // get the explanations from the insights

  const handleConfusionMatrixTabChange = (event, newValue) => {
    setActiveConfusionMatrix(newValue);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {model_statistics && ( // if the model statistics are available, display them
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Model Statistics
          </Typography>
          <List>
            {/* loop through the model statistics and display them */}
            {Object.entries(model_statistics).map(([key, value]) => (
              <ListItem key={key} disablePadding>
                <ListItemText 
                  // set the primary text of the list item, formatting the key by replacing underscores with spaces
                  // capitalise the first letter of each word for better readability
                  primary={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

                  // set the secondary text of the list item, converting the value to a string to ensure proper display
                  secondary={String(value)}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* if the key features are available, display them */}
      {key_features && Object.keys(key_features).length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
           <Typography variant="h6" component="h3" gutterBottom>
            Key Features/Importance
          </Typography>
           <Typography variant="caption" display="block" color={theme.palette.text.secondary} sx={{ mb: 2 }}>
                How much each feature contributes to the model's predictions. A higher precentage means that feature is more important in the final predictions.
           </Typography>
          <List>
            {/* loop through the key features */}
             {Object.entries(key_features)
              .sort(([, a], [, b]) => b.importance - a.importance) // sort the key features by importance


              .map(([feature, data]) => {
                // check if data exists and if the importance actually exists, otherwise default to 0
                const importanceValue = (data && typeof data.importance === 'number') ? data.importance : 0;

                // format the importance value as a percentage with 2 decimal places
                const formattedValue = formatImportance(importanceValue);

                return (
                  <ListItem 
                    key={feature}
                    disablePadding
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between', // distribute child elements evenly, with the first element at the start and the last element at the end
                      alignItems: 'center',
                      mb: 1.5
                    }}
                  >
                    <ListItemText 
                      primary={feature} // the feature name on the left
                      primaryTypographyProps={{ noWrap: true }} // prevent the primary text from wrapping to the next line, ensuring it stays on a single line
                      sx={{ flex: '0 1 auto', mr: 2 }} // allow the item to shrink but not grow, sizing it based on the content
                    />
                    
                    <Box
                      sx={{ 
                        flex: '1 1 auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                      }}
                    >
                      <LinearProgress 
                        variant="determinate" // for a linear progress bar
                        value={importanceValue}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography 
                        variant="body2"
                        sx={{ minWidth: '50px', textAlign: 'right' }}
                      >
                        {formattedValue}
                      </Typography>
                    </Box>
                  </ListItem>
                );
            })}
          </List>
        </Paper>
      )}

      {/* if the confusion matrices are available, display them */}
      {confusion_matrices && (confusion_matrices.train || confusion_matrices.test) && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
             <Typography variant="h6" gutterBottom>
                Confusion Matrix
             </Typography>
             <Typography
              variant="caption"
              display="block"
              color={theme.palette.text.secondary}
              sx={{ mb: 2 }}
            >
                Visualises model performance: Correct predictions are on the diagonal. Non-diagonal shows misclassifications.
             </Typography>
            <Box sx={{ borderBottom: 1, borderColor: theme.palette.divider }}>
                <Tabs 
                  value={activeConfusionMatrix}
                  onChange={handleConfusionMatrixTabChange}
                  aria-label="confusion matrix tabs"
                >
                    {confusion_matrices.train && <Tab label="Training Set" value="train" />}
                    {confusion_matrices.test && <Tab label="Test Set" value="test" />}
                </Tabs>
            </Box>
            <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center' }}>
                {/* if the confusion matrix is available, display it */}
                {confusion_matrices[activeConfusionMatrix] ? (
                     <img 
                        src={`data:image/png;base64,${confusion_matrices[activeConfusionMatrix]}`}
                        alt={`${activeConfusionMatrix} confusion matrix`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                     />
                ) : (
                    <Typography>Matrix not available.</Typography>
                )}
            </Box>
        </Paper>
      )}

      {/* if the model statistics, key features and confusion matrices are not available, display an alert */}
      {!model_statistics && !key_features && !confusion_matrices && (
           <Alert severity="info" sx={{ mt: 2 }}>
               No specific model insights could be generated for this model.
           </Alert>
      )}
    </Box>
  );
};

export default ModelExplanation;