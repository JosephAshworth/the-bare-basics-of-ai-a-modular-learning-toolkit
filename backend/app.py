# this script sets up a Flask web application with various routes and Firebase integration

import os
from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore # for firebase integration

# load the firebase credentials from the environment variable, if deployed
def load_firebase_credentials():
    firebase_creds_json = os.environ.get('FIREBASE_CREDENTIALS_JSON')
    if firebase_creds_json:
        try:
            cred_file_path = os.path.join(os.path.dirname(__file__), 'firebase-credentials.json')
            with open(cred_file_path, 'w') as f:
                f.write(firebase_creds_json)
            print("Firebase credentials loaded from environment variable and saved to file.")
            return True
        except Exception as e:
            print(f"Failed to load or save Firebase credentials from environment: {str(e)}")
            return False
    else:
        print("FIREBASE_CREDENTIALS_JSON environment variable not set.")
        return False

# create the models directory if it doesn't exist
MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs("debug", exist_ok=True)

# create the flask app
app = Flask(__name__)

# load the firebase credentials
load_firebase_credentials()

# check if the firebase credentials file exists (when running locally)
cred_path = os.path.join(os.path.dirname(__file__), 'firebase-credentials.json')
firebase_initialised = False # flag to check if firebase is initialised

# if the credentials file exists, initialise firebase
if os.path.exists(cred_path):
    try:
        cred = credentials.Certificate(cred_path)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialised successfully.")
            firebase_initialised = True
            db = firestore.client()
        else:
            print("Firebase Admin SDK already initialised (likely due to reloader).")
            firebase_initialised = True
            db = firestore.client()
    except ValueError as e:
         print(f"Error initializing Firebase Admin SDK in app.py: {e}")
         db = None
    except Exception as e:
        print(f"Unexpected error initialising Firebase Admin SDK in app.py: {e}")
        db = None
else:
    print("Firebase credentials file not found in app.py. Firebase NOT initialised.")
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

# set the origins for the CORS policy, if the environment is production, use the frontend url, otherwise use the local host
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