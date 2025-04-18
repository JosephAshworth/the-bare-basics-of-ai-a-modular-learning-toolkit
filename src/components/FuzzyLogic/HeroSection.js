import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { 
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';

const HeroSection = ({ isDarkMode, sectionBackground, title, description }) => {
  // Default colors if not provided
  const defaultPrimaryColor = isDarkMode ? '#66ccff' : '#1976d2';

  return (
    <Box sx={{ 
      py: 8,
      position: 'relative',
      overflow: 'hidden',
      background: sectionBackground,
      boxShadow: isDarkMode ? 'inset 0 -10px 20px -10px rgba(0, 0, 0, 0.6)' : 'none'
    }}>
      {isDarkMode && (
        <>
          <Box sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 204, 255, 0.1) 0%, rgba(25, 118, 210, 0.05) 50%, transparent 70%)',
            top: '-100px',
            right: '10%',
            zIndex: 0
          }} />
        </>
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box>
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  mb: 2,
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                Learn Fuzzy Logic Fundamentals
              </Typography>
              <Typography 
                variant="h5" 
                sx={{
                  fontSize: '1.25rem', // Set specific font size of 1.25rem (20px)
                  mb: 6, // Add margin bottom of 6 units (48px)
                  maxWidth: '500px', // Limit width to 500px for better readability
                  lineHeight: 1.5, // Set line height for better readability
                  margin: '0 auto', // Center the element horizontally
                  textAlign: 'center', // Center align the text
                  transition: 'color 0.3s ease', // Add smooth transition for color changes
                  color: '#666',
                }}
              >
                Master the concepts of fuzzy logic through our structured, beginner-friendly learning path
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={isDarkMode ? 4 : 1}
              sx={{
                p: 4, // Add padding of 4 units (32px) around content
                borderRadius: '24px', // Round corners with 24px radius
                maxWidth: '500px', // Limit width to 500px
                margin: '0 auto', // Center the element horizontally
                transition: 'all 0.3s ease' // Add smooth transition for all property changes
              }}
            >
              <Box sx={{ textAlign: 'center' }}> {/* Center-align all content in this box */}
                <Box
                  sx={{
                    width: '64px', // Set width to 64px
                    height: '64px', // Set height to 64px
                    borderRadius: '50%', // Make it circular
                    background: isDarkMode ? 'rgba(102, 204, 255, 0.2)' : 'rgba(25, 118, 210, 0.1)',
                    display: 'flex', // Use flexbox for centering
                    alignItems: 'center', // Center vertically
                    justifyContent: 'center', // Center horizontally
                    margin: '0 auto', // Center the element in its container
                    mb: 3, // Add margin bottom of 3 units (24px)
                    transition: 'background-color 0.3s ease', // Add smooth transition for background color changes
                    boxShadow: isDarkMode ? '0 0 20px rgba(102, 204, 255, 0.3)' : 'none' // Add glow effect in dark mode
                  }}
                >
                  <SparkleIcon sx={{ 
                    fontSize: 32, // Set icon size to 32px
                    color: defaultPrimaryColor, // Use theme-specific primary color
                    transition: 'color 0.3s ease' // Add smooth transition for color changes
                  }} />
                </Box>
                <Typography 
                  variant="h4" // Use h4 variant for card heading
                  sx={{ 
                    fontWeight: 700, // Set bold font weight
                    color: isDarkMode ? '#fff' : 'inherit',
                    mb: 2, // Add margin bottom of 2 units (16px)
                    textAlign: 'center', // Center align the text
                    transition: 'color 0.3s ease' // Add smooth transition for color changes
                  }}
                >
                  Your Fuzzy Logic Journey
                </Typography>
                <Typography 
                  variant="body1" // Use body1 variant for card description
                  sx={{
                    color: isDarkMode ? '#e0e0e0' : 'inherit',
                    fontSize: '1.1rem', // Set specific font size of 1.1rem (17.6px)
                    lineHeight: 1.6, // Set line height for better readability
                    textAlign: 'center', // Center align the text
                    maxWidth: '400px', // Limit width to 400px for better readability
                    margin: '0 auto', // Center the element horizontally
                    transition: 'color 0.3s ease' // Add smooth transition for color changes
                  }}
                >
                  Learn fuzzy logic through comprehensive modules designed to take you from the basic concepts to advanced applications.
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