import os
from transformers import AutoModelForImageClassification, AutoImageProcessor
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification

# Create the base directory
base_dir = "backend/saved_models"
os.makedirs(base_dir, exist_ok=True)

print("Starting model downloads...")

# Define model paths and URLs
models = {
    "face_emotion_model": "raihanp/image_classification2",
    "face_emotion_processor": "raihanp/image_classification2",
    "text_emotion_model": "michellejieli/emotion_text_classifier",
    "text_emotion_tokenizer": "michellejieli/emotion_text_classifier",
    "audio_emotion_model": "Hatman/audio-emotion-detection",
    "audio_emotion_extractor": "Hatman/audio-emotion-detection"
}

# Download face models
print("\nDownloading facial emotion models...")
model = AutoModelForImageClassification.from_pretrained(models["face_emotion_model"])
processor = AutoImageProcessor.from_pretrained(models["face_emotion_processor"])
model_dir = os.path.join(base_dir, "face_emotion_model")
processor_dir = os.path.join(base_dir, "face_emotion_processor")
os.makedirs(model_dir, exist_ok=True)
os.makedirs(processor_dir, exist_ok=True)
model.save_pretrained(model_dir)
processor.save_pretrained(processor_dir)
print("✓ Facial emotion models downloaded")

# Download text models
print("\nDownloading text emotion models...")
text_model = AutoModelForSequenceClassification.from_pretrained(models["text_emotion_model"])
text_tokenizer = AutoTokenizer.from_pretrained(models["text_emotion_tokenizer"])
text_model_dir = os.path.join(base_dir, "text_emotion_model")
text_tokenizer_dir = os.path.join(base_dir, "text_emotion_tokenizer")
os.makedirs(text_model_dir, exist_ok=True)
os.makedirs(text_tokenizer_dir, exist_ok=True)
text_model.save_pretrained(text_model_dir)
text_tokenizer.save_pretrained(text_tokenizer_dir)
print("✓ Text emotion models downloaded")

# Download audio models
print("\nDownloading audio emotion models...")
audio_model = AutoModelForAudioClassification.from_pretrained(models["audio_emotion_model"])
audio_extractor = AutoFeatureExtractor.from_pretrained(models["audio_emotion_extractor"])
audio_model_dir = os.path.join(base_dir, "audio_emotion_model")
audio_extractor_dir = os.path.join(base_dir, "audio_emotion_extractor")
os.makedirs(audio_model_dir, exist_ok=True)
os.makedirs(audio_extractor_dir, exist_ok=True)
audio_model.save_pretrained(audio_model_dir)
audio_extractor.save_pretrained(audio_extractor_dir)
print("✓ Audio emotion models downloaded")

print("\n✅ All models downloaded successfully!")
print(f"Models saved to: {os.path.abspath(base_dir)}") 