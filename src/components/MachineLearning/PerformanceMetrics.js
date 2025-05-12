import
  React, // import React
  { 
    useState // import useState, this is used to manage state in functional components
  }
from 'react';

import {
  Box, // import Box from MUI
  Typography, // import Typography from MUI
  Paper, // import Paper from MUI
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
  Alert // import Alert from MUI
} from '@mui/material';

import { Info as InfoIcon } from '@mui/icons-material'; // import InfoIcon from MUI

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on the theme

const MetricTooltip = ({ title, children }) => {
  const [open, setOpen] = useState(false); // state variable for open, this is used to manage the open state of the dialog

  const handleOpen = () => {
    setOpen(true); // set the open state of the dialog to true
  };
  
  const handleClose = () => {
    setOpen(false); // set the open state of the dialog to false
  };

  const formattedDescription = title.split('\n').map((line, index) => ( // format the description of the metric, with a line break after each line
    <React.Fragment key={index}> {/* create a fragment for the line */}
      {line} {/* display the line */}
      <br /> {/* add a line break */}
    </React.Fragment>
  ));

  return (
    <>
      <Box 
        sx={{
          display: 'flex', // display the box as a flex container
          alignItems: 'center', // align the items of the box to the centre
          gap: 1, // add a gap of 1 unit between the items of the box
          cursor: 'pointer' // change the cursor of the box to a pointer when hovered over
        }}
        onClick={handleOpen} // when the box is clicked, open the dialog
      >
        <IconButton size="small" sx={{ opacity: 0.7 }}>
          <InfoIcon fontSize="small" /> {/* display the info icon */}
        </IconButton>
        {children} {/* display the children, which is the metric name */}
      </Box>

      <Dialog
        open={open} // open the dialog
        onClose={handleClose} // close the dialog when the close button is clicked
        aria-labelledby="metric-dialog-title" // label the dialog with the title
        aria-describedby="metric-dialog-description" // describe the dialog with the description
        fullWidth // make the dialog full width
        maxWidth="sm" // set the maximum width of the dialog to the 'small' breakpoint
      >
        <DialogTitle id="metric-dialog-title"> {/* label the dialog with the title */}
          {children} Explained {/* display the children, which is the metric name, followed by 'Explained' */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="metric-dialog-description" component="div"> {/* describe the dialog with the description */}
            {formattedDescription} {/* display the formatted description */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus> 
            Close {/* close the dialog when the close button is clicked */}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const PerformanceMetrics = ({ metrics, metricDescriptions, formatMetric }) => { // define the PerformanceMetrics component, this is used to display the performance metrics
  const theme = useTheme(); // for getting the MUI theme object

  if (!metrics || !metrics.train || !metrics.test) { // if the metrics are not available
    return null; // return null
  }

  return (
    <Paper sx={{ p: 3 }}> {/* display the paper with a padding of 3 units */}
      <Typography variant="h5" gutterBottom>Performance Metrics</Typography> {/* display the title of the performance metrics */}
      
      <TableContainer> {/* display the table container */}
        <Table> {/* display the table */}
          <TableHead> {/* display the table head */}
            <TableRow> {/* display the table row */}
              <TableCell sx={{ width: '40%', borderBottom: 'none' }}> {/* display the table cell with a width of 40%, and no border */}
                <Typography variant="h6">Training Set Metrics</Typography> {/* display the title of the training set metrics */}
              </TableCell>
              <TableCell sx={{ width: '10%', borderBottom: 'none' }}></TableCell> {/* display the table cell with a width of 10%, and no border */}
              <TableCell sx={{ width: '40%', borderBottom: 'none' }}> {/* display the table cell with a width of 40%, and no border */}
                <Typography variant="h6">Test Set Metrics</Typography> {/* display the title of the test set metrics */}
              </TableCell>
              <TableCell sx={{ width: '10%', borderBottom: 'none' }}></TableCell> {/* display the table cell with a width of 10%, and no border */}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.accuracy}> {/* display the metric tooltip with the accuracy metric */}
                  Accuracy
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>{formatMetric(metrics.train.accuracy)}</TableCell> {/* display the table cell with a border right of 1px solid, and the accuracy metric */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* display the box with a flex container, aligned items to the centre, and a gap of 1 unit */}
                  <Box sx={{ width: 28, height: 28 }}></Box> {/* display the box with a width of 28 units, and a height of 28 units */}
                  Accuracy {/* display the accuracy metric */}
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.accuracy)}</TableCell> {/* display the table cell with the test set accuracy metric */}
            </TableRow>
            
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.precision}> {/* display the metric tooltip with the precision metric */}
                  Precision
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>{formatMetric(metrics.train.precision)}</TableCell> {/* display the table cell with a border right of 1px solid, and the precision metric */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* display the box with a flex container, aligned items to the centre, and a gap of 1 unit */}
                  <Box sx={{ width: 28, height: 28 }}></Box> {/* display the box with a width of 28 units, and a height of 28 units */}
                  Precision {/* display the precision metric */}
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.precision)}</TableCell> {/* display the table cell with the test set precision metric */}
            </TableRow>
            
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.recall}> {/* display the metric tooltip with the recall metric */}
                  Recall
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>{formatMetric(metrics.train.recall)}</TableCell> {/* display the table cell with a border right of 1px solid, and the recall metric */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* display the box with a flex container, aligned items to the centre, and a gap of 1 unit */}
                  <Box sx={{ width: 28, height: 28 }}></Box> {/* display the box with a width of 28 units, and a height of 28 units */}
                  Recall
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.recall)}</TableCell> {/* display the table cell with the test set recall metric */}
            </TableRow>
            
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.f1}> {/* display the metric tooltip with the f1 score metric */}
                  F1 Score
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>{formatMetric(metrics.train.f1)}</TableCell> {/* display the table cell with a border right of 1px solid, and the f1 score metric */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* display the box with a flex container, aligned items to the centre, and a gap of 1 unit */}
                  <Box sx={{ width: 28, height: 28 }}></Box> {/* display the box with a width of 28 units, and a height of 28 units */}
                  F1 Score
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.f1)}</TableCell> {/* display the table cell with the test set f1 score metric */}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: theme.palette.divider }}> {/* display the box with a margin top of 3 units, a padding top of 2 units, a border top of 1px solid, and the border colour is the divider colour from the theme */}
        <Alert severity="info" icon={<InfoIcon fontSize="inherit" />}> {/* display the alert with a severity of info, and the info icon */}
          <Typography variant="subtitle1" component="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}> {/* display the typography with a variant of subtitle1, a component of h6, and a font weight of bold, and a margin bottom of 0.5 unit */}
            Understanding Overfitting
          </Typography>
          <Typography variant="body2"> {/* display the overfitting explanation */}
            If the training set metrics are higher than the test set metrics, 
            this might indicate overfitting. This means the model has learned the training data well 
            (including noise or specific patterns) but struggles to generalise to new, unseen data (the test set). 
            A generalised model performs similarly on both sets.
          </Typography>
        </Alert>
      </Box>
    </Paper>
  );
};

export default PerformanceMetrics; // export the PerformanceMetrics component, so it can be used in other components
