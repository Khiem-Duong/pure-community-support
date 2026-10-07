# Changelog

Every push to GitHub must include an entry here describing what changed and the current version of the website.

## Format

```
## [version] - YYYY-MM-DD
### What changed
- Brief description of what was added, updated, or removed
```

---

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
