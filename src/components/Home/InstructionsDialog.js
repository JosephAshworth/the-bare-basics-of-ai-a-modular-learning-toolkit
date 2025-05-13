// component for displaying instructions on how to use the application
// this component displays a dialog with instructions on how to use the application
// it allows the user to open the dialog and close it
// this will be shown for the submission, but deleted later on

import { useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';

const InstructionsDialog = () => {
  const theme = useTheme();
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const handleOpenInstructions = () => {
    setInstructionsOpen(true);
  };

  const handleCloseInstructions = () => {
    setInstructionsOpen(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4, pb: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleOpenInstructions}
          sx={{
            backgroundColor: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.dark,
            },
            maxWidth: '800px',
            py: 10,
            px: 10,
            textAlign: 'center'
          }}
        >
          <Typography variant="h1">Click for Instructions (For Peer Review and Feedback)</Typography>
        </Button>
      </Box>

      <Dialog
        open={instructionsOpen}
        onClose={handleCloseInstructions}
        aria-labelledby="instructions-dialog-title"
        aria-describedby="instructions-dialog-description"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="instructions-dialog-title" sx={{ color: 'text.primary' }}>
          How to Use This Application
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div" id="instructions-dialog-description" sx={{ color: 'text.secondary' }}> 
            <Typography component="strong" display="block" sx={{ mb: 1 }}>
                Welcome! Here's how to explore the application:
            </Typography>
            <Box component="ol" sx={{ pl: 2, m: 0 }}> {/* create an ordered list */}
              <Box component="li" sx={{ mb: 1.5 }}> {/* create a list item */}
                <strong>Explore & Interact:</strong> First, take some time to look around the different pages.
                Get comfortable with the layout. Try interacting with various elements like:
                <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 0 }}> {/* create an unordered list */}
                    <Box component="li">Dropdown menus</Box>
                    <Box component="li">Sliders</Box>
                    <Box component="li">Buttons</Box>
                </Box>
                See how easily you can understand the information presented on each page.
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <strong>Understand the Theory:</strong> On each module page (Fuzzy Logic, Machine Learning, Emotion Detection), look for the theory sections, often presented in dropdowns or expandable areas. Read through the explanations and see how well you grasp the concepts behind each technology.
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <strong>Test Machine Learning:</strong>
                <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 0 }}>
                    <Box component="li">Go to the Machine Learning module page.</Box>
                    <Box component="li">First, select the 'Iris' dataset and configure the model settings (like model type, test size). Train the model and observe the results. How easy is it to understand the accuracy and confusion matrix?</Box>
                    <Box component="li">Next, select 'Custom Dataset'. Upload your own CSV file (or find one online, see the info icon next to the dataset dropdown for tips). Configure, train, and check the results again.</Box>
                </Box>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <strong>Test Emotion Detection:</strong> Navigate to the Emotion Detection module. Try uploading an image, typing some text, or uploading an audio file to see the detected emotions.
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <strong>Test Fuzzy Logic:</strong> Visit the Fuzzy Logic module page. Experiment with the different scenarios (Comfort, Air Quality, etc.) by adjusting the input sliders and observing the resulting fuzzy output.
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <strong>Complete Modules & Check Progress:</strong> After exploring and testing each module, click the "Mark as Complete" button found at the bottom of the module page.
                Finally, navigate to your <strong>Profile Page</strong> (link usually in the top navigation bar) to see your completed modules and the time you've spent interacting with each one.
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <strong>Test Your Knowledge:</strong> Once you feel comfortable with a module, take the end-of-module quiz associated with it to check your understanding of the concepts.
              </Box>
              <Box component="li" sx={{ mb: 0 }}>
                <strong>Share Your Feedback:</strong> After exploring all the modules and taking the quizzes, please complete the final <strong>Feedback Survey</strong> (found in the navigation bar) to provide your overall feedback on the platform.
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInstructions} autoFocus>
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InstructionsDialog;
