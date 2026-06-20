document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const unitImages = {
    1: 'assets/politica.jpg',
    2: 'assets/estado.jpg',
    3: 'assets/constitucionalismo.jpeg',
    4: 'assets/democracia.jpg',
    5: 'assets/participacion.jpg'
  };

  function inlineMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  }

  function parseUnits(text) {
    const blocks = text.split(/\n-{3,}\n/);
    const units = [];

    for (const block of blocks) {
      const titleMatch = block.match(/^#\s+Unidad\s+(\d+)\.\s+(.+)/m);
      if (!titleMatch) continue;

      const num = parseInt(titleMatch[1], 10);
      const title = titleMatch[2].trim();

      const introMatch = block.match(/^##\s+Introducción\s*\n([^#]+)/m);
      const overview = introMatch
        ? introMatch[1].trim().split('\n')[0].trim()
        : '';

      const conceptsMatch = block.match(/^##\s+Conceptos clave\s*\n([^#]+)/m);
      const concepts = conceptsMatch
        ? conceptsMatch[1].trim().split('\n').map(l => l.replace(/^\*\s+/, '').trim()).filter(Boolean)
        : [];

      units.push({ num, title, overview, concepts });
    }

    return units;
  }

  async function loadAndRender() {
    mainContent.innerHTML = '<div class="page-loader"><div class="loader-spinner"></div></div>';
    try {
      const res = await fetch('content/temas_tutoria.txt');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const units = parseUnits(text);

      let html = `
        <div class="article-page">
          <nav class="breadcrumb reveal">
            <a href="index.html">Inicio</a>
            <span class="separator">/</span>
            <span class="current">Unidades Temáticas</span>
          </nav>
          <div class="article-header reveal">
            <h1>Unidades Temáticas</h1>
            <div class="article-meta">
              <span>${units.length} unidades</span>
              <span>Constitución Política</span>
            </div>
          </div>
          <div class="units-grid">
      `;

      units.forEach((unit, i) => {
        const delay = (i % 3) * 0.1;
        const conceptsList = unit.concepts
          .slice(0, 4)
          .map(c => `<li>${inlineMarkdown(c)}</li>`)
          .join('');

        const imgSrc = unitImages[unit.num];
        const imgHtml = imgSrc
          ? `<img src="${imgSrc}" alt="Unidad ${unit.num}" loading="lazy">`
          : `<div class="unit-image-placeholder"><span class="unit-num-badge">Unidad ${unit.num}</span></div>`;

        html += `
          <div class="unit-card reveal" style="transition-delay:${delay}s">
            <div class="unit-image">${imgHtml}</div>
            <div class="unit-body">
              <h3>${inlineMarkdown(unit.title)}</h3>
              <p class="unit-overview">${inlineMarkdown(unit.overview)}</p>
              ${conceptsList ? `<ul class="unit-concepts">${conceptsList}</ul>` : ''}
              <a href="unidad.html?u=${unit.num}" class="unit-btn">Leer unidad &rarr;</a>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;

      mainContent.innerHTML = html;
      if (window.observeReveals) window.observeReveals();
    } catch (err) {
      mainContent.innerHTML = `<div class="article-page"><p style="color:var(--text-faint);text-align:center;padding:4rem 0;">Error: ${err.message}</p></div>`;
    }
  }

  loadAndRender();
});
