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
  sortBy: SortField;
  sortOrder: SortOrder;
  viewMode: ViewMode;
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
