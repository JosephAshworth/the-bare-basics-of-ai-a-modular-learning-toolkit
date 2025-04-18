import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  Paper,
} from '@mui/material';
import apiService from '../../services/apiService';

const ComfortScenario = ({ isDarkMode, themeColors }) => {
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [comfortResult, setComfortResult] = useState('');
  const [error, setError] = useState(null);
  
  // Default theme colors if props not provided
  const colors = themeColors || {
    primary: { main: '#1976d2', light: 'rgba(25, 118, 210, 0.1)' },
    text: { primary: '#1a1a1a', secondary: '#666' },
    background: { paper: '#ffffff', default: '#f9fafc' },
    border: { color: 'rgba(0, 0, 0, 0.12)' }
  };
  
  const handleTemperatureChange = (event, newValue) => {
    setTemperature(newValue);
  };

  const handleHumidityChange = (event, newValue) => {
    setHumidity(newValue);
  };

  const calculateComfort = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try with api prefix first
      try {
        console.log('Attempting to calculate comfort with /api prefix...');
        const response = await apiService.post('/api/fuzzy-logic/comfort', {
          temperature,
          humidity
        });
        setComfortResult(response.data.result);
      } catch (apiError) {
        console.log('Retrying without /api prefix...', apiError);
        
        // If first attempt fails, try without api prefix
        const response = await apiService.post('/fuzzy-logic/comfort', {
          temperature,
          humidity
        });
        setComfortResult(response.data.result);
      }
    } catch (error) {
      console.error('Error calculating comfort result:', error);
      setError('Could not connect to the backend service. Please try again later.');
      setComfortResult('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: colors.text.primary }}>
        Adjust the temperature and humidity values to determine comfort level
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography id="temperature-slider" gutterBottom sx={{ color: colors.text.primary }}>
          Temperature: {temperature}°C
        </Typography>
        <Slider
          value={temperature}
          onChange={handleTemperatureChange}
          aria-labelledby="temperature-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={50}
          sx={{ color: colors.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'left', color: colors.text.secondary }}>Cold</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '34%', textAlign: 'center', color: colors.text.secondary }}>Moderate</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'right', color: colors.text.secondary }}>Hot</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography id="humidity-slider" gutterBottom sx={{ color: colors.text.primary }}>
          Humidity: {humidity}%
        </Typography>
        <Slider
          value={humidity}
          onChange={handleHumidityChange}
          aria-labelledby="humidity-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={100}
          sx={{ color: colors.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'left', color: colors.text.secondary }}>Dry</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '34%', textAlign: 'center', color: colors.text.secondary }}>Normal</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'right', color: colors.text.secondary }}>Humid</Typography>
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
        onClick={calculateComfort}
        disabled={loading}
        sx={{ 
          mb: 3,
          backgroundColor: colors.primary.main,
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.8)' : '#1565c0',
          } 
        }}
      >
        {loading ? 'Processing...' : 'Calculate Comfort Level'}
      </Button>

      {comfortResult && (
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
            {comfortResult}
          </Typography>
          
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 2 }}>
            The comfort level is calculated by applying fuzzy rules that combine temperature and humidity. 
            Each rule assigns a different weight based on how much each input belongs to categories like "cold," "moderate," or "hot."
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ComfortScenario; 