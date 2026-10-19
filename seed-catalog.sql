/* Pure Community Support — starting shop catalog for D1.

   Run once, after schema.sql, in the D1 Console (paste this file) or with:
     npx wrangler d1 execute purecommunitysupportd1db --remote --file=seed-catalog.sql
   Copies the products and collections that used to live in public/assets/js/products.js.
   Safe to run again: rows that already exist are left as they are (INSERT OR IGNORE),
   so it never undoes changes made in /admin. Photos stay in products.js until R2. */

/* Tags (the shop's former collections) */
INSERT OR IGNORE INTO tags (id, name, sort_order) VALUES ('resort', 'Resort wear', 0);
INSERT OR IGNORE INTO tags (id, name, sort_order) VALUES ('pamper', 'The ultimate pamper kit', 1);
INSERT OR IGNORE INTO tags (id, name, sort_order) VALUES ('bells', 'Bells and gongs', 2);
INSERT OR IGNORE INTO tags (id, name, sort_order) VALUES ('everyday', 'Everyday essentials', 3);

/* Products, in shop order; all start as Shown */
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('dress-01', 'Dress 01', NULL, 7800, 1, 1, 0);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('dress-02', 'Dress 02', NULL, 8400, 1, 1, 1);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('dress-03', 'Dress 03', NULL, 7200, 1, 1, 2);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('dress-04', 'Dress 04', NULL, 8800, 1, 1, 3);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('dress-05', 'Dress 05', NULL, 7600, 1, 1, 4);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('kimono-01', 'Kimono 01', NULL, 7200, 1, 1, 5);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('kimono-02', 'Kimono 02', NULL, 9600, 1, 1, 6);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('dress-06', 'Dress 06', NULL, 8200, 1, 1, 7);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('dress-07', 'Dress 07', NULL, 7400, 1, 1, 8);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('dress-08', 'Dress 08', NULL, 9000, 1, 1, 9);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('dress-09', 'Dress 09', NULL, 8000, 1, 1, 10);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('blouse-01', 'Blouse 01', NULL, 5400, 1, 1, 11);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('blouse-02', 'Blouse 02', NULL, 4800, 1, 1, 12);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('blouse-03', 'Blouse 03', NULL, 5800, 1, 1, 13);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('blouse-04', 'Blouse 04', NULL, 5200, 1, 1, 14);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('blouse-05', 'Blouse 05', NULL, 5600, 1, 1, 15);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('sleep-mask', 'Sleep Mask', NULL, 2200, 1, 1, 16);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('handkerchief', 'Handkerchief', NULL, 1400, 1, 1, 17);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('pillow-cover', 'Pillow Cover', NULL, 2800, 1, 1, 18);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('hair-tie', 'Hair Tie', NULL, 900, 1, 1, 19);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('gong', 'Gong', NULL, 4800, 1, 1, 20);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('singing-bowl', 'Singing Bowl', NULL, 4200, 1, 1, 21);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('ceremonial-bell', 'Ceremonial Bell', 'Hand-cast bronze bell with a clear, sustained tone. Companion piece to the gong.', 3600, 0, 1, 22);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('incense-holder', 'Carved Incense Holder', 'Hand-carved, used in household and ceremonial altars.', 1800, 0, 1, 23);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('cotton-t-shirt', 'Cotton T-Shirt', 'Simple cotton tee with a Hue-inspired print. Unisex fit.', 2600, 0, 1, 24);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('handwoven-tote', 'Handwoven Tote Bag', 'Woven on a traditional loom. Sturdy, natural fibre, built to last years.', 3600, 0, 1, 25);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('eco-bag', 'Eco Bag', 'Foldable everyday bag in natural fibre. Made to replace the plastic one.', 1600, 0, 1, 26);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('woven-tablecloth', 'Woven Tablecloth', 'Loom-woven cotton with a subtle traditional Hue pattern along the border.', 6400, 0, 1, 27);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('silk-scarf', 'Silk Scarf', 'Hand-dyed silk in a single continuous length. Light enough for year-round wear.', 3800, 0, 1, 28);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('market-basket', 'Market Basket Bag', 'A rigid woven basket bag built for daily errands.', 3200, 0, 1, 29);
INSERT OR IGNORE INTO products (id, name, description, price_cents, is_new, shown, sort_order) VALUES ('placemat-set', 'Woven Placemat Set', 'Set of four loom-woven placemats, made to match the tablecloth pattern.', 3000, 0, 1, 30);

/* Each product's tag */
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('dress-01', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('dress-02', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('dress-03', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('dress-04', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('dress-05', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('kimono-01', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('kimono-02', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('dress-06', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('dress-07', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('dress-08', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('dress-09', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('blouse-01', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('blouse-02', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('blouse-03', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('blouse-04', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('blouse-05', 'resort');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('sleep-mask', 'pamper');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('handkerchief', 'pamper');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('pillow-cover', 'pamper');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('hair-tie', 'pamper');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('gong', 'bells');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('singing-bowl', 'bells');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('ceremonial-bell', 'bells');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('incense-holder', 'bells');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('cotton-t-shirt', 'everyday');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('handwoven-tote', 'everyday');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('eco-bag', 'everyday');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('woven-tablecloth', 'everyday');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('silk-scarf', 'everyday');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('market-basket', 'everyday');
INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES ('placemat-set', 'everyday');
