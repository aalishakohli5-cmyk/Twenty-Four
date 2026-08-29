import { NavLink } from "react-router-dom";
import { BookOpenText, CalendarDays, ChartNoAxesColumnIncreasing, Gift, LogOut, Settings, Timer, WalletCards } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/today", label: "My day", icon: CalendarDays },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/wallet", label: "Wallet", icon: WalletCards },
  { to: "/store", label: "Marketplace", icon: Gift },
  { to: "/report", label: "Reports", icon: ChartNoAxesColumnIncreasing },
  { to: "/rules", label: "Rules", icon: BookOpenText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Navbar() {
  const { signOut, user } = useAuth();
  const initial = (user?.email?.[0] ?? "T").toUpperCase();

  return (
    <aside className="dash-nav">
      <NavLink to="/today" className="dash-brand">
        <span className="dash-brand-clock"><i /><b /></span>
        <strong>TwentyFour</strong>
      </NavLink>

      <nav className="dash-nav-links" aria-label="Dashboard navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `dash-nav-link ${isActive ? "active" : ""}`}>
            <Icon size={18} strokeWidth={1.7} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="dash-account">
        <span className="dash-avatar">{initial}</span>
        <div><strong>{user?.user_metadata?.full_name ?? "Your account"}</strong><small>{user?.email}</small></div>
        <button onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button>
      </div>
    </aside>
  );
}
