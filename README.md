# The Bare Basics of AI: A Modular Learning Toolkit

This project provides a modular and interactive web interface for learning fundamental Artificial Intelligence concepts. Follow the steps below to run the application locally.

---

## Prerequisites

* **Node.js and npm**
  Required for the frontend. Download from [https://nodejs.org/](https://nodejs.org/)

* **Python 3**
  Required for the backend Flask server. Download from [https://www.python.org/](https://www.python.org/)

  (On the first screen, tick “Add Python to PATH”)

* **pip**
  Python’s package installer (typically included with Python)

---

## Installation

1. **Navigate into the project directory**

2. **Install frontend dependencies:**
   *(Run this from the project root directory)*

   ```bash
   npm install
   ```

   If you get an error, try running:
   ```bash
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   and then run the installation command again.

---

## Running the Application

You must run the backend server and the frontend development server in separate terminals.

---

### Terminal 1: Backend Setup and Execution

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Create a Python virtual environment (if not already present):**

   ```bash
   python -m venv venv
   ```

   or if on Mac try:
   ```bash
   python3 -m venv venv
   ```

3. **Activate the virtual environment:**

   * **Windows (Command Prompt):**

     ```bash
     venv\Scripts\activate.bat
     ```

   * **Windows (PowerShell):**

     ```bash
     .\venv\Scripts\Activate.ps1
     ```

     If you encounter an execution policy error, run:

     ```bash
     Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
     ```

     Then try activating again.

   * **macOS / Linux (bash/zsh):**

     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

   **Note for Windows users:**  

   Some Python packages require Microsoft Visual C++ Build Tools to compile. 

   If you see an error about needing "Microsoft Visual C++ 14.0 or greater," download and install the Build Tools from:  
   https://visualstudio.microsoft.com/visual-cpp-build-tools/
   
   In the installer, select "Desktop development with C++" and complete the installation.  

   Then restart your terminal and run the `pip install -r requirements.txt` command again.

5. **Download required models:**

   ```bash
   python routes/download_models.py
   ```

   (Note: If you get an error during download, please follow the instructions in the alternative_models.txt file)

---

### Firebase Admin SDK Setup (Backend)

To enable Firebase functionality on the backend:

1. Visit [https://console.firebase.google.com](https://console.firebase.google.com)

2. Open your Firebase project (or create one if you don't already have one)

3. Navigate to 'Project Settings' (gear icon) → 'Service accounts' tab

4. Click 'Generate new private key' to download the service account credentials JSON

5. Open the downloaded JSON file and take note of these values:
   - project_id
   - private_key_id
   - private_key
   - client_email
   - client_id
   - client_x509_cert_url

6. Create a `.env` file in the root directory of your project and add these environment variables:

   ```
   FIREBASE_PROJECT_ID=project_id
   FIREBASE_PRIVATE_KEY_ID=private_key_id
   FIREBASE_PRIVATE_KEY=private_key
   FIREBASE_CLIENT_EMAIL=client_email
   FIREBASE_CLIENT_ID=client_id
   FIREBASE_CLIENT_CERT_URL=client_x509_cert_url
   ```

   Make sure to replace the placeholder values with your actual Firebase credentials.
   Make sure to exclude the double quotes from the credentials values in the `.env` file.


8. **Start the backend Flask server:**

   ```bash
   python app.py
   ```

   Keep this terminal running.

---

### Terminal 2: Frontend Setup and Execution

1. **Ensure you are in the project root directory.**

2. **Firebase Setup (Frontend):**

   1. Visit [https://console.firebase.google.com](https://console.firebase.google.com)

   2. Open the same Firebase project as the one you used for the backend

   3. Open 'Project Settings' (gear icon) → 'General' tab

   4. Under 'Your Apps', add a 'Web App' (\</>) and provide a name

   5. After setup, Firebase will provide a config object like:

      ```json
      {
        "apiKey": "your-api-key",
        "authDomain": "your-auth-domain",
        "projectId": "your-project-id",
        "storageBucket": "your_storageBucket",
        "messagingSenderId": "your_messagingSenderId",
        "appId": "your_appId",
        "measurementId": "your_measurementId"
      }
      ```

   6. Add these values to your `.env` file in the root directory:

      ```
      REACT_APP_FIREBASE_API_KEY=your-api-key
      REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
      REACT_APP_FIREBASE_PROJECT_ID=your-project-id
      REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messagingSenderId
      REACT_APP_FIREBASE_APP_ID=your_appId
      REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurementId
      ```

      Again, make sure to replace the placeholder values with your actual Firebase credentials.
      Make sure to exclude the double quotes from the credentials values in the `.env` file.


3. **Start the React development server:**

   ```bash
   npm run start:frontend
   ```

   This should open the application in your browser. If not, navigate to the 'local' port shown in the terminal, which is usually:

   ```
   http://localhost:3000
   ```

---
