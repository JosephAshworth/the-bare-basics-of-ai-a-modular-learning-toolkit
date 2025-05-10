import os # for file operations
import io # for reading the file
import base64 # for encoding and decoding the file
import traceback # for error handling
from flask import request, jsonify # for returning the response
from werkzeug.utils import secure_filename # for securing the filename
from PIL import Image # for image processing
import librosa # for audio processing
import torch # for tensor operations
from transformers import AutoImageProcessor, AutoModelForImageClassification # for image classification
from transformers import AutoTokenizer, AutoModelForSequenceClassification # for text classification
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification # for audio classification
import numpy as np # for numerical operations
import logging # for logging
import soundfile as sf # for audio processing

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "saved_models") # for the models directory
FACE_MODEL_DIR = os.path.join(MODELS_DIR, "face_emotion_model") # for the facial emotion model directory
FACE_PROCESSOR_DIR = os.path.join(MODELS_DIR, "face_emotion_processor") # for the facial emotion processor directory
TEXT_MODEL_DIR = os.path.join(MODELS_DIR, "text_emotion_model") # for the text emotion model directory
TEXT_TOKENIZER_DIR = os.path.join(MODELS_DIR, "text_emotion_tokenizer") # for the text emotion tokenizer directory
AUDIO_MODEL_DIR = os.path.join(MODELS_DIR, "audio_emotion_model") # for the audio emotion model directory
AUDIO_EXTRACTOR_DIR = os.path.join(MODELS_DIR, "audio_emotion_extractor") # for the audio emotion extractor directory

processor = None # set the processor to None initially, it will be loaded later
model = None # set the model to None initially, it will be loaded later
text_tokenizer = None # set the text tokenizer to None initially, it will be loaded later
text_model = None # set the text model to None initially, it will be loaded later
audio_extractor = None # set the audio extractor to None initially, it will be loaded later
audio_model = None # set the audio model to None initially, it will be loaded later

def load_models(): # define the load_models function to load the models
    global processor, model, text_tokenizer, text_model, audio_extractor, audio_model # set the processor, model, text tokenizer, text model, audio extractor, and audio model as global variables, so they can be used in the other functions
    
    try: # try to load the models
        if os.path.exists(FACE_MODEL_DIR) and os.path.exists(FACE_PROCESSOR_DIR): # if the facial emotion model and processor exist
            processor = AutoImageProcessor.from_pretrained(FACE_PROCESSOR_DIR, local_files_only=True) # load the facial emotion processor
            model = AutoModelForImageClassification.from_pretrained(FACE_MODEL_DIR, local_files_only=True) # load the facial emotion model
        else: # if the facial emotion model and processor do not exist
            error_msg = f"Face emotion model not found in {FACE_MODEL_DIR}. Please run download_models.py first." # return an error message
            raise FileNotFoundError(error_msg) # raise an error
        
        if os.path.exists(TEXT_MODEL_DIR) and os.path.exists(TEXT_TOKENIZER_DIR): # if the text emotion model and tokenizer exist
            text_tokenizer = AutoTokenizer.from_pretrained(TEXT_TOKENIZER_DIR, local_files_only=True) # load the text emotion tokenizer
            text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_DIR, local_files_only=True) # load the text emotion model
        else: # if the text emotion model and tokenizer do not exist
            error_msg = f"Text emotion model not found in {TEXT_MODEL_DIR}. Please run download_models.py first." # return an error message
            raise FileNotFoundError(error_msg) # raise an error
        
        if os.path.exists(AUDIO_MODEL_DIR) and os.path.exists(AUDIO_EXTRACTOR_DIR): # if the audio emotion model and extractor exist
            audio_extractor = AutoFeatureExtractor.from_pretrained(AUDIO_EXTRACTOR_DIR, local_files_only=True) # load the audio emotion extractor
            audio_model = AutoModelForAudioClassification.from_pretrained(AUDIO_MODEL_DIR, local_files_only=True) # load the audio emotion model
        else: # if the audio emotion model and extractor do not exist
            error_msg = f"Audio emotion model not found in {AUDIO_MODEL_DIR}. Please run download_models.py first." # return an error message
            raise FileNotFoundError(error_msg) # raise an error

    except FileNotFoundError as e: # if a file is not found
        raise e # raise an error
    except Exception as e: # if an unexpected error occurs
        raise RuntimeError(f"An unexpected error occurred during model loading: {e}") from e # raise an error
        

load_models() # load the models

def detect_emotion(): # define the detect_emotion function to detect the emotion
    try: # try to detect the emotion
        
        if 'image' not in request.files and 'image' not in request.json: # if the image is not provided
            return jsonify({'error': 'No image provided'}), 400 # return an error
        
        try: # try to process the image
            if 'image' in request.files: # if the image is provided in the request files
                file = request.files['image'] # get the image from the request files
                image = Image.open(file.stream) # open the image
            else: # if the image is provided in the request json
                base64_data = request.json['image'] # get the image from the request json
                if ',' in base64_data: # if the image is provided in the request json
                    base64_data = base64_data.split(',', 1)[1] # split the image from the request json
                
                img_data = base64.b64decode(base64_data) # decode the image from the request json
                image = Image.open(io.BytesIO(img_data)) # open the image
            

            if image.mode == 'RGBA': # if the image is in RGBA mode
                background = Image.new('RGB', image.size, (255, 255, 255)) # create a new image with the same size as the original image, with a white background
                background.paste(image, mask=image.split()[3]) # paste the image onto the background, using the alpha channel as a mask
                image = background # set the image to the background
            elif image.mode != 'RGB': # if the image is not in RGB mode
                image = image.convert('RGB') # convert the image to RGB mode
        
            
        except Exception as img_error: # if an error occurs
            return jsonify({'error': f'Error during image processing: {str(img_error)}'}), 400 # return an error

        
        try: # try to process the image
            inputs = processor(images=image, return_tensors="pt") # process the image, returning a tensor
            
            with torch.no_grad(): # disable gradient calculation, saving memory and speeding up the computation
                outputs = model(**inputs) # pass the processed image to the model, and get the outputs
                logits = outputs.logits # get the logits from the model, which are the raw, unnormalised scores for each class
                probabilities = torch.nn.functional.softmax(logits, dim=1)[0] # apply the softmax function to the logits, resulting in a probability distribution over the classes
            
            prob_values = {} # create an empty dictionary to store the probability values
            for i, prob in enumerate(probabilities): # for each probability
                if i in model.config.id2label: # if the probability is in the model's id2label mapping
                    prob_values[model.config.id2label[i]] = float(prob) # store the probability in the dictionary
                else: # if the probability is not in the model's id2label mapping
                    raise # raise an error
            
            predictions = [] # create an empty list to store the predictions
            
            try: # try to sort the probabilities
                sorted_indices = torch.argsort(probabilities, descending=True) # sort the probabilities in descending order
                
                for idx in sorted_indices: # for each index
                    idx_item = idx.item() # get the item from the index
                    if idx_item in model.config.id2label: # if the index is in the model's id2label mapping
                        emotion_name = model.config.id2label[idx_item] # get the emotion name from the model's id2label mapping
                        prob = float(probabilities[idx_item]) # get the probability from the probabilities
                        predictions.append({ 
                            'emotion': emotion_name, # add the emotion name to the predictions
                            'probability': prob # add the probability to the predictions
                        })
                    else: # if the index is not in the model's id2label mapping
                        raise # raise an error
                
                predictions = sorted(predictions, key=lambda x: x['probability'], reverse=True) # sort the predictions in descending order
                

                
                if not predictions: # if there are no predictions
                    return jsonify({'error': 'No emotions detected in this image'}), 200 # return an error
                
                return jsonify({'predictions': predictions}) # return the predictions
                
            except Exception as process_error: # if an error occurs
                
                return jsonify({
                    'predictions': [
                        {'emotion': 'unknown', 'probability': 1.0} # return an unknown emotion with a probability of 1.0
                    ],
                    'warning': f'Error in prediction processing: {str(process_error)}' # return an error message
                })
            
        except Exception as predict_error: # if an error occurs
            return jsonify({'error': f'Error analysing image: {str(predict_error)}'}), 500 # return an error
        
    except Exception as e: # if an error occurs
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500 # return an error

def detect_text_emotion(): # define the detect_text_emotion function to detect the emotion
    try: # try to detect the emotion
        request_id = base64.b64encode(os.urandom(6)).decode('ascii') # generate a random request id
        
        if 'text' not in request.json: # if the text is not provided
            return jsonify({'error': 'No text provided'}), 400 # return an error
        
        text = request.json['text'] # get the text from the request json
        
        try: # try to process the text
            inputs = text_tokenizer(text, return_tensors="pt", truncation=True, max_length=512) # process the text, returning a tensor
            
            with torch.no_grad(): # disable gradient calculation, saving memory and speeding up the computation
                outputs = text_model(**inputs) # pass the processed text to the model, and get the outputs
                logits = outputs.logits # get the logits from the model, which are the raw, unnormalised scores for each class
                probabilities = torch.nn.functional.softmax(logits, dim=1)[0] # apply the softmax function to the logits, resulting in a probability distribution over the classes
            
            prob_values = {} # create an empty dictionary to store the probability values
            for i, prob in enumerate(probabilities): # for each probability
                if i in text_model.config.id2label: # if the probability is in the model's id2label mapping
                    prob_values[text_model.config.id2label[i]] = float(prob) # store the probability in the dictionary
                else: # if the probability is not in the model's id2label mapping
                    pass # do nothing
            
            
            predictions = [] # create an empty list to store the predictions
            
            try: # try to sort the probabilities
                sorted_indices = torch.argsort(probabilities, descending=True) # sort the probabilities in descending order
                
                for idx in sorted_indices: # for each index
                    idx_item = idx.item() # get the item from the index
                    if idx_item in text_model.config.id2label: # if the index is in the model's id2label mapping
                        emotion_name = text_model.config.id2label[idx_item] # get the emotion name from the model's id2label mapping
                        prob = float(probabilities[idx_item]) # get the probability from the probabilities
                        predictions.append({
                            'emotion': emotion_name, # add the emotion name to the predictions
                            'probability': prob # add the probability to the predictions
                        })
                    else: # if the index is not in the model's id2label mapping
                        print(f"Warning: [{request_id}] Label key {idx_item} not found in id2label mapping") # print a warning
                
                predictions = sorted(predictions, key=lambda x: x['probability'], reverse=True) # sort the predictions in descending order
                
                
                if not predictions: # if there are no predictions
                    return jsonify({'error': 'No emotions detected in this text'}), 200 # return an error
                
                return jsonify({'predictions': predictions}) # return the predictions
                
            except Exception as process_error: # if an error occurs
                
                return jsonify({
                    'predictions': [
                        {'emotion': 'unknown', 'probability': 1.0} # return an unknown emotion with a probability of 1.0
                    ],
                    'warning': f'Error in prediction processing: {str(process_error)}' # return an error message
                })
            
        except Exception as predict_error: # if an error occurs
            return jsonify({'error': f'Error analysing text: {str(predict_error)}'}), 500 # return an error
        
    except Exception as e: # if an error occurs
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500 # return an error

def detect_audio_emotion(): # define the detect_audio_emotion function to detect the emotion
    try: # try to detect the emotion
        request_id = base64.b64encode(os.urandom(6)).decode('ascii') # generate a random request id

        if audio_model is None or audio_extractor is None: # if the audio model or extractor is not loaded
            return jsonify({
                'error': 'Audio emotion detection model not loaded', # return an error message
                'details': 'Run python download_models.py to download all required models.' # return an error message
            }), 503 # return an error
        
        if 'audio' not in request.files and 'audio' not in request.json: # if the audio is not provided
            return jsonify({'error': 'No audio provided'}), 400 # return an error
        
        temp_dir = os.path.join("debug", "audio_temp") # create a temporary directory for the audio, where the audio will be temporarily stored and deleted after the analysis is complete
        os.makedirs(temp_dir, exist_ok=True) # create the temporary directory if it doesn't exist
        
        try: # try to process the audio
            audio_path = None # set the audio path to None initially
            
            if 'audio' in request.files: # if the audio is provided in the request files
                file = request.files['audio'] # get the audio from the request files
                file_ext = os.path.splitext(file.filename)[1].lower() # get the extension of the audio file
                
                audio_path = os.path.join(temp_dir, f"audio_{request_id}_{secure_filename(file.filename)}") # create a path for the audio file
                file.save(audio_path) # save the audio file to the temporary directory
                
                if file_ext == '.webm': # if the audio file is a WebM file
                    try:
                        wav_path = os.path.join(temp_dir, f"audio_{request_id}_converted.wav") # create a path for the converted audio file
                        
                        if os.path.exists(wav_path) and os.path.getsize(wav_path) > 0: # if the converted audio file exists and is not empty
                            audio_path = wav_path # set the audio path to the converted audio file
                    except Exception as conv_error: # if an error occurs
                        print(f"[{request_id}] Could not convert WebM using ffmpeg: {str(conv_error)}") # print an error
                
            elif 'audio' in request.json: # if the audio is provided in the request json
                base64_data = request.json['audio'] # get the audio from the request json
                if ',' in base64_data: # if the audio is provided in the request json
                    base64_data = base64_data.split(',', 1)[1] # split the audio from the request json
                
                audio_data = base64.b64decode(base64_data) # decode the audio from the request json
                
                audio_path = os.path.join(temp_dir, f"audio_{request_id}.wav") # create a path for the audio file
                with open(audio_path, "wb") as f: # save the audio file to the temporary directory
                    f.write(audio_data) # write the audio data to the audio file
                
        
            
            try: # try to load the audio file
                audio, rate = librosa.load(audio_path, sr=16000, mono=True) # load the audio file, resampling to 16000 Hz and mono, which is the recommended sample rate and format for the model
            except Exception as load_error: # if an error occurs
                try: # try to load the audio file
                    audio, rate = librosa.load(audio_path, sr=16000, mono=True, offset=0.0, duration=5.0) # load the audio file, resampling to 16000 Hz and mono, with an offset of 0.0 seconds and a duration of 5.0 seconds. This is to ensure the audio file is valid and can be processed
                except Exception as fallback_error: # if an error occurs
                    try: # try to load the audio file
                        audio_data, samplerate = sf.read(audio_path) # read the audio file
                        audio = audio_data.mean(axis=1) if len(audio_data.shape) > 1 else audio_data # convert the audio file to mono if it is stereo
                        rate = samplerate # set the sample rate to the sample rate of the audio file
                        if rate != 16000: # if the sample rate is not 16000 Hz
                            audio = librosa.resample(audio, orig_sr=rate, target_sr=16000) # resample the audio file to 16000 Hz
                            rate = 16000 # set the sample rate to 16000 Hz
                            logging.info(f"[{request_id}] Final audio loading successful") # print a message to the console
                    except Exception as last_error: # if an error occurs
                        raise Exception(f"Failed to load audio file after multiple attempts. Initial error: {str(load_error)}. Fallback error: {str(fallback_error)}. Final attempt error: {str(last_error)}. Try a different audio format.") # raise an error
            
            if len(audio) < rate: # if the audio file is too short
                print(f"[{request_id}] Audio too short ({len(audio)/rate:.2f}s), padding to ensure valid analysis") # print a message to the console
                padding = np.zeros(rate - len(audio)) # create a padding array, which is an array of zeros with the length of the difference between the length of the audio and the sample rate
                audio = np.concatenate([audio, padding]) # concatenate the audio and the padding, which is the same length as the sample rate
                
        except Exception as audio_error: # if an error occurs
            print(f"[{request_id}] Error processing audio: {str(audio_error)}") # print an error
            print(traceback.format_exc()) # print the traceback
            
            if audio_path and os.path.exists(audio_path): # if the audio file exists
                try: # try to remove the audio file
                    os.remove(audio_path) # remove the audio file
                except: # if an error occurs
                    pass # do nothing
                
            return jsonify({
                'error': f'Audio file cannot be processed: {str(audio_error)}', # return an error message
                'details': 'Try using a different file format like WAV or MP3, or ensure the audio file is not corrupted.' # return an error message
            }), 400 # return an error
        
        try: # try to process the audio
            inputs = audio_extractor(audio, sampling_rate=rate, return_tensors="pt") # process the audio, returning a tensor
            
            with torch.no_grad(): # disable gradient calculation, saving memory and speeding up the computation
                outputs = audio_model(**inputs) # pass the processed audio to the model, and get the outputs
                logits = outputs.logits # get the logits from the model, which are the raw, unnormalised scores for each class
                probabilities = torch.nn.functional.softmax(logits, dim=-1)[0] # apply the softmax function to the logits, resulting in a probability distribution over the classes
            
            predictions = [] # create an empty list to store the predictions
            
            for idx, prob in enumerate(probabilities): # for each probability
                if idx in audio_model.config.id2label: # if the probability is in the model's id2label mapping
                    emotion_name = audio_model.config.id2label[idx] # get the emotion name from the model's id2label mapping
                    predictions.append({
                        'emotion': emotion_name, # add the emotion name to the predictions
                        'probability': float(prob) # add the probability to the predictions
                    })
            
            predictions = sorted(predictions, key=lambda x: x['probability'], reverse=True) # sort the predictions in descending order
            
            
            if audio_path and os.path.exists(audio_path): # if the audio file exists
                os.remove(audio_path) # remove the audio file
            
            if not predictions: # if there are no predictions
                return jsonify({'error': 'No emotions detected in this audio'}), 200 # return an error
            
            return jsonify({'predictions': predictions}) # return the predictions
            
        except Exception as predict_error: # if an error occurs
            
            if audio_path and os.path.exists(audio_path): # if the audio file exists
                os.remove(audio_path) # remove the audio file
                
            return jsonify({'error': f'Error analysing audio: {str(predict_error)}'}), 500 # return an error
        
    except Exception as e: # if an error occurs
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500 # return an error

def register_emotion_routes(app): # define the register_emotion_routes function to register the emotion routes with the app, allowing the routes to be used in the app
    app.route('/api/detect-emotion', methods=['POST'])(detect_emotion) # register the detect_emotion route with the app, allowing it to be used in the app
    app.route('/api/detect-text-emotion', methods=['POST'])(detect_text_emotion) # register the detect_text_emotion route with the app, allowing it to be used in the app
    app.route('/api/detect-audio-emotion', methods=['POST'])(detect_audio_emotion) # register the detect_audio_emotion route with the app, allowing it to be used in the app
