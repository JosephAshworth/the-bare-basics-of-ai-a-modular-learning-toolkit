import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';

// Import our newly created component files
import FuzzyLogicExplanation from './FuzzyLogicExplanation';
import ComfortScenario from './ComfortScenario';
import AirQualityScenario from './AirQualityScenario';
import LightComfortScenario from './LightComfortScenario';
import PlantCareScenario from './PlantCareScenario';

const InteractiveDemo = ({ isDarkMode, themeColors }) => {
  // State for scenario selection
  const [scenarioTab, setScenarioTab] = useState(0);
  
  // Default theme colors if props not provided
  const colors = themeColors || {
    primary: { main: '#1976d2', light: 'rgba(25, 118, 210, 0.1)' },
    text: { primary: '#1a1a1a', secondary: '#666' },
    background: { paper: '#ffffff', default: '#f9fafc' },
    border: { color: 'rgba(0, 0, 0, 0.12)' }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setScenarioTab(newValue);
  };

  return (
    <Box sx={{ 
      py: 8, 
      backgroundColor: colors.background.default,
      transition: 'all 0.3s ease'
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: '2.5rem',
            fontWeight: 700,
            color: colors.text.primary,
            mb: 4,
            textAlign: 'center'
          }}
        >
          Interactive Fuzzy Logic Demo
        </Typography>
        
        {/* Add the explanation section */}
        <FuzzyLogicExplanation isDarkMode={isDarkMode} themeColors={colors} />
        
        <Paper 
          elevation={isDarkMode ? 3 : 2}
          sx={{
            p: 4,
            borderRadius: '16px',
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: colors.background.paper,
            boxShadow: isDarkMode ? '0 8px 16px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          <Tabs
            value={scenarioTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Thermal Comfort" />
            <Tab label="Air Quality" />
            <Tab label="Lighting Comfort" />
            <Tab label="Plant Care" />
          </Tabs>

          {/* Scenario content */}
          {scenarioTab === 0 && <ComfortScenario isDarkMode={isDarkMode} themeColors={colors} />}
          {scenarioTab === 1 && <AirQualityScenario isDarkMode={isDarkMode} themeColors={colors} />}
          {scenarioTab === 2 && <LightComfortScenario isDarkMode={isDarkMode} themeColors={colors} />}
          {scenarioTab === 3 && <PlantCareScenario isDarkMode={isDarkMode} themeColors={colors} />}
        </Paper>
      </Container>
    </Box>
  );
};

export default InteractiveDemo; 