import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const REQUIRED_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

export type FirebaseEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

function readEnv(key: FirebaseEnvKey): string {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

/** Returns env variable names that are missing or still placeholders. */
export function getMissingFirebaseEnvVars(): FirebaseEnvKey[] {
  return REQUIRED_ENV_KEYS.filter((key) => {
    const value = readEnv(key);
    if (!value) return true;
    if (value.startsWith('PASTE_')) return true;
    if (value.startsWith('your_')) return true;
    return false;
  });
}

export const isFirebaseConfigured = getMissingFirebaseEnvVars().length === 0;

export const firebaseConfigError =
  getMissingFirebaseEnvVars().length > 0
    ? 'Firebase configuration is missing. Check your .env file and restart the dev server.'
    : null;

const firebaseConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('VITE_FIREBASE_APP_ID'),
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error('[Twenty Four] Firebase initialization failed:', error);
  }
} else if (import.meta.env.DEV) {
  console.warn('[Twenty Four]', firebaseConfigError);
  console.warn('[Twenty Four] Missing variables:', getMissingFirebaseEnvVars().join(', '));
}

export { app, auth };
