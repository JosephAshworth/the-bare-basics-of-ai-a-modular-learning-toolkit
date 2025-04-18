import React from 'react';
import { Grid, Typography, Paper, Card, CardContent, Box } from '@mui/material';
import { Face as FaceIcon, TextFields as TextFieldsIcon, AudioFile as AudioFileIcon } from '@mui/icons-material';

const HowItWorksSection = () => {
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
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          How It Works
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          This emotion detection system uses specialized AI models to recognize emotions from 
          faces, text, and speech.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ bgcolor: '#f5f8ff', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                  <FaceIcon sx={{ mr: 1 }} /> Facial Emotion Detection
                </Typography>
                <Typography variant="body2">
                  Uses a Vision Transformer (ViT) model specifically fine-tuned for facial emotion 
                  recognition. The model analyzes facial features to identify emotions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ bgcolor: '#f5f8ff', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                  <TextFieldsIcon sx={{ mr: 1 }} /> Text Emotion Detection
                </Typography>
                <Typography variant="body2">
                  Utilizes a Natural Language Processing (NLP) model that analyzes text content to identify emotions.
                  The model examines language patterns and word choice.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ bgcolor: '#f5f8ff', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                  <AudioFileIcon sx={{ mr: 1 }} /> Audio Emotion Detection
                </Typography>
                <Typography variant="body2">
                  Employs a specialized speech processing model that detects emotions from voice recordings and audio files.
                  The model analyzes speech patterns, tone, and vocal characteristics.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Typography variant="body2" sx={{ mt: 3, color: '#666', fontStyle: 'italic' }}>
          Note: AI emotion detection has limitations and may not always perfectly interpret emotions. 
          These predictions should be considered as suggestions rather than definitive analyses.
        </Typography>
      </Paper>
    </Grid>
  );
};

export default HowItWorksSection; 