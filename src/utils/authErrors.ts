const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Invalid email or password.',
  email_not_confirmed: 'Confirm your email before signing in.',
  user_already_exists: 'An account with this email already exists.',
  weak_password: 'Password must be at least 6 characters.',
  over_request_rate_limit: 'Too many attempts. Try again later.',
  signup_disabled: 'Sign-up is currently disabled.',
  provider_disabled: 'This sign-in method is not enabled.',
};

export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const err = error as { code?: string; message?: string };
    if (err.code && AUTH_ERROR_MESSAGES[err.code]) {
      return AUTH_ERROR_MESSAGES[err.code];
    }
    if (err.message) return err.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
