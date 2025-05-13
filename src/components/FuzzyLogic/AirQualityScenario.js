// display the air quality scenario inside the interactive demo

import { useState } from 'react';

// material ui components
import {
  Box,
  Typography,
  Slider,
  Button,
  Paper,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';

import apiService from '../../services/APIService';

const AirQualityScenario = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [loading, setLoading] = useState(false);
  const [co2, setCo2] = useState(800); // set the initial co2 level to 800 ppm
  const [pm25, setPm25] = useState(20); // set the initial pm25 level to 20 μg/m³
  const [airQualityResult, setAirQualityResult] = useState(''); // set the initial air quality result to an empty string
  const [error, setError] = useState(null);
  
  // state variables for the info dialogs
  const [isCo2InfoOpen, setCo2InfoOpen] = useState(false);
  const [isPm25InfoOpen, setPm25InfoOpen] = useState(false);

  // functions to open and close the info dialogs
  const handleOpenCo2Info = () => setCo2InfoOpen(true);
  const handleCloseCo2Info = () => setCo2InfoOpen(false);
  const handleOpenPm25Info = () => setPm25InfoOpen(true);
  const handleClosePm25Info = () => setPm25InfoOpen(false);


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
      
      // try to calculate the air quality with the /api prefix first
      try {
        console.log('Attempting to calculate air quality with /api prefix...');
        const response = await apiService.post('/api/fuzzy-logic/air-quality', {
          co2,
          pm25
        });
        setAirQualityResult(response.data.result);
      }
      
      // if the /api prefix fails, try without it
      catch (apiError) {
        console.log('Retrying without /api prefix...', apiError);
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
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: theme.palette.text.primary
        }}
      >
        Adjust the CO2 and PM2.5 values to determine air quality
      </Typography>

      <Box sx={{ mb: 4 }}> 
        <Typography id="co2-slider"
          gutterBottom
        >
          CO2 Level: {co2} ppm
          <IconButton
            size="small"
            sx={{ ml: 0.5 }}
            onClick={handleOpenCo2Info}
            aria-label="CO2 Information"
          >
            <HelpOutlineIcon fontSize="inherit" />
          </IconButton>
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
          sx={{ color: theme.palette.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{ 
              display: 'inline-block', // allows the element to be displayed inline with other elements, while still allowing width and height to be set
              width: '33%', // left
              textAlign: 'left',
              color: theme.palette.text.secondary
            }}>Good</Typography>
          <Typography
            variant="body2"
            sx={{ 
              display: 'inline-block',
              width: '34%', // middle
              textAlign: 'center',
              color: theme.palette.text.secondary
            }}>Moderate</Typography>
          <Typography
            variant="body2"
            sx={{ 
              display: 'inline-block',
              width: '33%', // right
              textAlign: 'right',
              color: theme.palette.text.secondary
            }}>Poor</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography id="pm25-slider"
          gutterBottom
        >
          PM2.5 Level: {pm25} μg/m³
          <IconButton
            size="small"
            sx={{ ml: 0.5 }}
            onClick={handleOpenPm25Info}
            aria-label="PM2.5 Information"
          >
            <HelpOutlineIcon fontSize="inherit" />
          </IconButton>
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
          sx={{ color: theme.palette.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2"
            sx={{ 
              display: 'inline-block',
              width: '33%',
              textAlign: 'left',
              color: theme.palette.text.secondary
            }}>Low</Typography>
          <Typography variant="body2"
            sx={{ 
              display: 'inline-block',
              width: '34%',
              textAlign: 'center',
              color: theme.palette.text.secondary
            }}>Medium</Typography>
          <Typography variant="body2"
            sx={{ 
              display: 'inline-block',
              width: '33%',
              textAlign: 'right',
              color: theme.palette.text.secondary
            }}>High</Typography>
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
        onClick={calculateAirQuality}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Calculate Air Quality'}
      </Button>

      <Dialog
        open={isCo2InfoOpen}
        onClose={handleCloseCo2Info}
        aria-labelledby="co2-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="co2-info-dialog-title" sx={{ color: 'text.primary' }}>CO2 Level Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Carbon Dioxide (CO2) level in parts per million (ppm). Indoor levels are typically 400-1000 ppm. Higher levels can affect concentration.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCo2Info}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isPm25InfoOpen}
        onClose={handleClosePm25Info}
        aria-labelledby="pm25-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="pm25-info-dialog-title" sx={{ color: 'text.primary' }}>PM2.5 Level Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Particulate Matter 2.5 (PM2.5) concentration in micrograms per cubic meter (μg/m³). These are fine inhalable particles, with diameters generally 2.5 micrometers and smaller.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePm25Info}>Close</Button>
        </DialogActions>
      </Dialog>

      {airQualityResult && ( // if a result is present
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
            {airQualityResult}
          </Typography>
          
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
            The air quality level is calculated by applying fuzzy rules that combine CO2 and PM2.5 levels.
            CO2 levels above 1000 ppm can cause drowsiness, while PM2.5 particles can penetrate deep into the lungs.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AirQualityScenario;