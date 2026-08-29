import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Hero24Visual } from '../components/common/Hero24Visual';
import { useApp } from '../context/AppContext';

const screens = [
  {
    badge: 'main character era',
    title: 'Your time is worth',
    highlight: 'something.',
    sub: 'Stop doom-scrolling. Start stacking wins — one hour at a time.',
    showVisual: true,
  },
  {
    badge: '24/7 but make it 24',
    title: '24 hours.',
    highlight: 'Every day.',
    sub: 'Same clock as everyone else. Different energy when you actually plan it.',
    showVisual: false,
  },
  {
    badge: 'no cap',
    title: 'Plan',
    highlight: 'it.',
    sub: 'Drop tasks into real hours. Your day stops feeling like chaos.',
    showVisual: false,
  },
  {
    badge: 'lock in',
    title: 'Focus',
    highlight: 'mode.',
    sub: 'Deep work sessions that actually count — not just vibes.',
    showVisual: false,
  },
  {
    badge: 'get paid (virtually)',
    title: 'Earn',
    highlight: 'coins.',
    sub: 'Focus + finish tasks = coins in your wallet. Low effort grind, high reward.',
    showVisual: false,
  },
  {
    badge: 'your world, your rules',
    title: 'Build your',
    highlight: 'world.',
    sub: 'Unlock themes and companions in The Vault. Make the app feel like yours.',
    showVisual: false,
  },
];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding, state } = useApp();

  useEffect(() => {
    if (state.onboardingComplete) {
      navigate('/app/today', { replace: true });
    }
  }, [state.onboardingComplete, navigate]);

  const isLast = step === screens.length - 1;
  const current = screens[step];

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
      navigate('/app/today');
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="onboarding-page min-h-screen bg-[#050505] text-white overflow-hidden relative flex flex-col">
      <div className="landing-bg-base fixed inset-0" aria-hidden />
      <div className="landing-bg-grid fixed inset-0 opacity-25" aria-hidden />
      <div className="landing-bg-glow fixed inset-0" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-5 pt-6 md:px-10 md:pt-8">
        <span className="font-display text-lg tracking-tight">
          TWENTY<span className="text-[#c8ff00]">FOUR</span>
        </span>
        <span className="font-mono text-[11px] tracking-[0.25em] text-zinc-500">
          {String(step + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')}
        </span>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-8 md:px-10">
        <div className="w-full max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-10 shadow-[0_0_80px_rgba(200,255,0,0.06)]"
            >
              {current.showVisual && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-8 flex justify-center"
                >
                  <div className="w-full max-w-[220px] md:max-w-[260px]">
                    <Hero24Visual size="md" animated />
                  </div>
                </motion.div>
              )}

              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c8ff00]/25 bg-[#c8ff00]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#d9ff66]">
                  <Sparkles className="w-3 h-3" aria-hidden />
                  {current.badge}
                </span>
              </div>

              <h1 className="text-center font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                {current.title}{' '}
                <span className="text-[#c8ff00] italic font-serif">{current.highlight}</span>
              </h1>

              <p className="mt-4 text-center text-sm md:text-base text-zinc-400 leading-relaxed max-w-md mx-auto">
                {current.sub}
              </p>

              <div className="flex justify-center gap-2 mt-8">
                {screens.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? 'w-10 bg-[#c8ff00]' : i < step ? 'w-2 bg-[#c8ff00]/40' : 'w-2 bg-white/15'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-3">
                <Button size="lg" className="w-full max-w-xs" onClick={handleNext}>
                  {isLast ? 'START MY 24 ✦' : 'CONTINUE →'}
                </Button>
                {!isLast && (
                  <button
                    type="button"
                    onClick={() => {
                      completeOnboarding();
                      navigate('/app/today');
                    }}
                    className="text-zinc-500 text-xs uppercase tracking-[0.2em] hover:text-zinc-300 transition-colors"
                  >
                    Skip intro
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
