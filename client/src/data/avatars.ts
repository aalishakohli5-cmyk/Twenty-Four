import type { AvatarId } from '../types';

export interface AvatarDefinition {
  id: AvatarId;
  storeId: string;
  name: string;
  description: string;
  price: number;
  tagline: string;
}

export const AVATARS: AvatarDefinition[] = [
  {
    id: 'shinchan',
    storeId: 'avatar-shinchan',
    name: 'SHINCHAN',
    description: 'Free mischief buddy — follows your cursor while you grind.',
    price: 0,
    tagline: 'FREE · CURSOR TRACKING',
  },
  {
    id: 'sakura',
    storeId: 'avatar-sakura',
    name: 'SAKURA',
    description: 'Cherry-blossom anime study partner. Soft focus energy.',
    price: 300,
    tagline: 'ANIME · STUDY',
  },
  {
    id: 'kenji',
    storeId: 'avatar-kenji',
    name: 'KENJI',
    description: 'Headphones-on hacker student. Late-night grind mode.',
    price: 450,
    tagline: 'ANIME · WORK',
  },
  {
    id: 'neko',
    storeId: 'avatar-neko',
    name: 'NEKO',
    description: 'Cat student with notebook. Cozy library vibes.',
    price: 600,
    tagline: 'ANIME · COZY',
  },
  {
    id: 'pulse',
    storeId: 'avatar-pulse',
    name: 'PULSE',
    description: 'Neon focus bot — power, coins, and deep work.',
    price: 900,
    tagline: 'ROBOT · POWER',
  },
];

export function getAvatarById(id: AvatarId) {
  return AVATARS.find((a) => a.id === id);
}

export function isAvatarOwned(avatarId: AvatarId, ownedRewards: string[]) {
  if (avatarId === 'shinchan') return true;
  const def = getAvatarById(avatarId);
  return def ? ownedRewards.includes(def.storeId) : false;
}
