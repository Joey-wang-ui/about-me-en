/* A compact jelly arrow, shared by the homepage and chapter reader. */
(() => {
  'use strict';
  const root = document.documentElement;
  const finePointer = matchMedia('(any-pointer: fine)');
  function updatePointer(event) {
    root.classList.toggle('has-jelly-cursor', finePointer.matches && event.pointerType === 'mouse');
  }
  document.addEventListener('pointermove', updatePointer, { passive: true, capture: true });
  document.addEventListener('pointerdown', updatePointer, { passive: true, capture: true });
  finePointer.addEventListener('change', () => {
    if (!finePointer.matches) root.classList.remove('has-jelly-cursor');
  });
})();
