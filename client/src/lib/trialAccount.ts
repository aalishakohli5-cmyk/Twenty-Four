export const TRIAL_ACCOUNT_EMAIL = 'whymonkeydluffy@gmail.com';
export const TRIAL_ACCOUNT_COINS = 90_000;

export function isTrialAccount(email?: string | null): boolean {
  return email?.trim().toLowerCase() === TRIAL_ACCOUNT_EMAIL;
}
