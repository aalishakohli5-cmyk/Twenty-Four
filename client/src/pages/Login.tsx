import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function OrbitTwentyFour() {
  const currentHour = new Date().getHours();

  return (
    <motion.div
      className="auth-orbit-visual"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Twenty-four hour orbit"
    >
      <div className="auth-orbit-glow" />
      <div className="auth-orbit-ring" aria-hidden="true">
        {Array.from({ length: 24 }, (_, hour) => {
          const angle = (hour / 24) * Math.PI * 2;
          return (
            <i
              key={hour}
              className={hour === currentHour ? "active" : ""}
              style={{
                left: `${50 + 44 * Math.sin(angle)}%`,
                top: `${50 - 44 * Math.cos(angle)}%`,
              }}
            />
          );
        })}
      </div>
      <div className="auth-orbit-satellites" aria-hidden="true">
        <b />
        <b />
        <b />
      </div>
      <div className="auth-orbit-number">
        <span><strong>2</strong><strong>4</strong></span>
        <small>HOURS · YOURS</small>
      </div>
    </motion.div>
  );
}

export default function Login() {
  const { user, signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/app/today", { replace: true });
  }, [navigate, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate("/app/today");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to continue with Google");
      setGoogleLoading(false);
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
        <span className="auth-mini-clock" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--auth-tick": index } as React.CSSProperties} />)}
          <b className="auth-mini-hand auth-mini-hour" />
          <b className="auth-mini-hand auth-mini-minute" />
          <b className="auth-mini-hand auth-mini-second" />
          <em />
        </span>
        <strong>TwentyFour</strong>
      </Link>

      <section className="auth-layout">
        <div className="auth-message auth-orbit-panel">
          <span className="auth-kicker">EVERY HOUR HAS VALUE</span>
          <h1 className="auth-orbit-title">Own your <em>24.</em></h1>
          <OrbitTwentyFour />
          <p>Plan intentionally. Focus deeply. Earn visible progress—one hour at a time.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-card">
          <div className="auth-card-head">
            <span>WELCOME BACK</span>
            <h2>Log in to your day.</h2>
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="button" className="auth-google" onClick={handleGoogleSignIn} disabled={googleLoading || loading}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
              <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.62A10 10 0 0 0 12 22Z" />
              <path fill="#FBBC05" d="M6.41 13.94A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.94V7.44H3.06A10 10 0 0 0 2 12c0 1.61.38 3.14 1.06 4.56l3.35-2.62Z" />
              <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.94 5.44l3.35 2.62C7.2 7.7 9.4 5.94 12 5.94Z" />
            </svg>
            {googleLoading ? (
              <span>Opening Google...</span>
            ) : (
              <span className="google-label">Continue with <b className="google-blue">G</b><b className="google-red">o</b><b className="google-yellow">o</b><b className="google-blue">g</b><b className="google-green">l</b><b className="google-red">e</b></span>
            )}
          </button>

          <div className="auth-divider"><span>or continue with email</span></div>

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
