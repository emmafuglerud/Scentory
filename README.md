# Scentory

A mobile-first perfume discovery app, built step by step for a university assignment with React, Vite, and plain CSS.

## Run locally

Use Node.js 22.12+ (Node 22). Open a terminal in this Scentory folder, then run:

```sh
npm install
npm run dev
```

Open the Local URL printed in the terminal (usually http://localhost:5173). Keep the terminal running. Your edits appear automatically in the browser. Press Ctrl+C to stop the server.

To check the production build:

```sh
npm run build
```

## Step 1: demo screens

- Login → Home
- Sign up → registration → Home
- Header menu → Log out → login

The forms only switch screens. Leave fields empty or enter made-up details. The app does not read, store, or send passwords, create accounts, or authenticate users. Refreshing returns to login. There is no backend or external authentication service.

## Where to edit

- `src/App.jsx`: existing login/signup screens and entry into the app.
- `src/App.css`: original login/signup layout, colors, and decorative perfume bottle.
- `src/components/ScentoryApp.jsx`: Home, navigation, and connecting collection actions to browser storage.
- `src/components/Discover.jsx`: perfume cards and live search by brand or name.
- `src/components/PerfumeDetails.jsx`: perfume facts, note lists, and missing-data messages.
- `src/components/PerfumeModal.jsx`: reuses perfume details inside the shared dialog.
- `src/components/Modal.jsx`: native dialog, close controls, focus return, nested-dialog handling, and background scroll preservation.
- `src/components/Collection.jsx`: My Collection, category filters/counts, compact cards, edit/remove, and empty states.
- `src/components/CollectionEditor.jsx`: required category and optional rating form.
- `src/components/CollectionIcon.jsx`: shared lightweight outline SVG icons.
- `src/components/Collection.css`: collection page and editor styles.
- `src/data/collection.js`: category/rating choices, storage validation, and reading/writing localStorage.
- `src/components/ScentoryApp.css`: responsive styles for screens after login.
- `src/data/perfumes.js`: the single perfume database, imported by the app.
- `src/index.css`: shared base styles.
- `src/main.jsx`: React entry point.

## Discover and perfume details

After logging in, use the bottom bar to move between Home, Discover, and Collection. Discover displays the 25 entries from the existing database in a grid: two columns on phones, three on wider screens, and four on desktop. Search updates as you type, ignores letter case and extra spaces at the ends, and matches either perfume name or brand.

Select a card to open its details in a modal over Discover. Close it with the X, Escape, or a click outside. Discover stays mounted underneath, retaining the search, filtered cards, and scroll position. Empty note tiers and other missing data display an unavailable message. Verified notes without an assigned tier are shown separately. Prices are labelled as approximate NOK prices for the listed bottle size, with the retailer and check date.

The modal uses the browser's native `dialog.showModal()` to keep keyboard focus inside and prevent interaction with the background. Focus starts on the close button and returns to the selected card on dismissal. The modal scrolls independently on small screens.

The header logo and sparkle sit between equal-width side columns, keeping them centered regardless of the menu and motto widths. The left hamburger opens a simple disclosure containing Log out on every authenticated page. Escape, clicking outside, or moving keyboard focus away dismisses it; Escape returns focus to the menu button. Log out returns to the demo login and clears open menus/modals. The bottom navigation layout is unchanged.

Search and navigation live in React state and reset when you return to login or refresh. The saved collection persists separately in this browser. No extra packages were added.

## My Collection (local demo)

Click **+ Add to Collection** in perfume details to open a second compact dialog. Choose exactly one category: **I own this**, **Previously owned**, **Wishlist**, or **Not for me**. A category is required; the optional rating (**Love it**, **Like it**, **Not for me**) is independent. Selecting a rating again clears it. Nothing is written until you submit. Closing or cancelling the editor leaves the saved collection unchanged and returns to the details dialog.

The button becomes **Edit Collection** for a saved perfume and preselects its existing choices. Saving updates its entry rather than adding a duplicate. The Collection navigation button opens **My Collection**, with category counts, filters, saved ratings, and actions to edit or remove each perfume. Empty categories include a button to return to Discover. Collection cards reuse the existing perfume details dialog.

The key `scentory.collection.v1` in `localStorage` holds an array like:

```json
[
  { "perfumeId": "ysl-libre-edp", "category": "owned", "rating": "love" },
  { "perfumeId": "ariana-grande-cloud-edp", "category": "wishlist", "rating": null }
]
```

Only the perfume ID, category and optional rating are stored. Display information comes from `src/data/perfumes.js`; full perfume objects are never duplicated in storage. Unknown perfume IDs, invalid categories, and duplicate entries are filtered on load. Invalid ratings become `null`. Damaged or blocked storage produces a message rather than crashing or pretending that a save succeeded; existing storage is not automatically overwritten on page load.

This is **local demo data, shared across demo logins in the same browser**, not a real personal account. It survives refreshing, closing/reopening the app, and logging out. It does not sync to another browser/device. Clearing this site's browser storage removes it. No backend, real authentication, or password storage is involved.

### Quick manual check

1. Run `npm run dev`, open the printed Local URL, and submit the login form (empty fields are fine).
2. Open Discover: it should show 25 perfumes.
3. Search for `Dior` (brand) or `Cloud` (name), then open a matching card.
4. Check the notes, bottle size, and approximate NOK price. Open Add to Collection, try saving without a category, then choose a category and optional rating and save. Reopen Edit Collection and check the choices. Cancel edits with X, Escape, or an outside click; check that only the editor closes. Close the details dialog and verify the Discover search and scroll remain.
5. Try an unmatched search, then Clear search. Open Pure Musc to see unavailable top/base note messages.
6. Check the header menu on Home, Discover, and Collection. Use Tab and Enter to reach/open it, Escape to dismiss it, and Log out to return to login. Check that signup also reaches Home.
7. Use a narrow browser window or your browser's mobile device preview to check the centered logo, wrapping motto, scrolling modal, and unchanged bottom navigation. In the modal, Tab and Shift+Tab should keep focus within the dialog.
8. On My Collection, check category counts, filtering, saved rating labels, editing, and removing perfumes. Move a perfume to a different category and confirm its count changes. Refresh, log in again, and check that saved entries remain. Select a Not for me category with a Love it rating to check their independence. Clear a rating by selecting it again.

Automated DOM interaction checks during implementation covered collection saves/updates/removal, required categories, optional/clearable independent ratings, counts/filters, persistence across app remount and logout/login, duplicate prevention, storage failures/corrupt data, nested dialog dismissal/focus/scroll locks, existing navigation/search, and missing-data fallbacks. The checks used native-dialog lifecycle shims because the DOM test environment does not implement the browser's top layer. Native focus trapping, Escape-to-cancel behavior, and visual responsiveness still need a real browser check; browser preview was unavailable in the development session.

Recommendations and a backend have not been implemented.
