import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { STORE_ITEMS } from '../data/demoData';
import { RewardCard } from '../components/store/RewardCard';
import { ThemePreviewModal } from '../components/store/ThemePreviewModal';
import { AvatarPreviewModal } from '../components/store/AvatarPreviewModal';
import type { StoreItem, ThemeId, AvatarId } from '../types';

function isItemOwned(item: StoreItem, ownedRewards: string[]) {
  if (item.id === 'theme-default' || item.id === 'avatar-shinchan') return true;
  return ownedRewards.includes(item.id);
}

function isItemEquipped(item: StoreItem, equippedTheme: ThemeId, equippedAvatar: AvatarId | null) {
  if (item.themeId) return item.themeId === equippedTheme;
  if (item.avatarId) return item.avatarId === equippedAvatar;
  return false;
}

export function StorePage() {
  const { state, purchaseItem, equipTheme, equipAvatar, addToast } = useApp();
  const [previewItem, setPreviewItem] = useState<StoreItem | null>(null);

  const themes = STORE_ITEMS.filter((i) => i.category === 'themes');
  const avatars = STORE_ITEMS.filter((i) => i.category === 'avatars');

  const handleUnlock = (itemId: string) => {
    const item = STORE_ITEMS.find((i) => i.id === itemId);
    const err = purchaseItem(itemId);
    if (err) {
      addToast(err, 'error');
      return;
    }
    addToast(`${item?.name} unlocked!`, 'success');
    if (item?.themeId) equipTheme(item.themeId);
    if (item?.avatarId) equipAvatar(item.avatarId);
    setPreviewItem(null);
  };

  const handleEquip = (item: StoreItem) => {
    if (item.themeId) {
      equipTheme(item.themeId);
      addToast('Theme equipped', 'success');
    } else if (item.avatarId) {
      equipAvatar(item.avatarId);
      addToast('Companion equipped', 'success');
    }
    setPreviewItem(null);
  };

  const previewOwned = previewItem ? isItemOwned(previewItem, state.ownedRewards) : false;
  const previewCanAfford = previewItem ? state.walletBalance >= previewItem.price : false;

  const renderGrid = (items: StoreItem[], startDelay = 0) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: startDelay + i * 0.08 }}
        >
          <RewardCard
            item={item}
            owned={isItemOwned(item, state.ownedRewards)}
            equipped={isItemEquipped(item, state.equippedTheme, state.equippedAvatar)}
            canAfford={state.walletBalance >= item.price}
            colorMode={state.settings.colorMode}
            onPreview={() => setPreviewItem(item)}
            onUnlock={() => handleUnlock(item.id)}
            onEquip={() => handleEquip(item)}
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="font-condensed text-xs tracking-[0.2em] text-accent-lime">REWARDS</span>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight mt-2">THE VAULT</h1>
        <p className="text-text-secondary mt-3 max-w-xl">
          Themes, companions, and focus tools. Preview before you spend — Shinchan is free.
        </p>
      </motion.div>

      <section className="space-y-4">
        <h2 className="font-display text-xl tracking-tight">THEMES</h2>
        {renderGrid(themes)}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl tracking-tight">COMPANIONS</h2>
        <p className="text-text-secondary text-sm max-w-xl">
          Small movable avatars that track your cursor while you study, plan, and earn coins.
        </p>
        {renderGrid(avatars, 0.2)}
      </section>

      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="font-condensed text-xs tracking-widest text-text-secondary">COMING COLLECTIONS</p>
        <p className="font-display text-xl mt-2">TASKBARS · SOUNDS · BACKGROUNDS</p>
        <p className="text-text-secondary text-sm mt-2">More rewards incoming. Keep earning.</p>
      </div>

      <ThemePreviewModal
        item={previewItem?.themeId ? previewItem : null}
        owned={previewOwned}
        equipped={previewItem?.themeId === state.equippedTheme}
        canAfford={previewCanAfford}
        colorMode={state.settings.colorMode}
        savedCustomColors={state.customThemeColors}
        onClose={() => setPreviewItem(null)}
        onUnlock={() => previewItem && handleUnlock(previewItem.id)}
        onEquip={() => previewItem && handleEquip(previewItem)}
      />

      <AvatarPreviewModal
        item={previewItem?.avatarId ? previewItem : null}
        owned={previewOwned}
        equipped={previewItem?.avatarId === state.equippedAvatar}
        canAfford={previewCanAfford}
        onClose={() => setPreviewItem(null)}
        onUnlock={() => previewItem && handleUnlock(previewItem.id)}
        onEquip={() => previewItem && handleEquip(previewItem)}
      />
    </div>
  );
}
