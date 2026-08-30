import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Clock3, Coins, Sparkles } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

function WordsPullUp({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span ref={ref} className={`word-line ${className}`}>
      {text.split(" ").map((word, index) => (
        <span className="word-mask" key={`${word}-${index}`}>
          <motion.span
            className="word-piece"
            initial={{ y: "110%" }}
            animate={visible ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.8, delay: delay + index * 0.075, ease }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function StyledWords({ segments }: { segments: { text: string; className?: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "-15%" });
  let wordIndex = 0;

  return (
    <div ref={ref} className="styled-words">
      {segments.flatMap((segment) =>
        segment.text.split(" ").map((word) => {
          const index = wordIndex++;
          return (
            <span className="word-mask" key={`${word}-${index}`}>
              <motion.span
                className={`word-piece ${segment.className ?? ""}`}
                initial={{ y: "115%" }}
                animate={visible ? { y: 0 } : { y: "115%" }}
                transition={{ duration: 0.75, delay: index * 0.06, ease }}
              >
                {word}&nbsp;
              </motion.span>
            </span>
          );
        }),
      )}
    </div>
  );
}

function TickingTwentyFour({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`ticking-24 ${compact ? "ticking-24-compact" : ""}`} aria-label="TwentyFour clock">
      <span className="clock-face">
        {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--tick": index } as React.CSSProperties} />)}
        <b className="clock-hand clock-hour" />
        <b className="clock-hand clock-minute" />
        <b className="clock-hand clock-second" />
        <em>2</em>
      </span>
      <strong>4</strong>
      <span className="coin-stack" aria-hidden="true"><i /><i /><i /></span>
    </span>
  );
}

function AmbientClock() {
  return (
    <span className="ambient-clock" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--tick": index } as React.CSSProperties} />)}
      <b className="ambient-hand ambient-hour" />
      <b className="ambient-hand ambient-minute" />
      <b className="ambient-hand ambient-second" />
      <em />
    </span>
  );
}

function formatPreviewHour(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  if (normalized === 0) return "12 AM";
  if (normalized === 12) return "12 PM";
  return `${normalized % 12} ${normalized < 12 ? "AM" : "PM"}`;
}

const previewPlans: Record<number, { title: string; reward: string }> = {
  8: { title: "Deep work", reward: "+20" },
  13: { title: "Reset", reward: "+5" },
  18: { title: "Build session", reward: "+20" },
};

function LandingDayPreview() {
  const now = new Date();
  const currentHour = now.getHours();
  const [selectedHour, setSelectedHour] = useState(currentHour);
  const selectedPlan = previewPlans[selectedHour];

  return (
    <section className="day-preview-section" aria-labelledby="day-preview-title">
      <motion.div
        className="day-preview-shell"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease }}
      >
        <header className="day-preview-head">
          <div>
            <span>ONE DAY · CLEARLY YOURS</span>
            <h2 id="day-preview-title">Your next <em>24</em><br />starts now.</h2>
            <p>Plan the hour, protect your focus, and watch effort become visible value.</p>
          </div>
          <time>
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            <small>LOCAL TIME</small>
          </time>
        </header>

        <div className="day-preview-workspace">
          <ol className="day-preview-steps">
            {["PLAN", "FOCUS", "EARN", "UNLOCK"].map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>
            ))}
          </ol>

          <div className="day-preview-board">
            <div className="day-preview-track" aria-label="Interactive 24-hour preview">
              {Array.from({ length: 24 }, (_, hour) => (
                <button
                  type="button"
                  key={hour}
                  className={`day-preview-hour ${hour === currentHour ? "is-now" : ""} ${hour === selectedHour ? "is-selected" : ""} ${previewPlans[hour] ? "is-planned" : ""}`}
                  onMouseEnter={() => setSelectedHour(hour)}
                  onFocus={() => setSelectedHour(hour)}
                  onClick={() => setSelectedHour(hour)}
                  aria-label={`Preview ${formatPreviewHour(hour)}`}
                >
                  <span>{String(hour).padStart(2, "0")}</span><i />
                </button>
              ))}
            </div>

            <div className="day-preview-selection">
              <div>
                <span>{formatPreviewHour(selectedHour)} — {formatPreviewHour(selectedHour + 1)}</span>
                <strong>{selectedPlan?.title ?? "Open hour"}</strong>
                <small>{selectedPlan ? `${selectedPlan.reward} COINS READY` : "CHOOSE IT · NAME IT · MAKE IT COUNT"}</small>
              </div>
              <Link to="/signup">Plan this hour <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

const featureCards = [
  {
    number: "01",
    icon: Clock3,
    title: "A day you can see.",
    bullets: ["24 clear hourly slots", "Tasks anchored to real time", "Reschedule without guilt"],
  },
  {
    number: "02",
    icon: Coins,
    title: "Effort that pays back.",
    bullets: ["Coins for focused minutes", "Bonuses for finished tasks", "A transparent reward history"],
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Motivation you unlock.",
    bullets: ["Collectible app themes", "Visual progress that feels good", "Rewards without real-money pressure"],
  },
];

export default function Landing() {
  return (
    <main className="cinema-page">
      <video className="page-atmosphere-video" autoPlay loop muted playsInline preload="metadata" aria-hidden="true">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" type="video/mp4" />
      </video>
      <div className="page-atmosphere-shade" aria-hidden="true" />
      <section className="cinema-hero">
        <div className="cinema-frame">
          <div className="cinema-noise" aria-hidden="true" />
          <div className="cinema-gradient" aria-hidden="true" />
          <div className="time-tunnel" aria-hidden="true">
            <span className="tunnel-ring ring-a" /><span className="tunnel-ring ring-b" /><span className="tunnel-ring ring-c" />
            {Array.from({ length: 24 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
          </div>

          <nav className="cinema-nav">
            <a href="#story">Our story</a>
            <a href="#system">The system</a>
            <span className="nav-brand"><TickingTwentyFour compact /></span>
            <a href="#rewards">Rewards</a>
            <Link to="/login">Log in</Link>
          </nav>

          <motion.div
            className="hero-logo-chip"
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease }}
          >
            <div className="logo-crop" aria-label="TwentyFour logo" />
            <span>TIME = MONEY</span>
          </motion.div>

          <div className="cinema-hero-content">
            <div className="cinema-title-wrap">
              <h1><WordsPullUp text="TwentyFour" /></h1>
              <motion.span className="title-mark" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.5, ease }}>*</motion.span>
            </div>
            <motion.div className="cinema-intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8, ease }}>
              <p>Your time is already valuable. We make it visible—one planned hour, one focused session and one earned reward at a time.</p>
              <Link className="cinema-cta" to="/login"><span>Start your day</span><i><ArrowRight size={18} /></i></Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="story" className="cinema-about">
        <div className="about-card">
          <StyledWords segments={[
            { text: "You receive twenty-four hours." },
            { text: "Where they go", className: "serif-accent" },
            { text: "should be your decision." },
          ]} />
          <span className="story-rule"><i /> ONE DAY · YOUR DECISIONS · YOUR VALUE <i /></span>
        </div>
      </section>

      <LandingDayPreview />

      <section id="system" className="cinema-features">
        <div className="features-noise" aria-hidden="true" />
        <div className="features-head">
          <StyledWords segments={[
            { text: "A focus system for people who procrastinate." },
            { text: "Easy to start. Satisfying to finish.", className: "muted-words" },
          ]} />
        </div>

        <div className="cinema-grid">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                className="system-card"
                key={feature.number}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.14, ease }}
              >
                <div className="system-icon"><Icon size={22} /></div>
                <div className={`card-visual card-visual-${index + 1}`} aria-hidden="true">
                  <span className="card-orbit" />
                  <span className="card-orbit card-orbit-small" />
                  <b>{index === 0 ? "24" : index === 1 ? "+10" : "1000"}</b>
                  <small>{index === 0 ? "HOURS" : index === 1 ? "COINS / HR" : "UNLOCK"}</small>
                  {Array.from({ length: 8 }, (_, dot) => <i key={dot} style={{ "--dot": dot } as React.CSSProperties} />)}
                </div>
                <div className="system-title"><span>{feature.number}</span><h3>{feature.title}</h3></div>
                <ul>{feature.bullets.map((bullet) => <li key={bullet}><Check size={14} /><span>{bullet}</span></li>)}</ul>
                <Link to="/signup">Try it now <ArrowRight size={15} /></Link>
              </motion.article>
            );
          })}
        </div>
      </section>

      <div className="section-bridge" aria-hidden="true">
        <div className="bridge-path">
          {['06:00', '09:00', '12:00', '15:00', '18:00', '24:00'].map((hour, index) => (
            <span key={hour} style={{ "--step": index } as React.CSSProperties}><i />{hour}</span>
          ))}
        </div>
        <p>PLAN <b>→</b> FOCUS <b>→</b> EARN <b>→</b> UNLOCK</p>
      </div>

      <section id="rewards" className="cinema-ending">
        <div className="ending-clock"><AmbientClock /></div>
        <div className="ending-cloud ending-cloud-left" aria-hidden="true" />
        <div className="ending-cloud ending-cloud-right" aria-hidden="true" />
        <span className="section-label">The next hour is yours</span>
        <StyledWords segments={[{ text: "Make it count." }, { text: "Make it yours.", className: "serif-accent" }]} />
        <Link className="cinema-cta ending-cta" to="/signup"><span>Create your first day</span><i><ArrowRight size={18} /></i></Link>
      </section>
    </main>
  );
}
