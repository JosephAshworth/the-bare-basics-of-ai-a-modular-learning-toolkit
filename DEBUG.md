# Debugging Guide for Emotion Detector Application

This guide provides instructions for debugging common issues in the Emotion Detector application, particularly focusing on API connection problems between the frontend and backend.

## Table of Contents
- [Frontend API Debugging](#frontend-api-debugging)
- [Backend Logging and Debugging](#backend-logging-and-debugging)
- [CORS Issues](#cors-issues)
- [Render Deployment Issues](#render-deployment-issues)
- [Model Loading Issues](#model-loading-issues)

## Frontend API Debugging

### Using the API Debugger Tool

The application includes a built-in API debugging tool that helps diagnose connection issues:

1. Access the debugger in your browser:
   - Protected route: `/debug` (requires login)
   - Public route for deployment troubleshooting: `/api-debug` (no login required)

2. The debugger provides several testing options:
   - **Full Diagnostics**: Runs a comprehensive suite of connection tests
   - **Connection Test**: Tests basic connectivity to the backend
   - **CORS Test**: Verifies proper CORS configuration
   - **Custom Endpoint**: Test specific API endpoints with custom parameters

3. Interpreting common errors:
   - **Network Error**: Backend server is not running or unreachable
   - **CORS Error**: Backend is not configured to accept requests from frontend origin
   - **Timeout Error**: Request took too long to complete (often model loading issues)
   - **401/403 Errors**: Authentication or authorization issues

### Checking Browser Console

For more detailed frontend debugging:

1. Open browser developer tools (F12 or right-click → Inspect)
2. Go to the Console tab
3. Look for:
   - Network errors (red messages)
   - API connection issues
   - Authentication errors
   - Failed resource loading

## Backend Logging and Debugging

### Viewing Backend Logs

The backend includes logging utilities to help diagnose issues:

#### For Windows users:

Run the PowerShell script from the backend directory:
```powershell
cd backend
.\debug_logs.ps1 -help     # View available commands
.\debug_logs.ps1           # Show last 20 log lines
.\debug_logs.ps1 -tail     # Monitor logs in real-time
.\debug_logs.ps1 -errors   # View only error messages
```

#### For Linux/Mac users:

Run the shell script from the backend directory:
```bash
cd backend
chmod +x debug_logs.sh     # Make executable (first time only)
./debug_logs.sh --help     # View available commands
./debug_logs.sh            # Show last 20 log lines
./debug_logs.sh --tail     # Monitor logs in real-time
./debug_logs.sh --errors   # View only error messages
```

### Debug Endpoints

The backend includes special debug endpoints:

1. **Root endpoint**: `GET /`
   - Check if the API is running
   - Returns basic status information

2. **Routes list**: `GET /debug/routes`
   - Lists all available API routes
   - Useful for verifying route registration

3. **Request debug**: `GET /debug/request`
   - Returns detailed information about the current request
   - Shows headers, origin, and other request properties

4. **Firebase status**: `GET /firebase_status`
   - Verifies Firebase initialization status
   - Important for authentication issues

## CORS Issues

If you're encountering CORS errors:

1. Verify the backend CORS configuration in `backend/app.py`
2. Ensure your frontend's origin is in the allowed origins list:
   ```python
   CORS(app, origins=[
       "http://localhost:3000",
       "https://your-frontend-domain.onrender.com",
       # ...
   ])
   ```
3. Check that the request includes the proper headers
4. Use the API Debugger's CORS test to verify configuration

## Render Deployment Issues

### Backend Deployment Issues

1. **Port configuration**:
   - Ensure the backend binds to the `$PORT` environment variable
   - Procfile should contain: `web: python run.py`
   - Check `run.py` for proper port binding

2. **Environment variables**:
   - Verify all required environment variables are set in Render dashboard
   - Critical variables: `PORT`, `FIREBASE_CREDENTIALS_JSON`

3. **Model loading**:
   - Ensure `render_setup.py` is executed during build
   - Check logs for model download success/failure

### Frontend Deployment Issues

1. **API connection**:
   - Verify `REACT_APP_BACKEND_URL` environment variable is set correctly
   - Should point to your deployed backend URL on Render

2. **Build issues**:
   - Check build logs for errors
   - Ensure `render.yaml` is properly configured

## Model Loading Issues

If emotion detection is failing:

1. **Verify model downloads**:
   - Check if models were downloaded during deployment
   - Look for errors in build logs or runtime logs

2. **Test model endpoints directly**:
   - Use the API Debugger's Custom Endpoint feature
   - Test `/api/detect/face-emotions`, `/api/detect/text-emotions`, etc.

3. **Check permissions and paths**:
   - Models should be in `backend/saved_models/`
   - Directory should be writable by the application

## Contacting Support

If you cannot resolve an issue using this guide:

1. Gather relevant logs:
   - Backend logs (use debug_logs scripts)
   - Frontend console errors
   - API Debugger test results

2. Open an issue on GitHub with:
   - Detailed description of the problem
   - Steps to reproduce
   - Log information collected above
   - Environment details (browser, OS, etc.) 