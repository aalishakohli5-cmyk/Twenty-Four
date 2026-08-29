import {
  getMissingSupabaseEnvVars,
  supabaseConfigError,
} from '../../lib/supabaseConfig';

export function SupabaseConfigNotice() {
  const missing = getMissingSupabaseEnvVars();

  if (missing.length === 0) return null;

  return (
    <div
      className="mb-6 rounded-xl border border-accent-orange/30 bg-accent-orange/10 px-4 py-3 text-left"
      role="alert"
    >
      <p className="font-medium text-sm">{supabaseConfigError}</p>
      {missing.length > 0 && (
        <p className="text-xs text-text-secondary mt-2">
          Missing: {missing.join(', ')}. Copy <code className="text-accent-lime">.env.example</code> to{' '}
          <code className="text-accent-lime">.env</code>, add your Supabase project values, then restart with{' '}
          <code className="text-accent-lime">npm run dev</code>.
        </p>
      )}
    </div>
  );
}
