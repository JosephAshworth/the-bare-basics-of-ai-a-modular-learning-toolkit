# The Bare Basics of AI: A Modular Learning Toolkit

This project provides a modular and interactive web interface for learning fundamental Artificial Intelligence concepts. Follow the steps below to run the application locally.

---

## Prerequisites

* **Node.js and npm**
  Required for the frontend. Download from [https://nodejs.org/](https://nodejs.org/)

* **Python 3**
  Required for the backend Flask server and machine learning functionality. Download from [https://www.python.org/](https://www.python.org/)

  (On the first screen, tick “Add Python to PATH”)

* **pip**
  Python’s package installer (typically included with Python)

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd <repository-folder-name>
   ```

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

3. **Note for Windows users:**  

   Some Python packages require Microsoft Visual C++ Build Tools to compile. 

   If you see an error about needing "Microsoft Visual C++ 14.0 or greater," download and install the Build Tools from:  
   https://visualstudio.microsoft.com/visual-cpp-build-tools/
   
   In the installer, select "Desktop development with C++" and complete the installation.  

   Then restart your terminal and run the `pip install -r requirements.txt` command again.

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

5. **Download required models:**

   ```bash
   python routes/download_models.py
   ```

---

### Firebase Admin SDK Setup (Backend)

To enable Firebase functionality on the backend:

1. Visit [https://console.firebase.google.com](https://console.firebase.google.com)

2. Open your Firebase project (or create one if you don't already have one)

3. Navigate to 'Project Settings' (gear icon) → 'Service accounts' tab

4. Click 'Generate new private key' to download the service account credentials JSON

5. Rename the file to:

   ```
   firebase-credentials.json
   ```

6. Move this file into the `backend/` directory

7. Ensure it follows this format (where each property value placeholder is replaced with the actual values from the JSON file):

   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "your_private_key_id",
     "private_key": "your_private_key",
     "client_email": "your_client_email",
     "client_id": "your_client_id",
     "auth_uri": "your_auth_uri",
     "token_uri": "your_token_uri",
     "auth_provider_x509_cert_url": "your_auth_provider_x509_cert_url",
     "client_x509_cert_url": "your_client_x509_cert_url",
     "universe_domain": "googleapis.com"
   }
   ```

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
        "apiKey": "YOUR_API_KEY",
        "authDomain": "your_authDomain",
        "projectId": "your_projectId",
        "storageBucket": "your_storageBucket",
        "messagingSenderId": "your_messagingSenderId",
        "appId": "your_appId",
        "measurementId": "Gyour_measurementId"
      }
      ```

   6. Create a file in the `src/` directory named:

      ```
      firebase-credentials.json
      ```

   7. Paste the configuration object into that file, replacing all placeholders with your actual values.

   8. Create a `.env` file in the root directory with the following content:

      ```
      REACT_APP_USE_LOCAL_FIREBASE_CREDENTIALS=true
      ```

      This will ensure the application uses the locally-defined credentials as opposed to the deployed environment variables.

3. **Start the React development server:**

   ```bash
   npm run start:frontend
   ```

   This should open the application in your browser. If not, navigate to the 'local' port shown in the terminal, which is usually:

   ```
   http://localhost:3000
   ```

---