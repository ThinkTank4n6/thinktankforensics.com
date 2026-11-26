# thinktankforensics.com

Source for https://thinktankforensics.com, hosted on GitHub Pages.

- `index.html` – the whole site (no build step)
- `CNAME` – tells GitHub Pages to serve the custom domain
- `dfir.html`, `home.html` (category pages), `site.css`, `site.js` (shared style and project list), `404.html`, `logo.jpg`, `og.jpg` (link preview), `emblem.png`, `favicon-32.png`, `apple-touch-icon.png`

To add a project, add an entry to the `projects` array at the top of `site.js` with `kind: "DFIR"` or `kind: "Home"`.
The "Download latest" button pulls the newest GitHub Release automatically.

© 2026 Christopher A. Tankelewicz (ThinkTank4n6)
