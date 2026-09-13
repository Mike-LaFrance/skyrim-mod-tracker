import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Server,
  Key,
  FileCode2,
  ListOrdered,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Terminal,
  FolderSync,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNexusModal: () => void;
}

interface HelpTopic {
  id: string;
  category: 'getting-started' | 'load-order' | 'nexus-api' | 'mo2' | 'ionos' | 'shortcuts' | 'faq';
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
                This compiles and creates a production-ready <code className="text-amber-300 font-mono">dist/</code> folder containing <code className="font-mono">index.html</code>, the <code className="font-mono">assets/</code> directory, <code className="font-mono">metadata.json</code>, and the pre-configured <code className="font-mono">.htaccess</code> file.
              </p>
            </div>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="font-bold text-amber-300 flex items-center gap-2">
                <FolderSync className="w-4 h-4" />
                Step 2: Connect via WinSCP
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-300">
                <li><strong>File Protocol:</strong> SFTP (Port 22) or FTP (Port 21).</li>
                <li><strong>Host Name:</strong> Your IONOS server address (e.g. <code className="font-mono text-amber-300">accessXXXXXXXXX.webspace-data.io</code> or your domain).</li>
                <li><strong>User Name & Password:</strong> Your IONOS Secure FTP account credentials.</li>
              </ul>
            </div>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="font-bold text-amber-300 flex items-center gap-2">
                <Server className="w-4 h-4" />
                Step 3: Transfer Files to /skyrim-mod-tracker
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                In WinSCP, open the folder: <code className="text-amber-300 font-mono">/skyrim-mod-tracker</code>.
              </p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs sm:text-sm text-amber-200">
                <strong>Important:</strong> Do NOT upload the <code className="font-mono">dist</code> folder itself. Instead, open the local <code className="font-mono">c:\skyrim-mod-tracker\dist</code> folder on your left pane, select <strong>all files and folders inside it</strong>, and drag them into the remote <code className="font-mono">/skyrim-mod-tracker</code> folder!
              </div>
              <p className="text-xs text-slate-400">
                Your remote folder structure must look like this:
              </p>
              <pre className="p-3 rounded-lg bg-nordic-900 border border-slate-800 font-mono text-xs text-slate-300">
{`/skyrim-mod-tracker/
├── assets/
│   ├── index-xxxx.css
│   └── index-xxxx.js
├── .htaccess
├── index.html
└── metadata.json`}
              </pre>
            </div>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="font-bold text-amber-300">
                Step 4: Configure Domain in IONOS Cloud Panel
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
                <li>Log in to your <strong>IONOS Control Panel</strong> (my.ionos.com).</li>
                <li>Navigate to <strong>Websites & Domains &rarr; Manage Domains</strong>.</li>
                <li>
                  Click the gear icon on the domain or subdomain you wish to use (e.g. <code className="text-amber-300 font-mono">tracker.yourdomain.com</code> or <code className="text-amber-300 font-mono">yourdomain.com</code>).
                </li>
                <li>Select <strong>Adjust Destination / Edit Target Directory</strong>.</li>
                <li>
                  Set the directory to: <code className="text-amber-300 font-mono">/skyrim-mod-tracker</code> and save.
                </li>
                <li>
                  Ensure <strong>SSL Certificate</strong> is enabled (IONOS provides free Let's Encrypt / Wildcard certificates with 1 click).
                </li>
              </ol>
            </div>
          </div>
        ),
      },

      // Nexus Mods API Integration Guide
      {
        id: 'nexus-api-setup',
        category: 'nexus-api',
        title: 'Connecting Nexus Mods API for Live Updates',
        summary: 'Generate and configure your free Nexus Mods Personal API Key for real-time version audits.',
        keywords: ['nexus', 'api', 'key', 'token', 'updates', 'rate limit', 'mod id', 'automatic'],
        content: (
          <div className="space-y-4 text-slate-200 text-xs sm:text-sm">
            <p className="leading-relaxed">
              By connecting your personal Nexus Mods API key, you unlock direct, live version querying from the Nexus Mods database for Skyrim Special Edition.
            </p>

            <div className="bg-nordic-950/90 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="font-bold text-amber-300">How to obtain your Free Personal API Key:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                <li>
                  Open your browser and sign into your account on{' '}
                  <a
                    href="https://www.nexusmods.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 underline font-semibold inline-flex items-center gap-1"
                  >
                    NexusMods.com <ExternalLink className="w-3 h-3" />
                  </a>.
                </li>
                <li>
                  Go to <strong>Site Preferences &rarr; API Tab</strong> (or visit{' '}
                  <a
                    href="https://www.nexusmods.com/users/myaccount?tab=api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 underline font-semibold inline-flex items-center gap-1"
                  >
                    nexusmods.com/users/myaccount?tab=api <ExternalLink className="w-3 h-3" />
                  </a>).
                </li>
                <li>
                  Scroll to the section labeled <strong>Personal API Key</strong>.
                </li>
                <li>
                  Click the <strong>"Generate API Key"</strong> button and copy the generated key string.
                </li>
                <li>
                  Return to this app, click the <strong>"Nexus API Key"</strong> button in the top header, paste the key, and click <strong>"Validate & Save"</strong>.
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
                <li><strong>Swap Up / Down:</strong> Use the arrow buttons beside the priority badge to swap positions with adjacent mods.</li>
                <li><strong>Direct Type-to-Jump:</strong> Click directly on the priority badge itself to type a specific priority index (e.g. type <code className="font-mono text-amber-300">25</code> and press Enter to jump to position 25).</li>
                <li><strong>Clean Renumber:</strong> If gaps appear after deletions or reordering, click the <strong>"Clean Renumber"</strong> button in the header to re-index all mods sequentially (0, 1, 2... N) without any gaps.</li>
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
                No. Everything is saved in real-time to your browser's HTML5 <code className="text-amber-300">localStorage</code>. When you refresh or reopen the page, your exact priorities and notes will be restored.
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
                Guides, Nexus API Instructions, MO2 Rules & IONOS Webspace Deployment
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
              placeholder="Search help topics (e.g. 'IONOS', 'WinSCP', 'Nexus API', 'Priority', 'MO2')..."
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
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-nordic-950 shadow-gold-glow'
                    : 'bg-nordic-800 text-slate-300 hover:text-white hover:bg-nordic-750 border border-slate-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Accordion List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredTopics.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="font-semibold text-slate-300">No help topics matched your search "{searchQuery}"</p>
              <p className="text-xs text-slate-500">Try searching for keywords like "IONOS", "Nexus", "Priority", or "CSV".</p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isExpanded = Boolean(expandedTopics[topic.id]);

              return (
                <div
                  key={topic.id}
                  className="rounded-xl border border-slate-800 bg-nordic-950/60 overflow-hidden transition-all hover:border-slate-700"
                >
                  <button
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-nordic-850/60 transition-colors"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-2">
                        {topic.category === 'ionos' && <Server className="w-4 h-4 text-cyan-400" />}
                        {topic.category === 'nexus-api' && <Key className="w-4 h-4 text-amber-400" />}
                        {topic.category === 'load-order' && <ListOrdered className="w-4 h-4 text-emerald-400" />}
                        {topic.category === 'mo2' && <FileCode2 className="w-4 h-4 text-purple-400" />}
                        {topic.category === 'shortcuts' && <Sparkles className="w-4 h-4 text-yellow-400" />}
                        {topic.category === 'faq' && <HelpCircle className="w-4 h-4 text-blue-400" />}
                        <h3 className="font-bold text-base sm:text-lg text-slate-100">{topic.title}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 pl-6">{topic.summary}</p>
                    </div>
                    <div className="p-1 rounded-lg text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-nordic-900/40 text-sm">
                      {topic.content}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-nordic-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Need more help? Check the repository README or consult the Skyrim modding community.</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl font-bold bg-nordic-800 hover:bg-nordic-750 text-slate-200 border border-slate-700 text-xs sm:text-sm transition-colors"
          >
            Close Codex
          </button>
        </div>
      </div>
    </div>
  );
};
