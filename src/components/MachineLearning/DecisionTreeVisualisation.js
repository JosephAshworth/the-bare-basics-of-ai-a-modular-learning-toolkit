// material ui components
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button
} from '@mui/material';

import DecisionTreeExplanation from './DecisionTreeExplanation';

import { useTheme } from '@mui/material/styles';

// get the url for the tree image
import { backendUrl } from '../../services/APIService';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const DecisionTreeVisualisation = ({ visualisation, loading }) => {
  const theme = useTheme();

  let imageSrc = null;

  // if the visualisation is a string, it is a url
  if (visualisation) {
    if (typeof visualisation === 'string' && visualisation.startsWith('/')) {
      imageSrc = `${backendUrl}${visualisation}`;
    } else if (typeof visualisation === 'string') {
      imageSrc = `data:image/png;base64,${visualisation}`;
    } else {
      console.warn("DecisionTreeVisualisation: Received unexpected visualisation prop type:", typeof visualisation);
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, textAlign: 'center' }}>
        The decision tree visualisation is shown in a separate page to avoid crashing the page.
      </Typography>
      {imageSrc ? (
        <Grid container spacing={3} direction="column">
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              href={imageSrc} // navigation link to the image
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon />}
              sx={{ mb: 2 }}
            >
              View Decision Tree Visualisation
            </Button>
          </Grid>

          <Grid item xs={12}>
            <DecisionTreeExplanation />
          </Grid>
        </Grid>
      ) : (
        <Box sx={{
          textAlign: 'center',
          mt: 3,
          color: theme.palette.text.secondary,
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography>
              No decision tree visualisation available. Please train the model to see the visualisation.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DecisionTreeVisualisation;