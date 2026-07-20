/* ===============================
   Navbar Component
   =============================== */
const WA = 'https://wa.me/55519395284?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta.';

export class Navbar {
  static render(activePage = '') {
    const link = (href, label, id, target = '') =>
      `<a href="${href}" id="${id}" ${target} class="${activePage === id ? 'active' : ''}">${label}</a>`;

    return `
    <nav class="navbar" id="navbar">
      <div class="container navbar-inner">
        <a href="#/" class="navbar-logo" id="nav-logo">BUUTZKE</a>

        <div class="navbar-links" id="nav-links">
          ${link('#/', 'HOME', 'home')}
          ${link('#/ebooks', 'EBOOKS', 'ebooks')}
          ${link('#/atendimentos', 'ATENDIMENTOS', 'atendimentos')}
          <a href="https://www.instagram.com/buutzke/" target="_blank" id="nav-ig">INSTAGRAM</a>
          ${link('#/sobre', 'SOBRE', 'sobre')}
          <a href="${WA}" target="_blank" id="nav-contato">CONTATO</a>
        </div>

        <div class="navbar-right">
          <a href="${WA}" target="_blank" class="btn btn-primary" id="nav-cta" style="padding: 10px 24px; font-size: 0.8rem; border-radius: 4px;">AGENDAR</a>
          <button class="navbar-hamburger" id="nav-hbg" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>

    <div class="navbar-overlay" id="nav-overlay"></div>
    <div class="navbar-mobile" id="nav-mobile">
      <a href="#/" id="mob-home">Home</a>
      <a href="#/ebooks" id="mob-ebooks">eBooks</a>
      <a href="#/atendimentos" id="mob-atendimentos">Atendimentos</a>
      <a href="https://www.instagram.com/buutzke/" target="_blank" id="mob-ig">Instagram</a>
      <a href="#/sobre" id="mob-sobre">Sobre</a>
      <a href="#/linkbio" id="mob-linkbio">Link Bio</a>
      <a href="${WA}" target="_blank" class="btn btn-primary btn-full" id="mob-cta" style="margin-top:20px;">Agendar Consulta</a>
    </div>`;
  }

  static init() {
    const navbar   = document.getElementById('navbar');
    const hbg      = document.getElementById('nav-hbg');
    const mobile   = document.getElementById('nav-mobile');
    const overlay  = document.getElementById('nav-overlay');
    const navCta   = document.getElementById('nav-cta');

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
