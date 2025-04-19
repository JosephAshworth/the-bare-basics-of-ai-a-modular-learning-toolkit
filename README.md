# Emotion Detector Application

## Project Structure

This project is organized into two main directories:

- `frontend/`: React frontend application
- `backend/`: Python Flask backend API

## Environment Setup Options

This application provides a complete local development and Render-like production simulation:

1. **Local Development** - Regular development mode with hot reloading
2. **Render Simulation (Local Backend)** - Production build but using a local backend
3. **Full Render Simulation** - Production build connecting to remote backend

## Prerequisites

- Node.js and npm
- Python 3.x
- pip (for Python dependencies)
- Bash shell (Git Bash on Windows, Terminal on macOS/Linux)
- Docker (optional, for a more accurate nginx-based simulation)

## Quick Start

The easiest way to get started is to use our convenient scripts:

```bash
# Install all dependencies (frontend and backend)
npm run install:all

# Start in development mode (hot reloading)
npm run dev

# Simulate Render deployment (with local backend)
npm run sim:render-local

# Fully simulate Render deployment (points to production backend)
npm run sim:render
```

## Detailed Setup Options

### 1. Local Development

Runs the application in development mode with hot reloading:

```bash
npm run dev
```

This will:
- Start the backend at http://localhost:5000
- Start the frontend dev server at http://localhost:3000
- Enable hot reloading for both

### 2. Render Simulation with Local Backend

Simulates a Render deployment but uses a local backend:

```bash
npm run sim:render-local
```

This will:
- Start the backend with gunicorn at http://localhost:10000
- Build the frontend with production settings
- Serve the built frontend using a static server at http://localhost:3000

This is useful for testing production builds locally.

### 3. Full Render Simulation

Provides the most accurate simulation of a Render deployment:

```bash
npm run sim:render
```

This will:
- Start the backend with gunicorn at http://localhost:10000
- Build the frontend with production settings pointing to the production backend URL
- Serve the frontend using nginx in Docker (if available) or fallback to `serve`
- Configure CORS and other settings to match a production environment

This closely mimics how your application will behave when deployed to Render.

## Manual Setup

If you prefer to start the services manually:

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### Frontend (Development)

```bash
cd frontend
npm install
npm start
```

### Frontend (Production Build)

```bash
cd frontend
npm install
npm run build:prod  # For full production build
npm run serve:prod  # Build and serve the production build
```

## Environment Variables

Different environment files control the application's behavior:

- `.env.development` - Local development (points to localhost:5000)
- `.env.local-simulation` - Production simulation with local backend (points to localhost:10000)
- `.env.production` - Actual production deployment (points to Render backend URL)

## Deploying to Render

This project is set up for a smooth deployment to Render:

### Backend Web Service

1. Create a new Web Service in Render
2. Connect your repository and select `/backend` as the root directory
3. Runtime: Python 3
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `gunicorn run:app`
6. Add the following environment variables:
   - `FLASK_ENV=production`
   - Add other secret keys and credentials as needed

### Frontend Static Site

1. Create a new Static Site in Render
2. Connect your repository and select `/frontend` as the root directory
3. Build Command: `npm install && npm run build:prod`
4. Publish Directory: `build`

### Testing Your Deployment

After deploying, you can verify your deployment works by:

1. Testing the backend API directly: `https://your-backend.onrender.com/api/...`
2. Confirming the frontend can connect to the backend
3. Checking Render logs for any issues

The scripts in this repository allow you to test all of this locally before deploying. 