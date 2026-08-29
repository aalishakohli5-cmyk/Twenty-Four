import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, firebaseConfigError } from '../lib/firebase';
import { getAuthErrorMessage } from '../utils/authErrors';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  configError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    photoURL: user.photoURL || '',
  };
}

function requireAuth() {
  if (!auth) {
    throw new Error(firebaseConfigError || 'Firebase is not configured. Check your .env file.');
  }
  return auth;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? mapUser(firebaseUser) : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const firebaseAuth = requireAuth();
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(firebaseAuth, provider);
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const firebaseAuth = requireAuth();
      setError(null);
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    }
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        const firebaseAuth = requireAuth();
        setError(null);
        const credential = await createUserWithEmailAndPassword(
          firebaseAuth,
          email.trim(),
          password
        );

        const name = displayName?.trim();
        if (name) {
          await updateProfile(credential.user, { displayName: name });
        }
      } catch (err) {
        const message = getAuthErrorMessage(err);
        setError(message);
        throw err;
      }
    },
    []
  );

  const resetPassword = useCallback(async (email: string) => {
    try {
      const firebaseAuth = requireAuth();
      setError(null);
      await sendPasswordResetEmail(firebaseAuth, email.trim());
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    setError(null);
    await firebaseSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isFirebaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
        error,
        configError: firebaseConfigError,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
