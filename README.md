# imwood04.github.io

My portfolio — [imwood04.github.io](https://imwood04.github.io)

A static Jekyll site in a 和風 (traditional Japanese print) style: ink on
unbleached paper, vermilion seal, vertical headings. Featured projects come
from `_data/projects.yml`; the rest are pulled live from the GitHub API.

## Running it locally

Needs Ruby (3.x). Jekyll is pinned to the version GitHub Pages runs.

```sh
bundle install
bundle exec jekyll serve --livereload   # http://127.0.0.1:4000
```

GitHub Pages builds the site server-side on push, so the `Gemfile` only
affects local preview.

## Where things live

| Path                      | What                                          |
|---------------------------|-----------------------------------------------|
| `_data/projects.yml`      | Featured work — edit this to change the cards |
| `_data/social.yml`        | Links on the contact page                     |
| `_data/nav.yml`           | Navigation items                              |
| `_layouts/`, `_includes/` | Page shell, header, footer, seal, icons       |
| `assets/css/style.scss`   | All styling; color tokens at the top          |
| `assets/js/repos.js`      | Fetches the remaining repos from GitHub       |

## Notes

- Color tokens are traditional Japanese colors: 墨 ink, 生成り unbleached
  paper, 朱色 vermilion, 松葉色 pine green. The palette inverts for dark mode.
- `assets/css/style.scss` must stay compatible with the **old Ruby Sass**
  that GitHub Pages uses — it evaluates `clamp()` arguments as Sass
  arithmetic, so mixed units need wrapping in `calc()`, and `min()` collides
  with the Sass builtin.
