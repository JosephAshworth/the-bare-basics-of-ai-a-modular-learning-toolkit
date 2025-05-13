// the section at the top of the page

// material ui components
import { 
  Grid, 
  Typography, 
  Box, 
  Container, 
  Paper 
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      py: 12, 
      position: 'relative', 
    }}>
      
      <Container>
        <Grid container spacing={6}>
          <Grid item md={6}>
            <Box>
              <Typography 
                sx={{
                  fontSize: '3.5rem', 
                  fontWeight: 800, 
                  mb: 2, 
                  lineHeight: 1.2, 
                  textAlign: 'center', 
                  color: theme.palette.text.primary 
                }}
              >
                Welcome to the Bare Basics of AI
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
                This interactive website will allow you to learn the concepts of AI in a fun and engaging way
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={theme.palette.mode === 'dark' ? 6 : 2}
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
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700, 
                      color: theme.palette.primary.main 
                    }}
                  >
                    AI
                  </Typography>
                </Box>
                <Typography 
                  sx={{
                    fontSize: '1.1rem', 
                    lineHeight: 1.6, 
                    textAlign: 'center', 
                    color: theme.palette.text.secondary 
                  }}
                >
                  Gain hands-on experience with AI concepts through practical examples
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