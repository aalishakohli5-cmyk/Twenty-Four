import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ThemePreview } from './ThemePreview';
import { CustomThemeEditor } from './CustomThemeEditor';
import { CoinBadge } from '../ui/CoinBadge';
import { DEFAULT_CUSTOM_THEME_COLORS } from '../../data/demoData';
import type { CustomThemeColors, StoreItem, ColorMode } from '../../types';

interface ThemePreviewModalProps {
  item: StoreItem | null;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  colorMode?: ColorMode;
  savedCustomColors?: CustomThemeColors;
  onClose: () => void;
  onUnlock: () => void;
  onEquip: () => void;
}

export function ThemePreviewModal({
  item,
  owned,
  equipped,
  canAfford,
  colorMode = 'dark',
  savedCustomColors,
  onClose,
  onUnlock,
  onEquip,
}: ThemePreviewModalProps) {
  const [previewColors, setPreviewColors] = useState<CustomThemeColors>(DEFAULT_CUSTOM_THEME_COLORS);

  useEffect(() => {
    if (item?.themeId === 'custom') {
      setPreviewColors(savedCustomColors ?? DEFAULT_CUSTOM_THEME_COLORS);
    }
  }, [item, savedCustomColors]);

  if (!item?.themeId) return null;

  return (
    <Modal isOpen={!!item} onClose={onClose} title={`DEMO — ${item.name}`} size="lg">
      <div className="space-y-5">
        <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>

        <ThemePreview
          themeId={item.themeId}
          size="modal"
          customColors={item.themeId === 'custom' ? previewColors : undefined}
          colorMode={colorMode}
        />

        {item.themeId === 'custom' && (
          <div className="space-y-3">
            <p className="font-condensed text-[10px] tracking-widest text-text-secondary">
              TRY THE COLOR WHEELS
            </p>
            <CustomThemeEditor colors={previewColors} onChange={setPreviewColors} />
          </div>
        )}

        <div className="rounded-xl border border-theme-subtle bg-theme-muted px-4 py-3 text-center">
          <p className="font-condensed text-[10px] tracking-widest text-accent-lime">LIVE DEMO</p>
          <p className="text-text-secondary text-xs mt-1">
            Preview only — your equipped theme stays active until you unlock and equip.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          {owned ? (
            <span className="font-condensed text-xs tracking-widest text-accent-lime">OWNED</span>
          ) : (
            <CoinBadge amount={item.price} size="md" showSign={false} />
          )}

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              CLOSE
            </Button>
            {owned ? (
              <Button size="sm" onClick={onEquip} disabled={equipped}>
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
    </Modal>
  );
}
