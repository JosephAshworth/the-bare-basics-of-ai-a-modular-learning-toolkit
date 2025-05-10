import
  { 
    useState // import useState, this is used to manage state in functional components
  } from 'react';

import {
  Box, // import Box from MUI
  Typography, // import Typography from MUI
  Grid, // import Grid from MUI
  Paper, // import Paper from MUI
  Button, // import Button from MUI
  Alert, // import Alert from MUI
  IconButton, // import IconButton from MUI
  TextField, // import TextField from MUI
  Dialog, // import Dialog from MUI
  DialogTitle, // import DialogTitle from MUI
  DialogContent, // import DialogContent from MUI
  DialogActions // import DialogActions from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import {
  Refresh as RefreshIcon, // import RefreshIcon from MUI
  TextFields as TextFieldsIcon, // import TextFieldsIcon from MUI
  InfoOutlined as InfoOutlinedIcon // import InfoOutlinedIcon from MUI
} from '@mui/icons-material';

import EmotionResults from './EmotionResults'; // import EmotionResults from the EmotionResults file, this is used to display the emotion results

import { detectTextEmotions } from './utils'; // import the detectTextEmotions function from the utils file, this is used to detect the emotions from the text

const TextEmotionTab = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const [textInput, setTextInput] = useState(''); // state for the text input
  const [loading, setLoading] = useState(false); // state for the loading
  const [error, setError] = useState(null); // state for the error
  const [emotions, setEmotions] = useState([]); // state for the emotions
  const [isResultsInfoOpen, setResultsInfoOpen] = useState(false); // state for the results info dialog
  

  const handleTextInputChange = (event) => { // for handling the text input change
    setTextInput(event.target.value); // set the text input to the value of the event target
    setError(null); // set the error to null
    setEmotions([]); // set the emotions to an empty array
  };
  

  const handleTextReset = () => { // for handling the text reset
    setTextInput(''); // set the text input to an empty string
    setEmotions([]); // set the emotions to an empty array
    setError(null); // set the error to null
  };


  const handleOpenResultsInfo = () => setResultsInfoOpen(true); // for handling the open results info
  const handleCloseResultsInfo = () => setResultsInfoOpen(false); // for handling the close results info
  
  return (
    <Grid container spacing={4}> {/* create a grid container component with a spacing of 4, this is used to create a grid layout */}
      <Grid item xs={12} md={6}> {/* create a grid item component with a width of 12 on small screens and 6 on medium screens, this is used to create a grid layout */}
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 4 : 3} // set the elevation of the paper to 4 on dark mode and 3 on light mode, this adds a shadow to the paper
          sx={{
            p: 4, // set the padding of the paper to 4, this adds space inside the paper
            borderRadius: '16px', // set the border radius of the paper to 16px, this is used to create a rounded paper
            height: '100%', // set the height of the paper to 100%, this makes the paper take up the remaining space in the grid
            display: 'flex', // set the display of the paper to flex, this allows the paper to be flexed
            flexDirection: 'column', // set the flex direction of the paper to column, this allows the paper to be flexed vertically
            bgcolor: theme.palette.background.paper, // set the background colour of the paper to the background colour of the theme
            boxShadow: theme.shadows[theme.palette.mode === 'dark' ? 8 : 4] // set the box shadow of the paper to the primary colour of the theme
          }}
        >
          <Typography
            variant="h5" // set the variant of the typography to h5, this is used to create a heading
            sx={{
              mb: 3, // set the margin bottom of the typography to 3, this adds space below the typography
              fontWeight: 600, // set the font weight of the typography to 600, this is used to create a bold heading
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }} 
          >
            Enter Text for Emotion Analysis {/* create a heading component with the text Enter Text for Emotion Analysis */}
          </Typography>
          

          <Box 
            sx={{ 
              position: 'relative', // set the position of the box to relative, this allows the box to be positioned relative to its normal position
              flex: 1, // set the flex of the box to 1, this allows the box to be flexed
              mb: 3, // set the margin bottom of the box to 3, this adds space below the box
              minHeight: '300px' // set the minimum height of the box to 300px, this is used to create a box
            }}
          >

            {!textInput && ( // if the text input is empty, create a box component
              <Box 
                sx={{
                  position: 'absolute', // set the position of the box to absolute
                  top: 0, // set the top of the box to 0, this is used to create a box
                  left: 0, // set the left of the box to 0, this is used to create a box
                  width: '100%', // set the width of the box to 100%, this makes the box take up the remaining space in the paper
                  height: '100%', // set the height of the box to 100%, this makes the box take up the remaining space in the paper
                  display: 'flex', // set the display of the box to flex, this allows the box to be flexed
                  flexDirection: 'column', // set the flex direction of the box to column, this allows the box to be flexed vertically
                  alignItems: 'center', // set the align items of the box to centre, this centres the box
                  justifyContent: 'center', // set the justify content of the box to centre, this centres the box
                  p: 2, // set the padding of the box to 2, this adds space inside the box
                  color: theme.palette.text.secondary, // set the colour of the box to the secondary colour of the theme
                  pointerEvents: 'none', // set the pointer events of the box to none, this prevents the box from being interactive
                  border: '1px solid', // set the border of the box to 1px solid, this creates a border around the box
                  borderColor: theme.palette.divider, // set the border colour of the box to the divider colour of the theme
                  borderRadius: '4px', // set the border radius of the box to 4px, this creates a rounded box
                  textAlign: 'center' // set the text align of the box to centre, this centres the text inside the box
                }}
              >
                <TextFieldsIcon sx={{ 
                  fontSize: 60, // set the font size of the icon to 60, this makes the icon large
                  mb: 2, // set the margin bottom of the icon to 2, this adds space below the icon
                  color: theme.palette.primary.main // set the colour of the icon to the primary colour of the theme
                }} />
                <Typography variant="h6" sx={{ 
                  mb: 0.5, // set the margin bottom of the typography to 0.5, this adds space below the typography
                  color: theme.palette.primary.main // set the colour of the typography to the primary colour of the theme
                }}>
                  Click here to enter text
                </Typography>
                <Typography
                  variant="body2" // set the variant of the typography to body2, this is used to create a body text
                  sx={{ mb: 1 }} // set the margin bottom of the typography to 1, this adds space below the typography
                >
                  Type or paste a sentence or paragraph.
                </Typography>
                <Typography
                  variant="caption" // set the variant of the typography to caption, this is used to create a caption text
                >
                  (English language recommended for best results)
                </Typography>
              </Box>
            )}


            <TextField
              multiline // set the multiline of the text field to true, this allows the text field to be multiline
              rows={8} // set the rows of the text field to 8, this is used to create a text field
              value={textInput} // set the value of the text field to the text input
              onChange={handleTextInputChange} // set the onChange of the text field to the handleTextInputChange function
              variant="outlined" // set the variant of the text field to outlined, this is used to create a text field
              sx={{ 
                width: '100%', // set the width of the text field to 100%, this makes the text field take up the remaining space in the paper
                height: '100%', // set the height of the text field to 100%, this makes the text field take up the remaining space in the paper
                '& .MuiOutlinedInput-root': {
                  height: '100%', // set the height of the text field to 100%, this makes the text field take up the remaining space in the paper
                  alignItems: 'flex-start', // set the align items of the text field to flex-start, this aligns the text field to the start of the paper
                  '& textarea': {
                    color: theme.palette.text.primary, // set the colour of the text field to the primary colour of the theme
                    height: '100% !important', // set the height of the element to match the height of its parent container
                    overflowY: 'auto !important' // enables vertical scrolling when content exceeds the container's height
                  }
                }
              }}
              fullWidth // set the full width of the text field to true, this makes the text field take up the remaining space in the paper
            />
          </Box>
          
          <Box
            sx={{ 
              display: 'flex', // set the display of the box to flex, this allows the box to be flexed
              gap: 2, // set the gap of the box to 2, this adds space between the buttons
              mt: 'auto' // set the margin top of the box to auto, this makes the box take up the remaining space in the paper
            }}
          >
            <Button 
              variant="contained" // set the variant of the button to contained, this is used to create a button
              color="primary" // set the colour of the button to the primary colour of the theme
              fullWidth // set the full width of the button to true, this makes the button take up the remaining space in the paper
              size="large" // set the size of the button to large, this makes the button large
              startIcon={<TextFieldsIcon />} // set the start icon of the button to the TextFieldsIcon, this is used to create a button with an icon
              onClick={() => detectTextEmotions(textInput, setLoading, setError, setEmotions)} // set the onClick of the button to the detectTextEmotions function
              disabled={!textInput.trim() || loading} // set the disabled of the button to true if the text input is empty or the loading is true, this prevents the button from being clicked
            >
              Analyse Text Emotions
            </Button>
            
            <IconButton 
              color="default" // set the colour of the icon button to the default colour of the theme
              onClick={handleTextReset} // set the onClick of the icon button to the handleTextReset function
              disabled={loading} // set the disabled of the icon button to true if the loading is true, this prevents the icon button from being clicked
              sx={{ 
                border: `1px solid ${theme.palette.divider}`, // set the border of the icon button to 1px solid, this creates a border around the icon button
                color: theme.palette.text.secondary // set the colour of the icon button to the secondary colour of the theme
              }}
            >
              <RefreshIcon /> {/* set the icon of the icon button to the RefreshIcon, this is used to create an icon button with a refresh icon */}
            </IconButton>
          </Box>
          
          {error && ( // if the error is true, create an alert component
            <Alert
              severity="error" // set the severity of the alert to error, this is used to create an alert with an error icon
              sx={{ mt: 2 }} // set the margin top of the alert to 2, this adds space below the alert
            >
              {error} {/* set the error of the alert to the error */}
            </Alert>
          )}
        </Paper>
      </Grid>
      

      <Grid item xs={12} md={6}> {/* create a grid item component with a width of 12 on small screens and 6 on medium screens, this is used to create a grid layout */}
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 4 : 3} // set the elevation of the paper to 4 on dark mode and 3 on light mode, this adds a shadow to the paper
          sx={{
            p: 4, // set the padding of the paper to 4, this adds space inside the paper
            borderRadius: '16px', // set the border radius of the paper to 16px, this is used to create a rounded paper
            height: '100%', // set the height of the paper to 100%, this makes the paper take up the remaining space in the grid
            display: 'flex', // set the display of the paper to flex, this allows the paper to be flexed
            flexDirection: 'column', // set the flex direction of the paper to column, this allows the paper to be flexed vertically
            bgcolor: theme.palette.background.paper, // set the background colour of the paper to the background colour of the theme
            boxShadow: theme.shadows[theme.palette.mode === 'dark' ? 8 : 4] // set the box shadow of the paper to the primary colour of the theme
          }}
        >

          <Box sx={{ display: 'flex', // set the display of the box to flex, this allows the box to be flexed
              alignItems: 'center', // set the align items of the box to centre, this centres the box
              justifyContent: 'space-between', // set the justify content of the box to space between, this adds space between the items in the box
              mb: 3 // set the margin bottom of the box to 3, this adds space below the box
            }}
          >
            <Typography
              variant="h5" // set the variant of the typography to h5, this is used to create a heading
              sx={{ fontWeight: 600, // set the font weight of the typography to 600, this is used to create a bold heading
                color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
              }}
            >
              Text Emotion Analysis Results
            </Typography>
            <IconButton onClick={handleOpenResultsInfo} // set the onClick of the icon button to the handleOpenResultsInfo function
              size="small" // set the size of the icon button to small, this makes the icon button small
              sx={{ color: 'grey.500' }} // set the colour of the icon button to the grey colour of the theme
              aria-label="Results Info" // set the aria label of the icon button to Results Info
            >
              <InfoOutlinedIcon fontSize="small" /> {/* set the icon of the icon button to the InfoOutlinedIcon, this is used to create an icon button with an info icon */}
            </IconButton>
          </Box>  
          
          <EmotionResults
            loading={loading} // set the loading state of the emotion results to the loading state
            emotions={emotions} // set the emotions of the emotion results to the emotions
            emptyIcon={<TextFieldsIcon
              sx={{
                fontSize: 60, // set the font size of the icon to 60, this makes the icon large
                color: theme.palette.text.secondary, // set the colour of the icon to the secondary colour of the theme
                mb: 2, // set the margin bottom of the icon to 2, this adds space below the icon
                opacity: 0.5 // set the opacity of the icon to 0.5, this makes the icon slightly transparent
              }}
            />}
            emptyMessage="Enter some text and click 'Analyse Text Emotions' to see results" // set the empty message of the emotion results to the text Enter some text and click 'Analyse Text Emotions' to see results
            loadingMessage="Analysing text emotions..." // set the loading message of the emotion results to the text
            technologyDescription="Text analysis powered by a specialised NLP model fine-tuned to detect emotions in text." // set the technology description of the emotion results to the text
          />
        </Paper>
      </Grid>


      <Grid item xs={12}> {/* create a grid item component with a width of 12 on small screens and 6 on medium screens, this is used to create a grid layout */}
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 2 : 1} // set the elevation of the paper to 2 on dark mode and 1 on light mode, this adds a shadow to the paper
          sx={{
            p: 3, // set the padding of the paper to 3, this adds space inside the paper
            mt: 0, // set the margin top of the paper to 0, this adds space above the paper
            borderRadius: '12px', // set the border radius of the paper to 12px, this is used to create a rounded paper
            backgroundColor: theme.palette.background.paper, // set the background colour of the paper to the background colour of the theme
            border: `1px solid ${theme.palette.divider}` // set the border of the paper to 1px solid, this creates a border around the paper
          }}
        >
          <Typography
            variant="h6" // set the variant of the typography to h6, this is used to create a heading
            sx={{
              mb: 2, // set the margin bottom of the typography to 2, this adds space below the typography
              fontWeight: 600, // set the font weight of the typography to 600, this is used to create a bold heading
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            Ethical Considerations: Text Emotion Detection
          </Typography>

          <Typography
            variant="body2" // set the variant of the typography to body2, this is used to create a body text
            sx={{ mb: 1 }} // set the margin bottom of the typography to 1, this adds space below the typography
          >
            <strong>• Bias:</strong> Odbal (Inner Mongolia University) explored how certain text emotion detectors assigning certain emotions to a gender. For example, feelings such as "joy" and "sadness" tend more towards women, whereas "anger" tends more towards men.
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2, this is used to create a body text
            sx={{ mb: 1 }} // set the margin bottom of the typography to 1, this adds space below the typography
          >
            <strong>• Responsibility:</strong> This research prompted the need for a mitigation strategy that does not rely on gender-balanced datasets or gender-swapping techniques. Instead, the researchers tried adjusting the model training process to reduce sensitivity to gender, without compromising the overall accuracy of emotion detection.
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2, this is used to create a body text
            sx={{ mb: 1 }} // set the margin bottom of the typography to 1, this adds space below the typography
          >
            <strong>• Transparency:</strong> Natural language processing models can be complex, making it difficult to understand how specific inputs lead to particular emotion classifications. This can lead to a lack of trust in model outputs, as some emotions might, from a human perspective, appear more prominent than others.
          </Typography>
        </Paper>
      </Grid>


      <Dialog 
        open={isResultsInfoOpen} // set the open state of the dialog to the isResultsInfoOpen state
        onClose={handleCloseResultsInfo} // set the onClose of the dialog to the handleCloseResultsInfo function
        PaperProps={{ 
          sx: { bgcolor: theme.palette.background.paper } // set the background colour of the paper to the background colour of the theme
        }}
      >
        <DialogTitle 
          sx={{ color: theme.palette.text.primary }} // set the colour of the dialog title to the primary colour of the theme
        >
          Understanding Emotion Scores
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom // set the gutter bottom of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary colour of the theme
          >
            Confidence Scores
          </Typography>
          <Typography variant="body2" paragraph // set the paragraph of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.secondary }} // set the colour of the typography to the secondary colour of the theme
          >
            These scores (shown as percentages) represent the model's confidence that a particular emotion is present based on the input text. A higher percentage means the model is more certain based on the patterns it learned. For example, 90% confidence in 'Joy' suggests the model strongly detected patterns associated with joy in the text.
          </Typography>
          <Typography variant="h6" gutterBottom // set the gutter bottom of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary colour of the theme
          >
            Model Limitations & Disclaimer
          </Typography>
          <Typography variant="body2" paragraph // set the paragraph of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.secondary }} // set the colour of the typography to the secondary colour of the theme
          >
            This AI model is a tool and can make mistakes. It might misinterpret sarcasm, irony, subtle language, cultural nuances, or text written in languages other than English. The detected emotions are based on learned patterns and may not perfectly reflect the true human feeling or intent behind the text.
          </Typography>
          <Typography variant="h6" gutterBottom // set the gutter bottom of the typography to true, this adds space below the typography
            sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary colour of the theme
          >
            Use with Care
          </Typography>
          <Typography variant="body2" // set the variant of the typography to body2, this is used to create a body text
            sx={{ color: theme.palette.text.secondary }} // set the colour of the typography to the secondary colour of the theme
          >
            Please use these results thoughtfully and consider the context. They provide a suggestion, but human judgement remains crucial.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultsInfo}>Close</Button> {/* set the onClick of the button to the handleCloseResultsInfo function */}
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TextEmotionTab; // export the TextEmotionTab component as the default export, this allows the component to be used in other files
