/* ===============================
   Navbar Component — BUUTZKE 2.0
   CTA → VER EBOOKS (não WhatsApp)
   =============================== */
const WA = 'https://wa.me/5551992395284';

export class Navbar {
  static render(activePage = '') {
    const link = (href, label, id, target = '') =>
      `<a href="${href}" id="${id}" ${target} class="${activePage === id ? 'active' : ''}">${label}</a>`;

    return `
    <nav class="navbar" id="navbar">
      <div class="container navbar-inner">
        <a href="/" class="navbar-logo" id="nav-logo">BUUTZKE</a>

        <div class="navbar-links" id="nav-links">
          ${link('/', 'INÍCIO', 'home')}
          ${link('/ebooks', 'EBOOKS', 'ebooks')}
          ${link('/biblioteca', 'ÁREA DE MEMBROS', 'biblioteca')}
          ${link('/sobre', 'SOBRE', 'sobre')}
          <a href="${WA}" target="_blank" id="nav-contato">CONTATO</a>
        </div>

        <div class="navbar-right">
          <a href="/ebooks" class="btn btn-primary nav-cta-btn" id="nav-cta" style="padding: 10px 20px; font-size: 0.78rem; border-radius: 4px; letter-spacing: 1px;">
            <span style="margin-right:5px;">📖</span> VER EBOOKS
          </a>
          <button class="navbar-hamburger" id="nav-hbg" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>

    <div class="navbar-overlay" id="nav-overlay"></div>
    <div class="navbar-mobile" id="nav-mobile">
      <a href="/" id="mob-home">Início</a>
      <a href="/ebooks" id="mob-ebooks">eBooks</a>
      <a href="/biblioteca" id="mob-biblioteca" style="color: #f5c842;">🔱 Área de Membros (Acervo)</a>
      <a href="/sobre" id="mob-sobre">Sobre</a>
      <a href="/linkbio" id="mob-linkbio">Link Bio</a>
      <a href="${WA}" target="_blank" id="mob-contato">WhatsApp</a>
      <a href="/ebooks" class="btn btn-primary btn-full" id="mob-cta" style="margin-top:20px;">📖 Ver eBooks</a>
    </div>`;
  }

  static init() {
    const navbar   = document.getElementById('navbar');
    const hbg      = document.getElementById('nav-hbg');
    const mobile   = document.getElementById('nav-mobile');
    const overlay  = document.getElementById('nav-overlay');

    if (!navbar) return;

    /* Scroll */
    const onScroll = () => {
      const s = window.scrollY > 50;
      navbar.classList.toggle('scrolled', s);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
    const toggle = open => {
      hbg?.classList.toggle('open', open);
      mobile?.classList.toggle('open', open);
      overlay?.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    hbg?.addEventListener('click', () => toggle(!mobile?.classList.contains('open')));
    overlay?.addEventListener('click', () => toggle(false));
    mobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));

    /* Cleanup */
    window.addEventListener('hashchange', () => {
      toggle(false);
      window.removeEventListener('scroll', onScroll);
    }, { once: true });
  }
}
