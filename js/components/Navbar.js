/* ============================================================
   Navbar Component — BUUTZKE (Apple & Emil Kowalski Principles)
   High-performance frosted glass, micro-interactions & tactile drawer
   ============================================================ */
const WA = 'https://wa.me/5551992395284?text=Ol%C3%A1%20Buutzke%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20atendimento%20espiritual.';

export class Navbar {
  static render(activePage = '') {
    const link = (href, label, id, target = '') =>
      `<a href="${href}" id="${id}" ${target} class="${activePage === id ? 'active' : ''}">${label}</a>`;

    return `
    <nav class="navbar" id="navbar">
      <div class="container navbar-inner">
        <a href="/" class="navbar-logo" id="nav-logo" aria-label="BUUTZKE Página Inicial">
          <span>BUUTZKE</span>
          <span class="navbar-logo-symbol" aria-hidden="true">✦</span>
        </a>

        <div class="navbar-links" id="nav-links">
          ${link('/', 'Início', 'home')}
          ${link('/ebooks', 'eBooks', 'ebooks')}
          ${link('/sobre', 'Sobre', 'sobre')}
          ${link('/linkbio', 'Bio & Links', 'linkbio')}
          <a href="${WA}" target="_blank" rel="noopener" id="nav-contato">WhatsApp</a>
        </div>

        <div class="navbar-right">
          <a href="/ebooks" class="btn btn-primary btn-shimmer nav-cta-btn" id="nav-cta" style="padding: 10px 20px; font-size: 0.78rem; border-radius: 9999px; letter-spacing: 0.8px;">
            <span>📖</span><span>VER EBOOKS</span>
          </a>
          <button class="navbar-hamburger" id="nav-hbg" aria-label="Abrir Menu de Navegação" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>

    <div class="navbar-overlay" id="nav-overlay" aria-hidden="true"></div>
    <aside class="navbar-mobile" id="nav-mobile" aria-label="Menu Mobile" role="dialog" aria-modal="true">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(212,175,55,0.15);">
        <span style="font-family: var(--font-title); font-size: 1.15rem; color: var(--gold); font-weight: 700; letter-spacing: 2px;">MENU</span>
        <button id="nav-mobile-close" aria-label="Fechar Menu" style="color: var(--text-muted); font-size: 1.4rem; padding: 4px 8px;">✕</button>
      </div>

      <a href="/" id="mob-home" class="${activePage === 'home' ? 'active' : ''}">
        <span>Início</span> <span>→</span>
      </a>
      <a href="/ebooks" id="mob-ebooks" class="${activePage === 'ebooks' ? 'active' : ''}">
        <span>eBooks & Grimórios</span> <span>→</span>
      </a>
      <a href="/sobre" id="mob-sobre" class="${activePage === 'sobre' ? 'active' : ''}">
        <span>Sobre Buutzke</span> <span>→</span>
      </a>
      <a href="/linkbio" id="mob-linkbio" class="${activePage === 'linkbio' ? 'active' : ''}">
        <span>Links da Bio</span> <span>→</span>
      </a>
      <a href="${WA}" target="_blank" rel="noopener" id="mob-contato" style="color: #25d366;">
        <span>💬 Falar no WhatsApp</span> <span>↗</span>
      </a>

      <div style="margin-top: auto; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);">
        <a href="/ebooks" class="btn btn-primary btn-full btn-shimmer" id="mob-cta" style="padding: 14px 20px; font-size: 0.88rem; border-radius: var(--radius-sm);">
          📖 ACERVO DE EBOOKS
        </a>
        <div style="display: flex; justify-content: center; gap: 16px; margin-top: 20px; font-size: 0.76rem; color: var(--text-muted);">
          <span>+112k Seguidores</span>
          <span>•</span>
          <span>Acesso Vitalício</span>
        </div>
      </div>
    </aside>`;
  }

  static init() {
    const navbar   = document.getElementById('navbar');
    const hbg      = document.getElementById('nav-hbg');
    const mobile   = document.getElementById('nav-mobile');
    const overlay  = document.getElementById('nav-overlay');
    const closeBtn = document.getElementById('nav-mobile-close');

    if (!navbar) return;

    /* Scroll listener optimized with passive flag */
    let lastScroll = 0;
    const onScroll = () => {
      const top = window.scrollY;
      navbar.classList.toggle('scrolled', top > 30);
      lastScroll = top;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile sheet menu toggle */
    const toggle = (open) => {
      const isOpen = open !== undefined ? open : !mobile?.classList.contains('open');
      hbg?.classList.toggle('open', isOpen);
      hbg?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobile?.classList.toggle('open', isOpen);
      overlay?.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hbg?.addEventListener('click', () => toggle());
    closeBtn?.addEventListener('click', () => toggle(false));
    overlay?.addEventListener('click', () => toggle(false));

    mobile?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggle(false));
    });

    /* Keyboard navigation: Escape key closes menu */
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && mobile?.classList.contains('open')) {
        toggle(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    /* Clean up when navigating between SPA pages */
    window.addEventListener('hashchange', () => {
      toggle(false);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    }, { once: true });
  }
}
