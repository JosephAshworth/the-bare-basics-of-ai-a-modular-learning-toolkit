# this script handles the downloading of the models from huggingface, ready for use in the application

import os
import sys
from transformers import AutoModelForImageClassification, AutoImageProcessor
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification

# sets up the correct folder path whether we're running locally or on a server
if os.environ.get('RENDER'):
    base_dir = "/opt/render/project/src/backend/saved_models"
else:
    script_dir = os.path.dirname(__file__)
    backend_dir = os.path.dirname(script_dir)
    base_dir = os.path.join(backend_dir, "saved_models")
    
os.makedirs(base_dir, exist_ok=True)

print("Starting model downloads...")

# dictionary of model names and their locations on huggingface
models = {
    "face_emotion_model": "Rajaram1996/FacialEmoRecog",
    "face_emotion_processor": "Rajaram1996/FacialEmoRecog",
    "text_emotion_model": "michellejieli/emotion_text_classifier",
    "text_emotion_tokenizer": "michellejieli/emotion_text_classifier",
    "audio_emotion_model": "Hatman/audio-emotion-detection",
    "audio_emotion_extractor": "Hatman/audio-emotion-detection"
}

try:
    print("\nDownloading facial emotion models...")
    # downloads and saves the model that can recognise emotions in faces
    model = AutoModelForImageClassification.from_pretrained(models["face_emotion_model"])
    processor = AutoImageProcessor.from_pretrained(models["face_emotion_processor"])
    model_dir = os.path.join(base_dir, "face_emotion_model")
    processor_dir = os.path.join(base_dir, "face_emotion_processor")
    os.makedirs(model_dir, exist_ok=True)
    os.makedirs(processor_dir, exist_ok=True)
    model.save_pretrained(model_dir)
    processor.save_pretrained(processor_dir)
    print("Facial emotion models downloaded")

    print("\nDownloading text emotion models...")
    # downloads and saves the model that can recognise emotions in text
    text_model = AutoModelForSequenceClassification.from_pretrained(models["text_emotion_model"])
    text_tokenizer = AutoTokenizer.from_pretrained(models["text_emotion_tokenizer"])
    text_model_dir = os.path.join(base_dir, "text_emotion_model")
    text_tokenizer_dir = os.path.join(base_dir, "text_emotion_tokenizer")
    os.makedirs(text_model_dir, exist_ok=True)
    os.makedirs(text_tokenizer_dir, exist_ok=True)
    text_model.save_pretrained(text_model_dir)
    text_tokenizer.save_pretrained(text_tokenizer_dir)
    print("Text emotion models downloaded")

    print("\nDownloading audio emotion models...")
    # downloads and saves the model that can recognise emotions in audio
    audio_model = AutoModelForAudioClassification.from_pretrained(models["audio_emotion_model"])
    audio_extractor = AutoFeatureExtractor.from_pretrained(models["audio_emotion_extractor"])
    audio_model_dir = os.path.join(base_dir, "audio_emotion_model")
    audio_extractor_dir = os.path.join(base_dir, "audio_emotion_extractor")
    os.makedirs(audio_model_dir, exist_ok=True)
    os.makedirs(audio_extractor_dir, exist_ok=True)
    audio_model.save_pretrained(audio_model_dir)
    audio_extractor.save_pretrained(audio_extractor_dir)
    print("Audio emotion models downloaded")

    print("\nAll models downloaded successfully!")
    print(f"Models saved to: {os.path.abspath(base_dir)}")
    
except Exception as e:
    print(f"Error downloading models: {e}", file=sys.stderr)
    sys.exit(1)