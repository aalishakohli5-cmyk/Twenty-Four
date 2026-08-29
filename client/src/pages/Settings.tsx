import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Settings</h1>

        <div className="rounded-2xl border border-white/10 bg-panel p-6">
          <p className="mb-1 text-xs text-cream/50">Signed in as</p>
          <p className="text-sm">{user?.email}</p>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Appearance</p>
              <p className="mt-1 text-xs text-cream/50">
                Switch between dark and light mode.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              aria-label="Toggle dark and light mode"
            >
             <DotLottieReact
  src="/theme-toggle.json"
  autoplay
  loop
  style={{
    width: "48px",
    height: "48px",
    pointerEvents: "none",
  }}
/>

              <span className="text-xs">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-sm text-cream/40">
          Coin rates, rest-day protection, and reminder controls plug into{" "}
          <code className="text-cream/60">UserSettings</code> on the server —
          wire up a form here calling{" "}
          <code className="text-cream/60">PATCH /api/settings</code> when
          you're ready to build it out.
        </p>
      </main>
    </div>
  );
}

