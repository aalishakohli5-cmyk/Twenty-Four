import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="max-w-sm">
          <h1 className="mb-2 text-xl font-semibold">Check your email</h1>
          <p className="mb-6 text-sm text-cream/60">
            We sent a confirmation link to {email}. Confirm it, then come back and log in.
          </p>
          <Link to="/login" className="text-gold">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-panel p-8">
        <h1 className="mb-6 text-xl font-semibold">Create your account</h1>

        {error && <p className="mb-4 text-sm text-coral">{error}</p>}

        <label className="mb-1 block text-xs text-cream/60">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-xs text-cream/60">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mb-6 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="mb-4 w-full rounded-lg bg-gold py-2.5 text-sm font-medium text-ink disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-center text-xs text-cream/50">
          Already have an account?{" "}
          <Link to="/login" className="text-gold">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
