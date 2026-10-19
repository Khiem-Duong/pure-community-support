/* Pure Community Support — shared shop catalog.
   Used by shop.html (grid + quick view), item.html (item page), order-list.html and the admin.

   Product details (name, price, description, tags, Shown / Hidden, "New" badge) live in the
   D1 database and are edited in /admin. Pages load them with PURE_LOAD_CATALOG(), which asks
   the Worker's /api/products; hidden products are never included.

   Photos are not in D1 yet (until R2 is connected): each product's photo is listed below by
   product id. Image paths are relative to the site root. Entries with `credit` use a temporary
   Wikimedia Commons photo (see assets/images/placeholders/CREDITS.md). Products without an
   entry (e.g. added in /admin) show the lotus placeholder. */

/* Formats a USD amount ("$48", "$48.50"). Used by the shop, item and order list pages. */
window.PURE_FORMAT_PRICE = amount => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
}).format(amount);

/* Price label for a product: formatted price, or "Price TBD" when none is set. */
window.PURE_PRICE_LABEL = p => typeof p.price === 'number' ? window.PURE_FORMAT_PRICE(p.price) : 'Price TBD';

/* Shown for products that have no photo yet. */
window.PURE_NO_PHOTO = { img: 'assets/images/favicon/app-icon-v1.1-512.png' };

/* Photos by product id: img, optional object-position (pos) and placeholder credit. */
window.PURE_PHOTOS = {
  "dress-01": {
    "img": "assets/images/placeholders/d1.jpg",
    "pos": "center 20%",
    "credit": {
      "author": "Maegan Tintari",
      "license": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Electric_blue_maxi_dress_with_cognac_accessories.jpg"
    }
  },
  "dress-02": {
    "img": "assets/images/placeholders/d2.jpg",
    "pos": "center 20%",
    "credit": {
      "author": "Tobias ToMar Maier",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress_with_circle_skirt_in_the_wind_-_pose_2.jpg"
    }
  },
  "dress-03": {
    "img": "assets/images/placeholders/d3.jpg",
    "credit": {
      "author": "Bestvintage",
      "license": "Public domain",
      "url": "https://commons.wikimedia.org/wiki/File:Maxi_dress.jpg"
    }
  },
  "dress-04": {
    "img": "assets/images/placeholders/d4.jpg",
    "pos": "center 20%",
    "credit": {
      "author": "Radomianin",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Woman_with_hat_in_red_dress,_North_Beach_SF.jpg"
    }
  },
  "dress-05": {
    "img": "assets/images/placeholders/d5.jpg",
    "credit": {
      "author": "Miss Crabb; Kristine Crabb",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress_%22shirt_dress%22_(AM_2019.18.2-1).jpg"
    }
  },
  "kimono-01": {
    "img": "assets/images/Silk_kimono.jpg",
    "pos": "center 40%"
  },
  "kimono-02": {
    "img": "assets/images/placeholders/k7.jpg",
    "credit": {
      "author": "MASA",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Gochisousan_Drama_(2).JPG"
    }
  },
  "dress-06": {
    "img": "assets/images/placeholders/d8.jpg",
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress,_woman%27s_(AM_1965.78.692-20).jpg"
    }
  },
  "dress-07": {
    "img": "assets/images/placeholders/d9.jpg",
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress,_woman%27s_(AM_1965.78.692-24).jpg"
    }
  },
  "dress-08": {
    "img": "assets/images/placeholders/d10.jpg",
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress,_woman%27s_(AM_1965.78.692-29).jpg"
    }
  },
  "dress-09": {
    "img": "assets/images/placeholders/d11.jpg",
    "credit": {
      "author": "Miss Crabb; Kristine Crabb",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dress_%22shirt_dress%22_(AM_2019.18.2-2).jpg"
    }
  },
  "blouse-01": {
    "img": "assets/images/placeholders/b12.jpg",
    "credit": {
      "author": "Jeanne Lanvin / Lanvin",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_MET_CI63.38.3_F.jpg"
    }
  },
  "blouse-02": {
    "img": "assets/images/placeholders/b13.jpg",
    "credit": {
      "author": "Jeanne Lanvin / Lanvin",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_MET_84.173_CP3.jpg"
    }
  },
  "blouse-03": {
    "img": "assets/images/placeholders/b14.jpg",
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_(AM_1965.101-1).jpg"
    }
  },
  "blouse-04": {
    "img": "assets/images/placeholders/b15.jpg",
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_(AM_1965.101-5).jpg"
    }
  },
  "blouse-05": {
    "img": "assets/images/placeholders/b16.jpg",
    "credit": {
      "author": "Unknown author",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Blouse_(AM_1965.101-6).jpg"
    }
  },
  "sleep-mask": {
    "img": "assets/images/placeholders/mask.jpg",
    "credit": {
      "author": "Hbcloud at Wikipedia",
      "license": "Public domain",
      "url": "https://commons.wikimedia.org/wiki/File:Sleep_mask.jpg"
    }
  },
  "handkerchief": {
    "img": "assets/images/placeholders/hanky.jpg",
    "credit": {
      "author": "Unknown author",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Spain,_Teneriffe,_19th_century_-_Embroidered_Linen_Handkerchief_-_1936.65_-_Cleveland_Museum_of_Art.jpg"
    }
  },
  "pillow-cover": {
    "img": "assets/images/1785487884721_3929329604013453076_g3424696855698798357_3b40e286e8acb1ac8598495f0a8777a5.jpg"
  },
  "hair-tie": {
    "img": "assets/images/placeholders/scrunchie.jpg",
    "credit": {
      "author": "Agnesar31",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Scrunchie_is_back_-_foulchie_noir_accessoire_cheveux_femme.jpg"
    }
  },
  "gong": {
    "img": "assets/images/DSC07542.jpeg",
    "pos": "center top"
  },
  "singing-bowl": {
    "img": "assets/images/DSC07535.jpeg",
    "pos": "center top"
  },
  "ceremonial-bell": {
    "img": "assets/images/placeholders/bell.jpg",
    "credit": {
      "author": "BrightRaven",
      "license": "CC BY 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Vung_Tau_Niet_Ban_Tinh_Xa_4.JPG"
    }
  },
  "incense-holder": {
    "img": "assets/images/placeholders/incense.jpg",
    "credit": {
      "author": "Gary Todd",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Western_Han_Gilded_Bronze_Incense_Burner_1a.jpg"
    }
  },
  "cotton-t-shirt": {
    "img": "assets/images/placeholders/tshirt.jpg",
    "credit": {
      "author": "Moheen Reeyad",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Wiki_Loves_Bangla_T-Shirt_White.jpg"
    }
  },
  "handwoven-tote": {
    "img": "assets/images/Handwoven_tote_bag.jpg"
  },
  "eco-bag": {
    "img": "assets/images/placeholders/ecobag.jpg",
    "credit": {
      "author": "Fabriko; Pils, John Henry, 1939-2021; Promotional Consultant",
      "license": "No restrictions",
      "url": "https://commons.wikimedia.org/wiki/File:Brown_Tote_Bag_with_a_John_Pils_Print_on_Front_-_DPLA_-_d36ce76840c85b3d681faf3d39770683_(page_3).jpg"
    }
  },
  "woven-tablecloth": {
    "img": "assets/images/placeholders/tablecloth.jpg",
    "credit": {
      "author": "Art Palace",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Blue_Tablecloth_(Supra)._Linen,_reserve_painting._Late_XIX_c.jpg"
    }
  },
  "silk-scarf": {
    "img": "assets/images/placeholders/scarf.jpg",
    "credit": {
      "author": "Vyolltsa",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Shami_mendafshi_grash_-_Silk_scarf_for_women.jpg"
    }
  },
  "market-basket": {
    "img": "assets/images/placeholders/basket.jpg",
    "credit": {
      "author": "Agbarto",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:2026.03.14_Minsk_Flea_Market_Zhdanovichi_Field_of_Miracles_Wicker_Bag.jpg"
    }
  },
  "placemat-set": {
    "img": "assets/images/placeholders/placemat.jpg",
    "credit": {
      "author": "Thelmadatter",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Henequen004.JPG"
    }
  }
};

/* Loads the shop catalog once per page. Resolves to { products, collections }:
     products     shown products in shop order: id, name, desc, price (USD number or null),
                  maker, material, colour, isNew, tags (tag ids), collection (first tag),
                  plus img / pos / credit from PURE_PHOTOS
     collections  tags used by at least one shown product: { id, name }, in tag order
   Rejects if the catalog can't be loaded; pages then show a "please refresh" message. */
window.PURE_LOAD_CATALOG = (() => {
  let loading = null;
  return () => loading || (loading = fetch('/api/products', { headers: { Accept: 'application/json' } })
    .then(res => {
      if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
      return res.json();
    })
    .then(data => {
      const products = data.products.map(p => ({
        ...p,
        collection: p.tags[0] || '',
        ...(window.PURE_PHOTOS[p.id] || window.PURE_NO_PHOTO),
      }));
      const collections = data.tags.filter(t => products.some(p => p.tags.includes(t.id)));
      return { products, collections };
    }));
})();
