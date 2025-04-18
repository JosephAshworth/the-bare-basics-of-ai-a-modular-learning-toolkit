# Emotion Detector Backend

This is the backend for the Emotion Detector application.

## Development Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `.\venv\Scripts\Activate.ps1`
   - Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up Firebase:
   - Copy `firebase-credentials.json.template` to `firebase-credentials.json`
   - Update the file with your Firebase service account credentials

5. Run the application:
   ```
   python run.py
   ```

## Deployment to Render

### Environment Variables

Set the following environment variables in Render:

- `FIREBASE_CREDENTIALS_PATH`: Path to Firebase credentials (or use Firebase credentials as JSON string)
- Any other API keys or secrets used in the application

### Firebase Configuration 

For security reasons, never commit your Firebase credentials to version control. 
On Render, add your Firebase credentials as an environment variable:

1. Create a new Web Service in Render
2. Add an environment variable called `FIREBASE_CREDENTIALS_JSON` with the content of your Firebase credentials JSON file
3. Update the code in auth.py to load credentials from this environment variable

### Getting Started with Render

1. Create a Render account at https://render.com/
2. Connect your GitHub repository
3. Create a new Web Service
4. Select your repository and the backend directory
5. Set the Environment to "Python 3"
6. Set the Build Command to: `pip install -r requirements.txt`
7. Set the Start Command to: `gunicorn run:app`
8. Configure environment variables
9. Deploy the service

## API Documentation

The API provides endpoints for emotion detection, model training, and user authentication. 