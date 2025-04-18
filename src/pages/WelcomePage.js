import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useThemeContext, themes } from '../context/ThemeContext';

// Import components
import HeroSection from '../components/Welcome/HeroSection';
import AISection from '../components/Welcome/AISection';
import TimelineSection from '../components/Welcome/TimelineSection';
import { Divider } from '@mui/material';
// import PaginationSection from '../components/Welcome/PaginationSection';
// import FooterSection from '../components/Welcome/FooterSection';

function WelcomePage() {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const isDarkMode = theme === themes.DARK;

  const handleStartLearning = () => {
    navigate('/modules');
  };

  // Hero section gradient - orange theme
  const heroGradient = isDarkMode ?
    'linear-gradient(135deg, rgb(50, 25, 5) 0%, rgb(90, 40, 0) 50%, rgb(130, 60, 0) 100%)' :
    'transparent';
    
  // AI section gradient - darker orange theme
  const aiGradient = isDarkMode ?
    'linear-gradient(to bottom, rgb(40, 20, 5) 0%, rgb(70, 30, 0) 50%, rgb(100, 45, 0) 100%)' :
    'transparent';
    
  // Timeline section gradient - darkest orange theme
  const timelineGradient = isDarkMode ?
    'linear-gradient(to bottom, rgb(40, 20, 5) 0%, rgb(70, 30, 0) 50%, rgb(100, 45, 0) 100%)' :
    'transparent';

  // Background for light mode
  const lightModeBackground = 'linear-gradient(to bottom, rgba(235, 220, 200, 0.4), rgba(255, 255, 255, 1), rgba(235, 215, 190, 0.3))';

  // Base page background
  const pageBackground = isDarkMode ? 'rgb(50, 25, 5)' : lightModeBackground;

  return (
    <Box 
      className="min-h-screen flex flex-col"
      sx={{
        background: pageBackground,
        transition: 'background 0.3s ease-in-out',
      }}
    >
      <HeroSection 
        isDarkMode={isDarkMode} 
        sectionBackground={heroGradient}
      />
      <AISection 
        isDarkMode={isDarkMode} 
        sectionBackground={aiGradient}
      />
      <TimelineSection 
        isDarkMode={isDarkMode} 
        sectionBackground={timelineGradient}
      />
      {/* <PaginationSection isDarkMode={isDarkMode} /> */}
      {/* <FooterSection isDarkMode={isDarkMode} /> */}
    </Box>
  );
}

export default WelcomePage; 