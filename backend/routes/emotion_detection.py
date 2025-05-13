# this script handles the emotion detection for the face, text and audio models
# including loading the models and then detection

import os
import io
import base64
import traceback
from flask import request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
import librosa
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification
import numpy as np
import soundfile as sf

# paths to the models
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "saved_models")
FACE_MODEL_DIR = os.path.join(MODELS_DIR, "face_emotion_model")
FACE_PROCESSOR_DIR = os.path.join(MODELS_DIR, "face_emotion_processor")
TEXT_MODEL_DIR = os.path.join(MODELS_DIR, "text_emotion_model")
TEXT_TOKENIZER_DIR = os.path.join(MODELS_DIR, "text_emotion_tokenizer")
AUDIO_MODEL_DIR = os.path.join(MODELS_DIR, "audio_emotion_model")
AUDIO_EXTRACTOR_DIR = os.path.join(MODELS_DIR, "audio_emotion_extractor")

# initialise the variables for our ai models, these will be loaded when needed
processor = None
model = None
text_tokenizer = None
text_model = None
audio_extractor = None
audio_model = None

# decide whether running in development or production
ENV = os.environ.get("ENVIRONMENT", "development")

# load the models
def load_models():
    global processor, model, text_tokenizer, text_model, audio_extractor, audio_model
    
    try:
        # load the face model and processor
        if os.path.exists(FACE_MODEL_DIR) and os.path.exists(FACE_PROCESSOR_DIR):
            processor = AutoImageProcessor.from_pretrained(
                FACE_PROCESSOR_DIR,
                local_files_only=(ENV != "production") # only load the local files if not in production, to speed up loading
            )
            model = AutoModelForImageClassification.from_pretrained(
                FACE_MODEL_DIR,
                local_files_only=(ENV != "production")
            )
        else:
            error_msg = f"Face emotion model not found in {FACE_MODEL_DIR}. Please run download_models.py first."
            raise FileNotFoundError(error_msg)

        # load the text model and tokenizer
        if os.path.exists(TEXT_MODEL_DIR) and os.path.exists(TEXT_TOKENIZER_DIR):
            text_tokenizer = AutoTokenizer.from_pretrained(
                TEXT_TOKENIZER_DIR,
                local_files_only=(ENV != "production"),
                use_fast=(ENV == "production")
            )
            text_model = AutoModelForSequenceClassification.from_pretrained(
                TEXT_MODEL_DIR,
                local_files_only=(ENV != "production")
            )
        else:
            error_msg = f"Text emotion model not found in {TEXT_MODEL_DIR}. Please run download_models.py first."
            raise FileNotFoundError(error_msg)

        # load the audio model and extractor
        if os.path.exists(AUDIO_MODEL_DIR) and os.path.exists(AUDIO_EXTRACTOR_DIR):
            audio_extractor = AutoFeatureExtractor.from_pretrained(
                AUDIO_EXTRACTOR_DIR,
                local_files_only=(ENV != "production")
            )
            audio_model = AutoModelForAudioClassification.from_pretrained(
                AUDIO_MODEL_DIR,
                local_files_only=(ENV != "production"),
                use_safetensors=True # for improved security and efficiency
            )
        else:
            error_msg = f"Audio emotion model not found in {AUDIO_MODEL_DIR}. Please run download_models.py first."
            raise FileNotFoundError(error_msg)

    except FileNotFoundError as e:
        raise e
    except Exception as e:
        raise RuntimeError(f"An unexpected error occurred during model loading: {e}") from e

# load the models
load_models()

# detect the emotion from an image
def detect_emotion():
    try:
        if 'image' not in request.files and 'image' not in request.json:
            return jsonify({'error': 'No image provided'}), 400
        
        try:
            if 'image' in request.files:
                file = request.files['image']
                image = Image.open(file.stream)
            else:
                base64_data = request.json['image']
                if ',' in base64_data:
                    base64_data = base64_data.split(',', 1)[1]
                
                img_data = base64.b64decode(base64_data)
                image = Image.open(io.BytesIO(img_data))

            if image.mode == 'RGBA':
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[3])
                image = background
            elif image.mode != 'RGB':
                image = image.convert('RGB')
        
        except Exception as img_error:
            return jsonify({'error': f'Error during image processing: {str(img_error)}'}), 400

        try:
            inputs = processor(images=image, return_tensors="pt") # process the image
            
            # get the predictions from the model
            with torch.no_grad():
                outputs = model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)[0]
            
            # get the probabilities for each emotion
            prob_values = {}
            for i, prob in enumerate(probabilities):
                if i in model.config.id2label:
                    prob_values[model.config.id2label[i]] = float(prob)
                else:
                    raise
            
            predictions = []
            
            try:
                sorted_indices = torch.argsort(probabilities, descending=True)
                
                # iterate through the sorted indices to get the emotions and their probabilities
                for idx in sorted_indices:
                    idx_item = idx.item()
                    if idx_item in model.config.id2label:
                        emotion_name = model.config.id2label[idx_item]
                        prob = float(probabilities[idx_item])
                        predictions.append({
                            'emotion': emotion_name,
                            'probability': prob
                        })
                    else:
                        raise
                
                # sort the predictions by probability in descending order
                predictions = sorted(predictions, key=lambda x: x['probability'], reverse=True)
                
                if not predictions:
                    return jsonify({'error': 'No emotions detected in this image'}), 200
                
                return jsonify({'predictions': predictions})
                
            except Exception as process_error:
                return jsonify({
                    'predictions': [
                        {'emotion': 'unknown', 'probability': 1.0}
                    ],
                    'warning': f'Error in prediction processing: {str(process_error)}'
                })
            
        except Exception as predict_error:
            return jsonify({'error': f'Error analysing image: {str(predict_error)}'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500


def detect_text_emotion():
    try:
        request_id = base64.b64encode(os.urandom(6)).decode('ascii')
        
        if 'text' not in request.json:
            return jsonify({'error': 'No text provided'}), 400
        
        text = request.json['text']
        
        try:
            inputs = text_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            
            with torch.no_grad():
                outputs = text_model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)[0]
            
            prob_values = {}
            for i, prob in enumerate(probabilities):
                if i in text_model.config.id2label:
                    prob_values[text_model.config.id2label[i]] = float(prob)
                else:
                    pass
            
            predictions = []
            
            try:
                sorted_indices = torch.argsort(probabilities, descending=True)
                
                # iterate through the sorted indices to get the emotions and their probabilities
                for idx in sorted_indices:
                    idx_item = idx.item()
                    if idx_item in text_model.config.id2label:
                        emotion_name = text_model.config.id2label[idx_item]
                        prob = float(probabilities[idx_item])
                        predictions.append({
                            'emotion': emotion_name,
                            'probability': prob
                        })
                    else:
                        print(f"Warning: [{request_id}] Label key {idx_item} not found in id2label mapping")
                
                # sort the predictions by probability in descending order
                predictions = sorted(predictions, key=lambda x: x['probability'], reverse=True)
                
                if not predictions:
                    return jsonify({'error': 'No emotions detected in this text'}), 200
                
                return jsonify({'predictions': predictions})
                
            except Exception as process_error:
                return jsonify({
                    'predictions': [
                        {'emotion': 'unknown', 'probability': 1.0}
                    ],
                    'warning': f'Error in prediction processing: {str(process_error)}'
                })
            
        except Exception as predict_error:
            return jsonify({'error': f'Error analysing text: {str(predict_error)}'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500

def detect_audio_emotion():
    try:
        # generate a unique request identifier by encoding random bytes in base64
        request_id = base64.b64encode(os.urandom(6)).decode('ascii')

        if audio_model is None or audio_extractor is None:
            return jsonify({
                'error': 'Audio emotion detection model not loaded',
                'details': 'Run python download_models.py to download all required models.'
            }), 503
        
        if 'audio' not in request.files and 'audio' not in request.json:
            return jsonify({'error': 'No audio provided'}), 400
        
        # create a temporary directory for audio files, for processing only
        temp_dir = os.path.join("debug", "audio_temp")
        os.makedirs(temp_dir, exist_ok=True)
        
        try:
            audio_path = None
            
            if 'audio' in request.files:
                file = request.files['audio']
                file_ext = os.path.splitext(file.filename)[1].lower()
                
                audio_path = os.path.join(temp_dir, f"audio_{request_id}_{secure_filename(file.filename)}")
                file.save(audio_path)
                
                if file_ext == '.webm':
                    try:
                        wav_path = os.path.join(temp_dir, f"audio_{request_id}_converted.wav")
                        
                        if os.path.exists(wav_path) and os.path.getsize(wav_path) > 0:
                            audio_path = wav_path
                    except Exception as conv_error:
                        print(f"[{request_id}] Could not convert WebM using ffmpeg: {str(conv_error)}")
                
            elif 'audio' in request.json:
                base64_data = request.json['audio']
                if ',' in base64_data:
                    base64_data = base64_data.split(',', 1)[1]
                
                audio_data = base64.b64decode(base64_data)
                
                audio_path = os.path.join(temp_dir, f"audio_{request_id}.wav")
                with open(audio_path, "wb") as f:
                    f.write(audio_data) # write the audio data to the file
            
            try:
                audio, rate = librosa.load(audio_path, sr=16000, mono=True) # load the audio file with the correct sample rate and mono
            except Exception as load_error:
                try:
                    audio, rate = librosa.load(audio_path, sr=16000, mono=True, offset=0.0, duration=5.0)
                except Exception as fallback_error:
                    try:
                        audio_data, samplerate = sf.read(audio_path) # use soundfile if the initial load fails
                        audio = audio_data.mean(axis=1) if len(audio_data.shape) > 1 else audio_data
                        rate = samplerate
                        if rate != 16000: # if the sample rate is not 16000, resample the audio
                            audio = librosa.resample(audio, orig_sr=rate, target_sr=16000)
                            rate = 16000

                    except Exception as last_error:
                        raise Exception(f"Failed to load audio file after multiple attempts. Initial error: {str(load_error)}. Fallback error: {str(fallback_error)}. Final attempt error: {str(last_error)}. Try a different audio format.")
            
            # if the audio is too short, pad it to ensure valid analysis
            if len(audio) < rate:
                print(f"[{request_id}] Audio too short ({len(audio)/rate:.2f}s), padding to ensure valid analysis")
                padding = np.zeros(rate - len(audio))
                audio = np.concatenate([audio, padding])
                
        except Exception as audio_error:
            print(f"[{request_id}] Error processing audio: {str(audio_error)}")
            print(traceback.format_exc())
            
            if audio_path and os.path.exists(audio_path):
                try:
                    os.remove(audio_path)
                except:
                    pass
                
            return jsonify({
                'error': f'Audio file cannot be processed: {str(audio_error)}',
                'details': 'Try using a different file format like WAV or MP3, or ensure the audio file is not corrupted.'
            }), 400
        
        try:
            inputs = audio_extractor(audio, sampling_rate=rate, return_tensors="pt") # process the audio
            
            # get the predictions from the model
            with torch.no_grad():
                outputs = audio_model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=-1)[0]
            
            predictions = []
            
            # iterate through the sorted indices to get the emotions and their probabilities
            for idx, prob in enumerate(probabilities):
                if idx in audio_model.config.id2label:
                    emotion_name = audio_model.config.id2label[idx]
                    predictions.append({
                        'emotion': emotion_name,
                        'probability': float(prob)
                    })
            
            # sort the predictions by probability in descending order
            predictions = sorted(predictions, key=lambda x: x['probability'], reverse=True)
            
            if audio_path and os.path.exists(audio_path):
                os.remove(audio_path)
            
            if not predictions:
                return jsonify({'error': 'No emotions detected in this audio'}), 200
            
            return jsonify({'predictions': predictions})
            
        except Exception as predict_error:
            if audio_path and os.path.exists(audio_path):
                os.remove(audio_path)
                
            return jsonify({'error': f'Error analysing audio: {str(predict_error)}'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500

# register the endpoints for the emotion detection routes with the flask app
def register_emotion_routes(app):
    app.route('/api/detect-emotion', methods=['POST'])(detect_emotion)
    app.route('/api/detect-text-emotion', methods=['POST'])(detect_text_emotion)
    app.route('/api/detect-audio-emotion', methods=['POST'])(detect_audio_emotion)