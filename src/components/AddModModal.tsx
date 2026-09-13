import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, DownloadCloud, Image as ImageIcon, Tag, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { MOD_CATEGORIES, PLUGIN_TYPES, PREDEFINED_TAGS, ModCategory, PluginType, SkyrimMod } from '../types';
import { autoFetchNexusModDetails } from '../utils/nexusApi';
import { sound } from '../utils/audio';

interface AddModModalProps {
  isOpen: boolean;
  nextPriority: number;
  onClose: () => void;
  onAdd: (mod: SkyrimMod) => void;
}

export const AddModModal: React.FC<AddModModalProps> = ({
  isOpen,
  nextPriority,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState(nextPriority);
  const [status, setStatus] = useState<'active' | 'disabled'>('active');
  const [category, setCategory] = useState<ModCategory>('Gameplay Overhaul');
  const [pluginType, setPluginType] = useState<PluginType>('ESP Plugin');
  const [currentVersion, setCurrentVersion] = useState('1.0.0');
  const [latestVersion, setLatestVersion] = useState('1.0.0');
  const [hasUpdate, setHasUpdate] = useState(false);
  const [author, setAuthor] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [description, setDescription] = useState('');
  const [nexusUrl, setNexusUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [notes, setNotes] = useState('');

  // Nexus Auto-Fetch State
  const [isFetchingNexus, setIsFetchingNexus] = useState(false);
  const [fetchMessage, setFetchMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleAutoFetch = async () => {
    if (!nexusUrl.trim()) {
      setFetchMessage({ type: 'error', text: 'Please paste a Nexus Mods URL or enter a numeric Mod ID first.' });
      return;
    }

    setIsFetchingNexus(true);
    setFetchMessage(null);
    sound.playClick();

    const result = await autoFetchNexusModDetails(nexusUrl);
    setIsFetchingNexus(false);

    if (result.success) {
      sound.playChime();
      if (result.name) setName(result.name);
      if (result.author) setAuthor(result.author);
      if (result.version) {
        setCurrentVersion(result.version);
        setLatestVersion(result.version);
      }
      if (result.summary) setDescription(result.summary);
      if (result.imageUrl) setImageUrl(result.imageUrl);
      if (result.suggestedCategory) setCategory(result.suggestedCategory);
      if (result.suggestedPluginType) setPluginType(result.suggestedPluginType);
      if (result.nexusUrl) setNexusUrl(result.nexusUrl);

      setFetchMessage({
        type: 'success',
        text: `Successfully imported "${result.name}" by ${result.author || 'Unknown'} from Nexus!`,
      });
    } else {
      setFetchMessage({
        type: 'error',
        text: result.error || 'Failed to fetch mod details.',
      });
    }
  };

  const handleToggleTag = (tagName: string) => {
    sound.playClick();
    if (tags.includes(tagName)) {
      setTags(tags.filter((t) => t !== tagName));
    } else {
      setTags([...tags, tagName]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = customTagInput.trim().replace(/^#+/, '');
    if (!clean) return;
    const formatted = `#${clean.toLowerCase()}`;
    if (!tags.includes(formatted)) {
      setTags([...tags, formatted]);
    }
    setCustomTagInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sound.playChime();
    const newMod: SkyrimMod = {
      id: `custom-mod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      priority: Math.max(0, priority),
      status,
      category,
      pluginType,
      currentVersion: currentVersion.trim() || '1.0.0',
      latestVersion: latestVersion.trim() || currentVersion.trim() || '1.0.0',
      hasUpdate,
      author: author.trim() || 'Anonymous Author',
      fileSize: fileSize.trim() || '—',
      description: description.trim() || 'Custom Skyrim mod entry.',
      nexusUrl: nexusUrl.trim() || `https://www.nexusmods.com/skyrimspecialedition/search/?gsearch=${encodeURIComponent(name.trim())}`,
      notes: notes.trim(),
      imageUrl: imageUrl.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    onAdd(newMod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-nordic-900 border border-gold-500/40 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-nordic-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <PlusCircle className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-200">Add Mod to Load Order</h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-nordic-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm custom-scrollbar">
          {/* Nexus Auto-Fetch Banner Bar */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-nordic-950 to-amber-500/5 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Nexus 1-Click Auto-Fetch</span>
              </span>
              <span className="text-[11px] text-slate-400">Paste URL &rarr; Auto-fills all fields</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={nexusUrl}
                onChange={(e) => setNexusUrl(e.target.value)}
                placeholder="https://www.nexusmods.com/skyrimspecialedition/mods/12604 or Mod ID 12604"
                className="flex-1 px-3 py-2 bg-nordic-950 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={handleAutoFetch}
                disabled={isFetchingNexus}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-nordic-950 text-xs font-bold transition-all shadow-gold-glow flex items-center space-x-1.5 flex-shrink-0"
              >
                {isFetchingNexus ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <DownloadCloud className="w-3.5 h-3.5" />
                )}
                <span>{isFetchingNexus ? 'Fetching...' : 'Auto-Fetch'}</span>
              </button>
            </div>

            {fetchMessage && (
              <div
                className={`p-2 rounded-lg text-xs flex items-center space-x-2 ${
                  fetchMessage.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/60 border border-red-500/40 text-red-300'
                }`}
              >
                {fetchMessage.type === 'success' ? (
                  <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                )}
                <span>{fetchMessage.text}</span>
              </div>
            )}
          </div>

          {/* Mod Title */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1 text-xs">
              Mod Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. True Directional Movement, JK's Skyrim..."
              className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Priority Index (#)</label>
              <input
                type="number"
                min="0"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'disabled')}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="active">Active Plugin (+)</option>
                <option value="disabled">Disabled Plugin (-)</option>
              </select>
            </div>
          </div>

          {/* Category & Plugin Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ModCategory)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              >
                {MOD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Plugin Type</label>
              <select
                value={pluginType}
                onChange={(e) => setPluginType(e.target.value as PluginType)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              >
                {PLUGIN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Versions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Installed Version</label>
              <input
                type="text"
                value={currentVersion}
                onChange={(e) => setCurrentVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Latest Nexus Version</label>
              <input
                type="text"
                value={latestVersion}
                onChange={(e) => setLatestVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center space-x-2 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasUpdate}
                  onChange={(e) => setHasUpdate(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="text-slate-300 font-medium text-xs">Flag Update Available</span>
              </label>
            </div>
          </div>

          {/* Author & File Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Mod author name"
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Archive File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 45.2 MB, 1.2 GB"
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Artwork Image URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold text-xs flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Artwork / Thumbnail Image URL</span>
              </label>
              <span className="text-[11px] text-slate-400">Optional banner preview</span>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... image banner URL (auto-filled by Nexus)"
              className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
            />
            {imageUrl && (
              <div className="mt-2 h-16 rounded-lg overflow-hidden border border-slate-700 relative">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Custom Tags */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 text-xs flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Custom Tags</span>
            </label>

            {/* Predefined Tag Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {PREDEFINED_TAGS.map((t) => {
                const isSelected = tags.includes(t.name);
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => handleToggleTag(t.name)}
                    className={`px-2 py-0.5 rounded text-xs font-mono border transition-all ${
                      isSelected
                        ? `${t.color} font-bold ring-1 ring-amber-400/40`
                        : 'bg-nordic-950 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Type custom tag (e.g. #magic) and press Enter"
                className="flex-1 px-3 py-1.5 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">In-Game Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Summary of what this mod does, gameplay features, lore background..."
              className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Compatibility Notes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">Compatibility Notes / LOOT Flags</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Load after Ordinator, requires Nemesis generation, MCM hotkey notes..."
              className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 bg-nordic-800 hover:bg-nordic-750 transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow flex items-center space-x-1.5 transition-all text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Register Mod</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
