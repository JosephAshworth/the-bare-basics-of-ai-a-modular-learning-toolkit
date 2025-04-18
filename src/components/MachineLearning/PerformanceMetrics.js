import React, { useState } from 'react';
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
  Tooltip
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

// MetricTooltip component extracted from MachineLearningPage
const MetricTooltip = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Tooltip 
      title={title}
      placement="left"
      arrow
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      disableFocusListener={false}
      disableHoverListener={false}
      disableTouchListener={false}
      enterTouchDelay={0}
      sx={{ maxWidth: 350 }}
    >
      <Box 
        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
        onClick={handleToggle}
      >
        <IconButton size="small" sx={{ opacity: 0.7 }}>
          <InfoIcon fontSize="small" />
        </IconButton>
        {children}
      </Box>
    </Tooltip>
  );
};

const PerformanceMetrics = ({ metrics, metricDescriptions, formatMetric }) => {
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
            {/* Accuracy */}
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.accuracy}>
                  Accuracy
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{formatMetric(metrics.train.accuracy)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28 }}></Box>
                  Accuracy
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.accuracy)}</TableCell>
            </TableRow>
            
            {/* Precision */}
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.precision}>
                  Precision
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{formatMetric(metrics.train.precision)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28 }}></Box>
                  Precision
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.precision)}</TableCell>
            </TableRow>
            
            {/* Recall */}
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.recall}>
                  Recall
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{formatMetric(metrics.train.recall)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28 }}></Box>
                  Recall
                </Box>
              </TableCell>
              <TableCell>{formatMetric(metrics.test.recall)}</TableCell>
            </TableRow>
            
            {/* F1 Score */}
            <TableRow>
              <TableCell>
                <MetricTooltip title={metricDescriptions.f1}>
                  F1 Score
                </MetricTooltip>
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{formatMetric(metrics.train.f1)}</TableCell>
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
    </Paper>
  );
};

export default PerformanceMetrics; 