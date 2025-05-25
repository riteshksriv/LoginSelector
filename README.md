# Login Selector Edge Extension

This Edge extension activates on `https://login.microsoftonline.com/` pages and allows you to add custom logic for Microsoft login flows.

## File Structure

```
LoginSelector/
├── manifest.json         # Extension manifest (v3)
├── background.js         # Service worker for background tasks
├── content.js            # Content script injected into login.microsoftonline.com pages
├── popup.html            # Popup UI shown when extension icon is clicked
└── icons/
    ├── icon16.png        # Extension icon (16x16)
    ├── icon32.png        # Extension icon (32x32)
    ├── icon48.png        # Extension icon (48x48)
    └── icon128.png       # Extension icon (128x128)
```

## How to Build and Load the Extension

1. **Clone or download** this repository to your local machine.
2. **Add icons**: Replace the placeholder icon files in the `icons/` folder with your own PNG images of the correct sizes.
3. **Open Edge** and go to `edge://extensions/`.
4. Enable **Developer mode** (toggle in the bottom left).
5. Click **"Load unpacked"** and select the `LoginSelector` folder.
6. The extension will now be available and will activate on Microsoft login pages.

## File Descriptions

- **manifest.json**: Declares extension metadata, permissions, scripts, and activation rules.
- **background.js**: Handles background events (e.g., installation, messaging).
- **content.js**: Runs in the context of `login.microsoftonline.com` pages. Add your custom logic here.
- **popup.html**: The UI shown when the extension icon is clicked.
- **icons/**: Contains the extension's icon images in various sizes.

## Customization
- Edit `content.js` to add your logic for interacting with the login page.
- Update `popup.html` for a custom popup interface.
- Adjust `manifest.json` if you need additional permissions or features.

---

For more information, see the [Microsoft Edge Extension documentation](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/).
