# IONOS Webspace Deployment Standing Rule

Whenever new features, bug fixes, or UI changes are completed and approved for deployment:

1. **Pre-Deployment Execution**:
   - The assistant must automatically run the production build before instructing the user:
     ```powershell
     npm.cmd run build
     ```
   - Verify that the build completes successfully and `dist/` contains `index.html`, `assets/`, and `.htaccess`.

2. **Streamlined WinSCP Instructions**:
   - Always conclude with the simple 3-step WinSCP deployment summary:
     - **Local Folder**: `C:\skyrim-mod-tracker\dist`
     - **Remote Folder**: `/skyrim-mod-tracker`
     - **Action**: Drag and drop all 3 items (`assets/`, `index.html`, `.htaccess`) to overwrite existing files on the remote server.
     - **Browser URL**: Remind the user of their live URL to view the changes.
