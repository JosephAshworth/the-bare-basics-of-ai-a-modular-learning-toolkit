import
  { useState, // import useState, this is used to manage the state of the component
    useEffect // import useEffect, this is used to manage the side effects of the component
  }
from 'react';

import {
  Box, // import Box from MUI
  Container, // import Container from MUI
  Tabs, // import Tabs from MUI
  Tab, // import Tab from MUI
  Dialog, // import Dialog from MUI
  DialogTitle, // import DialogTitle from MUI
  DialogContent, // import DialogContent from MUI
  DialogContentText, // import DialogContentText from MUI
  DialogActions, // import DialogActions from MUI
  Button, // import Button from MUI
  IconButton, // import IconButton from MUI
  Typography, // import Typography from MUI
  useMediaQuery // import useMediaQuery from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import {
  Face as FaceIcon, // import Face as FaceIcon from MUI
  TextFields as TextFieldsIcon, // import TextFields as TextFieldsIcon from MUI
  AudioFile as AudioFileIcon, // import AudioFile as AudioFileIcon from MUI
  InfoOutlined as InfoOutlinedIcon, // import InfoOutlined as InfoOutlinedIcon from MUI
  Launch as LaunchIcon // import Launch as LaunchIcon from MUI
} from '@mui/icons-material';

import FaceEmotionTab from '../components/EmotionDetection/FaceEmotionTab'; // import FaceEmotionTab from the FaceEmotionTab file, which is a separate component
import TextEmotionTab from '../components/EmotionDetection/TextEmotionTab'; // import TextEmotionTab from the TextEmotionTab file, which is a separate component
import AudioEmotionTab from '../components/EmotionDetection/AudioEmotionTab'; // import AudioEmotionTab from the AudioEmotionTab file, which is a separate component
import EmotionDetectionExplanation from '../components/EmotionDetection/EmotionDetectionExplanation'; // import EmotionDetectionExplanation from the EmotionDetectionExplanation file, which is a separate component
import HeroSection from '../components/EmotionDetection/HeroSection'; // import HeroSection from the HeroSection file, which is a separate component
import useModuleTimer from '../hooks/useModuleTimer'; // import useModuleTimer from the useModuleTimer file, which is a separate hook
import CompleteModuleButton from '../components/ModuleProgress/CompleteModuleButton'; // import CompleteModuleButton from the CompleteModuleButton file, which is a separate component
import { useProgress } from '../context/ProgressContext'; // import useProgress from the ProgressContext file, this is used to track the progress of the module

const EmotionDetectionPage = () => {
  const [activeTab, setActiveTab] = useState(0); // state variable for the active tab
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false); // state variable for the info dialog open
  
  const theme = useTheme(); // for getting the MUI theme object
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // for checking if the screen is mobile
  
  const handleTabChange = (event, newValue) => { // for handling the tab change
    setActiveTab(newValue); // set the active tab to the new value
  };

  const handleOpenInfoDialog = () => setInfoDialogOpen(true); // for handling the open info dialog
  const handleCloseInfoDialog = () => setInfoDialogOpen(false); // for handling the close info dialog

  const { updateTimeSpent } = useProgress(); // for updating the time spent

  const { getTimeChunk } = useModuleTimer('emotion-detection'); // for getting the time chunk
  


  useEffect(() => {
    return () => {
      const secondsChunk = getTimeChunk ? getTimeChunk() : 0; // for getting the time chunk (the time spent on the module)
      if (secondsChunk > 0) { // if the time chunk is greater than 0
        console.log(`EmotionDetectionPage unmounting, sending ${secondsChunk}s time chunk.`); // log the time chunk
        updateTimeSpent('emotion-detection', secondsChunk); // update the time spent
      } else { // if the time chunk is not greater than 0
        console.log("EmotionDetectionPage unmounting, no final time chunk to send."); // log the time chunk
      }
    };
  }, [updateTimeSpent, getTimeChunk]); // use the updateTimeSpent and getTimeChunk as dependencies

  return (
    <Box sx={{ 
      display: 'flex', // set the display to flex, creating a flex container
      flexDirection: 'column', // set the flex direction to column, stacking the child elements vertically
      minHeight: '100vh', // set the minimum height to 100vh, ensuring the box takes up the full height of the viewport
      background: theme.palette.background.default // set the background to the default background colour based on the theme
    }}>
    
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <HeroSection /> {/* render the HeroSection component */}

        <EmotionDetectionExplanation /> {/* render the EmotionDetectionExplanation component */}

        <Typography
          variant="h1" // set the variant to h1, creating a heading
          sx={{ 
            fontWeight: 600, // set the font weight to 600, creating a heading with a large font weight
            color: theme.palette.text.primary, // set the colour to the primary colour based on the theme
            textAlign: 'center', // set the text alignment to centre
            mb: 2 // set the margin bottom to 2, adding space below the heading
          }}>
          Have a go at testing out the different emotion detectors below
        </Typography>


        <Container 
          maxWidth="lg"
          sx={{
            p: 4, // set the padding to 4, adding space inside the container
            borderRadius: '16px', // set the border radius to 16px, creating a rounded container
            backgroundColor: theme.palette.background.paper, // set the background colour to the paper colour based on the theme
            mt: 4, // set the margin top to 4, adding space above the container
            position: 'relative' // set the position to relative, allowing the container to be positioned relative to its normal position
          }}
        >
          <IconButton 
            onClick={handleOpenInfoDialog} // for handling the open info dialog
            size="small" // set the size to small, creating a small icon button
            sx={{ 
              position: 'absolute', // set the position to absolute, allowing the icon button to be positioned relative to the container
              color: theme.palette.text.secondary, // set the colour to the secondary colour based on the theme
              top: '10px', // set the top position to 10px, adding space above the icon button
              left: '10px' // set the left position to 10px, adding space to the left of the icon button

            }}
            aria-label="Emotion Detection Info" // set the aria label to Emotion Detection Info, which is used to describe the icon button
          >
            <InfoOutlinedIcon /> {/* render the InfoOutlinedIcon */}
          </IconButton>

          <Box
            sx={{ 
              display: 'flex', // set the display to flex, creating a flex container
              flexDirection: 'column' // set the flex direction to column, stacking the child elements vertically
            }}
          >
            <Typography
              sx={{
                color: theme.palette.text.secondary, // set the colour to the secondary colour based on the theme
                textAlign: 'center', // set the text alignment to centre
                maxWidth: 600, // set the maximum width to 600
                mx: 'auto', // set the horizontal margin to auto, centering the text
                my: 4 // set the vertical margin to 4, adding space above and below the text
              }}>
              Note: All uploaded images and audio files are deleted immediately after the analysis is completed, and are not stored on the server.
              Always respect user privacy and data protection when uploading images of other people.
            </Typography>
            <Box sx={{ 
              display: isMobile ? 'block' : 'flex', // if the screen is mobile, set the display to block, otherwise set the display to flex
              justifyContent: isMobile ? 'flex-start' : 'center', // if the screen is mobile, set the justify content to flex-start, otherwise set the justify content to centre
              borderBottom: 1, // set the border bottom to 1, creating a border below the box
              borderColor: theme.palette.divider, // set the border colour to the divider colour based on the theme
              mb: 2 // set the margin bottom to 2, adding space below the box
            }}>
              <Tabs 
                value={activeTab} // set the value to the active tab
                onChange={handleTabChange} // for handling the tab change
                aria-label="Model Results Tabs" // set the aria label to Model Results Tabs, which is used to describe the tabs
                orientation={isMobile ? 'vertical' : 'horizontal'} // if the screen is mobile, set the orientation to vertical, otherwise set the orientation to horizontal
                variant={'scrollable'} // set the variant to scrollable, allowing the tabs to scroll
                allowScrollButtonsMobile={false} // set the allow scroll buttons mobile to false, preventing the scroll buttons from being shown on mobile
                sx={{
                  width: isMobile ? '100%' : 'auto', // if the screen is mobile, set the width to 100%, otherwise set the width to auto
                  '.MuiTab-root': {
                    alignItems: isMobile ? 'flex-start' : 'center', // if the screen is mobile, set the align items to flex-start, otherwise set the align items to centre
                    minHeight: '48px', // set the min height to 48px, creating a small tab
                    px: isMobile ? 2 : '16px' // if the screen is mobile, set the horizontal padding to 2 units, otherwise set the horizontal padding to 16px
                  }
                }}
              >
                <Tab icon={<FaceIcon />} label="Face Emotion" iconPosition="start"/> {/* create a tab with a face icon, label Face Emotion, and icon position start */}
                <Tab icon={<TextFieldsIcon />} label="Text Emotion" iconPosition="start"/> {/* create a tab with a text fields icon, label Text Emotion, and icon position start */}
                <Tab icon={<AudioFileIcon />} label="Audio Emotion" iconPosition="start"/> {/* create a tab with an audio file icon, label Audio Emotion, and icon position start */}
              </Tabs> 
            </Box>
            
            <Box
              sx={{ 
                p: { xs: 2, md: 4 }, // set the padding to 2 units on small screens, and 4 units on medium screens
                bgcolor: 'background.paper' // set the background colour to the paper colour based on the theme
              }}
            > 
              <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}> {/* if the active tab is 0, set the display to block, otherwise set the display to none */}
                <FaceEmotionTab /> {/* render the FaceEmotionTab component */}
              </Box>
              
              <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}> {/* if the active tab is 1, set the display to block, otherwise set the display to none */}
                <TextEmotionTab /> {/* render the TextEmotionTab component */}
              </Box>
              
              <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}> {/* if the active tab is 2, set the display to block, otherwise set the display to none */}
                <AudioEmotionTab /> {/* render the AudioEmotionTab component */}
              </Box>
            </Box>
          </Box>
          

          <Box
            sx={{ 
              display: 'flex', // set the display to flex, creating a flex container
              justifyContent: 'center', // set the justify content to centre
              mt: 4, // set the margin top to 4, adding space above the box
              mb: 3 // set the margin bottom to 3, adding space below the box
            }}
          >
            <Button
              variant="contained" // set the variant to contained, creating a button with a background colour
              color="primary" // set the colour to primary, creating a button with a primary colour
              href="https://docs.google.com/forms/d/e/1FAIpQLScr_mnmgV2ZBQ8Bfw0DPp4ZHsHSL4qap2-WFYt1mqPSGANAZw/viewform?usp=sharing" // set the href to the link, which is the end of module quiz
              target="_blank" // set the target to blank, which is used to open the link in a new tab
              rel="noopener noreferrer" // set the rel to noopener noreferrer, which is used to prevent the new tab from accessing the window.opener property
              startIcon={<LaunchIcon />} // set the start icon to the launch icon, which is a link icon
              sx={{
                textTransform: 'none', // set the text transform to none, which is used to prevent the text from being transformed
                fontSize: '1rem', // set the font size to 1rem, creating a small font
                py: 1.5, // set the padding y to 1.5 units, creating a small button
                px: 3 // set the padding x to 3 units, creating a small button
              }}
            >
              Take End of Module Quiz
            </Button>
          </Box>

          <Box mt={2} mb={4}> {/* set the margin top to 2, adding space above the box, and the margin bottom to 4, adding space below the box */}
            <CompleteModuleButton 
              moduleId="emotion-detection" // set the module id to emotion-detection
              moduleName="Emotion Detection" // set the module name to Emotion Detection
            />
          </Box>
        </Container>

        <Dialog 
          open={isInfoDialogOpen} // set the open state to the isInfoDialogOpen state
          onClose={handleCloseInfoDialog} // for handling the close info dialog
          PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the paper props to the background paper colour based on the theme
        >
          <DialogTitle sx={{ color: 'text.primary' }}>Emotion Detection Methods</DialogTitle>
          <DialogContent dividers sx={{ borderColor: 'divider' }}> {/* set the dividers to the divider colour based on the theme */}
            <DialogContentText component="div" sx={{ mb: 2 }}> {/* set the margin bottom to 2, adding space below the dialog content text */}
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>Face Emotion Detection</Typography> {/* set the variant to h6, creating a heading with a large font weight, gutter bottom, adding space below the heading, and the colour to the primary colour based on the theme */}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}> {/* set the variant to body2, creating a small font, and the colour to the secondary colour based on the theme */}
                Detects facial expressions of frames or images of a video to identify emotions like happiness, sadness, anger and surprise. It is primarily made up of face detection, facial landmark detection (detection of important points on the face, such as corners of eyes and mouth) and expression classification relative to these features.
              </Typography>
            </DialogContentText>
            <DialogContentText component="div" sx={{ mb: 2 }}> {/* set the margin bottom to 2, adding space below the dialog content text */}
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>Text Emotion Detection</Typography> {/* set the variant to h6, creating a heading with a large font weight, gutter bottom, adding space below the heading, and the colour to the primary colour based on the theme */}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}> {/* set the variant to body2, creating a small font, and the colour to the secondary colour based on the theme */}
                Utilises Natural Language Processing (NLP) (teaching computers to understand human language) techniques to read written words and make an educated guess at the emotional undertone. It looks for keywords, sentiment polarity (whether the text is positive, negative, or neutral in sentiment), and context to classify emotions conveyed in the text.
              </Typography>
            </DialogContentText>
            <DialogContentText component="div"> {/* set the margin bottom to 2, adding space below the dialog content text */}
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>Audio Emotion Detection</Typography> {/* set the variant to h6, creating a heading with a large font weight, gutter bottom, adding space below the heading, and the colour to the primary colour based on the theme */}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}> {/* set the variant to body2, creating a small font, and the colour to the secondary colour based on the theme */}
                Examines characteristics of speech signals such as pitch, tone, intensity, and speech rate. These include characteristics of sound such as how deep or high the voice is, the loudness, and the rhythm from audio recordings to detect the speaker's emotional condition.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions> {/* set the margin bottom to 2, adding space below the dialog actions */}
            <Button onClick={handleCloseInfoDialog}>Close</Button> {/* set the button to close the dialog */}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default EmotionDetectionPage; // export the EmotionDetectionPage component, allowing it to be used in other files
