// the section at the top of the page

// material ui components
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper
} from '@mui/material';

import { MenuBook as LearningIcon } from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';

const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <Box sx={{ 
      py: 12,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg"> 
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h1"
                sx={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.2, // set the line height to 1.2 times the font size for better readability
                  color: theme.palette.text.primary,
                }}
              >
                Machine Learning
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
                  color: theme.palette.text.secondary,
                }}
              >
                Train and visualise machine learning models with custom datasets and parameters
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
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
                    bgcolor: theme.palette.primary.main + (isDarkMode ? '33' : '40'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3
                  }}
                >
                  <LearningIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.primary.main
                    }}
                  />
                </Box>
                <Typography 
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    color: theme.palette.text.secondary
                  }}
                >
                  Upload data, configure hyperparameters, train models, and interpret the results instantly
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