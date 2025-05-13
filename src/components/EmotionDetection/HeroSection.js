// the section at the top of the page

// material ui components
import { 
  Box,
  Container,
  Typography,
  Grid,
  Paper
} from '@mui/material';

import { 
  Psychology as PsychologyIcon
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';

const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark'; // determine if the current theme is dark mode

  return (
    <Box 
      sx={{
        py: 12,
        position: 'relative',
        overflow: 'hidden' // hide any content that overflows the box
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  mb: 2,
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                Emotion Detection
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.25rem',
                  color: theme.palette.text.secondary,
                  mb: 6,
                  maxWidth: '500px',
                  lineHeight: 1.5,
                  margin: '0 auto',
                  textAlign: 'center'
                }}
              >
                Analyse emotions from facial expressions, written text, and audio using specialised models
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={isDarkMode ? 4 : 1} // increase shadow depth in dark mode for better contrast
              sx={{
                p: 4,
                borderRadius: '24px',
                maxWidth: '500px',
                margin: '0 auto',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isDarkMode ? '#000000' : theme.palette.background.paper, // use a solid black background in dark mode
                boxShadow: theme.shadows[isDarkMode ? 2 : 1] // apply a lighter shadow in light mode
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%', // create a circular shape
                    bgcolor: theme.palette.success.main + (isDarkMode ? '33' : '40'), // apply a semi-transparent background colour
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3
                  }}
                >
                  <PsychologyIcon sx={{
                    fontSize: 32,
                    color: theme.palette.success.main
                  }} />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}
                >
                  Upload an image, write some text, or upload an audio file, and watch the magic happen 
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;