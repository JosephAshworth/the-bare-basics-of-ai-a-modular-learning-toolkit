import
  { useState } // import useState, this is used to manage the state of the component
from 'react';

import { 
  Typography, // import Typography from @mui/material
  FormControl, // import FormControl from @mui/material
  InputLabel, // import InputLabel from @mui/material
  Select, // import Select from @mui/material
  MenuItem, // import MenuItem from @mui/material
  TextField, // import TextField from @mui/material
  Slider, // import Slider from @mui/material
  Divider, // import Divider from @mui/material
  Alert, // import Alert from @mui/material
  Box, // import Box from @mui/material
  IconButton, // import IconButton from @mui/material
  Dialog, // import Dialog from @mui/material
  DialogTitle, // import DialogTitle from @mui/material
  DialogContent, // import DialogContent from @mui/material
  DialogContentText, // import DialogContentText from @mui/material
  DialogActions, // import DialogActions from @mui/material
  Button // import Button from @mui/material
} from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // import InfoOutlinedIcon from @mui/icons-material, this is used to display an info icon

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on the theme

const ModelConfiguration = ({
  modelType, // the type of model to be used
  testSize, // the size of the test set
  minSamplesSplit, // the minimum number of samples required to split an internal node
  nNeighbors, // the number of neighbors to use for the KNN model
  onModelTypeChange, // the function to handle the change of the model type
  onTestSizeChange, // the function to handle the change of the test size
  onMinSamplesSplitChange, // the function to handle the change of the minimum samples split
  onNNeighborsChange // the function to handle the change of the number of neighbors
}) => {
  const theme = useTheme(); // for getting the MUI theme object
  const [isTestSizeInfoOpen, setTestSizeInfoOpen] = useState(false); // for managing the state of the test size info dialog

  const handleOpenTestSizeInfo = () => setTestSizeInfoOpen(true); // for opening the test size info dialog
  const handleCloseTestSizeInfo = () => setTestSizeInfoOpen(false); // for closing the test size info dialog

  const handleMinSamplesSplitChange = (e) => { // for handling the change of the minimum samples split value 
    const value = parseInt(e.target.value, 10); // parse the value of the minimum samples split in integer form
    if (isNaN(value) || value < 2) { // if the value is not a number or is less than 2
      onMinSamplesSplitChange({ target: { value: 2 } }); // call the onMinSamplesSplitChange function with the value of 2, this is to ensure the minimum samples split is at least 2
    } else {
      onMinSamplesSplitChange(e); // call the onMinSamplesSplitChange function with the event
    }
  };

  const handleNNeighborsChange = (e) => { // for handling the change of the number of neighbors value
    const value = parseInt(e.target.value, 10); // parse the value of the number of neighbors in integer form
    if (isNaN(value) || value < 1) { // if the value is not a number or is less than 1
      onNNeighborsChange({ target: { value: 1 } }); // call the onNNeighborsChange function with the value of 1, this is to ensure the number of neighbors is at least 1
    } else {
      onNNeighborsChange(e); // call the onNNeighborsChange function with the event
    }
  };

  const renderModelGuidance = () => { // for rendering the model guidance
    if (modelType === 'decision_tree') { // if the model type is decision tree
      return (
        <Alert severity="info" sx={{ my: 2 }}> {/* display the model guidance in an alert */}
          <Typography variant="body2" sx={{ mb: 1 }}> {/* display the model guidance in a typography component */}
            <strong>Decision Tree:</strong> Imagine a flowchart or asking 20 questions. A Decision Tree asks yes/no questions about your data (such as 'Is petal length &gt; 5cm?') to sort it into categories. Each question splits the data into smaller groups.
          </Typography>
          <Typography variant="body2"> {/* display the model guidance in a typography component */}
            <strong>Min Samples Split:</strong> How many data points must be in a group before the tree is allowed to ask another question to split it further? A higher number stops the tree from getting too specific and potentially memorising noise in the data.
          </Typography>
        </Alert>
      );
    } else if (modelType === 'knn') { // if the model type is KNN
      return (
        <Alert severity="info" sx={{ my: 2 }}> {/* display the model guidance in an alert */}
          <Typography variant="body2" sx={{ mb: 1 }}> {/* display the model guidance in a typography component */}
            <strong>K-Nearest Neighbours (KNN):</strong> KNN predicts the category of a new data point by looking at the categories of its 'k' closest neighbours in the existing data. It assumes similar things exist close to each other.
          </Typography>
          <Typography variant="body2"> {/* display the model guidance in a typography component */}
            <strong>N Neighbours (k):</strong> How many neighbours get a 'vote' on the new point's category? A small number (like 1 or 3) means the prediction can be easily influenced by outliers. A larger number makes the prediction more general but might ignore local patterns.
          </Typography>
        </Alert>
      );
    }
    return null; // return null if the model type is not decision tree or KNN
  };

  return (
    <>
      <Divider sx={{ my: 3 }} /> {/* display a divider with a vertical margin of 3 units */}

      <Typography variant="h6" gutterBottom>
        Model Configuration
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}> {/* display the model type in a form control component */}
        <InputLabel>Model Type</InputLabel> 
        <Select
          value={modelType} // the value of the model type
          onChange={onModelTypeChange} // the function to handle the change of the model type
          label="Model Type" // the label of the model type
        >
          <MenuItem value="decision_tree">Decision Tree</MenuItem> {/* display the decision tree option in a menu item */}
          <MenuItem value="knn">K-Nearest Neighbors</MenuItem> {/* display the KNN option in a menu item */}
        </Select>
      </FormControl>

      {renderModelGuidance()} {/* render the model guidance */}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}> {/* display a box with a flex container and a bottom margin of 1 unit */}
        <IconButton 
          size="small" // the size of the icon button
          sx={{ 
            color: theme.palette.grey[500], // the colour of the icon button
            mr: 0.5, // the right margin of the icon button
          }}
          onClick={handleOpenTestSizeInfo} // the function to handle the click of the icon button
          aria-label="Test Size Information" // the aria-label of the icon button
        > 
          <InfoOutlinedIcon fontSize="small" /> {/* display the info icon in a typography component */}
        </IconButton>
        <Typography gutterBottom component="div" sx={{ mb: 0 }}>
          Test Size: {testSize} {/* display the test size in a typography component */}
        </Typography>
      </Box>

      <Slider
        value={testSize} // the value of the test size
        onChange={onTestSizeChange} // the function to handle the change of the test size
        min={0.1} // the minimum value of the test size
        max={0.5} // the maximum value of the test size
        step={0.1} // the step value of the test size
        sx={{ mb: 2 }} // the bottom margin of the slider
      />

      {modelType === 'decision_tree' ? ( // if the model type is decision tree
        <TextField
          fullWidth // use the full width of the text field 
          type="number" // the type of the text field, this is to ensure the text field only accepts numbers
          label="Min Samples Split" // the label of the text field
          value={minSamplesSplit} // the value of the text field
          onChange={handleMinSamplesSplitChange} // the function to handle the change of minimum samples split
          sx={{ mb: 2 }} // the bottom margin of the text field
          inputProps={{ min: 2 }} // the input props of the text field, this is to set the minimum value of the text field to 2
        />
      ) : (
        <TextField
          fullWidth // use the full width of the text field 
          type="number" // the type of the text field, this is to ensure the text field only accepts numbers
          label="N Neighbors" // the label of the text field
          value={nNeighbors} // the value of the text field
          onChange={handleNNeighborsChange} // the function to handle the change of number of neighbors
          sx={{ mb: 2 }} // the bottom margin of the text field
          inputProps={{ min: 1 }} // the input props of the text field, this is to set the minimum value of the text field to 1
        />
      )}

      <Dialog
        open={isTestSizeInfoOpen} // the open state of the dialog
        onClose={handleCloseTestSizeInfo} // the function to handle the close of the dialog
        aria-labelledby="test-size-info-dialog-title" // the aria-labelledby of the dialog
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // the paper props of the dialog, this is to set the background colour of the dialog to the background colour from the theme
      >
        <DialogTitle id="test-size-info-dialog-title" sx={{ color: 'text.primary' }}>Test Size Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            The proportion of the dataset to include in the test split. For example, a value of 0.2 means 20% of the data will be used for testing the trained model's performance, and the remaining 80% will be used for training the model.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTestSizeInfo}>Close</Button> {/* display the close button in a button component */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModelConfiguration; // export the ModelConfiguration component as the default export, this allows the component to be used in other files
