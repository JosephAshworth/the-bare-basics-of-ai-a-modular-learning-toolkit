# this script handles the progress of the user, including getting the module progress, setting the module completion status, updating the module time and resetting the module times

# import modules for creating routes, handling requests, and interacting with Firebase
from flask import Blueprint, request, jsonify
import firebase_admin 
from firebase_admin import firestore, auth

# create a blueprint to organise and register the progress-related routes with the Flask app
progress_bp = Blueprint('progress_bp', __name__) 

# retrieve the progress of all modules for the authenticated user
# this function checks the user's authentication token, retrieves available modules, and compiles their progress data
@progress_bp.route('/api/modules/progress', methods=['GET'])
def get_module_progress():
    try:
        # check if Firebase is initialised
        if not firebase_admin._apps:
            return jsonify({"error": "Firebase connection not ready"}), 503
        db = firestore.client()  # get the Firestore client
    except Exception as init_err:
        return jsonify({"error": "Database connection error"}), 503
    
    # get the authentication header for the request
    auth_header = request.headers.get('Authorization')
    
    try:
        # extract the ID token from the Authorization header
        id_token = ""
        if auth_header and auth_header.startswith('Bearer '):
            id_token = auth_header.split('Bearer ')[-1]
        
        if not id_token:
            return jsonify({"error": "Authorisation token required"}), 401
        
        # verify the ID token and get the user UID
        decoded_token = firebase_admin.auth.verify_id_token(id_token)
        user_uid = decoded_token['uid']

        available_modules = []
        try:
            # fetch all available modules from Firestore
            modules_ref = db.collection('modules')
            docs = modules_ref.stream()
            for doc in docs:
                module_data = doc.to_dict()
                available_modules.append({
                    "id": doc.id,
                    "name": module_data.get("name", f"Module {doc.id}")
                })
        except Exception as e_mod:
            return jsonify({"error": "Failed to retrieve module list for progress check"}), 500

        user_progress_data = {}
        try:
            # fetch the user's progress data from Firestore
            user_modules_subcollection_ref = db.collection('user_progress').document(user_uid).collection('modules')
            progress_docs = user_modules_subcollection_ref.stream()
            
            for doc in progress_docs:
                progress_doc_data = doc.to_dict()
                retrieved_time = progress_doc_data.get('timeSpent', None)
                user_progress_data[doc.id] = {
                     'completed': progress_doc_data.get('completed', False),
                     'timeSpent': int(retrieved_time) if retrieved_time is not None else 0
                 }
        except Exception as e_prog:
            return jsonify({"error": "Failed to retrieve user progress data"}), 500
        

        response_data = []
        for module in available_modules:
            module_id = module.get('id')
            if module_id:
                # compile the response data with module progress
                progress_info = user_progress_data.get(module_id, {})
                response_data.append({
                    "id": module_id,
                    "name": module.get('name'),
                    "completed": progress_info.get('completed', False),
                    "timeSpent": progress_info.get('timeSpent', 0)
                })

        return jsonify(response_data), 200

    except auth.InvalidIdTokenError as e:
        return jsonify({"error": "Invalid authorisation token"}), 401
    except auth.ExpiredIdTokenError as e:
        return jsonify({"error": "Authorisation token expired"}), 401
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred fetching progress."}), 500

# set the completion status of a module for the authenticated user
@progress_bp.route('/api/modules/<string:moduleId>/complete', methods=['POST'])
def set_module_completion(moduleId):
    db = firestore.client()
    try:
        # extract the ID token from the Authorization header
        id_token = request.headers.get('Authorization', '').split('Bearer ')[-1]
        if not id_token:
            return jsonify({"error": "Authorisation token required"}), 401

        # verify the ID token and get the user UID
        decoded_token = firebase_admin.auth.verify_id_token(id_token)
        user_uid = decoded_token['uid']

        # get the completion status from the request body
        data = request.get_json()
        if data is None or 'completed' not in data:
            return jsonify({"error": "Missing 'completed' status in request body"}), 400
        
        completed_status = bool(data['completed'])

        # update the module's completion status in Firestore
        module_doc_ref = db.collection('user_progress').document(user_uid).collection('modules').document(moduleId)
        module_doc_ref.set({
            'completed': completed_status,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }, merge=True)

        return jsonify({"success": True, "moduleId": moduleId, "completed": completed_status}), 200

    except auth.InvalidIdTokenError:
        return jsonify({"error": "Invalid authorisation token"}), 401
    except auth.ExpiredIdTokenError:
         return jsonify({"error": "Authorisation token expired"}), 401
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred setting completion status."}), 500

# update the time spent on a module for the authenticated user
@progress_bp.route('/api/modules/<string:moduleId>/update-time', methods=['POST'])
def update_module_time(moduleId):
    db = firestore.client()
    user_uid = "unknown"
    try:
        # extract the ID token from the Authorization header
        id_token = request.headers.get('Authorization', '').split('Bearer ')[-1]
        if not id_token:
            return jsonify({"error": "Authorisation token required"}), 401
        # verify the ID token and get the user UID
        decoded_token = firebase_admin.auth.verify_id_token(id_token)
        user_uid = decoded_token['uid']

        # get the number of seconds to add from the request body
        data = request.get_json()
        if data is None or 'seconds' not in data:
            return jsonify({"error": "Missing 'seconds' in request body"}), 400
        
        try:
            seconds_to_add = int(data['seconds'])
            if seconds_to_add < 0:
                 raise ValueError("Cannot add negative time")
            if seconds_to_add == 0:
                 return jsonify({"success": True, "message": "No time added."}), 200
        except (ValueError, TypeError) as e:
             return jsonify({"error": "Invalid 'seconds' value in request body"}), 400

        # update the time spent on the module in Firestore
        module_doc_ref = db.collection('user_progress').document(user_uid).collection('modules').document(moduleId)
        
        try:
            module_doc_ref.set({
                'timeSpent': firestore.Increment(seconds_to_add),
                'lastUpdatedTime': firestore.SERVER_TIMESTAMP
            }, merge=True)
        except Exception as db_error:
            return jsonify({"error": "Database error during time update."}), 500
        
        return jsonify({"success": True}), 200

    except auth.InvalidIdTokenError:
        return jsonify({"error": "Invalid authorisation token"}), 401
    except auth.ExpiredIdTokenError:
         return jsonify({"error": "Authorisation token expired"}), 401
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred updating time spent."}), 500

# reset the time spent on all modules for the authenticated user
@progress_bp.route('/api/progress/reset-times', methods=['POST'])
def reset_all_module_times():
    try:
        # get the Firestore client
        db = firestore.client()
    except Exception as init_err:
        return jsonify({"error": "Database connection error"}), 503

    try:
        # extract the ID token from the Authorization header
        id_token = request.headers.get('Authorization', '').split('Bearer ')[-1]
        if not id_token:
            return jsonify({"error": "Authorisation token required"}), 401

        # verify the ID token and get the user UID
        decoded_token = firebase_admin.auth.verify_id_token(id_token)
        user_uid = decoded_token['uid']

        # reference to the user's module progress documents
        modules_ref = db.collection('user_progress').document(user_uid).collection('modules')
        docs_stream = modules_ref.stream()

        # batch update to reset time spent to 0 for all modules
        batch = db.batch()
        doc_count = 0
        for doc in docs_stream:
             batch.update(doc.reference, {'timeSpent': 0})
             doc_count += 1

        if doc_count > 0:
            batch.commit() 
        else:
            print(f"Reset Times Endpoint: No module progress documents found to reset")

        return jsonify({"success": True, "modulesReset": doc_count}), 200

    except auth.InvalidIdTokenError as e:
        return jsonify({"error": "Invalid authorisation token"}), 401
    except auth.ExpiredIdTokenError as e:
        return jsonify({"error": "Authorisation token expired"}), 401
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred resetting module times."}), 500