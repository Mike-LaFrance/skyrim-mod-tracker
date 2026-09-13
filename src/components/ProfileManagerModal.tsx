import React, { useState, useEffect } from 'react';
import {
  X,
  Layers,
  Check,
  Plus,
  Trash2,
  Copy,
  Download,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ModProfile, SkyrimMod } from '../types';
import {
  loadProfiles,
  saveProfiles,
  createProfileFromCurrent,
} from '../utils/profileStorage';
import { sound } from '../utils/audio';

interface ProfileManagerModalProps {
  isOpen: boolean;
  activeProfileId: string;
  currentMods: SkyrimMod[];
  onClose: () => void;
  onSelectProfile: (profile: ModProfile) => void;
}

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({
  isOpen,
  activeProfileId,
  currentMods,
  onClose,
  onSelectProfile,
}) => {
  const [profiles, setProfiles] = useState<ModProfile[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDesc, setNewProfileDesc] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProfiles(loadProfiles());
      setIsCreatingNew(false);
      setNewProfileName('');
      setNewProfileDesc('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (p: ModProfile) => {
    sound.playChime();
    onSelectProfile(p);
    onClose();
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const newProfile = createProfileFromCurrent(newProfileName, newProfileDesc, currentMods);
    const updated = [newProfile, ...profiles];
    setProfiles(updated);
    saveProfiles(updated);
    sound.playClick();
    setIsCreatingNew(false);
    setNewProfileName('');
    setNewProfileDesc('');
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    saveProfiles(updated);
    sound.playClick();
  };

  const handleDuplicateProfile = (p: ModProfile) => {
    const dup = createProfileFromCurrent(`${p.name} (Copy)`, p.description, p.mods);
    const updated = [dup, ...profiles];
    setProfiles(updated);
    saveProfiles(updated);
    sound.playClick();
  };

  const handleExportProfileJson = (p: ModProfile) => {
    const json = JSON.stringify(p, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_profile.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-nordic-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-nordic-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-cinzel font-bold text-slate-100">
                Mod Profiles & Loadout Manager
              </h2>
              <p className="text-xs text-slate-400">
                Switch between gameplay presets, survival builds, and graphics setups
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Action Bar */}
        <div className="px-6 py-3 bg-nordic-950/50 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {profiles.length} Saved Loadout Profiles
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setIsCreatingNew(!isCreatingNew);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Save Current as New Profile</span>
          </button>
        </div>

        {/* Create Profile Form */}
        {isCreatingNew && (
          <form
            onSubmit={handleCreateProfile}
            className="p-4 bg-nordic-950/90 border-b border-amber-500/30 space-y-3 animate-fadeIn"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Profile Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Mage & Magic Overhaul"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-nordic-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Focus on Apocalypse, Ordinator, and no armor mods"
                  value={newProfileDesc}
                  onChange={(e) => setNewProfileDesc(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-nordic-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-nordic-950 text-xs font-bold hover:bg-amber-400 shadow-gold-glow transition-all"
              >
                Save Profile ({currentMods.filter((m) => m.status === 'active').length} Active Mods)
              </button>
            </div>
          </form>
        )}

        {/* Profiles List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {profiles.map((p) => {
            const isActive = p.id === activeProfileId;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-nordic-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-cinzel font-bold text-slate-100 text-base">
                        {p.name}
                      </h3>
                      {isActive && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-nordic-950">
                          <Check className="w-3 h-3" />
                          <span>Active Profile</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 max-w-md">
                      {p.description}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                      <span>{p.mods.filter((m) => m.status === 'active').length} Active Plugins</span>
                      <span>&middot;</span>
                      <span>{p.mods.length} Total Mods</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
                    {!isActive ? (
                      <button
                        onClick={() => handleSelect(p)}
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-nordic-950 text-xs font-bold transition-all shadow-gold-glow flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Activate</span>
                      </button>
                    ) : (
                      <span className="text-xs text-amber-400 font-semibold px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/30">
                        Currently Loaded
                      </span>
                    )}

                    <button
                      onClick={() => handleDuplicateProfile(p)}
                      title="Duplicate Profile"
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleExportProfileJson(p)}
                      title="Export Profile as JSON"
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {profiles.length > 1 && (
                      <button
                        onClick={() => handleDeleteProfile(p.id)}
                        title="Delete Profile"
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 border border-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-nordic-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Profiles preserve load order priorities and mod active/disabled states.</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
