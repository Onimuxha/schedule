# PWA Installation & Offline Guide

Your Weekly Schedule Planner is a **Progressive Web App (PWA)**! Here's everything you need to know about installing and using it offline.

## ✅ What's Already Enabled

Your app comes with:
- **📱 Installable** - Add to home screen on mobile & desktop
- **🔌 Offline-First** - Works without internet (cache-first strategy)
- **⚡ Fast Loading** - Service worker caches all assets
- **🌍 Bilingual** - English & Khmer support
- **💾 Auto-Save** - All data stored locally in browser

## 📲 How to Install on Mobile

### iPhone/iPad (iOS)
1. Open the app in **Safari** (not Chrome)
2. Tap the **Share** button (bottom middle)
3. Tap **"Add to Home Screen"**
4. Give it a name (default: "Schedule")
5. Tap **"Add"**
6. App icon appears on your home screen!

### Android
1. Open the app in **Chrome**, **Edge**, or **Firefox**
2. Tap the **menu** (three dots, top right)
3. Tap **"Install app"** or **"Add to Home Screen"**
4. Confirm by tapping **"Install"**
5. App appears in your apps list & home screen!

## 💻 How to Install on Desktop

### Windows
1. Open in **Chrome** or **Edge**
2. Click the **install icon** (top right, looks like ⬆️ in box)
3. Click **"Install"**
4. App opens in its own window!

### Mac
1. Open in **Chrome** or **Edge**
2. Click the **install icon** (top right)
3. Click **"Install"**
4. App appears in Applications folder!

## 🔌 Using Offline

### How Offline Works
- **First visit**: App downloads and caches all files
- **Next visits**: If offline, app loads from cache instantly
- **Data**: Your schedule is saved locally (never lost!)
- **Sync**: When back online, everything syncs automatically

### What Works Offline
✅ View your schedule  
✅ Edit activities & time slots  
✅ Drag and drop reorganize  
✅ Mark tasks complete  
✅ Change language  
✅ Export as PNG/PDF  

### What Needs Internet
🌐 If you want to share with others (future feature)

## 📋 For Development (Testing)

If you're testing the PWA in development mode:
1. Service worker is only active in **production** build
2. To test offline locally:
   - Build for production: `npm run build`
   - The service worker will register automatically
   - Try disconnecting internet to see offline caching work!

## 🔄 Cache Updates

Your service worker uses **cache-first strategy**:
- **First load**: Downloads from server, caches it
- **Future loads**: Loads from cache (fastest!)
- **When cache updates**: Next app visit gets fresh version

Cache name: `weekly-schedule-v1`

## ❓ Troubleshooting

### App not appearing in install menu
- Make sure you're using a supported browser:
  - **Mobile**: Chrome, Firefox, Edge, Safari (iOS 15+)
  - **Desktop**: Chrome, Edge, Firefox, Safari
- Visit the app at least once before installing

### Changes not showing after update
- Service worker caches everything
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache in settings

### Not working offline?
- First visit must be online to download & cache files
- Check browser DevTools → Application → Cache Storage
- You should see `weekly-schedule-v1` cache with files

### Lost my schedule
- Your schedule is saved in browser localStorage
- It survives offline and app restart
- Clearing browser data = data is lost (backup by exporting as PNG/PDF!)

## 🚀 Best Practices

1. **Export your schedule regularly** as PNG or PDF for backup
2. **Install on home screen** for fastest access
3. **Use offline** - great for airplane mode, remote areas
4. **Check language settings** - saves your preference

## 📊 App Data Storage

- **Activities**: Stored in browser (not sent to server)
- **Schedule**: Stored in browser (not sent to server)  
- **Language preference**: Stored in browser
- **Privacy**: All data stays on YOUR device!

## 🔐 Security & Privacy

- No data is sent to any server
- No tracking or analytics
- No ads
- Completely private - your schedule is yours alone!

---

Enjoy your offline-capable schedule planner! 🎉
