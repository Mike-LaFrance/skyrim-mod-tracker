// Nexus Mods API Client & Rate Limit Manager
import { ModCategory, PluginType } from '../types';

const NEXUS_API_KEY_STORAGE = 'skyrim_nexus_api_key';

export interface NexusUserValidation {
  valid: boolean;
  userId?: number;
  name?: string;
  isPremium?: boolean;
  isSupporter?: boolean;
  profileUrl?: string;
  dailyRemaining?: number;
  hourlyRemaining?: number;
  error?: string;
}

export interface NexusModApiResponse {
  name: string;
  summary: string;
  description?: string;
  picture_url?: string;
  version: string;
  author: string;
  mod_id: number;
  category_id: number;
  updated_timestamp: number;
  endorsement_count: number;
}

export interface NexusAutoFetchResult {
  success: boolean;
  name?: string;
  author?: string;
  version?: string;
  summary?: string;
  nexusUrl?: string;
  imageUrl?: string;
  suggestedCategory?: ModCategory;
  suggestedPluginType?: PluginType;
  error?: string;
}

export function getStoredNexusApiKey(): string {
  try {
    return localStorage.getItem(NEXUS_API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function saveNexusApiKey(apiKey: string): void {
  try {
    localStorage.setItem(NEXUS_API_KEY_STORAGE, apiKey.trim());
  } catch {
    // ignore
  }
}

export function clearStoredNexusApiKey(): void {
  try {
    localStorage.removeItem(NEXUS_API_KEY_STORAGE);
  } catch {
    // ignore
  }
}

/**
 * Extracts numeric Mod ID from Nexus URLs or raw numbers:
 * e.g. https://www.nexusmods.com/skyrimspecialedition/mods/266 -> "266"
 * e.g. "266" -> "266"
 */
export function extractNexusModId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[0-9]+$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/\/mods\/([0-9]+)/i);
  return match ? match[1] : null;
}

/**
 * Validates the personal API Key against Nexus Mods v1 API
 */
export async function validateNexusApiKey(apiKey: string): Promise<NexusUserValidation> {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    return { valid: false, error: 'API key cannot be blank.' };
  }

  try {
    const res = await fetch('https://api.nexusmods.com/v1/users/validate.json', {
      method: 'GET',
      headers: {
        'apikey': trimmed,
        'Application-Name': 'Skyrim Load Order Tracker',
        'Application-Version': '1.0.0',
      },
    });

    const dailyRemaining = res.headers.get('x-rl-daily-remaining');
    const hourlyRemaining = res.headers.get('x-rl-hourly-remaining');

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return { valid: false, error: 'Invalid API Key. Please verify the key copied from Nexus Mods.' };
      }
      return { valid: false, error: `Nexus API responded with status ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    return {
      valid: true,
      userId: data.user_id,
      name: data.name,
      isPremium: Boolean(data.is_premium),
      isSupporter: Boolean(data.is_supporter),
      profileUrl: data.profile_url,
      dailyRemaining: dailyRemaining ? parseInt(dailyRemaining, 10) : undefined,
      hourlyRemaining: hourlyRemaining ? parseInt(hourlyRemaining, 10) : undefined,
    };
  } catch (err) {
    return {
      valid: false,
      error: `Network or CORS restriction contacting Nexus API: ${err instanceof Error ? err.message : String(err)}. Note: Nexus API requires active Internet access.`,
    };
  }
}

/**
 * Fetches real-time mod version and metadata from Nexus Mods for Skyrim Special Edition
 */
export async function fetchLiveNexusMod(modId: string, apiKey: string): Promise<{ success: boolean; data?: NexusModApiResponse; error?: string }> {
  try {
    const res = await fetch(`https://api.nexusmods.com/v1/games/skyrimspecialedition/mods/${modId}.json`, {
      method: 'GET',
      headers: {
        'apikey': apiKey.trim(),
        'Application-Name': 'Skyrim Load Order Tracker',
        'Application-Version': '1.0.0',
      },
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}: Failed to fetch mod #${modId}` };
    }

    const json = (await res.json()) as NexusModApiResponse;
    return { success: true, data: json };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Auto-fetch helper that takes a URL or ID, queries Nexus API, and maps fields cleanly for AddModModal
 */
export async function autoFetchNexusModDetails(urlOrId: string, apiKey?: string): Promise<NexusAutoFetchResult> {
  const modId = extractNexusModId(urlOrId);
  if (!modId) {
    return { success: false, error: 'Please enter a valid Nexus Mods URL (e.g. https://www.nexusmods.com/skyrimspecialedition/mods/12604) or numeric Mod ID.' };
  }

  const key = apiKey || getStoredNexusApiKey();
  if (!key) {
    return { success: false, error: 'Nexus API Key is missing. Please click the golden key icon in the header to enter your API key.' };
  }

  const response = await fetchLiveNexusMod(modId, key);
  if (!response.success || !response.data) {
    return { success: false, error: response.error || 'Failed to retrieve mod details from Nexus Mods.' };
  }

  const data = response.data;
  
  // Clean description or summary (strip basic bbcode/html if present)
  let cleanSummary = data.summary || '';
  if (!cleanSummary && data.description) {
    cleanSummary = data.description.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...';
  }

  // Guess category from name or summary
  let suggestedCategory: ModCategory = 'Other';
  const text = `${data.name} ${cleanSummary}`.toLowerCase();
  if (text.includes('skse') || text.includes('framework') || text.includes('library') || text.includes('engine')) {
    suggestedCategory = 'Framework & Engine';
  } else if (text.includes('ui') || text.includes('hud') || text.includes('menu') || text.includes('interface')) {
    suggestedCategory = 'User Interface';
  } else if (text.includes('combat') || text.includes('animation') || text.includes('movement') || text.includes('dodge')) {
    suggestedCategory = 'Combat & Animations';
  } else if (text.includes('quest') || text.includes('land') || text.includes('dungeon') || text.includes('island')) {
    suggestedCategory = 'Quests & New Lands';
  } else if (text.includes('weather') || text.includes('shader') || text.includes('texture') || text.includes('mesh') || text.includes('light')) {
    suggestedCategory = 'Visuals & Shaders';
  } else if (text.includes('armor') || text.includes('weapon') || text.includes('shield') || text.includes('sword') || text.includes('bow')) {
    suggestedCategory = 'Armor & Weapons';
  } else if (text.includes('follower') || text.includes('companion') || text.includes('npc')) {
    suggestedCategory = 'Followers & NPCs';
  } else if (text.includes('sound') || text.includes('music') || text.includes('audio') || text.includes('voice')) {
    suggestedCategory = 'Audio & Music';
  } else if (text.includes('gameplay') || text.includes('perk') || text.includes('magic') || text.includes('alchemy') || text.includes('overhaul')) {
    suggestedCategory = 'Gameplay Overhaul';
  } else if (text.includes('fix') || text.includes('patch') || text.includes('utility')) {
    suggestedCategory = 'Utilities & Fixes';
  }

  // Guess plugin type
  let suggestedPluginType: PluginType = 'ESP Plugin';
  if (text.includes('.esl') || text.includes('light plugin') || text.includes('esl-flagged')) {
    suggestedPluginType = 'ESL Light';
  } else if (text.includes('.esm') || text.includes('master')) {
    suggestedPluginType = 'ESM Master';
  } else if (text.includes('skse') || text.includes('dll') || text.includes('plugin')) {
    suggestedPluginType = 'SKSE Plugin';
  }

  return {
    success: true,
    name: data.name,
    author: data.author,
    version: data.version,
    summary: cleanSummary,
    nexusUrl: `https://www.nexusmods.com/skyrimspecialedition/mods/${modId}`,
    imageUrl: data.picture_url,
    suggestedCategory,
    suggestedPluginType,
  };
}
