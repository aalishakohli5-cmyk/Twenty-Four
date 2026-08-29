import { useEffect, useRef, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CoinBadge } from '../ui/CoinBadge';
import { AvatarArt } from '../avatars/AvatarArt';
import type { StoreItem } from '../../types';

interface AvatarPreviewModalProps {
  item: StoreItem | null;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  onClose: () => void;
  onUnlock: () => void;
  onEquip: () => void;
}

export function AvatarPreviewModal({
  item,
  owned,
  equipped,
  canAfford,
  onClose,
  onUnlock,
  onEquip,
}: AvatarPreviewModalProps) {
  const demoRef = useRef<HTMLDivElement>(null);
  const [lookAngle, setLookAngle] = useState(0);
  const isPulse = item?.avatarId === 'pulse';

  useEffect(() => {
    if (!item?.avatarId) return;
    const onMove = (e: MouseEvent) => {
      const el = demoRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.42;
      setLookAngle((Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [item?.avatarId]);

  if (!item?.avatarId) return null;

  return (
    <Modal isOpen={!!item} onClose={onClose} title={`DEMO — ${item.name}`} size="lg">
      <div className="space-y-5">
        <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>

        <div
          ref={demoRef}
          className={`relative h-56 rounded-2xl border overflow-hidden bg-bg-secondary ${
            isPulse ? 'border-[#39ff14]/35' : 'border-theme-subtle'
          }`}
        >
          <div
            className={`absolute inset-0 opacity-40 ${
              isPulse
                ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(57,255,20,0.18),transparent_65%)]'
                : 'bg-[radial-gradient(circle_at_50%_40%,var(--glow-hero-1),transparent_60%)]'
            }`}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className={`relative ${
                isPulse
                  ? 'drop-shadow-[0_0_16px_rgba(57,255,20,0.4)]'
                  : 'drop-shadow-[0_4px_16px_rgba(0,0,0,0.15)]'
              }`}
            >
              <AvatarArt id={item.avatarId} lookAngle={lookAngle} size={96} />
            </div>
            <p className="font-condensed text-[10px] tracking-[0.2em] text-text-secondary">
              MOVE CURSOR · EYES FOLLOW
            </p>
          </div>
          <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-bg-card/90 backdrop-blur-sm border border-theme-subtle px-3 py-2 text-center">
            <p className="text-xs text-text-secondary">
              After equip: small draggable companion tracks your cursor across the app.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-theme-subtle bg-theme-muted px-4 py-3 text-center">
          <p className="font-condensed text-[10px] tracking-widest text-accent-lime">LIVE DEMO</p>
          <p className="text-text-secondary text-xs mt-1">
            Preview only — unlock to keep this companion on your screen.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          {owned ? (
            <span className="font-condensed text-xs tracking-widest text-accent-lime">
              {item.price === 0 ? 'FREE' : 'OWNED'}
            </span>
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
