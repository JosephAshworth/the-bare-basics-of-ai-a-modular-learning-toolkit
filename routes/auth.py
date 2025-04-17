import os
import json
import logging
import tempfile
from flask import request, jsonify, Blueprint
from firebase_admin import auth, firestore

# Create auth blueprint
auth_routes = Blueprint('auth', __name__)
logger = logging.getLogger("emotion_detector")

# Initialize Firebase with credentials if available
firebase_initialized = False
firebase_temp_file = None
try:
    from firebase_admin import auth, credentials, firestore, initialize_app
    
    # Check for credentials in environment variable first
    firebase_creds_json = os.environ.get('FIREBASE_CREDENTIALS_JSON')
    cred_path = os.environ.get('FIREBASE_CREDENTIALS_PATH', './firebase-credentials.json')
    
    # If credentials JSON is provided as environment variable, write to temp file
    if firebase_creds_json:
        try:
            firebase_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.json')
            with open(firebase_temp_file.name, 'w') as f:
                f.write(firebase_creds_json)
            cred_path = firebase_temp_file.name
            logger.info(f"Created temporary Firebase credentials file from environment variable")
        except Exception as e:
            logger.error(f"Failed to create temporary credentials file: {str(e)}")
    
    # Initialize Firebase with credentials file
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_app = initialize_app(cred)
        db = firestore.client()
        users_collection = db.collection('users')
        firebase_initialized = True
        logger.info("Firebase initialized successfully")
    else:
        logger.warning(f"Firebase credentials file not found at {cred_path}. Auth features will be disabled.")
except Exception as e:
    logger.error(f"Failed to initialize Firebase: {str(e)}. Auth features will be disabled.")
    # Clean up temp file if it exists
    if firebase_temp_file and os.path.exists(firebase_temp_file.name):
        try:
            os.unlink(firebase_temp_file.name)
        except Exception:
            pass

@auth_routes.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user with email and password"""
    if not firebase_initialized:
        return jsonify({"error": "Firebase authentication is required. Please set up Firebase credentials."}), 503
    
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        display_name = data.get('displayName', '')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Create user in Firebase Auth
        user = auth.create_user(
            email=email,
            password=password,
            display_name=display_name
        )
        
        # Store additional user data in Firestore
        users_collection.document(user.uid).set({
            'email': email,
            'displayName': display_name,
            'createdAt': firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({
            'message': 'User registered successfully',
            'userId': user.uid
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_routes.route('/api/auth/login', methods=['POST'])
def login():
    """Get a user token (this is handled in the frontend)"""
    if not firebase_initialized:
        return jsonify({"error": "Firebase authentication is required. Please set up Firebase credentials."}), 503
        
    return jsonify({
        'message': 'Login should be handled in the frontend using Firebase Auth SDK'
    }), 200

@auth_routes.route('/api/auth/user', methods=['GET'])
def get_user():
    """Get user data from Firestore"""
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
        
        # Get user data from Firestore
        user_doc = users_collection.document(uid).get()
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404
        
        user_data = user_doc.to_dict()
        # Don't return sensitive information
        if 'password' in user_data:
            del user_data['password']
            
        return jsonify(user_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_routes.route('/api/auth/user/update', methods=['PUT'])
def update_user():
    """Update user profile information"""
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
        
        data = request.json
        update_data = {}
        
        # Fields that can be updated
        allowed_fields = ['displayName', 'photoURL', 'preferences']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
        
        # Update in Firestore
        users_collection.document(uid).update(update_data)
        
        return jsonify({"message": "User updated successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_routes.route('/api/auth/status', methods=['GET'])
def firebase_status():
    """Check if Firebase is properly configured"""
    return jsonify({
        "firebase_initialized": firebase_initialized
    }), 200

@auth_routes.route('/api/auth/delete-account', methods=['POST'])
def delete_account_data():
    """Delete a user's data from the backend when they delete their account"""
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
        
        logger.info(f"Processing account deletion for user: {uid}")
        deleted_items = []
        
        # Delete user's progress data
        try:
            progress_ref = db.collection('user_progress').document(uid)
            progress_doc = progress_ref.get()
            
            if progress_doc.exists:
                logger.info(f"Deleting user progress for user: {uid}")
                progress_ref.delete()
                deleted_items.append("user_progress")
            else:
                logger.warning(f"No progress document found for user: {uid}")
        except Exception as e:
            logger.error(f"Error deleting user progress: {str(e)}")
            # Continue with other deletions even if this fails
        
        # Delete any user metadata
        try:
            user_ref = db.collection('users').document(uid)
            user_doc = user_ref.get()
            
            if user_doc.exists:
                logger.info(f"Deleting user metadata for user: {uid}")
                user_ref.delete()
                deleted_items.append("user_metadata")
            else:
                logger.warning(f"No user document found for user: {uid}")
        except Exception as e:
            logger.error(f"Error deleting user metadata: {str(e)}")
        
        # Check if the user has any module data that needs to be deleted
        try:
            # Find any other collections that might contain user data
            # For example, check user contributions, comments, etc.
            # This is a placeholder for your specific application needs
            pass
        except Exception as e:
            logger.error(f"Error cleaning up additional user data: {str(e)}")
        
        # Force a flush to ensure data is committed to Firestore
        batch = db.batch()
        dummy_ref = db.collection('_deleted_users').document(uid)
        batch.set(dummy_ref, {"deletedAt": firestore.SERVER_TIMESTAMP, "uid": uid})
        batch.delete(dummy_ref)  # Delete it right away - just using to force a flush
        batch.commit()
        
        # Verify progress document is actually deleted
        try:
            verification_doc = db.collection('user_progress').document(uid).get()
            if verification_doc.exists:
                logger.critical(f"FAILED TO DELETE user_progress for {uid}! Document still exists after deletion.")
                # Try one more time with a different approach
                db.collection('user_progress').document(uid).delete()
            else:
                logger.info(f"Successfully verified deletion of user_progress for {uid}")
        except Exception as e:
            logger.error(f"Error during verification of deletion: {str(e)}")
        
        logger.info(f"Completed account deletion process for user: {uid}. Deleted items: {', '.join(deleted_items)}")
        
        return jsonify({
            "success": True, 
            "message": "User data deleted successfully",
            "deleted_items": deleted_items
        }), 200
    except Exception as e:
        error_message = f"Error deleting user data: {str(e)}"
        logger.error(error_message)
        return jsonify({"error": error_message}), 500

@auth_routes.route('/api/auth/admin/cleanup-user/<user_id>', methods=['DELETE'])
def admin_cleanup_user(user_id):
    """Admin route to force clean up a user's data (requires admin authentication)"""
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
        admin_uid = decoded_token['uid']
        
        # Check if the user is an admin
        admin_doc = users_collection.document(admin_uid).get()
        if not admin_doc.exists or not admin_doc.to_dict().get('isAdmin', False):
            logger.warning(f"Non-admin user {admin_uid} attempted to access admin cleanup")
            return jsonify({"error": "Unauthorized access. Admin privileges required."}), 403
        
        logger.info(f"Admin {admin_uid} initiating forced cleanup for user: {user_id}")
        cleanup_results = {}
        
        # Clean up user_progress collection
        try:
            progress_ref = db.collection('user_progress').document(user_id)
            progress_doc = progress_ref.get()
            if progress_doc.exists:
                progress_ref.delete()
                cleanup_results['user_progress'] = "Deleted"
            else:
                cleanup_results['user_progress'] = "Not found"
        except Exception as e:
            cleanup_results['user_progress'] = f"Error: {str(e)}"
            logger.error(f"Error during admin cleanup of user_progress for {user_id}: {str(e)}")
        
        # Clean up users collection
        try:
            user_ref = db.collection('users').document(user_id)
            user_doc = user_ref.get()
            if user_doc.exists:
                user_ref.delete()
                cleanup_results['users'] = "Deleted"
            else:
                cleanup_results['users'] = "Not found"
        except Exception as e:
            cleanup_results['users'] = f"Error: {str(e)}"
            logger.error(f"Error during admin cleanup of users for {user_id}: {str(e)}")
        
        # Add any other collections that might contain user data
        # For example: comments, posts, etc.
        
        # Record the cleanup action
        try:
            db.collection('admin_logs').add({
                'action': 'user_cleanup',
                'admin_uid': admin_uid,
                'target_uid': user_id,
                'timestamp': firestore.SERVER_TIMESTAMP,
                'results': cleanup_results
            })
        except Exception as e:
            logger.error(f"Error logging admin cleanup: {str(e)}")
        
        return jsonify({
            "success": True,
            "message": "Admin cleanup completed",
            "results": cleanup_results
        }), 200
    except Exception as e:
        error_message = f"Error during admin cleanup: {str(e)}"
        logger.error(error_message)
        return jsonify({"error": error_message}), 500

def register_auth_routes(app):
    app.register_blueprint(auth_routes) 