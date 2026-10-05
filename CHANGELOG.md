# Changelog

Every push to GitHub must include an entry here describing what changed and the current version of the website.

## Format

```
## [version] - YYYY-MM-DD
### What changed
- Brief description of what was added, updated, or removed
```

---

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
