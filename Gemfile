source "https://rubygems.org"

# Local preview only. GitHub Pages builds this site server-side with its own
# pinned gem set, so this file never affects the live build.
#
# Jekyll is pinned to 3.10.x because that is what GitHub Pages currently runs
# (github-pages 233). The `github-pages` meta-gem itself is deliberately NOT
# used here: it depends on jekyll-remote-theme -> openssl, whose native
# extension does not build on Windows.
gem "jekyll", "~> 3.10.0"
gem "jekyll-redirect-from", "~> 0.16.0"

# GitHub Pages renders Markdown with GFM; without this, Jekyll 3 cannot build.
gem "kramdown-parser-gfm", "~> 1.1"

# Jekyll 3.x serve needs this explicitly on Ruby 3.x
gem "webrick", "~> 1.8"

# Leaving the standard library on Ruby 3.4+; pinned so the build stays quiet.
gem "base64"
gem "bigdecimal"
gem "csv"

# Windows / JRuby timezone data
gem "tzinfo", "~> 1.2"
gem "tzinfo-data", platforms: [:windows, :jruby]
