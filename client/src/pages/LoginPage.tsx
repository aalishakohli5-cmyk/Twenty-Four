import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { EmailAuthForm } from '../components/auth/EmailAuthForm';
import { SupabaseConfigNotice } from '../components/auth/SupabaseConfigNotice';
import { LandingHeroVisual } from '../components/landing/LandingHeroVisual';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { state } = useApp();

  const from = (location.state as { from?: string } | null)?.from;
  const destination =
    from || (state.onboardingComplete ? '/app/today' : '/onboarding');

  useEffect(() => {
    if (!loading && user) {
      navigate(destination, { replace: true });
    }
  }, [user, loading, destination, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <span className="font-display text-5xl text-[#c8ff00]">24</span>
      </div>
    );
  }

  return (
    <div className="auth-page min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      <div className="landing-bg-base fixed inset-0" aria-hidden />
      <div className="landing-bg-grid fixed inset-0 opacity-30" aria-hidden />
      <div className="landing-bg-glow fixed inset-0" aria-hidden />
      <div className="landing-grain fixed inset-0" aria-hidden />

      <Link
        to="/"
        className="absolute top-6 left-6 z-20 font-display text-lg tracking-tight text-white"
      >
        TWENTY<span className="text-[#c8ff00]">FOUR</span>
      </Link>

      <div className="auth-page-inner relative z-10 min-h-screen grid lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col items-center justify-center p-12 xl:p-16 border-r border-white/5"
        >
          <div className="w-full max-w-lg">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#c8ff00] mb-4">EVERY HOUR HAS VALUE</p>
            <h1 className="font-display text-5xl xl:text-6xl font-bold tracking-tight leading-[0.95] mb-6">
              OWN YOUR <span className="text-[#c8ff00]">24.</span>
            </h1>
            <p className="text-zinc-400 text-base max-w-md leading-relaxed">
              Plan intentionally. Focus deeply. Earn coins. Build your world one hour at a time.
            </p>
            <div className="mt-12 max-w-md mx-auto">
              <LandingHeroVisual />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center px-5 py-20 lg:py-16 lg:px-12 xl:px-20"
        >
          <div className="w-full max-w-md">
            <p className="text-sm font-medium tracking-wide text-[#c8ff00]/90 mb-2 lg:hidden">
              no cap — your 24 starts here ✨
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight text-white">
              lock in.
            </h2>
            <p className="text-zinc-400 text-sm mt-3 mb-8 leading-relaxed">
              Sign in to save coins, themes, and your whole daily grind across devices.
            </p>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-8 shadow-[0_0_60px_rgba(200,255,0,0.06)]">
              <SupabaseConfigNotice />
              <EmailAuthForm onSuccess={() => navigate(destination)} />

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </div>

              <GoogleSignInButton size="md" onSuccess={() => navigate(destination)} />
            </div>

            <p className="text-center text-xs text-zinc-500 mt-6">
              vibes only · your data stays on your device until you sync
            </p>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-zinc-300 hover:border-[#c8ff00]/40 hover:text-white transition-colors"
              >
                ← back home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
