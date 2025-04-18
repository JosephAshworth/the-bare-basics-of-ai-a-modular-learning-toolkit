import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab, Paper, Typography } from '@mui/material';
import {
  Face as FaceIcon,
  TextFields as TextFieldsIcon,
  AudioFile as AudioFileIcon
} from '@mui/icons-material';
import FaceEmotionTab from '../components/EmotionDetection/FaceEmotionTab';
import TextEmotionTab from '../components/EmotionDetection/TextEmotionTab';
import AudioEmotionTab from '../components/EmotionDetection/AudioEmotionTab';
import TechnologyExplanation from '../components/EmotionDetection/TechnologyExplanation';
import HowItWorksSection from '../components/EmotionDetection/HowItWorksSection';
import HeroSection from '../components/EmotionDetection/HeroSection';
import TechnologyOverview from '../components/EmotionDetection/TechnologyOverview';
import { useThemeContext } from '../context/ThemeContext';
import CompleteModuleButton from '../components/ModuleProgress/CompleteModuleButton';
import { Divider } from '@mui/material';
import useModuleTimer from '../hooks/useModuleTimer';
import ProgressTracker from '../components/ModuleProgress/ProgressTracker';

const EmotionDetectionPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { theme } = useThemeContext();
  const isDarkMode = theme === 'dark';
  
  // Define theme colors based on dark mode with orange theme
  const themeColors = {
    primary: {
      main: isDarkMode ? '#ff9d4d' : '#ff7d24', // Orange highlight
      light: isDarkMode ? 'rgba(255, 157, 77, 0.2)' : 'rgba(255, 125, 36, 0.1)'
    },
    background: {
      gradient: isDarkMode ? 
        `linear-gradient(to bottom, #2d1c0e 0%, #3c2614 50%, #4a2e19 100%)` : 
        `linear-gradient(to bottom, #fff8f0 0%, #fffbf6 50%, #fff0e0 100%)`,
      paper: isDarkMode ? '#2d1c0e' : '#ffffff',
      default: isDarkMode ? '#1c1008' : '#fff8f0'
    },
    text: {
      primary: isDarkMode ? '#ffffff' : '#1a1a1a',
      secondary: isDarkMode ? '#e0e0e0' : '#666666'
    },
    border: {
      color: isDarkMode ? 'rgba(255, 157, 77, 0.12)' : 'rgba(255, 125, 36, 0.12)'
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Track time spent on this module
  useModuleTimer('emotion-detection');

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: themeColors.background.gradient,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Hero Section - Pass isDarkMode prop */}
      <HeroSection isDarkMode={isDarkMode} />

      {/* Technology Overview Section with Dropdowns */}
      <TechnologyOverview isDarkMode={isDarkMode} themeColors={themeColors} />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          elevation={isDarkMode ? 3 : 1}
          sx={{ 
            borderRadius: '16px',
            backgroundColor: themeColors.background.paper,
            mb: 6,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode ? '0 8px 16px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: themeColors.border.color, 
            mb: 0
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              centered
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: themeColors.primary.main,
                },
                '& .MuiTab-root': {
                  outline: 'none !important',
                },
                '& .MuiTab-root.Mui-selected': {
                  color: themeColors.primary.main,
                },
                '& .MuiTabs-flexContainer button': {
                  '&:focus-visible': {
                    outline: 'none',
                  },
                },
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'
              }}
            >
            <Tab 
              icon={<FaceIcon />} 
              label="Face Emotion" 
              iconPosition="start"
              sx={{ 
                fontWeight: 600, 
                fontSize: '1rem', 
                textTransform: 'none',
                minHeight: 48,
                outline: 'none',
                color: isDarkMode ? themeColors.text.secondary : 'inherit',
                '&.Mui-selected': {
                  color: themeColors.primary.main,
                },
                '&:focus': {
                  outline: 'none'
                },
                '&:focus-visible': {
                  outline: 'none'
                }
              }} 
            />
            <Tab 
              icon={<TextFieldsIcon />} 
              label="Text Emotion" 
              iconPosition="start"
              sx={{ 
                fontWeight: 600, 
                fontSize: '1rem', 
                textTransform: 'none',
                minHeight: 48,
                outline: 'none',
                color: isDarkMode ? themeColors.text.secondary : 'inherit',
                '&.Mui-selected': {
                  color: themeColors.primary.main,
                },
                '&:hover': {
                  color: themeColors.primary.main,
                  opacity: 0.8
                },
                '&:focus': {
                  outline: 'none'
                },
                '&:focus-visible': {
                  outline: 'none'
                }
              }} 
            />
            <Tab 
              icon={<AudioFileIcon />} 
              label="Audio Emotion" 
              iconPosition="start"
              sx={{ 
                fontWeight: 600, 
                fontSize: '1rem', 
                textTransform: 'none',
                minHeight: 48,
                outline: 'none',
                color: isDarkMode ? themeColors.text.secondary : 'inherit',
                '&.Mui-selected': {
                  color: themeColors.primary.main,
                },
                '&:hover': {
                  color: themeColors.primary.main,
                  opacity: 0.8
                },
                '&:focus': {
                  outline: 'none'
                },
                '&:focus-visible': {
                  outline: 'none'
                }
              }} 
            />
          </Tabs>
        </Box>
        
        {/* Tab content container */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Face Emotion Tab */}
        <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
              <FaceEmotionTab isDarkMode={isDarkMode} themeColors={themeColors} />
        </Box>
        
        {/* Text Emotion Tab */}
        <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
              <TextEmotionTab isDarkMode={isDarkMode} themeColors={themeColors} />
        </Box>
        
        {/* Audio Emotion Tab */}
        <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
              <AudioEmotionTab isDarkMode={isDarkMode} themeColors={themeColors} />
            </Box>
        </Box>
        </Paper>
        
        {/* How it works section */}
        <HowItWorksSection isDarkMode={isDarkMode} themeColors={themeColors} />
        
        {/* Technology Explanation Accordion */}
        <TechnologyExplanation isDarkMode={isDarkMode} themeColors={themeColors} />

        {/* Module completion button */}
        <ProgressTracker 
          moduleId="emotion-detection" 
          moduleName="Emotion Detection" 
        />
      </Container>
    </Box>
  );
};

export default EmotionDetectionPage; 