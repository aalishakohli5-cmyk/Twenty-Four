import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Home, Clock, Target, Wallet, ShoppingBag, BarChart3, Settings, Coins,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoinCounter } from '../ui/CoinCounter';

const mobileNav = [
  { path: '/app/today', label: 'Today', icon: Home },
  { path: '/app/timeline', label: 'Timeline', icon: Clock },
  { path: '/app/focus', label: 'Focus', icon: Target },
  { path: '/app/wallet', label: 'Wallet', icon: Wallet },
  { path: '/app/store', label: 'Store', icon: ShoppingBag },
];

const menuItems = [
  ...mobileNav,
  { path: '/app/insights', label: 'Insights', icon: BarChart3 },
  { path: '/app/review', label: 'Day Review', icon: BarChart3 },
  { path: '/app/settings', label: 'Settings', icon: Settings },
];

export function MobileNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useApp();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <div className="xl:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between glass-card border-b border-theme-subtle rounded-none shadow-sm">
        <Link to="/app/today" className="font-display font-bold text-lg text-text-primary">
          TWENTY<span className="text-accent-lime">FOUR</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/app/wallet" className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-theme-muted">
            <Coins className="w-3.5 h-3.5 text-accent-orange" />
            <CoinCounter value={state.walletBalance} size="sm" className="text-accent-orange text-sm" />
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-theme-muted text-text-primary"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="xl:hidden fixed inset-0 z-[60] bg-bg-primary/95 backdrop-blur-xl"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-12">
                <span className="font-display text-2xl font-bold text-text-primary">
                  TWENTY<span className="text-accent-lime">FOUR</span>
                </span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-text-primary">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-2 flex-1">
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-display text-2xl font-bold transition-colors ${
                          active ? 'text-accent-lime bg-accent-lime/10' : 'text-text-primary hover:bg-theme-muted'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        {item.label.toUpperCase()}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <p className="font-condensed text-xs text-text-secondary tracking-widest text-center">
                EVERY HOUR HAS VALUE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-4">
        <div className="glass-card rounded-2xl mx-2 mb-2 px-1 py-2 flex items-center justify-around border border-theme-subtle shadow-lg">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-[56px] min-h-[44px] justify-center transition-colors ${
                  active ? 'text-accent-lime' : 'text-text-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-condensed tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
