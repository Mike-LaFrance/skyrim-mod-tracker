import React, { useState, useEffect } from 'react';
import { X, Edit2, Check } from 'lucide-react';
import { MOD_CATEGORIES, PLUGIN_TYPES, ModCategory, PluginType, SkyrimMod } from '../types';
import { sound } from '../utils/audio';

interface EditModModalProps {
  mod: SkyrimMod | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMod: SkyrimMod) => void;
}

export const EditModModal: React.FC<EditModModalProps> = ({
  mod,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState(0);
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
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (mod) {
      setName(mod.name);
      setPriority(mod.priority);
      setStatus(mod.status);
      setCategory(mod.category);
      setPluginType(mod.pluginType);
      setCurrentVersion(mod.currentVersion);
      setLatestVersion(mod.latestVersion);
      setHasUpdate(mod.hasUpdate);
      setAuthor(mod.author);
      setFileSize(mod.fileSize);
      setDescription(mod.description);
      setNexusUrl(mod.nexusUrl);
      setNotes(mod.notes);
    }
  }, [mod]);

  if (!isOpen || !mod) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sound.playClick();
    const updated: SkyrimMod = {
      ...mod,
      name: name.trim(),
      priority: Math.max(0, priority),
      status,
      category,
      pluginType,
      currentVersion: currentVersion.trim(),
      latestVersion: latestVersion.trim(),
      hasUpdate,
      author: author.trim(),
      fileSize: fileSize.trim(),
      description: description.trim(),
      nexusUrl: nexusUrl.trim(),
      notes: notes.trim(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-nordic-900 border border-gold-500/40 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-slate-800 bg-nordic-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Edit2 className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-200">Edit Mod Metadata</h2>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 sm:space-y-5 text-sm">
          {/* Mod Title */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5 text-xs sm:text-sm">
              Mod Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-nordic-950 border border-slate-700/90 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400 text-sm sm:text-base"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Priority Index (#)</label>
              <input
                type="number"
                min="0"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Status</label>
              <div className="flex items-center space-x-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    sound.playToggle();
                    setStatus('active');
                  }}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                    status === 'active'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-nordic-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Active (+)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playToggle();
                    setStatus('disabled');
                  }}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                    status === 'disabled'
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'bg-nordic-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Disabled (-)
                </button>
              </div>
            </div>
          </div>

          {/* Category & Plugin Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ModCategory)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                {MOD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Plugin Type</label>
              <select
                value={pluginType}
                onChange={(e) => setPluginType(e.target.value as PluginType)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                {PLUGIN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Versions & Update Flag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Installed Version</label>
              <input
                type="text"
                value={currentVersion}
                onChange={(e) => setCurrentVersion(e.target.value)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Latest Nexus Version</label>
              <input
                type="text"
                value={latestVersion}
                onChange={(e) => setLatestVersion(e.target.value)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Archive File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Nexus URL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nexus / Bethesda URL</label>
            <input
              type="url"
              value={nexusUrl}
              onChange={(e) => setNexusUrl(e.target.value)}
              className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">In-Game Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Compatibility Notes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Compatibility Notes / LOOT Flags</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-nordic-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 bg-nordic-800 hover:bg-nordic-750 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow flex items-center space-x-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
