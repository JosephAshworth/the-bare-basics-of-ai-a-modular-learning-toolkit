import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Alert,
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TextFields as TextFieldsIcon,
  Psychology as PsychologyIcon,
  ExpandMore as ExpandMoreIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import EmotionResults from './EmotionResults';
import { detectTextEmotions } from './utils';

const TextEmotionTab = ({ isDarkMode, themeColors }) => {
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emotions, setEmotions] = useState([]);
  
  // Handle text input change
  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
    setError(null);
    setEmotions([]);
  };
  
  // Handle text reset
  const handleTextReset = () => {
    setTextInput('');
    setEmotions([]);
    setError(null);
  };
  
  return (
    <Grid container spacing={4}>
      {/* Text Input Section */}
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={isDarkMode ? 4 : 3} 
          sx={{
            p: 4,
            borderRadius: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: themeColors?.background?.paper,
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode ? '0 8px 16px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: themeColors?.text?.primary }}>
            Enter Text for Emotion Analysis
          </Typography>
          
          <TextField
            label="Enter text to analyze emotions"
            multiline
            rows={8}
            value={textInput}
            onChange={handleTextInputChange}
            variant="outlined"
            placeholder="Type or paste text here"
            sx={{ 
              mb: 3, 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: themeColors?.border?.color,
                },
                '&:hover fieldset': {
                  borderColor: themeColors?.primary?.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: themeColors?.primary?.main,
                },
                '& textarea': {
                  color: themeColors?.text?.primary
                }
              },
              '& .MuiInputLabel-root': {
                color: themeColors?.text?.secondary
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: themeColors?.primary?.main
              }
            }}
            fullWidth
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
            <Button 
              variant="contained" 
              color="primary"
              fullWidth
              size="large"
              startIcon={<TextFieldsIcon />}
              onClick={() => detectTextEmotions(textInput, setLoading, setError, setEmotions)}
              disabled={!textInput.trim() || loading}
              sx={{
                bgcolor: themeColors?.primary?.main,
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(102, 204, 255, 0.8)' : undefined
                }
              }}
            >
              Analyze Text Emotions
            </Button>
            
            <IconButton 
              color="default" 
              onClick={handleTextReset}
              disabled={loading}
              sx={{ 
                border: `1px solid ${themeColors?.border?.color}`,
                color: themeColors?.text?.secondary
              }}
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
      
      {/* Text Results Section */}
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={isDarkMode ? 4 : 3} 
          sx={{
            p: 4,
            borderRadius: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: themeColors?.background?.paper,
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode ? '0 8px 16px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: themeColors?.text?.primary }}>
            Text Emotion Analysis Results
          </Typography>
          
          <EmotionResults 
            loading={loading}
            emotions={emotions}
            emptyIcon={<TextFieldsIcon sx={{ fontSize: 60, color: isDarkMode ? '#6e6e6e' : '#9e9e9e', mb: 2, opacity: 0.5 }} />}
            emptyMessage="Enter some text and click 'Analyze Text Emotions' to see results"
            loadingMessage="Analyzing text emotions..."
            technologyDescription="Text analysis powered by a specialized NLP model fine-tuned to detect emotions in text."
            isDarkMode={isDarkMode}
            themeColors={themeColors}
          />
        </Paper>
      </Grid>

      {/* Text Technology Explanation Section - Multiple Accordions */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: isDarkMode ? '#88e288' : '#2e7d32' }}>
          Understanding Text Emotion Detection
        </Typography>
        
        <Accordion 
          sx={{ 
            mb: 2, 
            borderRadius: '8px', 
            overflow: 'hidden',
            bgcolor: isDarkMode ? themeColors?.background?.paper : undefined,
            '& .MuiAccordionSummary-root': {
              bgcolor: isDarkMode ? 'rgba(0, 100, 0, 0.2)' : '#f5f8f2' 
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: isDarkMode ? themeColors?.text?.secondary : undefined }} />}
            aria-controls="text-basics-content"
            id="text-basics-header"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextFieldsIcon sx={{ color: isDarkMode ? '#88e288' : '#2e7d32' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeColors?.text?.primary }}>
                How It Works: The Basics
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: themeColors?.background?.paper }}>
            <Typography variant="body2" sx={{ mb: 2, color: themeColors?.text?.primary }}>
              Our text emotion detection works through these steps:
            </Typography>
            <ol style={{ color: themeColors?.text?.primary }}>
              <li><strong>Breaking Down Text:</strong> The AI divides your text into words and word pieces</li>
              <li><strong>Understanding Context:</strong> It analyzes how these words relate to each other</li>
              <li><strong>Learning Patterns:</strong> It compares with emotional patterns from millions of examples it learned from</li>
              <li><strong>Identifying Emotions:</strong> It determines which emotions are likely present in the text</li>
            </ol>
            <Box sx={{ 
              mt: 2, 
              bgcolor: isDarkMode ? 'rgba(0, 100, 0, 0.2)' : '#f5f8f2',
              p: 2, 
              borderRadius: 2 
            }}>
              <Typography variant="body2" sx={{ color: themeColors?.text?.primary }}>
                <strong>Fun Fact:</strong> Text analysis can detect far more emotion types than facial expressions - including nuanced feelings like gratitude, nostalgia, and anticipation that might not be easily visible on faces.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          sx={{ 
            mb: 2, 
            borderRadius: '8px', 
            overflow: 'hidden',
            bgcolor: isDarkMode ? themeColors?.background?.paper : undefined,
            '& .MuiAccordionSummary-root': {
              bgcolor: isDarkMode ? 'rgba(0, 100, 0, 0.2)' : '#f5f8f2' 
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: isDarkMode ? themeColors?.text?.secondary : undefined }} />}
            aria-controls="text-model-content"
            id="text-model-header"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PsychologyIcon sx={{ color: isDarkMode ? '#88e288' : '#2e7d32' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeColors?.text?.primary }}>
                The Technology Behind It
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: themeColors?.background?.paper }}>
            <Typography variant="body2" sx={{ mb: 2, color: themeColors?.text?.primary }}>
              We use "Transformer" Natural Language Processing (NLP) models, which revolutionized language understanding:
            </Typography>
            <ul style={{ color: themeColors?.text?.primary }}>
              <li><strong>Contextual Understanding:</strong> Unlike older models that looked at words in isolation, transformers see how words relate to each other in context</li>
              <li><strong>Bidirectional Learning:</strong> The model looks at words both before and after each word to understand meaning</li>
              <li><strong>Pre-training + Fine-tuning:</strong> First trained on massive text datasets, then specialized for emotion detection</li>
              <li><strong>Word Embeddings:</strong> Words are converted to numerical vectors that capture semantic meaning</li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2, color: themeColors?.text?.primary }}>
              This technology can understand subtle expressions, sarcasm, and can detect multiple emotions in the same text, similar to how humans can recognize complex emotional states in writing.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          sx={{ 
            mb: 2, 
            borderRadius: '8px', 
            overflow: 'hidden',
            bgcolor: isDarkMode ? themeColors?.background?.paper : undefined,
            '& .MuiAccordionSummary-root': {
              bgcolor: isDarkMode ? 'rgba(0, 100, 0, 0.2)' : '#f5f8f2' 
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: isDarkMode ? themeColors?.text?.secondary : undefined }} />}
            aria-controls="text-ethics-content"
            id="text-ethics-header"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LockIcon sx={{ color: isDarkMode ? '#88e288' : '#2e7d32' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeColors?.text?.primary }}>
                Ethical Considerations
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: themeColors?.background?.paper }}>
            <Typography variant="body2" sx={{ mb: 2, color: themeColors?.text?.primary }}>
              Text emotion analysis raises several important ethical considerations:
            </Typography>
            <ul style={{ color: themeColors?.text?.primary }}>
              <li><strong>Privacy:</strong> Your text is processed only for analysis and not stored permanently</li>
              <li><strong>Consent:</strong> Always get permission before analyzing someone else's writing</li>
              <li><strong>Language Limitations:</strong> The model works best with English and may miss nuances in other languages</li>
              <li><strong>Context vs. Content:</strong> The AI doesn't understand the broader context in which text was written</li>
              <li><strong>Cultural Differences:</strong> Expression styles vary across cultures and communities</li>
              <li><strong>Not Mind-Reading:</strong> The analysis reflects only the emotional content of the words, not the writer's true feelings</li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2, fontWeight: 500, color: themeColors?.text?.primary }}>
              We recommend using this technology as a supplementary tool, not as a definitive analysis of someone's emotional state.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          sx={{ 
            mb: 2, 
            borderRadius: '8px', 
            overflow: 'hidden',
            bgcolor: isDarkMode ? themeColors?.background?.paper : undefined,
            '& .MuiAccordionSummary-root': {
              bgcolor: isDarkMode ? 'rgba(0, 100, 0, 0.2)' : '#f5f8f2' 
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: isDarkMode ? themeColors?.text?.secondary : undefined }} />}
            aria-controls="text-limits-content"
            id="text-limits-header"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RefreshIcon sx={{ color: isDarkMode ? '#88e288' : '#2e7d32' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeColors?.text?.primary }}>
                Limitations & Best Practices
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: themeColors?.background?.paper }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#88e288' : '#2e7d32' }}>
              Challenges For Text Emotion AI
            </Typography>
            <ul style={{ color: themeColors?.text?.primary }}>
              <li><strong>Sarcasm & Irony:</strong> These can be particularly difficult for AI to detect</li>
              <li><strong>Slang & Informal Language:</strong> New expressions may not be in the training data</li>
              <li><strong>Mixed Emotions:</strong> Complex texts may contain multiple, sometimes contradictory emotions</li>
              <li><strong>Cultural References:</strong> References that carry emotional weight but require cultural knowledge</li>
              <li><strong>Implied Emotion:</strong> Emotion that's suggested but not explicitly stated</li>
            </ul>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2, color: isDarkMode ? '#88e288' : '#2e7d32' }}>
              Getting Better Results
            </Typography>
            <ul style={{ color: themeColors?.text?.primary }}>
              <li>Provide sufficient text for context (at least a few sentences)</li>
              <li>For analysis of formal documents, consider analyzing sections separately</li>
              <li>Be aware that emojis and punctuation influence emotional detection</li>
              <li>Remember that explicit emotional words ("happy," "sad") heavily influence results</li>
            </ul>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default TextEmotionTab; 