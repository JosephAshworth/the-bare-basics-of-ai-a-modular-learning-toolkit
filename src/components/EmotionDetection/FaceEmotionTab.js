import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Alert,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  Face as FaceIcon,
  Psychology as PsychologyIcon,
  ExpandMore as ExpandMoreIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import EmotionResults from './EmotionResults';
import { detectFaceEmotions } from './utils';

const FaceEmotionTab = ({ isDarkMode, themeColors }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emotions, setEmotions] = useState([]);
  
  // Use theme colors or fallback to default colors
  const colors = themeColors || {
    primary: {
      main: isDarkMode ? '#66ccff' : '#1976d2',
      light: isDarkMode ? 'rgba(102, 204, 255, 0.2)' : 'rgba(25, 118, 210, 0.1)'
    },
    background: {
      paper: isDarkMode ? '#1e1e2d' : '#ffffff',
      default: isDarkMode ? '#121212' : '#f5f5f5',
      upload: isDarkMode ? 'rgba(30, 30, 45, 0.8)' : '#f5f8ff'
    },
    text: {
      primary: isDarkMode ? '#ffffff' : '#333333',
      secondary: isDarkMode ? '#e0e0e0' : '#666666'
    },
    border: {
      color: isDarkMode ? '#2a2a40' : '#ddd'
    }
  };
  
  // Refs
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // Cleanup function
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  
  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Create image preview URL
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      
      // Reset any previous analysis
      setEmotions([]);
    }
  };
  
  // Handle image upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle image reset
  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setEmotions([]);
    setError(null);
    
    // Clean up the URL object to avoid memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };
  
  return (
    <Grid container spacing={4}>
      {/* Image Upload Section */}
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={isDarkMode ? 4 : 3}
          sx={{
            p: 4,
            borderRadius: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.background.paper,
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.4)' : undefined
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: colors.text.primary
            }}
          >
            Upload a Face Image
          </Typography>
          
          <Box 
            sx={{
              border: `2px dashed ${colors.primary.main}`,
              borderRadius: '12px',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              backgroundColor: colors.background.upload,
              cursor: 'pointer',
              mb: 3,
              flex: 1,
              transition: 'all 0.3s ease'
            }}
            onClick={handleUploadClick}
          >
            {imagePreview ? (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
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
                <CloudUploadIcon sx={{ fontSize: 60, color: colors.primary.main, mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: colors.primary.main }}>
                  Click to upload image
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center' }}>
                  Upload a clear photo of a face to detect emotions
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, textAlign: 'center', mt: 1, display: 'block' }}>
                  Supported formats: JPG, PNG, GIF, BMP, WebP
                </Typography>
              </>
            )}
            <input 
              type="file"
              accept="image/jpeg,image/png,image/gif,image/bmp,image/webp,image/jpg"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
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
              disabled={!imagePreview || loading}
              sx={{
                backgroundColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: isDarkMode ? '#42a5f5' : '#0d47a1',
                }
              }}
            >
              Detect Emotions
            </Button>
            
            <IconButton 
              onClick={handleReset}
              disabled={loading}
              sx={{ 
                border: `1px solid ${colors.border.color}`,
                color: colors.text.secondary,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
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
                mt: 2,
                backgroundColor: isDarkMode ? 'rgba(211, 47, 47, 0.15)' : undefined,
                color: isDarkMode ? '#ff8a80' : undefined,
                '& .MuiAlert-icon': {
                  color: isDarkMode ? '#ff8a80' : undefined
                }
              }}
            >
              {error}
            </Alert>
          )}
        </Paper>
      </Grid>
      
      {/* Results Section */}
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={isDarkMode ? 4 : 3}
          sx={{
            p: 4,
            borderRadius: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.background.paper,
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.4)' : undefined
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: colors.text.primary
            }}
          >
            Emotion Analysis Results
          </Typography>
          
          <EmotionResults 
            loading={loading}
            emotions={emotions}
            emptyIcon={<FaceIcon sx={{ fontSize: 60, color: isDarkMode ? '#555' : '#9e9e9e', mb: 2, opacity: 0.5 }} />}
            emptyMessage="Upload a face image and click 'Detect Emotions' to see results"
            loadingMessage="Analyzing facial emotions..."
            isDarkMode={isDarkMode}
            themeColors={colors}
          />
        </Paper>
      </Grid>

      {/* Face Technology Explanation Section - Multiple Accordions */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#1976d2' }}>
          Understanding Face Emotion Detection
        </Typography>
        
        <Accordion sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="face-basics-content"
            id="face-basics-header"
            sx={{ bgcolor: '#f0f7ff' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaceIcon sx={{ color: '#1976d2' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                How It Works: The Basics
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Our face emotion detection works like this:
            </Typography>
            <Typography>
              <ul>
                <li><strong>Finding Faces:</strong> First, the AI locates faces in your photo</li>
                <li><strong>Analyzing Features:</strong> Then it looks at key facial points like eyebrows, mouth, and eyes</li>
                <li><strong>Pattern Recognition:</strong> It compares these with patterns it learned from thousands of example images</li>
                <li><strong>Emotion Classification:</strong> Finally, it predicts which emotions are present and how confident it is</li>
              </ul>
            </Typography>
            <Box sx={{ mt: 2, bgcolor: '#f0f7ff', p: 2, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Fun Fact:</strong> Humans can recognize about 21 distinct facial expressions, but most emotion AI systems focus on 7 basic emotions: happiness, sadness, anger, fear, disgust, surprise, and neutral.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        <Accordion sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="face-model-content"
            id="face-model-header"
            sx={{ bgcolor: '#f0f7ff' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PsychologyIcon sx={{ color: '#1976d2' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                The Technology Behind It
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              We use a "Vision Transformer" (ViT) model, which is cutting-edge AI technology:
            </Typography>
            <Typography>
              <ul>
                <li><strong>Transformer Architecture:</strong> Unlike older AI that looks at small sections of an image separately, ViT sees relationships between all parts of the face at once</li>
                <li><strong>Attention Mechanism:</strong> The model pays "attention" to important areas of the face that signal emotions</li>
                <li><strong>Transfer Learning:</strong> Our model first learned general visual patterns from millions of images, then fine-tuned specifically for emotions</li>
                <li><strong>Multi-head Processing:</strong> Different parts of the model focus on different aspects of facial expressions simultaneously</li>
              </ul>
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              This approach is similar to how humans perceive faces as a whole rather than as individual features, allowing for more accurate emotion recognition.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="face-ethics-content"
            id="face-ethics-header"
            sx={{ bgcolor: '#f0f7ff' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LockIcon sx={{ color: '#1976d2' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Ethical Considerations
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Facial emotion analysis raises several important ethical considerations:
            </Typography>
            <Typography>
              <ul>
                <li><strong>Privacy:</strong> Your photos are processed only for analysis and not stored long-term</li>
                <li><strong>Consent:</strong> Always get permission before analyzing someone else's facial expressions</li>
                <li><strong>Cultural Differences:</strong> Facial expressions vary across cultures, and AI may misinterpret these cultural differences</li>
                <li><strong>No Mind-Reading:</strong> This technology analyzes facial expressions only, not actual internal feelings</li>
                <li><strong>Potential Biases:</strong> AI models may perform differently across different demographics if not properly trained</li>
              </ul>
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
              We recommend using this technology responsibly and understanding its limitations.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="face-limits-content"
            id="face-limits-header"
            sx={{ bgcolor: '#f0f7ff' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RefreshIcon sx={{ color: '#1976d2' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Limitations & Best Practices
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
              Factors That Affect Accuracy
            </Typography>
            <Typography>
              <ul>
                <li><strong>Image Quality:</strong> Blurry or low-resolution images reduce accuracy</li>
                <li><strong>Lighting:</strong> Poor lighting can make emotions harder to detect</li>
                <li><strong>Face Angle:</strong> The model works best with front-facing images</li>
                <li><strong>Occlusions:</strong> Objects covering parts of the face (masks, sunglasses) can impact results</li>
                <li><strong>Micro-expressions:</strong> Brief, subtle expressions may be missed</li>
              </ul>
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2, color: '#1976d2' }}>
              Best Practices
            </Typography>
            <Typography>
              <ul>
                <li>Use clear, well-lit photos with the face clearly visible</li>
                <li>Consider results as suggestions rather than definitive analyses</li>
                <li>Remember that posed expressions may differ from genuine emotions</li>
                <li>Use in conjunction with other context, not in isolation</li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default FaceEmotionTab; 