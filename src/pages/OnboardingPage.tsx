import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Hero24Visual } from '../components/common/Hero24Visual';
import { useApp } from '../context/AppContext';

const screens = [
  { title: 'YOUR TIME IS WORTH SOMETHING.', highlight: 'TIME' },
  { title: '24 HOURS.\nEVERY DAY.', highlight: '24' },
  { title: 'PLAN IT.', highlight: 'PLAN' },
  { title: 'FOCUS.', highlight: 'FOCUS' },
  { title: 'EARN COINS.', highlight: 'COINS' },
  { title: 'BUILD YOUR WORLD.', highlight: 'WORLD' },
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

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
      navigate('/app/today');
    } else {
      setStep((s) => s + 1);
    }
  };

  const current = screens[step];

  return (
    <div className="min-h-screen bg-bg-primary bg-grid bg-grain flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-lime/5 rounded-full blur-[150px]" />
      </div>

      {step === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        >
          <Hero24Visual size="lg" animated={false} />
        </motion.div>
      )}

      <div className="relative z-10 w-full max-w-2xl text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-condensed text-xs tracking-[0.3em] text-text-secondary">
              {String(step + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')}
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mt-6 leading-[0.95] whitespace-pre-line">
              {current.title.split(current.highlight).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="text-accent-lime text-glow-lime">{current.highlight}</span>
                  )}
                </span>
              ))}
            </h1>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-12">
          {screens.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-accent-lime' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Button size="lg" onClick={handleNext}>
            {isLast ? 'START MY 24' : 'CONTINUE'}
          </Button>
          {!isLast && (
            <button
              onClick={() => { completeOnboarding(); navigate('/app/today'); }}
              className="text-text-secondary text-sm hover:text-text-primary transition-colors"
            >
              Skip intro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
