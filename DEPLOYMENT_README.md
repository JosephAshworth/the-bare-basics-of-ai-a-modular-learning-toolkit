# Emotion Detector - Deployment Guide

This guide covers the deployment process for both the backend and frontend of the Emotion Detector application on Render.com. The project is organized into `/frontend` and `/backend` directories.

## Project Structure

```
emotion-detector/
├── frontend/               # Frontend React application
│   ├── src/                # React source code
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   └── ...
├── backend/                # Backend Flask application
│   ├── routes/             # API routes
│   ├── app.py              # Main application file
│   ├── run.py              # Server startup script
│   ├── render_setup.py     # Setup script for Render
│   ├── requirements.txt    # Python dependencies
│   └── ...
├── render.yaml             # Main Render configuration file
└── DEPLOYMENT_README.md    # This file
```

## Backend Deployment

### Prerequisites
- A Render.com account
- GitHub repository with your backend code
- Proper directory structure with model download scripts

### Deployment Steps

1. **Login to Render Dashboard**:
   - Go to [dashboard.render.com](https://dashboard.render.com/) and sign in

2. **Create a New Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the branch to deploy

3. **Configure the Web Service**:
   - Name: `emotion-detector-backend`
   - Environment: `Python`
   - Region: Select the region closest to your users
   - Branch: Your main/production branch
   - Root Directory: `backend` (important!)
   - Build Command: `pip install -r requirements.txt && python render_setup.py`
   - Start Command: `gunicorn run:app -b 0.0.0.0:$PORT`

4. **Configure Environment Variables**:
   - Add the following environment variables:
     - `PORT`: `10000`
     - `PYTHON_VERSION`: `3.10.0`
     - `DEBUG`: `false`
     - Add any required API keys or service credentials

5. **Advanced Settings** (Optional):
   - Health Check Path: `/`
   - Auto-Deploy: Enabled

6. **Create Web Service**:
   - Click "Create Web Service"
   - Wait for the initial deployment to complete (may take 5-10 minutes)

### Troubleshooting Backend Deployment

If you encounter issues during deployment:

1. **Check Logs**: 
   - Navigate to your service on Render dashboard
   - Go to the "Logs" tab to view build and runtime logs

2. **Model Issues**:
   - Check if `render_setup.py` executed successfully
   - Verify model files were downloaded and copied to the correct locations
   - Look for error messages related to model loading

3. **Port Binding Issues**:
   - Ensure the app is binding to PORT as specified in the environment variable
   - Check your Procfile and render.yaml configurations

## Frontend Deployment

### Prerequisites
- A Render.com account
- GitHub repository with your frontend code
- Proper directory structure with package.json

### Deployment Steps

1. **Login to Render Dashboard**:
   - Go to [dashboard.render.com](https://dashboard.render.com/) and sign in

2. **Create a New Static Site**:
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Select the branch to deploy

3. **Configure the Static Site**:
   - Name: `emotion-detector-frontend`
   - Root Directory: `frontend` (important!)
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Environment Variables:
     - `REACT_APP_BACKEND_URL`: Your backend URL (e.g., `https://emotion-detector-backend.onrender.com`)
     - `NODE_VERSION`: `18.18.0` (or your preferred Node version)

4. **Advanced Settings**:
   - Add a redirect rule for SPA:
     - Source: `/*`
     - Destination: `/index.html`
     - Status: `200`

5. **Create Static Site**:
   - Click "Create Static Site"
   - Wait for the initial deployment to complete

### Connecting Frontend to Backend

Ensure that:

1. The frontend's API service is configured to use the `REACT_APP_BACKEND_URL` environment variable:
   ```javascript
   const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
   ```

2. The backend's CORS settings allow requests from the frontend domain:
   ```python
   CORS(app, origins=[
       "http://localhost:3000",
       "https://emotion-detector-frontend.onrender.com",
       "https://*.onrender.com"
   ])
   ```

## Using render.yaml for Deployment

Alternatively, you can use the `render.yaml` file at the root of the repository for automatic deployment of both services:

1. Go to Render Dashboard > Blueprints
2. Connect your repository
3. Render will detect the `render.yaml` file and offer to deploy all services
4. Review the configuration and click "Apply"

This will deploy both the frontend and backend services according to the configuration in the `render.yaml` file.

## Debugging Cross-Origin Issues

If you encounter CORS issues:

1. **Check Network Tab**: 
   - Inspect the browser's network tab to see if there are CORS errors
   - Look for `Access-Control-Allow-Origin` headers in the response

2. **Backend Headers**:
   - Ensure your backend is setting the correct CORS headers
   - Review the `app.py` CORS configuration

3. **Frontend API Calls**:
   - Use the browser's developer console to log API requests
   - Check if the correct backend URL is being used

## Monitoring & Maintenance

1. **Check Application Health**:
   - Periodically visit the health check endpoint (e.g., `/api/system/health/database`)
   - Set up uptime monitoring for your services

2. **Update Deployment**:
   - Push changes to your GitHub repository
   - Render will automatically rebuild and redeploy if auto-deploy is enabled

## Resources

- [Render Documentation](https://render.com/docs)
- [Gunicorn Configuration](https://docs.gunicorn.org/en/stable/configure.html)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/) 