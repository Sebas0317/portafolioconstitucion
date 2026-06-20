# Political Constitution — Academic Portfolio

An interactive static site documenting the *Political Constitution of Colombia* course at Universidad del Tolima IDEAD. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

## Project Structure

```
Blog/
├── index.html                    # Home page (hero, featured articles, "Sabías que...")
├── preguntas-generadoras.html    # Generator questions page
├── temas-unidad.html             # Thematic units overview
├── unidad.html                   # Individual unit detail (?u=1..5)
├── assets/                       # Images (moved from root)
│   ├── ut.png
│   ├── politica.jpg
│   ├── estado.jpg
│   ├── constitucionalismo.jpeg
│   ├── democracia.jpg
│   └── participacion.jpg
├── content/                      # Markdown-like content files
│   ├── preguntas_generadoras.txt
│   ├── sabias.txt
│   └── temas_tutoria.txt
├── css/
│   └── style.css                 # 1690 lines of responsive CSS with dark/light themes
├── js/
│   ├── layout.js                 # Shared sidebar, footer, mobile nav, scroll reveal, lightbox
│   ├── theme.js                  # Dark/light mode toggle (localStorage)
│   ├── home.js                   # Home page hero + "Sabías que..." renderer
│   ├── preguntas.js              # Generator questions parser + TOC + progress bar
│   ├── temas-unidad.js           # Unit cards grid (fetches & parses content/temas_tutoria.txt)
│   └── unidad.js                 # Single unit detail page with TOC, anchor links, progress bar
├── .gitignore
└── README.md
```

## Problems Found & Solutions

### 1. Unorganized assets
**Problem:** All images (`ut.png`, `politica.jpg`, `estado.jpg`, etc.) lived in the project root, cluttering the directory. An `assets/` folder existed but was completely empty.

**Solution:** Moved all image files into `assets/` and updated every `src` reference across the 4 HTML files and 2 JS files (`home.js`, `temas-unidad.js`, `unidad.js`). The directory is now properly organized.

### 2. No project documentation
**Problem:** The repository had no README, making it hard for anyone (including the author) to understand the project structure, purpose, or how to run it.

**Solution:** Created this README documenting architecture, setup, and design decisions.

### 3. Messy `.gitignore`
**Problem:** Contained a stale `GEMINI.md` entry left over from the AI-assisted development process, with no comments explaining what the entries were for.

**Solution:** Cleaned up the file, removed the transient entry, and added section comments for clarity.

### 4. Duplicate HTML boilerplate
**Problem:** All 4 HTML pages share nearly identical `<head>`, `<header>`, `<footer>`, theme toggle, and navigation markup. Any change (e.g., adding a nav link) requires editing all 4 files.

**Solution:** This is a known trade-off for a zero-dependency static site. We kept the duplication in favor of simplicity — no build tools, no templates, no server-side includes. The JS files handle all dynamic content, so structural changes remain manageable.

### 5. Hardcoded image paths in multiple locations
**Problem:** Image paths were duplicated across JS files (`temas-unidad.js` and `unidad.js` both had the same `unitImages` map).

**Solution:** Both files now reference the correct `assets/` paths. This duplication is minimal (5 entries × 2 files) and acceptable for a project this size.

## Features

- **Dark/light theme** with system preference detection via `localStorage`
- **Responsive design** — mobile nav toggle, fluid grids, no external CSS framework
- **Scroll reveal** — IntersectionObserver-based fade-in animations
- **Reading progress bar** — sticky bar at the top of article pages
- **Table of Contents** — auto-generated from markdown headings with active-section highlighting
- **Anchor links** — click the `#` next to any heading to copy a direct link
- **Lightbox** — click unit images to view full-screen
- **Back to top** — floating button appears after scrolling down

## How to Use

No build step is required. Open any `.html` file directly in a browser, or serve the directory with any static file server:

```bash
npx serve .
# or
python -m http.server 8080
```

The content lives in `content/*.txt` files using a simple markdown-like format. Edit those to update the course material without touching HTML or JS.

## Tech Stack

- **HTML5** — semantic markup with `picture`-free images
- **CSS3** — CSS custom properties (theming), Grid, Flexbox, IntersectionObserver, `content-visibility`
- **Vanilla JS (ES6+)** — `fetch`, `async/await`, `IntersectionObserver`, `MutationObserver`, `localStorage`
- **Google Fonts** — Inter (loaded with `preconnect` + `preload` + `media="print"` non-blocking pattern)
