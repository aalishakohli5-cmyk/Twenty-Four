import { useCurrentTime } from '../../hooks/useFocusTimer';
import { formatHour, getCurrentHour } from '../../utils/time';

const DEMO_SLOTS = [
  { hour: 7, label: 'Morning plan', coins: 10, type: 'planned' as const },
  { hour: 9, label: 'Deep focus — React', coins: 20, type: 'focus' as const },
  { hour: 12, label: 'Open slot', coins: 10, type: 'open' as const },
  { hour: 14, label: 'Study session', coins: 15, type: 'focus' as const },
  { hour: 18, label: 'Wallet reward', coins: 25, type: 'reward' as const },
];

export function LandingTimelineDemo() {
  const now = useCurrentTime();
  const currentHour = getCurrentHour();

  return (
    <section id="how-it-works" className="landing-demo" aria-labelledby="landing-demo-title">
      <div className="landing-demo-inner">
        <div className="landing-demo-header">
          <span className="landing-demo-kicker appear appear--soft">HOW IT WORKS</span>
          <h2 id="landing-demo-title" className="landing-demo-title appear appear--mask">
            YOUR NEXT <span className="landing-accent">24</span> STARTS NOW.
          </h2>
          <p className="landing-demo-lede appear appear--soft">
            Plan every hour. Run focus blocks. Earn coins. Unlock themes in The Vault — one intentional day at a time.
          </p>
        </div>

        <div className="landing-demo-grid appear appear--soft">
          <div className="landing-demo-steps">
            {['PLAN.', 'FOCUS.', 'EARN.', 'BUILD.'].map((step, i) => (
              <div key={step} className="landing-demo-step" style={{ ['--i' as string]: i }}>
                <span className="landing-demo-step-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="landing-demo-step-label">{step}</span>
              </div>
            ))}
          </div>

          <div className="landing-demo-timeline">
            <div className="landing-demo-now">
              <span className="landing-demo-now-label">NOW</span>
              <span className="landing-demo-now-time">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            </div>
            <div className="landing-demo-track">
              {Array.from({ length: 24 }, (_, hour) => {
                const demo = DEMO_SLOTS.find((s) => s.hour === hour);
                const isNow = hour === currentHour;
                const isPast = hour < currentHour;
                return (
                  <div
                    key={hour}
                    className={`landing-demo-hour ${isNow ? 'is-now' : ''} ${isPast ? 'is-past' : ''} ${demo ? `is-${demo.type}` : 'is-open'}`}
                    title={demo?.label ?? `${formatHour(hour)} — tap to plan`}
                  >
                    <span className="landing-demo-hour-num">{String(hour).padStart(2, '0')}</span>
                    {demo && <span className="landing-demo-hour-coins">+{demo.coins}</span>}
                  </div>
                );
              })}
            </div>
            <div className="landing-demo-legend">
              <span><i className="dot dot-lime" /> Focus</span>
              <span><i className="dot dot-orange" /> Coins</span>
              <span><i className="dot dot-open" /> Open</span>
            </div>
          </div>
        </div>

        <div className="landing-marquee" aria-hidden>
          <div className="landing-marquee-track">
            <span>EVERY HOUR HAS VALUE</span>
            <span>TIME IS MOVING →</span>
            <span>PLAN YOUR 24</span>
            <span>FOCUS &gt; BUSY</span>
            <span>EVERY HOUR HAS VALUE</span>
            <span>TIME IS MOVING →</span>
            <span>PLAN YOUR 24</span>
            <span>FOCUS &gt; BUSY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
