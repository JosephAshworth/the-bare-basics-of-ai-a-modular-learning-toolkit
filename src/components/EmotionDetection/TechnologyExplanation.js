import React from 'react';
import { 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip
} from '@mui/material';
import { 
  Psychology as PsychologyIcon,
  Face as FaceIcon,
  TextFields as TextFieldsIcon,
  AudioFile as AudioFileIcon,
  ExpandMore as ExpandMoreIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const TechnologyExplanation = () => {
  // Array of technology sections with their data
  const technologySections = [
    {
      title: 'Facial Emotion Recognition Technology',
      icon: <FaceIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: {
        main: '#1976d2',
        light: '#e3f2fd',
        lighter: '#f5f8ff'
      },
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Our facial emotion recognition uses a Vision Transformer (ViT) model, a state-of-the-art 
            architecture for computer vision tasks.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Chip label="Vision Transformer" sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} />
            <Chip label="Deep Learning" />
            <Chip label="Facial Feature Extraction" />
            <Chip label="Attention Mechanisms" />
          </Box>
          <Typography variant="body2">
            The process works in several steps:
          </Typography>
          <Typography>
            <ol>
              <li>Face detection locates the face in the image</li>
              <li>The image is divided into patches and encoded</li>
              <li>The transformer encoder processes these patches with self-attention</li>
              <li>A classification head predicts emotion probability</li>
            </ol>
          </Typography>
          <Typography variant="body2">
            Our model is trained on diverse datasets to ensure it works well across different 
            ethnicities, ages, and lighting conditions. It can detect subtle facial expressions 
            that indicate emotions like happiness, sadness, anger, surprise, fear, disgust, and neutral states.
          </Typography>
        </>
      )
    },
    {
      title: 'Text Emotion Analysis Technology',
      icon: <TextFieldsIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: {
        main: '#2e7d32',
        light: '#e8f5e9',
        lighter: '#f1f8f2'
      },
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Our text emotion analysis uses advanced Natural Language Processing (NLP) models based on 
            transformer architectures.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Chip label="NLP Transformers" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }} />
            <Chip label="Contextual Word Embeddings" />
            <Chip label="Sentiment Analysis" />
            <Chip label="Multi-label Classification" />
          </Box>
          <Typography variant="body2">
            The text analysis process includes:
          </Typography>
          <Typography>
            <ol>
              <li>Tokenization of input text into subwords</li>
              <li>Encoding words into context-sensitive embeddings</li>
              <li>Semantic understanding of text meaning and context</li>
              <li>Classification into multiple emotion categories with confidence scores</li>
            </ol>
          </Typography>
          <Typography variant="body2">
            Unlike simple sentiment analysis (positive/negative), our model identifies specific 
            emotions like joy, sadness, anger, fear, surprise, and many more nuanced emotional states.
            It can detect mixed emotions and analyze complex expressions.
          </Typography>
        </>
      )
    },
    {
      title: 'Audio Emotion Recognition Technology',
      icon: <AudioFileIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />,
      color: {
        main: '#7b1fa2',
        light: '#f3e5f5',
        lighter: '#f8f0fb'
      },
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Our audio emotion recognition uses a specialized speech processing model that detects
            emotions in speech patterns.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Chip label="Specialized Speech Processing Model" sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }} />
            <Chip label="Speech Analysis" />
            <Chip label="Emotion Detection" />
            <Chip label="Vocal Characteristics" />
          </Box>
          <Typography variant="body2">
            The audio analysis process includes:
          </Typography>
          <Typography>
            <ol>
              <li>Audio feature extraction using convolutional neural networks</li>
              <li>Contextual representation of speech patterns</li>
              <li>Analysis of tone, pitch, rhythm, and tempo variations</li>
              <li>Classification into emotion categories with confidence scores</li>
            </ol>
          </Typography>
          <Typography variant="body2">
            The model can detect subtle variations in speech that convey different emotional states,
            such as anger, happiness, sadness, fear, disgust, and surprise. It works across different
            speakers, accents, and recording conditions.
          </Typography>
        </>
      )
    },
    {
      title: 'Privacy and Ethical Considerations',
      icon: <LockIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
      color: {
        main: '#ed6c02',
        light: '#fff3e0',
        lighter: '#fffaf0'
      },
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We take privacy and ethical use of emotion AI very seriously in our implementation.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Chip label="Data Privacy" sx={{ bgcolor: '#fff3e0', color: '#ed6c02' }} />
            <Chip label="Ethical AI" />
            <Chip label="Bias Mitigation" />
            <Chip label="Transparent Design" />
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Our approach includes:
          </Typography>
          <Typography>
            <ul>
              <li>Processing data locally when possible to minimize data transmission</li>
              <li>Not storing your images, text, or audio after analysis</li>
              <li>Training on diverse datasets to reduce demographic biases</li>
              <li>Clearly communicating the confidence levels of predictions</li>
              <li>Using emotion AI as a tool for understanding, not judgment</li>
            </ul>
          </Typography>
          <Typography variant="body2">
            Emotion AI should be used responsibly with an understanding of its limitations and potential biases.
            Our system provides insights but should not be used for critical decision-making without human oversight.
          </Typography>
        </>
      )
    }
  ];

  return (
    <Grid item xs={12}>
      <Paper 
        elevation={2}
        sx={{
          p: 4,
          borderRadius: '16px',
          mt: 4
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <PsychologyIcon sx={{ mr: 1 }} /> The Technology Behind Our AI
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {technologySections.map((section, index) => (
            <Accordion 
              key={index} 
              sx={{ 
                mb: 2, 
                borderRadius: '8px', 
                overflow: 'hidden', 
                '&:before': {display: 'none'} 
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: section.color.main }} />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
                sx={{ 
                  bgcolor: section.color.lighter,
                  '&.Mui-expanded': {
                    bgcolor: section.color.light
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {section.icon}
                  <Typography variant="h6" sx={{ color: section.color.main }}>{section.title}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                {section.content}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>
    </Grid>
  );
};

export default TechnologyExplanation; 