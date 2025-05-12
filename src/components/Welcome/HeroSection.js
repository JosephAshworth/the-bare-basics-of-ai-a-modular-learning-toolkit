import { 
  Grid, // import Grid from MUI
  Typography, // import Typography from MUI
  Box, // import Box from MUI
  Container, // import Container from MUI
  Paper // import Paper from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const HeroSection = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // check if the theme is dark mode

  return (
    <Box sx={{ 
      py: 12, // set the padding top and bottom to 12
      position: 'relative', // set the position to relative, so it is relative to the normal position of the page
    }}>
      
      <Container>
        <Grid container spacing={6}> {/* set the grid container to have a spacing of 6 */}
          <Grid item md={6}> {/* set the grid item to be 6 columns wide */}
            <Box> {/* set the box to be a flex container */}
              <Typography 
                sx={{
                  fontSize: '3.5rem', // set the font size to 3.5rem
                  fontWeight: 800, // set the font weight to 800
                  mb: 2, // set the margin bottom to 2
                  lineHeight: 1.2, // set the line height to 1.2
                  textAlign: 'center', // set the text alignment to centre
                  color: theme.palette.text.primary // set the text colour to the primary colour of the theme
                }}
              >
                Welcome to the Bare Basics of AI
              </Typography>
              <Typography 
                variant="h5" // set the variant to h5, for the heading
                sx={{
                  fontSize: '1.25rem', // set the font size to 1.25rem
                  mb: 6, // set the margin bottom to 6, adding space at the bottom of the heading
                  maxWidth: '500px', // set the max width to 500px
                  lineHeight: 1.5, // set the line height to 1.5, adding space between the lines
                  margin: '0 auto', // set the margin to 0 and auto, so it is centred
                  textAlign: 'center', // set the text alignment to centre
                  color: theme.palette.text.secondary // set the text colour to the secondary colour of the theme
                }}
              >
                This interactive website will allow you to learn the concepts of AI in a fun and engaging way
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}> {/* set the grid item to be 6 columns wide */}
            <Paper
              elevation={theme.palette.mode === 'dark' ? 6 : 2} // set the elevation to 6 for dark mode and 2 for light mode, this is the shadow of the paper
              sx={{
                p: 4, // set the padding to 4, adding space inside the paper
                borderRadius: '24px', // set the border radius to 24px, this is the rounded corners of the paper
                maxWidth: '500px', // set the max width to 500px
                margin: '0 auto', // set the margin to 0 and auto, so it is centred
                border: `1px solid ${theme.palette.divider}`, // set the border to 1px solid and the colour to the divider colour of the theme
                backgroundColor: isDarkMode ? '#000000' : theme.palette.background.paper, // set the background colour to the background colour of the theme
                boxShadow: theme.shadows[isDarkMode ? 2 : 1] // set the box shadow to the shadow of the theme
              }}
            >
              <Box sx={{ textAlign: 'center' }}> {/* set the box to be a flex container */}
                <Box
                  sx={{
                    width: '64px', // set the width to 64px
                    height: '64px', // set the height to 64px
                    borderRadius: '50%', // set the border radius to 50%, this is the rounded corners of the box
                    bgcolor: theme.palette.primary.main + (isDarkMode ? '33' : '40'), // set the background colour to the primary colour of the theme
                    display: 'flex', // set the display to flex, so it is a flex container
                    alignItems: 'center', // set the align items to centre, so it is centred vertically
                    justifyContent: 'center', // set the justify content to centre, so it is centred horizontally
                    margin: '0 auto', // set the margin to 0 and auto, so it is centred
                    mb: 3 // set the margin bottom to 3, adding space at the bottom of the box
                  }}
                >
                  <Typography
                    variant="h4" // set the variant to h4, for the heading
                    sx={{
                      fontWeight: 700, // set the font weight to 700
                      color: theme.palette.primary.main // set the text colour to the primary colour of the theme
                    }}
                  >
                    AI
                  </Typography>
                </Box>
                <Typography 
                  sx={{
                    fontSize: '1.1rem', // set the font size to 1.1rem
                    lineHeight: 1.6, // set the line height to 1.6, adding space between the lines
                    textAlign: 'center', // set the text alignment to centre
                    color: theme.palette.text.secondary // set the text colour to the secondary colour of the theme
                  }}
                >
                  Gain hands-on experience with AI concepts through practical examples
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; // export the HeroSection component, so it can be used in other files
