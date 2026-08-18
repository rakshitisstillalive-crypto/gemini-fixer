import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { firebaseConfig, isFirebaseConfigured } from "./config";

export { isFirebaseConfigured };

function app() {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add your Firebase web config in src/integrations/firebase/config.ts (or VITE_FIREBASE_* env vars).",
    );
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const auth = new Proxy({} as ReturnType<typeof getAuth>, {
  get: (_t, prop, recv) => Reflect.get(getAuth(app()), prop, recv),
});

export const db = new Proxy({} as ReturnType<typeof getFirestore>, {
  get: (_t, prop, recv) => Reflect.get(getFirestore(app()), prop, recv),
});

export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider("microsoft.com");
