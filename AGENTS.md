# Skyrim Mod Tracker - Project Rules & Deployment Guidelines

## 1. IONOS Webspace Deployment Standing Rule

Whenever new features, modifications, or bug fixes are added and ready to be deployed to the live IONOS webspace:

1. **Autonomous Build Execution**:
   - The agent will automatically run `npm.cmd run build` to verify TypeScript, compile the bundle, and update the `dist/` directory.
2. **Simplified Deployment Instructions**:
   - The agent will provide the concise 3-step WinSCP transfer instructions:
     1. Open local path: `C:\skyrim-mod-tracker\dist`
     2. Open remote path in WinSCP: `/skyrim-mod-tracker`
     3. Drag & drop `assets/`, `index.html`, and `.htaccess` to overwrite remote files.
     4. Refresh the live browser page.
