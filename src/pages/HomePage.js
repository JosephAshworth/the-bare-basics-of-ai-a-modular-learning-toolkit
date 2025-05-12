import { 
  Box // import Box from MUI
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode


import HeroSection from '../components/Home/HeroSection'; // import HeroSection from HomeSection, which is a separate component
import ModuleSlider from '../components/Home/ModuleSlider'; // import ModuleSlider from HomeSection, which is a separate component
import FeatureSection from '../components/Home/FeatureSection'; // import FeatureSection from HomeSection, which is a separate component
import InstructionsDialog from '../components/Home/InstructionsDialog'; // import InstructionsDialog from HomeSection, which is a separate component

function HomePage() {
  const theme = useTheme(); // for getting the MUI theme object

  return (
    <Box 
      sx={{ 
        background: theme.palette.background.default // set the background colour of the box to the default colour, based on the theme
      }}
    >
      <InstructionsDialog /> {/* display the InstructionsDialog component */}

      <HeroSection /> {/* display the HeroSection component */}
      
      <ModuleSlider /> {/* display the ModuleSlider component */}
      <FeatureSection /> {/* display the FeatureSection component */}

      
    </Box>
  );
}

export default HomePage; // export the HomePage component, allowing it to be used in other files
