import { Router }    from '../router.js';
import { ebooksData } from '../data/ebooks.js';

const WA = 'https://wa.me/5551992395284?text=Ol%C3%A1%20Buutzke%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20atendimento%20espiritual.';

/* ============================================================
   Link Bio Page — BUUTZKE (Design Engineering Polish)
   Foco em conversão: Grimórios em PDF, Consultas e Redes Oficiais
   ============================================================ */
export class LinkBioPage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('/css/linkbio.css?v=' + Date.now());
    this._render();
    this._initParticles();
    this._bindTabScroll();
  }

  _render() {
    this.container.innerHTML = `
      <!-- Partículas místicas de fundo -->
      <div class="particles" id="particles" aria-hidden="true"></div>

      <!-- Conteúdo principal -->
      <main class="container">
        
        <!-- Cabeçalho do perfil -->
        <header class="profile-header">
          <div class="avatar-wrapper">
            <div class="avatar-ring" aria-hidden="true"></div>
            <img src="/assets/foto-perfil.png" alt="Buutzke — Eduardo Souza" class="avatar" id="avatar-img" width="108" height="108" />
            <div class="avatar-glow" aria-hidden="true"></div>
          </div>
          <h1 class="profile-name">Buutzke</h1>
          <p class="profile-tagline">✦ O OCULTO SEM FANTASIAS ✦</p>
          <p class="profile-subtitle">Quimbanda • Exu • Goetia • Magia</p>
          
          <div class="author-badge">
            <span class="badge-dot" aria-hidden="true"></span>
            <span>+112 mil seguidores • Grimórios em PDF vitalício</span>
          </div>
        </header>

        <!-- Símbolos místicos decorativos -->
        <div class="mystic-divider" aria-hidden="true">
          <span>⚜</span><span>✦</span><span>⚜</span>
        </div>

        <!-- Abas / Atalhos Rápidos -->
        <nav class="linkbio-tabs" aria-label="Navegação rápida">
          <a href="#sec-ebooks" class="linkbio-tab-pill active">📚 Grimórios</a>
          <a href="#sec-consultas" class="linkbio-tab-pill">💬 Consultas</a>
          <a href="#sec-social" class="linkbio-tab-pill">🌐 Redes</a>
        </nav>

        <!-- =======================================================
             GRIMÓRIOS & LIVROS DIGITAIS (DESTAQUE MÁXIMO)
             ======================================================= -->
        <section id="sec-ebooks" class="links-section" aria-label="Grimórios e Livros Digitais">
          <div class="section-badge-header">
            <span class="section-badge-title">✦ ACERVO DE GRIMÓRIOS DIGITAIS ✦</span>
            <p class="section-badge-sub">Estudo fundamentado • Download imediato em PDF • Acesso vitalício</p>
          </div>

          <!-- Lista de Ebooks Individuais -->
          <div class="ebooks-bio-list">
            ${ebooksData.map((e, index) => `
              <article class="bio-ebook-card ${e.featured ? 'is-featured' : ''}" id="card-ebook-${e.slug}">
                <div class="bio-ebook-media">
                  <img src="${e.imageHome || e.image}" alt="${e.title}" loading="${index < 2 ? 'eager' : 'lazy'}" class="bio-ebook-thumb" />
                  ${e.badge ? `<span class="bio-badge ${e.badge === 'MAIS VENDIDO' ? 'badge-hot' : 'badge-gold'}">${e.badge}</span>` : ''}
                </div>

                <div class="bio-ebook-info">
                  <span class="bio-ebook-cat">${e.category || 'Grimório'}</span>
                  <h3 class="bio-ebook-title">${e.title}</h3>
                  <p class="bio-ebook-desc">${e.shortDesc || e.subtitle}</p>
                  
                  <div class="bio-ebook-footer">
                    <div class="bio-price-box">
                      ${e.priceFrom ? `<span class="bio-price-old">R$ ${e.priceFrom.toFixed(2).replace('.', ',')}</span>` : ''}
                      <span class="bio-price-val">R$ ${e.priceTo.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <div class="bio-btn-group">
                      <a href="/ebook/${e.slug}" class="bio-btn-details" title="Ver detalhes e sumário do livro">
                        Detalhes
                      </a>
                      <a href="${e.paymentLink}" target="_blank" rel="noopener" class="bio-btn-buy" id="btn-buy-${e.slug}">
                        ⚡ Garantir
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>

          <!-- Acesso à página completa de eBooks -->
          <div class="link-card link-card-subtle" style="margin-top: 6px;">
            <a href="/ebooks" class="link-btn">
              <div class="btn-icon">📖</div>
              <div class="btn-content">
                <span class="btn-title">Ver Catálogo Completo no Site</span>
                <span class="btn-subtitle">Conheça o sumário e capítulos de cada obra</span>
              </div>
              <div class="btn-arrow">→</div>
            </a>
          </div>
        </section>

        <!-- =======================================================
             CONSULTAS & ATENDIMENTO ESPIRITUAL
             ======================================================= -->
        <section id="sec-consultas" class="links-section" aria-label="Consultas Espirituais">
          <div class="section-badge-header" style="margin-top: 24px;">
            <span class="section-badge-title">✦ ATENDIMENTO & TRABALHOS ✦</span>
            <p class="section-badge-sub">Orientação direta e personalizada com Buutzke</p>
          </div>

          <!-- WhatsApp Direto -->
          <div class="link-card featured" id="card-whatsapp">
            <a href="${WA}" class="link-btn" target="_blank" rel="noopener">
              <div class="btn-icon">💬</div>
              <div class="btn-content">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="btn-title">Agendar Consulta com Buutzke</span>
                  <span class="status-live">ONLINE</span>
                </div>
                <span class="btn-subtitle">Atendimento espiritual direto e seguro via WhatsApp</span>
              </div>
              <div class="btn-arrow">→</div>
            </a>
          </div>

          <!-- Peça Sua Entidade -->
          <div class="link-card" id="card-entity">
            <a href="https://buutzkeee.github.io/Entity/" class="link-btn" target="_blank" rel="noopener">
              <div class="btn-icon">🔮</div>
              <div class="btn-content">
                <span class="btn-title">Peça Sua Entidade</span>
                <span class="btn-subtitle">Conexão espiritual e revelação das suas entidades</span>
              </div>
              <div class="btn-arrow">→</div>
            </a>
          </div>
        </section>

        <!-- =======================================================
             REDES SOCIAIS & PORTAL OFICIAL
             ======================================================= -->
        <section id="sec-social" class="links-section" aria-label="Redes e Portal Oficial">
          <div class="section-badge-header" style="margin-top: 24px;">
            <span class="section-badge-title">✦ CANAIS & REDES OFICIAIS ✦</span>
            <p class="section-badge-sub">Acompanhe estudos e conteúdos diários</p>
          </div>

          <!-- Site Oficial -->
          <div class="link-card" id="card-site">
            <a href="/" class="link-btn" id="btn-site">
              <div class="btn-icon">🌐</div>
              <div class="btn-content">
                <span class="btn-title">Portal Oficial BUUTZKE</span>
                <span class="btn-subtitle">História, artigos, depoimentos e materiais</span>
              </div>
              <div class="btn-arrow">→</div>
            </a>
          </div>

          <!-- Redes Sociais Grid -->
          <div class="social-grid">
            <a href="https://www.instagram.com/buutzke" class="social-card-item" target="_blank" rel="noopener" aria-label="Instagram de Buutzke">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span class="social-label">Instagram</span>
              <span class="social-sub">+112k</span>
            </a>

            <a href="https://www.tiktok.com/@buutzke_" class="social-card-item" target="_blank" rel="noopener" aria-label="TikTok de Buutzke">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.22 6.22 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/>
              </svg>
              <span class="social-label">TikTok</span>
              <span class="social-sub">Vídeos</span>
            </a>

            <a href="https://youtube.com/@buutzkez" class="social-card-item" target="_blank" rel="noopener" aria-label="YouTube de Buutzke">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span class="social-label">YouTube</span>
              <span class="social-sub">Aulas</span>
            </a>
          </div>
        </section>

        <!-- Rodapé místico refinado -->
        <footer class="site-footer">
          <div class="mystic-divider" aria-hidden="true"><span>⚜</span><span>✦</span><span>⚜</span></div>
          <p class="footer-text">✦ Que as entidades iluminem seu caminho ✦</p>
          <p class="footer-copy">© 2026 Buutzke — Todos os direitos reservados</p>
        </footer>

      </main>
    `;
  }

  _bindTabScroll() {
    this.container.querySelectorAll('.linkbio-tab-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const targetId = pill.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const el = document.querySelector(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.container.querySelectorAll('.linkbio-tab-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
          }
        }
      });
    });
  }

  _initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = window.innerWidth < 500 ? 12 : 20;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const isGold = Math.random() > 0.4;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${1 + Math.random() * 2}px;
        height: ${1 + Math.random() * 2}px;
        background: ${isGold ? '#d4af37' : '#8b0000'};
        animation-duration: ${7 + Math.random() * 8}s;
        animation-delay: ${Math.random() * 5}s;
        --drift: ${(Math.random() - 0.5) * 60}px;
        box-shadow: 0 0 5px ${isGold ? '#ffd700' : '#ff1a1a'};
      `;
      container.appendChild(p);
    }
  }
}
