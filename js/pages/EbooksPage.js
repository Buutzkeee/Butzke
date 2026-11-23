import { Router }    from '../router.js';
import { Navbar }    from '../components/Navbar.js';
import { Footer }    from '../components/Footer.js';
import { ebooksData, bibliotecaBundle } from '../data/ebooks.js';

export class EbooksPage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('/css/ebooks.css');
    this.currentCategory = 'all';
    this._render();
    Navbar.init();
    Router.initReveal();
    this._initFilters();
  }

  _render() {
    this.container.innerHTML =
      Navbar.render('ebooks') +
      `<main>
        <section class="section ebooks-page">
          <div class="container">
            <header class="section-header reveal">
              <span class="section-tag">BIBLIOTECA OCULTA BUUTZKE</span>
              <h1 class="section-title">Grimórios que <span class="text-gold">Transformam a Prática</span></h1>
              <p class="section-subtitle">
                Obras fundamentadas sem intermediários, sem invenções e sem romantismo. 
                Rituais autênticos, banimentos, evocações e a sabedoria ancestral da Quimbanda, Goetia e Umbanda.
              </p>
              
              <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 20px; font-size: 0.8rem; color: var(--text-muted);">
                <span>⚡ Acesso Imediato em PDF</span>
                <span>🛡️ Garantia de 7 Dias</span>
                <span>🔒 Pagamento Seguro (Pix ou Cartão)</span>
                <span>🔥 +650 Alunos e Praticantes</span>
              </div>
            </header>

            <!-- Filtros de Categoria -->
            <nav class="ebooks-filter-bar reveal" aria-label="Filtrar por categoria">
              <button class="filter-chip active" data-cat="all">Todos os Grimórios</button>
              <button class="filter-chip" data-cat="Quimbanda">Quimbanda & Exu</button>
              <button class="filter-chip" data-cat="Goetia">Goetia & Alta Magia</button>
              <button class="filter-chip" data-cat="Ervas">Ervas & Banhos</button>
              <button class="filter-chip" data-cat="Umbanda">Umbanda & Erês</button>
            </nav>

            <!-- Grid de eBooks -->
            <div class="ebooks-full-grid" id="ebooks-grid">
              ${this._renderCards(ebooksData)}
            </div>

            <!-- Box VIP Bundle Promocional -->
            <div style="margin-top: 60px;">
              ${this._renderBundleBox()}
            </div>
          </div>
        </section>
      </main>` +
      Footer.render();
  }

  _renderCards(list) {
    return list.map((e, i) => {
      const discount = e.priceFrom && e.priceTo
        ? Math.round(((e.priceFrom - e.priceTo) / e.priceFrom) * 100)
        : 0;

      const titleParts = e.title.includes(': ') ? e.title.split(': ') : [e.title, ''];

      return `
      <article class="ebook-full-card card reveal visible delay-${(i % 3) + 1}" data-cat="${e.category}" id="efc-${e.slug}">
        <div class="efc-media">
          <img src="${e.image}" alt="${e.title}" loading="lazy" class="efc-cover-img" />
          
          ${!e.hasCoverText ? `
          <div class="efc-cover-overlay">
            <h3 class="efc-cover-title">
              ${titleParts[0]}<br>
              <span class="efc-cover-sub">${titleParts[1]}</span>
            </h3>
            <span class="efc-cover-author">Eduardo Souza</span>
          </div>` : ''}

          <div class="efc-badges-wrap">
            ${e.badge ? `<span class="badge ${e.badge === 'MAIS VENDIDO' ? 'badge-hot' : 'badge-gold'}">${e.badge}</span>` : ''}
            <span class="badge badge-red">${e.category}</span>
          </div>
        </div>

        <div class="efc-body">
          <div class="efc-cat">${e.category}</div>
          <h2 class="efc-title">${e.title}</h2>
          <p class="efc-sub">${e.subtitle}</p>
          <p class="efc-desc">${e.shortDesc}</p>

          <div class="efc-topics">
            ${e.topics ? e.topics.map(t => `
              <div class="efc-topic-item">
                <span class="bullet" aria-hidden="true">✦</span>
                <span>${t}</span>
              </div>
            `).join('') : ''}
          </div>

          <div class="efc-footer">
            <div class="efc-price-row">
              <div class="efc-price-left">
                ${e.priceFrom ? `<span class="efc-from">De R$ ${e.priceFrom.toFixed(2).replace('.', ',')}</span>` : ''}
                <span class="efc-price">R$ ${e.priceTo.toFixed(2).replace('.', ',')}</span>
              </div>
              ${discount > 0 ? `<span class="efc-discount-badge">-${discount}% OFF</span>` : ''}
            </div>

            <div class="efc-actions">
              <a href="${e.paymentLink}" target="_blank" rel="noopener" class="btn btn-primary btn-shimmer btn-buy" id="btn-buy-${e.slug}">
                <span>⚡</span> <span>GARANTIR POR R$ ${e.priceTo.toFixed(2).replace('.', ',')}</span>
              </a>
              <a href="/ebook/${e.slug}" class="btn btn-outline btn-details" id="btn-ver-${e.slug}">
                <span>📖</span> <span>Ver Sumário Completo & Detalhes →</span>
              </a>
            </div>
          </div>
        </div>
      </article>`;
    }).join('');
  }

  _renderBundleBox() {
    const bundle = bibliotecaBundle;
    return `
    <div class="bundle-box reveal visible" style="background: linear-gradient(135deg, rgba(20, 16, 24, 0.95) 0%, rgba(12, 12, 16, 0.95) 100%); border: 1px solid rgba(212,175,55,0.4); border-radius: var(--radius-lg); padding: 48px 36px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.8);">
      <div style="position: absolute; top:0; left:0; right:0; height: 3px; background: linear-gradient(90deg, transparent, var(--gold-bright), transparent);"></div>
      <span class="section-tag" style="background: rgba(212,175,55,0.15);">💎 COLECIONADOR</span>
      <h2 style="font-size: clamp(1.8rem, 4vw, 2.4rem); color: #fff; margin-bottom: 10px;">
        Quer Todos os Grimórios? <span class="text-gold">Leve a Biblioteca Completa</span>
      </h2>
      <p style="color: var(--text-secondary); max-width: 620px; margin: 0 auto 24px; font-size: 0.98rem;">
        Quimbanda Vol. I + Goetia + Grimório das Ervas + <strong>Bônus Especial: Quimbanda Vol. II Grátis</strong>.
      </p>

      <div style="display: inline-flex; align-items: baseline; gap: 14px; margin-bottom: 24px;">
        <span style="font-size: 1rem; text-decoration: line-through; color: var(--text-faint);">
          De R$ ${bundle.priceFrom.toFixed(2).replace('.', ',')}
        </span>
        <span style="font-family: var(--font-title); font-size: 2.2rem; font-weight: 700; color: var(--gold-light);">
          Por R$ ${bundle.priceTo.toFixed(2).replace('.', ',')}
        </span>
      </div>

      <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <a href="/biblioteca" class="btn btn-primary btn-lg btn-shimmer" style="padding: 16px 36px;">
          <span>⚡</span> <span>CONHECER O PACOTE COMPLETO</span>
        </a>
      </div>
    </div>`;
  }

  _initFilters() {
    const chips = this.container.querySelectorAll('.filter-chip');
    const grid = document.getElementById('ebooks-grid');
    if (!chips.length || !grid) return;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const cat = chip.dataset.cat;
        this.currentCategory = cat;

        const filtered = cat === 'all'
          ? ebooksData
          : ebooksData.filter(e => (e.category || '').toLowerCase().includes(cat.toLowerCase()));

        grid.innerHTML = this._renderCards(filtered);
      });
    });
  }
}
