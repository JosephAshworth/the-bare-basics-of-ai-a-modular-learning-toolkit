import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Psychology as PsychologyIcon } from '@mui/icons-material';

const HeroSection = ({ isDarkMode }) => {
  // Define orange theme colors with different values based on light/dark mode
  const orangeTheme = {
    primary: isDarkMode ? '#ff9d4d' : '#ff7d24', // Orange highlight color, lighter in dark mode for better visibility
    gradient: {
      from: isDarkMode ? '#2d1c0e' : '#fff8f0', // Gradient starting color, dark brown in dark mode, light peach in light mode
      via: isDarkMode ? '#3c2614' : '#fffbf6', // Gradient middle color, medium brown in dark mode, off-white in light mode
      to: isDarkMode ? '#4a2e19' : '#fff0e0' // Gradient ending color, lighter brown in dark mode, light orange in light mode
    },
    text: {
      highlight: isDarkMode ? '#ff9d4d' : '#ff7d24', // Text highlight color matching primary theme color
      primary: isDarkMode ? '#ffffff' : '#1a1a1a', // Main text color, white in dark mode, near-black in light mode
      secondary: isDarkMode ? '#e0e0e0' : '#666' // Secondary text color, light gray in dark mode, medium gray in light mode
    },
    background: {
      card: isDarkMode ? 'rgba(255, 120, 50, 0.15)' : '#fff8f0', // Card background color, translucent orange in dark mode, light orange in light mode
      icon: isDarkMode ? 'rgba(255, 157, 77, 0.2)' : '#fff0e0' // Icon background color, translucent orange in dark mode, light orange in light mode
    }
  };

  return (
    <Box sx={{ 
      // Create a gradient background that changes based on dark/light mode
      background: isDarkMode ? 
        `linear-gradient(135deg, ${orangeTheme.gradient.from} 0%, ${orangeTheme.gradient.via} 50%, ${orangeTheme.gradient.to} 100%)` : 
        `linear-gradient(135deg, ${orangeTheme.gradient.from} 0%, ${orangeTheme.gradient.via} 50%, ${orangeTheme.gradient.to} 100%)`,
      py: 12, // Add vertical padding of 12 units (96px) to create space around content
      position: 'relative', // Set position to relative for potential absolute positioning of children
      overflow: 'hidden', // Hide any content that overflows the box
      transition: 'all 0.3s ease' // Add smooth transition for all property changes
    }}>
      <Container maxWidth="lg"> {/* Contain content to large width with responsive margins */}
        <Grid container spacing={6} alignItems="center"> {/* Create a responsive grid layout with centered alignment and 48px spacing */}
          <Grid item xs={12} md={6}> {/* Left column: full width on mobile, half width on medium+ screens */}
            <Box sx={{ textAlign: 'center' }}> {/* Center-align all text in this box */}
              <Typography 
                variant="h1" // Use h1 variant for main heading
                sx={{
                  fontSize: '3.5rem', // Set specific font size of 3.5rem (56px)
                  fontWeight: 800, // Set extra bold font weight
                  color: orangeTheme.text.primary, // Use theme-specific text color
                  mb: 2, // Add margin bottom of 2 units (16px)
                  lineHeight: 1.2, // Set line height for better readability
                  textAlign: 'center', // Center align the text
                  transition: 'color 0.3s ease' // Add smooth transition for color changes
                }}
              >
                Emotion <span style={{ color: orangeTheme.text.highlight }}>Analysis</span> AI {/* Main heading with highlighted middle word */}
              </Typography>
              <Typography 
                variant="h5" // Use h5 variant for subheading
                sx={{
                  fontSize: '1.25rem', // Set specific font size of 1.25rem (20px)
                  color: orangeTheme.text.secondary, // Use theme-specific secondary text color
                  mb: 6, // Add margin bottom of 6 units (48px)
                  maxWidth: '500px', // Limit width to 500px for better readability
                  lineHeight: 1.5, // Set line height for better readability
                  margin: '0 auto', // Center the element horizontally
                  textAlign: 'center', // Center align the text
                  transition: 'color 0.3s ease' // Add smooth transition for color changes
                }}
              >
                Analyze emotions from faces, text, and speech using state-of-the-art AI models {/* Descriptive subheading */}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}> {/* Right column: full width on mobile, half width on medium+ screens */}
            <Paper
              elevation={isDarkMode ? 6 : 2} // Higher elevation in dark mode for better shadow effect
              sx={{
                p: 4, // Add padding of 4 units (32px) around content
                borderRadius: '24px', // Round corners with 24px radius
                background: orangeTheme.background.card, // Use theme-specific card background color
                border: isDarkMode ? '1px solid rgba(255,157,77,0.2)' : '1px solid rgba(255,125,36,0.1)', // Add subtle themed border
                maxWidth: '500px', // Limit width to 500px
                margin: '0 auto', // Center the element horizontally
                boxShadow: isDarkMode ? '0 8px 16px rgba(255, 120, 50, 0.2)' : '0 4px 8px rgba(255, 125, 36, 0.15)', // Add themed shadow effect
                backdropFilter: isDarkMode ? 'blur(8px)' : 'none', // Add blur effect in dark mode
                transition: 'all 0.3s ease' // Add smooth transition for all property changes
              }}
            >
              <Box sx={{ textAlign: 'center' }}> {/* Center-align all content in this box */}
                <Box
                  sx={{
                    width: '64px', // Set width to 64px
                    height: '64px', // Set height to 64px
                    borderRadius: '50%', // Make it circular
                    background: orangeTheme.background.icon, // Use theme-specific icon background color (fixed the undefined variable)
                    display: 'flex', // Use flexbox for centering
                    alignItems: 'center', // Center vertically
                    justifyContent: 'center', // Center horizontally
                    margin: '0 auto', // Center the element in its container
                    mb: 3, // Add margin bottom of 3 units (24px)
                    transition: 'background-color 0.3s ease', // Add smooth transition for background color changes
                    boxShadow: isDarkMode ? '0 0 20px #964610' : 'none' // Add glow effect in dark mode
                  }}
                >
                  <PsychologyIcon sx={{ 
                    fontSize: 32, // Set icon size to 32px
                    color: orangeTheme.primary, // Use theme-specific primary color
                    transition: 'color 0.3s ease' // Add smooth transition for color changes
                  }} />
                </Box>
                <Typography 
                  variant="h4" // Use h4 variant for card heading
                  sx={{ 
                    fontWeight: 700, // Set bold font weight
                    color: orangeTheme.text.primary, // Use theme-specific text color
                    mb: 2, // Add margin bottom of 2 units (16px)
                    textAlign: 'center', // Center align the text
                    transition: 'color 0.3s ease' // Add smooth transition for color changes
                  }}
                >
                  Multi-Modal Analysis {/* Card heading */}
                </Typography>
                <Typography 
                  variant="body1" // Use body1 variant for card description
                  sx={{
                    color: orangeTheme.text.secondary, // Use theme-specific secondary text color
                    fontSize: '1.1rem', // Set specific font size of 1.1rem (17.6px)
                    lineHeight: 1.6, // Set line height for better readability
                    textAlign: 'center', // Center align the text
                    maxWidth: '400px', // Limit width to 400px for better readability
                    margin: '0 auto', // Center the element horizontally
                    transition: 'color 0.3s ease' // Add smooth transition for color changes
                  }}
                >
                  Analyze emotions from facial expressions, written text, and spoken words using specialized AI models {/* Card description */}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; // Export the component for use in other files 