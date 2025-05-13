// display the comfort scenario inside the interactive demo

import { useState } from 'react';

// material ui components
import {
  Box,
  Typography,
  Slider,
  Button,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';

import apiService from '../../services/APIService';

const ComfortScenario = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [comfortResult, setComfortResult] = useState('');
  const [error, setError] = useState(null);
  
  const [isTempInfoOpen, setTempInfoOpen] = useState(false);
  const [isHumidityInfoOpen, setHumidityInfoOpen] = useState(false);

  const handleOpenTempInfo = () => setTempInfoOpen(true);
  const handleCloseTempInfo = () => setTempInfoOpen(false);

  const handleOpenHumidityInfo = () => setHumidityInfoOpen(true);
  const handleCloseHumidityInfo = () => setHumidityInfoOpen(false);

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
      
      try {
        console.log('Attempting to calculate comfort with /api prefix...');
        const response = await apiService.post('/api/fuzzy-logic/comfort', {
          temperature,
          humidity
        });
        setComfortResult(response.data.result);
      } catch (apiError) {
        console.log('Retrying without /api prefix...', apiError);
        
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
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: theme.palette.text.primary
        }}
      >
        Adjust the temperature and humidity values to determine comfort level
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          id="temperature-slider"
          gutterBottom
        >
          Temperature: {temperature}°C
          <IconButton
            size="small"
            sx={{ ml: 0.5 }}
            onClick={handleOpenTempInfo}
            aria-label="Temperature Information"
          >
            <HelpOutlineIcon fontSize="inherit" />
          </IconButton>
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
          sx={{ color: theme.palette.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '33%',
              textAlign: 'left',
              color: theme.palette.text.secondary
            }}
          >Cold</Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '34%',
              textAlign: 'center',
              color: theme.palette.text.secondary
            }}
          >Moderate</Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '33%',
              textAlign: 'right',
              color: theme.palette.text.secondary
            }}
          >Hot</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          id="humidity-slider"
          gutterBottom
        >
          Humidity: {humidity}%
          <IconButton
            size="small"
            sx={{ ml: 0.5 }}
            onClick={handleOpenHumidityInfo}
            aria-label="Humidity Information"
          >
            <HelpOutlineIcon fontSize="inherit" />
          </IconButton>
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
          sx={{ color: theme.palette.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '33%',
              textAlign: 'left',
              color: theme.palette.text.secondary
            }}>Dry</Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '34%',
              textAlign: 'center',
              color: theme.palette.text.secondary
            }}>Normal</Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '33%',
              textAlign: 'right',
              color: theme.palette.text.secondary
            }}>Humid</Typography>
        </Box>
      </Box>

      {error && (
        <Paper 
          sx={{ 
            p: 2,
            mb: 3,
            borderRadius: '8px',
            backgroundColor: theme.palette.error.light,
            border: `1px solid ${theme.palette.error.main}`,
            color: theme.palette.error.contrastText
          }}
        >
          <Typography color="inherit">
            {error}
          </Typography>
        </Paper>
      )}

      <Button 
        variant="contained"
        onClick={calculateComfort}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Calculate Comfort Level'}
      </Button>

      {comfortResult && (
        <Paper 
          sx={{ 
            p: 3,
            mt: 3,
            borderRadius: '8px',
            backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40',
            border: `1px solid ${theme.palette.primary.main}`
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1 }}>
            Fuzzy Logic Result:
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
            {comfortResult}
          </Typography>
          
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
            The comfort level is calculated by applying fuzzy rules that combine temperature and humidity. 
            Each rule assigns a different weight based on how much each input belongs to categories like "cold," "moderate," or "hot."
          </Typography>
        </Paper>
      )}

      <Dialog
        open={isTempInfoOpen}
        onClose={handleCloseTempInfo}
        aria-labelledby="temp-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="temp-info-dialog-title" sx={{ color: 'text.primary' }}>Temperature Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Ambient air temperature in degrees Celsius (°C).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTempInfo}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isHumidityInfoOpen}
        onClose={handleCloseHumidityInfo}
        aria-labelledby="humidity-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="humidity-info-dialog-title" sx={{ color: 'text.primary' }}>Humidity Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Relative Humidity (RH) as a percentage (%). It measures the amount of water vapor present in the air compared to the maximum amount it could hold at that temperature.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHumidityInfo}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComfortScenario;