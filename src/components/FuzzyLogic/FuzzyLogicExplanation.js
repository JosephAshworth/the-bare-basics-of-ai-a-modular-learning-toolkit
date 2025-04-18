import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
} from '@mui/material';

const FuzzyLogicExplanation = ({ isDarkMode, themeColors }) => {
  // Default theme colors if props not provided
  const colors = themeColors || {
    primary: { main: '#1976d2', light: 'rgba(25, 118, 210, 0.1)' },
    text: { primary: '#1a1a1a', secondary: '#666' },
    background: { paper: '#ffffff', default: '#f9fafc' },
    border: { color: 'rgba(0, 0, 0, 0.12)' }
  };

  return (
    <Paper
      elevation={isDarkMode ? 3 : 2}
      sx={{
        p: 4,
        borderRadius: '16px',
        maxWidth: '900px',
        margin: '0 auto 40px auto',
        backgroundColor: colors.background.paper,
        boxShadow: isDarkMode ? '0 8px 16px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <Typography variant="h4" sx={{ 
        color: colors.text.primary, 
        mb: 3, 
        fontWeight: 600,
        textAlign: 'center'
      }}>
        Understanding Fuzzy Logic
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: colors.text.primary, mb: 1, fontWeight: 500 }}>
            What is Fuzzy Logic?
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 3 }}>
            Unlike traditional logic where things are either <strong>true (1)</strong> or <strong>false (0)</strong>, fuzzy logic allows for <strong>degrees of truth</strong> (values between 0 and 1). It's a way to handle the concept of "partial truth" – where the truth value may range between completely true and completely false.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <Card sx={{ 
              maxWidth: 200, 
              m: 1,
              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#f5f5f5',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ textAlign: 'center', color: colors.primary.main }}>
                  Traditional Logic
                </Typography>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Is it hot?
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.text.primary }}>
                    YES or NO
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Typography variant="h5" sx={{ mx: 2, color: colors.text.primary }}>
              vs
            </Typography>
            
            <Card sx={{ 
              maxWidth: 200, 
              m: 1,
              backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : '#e3f2fd',
              border: `1px solid ${isDarkMode ? 'rgba(100, 181, 246, 0.3)' : '#bbdefb'}`,
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ textAlign: 'center', color: colors.primary.main }}>
                  Fuzzy Logic
                </Typography>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    How hot is it?
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.text.primary }}>
                    0.3 hot, 0.7 warm
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ color: colors.text.primary, mb: 1, mt: 2, fontWeight: 500 }}>
            Real-World Example: Temperature
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 2 }}>
            Imagine describing temperature with words like "cold," "moderate," and "hot":
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', backgroundColor: isDarkMode ? 'rgba(0,150,255,0.1)' : '#e1f5fe' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ color: '#0288d1', fontWeight: 600, mb: 1 }}>
                    Cold (Below 15°C)
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    At 5°C: <strong>100% cold</strong>, 0% moderate<br />
                    At 12°C: <strong>60% cold</strong>, 40% moderate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', backgroundColor: isDarkMode ? 'rgba(76,175,80,0.1)' : '#e8f5e9' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ color: '#4caf50', fontWeight: 600, mb: 1 }}>
                    Moderate (10-35°C)
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    At 25°C: <strong>100% moderate</strong><br />
                    At 15°C: 50% cold, <strong>50% moderate</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', backgroundColor: isDarkMode ? 'rgba(255,152,0,0.1)' : '#fff3e0' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ color: '#ff9800', fontWeight: 600, mb: 1 }}>
                    Hot (Above 30°C)
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    At 45°C: <strong>100% hot</strong>, 0% moderate<br />
                    At 32°C: 20% moderate, <strong>80% hot</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ color: colors.text.primary, mb: 1, mt: 2, fontWeight: 500 }}>
            Why Fuzzy Logic Matters
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Fuzzy logic is closer to how humans actually think and communicate. When we describe weather as "a bit chilly" or "quite hot," we're using fuzzy concepts. This approach helps build systems that:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.primary.main, mb: 1 }}>
                      Handle Uncertainty
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Works well with imprecise information and vague boundaries between categories
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.primary.main, mb: 1 }}>
                      Model Human Thinking
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Mimics how humans make decisions with "rules of thumb" instead of precise calculations
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.primary.main, mb: 1 }}>
                      Simplify Complex Systems
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Provides a way to design control systems without needing complex mathematical models
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FuzzyLogicExplanation; 