import React, { useState } from 'react';

// material ui components
import {
  Box,
  Typography,
  Paper,
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
  Alert
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Function to format a metric value as a percentage with 2 decimal places
const formatMetric = (value) => {
  if (value === undefined || value === null) {
    console.log('Invalid metric value:', value);
    return 'N/A';
  }
  return (value * 100).toFixed(2) + '%';
};

// Object to store the descriptions of the metrics
const metricDescriptions = {
  accuracy: "Question: How often is my model correct overall?\n\nAccuracy measures how often the model gets it right. If the model predicts 90 out of 100 samples correctly, the accuracy is 90%. Note that accuracy can be misleading if the classes are imbalanced.",
  precision: "Question: When my model predicts a positive result, how often is it actually correct?\n\nPrecision tells you when the model says 'yes', how often it's actually right. High precision means fewer false alarms.",
  recall: "Question: How good is my model at finding all the positive cases?\n\nRecall measures how well the model catches all the positive cases. High recall means it doesn't miss many.",
  f1: "Question: How well does my model balance finding positives and avoiding false alarms?\n\nF1 Score combines precision and recall into a single number. It's useful when you need the model to be good at both not giving false alarms AND not missing positive cases."
};

const MetricTooltip = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const formattedDescription = title.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <>
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer'
        }}
        onClick={handleOpen}
      >
        <IconButton size="small" sx={{ opacity: 0.7 }}>
          <InfoIcon fontSize="small" />
        </IconButton>
        {children}
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="metric-dialog-title"
        aria-describedby="metric-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="metric-dialog-title">
          {children} Explained
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="metric-dialog-description" component="div">
            {formattedDescription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const PerformanceMetrics = ({ metrics }) => {
  const theme = useTheme();

  if (!metrics || !metrics.train || !metrics.test) {
    return null;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Performance Metrics</Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '40%', borderBottom: 'none' }}>
                <Typography variant="h6">Training Set Metrics</Typography>
              </TableCell>
              <TableCell sx={{ width: '10%', borderBottom: 'none' }}></TableCell>
              <TableCell sx={{ width: '40%', borderBottom: 'none' }}>
                <Typography variant="h6">Test Set Metrics</Typography>
              </TableCell>
              <TableCell sx={{ width: '10%', borderBottom: 'none' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.accuracy}>
                  Accuracy
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>{formatMetric(metrics.train.accuracy)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28 }}></Box>
                  Accuracy
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.accuracy)}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.precision}>
                  Precision
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>{formatMetric(metrics.train.precision)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28 }}></Box>
                  Precision
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.precision)}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.recall}>
                  Recall
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>{formatMetric(metrics.train.recall)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28 }}></Box>
                  Recall
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.recall)}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.f1}>
                  F1 Score
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>{formatMetric(metrics.train.f1)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28 }}></Box>
                  F1 Score
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.f1)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: theme.palette.divider }}>
        <Alert severity="info" icon={<InfoIcon fontSize="inherit" />}>
          <Typography variant="subtitle1" component="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Understanding Overfitting
          </Typography>
          <Typography variant="body2">
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

export default PerformanceMetrics;