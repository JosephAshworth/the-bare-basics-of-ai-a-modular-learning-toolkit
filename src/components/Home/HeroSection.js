// the section at the top of the page

// material ui components
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { 
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';

// programmatic navigation
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/welcome'); 
  };

  return (
    <Box sx={{
      py: 12,
      position: 'relative',
      overflow: 'hidden'
    }}>

      <Container
        sx={{ 
          position: 'relative',
          zIndex: 1
        }}
      >
        <Grid container spacing={6} alignItems="center">
          <Grid item md={6} xs={12}>
            <Box>
              <Typography 
                variant="h1"
                sx={{ 
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  color: theme.palette.text.primary
                }}
              >
                Learn AI the Modular Way
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
                Master artificial intelligence through our structured, beginner-friendly learning modules designed for everyone
              </Typography>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                mt: 4
              }}>
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={handleGetStarted}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    boxShadow: theme.shadows[3],
                    '&:hover': {
                      transform: 'translateY(-2px)', // move the button up when hovered over
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  Get Started <ArrowForwardIcon sx={{ ml: 1 }} />
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Paper
              elevation={isDarkMode ? 6 : 2}
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

              
              <Box>
                <Box
                  sx={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main + (isDarkMode ? '33' : '40'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3
                    
                  }}
                >
                  <SparkleIcon 
                    sx={{ 
                      fontSize: 32,
                      color: theme.palette.primary.main
                    }} 
                  />
                </Box>
                <Typography 
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    color: theme.palette.text.secondary
                  }}
                >
                  From fundamental concepts to advanced techniques in 3 comprehensive modules
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