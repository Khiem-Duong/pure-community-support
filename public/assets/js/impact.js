/* Impact + Reports pages — shared behaviour: mobile nav, viewport-enter reveals,
   count-up numbers and the scroll-to-top button. */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Mobile nav ───────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Count-up numbers ─────────────────────────
     <span data-count="1250000">0</span> — the figure itself lives in the HTML. */
  function formatNum(n) { return Math.round(n).toLocaleString('en-US'); }

  function countUp(el) {
    const target = parseFloat(el.dataset.count) || 0;
    if (reduceMotion || target === 0) { el.textContent = formatNum(target); return; }
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = formatNum(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── Viewport-enter reveals ───────────────── */
  const targets = document.querySelectorAll('.reveal, .reveal-photo, .hero-photo, .split-bar, [data-count]');

  function show(el) {
    el.classList.add('in');
    if (el.hasAttribute('data-count')) countUp(el);
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach(show);
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(el => io.observe(el));
  }

  /* ── Scroll to top ────────────────────────── */
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      const on = window.scrollY > 120;
      scrollBtn.style.opacity = on ? '1' : '0';
      scrollBtn.style.pointerEvents = on ? 'auto' : 'none';
    }, { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }
})();
