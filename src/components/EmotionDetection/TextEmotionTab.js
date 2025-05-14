import
  { 
    useState
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import {
  Refresh as RefreshIcon,
  TextFields as TextFieldsIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';

import EmotionResults from './EmotionResults';

import { detectTextEmotions } from './EmotionDetectionUtilities';

const TextEmotionTab = () => {
  const theme = useTheme();
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [isResultsInfoOpen, setResultsInfoOpen] = useState(false);

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
    setError(null);
    setEmotions([]);
  };

  const handleTextReset = () => {
    setTextInput('');
    setEmotions([]);
    setError(null);
  };

  const handleOpenResultsInfo = () => setResultsInfoOpen(true);
  const handleCloseResultsInfo = () => setResultsInfoOpen(false);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={theme.palette.mode === 'dark' ? 4 : 3} // increase shadow depth in dark mode for better contrast
          sx={{
            p: 4,
            borderRadius: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[theme.palette.mode === 'dark' ? 8 : 4] // apply a deeper shadow in dark mode
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
            Enter Text for Emotion Analysis
          </Typography>

          <Box 
            sx={{ 
              position: 'relative',
              flex: 1,
              mb: 3,
              minHeight: '300px'
            }}
          >
            {!textInput && (
              <Box 
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.text.secondary,
                  borderRadius: '4px'
                }}
              >
                <TextFieldsIcon sx={{ 
                  fontSize: 60,
                  mb: 2,
                  color: theme.palette.primary.main
                }} />
                <Typography variant="h6" sx={{ 
                  mb: 0.5,
                  color: theme.palette.primary.main
                }}>
                  Click here to enter text
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 1 }}
                >
                  Type or paste a sentence or paragraph.
                </Typography>
                <Typography
                  variant="caption"
                >
                  (English language recommended for best results)
                </Typography>
              </Box>
            )}

            <TextField
              multiline
              rows={8}
              value={textInput}
              onChange={handleTextInputChange}
              variant="outlined"
              sx={{ 
                width: '100%',
                height: '100%',
                '& .MuiOutlinedInput-root': {
                  height: '100%', // ensure the input field takes the full height of its container
                  alignItems: 'flex-start', // align the text to the top of the input field
                  '& textarea': {
                    color: theme.palette.text.primary,
                    height: '100% !important' // force the textarea to match the height of its parent container
                  }
                }
              }}
              fullWidth // ensure the input field takes the full width of its container
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
              startIcon={<TextFieldsIcon />}
              onClick={() => detectTextEmotions(textInput, setLoading, setError, setEmotions)}
              disabled={!textInput.trim() || loading} // disable button if input is empty or loading
            >
              Analyse Text Emotions
            </Button>
            
            <IconButton 
              color="default"
              onClick={handleTextReset}
              disabled={loading}
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.secondary
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
          
          {error && (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
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
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[theme.palette.mode === 'dark' ? 8 : 4]
          }}
        >
          <Box sx={{ display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Text Emotion Analysis Results
            </Typography>
            <IconButton onClick={handleOpenResultsInfo}
              size="small"
              sx={{ color: 'grey.500' }}
              aria-label="Results Info"
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>  
          
          <EmotionResults
            loading={loading}
            emotions={emotions}
            emptyIcon={<TextFieldsIcon
              sx={{
                fontSize: 60,
                color: theme.palette.text.secondary,
                mb: 2,
                opacity: 0.5
              }}
            />}
            emptyMessage="Enter some text and click 'Analyse Text Emotions' to see results"
            loadingMessage="Analysing text emotions..."
            technologyDescription="Text analysis powered by a specialised NLP model fine-tuned to detect emotions in text."
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
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Ethical Considerations: Text Emotion Detection
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 1 }}
          >
            <strong>• Bias:</strong> Odbal (Inner Mongolia University) explored how certain text emotion detectors assigning certain emotions to a gender. For example, feelings such as "joy" and "sadness" tend more towards women, whereas "anger" tends more towards men.
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1 }}
          >
            <strong>• Responsibility:</strong> This research prompted the need for a mitigation strategy that does not rely on gender-balanced datasets or gender-swapping techniques. Instead, the researchers tried adjusting the model training process to reduce sensitivity to gender, without compromising the overall accuracy of emotion detection.
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1 }}
          >
            <strong>• Transparency:</strong> Natural language processing models can be complex, making it difficult to understand how specific inputs lead to particular emotion classifications. This can lead to a lack of trust in model outputs, as some emotions might, from a human perspective, appear more prominent than others.
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
          sx={{ color: theme.palette.text.primary }}
        >
          Understanding Emotion Scores
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Confidence Scores
          </Typography>
          <Typography variant="body2" paragraph
            sx={{ color: theme.palette.text.secondary }}
          >
            These scores (shown as percentages) represent the model's confidence that a particular emotion is present based on the input text. A higher percentage means the model is more certain based on the patterns it learned. For example, 90% confidence in 'Joy' suggests the model strongly detected patterns associated with joy in the text.
          </Typography>
          <Typography variant="h6" gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Model Limitations & Disclaimer
          </Typography>
          <Typography variant="body2" paragraph
            sx={{ color: theme.palette.text.secondary }}
          >
            This AI model is a tool and can make mistakes. It might misinterpret sarcasm, irony, subtle language, cultural nuances, or text written in languages other than English. The detected emotions are based on learned patterns and may not perfectly reflect the true human feeling or intent behind the text.
          </Typography>
          <Typography variant="h6" gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Use with Care
          </Typography>
          <Typography variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            Please use these results thoughtfully and consider the context. They provide a suggestion, but human judgement remains crucial.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultsInfo}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TextEmotionTab;
