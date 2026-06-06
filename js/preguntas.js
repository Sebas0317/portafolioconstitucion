/* ============================================
   Preguntas Generadoras - page script
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // ─── Progress bar ────────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.id = 'progress-bar';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  });

  // ─── Inline markdown ─────────────────────────────
  function inlineMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  }

  // ─── Estimate reading time ───────────────────────
  function readingTime(text) {
    const words = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min de lectura`;
  }

  // ─── Parse markdown → question cards ─────────────
  function parseMarkdown(text) {
    const lines = text.split('\n');
    let html = '';
    let inList = false;
    let listType = null;
    let inCard = false;

    function closeList() {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
    }

    function closeCard() {
      if (inCard) {
        html += '</div>\n';
        inCard = false;
      }
    }

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (/^-{3,}$/.test(line.trim())) {
        closeList();
        continue;
      }

      if (/^#{1,2}\s+/.test(line)) {
        closeList();
        closeCard();
        const content = line.replace(/^#{1,2}\s+/, '').trim();
        const id = content.toLowerCase()
          .replace(/[¿?:!¡]/g, '')
          .replace(/[^a-z0-9áéíóúüñ\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        html += `<div class="question-card reveal">\n`;
        html += `<h2 id="${id}">${inlineMarkdown(content)}</h2>\n`;
        inCard = true;
        continue;
      }

      if (/^\*\*.+\*\*$/.test(line.trim())) {
        closeList();
        const content = line.replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
        html += `<h3>${inlineMarkdown(content)}</h3>\n`;
        continue;
      }

      const ulMatch = line.match(/^-\s+(.+)/);
      const olMatch = line.match(/^\d+[.)]\s+(.+)/);
      if (ulMatch) {
        if (!inList || listType !== 'ul') {
          closeList();
          inList = true;
          listType = 'ul';
          html += '<ul>\n';
        }
        html += `  <li>${inlineMarkdown(ulMatch[1])}</li>\n`;
        continue;
      } else if (olMatch) {
        if (!inList || listType !== 'ol') {
          closeList();
          inList = true;
          listType = 'ol';
          html += '<ol>\n';
        }
        html += `  <li>${inlineMarkdown(olMatch[1])}</li>\n`;
        continue;
      }

      closeList();
      if (line.trim() === '') continue;
      html += `<p>${inlineMarkdown(line.trim())}</p>\n`;
    }

    closeList();
    closeCard();
    return html;
  }

  // ─── Generate TOC ───────────────────────────────
  function generateTOC(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const headings = temp.querySelectorAll('.question-card h2');
    if (!headings.length) return '';

    let toc = '<div class="toc"><div class="toc-title">Contenido</div><ol class="toc-list">';
    headings.forEach((h) => {
      if (h.id) toc += `<li><a href="#${h.id}">${h.textContent}</a></li>`;
    });
    toc += '</ol></div>';
    return toc;
  }

  function setupTOCHighlight() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const headings = document.querySelectorAll('.question-card h2');
    if (!tocLinks.length || !headings.length) return;

    const observer = new IntersectionObserver((entries) => {
      let activeId = null;
      entries.forEach(entry => {
        if (entry.isIntersecting) activeId = entry.target.id;
      });
      if (activeId) {
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
        });
      }
    }, { rootMargin: '-80px 0px -60% 0px' });

    headings.forEach(h => observer.observe(h));
  }

  // ─── Load & render ──────────────────────────────
  async function loadAndRender() {
    mainContent.innerHTML = '<div class="page-loader"><div class="loader-spinner"></div></div>';
    try {
      const res = await fetch('content/preguntas_generadoras.txt');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const bodyHTML = parseMarkdown(text);
      const tocHTML = generateTOC(bodyHTML);
      const readTime = readingTime(text);

      mainContent.innerHTML = `
        <div class="article-page">
          <nav class="breadcrumb reveal">
            <a href="index.html">Inicio</a>
            <span class="separator">/</span>
            <span class="current">Preguntas Generadoras</span>
          </nav>
          <div class="article-header reveal">
            <h1>Preguntas Generadoras</h1>
            <div class="article-meta">
              <span>Febrero 2026</span>
              <span>5 preguntas</span>
              <span>${readTime}</span>
            </div>
          </div>
          ${tocHTML}
          <div class="article-body">${bodyHTML}</div>
        </div>`;

      if (window.observeReveals) window.observeReveals();
      setupTOCHighlight();
    } catch (err) {
      mainContent.innerHTML = `<div class="article-page"><p style="color:var(--text-faint);text-align:center;padding:4rem 0;">Error: ${err.message}</p></div>`;
    }
  }

  loadAndRender();
});
