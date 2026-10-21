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
  root.classList.add('is-enhanced');
  $$('[data-open-project]').forEach(cover => cover.addEventListener('click', event => {
    event.preventDefault();
    activateProject(cover.dataset.openProject === 'finance' ? 1 : 0);
    openChapter('work', cover);
  }));

  // A compact, keyboard-accessible map is an alternative way to travel.
  const worldMap = $('.world-map');
  const mapToggle = $('.map-toggle');
  function closeMap() { if (worldMap.open) worldMap.close(); }
  function openMap() {
    if (root.dataset.intro || worldMap.open) return;
    worldMap.showModal();
    document.body.classList.add('map-open');
  }
  mapToggle.addEventListener('click', openMap);
  $('.close-map').addEventListener('click', closeMap);
  worldMap.addEventListener('close', () => document.body.classList.remove('map-open'));
  worldMap.addEventListener('click', event => {
    if (event.target !== worldMap) return;
    const bounds = worldMap.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeMap();
  });
  function travel(hash, focusHeading = false) {
    const target = $(hash);
    if (!target) return;
    history.replaceState(null, '', hash);
    target.scrollIntoView({ behavior: motion.matches ? 'auto' : 'smooth' });
    if (focusHeading) {
      const heading = $('h2, h3', target) || target;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
  $$('.map-place').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    closeMap();
    requestAnimationFrame(() => openChapter(link.getAttribute('href').slice(1), mapToggle));
  }));
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || root.dataset.intro) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (chapterDialog.open && event.key.toLowerCase() === 'm') return;
    if (event.key.toLowerCase() === 'm') {
      event.preventDefault();
      worldMap.open ? closeMap() : openMap();
    }
    if (!worldMap.open && ['1', '2', '3', '4'].includes(event.key)) {
      event.preventDefault();
      openChapter(['work', 'experience', 'about', 'contact'][Number(event.key) - 1]);
    }
  });

  // Small optional encounters; a pointer and a keyboard work equally well.
  $$('[data-creature]').forEach(creature => {
    creature.title = creature.getAttribute('aria-label');
    let reactionTimer;
    creature.addEventListener('click', () => {
      clearTimeout(reactionTimer);
      creature.classList.remove('is-petted');
      requestAnimationFrame(() => creature.classList.add('is-petted'));
      toast(creature.dataset.message);
      reactionTimer = setTimeout(() => creature.classList.remove('is-petted'), 950);
    });
  });

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
    { id: 'work', letter: 'J', title: 'Selected work', kicker: '01 / RESEARCH & IDEAS', intro: 'Real questions. Real data. Two ways of looking a little closer.' },
    { id: 'experience', letter: 'o', title: 'Experience', kicker: '02 / LEARNING BY DOING', intro: 'Product, cloud platforms, and research. A few things I’ve learned along the way.' },
    { id: 'about', letter: 'e', title: 'A little about me', kicker: '03 / BACKGROUND & BEYOND', intro: 'What I’m learning, what I work with, and a little life away from the keyboard.' },
    { id: 'contact', letter: 'y', title: 'Let’s talk', kicker: '04 / SAY HELLO', intro: 'A good conversation is a pretty good place to start.' },
  ];
  let activeChapter = -1, chapterPlaceholder = null, chapterSection = null;
  let chapterReturnFocus = null, chapterScrollY = 0;
  const jumpAnimations = new Set();
  const wordmarkWorld = $('.joey-world');
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
      chapterReturnFocus = trigger;
      chapterScrollY = scrollY;
    }
    restoreChapterContent();
    const chapter = chapters[index];
    activeChapter = index;
    chapterSection = $(`#${id}`);
    chapterPlaceholder = document.createElement('div');
    chapterPlaceholder.style.height = `${chapterSection.getBoundingClientRect().height}px`;
    chapterPlaceholder.setAttribute('aria-hidden', 'true');
    chapterSection.before(chapterPlaceholder);
    chapterContent.append(chapterSection);
    chapterDialog.dataset.chapter = id;
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
    chapterReader.scrollTop = 0;
    chapterDialog.scrollTop = 0;
    $('#chapter-heading').focus({ preventScroll: true });
    if (!motion.matches && chapterReader.animate) {
      trackAnimation(chapterReader.animate([{ opacity: .3, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' }));
      bounceLetter($('.chapter-art'));
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
    restoreChapterContent();
    activeChapter = -1;
    document.body.classList.remove('chapter-open');
    scrollTo({ top: chapterScrollY, behavior: 'instant' });
    chapterReturnFocus?.focus({ preventScroll: true });
    scheduleScroll();
  }
  chapterDialog.addEventListener('close', finishChapterClose);
  chapterDialog.addEventListener('cancel', event => { event.preventDefault(); closeChapter(); });
  $$('.joey-letter').forEach(letter => {
    letter.setAttribute('aria-haspopup', 'dialog');
    letter.addEventListener('click', event => {
      event.preventDefault();
      bounceLetter($('.joey-glyph', letter));
      openChapter(letter.dataset.chapter, letter);
    });
    letter.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); letter.click(); }
    });
  });
  $$('.main-nav a, .hotbar a, .hero-name > .pixel-button').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    openChapter(link.getAttribute('href').slice(1), link);
  }));
  // A subtle lean gives each object weight without moving its click target.
  function resetWordmarkPointer() {
    $$('.joey-glyph').forEach(glyph => {
      glyph.style.removeProperty('--jelly-lean');
      glyph.style.removeProperty('--jelly-rise');
    });
  }
  $$('.joey-letter').forEach(letter => {
    letter.addEventListener('pointermove', event => {
      if (motion.matches || event.pointerType === 'touch') return;
      const bounds = letter.getBoundingClientRect();
      const x = Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5));
      $('.joey-glyph', letter).style.setProperty('--jelly-lean', `${(x * 9).toFixed(2)}deg`);
      $('.joey-glyph', letter).style.setProperty('--jelly-rise', '-7px');
    });
    letter.addEventListener('pointerleave', () => {
      $('.joey-glyph', letter).style.removeProperty('--jelly-lean');
      $('.joey-glyph', letter).style.removeProperty('--jelly-rise');
    });
  });
  addEventListener('blur', resetWordmarkPointer);
  const jellyImage = new Image();
  jellyImage.onerror = () => root.classList.add('jelly-unavailable');
  jellyImage.src = 'assets/jelly-letters.png';

  const sceneLayers = $$('.creature, .environment-block').map((element, index) => ({
    element, section: element.closest('section'), depth: [1, -.8, .7, -1, .8][index % 5],
  }));
  const experienceRows = $$('.experience-row');
  const sectionLabels = {
    home: 'HELLO, I’M JOEY', work: 'SELECTED WORK', experience: 'EXPERIENCE',
    about: 'ABOUT ME', contact: 'LET’S TALK',
  };
  let currentLocation = '';
  if ('IntersectionObserver' in window && !motion.matches) {
    const creatureObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!entry.target.classList.contains('is-petted')) {
          entry.target.classList.add('is-awake');
          setTimeout(() => entry.target.classList.remove('is-awake'), 700);
        }
        creatureObserver.unobserve(entry.target);
      });
    }, { threshold: .5 });
    $$('.section .creature').forEach(creature => creatureObserver.observe(creature));
  }

  // Content remains visible without JavaScript or with reduced motion.
  const revealElements = $$('.reveal');
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: .06 });
    revealElements.forEach(element => observer.observe(element));
    root.classList.add('js-motion');
  }
  const sectionLinks = $$('.main-nav a, .hotbar a');
  const sectionIds = ['home', 'work', 'experience', 'about', 'contact'];
  let scrollFrame;
  function updateScroll() {
    scrollFrame = 0;
    if (chapterDialog.open) return;
    const range = root.scrollHeight - innerHeight;
    $('.reading-progress').style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
    let current = 'home';
    sectionIds.forEach(id => { if ($(`#${id}`).getBoundingClientRect().top <= innerHeight * .4) current = id; });
    sectionLinks.forEach(link => {
      if (link.getAttribute('href') === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (currentLocation !== current) {
      currentLocation = current;
      $('.hotbar-location').textContent = sectionLabels[current];
      $('.hotbar').dataset.zone = current;
    }
    $$('.hotbar a[data-section]').forEach(link => {
      const bounds = $(`#${link.dataset.section}`).getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * .4 - bounds.top) / Math.max(1, bounds.height)));
      link.style.setProperty('--zone-progress', progress.toFixed(3));
    });
    const heroBounds = $('.hero').getBoundingClientRect();
    const heroDepth = Math.max(0, Math.min(1, -heroBounds.top / Math.max(1, heroBounds.height)));
    wordmarkWorld.style.setProperty('--word-scroll', `${motion.matches ? 0 : Math.min(28, heroDepth * 42).toFixed(2)}px`);
    const ribbon = $('.world-ribbon');
    const ribbonDepth = Math.max(-30, Math.min(30, (innerHeight * .5 - ribbon.getBoundingClientRect().top) * .045));
    ribbon.style.setProperty('--ribbon-shift', `${motion.matches ? 0 : ribbonDepth.toFixed(2)}px`);
    const sectionBounds = new Map();
    sceneLayers.forEach(({ element, section, depth }) => {
      if (!sectionBounds.has(section)) sectionBounds.set(section, section.getBoundingClientRect());
      const bounds = sectionBounds.get(section);
      const limit = innerWidth <= 600 ? 8 : 16;
      const shift = Math.max(-limit, Math.min(limit, (innerHeight * .5 - bounds.top - bounds.height * .5) * .045 * depth));
      element.style.setProperty('--scene-shift', `${motion.matches ? 0 : shift.toFixed(2)}px`);
    });
    let activeRow = null, closestDistance = Infinity;
    experienceRows.forEach(row => {
      const bounds = row.getBoundingClientRect();
      const distance = Math.abs(bounds.top + bounds.height * .5 - innerHeight * .45);
      if (bounds.bottom > innerHeight * .2 && bounds.top < innerHeight * .75 && distance < closestDistance) {
        activeRow = row;
        closestDistance = distance;
      }
    });
    experienceRows.forEach(row => row.classList.toggle('is-current', row === activeRow));
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  updateScroll();

  const intro = $('.world-intro');
  const introTrack = $('.intro-track');
  const introFill = $('.intro-fill');
  const introNumber = $('.intro-number');
  const introBackground = $$('.site-header, main, .site-footer, .hotbar');
  let introFrame, introTimer, introFallback, introActive = false, replaying = false;
  function revealHero() {
    $('.hero').classList.remove('hero-enter');
    requestAnimationFrame(() => $('.hero').classList.add('hero-enter'));
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
    introFill.style.width = '100%';
    introNumber.textContent = '100%';
    revealHero();
    if (immediate) { releaseIntro(); return; }
    root.dataset.intro = 'leaving';
    intro.classList.add('leaving');
    introTimer = setTimeout(releaseIntro, 550);
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
    introFill.style.width = '0%';
    introTrack.setAttribute('aria-valuenow', '0');
    introNumber.textContent = '00%';
    introFallback = setTimeout(() => finishIntro(true), 3500);
    const began = performance.now();
    function tick(now) {
      const fraction = Math.min(1, (now - began) / 1050);
      const value = Math.floor((1 - Math.pow(1 - fraction, 1.4)) * 100);
      introFill.style.width = `${value}%`;
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
      revealElements.forEach(element => element.classList.add('is-revealed'));
      $$('.creature.is-awake').forEach(creature => creature.classList.remove('is-awake'));
    }
    scheduleScroll();
  });
  startIntro();
})();
