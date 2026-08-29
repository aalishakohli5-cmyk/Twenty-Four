import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { getAuthErrorMessage, isValidEmail } from '../../utils/authErrors';

interface EmailAuthFormProps {
  onSuccess?: () => void;
  className?: string;
}

type AuthMode = 'signin' | 'signup' | 'reset';

export function EmailAuthForm({ onSuccess, className = '' }: EmailAuthFormProps) {
  const { signInWithEmail, signUpWithEmail, resetPassword, isConfigured, configError, clearError } =
    useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    if (!isConfigured) {
      setLocalError(configError || 'Supabase configuration is missing. Check your .env file.');
      return;
    }

    if (!email.trim()) {
      setLocalError('Email is required.');
      return;
    }

    if (!isValidEmail(email)) {
      setLocalError('Enter a valid email address.');
      return;
    }

    if (mode !== 'reset' && password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        onSuccess?.();
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, name || undefined);
        onSuccess?.();
      } else {
        await resetPassword(email);
        setSuccessMessage('Password reset email sent. Check your inbox.');
      }
    } catch (err) {
      setLocalError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'auth-input w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-accent-lime/50 focus:outline-none transition-colors';

  return (
    <div className={className}>
      {mode !== 'reset' ? (
        <div className="flex rounded-xl bg-white/5 p-1 mb-6">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className={`flex-1 py-2.5 rounded-lg font-condensed text-xs tracking-widest transition-colors ${
              mode === 'signin'
                ? 'bg-accent-lime text-black font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2.5 rounded-lg font-condensed text-xs tracking-widest transition-colors ${
              mode === 'signup'
                ? 'bg-accent-lime text-black font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>
      ) : (
        <div className="mb-6 text-left">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className="font-condensed text-xs tracking-widest text-text-secondary hover:text-accent-lime transition-colors"
          >
            ← BACK TO SIGN IN
          </button>
          <h2 className="font-display text-xl font-bold mt-3">FORGOT PASSWORD</h2>
          <p className="text-text-secondary text-sm mt-1">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {mode === 'signup' && (
          <div>
            <label htmlFor="auth-name" className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">
              NAME
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
                autoComplete="name"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">
            EMAIL
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={inputClass}
              autoComplete="email"
              required
            />
          </div>
        </div>

        {mode !== 'reset' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="auth-password" className="font-condensed text-xs tracking-widest text-text-secondary">
                PASSWORD
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="font-condensed text-[10px] tracking-widest text-accent-lime hover:underline"
                >
                  FORGOT PASSWORD?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={6}
              />
            </div>
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <label htmlFor="auth-confirm" className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              <input
                id="auth-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>
          </div>
        )}

        {localError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent-orange text-sm"
            role="alert"
          >
            {localError}
          </motion.p>
        )}

        {successMessage && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent-lime text-sm"
            role="status"
          >
            {successMessage}
          </motion.p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={submitting || !isConfigured}>
          {submitting
            ? 'PLEASE WAIT...'
            : mode === 'signin'
            ? 'SIGN IN'
            : mode === 'signup'
            ? 'CREATE ACCOUNT'
            : 'SEND RESET LINK'}
        </Button>
      </form>
    </div>
  );
}
