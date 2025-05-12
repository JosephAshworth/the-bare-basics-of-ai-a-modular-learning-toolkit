import { 
  Box, // import Box from MUI
  Container, // import Container from MUI
  Typography, // import Typography from MUI
  Grid, // import Grid from MUI
  Paper // import Paper from MUI
} from '@mui/material';

import { 
  Psychology as PsychologyIcon // import PsychologyIcon from MUI
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const HeroSection = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // for checking if the theme is dark mode

  return (
    <Box 
      sx={{
        py: 12, // for setting the padding of the box to 12, this adds space inside the box
        position: 'relative', // for setting the position of the box to relative, this allows the box to be positioned relative to its normal position
        overflow: 'hidden' // for setting the overflow of the box to hidden, this hides any content that overflows the box
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center"> {/* create a grid component with a spacing of 6 and aligning the items to the centre, this is used to create a grid layout */}
          <Grid item xs={12} md={6}> {/* create a grid item component with a width of 12 on small screens and 6 on medium screens, this is used to create a grid layout */}
            <Box sx={{ textAlign: 'center' }}> {/* create a box component with a text alignment of centre, this is used to centre the content of the box */}
              <Typography
                variant="h1" // for setting the variant of the typography to h1, this is used to create a heading
                sx={{
                  fontSize: '3.5rem', // for setting the font size of the typography to 3.5rem, this is used to create a large heading
                  fontWeight: 800, // for setting the font weight of the typography to 800, this is used to create a bold heading
                  color: theme.palette.text.primary, // for setting the colour of the typography to the primary colour of the theme, this is used to create a heading
                  mb: 2, // for setting the margin bottom of the typography to 2, this adds space below the heading
                  lineHeight: 1.2, // for setting the line height of the typography to 1.2, this is used to create a heading
                  textAlign: 'center' // for setting the text alignment of the typography to centre, this is used to centre the heading
                }}
              >
                Emotion Detection {/* create a heading component with the text Emotion Detection */}
              </Typography>
              <Typography
                variant="h5" // for setting the variant of the typography to h5, this is used to create a subheading
                sx={{
                  fontSize: '1.25rem', // for setting the font size of the typography to 1.25rem, this is used to create a subheading
                  color: theme.palette.text.secondary, // for setting the colour of the typography to the secondary colour of the theme, this is used to create a subheading
                  mb: 6, // for setting the margin bottom of the typography to 6, this adds space below the subheading
                  maxWidth: '500px', // for setting the maximum width of the typography to 500px, this is used to create a subheading
                  lineHeight: 1.5, // for setting the line height of the typography to 1.5, this is used to create a subheading
                  margin: '0 auto', // for setting the margin of the typography to 0 and auto, this is used to centre the subheading
                  textAlign: 'center' // for setting the text alignment of the typography to centre, this is used to centre the subheading
                }}
              >
                Analyse emotions from facial expressions, written text, and audio using specialised models {/* create a subheading component with the text Analyse emotions from facial expressions, written text, and audio using specialised models */}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}> {/* create a grid item component with a width of 12 on small screens and 6 on medium screens, this is used to create a grid layout */}
            <Paper
              elevation={isDarkMode ? 4 : 1}
              sx={{
                p: 4, // for setting the padding of the paper to 4, this adds space inside the paper
                borderRadius: '24px', // for setting the border radius of the paper to 24px, this is used to create a rounded paper
                maxWidth: '500px', // for setting the maximum width of the paper to 500px, this is used to create a paper
                margin: '0 auto', // for setting the margin of the paper to 0 and auto, this is used to centre the paper
                border: `1px solid ${theme.palette.divider}`, // for setting the border of the paper to 1px solid, this is used to create a border
                backgroundColor: isDarkMode ? '#000000' : theme.palette.background.paper, // for setting the background colour of the paper to the primary colour of the theme, this is used to create a paper
                boxShadow: theme.shadows[isDarkMode ? 2 : 1] // for setting the box shadow of the paper to the primary colour of the theme, this is used to create a paper
              }}
            >
              <Box sx={{ textAlign: 'center' }}> {/* create a box component with a text alignment of centre, this is used to centre the content of the box */}
                <Box
                  sx={{
                    width: '64px', // set the width of the box to 64px
                    height: '64px', // set the height of the box to 64px
                    borderRadius: '50%', // set the border radius of the box to 50%, this is used to create a circle
                    bgcolor: theme.palette.success.main + (isDarkMode ? '33' : '40'), // set the background colour of the box to the primary colour of the theme
                    display: 'flex', // set the display of the box to flex
                    alignItems: 'center', // set the alignment of the box to centre
                    justifyContent: 'center', // set the justification of the box to centre
                    margin: '0 auto', // set the margin of the box to 0 and auto, this is used to centre the box
                    mb: 3 // set the margin bottom of the box to 3, this adds space below the box
                  }}
                >
                  <PsychologyIcon sx={{
                    fontSize: 32, // set the font size of the icon to 32
                    color: theme.palette.success.main // set the colour of the icon to the primary colour of the theme
                  }} />
                </Box>
                <Typography
                  variant="body1" // set the variant of the typography to body1, for a large text
                  sx={{
                    color: theme.palette.text.secondary, // set the colour of the typography to the secondary colour of the theme
                    fontSize: '1.1rem', // set the font size of the typography to 1.1rem
                    lineHeight: 1.6, // set the line height of the typography to 1.6
                    textAlign: 'center', // set the text alignment of the typography to centre
                    maxWidth: '400px', // set the maximum width of the typography to 400px
                    margin: '0 auto' // set the margin of the typography to 0 and auto, this is used to centre the typography
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

export default HeroSection; // export the HeroSection component as the default export, this allows the component to be used in other files
