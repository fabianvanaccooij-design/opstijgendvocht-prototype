/* ==========================================================================
   Interacties van het prototype. Geen framework, geen build-stap nodig.
   Elk onderdeel zoekt zijn eigen data-attributen op en doet verder niets
   als die niet op de pagina staan.
   ========================================================================== */
(function () {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const mqMobile = window.matchMedia('(max-width: 767px)');
  const mqDesktopNav = window.matchMedia('(min-width: 1400px)');

  /* --- Scroll-lock voor overlays ----------------------------------------- */
  let locks = 0;
  const lock = () => { locks++; document.body.classList.add('is-locked'); };
  const unlock = () => { locks = Math.max(0, locks - 1); if (!locks) document.body.classList.remove('is-locked'); };

  /* --- Header: lichte schaduw zodra hij vastzit (desktop, zie layout.css) ----- */
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 0 && header.getBoundingClientRect().top <= 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Megamenu (desktop) ----------------------------------------------- */
  const megaToggles = $$('[data-mega-toggle]');
  const megaScrim = $('[data-mega-scrim]');
  function closeMega() {
    megaToggles.forEach((t) => { t.setAttribute('aria-expanded', 'false'); const m = document.getElementById(t.getAttribute('aria-controls')); if (m) m.hidden = true; });
    megaScrim && megaScrim.classList.remove('is-open');
  }
  function openMega(t) {
    closeMega();
    const m = document.getElementById(t.getAttribute('aria-controls'));
    if (!m) return;
    t.setAttribute('aria-expanded', 'true'); m.hidden = false;
    megaScrim && megaScrim.classList.add('is-open');
  }
  megaToggles.forEach((t) => {
    t.addEventListener('click', () => (t.getAttribute('aria-expanded') === 'true' ? closeMega() : openMega(t)));
  });
  megaScrim && megaScrim.addEventListener('click', closeMega);
  document.addEventListener('click', (e) => { if (header && !header.contains(e.target)) closeMega(); });
  mqDesktopNav.addEventListener('change', closeMega);

  /* --- Mobiel menu ------------------------------------------------------ */
  const mm = $('[data-mobilemenu]');
  const mmOpen = $('[data-mobilemenu-open]');
  function showPane(id) {
    $$('[data-pane]', mm).forEach((p) => { const on = p.dataset.pane === id; p.hidden = !on; p.classList.toggle('is-active', on); });
    mm.scrollTop = 0;
  }
  function openMM() { mm.hidden = false; showPane('root'); lock(); mmOpen && mmOpen.setAttribute('aria-expanded', 'true'); const c = $('[data-mobilemenu-close]', mm); c && c.focus(); }
  function closeMM() { if (mm.hidden) return; mm.hidden = true; unlock(); mmOpen && mmOpen.setAttribute('aria-expanded', 'false'); mmOpen && mmOpen.focus(); }
  if (mm) {
    mmOpen && mmOpen.addEventListener('click', openMM);
    $('[data-mobilemenu-close]', mm).addEventListener('click', closeMM);
    $$('[data-pane-open]', mm).forEach((b) => b.addEventListener('click', () => showPane(b.dataset.paneOpen)));
    $$('[data-pane-back]', mm).forEach((b) => b.addEventListener('click', () => showPane('root')));
    mqDesktopNav.addEventListener('change', (e) => { if (e.matches) closeMM(); });
  }

  /* --- Uitklapkaarten (accordion) ---------------------------------------- */
  document.addEventListener('click', (e) => {
    const head = e.target.closest('.acc__head');
    if (!head) return;
    const acc = head.closest('[data-acc]');
    const open = !acc.classList.contains('is-open');
    // Eén kaart tegelijk open binnen dezelfde rij
    if (open && acc.parentElement) {
      Array.from(acc.parentElement.children).forEach((other) => {
        if (other !== acc && other.matches('[data-acc].is-open')) {
          other.classList.remove('is-open');
          const h = $('.acc__head', other);
          h && h.setAttribute('aria-expanded', 'false');
        }
      });
    }
    acc.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));
  });

  /* --- Sliders ------------------------------------------------------------
     Desktop: pijlknoppen schuiven de track (transform).
     Mobiel: native horizontaal scrollen met snap; stippen volgen de positie. */
  $$('[data-slider]').forEach((slider) => {
    const track = $('[data-slider-track]', slider);
    if (!track) return;
    const items = Array.from(track.children);
    const prev = $('[data-slider-prev]', slider);
    const next = $('[data-slider-next]', slider);
    const dots = $('[data-slider-dots]', slider);
    let index = 0;

    function step() {
      if (items.length < 2) return 0;
      return items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left;
    }
    // Zichtbare breedte zonder de zijpadding (bij sliders die tot de browserrand lopen)
    function viewWidth() {
      const vp = track.parentElement;
      const cs = getComputedStyle(vp);
      return vp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    }
    function maxIndex() {
      const viewport = viewWidth();
      const total = track.scrollWidth;
      const s = step() || 1;
      return Math.max(0, Math.ceil((total - viewport) / s));
    }
    function update() {
      if (mqMobile.matches) { track.style.transform = ''; return; }
      index = Math.min(index, maxIndex());
      const s = step();
      const viewport = viewWidth();
      const offset = Math.min(index * s, Math.max(0, track.scrollWidth - viewport));
      track.style.transform = `translateX(${-offset}px)`;
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= maxIndex();
    }
    prev && prev.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
    next && next.addEventListener('click', () => { index = Math.min(maxIndex(), index + 1); update(); });
    window.addEventListener('resize', update);
    update();

    if (dots) {
      dots.innerHTML = items.map((_, i) => `<button type="button" aria-label="Ga naar ${i + 1}"></button>`).join('');
      const btns = Array.from(dots.children);
      const setActive = () => {
        const s = step() || 1;
        const i = Math.round(track.scrollLeft / s);
        btns.forEach((b, j) => b.classList.toggle('is-active', j === Math.min(i, btns.length - 1)));
      };
      btns.forEach((b, i) => b.addEventListener('click', () => track.scrollTo({ left: i * step(), behavior: 'smooth' })));
      track.addEventListener('scroll', () => requestAnimationFrame(setActive), { passive: true });
      setActive();
    }
  });

  /* --- WhatsApp-keuzehulp --------------------------------------------------- */
  const wa = $('[data-wa]');
  if (wa) {
    const scrim = $('[data-wa-scrim]');
    const number = wa.dataset.waNumber;
    const defaultText = wa.dataset.waDefault;
    const questions = $$('[data-wa-q]', wa);
    const backBtn = $('[data-wa-back]', wa);
    const steps = $$('[data-wa-step="vraag"] .stepper__item', wa);
    const msgEl = $('[data-wa-message]', wa);
    let answers = {};
    let q = 0;
    let lastFocus = null;

    const buildMessage = () => {
      if (!answers.wat) return defaultText;
      const wat = answers.wat.toLowerCase();
      const parts = [];
      parts.push(wat.startsWith('anders') ? 'Ik weet niet precies wat het is' : `Ik zie ${wat}`);
      if (answers.waar) parts.push(answers.waar.toLowerCase().startsWith('op meerdere') ? answers.waar.toLowerCase() : `in de ${answers.waar.toLowerCase().replace(' / ', ' of ')}`);
      if (answers.plek && !/weet ik niet/i.test(answers.plek)) parts.push(answers.plek.toLowerCase().startsWith('op meerdere') || answers.plek.toLowerCase().startsWith('rond') ? answers.plek.toLowerCase() : `aan een ${answers.plek.toLowerCase()}`);
      return `${defaultText} ${parts.join(', ')}.`;
    };
    const waUrl = (text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

    function renderQR(text) {
      const box = $('[data-wa-qr]', wa);
      if (!box || typeof window.qrcode !== 'function') return;
      const qr = window.qrcode(0, 'M');
      qr.addData(waUrl(text));
      qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
    }
    function showQuestion(i) {
      q = i;
      questions.forEach((el, j) => { el.hidden = j !== i; });
      backBtn.hidden = i === 0;
      // Stappenbalk zoals het vochtadviesformulier: afgerond, actief, nog te doen
      steps.forEach((li, j) => {
        li.classList.toggle('is-done', j < i);
        li.classList.toggle('is-active', j === i);
        if (j === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      $$('.choice', questions[i]).forEach((c) => c.classList.toggle('is-selected', answers[questions[i].dataset.key] === c.dataset.waChoice));
    }
    function showStep(name, mode) {
      $$('[data-wa-step]', wa).forEach((s) => { s.hidden = s.dataset.waStep !== name; });
      if (name === 'bericht') {
        wa.dataset.waMode = mode;
        const text = mode === 'direct' ? defaultText : buildMessage();
        msgEl.textContent = text;
        const link = $('[data-wa-link]', wa); if (link) link.href = waUrl(text);
        const web = $('[data-wa-web]', wa); if (web) web.href = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(text)}`;
        renderQR(text);
      }
      $('.wa__body', wa).scrollTop = 0;
    }
    function reset() { answers = {}; showStep('vraag'); showQuestion(0); }

    function open() {
      lastFocus = document.activeElement;
      closeMega();
      wa.hidden = false;
      requestAnimationFrame(() => { wa.classList.add('is-open'); scrim.classList.add('is-open'); });
      lock();
      setTimeout(() => $('[data-wa-close]', wa).focus(), 50);
    }
    function close() {
      wa.classList.remove('is-open'); scrim.classList.remove('is-open');
      setTimeout(() => { wa.hidden = true; }, 300);
      unlock();
      lastFocus && lastFocus.focus && lastFocus.focus();
    }

    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-wa-open]');
      if (t) { e.preventDefault(); open(); }
    });
    $('[data-wa-close]', wa).addEventListener('click', close);
    scrim.addEventListener('click', close);
    $$('[data-wa-choice]', wa).forEach((btn) => btn.addEventListener('click', () => {
      const key = btn.closest('[data-wa-q]').dataset.key;
      answers[key] = btn.dataset.waChoice;
      btn.classList.add('is-selected');
      setTimeout(() => { if (q < questions.length - 1) showQuestion(q + 1); else showStep('bericht', 'bericht'); }, 150);
    }));
    backBtn.addEventListener('click', () => { if (q > 0) showQuestion(q - 1); });
    $$('[data-wa-go]', wa).forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.waGo === 'direct') showStep('bericht', 'direct');
      else { showStep('vraag'); showQuestion(q); }
    }));
    $('[data-wa-restart]', wa).addEventListener('click', reset);
    reset();

    window.OV = window.OV || {};
    window.OV.openWhatsApp = open;
  }

  /* --- Escape sluit open overlays --------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeMega();
    if (mm && !mm.hidden) closeMM();
    if (wa && wa.classList.contains('is-open')) $('[data-wa-close]', wa).click();
    $$('[data-modal].is-open').forEach((m) => m.dispatchEvent(new CustomEvent('modal:close')));
  });

  /* --- Formulieren: validatie en verzonden-staat ----------------------------
     data-form            formulier valideren bij verzenden
     data-success="id"    element dat na verzenden zichtbaar wordt (formulier verdwijnt)
     data-redirect="url"  of: ga naar een bedankpagina                          */
  function validateField(field) {
    const ctrl = $('input, select, textarea', field);
    if (!ctrl) return true;
    const ok = ctrl.checkValidity();
    field.classList.toggle('is-error', !ok);
    return ok;
  }
  /* data-steps          formulier in stappen: [data-step] blokken, [data-next] / [data-prev] knoppen,
                          [data-stepper] stappenbalk (Formulier / Stappen). Alleen zichtbare velden worden gecontroleerd. */
  $$('[data-form]').forEach((form) => {
    const steps = form.hasAttribute('data-steps') ? $$('[data-step]', form) : [];
    const stepper = $('[data-stepper]', form);
    let cur = 0;
    const visibleFields = () => $$('[data-field]', form).filter((f) => !f.closest('[hidden]'));
    function validateVisible() {
      const fields = visibleFields();
      const results = fields.map(validateField);
      const firstBad = fields[results.indexOf(false)];
      if (firstBad) { $('input, select, textarea', firstBad).focus(); return false; }
      return true;
    }
    function goTo(i) {
      steps.forEach((st, n) => { st.hidden = n !== i; });
      if (stepper) $$('.stepper__item', stepper).forEach((li, n) => {
        li.classList.toggle('is-done', n < i);
        li.classList.toggle('is-active', n === i);
        if (n === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      cur = i;
      (form.closest('.card') || form).scrollIntoView({ behavior: 'smooth', block: 'start' });
      const h = $('h4', steps[i]);
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    if (steps.length) {
      form.addEventListener('click', (e) => {
        if (e.target.closest('[data-next]')) { if (validateVisible()) goTo(Math.min(cur + 1, steps.length - 1)); }
        else if (e.target.closest('[data-prev]')) goTo(Math.max(cur - 1, 0));
      });
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (steps.length && cur < steps.length - 1) { if (validateVisible()) goTo(cur + 1); return; }
      if (!validateVisible()) return;
      if (form.dataset.redirect) { window.location.href = form.dataset.redirect; return; }
      const ok = form.dataset.success && document.getElementById(form.dataset.success);
      if (ok) {
        (form.closest('[data-form-wrap]') || form).hidden = true;
        ok.hidden = false;
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    form.addEventListener('input', (e) => { const f = e.target.closest('[data-field]'); if (f && f.classList.contains('is-error')) validateField(f); });
    form.addEventListener('change', (e) => {
      const f = e.target.closest('[data-field]');
      if (f && f.classList.contains('is-error')) validateField(f);
    });
  });

  /* --- Form / Upload ------------------------------------------------------
     Simuleert uploaden in de browser (er wordt niets verstuurd).
     Bestanden groter dan data-max-mb of geen JPG/PNG geven een foutregel.
     Een bestand met "mislukt" in de naam laat de staat "Uploaden mislukt" zien. */
  const fmtSize = (b) => (b / 1048576).toFixed(1).replace('.', ',') + ' MB';
  $$('[data-upload]').forEach((up) => {
    const input = $('[data-upload-input]', up);
    const zone = $('[data-upload-zone]', up);
    const list = $('[data-upload-list]', up);
    const max = Number(up.dataset.max || 5);
    const maxMb = Number(up.dataset.maxMb || 10);
    const count = () => $$('.upload__item:not(.is-error)', list).length;
    const refresh = () => up.classList.toggle('is-full', count() >= max);

    function row(file) {
      const li = document.createElement('li');
      li.className = 'upload__item';
      li.innerHTML = `<img class="upload__thumb" alt=""><div class="upload__info"><span class="upload__name"></span><span class="upload__meta"></span></div><button type="button" class="btn-close" aria-label="Verwijderen"></button>`;
      $('.upload__name', li).textContent = file.name;
      return li;
    }
    const iconSvg = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

    function addFile(file) {
      if (count() >= max) return;
      const li = row(file);
      const meta = $('.upload__meta', li);
      const btn = $('.btn-close', li);
      list.appendChild(li);
      btn.addEventListener('click', () => { li.remove(); refresh(); });
      const isImg = /image\/(jpeg|png)/.test(file.type);
      if (!isImg) { li.classList.add('is-error'); meta.textContent = 'Dit bestandstype wordt niet ondersteund. Kies een JPG of PNG.'; btn.innerHTML = iconSvg('close'); return; }
      if (file.size > maxMb * 1048576) { li.classList.add('is-error'); meta.textContent = 'Dit bestand is te groot. Kies een foto van maximaal <x> MB.'; btn.innerHTML = iconSvg('close'); return; }
      $('.upload__thumb', li).src = URL.createObjectURL(file);
      btn.innerHTML = iconSvg('close');
      meta.innerHTML = '<span>Uploaden… 0%</span><span class="upload__bar"><span></span></span>';
      let p = 0;
      const fail = /mislukt/i.test(file.name);
      const t = setInterval(() => {
        p = Math.min(100, p + 12 + Math.random() * 18);
        if (fail && p > 55) {
          clearInterval(t);
          li.classList.add('is-error');
          meta.innerHTML = 'Uploaden mislukt. <button type="button" class="upload__retry">Opnieuw proberen</button>';
          $('.upload__retry', li).addEventListener('click', () => { li.remove(); addFile(new File([file], file.name.replace(/mislukt/i, 'foto'), { type: file.type })); });
          return;
        }
        $('span', meta).textContent = `Uploaden… ${Math.round(p)}%`;
        $('.upload__bar span', meta).style.width = p + '%';
        if (p >= 100) { clearInterval(t); meta.textContent = fmtSize(file.size); btn.innerHTML = iconSvg('trash'); btn.setAttribute('aria-label', `Verwijder ${file.name}`); }
      }, 180);
      refresh();
    }
    const addFiles = (files) => { Array.from(files).forEach(addFile); refresh(); input.value = ''; };

    input.addEventListener('change', () => addFiles(input.files));
    ['dragenter', 'dragover'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); if (!up.classList.contains('is-full')) up.classList.add('is-dragging'); }));
    ['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); up.classList.remove('is-dragging'); }));
    zone.addEventListener('drop', (e) => { if (!up.classList.contains('is-full')) addFiles(e.dataTransfer.files); });
    zone.addEventListener('click', (e) => { if (up.classList.contains('is-full')) e.preventDefault(); });
  });

  /* --- Adres automatisch aanvullen (prototype) ------------------------------
     Bij een geldige postcode + huisnummer vullen we voorbeeldwaarden in. */
  $$('[data-address]').forEach((wrap) => {
    const pc = $('[name="postcode"]', wrap);
    const nr = $('[name="huisnummer"]', wrap);
    const tv = $('[name="toevoeging"]', wrap);
    const straat = $('[name="straat"]', wrap);
    const plaats = $('[name="plaats"]', wrap);
    const found = $('[data-address-found]', wrap);      // Formulier / Adres: Gevonden
    const manual = $('[data-address-manual]', wrap);    // Formulier / Adres: Handmatig
    const fill = () => {
      const ok = /^\s*\d{4}\s?[a-zA-Z]{2}\s*$/.test(pc.value) && nr.value.trim();
      if (found) {
        if (manual && !manual.hidden) return;
        found.hidden = !ok;
        if (ok) {
          const p = pc.value.trim().toUpperCase().replace(/^(\d{4})\s?([A-Z]{2})$/, '$1 $2');
          $('[data-address-text]', found).textContent = `Voorbeeldstraat ${nr.value.trim()}${tv ? tv.value.trim() : ''}, ${p} Voorbeeldplaats`;
        }
        return;
      }
      straat.value = ok ? 'Voorbeeldstraat' : '';
      plaats.value = ok ? 'Voorbeeldplaats' : '';
    };
    [pc, nr, tv].forEach((el) => el && el.addEventListener('input', fill));
    const edit = $('[data-address-edit]', wrap);
    if (edit) edit.addEventListener('click', () => { found.hidden = true; manual.hidden = false; straat.focus(); });
  });

  /* --- Webshop: filteren op categorie ------------------------------------ */
  $$('[data-filterable]').forEach((wrap) => {
    const pills = $$('[data-filter]', wrap);
    pills.forEach((p) => p.addEventListener('click', () => {
      pills.forEach((x) => { const on = x === p; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
      $$('[data-cat]', wrap).forEach((card) => { card.hidden = p.dataset.filter !== 'alle' && card.dataset.cat !== p.dataset.filter; });
    }));
  });

  /* --- Modals (galerij-lightbox, uitleg montage) --------------------------- */
  function openModal(m) { m.hidden = false; m.classList.add('is-open'); lock(); const c = $('[data-modal-close].btn-close', m); c && c.focus(); }
  function closeModal(m) { if (m.hidden) return; m.hidden = true; m.classList.remove('is-open'); unlock(); }
  $$('[data-modal]').forEach((m) => {
    $$('[data-modal-close]', m).forEach((b) => b.addEventListener('click', () => closeModal(m)));
    m.addEventListener('modal:close', () => closeModal(m));
  });
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-modal-open]');
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    const m = document.getElementById(t.dataset.modalOpen);
    if (m) openModal(m);
  }, true);

  /* --- Productpagina: galerij, lightbox, montage, aantal, sticky koopbalk --- */
  const product = $('[data-product]');
  if (product) {
    const gallery = $('[data-gallery]', product);
    const total = Number(gallery.dataset.count);
    const lightbox = $('#lightbox');
    let idx = 0;
    const setIdx = (i) => {
      idx = (i + total) % total;
      $('[data-gallery-count]', gallery).textContent = `${idx + 1} / ${total}`;
      $$('[data-gallery-thumb]', gallery).forEach((t) => t.classList.toggle('is-active', Number(t.dataset.galleryThumb) === idx));
      if (lightbox) {
        $('[data-lightbox-count]', lightbox).textContent = `${idx + 1} / ${total}`;
        $$('[data-lightbox-thumb]', lightbox).forEach((t) => t.classList.toggle('is-active', Number(t.dataset.lightboxThumb) === idx));
      }
    };
    $('[data-gallery-prev]', gallery).addEventListener('click', () => setIdx(idx - 1));
    $('[data-gallery-next]', gallery).addEventListener('click', () => setIdx(idx + 1));
    $$('[data-gallery-thumb]', gallery).forEach((t) => t.addEventListener('click', () => setIdx(Number(t.dataset.galleryThumb))));
    // Mobiel: vegen naar links of rechts op de hoofdfoto
    let touchX = null;
    const stage = $('.gallery__main', gallery);
    stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 40) setIdx(idx + (dx < 0 ? 1 : -1));
    });
    $$('[data-lightbox-open]', gallery).forEach((t) => t.addEventListener('click', () => { if (t.dataset.lightboxOpen) setIdx(Number(t.dataset.lightboxOpen)); openModal(lightbox); }));
    if (lightbox) {
      $('[data-lightbox-prev]', lightbox).addEventListener('click', () => setIdx(idx - 1));
      $('[data-lightbox-next]', lightbox).addEventListener('click', () => setIdx(idx + 1));
      $$('[data-lightbox-thumb]', lightbox).forEach((t) => t.addEventListener('click', () => setIdx(Number(t.dataset.lightboxThumb))));
      lightbox.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') setIdx(idx - 1); if (e.key === 'ArrowRight') setIdx(idx + 1); });
    }

    const box = $('[data-buybox]', product);
    const fmt = (n) => '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const montage = $('[data-montage-input]', box);
    const qtyInput = $('[data-qty-input]', box);
    const bar = $('[data-buybar]');
    const update = () => {
      const unit = Number(box.dataset.price) + (montage.checked ? Number(box.dataset.montagePrice) : 0);
      const qty = Math.max(1, Number(qtyInput.value) || 1);
      $('[data-buybox-price]', box).textContent = fmt(unit * qty);
      if (bar) { $('[data-buybar-price]', bar).textContent = fmt(unit * qty); $('[data-buybar-variant]', bar).textContent = montage.checked ? 'Inclusief montage' : 'Zonder montage'; }
    };
    montage.addEventListener('change', update);
    $('[data-qty-min]', box).addEventListener('click', () => { qtyInput.value = Math.max(1, (Number(qtyInput.value) || 1) - 1); update(); });
    $('[data-qty-plus]', box).addEventListener('click', () => { qtyInput.value = Math.min(99, (Number(qtyInput.value) || 1) + 1); update(); });
    qtyInput.addEventListener('input', update);

    // Sticky koopbalk: zichtbaar zodra de knop "In winkelmand" in de koopbox uit beeld is.
    if (bar && 'IntersectionObserver' in window) {
      bar.hidden = false;
      new IntersectionObserver(([entry]) => bar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0))
        .observe($('.buybox__buy', box));
    }

    // In winkelmand: prototypemelding (winkelmand en afrekenen zijn standaard WooCommerce).
    const toast = $('[data-toast]');
    let toastTimer;
    $$('[data-add-to-cart]').forEach((b) => b.addEventListener('click', () => {
      if (!toast) return;
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.hidden = true; }, 2500);
    }));
  }

  /* --- Werkwijze (mobiel): elke kaart schuift zo ver op dat van de vorige alleen de kop zichtbaar blijft ---
     Afstand per kaart = padding boven + hoogte van de kop + 8 (zoals desktop: 40 + 48 + 8 = 96). De kop is één of
     twee regels, afhankelijk van de schermbreedte, dus meten. Alle vakken even hoog, zodat de stapel in één keer wegscrolt. */
  $$('.ww__cards').forEach((list) => {
    const slots = $$('.ww__slot', list);
    const fit = () => {
      if (!mqMobile.matches) { list.style.removeProperty('--slot'); slots.forEach((s) => s.style.removeProperty('padding-top')); return; }
      const p0 = parseFloat(getComputedStyle(list).getPropertyValue('--p0')) || 24;
      let off = p0, maxCard = 0, lastTop = p0;
      slots.forEach((s) => {
        const card = $('.ww__card', s);
        const head = $('.ww__card-head', card);
        s.style.paddingTop = off + 'px';
        lastTop = off;
        off += parseFloat(getComputedStyle(card).paddingTop) + head.offsetHeight + 8;
        maxCard = Math.max(maxCard, card.offsetHeight);
      });
      list.style.setProperty('--slot', (lastTop + maxCard + 48) + 'px');
    };
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  });

  /* --- Ankerbalk (productpagina): verloop bij meer items, actief onderdeel, vastgeplakt --- */
  $$('[data-anchors]').forEach((nav) => {
    const bar = $('[data-anchors-bar]', nav);
    const links = $$('a[href^="#"]', bar);
    const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
    const fades = () => {
      const max = bar.scrollWidth - bar.clientWidth;
      nav.classList.toggle('has-more-left', bar.scrollLeft > 4);
      nav.classList.toggle('has-more-right', bar.scrollLeft < max - 4);
    };
    let current = -2;
    const spy = () => {
      const headerH = header ? header.offsetHeight : 0;
      const line = headerH + nav.offsetHeight + 24;
      let idx = -1;
      targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= line) idx = i; });
      nav.classList.toggle('is-stuck', nav.getBoundingClientRect().top <= headerH + 1);
      if (idx === current) return;
      current = idx;
      links.forEach((a, i) => { a.classList.toggle('is-active', i === idx); if (i === idx) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
      // Actief item in beeld schuiven (midden van de balk)
      if (idx >= 0 && mqMobile.matches) {
        const a = links[idx];
        bar.scrollTo({ left: a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
      }
    };
    bar.addEventListener('scroll', () => requestAnimationFrame(fades), { passive: true });
    window.addEventListener('scroll', () => requestAnimationFrame(spy), { passive: true });
    window.addEventListener('resize', () => { fades(); spy(); });
    fades(); spy();
  });

  /* --- Paginering: actieve pagina wisselen en naar boven scrollen ---------- */
  $$('[data-pager]').forEach((pager) => {
    const total = Number(pager.dataset.total);
    const list = $('[data-pager-nums]', pager);
    const prev = $('[data-pager-prev]', pager);
    const next = $('[data-pager-next]', pager);
    // Altijd vijf plekken, zoals in Figma (1 2 3 … 12): begin, midden of eind
    const pages = (c) => {
      if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
      if (c <= 3) return [1, 2, 3, '…', total];
      if (c >= total - 2) return [1, '…', total - 2, total - 1, total];
      return [1, '…', c, '…', total];
    };
    const render = (c) => {
      pager.dataset.current = c;
      list.innerHTML = pages(c).map((n) => n === '…'
        ? '<li class="pager__ellipsis" aria-hidden="true">…</li>'
        : `<li><a class="pager__num${n === c ? ' is-active' : ''}" href="#" data-page="${n}"${n === c ? ' aria-current="page"' : ''}>${n}</a></li>`).join('');
      prev.disabled = c <= 1;
      next.disabled = c >= total;
    };
    // Naar het begin van de lijst (het blok direct boven de paginering), net onder de vaste header
    const listStart = pager.previousElementSibling || pager.parentElement;
    const go = (c) => {
      if (c < 1 || c > total || c === Number(pager.dataset.current)) return;
      render(c);
      const headerH = header ? header.offsetHeight : 0;
      const y = listStart.getBoundingClientRect().top + window.scrollY - headerH - 24;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    };
    list.addEventListener('click', (e) => {
      const a = e.target.closest('[data-page]');
      if (!a) return;
      e.preventDefault();
      go(Number(a.dataset.page));
    });
    prev.addEventListener('click', () => go(Number(pager.dataset.current) - 1));
    next.addEventListener('click', () => go(Number(pager.dataset.current) + 1));
  });

  /* --- Over ons: ons verhaal -------------------------------------------------
     Zoals in Figma: de foto blijft staan terwijl de tekst van het midden naar de bovenkant
     van de foto schuift; daarna scrolt het hoofdstuk weg. De hoofdstukhoogte wordt daarop afgestemd. */
  const chapters = $$('[data-story-chapter]');
  if (chapters.length) {
    const fit = () => chapters.forEach((ch) => {
      const photo = $('.story__photo', ch);
      const text = $('.story__text-inner', ch);
      if (!photo || !text || mqMobile.matches) { ch.style.minHeight = ''; return; }
      const cs = getComputedStyle(photo);
      const P = photo.offsetHeight;                                   // fotokolom incl. padding 24
      const T = text.offsetHeight;
      const travel = Math.max(0, (P - T) / 2 - parseFloat(cs.paddingTop));  // midden naar bovenkant foto
      ch.style.minHeight = `${Math.round(P + travel)}px`;
    });
    fit();
    window.addEventListener('resize', fit);
    document.fonts && document.fonts.ready.then(fit);
  }

  window.OV = Object.assign(window.OV || {}, { lock, unlock, $, $$ });
})();
