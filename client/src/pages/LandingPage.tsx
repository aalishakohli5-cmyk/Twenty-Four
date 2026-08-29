import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatTime } from '../utils/time';
import { useCurrentTime } from '../hooks/useFocusTimer';
import { LandingHeroVisual } from '../components/landing/LandingHeroVisual';
import { LandingTimelineDemo } from '../components/landing/LandingTimelineDemo';

const NAV = [
  { label: 'Benefits', href: '#top', scroll: true, appear: 'appear--scale', delay: '0.16s' },
  { label: 'How It Works', href: '#how-it-works', scroll: true, appear: 'appear--soft', delay: '0.28s' },
  { label: 'FAQs', href: '#how-it-works', scroll: true, appear: 'appear--scale', delay: '0.40s' },
  { label: 'Pricing', href: '/login', scroll: false, appear: 'appear--soft', delay: '0.52s' },
];

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <g transform="rotate(-30 12 12)">
        <circle cx="7.3" cy="3.2" r="1.45" />
        <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
        <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
        <circle cx="16.7" cy="20.8" r="1.45" />
      </g>
    </svg>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const { setLandingSeen, state } = useApp();
  const { user } = useAuth();
  const now = useCurrentTime();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [ctaHover, setCtaHover] = useState(false);
  const [ctaCelebrate, setCtaCelebrate] = useState(false);
  const [orbitBoost, setOrbitBoost] = useState(false);
  const [exitTransition, setExitTransition] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const startPath = user
    ? state.onboardingComplete
      ? '/app/today'
      : '/onboarding'
    : '/login';

  const scrollToSection = useCallback((id: string) => {
    document.body.classList.remove('menu-open');
    const el = document.getElementById(id.replace('#', ''));
    if (!el) return;
    const headerOffset = 88;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const handleSeeInAction = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('how-it-works');
  };

  const handleStartFree = (e: React.MouseEvent) => {
    if (startPath !== '/login') {
      setLandingSeen();
      return;
    }
    e.preventDefault();
    setCtaCelebrate(true);
    setOrbitBoost(true);
    setExitTransition(true);
    exitTimer.current = setTimeout(() => {
      setLandingSeen();
      navigate('/login');
    }, 680);
  };

  useEffect(() => {
    document.documentElement.classList.add('landing-active');
    return () => {
      document.documentElement.classList.remove('landing-active');
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, []);

  useEffect(() => {
    const appearEls = document.querySelectorAll('.appear');
    appearEls.forEach((el) => {
      el.addEventListener('animationend', () => el.classList.add('is-in'), { once: true });
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const running = [...appearEls].some((el) => {
          const anims = el.getAnimations?.() ?? [];
          return anims.some((a) => a.playState === 'running' || a.playState === 'finished');
        });
        if (!running) appearEls.forEach((el) => el.classList.add('is-in'));
      });
    });

    const safety = setTimeout(() => {
      document.querySelectorAll('.appear').forEach((el) => el.classList.add('is-in'));
    }, 1600);
    return () => clearTimeout(safety);
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      document.body.classList.remove('menu-open');
      burgerRef.current?.setAttribute('aria-expanded', 'false');
      burgerRef.current?.setAttribute('aria-label', 'Open menu');
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    const onResize = () => {
      if (window.matchMedia('(min-width: 901px)').matches) closeMenu();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const toggleMenu = () => {
    const open = document.body.classList.toggle('menu-open');
    burgerRef.current?.setAttribute('aria-expanded', String(open));
    burgerRef.current?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  return (
    <div className={`landing ${exitTransition ? 'landing--exit' : ''}`}>
      <div className="landing-bg-base" aria-hidden />
      <div className="landing-bg-grid" aria-hidden />
      <div className="landing-bg-glow" aria-hidden />
      <div className="landing-bg-lines" aria-hidden />
      <div className="landing-bg-particles" aria-hidden />
      <div className="landing-grain" aria-hidden />
      <div className="landing-photo appear" aria-hidden />

      <div className="landing-page">
        <div className="menu-backdrop" onClick={() => document.body.classList.remove('menu-open')} aria-hidden />

        <header className="landing-header">
          <Link to="/" className="landing-logo appear appear--scale" aria-label="Twenty Four" style={{ ['--d' as string]: '0.08s' }}>
            <LogoMark />
            <span>
              Twenty<span className="landing-logo-suffix">Four</span>
            </span>
          </Link>

          <nav id="site-nav" className="landing-nav" aria-label="Primary">
            {NAV.map((item) =>
              item.scroll ? (
                <a
                  key={item.label}
                  href={item.href}
                  className={`landing-nav-link appear ${item.appear}`}
                  style={{ ['--d' as string]: item.delay }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href.replace('#', ''));
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`landing-nav-link appear ${item.appear}`}
                  style={{ ['--d' as string]: item.delay }}
                  onClick={() => document.body.classList.remove('menu-open')}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <Link
            to={startPath}
            onClick={(e) => {
              if (startPath === '/login') handleStartFree(e);
              else setLandingSeen();
            }}
            className="landing-btn landing-btn-primary landing-header-cta appear appear--scale"
            style={{ ['--d' as string]: '0.34s' }}
          >
            Start for Free
          </Link>

          <button
            ref={burgerRef}
            type="button"
            className="landing-burger appear appear--scale"
            style={{ ['--d' as string]: '0.34s' }}
            aria-controls="site-nav"
            aria-expanded="false"
            aria-label="Open menu"
            onClick={toggleMenu}
          >
            <span /><span /><span />
          </button>
        </header>

        <main className="landing-hero" id="top">
          <div className="landing-hero-inner">
            <div className="landing-hero-copy">
              <div className="landing-badge appear appear--pop" style={{ ['--d' as string]: '0.22s' }}>
                <svg className="landing-badge-star" width="18" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
                </svg>
                Every hour has value
              </div>

              <h1 className="landing-h1">
                <span className="landing-headline-line appear appear--mask" style={{ ['--d' as string]: '0.42s' }}>
                  Own <em>your 24</em> with
                </span>
                <span className="landing-headline-line appear appear--mask" style={{ ['--d' as string]: '0.62s' }}>
                  focus that actually pays.
                </span>
              </h1>

              <p className="landing-lede appear appear--soft landing-lede-anim" style={{ ['--d' as string]: '0.82s' }}>
                Plan your day, run deep focus sessions, earn coins, and unlock themes in The Vault — all in one minimal black canvas.
              </p>

              <div className="landing-hero-actions">
                {startPath === '/login' ? (
                  <button
                    type="button"
                    onClick={handleStartFree}
                    onMouseEnter={() => setCtaHover(true)}
                    onMouseLeave={() => setCtaHover(false)}
                    onFocus={() => setCtaHover(true)}
                    onBlur={() => setCtaHover(false)}
                    className="landing-btn landing-btn-primary landing-btn-hero appear appear--btn"
                    style={{ ['--d' as string]: '0.96s' }}
                  >
                    Start for Free
                    <span className="landing-btn-arrow" aria-hidden>→</span>
                  </button>
                ) : (
                  <Link
                    to={startPath}
                    onClick={setLandingSeen}
                    className="landing-btn landing-btn-primary landing-btn-hero appear appear--btn"
                    style={{ ['--d' as string]: '0.96s' }}
                  >
                    Start for Free
                    <span className="landing-btn-arrow" aria-hidden>→</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSeeInAction}
                  className="landing-btn landing-btn-ghost landing-btn-hero appear appear--side"
                  style={{ ['--d' as string]: '1.10s' }}
                >
                  See it in action
                </button>
              </div>
            </div>

            <div className="landing-hero-visual appear appear--soft" style={{ ['--d' as string]: '0.72s' }}>
              <LandingHeroVisual ctaAlert={ctaHover} ctaCelebrate={ctaCelebrate} orbitBoost={orbitBoost} />
            </div>
          </div>
        </main>

        <LandingTimelineDemo />

        <footer className="landing-stats">
          <div className="landing-stat appear appear--stat" style={{ ['--d' as string]: '1.12s' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#statGrad1)" />
              <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#statGrad2)" />
              <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
              <defs>
                <linearGradient id="statGrad1" x1="3" y1="2" x2="14" y2="22">
                  <stop stopColor="#ffffff" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#3a3a3a" stopOpacity="0.62" />
                </linearGradient>
                <linearGradient id="statGrad2" x1="13" y1="2" x2="24" y2="22">
                  <stop stopColor="#3a3a3a" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0.62" />
                </linearGradient>
              </defs>
            </svg>
            24 hours · one day
          </div>

          <div className="landing-stat appear appear--stat" style={{ ['--d' as string]: '1.28s' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
              <path d="M12 7.1v7.4M8.15 12.35L12 16.2l3.85-3.85" stroke="#111" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            10+ coins per focus block
          </div>

          <div className="landing-stat appear appear--stat" style={{ ['--d' as string]: '1.44s' }}>
            <svg className="landing-stat-icon-wide" width="38" height="21" viewBox="0 0 40 22" aria-hidden>
              <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
              <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
              <circle cx="8.4" cy="10.2" r="0.7" fill="#1a1a1a" />
              <circle cx="12" cy="10.2" r="0.7" fill="#1a1a1a" />
              <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
              <circle cx="18.2" cy="10.2" r="1.7" fill="#111" />
              <circle cx="22.2" cy="10.2" r="1.7" fill="#111" />
              <ellipse cx="20.2" cy="13.2" rx="2.2" ry="1.1" fill="#111" />
              <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
              <text x="30.2" y="15.1" fill="#fff" fontSize="12.5" fontWeight="700" textAnchor="middle" fontFamily="Inter,sans-serif">e</text>
            </svg>
            5 themes in The Vault · {formatTime(now)}
          </div>
        </footer>
      </div>
    </div>
  );
}
