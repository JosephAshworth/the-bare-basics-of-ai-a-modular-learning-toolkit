import
  { useEffect } // import useEffect, this is used to manage the side effects of the component
from 'react';

import {
  Box, // import Box from MUI
  Container, // import Container from MUI
  Button // import Button from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import { useProgress } from '../context/ProgressContext'; // import useProgress, this is used to access the progress context, which is used to track the progress of the user

import HeroSection from '../components/FuzzyLogic/HeroSection'; // import HeroSection, which is a separate component
import InteractiveDemo from '../components/FuzzyLogic/InteractiveDemo'; // import InteractiveDemo, which is a separate component
import FuzzyLogicExplanation from '../components/FuzzyLogic/FuzzyLogicExplanation'; // import FuzzyLogicExplanation, which is a separate component
import useModuleTimer from '../hooks/useModuleTimer'; // import useModuleTimer, this is used to track the time spent on the page
import CompleteModuleButton from '../components/ModuleProgress/CompleteModuleButton'; // import CompleteModuleButton, which is a separate component
import LaunchIcon from '@mui/icons-material/Launch'; // import LaunchIcon, which is a separate component
import EthicsConsiderations from '../components/FuzzyLogic/EthicsConsiderations'; // import EthicsConsiderations, which is a separate component

const FuzzyLogicPage = () => {
  const theme = useTheme(); // for getting the MUI theme object
  
  const { updateTimeSpent } = useProgress(); // for updating the time spent on the page
  
  const { getTimeChunk } = useModuleTimer('fuzzy-logic'); // for getting the time spent on the page

  useEffect(() => {
    return () => {
      const secondsChunk = getTimeChunk ? getTimeChunk() : 0; // for getting the time chunk (the time spent on the module)
      if (secondsChunk > 0) { // if the time chunk is greater than 0
        console.log(`FuzzyLogicPage unmounting, sending ${secondsChunk}s time chunk.`); // log the time chunk
        updateTimeSpent('fuzzy-logic', secondsChunk); // update the time spent
      } else { // if the time chunk is not greater than 0
        console.log("FuzzyLogicPage unmounting, no final time chunk to send."); // log the time chunk
      }
    };
  }, [updateTimeSpent, getTimeChunk]); // use the updateTimeSpent and getTimeChunk as dependencies

  return (
    <Box sx={{ 
      display: 'flex', // display the box as a flex container
      flexDirection: 'column', // display the box as a column
      minHeight: '100vh', // set the minimum height of the box to full viewport height
      background: theme.palette.background.default // set the background colour of the box to the default colour
    }}>

      <HeroSection /> {/* display the HeroSection component */}

      <Container maxWidth="lg" sx={{ py: 4 }}> 
        <FuzzyLogicExplanation /> {/* display the FuzzyLogicExplanation component */}

        <InteractiveDemo /> {/* display the InteractiveDemo component */}

        <EthicsConsiderations /> {/* display the EthicsConsiderations component */}

        <Box
          sx={{
            display: 'flex', // display the box as a flex container
            justifyContent: 'center', // justify the content to the centre
            mt: 4, // set the margin top to 4, adding space above the box
            mb: 3 // set the margin bottom to 3, adding space below the box
          }}>
          <Button
            variant="contained" // set the variant to contained, creating a button with a solid background colour
            color="primary" // set the color to primary
            href="https://docs.google.com/forms/d/e/1FAIpQLSd6c8im9_3ICs-0X47U7jvEYV3nk7Gulng3TC2ek5GDT89rQg/viewform?usp=sharing" // set the href to the link to the quiz
            target="_blank" // set the target to blank, so the link opens in a new tab
            rel="noopener noreferrer" // set the rel to noopener noreferrer, which is a security feature that prevents the new page from accessing the window.opener property of the current page
            startIcon={<LaunchIcon />}
            sx={{ 
              textTransform: 'none', // set the text transform to none, which is used to prevent the text from being transformed
              fontSize: '1rem', // set the font size to 1rem, creating a small font
              py: 1.5, // set the padding y to 1.5 units, creating a small button
              px: 3 // set the padding x to 3 units, creating a small button
            }}
          >
            Take End of Module Quiz
          </Button>
        </Box>

        <Box mt={2} mb={4}> {/* set the margin top to 2, adding space above the box, and the margin bottom to 4, adding space below the box */}
          <CompleteModuleButton 
            moduleId="fuzzy-logic" // set the module id to fuzzy-logic
            moduleName="Fuzzy Logic" // set the module name to Fuzzy Logic
          />
        </Box>
      </Container>
    </Box>
  );
};

export default FuzzyLogicPage; // export the FuzzyLogicPage component, allowing it to be used in other files
