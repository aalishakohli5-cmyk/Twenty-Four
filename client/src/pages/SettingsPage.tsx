import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { THEMES, REST_DAY_OPTIONS } from '../data/demoData';
import { AVATARS, isAvatarOwned } from '../data/avatars';
import { AvatarPreview } from '../components/store/AvatarPreview';
import { CustomThemeEditor } from '../components/store/CustomThemeEditor';
import { ThemePreview } from '../components/store/ThemePreview';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { EmailAuthForm } from '../components/auth/EmailAuthForm';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    state,
    updateSettings,
    updateProfile,
    equipTheme,
    equipAvatar,
    setCustomThemeColors,
    addRestDay,
    removeRestDay,
    resetDemo,
    resetFresh,
    addToast,
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const handleRestDay = (type: typeof REST_DAY_OPTIONS[0]['type'], label: string) => {
    addRestDay({ date: tomorrowStr, type, label });
    addToast('Rest day protected', 'success');
  };

  const handleSignOut = async () => {
    await signOut();
    addToast('Signed out', 'info');
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="font-condensed text-xs tracking-[0.2em] text-accent-lime">CONFIGURE</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">SETTINGS</h1>
      </motion.div>

      {/* Account */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4">ACCOUNT</h2>
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-14 h-14 rounded-full border border-accent-lime/30 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-accent-lime/20 border border-accent-lime/30 flex items-center justify-center font-display text-xl font-bold text-accent-lime">
                  {state.profile.initials}
                </div>
              )}
              <div>
                <p className="font-medium">{user.displayName}</p>
                <p className="text-text-secondary text-sm">{user.email}</p>
                <p className="font-condensed text-[10px] tracking-widest text-accent-lime mt-1">SIGNED IN</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 inline mr-2" /> SIGN OUT
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <EmailAuthForm />
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-condensed text-xs tracking-widest text-text-secondary">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <GoogleSignInButton label="CONTINUE WITH GOOGLE" />
          </div>
        )}
      </GlassCard>

      {/* Profile */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4">PROFILE</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">NAME</label>
            <input
              id="name"
              value={state.profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full input-field focus:border-accent-lime/50"
            />
          </div>
          <div className="flex items-center gap-4">
            {state.profile.avatar ? (
              <img
                src={state.profile.avatar}
                alt={state.profile.name}
                className="w-14 h-14 rounded-full border border-accent-lime/30 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-accent-lime/20 border border-accent-lime/30 flex items-center justify-center font-display text-xl font-bold text-accent-lime">
                {state.profile.initials}
              </div>
            )}
            <p className="text-text-secondary text-sm">
              {user ? 'Synced from your account.' : 'Sign in to sync your profile.'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Productivity */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4">PRODUCTIVITY</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="coin-rate" className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">
              COIN RATE (per hour)
            </label>
            <select
              id="coin-rate"
              value={state.settings.coinRate}
              onChange={(e) => updateSettings({ coinRate: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
            >
              {[5, 10, 15, 20].map((r) => (
                <option key={r} value={r} className="bg-bg-secondary">{r} coins/hour</option>
              ))}
            </select>
          </div>
          <Toggle
            label="Reminders"
            checked={state.settings.reminders}
            onChange={(v) => updateSettings({ reminders: v })}
          />
        </div>
      </GlassCard>

      {/* Rest Days */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4">REST DAYS</h2>
        <p className="text-text-secondary text-sm mb-4">Schedule protection for tomorrow ({tomorrowStr})</p>
        <div className="flex flex-wrap gap-2">
          {REST_DAY_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => handleRestDay(opt.type, opt.label)}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-accent-lime/10 hover:text-accent-lime font-condensed text-xs tracking-wider transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
        {state.restDays.length > 0 && (
          <div className="mt-4 space-y-2">
            {state.restDays.map((rd) => (
              <div key={rd.date} className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm">{rd.date} — {rd.label}</span>
                <button onClick={() => removeRestDay(rd.date)} className="text-accent-orange text-xs">Remove</button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Time Decay */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4">TIME DECAY</h2>
        <Toggle
          label="Enable coin decay on unplanned days"
          checked={state.settings.decayEnabled}
          onChange={(v) => updateSettings({ decayEnabled: v })}
        />
        <p className="text-text-secondary text-xs mt-2">
          Small, recoverable penalty ({Math.round(state.settings.decayRate * 100)}%) when no tasks are planned. Never resets your balance.
        </p>
      </GlassCard>

      {/* Appearance */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4">APPEARANCE</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {THEMES.filter((t) => t.id !== 'custom').map((theme) => {
            const owned = theme.id === 'default' || state.ownedRewards.includes(`theme-${theme.id}`);
            const equipped = state.equippedTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => owned && equipTheme(theme.id)}
                disabled={!owned}
                className={`rounded-2xl border text-left overflow-hidden transition-all ${
                  equipped
                    ? 'border-accent-lime ring-1 ring-accent-lime/30'
                    : 'border-white/10 hover:border-white/25'
                } ${!owned ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <ThemePreview
                  themeId={theme.id}
                  size="card"
                  className="rounded-none border-0"
                  colorMode={state.settings.colorMode}
                />
                <div className="px-4 py-3 border-t border-white/10">
                  <p className="font-condensed text-[10px] tracking-wider">{theme.name}</p>
                  <p className="text-text-secondary text-xs mt-0.5">
                    {owned ? (equipped ? 'Equipped' : theme.description) : 'Unlock in Store'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {state.ownedRewards.includes('theme-custom') && (
          <div className="mt-6 space-y-4">
            <p className="font-condensed text-xs tracking-widest text-text-secondary">CUSTOM PALETTE</p>
            <ThemePreview
              themeId="custom"
              size="card"
              customColors={state.customThemeColors}
              colorMode={state.settings.colorMode}
            />
            <CustomThemeEditor
              colors={state.customThemeColors}
              onChange={(colors) => {
                setCustomThemeColors(colors);
                if (state.equippedTheme === 'custom') {
                  addToast('Custom colors updated', 'success');
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => equipTheme('custom')}
              disabled={state.equippedTheme === 'custom'}
            >
              {state.equippedTheme === 'custom' ? 'CUSTOM EQUIPPED' : 'EQUIP CUSTOM'}
            </Button>
          </div>
        )}
        <div className="mt-6 space-y-3">
          <p className="font-condensed text-xs tracking-widest text-text-secondary">COLOR MODE</p>
          <p className="text-text-secondary text-xs">Dark is our developer favorite — crisp glows, max contrast.</p>
          <div className="flex flex-wrap gap-2">
            {(['dark', 'light', 'system'] as const).map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={state.settings.colorMode === mode ? 'primary' : 'secondary'}
                onClick={() => updateSettings({ colorMode: mode })}
                className="relative"
              >
                {mode.toUpperCase()}
                {mode === 'dark' && (
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full bg-accent-orange text-[8px] font-condensed text-[var(--accent-lime-fg,#fff)] leading-none">
                    DEV ♥
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <p className="font-condensed text-xs tracking-widest text-text-secondary">COMPANION</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {AVATARS.map((avatar) => {
              const owned = isAvatarOwned(avatar.id, state.ownedRewards);
              const equipped = state.equippedAvatar === avatar.id;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  disabled={!owned}
                  onClick={() => owned && equipAvatar(avatar.id)}
                  className={`rounded-xl border overflow-hidden text-left transition-all ${
                    equipped ? 'border-accent-lime ring-1 ring-accent-lime/30' : 'border-white/10 hover:border-white/25'
                  } ${!owned ? 'opacity-50' : ''}`}
                >
                  <AvatarPreview avatarId={avatar.id} className="h-28 rounded-none" />
                  <div className="px-3 py-2 border-t border-white/10">
                    <p className="font-condensed text-[10px]">{avatar.name}</p>
                    <p className="text-text-secondary text-[10px] mt-0.5">
                      {equipped ? 'Equipped' : owned ? avatar.tagline : 'Store'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          {state.equippedAvatar && (
            <Button size="sm" variant="ghost" onClick={() => equipAvatar(null)}>
              HIDE COMPANION
            </Button>
          )}
        </div>
        <div className="mt-4">
          <label htmlFor="motion" className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">MOTION</label>
          <select
            id="motion"
            value={state.settings.motionIntensity}
            onChange={(e) => updateSettings({
              motionIntensity: e.target.value as 'full' | 'reduced' | 'none',
              reducedMotion: e.target.value !== 'full',
            })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
          >
            <option value="full" className="bg-bg-secondary">Full</option>
            <option value="reduced" className="bg-bg-secondary">Reduced</option>
            <option value="none" className="bg-bg-secondary">None</option>
          </select>
        </div>
      </GlassCard>

      {/* Sound */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4">SOUND</h2>
        <Toggle
          label="Sound effects"
          checked={state.settings.soundEnabled}
          onChange={(v) => updateSettings({ soundEnabled: v })}
        />
      </GlassCard>

      {/* Data */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4">DATA</h2>
        {!confirmReset ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={() => { resetDemo(); addToast('Demo data restored', 'success'); }}>
              RESTORE DEMO
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmReset(true)}>
              RESET ALL DATA
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-accent-orange text-sm">This will erase all data and start fresh.</p>
            <div className="flex gap-3">
              <Button variant="danger" size="sm" onClick={() => { resetFresh(); setConfirmReset(false); addToast('Data reset', 'info'); }}>
                CONFIRM RESET
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setConfirmReset(false)}>CANCEL</Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-accent-lime' : 'bg-white/10'}`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'left-6' : 'left-1'}`}
        />
      </button>
    </label>
  );
}
