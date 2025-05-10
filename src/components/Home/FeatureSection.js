import 
  React, // import React
  { useState } // import useState, this is used to manage state in functional components
from 'react';

import { 
  Box, // import Box from MUI
  Typography, // import Typography from MUI
  Grid, // import Grid from MUI
  Paper, // import Paper from MUI
  Accordion, // import Accordion from MUI
  AccordionSummary, // import AccordionSummary from MUI
  AccordionDetails, // import AccordionDetails from MUI
  Container // import Container from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import { 
  TouchApp as TouchAppIcon, // import TouchApp as TouchAppIcon from MUI
  Navigation as NavigationIcon, // import Navigation as NavigationIcon from MUI
  Balance as BalanceIcon, // import Balance as BalanceIcon from MUI
  LightbulbOutlined as LightbulbIcon, // import LightbulbOutlined as LightbulbIcon from MUI
  ExpandMore as ExpandMoreIcon, // import ExpandMore as ExpandMoreIcon from MUI
  CheckCircle as CheckCircleIcon // import CheckCircle as CheckCircleIcon from MUI
} from '@mui/icons-material';

const FeatureSection = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // check if the theme is dark mode

  const [expandedFeatures, setExpandedFeatures] = useState({ // state variable to store the expanded features for each feature card
    0: false, // set the first feature card to be closed
    1: false, // set the second feature card to be closed
    2: false, // set the third feature card to be closed
    3: false // set the fourth feature card to be closed
  });

  const handleFeatureToggle = (index) => (event, isExpanded) => { // function to handle the feature toggle for each feature card
    setExpandedFeatures(prev => ({ // set the expanded features for the feature card
      ...prev, // spread the previous expanded features
      [index]: isExpanded // set the expanded feature for the feature card to the isExpanded value
    }));
  };

  const featurePalettes = React.useMemo(() => ({ // create a feature palettes object, storing the colours for each feature card
    first: theme.palette.primary, // set the first feature palette to the primary palette
    second: theme.palette.secondary, // set the second feature palette to the secondary palette
    third: theme.palette.success, // set the third feature palette to the success palette
    fourth: theme.palette.warning, // set the fourth feature palette to the warning palette
  }), [theme.palette.primary, theme.palette.secondary, theme.palette.success, theme.palette.warning]); // create a feature palettes object

  const features = [
    {
      title: 'Interactive Learning', // set the title of the first feature card
      icon: <TouchAppIcon sx={{ fontSize: 32 }} />, // set the icon of the first feature card
      colourKey: 'first', // set the colour key of the first feature card
      points: [
        'Clear explanations with practical examples', // set the points of the first feature card
        'Step-by-step guides and tutorials', // set the points of the first feature card
        'Learn at your own pace with structured content' // set the points of the first feature card
      ]
    },
    {
      title: 'Intuitive Navigation', // set the title of the second feature card
      icon: <NavigationIcon sx={{ fontSize: 32 }} />, // set the icon of the second feature card
      colourKey: 'second', // set the colour key of the second feature card
      points: [
        'Clear, modular learning structure', // set the points of the second feature card
        'Easy-to-follow progression from basics to advanced', // set the points of the second feature card
        'Flexible learning at your own pace' // set the points of the second feature card
      ]
    },
    {
      title: 'Ethical Foundation', // set the title of the third feature card
      icon: <BalanceIcon sx={{ fontSize: 32 }} />, // set the icon of the third feature card
      colourKey: 'third', // set the colour key of the third feature card
      points: [
        'Understanding AI\'s impact on society', // set the points of the third feature card
        'Responsible AI development practices', // set the points of the third feature card
        'Shaping the future of AI responsibly' // set the points of the third feature card
      ]
    },
    {
      title: 'Fundamental Understanding', // set the title of the fourth feature card
      icon: <LightbulbIcon sx={{ fontSize: 32 }} />, // set the icon of the fourth feature card
      colourKey: 'fourth', // set the colour key of the fourth feature card
      points: [
        'Core AI concepts explained simply', // set the points of the fourth feature card
        'Building a strong foundation for future learning', // set the points of the fourth feature card
        'Practical applications of AI fundamentals' // set the points of the fourth feature card
      ]
    }
  ];

  const renderFeatureCard = (feature, index, colourPalette) => { // function to render the feature card
    const isExpanded = expandedFeatures[index]; // set the isExpanded value to the expanded features for the feature card
    
    return (
      <Paper
        elevation={isDarkMode ? 3 : 1} // set the elevation of the feature card, 3 for dark mode, 1 for light mode, adding a shadow to the feature card
        sx={{ 
          backgroundColor: theme.palette.background.paper, // set the background colour of the feature card to the background colour of the theme
          borderRadius: '16px', // set the border radius of the feature card to 16px
          position: 'relative', // set the position of the feature card to relative, so that the feature card can be positioned relative to the normal position
          transition: 'height 0.3s ease', // set the transition of the feature card to 0.3s ease, so that the feature card can be animated when it is expanded or collapsed
          height: isExpanded ? '380px' : '200px', // set the height of the feature card to 380px when expanded, and 200px when not expanded
          boxShadow: theme.shadows[isDarkMode ? 3 : 1], // set the box shadow of the feature card to the shadow of the theme, 3 for dark mode, 1 for light mode
          cursor: 'pointer', // set the cursor of the feature card to a pointer, so that the feature card can be clicked and a pointer is shown when hovering over the feature card
          overflow: 'hidden' // set the overflow of the feature card to hidden, so that the content does not overflow the feature card
        }}
        onClick={(e) => {
          handleFeatureToggle(index)(e, !isExpanded); // function to handle the feature toggle for the feature card
        }}
      >
        <ExpandMoreIcon 
          sx={{
            position: 'absolute', // set the position of the expand more icon to absolute, so that it can be positioned relative to the parent element
            top: 16, // set the icon to 16 from the top
            right: 16, // set the icon to 16 from the right
            color: colourPalette.main, // set the colour of the icon to the main colour of the theme
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', // set the transform of the icon to rotate 180 degrees when expanded, and 0 degrees when not expanded
            transition: 'transform 0.3s ease', // set the transition of the icon to 0.3s ease, so that the icon can be animated when it is expanded or collapsed
            zIndex: 2 // set the z index of the icon to 2, so that the icon can be above the feature card
          }}
        />
        
        <Box 
          sx={{ 
            padding: '24px' // set the padding of the box to 24px, this adds space inside the box
          }}
        >
          <Box 
            sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? colourPalette.main + '30' : colourPalette.light + '30', // set the background colour of the box to the main colour of the theme, 30% opacity
              borderRadius: '50%', // set the border radius of the box to 50%, this makes the box rounded
              width: '80px', // set the width of the box to 80px
              height: '80px', // set the height of the box to 80px
              display: 'flex', // set the display of the box to flex, this allows the box to be flexed
              alignItems: 'center', // set the align items of the box to centre, this centres the items in the box
              justifyContent: 'center', // set the justify content of the box to centre, this centres the items in the box
              mb: 3, // set the margin bottom of the box to 3, this adds space below the box
              mt: 1, // set the margin top of the box to 1, this adds space above the box
              mx: 'auto' // set the margin left and right of the box to auto, this centres the box horizontally
            }}
          >
            <Box sx={{ 
              display: 'flex', // set the display of the box to flex, this allows the box to be flexed
              alignItems: 'center', // set the align items of the box to centre, this centres the items in the box
              justifyContent: 'center', // set the justify content of the box to centre, this centres the items in the box
              color: colourPalette.main, // set the colour of the box to the main colour of the theme
              fontSize: 36, // set the font size of the box to 36, this sets the size of the icon
            }}>
              {feature.icon} {/* set the icon of the box to the icon of the feature */}
            </Box>
          </Box>
          
          <Typography 
            sx={{
              color: colourPalette.main, // set the colour of the typography to the main colour of the theme
              fontWeight: 700, // set the font weight of the typography to 700, this makes the typography bold
              textAlign: 'center', // set the text alignment of the typography to centre, this centres the text
              fontSize: '1.4rem', // set the font size of the typography to 1.4rem, this sets the size of the text
              mb: 1 // set the margin bottom of the typography to 1, this adds space below the typography
            }}
          >
            {feature.title} {/* set the title of the typography to the title of the feature */}
          </Typography>
        </Box>

        <Accordion 
          expanded={isExpanded} // set the expanded state of the accordion to the isExpanded value
          disableGutters // set the disable gutters of the accordion to true, this removes the gutters of the accordion
          sx={{
            background: 'transparent', // set the background of the accordion to transparent, this removes the background of the accordion
            boxShadow: 'none', // set the box shadow of the accordion to none, this removes the shadow of the accordion
            '&:before': { display: 'none' } // set the before of the accordion to none, this removes the before of the accordion
          }}
        >
          <AccordionSummary
            aria-controls={`panel-${index}-content`} // set the aria controls of the accordion to the panel-index-content value, which changes based on the index of the feature card
            id={`panel-${index}-header`} // set the id of the accordion to the panel-index-header value, which changes based on the index of the feature card
            sx={{ 
              display: 'none' // set the display of the accordion summary to none, this removes the accordion summary
            }}
          />
          <AccordionDetails>
            <Box>
              {feature.points.map((point, pIndex) => ( // map over the points of the feature card
                <Box key={pIndex} sx={{ display: 'flex', mb: 2 }}> {/* set the key of the box to the index of the point, this allows the box to be identified */}
                  <CheckCircleIcon 
                    sx={{ 
                      mr: 2, // set the margin right of the check circle icon to 2, this adds space between the icon and the text
                      color: colourPalette.main // set the colour of the check circle icon to the main colour of the theme
                    }} 
                  />
                  <Typography sx={{ color: theme.palette.text.primary }}> {/* set the colour of the typography to the primary colour of the theme */}
                    {point} {/* set the text of the typography to the point of the feature card */}
                  </Typography>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    );
  };

  return (
    <Box sx={{ 
      display: 'flex', // set the display of the box to flex, this allows the box to be flexed
      justifyContent: 'center', // set the justify content of the box to centre, this centres the box horizontally
      py: 8 // set the padding y of the box to 8, this adds space between the box and the top and bottom of the page
    }}>
      <Container maxWidth="lg"> {/* set the max width of the container to lg, this allows the container to be responsive */}
        <Box sx={{ mb: 6 }}> {/* set the margin bottom of the box to 6, this adds space between the box and the bottom of the page */}
          <Typography 
            variant="h3" // set the variant of the typography to h3, this sets the size of the text
            sx={{ 
              textAlign: 'center', // set the text alignment of the typography to centre, this centres the text
              mb: 3, // set the margin bottom of the typography to 3, this adds space between the typography and the bottom of the page
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            Learn AI the Right Way
          </Typography>
          <Typography 
            variant="h6" // set the variant of the typography to h6, this sets the size of the text
            sx={{ 
              textAlign: 'center', // set the text alignment of the typography to centre, this centres the text
              margin: '0 auto', // set the margin of the typography to auto, this centres the text horizontally
              maxWidth: '800px', // set the max width of the typography to 800px, this limits the width of the text
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}
          >
            Why beginners choose our platform for their AI learning journey
          </Typography>
        </Box>

        <Box sx={{ padding: { xs: 1, sm: 2 } }}> {/* set the padding of the box to 1 on small screens and 2 on medium screens, this adds space inside the box */}
          <Grid container spacing={4}> {/* set the grid container to have a spacing of 4, this adds space between the items in the grid */}
            {features.slice(0, 2).map((feature, index) => ( // map over the features of the feature card
              <Grid item xs={12} md={6} key={index}> {/* set the grid item to have a width of 12 on small screens and 6 on medium screens, this allows the grid item to be responsive */}
              <Box sx={{ mb: { xs: 3, md: 4 } }}> {/* set the margin bottom of the box to 3 on small screens and 4 on medium screens, this adds space between the box and the bottom of the page */}
                  {renderFeatureCard(feature, index, featurePalettes[feature.colourKey])} {/* render the feature card */}
              </Box>
            </Grid>
            ))}
            
            {features.slice(2, 4).map((feature, index) => ( // map over the features of the feature card
              <Grid item xs={12} md={6} key={index + 2}> {/* set the grid item to have a width of 12 on small screens and 6 on medium screens, this allows the grid item to be responsive */}
              <Box> {/* set the box to have a margin bottom of 3, this adds space between the box and the bottom of the page */}
                  {renderFeatureCard(feature, index + 2, featurePalettes[feature.colourKey])} {/* render the feature card */}
              </Box>
            </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FeatureSection; // export the FeatureSection component as the default export, this is used to make the component available to other files
