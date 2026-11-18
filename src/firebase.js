
import { initializeApp } from "firebase/app";

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "firebase/app-check";

import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend
} from "firebase/ai";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// App Check is optional for rendering the UI.
// Configure the Enterprise site key to enable it.
let appCheck = null;

const siteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY;

if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

if (siteKey && siteKey.trim()) {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true
    });
    console.log("Firebase App Check initialized.");
  } catch (error) {
    console.error("Firebase App Check initialization failed:", error);
  }
} else {
  console.warn(
    "App Check site key is missing. UI can load, but AI requests may require App Check configuration."
  );
}

// Initialize Firebase AI
const ai = getAI(app, {
  backend: new GoogleAIBackend()
});

const model = getGenerativeModel(ai, {
  model: "gemini-3.5-flash"
});

export { app, appCheck, ai, model };