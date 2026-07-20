import { Router } from '../router.js';

/* ============================================================
   Ebook Sales Page — Dedicated Landing Page for "O Caminho da Força"
   ============================================================ */
export class EbookSalesPage {
  constructor(container) {
    this.container = container;
    // Carrega o CSS base místico (do LinkBio) e depois o CSS específico de vendas
    Router.loadCSS('css/linkbio.css');
    Router.loadCSS('css/sales.css');
    this._render();
    this._initCanvas();
  }

  _render() {
    this.container.innerHTML = `
      <div class="lb-page">
        <!-- Partículas animadas (CSS) -->
        <div class="particles" id="particles"></div>

        <!-- Chamas decorativas -->
        <div class="flames-container">
          <div class="flame flame-left">🕯️</div>
          <div class="flame flame-right">🕯️</div>
        </div>

        <!-- Back button -->
        <a href="/" class="back-btn" id="back-btn" style="position: absolute; top: 20px; left: 20px; z-index: 100;">
          ← Voltar ao Portal
        </a>

        <main class="sales-container">
          <!-- Hero -->
          <section class="sales-hero">
            <div class="sales-badge">📖 EBOOK EXCLUSIVO</div>
            <h1 class="sales-title">Compre Seu<br /><span class="highlight-text">Ebook</span></h1>
            <p class="sales-tagline">Conhecimento que transforma almas</p>
          </section>

          <!-- Grimório Card (featured product) -->
          <section class="product-showcase">
            <div class="product-card main-product">
              <div class="product-badge-hot">🔥 MAIS VENDIDO</div>
              <div class="product-image-wrap">
                <img src="assets/ebook-cover.jpg" alt="Quimbanda: O Caminho da Força" class="product-image" />
                <div class="product-image-glow"></div>
              </div>
              <div class="product-info">
                <h2 class="product-title">Quimbanda: O Caminho da Força</h2>
                <p class="product-subtitle">Grimório completo · Acesso vitalício · Entrega imediata</p>

                <div class="product-features">
                  <div class="feature-item">
                    <span class="feature-icon">🌿</span>
                    <span>Ervas sagradas e seus poderes</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🛁</span>
                    <span>Banhos de limpeza e proteção</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🔮</span>
                    <span>Rituais de magia e feitiçaria</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🕯️</span>
                    <span>Trabalhos com velas e defumação</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🌙</span>
                    <span>Proteção espiritual avançada</span>
                  </div>
                </div>

                <div class="product-cta-wrap">
                  <a href="https://pay.kirvano.com/c242b645-8452-4e17-8c59-c6de9aef926c"
                     class="cta-btn primary-cta"
                     target="_blank" rel="noopener">
                    <span class="cta-icon">🌿</span>
                    <span class="cta-text">Adquirir O Grimório</span>
                    <span class="cta-arrow">→</span>
                  </a>
                  <p class="cta-guarantee">🔒 Compra segura via Kirvano</p>
                </div>
              </div>
            </div>

            <!-- Second product (Ebook Espiritual) -->
            <div class="product-card second-product">
              <div class="product-info-inline">
                <div class="product-icon-big">📖</div>
                <div>
                  <h3 class="product-title-sm">Segredos das Encruzilhadas</h3>
                  <p class="product-desc-sm">Aprenda a ritualística completa das encruzilhadas. Firmezas, oferendas e práticas avançadas para sua evolução.</p>
                </div>
              </div>

              <div class="product-features-inline">
                <span class="feat-tag">✦ Ritualística</span>
                <span class="feat-tag">✦ Firmezas</span>
                <span class="feat-tag">✦ Oferendas</span>
                <span class="feat-tag">✦ Práticas</span>
              </div>

              <a href="https://pay.kirvano.com/1d977ba5-c8e5-449e-ad67-25b4e163dac9"
                 class="cta-btn secondary-cta"
                 target="_blank" rel="noopener">
                <span class="cta-icon">📖</span>
                <span class="cta-text">Comprar Ebook</span>
                <span class="cta-arrow">→</span>
              </a>
              <p class="cta-guarantee">🔒 Compra segura via Kirvano</p>
            </div>
          </section>

          <!-- Testimonials / social proof -->
          <section class="social-proof">
            <div class="mystic-divider"><span>⚜</span><span>✦</span><span>⚜</span></div>
            <h2 class="proof-title">O que dizem nossos alunos</h2>
            <div class="testimonials">
              <div class="testimonial-card">
                <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
                <p class="testimonial-text">"Conteúdo incrível! O banho de ervas que aprendi no grimório mudou completamente minha energia."</p>
                <span class="testimonial-author">— M. Santos, São Paulo</span>
              </div>
              <div class="testimonial-card">
                <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
                <p class="testimonial-text">"Material muito completo e bem explicado. Recomendo pra quem está iniciando no caminho das ervas."</p>
                <span class="testimonial-author">— K. Oliveira, Rio de Janeiro</span>
              </div>
              <div class="testimonial-card">
                <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
                <p class="testimonial-text">"O Buutzke explica tudo com maestria. Os rituais do grimório são poderosos e funcionam de verdade!"</p>
                <span class="testimonial-author">— R. Costa, Porto Alegre</span>
              </div>
            </div>
          </section>

          <!-- FAQ -->
          <section class="faq-section">
            <div class="mystic-divider"><span>⚜</span><span>✦</span><span>⚜</span></div>
            <h2 class="faq-title">Perguntas Frequentes</h2>
            <div class="faq-list">
              <details class="faq-item">
                <summary class="faq-question">Como recebo o ebook após a compra?</summary>
                <div class="faq-answer">Você receberá o link de download por e-mail imediatamente após a confirmação do pagamento. O acesso é instantâneo.</div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">O pagamento é seguro?</summary>
                <div class="faq-answer">Sim! Utilizamos a plataforma Kirvano, que garante total segurança na sua transação com criptografia SSL.</div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">Posso acessar em qualquer dispositivo?</summary>
                <div class="faq-answer">O ebook está no formato PDF, compatível com celular, tablet e computador. Acesse onde e quando quiser.</div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">Há garantia de satisfação?</summary>
                <div class="faq-answer">Sim! Oferecemos garantia conforme a política da plataforma Kirvano. Em caso de dúvidas, entre em contato pelo WhatsApp.</div>
              </details>
            </div>
          </section>

          <!-- Final CTA -->
          <section class="final-cta-section">
            <div class="final-cta-inner">
              <h2 class="final-cta-title">Pronto para transformar sua vida espiritual?</h2>
              <p class="final-cta-sub">Junte-se a centenas de alunos que já transformaram sua jornada espiritual</p>
              <a href="https://pay.kirvano.com/c242b645-8452-4e17-8c59-c6de9aef926c"
                 class="cta-btn primary-cta large-cta"
                 target="_blank" rel="noopener">
                <span class="cta-icon">🔱</span>
                <span class="cta-text">Quero Meu Ebook Agora!</span>
                <span class="cta-arrow">→</span>
              </a>
              <p class="cta-guarantee">🔒 Garantido e seguro • Acesso imediato</p>
            </div>
          </section>

          <footer class="site-footer">
            <div class="mystic-divider"><span>⚜</span><span>✦</span><span>⚜</span></div>
            <p class="footer-text">✦ Que as entidades te guiem ✦</p>
            <p class="footer-copy">© 2026 Buutzke — Todos os direitos reservados</p>
          </footer>

        </main>
      </div>
    `;
  }

  _initCanvas() {
    this._initParticles();
    this._initClickCounters();
  }

  _initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = window.innerWidth < 500 ? 18 : 30;
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
    document.querySelectorAll('.cta-btn, .product-card').forEach(btn => {
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
