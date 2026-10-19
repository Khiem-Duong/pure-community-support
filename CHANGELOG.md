# Changelog

Every push to GitHub must include an entry here describing what changed and the current version of the website.

## Format

```
## [version] - YYYY-MM-DD
### What changed
- Brief description of what was added, updated, or removed
```

---

## [0.6.7] - 2026-10-19
### What changed
- Added site.webmanifest (name "Pure Community Support", short name "Pure", cream background and theme colour) with 192 and 512px app icons (lotus on cream, app-icon-v1.1-*.png) for Android "Add to Home screen"
- Every public page now links the manifest, gives the iPhone icon its size (180 × 180) and sets the iPhone home-screen title to "Pure"

## [0.6.6] - 2026-10-19
### What changed
- Favicons v1.1: the lotus now fills the full width of the square (aspect ratio kept, centred vertically) instead of sitting inside extra space; new favicon-v1.1.svg, favicon-v1.1-96.png, apple-touch-icon-v1.1.svg and apple-touch-icon-v1.1.png (v1.0 files kept)
- /favicon.ico rebuilt from v1.1; every public and admin page now uses the v1.1 icons

## [0.6.5] - 2026-10-19
### What changed
- Added /favicon.ico (16, 32 and 48px) at the site root, the file DuckDuckGo and Bing look for
- Added a 96 × 96 PNG favicon for search engines and a 180 × 180 iPhone icon (lotus on cream), rendered from the v1.0 SVGs (assets/images/favicon/)
- Every public page now lists the .ico, the SVG, the 96px PNG and the iPhone icon

## [0.6.4] - 2026-10-19
### What changed
- New square favicon (assets/images/favicon/favicon-v1.0.svg): the lotus mark centred in a square so search engines (Google, Bing, DuckDuckGo) can use it; purple by default and white in dark mode, in one file
- Every public page and both admin pages now use it instead of the two non-square logo files (light and dark); the original logo files are unchanged
- Added apple-touch-icon-v1.0.svg (lotus on cream), the source for a future 180 × 180 PNG iPhone icon; not linked yet
- Still to do: /favicon.ico and PNG icons (needed by DuckDuckGo and Bing)

## [0.6.3] - 2026-10-19
### What changed
- Hover effects (card lifts, photo zooms, overlays) no longer start while the page is scrolling: pointer events are switched off during a scroll and for about 150ms after it stops, on mouse and trackpad only. New shared file assets/js/scroll-hover.js (loaded on every page), rule in nav-menu.css
- Removed the blog from the public site until it exists: home page "From the Blog" section and its styles, and the footer "Blog" link on every page
- Reports page: recap cards and "Read the full recap" no longer link to /blog (cards are plain until recaps are published; their hover effects only apply when they are links)
- About, Impact and Reports text no longer refers to the blog (recaps are described as published on the Reports page)

## [0.6.2] - 2026-10-15
### What changed
- Admin: the sidebar stays in view under the top bar while the page scrolls (wider than 900px), and scrolls on its own if taller than the window; the phone menu is unchanged

## [0.6.1] - 2026-10-15
### What changed
- Admin Tags: Delete button on each tag with a confirmation popup; when products use the tag it warns "Deleting this tag will remove it from x product(s):" and lists them (each opens its edit page in a new tab); undo available
- Admin Products: checkbox on each row; while any are ticked, "Add a product" becomes a right-aligned "Batch action" menu with Cancel, Delete selection, Modify price (both with a confirmation listing the products) and Export → PDF
- PDF export asks for a document title, then opens the browser's print window ("Save as PDF") with a branded layout: logo, centred title and date, then each product's title, photo, price, material, colour, maker and description
- Products toolbar (search, tag filter, Shown / Hidden filter, Add a product / Batch action) stays pinned under the top bar while scrolling
- Search is by name only; new tag filter button (multiselect, long tag names cut off) next to a slightly narrower search bar
- "In stock / Sold out" renamed to "Shown / Hidden" on the Products screen and in the product editor (Visibility); not yet connected to the shop

## [0.6.0] - 2026-10-15
### What changed
- Admin: product editor at /admin/products/<id> (Edit) and /admin/products/new (Add a product), with name, description, price, maker, material, colour, availability, "New" badge, photo (drag and drop or file picker, preview only) and a tags multiselect
- Adding a product requires every field except tags and photo (photo becomes required once image storage is connected); editing requires name and price
- Admin: new Tags screen under Shop for adding and renaming tags; tags appear in the product editor's tag list. Starts from the shop's collections
- Each admin screen now has its own address (/admin/products, /admin/tags, ...), so refresh and the back button work
- Saving isn't connected yet: product and tag changes are kept in the browser only (with a "Discard changes" button) and do not affect the shop
- Worker serves the dashboard at the new screen paths and allows blob: images so chosen photos can be previewed

## [0.5.10] - 2026-10-12
### What changed
- Shop: if the last page would hold less than one row of products, that page is dropped and its products are shared among the earlier pages as evenly as whole numbers allow (e.g. 15, 15, 1 becomes 16, 15); every product is still shown

## [0.5.9] - 2026-10-12
### What changed
- Closing strips ("Where the money goes" on Shop, Cases and campaign pages; the final call to action on About, Impact and Reports; "Get Involved" on Home) are now grouped with the footer in a page-end wrapper, so both stay together at the bottom of the window on short pages

## [0.5.8] - 2026-10-12
### What changed
- Footer now stays at the bottom of the window on every page, even when the page is shorter than the window (large screens, zoomed-out browsers)
- Shop: two rows is the minimum rather than the limit — the grid shows as many full rows as fit the window's height (still at least 2 rows and about 12 products on ordinary screens)

## [0.5.7] - 2026-10-12
### What changed
- Nav bar scaling reduced by about 10% (text and icons now start growing at 1333px wide instead of 1200px)
- Removed the Blog link from the top bar on every page until the blog exists (footer and home page blog links unchanged)

## [0.5.6] - 2026-10-12
### What changed
- Nav bar: link text, dropdown arrows, EN / VI switch, cart icon and count, "Shop Now" button and the dropdown panels now scale with the bar on windows wider than 1200px (the logo already did); phone menu unchanged
- Shop: products per page now follows the number of columns that fit the screen — whole rows only, at least 2 rows (e.g. 5 columns → 15 products, 9 columns → 18) — and re-pages when the window is resized

## [0.5.5] - 2026-10-12
### What changed
- Order list control: items already in the order list can be set to 0; "Update order list" then removes the item, the button returns to "Add to order list" and the stepper to 1
- Items not in the list still have a minimum quantity of 1

## [0.5.4] - 2026-10-12
### What changed
- Order list control (shop quick view and item pages): the quantity stepper now starts at the quantity already in the order list
- Button reads "Add to order list" for new items and "Update order list" for items already in the list; updating sets the quantity instead of adding on top
- Removed the "In your order list: x." line; the "View order list" link stays, with a brief "Added." / "Updated." confirmation after a click

## [0.5.3] - 2026-10-12
### What changed
- Shop quick view: previous / next arrows moved from the footer to the left and right sides of the popup (over the photo's edges on phones); the footer keeps the "3 / 31" counter
- Quick view is larger (up to 1180 × 720px) and tightens automatically on shorter windows (smaller title, 2-line description, then hides description and tag) so it fits without scrolling
- Shorter confirmation after adding to the order list ("Added 2. In your order list: 4.")

## [0.5.2] - 2026-10-12
### What changed
- "Add to order list" control is now one compact row: quantity stepper plus an "Add x to order list" button with the live total inside it
- Shop quick view tightened so it fits without scrolling: price and placeholder tag share a row, description capped at 3 lines, "View full details" is a text link in one footer row with the previous / next arrows, less padding
- On phones the quick view photo is shorter and "Continue browsing" is hidden (the close button does the same job)

## [0.5.1] - 2026-10-07
### What changed
- Removed the "Inquire about this piece" button from item pages
- Shop quick view and item pages now show the quantity picker directly (no separate "Add to order list" button to open it)
- Button reads "Add x to order list" and the price total updates live as the quantity changes (e.g. "$156", "2 × $78")
- Order list icon changed to a shopping cart in the nav, on the add button and on the empty order list

## [0.5.0] - 2026-10-07
### What changed
- Replaced the placeholder signed-in page at /admin with the sidebar dashboard design
- Dashboard uses the signed-in user's real role: view-only notice and disabled buttons for viewers, People & roles for super-admins only, and a Sign out button
- Products screen lists the live catalog (search and stock filter work; saving is not connected yet and is labelled as such)
- Home shows live counts (products, running and planned programmes); sample people and activity removed in favour of empty states
- schema.sql comments switched to /* */ so the file still runs when pasted into the D1 Console (which joins lines)
- Removed a stray editor lock file (.#wrangler.jsonc) committed by mistake

## [0.4.1] - 2026-10-07
### What changed
- Removed the name column from the admin users table (schema.sql); the admin now shows the part of the email before the @ as the display name
- Updated the Worker's user lookup and the INSERT printed by scripts/hash-password.mjs to match
- Existing databases created with the old schema need: ALTER TABLE users DROP COLUMN name;

## [0.4.0] - 2026-10-07
### What changed
- Moved the website into public/ — only files in that folder are published; docs (CHANGELOG.md, SPEC_NOTES.md) and server code are no longer served
- Removed .assetsignore (no longer needed now that .git sits outside the published folder)
- Added wrangler.jsonc: publishes ./public, runs the Worker first for /admin, connects the D1 database (purecommunitysupportd1db)
- Added a Cloudflare Worker (worker/) with admin sign-in: /admin/login, /admin/logout and a placeholder signed-in page at /admin
- Sign-in uses PBKDF2 password hashes and hashed session tokens stored in D1, 12-hour sessions, and a 15-minute pause after repeated failed attempts
- Added schema.sql (users, sessions, login_attempts tables) and scripts/hash-password.mjs for creating the first super-admin
- Temporary /admin/db-check route to confirm the D1 connection

## [0.3.1] - 2026-10-05
### What changed
- Added .assetsignore so the Cloudflare deploy no longer uploads the .git folder (its pack file exceeded the 25 MiB asset limit and failed the deploy; it also stops the repo history being served publicly)

## [0.3.0] - 2026-10-05
### What changed
- Added an order list in place of a shopping cart: new page at /order-list (order-list.html)
- Order list table: item (links to the item page), price, quantity with − / + controls, and a line total that updates as the quantity changes; subtotal and total at the bottom
- Remove items or clear the list, both with undo; the list is saved in the visitor's browser
- "Add to order list" button in the shop quick view and on item pages; a quantity must be chosen before the item is added
- Order list icon with item count in the nav on every page ("Order list" in the mobile menu)
- Placeholder USD prices added to every product in assets/js/products.js, with shared price formatting
- New shared files: assets/js/order-list.js, assets/css/order-list.css

## [0.2.1] - 2026-08-10
### What changed
- Added 3D-printable version of the PURE logo (assets/images/3d-print/)
- pure-logo-3d-v1.0.stl: 3mm-thick relief, 120×104.7mm, traced from the white logo variant, includes lotus mark, "PURE" wordmark, and "community support" subtitle
- preview-pure-logo-3d-v1.0.png: rendered preview of the 3D model

## [0.2.0] - 2026-06-29
### What changed
- Built the full home page (index.html) — vanilla HTML/CSS/JS, no framework
- Sections: Nav, Hero, Category Strip, Featured Products, How It Works, Impact Counters, Campaigns, Artisans, Blog, Get Involved, Footer
- Four image dividers between sections using placeholder nature photos
- Pure CSS hover animations on all cards, buttons, nav links, and image dividers
- SVG icons for each product category derived from the lotus logo mark
- Lotus SVG icon used in Nav, Footer, and decorative dividers
- Counter animation on Impact section using Intersection Observer
- Gemola and Gilmer Light fonts referenced from -temp/Logos & fonts
- Bilingual placeholders: EN active, /vi/ links in place
- Fully responsive layout (breakpoints at 1024px, 768px, 480px)

## [0.1.0] - 2026-06-18
### What changed
- Initial project setup
- Added .gitignore
