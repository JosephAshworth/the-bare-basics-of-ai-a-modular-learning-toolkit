import 
  { 
    useState, // import useState, this is used to manage state in functional components
    useRef, // import useRef, this is used to manage references in functional components
    useEffect // import useEffect, this is used to manage side effects in functional components
  } 
from 'react';

import {
  Box, // import the Box component from MUI
  Typography, // import the Typography component from MUI
  Grid, // import the Grid component from MUI
  Paper, // import the Paper component from MUI
  Button, // import the Button component from MUI
  Alert, // import the Alert component from MUI
  IconButton, // import the IconButton component from MUI
  Dialog, // import the Dialog component from MUI
  DialogTitle, // import the DialogTitle component from MUI
  DialogContent, // import the DialogContent component from MUI
  DialogActions // import the DialogActions component from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import {
  CloudUpload as CloudUploadIcon, // import the CloudUpload icon from the @mui/icons-material library
  Refresh as RefreshIcon, // import the Refresh icon from the @mui/icons-material library
  AudioFile as AudioFileIcon, // import the AudioFile icon from the @mui/icons-material library
  InfoOutlined as InfoOutlinedIcon // import the InfoOutlined icon from the @mui/icons-material library
} from '@mui/icons-material';

import EmotionResults from './EmotionResults'; // import the EmotionResults component from the EmotionResults file, this is used to display the emotion results

import { detectAudioEmotions } from './utils'; // import the detectAudioEmotions function from the utils file, this is used to detect the emotions from the audio file

const AudioEmotionTab = () => {
  const [audioFile, setAudioFile] = useState(null); // state variable to store the audio file
  const [audioPreview, setAudioPreview] = useState(null); // state variable to store the audio preview
  const [loading, setLoading] = useState(false); // state variable to store the loading state
  const [error, setError] = useState(null); // state variable to store the error
  const [emotions, setEmotions] = useState([]); // state variable to store the emotions
  const [isResultsInfoOpen, setResultsInfoOpen] = useState(false); // state variable to store the results info open state
  
  const theme = useTheme(); // for getting the MUI theme object
  
  const fileInputRef = useRef(null); // for getting the file input reference, which represents the input element for the file upload
  
  useEffect(() => { // for managing the side effects of the component
    return () => { // for returning a cleanup function that unsubscribes from the auth state changed event
      if (audioPreview) { // for checking if the audio preview is not null
        URL.revokeObjectURL(audioPreview); // for revoking the object URL of the audio preview
      }
    };
  }, [audioPreview]);
  

  const handleAudioChange = (event) => { // for handling the audio change event
    const file = event.target.files[0]; // for getting the first file from the event target
    if (file) { // for checking if the file is not null
      setAudioFile(file); // for setting the audio file to the file
      setError(null); // for setting the error to null
      
      const url = URL.createObjectURL(file); // for creating the object URL of the file
      setAudioPreview(url); // for setting the audio preview to the object URL
      
      setEmotions([]); // for setting the emotions to an empty array
    }
  };
  
  const handleUploadClick = () => { // for handling the upload click event
    fileInputRef.current.click(); // for clicking the file input reference
  };
  
  const handleReset = () => { // for handling the reset event
    setAudioFile(null); // for setting the audio file to null
    setAudioPreview(null); // for setting the audio preview to null
    setEmotions([]); // for setting the emotions to an empty array
    setError(null); // for setting the error to null
    
    if (audioPreview) { // for checking if the audio preview is not null
      URL.revokeObjectURL(audioPreview); // for revoking the object URL of the audio preview
    }
  };

  const handleOpenResultsInfo = () => setResultsInfoOpen(true); // for handling the open results info event
  const handleCloseResultsInfo = () => setResultsInfoOpen(false); // for handling the close results info event
  
  return (
    <Grid container spacing={4}> {/* for creating a grid container with a spacing of 4 */}
      <Grid item xs={12} md={6}> {/* for creating a grid item with a size of 12 for small screens and 6 for medium screens */}
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 4 : 3} // for setting the elevation of the paper to 4 for dark mode and 3 for light mode, this is used to create a shadow effect
          sx={{
            p: 4, // for setting the padding of the paper to 4, to add space between the paper and the content
            borderRadius: '16px', // for setting the border radius of the paper to 16px, to round the corners of the paper
            height: '100%', // for setting the height of the paper to 100%, to make the paper take the full height of the container
            display: 'flex', // for setting the display of the paper to flex, to make the paper a flex container
            flexDirection: 'column', // for setting the flex direction of the paper to column, to make the paper a vertical flex container
            backgroundColor: theme.palette.background.paper // for setting the background colour of the paper to the background colour of the theme
          }}
        >
          <Typography 
            variant="h5" // for setting the variant of the typography to h5, to make the typography a heading
            sx={{ 
              mb: 3, // for setting the margin bottom of the typography to 3, to add space between the typography and the content
              fontWeight: 600, // for setting the font weight of the typography to 600, to make the typography bold
              color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
            }}
          >
            Upload an Audio File {/* for setting the text of the typography to Upload an Audio File */}
          </Typography>
          
          <Box 
            sx={{
              border: `1px solid ${theme.palette.divider}`, // for setting the border of the box to the divider colour of the theme
              borderRadius: '12px', // for setting the border radius of the box to 12px, to round the corners of the box
              p: 3, // for setting the padding of the box to 3, to add space between the box and the content
              display: 'flex', // for setting the display of the box to flex, to make the box a flex container
              flexDirection: 'column', // for setting the flex direction of the box to column, to make the box a vertical flex container
              alignItems: 'center', // for setting the alignment of the box to centre, to centre the box
              justifyContent: 'center', // for setting the justification of the box to centre, to centre the box
              minHeight: '300px', // for setting the minimum height of the box to 300px, to make the box take the full height of the container
              backgroundColor: theme.palette.background.default, // for setting the background colour of the box to the default background colour of the theme
              cursor: 'pointer', // for setting the cursor of the box to pointer, to indicate that the box is clickable
              mb: 3, // for setting the margin bottom of the box to 3, to add space between the box and the content
              flex: 1 // for setting the flex of the box to 1, to make the box take the full height of the container
            }}
            onClick={handleUploadClick} // for handling the click event of the box
          >
            {audioPreview ? ( // for checking if the audio preview is not null
              <Box
                sx={{
                  width: '100%', // for setting the width of the box to 100%, to make the box take the full width of the container
                  height: '100%', // for setting the height of the box to 100%, to make the box take the full height of the container
                  display: 'flex', // for setting the display of the box to flex, to make the box a flex container
                  flexDirection: 'column', // for setting the flex direction of the box to column, to make the box a vertical flex container
                  justifyContent: 'center', // for setting the justification of the box to centre, to centre the box
                  alignItems: 'center' // for setting the alignment of the box to centre, to centre the box
                }}
              >
                <AudioFileIcon
                  sx={{
                    fontSize: 60, // for setting the font size of the icon to 60, to make the icon large
                    color: theme.palette.primary.main, // for setting the colour of the icon to the primary colour of the theme
                    mb: 2 // for setting the margin bottom of the icon to 2, to add space between the icon and the content
                  }}
                />
                <Typography 
                  variant="h6" // for setting the variant of the typography to h6, to make the typography a heading
                  sx={{
                    mb: 2, // for setting the margin bottom of the typography to 2, to add space between the typography and the content
                    color: theme.palette.primary.main // for setting the colour of the typography to the primary colour of the theme
                  }}
                >
                  {audioFile.name} {/* for setting the text of the typography to the name of the audio file */}
                </Typography>
                <audio 
                  controls // for setting the controls of the audio to true, to make the audio play when the user clicks on the play button
                  src={audioPreview} // for setting the source of the audio to the audio preview
                  style={{ width: '100%', maxWidth: '300px' }} // for setting the style of the audio to the width of the box and the max width of the audio to 300px
                />
                <Typography
                  variant="caption" // for setting the variant of the typography to caption, to make the typography a caption
                  sx={{
                    mt: 2, // for setting the margin top of the typography to 2, to add space between the typography and the content
                    color: theme.palette.text.secondary // for setting the colour of the typography to the secondary colour of the theme
                  }}
                >
                  Size: {(audioFile.size / 1024).toFixed(1)} KB {/* for setting the text of the typography to the size of the audio file in KB */}
                </Typography>
              </Box>
            ) : (
              <>
                <CloudUploadIcon // for setting the icon of the box to the CloudUploadIcon, to display a cloud upload icon
                  sx={{
                    fontSize: 60, // for setting the font size of the icon to 60, to make the icon large
                    color: theme.palette.primary.main, // for setting the colour of the icon to the primary colour of the theme
                    mb: 2 // for setting the margin bottom of the icon to 2, to add space between the icon and the content
                  }}
                />
                <Typography
                  variant="h6" // for setting the variant of the typography to h6, to make the typography a heading
                  sx={{
                    mb: 1, // for setting the margin bottom of the typography to 1, to add space between the typography and the content
                    color: theme.palette.primary.main // for setting the colour of the typography to the primary colour of the theme
                  }}
                >
                  Click to upload audio {/* for setting the text of the typography to Click to upload audio */}
                </Typography>
                <Typography 
                  variant="body2" // for setting the variant of the typography to body2, to make the typography a body
                  sx={{ 
                    color: theme.palette.text.secondary, // for setting the colour of the typography to the secondary colour of the theme
                    textAlign: 'center' // for setting the text alignment of the typography to centre, to centre the typography
                  }}
                >
                  Upload a clear audio recording to detect emotions {/* for setting the text of the typography to Upload a clear audio recording to detect emotions */}
                </Typography>
                <Typography 
                  variant="caption" // for setting the variant of the typography to caption, to make the typography a caption
                  sx={{ 
                    color: theme.palette.text.secondary, // for setting the colour of the typography to the secondary colour of the theme
                    textAlign: 'center', // for setting the text alignment of the typography to centre, to centre the typography
                    mt: 1, // for setting the margin top of the typography to 1, to add space between the typography and the content
                    display: 'block' // for setting the display of the typography to block, to make the typography a block element
                  }}
                >
                  Supported formats: WAV, MP3, OGG, WebM {/* for setting the text of the typography to Supported formats: WAV, MP3, OGG, WebM */}
                </Typography>
              </>
            )}
            <input 
              type="file" // for setting the type of the input to file, to make the input a file input
              accept="audio/*" // for setting the accept of the input to audio/*, to make the input accept audio files
              onChange={handleAudioChange} // for handling the change event of the input
              ref={fileInputRef} // for setting the ref of the input to the file input reference
              style={{ display: 'none' }} // for setting the style of the input to none, to make the input hidden
            />
          </Box>
          
          <Box
            sx={{ 
              display: 'flex', // for setting the display of the box to flex, to make the box a flex container
              gap: 2, // for setting the gap of the box to 2, to add space between the box and the content
              mt: 'auto' // for setting the margin top of the box to auto, to make the box take the full height of the container
            }}
          >
            <Button 
              variant="contained" // for setting the variant of the button to contained, to make the button a contained button
              color="primary" // for setting the colour of the button to primary, to make the button a primary button
              fullWidth // for setting the full width of the button to true, to make the button take the full width of the container
              size="large" // for setting the size of the button to large, to make the button large
              startIcon={<AudioFileIcon />} // for setting the start icon of the button to the AudioFileIcon, to display an audio file icon
              onClick={() => detectAudioEmotions(audioFile, setLoading, setError, setEmotions)} // for handling the click event of the button
              disabled={!audioPreview || loading} // for setting the disabled state of the button to true if the audio preview is not null or the loading state is true
            >
              Detect Audio Emotions {/* for setting the text of the button to Detect Audio Emotions */}
            </Button>
            
            <IconButton 
              onClick={handleReset} // for handling the click event of the icon button
              disabled={loading} // for setting the disabled state of the icon button to true if the loading state is true
              sx={{ 
                border: `1px solid ${theme.palette.divider}`, // for setting the border of the icon button to the divider colour of the theme
                color: theme.palette.text.secondary, // for setting the colour of the icon button to the secondary colour of the theme
                '&:hover': {
                  backgroundColor: theme.palette.action.hover // for setting the background colour of the icon button to the hover colour of the theme
                }
              }}
            >
              <RefreshIcon /> {/* for setting the icon of the icon button to the RefreshIcon, to display a refresh icon */}
            </IconButton>
          </Box>
          
          {error && (
            <Alert 
              severity="error" // for setting the severity of the alert to error, to make the alert a red alert
            >
              {error} {/* for setting the text of the alert to the error */}
            </Alert>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}> {/* for creating a grid item with a size of 12 for small screens and 6 for medium screens */}
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 4 : 3} // for setting the elevation of the paper to 4 for dark mode and 3 for light mode, this is used to create a shadow effect
          sx={{
            p: 4, // for setting the padding of the paper to 4, to add space between the paper and the content
            borderRadius: '16px', // for setting the border radius of the paper to 16px, to round the corners of the paper
            height: '100%', // for setting the height of the paper to 100%, to make the paper take the full height of the container
            display: 'flex', // for setting the display of the paper to flex, to make the paper a flex container
            flexDirection: 'column', // for setting the flex direction of the paper to column, to make the paper a vertical flex container
            backgroundColor: theme.palette.background.paper // for setting the background colour of the paper to the background colour of the theme
          }}
        >
          <Box
            sx={{ 
              display: 'flex', // for setting the display of the box to flex, to make the box a flex container
              alignItems: 'center', // for setting the alignment of the box to centre, to centre the box
              justifyContent: 'space-between', // for setting the justification of the box to space between, to add space between the box and the content
              mb: 3 // for setting the margin bottom of the box to 3, to add space between the box and the content
            }}
          >
            <Typography 
              variant="h5" // for setting the variant of the typography to h5, to make the typography a heading
              sx={{ 
                fontWeight: 600, // for setting the font weight of the typography to 600, to make the typography bold
                color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
              }}
            >
              Audio Emotion Analysis Results {/* for setting the text of the typography to Audio Emotion Analysis Results */}
            </Typography>
            <IconButton 
              onClick={handleOpenResultsInfo} // for handling the click event of the icon button
              size="small" // for setting the size of the icon button to small, to make the icon button small
              sx={{ 
                color: theme.palette.text.secondary // for setting the colour of the icon button to the secondary colour of the theme
              }} 
              aria-label="Results Info" // for setting the aria label of the icon button to Results Info
            >
              <InfoOutlinedIcon fontSize="small" /> {/* for setting the icon of the icon button to the InfoOutlinedIcon, to display an info icon */}
            </IconButton>
          </Box>
          
          <EmotionResults 
            loading={loading} // for setting the loading state of the EmotionResults component to the loading state
            emotions={emotions} // for setting the emotions of the EmotionResults component to the emotions
            emptyIcon={<AudioFileIcon sx={{ fontSize: 60, color: theme.palette.text.secondary, mb: 2, opacity: 0.5 }} />} // for setting the empty icon of the EmotionResults component to the AudioFileIcon, to display an audio file icon
            emptyMessage="Upload an audio file and click 'Detect Audio Emotions' to see results" // for setting the empty message of the EmotionResults component to Upload an audio file and click 'Detect Audio Emotions' to see results
            loadingMessage="Analysing emotions..." // for setting the loading message of the EmotionResults component to Analysing emotions...
            technologyDescription="Audio analysis powered by a specialised deep learning model that detects emotions from voice patterns." // for setting the technology description of the EmotionResults component to Audio analysis powered by a specialised deep learning model that detects emotions from voice patterns.
          />
        </Paper>
      </Grid>

      <Grid item xs={12}> {/* for creating a grid item with a size of 12 for small screens and 6 for medium screens */}
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 2 : 1} // for setting the elevation of the paper to 2 for dark mode and 1 for light mode, this is used to create a shadow effect
          sx={{
            p: 3, // for setting the padding of the paper to 3, to add space between the paper and the content
            mt: 0, // for setting the margin top of the paper to 0, to make the paper take the full height of the container
            borderRadius: '12px', // for setting the border radius of the paper to 12px, to round the corners of the paper
            backgroundColor: theme.palette.background.paper, // for setting the background colour of the paper to the background colour of the theme
            border: `1px solid ${theme.palette.divider}` // for setting the border of the paper to the divider colour of the theme
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, // for setting the margin bottom of the typography to 2, to add space between the typography and the content
            fontWeight: 600, // for setting the font weight of the typography to 600, to make the typography bold
            color: theme.palette.text.primary // for setting the colour of the typography to the primary colour of the theme
          }}>
            Ethical Considerations: Audio Emotion Detection {/* for setting the text of the typography to Ethical Considerations: Audio Emotion Detection */}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>• Bias:</strong> Siddique Ibrahim S. P. (School of Computer Science and Engineering VIT-AP University, Amaravati, India) touches upon biases that occur with models trained on small or non-diverse datasets (RAVDESS in this study) struggle to accurately interpret emotions expressed by speakers with different accents, dialects or gender-based speech patterns. {/* for setting the text of the typography to The strong tag is used to make the text bold, and the typography is used to display the text */}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>• Responsibility:</strong> This study highlights the responsibility of developers to address misclassification of emotions, particularly for underrepresented gender and ethnic groups, as these shortcomings reduce the fairness and reliability of such systems. {/* for setting the text of the typography to The strong tag is used to make the text bold, and the typography is used to display the text */}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>• Transparency:</strong> In audio emotion detectors, limited transparency around how vocal features, including pitch and tone, are processed can lead to a lack of trust in model outputs, as it is difficult to understand how specific inputs lead to particular emotion classifications, as well the gender and underlying reasoning. {/* for setting the text of the typography to The strong tag is used to make the text bold, and the typography is used to display the text */}
          </Typography>
        </Paper>
      </Grid>

      <Dialog open={isResultsInfoOpen} onClose={handleCloseResultsInfo}>
        <DialogTitle>Understanding Emotion Scores</DialogTitle> {/* for setting the text of the dialog title to Understanding Emotion Scores */}
        <DialogContent dividers> {/* for setting the dividers of the dialog content to true, to make the dialog content a divider */}
          <Typography variant="h6" gutterBottom>Confidence Scores</Typography> {/* for setting the text of the typography to Confidence Scores */}
          <Typography variant="body2" paragraph>
            These scores (shown as percentages) represent the model's confidence that a particular emotion is present based on the input audio. A higher percentage means the model is more certain based on the acoustic patterns (like pitch, tone, speed) it learned. For example, 90% confidence in 'Joy' suggests the model strongly detected audio patterns associated with joy. {/* for setting the text of the typography to The strong tag is used to make the text bold, and the typography is used to display the text */}
          </Typography>
          <Typography variant="h6" gutterBottom>Model Limitations & Disclaimer</Typography>
          <Typography variant="body2" paragraph>
            This AI model is a tool and can make mistakes. It might misinterpret emotions due to audio quality, background noise, accents, or variations in speech patterns not well-represented in its training data. The detected emotions are based on learned acoustic patterns and may not perfectly reflect the true human feeling. {/* for setting the text of the typography to The strong tag is used to make the text bold, and the typography is used to display the text */}
          </Typography>
          <Typography variant="h6" gutterBottom>Use with Care</Typography>
          <Typography variant="body2">
            Please use these results thoughtfully and consider the context. They provide a suggestion based on the sound, but human judgement remains crucial. {/* for setting the text of the typography to The strong tag is used to make the text bold, and the typography is used to display the text */}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultsInfo}>Close</Button> {/* for setting the text of the button to Close */}
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default AudioEmotionTab; // Export the AudioEmotionTab component as the default export, making it available to be used in other files
