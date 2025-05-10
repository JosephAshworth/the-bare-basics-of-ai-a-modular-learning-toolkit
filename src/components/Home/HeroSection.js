import {
  Box, // import Box from MUI
  Container, // import Container from MUI
  Typography, // import Typography from MUI
  Grid, // import Grid from MUI
  Paper, // import Paper from MUI
  Button // import Button from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import { 
  ArrowForward as ArrowForwardIcon, // import ArrowForward as ArrowForwardIcon from MUI
  AutoAwesome as SparkleIcon // import AutoAwesome as SparkleIcon from MUI
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom'; // import useNavigate, this is used to navigate to a different page

const HeroSection = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // check if the theme is dark mode
  const navigate = useNavigate(); // for navigating to a different page
  
  const handleGetStarted = () => {
    navigate('/welcome'); // navigate to the welcome page
  };

  return (
    <Box sx={{
      py: 12, // set the padding of the box to 12, this adds space inside the box
      position: 'relative', // set the position of the box to relative, this allows the box to be positioned relative to its normal position
      overflow: 'hidden' // set the overflow of the box to hidden, this hides any content that overflows the box
    }}>

      <Container
        sx={{ 
          position: 'relative', // set the position of the container to relative, this allows the container to be positioned relative to its normal position
          zIndex: 1 // set the z-index of the container to 1, this ensures the container is above other elements
        }}
      >
        <Grid container spacing={6} alignItems="center"> {/* create a grid container with a spacing of 6 and align the items to the centre */}
          <Grid item md={6} xs={12}> {/* create a grid item with a width of 6 on medium screens and 12 on small screens */}
            <Box> {/* create a box component */}
              <Typography 
                variant="h1" // set the variant of the typography to h1
                sx={{ 
                  fontSize: '3.5rem', // set the font size of the typography to 3.5rem
                  fontWeight: 800, // set the font weight of the typography to 800
                  mb: 2, // set the margin bottom of the typography to 2
                  lineHeight: 1.2, // set the line height of the typography to 1.2
                  textAlign: 'center', // set the text alignment of the typography to centre
                  color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
                }}
              >
                Learn AI the Modular Way
              </Typography>
              <Typography 
                variant="h5" // set the variant of the typography to h5
                sx={{
                  fontSize: '1.25rem', // set the font size of the typography to 1.25rem
                  mb: 6, // set the margin bottom of the typography to 6
                  maxWidth: '500px', // set the maximum width of the typography to 500px
                  lineHeight: 1.5, // set the line height of the typography to 1.5
                  margin: '0 auto', // set the margin of the typography to 0 auto, this centres the typography horizontally
                  textAlign: 'center', // set the text alignment of the typography to centre
                  color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                }}
              >
                Master artificial intelligence through our structured, beginner-friendly learning modules designed for everyone
              </Typography>
              <Box sx={{ 
                display: 'flex', // set the display of the box to flex, this allows the box to be flexed
                justifyContent: 'center', // set the justify content of the box to centre, this centres the box horizontally
                mt: 4 // set the margin top of the box to 4, this adds space above the box
              }}>
                <Button 
                  variant="contained" // set the variant of the button to contained, this creates a button with a background colour
                  color="primary" // set the colour of the button to primary, this is the main colour of the theme
                  onClick={handleGetStarted} // set the onClick of the button to handleGetStarted, this is the function that will be called when the button is clicked
                  size="large" // set the size of the button to large, this is the largest size of the button
                  sx={{
                    px: 4, // set the padding x of the button to 4, this adds space inside the button
                    py: 1.5, // set the padding y of the button to 1.5, this adds space inside the button
                    borderRadius: '12px', // set the border radius of the button to 12px, this creates a rounded button
                    fontSize: '1.1rem', // set the font size of the button to 1.1rem, this is the size of the text inside the button
                    boxShadow: theme.shadows[3], // set the box shadow of the button to the third shadow of the theme, this creates a shadow effect on the button
                    '&:hover': {
                      transform: 'translateY(-2px)', // transform the button up by 2px when hovered over
                      boxShadow: theme.shadows[6] // set the box shadow of the button to the sixth shadow of the theme, this creates a shadow effect on the button
                    }
                  }}
                >
                  Get Started <ArrowForwardIcon sx={{ ml: 1 }} /> {/* add an arrow forward icon to the button */}
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item md={6} xs={12}> {/* create a grid item with a width of 6 on medium screens and 12 on small screens */}
            <Paper
              elevation={isDarkMode ? 6 : 2} // set the elevation of the paper to 6 on dark mode and 2 on light mode, this creates a shadow effect on the paper
              sx={{
                p: 4, // set the padding of the paper to 4, this adds space inside the paper
                borderRadius: '24px', // set the border radius of the paper to 24px, this creates a rounded paper
                maxWidth: '500px', // set the maximum width of the paper to 500px, this is the maximum width of the paper
                margin: '0 auto', // set the margin of the paper to 0 auto, this centres the paper horizontally
                border: `1px solid ${theme.palette.divider}`, // set the border of the paper to the divider of the theme, this creates a border around the paper
                backgroundColor: isDarkMode ? '#000000' : theme.palette.background.paper, // set the background colour of the paper to the background colour of the theme
                boxShadow: theme.shadows[isDarkMode ? 2 : 1] // set the box shadow of the paper to the second shadow of the theme on dark mode and the first shadow of the theme on light mode
              }}
            >

              
              <Box>
                <Box
                  sx={{
                    width: '64px', // set the width of the box to 64px
                    height: '64px', // set the height of the box to 64px
                    borderRadius: '50%', // set the border radius of the box to 50%, this creates a circular box
                    bgcolor: theme.palette.primary.main + (isDarkMode ? '33' : '40'), // set the background colour of the box to the primary colour of the theme, with a 33% in dark mode or 40% in light mode opacity
                    display: 'flex', // set the display of the box to flex, this allows the box to be flexed
                    alignItems: 'center', // set the align items of the box to centre, this centres the box vertically
                    justifyContent: 'center', // set the justify content of the box to centre, this centres the box horizontally
                    margin: '0 auto', // set the margin of the box to 0 auto, this centres the box horizontally
                    mb: 3 // set the margin bottom of the box to 3, this adds space below the box
                    
                  }}
                >
                  <SparkleIcon 
                    sx={{ 
                      fontSize: 32, // set the font size of the icon to 32, this is the size of the icon
                      color: theme.palette.primary.main // set the colour of the icon to the primary colour of the theme
                    }} 
                  />
                </Box>
                <Typography 
                  sx={{
                    fontSize: '1.1rem', // set the font size of the typography to 1.1rem
                    lineHeight: 1.6, // set the line height of the typography to 1.6
                    textAlign: 'center', // set the text alignment of the typography to centre
                    color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                  }}
                >
                  From fundamental concepts to advanced techniques in 3 comprehensive modules
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; // export the HeroSection component, this allows the component to be used in other files
