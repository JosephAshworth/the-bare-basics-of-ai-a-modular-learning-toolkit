// display the light comfort scenario inside the interactive demo

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

const LightComfortScenario = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [loading, setLoading] = useState(false);
  const [intensity, setIntensity] = useState(500);
  const [colourTemp, setColourTemp] = useState(4000);
  const [lightComfortResult, setLightComfortResult] = useState('');
  const [error, setError] = useState(null);
  
  const [isIntensityInfoOpen, setIntensityInfoOpen] = useState(false);
  const [isColourTempInfoOpen, setColourTempInfoOpen] = useState(false);

  const handleOpenIntensityInfo = () => setIntensityInfoOpen(true);
  const handleCloseIntensityInfo = () => setIntensityInfoOpen(false);

  const handleOpenColourTempInfo = () => setColourTempInfoOpen(true);
  const handleCloseColourTempInfo = () => setColourTempInfoOpen(false);

  const handleIntensityChange = (event, newValue) => {
    setIntensity(newValue);
  };

  const handleColourTempChange = (event, newValue) => {
    setColourTemp(newValue);
  };

  const calculateLightComfort = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Attempting to calculate light comfort with /api prefix...');
        const response = await apiService.post('/api/fuzzy-logic/light-comfort', {
          intensity,
          colour_temp: colourTemp
        });
        setLightComfortResult(response.data.result);
      } catch (apiError) {
        console.log('Retrying without /api prefix...', apiError);

        const response = await apiService.post('/fuzzy-logic/light-comfort', {
          intensity,
          colour_temp: colourTemp
        });
        setLightComfortResult(response.data.result);
      }
    } catch (error) {
      console.error('Error calculating light comfort result:', error);
      setError('Could not connect to the backend service. Please try again later.');
      setLightComfortResult('');
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
        Adjust the light intensity and colour temperature to determine lighting comfort
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          id="intensity-slider"
          gutterBottom
        >
          Light Intensity: {intensity} lux
          <IconButton
            size="small"
            sx={{ ml: 0.5 }}
            onClick={handleOpenIntensityInfo}
            aria-label="Light Intensity Information"
          >
            <HelpOutlineIcon fontSize="inherit" />
          </IconButton>
        </Typography>
        <Slider
          value={intensity}
          onChange={handleIntensityChange}
          aria-labelledby="intensity-slider"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={0}
          max={1000}
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
          >
            Dim
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '34%',
              textAlign: 'center',
              color: theme.palette.text.secondary
            }}
          >
            Moderate
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '33%',
              textAlign: 'right',
              color: theme.palette.text.secondary
            }}
          >
            Bright
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          id="colour-temp-slider"
          gutterBottom
          sx={{
            color: theme.palette.text.primary,
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          Colour Temperature: {colourTemp} K
          <IconButton
            size="small"
            sx={{ ml: 0.5 }}
            onClick={handleOpenColourTempInfo}
            aria-label="Colour Temperature Information"
          >
            <HelpOutlineIcon fontSize="inherit" />
          </IconButton>
        </Typography>
        <Slider
          value={colourTemp}
          onChange={handleColourTempChange}
          aria-labelledby="colour-temp-slider"
          valueLabelDisplay="auto"
          step={100}
          marks
          min={2000}
          max={6500}
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
          >
            Warm
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '34%',
              textAlign: 'center',
              color: theme.palette.text.secondary
            }}
          >Neutral</Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '33%',
              textAlign: 'right',
              color: theme.palette.text.secondary
            }}
          >
            Cool
          </Typography>
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
        onClick={calculateLightComfort}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Calculate Lighting Comfort'}
      </Button>

      {lightComfortResult && (
        <Paper 
          sx={{ 
            p: 3,
            mt: 3,
            borderRadius: '8px',
            backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40',
            border: `1px solid ${theme.palette.primary.main}`
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: theme.palette.primary.main, mb: 1 }}
          >
            Fuzzy Logic Result:
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.primary }}
          >
            {lightComfortResult}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 2 }}
          >
            The lighting comfort level is calculated by applying fuzzy rules that combine light intensity and colour temperature.
            Warmer light (2700-3000K) is generally better for relaxation, while cooler light (5000K+) is better for focus and productivity.
          </Typography>
        </Paper>
      )}

      <Dialog
        open={isIntensityInfoOpen}
        onClose={handleCloseIntensityInfo}
        aria-labelledby="intensity-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="intensity-info-dialog-title"
          sx={{ color: 'text.primary' }}
        >
          Light Intensity Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ color: 'text.secondary' }}
          >
            Illuminance measured in lux (lx). It represents the amount of light falling on a surface. Office lighting is often around 300-500 lux.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIntensityInfo}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isColourTempInfoOpen}
        onClose={handleCloseColourTempInfo}
        aria-labelledby="colour-temp-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="colour-temp-info-dialog-title"
          sx={{ color: 'text.primary' }}
        >
          Colour Temperature Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ color: 'text.secondary' }}
          >
            Correlated Colour Temperature (CCT) measured in Kelvin (K). Lower values (e.g., 2700K) are 'warm' (yellowish), higher values (e.g., 6500K) are 'cool' (bluish). Daylight is around 5000-6500K.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseColourTempInfo}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LightComfortScenario;