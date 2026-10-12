# Changelog

Every push to GitHub must include an entry here describing what changed and the current version of the website.

## Format

```
## [version] - YYYY-MM-DD
### What changed
- Brief description of what was added, updated, or removed
```

---

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
