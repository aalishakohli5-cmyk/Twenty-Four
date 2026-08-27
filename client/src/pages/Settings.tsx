import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Settings</h1>

        <div className="rounded-2xl border border-white/10 bg-panel p-6">
          <p className="mb-1 text-xs text-cream/50">Signed in as</p>
          <p className="text-sm">{user?.email}</p>
        </div>

        <p className="mt-6 text-sm text-cream/40">
          Coin rates, rest-day protection, and reminder controls plug into{" "}
          <code className="text-cream/60">UserSettings</code> on the server — wire up a form here
          calling <code className="text-cream/60">PATCH /api/settings</code> when you're ready to
          build it out.
        </p>
      </main>
    </div>
  );
}
