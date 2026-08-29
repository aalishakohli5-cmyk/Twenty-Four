import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { isAvatarOwned } from '../../data/avatars';
import { useDraggablePanel } from '../../hooks/useDraggablePanel';
import { AvatarArt } from './AvatarArt';

const POS_KEY = 'twentyfour-companion-pos';

export function CompanionAvatar() {
  const { state } = useApp();
  const avatarId = state.equippedAvatar;
  const owned = avatarId ? isAvatarOwned(avatarId, state.ownedRewards) : false;
  const enabled = !!avatarId && owned;

  const [lookAngle, setLookAngle] = useState(0);
  const [dragging, setDragging] = useState(false);

  const { panelRef, x, y, ready, handleDragEnd } = useDraggablePanel({
    storageKey: POS_KEY,
    enabled,
    defaultPosition: (width, height) => ({
      x: Math.max(12, window.innerWidth - width - 20),
      y: Math.max(80, window.innerHeight - height - 160),
    }),
  });

  useEffect(() => {
    if (!enabled || dragging) return;
    const onMove = (e: MouseEvent) => {
      const el = panelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setLookAngle((Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled, dragging, panelRef]);

  if (!enabled || !avatarId) return null;

  return (
    <motion.div
      ref={panelRef}
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => {
        setDragging(false);
        handleDragEnd();
      }}
      style={{ x, y, position: 'fixed', top: 0, left: 0, zIndex: 65 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: ready ? 1 : 0, scale: dragging ? 1.05 : 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="pointer-events-auto touch-none cursor-grab active:cursor-grabbing select-none"
      aria-label="Study companion — click and drag to move"
    >
      <div className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
        <AvatarArt id={avatarId} lookAngle={lookAngle} size={56} />
      </div>
    </motion.div>
  );
}
