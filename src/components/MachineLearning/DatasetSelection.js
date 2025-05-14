// the card that allows the user to select the dataset and target feature

import { useState, useEffect } from 'react';

// material ui components
import { 
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Link
} from '@mui/material';

import {
  PlayArrow as PlayArrowIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';

const DatasetSelection = ({ 
  dataset,
  setDataset,
  customData,
  features,
  targetFeature,
  handleTargetChange,
  targetCorrections,
  setTargetCorrections,
  handleFileUpload,
  columnsToDiscard = [],
  setColumnsToDiscard = () => {}, // set the columns to discard to an empty array initially
  targetWarning,
  setTargetWarning
}) => {
  const theme = useTheme();

  const [isDatasetInfoOpen, setDatasetInfoOpen] = useState(false);
  const [isTargetInfoOpen, setTargetInfoOpen] = useState(false);

  const handleOpenDatasetInfo = () => setDatasetInfoOpen(true);
  const handleCloseDatasetInfo = () => setDatasetInfoOpen(false);

  const handleOpenTargetInfo = () => setTargetInfoOpen(true);
  const handleCloseTargetInfo = () => setTargetInfoOpen(false);

  // set a target warning if the selected target feature has more than 5 unique values
  useEffect(() => {
    if (dataset === 'custom' && customData && customData.length > 0 && targetFeature) {
      try {
        const uniqueValues = new Set(customData.map(row => row[targetFeature]));
        const uniqueCount = uniqueValues.size;
        
        if (uniqueCount > 5) {
          setTargetWarning(`Target feature "${targetFeature}" has ${uniqueCount} unique values. For classification tasks, it should have 5 or fewer unique values.`);
        } else {
          setTargetWarning('');
        }
      } catch (error) {
        console.error("Error calculating unique values:", error);
        setTargetWarning('Could not verify unique values for the target feature.');
      }
    } else {
      setTargetWarning('');
    }
  }, [dataset, customData, targetFeature, setTargetWarning]);

  // get the table headers from the custom data, if one is uploaded
  const tableHeaders = customData && customData.length > 0 ? Object.keys(customData[0]) : [];

  return (
    <Paper sx={{ 
      p: 3,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '16px',
      backgroundColor: theme.palette.background.paper
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1, // add a gap between the icon and the text
          color: theme.palette.primary.main
        }}>
          <PlayArrowIcon /> Dataset Selection
        </Typography>
      </Box>

      <Box
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 2
        }}>
        <IconButton 
          size="small"
          onClick={handleOpenDatasetInfo}
          sx={{ color: theme.palette.text.secondary }}
          aria-label="Dataset information"
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
        <FormControl fullWidth>
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
      </Box>

      {/* if the dataset is custom, display the file upload component */}
      {dataset === 'custom' && handleFileUpload}

      {/* if the dataset is custom, display the supported format and CSV tips */}
      {dataset === 'custom' && (
          <Box sx={{ mb: 3 }}>
             <Typography
             variant="caption"
             color="text.secondary"
             sx={{ mt: 1, display: 'block' }}>
               Supported format: .csv files only
             </Typography>
             
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

      {/* if the dataset is custom and there are no features, display an alert */}
      {dataset === 'custom' && features && features.length === 0 && customData === null && (
        <Alert severity="info" sx={{ my: 2 }}>
          Please upload a dataset file to continue
        </Alert>
      )}

      {/* if the dataset is custom and there are features, display the custom dataset options */}
      {dataset === 'custom' && features && features.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>Custom Dataset Options</Typography>
          
          <Box
            sx={{ 
              display: 'flex',
              flexDirection: 'row', // arrange the target feature info and selection in a horizontal line
              gap: 0.5,
              mb: 1
            }}>
            <IconButton 
              size="small"
              onClick={handleOpenTargetInfo}
              sx={{ color: theme.palette.text.secondary }}
              aria-label="Target feature information"
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
            <FormControl fullWidth>
              <InputLabel>Target Feature</InputLabel>
              <Select
                value={targetFeature}
                onChange={handleTargetChange}
                label="Target Feature"
                disabled={!features || features.length === 0} // disable the target feature selection if there are no features
              >
                {features.map(feature => (
                  <MenuItem key={feature} value={feature}>{feature}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* if the dataset is custom and there is a target feature, display the target feature options */}
          {Array.isArray(customData) && targetFeature && customData.length > 0 && (() => {
            const rawValues = customData
              .map(row => row?.[targetFeature])
              .filter(val => val !== null && val !== undefined);

            const uniqueTargetValues = [...new Set(rawValues.map(String))]; // get the unique target values

            // if the target feature has more than 5 unique values, display the target feature options
            return uniqueTargetValues.length > 0 && uniqueTargetValues.length <= 5 ? (
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Correct Target Values
                </Typography>

                {/* map over the unique target values and display the target feature options */}
                {uniqueTargetValues.map((originalValue, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {originalValue}
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel>Correct to</InputLabel>
                      <Select
                        // display the corrected target value if available, otherwise display the original value
                        value={targetCorrections?.[`${originalValue}`] ?? originalValue}
                        label="Correct to"

                        // update the target corrections when the user selects a corrected target value
                        onChange={e => { 
                          setTargetCorrections((prev) => ({
                            ...prev,
                            [`${originalValue}`]: e.target.value
                          }));
                        }}
                      >
                        {/* map over the unique target values and display them as menu items */}
                        {uniqueTargetValues.map((val, idx) => (
                          <MenuItem key={idx} value={val}>{val}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                ))}
              </Box>
            ) : null;
          })()}

          {targetWarning && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {targetWarning}
            </Alert>
          )}

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Discard Columns (Optional)</Typography>
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            sx={{ mb: 1 }}>
            Checked columns will be removed from the dataset *before* training feature selection.
          </Typography>
          <FormGroup
            sx={{ 
              mb: 2,
              maxHeight: '150px',
              overflowY: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1
            }}>
            {features.map(feature => (
              <FormControlLabel 
                // add a unique key to the form control label to
                // this is to identify which items have changed, are added, or are removed
                key={`discard-${feature}`}
                control={<Checkbox 
                  checked={columnsToDiscard.includes(feature)} // check if the feature is in the columns to discard
                  onChange={() => {
                    if (feature === targetFeature) return; // if the feature is the target feature, do not allow it to be discarded
                    setColumnsToDiscard(prev =>
                      prev.includes(feature)
                        ? prev.filter(f => f !== feature)
                        : [...prev, feature]
                    );
                  }}
                  disabled={feature === targetFeature} // disable the target feature from being discarded
                />}
                label={feature}
              />
            ))}
          </FormGroup>
        </>
      )}

      {/* if the dataset is custom and there is custom data, display the dataset preview */}
      {dataset === 'custom' && customData && customData.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>Dataset Preview (Processed Data)</Typography>
          {customData.length > 50 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: 'block' }}>
              (Showing first 50 rows to reduce website latency.)
            </Typography>
          )}
          

          {(() => {
          
            const trimmedHeaders = tableHeaders.map(h => h.trim()); // remove any leading or trailing whitespace from each header in the tableHeaders array
            const trimmedColumnsToDiscard = columnsToDiscard.map(c => c.trim()); // remove any leading or trailing whitespace from each column name in the columnsToDiscard array
            
            const filteredTrimmedHeaders = trimmedHeaders.filter(trimmedHeader =>
              // filter out headers that match any of the columns to discard
              !trimmedColumnsToDiscard.some(discarded =>
                // exclude headers that are exactly the same as a discarded column or start with a discarded column followed by an underscore
                trimmedHeader === discarded || trimmedHeader.startsWith(discarded + '_')
              )
            );
            
            // map over the custom data and filter out the headers that match any of the columns to discard

            const filteredData = customData.map(row => {
              const newRow = {}; // create a new object to store the filtered row data
              filteredTrimmedHeaders.forEach(header => {
                // find the original header in the tableHeaders array that matches the trimmed header
                const originalHeader = tableHeaders.find(h => h.trim() === header); // get the value from the current row using the original header
                let value = row[originalHeader]; // get the value from the current row using the original header
                if (originalHeader === targetFeature) { // check if the current header is the target feature
                  const valueStr = String(value); // convert the value to a string for comparison

                  // if there is a correction for this value, use the corrected value
                  if (targetCorrections && targetCorrections.hasOwnProperty(valueStr)) {
                    value = targetCorrections[valueStr];
                  }
                }
                newRow[originalHeader] = value; // add the value to the new row object under the original header
              });
              return newRow; 
            });

            // get the headers for display from the first row of filtered data if available
            const displayHeaders = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];
            
            return (
              <TableContainer component={Paper} sx={{ 
                maxHeight: 400,
                border: '1px solid',
                borderColor: 'divider',
                overflowX: 'auto' // allow the table to scroll horizontally
              }}> 
                <Table stickyHeader size="small" aria-label="custom dataset preview table">
                  <TableHead>
                    <TableRow>
                      {/* map over the display headers and display them as table cells */}
                      {displayHeaders.map((header) => (
                        <TableCell 
                          key={header}
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.background.paper
                          }} 
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* map over the first 50 rows of filtered data and display the data as table rows */}
                    {filteredData.slice(0, 50).map((row, rowIndex) => (
                      <TableRow key={`row-${rowIndex}`}>
                        {displayHeaders.map((header) => (
                          <TableCell key={`${rowIndex}-${header}`}>
                            {typeof row[header] === 'boolean' ? String(row[header]) : (row[header] ?? '-')}
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
        open={isDatasetInfoOpen}
        onClose={handleCloseDatasetInfo}
        aria-labelledby="dataset-info-dialog-title"
        aria-describedby="dataset-info-dialog-description"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="dataset-info-dialog-title" sx={{ color: 'text.primary' }}>Dataset Selection</DialogTitle>
        <DialogContent>
          <DialogContentText id="dataset-info-dialog-description" sx={{ color: 'text.secondary' }}>
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
          <Button onClick={handleCloseDatasetInfo}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isTargetInfoOpen}
        onClose={handleCloseTargetInfo}
        aria-labelledby="target-info-dialog-title"
        aria-describedby="target-info-dialog-description"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="target-info-dialog-title" sx={{ color: 'text.primary' }}>Target Feature Information</DialogTitle>
        <DialogContent>
          <DialogContentText id="target-info-dialog-description" sx={{ color: 'text.secondary' }}>
            The Target Feature is the specific column in your dataset that you want the machine learning model to learn how to predict.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTargetInfo}>Close</Button>
        </DialogActions>
      </Dialog>

    </Paper>
  );
};

export default DatasetSelection;
