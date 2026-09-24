/* Cases & Campaigns data — shared by cases.html (listing) and campaign.html (/cases/<id>).
   All descriptions, facts and photos are placeholders until the team confirms final content.
   Photos: Wikimedia Commons placeholders, see assets/images/campaigns/CREDITS.md.
   Site rules: no photos of children, no hardship imagery, no fundraising-appeal language (see spec §2). */

window.PURE_PHOTOS = {
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

window.PURE_CAMPAIGNS = [
  {
    id: 'food-essentials',
    title: 'Community Food & Essentials Kit',
    titleVi: 'Bộ thực phẩm & nhu yếu phẩm cộng đồng',
    status: 'running',
    focus: 'Living conditions',
    location: 'Hue, Thừa Thiên Huế',
    format: 'Recurring distribution (schedule TBD)',
    summary: 'Regular provision of food staples and household essentials to families in Hue, identified through local community partners.',
    about: [
      'The programme provides kits of food staples and everyday household items to families referred by community authority heads and local partners in Hue. Contents are sourced locally wherever possible.',
      'Distribution is ongoing, with no funding target. Each quarter, the number of kits provided and the amount allocated are recorded and published in the transparency report.'
    ],
    covers: ['Rice, cooking oil and other food staples', 'Hygiene and household essentials', 'Locally sourced contents where possible'],
    cover: 'food-cover',
    gallery: ['food-stall', 'food-shop', 'food-gate', 'food-boat'],
    cases: []
  },
  {
    id: 'lotus-art',
    title: 'Lotus Art for Healing Workshop',
    titleVi: 'Hội thảo nghệ thuật hoa sen chữa lành',
    status: 'running',
    focus: 'Health & wellbeing',
    location: 'Hue, Thừa Thiên Huế',
    format: 'Workshop series (dates TBD)',
    summary: 'Art workshops built around the lotus, a traditional motif of Hue, supporting wellbeing and community connection.',
    about: [
      'Participants work with painting and drawing techniques centred on the lotus, a motif closely tied to the culture of Hue. Sessions are led by local artists and run in small groups.',
      'Materials are provided for each session. Attendance and costs are recorded and included in the quarterly transparency report.'
    ],
    covers: ['Guided painting and drawing sessions', 'All art materials provided', 'Small groups led by local artists'],
    cover: 'lotus-cover',
    gallery: ['lotus-pads', 'lotus-palette', 'lotus-bloom', 'lotus-still', 'lotus-wall'],
    cases: []
  },
  {
    id: 'youth-leadership',
    title: 'Youth Leadership Circle',
    titleVi: 'Vòng tròn lãnh đạo trẻ',
    status: 'running',
    focus: 'Education',
    location: 'Hue, Thừa Thiên Huế',
    format: 'Regular mentoring sessions (schedule TBD)',
    summary: 'Mentoring and skills development for young people in Hue, with a focus on education, confidence and community responsibility.',
    about: [
      'The circle brings participants together with volunteer mentors for structured sessions on study skills, communication and planning. Participants are referred through school principals and community partners.',
      'The programme runs continuously. Session numbers and programme costs are reported each quarter.'
    ],
    covers: ['Study skills and learning support', 'Communication and planning workshops', 'Mentoring by trained volunteers'],
    cover: 'youth-cover',
    gallery: ['youth-notes', 'youth-river', 'youth-pagoda', 'youth-reading', 'youth-mist'],
    cases: []
  },
  {
    id: 'heritage-craft',
    title: 'Heritage Craft Class with Local Artisans',
    titleVi: 'Lớp thủ công truyền thống cùng nghệ nhân địa phương',
    status: 'planned',
    focus: 'Cultural heritage',
    location: 'Hue, Thừa Thiên Huế',
    format: 'Class series (start date TBD)',
    summary: 'A planned programme in which local artisans teach traditional Hue craft skills to members of the community.',
    about: [
      'Classes will be taught by artisans from the Pure network and cover techniques such as conical hat making, weaving and embroidery. The aim is to keep these skills in active use in Hue.',
      'The programme is in planning. Its start date, schedule and participating artisans will be announced on this page.'
    ],
    covers: ['Conical hat making, weaving and embroidery', 'Taught by artisans from the Pure network', 'Materials and tools provided'],
    cover: 'craft-cover',
    gallery: ['craft-hat', 'craft-incense', 'craft-wheel', 'craft-loom', 'craft-embroidery', 'craft-potter'],
    cases: []
  }
];
