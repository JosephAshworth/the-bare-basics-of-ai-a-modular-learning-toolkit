import React from 'react';
import { Box } from '@mui/material';
import { useThemeContext, themes } from '../context/ThemeContext';

// Import components
import HeroSection from '../components/Home/HeroSection';
import ModuleSlider from '../components/Home/ModuleSlider';
import FeatureSection from '../components/Home/FeatureSection';

function HomePage() {
  const { theme } = useThemeContext();
  const isDarkMode = theme === themes.DARK;

  // Pre-computed gradients for each section - using completely different colors to verify independence
  // Hero section gradient - blue theme
  const heroGradient = isDarkMode ?
    'linear-gradient(135deg, rgb(10, 25, 41) 0%, rgb(16, 42, 67) 50%, rgb(26, 54, 93) 100%)' :
    'transparent';
    
  // Modules section gradient - darker blue theme
  const modulesGradient = isDarkMode ?
    'linear-gradient(to bottom, rgb(8, 20, 35) 0%, rgb(12, 30, 50) 50%, rgb(16, 35, 60) 100%)' :
    'transparent';
    
  // Features section gradient - darkest blue theme
  const featuresGradient = isDarkMode ?
    'linear-gradient(to bottom, rgb(8, 20, 35) 0%, rgb(12, 30, 50) 50%, rgb(16, 35, 60) 100%)' :
    'transparent';

  // Background for light mode
  const lightModeBackground = 'linear-gradient(135deg, rgba(235, 245, 255, 0.4), rgba(255, 255, 255, 1), rgba(240, 240, 250, 0.3))';

  return (
    <Box 
      className={isDarkMode ? "min-h-screen flex flex-col" : "min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-purple-50"}
      sx={{
        transition: 'background 0.3s ease-in-out',
        background: isDarkMode ? 'rgb(5, 15, 30)' : lightModeBackground,
      }}
    >
      {/* Hero Section */}
      <HeroSection 
        isDarkMode={isDarkMode} 
        sectionBackground={heroGradient}
      />

      {/* Learning Modules Section */}
      <ModuleSlider 
        isDarkMode={isDarkMode} 
        sectionBackground={modulesGradient}
      />

      {/* Why Choose Us Section */}
      <FeatureSection 
        isDarkMode={isDarkMode} 
        sectionBackground={featuresGradient}
      />
    </Box>
  );
}

export default HomePage; 