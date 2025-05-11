import apiService from '../../services/apiService'; // import the apiService from the services folder, this is used to make API requests

export const getEmotionColour = (emotion) => { // export the getEmotionColour function, this is used to get the colour of the emotion
  const colourMap = { // set the colourMap to the following values (some emotions are mapped to the same colour, based on similar emotions)
    anger: '#FF4500', // set the colour of the anger emotion to orange
    angry: '#FF4500', // set the colour of the angry emotion to orange
    disgust: '#8BC34A', // set the colour of the disgust emotion to green
    disgusted: '#8BC34A', // set the colour of the disgusted emotion to green
    fear: '#9C27B0', // set the colour of the fear emotion to purple
    fearful: '#9C27B0', // set the colour of the fearful emotion to purple
    happy: '#FFD700', // set the colour of the happy emotion to yellow
    happiness: '#FFD700', // set the colour of the happiness emotion to yellow
    joy: '#FFD700', // set the colour of the joy emotion to yellow
    sad: '#2196F3', // set the colour of the sad emotion to blue
    sadness: '#2196F3', // set the colour of the sadness emotion to blue
    surprise: '#FF69B4', // set the colour of the surprise emotion to pink
    surprised: '#FF69B4', // set the colour of the surprised emotion to pink
    suprised: '#FF69B4', // set the colour of the suprised emotion to pink
    neutral: '#9E9E9E', // set the colour of the neutral emotion to grey
    love: '#E91E63', // set the colour of the love emotion to pink
    admiration: '#BA68C8', // set the colour of the admiration emotion to purple
    gratitude: '#8BC34A', // set the colour of the gratitude emotion to green
    approval: '#CDDC39', // set the colour of the approval emotion to yellow
    caring: '#9FA8DA', // set the colour of the caring emotion to light blue
    excitement: '#FF5722', // set the colour of the excitement emotion to orange
    amusement: '#FFA726', // set the colour of the amusement emotion to orange
    curiosity: '#29B6F6', // set the colour of the curiosity emotion to light blue
    optimism: '#FFEB3B', // set the colour of the optimism emotion to yellow
    disappointment: '#78909C', // set the colour of the disappointment emotion to grey
    disapproval: '#EF5350', // set the colour of the disapproval emotion to red
    embarrassment: '#CE93D8', // set the colour of the embarrassment emotion to purple
    confusion: '#9E9E9E', // set the colour of the confusion emotion to grey
    grief: '#546E7A', // set the colour of the grief emotion to grey
    nervousness: '#AED581', // set the colour of the nervousness emotion to green
    pride: '#FFD54F', // set the colour of the pride emotion to yellow
    remorse: '#A1887F', // set the colour of the remorse emotion to brown
    realisation: '#26A69A', // set the colour of the realisation emotion to green
    relief: '#81C784', // set the colour of the relief emotion to green
    calm: '#4FC3F7', // set the colour of the calm emotion to blue
    frustration: '#FF7043', // set the colour of the frustration emotion to orange
    anxious: '#7E57C2', // set the colour of the anxious emotion to purple
    boredom: '#BDBDBD', // set the colour of the boredom emotion to grey
    confidence: '#66BB6A', // set the colour of the confidence emotion to green
    hesitation: '#90A4AE', // set the colour of the hesitation emotion to grey
    default: '#9E9E9E' // set the colour of the default emotion to grey
  };
  
  return colourMap[emotion?.toLowerCase()] || colourMap.default; // return the colour of the emotion, or the default colour if the emotion is not found
};

export const detectFaceEmotions = async (imageFile, setLoading, setError, setEmotions) => { // export the detectFaceEmotions function, this is used to detect the emotions from the face
  if (!imageFile) { // if the image file is not found
    return; // return nothing
  }

  try { // try to detect the emotions from the face
    console.log(`Detecting face emotions for file: ${imageFile.name}`); // log the name of the image file
    setLoading && setLoading(true); // set the loading state to true
    setError && setError(null); // set the error state to null
    
    const formData = new FormData(); // create a new form data object
    formData.append('image', imageFile); // append the image file to the form data
    
    console.log('Sending image to backend for face emotion detection...'); // log the message
    const response = await apiService.uploadFile('/api/detect-emotion', formData); // send the form data to the backend
    
    console.log('Face emotion detection successful:', response.data); // log the message
    setEmotions && setEmotions(response.data.predictions || []); // set the emotions to the response data
    return response.data; // return the response data
  } catch (error) { // catch the error
    console.error('Face emotion detection failed:', error); // log the error
    
    if (error.response) { // if the error response is found
      console.error('Error response data:', error.response.data); // log the error response data
      console.error('Error status:', error.response.status); // log the error status
    } else if (error.request) { // if the error request is found
      console.error('No response received. Make sure the backend is running.'); // log the message
    } else { // if the error is not found
      console.error('Error details:', error.message); // log the error details
    }
    
    setError && setError('Failed to detect emotions. Please make sure the backend server is running.'); // set the error to the message
  } finally {
    setLoading && setLoading(false); // set the loading state to false
  }
};

export const detectTextEmotions = async (text, setLoading, setError, setEmotions) => { // export the detectTextEmotions function, this is used to detect the emotions from the text
  if (!text || text.trim() === '') { // if the text is not found
    return; // return nothing
  }

  try { // try to detect the emotions from the text
    console.log(`Detecting text emotions for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`); // log the text
    setLoading && setLoading(true); // set the loading state to true
    setError && setError(null); // set the error state to null
    
    console.log('Sending text to backend for emotion detection...'); // log the message
    const response = await apiService.post('/api/detect-text-emotion', { text }); // send the text to the backend
    
    console.log('Text emotion detection successful:', response.data); // log the message
    setEmotions && setEmotions(response.data.predictions || []); // set the emotions to the response data
    return response.data; // return the response data
  } catch (error) { // catch the error
    console.error('Text emotion detection failed:', error); // log the error
    
    if (error.response) { // if the error response is found
      console.error('Error response data:', error.response.data); // log the error response data
      console.error('Error status:', error.response.status); // log the error status
    } else if (error.request) { // if the error request is found
      console.error('No response received. Make sure the backend is running.'); // log the message
    } else { // if the error is not found
      console.error('Error details:', error.message); // log the error details
    }
    
    setError && setError('Failed to detect emotions. Please make sure the backend server is running.'); // set the error to the message
  } finally {
    setLoading && setLoading(false); // set the loading state to false
  }
};

export const detectAudioEmotions = async (audioFile, setLoading, setError, setEmotions) => { // export the detectAudioEmotions function, this is used to detect the emotions from the audio
  if (!audioFile) { // if the audio file is not found
    return; // return nothing
  }

  try { // try to detect the emotions from the audio
    console.log(`Detecting audio emotions for file: ${audioFile.name} (type: ${audioFile.type}, size: ${audioFile.size} bytes)`); // log the message
    setLoading && setLoading(true); // set the loading state to true
    setError && setError(null); // set the error state to null
    
    const fileExtension = audioFile.name.split('.').pop().toLowerCase(); // get the file extension of the audio file
    const isCommonFormat = ['wav', 'mp3', 'ogg', 'webm', 'm4a', 'mpeg'].includes(fileExtension); // check if the file extension is a common format
    
    if (!isCommonFormat) { // if the file extension is not a common format
      console.warn(`Uncommon audio format: ${fileExtension}. This might cause processing issues.`); // log the message
    }
    
    if (audioFile.size > 10 * 1024 * 1024) { // if the audio file is larger than 10MB
      console.warn(`Large audio file (${(audioFile.size / (1024 * 1024)).toFixed(2)}MB). Consider using a smaller file.`); // log the message
    }
    
    const formData = new FormData(); // create a new form data object
    formData.append('audio', audioFile); // append the audio file to the form data
    
    const formDataFile = formData.get('audio'); // get the audio file from the form data
    console.log('FormData audio file:', { // log the message
      name: formDataFile?.name, // log the name of the audio file
      type: formDataFile?.type, // log the type of the audio file
      size: formDataFile?.size, // log the size of the audio file
      exists: formDataFile !== null && formDataFile !== undefined // log the message
    });
    
    console.log('Sending audio to backend for emotion detection...'); // log the message
    
    console.log('FormData contains:', formData.get('audio') ? 'audio file present' : 'no audio file'); // log the message
    
    const response = await apiService.uploadFile('/api/detect-audio-emotion', formData); // send the form data to the backend
    
    console.log('Audio emotion detection successful:', response.data); // log the message
    setEmotions && setEmotions(response.data.predictions || []); // set the emotions to the response data
    return response.data; // return the response data
  } catch (error) { // catch the error
    console.error('Audio emotion detection failed:', error); // log the error
    
    if (error.response) { // if the error response is found
      console.error('Error response data:', error.response.data); // log the error response data
      console.error('Error status:', error.response.status); // log the error status
      
      if (error.response.data && error.response.data.error) { // if the error response data is found
        const errorMsg = error.response.data.error; // set the error message to the error response data
        const details = error.response.data.details || ''; // set the details to the error response data
        setError && setError(`${errorMsg} ${details}`); // set the error to the message
      }
    } else if (error.request) { // if the error request is found
      console.error('No response received. Make sure the backend is running.'); // log the message
      console.error('Request details:', error.request); // log the message
    } else { // if the error is not found
      console.error('Error details:', error.message); // log the error details
    }
    
    setError && setError('Failed to detect emotions. Please make sure the backend server is running and try a different audio file format like WAV or MP3.'); // set the error to the message
  } finally {
    setLoading && setLoading(false); // set the loading state to false
  }
};
