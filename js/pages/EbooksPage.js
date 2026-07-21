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
              <div class="ebook-full-card card reveal delay-${i + 1}" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; position: relative;">
                
                <div style="width: 100%; height: 350px; position: relative; overflow: hidden; border-bottom: 1px solid var(--gold-border-hover);">
                  <img src="${e.image}" alt="${e.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                  <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to top, var(--bg-card) 0%, transparent 100%); pointer-events: none;"></div>
                  
                  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding: 50px 20px 20px; pointer-events: none; background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%);">
                    <h3 style="font-family: var(--font-title); font-size: 1.8rem; color: var(--gold); text-align: center; text-transform: uppercase; text-shadow: 0 4px 15px rgba(0,0,0,1), 0 2px 5px rgba(0,0,0,0.8); line-height: 1.1; margin: 0;">
                      ${e.title.split(': ')[0]}<br><span style="font-size: 1.3rem; color: #fff; display:block; margin-top: 8px;">${e.title.split(': ')[1] || ''}</span>
                    </h3>
                    <div style="margin-top: auto; font-family: var(--font-text); font-size: 0.9rem; color: var(--gold); text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 2px 10px rgba(0,0,0,1);">Eduardo Souza</div>
                  </div>

                  <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 8px; align-items: flex-end; z-index: 2;">
                    ${e.badge ? `<span class="badge badge-gold" style="box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-weight: 700;">${e.badge}</span>` : ''}
                    <span class="badge badge-red" style="background: rgba(8,8,8,0.85); box-shadow: 0 4px 15px rgba(0,0,0,0.5);">${e.category}</span>
                  </div>
                </div>

                <div style="padding: 32px; display: flex; flex-direction: column; flex-grow: 1;">
                  <h2 class="efc-title" style="text-align: center; font-size: 1.4rem; margin-bottom: 6px; letter-spacing: 0.5px;">${e.title}</h2>
                  <p class="efc-sub" style="text-align: center; color: var(--gold); text-transform: uppercase; letter-spacing: 2px; font-size: 0.72rem; font-weight: 700; margin-bottom: 16px;">${e.subtitle}</p>
                  <p class="efc-desc" style="text-align: center; font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 28px;">${e.shortDesc}</p>
                  
                  <ul class="efc-topics" style="flex-grow: 1; margin-bottom: 30px; display: flex; flex-direction: column; gap: 12px; padding: 0;">
                    ${e.topics.map(t => `<li style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: flex-start; gap: 10px; line-height: 1.4;"><span style="color:var(--red-light); font-size: 1rem; margin-top: -2px;">✦</span> ${t}</li>`).join('')}
                  </ul>
                  
                  <div class="efc-price-row" style="justify-content: center; align-items: center; gap: 12px; display: flex; margin-bottom: 24px;">
                    ${e.priceFrom ? `<span class="efc-from" style="font-size: 0.85rem; text-decoration: line-through; color: var(--text-faint);">De R$ ${e.priceFrom.toFixed(2).replace('.', ',')}</span>` : ''}
                    <span class="efc-price ${!e.priceTo ? 'price-tba' : ''}" style="font-size: 2rem; font-family: var(--font-title); color: var(--gold); font-weight: 700; text-shadow: 0 0 10px rgba(234,171,94,0.15);">${e.priceTo ? 'R$ ' + e.priceTo.toFixed(2).replace('.', ',') : 'Em breve'}</span>
                  </div>
                  
                  <div class="efc-actions" style="display: flex; gap: 12px;">
                    ${e.featured ? `<a href="javascript:void(0)" onclick="Router.go('/ebook/${e.slug}')" class="btn btn-outline" style="flex:1; text-align: center; padding: 12px 0;" id="efc-ver-${e.slug}">Ver detalhes</a>` : ''}
                    <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-shimmer" style="flex:1.5; text-align: center; padding: 12px 0;" id="efc-buy-${e.slug}">
                      ${e.priceTo ? 'COMPRAR AGORA' : 'SAIBA MAIS'}
                    </a>
                  </div>
                </div>
              </div>`).join('')}
            </div>
          </div>
        </section>
      </main>` +
      Footer.render();
  }
}
