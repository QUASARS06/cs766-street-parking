// ---------- Mobile nav toggle ----------
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
  }
})();

// ---------- Highlight active nav link ----------
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (
      href === path ||
      (path === '' && href === 'index.html') ||
      (path === 'index.html' && href === 'index.html')
    ) {
      a.classList.add('active');
    }
  });
})();

// ---------- Image lightbox / slideshow ----------
// Any <img class="figure-zoom"> opens the lightbox on click.
// Images that share the same `data-gallery` value form a slideshow group:
// while the lightbox is open, the user can step through them with the
// on-screen prev/next buttons or the Left/Right arrow keys.
// Optional `data-caption` is shown beneath the image inside the lightbox.
(function () {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close (Esc)">&times;</button>
    <div class="lightbox-stage">
      <button class="lightbox-prev" aria-label="Previous image (Left arrow)">&#10094;</button>
      <img alt="" />
      <button class="lightbox-next" aria-label="Next image (Right arrow)">&#10095;</button>
    </div>
    <div class="lightbox-caption" aria-live="polite"></div>
    <div class="lightbox-counter" aria-live="polite"></div>
  `;
  document.body.appendChild(lightbox);

  const lbImg     = lightbox.querySelector('img');
  const lbClose   = lightbox.querySelector('.lightbox-close');
  const lbPrev    = lightbox.querySelector('.lightbox-prev');
  const lbNext    = lightbox.querySelector('.lightbox-next');
  const lbCaption = lightbox.querySelector('.lightbox-caption');
  const lbCounter = lightbox.querySelector('.lightbox-counter');

  const state = { images: [], idx: 0 };

  function showAt(idx) {
    if (!state.images.length) return;
    const n = state.images.length;
    state.idx = ((idx % n) + n) % n;
    const img = state.images[state.idx];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';

    const caption = img.dataset.caption || '';
    lbCaption.textContent = caption;

    if (n > 1) {
      lbCounter.textContent = (state.idx + 1) + ' / ' + n;
      lbCounter.hidden = false;
      lbPrev.hidden = false;
      lbNext.hidden = false;
    } else {
      lbCounter.hidden = true;
      lbPrev.hidden = true;
      lbNext.hidden = true;
    }
  }

  function open(triggerImg) {
    const gallery = triggerImg.dataset.gallery;
    let images;
    if (gallery) {
      images = Array.from(document.querySelectorAll(
        'img[data-gallery="' + cssEscape(gallery) + '"]'
      ));
    } else {
      images = [triggerImg];
    }
    state.images = images;
    const startIdx = images.indexOf(triggerImg);
    showAt(startIdx >= 0 ? startIdx : 0);

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    lbCaption.textContent = '';
    state.images = [];
    document.body.style.overflow = '';
  }

  // CSS.escape polyfill for older browsers (Safari < 10.1, etc.)
  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(value);
    }
    return String(value).replace(/[^a-zA-Z0-9_\-]/g, function (ch) {
      return '\\' + ch.charCodeAt(0).toString(16) + ' ';
    });
  }

  // Wire up every figure-zoom image, plus images inside a .figure-zoom container.
  const triggers = new Set();
  document.querySelectorAll('img.figure-zoom').forEach((img) => triggers.add(img));
  document.querySelectorAll('.figure-zoom img').forEach((img) => triggers.add(img));
  triggers.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      open(img);
    });
  });

  // Click on the dim background closes; clicks on the image, prev/next, or
  // caption do not propagate up.
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) close();
  });
  lbImg.addEventListener('click', (e) => e.stopPropagation());
  lbClose.addEventListener('click', (e) => { e.stopPropagation(); close(); });
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showAt(state.idx - 1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); showAt(state.idx + 1); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      { close(); }
    else if (e.key === 'ArrowLeft')  { showAt(state.idx - 1); }
    else if (e.key === 'ArrowRight') { showAt(state.idx + 1); }
  });
})();
