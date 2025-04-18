import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Paper, Container } from '@mui/material';
import {
  Face as FaceIcon,
  TextFields as TextFieldsIcon,
  AudioFile as AudioFileIcon,
  Psychology as PsychologyIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const TechnologyOverview = ({ isDarkMode, themeColors }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper 
        elevation={isDarkMode ? 3 : 1}
        sx={{ 
          borderRadius: '16px',
          backgroundColor: themeColors.background.paper,
          mb: 6,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: isDarkMode ? '0 8px 16px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.1)',
          p: 4
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: isDarkMode ? themeColors.primary.main : '#1a1a1a',
              mb: 2 
            }}
          >
            How Our AI Technology Works
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: themeColors.text.secondary,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Our emotion detection system uses specialized AI models to analyze emotions from different inputs.
            Learn about each technology below.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Face Technology */}
          <Grid item xs={12}>
            <Accordion 
              sx={{ 
                mb: 2, 
                borderRadius: '12px !important', 
                overflow: 'hidden',
                '&:before': { display: 'none' },
                bgcolor: isDarkMode ? 'rgba(25, 118, 210, 0.05)' : '#f5f8ff',
                boxShadow: isDarkMode ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: themeColors.primary.main }} />}
                aria-controls="face-tech-content"
                id="face-tech-header"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FaceIcon sx={{ color: themeColors.primary.main, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                    Facial Emotion Analysis
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: themeColors.background.paper }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: themeColors.primary.main }}>
                      How It Works
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.text.primary, mb: 2 }}>
                      Our face emotion detection works by analyzing facial expressions through these steps:
                    </Typography>
                    <Box component="ol" sx={{ pl: 2, color: themeColors.text.primary }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Face detection identifies and locates faces in the image</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Facial landmark detection maps key points like eyes, eyebrows, nose, and mouth</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Feature extraction analyzes the relationships between these landmarks</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Machine learning model classifies the expressions into emotion categories</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: themeColors.primary.main }}>
                      Technology Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.text.primary, mb: 2 }}>
                      We use a Vision Transformer (ViT) model specifically fine-tuned for emotion recognition:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: themeColors.text.primary }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Transformer architecture that processes the entire face at once</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Attention mechanism that focuses on emotionally significant facial regions</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Transfer learning from pre-trained computer vision models</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Able to detect 7 basic emotions with high accuracy</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Text Technology */}
          <Grid item xs={12}>
            <Accordion 
              sx={{ 
                mb: 2, 
                borderRadius: '12px !important', 
                overflow: 'hidden',
                '&:before': { display: 'none' },
                bgcolor: isDarkMode ? 'rgba(46, 125, 50, 0.05)' : '#f1f8f2',
                boxShadow: isDarkMode ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: isDarkMode ? '#88e288' : '#2e7d32' }} />}
                aria-controls="text-tech-content"
                id="text-tech-header"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextFieldsIcon sx={{ color: isDarkMode ? '#88e288' : '#2e7d32', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                    Text Emotion Analysis
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: themeColors.background.paper }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#88e288' : '#2e7d32' }}>
                      How It Works
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.text.primary, mb: 2 }}>
                      Our text emotion analysis processes written content through these steps:
                    </Typography>
                    <Box component="ol" sx={{ pl: 2, color: themeColors.text.primary }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Tokenization breaks down text into words and sub-words</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Embedding converts tokens into numeric representations</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Contextual understanding analyzes relationships between words</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Classification determines emotional content and intensity</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#88e288' : '#2e7d32' }}>
                      Technology Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.text.primary, mb: 2 }}>
                      We use transformer-based NLP models for text analysis:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: themeColors.text.primary }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>BERT-based architecture with bidirectional context understanding</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Fine-tuned on emotion-labeled datasets from various sources</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Capable of detecting subtle nuances in written expression</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Can identify over 20 different emotion types in text</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Audio Technology */}
          <Grid item xs={12}>
            <Accordion 
              sx={{ 
                mb: 2, 
                borderRadius: '12px !important', 
                overflow: 'hidden',
                '&:before': { display: 'none' },
                bgcolor: isDarkMode ? 'rgba(123, 31, 162, 0.05)' : '#f8f0fb',
                boxShadow: isDarkMode ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: isDarkMode ? '#d084f0' : '#7b1fa2' }} />}
                aria-controls="audio-tech-content"
                id="audio-tech-header"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AudioFileIcon sx={{ color: isDarkMode ? '#d084f0' : '#7b1fa2', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                    Audio Emotion Analysis
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: themeColors.background.paper }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#d084f0' : '#7b1fa2' }}>
                      How It Works
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.text.primary, mb: 2 }}>
                      Our audio emotion analysis processes speech through these steps:
                    </Typography>
                    <Box component="ol" sx={{ pl: 2, color: themeColors.text.primary }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Audio processing converts sound waves into spectrograms</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Feature extraction identifies patterns in pitch, tone and rhythm</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Neural network analysis detects emotional patterns in speech</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Classification determines the emotional content of the audio</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#d084f0' : '#7b1fa2' }}>
                      Technology Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.text.primary, mb: 2 }}>
                      We use specialized audio processing neural networks:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: themeColors.text.primary }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Convolutional Neural Networks (CNNs) for audio feature extraction</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Recurrent layers to capture temporal dynamics in speech</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Models trained on diverse speakers and recording conditions</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Capable of detecting emotions regardless of spoken content</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Technical Architecture */}
          <Grid item xs={12}>
            <Accordion 
              sx={{ 
                borderRadius: '12px !important', 
                overflow: 'hidden',
                '&:before': { display: 'none' },
                bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : '#f0f0f0',
                boxShadow: isDarkMode ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: themeColors.text.secondary }} />}
                aria-controls="arch-tech-content"
                id="arch-tech-header"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CodeIcon sx={{ color: themeColors.text.secondary, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                    Technical Architecture
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: themeColors.background.paper }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: themeColors.text.primary }}>
                      System Architecture
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.text.primary, mb: 2 }}>
                      Our system uses a modern client-server architecture:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: themeColors.text.primary }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>React frontend for responsive user interface</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Flask backend API for model serving</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>AI models optimized for efficient inference</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>RESTful API design for easy integration</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: themeColors.text.primary }}>
                      Privacy Considerations
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.text.primary, mb: 2 }}>
                      We prioritize user privacy and data protection:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: themeColors.text.primary }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Data is processed temporarily and not permanently stored</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>All processing happens on secure servers</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>No personal information is collected from uploads</Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>Transparent about AI capabilities and limitations</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TechnologyOverview; 