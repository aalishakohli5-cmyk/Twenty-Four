import { AlertCircle } from 'lucide-react';
import { firebaseConfigError, getMissingFirebaseEnvVars } from '../../lib/firebase';

export function FirebaseConfigNotice() {
  const missing = getMissingFirebaseEnvVars();

  if (missing.length === 0) return null;

  return (
    <div
      className="mb-6 rounded-xl border border-accent-orange/30 bg-accent-orange/10 p-4 text-left"
      role="alert"
    >
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">{firebaseConfigError}</p>
          <p className="text-text-secondary text-xs mt-2">
            Open the project root file <code className="text-accent-lime">.env</code> and paste
            your Firebase Web App values. Then restart with <code className="text-accent-lime">npm run dev</code>.
          </p>
          <ul className="mt-3 space-y-1 text-xs font-mono text-text-secondary">
            {missing.map((key) => (
              <li key={key}>• {key}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
