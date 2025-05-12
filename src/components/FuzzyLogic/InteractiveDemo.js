import
  { useState } // import useState, this is used to manage state in functional components
from 'react';

import {
  Box, // import Box from MUI
  Container, // import Container from MUI
  Typography, // import Typography from MUI
  Paper, // import Paper from MUI
  Tabs, // import Tabs from MUI
  Tab, // import Tab from MUI
  useMediaQuery // import useMediaQuery from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import ComfortScenario from './ComfortScenario'; // import ComfortScenario from the ComfortScenario.js file
import AirQualityScenario from './AirQualityScenario'; // import AirQualityScenario from the AirQualityScenario.js file
import LightComfortScenario from './LightComfortScenario'; // import LightComfortScenario from the LightComfortScenario.js file
import PlantCareScenario from './PlantCareScenario'; // import PlantCareScenario from the PlantCareScenario.js file

const InteractiveDemo = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // check if the theme is dark mode
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // check if the screen is mobile
  const [scenarioTab, setScenarioTab] = useState(0); // state variable to store the scenario tab

  const handleTabChange = (event, newValue) => {
    setScenarioTab(newValue); // set the scenario tab to the new value when the tab is changed
  };

  return (
    <Box sx={{ 
      py: 8 // set the padding of the box to 8, to add space between the top and the interactive demo
    }}>
      <Container maxWidth="lg">
        <Typography
          variant="h1" // set the variant of the typography to h1
          sx={{ 
            fontWeight: 600, // set the font weight of the typography to 600
            color: theme.palette.text.primary, // set the colour of the typography to the primary colour of the theme
            textAlign: 'center', // set the text alignment of the typography to centre
            mb: 2 // set the margin bottom of the typography to 2
          }}
        >
          Have a go at adjusting the sliders for the different scenarios below and watching how the outputs change
        </Typography>
        
        <Paper 
          elevation={isDarkMode ? 3 : 2} // set the elevation of the paper to 3 for dark mode and 2 for light mode, this is used to give the paper a shadow
          sx={{
            p: 4, // set the padding of the paper to 4
            borderRadius: '16px', // set the border radius of the paper to 16px
            maxWidth: '900px', // set the max width of the paper to 900px
            margin: '0 auto', // set the margin of the paper to 0 auto, to centre the paper
            backgroundColor: theme.palette.background.paper, // set the background colour of the paper to the background colour of the theme
            boxShadow: theme.shadows[isDarkMode ? 8 : 2] // set the box shadow of the paper to the box shadow of the theme
          }}
        >
          <Box
            sx={{
              display: 'flex', // set the display of the box to flex
              flexDirection: 'column', // set the flex direction of the box to column
              alignItems: 'center', // set the align items of the box to centre
              borderBottom: 1, // set the border bottom of the box to 1
              borderColor: theme.palette.divider, // set the border colour of the box to the divider of the theme
              mb: 2 // set the margin bottom of the box to 2
            }}
          >
            <Tabs 
              value={scenarioTab} // set the value of the tabs to the scenario tab, making sure the correct tab is selected
              onChange={handleTabChange} // set the onChange of the tabs to the handleTabChange function
              aria-label="model results tabs" // set the aria-label of the tabs to model results tabs
              orientation={isMobile ? 'vertical' : 'horizontal'} // set the orientation of the tabs to vertical for mobile and horizontal for desktop
              variant={'scrollable'} // set the variant of the tabs to scrollable
              allowScrollButtonsMobile={false} // set the allowScrollButtonsMobile of the tabs to false, to disable left and right scroll buttons on mobile
              sx={{
                width: isMobile ? '100%' : 'auto', // set the width of the tabs to 100% for mobile and auto for desktop, this is used to make the tabs take up the full width of the container
                '.MuiTab-root': {
                  alignItems: isMobile ? 'flex-start' : 'center', // set the align items of the tabs to flex-start for mobile and centre for desktop
                  minHeight: '48px', // set the min height of the tabs to 48px
                  px: isMobile ? 2 : '16px' // set the padding of the tabs to 2 for mobile and 16px for desktop
                }
              }}
            >
              <Tab label="Thermal Comfort" /> {/* set the label of the first tab to Thermal Comfort */}
              <Tab label="Air Quality" /> {/* set the label of the second tab to Air Quality */}
              <Tab label="Lighting Comfort" /> {/* set the label of the third tab to Lighting Comfort */}
              <Tab label="Plant Care" /> {/* set the label of the fourth tab to Plant Care */}
            </Tabs>
          </Box>
            {scenarioTab === 0 && <ComfortScenario />} {/* set the scenario tab 0 to the ComfortScenario component */}
            {scenarioTab === 1 && <AirQualityScenario />} {/* set the scenario tab 1 to the AirQualityScenario component */}
            {scenarioTab === 2 && <LightComfortScenario />} {/* set the scenario tab 2 to the LightComfortScenario component */}
            {scenarioTab === 3 && <PlantCareScenario />} {/* set the scenario tab 3 to the PlantCareScenario component */}
        </Paper>
      </Container>
    </Box>
  );
};

export default InteractiveDemo; // export the InteractiveDemo component, this is used to use the component in other files
