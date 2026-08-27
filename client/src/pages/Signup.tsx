import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const earthVideo = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4";

function AuthScene({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <video className="auth-background-video" autoPlay loop muted playsInline preload="metadata" aria-hidden="true">
        <source src={earthVideo} type="video/mp4" />
      </video>
      <div className="auth-video-shade" aria-hidden="true" />
      <div className="auth-grain" aria-hidden="true" />
      <Link to="/" className="auth-brand" aria-label="Back to TwentyFour home">
        <span className="auth-mini-clock" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--auth-tick": index } as React.CSSProperties} />)}
          <b className="auth-mini-hand auth-mini-hour" /><b className="auth-mini-hand auth-mini-minute" /><b className="auth-mini-hand auth-mini-second" /><em />
        </span>
        <strong>TwentyFour</strong>
      </Link>
      {children}
      <span className="auth-footer">24 HOURS · YOUR DECISIONS · YOUR VALUE</span>
    </main>
  );
}

function GoogleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.62A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.41 13.94A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.94V7.44H3.06A10 10 0 0 0 2 12c0 1.61.38 3.14 1.06 4.56l3.35-2.62Z" />
    <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.94 5.44l3.35 2.62C7.2 7.7 9.4 5.94 12 5.94Z" />
  </svg>;
}

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try { await signUp(email, password); setDone(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to sign up"); }
    finally { setLoading(false); }
  }

  async function handleGoogleSignIn() {
    setError(""); setGoogleLoading(true);
    try { await signInWithGoogle(); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to continue with Google"); setGoogleLoading(false); }
  }

  if (done) return (
    <AuthScene><section className="auth-layout">
      <div className="auth-message"><span className="auth-kicker">ONE SMALL STEP</span><h1>Your time is ready<br /><em>to become visible.</em></h1><p>Confirm your email, then return to TwentyFour and begin shaping the hours ahead.</p></div>
      <div className="auth-card auth-confirmation-card"><div className="auth-card-head"><span>ALMOST THERE</span><h2>Check your inbox.</h2></div><p className="auth-confirmation-copy">We sent a confirmation link to <strong>{email}</strong>. Confirm it to activate your account.</p><Link to="/login" className="auth-submit"><span>Go to login</span><i><ArrowRight size={17} /></i></Link></div>
    </section></AuthScene>
  );

  return (
    <AuthScene><section className="auth-layout">
      <div className="auth-message"><span className="auth-kicker">YOUR HOURS, YOUR VALUE</span><h1>Begin with the<br /><em>next hour.</em></h1><p>Plan with intention, focus on what matters, and turn the time you invest into progress you can see.</p></div>
      <form onSubmit={handleSubmit} className="auth-card">
        <div className="auth-card-head"><span>START YOUR DAY</span><h2>Create your TwentyFour.</h2></div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="button" className="auth-google" onClick={handleGoogleSignIn} disabled={googleLoading || loading}>
          <GoogleIcon />{googleLoading ? <span>Opening Google...</span> : <span className="google-label">Continue with <b className="google-blue">G</b><b className="google-red">o</b><b className="google-yellow">o</b><b className="google-blue">g</b><b className="google-green">l</b><b className="google-red">e</b></span>}
        </button>
        <div className="auth-divider"><span>or continue with email</span></div>
        <label className="auth-field"><span>Email address</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" /></label>
        <label className="auth-field"><span>Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" placeholder="At least 6 characters" /></label>
        <button type="submit" disabled={loading || googleLoading} className="auth-submit"><span>{loading ? "Creating your day..." : "Create my TwentyFour"}</span><i><ArrowRight size={17} /></i></button>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </section></AuthScene>
  );
}
