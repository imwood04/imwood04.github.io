/* Rotates the hero role line.
   The old CSS version animated `content` inside @keyframes that only ran to
   50%, so it stuck on the last value for half the cycle. This swaps text with
   a fade instead, and stands still entirely when reduced motion is requested. */
(function () {
  'use strict';

  var ROLES = [
    { jp: '開発者',       en: 'developer' },
    { jp: 'ユーチューバー', en: 'YouTuber'  },
    { jp: 'デザイナー',    en: 'designer'  }
  ];

  var host = document.getElementById('role');
  if (!host) return;

  var jp = host.querySelector('.hero__role-jp');
  var en = host.querySelector('.hero__role-en');
  if (!jp || !en) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var i = 0;
  setInterval(function () {
    jp.classList.add('is-fading');
    setTimeout(function () {
      i = (i + 1) % ROLES.length;
      jp.textContent = ROLES[i].jp;
      en.textContent = ROLES[i].en;
      jp.classList.remove('is-fading');
    }, 400);                       // matches the .4s opacity transition
  }, 3200);
})();
