/* Accessible menu toggle.
   Replaces the old checkbox hack, which put the control behind
   `visibility: hidden` and so removed it from the tab order entirely. */
(function () {
  'use strict';

  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  var DESKTOP = window.matchMedia('(min-width: 48.0625rem)');

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(!isOpen());
  });

  // Esc closes and hands focus back to the control that opened it.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // A click outside the header dismisses the menu.
  document.addEventListener('click', function (e) {
    if (!isOpen()) return;
    if (!e.target.closest('.masthead')) setOpen(false);
  });

  // Following a link closes it, so the next page doesn't start mid-state.
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // Crossing into the desktop layout resets state, otherwise `is-open`
  // would linger as a stale class on a menu that is always visible.
  DESKTOP.addEventListener('change', function () {
    if (DESKTOP.matches) setOpen(false);
  });
})();
