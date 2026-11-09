
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

// Enable debug mode only during local development
if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

const siteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY;

if (!siteKey) {
  throw new Error("Missing reCAPTCHA Enterprise site key in .env");
}

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(siteKey),
  isTokenAutoRefreshEnabled: true
});

const ai = getAI(app, {
  backend: new GoogleAIBackend()
});

const model = getGenerativeModel(ai, {
  model: "gemini-3.6-flash"
});

export { app, appCheck, ai, model };
