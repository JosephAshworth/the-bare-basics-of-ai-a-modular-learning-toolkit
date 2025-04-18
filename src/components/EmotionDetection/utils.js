import apiService from '../../services/apiService';

// Return color based on emotion
export const getEmotionColor = (emotion) => {
  const colors = {
    happy: '#4caf50',
    happiness: '#4caf50',
    joy: '#4caf50',
    sad: '#2196f3',
    sadness: '#2196f3',
    angry: '#f44336',
    anger: '#f44336',
    surprise: '#ff9800',
    surprised: '#ff9800',
    fear: '#9c27b0',
    disgust: '#795548',
    neutral: '#607d8b',
    // Additional emotions that might be in the text model
    love: '#e91e63',
    admiration: '#ba68c8',
    gratitude: '#8bc34a',
    approval: '#cddc39',
    caring: '#9fa8da',
    excitement: '#ff5722',
    amusement: '#ffa726',
    curiosity: '#29b6f6',
    optimism: '#ffeb3b',
    disappointment: '#78909c',
    disapproval: '#ef5350',
    embarrassment: '#ce93d8',
    confusion: '#9e9e9e',
    grief: '#546e7a',
    nervousness: '#aed581',
    pride: '#ffd54f',
    remorse: '#a1887f',
    realization: '#26a69a',
    relief: '#81c784'
  };
  
  return colors[emotion?.toLowerCase()] || '#607d8b';
};

// API call to detect face emotions
export const detectFaceEmotions = async (imageFile, setLoading, setError, setEmotions) => {
  if (!imageFile) {
    setError('Please select an image first');
    return;
  }
  
  setLoading(true);
  setError(null);
  setEmotions([]);
  
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    console.log("Processing image...");
    
    // Make POST request to Flask backend using apiService
    const response = await apiService.uploadFile('/api/detect-emotion', formData, {
      timeout: 30000, // 30 second timeout
    });
    
    console.log("Image response received:", response.data);
    
    // Check if predictions exist
    if (response.data.predictions && response.data.predictions.length > 0) {
      setEmotions(response.data.predictions);
    } else if (response.data.error) {
      setError(response.data.error);
    } else {
      setError('No faces or emotions were detected in this image.');
    }
  } catch (err) {
    console.error('Error detecting emotions:', err);
    
    if (err.code === 'ECONNABORTED') {
      setError('Request timed out. The server might be busy processing the image.');
    } else if (!err.response) {
      setError('Cannot connect to the server. Make sure the backend is running.');
    } else if (err.response.data && err.response.data.error) {
      setError(err.response.data.error);
    } else {
      setError(`Failed to detect emotions: ${err.message || 'Unknown error'}`);
    }
  } finally {
    setLoading(false);
  }
};

// API call to detect text emotions
export const detectTextEmotions = async (text, setLoading, setError, setEmotions) => {
  if (!text.trim()) {
    setError('Please enter some text first');
    return;
  }
  
  setLoading(true);
  setError(null);
  setEmotions([]);
  
  try {
    console.log("Processing text...");
    
    const response = await apiService.post('/api/detect-text-emotion', {
      text: text
    }, {
      timeout: 30000, // 30 second timeout
    });
    
    console.log("Text response received:", response.data);
    
    // Check if predictions exist
    if (response.data.predictions && response.data.predictions.length > 0) {
      setEmotions(response.data.predictions);
    } else if (response.data.error) {
      setError(response.data.error);
    } else {
      setError('No emotions were detected in this text.');
    }
  } catch (err) {
    console.error('Error detecting text emotions:', err);
    
    if (err.code === 'ECONNABORTED') {
      setError('Request timed out. The server might be busy processing the text.');
    } else if (!err.response) {
      setError('Cannot connect to the server. Make sure the backend is running.');
    } else if (err.response.data && err.response.data.error) {
      setError(err.response.data.error);
    } else {
      setError(`Failed to detect emotions: ${err.message || 'Unknown error'}`);
    }
  } finally {
    setLoading(false);
  }
};

// API call to detect audio emotions
export const detectAudioEmotions = async (audioFile, setLoading, setError, setEmotions) => {
  if (!audioFile) {
    setError('Please select or record an audio file first');
    return;
  }
  
  setLoading(true);
  setError(null);
  setEmotions([]);
  
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('audio', audioFile);
  
  try {
    console.log("Processing audio...");
    
    // Make POST request to Flask backend
    const response = await apiService.uploadFile('/api/detect-audio-emotion', formData, {
      timeout: 30000, // 30 second timeout
    });
    
    console.log("Audio response received:", response.data);
    
    // Check if predictions exist
    if (response.data.predictions && response.data.predictions.length > 0) {
      setEmotions(response.data.predictions);
    } else if (response.data.error) {
      setError(response.data.error);
    } else {
      setError('No emotions were detected in this audio.');
    }
  } catch (err) {
    console.error('Error detecting audio emotions:', err);
    
    if (err.code === 'ECONNABORTED') {
      setError('Request timed out. The server might be busy processing the audio.');
    } else if (!err.response) {
      setError('Cannot connect to the server. Make sure the backend is running.');
    } else if (err.response.data && err.response.data.error) {
      setError(err.response.data.error);
    } else {
      setError(`Failed to detect emotions: ${err.message || 'Unknown error'}`);
    }
  } finally {
    setLoading(false);
  }
}; 