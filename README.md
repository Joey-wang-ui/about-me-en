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
- In-page English/Chinese switching covers the homepage, all chapter copy, accessible labels, and dynamic feedback. The selection is remembered locally; `?lang=zh` and `?lang=en` also select a language. Each chapter has its own language button, and switching retains open chapters and research tabs. The Chinese switch stays on this website.
- Day/night theme, email copy, LinkedIn links in the footer and contact chapter, and optional entrance replay. The jelly letters spread from a shared center into their shallow arch, followed by the chapter captions.
- Reduced-motion support. Without JavaScript, all chapter content remains readable below the landing page and letter links scroll to it.

## Content and assets

Research metrics, limitations, and the third internship preserve the original portfolio content. Education degrees and dates, plus the first two internship titles, dates, locations, and descriptions, follow the latest LinkedIn screenshots supplied by Joey. USC is listed as September 2026–June 2028; XJTLU as September 2022–July 2026. Company names use English translations; the third internship title is kept as “Intern”. The original TOEFL value is preserved as written.

University marks are self-hosted under `assets/schools/`, with sources recorded in that directory. `i18n.js` contains local bilingual copy and updates text and accessible labels without replacing interactive elements. `assets/sprites.svg` contains original rounded line icons. `assets/jelly-letters.png`, `assets/jelly-j-uppercase.png`, and `assets/jelly-charms.png` are newly generated transparent artwork; no scripts or images from the reference site are bundled. `playful.css` defines the materials and typography; `landing.css` defines the compact homepage and pointer-contact states; `jelly.js` handles the whole-letter texture mesh and elastic pointer/drag behavior. Nunito is used for the landing page and playful headings; Agrandir Regular gives chapter copy the typeface used by the supplied reference. Font provenance is recorded in `assets/fonts/agrandir-SOURCE.txt`. The fonts are self-hosted. The Nunito, Instrument Sans, and Pixelify Sans SIL Open Font License texts are in `assets/fonts/`; Agrandir retains its original copyright information.

## Publishing

This repository is a static website: no build step or runtime secrets are needed.

One-time setup: open [Settings → Pages](https://github.com/Joey-wang-ui/about-me-en/settings/pages), select **Deploy from a branch**, choose **main** and **/(root)**, then click **Save**. After GitHub finishes the first Pages build, the URL above becomes available.

Subsequent pushes to `main` republish automatically. The `.nojekyll` file keeps all assets as plain static files.
