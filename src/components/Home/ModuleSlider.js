import
  React, // import React
  { useEffect } // import useEffect, this is used to manage side effects in functional components
from 'react';

import {
  Box, // import Box from MUI
  Container, // import Container from MUI
  Typography, // import Typography from MUI
  Card // import Card from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import Slider from 'react-slick'; // import Slider from react-slick, this is used to create a slider component

import "slick-carousel/slick/slick.css"; // import the slick.css file from slick-carousel, this is used to style the slider

import "slick-carousel/slick/slick-theme.css"; // import the slick-theme.css file from slick-carousel, this is used to style the slider based on the theme

import { useNavigate } from 'react-router-dom'; // import useNavigate, this is used to navigate to a different page

import { 
  MenuBook as LearningIcon, // import MenuBook as LearningIcon from MUI
  Psychology as PsychologyIcon, // import Psychology as PsychologyIcon from MUI
  DeviceHub as FuzzyIcon // import DeviceHub as FuzzyIcon from MUI
} from '@mui/icons-material';

const ModuleSlider = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // for checking if the theme is dark mode
  const navigate = useNavigate(); // for navigating to a different page

  useEffect(() => {
    const style = document.createElement('style'); // for creating a style element
    style.innerHTML = `
      .slick-arrow { 
        z-index: 10; /* for setting the z-index of the arrow to 10, this ensures the arrow is above other elements */
        width: 65px; /* for setting the width of the arrow to 65px */
        height: 65px; /* for setting the height of the arrow to 65px */
        border-radius: 50%; /* for setting the border radius of the arrow to 50%, this creates a circular arrow */
      }
      .slick-arrow::before {
        color: ${theme.palette.text.primary}; /* for setting the colour of the arrow to the primary colour of the theme */
        font-size: 40px; /* for setting the font size of the arrow to 40px */

      }
      .slick-prev {
        left: -5px; /* for setting the left position of the arrow to -5px */
      }
      .slick-next {
        right: -5px; /* for setting the right position of the arrow to -5px */
      }
      .slick-arrow:hover {
        background-color: ${theme.palette.action.hover}; /* for setting the background colour of the arrow to the hover colour of the theme */
      }
      .slick-arrow:hover::before {
        opacity: 1; /* for setting the opacity of the arrow to 1, to make the arrow visible when it is hovered over */
      }
      .slick-arrow:active {
        opacity: 0.4; /* for setting the opacity of the arrow to 0.4, this makes the arrow slightly transparent when it is active */
      }
      @media (max-width: 767px) {
        .slick-prev, .slick-next {
          top: -40px; /* for setting the top position of the arrow to -40px */
          z-index: 10; /* for setting the z-index of the arrow to 10, this ensures the arrow is above other elements */
        }
        .slick-prev {
          left: calc(50% - 150px); /* for setting the left position of the arrow to calc(50% - 150px), this centres the arrow horizontally */
        }
        .slick-next {
          right: calc(50% - 150px); /* for setting the right position of the arrow to calc(50% - 150px), this centres the arrow horizontally */
        }
      }
      .slick-dots li button:before {
        font-size: 15px !important; /* for setting the font size of the dot to 15px */
        color: ${theme.palette.text.primary} !important; /* for setting the colour of the dot to the primary colour of the theme */
      }
      .slick-dots li.slick-active button:before {
         color: ${theme.palette.primary.main} !important; /* for setting the colour of the active dot to the primary colour of the theme */
      }
    `;
    document.head.appendChild(style); // for appending the style element to the head of the document
    
    return () => {
      document.head.removeChild(style); // for removing the style element from the head of the document
    };
  }, [theme]); // for running the effect when the theme changes

  const modules = [ // define the modules array
    {
      title: 'Machine Learning', // define the title of the module
      description: 'Learn the fundamentals of machine learning algorithms and their applications.', // define the description of the module
      colourKey: 'primary', // define the colour key of the module
      icon: <LearningIcon sx={{ fontSize: 32 }} />, // define the icon of the module
      path: '/machine-learning' // define the path of the module
    },
    {
      title: 'Emotion Detection', // define the title of the module
      description: 'Explore techniques for detecting and analysing human emotions using AI.', // define the description of the module
      colourKey: 'success', // define the colour key of the module
      icon: <PsychologyIcon sx={{ fontSize: 32 }} />, // define the icon of the module
      path: '/emotion-detection' // define the path of the module
    },
    {
      title: 'Fuzzy Logic', // define the title of the module
      description: 'Understand how machines think and make decisions in the same way as humans.', // define the description of the module
      colourKey: 'warning', // define the colour key of the module
      icon: <FuzzyIcon sx={{ fontSize: 32 }} />, // define the icon of the module
      path: '/fuzzy-logic' // define the path of the module
    }
  ];

  const sliderSettings = { // define the slider settings
    dots: true, // for setting the dots to true, this displays the dots on the slider
    autoplay: true, // for setting the autoplay to true, this automatically plays the slider
    autoplaySpeed: 10000, // for setting the autoplay speed to 10000, this is the time in milliseconds between each slide
    infinite: true, // for setting the infinite to true, this allows the slider to loop
    speed: 500, // for setting the speed of the slider to 500, this is the speed in milliseconds between each slide
    slidesToShow: 1, // for setting the number of slides to show to 1, this is the number of slides to show on the slider
    slidesToScroll: 1 // for setting the number of slides to scroll to 1, this is the number of slides to scroll on the slider
  };

  return (
    <Box sx={{ 
      py: 10, // for setting the vertical padding of the box to 10, this adds space inside the box
      overflow: 'hidden' // for setting the overflow of the box to hidden, this hides any content that overflows the box
    }}>
      <Container>
        <Box>
          <Typography 
            variant="h3" // for setting the variant of the typography to h3, this is used to create a heading
            sx={{ 
              textAlign: 'center', // for setting the text alignment of the typography to centre, this centres the text
              marginBottom: 3, // for setting the margin bottom of the typography to 3, this adds space below the typography
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            Our Learning Modules
          </Typography>
          <Typography 
            variant="h6" // for setting the variant of the typography to h6, this is used to create a subheading
            sx={{ 
              textAlign: 'center', // for setting the text alignment of the typography to centre, this centres the text
              margin: '0 auto', // for setting the margin of the typography to 0 auto, this centres the text horizontally
              color: theme.palette.text.secondary // for setting the colour of the typography to the secondary colour of the theme
            }}
          >
            Structured content designed for beginners to learn at their own pace
          </Typography>
        </Box>
        <Box 
          sx={{ 
            marginTop: 10, // for setting the margin top of the box to 10, this adds space above the box
            pb: 3, // for setting the padding bottom of the box to 3, this adds space below the box
          }}
        >
          <Slider {...sliderSettings}> {/* create a slider component with the slider settings */}
            {modules.map((module, index) => { // for mapping over the modules array and creating a card for each module
              const colourPalette = theme.palette[module.colourKey] || theme.palette.primary; // for setting the colour palette of the module
              return (
                <Box key={index} sx={{ px: { xs: 2, md: 6 }, pb: 5 }}> {/* create a box component with the key of the module, the padding of the box to 2 on small screens and 6 on medium screens, and the padding bottom of the box to 5 */}
                  <Card 
                    sx={{ 
                      borderRadius: '24px', // for setting the border radius of the card to 24px, this creates a rounded card
                      padding: { xs: '32px', md: '48px' }, // for setting the padding of the card to 32px on small screens and 48px on medium screens
                      backgroundColor: theme.palette.background.paper, // for setting the background colour of the card to the paper colour of the theme
                      boxShadow: theme.shadows[isDarkMode ? 6 : 3], // for setting the box shadow of the card to the shadow of the theme
                      border: `1px solid ${theme.palette.divider}`, // for setting the border of the card to the divider colour of the theme
                      cursor: 'pointer', // for setting the cursor of the card to a pointer, this is used to indicate that the card is clickable
                      transition: 'all 0.5s ease', // for setting the transition of the card to all 0.5s ease, this is used to create a smooth transition
                      '&:hover': {
                        backgroundColor: colourPalette.main + '20', // for setting the background colour of the card to the main colour of the theme with 20% opacity when the card is hovered over
                      }
                    }}
                    onClick={() => navigate(module.path)} // for setting the onClick event of the card to navigate to the path of the module
                  >
                    <Box sx={{ 
                      display: 'flex', // for setting the display of the box to flex, this creates a flex container
                      flexDirection: 'column', // for setting the flex direction of the box to column, this stacks the child elements vertically
                      alignItems: 'center', // for setting the alignment of the box to centre, this centres the child elements horizontally
                      gap: 4 // for setting the gap of the box to 4, this adds space between the child elements
                    }}>
                      <Box className="icon-circle-bg" sx={{ 
                        bgcolor: theme.palette.mode === 'dark' ? colourPalette.main + '30' : colourPalette.light + '30', // for setting the background colour of the box to the main colour of the theme with 30% opacity when the theme is dark and the light colour of the theme with 30% opacity when the theme is light
                        borderRadius: '50%', // for setting the border radius of the box to 50%, this creates a circular box
                        width: { xs: '80px', md: '100px' }, // for setting the width of the box to 80px on small screens and 100px on medium screens
                        height: { xs: '80px', md: '100px' }, // for setting the height of the box to 80px on small screens and 100px on medium screens
                        display: 'flex', // for setting the display of the box to flex, this creates a flex container
                        alignItems: 'center', // for setting the alignment of the box to centre, this centres the child elements vertically
                        justifyContent: 'center' // for setting the justification of the box to centre, this centres the child elements horizontally
                      }}>
                        <Box sx={{ color: colourPalette.main }}> {/* create a box component with the colour of the box set to the main colour of the theme */}
                          {React.cloneElement(module.icon, { sx: { fontSize: { xs: 36, md: 48 } } })} {/* create a clone of the module icon with the font size of the icon set to 36px on small screens and 48px on medium screens */}
                      </Box>
                    </Box>
                    <Typography 
                      variant="h4" // for setting the variant of the typography to h4, this is used to create a heading
                      sx={{ 
                        fontWeight: 700, // for setting the font weight of the typography to 700, this is used to create a bold heading
                        textAlign: 'center', // for setting the text alignment of the typography to centre, this centres the text
                        color: theme.palette.text.primary, // for setting the colour of the typography to the primary colour of the theme
                        fontSize: { xs: '1.75rem', md: '2.125rem' } // for setting the font size of the typography to 1.75rem on small screens and 2.125rem on medium screens
                      }}
                      >
                        {module.title} {/* display the title of the module */}
                    </Typography>
                    <Typography 
                      variant="body1" // for setting the variant of the typography to body1, this is used to create a body text
                      sx={{ 
                        textAlign: 'center', // for setting the text alignment of the typography to centre, this centres the text
                        color: theme.palette.text.secondary, // for setting the colour of the typography to the secondary colour of the theme
                        fontSize: { xs: '1rem', md: '1.125rem' } // for setting the font size of the typography to 1rem on small screens and 1.125rem on medium screens
                      }}
                      >
                        {module.description} {/* display the description of the module */}
                    </Typography>
                  </Box>
                </Card>
              </Box>
              );
            })}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default ModuleSlider; // export the ModuleSlider component as the default export, this allows the component to be used in other files
