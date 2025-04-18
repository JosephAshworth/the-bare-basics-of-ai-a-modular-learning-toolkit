import React from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material';
import DecisionTreeExplanation from './DecisionTreeExplanation';

const DecisionTreeVisualization = ({ visualization, loading }) => {
  return (
    <Box sx={{ mt: 3 }}>
      {visualization ? (
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Box sx={{ 
              overflow: 'auto',
              maxWidth: '100%',
              '& img': {
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                maxHeight: '70vh'
              },
              mb: 3
            }}>
              <img 
                src={`data:image/png;base64,${visualization}`} 
                alt="Decision Tree Visualization"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <DecisionTreeExplanation />
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          mt: 3, 
          color: 'text.secondary',
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography>
              No decision tree visualization available. 
              Please train the model to see the visualization.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DecisionTreeVisualization; 