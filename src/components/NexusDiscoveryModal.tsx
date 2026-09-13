import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Flame,
  Download,
  Sparkles,
  Search,
  ExternalLink,
  Copy,
  Check,
  PlusCircle,
  RotateCw,
  Clock,
  Key,
  Layers,
  ThumbsUp,
  SlidersHorizontal,
} from 'lucide-react';
import {
  DiscoveredNexusMod,
  DiscoveryFeedType,
  DiscoveryTimeRange,
  MOD_CATEGORIES,
  SkyrimMod,
} from '../types';
import {
  fetchNexusDiscoveryFeed,
  extractNexusModId,
} from '../utils/nexusApi';
import { sound } from '../utils/audio';
import { getCategoryBadgeStyle } from './ModItemCard';

interface NexusDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  libraryMods: SkyrimMod[];
  hasNexusApiKey: boolean;
  onOpenNexusModal: () => void;
  onTrackMod: (mod: DiscoveredNexusMod) => void;
}

const TIME_RANGES: { id: DiscoveryTimeRange; label: string }[] = [
  { id: '7d', label: 'Past Week (7d)' },
  { id: '14d', label: 'Past 2 Weeks (14d)' },
  { id: '30d', label: 'Past Month (30d)' },
  { id: '90d', label: 'Past 3 Months (90d)' },
  { id: '180d', label: 'Past 6 Months (180d)' },
  { id: '365d', label: 'Past Year (365d)' },
  { id: 'all', label: 'All-Time' },
];

function formatCount(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(num);
}

function formatRelativeTime(timestampSeconds: number): string {
  if (!timestampSeconds) return 'Unknown';
  const diffSec = Math.floor(Date.now() / 1000) - timestampSeconds;
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}

export const NexusDiscoveryModal: React.FC<NexusDiscoveryModalProps> = ({
  isOpen,
  onClose,
  libraryMods,
  hasNexusApiKey,
  onOpenNexusModal,
  onTrackMod,
}) => {
  const [feedType, setFeedType] = useState<DiscoveryFeedType>('trending');
  const [timeRange, setTimeRange] = useState<DiscoveryTimeRange>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [mods, setMods] = useState<DiscoveredNexusMod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [copiedModId, setCopiedModId] = useState<number | null>(null);
  const [justTrackedIds, setJustTrackedIds] = useState<Set<number>>(new Set());

  // Map of existing library mods indexed by numeric modId and normalized title
  const libraryIndex = useMemo(() => {
    const idMap = new Map<number, SkyrimMod>();
    const nameMap = new Map<string, SkyrimMod>();

    libraryMods.forEach((m) => {
      nameMap.set(m.name.toLowerCase().trim(), m);
      if (m.nexusUrl) {
        const id = extractNexusModId(m.nexusUrl);
        if (id) {
          idMap.set(parseInt(id, 10), m);
        }
      }
    });

    return { idMap, nameMap };
  }, [libraryMods]);

  const checkInLibrary = useCallback(
    (mod: DiscoveredNexusMod): SkyrimMod | null => {
      if (libraryIndex.idMap.has(mod.mod_id)) {
        return libraryIndex.idMap.get(mod.mod_id) || null;
      }
      const normName = mod.name.toLowerCase().trim();
      if (libraryIndex.nameMap.has(normName)) {
        return libraryIndex.nameMap.get(normName) || null;
      }
      return null;
    },
    [libraryIndex]
  );

  const loadFeed = useCallback(
    async (bypassCache = false) => {
      setIsLoading(true);
      try {
        const result = await fetchNexusDiscoveryFeed(feedType, timeRange, undefined, bypassCache);
        if (result.success) {
          setMods(result.mods);
          setIsFromCache(result.fromCache);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    },
    [feedType, timeRange]
  );

  useEffect(() => {
    if (isOpen) {
      loadFeed();
    }
  }, [isOpen, loadFeed]);

  const handleCopyLink = (mod: DiscoveredNexusMod) => {
    sound.playClick();
    navigator.clipboard.writeText(mod.nexus_url);
    setCopiedModId(mod.mod_id);
    setTimeout(() => setCopiedModId(null), 2000);
  };

  const handleTrackClick = (mod: DiscoveredNexusMod) => {
    sound.playChime();
    onTrackMod(mod);
    setJustTrackedIds((prev) => new Set(prev).add(mod.mod_id));
  };

  // Client filtering on search query and category dropdown
  const filteredMods = useMemo(() => {
    return mods.filter((m) => {
      // Category filter
      if (categoryFilter !== 'all' && m.suggested_category !== categoryFilter) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesAuthor = m.author.toLowerCase().includes(q);
        const matchesSummary = m.summary.toLowerCase().includes(q);
        const matchesCategory = (m.suggested_category || '').toLowerCase().includes(q);
        return matchesName || matchesAuthor || matchesSummary || matchesCategory;
      }
      return true;
    });
  }, [mods, categoryFilter, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-nordic-950 border border-gold-500/40 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-slate-800 bg-gradient-to-r from-nordic-950 via-nordic-900 to-nordic-950 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/40 text-orange-400 shadow-gold-glow">
              <Flame className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl sm:text-2xl font-cinzel font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200">
                  NEXUS MODS DISCOVERY HUB
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Skyrim SE / AE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Browse trending, popular, and newly released community mods &middot; Track directly into your load order
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-nordic-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification & API Key Banner */}
        <div className="px-6 py-2.5 bg-nordic-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                hasNexusApiKey ? 'bg-emerald-400' : 'bg-amber-400'
              } animate-pulse`}
            />
            <span className="text-slate-300">
              {hasNexusApiKey ? (
                <>
                  Connected via <strong className="text-emerald-300">Nexus Personal API Key</strong>
                  {isFromCache && <span className="text-slate-400 ml-1.5">(Session Cached)</span>}
                </>
              ) : (
                <>
                  Browsing <strong className="text-amber-300">Curated Skyrim SSE Discovery Catalog</strong>
                </>
              )}
            </span>
          </div>

          {!hasNexusApiKey && (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onOpenNexusModal();
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 transition-all font-semibold"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Connect Nexus API Key for Live Queries</span>
            </button>
          )}
        </div>

        {/* Toolbar: Feed Categories, Time Frequency, Search, and Category Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-nordic-900/50 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Feed Switcher Tabs */}
            <div className="flex items-center bg-nordic-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => {
                  sound.playClick();
                  setFeedType('trending');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  feedType === 'trending'
                    ? 'bg-gradient-to-r from-orange-500/30 to-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Trending (Hot)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setFeedType('most_downloaded');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  feedType === 'most_downloaded'
                    ? 'bg-gradient-to-r from-orange-500/30 to-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Most Downloaded</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setFeedType('latest_added');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  feedType === 'latest_added'
                    ? 'bg-gradient-to-r from-orange-500/30 to-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Latest Added</span>
              </button>
            </div>

            {/* Time Frequency Filter */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400 hidden sm:inline-block" />
              <select
                value={timeRange}
                onChange={(e) => {
                  sound.playClick();
                  setTimeRange(e.target.value as DiscoveryTimeRange);
                }}
                className="px-3 py-1.5 bg-nordic-950 border border-slate-750 focus:border-amber-500 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                {TIME_RANGES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>

              {/* Refresh button */}
              <button
                onClick={() => {
                  sound.playClick();
                  loadFeed(true);
                }}
                disabled={isLoading}
                title="Force refresh feed from Nexus Mods"
                className="p-2 rounded-xl bg-nordic-950 border border-slate-750 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search & Category Filter Row */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discovered mods by title, author, or description..."
                className="w-full pl-10 pr-9 py-2 bg-nordic-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-56">
              <SlidersHorizontal className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  sound.playClick();
                  setCategoryFilter(e.target.value);
                }}
                className="w-full pl-8 pr-7 py-2 bg-nordic-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm font-medium text-slate-200 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {MOD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>
          </div>
        </div>

        {/* Scrollable Content: Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-nordic-950/70">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RotateCw className="w-10 h-10 text-amber-400 mx-auto animate-spin" />
              <h3 className="text-base font-cinzel font-bold text-slate-300">
                Contacting Nexus Mods API...
              </h3>
              <p className="text-xs text-slate-400">Fetching live Skyrim Special Edition feed.</p>
            </div>
          ) : filteredMods.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-nordic-900/40 rounded-2xl border border-slate-800/80">
              <Flame className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-cinzel font-bold text-slate-300">No Discovered Mods Found</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                No mods matched your active search query &quot;{searchQuery}&quot; or chosen category. Try broadening your filter or selecting &quot;All-Time&quot;.
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setTimeRange('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-nordic-950 shadow-gold-glow"
              >
                Reset Discovery Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {filteredMods.map((mod) => {
                const existingInLibrary = checkInLibrary(mod);
                const isJustTracked = justTrackedIds.has(mod.mod_id);
                const isTracked = Boolean(existingInLibrary || isJustTracked);
                const priorityDisplay = existingInLibrary
                  ? `#${String(existingInLibrary.priority).padStart(4, '0')}`
                  : null;

                return (
                  <div
                    key={mod.mod_id}
                    className="rounded-2xl border border-slate-800 bg-nordic-900/60 hover:border-amber-500/50 hover:bg-nordic-900/90 transition-all duration-200 shadow-lg flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Hero Thumbnail Banner */}
                    <div className="relative h-44 overflow-hidden bg-nordic-950 flex-shrink-0">
                      <img
                        src={mod.picture_url}
                        alt={mod.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback Skyrim atmosphere banner if image fails
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      {/* Gradient vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-nordic-950 via-nordic-950/40 to-transparent" />

                      {/* Top badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border backdrop-blur-md ${getCategoryBadgeStyle(
                            mod.suggested_category
                          )}`}
                        >
                          {mod.suggested_category}
                        </span>

                        {isTracked && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 backdrop-blur-md flex items-center space-x-1 shadow-sm">
                            <Check className="w-3 h-3" />
                            <span>In Library {priorityDisplay ? `(${priorityDisplay})` : ''}</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom Endorsement pill */}
                      <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-2 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-amber-300 backdrop-blur-sm flex items-center space-x-1 font-bold">
                          <ThumbsUp className="w-3 h-3 text-amber-400" />
                          <span>{formatCount(mod.endorsement_count)}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-slate-300 backdrop-blur-sm font-medium">
                          v{mod.version}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="text-base font-cinzel font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                          {mod.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          by <span className="text-slate-300">{mod.author}</span>
                        </p>

                        <p className="text-xs text-slate-300/90 mt-2 line-clamp-2 leading-relaxed font-sans">
                          {mod.summary}
                        </p>
                      </div>

                      {/* Metrics strip */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                        <div className="flex items-center space-x-1.5 truncate">
                          <Download className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span title={`${mod.mod_downloads.toLocaleString()} total downloads`}>
                            {formatCount(mod.mod_downloads)} dl
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 truncate">
                          <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>{formatRelativeTime(mod.updated_timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 bg-nordic-950/90 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1">
                        <a
                          href={mod.nexus_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-nordic-900 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
                          title="Open official mod page on Nexus Mods"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleCopyLink(mod)}
                          className="p-1.5 rounded-lg bg-nordic-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                          title="Copy Nexus URL to clipboard"
                        >
                          {copiedModId === mod.mod_id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Track / Add to Load Order Button */}
                      {isTracked ? (
                        <div className="flex items-center space-x-1 text-xs font-semibold font-mono text-emerald-400/90 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tracked</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTrackClick(mod)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow transition-all"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Track in Load Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-nordic-950 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>
              Displaying <strong className="text-slate-200">{filteredMods.length}</strong> discovered Skyrim SE mods
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl font-bold bg-nordic-850 hover:bg-nordic-800 border border-slate-750 text-slate-200 hover:text-white transition-all"
          >
            Close Discovery Hub
          </button>
        </div>
      </div>
    </div>
  );
};
