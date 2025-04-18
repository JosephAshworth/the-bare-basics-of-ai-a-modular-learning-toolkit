import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import CompleteModuleButton from './CompleteModuleButton';

/**
 * A reusable component for the "Ready to track your progress" section
 * that appears at the end of module pages.
 * 
 * @param {Object} props - Component props
 * @param {string} props.moduleId - The ID of the module (e.g., "machine-learning")
 * @param {string} props.moduleName - The display name of the module (e.g., "Machine Learning")
 * @param {Object} [props.sx] - Additional styles to apply to the container Box
 * @returns {JSX.Element} The ProgressTracker component
 */
const ProgressTracker = ({ moduleId, moduleName, sx = {} }) => {
  return (
    <Box sx={{ 
      mt: 8, 
      pt: 4,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      ...sx
    }}>
      <Divider sx={{ width: '100%', mb: 4 }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Ready to track your progress?
      </Typography>
      <CompleteModuleButton 
        moduleId={moduleId} 
        moduleName={moduleName} 
      />
    </Box>
  );
};

export default ProgressTracker; 