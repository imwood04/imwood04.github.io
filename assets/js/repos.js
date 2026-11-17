/* Pulls the rest of the public repos from the GitHub API.
   Unauthenticated requests are capped at 60/hour per IP, so results are
   cached for the session. Every failure path — rate limit, offline, empty
   account — resolves to a plain link rather than an empty hole. */
(function () {
  'use strict';

  var script = document.currentScript ||
    document.querySelector('script[src*="repos.js"]');
  var mount = document.getElementById('repos');
  if (!mount || !script) return;

  var user = script.dataset.user || 'imwood04';
  var featured = (script.dataset.featured || '')
    .split(',')
    .map(function (s) { return s.trim().toLowerCase(); })
    .filter(Boolean);

  var CACHE_KEY = 'gh-repos:' + user;
  var CACHE_TTL = 60 * 60 * 1000; // 1h, matching the rate-limit window
  var API = 'https://api.github.com/users/' + encodeURIComponent(user) +
            '/repos?sort=updated&per_page=100';
  var PROFILE_URL = 'https://github.com/' + user;

  function fallback(message) {
    mount.innerHTML = '';
    var p = document.createElement('p');
    p.className = 'repos-status';
    if (message) p.append(message + ' ');
    var a = document.createElement('a');
    a.href = PROFILE_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'View all repositories on GitHub →';
    p.append(a);
    mount.append(p);
  }

  function esc(v) { return v == null ? '' : String(v); }

  function render(repos) {
    if (!repos.length) {
      fallback('Nothing else public right now.');
      return;
    }

    var list = document.createElement('ul');
    list.className = 'repos';

    repos.forEach(function (r) {
      var li = document.createElement('li');
      li.className = 'repos__item';

      var a = document.createElement('a');
      a.className = 'repos__link';
      a.href = r.html_url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      var name = document.createElement('span');
      name.className = 'repos__name';
      name.textContent = r.name;
      a.append(name);

      if (r.description) {
        var desc = document.createElement('span');
        desc.className = 'repos__desc';
        desc.textContent = r.description;
        a.append(desc);
      }

      var meta = document.createElement('span');
      meta.className = 'repos__meta';

      if (r.language) {
        var lang = document.createElement('span');
        lang.className = 'tag tag--lang';
        lang.setAttribute('data-lang', r.language);
        lang.textContent = r.language;
        meta.append(lang);
      }
      if (r.stargazers_count > 0) {
        var stars = document.createElement('span');
        stars.className = 'tag';
        stars.textContent = '★ ' + r.stargazers_count;
        meta.append(stars);
      }
      if (r.updated_at) {
        var when = document.createElement('span');
        when.className = 'tag';
        when.textContent = esc(r.updated_at).slice(0, 7);
        meta.append(when);
      }
      a.append(meta);

      li.append(a);
      list.append(li);
    });

    mount.innerHTML = '';
    mount.append(list);

    var more = document.createElement('p');
    more.className = 'repos-status';
    more.style.marginTop = '1.5rem';
    var link = document.createElement('a');
    link.href = PROFILE_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'All repositories on GitHub →';
    more.append(link);
    mount.append(more);
  }

  function clean(raw) {
    return raw
      .filter(function (r) {
        return !r.fork &&
               !r.archived &&
               r.name.toLowerCase() !== user.toLowerCase() &&   // profile README repo
               featured.indexOf(r.name.toLowerCase()) === -1;   // already featured above
      })
      .map(function (r) {
        return {
          name: r.name,
          html_url: r.html_url,
          description: r.description,
          language: r.language,
          stargazers_count: r.stargazers_count,
          updated_at: r.updated_at
        };
      });
  }

  function readCache() {
    try {
      var hit = JSON.parse(sessionStorage.getItem(CACHE_KEY));
      if (hit && Date.now() - hit.at < CACHE_TTL) return hit.data;
    } catch (e) { /* private mode, blocked storage, bad JSON — just refetch */ }
    return null;
  }

  function writeCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: data }));
    } catch (e) { /* non-fatal */ }
  }

  var cached = readCache();
  if (cached) { render(cached); return; }

  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (res) {
      if (res.status === 403) throw new Error('rate-limited');
      if (!res.ok) throw new Error('http ' + res.status);
      return res.json();
    })
    .then(function (raw) {
      if (!Array.isArray(raw)) throw new Error('unexpected payload');
      var repos = clean(raw);
      writeCache(repos);
      render(repos);
    })
    .catch(function (err) {
      fallback(err.message === 'rate-limited'
        ? 'GitHub is rate-limiting this address.'
        : "Couldn't reach GitHub just now.");
    });
})();
