# Skyrim Mod Organizer & Load Order Tracker

A dedicated, production-ready single-page web application built with **React**, **TypeScript**, and **Tailwind CSS** designed to serve as a Skyrim Special Edition load order companion, Nexus version auditor, and ModOrganizer2 compatible import/export utility.

![Theme](https://img.shields.io/badge/Theme-Nordic%20Dark-amber.svg)
![React](https://img.shields.io/badge/React-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## Features

- **Atmospheric Nordic Aesthetic**: Deep obsidian canvas (`#0a0d14`, `#111622`), antique gold & amber accents (`#f59e0b`), typography featuring `Cinzel`, `Plus Jakarta Sans`, and `JetBrains Mono`.
- **Procedural Web Audio Feedback**: In-game RPG click, toggle tick, pneumatic reorder swoosh, and level-up harmonic chimes synthesized using the Web Audio API with a global mute toggle.
- **Load Order Priority Management**:
  - 4-digit formatted priority indices (`#0000` to `#NNNN`).
  - Swap order with Move Up / Move Down buttons.
  - Direct click-to-edit inline input to jump any mod to a specific priority.
  - One-click **Clean Renumber** to re-index all mods sequentially without gaps.
  - MO2 active (`+`) vs disabled (`-`) toggle with bulk Enable All / Disable All tools.
- **Dense Multi-Filtering, Search & Sort**:
  - Instant search matching mod title, author, description, technical notes, and category.
  - 13 Mod Categories and 8 Plugin Types (DLC, ESM, ESP, ESL Light, SKSE Plugin, Creation Club, Engine Utility, Asset Archive).
  - Status filter chips: All Mods, Active (+), Disabled (-), and Updates Available.
  - Sorting by Priority, Mod Name, Category, or Update Status (Ascending / Descending).
  - **View Switcher**: Detailed Accordion Card View vs. Compact Desktop MO2 Table View.
- **Nexus Mods Version Audit**:
  - Interactive "Check Updates" scanner modal with simulated live Nexus API query, animated progress bar, and "Update All" action.
- **ModOrganizer 2 Import / Export Engine**:
  - Export load order in official MO2 format:
    ```text
    #Mod_Priority,#Mod_Status,#Mod_Name
    "0000","+","DLC: HearthFires"
    "0001","+","SkyUI"
    ```
  - One-click Copy to Clipboard and `.txt` file download.
  - Import pasted MO2 text or CSV with auto-matching that retains rich metadata for known mods and automatically categorizes unknown plugins.
- **Pre-Loaded Seed Catalog**: 62 authentic Skyrim Special Edition mods reflecting a realistic modern load order across DLCs, Creation Club, SKSE Core, UI Overhauls, Combat & Animations, Visuals & Shaders, Gameplay Overhauls, and Expansion Lands (Beyond Skyrim, Wyrmstooth, Falskaar, Midwood Isle, Darkend, etc.).
- **Persistence**: Real-time auto-saving to `localStorage` with a "Reset Defaults" option.

---

## Getting Started

### Prerequisites

- Node.js 18+ (tested with Node 20 / 24)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd skyrim-mod-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

The compiled assets will be in the `dist/` directory, ready to deploy to GitHub Pages, Vercel, or Netlify.

---

## Project Structure

```text
/
├── index.html                     # HTML entry with Google Fonts (Cinzel, Plus Jakarta Sans, JetBrains Mono)
├── package.json                   # Dependencies & build scripts
├── tsconfig.json                  # TypeScript compiler settings
├── vite.config.ts                 # Vite bundler configuration
├── tailwind.config.js             # Custom Skyrim Nordic palette & typography tokens
├── postcss.config.js              # PostCSS plugins
└── src/
    ├── main.tsx                   # React root mount
    ├── index.css                  # Tailwind styles, dark scrollbars & Nordic glow
    ├── types.ts                   # Mod and filter interface definitions
    ├── data/
    │   └── initialMods.ts         # Pre-loaded catalog of 62 authentic Skyrim SE mods
    ├── utils/
    │   ├── audio.ts               # Web Audio API procedural sound synthesizer
    │   └── storage.ts             # LocalStorage persistence & MO2 CSV parser
    ├── components/
    │   ├── Header.tsx             # Brand header, stats ribbon & action buttons
    │   ├── FilterBar.tsx          # Search bar, category/type dropdowns, chips, sorting, view toggle
    │   ├── ModItemCard.tsx        # Accordion card with priority badge, status toggle & Nexus details
    │   ├── ModTableView.tsx       # Compact desktop table view for dense inspection
    │   ├── AddModModal.tsx        # Modal form to register new mods
    │   ├── EditModModal.tsx       # Modal form to edit mod properties
    │   ├── ImportExportModal.tsx  # MO2 export, copy, download, and import parser
    │   └── UpdatesScannerModal.tsx# Simulated Nexus version audit with progress bar
    └── App.tsx                    # Main state orchestrator & filter logic
```

---

## License

MIT
