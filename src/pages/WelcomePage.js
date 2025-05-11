import { Box } from '@mui/material'; // import Box from MUI
import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import HeroSection from '../components/Welcome/HeroSection'; // import the HeroSection, which is a separate component
import AISection from '../components/Welcome/AISection'; // import the AISection, which is a separate component
import TimelineSection from '../components/Welcome/TimelineSection'; // import the TimelineSection, which is a separate component

function WelcomePage() {
  const theme = useTheme(); // for getting the MUI theme object

  return (
    <Box 
      sx={{
        background: theme.palette.background.default // set the background color of the box to the default background color based on the theme
      }}
    >
      <HeroSection /> {/* render the HeroSection */}

      <AISection /> {/* render the AISection */}

      <TimelineSection /> {/* render the TimelineSection */}
    </Box>
  );
}

export default WelcomePage; // export the WelcomePage component as the default export, this allows the component to be used in other files
