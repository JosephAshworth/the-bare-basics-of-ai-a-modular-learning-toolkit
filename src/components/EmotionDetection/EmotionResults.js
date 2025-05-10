import {
  Box, // import the Box component from MUI
  Card, // import the Card component from MUI
  Typography, // import the Typography component from MUI
  LinearProgress, // import the LinearProgress component from MUI
  CircularProgress, // import the CircularProgress component from MUI
  Divider // import the Divider component from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import { getEmotionColour } from './utils'; // import the getEmotionColour function from the utils file, this is used to get the colour of the emotions


const EmotionResults = ({ 
  loading, // for checking if the loading state is true
  emotions, // for the emotions detected
  emptyIcon, // for the empty icon
  emptyMessage, // for the empty message
  loadingMessage = 'Analysing emotions...', // for the loading message
  technologyDescription = '', // for the technology description
}) => {
  const theme = useTheme(); // for getting the MUI theme object

  const getFinalEmotionColour = (emotion) => { // for getting the final emotion colour
    const baseColour = getEmotionColour(emotion); // for getting the base colour of the emotion
    if (theme.palette.mode === 'dark') { // for checking if the theme is dark mode
      switch(emotion.toLowerCase()) { // for switching the emotion
        case 'neutral': return '#B0B0B0'; // for returning the neutral colour
        default: return baseColour; // for returning the base colour
      }
    }
    return baseColour; // for returning the base colour
  };

  return (
    <>
      {loading ? ( // for checking if the loading state is true
        <Box
          sx={{ 
            display: 'flex', // for setting the display of the box to flex
            flexDirection: 'column', // for setting the flex direction of the box to column
            alignItems: 'center', // for setting the align items of the box to centre
            justifyContent: 'center', // for setting the justify content of the box to centre
            flex: 1 // for setting the flex of the box to 1
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3, color: theme.palette.primary.main }} /> {/* for setting the size of the circular progress to 60 and the colour to the primary colour of the theme */}
          <Typography variant="body1" sx={{ color: theme.palette.text.primary }}> {/* for setting the variant of the typography to body1 and the colour to the primary colour of the theme */}
            {loadingMessage} {/* for setting the text of the typography to the loading message */}
          </Typography>
        </Box>
      ) : emotions.length > 0 ? ( // if the loading state is false and there are emotions detected
        <Box sx={{ flex: 1 }}> {/* for setting the flex of the box to 1, this is used to ensure the box takes up the full height of the container */}
          <Card 
            elevation={theme.palette.mode === 'dark' ? 2 : 0} // for setting the elevation of the card to 2 on dark mode and 0 on light mode
            sx={{ 
              bgcolor: theme.palette.background.default, // for setting the background colour of the card to the default colour of the theme
              mb: 3, // for setting the margin bottom of the card to 3, this is used to add space between the card and the next element
              p: 2, // for setting the padding of the card to 2, this is used to add space between the card and the content inside the card
              border: `1px solid ${theme.palette.divider}` // for setting the border of the card to the divider colour of the theme
            }}
          >
            <Typography
              variant="body1" // for setting the variant of the typography to body1
              sx={{ 
                mb: 1, // for setting the margin bottom of the typography to 1, this is used to add space between the typography and the next element
                fontWeight: 500, // for setting the font weight of the typography to 500
                color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
              }}
            >
              Primary emotion detected: {/* for setting the text of the typography to Primary emotion detected: */}
              <Typography 
                component="span" // for setting the component of the typography to span, this is used to ensure the typography is inline with the text
                sx={{ 
                  ml: 1, // for setting the margin left of the typography to 1, this is used to add space between the typography and the next element
                  fontWeight: 700, // for setting the font weight of the typography to 700
                  color: getFinalEmotionColour(emotions[0].emotion) // for setting the colour of the typography to the colour of the primary emotion
                }}
              >
                {emotions[0].emotion.toUpperCase()} {/* for setting the text of the typography to the primary emotion detected */}
              </Typography>
            </Typography>
            <Typography
              variant="body2" // for setting the variant of the typography to body2
              sx={{ 
                color: theme.palette.text.secondary // for setting the colour of the typography to the secondary colour of the theme
              }}
            >
              Confidence: {(emotions[0].probability * 100).toFixed(2)}% {/* for setting the text of the typography to Confidence: and the confidence of the primary emotion detected, to 2 decimal places */}
            </Typography>
          </Card>
          
          <Typography
            variant="subtitle1" // for setting the variant of the typography to subtitle1
            sx={{ 
              mb: 2, // for setting the margin bottom of the typography to 2, this is used to add space between the typography and the next element
              fontWeight: 600, // for setting the font weight of the typography to 600
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            All detected emotions: {/* for setting the text of the typography to All detected emotions: */}
          </Typography>
          

          <Box sx={{ mb: 3 }}> {/* for setting the margin bottom of the box to 3, this is used to add space between the box and the next element */}
            {emotions.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}> {/* for setting the margin bottom of the box to 2, this is used to add space between the box and the next element */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}> {/* for setting the display of the box to flex, the justify content of the box to space between, and the margin bottom of the box to 0.5, this is used to add space between the box and the next element */}
                  <Typography 
                    variant="body2" // for setting the variant of the typography to body2, for a body style
                    sx={{ 
                      fontWeight: 500, // for setting the font weight of the typography to 500
                      color: getFinalEmotionColour(item.emotion) // for setting the colour of the typography to the colour of the emotion
                    }}
                  >
                    {item.emotion} {/* for setting the text of the typography to the emotion */}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.primary }}> {/* for setting the colour of the typography to the primary colour of the theme */}
                    {(item.probability * 100).toFixed(2)}% {/* for setting the text of the typography to the probability of the emotion, to 2 decimal places */}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" // for setting the variant of the linear progress to determinate, this is used to display a progress bar
                  value={item.probability * 100} // for setting the value of the linear progress to the probability of the emotion, to 100
                  sx={{ 
                    height: 8, // for setting the height of the linear progress to 8, this is used to set the height of the progress bar
                    borderRadius: 4, // for setting the border radius of the linear progress to 4, this is used to round the corners of the progress bar
                    bgcolor: theme.palette.action.disabledBackground, // for setting the background colour of the linear progress to the disabled background colour of the theme
                    '& .MuiLinearProgress-bar': { // for setting the background colour of the bar of the linear progress to the colour of the emotion
                      bgcolor: getFinalEmotionColour(item.emotion) // for setting the background colour of the bar of the linear progress to the colour of the emotion
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
          
          <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} /> {/* for setting the margin bottom of the divider to 3, this is used to add space between the divider and the next element, and the border color of the divider to the divider color of the theme */}
          
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}> {/* for setting the colour of the typography to the secondary colour of the theme */}
            {technologyDescription} {/* for setting the text of the typography to the technology description */}
          </Typography>
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', // for setting the display of the box to flex
            flexDirection: 'column', // for setting the flex direction of the box to column
            alignItems: 'center', // for setting the align items of the box to centre
            justifyContent: 'center', // for setting the justify content of the box to centre
            flex: 1, // for setting the flex of the box to 1
            bgcolor: theme.palette.background.default, // for setting the background colour of the box to the default colour of the theme
            p: 4, // for setting the padding of the box to 4, this is used to add space between the box and the content inside the box
            borderRadius: 2 // for setting the border radius of the box to 2, this is used to round the corners of the box
          }}
        >
          {emptyIcon} {/* for setting the empty icon of the box, this is used to display an icon when there are no emotions detected */}
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1, textAlign: 'center' }}> {/* for setting the variant of the typography to h6, the colour of the typography to the secondary colour of the theme, the margin bottom of the typography to 1, and the text align of the typography to centre */}
            No emotions detected yet {/* for setting the text of the typography to No emotions detected yet */}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}> {/* for setting the variant of the typography to body2, the colour of the typography to the secondary colour of the theme, and the text align of the typography to centre */}
            {emptyMessage} {/* for setting the text of the typography to the empty message */}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default EmotionResults; // Export the EmotionResults component as the default export, allowing it to be used in other components
