# Spec Review Notes

Notes from reviewing `PURE_COMMUNITY_SUPPORT_SPEC.md` and `pure-community-support-brief.html`.
Both documents are consistent with each other. The HTML brief is the visual companion to the spec.

---

## Corrections

### Cross-reference error in Section 4.3
`PURE_COMMUNITY_SUPPORT_SPEC.md`, Section 4.3 says:

> Pending Product Decisions (see Section 9)

Section 9 is **Technical Stack**. The intended reference is **Section 10 (To-do Questions)**.

---

## Data Model Gaps

The draft data model in Section 8 does not yet include tables that will be needed once the pending
decisions in Section 10 are resolved. These are not blockers for now, but should be added before
implementing the relevant features:

- **`product_variants`** — needed if any products (e.g. t-shirt, kimono) have size or colour options.
  Affects the `order_items` table and the cart logic significantly.
- **`shipping_zones` / `shipping_rates`** — needed once the shipping destination decision is made.
- **`return_policy`** — needed once the return window is agreed.
- **`pages`** (optional) — a simple content table could be useful for managing static pages
  (About, Get Involved) from the admin panel without hardcoding them.

---

## Minor Observations

- Blog post URLs are not explicitly mentioned as SEO-friendly in the spec (product URLs are).
  Worth confirming the slug pattern — e.g. `/en/blog/[slug]` — when that page is scoped.
- `hreflang` tags are mentioned in Section 6, but it is worth confirming they will be applied to
  blog posts and product pages too, not just the main pages.
- The `approval_log` table references `actor_id` but the `users` table does not have a foreign key
  relationship explicitly stated. Fine for now; just needs a FK constraint during implementation.
- The spec says "Editors can publish products directly" (Section 7.1) but Section 7.2 says the
  review workflow applies to cases, campaigns, and blog posts only — products bypass review.
  These two sections are consistent; noting it here since it is easy to miss when building the
  admin permission layer.
