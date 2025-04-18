import React from 'react';
import { Box, Typography, Divider, Container } from '@mui/material';
import HeroSection from '../components/FuzzyLogic/HeroSection';
import InteractiveDemo from '../components/FuzzyLogic/InteractiveDemo';
import ProgressTracker from '../components/ModuleProgress/ProgressTracker';
import { useThemeContext } from '../context/ThemeContext';
import useModuleTimer from '../hooks/useModuleTimer';

const FuzzyLogicPage = () => {
  const { theme } = useThemeContext();
  const isDarkMode = theme === 'dark';
  
  // Track time spent on this module
  useModuleTimer('fuzzy-logic');
  
  // Define theme colors based on dark mode with blue theme for fuzzy logic
  const themeColors = {
    primary: {
      main: isDarkMode ? '#64b5f6' : '#1976d2', // Blue highlight
      light: isDarkMode ? 'rgba(100, 181, 246, 0.2)' : 'rgba(25, 118, 210, 0.1)'
    },
    background: {
      gradient: isDarkMode ? 
        `linear-gradient(135deg, #0d2b45 0%, #103a5e 100%)` : 
        `linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)`,
      paper: isDarkMode ? '#103152' : '#ffffff',
      default: isDarkMode ? '#081c2e' : '#f8f9ff'
    },
    text: {
      primary: isDarkMode ? '#ffffff' : '#1a1a1a',
      secondary: isDarkMode ? '#e0e0e0' : '#666666'
    },
    border: {
      color: isDarkMode ? 'rgba(100, 181, 246, 0.12)' : 'rgba(25, 118, 210, 0.12)'
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: themeColors.background.gradient,
      transition: 'all 0.3s ease'
    }}>
      <HeroSection isDarkMode={isDarkMode} themeColors={themeColors} />
      <InteractiveDemo isDarkMode={isDarkMode} themeColors={themeColors} />

      {/* Module completion button */}
      <Container maxWidth="lg" sx={{ mt: 'auto', mb: 6 }}>
        <ProgressTracker 
          moduleId="fuzzy-logic" 
          moduleName="Fuzzy Logic" 
        />
      </Container>
    </Box>
  );
};

export default FuzzyLogicPage; 