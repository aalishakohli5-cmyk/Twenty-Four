import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/today", label: "Today" },
  { to: "/wallet", label: "Wallet" },
  { to: "/store", label: "Store" },
  { to: "/report", label: "Report" },
  { to: "/settings", label: "Settings" },
];

export default function Navbar() {
  const { signOut } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <span className="text-gold">24</span>
        <span>TwentyFour</span>
      </div>
      <div className="flex items-center gap-5 text-sm">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `transition-colors hover:text-gold ${isActive ? "text-gold" : "text-cream/70"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
        <button
          onClick={signOut}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-cream/70 hover:border-coral hover:text-coral"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
