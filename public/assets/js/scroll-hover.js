/* Pure Community Support — no hover effects while scrolling. Loaded on every page.
   While the page scrolls, cards and photos pass under the cursor and would start their
   hover animations (zoom, lift, overlays), which looks jittery and slows scrolling.
   Adds .is-scrolling to <html> during a scroll and removes it about 150ms after the
   scroll stops; nav-menu.css turns pointer events off while it is set. */

(function () {
  const IDLE_MS = 150;
  const root = document.documentElement;
  let timer = 0;
  let queued = false;

  function mark() {
    queued = false;
    if (!root.classList.contains('is-scrolling')) root.classList.add('is-scrolling');
    clearTimeout(timer);
    timer = setTimeout(() => root.classList.remove('is-scrolling'), IDLE_MS);
  }

  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(mark);
  }, { passive: true });
})();
