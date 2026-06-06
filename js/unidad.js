document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const params = new URLSearchParams(window.location.search);
  const unitNum = parseInt(params.get('u'), 10);

  if (!unitNum) {
    mainContent.innerHTML = `<div class="article-page"><p style="color:var(--text-faint);text-align:center;padding:4rem 0;">Unidad no especificada. <a href="temas-unidad.html" style="text-decoration:underline;">Volver a unidades</a></p></div>`;
    return;
  }

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

  function inlineMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  }

  function readingTime(text) {
    const words = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min de lectura`;
  }

  function parseUnit(text, num) {
    const blocks = text.split(/\n-{3,}\n/);

    for (const block of blocks) {
      const titleMatch = block.match(/^#\s+Unidad\s+(\d+)\.\s+(.+)/m);
      if (!titleMatch) continue;
      if (parseInt(titleMatch[1], 10) !== num) continue;

      return {
        num,
        title: titleMatch[2].trim(),
        body: block
      };
    }

    return null;
  }

  function renderUnitBody(markdown) {
    const lines = markdown.split('\n');
    let html = '';
    let inList = false;
    let listType = null;

    function closeList() {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
    }

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (/^#\s+/.test(line)) {
        closeList();
        continue;
      }

      if (/^#{2,3}\s+/.test(line)) {
        closeList();
        const level = line.match(/^(#+)/)[1].length;
        const tag = level === 2 ? 'h2' : 'h3';
        const content = line.replace(/^#+\s+/, '').trim();
        const id = content.toLowerCase()
          .replace(/[¿?:!¡]/g, '')
          .replace(/[^a-z0-9áéíóúüñ\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        html += `<${tag} id="${id}">${inlineMarkdown(content)}</${tag}>\n`;
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
    return html;
  }

  function generateTOC(markdown) {
    const headings = [];
    const lines = markdown.split('\n');
    for (const line of lines) {
      const match = line.match(/^##\s+(.+)/);
      if (match) {
        const content = match[1].trim();
        const id = content.toLowerCase()
          .replace(/[¿?:!¡]/g, '')
          .replace(/[^a-z0-9áéíóúüñ\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        headings.push({ id, content });
      }
    }
    if (!headings.length) return '';
    let toc = '<div class="toc"><div class="toc-title">Contenido</div><ol class="toc-list">';
    headings.forEach(h => {
      toc += `<li><a href="#${h.id}">${h.content}</a></li>`;
    });
    toc += '</ol></div>';
    return toc;
  }

  async function loadAndRender() {
    mainContent.innerHTML = '<div class="page-loader"><div class="loader-spinner"></div></div>';
    try {
      const res = await fetch('content/temas_tutoria.txt');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const unit = parseUnit(text, unitNum);

      if (!unit) {
        mainContent.innerHTML = `<div class="article-page"><p style="color:var(--text-faint);text-align:center;padding:4rem 0;">Unidad no encontrada. <a href="temas-unidad.html" style="text-decoration:underline;">Volver a unidades</a></p></div>`;
        return;
      }

      const bodyHTML = renderUnitBody(unit.body);
      const tocHTML = generateTOC(unit.body);
      const readTime = readingTime(unit.body);

      const unitImages = {
        1: 'politica.jpg',
        2: 'estado.jpg',
        3: 'constitucionalismo.jpeg',
        4: 'democracia.jpg',
        5: 'participacion.jpg'
      };

      const imgSrc = unitImages[unitNum];
      const heroImg = imgSrc
        ? `<div class="article-hero-img reveal"><img src="${imgSrc}" alt="Unidad ${unitNum}"></div>`
        : '';

      mainContent.innerHTML = `
        <div class="article-page">
          <nav class="breadcrumb reveal">
            <a href="index.html">Inicio</a>
            <span class="separator">/</span>
            <a href="temas-unidad.html">Unidades Temáticas</a>
            <span class="separator">/</span>
            <span class="current">Unidad ${unit.num}</span>
          </nav>
          ${heroImg}
          <div class="article-header reveal">
            <h1>Unidad ${unit.num}. ${unit.title}</h1>
            <div class="article-meta">
              <span>${readTime}</span>
            </div>
          </div>
          ${tocHTML}
          <div class="article-body">${bodyHTML}</div>
          <div class="unit-nav-links reveal">
            <a href="temas-unidad.html" class="featured-btn">&larr; Volver a unidades</a>
          </div>
        </div>
      `;

      document.title = `Unidad ${unit.num}. ${unit.title} · Constitución Política`;

      if (window.observeReveals) window.observeReveals();
    } catch (err) {
      mainContent.innerHTML = `<div class="article-page"><p style="color:var(--text-faint);text-align:center;padding:4rem 0;">Error: ${err.message}</p></div>`;
    }
  }

  loadAndRender();
});
