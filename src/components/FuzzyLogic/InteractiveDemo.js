// contain all the scenarios for the interactive demo into one component

import { useState } from 'react';

// material ui components
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  useMediaQuery
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ComfortScenario from './ComfortScenario';
import AirQualityScenario from './AirQualityScenario';
import LightComfortScenario from './LightComfortScenario';
import PlantCareScenario from './PlantCareScenario';

const InteractiveDemo = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [scenarioTab, setScenarioTab] = useState(0); // default to the first tab (thermal comfort)

  const handleTabChange = (event, newValue) => {
    setScenarioTab(newValue);
  };

  return (
    <Box sx={{ 
      py: 8
    }}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            textAlign: 'center',
            mb: 2
          }}
        >
          Have a go at adjusting the sliders for the different scenarios below and watching how the outputs change
        </Typography>
        
        <Paper 
          elevation={isDarkMode ? 3 : 2}
          sx={{
            p: 4,
            borderRadius: '16px',
            maxWidth: '900px',
            margin: '0 auto', // centre the element horizontally
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[isDarkMode ? 8 : 2]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderBottom: 1,
              borderColor: theme.palette.divider,
              mb: 2
            }}
          >
            <Tabs 
              value={scenarioTab}
              onChange={handleTabChange}
              aria-label="model results tabs"
              orientation={isMobile ? 'vertical' : 'horizontal'}
              variant={'scrollable'}
              allowScrollButtonsMobile={false}
              sx={{
                width: isMobile ? '100%' : 'auto',
                '.MuiTab-root': {
                  alignItems: isMobile ? 'flex-start' : 'center',
                  minHeight: '48px',
                  px: isMobile ? 2 : '16px'
                }
              }}
            >
              <Tab label="Thermal Comfort" />
              <Tab label="Air Quality" />
              <Tab label="Lighting Comfort" />
              <Tab label="Plant Care" />
            </Tabs>
          
          {/* render the appropriate scenario when the tab is selected */}
          </Box>
            {scenarioTab === 0 && <ComfortScenario />}
            {scenarioTab === 1 && <AirQualityScenario />}
            {scenarioTab === 2 && <LightComfortScenario />}
            {scenarioTab === 3 && <PlantCareScenario />}
        </Paper>
      </Container>
    </Box>
  );
};

export default InteractiveDemo;