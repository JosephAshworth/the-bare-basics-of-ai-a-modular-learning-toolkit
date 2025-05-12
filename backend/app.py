import os # for the os module, this is used to interact with the operating system (getting environment variables)
from flask import Flask, jsonify # for the flask module, this is used to create the flask app, and jsonify for the response object
from flask_cors import CORS # for the flask cors module, this is used to handle cross-origin requests
import firebase_admin # for the firebase admin module, this is used to authenticate the user
from firebase_admin import credentials, firestore # for the firebase admin module, this is used to interact with the firestore database
 
def load_firebase_credentials(): # for the load firebase credentials function, this is used to load the firebase credentials
    firebase_creds_json = os.environ.get('FIREBASE_CREDENTIALS_JSON') # get the firebase credentials json from the environment variable
    if firebase_creds_json: # if the firebase credentials json is not empty
        try: # try to load the firebase credentials
            cred_file_path = os.path.join(os.path.dirname(__file__), 'firebase-credentials.json') # get the path to the firebase credentials file
            with open(cred_file_path, 'w') as f: # open the firebase credentials file
                f.write(firebase_creds_json) # write the firebase credentials json to the firebase credentials file
            print("Firebase credentials loaded from environment variable and saved to file.") # print the message to the console
            return True # return true to indicate that the firebase credentials have been loaded
        except Exception as e: # if an exception occurs
            print(f"Failed to load/save Firebase credentials from environment: {str(e)}") # print the error message to the console
            return False # return false to indicate that the firebase credentials have not been loaded
    else: # if the firebase credentials json is empty
        print("FIREBASE_CREDENTIALS_JSON environment variable not set.") # print the message to the console
        return False # return false to indicate that the firebase credentials have not been loaded

MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models") # get the path to the saved models directory
os.makedirs(MODELS_DIR, exist_ok=True) # create the saved models directory if it does not exist
os.makedirs("debug", exist_ok=True) # create the debug directory if it does not exist

app = Flask(__name__) # create the flask app

load_firebase_credentials() # load the firebase credentials

cred_path = os.path.join(os.path.dirname(__file__), 'firebase-credentials.json') # get the path to the firebase credentials file
firebase_initialised = False # initialise the firebase initialised as false
if os.path.exists(cred_path): # if the firebase credentials file exists
    try: # try to initialise the firebase admin sdk
        cred = credentials.Certificate(cred_path) # get the credentials
        if not firebase_admin._apps: # if the firebase admin sdk is not initialised
            firebase_admin.initialize_app(cred) # initialise the firebase admin sdk
            print("Firebase Admin SDK initialised successfully.") # print the message to the console
            firebase_initialised = True # set the firebase initialised to true
            db = firestore.client() # get the firestore client
        else: # if the firebase admin sdk is already initialised
            print("Firebase Admin SDK already initialised (likely due to reloader).") # print the message to the console
            firebase_initialised = True # set the firebase initialised to true
            db = firestore.client() # get the firestore client
    except ValueError as e: # if a value error occurs
         print(f"Error initializing Firebase Admin SDK in app.py: {e}") # print the error message to the console
         db = None # set the db to none
    except Exception as e: # if an exception occurs
        print(f"Unexpected error initialising Firebase Admin SDK in app.py: {e}") # print the error message to the console
        db = None
else: # if the firebase credentials file does not exist
    print("Firebase credentials file not found in app.py. Firebase NOT initialised.") # print the message to the console
    db = None # set the db to none
app.config['FIREBASE_INITIALISED'] = firebase_initialised # set the firebase initialised in the app config


@app.route("/", methods=["HEAD", "GET"]) # for the index route, this is used to return the status of the api
def index(): # define the index function
    return {"status": "ok", "message": "API is running"}, 200 # return the status of the api

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # set the max content length to 16MB

frontend_url = os.environ.get('FRONTEND_URL') # get the frontend url from the environment variable on render
ENV = os.environ.get('ENVIRONMENT', 'development') # determine whether the environment is production or development, and default to development if not set

if ENV == 'production' and frontend_url: # if the environment is production and the frontend url is set
    origins = [frontend_url] # set the origins to the frontend url
else: # if the environment is not production or the frontend url is not set
    origins = [
        "http://127.0.0.1:3000", # default to local host
        "http://localhost:3000" # default to local host
    ]

CORS(app, origins=origins, # set the cors to the allowed origins
methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], # set the methods to the allowed methods
allow_headers=["Content-Type", "Authorization"], # set the allow headers, which sets the headers that are allowed to be sent to the api
supports_credentials=True) # set the supports credentials to true


from routes.emotion_detection import register_emotion_routes # for the emotion detection routes, this is used to register the emotion detection routes
from routes.model_training import register_model_training_routes # for the model training routes, this is used to register the model training routes
from routes.datasets import register_dataset_routes # for the dataset routes, this is used to register the dataset routes
from routes.fuzzy_logic import register_fuzzy_logic_routes # for the fuzzy logic routes, this is used to register the fuzzy logic routes
from routes.progress import progress_bp # for the progress routes, this is used to register the progress routes

register_emotion_routes(app) # register the emotion detection routes
register_model_training_routes(app) # register the model training routes
register_dataset_routes(app) # register the dataset routes
register_fuzzy_logic_routes(app) # register the fuzzy logic routes
app.register_blueprint(progress_bp) # register the progress routes

@app.route("/api/modules", methods=["GET"]) # for the modules route, this is used to return the modules
def get_available_modules(): # define the get_available_modules function
    if not app.config.get('FIREBASE_INITIALISED', False): # if the firebase initialised is false
         return jsonify({"error": "Firebase not initialized, cannot fetch modules"}), 503 # return the error
    
    db = firestore.client() # get the firestore client
    try:
        modules_ref = db.collection('modules') # get the modules reference  
        docs = modules_ref.stream() # get the stream of documents
        
        available_modules = [] # initialise the available modules as an empty list
        for doc in docs: # iterate through the documents
            module_data = doc.to_dict() # get the module data
            available_modules.append({
                "id": doc.id, # get the id
                "name": module_data.get("name", f"Module {doc.id}") # get the name
            })
        

        
        return jsonify(available_modules), 200 # return the available modules
        
    except Exception as e: # if an exception occurs
        return jsonify({"error": "Failed to retrieve module list from database"}), 500 # return the error




if __name__ == '__main__':  # if the file is run directly
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=True)  # run the app
