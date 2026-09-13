export type ModCategory =
  | 'Official Content'
  | 'Creation Club'
  | 'Framework & Engine'
  | 'User Interface'
  | 'Combat & Animations'
  | 'Quests & New Lands'
  | 'Gameplay Overhaul'
  | 'Visuals & Shaders'
  | 'Armor & Weapons'
  | 'Audio & Music'
  | 'Followers & NPCs'
  | 'Utilities & Fixes'
  | 'Other';

export type PluginType =
  | 'DLC'
  | 'Creation Club'
  | 'SKSE Plugin'
  | 'ESM Master'
  | 'ESP Plugin'
  | 'ESL Light'
  | 'Engine Utility'
  | 'Asset Archive';

export type ModStatus = 'active' | 'disabled';

export interface SkyrimMod {
  id: string;
  priority: number; // 0-indexed: 0, 1, 2...
  name: string;
  status: ModStatus; // active (+) or disabled (-)
  category: ModCategory;
  pluginType: PluginType;
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  author: string;
  fileSize: string;
  description: string;
  nexusUrl: string;
  notes: string;
  lastChecked?: string;
  imageUrl?: string;
  tags?: string[];
}

export type StatusFilter = 'all' | 'active' | 'disabled' | 'updates';

export type SortField = 'priority' | 'name' | 'category' | 'update';
export type SortOrder = 'asc' | 'desc';

export type ViewMode = 'cards' | 'table';

export interface FilterState {
  searchQuery: string;
  category: string; // 'all' or specific ModCategory
  pluginType: string; // 'all' or specific PluginType
  status: StatusFilter;
  tagFilter: string; // 'all' or specific tag like '#crash-suspect'
  showBanners: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
  viewMode: ViewMode;
}

export interface ModProfile {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  modCount: number;
  mods: SkyrimMod[];
}

export type ConflictSeverity = 'critical' | 'warning' | 'advisory';

export interface ConflictIssue {
  id: string;
  ruleId: string;
  modId: string;
  modName: string;
  title: string;
  message: string;
  severity: ConflictSeverity;
  recommendation: string;
  suggestedAction?: 'move_down' | 'move_up' | 'enable_dependency';
}

export const MOD_CATEGORIES: ModCategory[] = [
  'Official Content',
  'Creation Club',
  'Framework & Engine',
  'User Interface',
  'Combat & Animations',
  'Quests & New Lands',
  'Gameplay Overhaul',
  'Visuals & Shaders',
  'Armor & Weapons',
  'Audio & Music',
  'Followers & NPCs',
  'Utilities & Fixes',
  'Other',
];

export const PLUGIN_TYPES: PluginType[] = [
  'DLC',
  'Creation Club',
  'SKSE Plugin',
  'ESM Master',
  'ESP Plugin',
  'ESL Light',
  'Engine Utility',
  'Asset Archive',
];

export const PREDEFINED_TAGS: { name: string; color: string; desc: string }[] = [
  { name: '#essential', color: 'border-amber-500/40 bg-amber-500/15 text-amber-300', desc: 'Core mod essential to play' },
  { name: '#crash-suspect', color: 'border-red-500/40 bg-red-500/15 text-red-300', desc: 'Suspected cause of game CTDs' },
  { name: '#needs-patch', color: 'border-orange-500/40 bg-orange-500/15 text-orange-300', desc: 'Requires a compatibility patch' },
  { name: '#script-heavy', color: 'border-purple-500/40 bg-purple-500/15 text-purple-300', desc: 'Heavy Papyrus script load' },
  { name: '#testing', color: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300', desc: 'Under observation in current test run' },
  { name: '#visuals', color: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300', desc: 'Textures, meshes, or shaders' },
  { name: '#performance', color: 'border-blue-500/40 bg-blue-500/15 text-blue-300', desc: 'Performance optimization or fix' },
];
