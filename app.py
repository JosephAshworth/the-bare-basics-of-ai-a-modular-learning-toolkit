import os
import logging
import sys
import atexit
from flask import Flask
from flask_cors import CORS

# Create app directory structure
MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs("debug", exist_ok=True)

# Initialize Flask app
app = Flask(__name__)

@app.route("/", methods=["HEAD", "GET"])
def index():
    return "", 200

# Increase the maximum content length to 16MB
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Get allowed origins from environment or default to localhost
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:3000')
allowed_origins_list = [origin.strip() for origin in allowed_origins.split(',')]

CORS(app, resources={
    r"/api/*": {
        "origins": allowed_origins_list,
        "methods": ["GET", "POST", "PUT", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configure logging
# Create file handler with DEBUG level (for detailed logs in the file)
file_handler = logging.FileHandler("emotion_detector.log")
file_handler.setLevel(logging.DEBUG)
file_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_format)

# Create console handler with a higher log level (less verbose in terminal)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.WARNING)  # Only warnings and errors to console
console_format = logging.Formatter('%(levelname)s: %(message)s')
console_handler.setFormatter(console_format)

# Configure root logger
logger = logging.getLogger("emotion_detector")
logger.setLevel(logging.DEBUG)  # Set base level to DEBUG
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Import all routes
from routes.emotion_detection import register_emotion_routes
from routes.model_training import register_model_training_routes
from routes.datasets import register_dataset_routes
from routes.fuzzy_logic import register_fuzzy_logic_routes
from routes.auth import register_auth_routes, firebase_initialized, firebase_temp_file
from routes.modules import register_module_routes

# Register all routes with the app
register_emotion_routes(app)
register_model_training_routes(app)
register_dataset_routes(app)
register_fuzzy_logic_routes(app)
register_auth_routes(app)
register_module_routes(app)

# Register cleanup function for temporary files
@atexit.register
def cleanup_temp_files():
    if firebase_temp_file and os.path.exists(firebase_temp_file.name):
        try:
            os.unlink(firebase_temp_file.name)
            print(f"Cleaned up temporary Firebase credentials file")
        except Exception as e:
            print(f"Failed to clean up temporary file: {str(e)}")

# Firebase status endpoint
@app.route("/firebase_status", methods=["GET"])
def firebase_status():
    return {
        "firebase_initialized": firebase_initialized,
        "status": "Firebase is required for authentication and user data storage."
    }, 200

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True) 