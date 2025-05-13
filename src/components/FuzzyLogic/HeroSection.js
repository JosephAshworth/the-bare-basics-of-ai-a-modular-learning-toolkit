// the section at the top of the page

// material ui components
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { 
  DeviceHub as FuzzyIcon
} from '@mui/icons-material'; 

const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      py: 8, // add an 8px padding at the top and bottom
      position: 'relative', // place relative to the normal position
      overflow: 'hidden'
    }}>

      <Container
        maxWidth="lg" // sets the maximum width of the container to the 'large' breakpoint
        sx={{ 
          position: 'relative'
        }}
      >
        {/* creates a grid container with a spacing of 4 between its child items, ensuring consistent gaps between grid items */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box>
              <Typography 
                variant="h1"
                sx={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  mb: 2,
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                Fuzzy Logic
              </Typography>
              <Typography 
                variant="h5"
                sx={{
                  fontSize: '1.25rem',
                  mb: 6,
                  maxWidth: '500px',
                  lineHeight: 1.5,
                  margin: '0 auto',
                  textAlign: 'center',
                  color: theme.palette.text.secondary
                }}
              >
                Discover AI that processes the 'maybe' and 'sort of' in human thinking
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={isDarkMode ? 4 : 1}
              sx={{
                p: 4,
                borderRadius: '24px',
                maxWidth: '500px',
                margin: '0 auto',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isDarkMode ? '#000000' : theme.palette.background.paper,
                boxShadow: theme.shadows[isDarkMode ? 2 : 1]
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    bgcolor: theme.palette.warning.main + (isDarkMode ? '33' : '40'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3
                  }}
                >
                  <FuzzyIcon sx={{ 
                    fontSize: 32,
                    color: theme.palette.warning.main
                  }} />
                </Box>
                <Typography 
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}
                >
                  Test out systems that imitate human thinking, and give realistic results based on this
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;