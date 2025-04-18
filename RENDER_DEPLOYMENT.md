# Deploying the Emotion Detector Backend to Render

This guide will walk you through deploying the Emotion Detector backend to Render.

## Prerequisites

1. A [Render](https://render.com/) account
2. Your project code pushed to a GitHub repository
3. Firebase credentials set up

## Deployment Steps

### 1. Connect Your GitHub Repository to Render

1. Sign in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository 
4. Select the repository where your backend code is located

### 2. Configure Your Web Service

Use the following settings:

- **Name**: emotion-detector-backend (or choose your own)
- **Environment**: Python
- **Region**: Choose the region closest to your users
- **Branch**: main (or your default branch)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn run:app`
- **Plan**: Free

### 3. Configure Environment Variables

Add the following environment variables:

- `PYTHON_VERSION`: 3.10.0
- `PORT`: 10000

### 4. Add Firebase Credentials

You have two options for adding Firebase credentials:

#### Option 1: Upload credentials via Environment Variables
1. In the Render dashboard, go to your web service
2. Click on "Environment"
3. Add a new environment variable:
   - Key: `FIREBASE_CREDENTIALS_JSON`
   - Value: Copy and paste the entire contents of your `firebase-credentials.json` file

#### Option 2: Set up during build
1. Create a secret file in Render's dashboard
2. Add the content of your Firebase credentials
3. Set up the build script to place this file in the correct location

### 5. Deploy

Click "Create Web Service" and Render will start the deployment process.

## Verifying Your Deployment

Once deployed, you can verify your service is working by visiting:
- Health check: `https://your-service-name.onrender.com/`
- Firebase status: `https://your-service-name.onrender.com/firebase_status`
- Routes overview: `https://your-service-name.onrender.com/debug/routes`

## Troubleshooting

If you encounter issues:

1. Check Render logs for error messages
2. Verify environment variables are set correctly
3. Make sure all dependencies are listed in requirements.txt
4. Check that Firebase credentials are properly configured

## Updating Your Deployment

Render automatically redeploys when you push changes to your repository. 