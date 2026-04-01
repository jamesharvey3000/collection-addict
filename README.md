# Collection Addict

Track your collections — whiskey, cigars, pipes, hats, and more — all in one place.

A mobile-first Progressive Web App built with vanilla JavaScript, IndexedDB for offline-first storage, and Supabase for cloud sync (coming soon).

## Features

- Multi-category collection tracking (spirits, cigars, pipes, hats, and custom)
- Offline-first with IndexedDB — works without internet
- PWA installable on any device
- Star ratings, tasting notes, status tracking
- Full-text search across all collections
- JSON export/import for backup and data portability
- Category filtering and collection stats dashboard

## Tech Stack

- Vanilla JavaScript (no frameworks)
- IndexedDB for local persistence
- Service Worker for offline support
- Font Awesome 6.5 for icons
- Google Fonts (Bebas Neue + Source Sans 3)
- GitHub Pages for hosting
- Supabase for cloud backend (planned)

## Local Development

Serve the root directory with any static server:

```bash
npx serve .
```

Or open `index.html` directly in a browser (service worker requires HTTPS or localhost).

## Deployment

Push to a GitHub repo with GitHub Pages enabled on the `main` branch. The app is entirely static — no build step required.

## License

MIT
