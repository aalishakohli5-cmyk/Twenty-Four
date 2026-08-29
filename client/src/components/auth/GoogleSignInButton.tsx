import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getAuthErrorMessage } from '../../utils/authErrors';
import { Button } from '../ui/Button';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function GoogleSignInButton({
  onSuccess,
  className = '',
  size = 'md',
  label = 'CONTINUE WITH GOOGLE',
}: GoogleSignInButtonProps) {
  const { signInWithGoogle, isConfigured, configError, clearError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleClick = async () => {
    clearError();
    setLocalError(null);
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err) {
      setLocalError(getAuthErrorMessage(err));
    }
  };

  if (!isConfigured) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-accent-orange text-sm mb-3">
          {configError}
        </p>
        <Button variant="secondary" size={size} disabled>
          GOOGLE SIGN-IN UNAVAILABLE
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`
          w-full flex items-center justify-center gap-3
          bg-white text-black font-condensed font-semibold tracking-wider uppercase
          rounded-xl border border-white/20 transition-all
          hover:bg-white/90
          ${size === 'lg' ? 'px-8 py-4 text-base' : size === 'sm' ? 'px-4 py-2 text-xs' : 'px-6 py-3 text-sm'}
        `}
      >
        <GoogleIcon />
        {label}
      </motion.button>
      {localError && (
        <p className="text-accent-orange text-xs mt-2 text-center" role="alert">
          {localError}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}
