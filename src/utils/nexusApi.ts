// Nexus Mods API Client & Rate Limit Manager

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
  version: string;
  author: string;
  mod_id: number;
  category_id: number;
  updated_timestamp: number;
  endorsement_count: number;
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
 * Extracts numeric Mod ID from Nexus URLs:
 * e.g. https://www.nexusmods.com/skyrimspecialedition/mods/266 -> "266"
 */
export function extractNexusModId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/mods\/([0-9]+)/i);
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
    // Browser CORS or Network restriction
    return {
      valid: false,
      error: `Network or CORS restriction contacting Nexus API: ${err instanceof Error ? err.message : String(err)}. Note: Nexus API requires active Internet access and standard browser headers.`,
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
      return { success: false, error: `HTTP ${res.status}` };
    }

    const json = (await res.json()) as NexusModApiResponse;
    return { success: true, data: json };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
