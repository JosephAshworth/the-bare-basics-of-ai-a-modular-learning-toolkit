import
  React, // import React
  { useState } // import useState, this is used to manage state in functional components
from 'react';

import { 
  Box, // import Box from MUI
  Container, // import Container from MUI
  Typography, // import Typography from MUI
  Paper, // import Paper from MUI
  List, // import List from MUI
  ListItem, // import ListItem from MUI
  Collapse, // import Collapse from MUI
  Grid // import Grid from MUI
} from '@mui/material';

import {
  School as SchoolIcon, // import School as SchoolIcon from MUI
  Chat as ChatIcon, // import Chat as ChatIcon from MUI
  Visibility as VisibilityIcon, // import Visibility as VisibilityIcon from MUI
  SettingsRemote as RobotIcon, // import SettingsRemote as RobotIcon from MUI
  ExpandMore as ExpandMoreIcon, // import ExpandMore as ExpandMoreIcon from MUI
  CheckCircle as CheckCircleIcon // import CheckCircle as CheckCircleIcon from MUI
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const AISection = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // check if the theme is dark mode
  const [expandedPanels, setExpandedPanels] = useState({ // set whether the panels are expanded or not
    'panel-0': false, // set the first panel to not expanded
    'panel-1': false, // set the second panel to not expanded
    'panel-2': false, // set the third panel to not expanded
    'panel-3': false // set the fourth panel to not expanded
  });

  const handlePanelToggle = (panelId) => (event, isExpanded) => { // set the handlePanelToggle function to toggle the panel
    setExpandedPanels(prev => ({
      ...prev, // set the previous expanded panels
      [panelId]: isExpanded // set the panelId to the isExpanded value
    }));
  };

  const aiPalettes = React.useMemo(() => ({ // set the aiPalettes object to the theme primary, secondary, success, and warning colours
    learning: theme.palette.primary, // set the learning colour to the theme primary colour
    nlp: theme.palette.secondary, // set the nlp colour to the theme secondary colour
    vision: theme.palette.success, // set the vision colour to the theme success colour
    robotics: theme.palette.warning, // set the robotics colour to the theme warning colour
  }), [theme.palette.primary, theme.palette.secondary, theme.palette.success, theme.palette.warning]); // set the dependencies for the aiPalettes object

  const features = [ // define the features array
    {
      icon: <SchoolIcon />, // set the icon to the SchoolIcon
      title: 'Learning & Problem Solving', // set the title to Learning & Problem Solving
      summary: 'Systems that can learn from examples and solve complex problems.', // set the summary to Systems that can learn from examples and solve complex problems.
      points: [
        'Clear examples with practical applications', // set the point to teach about the learning and problem solving feature
        'Step-by-step learning from data patterns', // set the point to teach about the learning and problem solving feature
        'Improving accuracy with more experience' // set the point to teach about the learning and problem solving feature
      ],
      colourKey: 'learning' // set the colour to the learning feature from the aiPalettes object
    },
    {
      icon: <ChatIcon />, // set the icon to the ChatIcon
      title: 'Natural Language Processing', // set the title to Natural Language Processing
      summary: 'Understanding and generating human language.', // set the summary to Understanding and generating human language.
      points: [
        'Converting speech to text and back', // set the point to teach about the natural language processing feature
        'Translating between different languages', // set the point to teach about the natural language processing feature
        'Understanding context and meaning' // set the point to teach about the natural language processing feature
      ],
      colourKey: 'nlp' // set the colour to the nlp feature from the aiPalettes object
    },
    {
      icon: <VisibilityIcon />, // set the icon to the VisibilityIcon
      title: 'Computer Vision', // set the title to Computer Vision
      summary: 'Processing and analysing visual information.', // set the summary to Processing and analysing visual information.
      points: [
        'Identifying objects in images and videos', // set the point to teach about the computer vision feature
        'Facial recognition and emotion detection', // set the point to teach about the computer vision feature
        'Medical imaging and security applications' // set the point to teach about the computer vision feature
      ],
      colourKey: 'vision' // set the colour to the vision feature from the aiPalettes object
    },
    {
      icon: <RobotIcon />, // set the icon to the RobotIcon
      title: 'Robotics & Automation', // set the title to Robotics & Automation
      summary: 'Control and automation of physical systems.', // set the summary to Control and automation of physical systems.
      points: [
        'Autonomous navigation in physical spaces', // set the point to teach about the robotics and automation feature
        'Precision manufacturing and assembly', // set the point to teach about the robotics and automation feature
        'Human-robot collaboration systems' // set the point to teach about the robotics and automation feature
      ],
      colourKey: 'robotics' // set the colour to the robotics feature from the aiPalettes object
    }
  ];

  const renderFeatureCard = (feature, index, colourPalette) => { // set the renderFeatureCard function to render the feature card
    const { icon, title, summary, points } = feature; // set the icon, title, summary, and points to the feature
    const panelId = `panel-${index}`; // set the panelId to the index
    const isExpanded = expandedPanels[panelId]; // set the isExpanded to the expandedPanels object at the panelId index
    
    const cardStyles = {
      borderRadius: '16px', // set the border radius to 16px, this is used to create a rounded border
      width: '100%', // set the width to 100%, this is used to create a full width card
      position: 'relative', // set the position to relative, this is used to make it relative to the normal position of the card
      cursor: 'pointer', // set the cursor to pointer, this is used to create a pointer cursor when hovering over the card
      overflow: 'hidden' // set the overflow to hidden, this is used to create a hidden overflow for the card
    };
    
    return (
      <Paper 
        elevation={2} // set the elevation to 2, this is used to create a shadow for the card
        sx={cardStyles} // set the styles to the cardStyles object
        onClick={(e) => {
          handlePanelToggle(panelId)(e, !isExpanded); // set the onClick event to the handlePanelToggle function, this is used to toggle the panel
        }}
      > 
        <ExpandMoreIcon 
          sx={{ 
            position: 'absolute', // set the position to absolute, this is used to make it relative to the parent element
            top: 16, // set the top to 16, this is used to create a top margin for the icon
            right: 16, // set the right to 16, this is used to create a right margin for the icon
            color: colourPalette.main, // set the colour to the main colour from the colourPalette object
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', // set the transform to rotate the icon 180 degrees if the panel is expanded and 0 degrees if the panel is not expanded
            transition: 'transform 0.3s ease', // set the transition to transform 0.3s ease, this is used to create a smooth transition for the icon
            zIndex: 2 // set the zIndex to 2, to make the icon appear on top of the card
          }}
        />
        
        <Box sx={{ pb: 2, px: 3 }}> {/* set the padding bottom to 2, and the padding left and right to 3, this is used to create a padding for the card */}
          <Box sx={{ 
            minHeight: '250px', // set the min height to 250px, this is used to create a minimum height for the card
            display: 'flex', // set the display to flex, this is used to create a flex container
            flexDirection: 'column', // set the flex direction to column, this is used to create a vertical flex container
            justifyContent: 'center', // set the justify content to centre, this is used to centre the content of the card
          }}>
            <Box 
              sx={{ 
                display: 'flex', // set the display to flex, this is used to create a flex container
                alignItems: 'center', // set the align items to centre, this is used to centre the content of the card
                justifyContent: 'center', // set the justify content to centre, this is used to centre the content of the card
                width: '80px', // set the width to 80px, this is used to create a width for the card
                height: '80px', // set the height to 80px, this is used to create a height for the card
                borderRadius: '50%', // set the border radius to 50%, this is used to create a circular border
                bgcolor: isDarkMode ? colourPalette.main + '30' : colourPalette.light + '30', // set the background colour to the main colour from the colourPalette object with 30% opacity if the theme is dark mode and the light colour from the colourPalette object with 30% opacity if the theme is light mode
                mb: 3, // set the margin bottom to 3, this is used to create a margin for the card 
                mt: 1, // set the margin top to 1, this is used to create a margin for the card
                mx: 'auto' // set the margin left and right to auto, this is used to centre the content of the card
              }}
            >
              <Box sx={{ 
                color: colourPalette.main, // set the colour to the main colour from the colourPalette object
              }}>
                {icon} {/* set the icon to the icon from the feature */}
              </Box>
            </Box>
            
            <Typography 
              sx={{ 
                fontWeight: 700, // set the font weight to 700, this is used to create a bold font
                fontSize: '1.4rem', // set the font size to 1.4rem, this is used to create a large font size
                mb: 2, // set the margin bottom to 2, this is used to create a margin for the card
                color: colourPalette.main, // set the colour to the main colour from the colourPalette object
              }}
            >
              {title} {/* set the title to the title from the feature */}
            </Typography>
            
            <Typography 
              sx={{ 
                fontSize: '1.1rem', // set the font size to 1.1rem, this is used to create a large font size
                lineHeight: 1.4, // set the line height to 1.4, this is used to create a line height for the card
                color: theme.palette.text.secondary, // set the colour to the secondary colour from the theme object
              }}
            >
              {summary} {/* set the summary to the summary from the feature */}
            </Typography>
          </Box>
          
          <Collapse in={isExpanded}> {/* set the collapse to the isExpanded value, this is used to create a collapse for the card */}
            <Box sx={{ mt: 3, pb: 2 }}> {/* set the margin top to 3, and the padding bottom to 2, this is used to create a margin and padding for the card */}
              <List disablePadding> {/* set the disable padding to true, this is used to create a list without padding */}
                {points.map((point, i) => ( // set the points to the points from the feature
                  <ListItem 
                    key={i} // set the key to the index
                    sx={{ 
                      py: 0.8, // set the padding y to 0.8, this is used to create a padding for the card
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        mr: 2, // set the margin right to 2, this is used to create a margin for the card
                        mt: 0.5, // set the margin top to 0.5, this is used to create a margin for the card
                        color: colourPalette.main, // set the colour to the main colour from the colourPalette object
                      }}
                    />
                    <Typography 
                      sx={{ 
                        color: theme.palette.text.secondary, // set the colour to the secondary colour from the theme object
                      }}
                    >
                      {point} {/* set the point to the point from the feature */}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ 
      py: 8, // set the padding y to 8, this is used to create a padding for the box
    }}>
      <Container sx={{ textAlign: 'center', backgroundColor: 'transparent' }}> {/* set the text alignment to centre, and the background colour to transparent, this is used to create a container for the box */}
        <Box className="text-center" sx={{ mb: 6 }}> {/* set the text alignment to centre, and the margin bottom to 6, this is used to create a margin for the box */}
          <Typography 
            variant="h3" // set the variant to h3, this is used to create a large heading
            sx={{ 
              animation: 'fadeInUp 0.8s ease-out', // set the animation to fadeInUp 0.8s ease-out, this is used to create a fade in animation for the heading
              textAlign: 'center', // set the text alignment to centre, this is used to centre the heading
              marginBottom: 3, // set the margin bottom to 3, this is used to create a margin for the heading
              color: theme.palette.text.primary, // set the colour to the primary colour from the theme object
            }}
          >
            What is Artificial Intelligence?
          </Typography>
          
          <Typography 
            variant="h6" // set the variant to h6, this is used to create a small heading
            sx={{ 
              animation: 'fadeInUp 0.8s ease-out 0.2s', // set the animation to fadeInUp 0.8s ease-out 0.2s, this is used to create a fade in animation for the heading
              textAlign: 'center', // set the text alignment to centre, this is used to centre the heading
              margin: '0 auto', // set the margin to 0 auto, this is used to centre the heading
              maxWidth: '800px', // set the max width to 800px, this is used to create a max width for the heading
              color: theme.palette.text.secondary, // set the colour to the secondary colour from the theme object
            }}
          >
            Artificial Intelligence (AI) refers to computer systems that can perform tasks that typically require human intelligence. These tasks include:
          </Typography>
        </Box>
        
        <Grid container spacing={4}> {/* set the container to a grid, this is used to create a grid layout */}
          <Grid item xs={12} md={6}> {/* set the grid item to 12 on small screens and 6 on medium screens, this is used to create a grid layout */}
            <Box sx={{ width: '100%', mb: 4 }}> {/* set the width to 100%, and the margin bottom to 4, this is used to create a margin for the box that fills the width of the container */}
              {renderFeatureCard(features[0], 0, aiPalettes[features[0].colourKey])} {/* set the renderFeatureCard function to render the feature card, this is used to render the feature card */}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}> {/* set the grid item to 12 on small screens and 6 on medium screens, this is used to create a grid layout */}
            <Box sx={{ width: '100%', mb: 4 }}> {/* set the width to 100%, and the margin bottom to 4, this is used to create a margin for the box that fills the width of the container */}
              {renderFeatureCard(features[1], 1, aiPalettes[features[1].colourKey])} {/* set the renderFeatureCard function to render the feature card, this is used to render the feature card */}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%', mb: 4 }}>
              {renderFeatureCard(features[2], 2, aiPalettes[features[2].colourKey])}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}> {/* set the grid item to 12 on small screens and 6 on medium screens, this is used to create a grid layout */}
            <Box sx={{ width: '100%' }}> {/* set the width to 100%, this is used to create a full width box */}
              {renderFeatureCard(features[3], 3, aiPalettes[features[3].colourKey])} {/* set the renderFeatureCard function to render the feature card, this is used to render the feature card */}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AISection; // export the AISection component as the default export, this is used to allow the component to be used in other files
