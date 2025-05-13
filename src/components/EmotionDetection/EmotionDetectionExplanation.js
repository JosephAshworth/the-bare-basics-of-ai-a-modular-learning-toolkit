// the explanation section of the emotion detection page

// material ui components
import {
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useTheme } from '@mui/material/styles';

const EmotionDetectionExplanation = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark'; // determine if the current theme is dark mode

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: '16px',
        width: '100%',
        margin: '0 auto 40px auto',
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
      }}
    >
      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40',
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: '16px',
          boxShadow: 'none',
          '&.MuiAccordion-root:before': {
            display: 'none', // remove default accordion border
          },
          mb: 2
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />} // icon to indicate expandable content
          aria-controls="what-is-ed-content"
          id="what-is-ed-header"
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            What is Emotion Detection?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Emotion recognition refers to the determination of human emotion from sources such as image, video, audio, or text.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • It can be model-based on learned facial expression, tone of voice, speech patterns, posture, or even biometric information.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Models would generally use machine learning or deep learning techniques for classifying emotions such as happiness, anger, fear, or sadness.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Emotion detection is employed in applications such as mental health monitoring, customer service, and human-computer interaction to better understand and react to a user's emotions.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Emotion detection models can include convolutional neural networks (CNNs), recurrent neural networks (RNNs) or transformers.
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.success.dark + '30' : theme.palette.success.light + '40',
          border: `1px solid ${theme.palette.success.main}`,
          borderRadius: '16px',
          boxShadow: 'none',
          '&.MuiAccordion-root:before': {
            display: 'none',
          },
          mb: 2
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="common-challenges-ed-content"
          id="common-challenges-ed-header"
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Common Challenges
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Bias occurs in emotion detection tools through biased training sets that over-sampled one or more age ranges, cultures, or ethnicities.
          </Typography>
          <Typography variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Emotions are contextual and rich in culture, therefore, the same facial expression might be interpreted differently depending on context, which the models overlook.
          </Typography>
          <Typography variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • There are concerns about consent and surveillance whenever emotion detection is used without the users properly being informed of how their emotional data are collected and processed.
          </Typography>
          <Typography variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Transparency is also an issue because the justification behind emotional predictions can be hard to explain, especially in deep models, which are typically very difficult for most beginners to understand.
          </Typography>
          <Typography variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Emotion recognition generally does not work well in real-time or poor-quality environments, such as poor lighting or background noise, which can reduce accuracy and reliability.
          </Typography>
        </AccordionDetails>
      </Accordion>
      

    </Paper>
  );
};

export default EmotionDetectionExplanation;