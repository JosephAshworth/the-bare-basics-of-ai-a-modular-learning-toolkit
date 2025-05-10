import {
  Box, // import Box from @mui/material
  Grid, // import Grid from @mui/material
  Typography, // import Typography from @mui/material
  CircularProgress, // import CircularProgress from @mui/material
  Button // import Button from @mui/material
} from '@mui/material';

import DecisionTreeExplanation from './DecisionTreeExplanation'; // import DecisionTreeExplanation from ./DecisionTreeExplanation, which is a separate component for the explanation of the decision tree

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import { backendUrl } from '../../services/apiService'; // import backendUrl from ../../services/apiService, which is the URL of the backend

import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // import OpenInNewIcon from @mui/icons-material, which is an icon for the button

const DecisionTreeVisualisation = ({ visualisation, loading }) => { // define a functional component named DecisionTreeVisualisation
  const theme = useTheme(); // for getting the MUI theme object

  let imageSrc = null; // let imageSrc be null, this will store the image source
  let isUrl = false; // let isUrl be false, this will store the URL flag

  if (visualisation) { // if visualisation is not null
    if (typeof visualisation === 'string' && visualisation.startsWith('/')) { // if visualisation is a string and starts with a forward slash
      imageSrc = `${backendUrl}${visualisation}`; // set imageSrc to the backend URL plus the visualisation
      isUrl = true; // set isUrl to true
      console.log("DecisionTreeVisualisation: Rendering using URL:", imageSrc); // log the image source
    } else if (typeof visualisation === 'string') { // if visualisation is a string
      imageSrc = `data:image/png;base64,${visualisation}`; // set imageSrc to the base64 data
      console.log("DecisionTreeVisualisation: Rendering using base64 data..."); // log the base64 data
    } else { // if visualisation is not a string
      console.warn("DecisionTreeVisualisation: Received unexpected visualisation prop type:", typeof visualisation); // log the unexpected visualisation prop type
    }
  }

  console.log("DecisionTreeVisualisation receiving prop:", visualisation); // log the visualisation prop
  console.log("DecisionTreeVisualisation calculated imageSrc:", imageSrc); // log the image source
  console.log("DecisionTreeVisualisation loading prop:", loading); // log the loading prop
  console.log("DecisionTreeVisualisation isUrl:", isUrl); // log the URL flag

  return (
    <Box sx={{ mt: 3 }}> {/* box for the decision tree visualisation */}
      <Typography
        variant="body1" // variant of the typography
        color="text.secondary" // colour of the typography
        sx={{ mb: 4, textAlign: 'center' }}> {/* style of the typography */}
        The decision tree visualisation is shown in a separate page to avoid crashing the page.
      </Typography>
      {imageSrc ? ( // if imageSrc is not null
        <Grid container spacing={3} direction="column"> {/* grid container for the decision tree visualisation */}
          <Grid item xs={12} sx={{ textAlign: 'center' }}> {/* grid item for the decision tree visualisation */}
            <Button
              variant="contained" // variant of the button, giving it a solid background colour
              href={imageSrc} // href of the button, which is the image source
              target="_blank" // target of the button, which is a new tab
              rel="noopener noreferrer" // rel of the button, which is a noopener noreferrer
              endIcon={<OpenInNewIcon />} // end icon of the button, which is an icon for the button
              sx={{ mb: 2 }} // style of the button, giving it a margin bottom of 2 units
            >
              View Decision Tree Visualisation
            </Button>
          </Grid>

          <Grid item xs={12}>
            <DecisionTreeExplanation /> {/* decision tree explanation component */}
          </Grid>
        </Grid>
      ) : (
        <Box sx={{
          textAlign: 'center', // centre the text
          mt: 3, // margin top of 3 units
          color: theme.palette.text.secondary, // colour of the text, which is the secondary colour from the theme
          minHeight: 200, // minimum height of 200 units
          display: 'flex', // display the box as a flex container
          alignItems: 'center', // align the items in the centre
          justifyContent: 'center' // justify the content in the centre
        }}>
          {loading ? (
            <CircularProgress /> // circular progress icon
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

export default DecisionTreeVisualisation; // export the DecisionTreeVisualisation component as the default export, so it can be used in other components
