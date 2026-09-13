// Mod Profiles & Loadout Switcher Storage
import { ModProfile, SkyrimMod } from '../types';
import { INITIAL_MODS } from '../data/initialMods';

const PROFILES_STORAGE_KEY = 'skyrim_tracker_profiles_v1';
const ACTIVE_PROFILE_KEY = 'skyrim_tracker_active_profile_id';

export function getDefaultProfiles(): ModProfile[] {
  const fullMods = [...INITIAL_MODS];
  const now = new Date().toISOString();

  // Profile 1: Full Loadout
  const p1: ModProfile = {
    id: 'profile-full-default',
    name: 'Full Master Loadout (62 Mods)',
    description: 'Complete Skyrim SE modlist featuring DLCs, SKSE utilities, combat, visuals, quests, and companion overhauls.',
    createdAt: now,
    updatedAt: now,
    modCount: fullMods.length,
    mods: fullMods,
  };

  // Profile 2: Vanilla+ Core Stability (Official DLCs + SKSE + UI only)
  const vanillaPlusMods = fullMods.map((m) => {
    const isCore =
      m.category === 'Official Content' ||
      m.category === 'Framework & Engine' ||
      m.name === 'SkyUI' ||
      m.name === 'Alternate Start - Live Another Life';
    return { ...m, status: isCore ? ('active' as const) : ('disabled' as const) };
  });

  const p2: ModProfile = {
    id: 'profile-vanilla-plus',
    name: 'Vanilla+ Core Stability',
    description: 'Lightweight setup with only essential engine stability fixes, SKSE Address Library, SkyUI, and clean Alternate Start.',
    createdAt: now,
    updatedAt: now,
    modCount: vanillaPlusMods.filter((m) => m.status === 'active').length,
    mods: vanillaPlusMods,
  };

  // Profile 3: Hardcore Survival & Roleplay
  const survivalMods = fullMods.map((m) => {
    const isSurvival =
      m.category === 'Official Content' ||
      m.category === 'Creation Club' ||
      m.category === 'Framework & Engine' ||
      m.name === 'SkyUI' ||
      m.name.includes('Alchemy') ||
      m.name.includes('Ordinator') ||
      m.name.includes('Inigo') ||
      m.name.includes('Wintersun') ||
      m.name.includes('Bandolier') ||
      m.name.includes('Cloaks') ||
      m.name === 'Alternate Start - Live Another Life';
    return { ...m, status: isSurvival ? ('active' as const) : ('disabled' as const) };
  });

  const p3: ModProfile = {
    id: 'profile-survival-roleplay',
    name: 'Hardcore Survival & Roleplay',
    description: 'Immersive roleplay build centering on Survival Mode, CACO alchemy, Ordinator perks, and Inigo with zero script bloat.',
    createdAt: now,
    updatedAt: now,
    modCount: survivalMods.filter((m) => m.status === 'active').length,
    mods: survivalMods,
  };

  // Profile 4: Graphics & Visual Showcase
  const graphicsMods = fullMods.map((m) => {
    const isVisual =
      m.category === 'Official Content' ||
      m.category === 'Framework & Engine' ||
      m.category === 'Visuals & Shaders' ||
      m.name === 'SkyUI' ||
      m.name.includes('SMIM') ||
      m.name === 'Alternate Start - Live Another Life';
    return { ...m, status: isVisual ? ('active' as const) : ('disabled' as const) };
  });

  const p4: ModProfile = {
    id: 'profile-graphics-showcase',
    name: 'Graphics & Visual Showcase',
    description: 'Maximum visual fidelity build focusing on Community Shaders, Lux interior lighting, Cathedral Weathers, and SMIM.',
    createdAt: now,
    updatedAt: now,
    modCount: graphicsMods.filter((m) => m.status === 'active').length,
    mods: graphicsMods,
  };

  return [p1, p2, p3, p4];
}

export function loadProfiles(): ModProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) {
      const defaults = getDefaultProfiles();
      saveProfiles(defaults);
      return defaults;
    }
    const parsed = JSON.parse(raw) as ModProfile[];
    return parsed.length > 0 ? parsed : getDefaultProfiles();
  } catch {
    return getDefaultProfiles();
  }
}

export function saveProfiles(profiles: ModProfile[]): void {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save profiles to localStorage:', err);
  }
}

export function getActiveProfileId(): string {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || 'profile-full-default';
  } catch {
    return 'profile-full-default';
  }
}

export function setActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } catch {
    // ignore
  }
}

export function createProfileFromCurrent(
  name: string,
  description: string,
  mods: SkyrimMod[]
): ModProfile {
  const now = new Date().toISOString();
  return {
    id: `profile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || 'Custom Loadout',
    description: description.trim() || 'User custom modlist profile',
    createdAt: now,
    updatedAt: now,
    modCount: mods.filter((m) => m.status === 'active').length,
    mods: [...mods],
  };
}
