import {
  Typography, // import the Typography component from MUI
  Paper, // import the Paper component from MUI
  Accordion, // import the Accordion component from MUI
  AccordionSummary, // import the AccordionSummary component from MUI
  AccordionDetails, // import the AccordionDetails component from MUI
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // import the ExpandMoreIcon from the @mui/icons-material library

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const EmotionDetectionExplanation = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // for checking if the theme is dark mode

  return (
    <Paper
      elevation={2} // for setting the elevation of the paper to 2, which is the amount of shadow the paper will have
      sx={{
        p: { xs: 2, sm: 3 }, // for setting the padding of the paper to 2 on small screens and 3 on medium screens
        borderRadius: '16px', // for setting the border radius of the paper to 16px
        width: '100%', // for setting the width of the paper to 100%
        margin: '0 auto 40px auto', // for setting the margin of the paper to 0 on the left, auto on the right, 40px on the bottom and auto on the top
        backgroundColor: theme.palette.background.paper, // for setting the background colour of the paper to the background colour of the theme
        overflow: 'hidden', // for setting the overflow of the paper to hidden
      }}
    >
      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40', // for setting the background colour of the accordion to the primary colour of the theme, with a 30% opacity on dark mode and a 40% opacity on light mode
          border: `1px solid ${theme.palette.primary.main}`, // for setting the border of the accordion to the primary colour of the theme
          borderRadius: '16px', // for setting the border radius of the accordion to 16px
          boxShadow: 'none', // for setting the box shadow of the accordion to none
          '&.MuiAccordion-root:before': {
            display: 'none', // for setting the display of the before pseudo-element to none, this is used to remove the default border of the accordion
          },
          mb: 2 // for setting the margin bottom of the accordion to 2, this is used to add space between the accordions
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />} // for setting the expand icon of the accordion to the ExpandMoreIcon
          aria-controls="what-is-ed-content" // for setting the aria controls of the accordion to what-is-ed-content
          id="what-is-ed-header" // for setting the id of the accordion to what-is-ed-header
        >
          <Typography
            variant="h5" // for setting the variant of the typography to h5, for a header style
            sx={{
              fontWeight: 600, // for setting the font weight of the typography to 600
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            What is Emotion Detection? {/* for setting the text of the typography to What is Emotion Detection? */}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • Emotion recognition refers to the determination of human emotion from sources such as image, video, audio, or text.
          </Typography>
          <Typography
            variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • It can be model-based on learned facial expression, tone of voice, speech patterns, posture, or even biometric information.
          </Typography>
          <Typography
            variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • Models would generally use machine learning or deep learning techniques for classifying emotions such as happiness, anger, fear, or sadness.
          </Typography>
          <Typography
            variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • Emotion detection is employed in applications such as mental health monitoring, customer service, and human-computer interaction to better understand and react to a user's emotions.
          </Typography>
          <Typography
            variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • Emotion detection models can include convolutional neural networks (CNNs), recurrent neural networks (RNNs) or transformers.
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.success.dark + '30' : theme.palette.success.light + '40', // for setting the background colour of the accordion to the success colour of the theme, with a 30% opacity on dark mode and a 40% opacity on light mode
          border: `1px solid ${theme.palette.success.main}`, // for setting the border of the accordion to the success colour of the theme
          borderRadius: '16px', // for setting the border radius of the accordion to 16px
          boxShadow: 'none', // for setting the box shadow of the accordion to none
          '&.MuiAccordion-root:before': {
            display: 'none', // for setting the display of the before pseudo-element to none, this is used to remove the default border of the accordion
          },
          mb: 2 // for setting the margin bottom of the accordion to 2, this is used to add space between the accordions
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />} // for setting the expand icon of the accordion to the ExpandMoreIcon
          aria-controls="common-challenges-ed-content" // for setting the aria controls of the accordion to common-challenges-ed-content
          id="common-challenges-ed-header" // for setting the id of the accordion to common-challenges-ed-header
        >
          <Typography
            variant="h5" // for setting the variant of the typography to h5, for a header style
            sx={{
              fontWeight: 600, // for setting the font weight of the typography to 600
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            Common Challenges {/* for setting the text of the typography to Common Challenges */}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • Bias occurs in emotion detection tools through biased training sets that over-sampled one or more age ranges, cultures, or ethnicities.
          </Typography>
          <Typography variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • Emotions are contextual and rich in culture, therefore, the same facial expression might be interpreted differently depending on context, which the models overlook.
          </Typography>
          <Typography variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • There are concerns about consent and surveillance whenever emotion detection is used without the users properly being informed of how their emotional data are collected and processed.
          </Typography>
          <Typography variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • Transparency is also an issue because the justification behind emotional predictions can be hard to explain, especially in deep models, which are typically very difficult for most beginners to understand.
          </Typography>
          <Typography variant="body2" // for setting the variant of the typography to body2, for a body style
            sx={{
              mb: 3, // for setting the margin bottom of the typography to 3
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            • Emotion recognition generally does not work well in real-time or poor-quality environments, such as poor lighting or background noise, which can reduce accuracy and reliability.
          </Typography>
        </AccordionDetails>
      </Accordion>
      

    </Paper>
  );
};

export default EmotionDetectionExplanation; // export the EmotionDetectionExplanation component as the default export, allowing it to be used in other components
