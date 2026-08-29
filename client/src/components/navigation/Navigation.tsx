import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoinCounter } from '../ui/CoinCounter';

function UserAvatar({ name, avatar, initials }: { name: string; avatar?: string; initials: string }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-8 h-8 rounded-full border-2 border-accent-lime object-cover shadow-sm"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-accent-lime border-2 border-accent-lime flex items-center justify-center font-condensed text-xs font-bold text-[var(--accent-lime-fg,#000)] shadow-sm">
      {initials}
    </div>
  );
}

const navItems = [
  { path: '/app/today', label: 'TODAY' },
  { path: '/app/timeline', label: 'TIMELINE' },
  { path: '/app/focus', label: 'FOCUS' },
  { path: '/app/wallet', label: 'WALLET' },
  { path: '/app/store', label: 'STORE' },
  { path: '/app/insights', label: 'INSIGHTS' },
];

export function Navigation() {
  const location = useLocation();
  const { state } = useApp();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="hidden xl:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 items-center gap-1 px-3 py-2 glass-card rounded-2xl backdrop-blur-xl border border-theme-subtle shadow-lg max-w-[calc(100vw-2rem)]"
    >
      <Link to="/app/today" className="flex items-center gap-2 pr-4 border-r border-theme-subtle mr-2">
        <span className="font-display font-bold text-lg tracking-tight text-text-primary">
          TWENTY<span className="text-accent-lime">FOUR</span>
        </span>
      </Link>

      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative px-3 py-2 font-condensed text-xs tracking-widest transition-colors ${
              active ? 'text-accent-lime font-semibold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {item.label}
            {active && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-lime"
              />
            )}
          </Link>
        );
      })}

      <div className="flex items-center gap-3 pl-4 border-l border-theme-subtle ml-2">
        <Link
          to="/app/wallet"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-muted/80 transition-colors"
        >
          <Coins className="w-4 h-4 text-accent-orange" />
          <CoinCounter value={state.walletBalance} size="sm" className="text-accent-orange" />
        </Link>
        <Link to="/app/settings" aria-label="Profile settings">
          <UserAvatar
            name={state.profile.name}
            avatar={state.profile.avatar}
            initials={state.profile.initials}
          />
        </Link>
        <Link
          to="/app/settings"
          className="p-2 rounded-lg hover:bg-theme-muted transition-colors text-text-secondary hover:text-text-primary"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </motion.nav>
  );
}
