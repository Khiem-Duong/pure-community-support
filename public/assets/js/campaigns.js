/* Cases & Campaigns — shared by cases.html (listing), campaign.html (/cases/<id>) and the admin.

   Campaign details and their cases live in the D1 database and are edited in /admin
   (Campaigns & cases). Pages load them with PURE_LOAD_CAMPAIGNS(), which asks the Worker's
   /api/campaigns; hidden campaigns and cases are never included.

   Photos are not in D1 yet (until R2 is connected): each campaign's cover and gallery are listed
   below by campaign id (PURE_CAMPAIGN_IMAGES), and each photo's description and credit by photo
   key (PURE_CAMPAIGN_PHOTOS); the files are assets/images/campaigns/<key>.jpg. All of them are
   Wikimedia Commons placeholders, see assets/images/campaigns/CREDITS.md. Campaigns without an
   entry (e.g. added in /admin) are shown without photos.
   Site rules: no photos of children, no hardship imagery, no fundraising-appeal language (see spec §2). */

/* Photo descriptions and placeholder credits, by photo key. */
window.PURE_CAMPAIGN_PHOTOS = {
  'food-cover':       { alt: 'Baskets of fresh vegetables and herbs at a Vietnamese street market', author: 'Franzfoto', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Can_Tho_City_-_Street_Market,_vegetable.jpg' },
  'food-stall':       { alt: 'Dry goods stall at Đông Ba Market, Hue', author: 'Chainwit.', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Dong_Ba_Market_(Hue)_-_Ch%E1%BB%A3_%C4%90%C3%B4ng_Ba_Hu%E1%BA%BF_(July_2024)_-_img_07.jpg' },
  'food-shop':        { alt: 'Packaged food and household goods at Đông Ba Market, Hue', author: 'Chainwit.', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Dong_Ba_Market_(Hue)_-_Ch%E1%BB%A3_%C4%90%C3%B4ng_Ba_Hu%E1%BA%BF_(July_2024)_-_img_06.jpg' },
  'food-gate':        { alt: 'Main entrance of Đông Ba Market, Hue', author: 'Chainwit.', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Dong_Ba_Market_(Hue)_-_Ch%E1%BB%A3_%C4%90%C3%B4ng_Ba_Hu%E1%BA%BF_(July_2024)_-_img_02.jpg' },
  'food-boat':        { alt: 'A trader loading bananas onto a market boat', author: 'McKay Savage', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Vietnam_08_-_109_-_Cai_Be_floating_market_(3185035425).jpg' },

  'lotus-cover':      { alt: 'A boat of freshly gathered lotus flowers on a lotus pond', author: 'Quangpraha', license: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:Collecting_lotus_flowers,_Vietnam.jpg' },
  'lotus-pads':       { alt: 'Pink water flowers among green leaves', author: 'Clumsyninja', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Waterlily_(8677125409).jpg' },
  'lotus-palette':    { alt: 'Gouache paints, a mixing palette and brushes', author: 'Jeff Dahl', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Gouache.jpg' },
  'lotus-bloom':      { alt: 'A single pink lotus flower in bloom', author: 'Dennis G. Jarvis', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Lotus_flower_from_the_Mekong_Delta,_Vietnam.jpg' },
  'lotus-still':      { alt: 'Oil painting of lotus flowers resting on a table', author: 'Martin Johnson Heade', license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:Lotus_Flowers-_A_Landscape_Painting_in_the_Background_-_Martin_Johnson_Heade_-_Google_Cultural_Institute.jpg' },
  'lotus-wall':       { alt: 'Hand-painted lotus flowers on a plain wall', author: 'Kalaivani Govindan', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Painting_of_lotus_flowers.jpg' },

  'youth-cover':      { alt: 'A gate in the Imperial City of Hue', author: 'Supanut Arunoprayote', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Gate_in_Imperial_City,_Hu%E1%BA%BF_(III).jpg' },
  'youth-notes':      { alt: 'Writing notes in a notebook at a desk', author: 'Shixart1985', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Person_writes_notes_in_a_notebook_while_sitting_at_a_table.jpg' },
  'youth-reading':    { alt: 'Reading a book under a desk lamp', author: 'Shixart1985', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Middle-aged_businesswoman_reading_a_book_under_warm_light_in_a_quiet_room_during_evening_hours,_surrounded_by_notebooks_and_a_cozy_atmosphere.jpg' },
  'youth-river':      { alt: 'The Perfume River running through Hue', author: 'CEphoto, Uwe Aranas', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Hue_Vietnam_Perfume-River-01.jpg' },
  'youth-pagoda':     { alt: 'Phước Duyên tower at Thiên Mụ Pagoda, Hue', author: 'Lưu Ly', license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:ThienMuPagoda.jpg' },
  'youth-mist':       { alt: 'The moat of the Imperial City of Hue on a misty morning', author: 'Vyacheslav Argenberg', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Vietnam,_Hue,_Imperial_City_of_Hue,_Moat.jpg' },

  'craft-cover':      { alt: 'An artisan shaping the frame of a conical hat', author: 'Thomas Schoch', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Hatter_Vietnam.jpg' },
  'craft-hat':        { alt: 'Making conical hats in the Hue countryside', author: 'Cyril Doussin', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Making_conical_hats_-_Hue_countryside.jpg' },
  'craft-incense':    { alt: 'Bundles of incense sticks laid out to dry', author: 'Trantuanviet', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Incense_in_Vietnam.jpg' },
  'craft-wheel':      { alt: 'Hands shaping clay on a potter’s wheel', author: 'Stephanie Pakrul', license: 'CC BY 3.0', url: 'https://commons.wikimedia.org/wiki/File:The_Wheel_(135616779).jpeg' },
  'craft-loom':       { alt: 'Weaving striped cloth on a wooden loom', author: 'norio nakayama', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ishigaki_Island_minsa.jpg' },
  'craft-embroidery': { alt: 'Embroidery in a hoop on a wooden table', author: 'Shixart1985', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Embroidered_fabric_rests_on_a_wooden_table_with_tools_beside_it_during_a_craft_session_in_a_sunny_outdoor_setting.jpg' },
  'craft-potter':     { alt: 'A master potter at work among finished vessels', author: 'Tahirceylan', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Pottery_Master.jpg' }
};

/* Cover and gallery photos, by campaign id. */
window.PURE_CAMPAIGN_IMAGES = {
  'food-essentials':  { cover: 'food-cover',  gallery: ['food-stall', 'food-shop', 'food-gate', 'food-boat'] },
  'lotus-art':        { cover: 'lotus-cover', gallery: ['lotus-pads', 'lotus-palette', 'lotus-bloom', 'lotus-still', 'lotus-wall'] },
  'youth-leadership': { cover: 'youth-cover', gallery: ['youth-notes', 'youth-river', 'youth-pagoda', 'youth-reading', 'youth-mist'] },
  'heritage-craft':   { cover: 'craft-cover', gallery: ['craft-hat', 'craft-incense', 'craft-wheel', 'craft-loom', 'craft-embroidery', 'craft-potter'] }
};

/* Loads the shown campaigns once per page, in page order. Each has: id, title, titleVi, status
   ('running' | 'planned'), focus, location, format, summary, about (paragraphs), covers (items),
   cases ({ name, story, support }), plus cover (photo key, or '') and gallery (photo keys).
   Rejects if they can't be loaded; pages then show a "please refresh" message. */
window.PURE_LOAD_CAMPAIGNS = (() => {
  let loading = null;
  return () => loading || (loading = fetch('/api/campaigns', { headers: { Accept: 'application/json' } })
    .then(res => {
      if (!res.ok) throw new Error(`Campaigns request failed (${res.status})`);
      return res.json();
    })
    .then(data => data.campaigns.map(c => {
      const images = window.PURE_CAMPAIGN_IMAGES[c.id] || {};
      return { ...c, cover: images.cover || '', gallery: images.gallery || [] };
    })));
})();
