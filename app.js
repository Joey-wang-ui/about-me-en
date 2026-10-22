(() => {
  'use strict';
  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } };
  let toastTimer;
  function toast(message) {
    const element = $('.chapter-dialog[open] .chapter-toast') || $('.world-toast:not(.chapter-toast)');
    clearTimeout(toastTimer);
    element.textContent = message;
    element.classList.add('visible');
    toastTimer = setTimeout(() => element.classList.remove('visible'), 2600);
  }

  // Day and night are a visual preference; all portfolio content stays available.
  const themeButton = $('.theme-toggle');
  function applyTheme(theme) {
    const night = theme === 'night';
    root.dataset.theme = night ? 'night' : 'day';
    themeButton.setAttribute('aria-pressed', String(night));
    themeButton.setAttribute('aria-label', night ? 'Switch to day mode' : 'Switch to night mode');
    themeButton.title = themeButton.getAttribute('aria-label');
    $('use', themeButton).setAttribute('href', `assets/sprites.svg#${night ? 'moon' : 'sun'}`);
    $('meta[name="theme-color"]').content = night ? '#232722' : '#eeeee7';
  }
  applyTheme(readPreference('joey-pixel-theme') || 'day');
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'night' ? 'day' : 'night';
    applyTheme(theme);
    savePreference('joey-pixel-theme', theme);
  });

  const tabs = $$('[role="tab"]');
  const panels = $$('[role="tabpanel"]');
  let currentProject = 0;
  let panelAnimation;
  function activateProject(index, moveFocus = false, returnToTitle = false) {
    const changed = currentProject !== index;
    currentProject = index;
    panelAnimation?.cancel();
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (moveFocus) tabs[index].focus({ preventScroll: true });
    if (changed && returnToTitle && panels[index].getBoundingClientRect().top < tabs[index].getBoundingClientRect().bottom) {
      panels[index].style.scrollMarginTop = `${$('.file-tabs').offsetHeight + 28}px`;
      panels[index].scrollIntoView({ block: 'start', behavior: motion.matches ? 'auto' : 'smooth' });
    }
    if (changed && !motion.matches && panels[index].animate) {
      panelAnimation = panels[index].animate([
        { opacity: .35, transform: 'translateY(7px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 230, easing: 'ease-out' });
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateProject(index, false, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activateProject(next, true, true);
      }
    });
  });
  activateProject(0);
  const copyButton = $('.copy-email');
  let copyTimer;
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.email;
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(email); copied = true; }
    } catch { /* A local file or permission policy can require the selection fallback. */ }
    if (!copied) {
      const field = document.createElement('textarea');
      field.value = email;
      field.style.cssText = 'position:fixed;opacity:0;left:-9999px;top:0';
      document.body.append(field);
      field.select();
      try { copied = document.execCommand('copy'); } catch { /* Keep the visible address available. */ }
      field.remove();
      copyButton.focus({ preventScroll: true });
    }
    if (copied) {
      clearTimeout(copyTimer);
      $('span', copyButton).textContent = 'Copied!';
      $('use', copyButton).setAttribute('href', 'assets/sprites.svg#check');
      toast('Email copied. Let’s make something good.');
      copyTimer = setTimeout(() => {
        $('span', copyButton).textContent = 'Copy email';
        $('use', copyButton).setAttribute('href', 'assets/sprites.svg#copy');
      }, 2400);
    } else {
      const range = document.createRange();
      range.selectNodeContents($('.email-link'));
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      toast('Select and copy the email address above.');
    }
  });

  // Each jelly letter opens one chapter. Move the original content, rather
  // than copying it, so research tabs and email controls keep their behavior.
  const chapterDialog = $('.chapter-dialog');
  const chapterContent = $('.chapter-content');
  const chapterReader = $('.chapter-reader');
  const chapters = [
    { id: 'about', letter: 'J', title: 'Journey', kicker: '01 / MY STORY SO FAR', intro: 'Where I’m learning, what I work with, and a little life away from the keyboard.' },
    { id: 'work', letter: 'o', title: 'Outcomes', kicker: '02 / SELECTED WORK', intro: 'Two research projects. From real questions and real data to a little more understanding.' },
    { id: 'experience', letter: 'e', title: 'Experience', kicker: '03 / LEARNING BY DOING', intro: 'Product, cloud platforms, and research. A few things I’ve learned along the way.' },
    { id: 'contact', letter: 'y', title: 'You & me', kicker: '04 / YOUR NEXT COLLABORATOR', intro: 'A good conversation is a pretty good place to start.' },
  ];
  let activeChapter = -1, chapterPlaceholder = null, chapterSection = null;
  let chapterReturnFocus = null, chapterScrollY = 0;
  const jumpAnimations = new Set();
  function restoreChapterContent() {
    if (chapterSection && chapterPlaceholder) chapterPlaceholder.replaceWith(chapterSection);
    chapterSection = chapterPlaceholder = null;
  }
  function trackAnimation(animation) {
    jumpAnimations.add(animation);
    const clean = () => jumpAnimations.delete(animation);
    animation.addEventListener('finish', clean, { once: true });
    animation.addEventListener('cancel', clean, { once: true });
  }
  function bounceLetter(element) {
    if (motion.matches || !element?.animate) return;
    trackAnimation(element.animate([
      { transform: 'scale(1,1) rotate(0deg)' },
      { transform: 'scale(.94,1.07) rotate(-3deg)', offset: .25 },
      { transform: 'scale(1.06,.95) rotate(2deg)', offset: .5 },
      { transform: 'scale(.99,1.02) rotate(-.6deg)', offset: .75 },
      { transform: 'scale(1,1) rotate(0deg)' },
    ], { duration: 760, easing: 'cubic-bezier(.2,.7,.2,1)' }));
  }
  function openChapter(id, trigger = document.activeElement) {
    if (root.dataset.intro) return;
    const index = chapters.findIndex(chapter => chapter.id === id);
    if (index < 0) return;
    if (!chapterDialog.open) {
      chapterReturnFocus = trigger?.matches?.('a, button, [tabindex]') ? trigger : $(`.joey-letter[data-chapter="${id}"]`);
      chapterScrollY = scrollY;
    }
    restoreChapterContent();
    resetWordmarkPointer();
    const chapter = chapters[index];
    activeChapter = index;
    chapterSection = $(`#${id}`);
    chapterPlaceholder = document.createElement('div');
    chapterPlaceholder.style.height = `${chapterSection.getBoundingClientRect().height}px`;
    chapterPlaceholder.setAttribute('aria-hidden', 'true');
    chapterSection.before(chapterPlaceholder);
    chapterContent.append(chapterSection);
    chapterDialog.dataset.chapter = id;
    chapterJellyInteraction?.setIndex(index);
    history.replaceState(null, '', `#${id}`);
    $$('.joey-letter, .main-nav a').forEach(link => {
      const selected = link.getAttribute('href') === `#${id}`;
      link.setAttribute('aria-expanded', String(selected));
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    chapterDialog.style.setProperty('--letter', index);
    $('#chapter-heading').textContent = chapter.title;
    $('.chapter-kicker').textContent = chapter.kicker;
    $('.chapter-introduction').textContent = chapter.intro;
    $('.chapter-caption').textContent = chapter.title;
    $('.chapter-count').textContent = `${String(index + 1).padStart(2, '0')} / 04`;
    const next = chapters[(index + 1) % chapters.length];
    $('.chapter-next-inline').innerHTML = `${next.title} <span aria-hidden="true"><svg class="text-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
    $('.chapter-next').setAttribute('aria-label', `Next chapter: ${next.title}`);
    $('.chapter-prev').setAttribute('aria-label', `Previous chapter: ${chapters[(index + 3) % 4].title}`);
    document.body.classList.add('chapter-open');
    if (!chapterDialog.open) chapterDialog.showModal();
    chapterJellyInteraction?.refresh();
    chapterJellyInteraction?.play();
    chapterReader.scrollTop = 0;
    chapterDialog.scrollTop = 0;
    $('#chapter-heading').focus({ preventScroll: true });
    if (!motion.matches && chapterReader.animate) {
      trackAnimation(chapterReader.animate([{ opacity: .3, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' }));
    }
  }
  function closeChapter() {
    if (!chapterDialog.open) return;
    chapterDialog.close();
    finishChapterClose();
  }
  function switchChapter(direction) { openChapter(chapters[(activeChapter + direction + chapters.length) % chapters.length].id); }
  $('.chapter-close').addEventListener('click', closeChapter);
  $('.chapter-home').addEventListener('click', closeChapter);
  $('.chapter-next').addEventListener('click', () => switchChapter(1));
  $('.chapter-next-inline').addEventListener('click', () => switchChapter(1));
  $('.chapter-prev').addEventListener('click', () => switchChapter(-1));
  function finishChapterClose() {
    if (chapterDialog.open || activeChapter < 0) return;
    chapterJellyInteraction?.reset();
    restoreChapterContent();
    activeChapter = -1;
    document.body.classList.remove('chapter-open');
    scrollTo({ top: chapterScrollY, behavior: 'instant' });
    chapterReturnFocus?.focus({ preventScroll: true });
    history.replaceState(null, '', location.pathname + location.search);
    $$('.joey-letter, .main-nav a').forEach(link => { link.setAttribute('aria-expanded', 'false'); link.removeAttribute('aria-current'); });
  }
  chapterDialog.addEventListener('close', finishChapterClose);
  chapterDialog.addEventListener('cancel', event => { event.preventDefault(); closeChapter(); });
  $$('.joey-letter').forEach(letter => {
    letter.setAttribute('aria-haspopup', 'dialog');
    letter.setAttribute('aria-controls', 'chapter-dialog');
    letter.setAttribute('aria-expanded', 'false');
    letter.addEventListener('click', event => {
      event.preventDefault();
      bounceLetter($('.joey-glyph', letter));
      openChapter(letter.dataset.chapter, letter);
    });
    letter.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); letter.click(); }
    });
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    openChapter(link.getAttribute('href').slice(1), link);
  }));
  // Shape the whole textured letter; chapter navigation keeps its stable links.
  const jellyInteraction = window.JoeyJelly?.mount($$('.joey-letter'), () => motion.matches || chapterDialog.open || !!root.dataset.intro);
  const chapterJellyInteraction = window.JoeyJelly?.mount([$('.chapter-object')], () => motion.matches || !chapterDialog.open || !!root.dataset.intro, { artSelector: '.chapter-art', glyphSelector: '.chapter-glyph' });
  $('.chapter-object').addEventListener('click', () => chapterJellyInteraction?.play());
  function resetWordmarkPointer() { jellyInteraction?.reset(); chapterJellyInteraction?.reset(); }
  addEventListener('blur', resetWordmarkPointer);
  const jellyImage = new Image();
  jellyImage.onerror = () => root.classList.add('jelly-unavailable');
  jellyImage.src = 'assets/jelly-letters.png';

  const intro = $('.world-intro');
  const introTrack = $('.intro-track');
  const introNumber = $('.intro-number');
  const introBackground = $$('.site-header, main, .site-footer');
  let introFrame, introTimer, introFallback, introActive = false, replaying = false;
  function revealHero() {
    const hero = $('.hero');
    hero.classList.remove('hero-enter');
    if (motion.matches) return;
    // Measure the resting artwork so every letter starts at one shared center,
    // including on small screens and with the shallow arch already applied.
    const letters = $$('.joey-letter');
    const centers = letters.map(letter => {
      const box = letter.querySelector('.joey-glyph').getBoundingClientRect();
      return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    });
    const centerX = centers.reduce((sum, point) => sum + point.x, 0) / centers.length;
    const centerY = centers.reduce((sum, point) => sum + point.y, 0) / centers.length;
    letters.forEach((letter, index) => {
      letter.style.setProperty('--arrive-x', `${(centerX - centers[index].x).toFixed(2)}px`);
      letter.style.setProperty('--arrive-y', `${(centerY - centers[index].y).toFixed(2)}px`);
    });
    requestAnimationFrame(() => hero.classList.add('hero-enter'));
  }
  function releaseIntro() {
    cancelAnimationFrame(introFrame);
    clearTimeout(introTimer);
    clearTimeout(introFallback);
    introActive = false;
    intro.hidden = true;
    delete root.dataset.intro;
    introBackground.forEach(element => { element.inert = false; });
    if (replaying) {
      const heading = $('#hero-title');
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      replaying = false;
    }
  }
  function finishIntro(immediate = false) {
    if (!introActive) return;
    cancelAnimationFrame(introFrame);
    introTrack.setAttribute('aria-valuenow', '100');
    intro.style.setProperty('--intro-progress', '1');
    introNumber.textContent = '100%';
    revealHero();
    if (immediate) { releaseIntro(); return; }
    root.dataset.intro = 'leaving';
    intro.classList.add('leaving');
    introTimer = setTimeout(releaseIntro, 520);
  }
  function startIntro(replay = false) {
    if (introActive) return;
    if (motion.matches || location.hash && !replay) { revealHero(); return; }
    replaying = replay;
    if (replay) scrollTo({ top: 0, behavior: 'instant' });
    intro.hidden = false;
    intro.classList.remove('leaving');
    root.dataset.intro = 'loading';
    introActive = true;
    introBackground.forEach(element => { element.inert = true; });
    intro.style.setProperty('--intro-progress', '0');
    introTrack.setAttribute('aria-valuenow', '0');
    introNumber.textContent = '00%';
    introFallback = setTimeout(() => finishIntro(true), 3500);
    const began = performance.now();
    function tick(now) {
      const fraction = Math.min(1, (now - began) / 1050);
      const progress = 1 - Math.pow(1 - fraction, 1.4);
      const value = Math.floor(progress * 100);
      intro.style.setProperty('--intro-progress', String(progress));
      introTrack.setAttribute('aria-valuenow', String(value));
      introNumber.textContent = `${String(value).padStart(2, '0')}%`;
      if (fraction === 1) finishIntro();
      else introFrame = requestAnimationFrame(tick);
    }
    introFrame = requestAnimationFrame(tick);
  }
  $('.replay-intro').addEventListener('click', () => startIntro(true));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && introActive) finishIntro(true); });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      finishIntro(true);
      panelAnimation?.cancel();
      jumpAnimations.forEach(animation => animation.cancel());
      jumpAnimations.clear();
      resetWordmarkPointer();
    }
  });
  root.classList.add('is-enhanced');
  chapterDialog.id = 'chapter-dialog';
  const requestedChapter = location.hash.slice(1);
  startIntro();
  if (chapters.some(chapter => chapter.id === requestedChapter)) openChapter(requestedChapter);
  addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (chapters.some(chapter => chapter.id === id)) openChapter(id);
    else closeChapter();
  });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || root.dataset.intro) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const index = ['1', '2', '3', '4'].indexOf(event.key);
    if (index >= 0) { event.preventDefault(); openChapter(chapters[index].id); }
  });
})();
