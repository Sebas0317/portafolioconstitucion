/* ============================================
   Home page - hero, featured grid & sabias que
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // ─── Inline markdown ─────────────────────────────
  function inlineMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  }

  // ─── Hero ────────────────────────────────────────
  const hero = `
    <section class="hero-section reveal">
      <div class="hero-logo">
        <img src="assets/ut.png" alt="Universidad del Tolima">
      </div>
      <h1 class="hero-title">Portafolio Académico de Constitución Política</h1>
      <p class="hero-subtitle">Juan Sebastian Sandoval · Ingeniería de Sistemas · Semestre IV</p>
      <p class="hero-description">
        Este blog recopila las reflexiones, análisis, preguntas generadoras y temas desarrollados durante el curso de Constitución Política, como parte del programa académico de la Universidad del Tolima IDEAD.
      </p>
      <div class="hero-meta">
        <span>Universidad del Tolima</span>
        <span>IDEAD</span>
        <span>Bogotá, Colombia</span>
      </div>
    </section>
  `;

  // ─── Featured articles (grid) ────────────────────
  const featured = `
    <section class="featured-section">
      <div class="section-label reveal">Artículos destacados</div>
      <div class="featured-grid">
        <div class="featured-card reveal">
          <div class="featured-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <h3>Preguntas Generadoras</h3>
          <p class="featured-desc">Análisis y respuestas a las preguntas planeadas en cada tutoría.</p>
          <ul class="featured-list">
            <li>5 preguntas desarrolladas</li>
            <li>Análisis de la Constitución de 1991</li>
            <li>Derechos fundamentales y participación</li>
          </ul>
          <a href="preguntas-generadoras.html" class="featured-btn">Leer artículo &rarr;</a>
        </div>
        <div class="featured-card reveal" style="transition-delay:0.15s">
          <div class="featured-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h3>Unidades Temáticas</h3>
          <p class="featured-desc">Desarrollo completo de cada unidad temática abordada en las tutorías del semestre.</p>
          <ul class="featured-list">
            <li>5 unidades temáticas</li>
            <li>Conceptos clave y reflexiones</li>
            <li>Análisis constitucional</li>
          </ul>
          <a href="temas-unidad.html" class="featured-btn">Leer artículo &rarr;</a>
        </div>
      </div>
    </section>
  `;

  mainContent.innerHTML = hero + featured;

  // ─── Sabías que... (loaded from file) ────────────
  async function loadSabias() {
    try {
      const res = await fetch('content/sabias.txt');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();

      const lines = text.split('\n');
      const items = [];
      let currentItem = null;

      for (const line of lines) {
        const h3Match = line.match(/^###\s+(.+)/);
        if (h3Match) {
          if (currentItem) items.push(currentItem);
          currentItem = { title: h3Match[1].trim(), content: '' };
          continue;
        }
        if (currentItem && line.trim() && !line.startsWith('#')) {
          currentItem.content += (currentItem.content ? ' ' : '') + line.trim();
        }
      }
      if (currentItem) items.push(currentItem);

      if (!items.length) return;

      let html = `
        <section class="sabias-section">
          <div class="section-label reveal">Sabías que...</div>
          <div class="sabias-grid">
      `;

      items.forEach((item, i) => {
        const delay = (i % 3) * 0.1;
        html += `
          <div class="sabias-card reveal" style="transition-delay:${delay}s">
            <span class="sabias-num">${String(i + 1).padStart(2, '0')}</span>
            <p>${inlineMarkdown(item.content)}</p>
          </div>
        `;
      });

      html += '</div></section>';
      mainContent.innerHTML += html;

      // Trigger reveal observation for new content
      if (window.observeReveals) window.observeReveals();
    } catch (err) {
      // silently ignore
    }
  }

  loadSabias();
});
