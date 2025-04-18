import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ isDarkMode, sectionBackground }) => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/welcome');
  };

  return (
    <Box sx={{ 
      py: 12,
      position: 'relative',
      overflow: 'hidden',
      background: sectionBackground,
      boxShadow: isDarkMode ? 'inset 0 -10px 20px -10px rgba(0, 0, 0, 0.6)' : 'none'
    }}>
      {isDarkMode && (
        <>
          <Box sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 204, 255, 0.1) 0%, rgba(25, 118, 210, 0.05) 50%, transparent 70%)',
            top: '-100px',
            right: '10%',
            zIndex: 0
          }} />
          <Box sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 204, 255, 0.08) 0%, rgba(25, 118, 210, 0.04) 50%, transparent 70%)',
            bottom: '50px',
            left: '5%',
            zIndex: 0
          }} />
        </>
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  color: isDarkMode ? '#fff' : 'inherit',
                  textShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                Learn <span style={{ 
                  color: isDarkMode ? '#66ccff' : '#1976d2',
                  position: 'relative'
                }}>AI</span> the Modular Way
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
                  color: isDarkMode ? '#e0e0e0' : 'inherit'
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
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    backgroundColor: isDarkMode ? '#66ccff' : '#1976d2',
                    color: isDarkMode ? '#000' : '#fff',
                    boxShadow: isDarkMode ? '0 4px 20px rgba(102, 204, 255, 0.3)' : '0 4px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#42a5f5' : '#0d47a1',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                      boxShadow: isDarkMode ? '0 6px 25px rgba(102, 204, 255, 0.4)' : '0 6px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Get Started <ArrowForwardIcon sx={{ ml: 1 }} />
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={isDarkMode ? 6 : 2}
              sx={{
                p: 4,
                borderRadius: '24px',
                maxWidth: '500px',
                margin: '0 auto',
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : '#fff',
                transition: 'all 0.3s ease',
                backdropFilter: isDarkMode ? 'blur(10px)' : 'none',
                border: isDarkMode ? '1px solid rgba(102, 204, 255, 0.1)' : 'none',
                boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    bgcolor: isDarkMode ? 'rgba(102, 204, 255, 0.2)' : 'rgba(25, 118, 210, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3,
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode ? '0 0 20px rgba(102, 204, 255, 0.3)' : 'none'
                  }}
                >
                  <SparkleIcon 
                    sx={{ 
                      fontSize: 32, 
                      color: isDarkMode ? '#66ccff' : '#1976d2'
                    }} 
                  />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'center',
                    color: isDarkMode ? '#fff' : 'inherit'
                  }}
                >
                  AI Learning Journey
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    maxWidth: '400px',
                    margin: '0 auto',
                    color: isDarkMode ? '#e0e0e0' : 'inherit'
                  }}
                >
                  From fundamental concepts to advanced techniques in 5 comprehensive modules
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