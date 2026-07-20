import { Router }    from '../router.js';
import { Navbar }    from '../components/Navbar.js';
import { Footer }    from '../components/Footer.js';
import { ebooksData } from '../data/ebooks.js';

export class EbooksPage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('css/ebooks.css');
    this._render();
    Navbar.init();
    Router.initReveal();
  }

  _render() {
    this.container.innerHTML =
      Navbar.render('ebooks') +
      `<main>
        <section class="section ebooks-page">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Biblioteca</span>
              <h1 class="section-title">Todos os <span class="text-gold">eBooks</span></h1>
              <p class="section-subtitle">Conhecimento espiritual real, direto da fonte. Sem intermediário, sem enganação.</p>
            </div>
            <div class="ebooks-full-grid">
              ${ebooksData.map((e, i) => `
              <div class="ebook-full-card card reveal delay-${i + 1}">
                <div class="efc-top">
                  <div class="efc-icon">${e.icon}</div>
                  <div class="efc-meta">
                    ${e.badge ? `<span class="badge badge-gold">${e.badge}</span>` : ''}
                    <span class="efc-cat">${e.category}</span>
                  </div>
                </div>
                <h2 class="efc-title">${e.title}</h2>
                <p class="efc-sub">${e.subtitle}</p>
                <p class="efc-desc">${e.shortDesc}</p>
                <ul class="efc-topics">
                  ${e.topics.map(t => `<li>✦ ${t}</li>`).join('')}
                </ul>
                <div class="efc-price-row">
                  ${e.priceFrom ? `<span class="efc-from">De R$ ${e.priceFrom.toFixed(2).replace('.', ',')}</span>` : ''}
                  <span class="efc-price ${!e.priceTo ? 'price-tba' : ''}">${e.priceTo ? 'R$ ' + e.priceTo.toFixed(2).replace('.', ',') : 'Em breve'}</span>
                </div>
                <div class="efc-actions">
                  ${e.featured
                    ? `<a href="/ebook/${e.slug}" class="btn btn-outline" id="efc-ver-${e.slug}">Ver detalhes</a>`
                    : ''}
                  <a href="${e.featured ? '#/ebook/' + e.slug : e.paymentLink}"
                     ${!e.featured ? 'target="_blank"' : ''}
                     class="btn btn-primary btn-shimmer"
                     id="efc-buy-${e.slug}">
                    ${e.priceTo ? 'Comprar Agora' : 'Saiba Mais'}
                  </a>
                </div>
              </div>`).join('')}
            </div>
          </div>
        </section>
      </main>` +
      Footer.render();
  }
}
