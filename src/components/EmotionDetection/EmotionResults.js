import React from 'react';
import {
  Box,
  Card,
  Typography,
  LinearProgress,
  CircularProgress,
  Divider
} from '@mui/material';
import { getEmotionColor } from './utils';

// Reusable component for displaying emotion analysis results
const EmotionResults = ({ 
  loading, 
  emotions, 
  emptyIcon, 
  emptyMessage, 
  loadingMessage = 'Analyzing emotions...',
  technologyDescription = 'Analysis powered by AI',
  isDarkMode,
  themeColors
}) => {
  // Use theme colors or fallback to default colors
  const colors = themeColors || {
    primary: {
      main: isDarkMode ? '#66ccff' : '#1976d2',
      light: isDarkMode ? 'rgba(102, 204, 255, 0.2)' : '#e3f2fd'
    },
    background: {
      paper: isDarkMode ? '#1e1e2d' : '#ffffff',
      card: isDarkMode ? '#252536' : '#f8faff',
      empty: isDarkMode ? 'rgba(18, 18, 30, 0.4)' : '#f5f8ff'
    },
    text: {
      primary: isDarkMode ? '#ffffff' : '#333333',
      secondary: isDarkMode ? '#c0c0c0' : '#666666'
    },
    divider: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)'
  };

  // Function to adjust emotion colors for dark mode
  const getThemeAwareEmotionColor = (emotion) => {
    const baseColor = getEmotionColor(emotion);
    
    // For dark mode, make some colors brighter
    if (isDarkMode) {
      switch(emotion.toLowerCase()) {
        case 'neutral':
          return '#a0a0a0';
        case 'sad':
          return '#78a4ff';
        case 'fear':
          return '#c576ff';
        case 'disgust':
          return '#7be0a1';
        default:
          return baseColor;
      }
    }
    
    return baseColor;
  };
  
  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <CircularProgress size={60} sx={{ mb: 3, color: colors.primary.main }} />
          <Typography variant="body1" sx={{ color: colors.text.primary }}>
            {loadingMessage}
          </Typography>
        </Box>
      ) : emotions.length > 0 ? (
        <Box sx={{ flex: 1 }}>
          <Card 
            elevation={isDarkMode ? 2 : 0} 
            sx={{ 
              bgcolor: colors.background.card, 
              mb: 3,
              p: 2,
              border: `1px solid ${isDarkMode ? 'rgba(102, 204, 255, 0.2)' : '#e3f2fd'}`,
              transition: 'all 0.3s ease'
            }}
          >
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: colors.text.primary }}>
              Primary emotion detected: 
              <Typography 
                component="span" 
                sx={{ 
                  ml: 1, 
                  fontWeight: 700, 
                  color: getThemeAwareEmotionColor(emotions[0].emotion)
                }}
              >
                {emotions[0].emotion.toUpperCase()}
              </Typography>
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Confidence: {(emotions[0].probability * 100).toFixed(2)}%
            </Typography>
          </Card>
          
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
            All detected emotions:
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            {emotions.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: getThemeAwareEmotionColor(item.emotion) 
                    }}
                  >
                    {item.emotion}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.primary }}>
                    {(item.probability * 100).toFixed(2)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={item.probability * 100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getThemeAwareEmotionColor(item.emotion)
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
          
          <Divider sx={{ mb: 3, borderColor: colors.divider }} />
          
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            {technologyDescription}
          </Typography>
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1,
            bgcolor: colors.background.empty,
            p: 4,
            borderRadius: 2,
            transition: 'all 0.3s ease'
          }}
        >
          {emptyIcon}
          <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1, textAlign: 'center' }}>
            No emotions detected yet
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center' }}>
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default EmotionResults; 