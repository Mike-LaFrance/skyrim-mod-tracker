import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Server,
  Key,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Terminal,
  FolderSync,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNexusModal: () => void;
}

interface HelpTopic {
  id: string;
  category: 'getting-started' | 'load-order' | 'nexus-api' | 'mo2' | 'ionos' | 'shortcuts' | 'faq' | 'features';
  title: string;
  summary: string;
  content: React.ReactNode;
  keywords: string[];
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenNexusModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'ionos-step-by-step': true,
    'nexus-api-setup': true,
    'nexus-auto-fetch': true,
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleTopic = (id: string) => {
    sound.playClick();
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const topics: HelpTopic[] = useMemo(
    () => [
      // IONOS Webspace Deployment Guide
      {
        id: 'ionos-step-by-step',
        category: 'ionos',
        title: 'Deploying to IONOS Webspace via WinSCP (Folder: skyrim-mod-tracker)',
        summary: 'Complete walkthrough to compile and transfer your tracker to IONOS web hosting.',
        keywords: ['ionos', 'winscp', 'deploy', 'hosting', 'ftp', 'sftp', 'folder', 'upload', 'webspace', 'domain'],
        content: (
          <div className="space-y-4 text-slate-200">
            <p className="leading-relaxed">
              You have created the folder <code className="text-amber-300 font-mono px-1.5 py-0.5 bg-nordic-950 rounded border border-slate-800">skyrim-mod-tracker</code> on your IONOS webspace in WinSCP. Here is the exact, step-by-step procedure to deploy and make the application live on the web:
            </p>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="font-bold text-amber-300 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Step 1: Build the Production Bundle Locally
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                In your terminal or PowerShell inside <code className="text-amber-300 font-mono">c:\skyrim-mod-tracker</code>, run:
              </p>
              <div className="relative">
                <pre className="p-3 rounded-lg bg-nordic-900 border border-slate-750 font-mono text-xs text-amber-200 overflow-x-auto">
                  npm run build
                </pre>
                <button
                  onClick={() => handleCopy('npm run build', 'cmd-build')}
                  className="absolute right-2 top-2 p-1.5 rounded bg-nordic-800 text-slate-400 hover:text-white"
                >
                  {copiedCode === 'cmd-build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                This compiles and creates a production-ready <code className="text-amber-300 font-mono">dist/</code> folder containing <code className="font-mono">index.html</code>, the <code className="font-mono">assets/</code> directory, and the pre-configured <code className="font-mono">.htaccess</code> file.
              </p>
            </div>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="font-bold text-amber-300 flex items-center gap-2">
                <FolderSync className="w-4 h-4" />
                Step 2: Transfer with WinSCP
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
                <li>
                  Open <strong>WinSCP</strong> and connect to your IONOS SFTP / FTP session.
                </li>
                <li>
                  In the <strong>Right Panel (Remote Server)</strong>, open your destination folder:
                  <code className="block mt-1 font-mono text-amber-300 bg-nordic-900 p-1.5 rounded border border-slate-800">
                    /skyrim-mod-tracker/
                  </code>
                </li>
                <li>
                  In the <strong>Left Panel (Local Computer)</strong>, navigate to:
                  <code className="block mt-1 font-mono text-amber-300 bg-nordic-900 p-1.5 rounded border border-slate-800">
                    c:\skyrim-mod-tracker\dist\
                  </code>
                  <em>(Make sure you are inside the <strong>dist</strong> folder, not the root project folder!)</em>
                </li>
                <li>
                  Select all 3 items inside <code className="font-mono text-amber-300">dist/</code>:
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-400">
                    <li><strong className="text-slate-200">assets/</strong> (folder)</li>
                    <li><strong className="text-slate-200">index.html</strong> (file)</li>
                    <li><strong className="text-slate-200">.htaccess</strong> (hidden file - press <kbd className="px-1 py-0.5 bg-slate-800 rounded text-[11px]">Ctrl + Alt + H</kbd> if hidden)</li>
                  </ul>
                </li>
                <li>
                  Drag and drop them into the right panel to overwrite the remote folder.
                </li>
              </ol>
            </div>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2 text-xs sm:text-sm text-slate-300">
              <h4 className="font-bold text-amber-300">Step 3: Access in Your Web Browser</h4>
              <p>
                Navigate to:
              </p>
              <code className="block p-2 rounded bg-nordic-900 border border-slate-800 text-amber-300 font-mono">
                https://yourdomain.com/skyrim-mod-tracker/
              </code>
              <p className="text-xs text-slate-400">
                The assets were specifically bundled with relative paths (<code className="text-amber-300">base: './'</code>), so the application runs seamlessly out of any subfolder without 404 script errors!
              </p>
            </div>
          </div>
        ),
      },

      // 7 NEW ADVANCED FEATURES:

      // Feature 1: Nexus 1-Click Auto-Fetch
      {
        id: 'nexus-auto-fetch',
        category: 'features',
        title: '⚡ 1-Click Nexus Auto-Fetch on Add Mod',
        summary: 'Paste any Nexus Mods link or Mod ID to instantly auto-fill title, author, version, summary, and artwork.',
        keywords: ['nexus', 'auto-fetch', 'fetch', 'url', 'mod id', 'add mod', 'automatic', 'metadata', 'artwork'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              Adding new mods is completely effortless with the connected Nexus API. Instead of typing metadata manually:
            </p>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">How to use Auto-Fetch:</h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                <li>Click the <strong>"Add Mod"</strong> button in the top header.</li>
                <li>In the top <em>Nexus 1-Click Auto-Fetch</em> bar, paste any Nexus URL (e.g. <code className="font-mono text-amber-300">https://www.nexusmods.com/skyrimspecialedition/mods/12604</code>) or just the numeric Mod ID (<code className="font-mono text-amber-300">12604</code>).</li>
                <li>Click the golden <strong>"Auto-Fetch"</strong> button.</li>
                <li>The engine contacts Nexus Mods and instantly populates:
                  <ul className="list-disc pl-5 mt-1 text-slate-400 space-y-0.5">
                    <li>Official Mod Title</li>
                    <li>Author Name</li>
                    <li>Installed & Latest Version Numbers</li>
                    <li>In-Game Overview & Description Summary</li>
                    <li>Intelligently inferred Category and Plugin Type</li>
                    <li>Official Hero Artwork / Thumbnail banner URL</li>
                  </ul>
                </li>
                <li>Review the priority and click <strong>"Register Mod"</strong>!</li>
              </ol>
            </div>
          </div>
        ),
      },

      // Feature 2: 254 Plugin Engine Limit Gauge
      {
        id: 'engine-plugin-limit',
        category: 'features',
        title: '🛡️ Skyrim Engine Plugin Limit: 254 ESM/ESP Cap & 4,096 ESLs',
        summary: 'Understanding the Skyrim SE 254 master plugin crash barrier, ESL light flags, and the real-time header gauge.',
        keywords: ['engine', 'limit', '254', 'cap', 'esm', 'esp', 'esl', 'light', 'crash', 'gauge', 'slots', '0xfe'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              Skyrim Special Edition&apos;s engine uses hexadecimal indices (<code className="text-amber-300 font-mono">0x00</code> to <code className="text-amber-300 font-mono">0xFF</code>) to assign form IDs in memory.
            </p>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">The 254 Hard Engine Cap:</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>Slots <code className="text-amber-300 font-mono">0x00</code> through <code className="text-amber-300 font-mono">0xFD</code> are reserved for full <strong className="text-slate-100">.esm</strong> and <strong className="text-slate-100">.esp</strong> master plugins (maximum 254 total).</li>
                <li>Activating more than 254 full plugins causes an <strong>immediate engine crash (CTD)</strong> upon launching Skyrim.</li>
                <li>Slot <code className="text-cyan-300 font-mono">0xFE</code> is the Light Plugin Container (<strong className="text-cyan-300">.esl</strong>). ESL plugins do <em>not</em> count toward the 254 limit and you can run up to <strong>4,096</strong> of them simultaneously!</li>
              </ul>
            </div>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">The Real-Time Engine Cap Gauge:</h4>
              <p className="text-slate-300">
                In the top header, the <strong>Engine Cap gauge</strong> continuously computes your active ESM and ESP plugins:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li><span className="text-emerald-400 font-bold">Green (&lt; 200)</span>: Safe zone with ample room for additional mods.</li>
                <li><span className="text-amber-400 font-bold">Amber (200 - 244)</span>: Caution zone; begin flagging patch ESPs as ESL in SSEEdit.</li>
                <li><span className="text-red-400 font-bold">Red (245 - 254)</span>: Danger zone; imminent game crashes if additional ESPs are enabled.</li>
              </ul>
            </div>
          </div>
        ),
      },

      // Feature 3: Conflict Diagnostics Engine
      {
        id: 'conflict-diagnostics',
        category: 'features',
        title: '⚠️ Load Order Diagnostics & Compatibility Rules Engine',
        summary: 'How the built-in diagnostic rule engine detects placement errors, missing SKSE dependencies, and patch advisories.',
        keywords: ['diagnostics', 'conflict', 'loot', 'alternate start', 'lux', 'caco', 'ordinator', 'address library', 'warning', 'order'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              The application features a built-in automated rules evaluator modeled after <strong>LOOT (Load Order Optimization Tool)</strong> standards:
            </p>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">Automated Rules Checked in Real Time:</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong>Alternate Start Placement:</strong> Warns if "Alternate Start - Live Another Life" is placed too high. It must load near the bottom so it can properly override quest starting scripts.</li>
                <li><strong>Lux / Lighting Placement:</strong> Ensures interior lighting overhauls like Lux load after weather mods (e.g. Cathedral Weathers) so lighting templates are preserved.</li>
                <li><strong>Address Library for SKSE:</strong> Flags critical errors if DLL mods (PO3 Tweaks, Precision, TrueHUD) are active while Address Library is missing, disabled, or loaded after them.</li>
                <li><strong>Perk Overhaul Patches:</strong> Advises installing the official compatibility patch if CACO (Complete Alchemy & Cooking Overhaul) and Ordinator are detected simultaneously.</li>
                <li><strong>Official DLC Sequence:</strong> Validates Dawnguard (#0000) &rarr; HearthFires (#0001) &rarr; Dragonborn (#0002) at the top of your load order.</li>
                <li><strong>Duplicate Priorities:</strong> Flags any mods sharing the exact same priority index.</li>
              </ul>
            </div>
            <p className="text-slate-400">
              Click the <strong>"Diagnostics"</strong> button in the header (which glows amber when issues exist) to view detailed recommendations and fixes.
            </p>
          </div>
        ),
      },

      // Feature 4: Mod Profiles & Loadout Presets
      {
        id: 'mod-profiles-guide',
        category: 'features',
        title: '📂 Mod Profiles & Loadout Presets (Vanilla+, Survival, Graphics)',
        summary: 'Switch between gameplay setups in 1 click, save custom presets, and export profiles.',
        keywords: ['profiles', 'presets', 'loadout', 'vanilla+', 'survival', 'graphics', 'switch', 'save', 'export'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              Mod Profiles let you maintain different character builds and testing setups without losing your custom priority order:
            </p>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">Pre-Configured Presets:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong className="text-slate-100">Full Master Loadout (62 Mods)</strong>: Complete setup with quests, combat, shaders, and followers.</li>
                <li><strong className="text-slate-100">Vanilla+ Core Stability</strong>: Lightweight setup activating only core DLCs, SKSE utilities, Address Library, and SkyUI.</li>
                <li><strong className="text-slate-100">Hardcore Survival & Roleplay</strong>: Tailored build around Survival Mode, CACO alchemy, Ordinator perks, and Inigo.</li>
                <li><strong className="text-slate-100">Graphics & Visual Showcase</strong>: Pure graphical fidelity focusing on Community Shaders, Lux, Cathedral Weathers, and SMIM.</li>
              </ul>
            </div>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <h4 className="font-bold text-amber-300">Managing Profiles:</h4>
              <p>
                Click the <strong>Profiles</strong> button in the top header toolbar to activate any profile, save your current setup as a new custom loadout, duplicate existing presets, or export profiles to standalone <code className="text-amber-300 font-mono">.json</code> files.
              </p>
            </div>
          </div>
        ),
      },

      // Feature 5: Drag and Drop Reordering
      {
        id: 'drag-and-drop-guide',
        category: 'features',
        title: '🖐️ Smooth Drag-and-Drop Load Order Reordering',
        summary: 'Grab any card or table row handle to reposition mods dynamically with automatic sequential renumbering.',
        keywords: ['drag', 'drop', 'reorder', 'grip', 'handle', 'priority', 'move', 'mouse'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              In addition to clicking arrow buttons and typing numeric priority indices, you can visually drag and drop mods anywhere in your load order:
            </p>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">How to Drag & Drop:</h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                <li>Locate the <strong>Grip Handle</strong> (<code className="text-amber-300 font-mono">:::</code>) on the far-left of any mod card or table row.</li>
                <li>Click and hold to pick up the mod.</li>
                <li>Drag it up or down to your desired target position. A golden highlight line indicates the landing spot.</li>
                <li>Release the mouse button. The list automatically shifts positions, cleanly renumbers all priorities sequentially (0, 1, 2... N), and plays a procedural reorder swoosh sound!</li>
              </ol>
            </div>
          </div>
        ),
      },

      // Feature 6: Custom Tags & Suspect Flags
      {
        id: 'custom-tags-guide',
        category: 'features',
        title: '🏷️ Custom Tags & Suspect Flags (#crash-suspect, #needs-patch)',
        summary: 'Tag mods for crash isolation, testing, or patch tracking, and filter your modlist by tag in the FilterBar.',
        keywords: ['tags', 'crash-suspect', 'needs-patch', 'essential', 'script-heavy', 'testing', 'filter', 'chips'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              Tags provide rapid organization and troubleshooting flags across your load order:
            </p>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">Built-in Predefined Tags:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-nordic-900 border border-slate-800"><span className="text-amber-300 font-mono font-bold">#essential</span> &mdash; Core mod indispensable to your playthrough</div>
                <div className="p-2 rounded bg-nordic-900 border border-slate-800"><span className="text-red-300 font-mono font-bold">#crash-suspect</span> &mdash; Suspected cause of game CTD crashes during testing</div>
                <div className="p-2 rounded bg-nordic-900 border border-slate-800"><span className="text-orange-300 font-mono font-bold">#needs-patch</span> &mdash; Mod requiring an official compatibility patch</div>
                <div className="p-2 rounded bg-nordic-900 border border-slate-800"><span className="text-purple-300 font-mono font-bold">#script-heavy</span> &mdash; Mod running intense Papyrus scripts</div>
                <div className="p-2 rounded bg-nordic-900 border border-slate-800"><span className="text-cyan-300 font-mono font-bold">#testing</span> &mdash; Newly installed mod under current observation</div>
                <div className="p-2 rounded bg-nordic-900 border border-slate-800"><span className="text-emerald-300 font-mono font-bold">#visuals</span> &mdash; Textures, meshes, or shader assets</div>
              </div>
            </div>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <h4 className="font-bold text-amber-300">Filtering by Tag:</h4>
              <p>
                In the FilterBar, select any tag from the <strong>"All Tags"</strong> dropdown to instantly isolate only those mods (e.g. view only <code className="text-red-300">#crash-suspect</code> mods when tracking down crashes).
              </p>
            </div>
          </div>
        ),
      },

      // Feature 7: Artwork Banners
      {
        id: 'artwork-banners-guide',
        category: 'features',
        title: '🖼️ Cinematic Artwork Banners & Display Toggle',
        summary: 'Display official Nexus hero artwork on mod cards and toggle banners on or off in the FilterBar.',
        keywords: ['banners', 'artwork', 'images', 'thumbnail', 'gallery', 'toggle', 'visuals'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              Each mod card can render an atmospheric hero artwork banner with a subtle Nordic gradient vignette:
            </p>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <h4 className="font-bold text-amber-300">Adding Artwork:</h4>
              <p>
                When using Nexus Auto-Fetch, the official Nexus mod picture is automatically captured. You can also paste any custom image URL inside the <strong>Add Mod</strong> or <strong>Edit Mod</strong> modal.
              </p>
            </div>
            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <h4 className="font-bold text-amber-300">Toggle Banners On / Off:</h4>
              <p>
                In the FilterBar beside the view switcher, click the <strong>"Banners: On/Off"</strong> button. If you prefer ultra-compact cards or are browsing on a mobile device, toggling banners off provides an ultra-slim layout.
              </p>
            </div>
          </div>
        ),
      },

      // Nexus API Setup Instructions
      {
        id: 'nexus-api-setup',
        category: 'nexus-api',
        title: 'Connecting Your Nexus Mods Personal API Key',
        summary: 'How to obtain your free personal API key and connect it for live version checking.',
        keywords: ['nexus', 'api', 'key', 'token', 'updates', 'scanner', 'validate', 'quota'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              Connecting your personal Nexus Mods API key allows the application to check your installed mod versions against the live Nexus database and auto-fill metadata when adding mods.
            </p>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="font-bold text-amber-300 flex items-center gap-2">
                <Key className="w-4 h-4" />
                How to Generate Your API Key (Free):
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                <li>
                  Go to{' '}
                  <a
                    href="https://www.nexusmods.com/users/myaccount?tab=api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>Nexus Mods Account &rarr; API Settings</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  Scroll to the section labeled <strong>Personal API Key</strong>.
                </li>
                <li>
                  Click the <strong>"Generate API Key"</strong> button and copy the generated key string.
                </li>
                <li>
                  Return to this app, click the <strong>"Nexus API"</strong> button in the top header, paste the key, and click <strong>"Validate & Save"</strong>.
                </li>
              </ol>
            </div>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <h4 className="font-bold text-amber-300">API Quotas & Rate Limits:</h4>
              <p>
                Nexus Mods grants every standard account <strong>10,000 API requests per day</strong> (and up to 100 requests per minute). Since a full load order audit only consumes 1 request per mod (e.g. 62 requests for 62 mods), you will easily stay well within limits.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenNexusModal();
                }}
                className="px-4 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow flex items-center space-x-2 transition-all"
              >
                <Key className="w-4 h-4" />
                <span>Open Nexus API Key Settings Now</span>
              </button>
            </div>
          </div>
        ),
      },

      // Load Order Priority & MO2 Rules
      {
        id: 'load-order-rules',
        category: 'load-order',
        title: 'Mastering Load Order Priority & Renumbering',
        summary: 'Understanding 4-digit priority formatting (#0000), LOOT sorting rules, and status flags.',
        keywords: ['priority', 'load order', 'renumber', 'loot', 'order', 'swap', 'active', 'disabled', 'masters'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              In Skyrim Special Edition and ModOrganizer 2, mod priority determines which assets take precedence. If two mods modify the same texture, mesh, or record, the mod with the <strong>higher priority index (larger number)</strong> overwrites the earlier one.
            </p>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">The 4-Digit Format:</h4>
              <p className="text-slate-300">
                Every mod displays an indexed 4-digit badge (e.g. <code className="font-mono text-amber-300">#0000</code>, <code className="font-mono text-amber-300">#0018</code>).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong>Drag & Drop:</strong> Grab the grip handle to reposition any mod instantly.</li>
                <li><strong>Swap Up / Down:</strong> Use the arrow buttons beside the priority badge to swap positions with adjacent mods.</li>
                <li><strong>Direct Type-to-Jump:</strong> Click directly on the priority badge itself to type a specific priority index (e.g. type <code className="font-mono text-amber-300">25</code> and press Enter to jump to position 25).</li>
                <li><strong>Clean Renumber:</strong> If gaps appear after deletions or reordering, click the <strong>"Renumber"</strong> button in the header to re-index all mods sequentially (0, 1, 2... N) without any gaps.</li>
              </ul>
            </div>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">Active (+) vs Disabled (–):</h4>
              <p className="text-slate-300">
                Active mods (<code className="text-emerald-400 font-bold font-mono">+</code>) are enabled and loaded by the game engine. Disabled mods (<code className="text-rose-400 font-bold font-mono">–</code>) are retained in your organizer notes and catalog, but excluded from game execution.
              </p>
            </div>
          </div>
        ),
      },

      // MO2 Import & Export Engine
      {
        id: 'mo2-import-export',
        category: 'mo2',
        title: 'ModOrganizer2 CSV Format & Synchronization',
        summary: 'How to import existing modlist.txt profiles and export load orders back to ModOrganizer 2.',
        keywords: ['mo2', 'import', 'export', 'csv', 'modlist.txt', 'clipboard', 'sync'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              This application implements 100% interoperability with ModOrganizer 2 modlists.
            </p>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-300">The MO2 CSV Format:</h4>
              <pre className="p-3 rounded-lg bg-nordic-900 border border-slate-750 font-mono text-xs text-amber-200 overflow-x-auto">
{`#Mod_Priority,#Mod_Status,#Mod_Name
"0000","+","DLC: HearthFires"
"0001","+","SkyUI"
"0002","-","CACO"`}
              </pre>
            </div>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <h4 className="font-bold text-amber-300">Smart Metadata Retention on Import:</h4>
              <p>
                When you paste an MO2 modlist into the Import tab, the engine checks each mod against our rich Skyrim database. When a mod name matches (e.g. "SkyUI" or "CACO"), all rich metadata (author, archive size, in-game description, Nexus URL, compatibility notes) is preserved. Unknown mods are automatically registered with inferred categories and plugin types.
              </p>
            </div>
          </div>
        ),
      },

      // Keyboard Shortcuts & Pro Tips
      {
        id: 'shortcuts-and-protips',
        category: 'shortcuts',
        title: 'Keyboard Shortcuts & Pro Tips',
        summary: 'Speed navigation, instant search, and procedural audio settings.',
        keywords: ['shortcuts', 'keyboard', 'audio', 'sound', 'mute', 'speed', 'tips'],
        content: (
          <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-nordic-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-mono text-amber-400 font-bold">Search Filter</span>
                <p className="text-slate-300 text-xs">
                  Type any author name (e.g. <code className="text-amber-300">Enai Siaion</code>, <code className="text-amber-300">Arthmoor</code>, <code className="text-amber-300">Ersh</code>) to isolate all their plugins instantly.
                </p>
              </div>

              <div className="p-3 bg-nordic-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-mono text-amber-400 font-bold">Direct Priority</span>
                <p className="text-slate-300 text-xs">
                  Click any <code className="text-amber-300">#0000</code> badge, type a number, and press <kbd className="px-1.5 py-0.5 rounded bg-nordic-800 border border-slate-700 text-slate-200">Enter</kbd> to jump.
                </p>
              </div>

              <div className="p-3 bg-nordic-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-mono text-amber-400 font-bold">Audio Synthesizer</span>
                <p className="text-slate-300 text-xs">
                  Click the speaker icon in the header to toggle Skyrim UI sounds (clicks, toggle notches, and level-up chimes).
                </p>
              </div>

              <div className="p-3 bg-nordic-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-mono text-amber-400 font-bold">Local Persistence</span>
                <p className="text-slate-300 text-xs">
                  All changes, notes, custom mods, and priorities are auto-saved in your browser's localStorage instantly.
                </p>
              </div>
            </div>
          </div>
        ),
      },

      // Frequently Asked Questions
      {
        id: 'faq-persistence',
        category: 'faq',
        title: 'Frequently Asked Questions & Troubleshooting',
        summary: 'Answers to common questions regarding storage, resetting, and browser caching.',
        keywords: ['faq', 'questions', 'troubleshooting', 'reset', 'clear', 'storage', 'offline'],
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <div className="space-y-1">
              <h5 className="font-bold text-amber-300">Will I lose my load order if I close the browser?</h5>
              <p className="text-slate-300">
                No. Everything is saved in real-time to your browser's HTML5 <code className="text-amber-300">localStorage</code>. When you refresh or reopen the page, your exact priorities, custom profiles, and notes are restored.
              </p>
            </div>

            <div className="space-y-1">
              <h5 className="font-bold text-amber-300">How do I restore the original 62 Skyrim SE mod catalog?</h5>
              <p className="text-slate-300">
                Click the circular reset icon (rotate counter-clockwise) in the top header toolbar and confirm. This restores the pristine default load order preset.
              </p>
            </div>

            <div className="space-y-1">
              <h5 className="font-bold text-amber-300">Why are some mods highlighted in amber with an alert?</h5>
              <p className="text-slate-300">
                Those mods (like CACO, Community Shaders, and Beyond Reach) have newer releases detected on Nexus Mods. Click "Mark Updated" or run "Check Updates" to synchronize them.
              </p>
            </div>
          </div>
        ),
      },
    ],
    [copiedCode]
  );

  // Search and Category Filtering
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      if (!searchQuery.trim()) return matchesCategory;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [topics, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-nordic-900 border border-gold-500/40 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-slate-800 bg-nordic-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-200">
                Elder Scrolls Codex & Help Center
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Guides, Feature Reference, Nexus API, Diagnostics, MO2 Rules & IONOS Webspace Deployment
              </p>
            </div>
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

        {/* Search Bar & Category Filter Bar */}
        <div className="p-5 border-b border-slate-800/90 bg-nordic-950/70 space-y-3">
          {/* Instant Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g. 'Auto-Fetch', '254 Limit', 'Diagnostics', 'Profiles', 'IONOS', 'WinSCP')..."
              className="w-full pl-11 pr-10 py-2.5 bg-nordic-900 border border-slate-700/80 focus:border-amber-500/80 rounded-xl text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'features', label: '⚡ Advanced Features' },
              { id: 'ionos', label: 'IONOS Deployment' },
              { id: 'nexus-api', label: 'Nexus API Setup' },
              { id: 'load-order', label: 'Load Order Rules' },
              { id: 'mo2', label: 'MO2 Import/Export' },
              { id: 'shortcuts', label: 'Shortcuts & Tips' },
              { id: 'faq', label: 'FAQs' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-nordic-950 font-bold shadow-gold-glow'
                    : 'bg-nordic-900 text-slate-300 hover:text-white border border-slate-750'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Topics Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {filteredTopics.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-cinzel font-bold text-slate-300">No Help Topics Found</h3>
              <p className="text-xs text-slate-400">
                No articles matched &quot;{searchQuery}&quot;. Try searching for &quot;Auto-Fetch&quot;, &quot;254&quot;, &quot;Profiles&quot;, or &quot;IONOS&quot;.
              </p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isExpanded = Boolean(expandedTopics[topic.id]);
              return (
                <div
                  key={topic.id}
                  className="rounded-xl border border-slate-800 bg-nordic-950/80 hover:border-slate-700 transition-all overflow-hidden"
                >
                  {/* Topic Title Accordion Trigger */}
                  <button
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                          {topic.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-cinzel font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                          {topic.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400">{topic.summary}</p>
                    </div>

                    <div className="p-1 rounded-lg bg-nordic-900 text-slate-400 group-hover:text-white flex-shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Topic Detailed Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 text-xs sm:text-sm animate-fade-in">
                      {topic.content}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-nordic-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2 text-slate-300">
            <Server className="w-4 h-4 text-amber-400" />
            <span>Target Webspace: <code className="text-amber-300 font-mono">/skyrim-mod-tracker</code></span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow transition-all"
          >
            Close Codex
          </button>
        </div>
      </div>
    </div>
  );
};
