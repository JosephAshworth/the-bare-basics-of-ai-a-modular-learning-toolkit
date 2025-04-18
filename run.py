import os
from app import app, load_firebase_credentials

# Load Firebase credentials from environment variable if available
load_firebase_credentials()

if __name__ == '__main__':
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 