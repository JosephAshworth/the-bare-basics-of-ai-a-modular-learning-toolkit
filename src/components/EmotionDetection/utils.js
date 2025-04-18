import apiService from '../../services/apiService';

// Return color based on emotion
export const getEmotionColor = (emotion) => {
  const colorMap = {
    angry: '#FF4500',      // OrangeRed
    disgust: '#9ACD32',    // YellowGreen
    fear: '#800080',       // Purple
    happy: '#FFD700',      // Gold
    sad: '#1E90FF',        // DodgerBlue
    surprise: '#FF69B4',   // HotPink
    neutral: '#A9A9A9',    // DarkGray
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
  
  return colorMap[emotion?.toLowerCase()] || '#A9A9A9';
};

// API call to detect face emotions
export const detectFaceEmotions = async (imageFile, setLoading, setError, setEmotions) => {
  if (!imageFile) {
    return;
  }

  try {
    console.log(`🔍 Detecting face emotions for file: ${imageFile.name}`);
    setLoading && setLoading(true);
    setError && setError(null);
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    // Use the uploadFile method from apiService with the correct endpoint
    console.log('📤 Sending image to backend for face emotion detection...');
    const response = await apiService.uploadFile('/api/detect-emotion', formData);
    
    console.log('✅ Face emotion detection successful:', response.data);
    setEmotions && setEmotions(response.data.predictions || []);
    return response.data;
  } catch (error) {
    console.error('❌ Face emotion detection failed:', error);
    
    // Provide more detailed error information
    if (error.response) {
      console.error('📋 Error response data:', error.response.data);
      console.error('🔢 Error status:', error.response.status);
    } else if (error.request) {
      console.error('🌐 No response received. Make sure the backend is running.');
    } else {
      console.error('🧩 Error details:', error.message);
    }
    
    setError && setError('Failed to detect emotions. Please make sure the backend server is running.');
    throw new Error('Failed to detect emotions. Please make sure the backend server is running.');
  } finally {
    setLoading && setLoading(false);
  }
};

// API call to detect text emotions
export const detectTextEmotions = async (text, setLoading, setError, setEmotions) => {
  if (!text || text.trim() === '') {
    return;
  }

  try {
    console.log(`🔍 Detecting text emotions for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    setLoading && setLoading(true);
    setError && setError(null);
    
    // Use the post method from apiService with the correct endpoint
    console.log('📤 Sending text to backend for emotion detection...');
    const response = await apiService.post('/api/detect-text-emotion', { text });
    
    console.log('✅ Text emotion detection successful:', response.data);
    setEmotions && setEmotions(response.data.predictions || []);
    return response.data;
  } catch (error) {
    console.error('❌ Text emotion detection failed:', error);
    
    // Provide more detailed error information
    if (error.response) {
      console.error('📋 Error response data:', error.response.data);
      console.error('🔢 Error status:', error.response.status);
    } else if (error.request) {
      console.error('🌐 No response received. Make sure the backend is running.');
    } else {
      console.error('🧩 Error details:', error.message);
    }
    
    setError && setError('Failed to detect emotions. Please make sure the backend server is running.');
    throw new Error('Failed to detect emotions. Please make sure the backend server is running.');
  } finally {
    setLoading && setLoading(false);
  }
};

// API call to detect audio emotions
export const detectAudioEmotions = async (audioFile, setLoading, setError, setEmotions) => {
  if (!audioFile) {
    return;
  }

  try {
    console.log(`🔍 Detecting audio emotions for file: ${audioFile.name}`);
    setLoading && setLoading(true);
    setError && setError(null);
    
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    // Use the uploadFile method from apiService with the correct endpoint
    console.log('📤 Sending audio to backend for emotion detection...');
    const response = await apiService.uploadFile('/api/detect-audio-emotion', formData);
    
    console.log('✅ Audio emotion detection successful:', response.data);
    setEmotions && setEmotions(response.data.predictions || []);
    return response.data;
  } catch (error) {
    console.error('❌ Audio emotion detection failed:', error);
    
    // Provide more detailed error information
    if (error.response) {
      console.error('📋 Error response data:', error.response.data);
      console.error('🔢 Error status:', error.response.status);
    } else if (error.request) {
      console.error('🌐 No response received. Make sure the backend is running.');
    } else {
      console.error('🧩 Error details:', error.message);
    }
    
    setError && setError('Failed to detect emotions. Please make sure the backend server is running.');
    throw new Error('Failed to detect emotions. Please make sure the backend server is running.');
  } finally {
    setLoading && setLoading(false);
  }
}; 