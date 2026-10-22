# Joey Wang — English Portfolio

A separate English version of Joey Wang's portfolio. The current direction uses generous typography, quiet paper surfaces, colorful sculptural keepsakes, and soft elastic interactions, inspired by the supplied style reference. The Chinese version remains at https://joey-wang-ui.github.io/about-me/.

GitHub Pages URL (available after enabling Pages): https://joey-wang-ui.github.io/about-me-en/.

## Preview

From the repository root, run `python3 -m http.server 8000 --bind 127.0.0.1`. Open `http://127.0.0.1:8000/` in your local development browser. No dependency installation, build, keys, or external requests are required.

## Interactions

- A compact landing page keeps the focus on four jelly letters and a short introduction. Detailed content appears in its chapter reader rather than repeating below the homepage.
- **J → Journey:** education, toolkit, milestones, and interests. **o → Outcomes:** two research projects. **e → Experience:** internships. **y → You & me:** contact and email.
- Letters drift gently at rest. Hovering stretches, squashes, and bends each whole letter, including its texture and highlights, using a spring-driven WebGL mesh. Hold and pull for a larger deformation; release to spring back. A drag does not open a chapter, while a normal click does. The clickable link areas remain stable. A whole-letter CSS fallback keeps interaction usable when WebGL is unavailable.
- Chapters use a split reader on desktop and a native scrolling sheet on mobile. Previous/next controls, Escape, focus restoration, and retained research-tab/email state are supported.
- Header links, Enter, Space, and shortcuts **1–4** open the same four chapters. URLs `#about`, `#work`, `#experience`, and `#contact` open a chapter directly.
- The two research tabs support arrow keys, Home, and End; switching mid-read returns to the new project title.
- Day/night theme, email copy, and optional entrance replay. The jelly letters spread from a shared center into their shallow arch, followed by the chapter captions.
- Reduced-motion support. Without JavaScript, all chapter content remains readable below the landing page and letter links scroll to it.

## Content and assets

The English text preserves the Chinese page's research metrics, limitations, internships, and education dates. The USC period is explicitly future study beginning January 2027. Company names use English translations; the third internship title is kept as “Intern”. The original TOEFL value is preserved as written.

`assets/sprites.svg` contains original rounded line icons. `assets/jelly-letters.png`, `assets/jelly-j-uppercase.png`, and `assets/jelly-charms.png` are newly generated transparent artwork; no scripts, images, or proprietary font files from the reference site are bundled. `playful.css` defines the materials and typography; `landing.css` defines the compact homepage and pointer-contact states; `jelly.js` handles the whole-letter texture mesh and elastic pointer/drag behavior. Nunito is used for the landing page and playful headings; Instrument Sans gives chapter copy a clean, regular-weight reading style. These fonts and the earlier Pixelify Sans assets are self-hosted; their SIL Open Font License texts are in `assets/fonts/`.

## Publishing

This repository is a static website: no build step or runtime secrets are needed.

One-time setup: open [Settings → Pages](https://github.com/Joey-wang-ui/about-me-en/settings/pages), select **Deploy from a branch**, choose **main** and **/(root)**, then click **Save**. After GitHub finishes the first Pages build, the URL above becomes available.

Subsequent pushes to `main` republish automatically. The `.nojekyll` file keeps all assets as plain static files.
