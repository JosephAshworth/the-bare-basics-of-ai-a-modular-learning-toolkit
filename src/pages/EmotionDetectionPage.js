// emotion detection page itself, with the components imported

import { 
  useState, 
  useEffect 
} from 'react';

// material ui components
import {
  Box, 
  Container, 
  Tabs, 
  Tab, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  IconButton, 
  Typography, 
  useMediaQuery 
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import {
  Face as FaceIcon, 
  TextFields as TextFieldsIcon, 
  AudioFile as AudioFileIcon, 
  InfoOutlined as InfoOutlinedIcon, 
  Launch as LaunchIcon 
} from '@mui/icons-material';

// import the components from the emotion detection components folder
import FaceEmotionTab from '../components/EmotionDetection/FaceEmotionTab';
import TextEmotionTab from '../components/EmotionDetection/TextEmotionTab';
import AudioEmotionTab from '../components/EmotionDetection/AudioEmotionTab';
import EmotionDetectionExplanation from '../components/EmotionDetection/EmotionDetectionExplanation';
import HeroSection from '../components/EmotionDetection/HeroSection';

// hook to track the time spent on the module page
import ModuleTimer from '../hooks/ModuleTimer';

// component to complete the module
import CompleteModuleButton from '../components/CommonComponents/CompleteModuleButton';

// context for the progress
import { useProgress } from '../context/ProgressContext';

const EmotionDetectionPage = () => {
  const [activeTab, setActiveTab] = useState(0); // the active tab for the detection type
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false); // the open state for the info dialog
  
  const theme = useTheme(); // the theme for the app
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // the mobile state for the app
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // changing the tab
  };

  const handleOpenInfoDialog = () => setInfoDialogOpen(true);
  const handleCloseInfoDialog = () => setInfoDialogOpen(false);

  const { updateTimeSpent } = useProgress(); // update the time spent on the module page

  const { getTimeChunk } = ModuleTimer('emotion-detection'); // retrieve the time spent on the module page

  // when the component unmounts, send the time spent on the module page to the backend
  useEffect(() => {
    return () => {
      const secondsChunk = getTimeChunk ? getTimeChunk() : 0;
      if (secondsChunk > 0) {
        console.log(`EmotionDetectionPage unmounting, sending ${secondsChunk}s time chunk.`);
        updateTimeSpent('emotion-detection', secondsChunk);
      } else {
        console.log("EmotionDetectionPage unmounting, no final time chunk to send.");
      }
    };
  }, [updateTimeSpent, getTimeChunk]);

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      background: theme.palette.background.default
    }}>
    
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <HeroSection /> {/* import the hero section component from the folder, which helps to keep the code organised and maintainable */}

        <EmotionDetectionExplanation />

        <Typography
          variant="h1"
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            textAlign: 'center',
            mb: 2
          }}>
          Have a go at testing out the different emotion detectors below
        </Typography>

        <Container 
          maxWidth="lg"
          sx={{
            p: 4,
            borderRadius: '16px',
            backgroundColor: theme.palette.background.paper,
            mt: 4,
            position: 'relative'
          }}
        >
          <IconButton 
            onClick={handleOpenInfoDialog}
            size="small"
            sx={{ 
              position: 'absolute',
              color: theme.palette.text.secondary,
              top: '10px',
              left: '10px'
            }}
            aria-label="Emotion Detection Info"
          >
            <InfoOutlinedIcon />
          </IconButton>

          <Box
            sx={{ 
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto',
                my: 4
              }}>
              Note: All uploaded images and audio files are deleted immediately after the analysis is completed, and are not stored on the server.
              Always respect user privacy and data protection when uploading images of other people.
            </Typography>
            <Box sx={{ 
              display: isMobile ? 'block' : 'flex',
              justifyContent: isMobile ? 'flex-start' : 'center',
              borderBottom: 1,
              borderColor: theme.palette.divider,
              mb: 2
            }}>
              <Tabs 
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Model Results Tabs"
                orientation={isMobile ? 'vertical' : 'horizontal'}
                variant={'scrollable'}
                allowScrollButtonsMobile={false}
                sx={{
                  width: isMobile ? '100%' : 'auto',
                  '.MuiTab-root': { // target the root element of the MuiTab component for additional styling
                    alignItems: isMobile ? 'flex-start' : 'center', // align items to the start on mobile devices, otherwise center them
                    minHeight: '48px', // set the minimum height of the tab
                    px: isMobile ? 2 : '16px' // set the padding of the tab on mobile devices, otherwise set it to 16px
                  }
                }}
              >
                {/* the tabs for the different detection types */}
                <Tab icon={<FaceIcon />} label="Face Emotion" iconPosition="start"/>
                <Tab icon={<TextFieldsIcon />} label="Text Emotion" iconPosition="start"/>
                <Tab icon={<AudioFileIcon />} label="Audio Emotion" iconPosition="start"/>
              </Tabs> 
            </Box>
            
            <Box
              sx={{ 
                p: { xs: 2, md: 4 },
                bgcolor: 'background.paper'
              }}
            > 
              <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                <FaceEmotionTab />
              </Box>
              
              <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                <TextEmotionTab />
              </Box>
              
              <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
                <AudioEmotionTab />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
              mb: 3
            }}
          >
            {/* the button to take the end of module quiz */}
            <Button
              variant="contained" // a background colour button
              color="primary"
              href="https://docs.google.com/forms/d/e/1FAIpQLScr_mnmgV2ZBQ8Bfw0DPp4ZHsHSL4qap2-WFYt1mqPSGANAZw/viewform?usp=sharing"
              target="_blank" // open the link in a new tab
              rel="noopener noreferrer" // prevent the new page from accessing the window.opener property, as a security measure
              startIcon={<LaunchIcon />}
              sx={{
                textTransform: 'none', // keep the original text casing without any automatic capitalisation changes
                fontSize: '1rem',
                py: 1.5,
                px: 3
              }}
            >
              Take End of Module Quiz
            </Button>
          </Box>

          {/* the button to complete the module, with the module id and name to be specific */}
          <Box mt={2} mb={4}>
            <CompleteModuleButton 
              moduleId="emotion-detection"
              moduleName="Emotion Detection"
            />
          </Box>
        </Container>

        {/* the dialog to show the information about the emotion detection methods, opened as an overlay */}
        <Dialog 
          open={isInfoDialogOpen}
          onClose={handleCloseInfoDialog}
          PaperProps={{ sx: { bgcolor: 'background.paper' } }}
        >
          <DialogTitle sx={{ color: 'text.primary' }}>Emotion Detection Methods</DialogTitle>
          <DialogContent dividers sx={{ borderColor: 'divider' }}>
            <DialogContentText component="div" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>Face Emotion Detection</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Detects facial expressions of frames or images of a video to identify emotions like happiness, sadness, anger and surprise. It is primarily made up of face detection, facial landmark detection (detection of important points on the face, such as corners of eyes and mouth) and expression classification relative to these features.
              </Typography>
            </DialogContentText>
            <DialogContentText component="div" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>Text Emotion Detection</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Utilises Natural Language Processing (NLP) (teaching computers to understand human language) techniques to read written words and make an educated guess at the emotional undertone. It looks for keywords, sentiment polarity (whether the text is positive, negative, or neutral in sentiment), and context to classify emotions conveyed in the text.
              </Typography>
            </DialogContentText>
            <DialogContentText component="div">
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>Audio Emotion Detection</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Examines characteristics of speech signals such as pitch, tone, intensity, and speech rate. These include characteristics of sound such as how deep or high the voice is, the loudness, and the rhythm from audio recordings to detect the speaker's emotional condition.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInfoDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default EmotionDetectionPage;