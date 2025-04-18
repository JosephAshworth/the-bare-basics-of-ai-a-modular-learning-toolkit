# Emotion Detector

A web application that detects emotions from faces, text, and audio using machine learning.

## Project Structure

This project is organized into two main directories:

- `/frontend`: React application for the user interface
- `/backend`: Flask API for processing emotion detection requests

## Development Setup

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python run.py
```

The backend will start on http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will start on http://localhost:3000

## Deployment

See [DEPLOYMENT_README.md](DEPLOYMENT_README.md) for detailed deployment instructions to Render.com.

## Features

- Facial emotion detection
- Text sentiment analysis
- Audio emotion detection
- User authentication
- Progress tracking
- Learning modules

## Technologies

- **Frontend**: React, Material-UI, Tailwind CSS, Axios
- **Backend**: Flask, Python ML libraries
- **Data Processing**: TensorFlow, PyTorch
- **Cloud**: Firebase, Render 