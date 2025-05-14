// this file contains the utility functions for the emotion detection component
// it includes getting the colour of the emotion as well as the endpoints for the different detection types

import apiService from '../../services/APIService'; // import the apiService for making API requests

export const getEmotionColour = (emotion) => {
  const colourMap = { // map emotions to specific colours
    anger: '#FF4500', // orange for anger
    angry: '#FF4500', // orange for angry
    disgust: '#8BC34A', // green for disgust
    disgusted: '#8BC34A', // green for disgusted
    fear: '#9C27B0', // purple for fear
    fearful: '#9C27B0', // purple for fearful
    happy: '#FFD700', // yellow for happy
    happiness: '#FFD700', // yellow for happiness
    joy: '#FFD700', // yellow for joy
    sad: '#2196F3', // blue for sad
    sadness: '#2196F3', // blue for sadness
    surprise: '#FF69B4', // pink for surprise
    surprised: '#FF69B4', // pink for surprised
    suprised: '#FF69B4', // pink for suprised
    neutral: '#9E9E9E', // grey for neutral
    love: '#E91E63', // pink for love
    admiration: '#BA68C8', // purple for admiration
    gratitude: '#8BC34A', // green for gratitude
    approval: '#CDDC39', // yellow for approval
    caring: '#9FA8DA', // light blue for caring
    excitement: '#FF5722', // orange for excitement
    amusement: '#FFA726', // orange for amusement
    curiosity: '#29B6F6', // light blue for curiosity
    optimism: '#FFEB3B', // yellow for optimism
    disappointment: '#78909C', // grey for disappointment
    disapproval: '#EF5350', // red for disapproval
    embarrassment: '#CE93D8', // purple for embarrassment
    confusion: '#9E9E9E', // grey for confusion
    grief: '#546E7A', // grey for grief
    nervousness: '#AED581', // green for nervousness
    pride: '#FFD54F', // yellow for pride
    remorse: '#A1887F', // brown for remorse
    realisation: '#26A69A', // green for realisation
    relief: '#81C784', // green for relief
    calm: '#4FC3F7', // blue for calm
    frustration: '#FF7043', // orange for frustration
    anxious: '#7E57C2', // purple for anxious
    boredom: '#BDBDBD', // grey for boredom
    confidence: '#66BB6A', // green for confidence
    hesitation: '#90A4AE', // grey for hesitation
    default: '#9E9E9E' // default grey for unlisted emotions
  };
  
  return colourMap[emotion?.toLowerCase()] || colourMap.default; // return the mapped colour or default if not found
};

export const detectFaceEmotions = async (imageFile, setLoading, setError, setEmotions) => {
  if (!imageFile) {
    return; // exit if no image file is provided
  }

  try {
    console.log(`Detecting face emotions for file: ${imageFile.name}`);
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', imageFile); // prepare form data with the image file
    
    console.log('Sending image to backend for face emotion detection...');
    const response = await apiService.uploadFile('/api/detect-emotion', formData); // send image to backend
    
    console.log('Face emotion detection successful:', response.data);
    setEmotions(response.data.predictions || []); // update emotions with response data
    return response.data;
  } catch (error) {
    console.error('Face emotion detection failed:', error);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received. Make sure the backend is running.');
    } else {
      console.error('Error details:', error.message);
    }
    
    setError('Failed to detect emotions. Please make sure the backend server is running.');
  } finally {
    setLoading(false);
  }
};

export const detectTextEmotions = async (text, setLoading, setError, setEmotions) => {
  if (!text || text.trim() === '') {
    return; // exit if no text is provided
  }

  try {
    console.log(`Detecting text emotions for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    setLoading(true);
    setError(null);
    
    console.log('Sending text to backend for emotion detection...');
    const response = await apiService.post('/api/detect-text-emotion', { text }); // send text to backend
    
    console.log('Text emotion detection successful:', response.data);
    setEmotions(response.data.predictions || []); // update emotions with response data
    return response.data;
  } catch (error) {
    console.error('Text emotion detection failed:', error);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received. Make sure the backend is running.');
    } else {
      console.error('Error details:', error.message);
    }
    
    setError('Failed to detect emotions. Please make sure the backend server is running.');
  } finally {
    setLoading(false);
  }
};

export const detectAudioEmotions = async (audioFile, setLoading, setError, setEmotions) => {
  if (!audioFile) {
    return; // exit if no audio file is provided
  }

  try {
    console.log(`Detecting audio emotions for file: ${audioFile.name} (type: ${audioFile.type}, size: ${audioFile.size} bytes)`);
    setLoading(true);
    setError(null);
    
    const fileExtension = audioFile.name.split('.').pop().toLowerCase();
    const isCommonFormat = ['wav', 'mp3', 'ogg', 'webm'].includes(fileExtension); // check for common audio formats
    
    if (!isCommonFormat) {
      console.warn(`Uncommon audio format: ${fileExtension}. This might cause processing issues.`);
    }
    
    if (audioFile.size > 10 * 1024 * 1024) {
      console.warn(`Large audio file (${(audioFile.size / (1024 * 1024)).toFixed(2)}MB). Consider using a smaller file.`);
    }
    
    const formData = new FormData();
    formData.append('audio', audioFile); // prepare form data with the audio file
    
    const formDataFile = formData.get('audio');
    console.log('FormData audio file:', {
      name: formDataFile?.name,
      type: formDataFile?.type,
      size: formDataFile?.size,
      exists: formDataFile !== null && formDataFile !== undefined
    });
    
    console.log('Sending audio to backend for emotion detection...');
    
    console.log('FormData contains:', formData.get('audio') ? 'audio file present' : 'no audio file');
    
    const response = await apiService.uploadFile('/api/detect-audio-emotion', formData); // send audio to backend
    
    console.log('Audio emotion detection successful:', response.data);
    setEmotions(response.data.predictions || []); // update emotions with response data
    return response.data;
  } catch (error) {
    console.error('Audio emotion detection failed:', error);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
      
      if (error.response.data && error.response.data.error) {
        const errorMsg = error.response.data.error;
        const details = error.response.data.details || '';
        setError(`${errorMsg} ${details}`);
      }
    } else if (error.request) {
      console.error('No response received. Make sure the backend is running.');
      console.error('Request details:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    
    setError('Failed to detect emotions. Please make sure the backend server is running and try a different audio file format like WAV or MP3.');
  } finally {
    setLoading(false);
  }
};
