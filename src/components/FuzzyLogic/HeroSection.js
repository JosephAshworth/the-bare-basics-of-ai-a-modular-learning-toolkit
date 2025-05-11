import {
  Box, // import Box from MUI
  Container, // import Container from MUI
  Typography, // import Typography from MUI
  Grid, // import Grid from MUI
  Paper, // import Paper from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import { 
  DeviceHub as FuzzyIcon // import DeviceHub as FuzzyIcon from MUI
} from '@mui/icons-material'; 

const HeroSection = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // check if the theme is dark mode

  return (
    <Box sx={{ 
      py: 8, // set the padding of the box to 8
      position: 'relative', // set the position of the box to relative, this is used to position the box relative to the container
      overflow: 'hidden', // set the overflow of the box to hidden, this is used to prevent the box from overflowing (going out of the container)
    }}>

      <Container
        maxWidth="lg" // set the max width of the container to lg
        sx={{ 
          position: 'relative' // set the position of the container to relative, this is used to position the container relative to the box
        }}
      >
        <Grid container spacing={4} alignItems="center"> {/* set the grid container to have a spacing of 4 and align the items to the centre */}
          <Grid item xs={12} md={5}> {/* set the grid item to have a width of 12 for small screens and 5 for larger screens */}
            <Box> {/* set the box to have a width of 100% */}
              <Typography 
                variant="h1" // set the variant of the typography to h1
                sx={{
                  fontSize: '3.5rem', // set the font size of the typography to 3.5rem
                  fontWeight: 800, // set the font weight of the typography to 800
                  color: theme.palette.text.primary, // set the colour of the typography to the primary colour of the theme
                  mb: 2, // set the margin bottom of the typography to 2
                  lineHeight: 1.2, // set the line height of the typography to 1.2
                  textAlign: 'center' // set the text alignment of the typography to centre
                }}
              >
                Fuzzy Logic
              </Typography>
              <Typography 
                variant="h5" // set the variant of the typography to h5
                sx={{
                  fontSize: '1.25rem', // set the font size of the typography to 1.25rem
                  mb: 6, // set the margin bottom of the typography to 6
                  maxWidth: '500px', // set the max width of the typography to 500px
                  lineHeight: 1.5, // set the line height of the typography to 1.5
                  margin: '0 auto', // set the margin of the typography to 0 auto
                  textAlign: 'center', // set the text alignment of the typography to centre
                  color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                }}
              >
                Discover AI that processes the 'maybe' and 'sort of' in human thinking
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}> {/* set the grid item to have a width of 12 for small screens and 7 for larger screens */}
            <Paper
              elevation={isDarkMode ? 4 : 1} // set the elevation of the paper to 4 for dark mode and 1 for light mode, this is used to give the paper a shadow
              sx={{
                p: 4, // set the padding of the paper to 4
                borderRadius: '24px', // set the border radius of the paper to 24px
                maxWidth: '500px', // set the max width of the paper to 500px
                margin: '0 auto', // set the margin of the paper to 0 auto
                border: `1px solid ${theme.palette.divider}`, // set the border of the paper to 1px solid the divider of the theme
                backgroundColor: isDarkMode ? '#000000' : theme.palette.background.paper, // set the background colour of the paper to the background colour of the theme
                boxShadow: theme.shadows[isDarkMode ? 2 : 1] // set the box shadow of the paper to the box shadow of the theme
              }}
            >
              <Box sx={{ textAlign: 'center' }}> {/* set the box to have a text alignment of centre */}
                <Box
                  sx={{
                    width: '64px', // set the width of the box to 64px
                    height: '64px', // set the height of the box to 64px
                    borderRadius: '50%', // set the border radius of the box to 50%
                    bgcolor: theme.palette.warning.main + (isDarkMode ? '33' : '40'), // set the background colour of the box to the warning colour of the theme
                    display: 'flex', // set the display of the box to flex
                    alignItems: 'center', // set the align items of the box to centre
                    justifyContent: 'center', // set the justify content of the box to centre
                    margin: '0 auto', // set the margin of the box to 0 auto
                    mb: 3 // set the margin bottom of the box to 3
                  }}
                >
                  <FuzzyIcon sx={{ 
                    fontSize: 32, // set the font size of the icon to 32
                    color: theme.palette.warning.main // set the colour of the icon to the warning colour of the theme
                  }} />
                </Box>
                <Typography 
                  variant="body1" // set the variant of the typography to body1
                  sx={{
                    color: theme.palette.text.secondary, // set the colour of the typography to the secondary colour of the theme
                    fontSize: '1.1rem', // set the font size of the typography to 1.1rem
                    lineHeight: 1.6, // set the line height of the typography to 1.6
                    textAlign: 'center', // set the text alignment of the typography to centre
                    maxWidth: '400px', // set the max width of the typography to 400px
                    margin: '0 auto' // set the margin of the typography to 0 auto
                  }}
                >
                  Test out systems that imitate human thinking, and give realistic results based on this
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; // export the HeroSection component, this is used to use the component in other files
