import
  { useState, // import useState, this is used to manage the state of the component
    useEffect // import useEffect, this is used to manage the side effects of the component
  }
from 'react';

import { 
  Box, // import Box from MUI
  Typography, // import Typography from MUI
  FormControl, // import FormControl from MUI
  InputLabel, // import InputLabel from MUI
  Select, // import Select from MUI
  MenuItem, // import MenuItem from MUI
  FormGroup, // import FormGroup from MUI
  FormControlLabel, // import FormControlLabel from MUI
  Checkbox, // import Checkbox from MUI
  Paper, // import Paper from MUI
  Divider, // import Divider from MUI
  Alert, // import Alert from MUI
  TableContainer, // import TableContainer from MUI
  Table, // import Table from MUI
  TableHead, // import TableHead from MUI
  TableBody, // import TableBody from MUI
  TableRow, // import TableRow from MUI
  TableCell, // import TableCell from MUI
  IconButton, // import IconButton from MUI
  Dialog, // import Dialog from MUI
  DialogTitle, // import DialogTitle from MUI
  DialogContent, // import DialogContent from MUI
  DialogContentText, // import DialogContentText from MUI
  DialogActions, // import DialogActions from MUI
  Button, // import Button from MUI
  Link // import Link from MUI
} from '@mui/material';

import {
  PlayArrow as PlayArrowIcon, // import PlayArrowIcon from MUI
  InfoOutlined as InfoOutlinedIcon // import InfoOutlinedIcon from MUI
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const DatasetSelection = ({ 
  dataset, // the currently selected dataset (iris or custom)
  setDataset, // function to update the selected dataset
  customData, // the uploaded custom dataset data
  features, // list of available features in the dataset
  targetFeature, // the selected target feature for prediction
  handleTargetChange, // handler for when target feature selection changes
  targetCorrections, // object containing corrections for target feature values
  setTargetCorrections, // function to update target feature corrections
  handleFileUpload, // component for handling file uploads
  columnsToDiscard = [], // list of columns to exclude from the dataset
  setColumnsToDiscard = () => {}, // function to update excluded columns
  targetWarning, // warning message related to target feature selection
  setTargetWarning // function to update target feature warning
}) => {
  const theme = useTheme(); // Access the Material-UI theme for styling

  const [isDatasetInfoOpen, setDatasetInfoOpen] = useState(false); // state variable to store the dataset info open state
  const [isTargetInfoOpen, setTargetInfoOpen] = useState(false); // state variable to store the target info open state

  const handleOpenDatasetInfo = () => setDatasetInfoOpen(true); // function to open the dataset info dialog
  const handleCloseDatasetInfo = () => setDatasetInfoOpen(false); // function to close the dataset info dialog

  const handleOpenTargetInfo = () => setTargetInfoOpen(true); // function to open the target info dialog
  const handleCloseTargetInfo = () => setTargetInfoOpen(false); // function to close the target info dialog

  useEffect(() => {
    if (dataset === 'custom' && customData && customData.length > 0 && targetFeature) { // if the dataset is custom and the customData is not empty and the targetFeature is not empty
      try {
        const uniqueValues = new Set(customData.map(row => row[targetFeature])); // get the unique values from the customData
        const uniqueCount = uniqueValues.size; // get the unique count from the unique values
        
        if (uniqueCount > 5) { // if the unique count is greater than 5
          setTargetWarning(`Target feature "${targetFeature}" has ${uniqueCount} unique values. For classification tasks, it should have 5 or fewer unique values.`); // set the target warning to say that the target feature has more than 5 unique values
        } else { // if the unique count is less than 5
          setTargetWarning(''); // set the target warning to an empty string, indicating that there is no target warning
        }
      } catch (error) { // if an error occurs
        console.error("Error calculating unique values:", error); // print the error to the console
        setTargetWarning('Could not verify unique values for the target feature.'); // set the target warning to say that the target feature could not be verified
      }
    } else { // if the dataset is not custom or the customData is empty or the targetFeature is empty
      setTargetWarning(''); // set the target warning to an empty string, indicating that there is no target warning
    }
  }, [dataset, customData, targetFeature, setTargetWarning]); // use dataset, customData, targetFeature and setTargetWarning as dependencies

  const tableHeaders = customData && customData.length > 0 ? Object.keys(customData[0]) : []; // get the table headers from the customData

  return (
    <Paper sx={{ 
      p: 3, // set the padding of the paper to 3
      border: `1px solid ${theme.palette.divider}`, // set the border of the paper to the divider colour
      borderRadius: '16px', // set the border radius of the paper to 16px
      backgroundColor: theme.palette.background.paper // set the background colour of the paper to the paper colour
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ 
          display: 'flex', // set the display of the typography to flex
          alignItems: 'center', // set the align items of the typography to centre, this is used to align the icon and the text
          gap: 1, // set the gap of the typography to 1, this is used to add space between the icon and the text
          color: theme.palette.primary.main, // set the colour of the typography to the primary colour based on the theme
        }}>
          <PlayArrowIcon /> Dataset Selection
        </Typography>
      </Box>

      <Box
        sx={{ 
          display: 'flex', // set the display of the box to flex
          alignItems: 'center', // set the align items of the box to centre
          gap: 0.5, // set the gap of the box to 0.5, adding space between the icon and the form control
          mb: 2 // set the margin bottom of the box to 2, to add space below
        }}>
        <IconButton 
          size="small" // set the size of the icon button to small
          onClick={handleOpenDatasetInfo} // set the onClick of the icon button to the handleOpenDatasetInfo function, which opens the dataset info dialog
          sx={{ color: theme.palette.text.secondary }} // set the colour of the icon button to the secondary text colour based on the theme
          aria-label="Dataset information" // set the aria label of the icon button to "Dataset information"
        >
          <InfoOutlinedIcon fontSize="small" /> {/* set the icon of the icon button to the InfoOutlinedIcon from MUI */}
        </IconButton>
        <FormControl fullWidth> {/* set the form control to full width, so it takes the full width of the box */}
          <InputLabel>Dataset</InputLabel>
          <Select // create a select element, allowing the user to select an iris or custom dataset
            value={dataset} // set the value of the select element to the dataset
            onChange={(e) => setDataset(e.target.value)} // set the onChange of the select element to the setDataset function, which updates the dataset
            label="Dataset" // set the label of the select element to "Dataset"
          >
            <MenuItem value="iris">Iris Dataset</MenuItem> {/* set the menu item value to "iris" and the text to "Iris Dataset" */}
            <MenuItem value="custom">Custom Dataset</MenuItem> {/* set the menu item value to "custom" and the text to "Custom Dataset" */}
          </Select>
        </FormControl>
      </Box>

      {dataset === 'custom' && handleFileUpload} {/* if the dataset is custom, show the handleFileUpload component */}

      {dataset === 'custom' && ( //if the dataset is custom
          <Box sx={{ mb: 3 }}> {/* set the margin bottom of the box to 3, to add space below */}
             <Typography
             variant="caption" // set the typography to caption, so it is smaller than the default text
             color="text.secondary" // set the colour of the text to the secondary text colour based on the theme
             sx={{ mt: 1, display: 'block' }}> {/* set the margin top of the typography to 1, and the display to block, to add space above */}
               Supported format: .csv files only
             </Typography>
             
             <Alert severity="info" sx={{ mt: 2 }}> {/* set the alert to info, and the margin top to 2, to add space above */}
               <Typography variant="body2"> {/* set the typography to body2, so it is smaller than the default text */}
                 <strong>CSV TIPS:</strong> {/* set the text to bold */}
                 <ul style={{ margin: '5px 0 0 20px', padding: 0 }}> {/* set the margin to 5, no padding, and the left margin to 20, to add space above */}
                    <li>First row must contain column headers</li> {/* set the first list item to "First row must contain column headers" */}
                    <li>Values should be comma-separated</li> {/* set the second list item to "Values should be comma-separated" */}
                    <li>Use quotes for values containing commas</li> {/* set the third list item to "Use quotes for values containing commas" */}
                    <li>Save Excel files as "CSV (Comma delimited) (*.csv)"</li> {/* set the fourth list item to "Save Excel files as "CSV (Comma delimited) (*.csv)" */}
                  </ul>
               </Typography>
             </Alert>
          </Box>
      )}

      {dataset === 'custom' && features && features.length === 0 && customData === null && ( // if the dataset is custom, features is not empty, and customData is null
        <Alert severity="info" sx={{ my: 2 }}> {/* set the alert to info, and the margin top and bottom to 2, to add space above and below */}
          Please upload a dataset file to continue
        </Alert>
      )}

      {dataset === 'custom' && features && features.length > 0 && ( // if the dataset is custom, features is not empty
        <>
          <Divider sx={{ my: 2 }} /> {/* set the divider to have a margin top and bottom of 2, to add space above and below */}
          <Typography variant="subtitle1" gutterBottom>Custom Dataset Options</Typography> {/* set the typography to subtitle1, and the gutter bottom, to add space below */}
          
          <Box
            sx={{ 
              display: 'flex', // set the display of the box to flex
              flexDirection: 'row', // set the flex direction of the box to row, so the icon button and the form control are side by side
              gap: 0.5, // set the gap of the box to 0.5, adding space between the icon and the form control
              mb: 1 // set the margin bottom of the box to 1, to add space below
            }}>
            <IconButton 
              size="small" // set the size of the icon button to small
              onClick={handleOpenTargetInfo} // set the onClick of the icon button to the handleOpenTargetInfo function, which opens the target info dialog
              sx={{ color: theme.palette.text.secondary }} // set the colour of the icon button to the secondary text colour based on the theme
              aria-label="Target feature information" // set the aria label of the icon button to "Target feature information"
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
            <FormControl fullWidth> {/* set the form control to full width, so it takes the full width of the box */}
              <InputLabel>Target Feature</InputLabel> {/* set the input label of the form control */}
              <Select 
                value={targetFeature} // set the value of the select element to the targetFeature
                onChange={handleTargetChange} // set the onChange of the select element to the handleTargetChange function, which updates the targetFeature
                label="Target Feature" // set the label of the select element to "Target Feature"
                disabled={!features || features.length === 0} // set the disabled of the select element to true if the features is not empty
              >
                {features.map(feature => ( // map over the features and create a menu item for each feature
                  <MenuItem key={feature} value={feature}>{feature}</MenuItem> // set the key of the menu item to the feature, the value of the menu item to the feature, and the text of the menu item to the feature
                ))}
              </Select>
            </FormControl>
          </Box>

          {Array.isArray(customData) && targetFeature && customData.length > 0 && (() => { // if the customData is an array, the targetFeature is not empty, and the customData is not empty
            const rawValues = customData // set the rawValues to the customData, these are the unique values of the target feature
              .map(row => row?.[targetFeature]) // if the row has a target feature, add it to the rawValues array
              .filter(val => val !== null && val !== undefined); // filter the raw values to remove null and undefined values

            const uniqueTargetValues = [...new Set(rawValues.map(String))]; // create a unique target values array from the raw values

            return uniqueTargetValues.length > 0 && uniqueTargetValues.length <= 5 ? ( // if the unique target values are not empty, and the length is less than or equal to 5
              <Box sx={{ mt: 2, mb: 3 }}> {/* set the margin top and bottom of the box to 2 and 3, to add space above and below */}
                <Typography variant="subtitle2" gutterBottom> {/* set the typography to subtitle2, and the gutter bottom, to add space below */}
                  Correct Target Values
                </Typography>
                {uniqueTargetValues.map((originalValue, index) => ( // map over the unique target values and create a box for each unique target value
                  <Box key={index} sx={{ mb: 2 }}> {/* set the key of the box to the index, and the margin bottom to 2, to add space below */}
                    <Typography variant="body2" sx={{ mb: 1 }}> {/* set the typography to body2, and the margin bottom to 1, to add space below */}
                      {originalValue} {/* set the text of the typography to the original value */}
                    </Typography>
                    <FormControl fullWidth> {/* set the form control to full width, so it takes the full width of the box */}
                      <InputLabel>Correct to</InputLabel> {/* set the input label of the form control */}
                      <Select
                        value={targetCorrections?.[`${originalValue}`] ?? originalValue} // set the value of the select element to the targetCorrections, or the original value
                        label="Correct to" // set the label of the select element to "Correct to"
                        onChange={e => { // when the select element changes, update the targetCorrections
                          setTargetCorrections((prev) => ({
                            ...prev, // keep all previous corrections
                            [`${originalValue}`]: e.target.value // set a new correction for the current original value
                          }));
                        }}
                      >
                        {uniqueTargetValues.map((val, idx) => ( // map over the unique target values and create a menu item for each unique target value
                          <MenuItem key={idx} value={val}>{val}</MenuItem> // each option represents a potential correction value
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                ))}
              </Box>
            ) : null; // if there are no valid target values or more than 5, do not display the correction UI
          })()}

          {targetWarning && ( // if the targetWarning is not empty
            <Alert severity="warning" sx={{ mb: 2 }}> {/* set the alert to warning, and the margin bottom to 2, to add space below */}
              {targetWarning} {/* set the text of the alert to the targetWarning */}
            </Alert>
          )}

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Discard Columns (Optional)</Typography> {/* set the typography to subtitle2, and the gutter bottom, to add space below */}
          <Typography
            variant="caption" // set the typography to caption, so it is smaller than the default text
            display="block" // set the display of the typography to block, so it takes the full width of the box
            color="text.secondary" // set the colour of the text to the secondary text colour based on the theme
            sx={{ mb: 1 }}> {/* set the margin bottom of the typography to 1, to add space below */}
            Checked columns will be removed from the dataset *before* training feature selection.
          </Typography>
          <FormGroup // create a form group, which is a group of form controls
            sx={{ 
              mb: 2, // set the margin bottom of the form group to 2, to add space below
              maxHeight: '150px', // set the max height of the form group to 150px
              overflowY: 'auto', // set the overflow y of the form group to auto, so it can scroll if the content is too large
              border: '1px solid', // set the border of the form group to 1px solid
              borderColor: 'divider', // set the border colour of the form group to the divider colour based on the theme
              borderRadius: 1, // set the border radius of the form group to 1
              p: 1 // set the padding of the form group to 1
            }}> {/* set the style of the form group */}
            {features.map(feature => ( // map over the features and create a form control label for each feature
              <FormControlLabel 
                key={`discard-${feature}`} // set the key of the form control label to the feature
                control={<Checkbox 
                  checked={columnsToDiscard.includes(feature)} // set the checked of the checkbox to true if the feature is in the columnsToDiscard array
                  onChange={() => {
                    if (feature === targetFeature) return; // if the feature is the target feature, return
                    setColumnsToDiscard(prev => // set the columnsToDiscard to the previous columnsToDiscard array
                      prev.includes(feature) // if the feature is in the previous columnsToDiscard array
                        ? prev.filter(f => f !== feature) // filter the previous columnsToDiscard array to remove the feature
                        : [...prev, feature] // otherwise, add the feature to the previous columnsToDiscard array
                    );
                  }}
                  disabled={feature === targetFeature} // set the disabled of the checkbox to true if the feature is the target feature
                />}
                label={feature} // set the label of the form control label to the feature
              />
            ))}
          </FormGroup>
        </>
      )}

      {dataset === 'custom' && customData && customData.length > 0 && ( // if the dataset is custom, customData is not empty
        <>
          <Divider sx={{ my: 3 }} /> {/* set the divider to have a margin top and bottom of 3, to add space above and below */}
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>Dataset Preview (Processed Data)</Typography> {/* set the typography to subtitle1, and the gutter bottom, to add space below */}
          {customData.length > 50 && ( // if the length of the customData is greater than 50
            <Typography
              variant="caption" // set the typography to caption, so it is smaller than the default text
              color="text.secondary" // set the colour of the text to the secondary text colour based on the theme
              sx={{ mb: 1, display: 'block' }}> {/* set the margin bottom to 1, and the display to block, to add space below */}
              (Showing first 50 rows to reduce website latency.) {/* set the text of the typography to showing first 50 rows to reduce website latency. */}
            </Typography>
          )}
          
          {(() => {
            const trimmedHeaders = tableHeaders.map(h => h.trim()); // map over the tableHeaders and trim each header
            const trimmedColumnsToDiscard = columnsToDiscard.map(c => c.trim()); // map over the columnsToDiscard and trim each column
            
            const filteredTrimmedHeaders = trimmedHeaders.filter(trimmedHeader => // filter the trimmedHeaders array to remove the columnsToDiscard
              !trimmedColumnsToDiscard.some(discarded => // if the trimmedHeader is in the columnsToDiscard array
                trimmedHeader === discarded || trimmedHeader.startsWith(discarded + '_') // if the trimmedHeader is the same as the discarded column or the trimmedHeader starts with the discarded column
              )
            );
            
            const filteredData = customData.map(row => { // map over the customData and create a new row for each row in the customData
              const newRow = {}; // create a new row object
              filteredTrimmedHeaders.forEach(header => { // map over the filteredTrimmedHeaders and create a new row for each header in the filteredTrimmedHeaders
                // Find the original header (with possible whitespace) that matches the trimmed header
                const originalHeader = tableHeaders.find(h => h.trim() === header); // find the original header that matches the trimmed header
                let value = row[originalHeader]; // set the value to the row[originalHeader]
                if (originalHeader === targetFeature) { // if the original header is the target feature
                  const valueStr = String(value); // set the valueStr to the value
                  if (targetCorrections && targetCorrections.hasOwnProperty(valueStr)) { // if the targetCorrections is not empty and the targetCorrections has the valueStr
                    value = targetCorrections[valueStr]; // set the value to the targetCorrections[valueStr]
                  }
                }
                newRow[originalHeader] = value; // set the newRow[originalHeader] to the value
              });
              return newRow; // return the newRow
            });

            const displayHeaders = filteredData.length > 0 ? Object.keys(filteredData[0]) : []; // get the display headers from the filteredData
            
            return (
              <TableContainer component={Paper} sx={{ 
                maxHeight: 400, // set the max height of the table container to 400
                border: '1px solid', // set the border of the table container to 1px solid, adding a border around the table container
                borderColor: 'divider', // set the border colour of the table container to the divider colour based on the theme
                overflowX: 'auto' // set the overflow x of the table container to auto, so it can scroll if the content is too large
              }}> 
                <Table stickyHeader size="small" aria-label="custom dataset preview table"> {/* set the table to sticky header, small size, and the aria label to "custom dataset preview table" */}
                  <TableHead>
                    <TableRow>
                      {displayHeaders.map((header) => ( // map over the displayHeaders and create a table cell for each header
                        <TableCell 
                          key={header} // set the key of the table cell to the header
                          sx={{ 
                            fontWeight: 'bold', // set the font weight of the table cell to bold
                            backgroundColor: theme.palette.background.paper // set the background colour of the table cell to the background colour based on the theme
                          }} 
                        >
                          {header} {/* set the text of the table cell to the header */}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.slice(0, 50).map((row, rowIndex) => ( // map over the filteredData and create a table row for each row in the filteredData, but only show first 50 rows
                      <TableRow key={`row-${rowIndex}`}> {/* set the key of the table row to the rowIndex */}
                        {displayHeaders.map((header) => ( // map over the displayHeaders and create a table cell for each header
                          <TableCell key={`${rowIndex}-${header}`}> {/* set the key of the table cell to the rowIndex and the header */}
                            {typeof row[header] === 'boolean' ? String(row[header]) : (row[header] ?? '-')} {/* set the text of the table cell to the row[header], if the row[header] is a boolean, convert it to a string, otherwise, set it to '-' */}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          })()}
        </>
      )}
      
      <Dialog
        open={isDatasetInfoOpen} // set the open state of the dialog to the isDatasetInfoOpen state
        onClose={handleCloseDatasetInfo} // set the onClose of the dialog to the handleCloseDatasetInfo function, which closes the dialog
        aria-labelledby="dataset-info-dialog-title" // set the aria labelled by of the dialog to "dataset-info-dialog-title", this is used to identify the dialog
        aria-describedby="dataset-info-dialog-description" // set the aria described by of the dialog to "dataset-info-dialog-description", this is used to identify the dialog
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the paper props of the dialog to the background colour based on the theme
      >
        <DialogTitle id="dataset-info-dialog-title" sx={{ color: 'text.primary' }}>Dataset Selection</DialogTitle> {/* set the title of the dialog to "Dataset Selection" */}
        <DialogContent>
          <DialogContentText id="dataset-info-dialog-description" sx={{ color: 'text.secondary' }}> {/* set the content text of the dialog to the "dataset-info-dialog-description", and the color to the secondary text color based on the theme */}
            Choose either 'Iris' or 'Custom Dataset'.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'text.secondary' }}>
            • <strong>Iris:</strong> Uses the built-in Iris dataset, a classic dataset often used for learning machine learning concepts.
          </DialogContentText>
          <DialogContentText sx={{ mt: 1, color: 'text.secondary' }}>
            • <strong>Custom:</strong> Allows you to upload your own CSV file. Datasets from Kaggle are often suitable.
            <Link href="https://www.kaggle.com/datasets" target="_blank" rel="noopener noreferrer" sx={{ ml: 0.5 }}>Click here</Link> to find datasets.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDatasetInfo}>Close</Button> {/* set the button to close the dialog */}
        </DialogActions>
      </Dialog>

      <Dialog
        open={isTargetInfoOpen} // set the open state of the dialog to the isTargetInfoOpen state
        onClose={handleCloseTargetInfo} // set the onClose of the dialog to the handleCloseTargetInfo function, which closes the dialog
        aria-labelledby="target-info-dialog-title" // set the aria labelled by of the dialog to "target-info-dialog-title", this is used to identify the dialog
        aria-describedby="target-info-dialog-description" // set the aria described by of the dialog to "target-info-dialog-description", this is used to identify the dialog
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the paper props of the dialog to the background colour based on the theme
      >
        <DialogTitle id="target-info-dialog-title" sx={{ color: 'text.primary' }}>Target Feature Information</DialogTitle> {/* set the title of the dialog to "Target Feature Information" */}
        <DialogContent>
          <DialogContentText id="target-info-dialog-description" sx={{ color: 'text.secondary' }}> {/* set the content text of the dialog to the "target-info-dialog-description", and the color to the secondary text color based on the theme */}
            The Target Feature is the specific column in your dataset that you want the machine learning model to learn how to predict.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTargetInfo}>Close</Button> {/* set the button to close the dialog */}
        </DialogActions>
      </Dialog>

    </Paper>
  );
};

export default DatasetSelection; // export the DatasetSelection component as the default export, so it can be used in other files
