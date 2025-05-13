import React, { useEffect } from 'react';

// material ui components
import {
  Box,
  Container,
  Typography,
  Card
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import Slider from 'react-slick'; // a special slider that renders a carousel so items can be displayed inside it


import "slick-carousel/slick/slick.css"; // import the default styles for the slick carousel to ensure proper display
import "slick-carousel/slick/slick-theme.css"; // import the theme styles for the slick carousel to apply additional design elements

import { useNavigate } from 'react-router-dom';

import { 
  MenuBook as LearningIcon,
  Psychology as PsychologyIcon,
  DeviceHub as FuzzyIcon
} from '@mui/icons-material';

const ModuleSlider = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style'); // create a new style element
    style.innerHTML = `
      /* styling for the arrows */
      .slick-arrow { 
        z-index: 10;
        width: 65px;
        height: 65px;
        border-radius: 50%;
      }

      /* styling for the arrow icons */
      .slick-arrow::before {
        color: ${theme.palette.text.primary};
        font-size: 40px;
      }

      /* styling for the left arrow */
      .slick-prev {
        left: -5px;
      }

      /* styling for the right arrow */
      .slick-next {
        right: -5px;
      }

      .slick-arrow:hover {
        background-color: ${theme.palette.action.hover};
      }

      /* while hovering over the arrow, make the icon more opaque */
      .slick-arrow:hover::before {
        opacity: 1;
      }

      /* while being pressed, make the arrow more transparent */
      .slick-arrow:active {
        opacity: 0.4;
      }

      /* if on a small screen (767 is the typical breakpoint for this), move the arrows up and centre them */
      @media (max-width: 767px) {
        .slick-prev, .slick-next {
          top: -40px;
          z-index: 10;
        }

        /* move the left arrow to the left of the screen */
        .slick-prev {
          left: calc(50% - 150px);
        }

        /* move the right arrow to the right of the screen */
        .slick-next {
          right: calc(50% - 150px);
        }
      }

      /* styling for the dots below the slider */
      .slick-dots li button:before {
        font-size: 15px !important;
        color: ${theme.palette.text.primary} !important;
      }

      /* styling for the active dot, representing the currently selected slide */
      .slick-dots li.slick-active button:before {
         color: ${theme.palette.primary.main} !important;
      }
    `;
    document.head.appendChild(style); // append the style to the head of the document
    
    return () => {
      document.head.removeChild(style); // remove the style when the component unmounts
    };
  }, [theme]);

  const modules = [
    {
      title: 'Machine Learning',
      description: 'Learn the fundamentals of machine learning algorithms and their applications.',
      colourKey: 'primary',
      icon: <LearningIcon sx={{ fontSize: 32 }} />,
      path: '/machine-learning'
    },
    {
      title: 'Emotion Detection',
      description: 'Explore techniques for detecting and analysing human emotions using AI.',
      colourKey: 'success',
      icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
      path: '/emotion-detection'
    },
    {
      title: 'Fuzzy Logic',
      description: 'Understand how machines think and make decisions in the same way as humans.',
      colourKey: 'warning',
      icon: <FuzzyIcon sx={{ fontSize: 32 }} />,
      path: '/fuzzy-logic'
    }
  ];

  const sliderSettings = {
    dots: true, // show the dots below the slider
    autoplay: true, // automatically play the slider
    autoplaySpeed: 10000, // set the speed of the autoplay to 10 seconds
    infinite: true, // allow the slider to loop back to the first slide
    speed: 500, // set the transition speed between slides to 500 milliseconds
    slidesToShow: 1, // show only one slide at a time
    slidesToScroll: 1 // scroll to one next slide
  };

  return (
    <Box sx={{ 
      py: 10,
      overflow: 'hidden'
    }}>
      <Container>
        <Box>
          <Typography 
            variant="h3"
            sx={{ 
              textAlign: 'center',
              marginBottom: 3,
              color: theme.palette.text.primary
            }}
          >
            Our Learning Modules
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              textAlign: 'center',
              margin: '0 auto',
              color: theme.palette.text.secondary
            }}
          >
            Structured content designed for beginners to learn at their own pace
          </Typography>
        </Box>
        <Box 
          sx={{ 
            marginTop: 10,
            pb: 3,
          }}
        >
          {/* create a slider component with the specified settings */}
          <Slider {...sliderSettings}>
            {/* map over the modules and create a card for each one */}
            {modules.map((module, index) => {
              const colourPalette = theme.palette[module.colourKey] || theme.palette.primary;
              return (
                <Box key={index} sx={{ px: { xs: 2, md: 6 }, pb: 5 }}>
                  <Card 
                    sx={{ 
                      borderRadius: '24px',
                      padding: { xs: '32px', md: '48px' },
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: theme.shadows[isDarkMode ? 6 : 3],
                      border: `1px solid ${theme.palette.divider}`,
                      cursor: 'pointer',
                      transition: 'all 0.5s ease',
                      '&:hover': {
                        backgroundColor: colourPalette.main + '20' // add a tint of the module's colour when hovering over the card
                      }
                    }}
                    onClick={() => navigate(module.path)}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Box className="icon-circle-bg" sx={{ 
                        bgcolor: theme.palette.mode === 'dark' ? colourPalette.main + '30' : colourPalette.light + '30',
                        borderRadius: '50%',
                        width: { xs: '80px', md: '100px' }, // the width is 80px for small screens and 100px for medium screens
                        height: { xs: '80px', md: '100px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Box sx={{ color: colourPalette.main }}>
                          {/* clone the module's icon element, applying responsive font sizes for small and medium screens */}
                          {React.cloneElement(module.icon, { sx: { fontSize: { xs: 36, md: 48 } } })}
                      </Box>
                    </Box>
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontWeight: 700,
                        textAlign: 'center',
                        color: theme.palette.text.primary,
                        fontSize: { xs: '1.75rem', md: '2.125rem' }
                      }}
                      >
                        {module.title}
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{ 
                        textAlign: 'center',
                        color: theme.palette.text.secondary,
                        fontSize: { xs: '1rem', md: '1.125rem' }
                      }}
                      >
                        {module.description}
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

export default ModuleSlider;