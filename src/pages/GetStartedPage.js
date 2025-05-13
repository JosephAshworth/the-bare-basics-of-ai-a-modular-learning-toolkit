// get started page itself, with the components imported

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// components from the welcome folder
import HeroSection from '../components/Welcome/HeroSection';
import AISection from '../components/Welcome/AISection';
import TimelineSection from '../components/Welcome/TimelineSection';

function WelcomePage() {
  const theme = useTheme();

  return (
    <Box 
      sx={{
        background: theme.palette.background.default
      }}
    >
      <HeroSection />

      <AISection />

      <TimelineSection />
    </Box>
  );
}

export default WelcomePage;