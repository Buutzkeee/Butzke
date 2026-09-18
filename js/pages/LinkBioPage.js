import { Router }    from '../router.js';
import { ebooksData } from '../data/ebooks.js';

const WA = 'https://wa.me/5551992395284';
const KIRVANO_MEMBERSHIP = 'https://pay.kirvano.com/45e4e673-3e4e-4ec6-8d24-19717ab0aa0b';

/* ============================================================
   Link Bio Page — Standalone, sem navbar/footer
   Otimizado para máxima conversão mobile (Instagram & TikTok)
   Foco principal: Venda do Clube de Membros + Grimórios + WhatsApp
   ============================================================ */
export class LinkBioPage {
  constructor(container) {
    this.container = container;
    this.toastTimer = null;
    Router.loadCSS('/css/linkbio.css?v=' + Date.now());
    this._render();
    this._initCanvas();
    this._initSocialProof();
  }

  _render() {
    this.container.innerHTML = `
      <!-- Partículas místicas animadas -->
      <div class="particles" id="particles"></div>

      <!-- Chamas decorativas nas bordas -->
      <div class="flames-container">
        <div class="flame flame-left">🕯️</div>
        <div class="flame flame-right">🕯️</div>
      </div>

      <!-- Notificação flutuante de prova social -->
      <div class="social-proof-toast" id="sp-toast">
        <span class="sp-dot"></span>
        <span id="sp-toast-text">Marcos R. assinou o Clube de Membros há 3 min</span>
      </div>

      <!-- Conteúdo principal -->
      <main class="container">
        
        <!-- Cabeçalho do perfil místico -->
        <header class="profile-header">
          <div class="avatar-wrapper">
            <div class="avatar-ring"></div>
            <img src="assets/foto-perfil.png" alt="Buutzke" class="avatar" id="avatar-img" />
            <div class="avatar-glow"></div>
          </div>
          <h1 class="profile-name">Buutzke</h1>
          <p class="profile-tagline">✦ Portal das Entidades ✦</p>
          <p class="profile-subtitle">Quimbanda • Magia • Espiritualidade</p>
          
          <div class="visit-counter" style="margin-top: 4px;">
            <span style="color:#22c55e;">●</span>
            <span>Mais de <strong>480 membros ativos</strong> no Círculo</span>
          </div>
        </header>

        <!-- Símbolos místicos decorativos -->
        <div class="mystic-divider">
          <span>⚜</span><span>✦</span><span>⚜</span>
        </div>

        <!-- Abas / Atalhos Rápidos -->
        <nav class="linkbio-tabs" aria-label="Navegação rápida">
          <a href="#sec-clube" class="linkbio-tab-pill active">🔥 Clube de Membros</a>
          <a href="#sec-consultas" class="linkbio-tab-pill">💬 Consultas</a>
          <a href="#sec-ebooks" class="linkbio-tab-pill">📚 Grimórios</a>
          <a href="#sec-social" class="linkbio-tab-pill">🌐 Redes</a>
        </nav>

        <!-- =======================================================
             SUPER DESTAQUE: CLUBE DE MEMBROS (O CÍRCULO BUUTZKE)
             ======================================================= -->
        <section id="sec-clube" class="vip-club-card" aria-label="Clube de Membros">
          <div class="vip-club-header">
            <div class="vip-badge-ribbon">
              <span>✦</span> ACESSO VIP EXCLUSIVO <span>✦</span>
            </div>
            <h2 class="vip-club-title">
              O Círculo <span>BUUTZKE</span>
            </h2>
            <p class="vip-club-desc">
              Repositório secreto de manuscritos sagrados, leitor digital otimizado no celular e PC, chat privado de praticantes e oráculo dos mistérios.
            </p>
          </div>

          <!-- Benefícios em Grid -->
          <div class="vip-perks-grid">
            <div class="vip-perk-box">
              <span class="vip-perk-icon">📜</span>
              <div class="vip-perk-text">
                <strong>Acervo Fechado</strong>
                <span>Manuscritos raros que não são vendidos avulso</span>
              </div>
            </div>

            <div class="vip-perk-box">
              <span class="vip-perk-icon">📱</span>
              <div class="vip-perk-text">
                <strong>Leitor Digital Próprio</strong>
                <span>Leitura sem distrações, virada e zoom no celular</span>
              </div>
            </div>

            <div class="vip-perk-box">
              <span class="vip-perk-icon">💬</span>
              <div class="vip-perk-text">
                <strong>Chat dos Membros</strong>
                <span>Tire dúvidas e debata rituais em tempo real</span>
              </div>
            </div>

            <div class="vip-perk-box">
              <span class="vip-perk-icon">🔮</span>
              <div class="vip-perk-text">
                <strong>Oráculo Sagrado</strong>
                <span>Consulta direta aos ensinamentos do acervo</span>
              </div>
            </div>
          </div>

          <!-- Preço Promocional do Clube -->
          <div class="vip-price-container">
            <div>
              <span class="vip-price-original">De R$ 59,90</span>
              <span class="vip-price-current">R$ 29,90</span>
              <span class="vip-price-period">/mês</span>
            </div>
            <span class="vip-price-daily">⚡ Apenas R$ 0,99 por dia • Acesso Imediato</span>
          </div>

          <!-- Botões de Ação do Clube -->
          <div class="vip-cta-container">
            <a href="${KIRVANO_MEMBERSHIP}" target="_blank" class="vip-btn-main" id="btn-linkbio-assinar-clube">
              <span>⚡</span> ENTRAR NO CLUBE DE MEMBROS
            </a>
            <a href="/biblioteca" class="vip-btn-login" id="btn-linkbio-ja-membro">
              <span>🗝️</span> Já é assinante? Entrar na Biblioteca
            </a>
          </div>

          <!-- Selos de Confiança -->
          <div class="vip-guarantees">
            <span>✓ Liberação Imediata</span>
            <span>✓ Cancele quando quiser</span>
            <span>✓ Compra 100% Segura</span>
          </div>
        </section>

        <!-- =======================================================
             CONSULTAS & TRABALHOS ESPIRITUAIS
             ======================================================= -->
        <section id="sec-consultas" class="links-section" aria-label="Consultas">
          <div class="mystic-divider" style="margin: 20px 0 16px;">
            <span style="font-size:0.8rem">✦ ATENDIMENTO & CONSULTAS ✦</span>
          </div>

          <!-- WhatsApp Direto -->
          <div class="link-card featured" id="card-whatsapp">
            <a href="${WA}" class="link-btn" target="_blank">
              <div class="btn-icon">💬</div>
              <div class="btn-content">
                <span class="btn-title">Agendar Consulta com Buutzke</span>
                <span class="btn-subtitle">Atendimento espiritual direto pelo WhatsApp</span>
              </div>
              <div class="btn-arrow">→</div>
            </a>
          </div>

          <!-- Peça Sua Entidade -->
          <div class="link-card" id="card-entity">
            <a href="https://buutzkeee.github.io/Entity/" class="link-btn" target="_blank">
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
             GRIMÓRIOS & EBOOKS INDIVIDUAIS
             ======================================================= -->
        <section id="sec-ebooks" class="links-section" aria-label="Grimórios Individuais">
          <div class="mystic-divider" style="margin: 30px 0 16px;">
            <span style="font-size:0.8rem">✦ GRIMÓRIOS & LIVROS DIGITAIS ✦</span>
          </div>

          <!-- Banner de Urgência -->
          <div class="urgency-banner" style="background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(139,0,0,0.2)); border: 1px solid var(--gold-bright); border-radius: 10px; padding: 12px 16px; text-align: center; margin-bottom: 16px;">
            <p style="color: var(--gold-bright); font-size: 0.85rem; font-weight: 700; margin: 0;">⚡ ADQUIRA SEU EXEMPLAR COM ACESSO VITALÍCIO</p>
            <p style="color: var(--text-muted); font-size: 0.74rem; margin: 4px 0 0;">Download imediato em PDF para ler no celular, tablet ou computador.</p>
          </div>

          ${ebooksData.map(e => `
            <div class="link-card ${e.badge === 'LANÇAMENTO' ? 'lancamento' : (e.featured ? 'featured' : '')}" style="margin-bottom: 12px;">
              <a href="/ebook/${e.slug}" class="link-btn" style="position:relative;">
                <div class="btn-icon" style="font-size:2rem">${e.icon}</div>
                <div class="btn-content">
                  <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:2px;">
                    ${e.badge === 'LANÇAMENTO' ? `<span class="lancamento-pill">✦ LANÇAMENTO ✦</span>` : (e.featured ? `<span class="lancamento-pill" style="background:rgba(212,175,55,0.2); color:var(--gold-bright);">✦ DESTAQUE ✦</span>` : '')}
                    <span style="font-size:0.7rem; color:var(--gold-bright); opacity:0.9;">★ 4.9 (Praticantes Satisfeitos)</span>
                  </div>
                  <span class="btn-title">${e.title}</span>
                  <span class="btn-subtitle">${e.subtitle || 'Domine os mistérios e transforme sua prática espiritual.'}</span>
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-top:8px; width:100%;">
                    ${e.priceTo ? `
                      <span style="font-size:0.84rem; color:var(--gold-bright); font-weight:700;">
                        ${e.priceFrom ? `<span style="text-decoration:line-through; opacity:0.6; margin-right:6px; font-weight:400; font-size:0.75rem;">R$ ${e.priceFrom.toFixed(2).replace('.', ',')}</span>` : ''}
                        R$ ${e.priceTo.toFixed(2).replace('.', ',')}
                      </span>
                    ` : ''}
                    <span style="font-size:0.75rem; color:#fff; background:rgba(212,175,55,0.18); padding:3px 10px; border-radius:6px; border:1px solid rgba(212,175,55,0.35); font-weight:600;">
                      Ver Detalhes →
                    </span>
                  </div>
                </div>
              </a>
            </div>
          `).join('')}

          <!-- Botão para Loja Completa -->
          <div class="link-card" style="margin-top: 4px;">
            <a href="/ebooks" class="link-btn" id="btn-ver-mais-ebooks">
              <div class="btn-icon">📚</div>
              <div class="btn-content">
                <span class="btn-title">Ver Catálogo Completo de Livros</span>
                <span class="btn-subtitle">Conheça todos os títulos e rituais disponíveis</span>
              </div>
              <div class="btn-arrow">→</div>
            </a>
          </div>
        </section>

        <!-- =======================================================
             SITE OFICIAL & REDES SOCIAIS
             ======================================================= -->
        <section id="sec-social" class="links-section" aria-label="Site e Redes Sociais">
          <div class="mystic-divider" style="margin: 30px 0 16px;">
            <span style="font-size:0.8rem">✦ PORTAL & REDES OFICIAIS ✦</span>
          </div>

          <!-- Site Principal -->
          <div class="link-card" id="card-site">
            <a href="/" class="link-btn" id="btn-site">
              <div class="btn-icon">🌐</div>
              <div class="btn-content">
                <span class="btn-title">Site Oficial BUUTZKE</span>
                <span class="btn-subtitle">Acesse artigos, história e a página inicial</span>
              </div>
              <div class="btn-arrow">→</div>
            </a>
          </div>

          <!-- Redes Sociais -->
          <div class="social-row">
            <div class="social-card" id="card-instagram">
              <a href="https://www.instagram.com/buutzke" class="social-btn" target="_blank" aria-label="Instagram">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>

            <div class="social-card" id="card-tiktok">
              <a href="https://www.tiktok.com/@buutzke_" class="social-btn" target="_blank" aria-label="TikTok">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.22 6.22 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/>
                </svg>
                <span>TikTok</span>
              </a>
            </div>

            <div class="social-card" id="card-youtube">
              <a href="https://youtube.com/@buutzkez" class="social-btn" target="_blank" aria-label="YouTube">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </section>

        <!-- Rodapé místico -->
        <footer class="site-footer">
          <div class="mystic-divider"><span>⚜</span><span>✦</span><span>⚜</span></div>
          <p class="footer-text">✦ Que as entidades iluminem seu caminho ✦</p>
          <p class="footer-copy">© 2026 Buutzke — Todos os direitos reservados</p>
        </footer>

      </main>
    `;

    this._bindTabScroll();
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

  _initSocialProof() {
    const messages = [
      '✨ Rafael M. (SP) entrou no Clube de Membros há 4 min',
      '✨ Juliana R. (BA) adquiriu Quimbanda: O Caminho da Força',
      '✨ Thiago S. (PR) assinou o Repositório Secreto há 7 min',
      '✨ Marcelo V. (RJ) entrou no Círculo de Membros há 11 min',
      '✨ Lucas B. (MG) garantiu o Grimório de Goetia',
      '✨ Carolina F. (RS) assinou o Clube de Membros há 15 min'
    ];

    const toast = document.getElementById('sp-toast');
    const toastText = document.getElementById('sp-toast-text');
    if (!toast || !toastText) return;

    let index = 0;
    const showToast = () => {
      toastText.textContent = messages[index % messages.length];
      index++;
      toast.classList.add('visible');

      setTimeout(() => {
        toast.classList.remove('visible');
      }, 4500);
    };

    // Primeiro toast após 4 segundos
    setTimeout(showToast, 4000);

    // Próximos toasts a cada 16 segundos
    if (this.toastTimer) clearInterval(this.toastTimer);
    this.toastTimer = setInterval(showToast, 16000);
  }

  _initCanvas() {
    this._initParticles();
    this._initClickCounters();
  }

  _initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = window.innerWidth < 500 ? 18 : 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const hue = Math.random() > 0.5 ? '45' : '0';
      p.style.cssText = `
        left:${Math.random()*100}%;
        width:${1+Math.random()*2.5}px; height:${1+Math.random()*2.5}px;
        background:hsl(${hue},90%,${40+Math.random()*40}%);
        animation-duration:${5+Math.random()*10}s;
        animation-delay:${Math.random()*8}s;
        --drift:${(Math.random()-.5)*80}px;
        box-shadow:0 0 ${3+Math.random()*4}px hsl(${hue},90%,60%);
      `;
      container.appendChild(p);
    }
  }

  _initClickCounters() {
    document.querySelectorAll('.link-card, .social-card, .vip-club-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        btn.classList.remove('click-pop');
        void btn.offsetWidth;
        btn.classList.add('click-pop');
        this._spawnClickParticles(e.clientX, e.clientY);
      });
    });

    if (!document.getElementById('spark-style')) {
      const s = document.createElement('style');
      s.id = 'spark-style';
      s.textContent = `@keyframes sparkFly{
        0%{transform:translate(-50%,-50%) scale(1);opacity:1}
        100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(0);opacity:0}
      }`;
      document.head.appendChild(s);
    }
  }

  _spawnClickParticles(x, y) {
    if (!x || !y) return;
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('div');
      s.style.cssText = `
        position:fixed; left:${x}px; top:${y}px;
        width:4px; height:4px; border-radius:50%;
        background:${Math.random()>.5?'#ffd700':'#ff3300'};
        pointer-events:none; z-index:9999;
        box-shadow:0 0 6px currentColor;
        transform:translate(-50%,-50%);
        animation:sparkFly .7s ease-out forwards;
        --dx:${(Math.random()-.5)*80}px; --dy:${(Math.random()-.5)*80}px;
      `;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
  }
}
