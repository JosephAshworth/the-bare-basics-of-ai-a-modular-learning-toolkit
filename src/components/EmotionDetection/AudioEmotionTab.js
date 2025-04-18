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
  Refresh as RefreshIcon,
  AudioFile as AudioFileIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  Psychology as PsychologyIcon,
  ExpandMore as ExpandMoreIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import EmotionResults from './EmotionResults';
import { detectAudioEmotions } from './utils';

const AudioEmotionTab = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  
  // Refs
  const audioInputRef = useRef(null);
  
  useEffect(() => {
    // Cleanup function
    return () => {
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);
  
  // Handle audio file selection
  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      setError(null);
      setEmotions([]);
      
      // Create audio preview URL
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
    }
  };
  
  // Handle audio upload button click
  const handleAudioUploadClick = () => {
    audioInputRef.current.click();
  };
  
  // Handle audio reset
  const handleAudioReset = () => {
    setAudioFile(null);
    setAudioPreview(null);
    setEmotions([]);
    setError(null);
    
    // Clean up the URL object to avoid memory leaks
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
    
    // Stop recording if it's in progress
    if (recording) {
      stopRecording();
    }
  };
  
  // Start recording audio
  const startRecording = async () => {
    try {
      setError(null);
      
      // Reset previous recording
      setAudioChunks([]);
      setAudioFile(null);
      setAudioPreview(null);
      setEmotions([]);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      // Set up event handlers
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, e.data]);
        }
      };
      
      recorder.onstop = () => {
        // Create blob from chunks
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Create audio file and preview
        const audioFile = new File([blob], "recorded_audio.wav", { type: 'audio/wav' });
        setAudioFile(audioFile);
        
        // Create audio preview URL
        const url = URL.createObjectURL(blob);
        setAudioPreview(url);
        
        // Stop tracks on the stream to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(`Could not access microphone: ${err.message}`);
    }
  };
  
  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setRecording(false);
    }
  };
  
  return (
    <Grid container spacing={4}>
      {/* Audio Upload Section */}
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={3} 
          sx={{
            p: 4,
            borderRadius: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Record or Upload Audio
          </Typography>
          
          <Box 
            sx={{
              border: '2px dashed #1976d2',
              borderRadius: '12px',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              backgroundColor: '#f5f8ff',
              cursor: 'pointer',
              mb: 3,
              flex: 1
            }}
            onClick={handleAudioUploadClick}
          >
            {audioPreview ? (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <AudioFileIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Audio file selected
                </Typography>
                <audio 
                  src={audioPreview} 
                  controls 
                  style={{ width: '100%', maxWidth: '300px' }}
                />
              </Box>
            ) : (
              <>
                <AudioFileIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>
                  Click to upload audio file
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                  Upload an audio file to detect emotions
                </Typography>
              </>
            )}
            <input 
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              ref={audioInputRef}
              style={{ display: 'none' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              variant="outlined" 
              color="primary"
              fullWidth
              size="large"
              startIcon={recording ? <StopIcon /> : <MicIcon />}
              onClick={recording ? stopRecording : startRecording}
              disabled={loading}
            >
              {recording ? 'Stop Recording' : 'Record Audio'}
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
            <Button 
              variant="contained" 
              color="primary"
              fullWidth
              size="large"
              startIcon={<AudioFileIcon />}
              onClick={() => detectAudioEmotions(audioFile, setLoading, setError, setEmotions)}
              disabled={!audioFile || loading}
            >
              Analyze Audio Emotions
            </Button>
            
            <IconButton 
              color="default" 
              onClick={handleAudioReset}
              disabled={loading}
              sx={{ border: '1px solid #ddd' }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Grid>
      
      {/* Audio Results Section */}
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={3} 
          sx={{
            p: 4,
            borderRadius: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Audio Emotion Analysis Results
          </Typography>
          
          <EmotionResults 
            loading={loading}
            emotions={emotions}
            emptyIcon={<AudioFileIcon sx={{ fontSize: 60, color: '#9e9e9e', mb: 2, opacity: 0.5 }} />}
            emptyMessage="Upload or record audio and click 'Analyze Audio Emotions' to see results"
            loadingMessage="Analyzing audio emotions..."
            technologyDescription="Audio analysis powered by a specialized AI model fine-tuned to detect emotions in speech."
          />
        </Paper>
      </Grid>

      {/* Audio Technology Explanation Section - Multiple Accordions */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#7b1fa2' }}>
          Understanding Audio Emotion Detection
        </Typography>
        
        <Accordion sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="audio-basics-content"
            id="audio-basics-header"
            sx={{ bgcolor: '#f8f0fb' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AudioFileIcon sx={{ color: '#7b1fa2' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                How It Works: The Basics
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Our audio emotion detection works through these steps:
            </Typography>
            <ol>
              <li><strong>Processing Sound Waves:</strong> The AI converts your audio into a visual representation called a spectrogram</li>
              <li><strong>Analyzing Patterns:</strong> It looks for patterns in pitch, tone, speed, and volume</li>
              <li><strong>Feature Extraction:</strong> It identifies key audio features that correspond to different emotions</li>
              <li><strong>Emotion Prediction:</strong> It determines which emotions are most likely present in the speech</li>
            </ol>
            <Box sx={{ mt: 2, bgcolor: '#f8f0fb', p: 2, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Fun Fact:</strong> Your voice contains over 400 measurable characteristics - many of which change subtly based on your emotional state, even when you try to hide your feelings.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        <Accordion sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="audio-model-content"
            id="audio-model-header"
            sx={{ bgcolor: '#f8f0fb' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PsychologyIcon sx={{ color: '#7b1fa2' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                The Technology Behind It
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              We use specialized speech processing models that analyze audio patterns:
            </Typography>
            <ul>
              <li><strong>Acoustic Feature Analysis:</strong> The AI extracts features like pitch, energy, rhythm, and spectral properties</li>
              <li><strong>Time-Frequency Analysis:</strong> Examines how sound characteristics change over time</li>
              <li><strong>Deep Neural Networks:</strong> Multiple layers of processing that identify patterns humans might miss</li>
              <li><strong>Prosody Analysis:</strong> Studies speech melody, stress patterns, and intonation that carry emotional information</li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2 }}>
              The technology can detect emotions from vocal characteristics even without fully understanding the words being spoken, similar to how humans can sense emotion in a foreign language or non-verbal sounds.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="audio-ethics-content"
            id="audio-ethics-header"
            sx={{ bgcolor: '#f8f0fb' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LockIcon sx={{ color: '#7b1fa2' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Ethical Considerations
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Audio emotion analysis raises several important ethical considerations:
            </Typography>
            <ul>
              <li><strong>Privacy:</strong> Your audio is processed only for analysis and not stored permanently</li>
              <li><strong>Consent:</strong> Always ask for permission before analyzing someone's voice</li>
              <li><strong>Cultural Differences:</strong> Vocal expression of emotions varies significantly across cultures</li>
              <li><strong>Accessibility Issues:</strong> Speech disorders, accents, or conditions like Parkinson's may affect analysis</li>
              <li><strong>Context Loss:</strong> The analysis doesn't capture the situation in which words were spoken</li>
              <li><strong>Authenticity vs Performance:</strong> People may intentionally modulate their voice for effect</li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
              Voice is deeply personal - we recommend using this technology respectfully and with the understanding that it provides insights but not definitive judgments.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="audio-limits-content"
            id="audio-limits-header"
            sx={{ bgcolor: '#f8f0fb' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RefreshIcon sx={{ color: '#7b1fa2' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Limitations & Best Practices
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#7b1fa2' }}>
              Factors That Affect Accuracy
            </Typography>
            <ul>
              <li><strong>Audio Quality:</strong> Background noise and poor recording quality significantly reduce accuracy</li>
              <li><strong>Speaker Distance:</strong> The distance from the microphone affects vocal feature clarity</li>
              <li><strong>Individual Differences:</strong> People have different baseline speech patterns</li>
              <li><strong>Language Differences:</strong> Languages have different prosodic features and emotional expressions</li>
              <li><strong>Acting vs. Genuine:</strong> Performed emotions may be analyzed differently than genuine ones</li>
            </ul>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2, color: '#7b1fa2' }}>
              Getting Better Results
            </Typography>
            <ul>
              <li>Record in a quiet environment with minimal background noise</li>
              <li>Maintain consistent distance from the microphone</li>
              <li>Provide sufficient audio length (ideally 10+ seconds)</li>
              <li>Use higher quality recording equipment if possible</li>
              <li>Consider cultural and individual speaking style when interpreting results</li>
            </ul>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default AudioEmotionTab; 