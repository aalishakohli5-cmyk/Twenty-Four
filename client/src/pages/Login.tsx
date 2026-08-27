import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/today");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-panel p-8">
        <h1 className="mb-6 text-xl font-semibold">Welcome back</h1>

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
          className="mb-6 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="mb-4 w-full rounded-lg bg-gold py-2.5 text-sm font-medium text-ink disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-xs text-cream/50">
          No account?{" "}
          <Link to="/signup" className="text-gold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
