// for the face emotion part of the page

import 
  { 
    useState,
    useRef,
    useEffect
  } from 'react';

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

import {
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  Face as FaceIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';

import EmotionResults from './EmotionResults';

import { detectFaceEmotions } from './EmotionDetectionUtilities';

import { useTheme } from '@mui/material/styles';

const FaceEmotionTab = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [isResultsInfoOpen, setResultsInfoOpen] = useState(false);

  const theme = useTheme();

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview); // clean up the object URL to free memory
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);

      const url = URL.createObjectURL(file);
      setImagePreview(url);

      setEmotions([]); // reset emotions when a new image is selected
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setEmotions([]);
    setError(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
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
            flexDirection: 'column',
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
            Upload a Face Image
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
              cursor: 'pointer',
              mb: 3
            }}
            onClick={handleUploadClick}
          >
            {imagePreview ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
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
                  Click to upload image
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    textAlign: 'center'
                  }}
                >
                  Upload a clear photo of a face to detect emotions
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
                  Supported formats: JPG, PNG, GIF, BMP, WebP
                </Typography>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/bmp,image/webp,image/jpg"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }} // hide the file input
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<FaceIcon />}
              onClick={() => detectFaceEmotions(selectedFile, setLoading, setError, setEmotions)}
              disabled={!imagePreview || loading} // disable if no image or loading
            >
              Detect Face Emotions
            </Button>

            <IconButton
              onClick={handleReset}
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
              sx={{
                mt: 2
              }}
            >
              {error}
            </Alert>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper
          elevation={theme.palette.mode === 'dark' ? 4 : 3} // add a shadow of 4px for dark mode and 3px for light mode
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
              Face Emotion Analysis Results
            </Typography>
            <IconButton
              onClick={handleOpenResultsInfo}
              size="small"
              sx={{ color: theme.palette.text.secondary }}
              aria-label="Results Info"
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          <EmotionResults
            loading={loading}
            emotions={emotions}
            emptyIcon={<FaceIcon
              sx={{ fontSize: 60,
                color: theme.palette.text.secondary,
                mb: 2,
                opacity: 0.5
              }}
            />}
            emptyMessage="Upload an image and click 'Detect Face Emotions' to see results"
            loadingMessage="Analysing face emotions..."
            technologyDescription="Facial analysis powered by a deep learning model that detects emotions from expressions."
          />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 2 : 1}
          sx={{
            p: 3,
            mt: 0,
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6" sx={{ mb: 2,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            Ethical Considerations: Facial Emotion Detection
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1 }}
          >
            <strong>• Bias:</strong> Joy Buolamwini found that facial emotion recognition systems gave more error readings for dark individuals and women. Her research indicated that such systems registered error readings of as much as 34.7% in the case of darker-skinned women, versus 0.8% for lighter-skinned men.
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1 }}
          >
            <strong>• Responsibility:</strong> The study sheds light on the need for developers to act on concerns about consent and abuse, including discrimination or profiling.
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1 }}
          >
            <strong>• Transparency:</strong> Most face emotion detection techniques work in ways that are complex for humans to understand, which can influence accountability and trust.
          </Typography>
        </Paper>
      </Grid>

      <Dialog
        open={isResultsInfoOpen}
        onClose={handleCloseResultsInfo}
        PaperProps={{ 
          sx: { bgcolor: theme.palette.background.paper }
        }}
      >
        <DialogTitle 
          sx={{ 
            color: theme.palette.text.primary
          }}
        >
          Understanding Facial Emotion Scores
        </DialogTitle>
        <DialogContent dividers>
          <Typography 
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Confidence Scores
          </Typography>
          <Typography 
            variant="body2"
            paragraph
            sx={{ color: theme.palette.text.secondary }}
          >
            These scores (shown as percentages) represent the model's confidence that a particular emotion is present based on the detected facial features in the image. A higher percentage means the model is more certain based on the visual patterns it learned. For example, 90% confidence in 'Happy' suggests the model strongly detected facial patterns typically associated with happiness.
          </Typography>
          <Typography 
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Model Limitations & Disclaimer
          </Typography>
          <Typography 
            variant="body2"
            paragraph
            sx={{ color: theme.palette.text.secondary }}
          >
            This AI tool decodes visual cues and is prone to making mistakes. It can be affected by bad lighting, face obstructions (hair, glasses, masks), off-camera angles, subtle or ambiguous expressions, and cultural differences in expressing emotions. The tool detects expressions based on patterns learned and might not precisely express the person's true inner feeling or intent. A detected smile might not always mean genuine happiness.
          </Typography>
          <Typography 
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Use with Care
          </Typography>
          <Typography 
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            Please use these results thoughtfully and consider the context. They provide a suggestion based on visual data, but human judgement remains crucial.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultsInfo}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default FaceEmotionTab;