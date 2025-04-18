import os
import logging
import sys
from flask import Flask, request
from flask_cors import CORS
import datetime
from firebase_admin import firestore
import traceback
import json

# Create app directory structure
MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs("debug", exist_ok=True)

# Initialize Flask app
app = Flask(__name__)

@app.route("/", methods=["HEAD", "GET"])
def index():
    return {"status": "ok", "message": "Emotion Detector API is running"}, 200

# Increase the maximum content length to 16MB
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
# Enable CORS for all routes - this is more reliable than resource-specific CORS
CORS(app, origins=[
    "http://localhost:3000", 
    "http://127.0.0.1:3000", 
    "http://localhost:5173",
    # Add your Render frontend URL when deployed
    "https://emotion-detector-frontend.onrender.com",
    # Add a wildcard for all Render domains if needed
    "https://*.onrender.com"
], 
methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
allow_headers=["Content-Type", "Authorization"],
supports_credentials=True)

# Configure Flask and Werkzeug logging
import logging.config

# Load Firebase credentials from environment variable if available
def load_firebase_credentials():
    firebase_creds_json = os.environ.get('FIREBASE_CREDENTIALS_JSON')
    if firebase_creds_json:
        try:
            # Save the credentials to a file
            with open('firebase-credentials.json', 'w') as f:
                f.write(firebase_creds_json)
            logger.info("Firebase credentials loaded from environment variable")
            return True
        except Exception as e:
            logger.error(f"Failed to load Firebase credentials from environment: {str(e)}")
            return False
    return False

# Configure logging
def configure_logging():
    # Configure Flask logging
    flask_logger = logging.getLogger('flask')
    flask_logger.setLevel(logging.ERROR)  # Only show flask errors
    
    # Configure Werkzeug logging (this handles the request logs)
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.setLevel(logging.INFO)  # Show request info
    
    # Configure our app logging
    app_logger = logging.getLogger("emotion_detector")
    app_logger.setLevel(logging.INFO)
    
    # Create file handler with detailed logs for the file
    file_handler = logging.FileHandler("emotion_detector.log")
    file_handler.setLevel(logging.DEBUG)
    file_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(file_format)
    app_logger.addHandler(file_handler)
    
    # Create console handler with less verbose output
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_format = logging.Formatter('%(levelname)s: %(message)s')
    console_handler.setFormatter(console_format)
    app_logger.addHandler(console_handler)
    
    return app_logger

# Set up logging
logger = configure_logging()

# Import all routes
from routes.emotion_detection import register_emotion_routes
from routes.model_training import register_model_training_routes
from routes.datasets import register_dataset_routes
from routes.fuzzy_logic import register_fuzzy_logic_routes
from routes.auth import register_auth_routes, firebase_initialized, db
from routes.modules import register_module_routes, module_routes, AVAILABLE_MODULES

# Register all routes with the app
register_emotion_routes(app)
register_model_training_routes(app)
register_dataset_routes(app)
register_fuzzy_logic_routes(app)
register_auth_routes(app)
register_module_routes(app)

# Add debug route to check all registered routes
@app.route("/debug/routes", methods=["GET"])
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "path": str(rule)
        })
    return {"routes": routes}, 200

# Firebase status endpoint
@app.route("/firebase_status", methods=["GET"])
def firebase_status():
    return {
        "firebase_initialized": firebase_initialized,
        "status": "Firebase is required for authentication and user data storage."
    }, 200

# Add comprehensive database health check endpoint
@app.route("/api/system/health/database", methods=["GET"])
def database_health_check():
    """Check the health of database connections."""
    try:
        from routes.auth import firebase_initialized
        health_status = {
            "firebase_initialized": firebase_initialized,
            "status": "OK" if firebase_initialized else "Firebase not initialized",
            "timestamp": str(datetime.datetime.now()),
            "details": {},
            "collections": []
        }
        
        if firebase_initialized:
            try:
                # Import database only if Firebase is initialized
                from routes.auth import db
                
                # Attempt to read from Firestore
                test_ref = db.collection('_health_check').document('test')
                test_ref.set({"timestamp": firestore.SERVER_TIMESTAMP})
                test_doc = test_ref.get()
                
                health_status["details"]["firestore_read"] = "OK"
                health_status["details"]["firestore_write"] = "OK"
                
                # Cleanup test document
                test_ref.delete()
                health_status["details"]["firestore_delete"] = "OK"
                
                # Check specific collections
                collections_to_check = ['users', 'user_progress', 'modules']
                for collection_name in collections_to_check:
                    try:
                        collection = db.collection(collection_name)
                        # Get only up to 5 documents to avoid large data loads
                        docs = collection.limit(5).get()
                        doc_count = len(list(docs))
                        
                        collection_status = {
                            "name": collection_name,
                            "status": "OK",
                            "document_sample_size": doc_count
                        }
                        
                        health_status["collections"].append(collection_status)
                    except Exception as coll_error:
                        collection_status = {
                            "name": collection_name,
                            "status": "Error",
                            "error": str(coll_error)
                        }
                        health_status["collections"].append(collection_status)
                
                # Check user_progress collection in more detail
                try:
                    # Create a test user progress document if not testing with actual user
                    test_user_id = request.args.get('test_user_id', '_test_user_health_check')
                    test_progress_ref = db.collection('user_progress').document(test_user_id)
                    
                    if test_user_id.startswith('_test'):
                        # This is a test user, create a test progress document
                        logger.info(f"Creating test progress document for health check")
                        test_progress_ref.set({
                            "modules": {
                                "test-module": {
                                    "completed": False,
                                    "completedAt": None,
                                    "timeSpent": 0
                                }
                            },
                            "test": True,
                            "timestamp": firestore.SERVER_TIMESTAMP
                        })
                        
                        # Verify it was created
                        test_doc = test_progress_ref.get()
                        if test_doc.exists:
                            health_status["details"]["user_progress_test"] = "OK"
                        else:
                            health_status["details"]["user_progress_test"] = "Failed to verify test document"
                        
                        # Clean up test document
                        test_progress_ref.delete()
                    else:
                        # Check an actual user's progress
                        doc = test_progress_ref.get()
                        if doc.exists:
                            health_status["details"]["user_progress_read"] = "OK"
                            health_status["details"]["user_progress_data_format"] = "modules" in doc.to_dict()
                        else:
                            health_status["details"]["user_progress_read"] = "User document not found"
                except Exception as progress_error:
                    health_status["details"]["user_progress_test"] = f"Error: {str(progress_error)}"
                
            except Exception as e:
                health_status["status"] = "Firebase connection error"
                health_status["details"]["error"] = str(e)
                logger.error(f"Firebase health check failed: {str(e)}")
                logger.error(traceback.format_exc())
        
        return health_status, 200
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "status": "Error", 
            "error": str(e),
            "timestamp": str(datetime.datetime.now())
        }, 500

# Test endpoint for module status
@app.route("/api/test/modules", methods=["GET"])
def test_modules():
    """Simple test endpoint that returns module data without requiring authentication"""
    
    modules = []
    for module in AVAILABLE_MODULES:
        modules.append({
            **module,
            "completed": False,
            "completedAt": None,
            "timeSpent": 0
        })
        
    return {
        "modules": modules,
        "firebase_initialized": firebase_initialized,
        "message": "This is test data and doesn't reflect actual progress."
    }, 200

# Simple test endpoint for module completion
@app.route("/api/complete-module-simple/<module_id>", methods=["POST"])
def complete_module_simple(module_id):
    try:
        logger.info(f"Simple module completion endpoint called for module: {module_id}")
        # Just return success without complex Firebase handling
        return {
            "success": True,
            "message": f"Module {module_id} marked as complete (test endpoint)",
            "moduleId": module_id
        }, 200
    except Exception as e:
        logger.error(f"Error in simple module completion: {str(e)}")
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True, host='0.0.0.0', port=5000) 