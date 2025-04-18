import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { 
  Menu as MenuIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';

const ModuleSlider = ({ isDarkMode, sectionBackground }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = React.useRef(null);
  // Access high contrast setting from context
  const { highContrast } = useThemeContext();

  // Add global styles to fix dot appearance
  useEffect(() => {
    // Add styles directly to fix the slider dots issue
    const style = document.createElement('style');
    style.innerHTML = `
      .slick-arrow {
        opacity: 0.8 !important;
      }
      .slick-arrow:hover {
        opacity: 1 !important;
      }
      
      /* High contrast slider styles */
      body.high-contrast .slick-arrow::before {
        color: var(--high-contrast-text) !important;
      }
      body.high-contrast .slick-slide {
        border: 1px solid var(--high-contrast-border) !important;
      }

      .slick-dots {
        bottom: -40px !important;
      }

      .slick-dots li button:before {
        font-size: 12px !important;
        color: ${isDarkMode ? '#fff' : '#000'} !important;
        opacity: 0.25;
        transition: all 0.3s ease;
      }

      .slick-dots li.slick-active button:before {
        opacity: 0.75;
        transform: scale(1.5);
      }

      .slick-dots li button:hover:before {
        transform: scale(1.5);
      }

      .slick-dots li button:focus {
        outline: none !important;
      }

      .slick-dots li button:focus:before {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [isDarkMode]);

  // Define theme colors based on dark mode
  const themeColors = {
    primary: {
      main: isDarkMode ? '#66ccff' : '#1976d2',
      light: isDarkMode ? 'rgba(102, 204, 255, 0.2)' : 'rgba(25, 118, 210, 0.1)'
    },
    secondary: {
      main: isDarkMode ? '#ce93d8' : '#9c27b0',
      light: isDarkMode ? 'rgba(206, 147, 216, 0.2)' : 'rgba(156, 39, 176, 0.1)'
    },
    success: {
      main: isDarkMode ? '#81c784' : '#4caf50',
      light: isDarkMode ? 'rgba(129, 199, 132, 0.2)' : 'rgba(76, 175, 80, 0.1)'
    },
    warning: {
      main: isDarkMode ? '#ffb74d' : '#ff9800',
      light: isDarkMode ? 'rgba(255, 183, 77, 0.2)' : 'rgba(255, 152, 0, 0.1)'
    }
  };

  const modules = [
    {
      title: 'Basic Machine Learning',
      description: 'Learn the fundamentals of machine learning algorithms and their applications.',
      iconBg: themeColors.primary.light,
      iconColor: themeColors.primary.main,
      icon: <MenuIcon sx={{ fontSize: 32 }} />
    },
    {
      title: 'Cost Sensitive Learning',
      description: 'Understand how to optimise learning models considering different costs and trade-offs.',
      iconBg: themeColors.secondary.light,
      iconColor: themeColors.secondary.main,
      icon: <CodeIcon sx={{ fontSize: 32 }} />
    },
    {
      title: 'Emotion Detection',
      description: 'Explore techniques for detecting and analysing human emotions using AI.',
      iconBg: themeColors.success.light,
      iconColor: themeColors.success.main,
      icon: <PsychologyIcon sx={{ fontSize: 32 }} />
    },
    {
      title: 'Fuzzy Logic',
      description: 'Master the concepts of fuzzy logic and its applications in AI systems.',
      iconBg: themeColors.warning.light,
      iconColor: themeColors.warning.main,
      icon: <MenuIcon sx={{ fontSize: 32 }} />
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    arrows: true,
    ref: sliderRef,
    beforeChange: (current, next) => setCurrentSlide(next)
  };

  return (
    <Box sx={{ 
      py: 10, 
      position: 'relative',
      background: sectionBackground,
      boxShadow: isDarkMode ? 'inset 0 -10px 20px -10px rgba(0, 0, 0, 0.6), inset 0 10px 20px -10px rgba(0, 0, 0, 0.6)' : 'none'
    }}>
      <Container maxWidth="lg" sx={{ backgroundColor: 'transparent' }}>
        <Box className="text-center mb-16">
          <Typography 
            variant="h3" 
            className="font-bold mb-4"
            sx={{ 
              animation: 'fadeInUp 0.8s ease-out',
              textAlign: 'center',
              width: '100%',
              marginBottom: 3
            }}
          >
            Our Learning Modules
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              animation: 'fadeInUp 0.8s ease-out 0.2s',
              textAlign: 'center',
              margin: '0 auto',
              maxWidth: '800px',
              color: isDarkMode ? '#e0e0e0' : 'text.secondary'
            }}
          >
            Structured content designed for beginners to learn at their own pace
          </Typography>
        </Box>
        <Box 
          sx={{ 
            position: 'relative',
            maxWidth: '1200px',
            margin: '0 auto',
            px: { xs: 2, md: 4, lg: 8 },
            pb: 6,
            '& .slick-track': {
              display: 'flex !important',
              alignItems: 'center !important',
              justifyContent: 'center !important'
            },
            '& .slick-slide': {
              display: 'flex !important',
              justifyContent: 'center !important',
              alignItems: 'center !important',
              '& > div': {
                width: '100%'
              }
            },
            '& .slick-arrow': {
              display: 'none !important'
            }
          }}
        >
          <Slider {...sliderSettings}>
            {modules.map((module, index) => (
              <Box key={index} sx={{ px: { xs: 2, md: 6 }, pb: 5 }}>
                <Card 
                  className="module-card"
                  sx={{ 
                    borderRadius: '24px',
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: { xs: '48px 24px', md: '64px 32px' },
                    textAlign: 'center',
                    minHeight: { xs: '320px', md: '380px' },
                    backgroundColor: module.iconBg,
                    boxShadow: isDarkMode ? '0 10px 20px rgba(0, 0, 0, 0.4)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    backdropFilter: isDarkMode ? 'blur(5px)' : 'none'
                  }}
                >
                  <Box sx={{ 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                  }}>
                    <Box sx={{ 
                      background: module.iconBg,
                      borderRadius: '50%',
                      width: { xs: '80px', md: '100px' },
                      height: { xs: '80px', md: '100px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 2,
                      border: `2px solid ${module.iconColor}`,
                      boxShadow: `0 5px 15px ${module.iconBg}`
                    }}>
                      <Box sx={{ color: module.iconColor }}>
                        {React.cloneElement(module.icon, { sx: { fontSize: { xs: 36, md: 48 } } })}
                      </Box>
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: 2,
                        width: '100%',
                        color: isDarkMode ? '#fff' : 'inherit',
                        fontSize: { xs: '1.75rem', md: '2.125rem' }
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        textAlign: 'center',
                        maxWidth: '500px',
                        margin: '0 auto',
                        width: '100%',
                        color: isDarkMode ? '#e0e0e0' : 'inherit',
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        lineHeight: 1.6
                      }}
                    >
                      {module.description}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default ModuleSlider; 