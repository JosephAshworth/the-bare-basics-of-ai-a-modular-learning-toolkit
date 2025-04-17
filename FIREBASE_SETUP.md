# Firebase Authentication and Firestore Setup

This application uses Firebase for user authentication and Firestore as a database.

## Setup Steps

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. Click "Add project" and follow the prompts to create a new Firebase project.
3. Once your project is created, click on it to enter the project dashboard.

### 2. Set Up Firebase Authentication

1. In your Firebase project dashboard, click on "Authentication" in the sidebar.
2. Click on "Get started" and enable the "Email/Password" sign-in method.
3. (Optional) Enable any other authentication methods you want to use.

### 3. Set Up Firestore Database

1. In your Firebase project dashboard, click on "Firestore Database" in the sidebar.
2. Click "Create database" and choose between production mode or test mode (you can change this later).
3. Select a location for your database and click "Enable".

### 4. Generate Service Account Credentials

1. In your Firebase project dashboard, click on the gear icon (⚙️) next to "Project Overview" and select "Project settings".
2. Go to the "Service accounts" tab.
3. Click "Generate new private key" to download a JSON file with your service account credentials.
4. Rename this file to `firebase-credentials.json` and save it in the `backend` directory of this project.

### 5. Install Firebase Admin SDK

The Firebase Admin SDK is already listed in requirements.txt. Install it with:

```
pip install -r requirements.txt
```

### 6. Configure Frontend (React)

1. Install the Firebase client SDK:

```
npm install firebase
```

2. Create a configuration file in your frontend (e.g., `src/firebase.js`):

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
```

Replace the values in `firebaseConfig` with your own project settings, which you can find in your Firebase project settings.

## Security Rules

For Firestore, set up appropriate security rules in the Firebase Console to secure your data.

Example Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
  }
}
```

These rules allow users to read, update, and delete only their own data.

## Environment Variables

For production deployment, you might want to use environment variables instead of a credentials file. Set the following environment variable:

```
FIREBASE_CREDENTIALS_PATH=/path/to/your/credentials.json
```

Or, you can encode the JSON content in an environment variable:

```
FIREBASE_CREDENTIALS={"type":"service_account",...}
```

Then modify the auth.py file to use this environment variable. 