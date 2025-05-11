import os # for file operations
import sys # for system operations
from transformers import AutoModelForImageClassification, AutoImageProcessor # for image classification
from transformers import AutoTokenizer, AutoModelForSequenceClassification # for text classification
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification # for audio classification


if os.environ.get('RENDER'): # if the environment is deployed on render
    base_dir = "/opt/render/project/src/backend/saved_models" # set the base directory to the saved models directory
else: # if the environment is not deployed on render
    script_dir = os.path.dirname(__file__) # get the directory of the current script
    backend_dir = os.path.dirname(script_dir) # get the parent directory (backend)
    base_dir = os.path.join(backend_dir, "saved_models") # set the base directory to the saved models directory
    
os.makedirs(base_dir, exist_ok=True) # create the base directory if it doesn't exist

print("Starting model downloads...") # print a message to the console


models = {
    "face_emotion_model": "Rajaram1996/FacialEmoRecog", # the model for facial emotion recognition
    "face_emotion_processor": "Rajaram1996/FacialEmoRecog", # the processor for facial emotion recognition
    "text_emotion_model": "michellejieli/emotion_text_classifier", # the model for text emotion recognition
    "text_emotion_tokenizer": "michellejieli/emotion_text_classifier", # the tokenizer for text emotion recognition
    "audio_emotion_model": "Hatman/audio-emotion-detection", # the model for audio emotion detection
    "audio_emotion_extractor": "Hatman/audio-emotion-detection" # the extractor for audio emotion detection
}

try: # try to download the models
    print("\nDownloading facial emotion models...") # print a message to the console
    model = AutoModelForImageClassification.from_pretrained(models["face_emotion_model"]) # download the facial emotion model
    processor = AutoImageProcessor.from_pretrained(models["face_emotion_processor"]) # download the facial emotion processor
    model_dir = os.path.join(base_dir, "face_emotion_model") # set the directory for the facial emotion model
    processor_dir = os.path.join(base_dir, "face_emotion_processor") # set the directory for the facial emotion processor
    os.makedirs(model_dir, exist_ok=True) # create the directory for the facial emotion model if it doesn't exist
    os.makedirs(processor_dir, exist_ok=True) # create the directory for the facial emotion processor if it doesn't exist
    model.save_pretrained(model_dir) # save the facial emotion model
    processor.save_pretrained(processor_dir) # save the facial emotion processor
    print("Facial emotion models downloaded") # print a message to the console


    print("\nDownloading text emotion models...") # print a message to the console
    text_model = AutoModelForSequenceClassification.from_pretrained(models["text_emotion_model"]) # download the text emotion model
    text_tokenizer = AutoTokenizer.from_pretrained(models["text_emotion_tokenizer"]) # download the text emotion tokenizer
    text_model_dir = os.path.join(base_dir, "text_emotion_model") # set the directory for the text emotion model
    text_tokenizer_dir = os.path.join(base_dir, "text_emotion_tokenizer") # set the directory for the text emotion tokenizer
    os.makedirs(text_model_dir, exist_ok=True) # create the directory for the text emotion model if it doesn't exist
    os.makedirs(text_tokenizer_dir, exist_ok=True) # create the directory for the text emotion tokenizer if it doesn't exist
    text_model.save_pretrained(text_model_dir) # save the text emotion model
    text_tokenizer.save_pretrained(text_tokenizer_dir) # save the text emotion tokenizer
    print("Text emotion models downloaded") # print a message to the console


    print("\nDownloading audio emotion models...") # print a message to the console
    audio_model = AutoModelForAudioClassification.from_pretrained(models["audio_emotion_model"]) # download the audio emotion model
    audio_extractor = AutoFeatureExtractor.from_pretrained(models["audio_emotion_extractor"]) # download the audio emotion extractor
    audio_model_dir = os.path.join(base_dir, "audio_emotion_model") # set the directory for the audio emotion model
    audio_extractor_dir = os.path.join(base_dir, "audio_emotion_extractor") # set the directory for the audio emotion extractor
    os.makedirs(audio_model_dir, exist_ok=True) # create the directory for the audio emotion model if it doesn't exist
    os.makedirs(audio_extractor_dir, exist_ok=True) # create the directory for the audio emotion extractor if it doesn't exist
    audio_model.save_pretrained(audio_model_dir) # save the audio emotion model
    audio_extractor.save_pretrained(audio_extractor_dir) # save the audio emotion extractor
    print("Audio emotion models downloaded") # print a message to the console

    print("\nAll models downloaded successfully!") # print a message to the console
    print(f"Models saved to: {os.path.abspath(base_dir)}") # print the path to the models
    
except Exception as e: # if an error occurs
    print(f"Error downloading models: {e}", file=sys.stderr) # print the error
    sys.exit(1)  # exit the program
