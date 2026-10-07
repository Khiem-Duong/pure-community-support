/* Pure Community Support — order list.
   Keeps the visitor's selected items in this browser (localStorage) and updates
   every order list count on the page. Loaded on every page; the list itself is
   shown on order-list.html (/order-list).

   PureOrder.bindAdd(root) turns an empty <div> into the "Add to order list"
   control used in the shop quick view and on item pages: a quantity picker
   with a live price total, and an "Add x to order list" button. */

(function () {
  const KEY = 'pcs-order-list';
  const MAX_QTY = 99;
  const listeners = [];

  const clamp = n => Math.min(MAX_QTY, Math.max(1, Math.round(Number(n)) || 1));
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  function read() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!Array.isArray(data)) return [];
      return data
        .filter(row => row && typeof row.id === 'string')
        .map(row => ({ id: row.id, qty: clamp(row.qty) }));
    } catch (err) {
      return [];
    }
  }

  // Kept in memory as well, so the list still works for this visit if storage is blocked.
  let items = read();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (err) {}
    emit();
  }

  function emit() {
    updateCounts();
    listeners.forEach(fn => fn(api.items()));
  }

  function updateCounts() {
    const n = api.count();
    document.querySelectorAll('[data-ol-count]').forEach(el => {
      el.textContent = n > 99 ? '99+' : String(n);
      el.hidden = n === 0;
    });
    document.querySelectorAll('[data-ol-link]').forEach(el => {
      el.setAttribute('aria-label', n ? `Order list, ${n} item${n === 1 ? '' : 's'}` : 'Order list, empty');
    });
  }

  const api = {
    MAX_QTY,
    clamp,
    items: () => items.map(row => ({ ...row })),
    qty: id => (items.find(row => row.id === id) || {}).qty || 0,
    count: () => items.reduce((sum, row) => sum + row.qty, 0),
    add(id, qty) {
      const row = items.find(r => r.id === id);
      if (row) row.qty = clamp(row.qty + clamp(qty));
      else items.push({ id, qty: clamp(qty) });
      save();
    },
    set(id, qty) {
      const row = items.find(r => r.id === id);
      if (!row) return;
      row.qty = clamp(qty);
      save();
    },
    remove(id) {
      items = items.filter(row => row.id !== id);
      save();
    },
    /* Puts a removed row back in its old position (used by "Undo"). */
    restore(row, index) {
      if (items.some(r => r.id === row.id)) return;
      items.splice(Math.min(index, items.length), 0, { id: row.id, qty: clamp(row.qty) });
      save();
    },
    /* Replaces the whole list (used to drop items no longer in the catalog). */
    replace(rows) {
      items = rows.map(row => ({ id: row.id, qty: clamp(row.qty) }));
      save();
    },
    onChange(fn) { listeners.push(fn); },
    bindAdd,
  };

  /* Another tab changed the list: pick up the new contents. */
  window.addEventListener('storage', e => {
    if (e.key !== KEY) return;
    items = read();
    emit();
  });

  /* ── "Add to order list" control ─────────────── */
  let uid = 0;
  const ICON_CART = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9.5" cy="19.5" r="1.5"/><circle cx="17.5" cy="19.5" r="1.5"/><path d="M2.5 3.5h2.7l2.3 11a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.1L21 7.5H6.1"/></svg>';
  const ICON_MINUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="6" y1="12" x2="18" y2="12"/></svg>';
  const ICON_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/></svg>';
  const ICON_ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

  /* Formats a price; uses the catalog's formatter when products.js is loaded. */
  const money = n => (window.PURE_FORMAT_PRICE ? window.PURE_FORMAT_PRICE(n) : `$${n}`);

  /* Returns { setProduct(product) } — call it whenever the product shown changes. */
  function bindAdd(root) {
    const id = `ol-qty-${++uid}`;
    root.classList.add('ol-add');
    root.innerHTML = `
      <div class="ol-picker">
        <label class="ol-picker-label" for="${id}">Choose a quantity</label>
        <div class="ol-picker-row">
          <div class="ol-stepper">
            <button class="ol-step" type="button" data-step="-1" aria-label="Decrease quantity">${ICON_MINUS}</button>
            <input class="ol-qty" id="${id}" type="number" inputmode="numeric" min="1" max="${MAX_QTY}" step="1" value="1">
            <button class="ol-step" type="button" data-step="1" aria-label="Increase quantity">${ICON_PLUS}</button>
          </div>
          <p class="ol-total" aria-live="polite"></p>
        </div>
        <button class="ol-confirm" type="button">${ICON_CART}<span>Add 1 to order list</span></button>
      </div>
      <p class="ol-note" role="status" aria-live="polite"></p>`;

    const input = root.querySelector('.ol-qty');
    const confirmBtn = root.querySelector('.ol-confirm');
    const confirmLabel = confirmBtn.querySelector('span');
    const total = root.querySelector('.ol-total');
    const note = root.querySelector('.ol-note');
    let product = null;

    /* Quantity changed: update the button label, the +/- limits and the price. */
    function syncPicker() {
      const qty = clamp(input.value);
      confirmLabel.textContent = `Add ${qty} to order list`;
      root.querySelector('[data-step="-1"]').disabled = qty <= 1;
      root.querySelector('[data-step="1"]').disabled = qty >= MAX_QTY;
      if (!product || typeof product.price !== 'number') {
        total.innerHTML = '<span class="ol-total-tbd">Price to be confirmed</span>';
        return;
      }
      total.innerHTML = `<span class="ol-total-amount">${money(product.price * qty)}</span>`
        + (qty > 1 ? `<span class="ol-total-each">${qty} × ${money(product.price)}</span>` : '');
    }

    function showNote(justAdded) {
      const inList = product ? api.qty(product.id) : 0;
      if (!inList) { note.innerHTML = ''; return; }
      const lead = justAdded
        ? `Added ${justAdded} × ${esc(product.name)}. In your order list: <strong>${inList}</strong>.`
        : `In your order list: <strong>${inList}</strong>.`;
      note.innerHTML = `${lead} <a href="/order-list">View order list ${ICON_ARROW}</a>`;
      if (justAdded) {
        note.classList.remove('flash');
        void note.offsetWidth; // restart the highlight animation
        note.classList.add('flash');
      }
    }

    function confirm() {
      if (!product) return;
      const qty = clamp(input.value);
      api.add(product.id, qty);
      input.value = 1;
      syncPicker();
      showNote(qty);
    }

    confirmBtn.addEventListener('click', confirm);
    root.querySelectorAll('.ol-step').forEach(btn => btn.addEventListener('click', () => {
      input.value = clamp(clamp(input.value) + Number(btn.dataset.step));
      syncPicker();
    }));
    input.addEventListener('input', syncPicker);
    input.addEventListener('change', () => { input.value = clamp(input.value); syncPicker(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); confirm(); }
    });

    api.onChange(() => { if (product) showNote(0); });

    return {
      setProduct(p) {
        product = p;
        input.value = 1;
        syncPicker();
        note.classList.remove('flash');
        showNote(0);
      },
    };
  }

  window.PureOrder = api;
  updateCounts();
})();
