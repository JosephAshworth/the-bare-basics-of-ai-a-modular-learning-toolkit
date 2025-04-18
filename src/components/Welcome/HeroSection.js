import React from 'react';
import { Grid, Typography, Box, Container, Paper, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Accessibility styles for the HeroSection
const accessibilityStyles = {
  highContrast: {
    welcomeTitle: {
      backgroundColor: 'black',
      color: 'white',
      fontWeight: 'bold',
      padding: '4px 8px',
      borderRadius: '4px'
    },
    welcomeDescription: {
      color: 'white'
    }
  },
  largeText: {
    welcomeTitle: {
      fontSize: { xs: '2rem', md: '2.5rem' }
    },
    welcomeDescription: {
      fontSize: { xs: '1.25rem', md: '1.4rem' }
    }
  }
};

const HeroSection = ({ isDarkMode, sectionBackground }) => {
  const navigate = useNavigate();
  
  // Check if accessibility modes are enabled
  const isHighContrast = document.body.classList.contains('high-contrast-mode');
  const isLargeText = document.body.classList.contains('large-text-mode');
  const isDyslexia = document.body.classList.contains('dyslexia-friendly');

  const handleExplore = () => {
    navigate('/machine-learning');
  };

  return (
    <Box sx={{ 
      py: 12,
      position: 'relative',
      overflow: 'hidden',
      background: sectionBackground,
      borderBottom: '1px solid',
      borderColor: isDarkMode ? 'rgba(70, 45, 25, 0.2)' : 'rgba(0,0,0,0.03)',
      boxShadow: isDarkMode ? 'inset 0 -10px 20px -10px rgba(0, 0, 0, 0.6)' : 'none'
    }}>
      {/* Decorative elements that only show in dark mode */}
      {isDarkMode && (
        <>
          <Box sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 193, 87, 0.12) 0%, rgba(255, 162, 10, 0.06) 50%, transparent 70%)',
            top: '-100px',
            right: '10%',
            zIndex: 0
          }} />
          <Box sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 193, 87, 0.1) 0%, rgba(255, 162, 10, 0.05) 50%, transparent 70%)',
            bottom: '50px',
            left: '5%',
            zIndex: 0
          }} />
        </>
      )}
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  color: isDarkMode ? '#fff' : 'inherit',
                  textShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                  ...(isHighContrast && accessibilityStyles.highContrast.welcomeTitle),
                  ...(isLargeText && accessibilityStyles.largeText.welcomeTitle),
                  ...(isDyslexia && { 
                    lineHeight: 1.8,
                    letterSpacing: '0.5px'
                  })
                }}
                className="welcome-title"
              >
                Welcome to the <span style={{ 
                  color: isDarkMode ? '#ffb74d' : '#ff9800',
                  position: 'relative',
                  '&::after': isDarkMode ? {
                    content: '""',
                    position: 'absolute',
                    bottom: '-3px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: '#ffb74d',
                    opacity: 0.6
                  } : {}
                }}>Bare Basics</span> of AI
              </Typography>
              <Typography 
                variant="h5" 
                sx={{
                  fontSize: '1.25rem',
                  mb: 6,
                  maxWidth: '500px',
                  lineHeight: 1.5,
                  margin: '0 auto',
                  textAlign: 'center',
                  color: isDarkMode ? '#e0e0e0' : 'inherit',
                  ...(isHighContrast && accessibilityStyles.highContrast.welcomeDescription),
                  ...(isLargeText && accessibilityStyles.largeText.welcomeDescription),
                  ...(isDyslexia && { 
                    lineHeight: 1.8,
                    letterSpacing: '0.5px'
                  })
                }}
                className="welcome-description"
              >
                This interactive website will allow you to learn the concepts of AI in a fun and engaging way.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={isDarkMode ? 6 : 2}
              sx={{
                p: 4,
                borderRadius: '24px',
                maxWidth: '500px',
                margin: '0 auto',
                backgroundColor: isDarkMode ? 'rgba(70, 45, 25, 0.7)' : '#fff',
                transition: 'all 0.3s ease',
                backdropFilter: isDarkMode ? 'blur(10px)' : 'none',
                border: isDarkMode ? '1px solid rgba(255, 183, 77, 0.1)' : 'none',
                boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    bgcolor: isDarkMode ? 'rgba(255, 183, 77, 0.2)' : 'rgba(255, 152, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3,
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode ? '0 0 20px rgba(255, 183, 77, 0.3)' : 'none'
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDarkMode ? '#ffb74d' : '#ff9800'
                    }}
                  >
                    AI
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'center',
                    color: isDarkMode ? '#fff' : 'inherit'
                  }}
                >
                  Your Learning Journey
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    maxWidth: '400px',
                    margin: '0 auto',
                    color: isDarkMode ? '#e0e0e0' : 'inherit'
                  }}
                >
                  Gain hands-on experience with AI concepts through interactive demos and practical examples
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;