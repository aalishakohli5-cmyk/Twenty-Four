import type { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  'auth/popup-blocked': 'Popup was blocked. Allow popups for this site and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase.',
};

export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as FirebaseError).code;
    if (AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
