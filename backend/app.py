# this script sets up a Flask web application with various routes and Firebase integration

import os
from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore # for firebase integration
from dotenv import load_dotenv # for loading the environment variables

# create the models directory if it doesn't exist
MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

# create the flask app
app = Flask(__name__)

# get the root directory (one level up from backend) as the .env file is here
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(root_dir, '.env')

# check if the environment is production
is_production = os.environ.get('ENVIRONMENT') == 'production'

# only load .env file in development
if not is_production:
    load_dotenv(env_path)
    print(f"Using local .env file")
else:
    print("Using environment variables from deployment platform")


firebase_initialised = False # flag to check if firebase is initialised

# get the firebase configuration credentials from the environment variables
try:
    firebase_config = {
        "type": "service_account",
        "project_id": os.environ.get('FIREBASE_PROJECT_ID'),
        "private_key_id": os.environ.get('FIREBASE_PRIVATE_KEY_ID'),
        "private_key": os.environ.get('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
        "client_email": os.environ.get('FIREBASE_CLIENT_EMAIL'),
        "client_id": os.environ.get('FIREBASE_CLIENT_ID'),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": os.environ.get('FIREBASE_CLIENT_CERT_URL'),
        "universe_domain": "googleapis.com"
    }

    # initialise firebase
    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialised successfully.")
        firebase_initialised = True
        db = firestore.client()
    else:
        print("Firebase Admin SDK already initialised.")
        firebase_initialised = True
        db = firestore.client()
except Exception as e:
    print(f"Error initialising Firebase Admin SDK: {e}")
    db = None

app.config['FIREBASE_INITIALISED'] = firebase_initialised

# debugging route to check if the API is running
@app.route("/", methods=["HEAD", "GET"])
def index():
    return {"status": "ok", "message": "API is running"}, 200

# set the maximum content length for larger file uploads
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# get the frontend url from the environment variable
frontend_url = os.environ.get('FRONTEND_URL')
ENV = os.environ.get('ENVIRONMENT', 'development')

# set the origins for the CORS policy
# if the environment is production, use the frontend url, otherwise use the local host
if ENV == 'production' and frontend_url:
    origins = [frontend_url]
else:
    origins = [
        "http://127.0.0.1:3000",
        "http://localhost:3000"
    ]

CORS(app, origins=origins,
methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
supports_credentials=True)

# import the routes from the other files
from routes.emotion_detection import register_emotion_routes
from routes.model_training import register_model_training_routes
from routes.datasets import register_dataset_routes
from routes.fuzzy_logic import register_fuzzy_logic_routes
from routes.progress import progress_bp

# register the routes with the app
register_emotion_routes(app)
register_model_training_routes(app)
register_dataset_routes(app)
register_fuzzy_logic_routes(app)
app.register_blueprint(progress_bp)

# get the available modules from the database for viewing in the frontend
@app.route("/api/modules", methods=["GET"])
def get_available_modules():
    if not app.config.get('FIREBASE_INITIALISED', False):
         return jsonify({"error": "Firebase not initialised, cannot fetch modules"}), 503
    
    db = firestore.client()
    try:
        modules_ref = db.collection('modules')
        docs = modules_ref.stream()
        
        available_modules = []
        for doc in docs:
            module_data = doc.to_dict()
            available_modules.append({
                "id": doc.id,
                "name": module_data.get("name", f"Module {doc.id}")
            })
        
        return jsonify(available_modules), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to retrieve module list from database"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=True)
