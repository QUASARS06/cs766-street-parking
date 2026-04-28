# CS 766 Project Website &mdash; Street Parking Presence Inference

Static website for the CS 766 (Computer Vision) project **"Street Parking Presence Inference from Street-Level Imagery via Multi-Cue Detection and Geo-Aggregation"** by Chirag Jain and Ritik Singh, University of Wisconsin&ndash;Madison.

The site mirrors the structure of the final report and includes the proposal, midterm report, and final report PDFs as embedded viewers.

---

## Quick start &mdash; preview locally

There is no build step. Serve the folder with any static server:

```bash
# from inside this `website/` directory
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

> Tip: opening `index.html` directly with `file://` works for most things, but the embedded PDFs render more reliably when served over HTTP.

---

## Deploy to GitHub Pages

This site is plain HTML/CSS/JS &mdash; nothing to compile, nothing to install. The `.nojekyll` file disables GitHub's default Jekyll processing, which is what we want.

### Option A &mdash; deploy from a `docs/` folder on `main`

1. Create a new GitHub repo (e.g. `cs766-street-parking-website`).
2. Copy the entire **contents** of this `website/` folder into a `docs/` folder at the repo root.
3. Commit and push to `main`.
4. In the GitHub repo, go to **Settings &rarr; Pages**.
5. Under **Source**, choose **Deploy from a branch**, then pick **Branch: `main` / Folder: `/docs`**.
6. Wait ~1 minute. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Option B &mdash; deploy from the repo root

1. Create a new GitHub repo.
2. Copy the **contents** of this `website/` folder directly to the repo root (so `index.html` sits at the top).
3. Push to `main`.
4. **Settings &rarr; Pages &rarr; Source: `main` / Folder: `/ (root)`**.

### Option C &mdash; user/organization site

If the repo is named `<your-username>.github.io`, GitHub publishes it at `https://<your-username>.github.io/`. Same instructions as Option B.

---

## Where to plug in your code repository link

Once your separate GitHub repo for the source code is up, edit **`code.html`**. Search for `TODO` &mdash; there are four `href="#"` placeholders to fill in:

| Placeholder (`id`) | Replace with |
|---|---|
| `repo-link` | The repository home page, e.g. `https://github.com/<user>/<repo>` |
| `src-zip` | A release ZIP, e.g. `https://github.com/<user>/<repo>/archive/refs/tags/v1.0.zip` |
| `sign-weights` | Release-asset URL for the parking-sign YOLO weights |
| `curb-weights` | Release-asset URL for the curb U-Net weights |
| `manual-data` | Release-asset URL for the 30-image manual-segment bundle |

You can also remove any of these cards if they aren't relevant.

---

## Editing the content

Each page is an independent HTML file at the root:

| File | Purpose |
|---|---|
| `index.html` | Home / overview &mdash; abstract, key results, navigation cards |
| `motivation.html` | Motivation &mdash; problem statement, prior work, framing |
| `approach.html` | Datasets, label mapping, methodology, aggregation rule |
| `results.html` | Four parts: quantitative tables &rarr; validation plots &rarr; qualitative findings &rarr; annotated real-world segments |
| `challenges.html` | Practical challenges and limitations |
| `conclusion.html` | Wrap-up summary, key takeaways, future work (incl. VLMs) |
| `documents.html` | Embedded PDFs (proposal, midterm, final) with tabs |
| `code.html` | Links to the GitHub repository and downloadable artifacts |
| `404.html` | Custom not-found page |

The shared **navigation bar** is duplicated in each page (no template engine). When you add a new page or rename one, update the `<ul class="nav-links">` block at the top of every HTML file. Same for the shared **footer** at the bottom.

The shared styling is in `assets/css/styles.css`. Page-specific tweaks (e.g. the document tab styling) sit in `<style>` blocks in those individual pages.

The image lightbox and mobile nav toggle live in `assets/js/main.js`.

---

## Folder structure

```
website/
├── index.html
├── motivation.html
├── approach.html
├── results.html
├── challenges.html
├── conclusion.html
├── documents.html
├── code.html
├── 404.html
├── .nojekyll                     # disables Jekyll on GitHub Pages
├── README.md                     # this file
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── main.js
    ├── images/                   # all figures from the final report
    │   ├── full_training_curves.png
    │   ├── BoxPR_curve.png
    │   ├── ... (etc.)
    │   └── figures/              # the 5-view annotated manual segments
    │       ├── seg_001_img_0_annotated.jpg
    │       └── ...
    └── pdfs/
        ├── cs766_project_proposal.pdf
        ├── cs766_midterm_report.pdf
        └── cs766_report_final.pdf
```

---

## Adding new figures or sections

1. Drop the image into `assets/images/` (or `assets/images/figures/`).
2. Reference it from a `<figure class="figure">` block:
   ```html
   <figure class="figure">
     <img class="figure-zoom" src="assets/images/your_figure.png" alt="Short description" loading="lazy" />
     <figcaption class="figure-caption">Caption text.</figcaption>
   </figure>
   ```
3. Adding `class="figure-zoom"` to the `<img>` makes it click-to-enlarge in a lightbox.
4. For multi-image grids, use `<div class="figure-grid cols-2">` (or `cols-3`, `cols-5`).

### Slideshow groups

Images that share the same `data-gallery` attribute behave as a single slideshow when opened in the lightbox &mdash; the user can step through them with the on-screen prev/next buttons or the arrow keys.

```html
<figure class="figure">
  <img class="figure-zoom" data-gallery="seg_007"
       data-caption="seg_007 view 0 — meter detector fires"
       src="assets/images/figures/seg_007_img_0_annotated.jpg"
       alt="seg_007 view 0" loading="lazy" />
  <figcaption class="figure-caption">View 0</figcaption>
</figure>
```

Use the same `data-gallery` value on every image you want to be in the same slideshow group. `data-caption` is optional; it shows in the lightbox under the image.

### Cue badges

Approach and Results pages tag each subsection with a small badge so a casual reader can see at a glance whether a section is about parking signs, meters, curb, or aggregation. Use it in any heading:

```html
<h3>My new analysis <span class="cue-tag cue-sign">Sign</span></h3>
<h3>Another section <span class="cue-tag cue-meter">Meter</span></h3>
<h3>Yet another     <span class="cue-tag cue-curb">Curb</span></h3>
<h3>System-level    <span class="cue-tag cue-aggregation">Aggregation</span></h3>
<h3>Spans cues      <span class="cue-tag cue-all">All cues</span></h3>
```

For new tables, wrap them in `<div class="table-wrap">` so they scroll horizontally on small screens. Add a `<p class="table-caption">` underneath.

For callouts, use `<div class="callout">` (default), `callout-success`, `callout-warn`, or `callout-note`.

---

## Favicon

Drop your icon files into the **`assets/`** folder. The pages already reference these paths:

| Path | Purpose | Recommended size |
|---|---|---|
| `assets/favicon.png` | Main favicon (works in every browser) | **32×32 PNG** |
| `assets/favicon.svg` | Crisp scalable favicon for modern browsers (optional) | any SVG |
| `assets/apple-touch-icon.png` | Home-screen icon on iOS / iPadOS (optional) | 180×180 PNG |

You don't need to add all three &mdash; if a file is missing the browser just falls back to the next one. **A single `assets/favicon.png` at 32×32 is enough.** If that's all you provide, you can ignore the other two and the 404s in the network tab are harmless.

If you want to use an `.ico` file instead, name it `assets/favicon.ico` and update the `<link rel="icon">` lines in each HTML page (search for `favicon` to find them).

## Notes on file size

Some figures from the report are large (e.g. `img_2_casa.jpg` ~6.7 MB, `img_6_state_st_*.jpg` ~9 MB each). GitHub Pages serves them fine (1 GB soft repo limit, 100 MB per file), but if you want a faster load:

- Run them through `cwebp -q 85` or `tinypng` and update the `<img src>` references.
- Or resize the originals to ~1600 px wide for web use.

The PDFs (~32 MB and ~42 MB for the midterm and final) are fine for browser download but a little heavy for the embedded `<iframe>` viewer on slow connections. If that becomes a problem, swap the iframe for a static preview image plus a download button.

---

## Built without a framework

No build step, no `npm install`, no transpilation. Just static HTML, hand-written CSS, and a tiny bit of vanilla JavaScript for the mobile menu, image lightbox, and the document-tabs page. KaTeX is loaded from a CDN on the Approach page for the one display-mode formula.

If you later want to switch to a static-site generator (Jekyll, Hugo, Astro, etc.) the content is plain HTML and migrates cleanly.
