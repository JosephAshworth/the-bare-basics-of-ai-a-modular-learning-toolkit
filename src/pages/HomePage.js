// home page itself, with the components imported


import { 
  Box 
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

// components from the home folder
import HeroSection from '../components/Home/HeroSection';
import ModuleSlider from '../components/Home/ModuleSlider';
import FeatureSection from '../components/Home/FeatureSection';
import InstructionsDialog from '../components/Home/InstructionsDialog';

function HomePage() {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        background: theme.palette.background.default
      }}
    >

      <HeroSection />
      
      <ModuleSlider />
      <FeatureSection />
    </Box>
  );
}

export default HomePage;
