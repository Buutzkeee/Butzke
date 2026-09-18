import { Navbar }    from '../components/Navbar.js';
import { Footer }    from '../components/Footer.js';
import { ebooksData } from '../data/ebooks.js';
import { Router }    from '../router.js';
import { Analytics } from '../analytics.js';

export class ObrigadoPage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('/css/obrigado.css?v=' + Date.now());
    // Dispara evento Purchase nos Pixels (Meta + TikTok)
    const _p = new URLSearchParams(window.location.search);
    const _slug = _p.get('ebook') || '';
    const _eb = ebooksData.find(e => e.slug === _slug);
    Analytics.trackPurchase(_slug, _eb ? _eb.priceTo : 0);
    this.render();
  }


  render() {
    const navbarHtml = Navbar.render('obrigado');
    const footerHtml = Footer.render();

    // Detecta qual ebook foi comprado via query param (ex: ?ebook=slug)
    const params = new URLSearchParams(window.location.search);
    const boughtSlug = params.get('ebook') || '';

    // Todos os ebooks para cross-sell (excluindo o que foi comprado)
    const otherEbooks = ebooksData.filter(e => e.slug !== boughtSlug && e.priceTo);

    this.container.innerHTML = `
      ${navbarHtml}

      <main class="page-content obrigado-page">

        <!-- ══ HERO OBRIGADO ══ -->
        <section class="obg-hero">
          <div class="obg-hero-orb obg-orb1"></div>
          <div class="obg-hero-orb obg-orb2"></div>
          <div class="container obg-hero-inner">
            <div class="obg-check-wrap reveal">
              <div class="obg-check">✓</div>
            </div>
            <h1 class="obg-h1 reveal delay-1">
              Compra <span class="text-gold">Aprovada!</span>
            </h1>
            <p class="obg-sub reveal delay-2">
              Seu acesso já foi enviado para o <strong>e-mail cadastrado</strong> no momento da compra.<br>
              Verifique sua caixa de entrada e a de spam nos próximos 2 minutos.
            </p>
            <div class="obg-steps reveal delay-3">
              <div class="obg-step">
                <span class="obg-step-num">1</span>
                <span>Acesse seu e-mail</span>
              </div>
              <div class="obg-step-arrow">→</div>
              <div class="obg-step">
                <span class="obg-step-num">2</span>
                <span>Clique no link de acesso</span>
              </div>
              <div class="obg-step-arrow">→</div>
              <div class="obg-step">
                <span class="obg-step-num">3</span>
                <span>Baixe seu PDF e aproveite!</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ CUPOM BUTZKE ══ -->
        <section class="section obg-cupom-section">
          <div class="container">
            <div class="obg-cupom-box reveal">
              <div class="obg-cupom-left">
                <div class="obg-cupom-tag">🎁 PRESENTE EXCLUSIVO PARA VOCÊ</div>
                <h2 class="obg-cupom-title">Sua próxima compra com <span class="text-gold">10% de desconto</span></h2>
                <p class="obg-cupom-desc">
                  Como agradecimento pela sua confiança, você ganhou um cupom exclusivo para usar na sua próxima compra em qualquer ebook da coleção.
                </p>
                <p class="obg-cupom-instrucoes">
                  👉 Na tela de checkout da Kirvano, insira o cupom abaixo e o desconto é aplicado automaticamente:
                </p>
              </div>
              <div class="obg-cupom-right">
                <div class="obg-cupom-code-label">SEU CUPOM EXCLUSIVO</div>
                <div class="obg-cupom-code" id="cupom-code">BUTZKE</div>
                <button class="obg-copy-btn" id="copy-cupom-btn" onclick="
                  navigator.clipboard.writeText('BUTZKE').then(() => {
                    const btn = document.getElementById('copy-cupom-btn');
                    btn.textContent = '✓ Copiado!';
                    btn.classList.add('copied');
                    setTimeout(() => { btn.textContent = '📋 Copiar Cupom'; btn.classList.remove('copied'); }, 2000);
                  });
                ">📋 Copiar Cupom</button>
                <div class="obg-cupom-valid">Válido para qualquer ebook da coleção</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ CROSS-SELL: OUTROS EBOOKS ══ -->
        ${otherEbooks.length > 0 ? `
        <section class="section section-alt obg-crosssell">
          <div class="container">
            <div class="section-header reveal">
              <div class="lsec-tag">COMPLETE SEU ACERVO ESPIRITUAL</div>
              <h2 class="section-title">Antes de fechar esta página — <span class="text-gold">oferta especial</span></h2>
              <p class="section-subtitle">
                Você acabou de dar um passo importante na sua jornada espiritual. Que tal ir ainda mais fundo?<br>
                Use o cupom <strong class="text-gold">BUTZKE</strong> e garanta 10% de desconto em qualquer um abaixo.
              </p>
            </div>

            <div class="obg-ebooks-grid">
              ${otherEbooks.map((e, i) => `
              <div class="obg-ebook-card card reveal delay-${(i % 3) + 1}" id="obg-card-${i}">
                <div class="obg-ebook-badge">${e.badge || 'EXCLUSIVO'}</div>
                <div class="obg-ebook-img-wrap">
                  <img src="${e.image}" alt="${e.title}" class="obg-ebook-img" loading="lazy">
                  <div class="obg-ebook-img-overlay">
                    <span class="obg-ebook-icon">${e.icon || '📖'}</span>
                  </div>
                </div>
                <div class="obg-ebook-info">
                  <div class="obg-ebook-cat">${e.category}</div>
                  <h3 class="obg-ebook-title">${e.title}</h3>
                  <p class="obg-ebook-desc">${e.shortDesc}</p>

                  <div class="obg-ebook-features">
                    ${e.features.slice(0, 3).map(f => `
                    <div class="obg-feat-item">
                      <span class="text-gold">✦</span>
                      <span>${f}</span>
                    </div>`).join('')}
                  </div>

                  <div class="obg-ebook-price-area">
                    <div class="obg-ebook-from">De R$ ${e.priceFrom.toFixed(2).replace('.', ',')}</div>
                    <div class="obg-ebook-price">
                      <span class="obg-price-currency">R$</span>
                      <span class="obg-price-num">${e.priceTo.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="obg-cupom-hint">
                      🏷️ Use cupom <strong>BUTZKE</strong> e pague ainda menos
                    </div>
                  </div>

                  <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer obg-ebook-btn" id="obg-ebook-btn-${i}">
                    Garantir Este Ebook Agora
                  </a>
                  <a href="/ebook/${e.slug}" class="obg-ver-mais">Ver página completa →</a>
                </div>
              </div>`).join('')}
            </div>
          </div>
        </section>
        ` : ''}

        <!-- ══ MENSAGEM FINAL ══ -->
        <section class="section obg-final">
          <div class="container" style="max-width:700px;text-align:center">
            <div class="ornament">✦ ✦ ✦</div>
            <h2 class="section-title" style="margin: 24px 0">
              Que sua jornada seja <span class="text-gold">iluminada</span>
            </h2>
            <p style="color:#aaa;line-height:1.8;margin-bottom:32px">
              O conhecimento que você acabou de adquirir foi reunido com respeito, estudo e dedicação.<br>
              Aplique-o com fé, com ética e com o coração aberto. Os resultados virão.
            </p>
            <a href="/ebooks" class="btn btn-outline">Ver Todos os eBooks</a>
          </div>
        </section>

      </main>

      ${footerHtml}
    `;

    Navbar.init();

    // Reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    this.container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (window.Analytics) {
      window.Analytics.sendData('VISITA', 'Acessou a Página', 'Obrigado (Pós-Venda)');
    }
  }
}
