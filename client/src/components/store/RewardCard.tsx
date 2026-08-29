import { motion } from 'framer-motion';
import { Lock, Check, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { CoinBadge } from '../ui/CoinBadge';
import { ThemePreview } from './ThemePreview';
import { AvatarPreview } from './AvatarPreview';
import type { StoreItem, ColorMode } from '../../types';

interface RewardCardProps {
  item: StoreItem;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  colorMode?: ColorMode;
  onPreview: () => void;
  onUnlock: () => void;
  onEquip: () => void;
}

export function RewardCard({
  item,
  owned,
  equipped,
  canAfford,
  colorMode = 'dark',
  onPreview,
  onUnlock,
  onEquip,
}: RewardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl overflow-hidden group"
    >
      <button
        type="button"
        onClick={onPreview}
        className="relative w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-lime/50"
        aria-label={`Preview ${item.name} demo`}
      >
        <div className="relative h-44 overflow-hidden">
          {item.themeId ? (
            <ThemePreview
              themeId={item.themeId}
              size="card"
              className="h-full rounded-none border-0"
              colorMode={colorMode}
            />
          ) : item.avatarId ? (
            <AvatarPreview avatarId={item.avatarId} className="h-full rounded-none" />
          ) : (
            <div className="h-full bg-gradient-to-br from-accent-lime/20 to-black flex items-center justify-center">
              <span className="font-display text-6xl font-bold text-white/10">
                {String(item.order).padStart(2, '0')}
              </span>
            </div>
          )}

          {!owned && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
              <Lock className="w-3 h-3 text-white/70" />
              <span className="font-condensed text-[9px] tracking-wider text-white/80">DEMO</span>
            </div>
          )}

          {equipped && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-accent-lime text-[var(--accent-lime-fg,#000)] font-condensed text-[9px] tracking-wider">
              EQUIPPED
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-theme-muted/0 group-hover:bg-theme-muted/60 transition-colors">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card/90 backdrop-blur-md border border-theme-subtle font-condensed text-[10px] tracking-wider text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-3.5 h-3.5" />
              VIEW DEMO
            </span>
          </div>
        </div>
      </button>

      <div className="p-5">
        <h3 className="font-display text-lg tracking-tight">{item.name}</h3>
        <p className="text-text-secondary text-sm mt-1 leading-relaxed">{item.description}</p>
        <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
          {owned ? (
            <span className="font-condensed text-[10px] text-accent-lime flex items-center gap-1">
              <Check className="w-3 h-3" /> {item.price === 0 ? 'FREE' : 'OWNED'}
            </span>
          ) : (
            item.price === 0 ? (
              <span className="font-condensed text-[10px] text-accent-lime">FREE</span>
            ) : (
              <CoinBadge amount={item.price} size="md" showSign={false} />
            )
          )}

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={onPreview}>
              PREVIEW
            </Button>
            {owned ? (
              <Button
                size="sm"
                variant={equipped ? 'ghost' : 'primary'}
                onClick={onEquip}
                disabled={equipped}
              >
                {equipped ? 'EQUIPPED' : 'EQUIP'}
              </Button>
            ) : (
              <Button size="sm" onClick={onUnlock} disabled={!canAfford}>
                UNLOCK
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
