import {
  Box, // import Box from @mui/material
  Container, // import Container from @mui/material
  Typography, // import Typography from @mui/material
  Grid, // import Grid from @mui/material
  Paper // import Paper from @mui/material
} from '@mui/material';

import { MenuBook as LearningIcon } from '@mui/icons-material'; // import LearningIcon from @mui/icons-material

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on the theme

const HeroSection = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // for checking if the theme is dark mode
  return (
    <Box sx={{ 
      py: 12, // for setting the vertical padding of the box to 12 units, adding padding to the top and bottom of the box
      position: 'relative', // for setting the position of the box to relative, this is to allow the box to be positioned relative to its normal position
      overflow: 'hidden' // for setting the overflow of the box to hidden, this is to prevent the box from overflowing its container
    }}>
      <Container maxWidth="lg"> 
        <Grid container spacing={6} alignItems="center"> {/* for setting the grid container to have a spacing of 6 units and aligning the items in the centre */}
          <Grid item xs={12} md={6}> {/* for setting the grid item to have a width of 12 units on small screens and 6 units on medium screens */}
            <Box sx={{ textAlign: { xs: 'center', md: 'center' } }}> {/* for setting the text alignment of the box to centre on small screens and centre on medium screens */}
              <Typography 
                variant="h1" // for using a title variant
                sx={{
                  fontSize: '3.5rem', // for setting the font size of the title to 3.5rem
                  fontWeight: 800, // for setting the font weight of the title to 800
                  mb: 2, // for setting the margin bottom of the title to 2 units
                  lineHeight: 1.2, // for setting the line height of the title to 1.2
                  color: theme.palette.text.primary, // for setting the colour of the title to the primary colour from the theme
                }}
              >
                Machine Learning
              </Typography>
              
              <Typography 
                variant="h5" // for using a subtitle variant
                sx={{
                  fontSize: '1.25rem', // for setting the font size of the subtitle to 1.25rem
                  mb: 6, // for setting the margin bottom of the subtitle to 6 units
                  maxWidth: '500px', // for setting the maximum width of the subtitle to 500px
                  lineHeight: 1.5, // for setting the line height of the subtitle to 1.5
                  margin: '0 auto', // for setting the margin of the subtitle to 0 auto, this is to centre the subtitle
                  textAlign: 'center', // for setting the text alignment of the subtitle to centre
                  color: theme.palette.text.secondary, // for setting the colour of the subtitle to the secondary colour from the theme
                }}
              >
                Train and visualise machine learning models with custom datasets and parameters
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}> {/* for setting the grid item to have a width of 12 units on small screens and 6 units on medium screens */}
            <Paper
              elevation={isDarkMode ? 4 : 1} // for setting the elevation of the paper to 4 if the theme is dark mode and 1 if the theme is light mode, this is to give the paper a shadow effect
              sx={{
                p: 4, // for setting the padding of the paper to 4 units
                borderRadius: '24px', // for setting the border radius of the paper to 24px
                maxWidth: '500px', // for setting the maximum width of the paper to 500px
                margin: '0 auto', // for setting the margin of the paper to 0 auto, this is to centre the paper
                border: `1px solid ${theme.palette.divider}`, // for setting the border of the paper to 1px solid, this is to give the paper a border
                backgroundColor: isDarkMode ? '#000000' : theme.palette.background.paper, // for setting the background colour of the paper to black if the theme is dark mode and the paper background colour if the theme is light mode
                boxShadow: theme.shadows[isDarkMode ? 2 : 1] // for setting the box shadow of the paper to the shadow of the theme if the theme is dark mode and the shadow of the theme if the theme is light mode
              }}
            >
              <Box sx={{ textAlign: 'center' }}> {/* for setting the text alignment of the box to centre */}
                <Box
                  sx={{
                    width: '64px', // for setting the width of the box to 64px
                    height: '64px', // for setting the height of the box to 64px
                    borderRadius: '50%', // for setting the border radius of the box to 50%, this is to make the box a circle
                    bgcolor: theme.palette.primary.main + (isDarkMode ? '33' : '40'), // for setting the background colour of the box to the primary colour from the theme with an opacity of 33% if the theme is dark mode and 40% if the theme is light mode
                    display: 'flex', // for setting the display of the box to flex, this is to allow the box to be aligned in the centre
                    alignItems: 'center', // for setting the alignment of the box to centre, this is to centre the box vertically
                    justifyContent: 'center', // for setting the justification of the box to centre, this is to centre the box horizontally
                    margin: '0 auto', // for setting the margin of the box to 0 auto, this is to centre the box
                    mb: 3 // for setting the margin bottom of the box to 3 units
                  }}
                >
                  <LearningIcon
                    sx={{
                      fontSize: 32, // for setting the font size of the LearningIcon to 32px
                      color: theme.palette.primary.main // for setting the colour of the LearningIcon to the primary colour from the theme
                    }}
                  />
                </Box>
                <Typography 
                  variant="body1" // for using a body variant
                  sx={{
                    fontSize: '1.1rem', // for setting the font size of the typography to 1.1rem
                    lineHeight: 1.6, // for setting the line height of the typography to 1.6
                    textAlign: 'center', // for setting the text alignment of the typography to centre
                    color: theme.palette.text.secondary // for setting the colour of the typography to the secondary colour from the theme
                  }}
                >
                  Upload data, configure hyperparameters, train models, and interpret the results instantly
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; // export the HeroSection component as the default export, so it can be used in other components
