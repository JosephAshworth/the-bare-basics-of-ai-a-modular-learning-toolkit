# Deploying the Emotion Detector Frontend to Render

This guide will walk you through deploying the Emotion Detector frontend to Render.

## Prerequisites

1. A [Render](https://render.com/) account
2. Your project code pushed to a GitHub repository
3. Backend already deployed to Render

## Deployment Steps

### 1. Connect Your GitHub Repository to Render

1. Sign in to your Render account
2. Click on "New" and select "Static Site"
3. Connect your GitHub repository 
4. Select the repository where your frontend code is located

### 2. Configure Your Static Site

Use the following settings:

- **Name**: emotion-detector-frontend (or choose your own)
- **Environment**: Static Site
- **Branch**: main (or your default branch)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `./build`
- **Auto-Deploy**: Yes

### 3. Configure Environment Variables

Add the following environment variables:

- `REACT_APP_BACKEND_URL`: https://emotion-detector-backend.onrender.com
- `NODE_VERSION`: 18.18.0

### 4. Deploy

Click "Create Static Site" and Render will start the deployment process.

## Verifying Your Deployment

Once deployed, you can verify your service is working by visiting:
- Frontend: `https://emotion-detector-frontend.onrender.com`
- Test an API call to the backend from the frontend

## Troubleshooting

If you encounter issues:

1. Check Render logs for error messages
2. Verify environment variables are set correctly
3. Ensure CORS is properly configured in the backend
4. Check that all API calls use the apiService module

## Updating Your Deployment

Render automatically redeploys when you push changes to your repository. 