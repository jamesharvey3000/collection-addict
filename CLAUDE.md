# Collection Addict — Project Context

## What This Is
Collection Addict is a mobile-first Progressive Web App for tracking collections across multiple categories: whiskey, bourbon, wine, beer, spirits, cigars, pipe tobacco, pipes, hats, and more. Inspired by OnlyDrams but designed to blow it out of the water by covering multiple hobbies in one app.

## Owner
James

## Tech Stack
- **Frontend:** Vanilla JavaScript (no frameworks), single-page app with hash-based routing
- **Offline storage:** IndexedDB (primary data store, offline-first)
- **Cloud backend:** Supabase free tier (auth, Postgres database, cloud sync)
- **Hosting:** GitHub Pages
- **Icons:** Font Awesome 6.5
- **Fonts:** DM Serif Display (headings) + DM Sans (body) via Google Fonts
- **PWA:** Service worker + manifest for installability and offline support

## Design & Theme
- **Mode:** Dark
- **Base background:** #131110
- **Raised surfaces:** #1C1917
- **Surface:** #242120
- **Input backgrounds:** #1C1917
- **Borders:** #2E2A27
- **Primary accent:** #D4793A (orange)
- **Orange light:** #E89550
- **Text primary:** #E8E2DA
- **Text secondary:** #A69E94
- **Text muted:** #6E6660
- **Status colors:** Orange (owned), Green #4CAF6A (opened), Purple #9B7EC8 (wishlist), Red #CF5B4F (sold), Blue #5B9BD5 (traded), Amber #C8A84E, Rose #C87A8A
- **Radius:** 14px (cards), 10px (small), 6px (extra small)
- **Shadows:** Dark, layered (rgba black at 0.3–0.4)
- **Header:** Custom CA logo (whiskey glass + cigar) centered, search icon left, bell icon right
- **Mobile nav:** Bottom tab bar with frosted glass effect and floating orange + button
- **Desktop nav:** Sidebar navigation
- Cards are raised surfaces with soft borders and shadows for depth
- Forms use cream/dark input backgrounds that brighten on focus with orange glow ring
- Status badges are color-coded pills

## Project Structure
```
collection-addict/
├── index.html
├── manifest.json
├── sw.js
├── supabase-schema.sql
├── .gitignore
├── README.md
├── css/
│   └── app.css
├── js/
│   ├── app.js              (init, utilities, toast notifications)
│   ├── db.js               (IndexedDB CRUD layer)
│   ├── router.js           (hash-based SPA router)
│   ├── auth.js             (Supabase client, sign in/up/out)
│   ├── sync.js             (bidirectional IndexedDB ↔ Supabase sync)
│   ├── supabase-config.js  (Supabase URL + anon key — user edits locally)
│   ├── cat-fields.js       (category-specific field definitions + renderers)
│   └── views/
│       ├── home.js         (dashboard with greeting, stats, recent items)
│       ├── search.js       (full-text search across collections)
│       ├── add.js          (add item form, category dropdown triggers extra fields)
│       ├── collection.js   (collection browser with category filter pills)
│       ├── wishlist.js     (wishlist view with priority sort, Got It modal, share)
│       ├── item.js         (item detail view with edit/delete)
│       ├── profile.js      (user info, sign in/out, push/pull sync, export/import)
│       └── auth.js         (login/signup UI with tab switching)
└── img/
    ├── logo.png            (custom CA logo — whiskey glass + cigar)
    ├── favicon.svg
    ├── icon-192.png
    └── icon-512.png
```

## Database

### IndexedDB (local, offline-first)
- Object store: `items`
- Each item has: id, category, name, brand, price, status, location, rating, notes, metadata (JSONB for category-specific fields), created_at, updated_at

### Supabase (cloud sync)
- Table: `items` with columns: id (uuid), user_id (uuid, FK to auth.users), category, name, brand, price, status, location, rating, notes, metadata (jsonb), created_at, updated_at
- Row Level Security enabled — 4 policies: users read/insert/update/delete only their own items
- Auth: email/password, email confirmation disabled for dev
- Sync flow: IndexedDB is primary → new items save locally first → pushed to Supabase in background
- Profile page has manual "Push to Cloud" and "Pull from Cloud" buttons

### Guest Mode
- Uses an in-memory store (no IndexedDB, no Supabase)
- Resets on page refresh
- Full app functionality minus persistence

## Categories & Fields
Defined in `cat-fields.js`. Each category has shared fields (name, brand, price, status, location, rating, notes) plus category-specific fields stored in the metadata JSONB column:

- **Whiskey/Bourbon:** distillery, mashbill, age, proof, ABV, batch, barrel number, barrel type, finish, store selector, size, rarity, MSRP
- **Wine:** winery, vintage, varietal, appellation, region, ABV, size, drinking window
- **Beer:** brewery, style, ABV, IBU, format, seasonal
- **Cigars:** manufacturer, blend/vitola, wrapper/binder/filler, ring gauge, length, strength, smoking time
- **Pipe Tobacco:** brand/blender, blend name, blend type, tobacco components with percentages, cut type, tin date, container type, weight, opened/cellared status, aging duration, consumption runway calculator
- **Pipes:** maker, country, shape/style, material, stem material, finish, length, chamber dimensions, weight, usage log
- **Hats:** brand, style/silhouette, size (numeric fitted or S/M/L), team/logo, primary colorway, secondary colors, under-visor color, material, patch/collab, edition type, wear count

## Item Status Lifecycle
Owned → Opened/Consumed → Sold → Traded → Gifted → Broken → Donated → Archived → Lent

## What's Built & Working
- Full app shell with dark theme, PWA, service worker
- Hash-based SPA routing across all views
- IndexedDB CRUD (add, edit, delete, search, filter)
- Supabase auth (sign up, sign in, sign out)
- Bidirectional cloud sync
- Category-specific form fields that appear when category is selected
- Item detail view with edit and delete
- Star rating system
- Home dashboard with time-based greeting (uses first name from email), stats tiles, recent items
- Collection browser with category filter pills and status badges
- Full-text search
- JSON export/import for backup
- Status badges color-coded per status
- Skeleton shimmer loading states ready
- Auth page with tab switching (login/signup)
- Profile with user info, sync controls
- Photo uploads — client-side resize (800px full, 200px thumb, JPEG 80%), stored in Supabase Storage under item-photos/{user_id}/{item_id}/; displayed as rounded square on detail view and thumbnails on collection/wishlist rows
- Wishlist page — dedicated view for wishlist-status items with category filter pills, priority sorting (high/medium/low), expected price display, "Got It" modal to mark as owned with purchase price, clipboard share as formatted text list; priority and expected price fields appear in add/edit forms when status is wishlist

## Next Priorities (Not Yet Built)
1. **Barcode scanner** — html5-qrcode library for scanning UPC/EAN on bottles
2. **Stats dashboard with charts** — collection value over time, category breakdown donut, top brands
3. **GitHub Pages deployment** — push it live
4. **Social features** — check-ins (Untappd-style), activity feed, follow system, user reviews
5. **Market value tracking** — MSRP, secondary market prices, price history
6. **Gamification** — badges, milestones, streaks
7. **Label/band photo recognition** — OCR via Google Cloud Vision API
8. **Batch photo import** — rapidly catalog collections from photos

## Code Style Preferences
- No heavy commenting — keep it clean and professional, not "AI-looking"
- Vanilla JS only, no frameworks or build tools
- When presenting files, show the file path directly above each file download (path → file → path → file pattern)
- Use Font Awesome for all icons
- Mobile-first responsive design
- Animations should be subtle and polished (0.2s–0.3s transitions)
