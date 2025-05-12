import 
  { 
    useState, // import useState, this is used to manage state in functional components
    useRef, // import useRef, this is used to manage references in functional components
    useEffect // import useEffect, this is used to manage side effects in functional components
  } from 'react';

import {
  Box, // import Box from MUI
  Typography, // import Typography from MUI
  Grid, // import Grid from MUI
  Paper, // import Paper from MUI
  Button, // import Button from MUI
  Alert, // import Alert from MUI
  IconButton, // import IconButton from MUI
  Dialog, // import Dialog from MUI
  DialogTitle, // import DialogTitle from MUI
  DialogContent, // import DialogContent from MUI
  DialogActions // import DialogActions from MUI
} from '@mui/material';

import {
  CloudUpload as CloudUploadIcon, // import CloudUploadIcon from MUI
  Refresh as RefreshIcon, // import RefreshIcon from MUI
  Face as FaceIcon, // import FaceIcon from MUI
  InfoOutlined as InfoOutlinedIcon // import InfoOutlinedIcon from MUI
} from '@mui/icons-material';

import EmotionResults from './EmotionResults'; // import the EmotionResults component from the EmotionResults file, this is used to display the emotion results

import { detectFaceEmotions } from './utils'; // import the detectFaceEmotions function from the utils file, this is used to detect the emotions from the image file

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const FaceEmotionTab = () => {
  const [imagePreview, setImagePreview] = useState(null); // state variable to store the image preview
  const [selectedFile, setSelectedFile] = useState(null); // state variable to store the selected file
  const [loading, setLoading] = useState(false); // state variable to store the loading state
  const [error, setError] = useState(null); // state variable to store the error
  const [emotions, setEmotions] = useState([]); // state variable to store the emotions
  const [isResultsInfoOpen, setResultsInfoOpen] = useState(false); // state variable to store the results info open state

  const theme = useTheme(); // for getting the MUI theme object

  const fileInputRef = useRef(null); // for getting the file input reference

  useEffect(() => {
    return () => {
      if (imagePreview) { // if the image preview is not null
        URL.revokeObjectURL(imagePreview); // revoke the object URL of the image preview, this is used to free up memory
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // get the first file from the event target
    if (file) { // if the file is not null
      setSelectedFile(file); // set the selected file to the file
      setError(null); // set the error to null

      const url = URL.createObjectURL(file); // create a URL for the file
      setImagePreview(url); // set the image preview to the URL

      setEmotions([]); // set the emotions to an empty array
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); // click the file input reference, this is used to open the file input dialog
  };


  const handleReset = () => {
    setSelectedFile(null); // set the selected file to null
    setImagePreview(null); // set the image preview to null
    setEmotions([]); // set the emotions to an empty array
    setError(null); // set the error to null

    if (imagePreview) { // if the image preview is not null
      URL.revokeObjectURL(imagePreview); // revoke the object URL of the image preview, this is used to free up memory
    }
  };

  const handleOpenResultsInfo = () => setResultsInfoOpen(true); // for handling the open results info event
  const handleCloseResultsInfo = () => setResultsInfoOpen(false); // for handling the close results info event

  return (
    <Grid container spacing={4}> {/* create a grid container with a spacing of 4, to create a responsive layout */}
      <Grid item xs={12} md={6}> {/* create a grid item with a width of 12 on small screens and 6 on medium screens */}
        <Paper
          elevation={theme.palette.mode === 'dark' ? 4 : 3} // set the elevation of the paper to 4 on dark mode and 3 on light mode, this is used to give the paper a shadow
          sx={{
            p: 4, // set the padding of the paper to 4, this adds space inside the paper
            borderRadius: '16px', // set the border radius of the paper to 16px, this makes the corners of the paper rounded
            height: '100%', // set the height of the paper to 100%
            display: 'flex', // set the display of the paper to flex
            flexDirection: 'column', // set the flex direction of the paper to column
            backgroundColor: theme.palette.background.paper // set the background colour of the paper to the background colour of the theme
          }}
        >
          <Typography
            variant="h5" // set the variant of the typography to h5, for the heading
            sx={{
              mb: 3, // set the margin bottom of the typography to 3, this adds space below the typography
              fontWeight: 600, // set the font weight of the typography to 600, this makes the font bold
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            Upload a Face Image {/* set the text of the typography to Upload a Face Image */}
          </Typography>

          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`, // set the border of the box to the divider colour of the theme
              borderRadius: '12px', // set the border radius of the box to 12px, this makes the corners of the box rounded
              p: 3, // set the padding of the box to 3, this adds space inside the box
              display: 'flex', // set the display of the box to flex
              flexDirection: 'column', // set the flex direction of the box to column
              alignItems: 'center', // set the alignment of the box to centre
              justifyContent: 'center', // set the justification of the box to centre
              minHeight: '300px', // set the minimum height of the box to 300px
              backgroundColor: theme.palette.background.default, // set the background colour of the box to the default colour of the theme
              cursor: 'pointer', // set the cursor of the box to pointer, this is used to indicate that the box is clickable
              mb: 3 // set the margin bottom of the box to 3, this adds space below the box
            }}
            onClick={handleUploadClick} // for handling the upload click event
          >
            {imagePreview ? ( // if the image preview is not null
              <Box
                sx={{
                  width: '100%', // set the width of the box to 100%, this makes the box take up the remaining space in the paper
                  height: '100%', // set the height of the box to 100%, this makes the box take up the remaining space in the paper
                  display: 'flex', // set the display of the box to flex
                  justifyContent: 'center' // set the justification of the box to centre, this is used to centre the image in the box
                }}
              >
                <img
                  src={imagePreview} // set the source of the image to the image preview
                  alt="Preview" // set the alt text of the image to Preview
                  style={{
                    maxWidth: '100%', // set the maximum width of the image to 100%, this makes the image take up the remaining space in the box
                    maxHeight: '300px', // set the maximum height of the image to 300px, this makes the image take up the remaining space in the box
                    objectFit: 'contain', // set the object fit of the image to contain, this makes the image take up the remaining space in the box
                    borderRadius: '8px' // set the border radius of the image to 8px, this makes the corners of the image rounded
                  }}
                />
              </Box>
            ) : (
              <>
                <CloudUploadIcon
                  sx={{
                    fontSize: 60, // set the font size of the icon to 60, this makes the icon large
                    color: theme.palette.primary.main, // set the colour of the icon to the primary colour of the theme
                    mb: 2 // set the margin bottom of the icon to 2, this adds space below the icon
                  }}
                />
                <Typography
                  variant="h6" // set the variant of the typography to h6, for the heading
                  sx={{
                    mb: 1, // set the margin bottom of the typography to 1, this adds space below the typography
                    color: theme.palette.primary.main // set the colour of the typography to the primary colour of the theme
                  }}
                >
                  Click to upload image {/* set the text of the typography to Click to upload image */}
                </Typography>
                <Typography
                  variant="body2" // set the variant of the typography to body2, for the body text
                  sx={{
                    color: theme.palette.text.secondary, // set the colour of the typography to the secondary colour of the theme
                    textAlign: 'center' // set the text alignment of the typography to centre
                  }}
                >
                  Upload a clear photo of a face to detect emotions {/* set the text of the typography to Upload a clear photo of a face to detect emotions */}
                </Typography>
                <Typography
                  variant="caption" // set the variant of the typography to caption, for the caption text
                  sx={{
                    color: theme.palette.text.secondary, // set the colour of the typography to the secondary colour of the theme
                    textAlign: 'center', // set the text alignment of the typography to centre
                    mt: 1, // set the margin top of the typography to 1, this adds space above the typography
                    display: 'block' // set the display of the typography to block
                  }}
                >
                  Supported formats: JPG, PNG, GIF, BMP, WebP {/* set the text of the typography to Supported formats: JPG, PNG, GIF, BMP, WebP */}
                </Typography>
              </>
            )}
            <input
              type="file" // set the type of the input to file, this is used to upload a file
              accept="image/jpeg,image/png,image/gif,image/bmp,image/webp,image/jpg" // set the accept of the input to the supported image formats
              onChange={handleImageChange} // for handling the image change event
              ref={fileInputRef} // for getting the file input reference
              style={{ display: 'none' }} // set the display of the input to none, this is used to hide the input
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}> {/* create a box with a flex display, a gap of 2, and a margin top of auto, this is used to align the buttons to the bottom of the paper */}
            <Button
              variant="contained" // set the variant of the button to contained, this is used to create a button with a background colour
              color="primary" // set the colour of the button to primary, this is used to create a button with a primary colour
              fullWidth // set the full width of the button to true, this makes the button take up the remaining space in the box
              size="large" // set the size of the button to large, this makes the button large
              startIcon={<FaceIcon />} // set the start icon of the button to the FaceIcon, this is used to create a button with a face icon
              onClick={() => detectFaceEmotions(selectedFile, setLoading, setError, setEmotions)} // for handling the detect face emotions event
              disabled={!imagePreview || loading} // disable the button if the image preview is not null or the loading state is true
            >
              Detect Face Emotions {/* set the text of the button to Detect Face Emotions */}
            </Button>

            <IconButton
              onClick={handleReset} // for handling the reset event
              disabled={loading} // disable the button if the loading state is true
              sx={{
                border: `1px solid ${theme.palette.divider}`, // set the border of the button to the divider colour of the theme
                color: theme.palette.text.secondary, // set the colour of the button to the secondary colour of the theme
                '&:hover': {
                  backgroundColor: theme.palette.action.hover // set the background colour of the button to the hover colour of the theme
                }
              }}
            >
              <RefreshIcon /> {/* set the icon of the button to the RefreshIcon, this is used to create a button with a refresh icon */}
            </IconButton>
          </Box>

          {error && ( // if the error is not null
            <Alert
              severity="error" // set the severity of the alert to error, this is used to create an alert with a red background
              sx={{
                mt: 2 // set the margin top of the alert to 2, this adds space above the alert
              }}
            >
              {error} {/* set the text of the alert to the error */}
            </Alert>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}> {/* create a grid item with a width of 12 on small screens and 6 on medium screens */}
        <Paper
          elevation={theme.palette.mode === 'dark' ? 4 : 3} // set the elevation of the paper to 4 on dark mode and 3 on light mode, this is used to give the paper a shadow
          sx={{
            p: 4, // set the padding of the paper to 4, this adds space inside the paper
            borderRadius: '16px', // set the border radius of the paper to 16px, this makes the corners of the paper rounded
            height: '100%', // set the height of the paper to 100%
            display: 'flex', // set the display of the paper to flex
            flexDirection: 'column', // set the flex direction of the paper to column
            backgroundColor: theme.palette.background.paper // set the background colour of the paper to the background colour of the theme
          }}
        >
          <Box
            sx={{
              display: 'flex', // set the display of the box to flex
              alignItems: 'center', // set the alignment of the box to centre
              justifyContent: 'space-between', // set the justification of the box to space between
              mb: 3 // set the margin bottom of the box to 3, this adds space below the box
            }}
          >
            <Typography
              variant="h5" // set the variant of the typography to h5, for the heading
              sx={{
                fontWeight: 600, // set the font weight of the typography to 600, this makes the font bold
                color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
              }}
            >
              Face Emotion Analysis Results {/* set the text of the typography to Face Emotion Analysis Results */}
            </Typography>
            <IconButton
              onClick={handleOpenResultsInfo} // for handling the open results info event
              size="small" // set the size of the icon button to small, this makes the icon button small
              sx={{ color: theme.palette.text.secondary }} // set the colour of the icon button to the secondary colour of the theme
              aria-label="Results Info" // set the aria label of the icon button to Results Info
            >
              <InfoOutlinedIcon fontSize="small" /> {/* set the icon of the icon button to the InfoOutlinedIcon, this is used to create an icon button with an info icon */}
            </IconButton>
          </Box>

          <EmotionResults
            loading={loading} // set the loading state of the emotion results to the loading state
            emotions={emotions} // set the emotions of the emotion results to the emotions
            emptyIcon={<FaceIcon
              sx={{ fontSize: 60, // set the font size of the icon to 60, this makes the icon large
                color: theme.palette.text.secondary, // set the colour of the icon to the secondary colour of the theme
                mb: 2, // set the margin bottom of the icon to 2, this adds space below the icon
                opacity: 0.5 // set the opacity of the icon to 0.5, this makes the icon slightly transparent
              }}
            />}
            emptyMessage="Upload an image and click 'Detect Face Emotions' to see results" // set the empty message of the emotion results to Upload an image and click 'Detect Face Emotions' to see results 
            loadingMessage="Analysing face emotions..." // set the loading message of the emotion results to Analysing face emotions...
            technologyDescription="Facial analysis powered by a deep learning model that detects emotions from expressions." // set the technology description of the emotion results to Facial analysis powered by a deep learning model that detects emotions from expressions.
          />
        </Paper>
      </Grid>

      <Grid item xs={12}> {/* create a grid item with a width of 12 on small screens */}
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 2 : 1} // set the elevation of the paper to 2 on dark mode and 1 on light mode, this is used to give the paper a shadow
          sx={{
            p: 3, // set the padding of the paper to 3, this adds space inside the paper
            mt: 0, // set the margin top of the paper to 0, this removes the top margin of the paper
            borderRadius: '12px', // set the border radius of the paper to 12px, this makes the corners of the paper rounded
            backgroundColor: theme.palette.background.paper, // set the background colour of the paper to the background colour of the theme
            border: `1px solid ${theme.palette.divider}` // set the border of the paper to the divider colour of the theme
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, // set the margin bottom of the typography to 2, this adds space below the typography
            fontWeight: 600, // set the font weight of the typography to 600, this makes the font bold
            color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
          }}>
            Ethical Considerations: Facial Emotion Detection {/* set the text of the typography to Ethical Considerations: Facial Emotion Detection */}
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2, for the body text
            sx={{ mb: 1 }} // set the margin bottom of the typography to 1, this adds space below the typography
          >
            <strong>• Bias:</strong> Joy Buolamwini found that facial emotion recognition systems gave more error readings for dark individuals and women. Her research indicated that such systems registered error readings of as much as 34.7% in the case of darker-skinned women, versus 0.8% for lighter-skinned men.
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2, for the body text
            sx={{ mb: 1 }} // set the margin bottom of the typography to 1, this adds space below the typography
          >
            <strong>• Responsibility:</strong> The study sheds light on the need for developers to act on concerns about consent and abuse, including discrimination or profiling.
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2, for the body text
            sx={{ mb: 1 }} // set the margin bottom of the typography to 1, this adds space below the typography
          >
            <strong>• Transparency:</strong> Most face emotion detection techniques work in ways that are complex for humans to understand, which can influence accountability and trust.
          </Typography>
        </Paper>
      </Grid>

      <Dialog // create a dialog component
        open={isResultsInfoOpen} // set the open state of the dialog to the isResultsInfoOpen state
        onClose={handleCloseResultsInfo} // for handling the close results info event
        PaperProps={{ 
          sx: { bgcolor: theme.palette.background.paper } // set the background colour of the paper to the background colour of the theme
        }}
      >
        <DialogTitle 
          sx={{ 
            color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
          }}
        >
          Understanding Facial Emotion Scores
        </DialogTitle>
        <DialogContent dividers> {/* create a dialog content component with dividers */}
          <Typography 
            variant="h6" // set the variant of the typography to h6, for the heading
            gutterBottom // set the gutter bottom of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary colour of the theme
          >
            Confidence Scores
          </Typography>
          <Typography 
            variant="body2" // set the variant of the typography to body2, for the body text
            paragraph // set the paragraph of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.secondary }} // set the colour of the typography to the secondary colour of the theme
          >
            These scores (shown as percentages) represent the model's confidence that a particular emotion is present based on the detected facial features in the image. A higher percentage means the model is more certain based on the visual patterns it learned. For example, 90% confidence in 'Happy' suggests the model strongly detected facial patterns typically associated with happiness.
          </Typography>
          <Typography 
            variant="h6" // set the variant of the typography to h6, for the heading
            gutterBottom // set the gutter bottom of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary colour of the theme
          >
            Model Limitations & Disclaimer
          </Typography>
          <Typography 
            variant="body2" // set the variant of the typography to body2, for the body text
            paragraph // set the paragraph of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.secondary }} // set the colour of the typography to the secondary colour of the theme
          >
            This AI tool decodes visual cues and is prone to making mistakes. It can be affected by bad lighting, face obstructions (hair, glasses, masks), off-camera angles, subtle or ambiguous expressions, and cultural differences in expressing emotions. The tool detects expressions based on patterns learned and might not precisely express the person's true inner feeling or intent. A detected smile might not always mean genuine happiness.
          </Typography>
          <Typography 
            variant="h6" // set the variant of the typography to h6, for the heading
            gutterBottom // set the gutter bottom of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary colour of the theme
          >
            Use with Care
          </Typography>
          <Typography 
            variant="body2" // set the variant of the typography to body2, for the body text
            sx={{ color: theme.palette.text.secondary }} // set the colour of the typography to the secondary colour of the theme
          >
            Please use these results thoughtfully and consider the context. They provide a suggestion based on visual data, but human judgement remains crucial.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultsInfo}>Close</Button> {/* create a button component with an onClick event that closes the dialog */}
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default FaceEmotionTab; // export the FaceEmotionTab component as the default export, this allows the component to be used in other files
