/* A soft pointer glow, shared by the homepage and the native chapter dialog. */
(() => {
  'use strict';
  const root = document.documentElement;
  const finePointer = matchMedia('(any-pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const layer = document.createElement('div');
  layer.className = 'cursor-layer';
  layer.setAttribute('aria-hidden', 'true');
  const glow = document.createElement('div');
  glow.className = 'soft-cursor';
  layer.append(glow);
  document.body.append(layer);

  let x = 0, y = 0, drawX = 0, drawY = 0, frame = 0, lastPaint = 0;
  let velocityX = 0, velocityY = 0;
  let hasPosition = false, inside = false, visible = false;
  function updateHover(target) {
    const interactive = target instanceof Element && target.closest('a,button,[role="button"],input,select,textarea');
    glow.classList.toggle('is-hovering', !!interactive);
  }
  function render() {
    glow.style.transform = `translate3d(${drawX}px,${drawY}px,0)`;
  }
  function paint(now) {
    frame = 0;
    if (!visible) return;
    const dt = Math.min(64, Math.max(1, now - lastPaint)) / 1000;
    lastPaint = now;
    if (reducedMotion.matches) {
      drawX = x; drawY = y;
      velocityX = velocityY = 0;
    } else {
      // A critically damped spring carries velocity through starts and turns.
      // Its exact step stays smooth across refresh rates, without distance snaps.
      const frequency = 34;
      const decay = Math.exp(-frequency * dt);
      const offsetX = drawX - x, offsetY = drawY - y;
      const carryX = velocityX + frequency * offsetX;
      const carryY = velocityY + frequency * offsetY;
      drawX = x + (offsetX + carryX * dt) * decay;
      drawY = y + (offsetY + carryY * dt) * decay;
      velocityX = (velocityX - frequency * carryX * dt) * decay;
      velocityY = (velocityY - frequency * carryY * dt) * decay;
    }
    const settled = Math.hypot(x - drawX, y - drawY) < .1 && Math.hypot(velocityX, velocityY) < 2;
    if (settled) { drawX = x; drawY = y; velocityX = velocityY = 0; }
    render();
    if (!settled) frame = requestAnimationFrame(paint);
  }
  function requestPaint() {
    if (!frame) {
      lastPaint = performance.now();
      frame = requestAnimationFrame(paint);
    }
  }
  function hide(releaseNative = false) {
    visible = false;
    cancelAnimationFrame(frame);
    frame = 0;
    layer.classList.remove('is-visible');
    glow.classList.remove('is-pressed', 'is-hovering');
    if (releaseNative) root.classList.remove('has-glow-cursor');
  }
  function show() {
    if (!finePointer.matches || !hasPosition || document.hidden) return;
    if (!visible) { drawX = x; drawY = y; velocityX = velocityY = 0; render(); }
    visible = true;
    root.classList.add('has-glow-cursor');
    layer.classList.add('is-visible');
  }
  function syncContainer() {
    // A normal z-index cannot draw above showModal(); keep the glow in its layer.
    const dialogs = [...document.querySelectorAll('dialog[open]')];
    const parent = dialogs.at(-1) || document.body;
    if (layer.parentElement !== parent) parent.append(layer);
  }
  const observer = new MutationObserver(syncContainer);
  document.querySelectorAll('dialog').forEach(dialog => {
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  syncContainer();

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches) {
      hide(true);
      return;
    }
    x = event.clientX;
    y = event.clientY;
    hasPosition = inside = true;
    updateHover(event.target);
    show();
    requestPaint();
  }, { passive: true, capture: true });
  document.addEventListener('pointerover', event => {
    if (event.pointerType === 'mouse' && visible) updateHover(event.target);
  }, { passive: true, capture: true });
  root.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') {
      inside = false;
      hide();
    }
  }, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches) { hide(true); return; }
    x = event.clientX;
    y = event.clientY;
    hasPosition = inside = true;
    updateHover(event.target);
    show();
    glow.classList.add('is-pressed');
    requestPaint();
  }, { passive: true, capture: true });
  function release() {
    glow.classList.remove('is-pressed');
    if (visible) updateHover(document.elementFromPoint(x, y));
  }
  document.addEventListener('pointerup', release, { passive: true, capture: true });
  document.addEventListener('pointercancel', release, { passive: true, capture: true });
  document.addEventListener('keydown', event => { if (event.key === 'Tab') hide(); });
  addEventListener('blur', () => hide());
  addEventListener('focus', () => { if (inside) { show(); updateHover(document.elementFromPoint(x, y)); } });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
    else if (inside) show();
  });
  finePointer.addEventListener('change', () => {
    if (!finePointer.matches) hide(true);
  });
  reducedMotion.addEventListener('change', () => {
    if (visible) requestPaint();
  });
})();
