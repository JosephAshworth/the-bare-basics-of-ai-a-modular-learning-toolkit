import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import { Psychology as PsychologyIcon } from '@mui/icons-material';

const MLHeroSection = () => {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
      py: 12,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left side - Main heading */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  mb: 2,
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                Interactive Machine Learning
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{
                  fontSize: '1.25rem',
                  color: '#666',
                  mb: 6,
                  maxWidth: '500px',
                  lineHeight: 1.5,
                  margin: '0 auto',
                  textAlign: 'center'
                }}
              >
                Train and visualize machine learning models with custom datasets and parameters
              </Typography>
            </Box>
          </Grid>

          {/* Right side - Card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: '24px',
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.05)',
                maxWidth: '500px',
                margin: '0 auto'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    bgcolor: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3
                  }}
                >
                  <PsychologyIcon sx={{ fontSize: 32, color: '#1976d2' }} />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1a1a1a',
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  Machine Learning Journey
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    color: '#666',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    maxWidth: '400px',
                    margin: '0 auto'
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

export default MLHeroSection; 