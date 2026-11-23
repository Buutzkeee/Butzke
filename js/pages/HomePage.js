import { Router } from '../router.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { ebooksData, bibliotecaBundle } from '../data/ebooks.js';

const WA = 'https://wa.me/5551992395284?text=Ol%C3%A1%20Buutzke%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20atendimento%20espiritual.';

export class HomePage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('/css/home.css');
    this._render();
    Navbar.init();
    Router.initReveal();
    this._particles();
    this._initFaq();
    this._initCounters();
    this._initStickyBar();
  }

  _render() {
    this.container.innerHTML =
      Navbar.render('home') +
      `<main>
        ${this._hero()}
        ${this._ebooks()}
        ${this._acervoCompleto()}
        ${this._porqueEstudar()}
        ${this._sobre()}
        ${this._instagram()}
        ${this._depoimentos()}
        ${this._faq()}
      </main>
      ${this._stickyBar()}
      ` +
      Footer.render();
  }

  /* ---- HERO ---- */
  _hero() {
    return `
    <section class="hero" id="home">
      <canvas id="heroCanvas" class="hero-canvas" aria-hidden="true"></canvas>
      <div class="hero-orb orb1" aria-hidden="true"></div>
      <div class="hero-orb orb2" aria-hidden="true"></div>

      <div class="container hero-body">
        <div class="hero-left">
          <div class="hero-badge reveal">
            <span>🔱</span>
            <span>QUIMBANDA · EXU · GOETIA · UMBANDA</span>
          </div>

          <h1 class="hero-title reveal delay-1">
            BUUTZKE<br>
            <span class="text-gold glow-text">CONHECIMENTO</span><br>
            <span class="title-sub">ESPIRITUALIDADE SEM FANTASIAS.</span>
          </h1>

          <p class="hero-sub reveal delay-2">
            Grimórios práticos, estudos aprofundados e rituais com fundamentos reais. 
            Desenvolvido para quem busca poder pessoal, prosperidade e proteção sem intermediários.
          </p>

          <div class="hero-trust-strip reveal delay-2">
            <div class="hero-trust-item">
              <span class="icon">⚡</span> <span>Download Imediato em PDF</span>
            </div>
            <div class="hero-trust-item">
              <span class="icon">🛡️</span> <span>Garantia de 7 Dias</span>
            </div>
            <div class="hero-trust-item">
              <span class="icon">🔒</span> <span>Pagamento 100% Seguro</span>
            </div>
          </div>

          <div class="hero-ctas reveal delay-3">
            <a href="/ebooks" class="btn btn-primary btn-lg btn-shimmer" id="hero-ebooks">
              <span>📖</span>
              <span>CONHECER OS GRIMÓRIOS</span>
            </a>
            <a href="${WA}" target="_blank" rel="noopener" class="btn btn-outline btn-lg" id="hero-consultas">
              <span>💬</span>
              <span>AGENDAR CONSULTA</span>
            </a>
          </div>

          <div class="hero-stats reveal delay-4">
            <div class="hstat">
              <div class="hstat-n-wrap">
                <span class="hstat-n" data-count="112">0</span>
                <span class="hstat-suffix">mil</span>
              </div>
              <span class="hstat-l">SEGUIDORES</span>
            </div>
            <div class="hstat">
              <div class="hstat-n-wrap">
                <span class="hstat-n">MILHÕES</span>
              </div>
              <span class="hstat-l">DE VIEWS</span>
            </div>
            <div class="hstat">
              <div class="hstat-n-wrap">
                <span class="hstat-n">5</span>
                <span class="hstat-suffix">OBRAS</span>
              </div>
              <span class="hstat-l">PUBLICADAS</span>
            </div>
            <div class="hstat">
              <div class="hstat-n-wrap">
                <span class="hstat-n">+650</span>
              </div>
              <span class="hstat-l">LEITORES ATIVOS</span>
            </div>
          </div>
        </div>

        <div class="hero-right reveal delay-2">
          <div class="hero-photo-wrap">
            <img src="/assets/foto-hero.jpg" alt="Eduardo Souza — BUUTZKE" class="hero-photo" width="440" height="540" fetchpriority="high">
            <div class="hero-photo-badge">
              <div>
                <div class="hpb-name">Eduardo Souza</div>
                <div class="hpb-title">Sacerdote & Escritor • Buutzke</div>
              </div>
              <div class="hpb-dot" title="Disponível para orientações"></div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ---- EBOOKS MAIS VENDIDOS ---- */
  _ebooks() {
    const destaque = ebooksData.filter(e => e.featured).slice(0, 3);

    const cards = destaque.map((e, i) => {
      const discount = e.priceFrom && e.priceTo
        ? Math.round(((e.priceFrom - e.priceTo) / e.priceFrom) * 100)
        : 0;

      return `
      <article class="ebook-card reveal delay-${i + 1}" id="card-${e.slug}">
        ${e.badge ? `
          <div class="ebook-card-badge">
            <span class="badge ${e.badge === 'MAIS VENDIDO' ? 'badge-hot' : 'badge-gold'}">
              ${e.badge}
            </span>
          </div>` : ''}

        <div class="ebook-card-cover-wrap">
          <img src="${e.imageHome || e.image}" alt="${e.title}" loading="lazy" class="ebook-card-cover">
        </div>

        <div class="ebook-card-cat">${e.category || 'Grimório'}</div>
        <h3 class="ebook-card-title">${e.title}</h3>
        <p class="ebook-card-desc">${e.shortDesc ? e.shortDesc.substring(0, 120) + '...' : e.subtitle}</p>

        <div class="ebook-card-price-box">
          ${e.priceFrom ? `<span class="price-from">R$ ${e.priceFrom.toFixed(2).replace('.', ',')}</span>` : ''}
          <span class="price-to">R$ ${e.priceTo.toFixed(2).replace('.', ',')}</span>
          ${discount > 0 ? `<span class="price-discount-pill">-${discount}% OFF</span>` : ''}
        </div>

        <div class="ebook-card-actions">
          <a href="${e.paymentLink}" target="_blank" rel="noopener" class="btn btn-primary btn-shimmer btn-buy" id="btn-buy-${e.slug}">
            <span>⚡</span> <span>GARANTIR POR R$ ${e.priceTo.toFixed(2).replace('.', ',')}</span>
          </a>
          <a href="/ebook/${e.slug}" class="btn btn-outline btn-details" id="btn-ver-${e.slug}">
            <span>📖</span> <span>Ver Sumário Completo & Detalhes →</span>
          </a>
        </div>
      </article>`;
    }).join('');

    return `
    <section class="section ebooks-home" id="ebooks">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">MATERIAIS DE ESTUDO</span>
          <h2 class="section-title">Conhecimento que vai além<br><span class="text-gold">da superfície</span></h2>
          <p class="section-subtitle">
            Cada grimório foi desenvolvido a partir de pesquisa tradicional, prática direta e rituais comprovados.
          </p>
        </div>

        <div class="ebooks-grid">
          ${cards}
        </div>

        <div style="text-align: center; margin-top: 48px;" class="reveal">
          <a href="/ebooks" class="btn btn-outline btn-lg" id="home-ver-todos">
            <span>Explorar Todos os 5 eBooks</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- ACERVO COMPLETO (VIP BUNDLE) ---- */
  _acervoCompleto() {
    const bundle = bibliotecaBundle;

    return `
    <section class="section acervo-completo-home section-alt" id="acervo-completo">
      <div class="container">
        <div class="bundle-box reveal">
          <div style="text-align: center;">
            <span class="section-tag" style="background: rgba(212,175,55,0.15);">💎 OFERTA DE COLECIONADOR</span>
            <h2 style="font-size: clamp(2rem, 4.5vw, 2.8rem); margin-bottom: 12px; color: #ffffff;">
              Biblioteca Completa <span class="text-gold">BUUTZKE</span>
            </h2>
            <p style="color: var(--text-secondary); margin: 0 auto; max-width: 680px; font-size: 1.05rem;">
              Tenha acesso a todos os grimórios digitais com desconto exclusivo de pacote. 
              Mais de 169 páginas de rituais, banimentos, evocações e feitiços reais.
            </p>
          </div>

          <div class="bundle-perks-grid">
            <div class="bundle-perk-card">
              <div class="bpc-icon">⚡</div>
              <strong class="bpc-title">Entrega Imediata</strong>
              <p class="bpc-desc">Download direto no e-mail assim que a compra for aprovada.</p>
            </div>
            <div class="bundle-perk-card">
              <div class="bpc-icon">📱</div>
              <strong class="bpc-title">Universal & Vitalício</strong>
              <p class="bpc-desc">PDF em alta resolução para celular, Kindle, tablet ou PC.</p>
            </div>
            <div class="bundle-perk-card">
              <div class="bpc-icon">🛡️</div>
              <strong class="bpc-title">Garantia Blindada</strong>
              <p class="bpc-desc">7 dias de garantia incondicional pela plataforma Kirvano.</p>
            </div>
            <div class="bundle-perk-card">
              <div class="bpc-icon">🎁</div>
              <strong class="bpc-title">Bônus Exclusivo</strong>
              <p class="bpc-desc">Volume II da Quimbanda incluso gratuitamente no pacote.</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 36px;">
            <div style="display: inline-flex; align-items: baseline; gap: 14px; margin-bottom: 24px;">
              <span style="font-size: 1.1rem; text-decoration: line-through; color: var(--text-faint);">
                De R$ ${bundle.priceFrom.toFixed(2).replace('.', ',')}
              </span>
              <span style="font-family: var(--font-title); font-size: 2.6rem; font-weight: 700; color: var(--gold-light);">
                Por R$ ${bundle.priceTo.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
              <a href="/ebooks" class="btn btn-primary btn-lg btn-shimmer" id="home-acervo-cta" style="padding: 18px 40px; font-size: 1rem;">
                <span>📖</span> <span>CONHECER A BIBLIOTECA COMPLETA</span>
              </a>
              <a href="${WA}" target="_blank" rel="noopener" class="btn btn-outline btn-lg">
                <span>💬</span> <span>TIRAR DÚVIDAS NO WHATSAPP</span>
              </a>
            </div>

            <div style="margin-top: 20px; display: flex; justify-content: center; gap: 24px; font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
              <span>✓ Pix com liberação no mesmo segundo</span>
              <span>✓ Cartão em até 12x</span>
              <span>✓ Sem mensalidade ou renovação</span>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ---- DIFERENCIAIS ---- */
  _porqueEstudar() {
    const pilares = [
      { icon: '📐', title: 'CONTEÚDO ESTRUTURADO', desc: 'Ordem lógica e progressão segura de aprendizado — sem as contradições perigosas que circulam soltas na internet.' },
      { icon: '💬', title: 'LINGUAGEM DIRETA', desc: 'Assuntos profundos explicados com clareza objetiva, sem academicismo enfadonho nem mistificações teatrais.' },
      { icon: '🔍', title: 'FUNDAMENTO & PESQUISA', desc: 'Conteúdo baseado em tradições espirituais sólidas e vivência direta com as forças tratadas.' },
      { icon: '📱', title: 'ACESSO VITALÍCIO', desc: 'Estude quando quiser, no seu ritmo, em qualquer dispositivo. Você compra uma vez e o PDF é seu para sempre.' },
    ];

    return `
    <section class="section porque-section" id="porque">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">POR QUE BUUTZKE?</span>
          <h2 class="section-title">O que nos diferencia do<br><span class="text-gold">conteúdo comum</span></h2>
        </div>

        <div class="porque-grid">
          ${pilares.map((p, i) => `
          <div class="card porque-card reveal delay-${i + 1}">
            <div class="porque-icon">${p.icon}</div>
            <h3 class="porque-title">${p.title}</h3>
            <p class="porque-desc">${p.desc}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- SOBRE EDUARDO SOUZA ---- */
  _sobre() {
    return `
    <section class="section sobre-home" id="sobre">
      <div class="container sobre-grid">
        <div class="sobre-visual reveal">
          <div class="sobre-photo-wrap">
            <img src="/assets/foto-sobre.jpg" alt="Eduardo Souza — BUUTZKE" class="sobre-photo" loading="lazy">
          </div>
        </div>

        <div class="sobre-text reveal delay-2">
          <span class="section-tag" style="padding: 4px 14px; font-size: 0.68rem;">QUEM ESTÁ POR TRÁS DO BUUTZKE?</span>
          <h2 class="section-title" style="margin-bottom: 20px;">Eduardo Souza</h2>
          
          <p style="margin-bottom: 18px; font-size: 1rem;">
            O BUUTZKE nasceu com o objetivo claro de desmistificar e trazer a verdade sobre Quimbanda, Umbanda, Exu e Ocultismo prático.
          </p>
          <p style="margin-bottom: 24px; font-size: 0.95rem;">
            Em um meio repleto de promessas milagrosas e desinformação, meu compromisso é entregar fundamentos reais que você possa aplicar para proteger seu lar, abrir seus caminhos materiais e alcançar estabilidade espiritual.
          </p>

          <div style="display: flex; gap: 32px; margin-bottom: 32px; flex-wrap: wrap;">
            <div>
              <div style="font-family: var(--font-title); font-size: 1.9rem; color: var(--gold-light); font-weight: 700;">+112 mil</div>
              <div style="font-size: 0.72rem; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase;">Seguidores no Instagram</div>
            </div>
            <div>
              <div style="font-family: var(--font-title); font-size: 1.9rem; color: var(--gold-light); font-weight: 700;">5 Grimórios</div>
              <div style="font-size: 0.72rem; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase;">Publicados e Aprovados</div>
            </div>
            <div>
              <div style="font-family: var(--font-title); font-size: 1.9rem; color: var(--gold-light); font-weight: 700;">Diário</div>
              <div style="font-size: 0.72rem; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase;">Estudo & Vídeos Novos</div>
            </div>
          </div>

          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <a href="https://www.instagram.com/buutzke/" target="_blank" rel="noopener" class="btn btn-primary" id="sobre-ig">
              <span>📷</span> <span>SEGUIR NO INSTAGRAM</span>
            </a>
            <a href="${WA}" target="_blank" rel="noopener" class="btn btn-outline" id="sobre-wa">
              <span>💬</span> <span>FALAR COM BUUTZKE</span>
            </a>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ---- INSTAGRAM REELS ---- */
  _instagram() {
    const vids = [
      { id: 1, title: 'Maria Navalha', url: 'https://www.instagram.com/reel/DXkPahDAloD/', shortcode: 'DXkPahDAloD' },
      { id: 2, title: 'Cigana Puere', url: 'https://www.instagram.com/reel/DYUtkDLC7-e/', shortcode: 'DYUtkDLC7-e' },
      { id: 3, title: 'Exu 7 Facadas', url: 'https://www.instagram.com/reel/DXelfccggMg/', shortcode: 'DXelfccggMg' },
      { id: 4, title: 'Exu Tiriri', url: 'https://www.instagram.com/reel/DYm58pJCWtG/', shortcode: 'DYm58pJCWtG' }
    ];

    return `
    <section class="section ig-section" id="instagram">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">CONTEÚDO DIÁRIO</span>
          <h2 class="section-title">+112 mil pessoas acompanham<br><span class="text-gold">o Buutzke diariamente</span></h2>
          <p class="section-subtitle">Confira alguns dos ensinamentos compartilhados nas redes.</p>
        </div>

        <div class="ig-reels-grid">
          ${vids.map((v, i) => `
          <div class="ig-reel-frame reveal delay-${i + 1}">
            <iframe 
              src="https://www.instagram.com/p/${v.shortcode}/embed/captioned" 
              width="100%" 
              height="520" 
              frameborder="0" 
              scrolling="no" 
              allowtransparency="true" 
              loading="lazy"
              title="${v.title}">
            </iframe>
          </div>`).join('')}
        </div>

        <div style="text-align: center; margin-top: 48px;" class="reveal">
          <a href="https://www.instagram.com/buutzke/" target="_blank" rel="noopener" class="btn btn-outline btn-lg" id="home-ver-ig">
            <span>📷</span> <span>VER MAIS NO INSTAGRAM (@BUUTZKE)</span>
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- DEPOIMENTOS REALISTAS ---- */
  _depoimentos() {
    const deps = [
      { stars: 5, text: 'Fiz o ritual de abertura de caminhos no dia seguinte que comprei. Em duas semanas veio uma proposta de trabalho que dobrou meu salário. Eu ainda não acredito.', author: 'Marina S.', location: 'Rio de Janeiro / RJ', tag: 'eBook Quimbanda' },
      { stars: 5, text: 'O capítulo sobre os 72 daemons e a adaptação do ritual para quem não tem rios de dinheiro em paramentos vale mais que qualquer curso de mil reais.', author: 'Renata V.', location: 'Porto Alegre / RS', tag: 'eBook Goetia' },
      { stars: 5, text: 'A clareza com que o Eduardo desmistificou a Goetia é surreal. Sempre tive receio de praticar por causa dos mitos da internet. Fiz meu primeiro trabalho e fechei o maior contrato da empresa.', author: 'Guilherme B.', location: 'São Paulo / SP', tag: 'eBook Goetia' },
      { stars: 5, text: 'O banho de prosperidade que aprendi no primeiro capítulo trouxe clientes para minha loja já no dia seguinte. O poder das ervas é real, basta saber usar!', author: 'Amanda P.', location: 'Goiânia / GO', tag: 'Grimório das Ervas' },
      { stars: 5, text: 'Meu ex voltou sem humilhação, sem loucura, exatamente como o ritual de Pombagira orientou. Material de extrema seriedade e respeito.', author: 'Rafael M.', location: 'São Paulo / SP', tag: 'eBook Quimbanda' },
      { stars: 5, text: 'Levei anos com uma demanda pesada no trabalho e ninguém resolvia. O grimório me deu a proteção exata. Hoje durmo em paz pela primeira vez.', author: 'Juliana R.', location: 'Salvador / BA', tag: 'eBook Quimbanda' },
    ];

    const stars = n => '★'.repeat(n);

    return `
    <section class="section dep-section" id="depoimentos">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">PROVA SOCIAL REAL</span>
          <h2 class="section-title">Resultados de quem foi<br><span class="text-gold">além da superfície</span></h2>
          <p class="section-subtitle">Depoimentos verificados de leitores e praticantes dos grimórios.</p>
        </div>

        <div class="dep-grid">
          ${deps.map((d, i) => `
          <div class="card dep-card reveal delay-${(i % 3) + 1}">
            <div class="dep-stars">${stars(d.stars)}</div>
            <div class="dep-quote" aria-hidden="true">“</div>
            <p class="dep-text">"${d.text}"</p>
            <div class="dep-foot">
              <div>
                <span class="dep-author">${d.author}</span>
                <span class="dep-location">${d.location}</span>
              </div>
              <span class="dep-tag">${d.tag}</span>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- FAQ ACCORDION ---- */
  _faq() {
    const faqs = [
      { q: 'Como recebo os eBooks após a compra?', a: 'Imediatamente após a confirmação do pagamento. O PDF em alta definição é enviado automaticamente para o seu e-mail cadastrado na Kirvano. Você pode baixar no celular, tablet, computador ou Kindle.' },
      { q: 'Os materiais são digitais ou físicos?', a: 'Todos os títulos são digitais (eBooks em formato PDF de alta resolução), prontos para leitura imediata ou impressão pessoal sem frete e sem espera.' },
      { q: 'Preciso ter experiência prévia para praticar?', a: 'Não. Todos os grimórios foram escritos com metodologia progressiva: explicam a base, os cuidados, os ingredientes acessíveis e o passo a passo ritual para que iniciantes pratiquem com segurança absoluta.' },
      { q: 'Existe garantia se eu não gostar?', a: 'Sim! Você tem 7 dias de garantia incondicional assegurada pela plataforma Kirvano. Se por qualquer motivo não ficar satisfeito, basta um e-mail para receber 100% do seu dinheiro de volta sem burocracia.' },
      { q: 'O pagamento é seguro?', a: 'Totalmente. O processamento é realizado pela Kirvano, uma das plataformas mais modernas e seguras do Brasil, com criptografia de ponta a ponta. Aceita Pix instantâneo, Cartão de Crédito e Boleto.' },
      { q: 'O acesso aos materiais é vitalício?', a: 'Sim, 100% vitalício. Você adquire o exemplar uma única vez, sem qualquer mensalidade ou taxa oculta, e ele permanece com você para sempre.' },
    ];

    return `
    <section class="section faq-section section-alt" id="faq">
      <div class="container" style="max-width: 820px;">
        <div class="section-header reveal">
          <span class="section-tag">DÚVIDAS FREQUENTES</span>
          <h2 class="section-title">Perguntas & <span class="text-gold">Respostas</span></h2>
        </div>

        <div class="faq-list">
          ${faqs.map((f, i) => `
          <div class="faq-item reveal" id="faq-item-${i}">
            <button class="faq-q" id="faq-btn-${i}" aria-expanded="false">
              <span>${f.q}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-a" id="faq-a-${i}">
              <div class="faq-a-inner">
                <p>${f.a}</p>
              </div>
            </div>
          </div>`).join('')}
        </div>

        <div style="text-align: center; margin-top: 48px;" class="reveal">
          <p style="margin-bottom: 16px; color: var(--text-secondary);">Ainda ficou com alguma dúvida sobre os grimórios?</p>
          <a href="${WA}" target="_blank" rel="noopener" class="btn btn-outline" id="faq-wa">
            <span>💬</span> <span>Fale Comigo Diretamente no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- STICKY BOTTOM CONVERSION DOCK ---- */
  _stickyBar() {
    return `
    <div class="sticky-convert-bar" id="sticky-convert-bar" aria-hidden="true">
      <div class="scb-info">
        <span class="scb-title">⚡ Grimórios Digitais BUUTZKE</span>
        <span class="scb-sub">Acesso imediato em PDF a partir de R$ 29,90</span>
      </div>
      <div class="scb-actions">
        <a href="/ebooks" class="btn btn-primary scb-btn btn-shimmer" id="scb-cta">
          Ver eBooks
        </a>
      </div>
    </div>`;
  }

  /* ---- INTERACTION SCRIPTS ---- */
  _initFaq() {
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  _initCounters() {
    const targets = document.querySelectorAll('.hstat-n[data-count]');
    if (!targets.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.ceil(end / 35);
        const timer = setInterval(() => {
          current += step;
          if (current >= end) {
            el.textContent = end;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 30);
        obs.unobserve(el);
      });
    }, { threshold: 0.3 });
    targets.forEach(t => obs.observe(t));
  }

  _initStickyBar() {
    const bar = document.getElementById('sticky-convert-bar');
    if (!bar) return;

    let shown = false;
    const onScroll = () => {
      const top = window.scrollY;
      if (top > 450 && !shown) {
        bar.classList.add('visible');
        bar.setAttribute('aria-hidden', 'false');
        shown = true;
      } else if (top <= 450 && shown) {
        bar.classList.remove('visible');
        bar.setAttribute('aria-hidden', 'true');
        shown = false;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Canvas ambient particles */
  _particles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const pts = Array.from({ length: 45 }, () => this._newPt(canvas.width, canvas.height));
    let raf;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + Math.floor(p.o * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.o -= 0.0012;
        if (p.o <= 0 || p.y < -10) Object.assign(p, this._newPt(canvas.width, canvas.height));
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener('hashchange', () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    }, { once: true });
  }

  _newPt(w, h) {
    return {
      x: Math.random() * w,
      y: h + 10,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.55 + 0.2),
      o: Math.random() * 0.45 + 0.25,
      c: Math.random() > 0.4 ? '#d4af37' : '#8b0000',
    };
  }
}
