const REQUIRED_ENV_KEYS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'] as const;

export type SupabaseEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

function readEnv(key: SupabaseEnvKey): string {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

export function getMissingSupabaseEnvVars(): SupabaseEnvKey[] {
  return REQUIRED_ENV_KEYS.filter((key) => !readEnv(key));
}

export const isSupabaseConfigured = getMissingSupabaseEnvVars().length === 0;

export const supabaseConfigError =
  getMissingSupabaseEnvVars().length > 0
    ? 'Supabase configuration is missing. Check your .env file and restart the dev server.'
    : null;

export function isApiConfigured(): boolean {
  const url = import.meta.env.VITE_API_URL;
  return typeof url === 'string' && url.trim().length > 0;
}
