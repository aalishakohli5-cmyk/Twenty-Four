import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { requireSupabaseClient, supabase } from '../lib/supabaseClient';
import {
  isSupabaseConfigured,
  supabaseConfigError,
} from '../lib/supabaseConfig';
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
  const metadata = user.user_metadata as { full_name?: string; avatar_url?: string } | undefined;
  return {
    uid: user.id,
    email: user.email || '',
    displayName:
      metadata?.full_name ||
      user.email?.split('@')[0] ||
      'User',
    photoURL: metadata?.avatar_url || '',
  };
}

function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(supabaseConfigError || 'Supabase is not configured. Check your .env file.');
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ? mapUser(data.session.user) : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapUser(session.user) : null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const signInWithGoogle = useCallback(async () => {
    try {
      requireSupabase();
      setError(null);
      const { error: authError } = await requireSupabaseClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });
      if (authError) throw authError;
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      requireSupabase();
      setError(null);
      const { error: authError } = await requireSupabaseClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    }
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        requireSupabase();
        setError(null);
        const name = displayName?.trim();
        const { error: authError } = await requireSupabaseClient().auth.signUp({
          email: email.trim(),
          password,
          options: name ? { data: { full_name: name } } : undefined,
        });
        if (authError) throw authError;
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
      requireSupabase();
      setError(null);
      const { error: authError } = await requireSupabaseClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });
      if (authError) throw authError;
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setError(null);
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
        error,
        configError: supabaseConfigError,
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
