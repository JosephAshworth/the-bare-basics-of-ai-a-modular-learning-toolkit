// for the audio emotion part of the page

// useRef creates a mutable object which persists for the lifetime of the component
import { useState, useRef, useEffect } from 'react';

// material ui components
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import {
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  AudioFile as AudioFileIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';

// import the emotion results component
import EmotionResults from './EmotionResults';

// import the detect audio emotions function
import { detectAudioEmotions } from './EmotionDetectionUtilities';

const AudioEmotionTab = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [isResultsInfoOpen, setResultsInfoOpen] = useState(false);
  
  const theme = useTheme();
  
  const fileInputRef = useRef(null);
  
  // if the audio preview changes, revoke the object URL to free up resources
  useEffect(() => {
    return () => {
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);
  

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      setError(null);
      
      // create a URL for the audio file
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
      
      setEmotions([]);
    }
  };
  
  // when the upload button is clicked, open the file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  

  // if there is an existing audio preview, revoke the object URL to release the memory associated with it
  // this is important for managing resources efficiently and preventing memory leaks
  const handleReset = () => {
    setAudioFile(null);
    setAudioPreview(null);
    setEmotions([]);
    setError(null);
    
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
  };

  const handleOpenResultsInfo = () => setResultsInfoOpen(true);
  const handleCloseResultsInfo = () => setResultsInfoOpen(false);
  
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 4 : 3}
          sx={{
            p: 4,
            borderRadius: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column', // display the content in a column
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Typography 
            variant="h5"
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Upload an Audio File
          </Typography>
          
          <Box 
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              backgroundColor: theme.palette.background.default,
              cursor: 'pointer', // change the cursor to a pointer when hovering over the box
              mb: 3,
              flex: 1
            }}
            onClick={handleUploadClick}
          >
            {/* if there is an existing audio preview */}
            {audioPreview ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <AudioFileIcon
                  sx={{
                    fontSize: 60,
                    color: theme.palette.primary.main,
                    mb: 2
                  }}
                />
                <Typography 
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: theme.palette.primary.main
                  }}
                >
                  {audioFile.name}
                </Typography>
                <audio 
                  // set the audio element's source to the preview URL and style it responsively with a max width of 300px
                  controls
                  src={audioPreview}
                  style={{ width: '100%', maxWidth: '300px' }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    color: theme.palette.text.secondary
                  }}
                >
                  Size: {(audioFile.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            ) : (
              <>
                <CloudUploadIcon
                  sx={{
                    fontSize: 60,
                    color: theme.palette.primary.main,
                    mb: 2
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: theme.palette.primary.main
                  }}
                >
                  Click to upload audio
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    textAlign: 'center'
                  }}
                >
                  Upload a clear audio recording to detect emotions
                </Typography>
                <Typography 
                  variant="caption"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    textAlign: 'center',
                    mt: 1,
                    display: 'block'
                  }}
                >
                  Supported formats: WAV, MP3, OGG, WebM
                </Typography>
              </>
            )}
            <input 
              // accept files of type audio
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </Box>
          
          <Box
            sx={{ 
              display: 'flex',
              gap: 2,
              mt: 'auto'
            }}
          >
            <Button 
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<AudioFileIcon />}
              onClick={() => detectAudioEmotions(audioFile, setLoading, setError, setEmotions)}
              disabled={!audioPreview || loading} // disable the button if there is no audio preview or the loading state is true
            >
              Detect Audio Emotions
            </Button>
            
            <IconButton 
              onClick={handleReset} // reset the audio file and emotions
              disabled={loading}
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
          
          {error && (
            <Alert 
              severity="error"
            >
              {error}
            </Alert>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 4 : 3}
          sx={{
            p: 4,
            borderRadius: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Box
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3
            }}
          >
            <Typography 
              variant="h5"
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Audio Emotion Analysis Results
            </Typography>
            <IconButton 
              onClick={handleOpenResultsInfo}
              size="small"
              sx={{ 
                color: theme.palette.text.secondary
              }} 
              aria-label="Results Info" // provide a label for the icon button for accessibility
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <EmotionResults 
            loading={loading}
            emotions={emotions}
            emptyIcon={<AudioFileIcon sx={{ fontSize: 60, color: theme.palette.text.secondary, mb: 2, opacity: 0.5 }} />}
            emptyMessage="Upload an audio file and click 'Detect Audio Emotions' to see results"
            loadingMessage="Analysing emotions..."
            technologyDescription="Audio analysis powered by a specialised deep learning model that detects emotions from voice patterns."
          />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 2 : 1}
          sx={{
            p: 3,
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6" sx={{ mb: 2,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            Ethical Considerations: Audio Emotion Detection
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>• Bias:</strong> Siddique Ibrahim S. P. (School of Computer Science and Engineering VIT-AP University, Amaravati, India) touches upon biases that occur with models trained on small or non-diverse datasets (RAVDESS in this study) struggle to accurately interpret emotions expressed by speakers with different accents, dialects or gender-based speech patterns.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>• Responsibility:</strong> This study highlights the responsibility of developers to address misclassification of emotions, particularly for underrepresented gender and ethnic groups, as these shortcomings reduce the fairness and reliability of such systems.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>• Transparency:</strong> In audio emotion detectors, limited transparency around how vocal features, including pitch and tone, are processed can lead to a lack of trust in model outputs, as it is difficult to understand how specific inputs lead to particular emotion classifications, as well the gender and underlying reasoning.
          </Typography>
        </Paper>
      </Grid>

      <Dialog open={isResultsInfoOpen} onClose={handleCloseResultsInfo}>
        <DialogTitle>Understanding Emotion Scores</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Confidence Scores</Typography>
          <Typography variant="body2" paragraph>
            These scores (shown as percentages) represent the model's confidence that a particular emotion is present based on the input audio. A higher percentage means the model is more certain based on the acoustic patterns (like pitch, tone, speed) it learned. For example, 90% confidence in 'Joy' suggests the model strongly detected audio patterns associated with joy.
          </Typography>
          <Typography variant="h6" gutterBottom>Model Limitations & Disclaimer</Typography>
          <Typography variant="body2" paragraph>
            This AI model is a tool and can make mistakes. It might misinterpret emotions due to audio quality, background noise, accents, or variations in speech patterns not well-represented in its training data. The detected emotions are based on learned acoustic patterns and may not perfectly reflect the true human feeling.
          </Typography>
          <Typography variant="h6" gutterBottom>Use with Care</Typography>
          <Typography variant="body2">
            Please use these results thoughtfully and consider the context. They provide a suggestion based on the sound, but human judgement remains crucial.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultsInfo}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default AudioEmotionTab;