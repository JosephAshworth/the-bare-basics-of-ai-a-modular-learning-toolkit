import os
import json
import logging
import time
from flask import request, jsonify, Blueprint
from firebase_admin import auth, firestore

logger = logging.getLogger("emotion_detector")
module_routes = Blueprint('modules', __name__)

# Access Firestore database
try:
    db = firestore.client()
    modules_collection = db.collection('modules')
    progress_collection = db.collection('user_progress')
    firebase_initialized = True
except Exception as e:
    logger.error(f"Failed to initialize Firestore: {str(e)}")
    firebase_initialized = False

# Define the available modules
AVAILABLE_MODULES = [
    {"id": "welcome", "name": "Get Started", "path": "/welcome"},
    {"id": "machine-learning", "name": "Machine Learning", "path": "/machine-learning"},
    {"id": "emotion-detection", "name": "Emotion Detection", "path": "/emotion-detection"},
    {"id": "fuzzy-logic", "name": "Fuzzy Logic", "path": "/fuzzy-logic"}
]

@module_routes.route('/api/modules', methods=['GET'])
def get_modules():
    """Get all available modules"""
    try:
        return jsonify(AVAILABLE_MODULES), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@module_routes.route('/api/modules/progress', methods=['GET'])
def get_user_progress():
    """Get the module completion progress for the current user"""
    if not firebase_initialized:
        return jsonify({"error": "Firebase authentication is required. Please set up Firebase credentials."}), 503
    
    try:
        # Get the ID token from the Authorization header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid authorization header"}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Get user progress from Firestore
        progress_doc = progress_collection.document(uid).get()
        
        if not progress_doc.exists:
            # Initialize empty progress for each module
            progress = {module["id"]: {"completed": False, "completedAt": None, "timeSpent": 0} for module in AVAILABLE_MODULES}
            # Save initial progress
            progress_collection.document(uid).set({"modules": progress})
        else:
            progress_data = progress_doc.to_dict()
            progress = progress_data.get("modules", {})
            
            # Ensure all modules are in the progress data
            for module in AVAILABLE_MODULES:
                if module["id"] not in progress:
                    progress[module["id"]] = {"completed": False, "completedAt": None, "timeSpent": 0}
                # Add timeSpent field if it doesn't exist
                elif "timeSpent" not in progress[module["id"]]:
                    progress[module["id"]]["timeSpent"] = 0
            
            # Update if any new modules were added
            if len(progress) != len(progress_data.get("modules", {})):
                progress_collection.document(uid).update({"modules": progress})
        
        # Combine module info with progress data
        result = []
        for module in AVAILABLE_MODULES:
            module_progress = progress.get(module["id"], {"completed": False, "completedAt": None, "timeSpent": 0})
            result.append({
                **module,
                "completed": module_progress.get("completed", False),
                "completedAt": module_progress.get("completedAt"),
                "timeSpent": module_progress.get("timeSpent", 0)
            })
            
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error getting user progress: {str(e)}")
        return jsonify({"error": str(e)}), 500

@module_routes.route('/api/modules/<module_id>/complete', methods=['POST'])
def mark_module_complete(module_id):
    """Mark a module as completed for the current user"""
    if not firebase_initialized:
        return jsonify({"error": "Firebase authentication is required. Please set up Firebase credentials."}), 503
    
    try:
        # Check if the module exists
        valid_module = False
        for module in AVAILABLE_MODULES:
            if module["id"] == module_id:
                valid_module = True
                break
                
        if not valid_module:
            return jsonify({"error": f"Module with ID '{module_id}' not found"}), 404
            
        # Get the ID token from the Authorization header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid authorization header"}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Update the completion status
        data = request.json
        completed = data.get('completed', True)
        
        # Add server timestamp for completion
        if completed:
            timestamp = firestore.SERVER_TIMESTAMP
        else:
            timestamp = None
            
        # Update the document in Firestore
        progress_ref = progress_collection.document(uid)
        progress_ref.update({
            f"modules.{module_id}.completed": completed,
            f"modules.{module_id}.completedAt": timestamp
        })
        
        return jsonify({
            "success": True,
            "moduleId": module_id,
            "completed": completed
        }), 200
    except Exception as e:
        logger.error(f"Error marking module as complete: {str(e)}")
        return jsonify({"error": str(e)}), 500

@module_routes.route('/api/modules/<module_id>/start-timer', methods=['POST'])
def start_module_timer(module_id):
    """Start the timer for tracking how long a user spends on a module"""
    if not firebase_initialized:
        return jsonify({"error": "Firebase authentication is required. Please set up Firebase credentials."}), 503
    
    try:
        # Check if the module exists
        valid_module = False
        for module in AVAILABLE_MODULES:
            if module["id"] == module_id:
                valid_module = True
                break
                
        if not valid_module:
            return jsonify({"error": f"Module with ID '{module_id}' not found"}), 404
            
        # Get the ID token from the Authorization header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid authorization header"}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Record start time
        current_time = time.time()
        
        # Store the timer in Firestore
        progress_ref = progress_collection.document(uid)
        progress_ref.update({
            f"modules.{module_id}.timerStartedAt": current_time
        })
        
        return jsonify({
            "success": True,
            "moduleId": module_id,
            "timerStartedAt": current_time
        }), 200
    except Exception as e:
        logger.error(f"Error starting module timer: {str(e)}")
        return jsonify({"error": str(e)}), 500

@module_routes.route('/api/modules/<module_id>/stop-timer', methods=['POST'])
def stop_module_timer(module_id):
    """Stop the timer for tracking how long a user spends on a module"""
    if not firebase_initialized:
        return jsonify({"error": "Firebase authentication is required. Please set up Firebase credentials."}), 503
    
    try:
        # Check if the module exists
        valid_module = False
        for module in AVAILABLE_MODULES:
            if module["id"] == module_id:
                valid_module = True
                break
                
        if not valid_module:
            return jsonify({"error": f"Module with ID '{module_id}' not found"}), 404
            
        # Get the ID token from the Authorization header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid authorization header"}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Get the user's progress document
        progress_ref = progress_collection.document(uid)
        progress_doc = progress_ref.get()
        
        if not progress_doc.exists:
            return jsonify({"error": "User progress not found"}), 404
            
        progress_data = progress_doc.to_dict()
        modules = progress_data.get("modules", {})
        module_progress = modules.get(module_id, {})
        
        # Calculate time spent
        timer_started_at = module_progress.get("timerStartedAt")
        if not timer_started_at:
            # Timer was already stopped or never started - return success without error
            return jsonify({
                "success": True,
                "moduleId": module_id,
                "message": "Timer was already stopped"
            }), 200
            
        # Calculate elapsed time
        current_time = time.time()
        elapsed_seconds = int(current_time - timer_started_at)
        
        # Only count if significant time was spent (> 2 seconds to filter accidental clicks)
        if elapsed_seconds > 2:
            # Get current timeSpent
            current_time_spent = module_progress.get("timeSpent", 0)
            
            # Update the total time spent
            new_time_spent = current_time_spent + elapsed_seconds
            
            # Update in Firestore
            progress_ref.update({
                f"modules.{module_id}.timeSpent": new_time_spent,
                f"modules.{module_id}.timerStartedAt": None  # Clear the timer
            })
            
            return jsonify({
                "success": True,
                "moduleId": module_id,
                "elapsedTime": elapsed_seconds,
                "totalTimeSpent": new_time_spent
            }), 200
        else:
            # Just clear the timer without adding time
            progress_ref.update({
                f"modules.{module_id}.timerStartedAt": None
            })
            
            return jsonify({
                "success": True,
                "moduleId": module_id,
                "message": "Timer stopped but time was too short to record"
            }), 200
            
    except Exception as e:
        logger.error(f"Error stopping module timer: {str(e)}")
        return jsonify({"error": str(e)}), 500

@module_routes.route('/api/modules/stats', methods=['GET'])
def get_module_stats():
    """Get statistics about module completion (admin only)"""
    if not firebase_initialized:
        return jsonify({"error": "Firebase authentication is required. Please set up Firebase credentials."}), 503
    
    try:
        # Get the ID token from the Authorization header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid authorization header"}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Check if user is an admin (you might need to implement this check)
        user_doc = db.collection('users').document(uid).get()
        if not user_doc.exists or not user_doc.to_dict().get('isAdmin', False):
            return jsonify({"error": "Unauthorized access"}), 403
        
        # Get all user progress documents
        progress_docs = progress_collection.stream()
        
        # Initialize stats
        stats = {
            "totalUsers": 0,
            "moduleCompletions": {module["id"]: 0 for module in AVAILABLE_MODULES},
            "completionRates": {},
            "averageTimeSpent": {module["id"]: 0 for module in AVAILABLE_MODULES}
        }
        
        # Count completions and time spent
        total_time_spent = {module["id"]: 0 for module in AVAILABLE_MODULES}
        for doc in progress_docs:
            stats["totalUsers"] += 1
            
            progress_data = doc.to_dict()
            modules = progress_data.get("modules", {})
            
            for module_id, module_progress in modules.items():
                if module_progress.get("completed", False):
                    stats["moduleCompletions"][module_id] = stats["moduleCompletions"].get(module_id, 0) + 1
                
                # Add time spent
                time_spent = module_progress.get("timeSpent", 0)
                total_time_spent[module_id] = total_time_spent.get(module_id, 0) + time_spent
        
        # Calculate completion rates and average time spent
        if stats["totalUsers"] > 0:
            for module_id, completions in stats["moduleCompletions"].items():
                stats["completionRates"][module_id] = round(completions / stats["totalUsers"] * 100, 2)
                stats["averageTimeSpent"][module_id] = round(total_time_spent[module_id] / stats["totalUsers"], 2)
        
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Error getting module stats: {str(e)}")
        return jsonify({"error": str(e)}), 500

def register_module_routes(app):
    """Register the module routes with the Flask app"""
    app.register_blueprint(module_routes) 