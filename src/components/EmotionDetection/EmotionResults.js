// the results section of the emotion detection page

// material ui components
import {
  Box,
  Card,
  Typography,
  LinearProgress,
  CircularProgress,
  Divider
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

// get the colours for the emotions from the utils file
import { getEmotionColour } from './EmotionDetectionUtilities';

const EmotionResults = ({ 
  loading,
  emotions,
  emptyIcon,
  emptyMessage,
  loadingMessage = 'Analysing emotions...',
  technologyDescription = '',
}) => {
  const theme = useTheme();

  const getFinalEmotionColour = (emotion) => {
    const baseColour = getEmotionColour(emotion);
    if (theme.palette.mode === 'dark') {
      switch(emotion.toLowerCase()) {
        case 'neutral': return '#B0B0B0'; // Use a specific grey colour for 'neutral' in dark mode
        default: return baseColour;
      }
    }
    return baseColour;
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3, color: theme.palette.primary.main }} />
          <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
            {loadingMessage}
          </Typography>
        </Box>
      ) : emotions.length > 0 ? (
        <Box sx={{ flex: 1 }}>
          <Card 
            elevation={theme.palette.mode === 'dark' ? 2 : 0}
            sx={{ 
              bgcolor: theme.palette.background.default,
              mb: 3,
              p: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography
              variant="body1"
              sx={{ 
                mb: 1,
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              Primary emotion detected:
              <Typography 
                component="span"
                sx={{ 
                  ml: 1, // add a left margin to the emotion text
                  fontWeight: 700,
                  color: getFinalEmotionColour(emotions[0].emotion) // Colour based on emotion
                }}
              >
                {emotions[0].emotion.toUpperCase()}
              </Typography>
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                color: theme.palette.text.secondary
              }}
            >
              Confidence: {(emotions[0].probability * 100).toFixed(2)}% 
            </Typography>
          </Card>
          
          <Typography
            variant="subtitle1"
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
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
                      color: getFinalEmotionColour(item.emotion)
                    }}
                  >
                    {item.emotion}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                    {(item.probability * 100).toFixed(2)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" // sets the progress bar to a fixed value, indicating a specific progress level
                  value={item.probability * 100}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    bgcolor: theme.palette.action.disabledBackground,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getFinalEmotionColour(item.emotion)
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
          
          <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />
          
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
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
            bgcolor: theme.palette.background.default,
            p: 4,
            borderRadius: 2
          }}
        >
          {emptyIcon}
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1, textAlign: 'center' }}>
            No emotions detected yet
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default EmotionResults;