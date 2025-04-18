import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  Paper,
} from '@mui/material';
import apiService from '../../services/apiService';

const AirQualityScenario = ({ isDarkMode, themeColors }) => {
  const [loading, setLoading] = useState(false);
  const [co2, setCo2] = useState(800);
  const [pm25, setPm25] = useState(20);
  const [airQualityResult, setAirQualityResult] = useState('');
  const [error, setError] = useState(null);
  
  // Default theme colors if props not provided
  const colors = themeColors || {
    primary: { main: '#1976d2', light: 'rgba(25, 118, 210, 0.1)' },
    text: { primary: '#1a1a1a', secondary: '#666' },
    background: { paper: '#ffffff', default: '#f9fafc' },
    border: { color: 'rgba(0, 0, 0, 0.12)' }
  };
  
  const handleCo2Change = (event, newValue) => {
    setCo2(newValue);
  };

  const handlePm25Change = (event, newValue) => {
    setPm25(newValue);
  };

  const calculateAirQuality = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try with api prefix first
      try {
        console.log('Attempting to calculate air quality with /api prefix...');
        const response = await apiService.post('/api/fuzzy-logic/air-quality', {
          co2,
          pm25
        });
        setAirQualityResult(response.data.result);
      } catch (apiError) {
        console.log('Retrying without /api prefix...');
        // If first attempt fails, try without api prefix
        const response = await apiService.post('/fuzzy-logic/air-quality', {
          co2,
          pm25
        });
        setAirQualityResult(response.data.result);
      }
    } catch (error) {
      console.error('Error calculating air quality result:', error);
      setError('Could not connect to the backend service. Please try again later.');
      setAirQualityResult('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: colors.text.primary }}>
        Adjust the CO2 and PM2.5 values to determine air quality
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography id="co2-slider" gutterBottom sx={{ color: colors.text.primary }}>
          CO2 Level: {co2} ppm
        </Typography>
        <Slider
          value={co2}
          onChange={handleCo2Change}
          aria-labelledby="co2-slider"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={300}
          max={2000}
          sx={{ color: colors.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'left', color: colors.text.secondary }}>Good</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '34%', textAlign: 'center', color: colors.text.secondary }}>Moderate</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'right', color: colors.text.secondary }}>Poor</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography id="pm25-slider" gutterBottom sx={{ color: colors.text.primary }}>
          PM2.5 Level: {pm25} μg/m³
        </Typography>
        <Slider
          value={pm25}
          onChange={handlePm25Change}
          aria-labelledby="pm25-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={100}
          sx={{ color: colors.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'left', color: colors.text.secondary }}>Low</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '34%', textAlign: 'center', color: colors.text.secondary }}>Medium</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'right', color: colors.text.secondary }}>High</Typography>
        </Box>
      </Box>

      {error && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3,
            borderRadius: '8px', 
            backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#ffebee',
            border: `1px solid ${isDarkMode ? 'rgba(244, 67, 54, 0.3)' : '#ffcdd2'}`
          }}
        >
          <Typography color="error">
            {error}
          </Typography>
        </Paper>
      )}

      <Button 
        variant="contained" 
        onClick={calculateAirQuality}
        disabled={loading}
        sx={{ 
          mb: 3,
          backgroundColor: colors.primary.main,
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.8)' : '#1565c0',
          } 
        }}
      >
        {loading ? 'Processing...' : 'Calculate Air Quality'}
      </Button>

      {airQualityResult && (
        <Paper 
          sx={{ 
            p: 3, 
            borderRadius: '8px', 
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : '#f0f7ff',
            border: `1px solid ${isDarkMode ? 'rgba(100, 181, 246, 0.3)' : '#bbdefb'}`
          }}
        >
          <Typography variant="h6" sx={{ color: colors.primary.main, mb: 1 }}>
            Fuzzy Logic Result:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.primary }}>
            {airQualityResult}
          </Typography>
          
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 2 }}>
            The air quality level is calculated by applying fuzzy rules that combine CO2 and PM2.5 levels.
            CO2 levels above 1000 ppm can cause drowsiness, while PM2.5 particles can penetrate deep into the lungs.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AirQualityScenario; 