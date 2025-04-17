# Deployment Guide

## Environment Variables
The application requires the following environment variables to be set on the hosting platform:

1. `FIREBASE_CREDENTIALS_JSON` - The full JSON content of your Firebase credentials
2. `ALLOWED_ORIGINS` - Comma-separated list of allowed origins (e.g., "http://localhost:3000,https://yourapp.com")

## Deployment Process
1. Set up environment variables on Heroku
2. Deploy with Git:
   ```
   git add -A
   git commit -m "Deploy to Heroku"
   git push heroku master
   ```

## Auto-Downloads
The release process will automatically download required models using the `download_models.py` script.

## Logs
Check deployment logs with:
```
heroku logs --tail
``` 