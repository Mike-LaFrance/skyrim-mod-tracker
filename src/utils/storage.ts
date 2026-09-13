import { ModCategory, PluginType, SkyrimMod } from '../types';
import { INITIAL_MODS } from '../data/initialMods';

const STORAGE_KEY = 'skyrim_mods_v1';

export function loadMods(): SkyrimMod[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [...INITIAL_MODS];
    }
    const parsed = JSON.parse(data) as SkyrimMod[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      const initialMap = new Map(INITIAL_MODS.map((m) => [m.id, m]));
      return parsed.map((mod) => {
        const init = initialMap.get(mod.id);
        return {
          ...mod,
          imageUrl: mod.imageUrl || init?.imageUrl,
          tags: mod.tags || init?.tags || [],
        };
      });
    }
    return [...INITIAL_MODS];
  } catch (err) {
    console.error('Failed to load mods from localStorage', err);
    return [...INITIAL_MODS];
  }
}

export function saveMods(mods: SkyrimMod[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mods));
  } catch (err) {
    console.error('Failed to save mods to localStorage', err);
  }
}

export function resetModsToDefault(): SkyrimMod[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return [...INITIAL_MODS];
}

/**
 * Format an integer priority to 4 digits (#0000, #0012)
 */
export function formatPriority(priority: number): string {
  const clamped = Math.max(0, Math.floor(priority));
  return `#${clamped.toString().padStart(4, '0')}`;
}

/**
 * Clean renumber all mods in order from 0 to N-1
 */
export function cleanRenumber(mods: SkyrimMod[]): SkyrimMod[] {
  const sorted = [...mods].sort((a, b) => a.priority - b.priority);
  return sorted.map((mod, index) => ({
    ...mod,
    priority: index,
  }));
}

/**
 * Generates official ModOrganizer2 format:
 * #Mod_Priority,#Mod_Status,#Mod_Name
 * "0000","+","DLC: HearthFires"
 */
export function exportToMO2Format(mods: SkyrimMod[]): string {
  const sorted = [...mods].sort((a, b) => a.priority - b.priority);
  const header = '#Mod_Priority,#Mod_Status,#Mod_Name\n';
  const rows = sorted.map((mod) => {
    const p = Math.max(0, mod.priority).toString().padStart(4, '0');
    const status = mod.status === 'active' ? '+' : '-';
    // Escape quotes if present
    const cleanName = mod.name.replace(/"/g, '""');
    return `"${p}","${status}","${cleanName}"`;
  });
  return header + rows.join('\n');
}

/**
 * Heuristically infers category based on mod name
 */
export function inferCategory(name: string): ModCategory {
  const lower = name.toLowerCase();
  if (lower.startsWith('dlc:') || lower.includes('dawnguard') || lower.includes('dragonborn') || lower.includes('hearthfires')) {
    return 'Official Content';
  }
  if (lower.includes('creation club') || lower.startsWith('cc_') || lower.startsWith('ccbg') || lower.includes('rare curios') || lower.includes('saints')) {
    return 'Creation Club';
  }
  if (lower.includes('skse') || lower.includes('engine') || lower.includes('papyrus') || lower.includes('address library') || lower.includes('framework') || lower.includes('spid')) {
    return 'Framework & Engine';
  }
  if (lower.includes('hud') || lower.includes('menu') || lower.includes('skyui') || lower.includes('map') || lower.includes('interface') || lower.includes('ui')) {
    return 'User Interface';
  }
  if (lower.includes('combat') || lower.includes('animation') || lower.includes('nemesis') || lower.includes('precision') || lower.includes('movement') || lower.includes('parry')) {
    return 'Combat & Animations';
  }
  if (lower.includes('quest') || lower.includes('beyond') || lower.includes('falskaar') || lower.includes('wyrmstooth') || lower.includes('reach') || lower.includes('island') || lower.includes('world') || lower.includes('bruma')) {
    return 'Quests & New Lands';
  }
  if (lower.includes('shader') || lower.includes('enb') || lower.includes('weather') || lower.includes('texture') || lower.includes('mesh') || lower.includes('lighting') || lower.includes('lux') || lower.includes('water')) {
    return 'Visuals & Shaders';
  }
  if (lower.includes('armor') || lower.includes('weapon') || lower.includes('cloak') || lower.includes('shield') || lower.includes('blade') || lower.includes('bandolier')) {
    return 'Armor & Weapons';
  }
  if (lower.includes('audio') || lower.includes('sound') || lower.includes('music') || lower.includes('voice')) {
    return 'Audio & Music';
  }
  if (lower.includes('follower') || lower.includes('npc') || lower.includes('companion') || lower.includes('lucien') || lower.includes('inigo')) {
    return 'Followers & NPCs';
  }
  if (lower.includes('patch') || lower.includes('fix') || lower.includes('ussep') || lower.includes('cleaner') || lower.includes('utility')) {
    return 'Utilities & Fixes';
  }
  if (lower.includes('alchemy') || lower.includes('magic') || lower.includes('perk') || lower.includes('ordinator') || lower.includes('religion') || lower.includes('caco') || lower.includes('overhaul')) {
    return 'Gameplay Overhaul';
  }
  return 'Other';
}

/**
 * Heuristically infers plugin type based on name
 */
export function inferPluginType(name: string): PluginType {
  const lower = name.toLowerCase();
  if (lower.startsWith('dlc:')) return 'DLC';
  if (lower.includes('creation club') || lower.startsWith('cc_')) return 'Creation Club';
  if (lower.includes('.esm') || lower.includes('master') || lower.includes('assets')) return 'ESM Master';
  if (lower.includes('.esl') || lower.includes('light')) return 'ESL Light';
  if (lower.includes('skse') || lower.includes('library') || lower.includes('dll')) return 'SKSE Plugin';
  if (lower.includes('engine') || lower.includes('generator') || lower.includes('nemesis')) return 'Engine Utility';
  if (lower.includes('textures') || lower.includes('meshes') || lower.includes('archive') || lower.includes('smim')) return 'Asset Archive';
  return 'ESP Plugin';
}

/**
 * Parse standard MO2 format or simple modlist text:
 * Supports:
 * - CSV: "0000","+","Mod Name"
 * - Tab or comma separated: 0000,+,Mod Name
 * - Raw MO2 modlist lines: +Mod Name or -Mod Name
 */
export function importFromMO2Text(text: string, existingMods: SkyrimMod[]): SkyrimMod[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const existingMap = new Map<string, SkyrimMod>();
  existingMods.forEach((m) => {
    existingMap.set(m.name.toLowerCase().trim(), m);
  });

  const parsedMods: SkyrimMod[] = [];
  let fallbackPriority = 0;

  for (const line of lines) {
    // Skip comment lines unless they are standard headers
    if (line.startsWith('#') && !line.includes('Mod_Priority')) {
      continue;
    }
    if (line.includes('Mod_Priority') && line.includes('Mod_Name')) {
      continue;
    }

    let priority = fallbackPriority;
    let status: 'active' | 'disabled' = 'active';
    let modName = '';

    // Check for CSV pattern: "0000","+","Mod Name" or 0000,+,Mod Name
    const csvMatch = line.match(/^"?([0-9]+)"?\s*,\s*"?([+\-])"?\s*,\s*"?([^"]+)"?$/);
    if (csvMatch) {
      priority = parseInt(csvMatch[1], 10);
      status = csvMatch[2] === '-' ? 'disabled' : 'active';
      modName = csvMatch[3].trim();
    } else {
      // Check for MO2 modlist.txt format: +ModName or -ModName
      const prefixMatch = line.match(/^([+\-])\s*(.+)$/);
      if (prefixMatch) {
        status = prefixMatch[1] === '-' ? 'disabled' : 'active';
        modName = prefixMatch[2].trim();
        priority = fallbackPriority;
      } else {
        // Just a bare name
        modName = line.replace(/^"+|"+$/g, '').trim();
        priority = fallbackPriority;
      }
    }

    if (!modName) continue;

    const matchedExisting = existingMap.get(modName.toLowerCase());

    if (matchedExisting) {
      // Retain full existing metadata, update priority and status
      parsedMods.push({
        ...matchedExisting,
        id: matchedExisting.id || `mod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        priority,
        status,
      });
    } else {
      // Create new mod entry with inferred metadata
      parsedMods.push({
        id: `custom-mod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        priority,
        name: modName,
        status,
        category: inferCategory(modName),
        pluginType: inferPluginType(modName),
        currentVersion: '1.0.0',
        latestVersion: '1.0.0',
        hasUpdate: false,
        author: 'Unknown Author',
        fileSize: '—',
        description: `Imported mod entry: ${modName}. Manage and configure in your Skyrim load order.`,
        nexusUrl: `https://www.nexusmods.com/skyrimspecialedition/search/?gsearch=${encodeURIComponent(modName)}`,
        notes: 'Imported from ModOrganizer2 modlist.',
      });
    }

    fallbackPriority++;
  }

  // Sort and renumber to ensure sequential integrity
  return cleanRenumber(parsedMods);
}
