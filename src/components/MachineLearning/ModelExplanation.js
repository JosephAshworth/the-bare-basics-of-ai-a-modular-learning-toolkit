import
  { useState } // import useState, this is used to manage the state of the component
from 'react';

import {
  Box, // import Box from @mui/material
  Typography, // import Typography from @mui/material
  Paper, // import Paper from @mui/material
  Alert, // import Alert from @mui/material
  CircularProgress, // import CircularProgress from @mui/material
  Tabs, // import Tabs from @mui/material
  Tab, // import Tab from @mui/material
  List, // import List from @mui/material
  ListItem, // import ListItem from @mui/material
  ListItemText, // import ListItemText from @mui/material
  LinearProgress // import LinearProgress from @mui/material
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on the theme

const formatImportance = (value) => { // function to format the importance value as a percentage with 2 decimal places
    return `${value.toFixed(2)}%`; // return the value as a percentage with 2 decimal places
};

const ModelExplanation = ({ explanations, loading }) => { // function to display the model explanation
  const theme = useTheme(); // for getting the MUI theme object

  const [activeConfusionMatrix, setActiveConfusionMatrix] = useState('train'); // state variable to store the active confusion matrix
  



  if (loading) { // if the loading state is true
    return (
      <Box
        sx={{
          display: 'flex', // display the box as a flex container
          flexDirection: 'column', // set the flex direction of the box to column
          alignItems: 'center', // align the items of the box to the centre
          p: 3 // set the padding of the box to 3 units
        }}
      >
        <CircularProgress /> {/* display the circular progress */}
        <Typography variant="body1" sx={{ mt: 2 }}>
          Generating model insights...
        </Typography>
      </Box>
    );
  }

  if (!explanations) { // if the explanations are not available
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Model insights are not available for this model or configuration. {/* display the alert message */}
      </Alert>
    );
  }

  const { 
      model_statistics, // the model statistics
      key_features, // the key features
      confusion_matrices // the confusion matrices
  } = explanations; // destructure the explanations object into individual variables

  const handleConfusionMatrixTabChange = (event, newValue) => { // function to handle the change of the confusion matrix tab
    setActiveConfusionMatrix(newValue); // set the active confusion matrix tab to the new value
  };

  return (
    <Box sx={{ mt: 2 }}> {/* display the box with a top margin of 2 units */}
      {model_statistics && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}> {/* display the paper with a bottom margin of 3 units */}
          <Typography variant="h6" component="h3" gutterBottom> {/* display the model statistics in a typography component */}
            Model Statistics
          </Typography>
          <List dense> {/* display the list */}
            {Object.entries(model_statistics).map(([key, value]) => ( // map over the model statistics
              <ListItem key={key} disablePadding> {/* display the list item */}
                <ListItemText 
                    primary={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} // replace the underscores with spaces and capitalise the first letter of each word
                    secondary={String(value)} // display the value as a string
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {key_features && Object.keys(key_features).length > 0 && ( // if the key features are available and the length of the key features is greater than 0
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}> {/* display the paper with a bottom margin of 3 units */}
           <Typography variant="h6" component="h3" gutterBottom> {/* display the key features in a typography component */}
            Key Features/Importance
          </Typography>
           <Typography variant="caption" display="block" color={theme.palette.text.secondary} sx={{ mb: 2 }}> {/* display the key features caption in a typography component */}
                How much each feature contributes to the model's predictions. A higher precentage means that feature is more important in the final predictions.
           </Typography>
          <List dense> {/* display the list */}
             {Object.entries(key_features) // map over the key features
              .sort(([, a], [, b]) => b.importance - a.importance) // sort the key features by importance
              .map(([feature, data]) => { // map over the key features
                const importanceValue = (data && typeof data.importance === 'number') ? data.importance : 0; // get the importance value
                const formattedValue = formatImportance(importanceValue); // format the importance value

                return ( // return the list item
                  <ListItem 
                    key={feature} // display the feature as the key
                    disablePadding // disable the padding of the list item
                    sx={{ // set the styles of the list item
                      display: 'flex', // display the list item as a flex container
                      justifyContent: 'space-between', // space child elements evenly with space
                      alignItems: 'center', // align the items of the list item to the centre
                      mb: 1.5 // set the bottom margin of the list item to 1.5 units
                    }}
                  >
                    <ListItemText 
                      primary={feature} // display the feature as the primary text
                      primaryTypographyProps={{ noWrap: true }} // set the primary typography props to no wrap
                      sx={{ flex: '0 1 auto', mr: 2 }} // set flex to prevent growing, allow shrinking, and size based on content, add right margin of 2 units
                    />
                    
                    <Box
                      sx={{ 
                        flex: '1 1 auto', // allow to grow and shrink, base size on content
                        display: 'flex', // display the box as a flex container
                        alignItems: 'center', // align the items of the box to the centre
                        gap: 1.5 // set the gap of the box to 1.5 units
                      }}
                    >
                      <LinearProgress 
                        variant="determinate" // set the variant of the linear progress to determinate, which displays progress based on a specific value, such as a progress bar
                        value={importanceValue} // set the value of the linear progress to the importance value
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} // set the flex grow to 1, set the height of the linear progress to 8 units, and set the border radius of the linear progress to 4 units
                      />
                      <Typography 
                        variant="body2" // set the variant of the typography to body2
                        sx={{ minWidth: '50px', textAlign: 'right' }} // set the minimum width of the typography to 50 units, and set the text alignment of the typography to right
                      >
                        {formattedValue} {/* display the formatted value */}
                      </Typography>
                    </Box>
                  </ListItem>
                );
            })}
          </List>
        </Paper>
      )}

      

      {confusion_matrices && (confusion_matrices.train || confusion_matrices.test) && ( // if the confusion matrices are available and the train or test confusion matrix is available
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}> {/* display the paper with a bottom margin of 3 units */}
             <Typography variant="h6" component="h3" gutterBottom> {/* display the confusion matrix in a typography component */}
                Confusion Matrix
             </Typography>
             <Typography
              variant="caption" // set the variant of the typography to caption
              display="block" // display the typography as a block element
              color={theme.palette.text.secondary} // set the colour of the typography to the secondary colour from the theme
              sx={{ mb: 2 }} // set the bottom margin of the typography to 2 units
            > {/* display the confusion matrix caption in a typography component */}
                Visualises model performance: Correct predictions are on the diagonal. Non-diagonal shows misclassifications.
             </Typography>
            <Box sx={{ borderBottom: 1, borderColor: theme.palette.divider }}> {/* display the box with a bottom border of 1 unit and the border colour is the divider colour from the theme */}
                <Tabs 
                  value={activeConfusionMatrix} // set the value of the tabs to the active confusion matrix
                  onChange={handleConfusionMatrixTabChange} // set the onChange of the tabs to the handle confusion matrix tab change function
                  aria-label="confusion matrix tabs" // set the aria-label of the tabs to confusion matrix tabs
                >
                    {confusion_matrices.train && <Tab label="Training Set" value="train" />} {/* display the training set tab */}
                    {confusion_matrices.test && <Tab label="Test Set" value="test" />} {/* display the test set tab */}
                </Tabs>
            </Box>
            <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center' }}> {/* display the box with a top margin of 2 units, and display the box as a flex container with the justify content set to centre */}
                {confusion_matrices[activeConfusionMatrix] ? (
                     <img 
                        src={`data:image/png;base64,${confusion_matrices[activeConfusionMatrix]}`}
                        alt={`${activeConfusionMatrix} confusion matrix`} // display the alt text of the image
                        style={{ maxWidth: '100%', height: 'auto' }} // set the maximum width of the image to 100%, and set the height of the image to auto
                     />
                ) : (
                    <Typography>Matrix not available.</Typography> // display the typography component
                )}
            </Box>
        </Paper>
      )}

      {!model_statistics && !key_features && !confusion_matrices && ( // if the model statistics, key features, and confusion matrices are not available
           <Alert severity="info" sx={{ mt: 2 }}> {/* display the alert component */}
               No specific model insights could be generated for this model. {/* display the alert message */}
           </Alert>
      )}
    </Box>
  );
};

export default ModelExplanation; // export the ModelExplanation component, so it can be used in other components
