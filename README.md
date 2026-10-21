# Joey Wang — English Portfolio

A separate English version of Joey Wang's portfolio. The current direction uses generous typography, quiet paper surfaces, colorful sculptural keepsakes, and soft elastic interactions, inspired by the supplied style reference. The Chinese version remains at https://joey-wang-ui.github.io/about-me/.

Live site: https://joey-wang-ui.github.io/about-me-en/.

## Preview

From the repository root, run `python3 -m http.server 8000 --bind 127.0.0.1`. Open `http://127.0.0.1:8000/` in your local development browser. No dependency installation, build, keys, or external requests are required.

## Interactions

- Two sticky research tabs, including arrow-key navigation and links from the hero cards; switching mid-read brings the new project title into view.
- Day/night theme, remembered locally for this English version.
- Navigation overlay, keyboard shortcuts **M** and **1–4**, and floating section links.
- Small sculptural ornaments react to clicks or keyboard activation and move gently with scrolling.
- Four glossy jelly letters float naturally and lean toward the pointer. Each opens a chapter: j → work, o → experience, e → about, y → contact. Enter and Space also work.
- Chapters use a split reader on desktop and a native scrolling sheet on mobile. Previous/next controls, Escape, focus restoration, and retained research-tab/email state are supported.
- Scroll interactions include hero parallax, chapter reveals, a current-experience highlight, and a live location/progress display in the floating navigation.
- Email copy, optional entrance replay, and scroll progress.
- Reduced-motion support; content remains readable without JavaScript.

## Content and assets

The English text preserves the Chinese page's research metrics, limitations, internships, and education dates. The USC period is explicitly future study beginning January 2027. Company names use English translations; the third internship title is kept as “Intern”. The original TOEFL value is preserved as written.

`assets/sprites.svg` contains original rounded line icons. `assets/jelly-letters.png` and `assets/jelly-charms.png` are newly generated transparent artwork; no scripts, images, or proprietary font files from the reference site are bundled. `playful.css` defines the current visual direction. Pixelify Sans and Instrument Sans are self-hosted; their SIL Open Font License texts are in `assets/fonts/`.

## Publishing

This repository is a static website: no build step or runtime secrets are needed. GitHub Pages publishes the `main` branch from `/(root)`. The `.nojekyll` file keeps all assets as plain static files.
