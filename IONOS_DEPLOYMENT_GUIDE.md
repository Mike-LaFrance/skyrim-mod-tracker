# IONOS Webspace Deployment Guide for Skyrim Mod Organizer

This guide provides step-by-step instructions to deploy the **Skyrim Mod Organizer & Load Order Tracker** onto your **IONOS Webspace** using **WinSCP** into your existing remote directory: `/skyrim-mod-tracker`.

---

## 1. Overview & Architecture

The application is a modern Single Page Application (SPA) built with React, TypeScript, and Tailwind CSS.
When compiled, it turns into pure static HTML, CSS, JavaScript, and configuration files that can run on any standard Apache web server, including IONOS Web Hosting.

### Key Features Configured for IONOS:
- **Relative Base Path (`base: './'`)**: The assets in `vite.config.ts` are configured with relative paths (`./assets/...`). This ensures the app works perfectly whether hosted at the root domain (`https://yourdomain.com/`) OR inside a subfolder (`https://yourdomain.com/skyrim-mod-tracker/`).
- **Apache `.htaccess`**: Pre-configured in `public/.htaccess` and automatically included in `dist/`. It provides URL rewriting so refreshing any page never results in a 404 error, enables Gzip compression, and manages browser caching.

---

## 2. Prerequisites

1. **WinSCP** installed on your computer.
2. Your **IONOS SFTP / FTP credentials** (found in your IONOS Cloud Panel under **Hosting &rarr; SFTP / SSH** or **FTP**).
3. The remote folder already created: `/skyrim-mod-tracker`.

---

## 3. Step-by-Step Deployment Instructions

### Step 1: Compile the Production Bundle Locally

Open PowerShell or Command Prompt in your local project folder (`c:\skyrim-mod-tracker`) and run:

```powershell
npm run build
```

This compiles the source code into the `c:\skyrim-mod-tracker\dist` directory:

```text
c:\skyrim-mod-tracker\dist\
├── assets\
│   ├── index-xxxx.css
│   └── index-xxxx.js
├── .htaccess
├── index.html
└── metadata.json
```

> **Note:** The build process automatically copies `.htaccess` and `metadata.json` into `dist/`.

---

### Step 2: Connect to IONOS via WinSCP

1. Launch **WinSCP**.
2. In the Login dialog, enter your IONOS connection details:
   - **File protocol**: `SFTP` (recommended, Port `22`) or `FTP` (Port `21`)
   - **Host name**: Your IONOS server host (e.g., `accessXXXXXXXXX.webspace-data.io` or your domain name)
   - **User name**: Your IONOS FTP/SFTP username (e.g., `u123456789`)
   - **Password**: Your IONOS FTP/SFTP password
3. Click **Login**.

---

### Step 3: Navigate to Your Remote Target Folder

In the **right-hand pane (Remote Site / IONOS server)**:
1. Double-click to open your remote folder: `/skyrim-mod-tracker`.
2. Ensure you are currently inside `/skyrim-mod-tracker`.

---

### Step 4: Upload the Contents of `dist`

In the **left-hand pane (Local Computer)**:
1. Navigate to: `c:\skyrim-mod-tracker\dist`.
2. Select **all items** inside `dist`:
   - `assets/` (directory)
   - `.htaccess`
   - `index.html`
   - `metadata.json`
3. Drag and drop (or press **F5**) to upload them into the remote `/skyrim-mod-tracker` folder.

> [!IMPORTANT]
> **Do not upload the `dist` folder itself.** Upload the **contents** inside `dist` directly into `/skyrim-mod-tracker`.
>
> Your remote folder on IONOS should look like:
> ```text
> /skyrim-mod-tracker/
> ├── assets/
> ├── .htaccess
> ├── index.html
> └── metadata.json
> ```

---

### Step 5: Assign the Folder to Your Domain in the IONOS Control Panel

To connect your webspace folder to your website address:

1. Log in to the [IONOS Control Panel](https://my.ionos.com/).
2. Go to **Domains & SSL** (or **Websites & Shops**).
3. Find the domain or subdomain you want to use (e.g., `skyrim.yourdomain.com` or `yourdomain.com`).
4. Click the **gear icon (Actions)** &rarr; **Edit Destination** (or **Adjust Destination**).
5. In the **Target Directory** field, select or enter:
   ```text
   /skyrim-mod-tracker
   ```
6. Click **Save**.

---

### Step 6: Activate SSL Certificate (HTTPS)

1. In the IONOS Control Panel under **Domains & SSL**, select your domain.
2. Ensure **SSL Certificate** is active (IONOS includes free SSL certificates).
3. Enable **Force HTTPS (Redirect HTTP to HTTPS)**.

---

## 4. Verifying the Deployment

Open your web browser and navigate to your domain (e.g. `https://yourdomain.com/` or `https://yourdomain.com/skyrim-mod-tracker/`).

Check that:
- The Nordic dark theme and Cinzel typography load immediately.
- All 62 preloaded Skyrim SE mods are visible.
- Clicking **"Check Updates"**, **"MO2 Table"**, or **"Add Mod"** opens their respective modals without delay.
- The procedural Web Audio effects play when clicking or toggling (or can be muted).

---

## 5. Future Updates Workflow

Whenever you make changes or add custom mods and wish to update your live IONOS site:

1. Rebuild locally:
   ```powershell
   npm run build
   ```
2. In WinSCP, open `/skyrim-mod-tracker`.
3. Drag and drop the updated contents of `dist/` into `/skyrim-mod-tracker` to overwrite existing files.
4. Because `index.html` has no-cache headers in `.htaccess` and all asset filenames have unique hashes (e.g. `index-ygLB1Ucc.js`), visitors will immediately receive the latest version without clearing browser cache.

---

## 6. Troubleshooting

- **403 Forbidden Error**: Check file permissions in WinSCP. Files should be `644` (or `rw-r--r--`) and folders `755` (`rwxr-xr-x`).
- **Styles or Scripts Not Loading**: Ensure the `assets/` folder was uploaded and that `.htaccess` is present.
- **Changes not showing up**: Hard refresh your browser using `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac).
