/* ============================================
   Shared layout: sidebar, footer, back-to-top, reveal
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const footer = document.getElementById('footer');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.site-nav');

  // ─── Sidebar ─────────────────────────────────────
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-card author-info">
        <div class="author-avatar">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div class="author-name">Juan Sebastian Sandoval</div>
        <div class="author-role">Ingeniería de Sistemas</div>
        <div class="author-role">Semestre IV</div>
        <div class="author-university">Universidad del Tolima · IDEAD</div>
      </div>
      <div class="sidebar-card">
        <h3>Información académica</h3>
        <ul class="sidebar-list">
          <li><span class="sidebar-label"><strong>Asignatura:</strong> Constitución Política</span></li>
          <li><span class="sidebar-label"><strong>Docente:</strong> Laura Fernanda Rodríguez Méndez</span></li>
          <li><span class="sidebar-label"><strong>Ciudad:</strong> Bogotá, Colombia</span></li>
          <li><span class="sidebar-label"><strong>Periodo:</strong> 2026</span></li>
        </ul>
      </div>
      <div class="sidebar-card">
        <h3>Navegación</h3>
        <ul class="sidebar-nav">
          <li><a href="index.html">Inicio</a></li>
          <li><a href="preguntas-generadoras.html">Preguntas Generadoras</a></li>
          <li><a href="temas-unidad.html">Unidades Temáticas</a></li>
        </ul>
      </div>
      <div class="sidebar-card">
        <h3>Entradas recientes</h3>
        <ul class="sidebar-list">
          <li>
            <a href="preguntas-generadoras.html">Preguntas Generadoras</a>
            <div class="list-meta">Febrero 2026</div>
          </li>
          <li>
            <a href="temas-unidad.html">Unidades Temáticas</a>
          </li>
        </ul>
      </div>
    `;
  }

  // ─── Footer ──────────────────────────────────────
  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-info">
          <span class="footer-brand">Universidad del Tolima</span>
          <span>Constitución Política · Juan Sebastian Sandoval</span>
          <span>Ingeniería de Sistemas · IDEAD</span>
        </div>
        <div class="footer-year">&copy; ${year} Portafolio Académico</div>
      </div>
    `;
  }

  // ─── Mobile nav toggle ───────────────────────────
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // ─── Back to top button ──────────────────────────
  const backBtn = document.createElement('button');
  backBtn.className = 'back-to-top';
  backBtn.id = 'back-to-top';
  backBtn.setAttribute('aria-label', 'Volver arriba');
  backBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(backBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Scroll reveal ───────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Observe new elements that get added to the DOM
  const observeReveals = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      revealObserver.observe(el);
    });
  };

  // Initial observation
  observeReveals();

  // Re-observe when DOM changes (for dynamically loaded content)
  const mutationObserver = new MutationObserver(observeReveals);
  mutationObserver.observe(document.getElementById('main-content'), { childList: true, subtree: true });

  // Expose for other scripts
  window.observeReveals = observeReveals;

  // ─── Lightbox ──────────────────────────────────────
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Cerrar">&times;</button><img src="" alt="">';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.addEventListener('click', (e) => {
    const img = e.target.closest('.unit-image img, .article-hero-img img');
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightbox.classList.add('open');
    }
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
      lightbox.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });

  // ─── Anchor link copy ─────────────────────────────
  const tooltip = document.createElement('div');
  tooltip.className = 'anchor-tooltip';
  tooltip.textContent = '¡Enlace copiado!';
  document.body.appendChild(tooltip);

  let tooltipTimer = null;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('.anchor-link');
    if (anchor) {
      e.preventDefault();
      const url = window.location.href.split('#')[0] + anchor.getAttribute('href');
      navigator.clipboard.writeText(url).catch(() => {});
      clearTimeout(tooltipTimer);
      tooltip.classList.add('visible');
      tooltipTimer = setTimeout(() => tooltip.classList.remove('visible'), 2000);
    }
  });
});
