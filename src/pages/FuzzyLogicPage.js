// fuzzy logic page itself, with the components imported

import { 
  useEffect 
} from 'react';

// material ui components
import {
  Box, 
  Container, 
  Button 
} from '@mui/material';

// theme for the app
import { useTheme } from '@mui/material/styles';

// context for the progress
import { useProgress } from '../context/ProgressContext';

// components from the fuzzy logic folder, as well as 
import HeroSection from '../components/FuzzyLogic/HeroSection';
import InteractiveDemo from '../components/FuzzyLogic/InteractiveDemo';
import FuzzyLogicExplanation from '../components/FuzzyLogic/FuzzyLogicExplanation';
import EthicsConsiderations from '../components/FuzzyLogic/EthicsConsiderations';

// hook to track the time spent on the module page
import ModuleTimer from '../hooks/ModuleTimer';

// component to complete the module
import CompleteModuleButton from '../components/CommonComponents/CompleteModuleButton';

// icon for the launch button
import LaunchIcon from '@mui/icons-material/Launch';

const FuzzyLogicPage = () => {
  const theme = useTheme();
  
  const { updateTimeSpent } = useProgress(); // update the time spent on the module page
  
  const { getTimeChunk } = ModuleTimer('fuzzy-logic'); // retrieve the time spent on the module page

  // when the component unmounts, send the time spent on the module page to the backend
  useEffect(() => {
    return () => {
      const secondsChunk = getTimeChunk ? getTimeChunk() : 0;
      if (secondsChunk > 0) {
        console.log(`FuzzyLogicPage unmounting, sending ${secondsChunk}s time chunk.`);
        updateTimeSpent('fuzzy-logic', secondsChunk);
      } else {
        console.log("FuzzyLogicPage unmounting, no final time chunk to send.");
      }
    };
  }, [updateTimeSpent, getTimeChunk]);

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      background: theme.palette.background.default
    }}>

      <HeroSection />

      <Container maxWidth="lg" sx={{ py: 4 }}> 
        <FuzzyLogicExplanation />

        <InteractiveDemo />

        <EthicsConsiderations />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            mb: 3
          }}>
          <Button
            variant="contained"
            color="primary"
            href="https://docs.google.com/forms/d/e/1FAIpQLSd6c8im9_3ICs-0X47U7jvEYV3nk7Gulng3TC2ek5GDT89rQg/viewform?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<LaunchIcon />}
            sx={{ 
              textTransform: 'none',
              fontSize: '1rem',
              py: 1.5,
              px: 3
            }}
          >
            Take End of Module Quiz
          </Button>
        </Box>

        <Box mt={2} mb={4}>
          <CompleteModuleButton 
            moduleId="fuzzy-logic"
            moduleName="Fuzzy Logic"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default FuzzyLogicPage;