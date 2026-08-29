import { readEnvUrl, readEnvValue } from './env';

const REQUIRED_ENV_KEYS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'] as const;

export type SupabaseEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

function readEnv(key: SupabaseEnvKey): string {
  const raw = import.meta.env[key];
  return key === 'VITE_SUPABASE_URL' ? readEnvUrl(raw) : readEnvValue(raw);
}

export function getMissingSupabaseEnvVars(): SupabaseEnvKey[] {
  return REQUIRED_ENV_KEYS.filter((key) => !readEnv(key));
}

export const isSupabaseConfigured = getMissingSupabaseEnvVars().length === 0;

export const supabaseConfigError =
  getMissingSupabaseEnvVars().length > 0
    ? 'Supabase configuration is missing. Check your .env file and restart the dev server.'
    : null;

export function getSupabaseUrl(): string {
  return readEnv('VITE_SUPABASE_URL');
}

export function getSupabasePublishableKey(): string {
  return readEnv('VITE_SUPABASE_PUBLISHABLE_KEY');
}

export function isApiConfigured(): boolean {
  return readEnvUrl(import.meta.env.VITE_API_URL).length > 0;
}

export function getApiUrl(): string {
  return readEnvUrl(import.meta.env.VITE_API_URL);
}
