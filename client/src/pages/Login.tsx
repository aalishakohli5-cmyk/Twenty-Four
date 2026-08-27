import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clock3 } from "lucide-react";
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
    <main className="auth-page">
      <video className="auth-background-video" autoPlay loop muted playsInline preload="metadata" aria-hidden="true">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4" type="video/mp4" />
      </video>
      <div className="auth-video-shade" aria-hidden="true" />
      <div className="auth-grain" aria-hidden="true" />

      <Link to="/" className="auth-brand" aria-label="Back to TwentyFour home">
        <span><Clock3 size={17} /></span>
        <strong>TwentyFour</strong>
      </Link>

      <section className="auth-layout">
        <div className="auth-message">
          <span className="auth-kicker">TIME = MONEY</span>
          <h1>Return to the<br /><em>hours that matter.</em></h1>
          <p>Your plans, focus sessions and earned progress are waiting exactly where you left them.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-card">
          <div className="auth-card-head">
            <span>WELCOME BACK</span>
            <h2>Log in to your day.</h2>
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <label className="auth-field">
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" disabled={loading} className="auth-submit">
            <span>{loading ? "Logging in..." : "Enter TwentyFour"}</span>
            <i><ArrowRight size={17} /></i>
          </button>

          <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
        </form>
      </section>

      <span className="auth-footer">24 HOURS · YOUR DECISIONS · YOUR VALUE</span>
    </main>
  );
}
