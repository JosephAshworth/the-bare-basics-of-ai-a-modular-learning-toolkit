from flask import Blueprint, request, jsonify # for importing the blurprint (for the progress routes), request for the request object, and jsonify for the response object
import firebase_admin # for the firebase admin, this is used to authenticate the user
from firebase_admin import firestore, auth # for the firestore and auth objects, this is used to interact with the firestore database   


progress_bp = Blueprint('progress_bp', __name__) # for the progress blueprint, this is used to register the progress routes with the app

@progress_bp.route('/api/modules/progress', methods=['GET']) # for the get module progress route, this is used to get the module progress of the user
def get_module_progress(): # define the get_module_progress function
    try:
         if not firebase_admin._apps: # if the firebase admin is not initialised
             print("Firebase not initialised in get_module_progress") # print the error message
             return jsonify({"error": "Firebase connection not ready"}), 503 # return the error message and 503 status code
         db = firestore.client() # get the firestore client
    except Exception as init_err: # if an error occurs
         print(f"Error getting Firestore client in get_module_progress: {init_err}") # print the error message
         return jsonify({"error": "Database connection error"}), 503 # return the error message and 503 status code
    
    auth_header = request.headers.get('Authorization') # get the authorisation header
    print(f"Progress Endpoint: Received Authorisation header: {auth_header}") # print the authorisation header
    
    try: # try to get the id token
        id_token = "" # initialise the id token as an empty string
        if auth_header and auth_header.startswith('Bearer '): # if the authorisation header is not empty and starts with 'Bearer '
            id_token = auth_header.split('Bearer ')[-1] # get the id token, which is the last element in the list after splitting the string by 'Bearer '
        
        if not id_token: # if the id token is empty
            print("Progress Endpoint: No token found in header.") # print the error message
            return jsonify({"error": "Authorisation token required"}), 401 # return the error message and 401 status code
        
        print(f"Progress Endpoint: Attempting to verify token starting with: {id_token[:15]}...") # print the id token, the first 15 characters
        
        decoded_token = firebase_admin.auth.verify_id_token(id_token) # verify the id token
        user_uid = decoded_token['uid'] # get the user id
        print(f"Progress Endpoint: Token verified for user: {user_uid}") # print the user id

        available_modules = [] # initialise the available modules as an empty list
        try: # try to get the available modules
            modules_ref = db.collection('modules') # get the modules reference
            docs = modules_ref.stream() # get the stream of documents
            for doc in docs: # iterate through the documents
                module_data = doc.to_dict() # get the module data
                available_modules.append({
                    "id": doc.id, # get the id
                    "name": module_data.get("name", f"Module {doc.id}") # get the name
                })
            print(f"Fetched {len(available_modules)} available modules for progress check.") # print the number of available modules
        except Exception as e_mod: # if an error occurs
            print(f"Error fetching available modules within progress endpoint: {e_mod}") # print the error message
            return jsonify({"error": "Failed to retrieve module list for progress check"}), 500 # return the error message and 500 status code

        user_progress_data = {} # initialise the user progress data as an empty dictionary
        try: # try to get the user progress data
            user_modules_subcollection_ref = db.collection('user_progress').document(user_uid).collection('modules') # get the user modules subcollection reference, this is the subcollection of the user progress document
            progress_docs = user_modules_subcollection_ref.stream() # get the stream of documents
            
            print(f"User {user_uid}: Iterating progress subcollection...") # print the user id and the iteration of the progress subcollection
            for doc in progress_docs: # iterate through the documents
                progress_doc_data = doc.to_dict() # get the progress document data
                retrieved_time = progress_doc_data.get('timeSpent', None) # get the time spent
                print(f"  -> Module {doc.id}: Raw doc data = {progress_doc_data}, Retrieved timeSpent = {retrieved_time}") # print the module id, the raw document data and the retrieved time spent
                user_progress_data[doc.id] = {
                     'completed': progress_doc_data.get('completed', False), # get the completed status
                     'timeSpent': int(retrieved_time) if retrieved_time is not None else 0 # get the time spent
                 }
            print(f"User {user_uid} progress subcollection data (processed): {user_progress_data}") # print the user id and the processed progress subcollection data
        except Exception as e_prog: # if an error occurs
            print(f"Error fetching progress subcollection for user {user_uid}: {e_prog}") # print the error message
            return jsonify({"error": "Failed to retrieve user progress data"}), 500 # return the error message and 500 status code
        

        response_data = [] # initialise the response data as an empty list
        for module in available_modules: # iterate through the available modules
            module_id = module.get('id') # get the module id
            if module_id: # if the module id is not None
                progress_info = user_progress_data.get(module_id, {}) # get the progress info
                response_data.append({
                    "id": module_id, # get the module id
                    "name": module.get('name'), # get the module name
                    "completed": progress_info.get('completed', False), # get the completed status
                    "timeSpent": progress_info.get('timeSpent', 0) # get the time spent
                })
            else: # if the module id is None
                 print(f"Module definition missing id: {module}") # print the error message

        print(f"Returning progress data for user {user_uid}: {len(response_data)} modules") # print the user id and the number of modules
        return jsonify(response_data), 200 # return the response data and 200 status code

    except auth.InvalidIdTokenError as e: # if an error occurs
        print(f"Progress Endpoint: Invalid Firebase ID token received: {e}") # print the error message
        return jsonify({"error": "Invalid authorisation token"}), 401 # return the error message and 401 status code
    except auth.ExpiredIdTokenError as e: # if an error occurs
        print(f"Progress Endpoint: Expired Firebase ID token received: {e}") # print the error message
        return jsonify({"error": "Authorisation token expired"}), 401 # return the error message and 401 status code
    except Exception as e: # if an error occurs
        print(f"Progress Endpoint: Error fetching progress for user {user_uid if 'user_uid' in locals() else 'unknown'}: {e}") # print the error message
        return jsonify({"error": "An unexpected error occurred fetching progress."}), 500 # return the error message and 500 status code

@progress_bp.route('/api/modules/<string:moduleId>/complete', methods=['POST']) # for the set module completion route, this is used to set the module completion status
def set_module_completion(moduleId): # define the set_module_completion function
    db = firestore.client() # get the firestore client
    try:
        id_token = request.headers.get('Authorization', '').split('Bearer ')[-1] # get the id token
        if not id_token: # if the id token is empty
            return jsonify({"error": "Authorisation token required"}), 401 # return the error message and 401 status code

        decoded_token = firebase_admin.auth.verify_id_token(id_token) # verify the id token
        user_uid = decoded_token['uid'] # get the user id
        print(f"Setting completion status for module {moduleId} for user {user_uid}") # print the module id and the user id

        data = request.get_json() # get the data
        if data is None or 'completed' not in data: # if the data is empty or the completed status is not in the data
            return jsonify({"error": "Missing 'completed' status in request body"}), 400 # return the error message and 400 status code
        
        completed_status = bool(data['completed']) # get the completed status
        print(f"Requested completed status: {completed_status}") # print the completed status

        module_doc_ref = db.collection('user_progress').document(user_uid).collection('modules').document(moduleId) # get the module document reference
        module_doc_ref.set({
            'completed': completed_status, # set the completed status
            'updatedAt': firestore.SERVER_TIMESTAMP # set the updated at time
        }, merge=True) # merge the data

        print(f"Successfully set module {moduleId} completed={completed_status} for user {user_uid}") # print the module id, the completed status and the user id
        return jsonify({"success": True, "moduleId": moduleId, "completed": completed_status}), 200 # return the success message, the module id and the completed status and 200 status code

    except auth.InvalidIdTokenError: # if an error occurs
        print("Invalid Firebase ID token received for set completion.") # print the error message
        return jsonify({"error": "Invalid authorisation token"}), 401 # return the error message and 401 status code
    except auth.ExpiredIdTokenError: # if an error occurs
         print("Expired Firebase ID token received for set completion.") # print the error message
         return jsonify({"error": "Authorisation token expired"}), 401 # return the error message and 401 status code
    except Exception as e: # if an error occurs
        print(f"Error setting module completion for user {user_uid if 'user_uid' in locals() else 'unknown'}, module {moduleId}: {e}") # print the error message
        return jsonify({"error": "An unexpected error occurred setting completion status."}), 500 # return the error message and 500 status code

@progress_bp.route('/api/modules/<string:moduleId>/update-time', methods=['POST']) # for the update module time route, this is used to update the module time
def update_module_time(moduleId): # define the update_module_time function
    db = firestore.client() # get the firestore client
    user_uid = "unknown" # initialise the user id as unknown
    try:
        id_token = request.headers.get('Authorization', '').split('Bearer ')[-1] # get the id token
        if not id_token: # if the id token is empty
            return jsonify({"error": "Authorisation token required"}), 401 # return the error message and 401 status code
        decoded_token = firebase_admin.auth.verify_id_token(id_token) # verify the id token
        user_uid = decoded_token['uid'] # get the user id
        print(f"Update Time Endpoint: Request for module {moduleId} for user {user_uid}") # print the module id and the user id

        data = request.get_json() # get the data
        if data is None or 'seconds' not in data: # if the data is empty or the seconds are not in the data
            print(f"Update Time Endpoint: Missing 'seconds' in request body for {moduleId}") # print the error message
            return jsonify({"error": "Missing 'seconds' in request body"}), 400 # return the error message and 400 status code
        
        try:
            seconds_to_add = int(data['seconds']) # get the seconds to add
            print(f"Update Time Endpoint: Received seconds_to_add = {seconds_to_add} (type: {type(seconds_to_add)}) for module {moduleId}") # print the seconds to add, the type of the seconds to add and the module id
            if seconds_to_add < 0: # if the seconds to add is less than 0
                 print(f"Update Time Endpoint: Received negative seconds_to_add: {seconds_to_add}") # print the error message
                 raise ValueError("Cannot add negative time") # raise an error
            if seconds_to_add == 0: # if the seconds to add is 0
                 print(f"Update Time Endpoint: Received 0 seconds to add for module {moduleId}, no update needed.") # print the error message
                 return jsonify({"success": True, "message": "No time added."}), 200 # return the success message, the message and 200 status code
        except (ValueError, TypeError) as e: # if an error occurs
             print(f"Update Time Endpoint: Invalid 'seconds' value: {data.get('seconds')}, Error: {e}") # print the error message
             return jsonify({"error": "Invalid 'seconds' value in request body"}), 400 # return the error message and 400 status code

        print(f"Update Time Endpoint: Attempting Firestore increment for module {moduleId} by {seconds_to_add}s") # print the module id and the seconds to add

        module_doc_ref = db.collection('user_progress').document(user_uid).collection('modules').document(moduleId) # get the module document reference
        
        try:
            print(f"Update Time Endpoint: Calling module_doc_ref.set with Increment({seconds_to_add}) for {module_doc_ref.path}") # print the module id and the seconds to add
            module_doc_ref.set({
                'timeSpent': firestore.Increment(seconds_to_add), # set the time spent to the seconds to add
                'lastUpdatedTime': firestore.SERVER_TIMESTAMP # set the last updated time to the server timestamp
            }, merge=True) # merge the data
            print(f"Update Time Endpoint: Successfully called Firestore set/increment for module {moduleId} by {seconds_to_add}s for user {user_uid}") # print the module id, the seconds to add and the user id
        except Exception as db_error: # if an error occurs
            print(f"Update Time Endpoint: DATABASE ERROR during set/increment for module {moduleId}: {db_error}") # print the error message
            return jsonify({"error": "Database error during time update."}), 500 # return the error message and 500 status code
        
        return jsonify({"success": True}), 200 # return the success message and 200 status code

    except auth.InvalidIdTokenError: # if the id token is invalid
        print(f"Update Time Endpoint: Invalid Firebase ID token received (module: {moduleId}).") # print the error message
        return jsonify({"error": "Invalid authorisation token"}), 401 # return the error message and 401 status code
    except auth.ExpiredIdTokenError: # if the id token is expired
         print(f"Update Time Endpoint: Expired Firebase ID token received (module: {moduleId}).") # print the error message
         return jsonify({"error": "Authorisation token expired"}), 401 # return the error message and 401 status code
    except Exception as e: # if an error occurs
        print(f"Update Time Endpoint: General error for user {user_uid}, module {moduleId}: {e}") # print the error message
        return jsonify({"error": "An unexpected error occurred updating time spent."}), 500 # return the error message and 500 status code

@progress_bp.route('/api/progress/reset-times', methods=['POST']) # for the reset all module times route, this is used to reset the module times
def reset_all_module_times(): # define the reset_all_module_times function
    try: # try to get the firestore client
        db = firestore.client() # get the firestore client
    except Exception as init_err: # if an error occurs
        print(f"Error getting Firestore client in reset_all_module_times: {init_err}") # print the error message
        return jsonify({"error": "Database connection error"}), 503 # return the error message and 503 status code

    try: # try to get the id token
        id_token = request.headers.get('Authorization', '').split('Bearer ')[-1] # get the id token
        if not id_token: # if the id token is empty
            print("Reset Times Endpoint: No token found.") # print the error message
            return jsonify({"error": "Authorisation token required"}), 401 # return the error message and 401 status code

        decoded_token = firebase_admin.auth.verify_id_token(id_token) # verify the id token
        user_uid = decoded_token['uid'] # get the user id
        print(f"Reset Times Endpoint: Request received for user: {user_uid}") # print the user id

        modules_ref = db.collection('user_progress').document(user_uid).collection('modules') # get the modules reference
        docs_stream = modules_ref.stream() # get the stream of documents

        batch = db.batch() # create a batch, this is used to update the time spent for the modules
        doc_count = 0 # initialise the document count as 0
        for doc in docs_stream: # iterate through the documents
             batch.update(doc.reference, {'timeSpent': 0}) # update the time spent for the module
             doc_count += 1 # increment the document count

        if doc_count > 0: # if the document count is greater than 0
            batch.commit() # commit the batch
            print(f"Reset Times Endpoint: Successfully reset timeSpent for {doc_count} modules for user {user_uid}") # print the document count and the user id
        else: # if the document count is 0
            print(f"Reset Times Endpoint: No module progress documents found to reset for user {user_uid}") # print the error message

        return jsonify({"success": True, "modulesReset": doc_count}), 200 # return the success message, the document count and 200 status code

    except auth.InvalidIdTokenError as e: # if the id token is invalid
        print(f"Reset Times Endpoint: Invalid Firebase ID token received: {e}") # print the error message
        return jsonify({"error": "Invalid authorisation token"}), 401 # return the error message and 401 status code
    except auth.ExpiredIdTokenError as e: # if the id token is expired
        print(f"Reset Times Endpoint: Expired Firebase ID token received: {e}") # print the error message
        return jsonify({"error": "Authorisation token expired"}), 401 # return the error message and 401 status code
    except Exception as e: # if an error occurs
        print(f"Reset Times Endpoint: Error resetting times for user {user_uid if 'user_uid' in locals() else 'unknown'}: {e}") # print the error message
        return jsonify({"error": "An unexpected error occurred resetting module times."}), 500 # return the error message and 500 status code
