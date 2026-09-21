/* Pure Community Support — shared product catalog.
   Used by shop.html (grid + quick view) and item.html (individual item page).

   PLACEHOLDER DATA (spec §4.4, 21 Sep 2026 draft). Names, prices, materials,
   colours and descriptions are not final. To update a product, edit its entry:
     name, collection, img, desc, material, colour, maker, price, isNew
   Image paths are relative to the site root. Entries with `credit` use a
   temporary Wikimedia Commons photo (see assets/images/placeholders/CREDITS.md). */

window.PURE_COLLECTIONS = [
  { id: 'resort',   name: 'Resort wear' },
  { id: 'pamper',   name: 'The ultimate pamper kit' },
  { id: 'bells',    name: 'Bells and gongs' },
  { id: 'everyday', name: 'Everyday essentials' },
];

window.PURE_PRODUCTS = [
  {
    "id": "dress-01",
    "name": "Dress 01",
    "collection": "resort",
    "img": "assets/images/placeholders/d1.jpg",
    "isNew": true,
    "pos": "center 20%",
    "credit": {
      "author": "Maegan Tintari",
      "license": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Electric_blue_maxi_dress_with_cognac_accessories.jpg"
    }
  },
  {
    "id": "dress-02",
    "name": "Dress 02",
    "collection": "resort",
    "img": "assets/images/placeholders/d2.jpg",
    "isNew": true,
    "pos": "center 20%",
    "credit": {
      "author": "Tobias ToMar Maier",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress_with_circle_skirt_in_the_wind_-_pose_2.jpg"
    }
  },
  {
    "id": "dress-03",
    "name": "Dress 03",
    "collection": "resort",
    "img": "assets/images/placeholders/d3.jpg",
    "isNew": true,
    "credit": {
      "author": "Bestvintage",
      "license": "Public domain",
      "url": "https://commons.wikimedia.org/wiki/File:Maxi_dress.jpg"
    }
  },
  {
    "id": "dress-04",
    "name": "Dress 04",
    "collection": "resort",
    "img": "assets/images/placeholders/d4.jpg",
    "isNew": true,
    "pos": "center 20%",
    "credit": {
      "author": "Radomianin",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Woman_with_hat_in_red_dress,_North_Beach_SF.jpg"
    }
  },
  {
    "id": "dress-05",
    "name": "Dress 05",
    "collection": "resort",
    "img": "assets/images/placeholders/d5.jpg",
    "isNew": true,
    "credit": {
      "author": "Miss Crabb; Kristine Crabb",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress_%22shirt_dress%22_(AM_2019.18.2-1).jpg"
    }
  },
  {
    "id": "kimono-01",
    "name": "Kimono 01",
    "collection": "resort",
    "img": "assets/images/Silk_kimono.jpg",
    "isNew": true,
    "pos": "center 40%"
  },
  {
    "id": "kimono-02",
    "name": "Kimono 02",
    "collection": "resort",
    "img": "assets/images/placeholders/k7.jpg",
    "isNew": true,
    "credit": {
      "author": "MASA",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Gochisousan_Drama_(2).JPG"
    }
  },
  {
    "id": "dress-06",
    "name": "Dress 06",
    "collection": "resort",
    "img": "assets/images/placeholders/d8.jpg",
    "isNew": true,
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress,_woman%27s_(AM_1965.78.692-20).jpg"
    }
  },
  {
    "id": "dress-07",
    "name": "Dress 07",
    "collection": "resort",
    "img": "assets/images/placeholders/d9.jpg",
    "isNew": true,
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress,_woman%27s_(AM_1965.78.692-24).jpg"
    }
  },
  {
    "id": "dress-08",
    "name": "Dress 08",
    "collection": "resort",
    "img": "assets/images/placeholders/d10.jpg",
    "isNew": true,
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress,_woman%27s_(AM_1965.78.692-29).jpg"
    }
  },
  {
    "id": "dress-09",
    "name": "Dress 09",
    "collection": "resort",
    "img": "assets/images/placeholders/d11.jpg",
    "isNew": true,
    "credit": {
      "author": "Miss Crabb; Kristine Crabb",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress_%22shirt_dress%22_(AM_2019.18.2-2).jpg"
    }
  },
  {
    "id": "blouse-01",
    "name": "Blouse 01",
    "collection": "resort",
    "img": "assets/images/placeholders/b12.jpg",
    "isNew": true,
    "credit": {
      "author": "Jeanne Lanvin / Lanvin",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_MET_CI63.38.3_F.jpg"
    }
  },
  {
    "id": "blouse-02",
    "name": "Blouse 02",
    "collection": "resort",
    "img": "assets/images/placeholders/b13.jpg",
    "isNew": true,
    "credit": {
      "author": "Jeanne Lanvin / Lanvin",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_MET_84.173_CP3.jpg"
    }
  },
  {
    "id": "blouse-03",
    "name": "Blouse 03",
    "collection": "resort",
    "img": "assets/images/placeholders/b14.jpg",
    "isNew": true,
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_(AM_1965.101-1).jpg"
    }
  },
  {
    "id": "blouse-04",
    "name": "Blouse 04",
    "collection": "resort",
    "img": "assets/images/placeholders/b15.jpg",
    "isNew": true,
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_(AM_1965.101-5).jpg"
    }
  },
  {
    "id": "blouse-05",
    "name": "Blouse 05",
    "collection": "resort",
    "img": "assets/images/placeholders/b16.jpg",
    "isNew": true,
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_(AM_1965.101-6).jpg"
    }
  },
  {
    "id": "sleep-mask",
    "name": "Sleep Mask",
    "collection": "pamper",
    "img": "assets/images/placeholders/mask.jpg",
    "isNew": true,
    "credit": {
      "author": "Hbcloud at Wikipedia",
      "license": "Public domain",
      "url": "https://commons.wikimedia.org/wiki/File:Sleep_mask.jpg"
    }
  },
  {
    "id": "handkerchief",
    "name": "Handkerchief",
    "collection": "pamper",
    "img": "assets/images/placeholders/hanky.jpg",
    "isNew": true,
    "credit": {
      "author": "Unknown author",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Spain,_Teneriffe,_19th_century_-_Embroidered_Linen_Handkerchief_-_1936.65_-_Cleveland_Museum_of_Art.jpg"
    }
  },
  {
    "id": "pillow-cover",
    "name": "Pillow Cover",
    "collection": "pamper",
    "img": "assets/images/1785487884721_3929329604013453076_g3424696855698798357_3b40e286e8acb1ac8598495f0a8777a5.jpg",
    "isNew": true
  },
  {
    "id": "hair-tie",
    "name": "Hair Tie",
    "collection": "pamper",
    "img": "assets/images/placeholders/scrunchie.jpg",
    "isNew": true,
    "credit": {
      "author": "Agnesar31",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Scrunchie_is_back_-_foulchie_noir_accessoire_cheveux_femme.jpg"
    }
  },
  {
    "id": "gong",
    "name": "Gong",
    "collection": "bells",
    "img": "assets/images/DSC07542.jpeg",
    "isNew": true,
    "pos": "center top"
  },
  {
    "id": "singing-bowl",
    "name": "Singing Bowl",
    "collection": "bells",
    "img": "assets/images/DSC07535.jpeg",
    "isNew": true,
    "pos": "center top"
  },
  {
    "id": "ceremonial-bell",
    "name": "Ceremonial Bell",
    "collection": "bells",
    "img": "assets/images/placeholders/bell.jpg",
    "isNew": false,
    "desc": "Hand-cast bronze bell with a clear, sustained tone. Companion piece to the gong.",
    "credit": {
      "author": "BrightRaven",
      "license": "CC BY 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Vung_Tau_Niet_Ban_Tinh_Xa_4.JPG"
    }
  },
  {
    "id": "incense-holder",
    "name": "Carved Incense Holder",
    "collection": "bells",
    "img": "assets/images/placeholders/incense.jpg",
    "isNew": false,
    "desc": "Hand-carved, used in household and ceremonial altars.",
    "credit": {
      "author": "Gary Todd",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Western_Han_Gilded_Bronze_Incense_Burner_1a.jpg"
    }
  },
  {
    "id": "cotton-t-shirt",
    "name": "Cotton T-Shirt",
    "collection": "everyday",
    "img": "assets/images/placeholders/tshirt.jpg",
    "isNew": false,
    "desc": "Simple cotton tee with a Hue-inspired print. Unisex fit.",
    "credit": {
      "author": "Moheen Reeyad",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Wiki_Loves_Bangla_T-Shirt_White.jpg"
    }
  },
  {
    "id": "handwoven-tote",
    "name": "Handwoven Tote Bag",
    "collection": "everyday",
    "img": "assets/images/Handwoven_tote_bag.jpg",
    "isNew": false,
    "desc": "Woven on a traditional loom. Sturdy, natural fibre, built to last years."
  },
  {
    "id": "eco-bag",
    "name": "Eco Bag",
    "collection": "everyday",
    "img": "assets/images/placeholders/ecobag.jpg",
    "isNew": false,
    "desc": "Foldable everyday bag in natural fibre. Made to replace the plastic one.",
    "credit": {
      "author": "Fabriko; Pils, John Henry, 1939-2021; Promotional Consultant",
      "license": "No restrictions",
      "url": "https://commons.wikimedia.org/wiki/File:Brown_Tote_Bag_with_a_John_Pils_Print_on_Front_-_DPLA_-_d36ce76840c85b3d681faf3d39770683_(page_3).jpg"
    }
  },
  {
    "id": "woven-tablecloth",
    "name": "Woven Tablecloth",
    "collection": "everyday",
    "img": "assets/images/placeholders/tablecloth.jpg",
    "isNew": false,
    "desc": "Loom-woven cotton with a subtle traditional Hue pattern along the border.",
    "credit": {
      "author": "Art Palace",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Blue_Tablecloth_(Supra)._Linen,_reserve_painting._Late_XIX_c.jpg"
    }
  },
  {
    "id": "silk-scarf",
    "name": "Silk Scarf",
    "collection": "everyday",
    "img": "assets/images/placeholders/scarf.jpg",
    "isNew": false,
    "desc": "Hand-dyed silk in a single continuous length. Light enough for year-round wear.",
    "credit": {
      "author": "Vyolltsa",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Shami_mendafshi_grash_-_Silk_scarf_for_women.jpg"
    }
  },
  {
    "id": "market-basket",
    "name": "Market Basket Bag",
    "collection": "everyday",
    "img": "assets/images/placeholders/basket.jpg",
    "isNew": false,
    "desc": "A rigid woven basket bag built for daily errands.",
    "credit": {
      "author": "Agbarto",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:2026.03.14_Minsk_Flea_Market_Zhdanovichi_Field_of_Miracles_Wicker_Bag.jpg"
    }
  },
  {
    "id": "placemat-set",
    "name": "Woven Placemat Set",
    "collection": "everyday",
    "img": "assets/images/placeholders/placemat.jpg",
    "isNew": false,
    "desc": "Set of four loom-woven placemats, made to match the tablecloth pattern.",
    "credit": {
      "author": "Thelmadatter",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Henequen004.JPG"
    }
  }
];
