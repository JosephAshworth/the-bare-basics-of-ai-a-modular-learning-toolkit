import os
import io
import base64
import traceback
import logging
from flask import request, jsonify, make_response
from werkzeug.utils import secure_filename
from PIL import Image
import librosa
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification

# Get logger
logger = logging.getLogger("emotion_detector")

# Model paths
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "saved_models")
FACE_MODEL_DIR = os.path.join(MODELS_DIR, "face_emotion_model")
FACE_PROCESSOR_DIR = os.path.join(MODELS_DIR, "face_emotion_processor")
TEXT_MODEL_DIR = os.path.join(MODELS_DIR, "text_emotion_model")
TEXT_TOKENIZER_DIR = os.path.join(MODELS_DIR, "text_emotion_tokenizer")
AUDIO_MODEL_DIR = os.path.join(MODELS_DIR, "audio_emotion_model")
AUDIO_EXTRACTOR_DIR = os.path.join(MODELS_DIR, "audio_emotion_extractor")

# Global variables for models
processor = None
model = None
text_tokenizer = None
text_model = None
audio_extractor = None
audio_model = None

# Helper function to add CORS headers to all responses
def add_cors_headers(response):
    """Add CORS headers to the response"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

def load_models():
    """Load all emotion detection models"""
    global processor, model, text_tokenizer, text_model, audio_extractor, audio_model
    
    try:
        # Load face emotion detection model
        logger.info("Loading facial emotion detection model...")
        if os.path.exists(FACE_MODEL_DIR) and os.path.exists(FACE_PROCESSOR_DIR):
            logger.info("Loading face emotion model from local files...")
            processor = AutoImageProcessor.from_pretrained(FACE_PROCESSOR_DIR, local_files_only=True)
            model = AutoModelForImageClassification.from_pretrained(FACE_MODEL_DIR, local_files_only=True)
            logger.info("Face emotion model loaded from local files")
        else:
            error_msg = f"Face emotion model not found in {FACE_MODEL_DIR}. Please run download_models.py first."
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        # Print model information
        logger.info("Model loaded successfully")
        logger.info(f"Emotion labels: {model.config.id2label}")
        logger.info(f"PyTorch version: {torch.__version__}")
        logger.info(f"CUDA available: {torch.cuda.is_available()}")
        
        # Load text emotion detection model
        logger.info("Loading text emotion detection model...")
        if os.path.exists(TEXT_MODEL_DIR) and os.path.exists(TEXT_TOKENIZER_DIR):
            logger.info("Loading text emotion model from local files...")
            text_tokenizer = AutoTokenizer.from_pretrained(TEXT_TOKENIZER_DIR, local_files_only=True)
            text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_DIR, local_files_only=True)
            logger.info("Text emotion model loaded from local files")
        else:
            error_msg = f"Text emotion model not found in {TEXT_MODEL_DIR}. Please run download_models.py first."
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)
        
        logger.info("Text emotion model loaded successfully")
        logger.info(f"Text emotion labels: {text_model.config.id2label}")
        
        # Load audio emotion detection model
        logger.info("Loading audio emotion detection model...")
        try:
            if os.path.exists(AUDIO_MODEL_DIR) and os.path.exists(AUDIO_EXTRACTOR_DIR):
                logger.info("Loading audio emotion model from local files...")
                audio_extractor = AutoFeatureExtractor.from_pretrained(AUDIO_EXTRACTOR_DIR, local_files_only=True)
                audio_model = AutoModelForAudioClassification.from_pretrained(AUDIO_MODEL_DIR, local_files_only=True)
                logger.info("Audio emotion model loaded from local files")
            else:
                warning_msg = f"Audio emotion model not found in {AUDIO_MODEL_DIR}. Audio emotion detection will be disabled."
                logger.warning(warning_msg)
                audio_model = None
                audio_extractor = None
        except Exception as audio_error:
            logger.error(f"Error loading audio emotion model: {str(audio_error)}")
            logger.error(traceback.format_exc())
            audio_model = None
            audio_extractor = None
        
        if audio_model is not None:
            logger.info("Audio emotion model loaded successfully")
            logger.info(f"Audio emotion labels: {audio_model.config.id2label if hasattr(audio_model.config, 'id2label') else 'Not available'}")
        else:
            logger.warning("Audio emotion detection will be disabled due to model loading error")
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        logger.error(traceback.format_exc())
        raise

# Load models when module is imported
load_models()

def detect_emotion():
    """Detect emotions in a face image"""
    # Handle OPTIONS requests for CORS preflight
    if request.method == 'OPTIONS':
        response = make_response()
        return add_cors_headers(response)
        
    try:
        request_id = base64.b64encode(os.urandom(6)).decode('ascii')  # Generate a unique ID for this request
        logger.info(f"[{request_id}] Starting emotion detection")
        
        # Get the image from request
        if 'image' not in request.files and 'image' not in request.json:
            logger.warning(f"[{request_id}] No image provided in request")
            response = jsonify({'error': 'No image provided'})
            return add_cors_headers(response), 400
        
        # Handle both file upload and base64 encoded image
        try:
            if 'image' in request.files:
                file = request.files['image']
                logger.info(f"[{request_id}] Processing uploaded file: {file.filename}")
                image = Image.open(file.stream)
            else:
                logger.info(f"[{request_id}] Processing base64 image")
                # Get the base64 string
                base64_data = request.json['image']
                if ',' in base64_data:
                    # Split off the data URL prefix if present
                    base64_data = base64_data.split(',', 1)[1]
                
                # Decode base64 image
                img_data = base64.b64decode(base64_data)
                image = Image.open(io.BytesIO(img_data))
            
            logger.info(f"[{request_id}] Image format: {image.format}, Size: {image.size}, Mode: {image.mode}")
            
            # Ensure image is valid and convert to RGB if needed
            if image.mode == 'RGBA':
                logger.info(f"[{request_id}] Converting RGBA image to RGB")
                # Create a white background
                background = Image.new('RGB', image.size, (255, 255, 255))
                # Paste the image using alpha as mask
                background.paste(image, mask=image.split()[3])
                image = background
            elif image.mode != 'RGB':
                logger.info(f"[{request_id}] Converting {image.mode} image to RGB")
                image = image.convert('RGB')
            
            # Save a debug copy
            debug_path = os.path.join("debug", f"debug_image_{request_id}.jpg")
            image.save(debug_path)
            logger.info(f"[{request_id}] Saved debug image to {debug_path}")
            
        except Exception as img_error:
            logger.error(f"[{request_id}] Error processing image: {str(img_error)}")
            logger.error(traceback.format_exc())
            
            # Provide more specific error message for common image errors
            error_message = str(img_error).lower()
            if "cannot identify image file" in error_message:
                return jsonify({'error': 'The uploaded file is not a valid image. Please try a different image format (JPG, PNG, GIF, BMP, WebP).'}), 400
            elif "broken data stream" in error_message or "truncated" in error_message:
                return jsonify({'error': 'The image file appears to be corrupted. Please try uploading it again or use a different image.'}), 400
            else:
                return jsonify({'error': f'Invalid image format: {str(img_error)}'}), 400
        
        # Process the image and make prediction
        try:
            logger.info(f"[{request_id}] Processing image with model")
            inputs = processor(images=image, return_tensors="pt")
            logger.info(f"[{request_id}] Input shape: {inputs['pixel_values'].shape}")
            
            with torch.no_grad():
                outputs = model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)[0]
            
            # Log raw probabilities for debugging
            prob_values = {}
            for i, prob in enumerate(probabilities):
                # Use integer key instead of string key
                if i in model.config.id2label:
                    prob_values[model.config.id2label[i]] = float(prob)
                else:
                    logger.warning(f"[{request_id}] Label key {i} not found in model.config.id2label")
            
            logger.info(f"[{request_id}] Raw probabilities: {prob_values}")
            
            # Get predictions (all emotions with probabilities)
            predictions = []
            
            try:
                # Sort by probability
                sorted_indices = torch.argsort(probabilities, descending=True)
                
                for idx in sorted_indices:
                    idx_item = idx.item()
                    # Use integer key instead of string key
                    if idx_item in model.config.id2label:
                        emotion_name = model.config.id2label[idx_item]
                        prob = float(probabilities[idx_item])
                        predictions.append({
                            'emotion': emotion_name,
                            'probability': prob
                        })
                    else:
                        logger.warning(f"[{request_id}] Label key {idx_item} not found in id2label mapping")
                
                # Fallback if no valid labels found - use indices as labels
                if len(predictions) == 0:
                    logger.warning(f"[{request_id}] No valid labels found, using indices as labels")
                    
                    # Create predictions using indices
                    emotions = ["happy", "sad", "angry", "fear", "disgust", "surprise", "neutral"]
                    for i, prob in enumerate(probabilities):
                        if i < len(emotions):
                            predictions.append({
                                'emotion': emotions[i],
                                'probability': float(prob)
                            })
                
                # Sort predictions by probability (highest first)
                predictions = sorted(predictions, key=lambda x: x['probability'], reverse=True)
                
                logger.info(f"[{request_id}] Found {len(predictions)} valid predictions")
                logger.info(f"[{request_id}] Model id2label mapping: {model.config.id2label}")
                
                if not predictions:
                    logger.warning(f"[{request_id}] No emotions detected")
                    return jsonify({'error': 'No emotions detected in this image'}), 200
                
                # Get dominant emotion
                dominant_emotion = predictions[0]['emotion']
                
                # Return results
                result = {
                    'predictions': predictions,
                    'dominant_emotion': dominant_emotion,
                    'request_id': request_id
                }
                
                logger.info(f"[{request_id}] Emotion detection completed successfully")
                response = jsonify(result)
                return add_cors_headers(response)
                
            except Exception as process_error:
                logger.error(f"[{request_id}] Error processing predictions: {str(process_error)}")
                logger.error(traceback.format_exc())
                
                # Emergency fallback
                return jsonify({
                    'predictions': [
                        {'emotion': 'unknown', 'probability': 1.0}
                    ],
                    'warning': 'Error in prediction processing'
                })
            
        except Exception as predict_error:
            logger.error(f"[{request_id}] Error predicting emotions: {str(predict_error)}")
            logger.error(traceback.format_exc())
            return jsonify({'error': f'Error analyzing image: {str(predict_error)}'}), 500
        
    except Exception as e:
        logger.error(f"[{request_id if 'request_id' in locals() else 'unknown'}] Unhandled error in emotion detection: {str(e)}")
        logger.error(traceback.format_exc())
        response = jsonify({'error': f'Detection failed: {str(e)}'})
        return add_cors_headers(response), 500

def detect_text_emotion():
    """Detect emotions in text"""
    # Handle OPTIONS requests for CORS preflight
    if request.method == 'OPTIONS':
        response = make_response()
        return add_cors_headers(response)
        
    try:
        request_id = base64.b64encode(os.urandom(6)).decode('ascii')  # Generate a unique ID for this request
        logger.info(f"[{request_id}] Starting text emotion detection")
        
        # Get the text from request
        if 'text' not in request.json:
            logger.warning(f"[{request_id}] No text provided in request")
            return jsonify({'error': 'No text provided'}), 400
        
        text = request.json['text']
        logger.info(f"[{request_id}] Processing text: {text[:100]}...")  # Log first 100 chars
        
        # Process the text and make prediction
        try:
            logger.info(f"[{request_id}] Processing text with model")
            inputs = text_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            
            with torch.no_grad():
                outputs = text_model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)[0]
            
            # Log raw probabilities for debugging
            prob_values = {}
            for i, prob in enumerate(probabilities):
                if i in text_model.config.id2label:
                    prob_values[text_model.config.id2label[i]] = float(prob)
                else:
                    logger.warning(f"[{request_id}] Label key {i} not found in text_model.config.id2label")
            
            logger.info(f"[{request_id}] Raw probabilities: {prob_values}")
            
            # Get predictions (all emotions with probabilities)
            predictions = []
            
            try:
                # Sort by probability
                sorted_indices = torch.argsort(probabilities, descending=True)
                
                for idx in sorted_indices:
                    idx_item = idx.item()
                    # Use integer key instead of string key
                    if idx_item in text_model.config.id2label:
                        emotion_name = text_model.config.id2label[idx_item]
                        prob = float(probabilities[idx_item])
                        predictions.append({
                            'emotion': emotion_name,
                            'probability': prob
                        })
                    else:
                        logger.warning(f"[{request_id}] Label key {idx_item} not found in id2label mapping")
                
                # Sort predictions by probability (highest first)
                predictions = sorted(predictions, key=lambda x: x['probability'], reverse=True)
                
                logger.info(f"[{request_id}] Found {len(predictions)} valid predictions")
                
                if not predictions:
                    logger.warning(f"[{request_id}] No emotions detected")
                    return jsonify({'error': 'No emotions detected in this text'}), 200
                
                # Get dominant emotion
                dominant_emotion = predictions[0]['emotion']
                
                # Return results
                result = {
                    'predictions': predictions,
                    'dominant_emotion': dominant_emotion,
                    'request_id': request_id
                }
                
                logger.info("Text emotion detection completed successfully")
                response = jsonify(result)
                return add_cors_headers(response)
                
            except Exception as process_error:
                logger.error(f"[{request_id}] Error processing predictions: {str(process_error)}")
                logger.error(traceback.format_exc())
                
                # Emergency fallback
                return jsonify({
                    'predictions': [
                        {'emotion': 'unknown', 'probability': 1.0}
                    ],
                    'warning': 'Error in prediction processing'
                })
            
        except Exception as predict_error:
            logger.error(f"[{request_id}] Error predicting text emotions: {str(predict_error)}")
            logger.error(traceback.format_exc())
            return jsonify({'error': f'Error analyzing text: {str(predict_error)}'}), 500
        
    except Exception as e:
        logger.error(f"Unhandled error in text emotion detection: {str(e)}")
        logger.error(traceback.format_exc())
        response = jsonify({'error': f'Detection failed: {str(e)}'})
        return add_cors_headers(response), 500

def detect_audio_emotion():
    """Detect emotions in audio"""
    # Handle OPTIONS requests for CORS preflight
    if request.method == 'OPTIONS':
        response = make_response()
        return add_cors_headers(response)
        
    try:
        request_id = base64.b64encode(os.urandom(6)).decode('ascii')  # Generate a unique ID for this request
        logger.info(f"[{request_id}] Starting audio emotion detection")
        
        # Check if audio model is available
        if audio_model is None or audio_extractor is None:
            logger.warning(f"[{request_id}] Audio emotion model is not available")
            return jsonify({
                'error': 'Audio emotion detection is not available. Please make sure the model is downloaded.',
                'details': 'Run python download_models.py to download all required models.'
            }), 503  # Service Unavailable
        
        # Get the audio file from request
        if 'audio' not in request.files and 'audio' not in request.json:
            logger.warning(f"[{request_id}] No audio provided in request")
            return jsonify({'error': 'No audio provided'}), 400
        
        # Create temp directory to save audio file if needed
        temp_dir = os.path.join("debug", "audio_temp")
        os.makedirs(temp_dir, exist_ok=True)
        
        # Handle both file upload and base64 encoded audio
        try:
            audio_path = None
            
            if 'audio' in request.files:
                file = request.files['audio']
                logger.info(f"[{request_id}] Processing uploaded audio file: {file.filename}")
                
                # Save the file to a temporary location
                audio_path = os.path.join(temp_dir, f"audio_{request_id}_{secure_filename(file.filename)}")
                file.save(audio_path)
                
            elif 'audio' in request.json:
                logger.info(f"[{request_id}] Processing base64 audio")
                # Get the base64 string
                base64_data = request.json['audio']
                if ',' in base64_data:
                    # Split off the data URL prefix if present
                    base64_data = base64_data.split(',', 1)[1]
                
                # Decode base64 audio
                audio_data = base64.b64decode(base64_data)
                
                # Save to temporary file
                audio_path = os.path.join(temp_dir, f"audio_{request_id}.wav")
                with open(audio_path, "wb") as f:
                    f.write(audio_data)
                
                logger.info(f"[{request_id}] Saved audio to {audio_path}")
            
            # Process the audio file
            logger.info(f"[{request_id}] Loading audio from {audio_path}")
            audio, rate = librosa.load(audio_path, sr=16000)
            
            logger.info(f"[{request_id}] Audio loaded: {len(audio)} samples, rate: {rate}Hz")
            
        except Exception as audio_error:
            logger.error(f"[{request_id}] Error processing audio: {str(audio_error)}")
            logger.error(traceback.format_exc())
            return jsonify({'error': f'Invalid audio format: {str(audio_error)}'}), 400
        
        # Process the audio and make prediction
        try:
            logger.info(f"[{request_id}] Processing audio with model")
            inputs = audio_extractor(audio, sampling_rate=rate, return_tensors="pt")
            
            with torch.no_grad():
                outputs = audio_model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=-1)[0]
            
            # Convert model output to predictions
            predictions = []
            
            # Directly use the model's id2label mapping
            for idx, prob in enumerate(probabilities):
                if idx in audio_model.config.id2label:
                    emotion_name = audio_model.config.id2label[idx]
                    predictions.append({
                        'emotion': emotion_name,
                        'probability': float(prob)
                    })
            
            # Sort predictions by probability (highest first)
            predictions = sorted(predictions, key=lambda x: x['probability'], reverse=True)
            
            logger.info(f"[{request_id}] Found {len(predictions)} valid predictions")
            
            # Clean up temporary file
            if audio_path and os.path.exists(audio_path):
                os.remove(audio_path)
                logger.info(f"[{request_id}] Removed temporary audio file")
            
            if not predictions:
                logger.warning(f"[{request_id}] No emotions detected")
                return jsonify({'error': 'No emotions detected in this audio'}), 200
            
            # Get dominant emotion
            dominant_emotion = predictions[0]['emotion']
            
            # Return results
            result = {
                'predictions': predictions,
                'dominant_emotion': dominant_emotion,
                'request_id': request_id
            }
            
            logger.info("Audio emotion detection completed successfully")
            response = jsonify(result)
            return add_cors_headers(response)
            
        except Exception as predict_error:
            logger.error(f"[{request_id}] Error predicting audio emotions: {str(predict_error)}")
            logger.error(traceback.format_exc())
            
            # Clean up temporary file
            if audio_path and os.path.exists(audio_path):
                os.remove(audio_path)
                
            return jsonify({'error': f'Error analyzing audio: {str(predict_error)}'}), 500
        
    except Exception as e:
        logger.error(f"Unhandled error in audio emotion detection: {str(e)}")
        logger.error(traceback.format_exc())
        response = jsonify({'error': f'Detection failed: {str(e)}'})
        return add_cors_headers(response), 500

def register_emotion_routes(app):
    """Register all emotion detection routes with the app"""
    app.route('/api/detect-emotion', methods=['POST', 'OPTIONS'])(detect_emotion)
    app.route('/api/detect-text-emotion', methods=['POST', 'OPTIONS'])(detect_text_emotion)
    app.route('/api/detect-audio-emotion', methods=['POST', 'OPTIONS'])(detect_audio_emotion) 