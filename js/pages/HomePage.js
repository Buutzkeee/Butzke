import { Router }    from '../router.js';
import { Navbar }    from '../components/Navbar.js';
import { Footer }    from '../components/Footer.js';
import { ebooksData, bibliotecaBundle } from '../data/ebooks.js';

const WA = 'https://wa.me/5551992395284';

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
  }

  _render() {
    this.container.innerHTML =
      Navbar.render('home') +
      `<main>
        ${this._hero()}
        ${this._ebooks()}
        ${this._bundle()}
        ${this._porqueStudar()}
        ${this._sobre()}
        ${this._instagram()}
        ${this._depoimentos()}
        ${this._faq()}
      </main>` +
      Footer.render();
  }

  /* ---- HERO ---- */
  _hero() {
    return `
    <section class="hero" id="home">
      <canvas id="heroCanvas" class="hero-canvas"></canvas>
      <div class="hero-orb orb1"></div>
      <div class="hero-orb orb2"></div>
      <div class="container hero-body">
        <div class="hero-left">
          <div class="hero-badge reveal">✦ QUIMBANDA · EXU · GOETIA · UMBANDA ✦</div>
          <h1 class="hero-title reveal delay-1">
            BUUTZKE<br>
            <span class="text-gold glow-text">CONHECIMENTO</span><br>
            <span style="font-size: 0.65em; font-weight: 400; color: var(--text-muted); font-family: var(--font-body); letter-spacing: 2px;">SEM FANTASIAS.</span>
          </h1>
          <p class="hero-sub reveal delay-2">
            Estudos, ebooks e conteúdos sobre Quimbanda, Umbanda e Ocultismo.<br>
            Para quem deseja ir além das informações superficiais encontradas na internet.
          </p>
          <div class="hero-ctas reveal delay-3">
            <a href="/ebooks" class="btn btn-primary btn-lg" id="hero-ebooks">
               📖 CONHECER OS EBOOKS
            </a>
            <a href="/biblioteca" class="btn btn-outline" id="hero-biblioteca" style="border-color: rgba(212,160,23,0.3); color: #f5c842;">
               🔱 ÁREA DE MEMBROS (ACERVO)
            </a>
          </div>
          <div class="hero-stats reveal delay-4">
            <div class="hstat">
              <span class="hstat-n" data-count="112">0</span><span class="hstat-suffix">mil</span>
              <span class="hstat-l">SEGUIDORES</span>
            </div>
            <div class="hstat">
              <span class="hstat-n">MILHÕES</span>
              <span class="hstat-l">DE VISUALIZAÇÕES</span>
            </div>
            <div class="hstat">
              <span class="hstat-n">5</span>
              <span class="hstat-l">EBOOKS PUBLICADOS</span>
            </div>
            <div class="hstat">
              <span class="hstat-n">DIÁRIO</span>
              <span class="hstat-l">CONTEÚDO NOVO</span>
            </div>
          </div>
        </div>
        <div class="hero-right reveal delay-2">
          <div class="hero-photo-wrap">
            <img src="/assets/foto-hero.jpg" alt="Eduardo Souza — BUUTZKE" class="hero-photo">
            <div class="hero-photo-glow"></div>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ---- EBOOKS ---- */
  _ebooks() {
    // Mostrar apenas os 3 mais vendidos / principais na home
    const destaque = ebooksData.filter(e => e.featured).slice(0, 3);

    const cards = destaque.map((e, i) => `
    <div class="ebook-card card reveal delay-${i + 1}" style="display: flex; flex-direction: column; height: 100%; position: relative; cursor: pointer;" onclick="Router.go('/ebook/${e.slug}')">
      ${e.badge ? `<span class="badge badge-gold" style="position: absolute; top: 16px; right: 16px; z-index: 2; font-weight: 700; font-size: 0.68rem; letter-spacing: 1px; ${e.badge === 'MAIS VENDIDO' ? 'background: linear-gradient(135deg,#c0392b,#8e1a10); color:#fff;' : e.badge === 'LANÇAMENTO' ? 'background: linear-gradient(135deg, #d4a017, #8b6508); color: #000;' : ''}">${e.badge}</span>` : ''}
      <div class="ebook-card-top" style="justify-content:center; margin-bottom: 20px; height: 280px; display: flex; align-items: center;">
        <img src="${e.imageHome}" alt="${e.title}" loading="lazy" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius:var(--radius-sm); border: 1px solid var(--gold-border-hover); box-shadow: 0 0 30px rgba(204,0,0,0.12); transition: transform 0.4s ease;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
      </div>
      <div class="ebook-card-cat" style="font-size: 0.68rem; font-weight: 700; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; margin-bottom: 6px;">${e.category}</div>
      <h3 style="font-size:1.1rem; letter-spacing:0.5px; margin-bottom:6px; line-height: 1.3;">${e.title}</h3>
      <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px; flex-grow: 1; line-height: 1.5;">${e.shortDesc.substring(0, 110)}...</p>
      ${e.priceTo ? `
      <div style="margin-bottom: 16px;">
        ${e.priceFrom ? `<span style="font-size: 0.78rem; text-decoration: line-through; color: var(--text-faint); margin-right: 6px;">De R$ ${e.priceFrom.toFixed(2).replace('.', ',')}</span>` : ''}
        <span style="font-size: 1.35rem; font-family: var(--font-title); color: var(--gold); font-weight: 700;">R$ ${e.priceTo.toFixed(2).replace('.', ',')}</span>
      </div>` : ''}
      <div style="display: flex; gap: 8px; margin-top: auto;">
        <a href="/ebook/${e.slug}" class="btn btn-outline" style="flex: 1; text-align:center; font-size: 0.8rem; padding: 10px;" onclick="event.stopPropagation()" id="ehome-ver-${e.slug}">Ver Detalhes</a>
        <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-shimmer" style="flex: 1.5; text-align:center; font-size: 0.82rem; padding: 10px;" onclick="event.stopPropagation()" id="ehome-buy-${e.slug}">
          ⚡ GARANTIR
        </a>
      </div>
    </div>`).join('');

    return `
    <section class="section ebooks-home" id="ebooks">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">MATERIAIS DE ESTUDO</span>
          <h2 class="section-title" style="font-size: clamp(1.8rem, 4vw, 2.6rem);">Conhecimento que vai além<br><span class="text-gold">da superfície</span></h2>
          <p class="section-subtitle">Ebooks desenvolvidos a partir de estudo, pesquisa e experiência dentro das tradições abordadas.</p>
          <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-top:16px; font-size:0.78rem; color:#888;">
            <span>⚡ Acesso Imediato em PDF</span>
            <span>🛡️ Garantia de 7 Dias</span>
            <span>🔒 Pagamento 100% Seguro</span>
          </div>
        </div>
        <div class="ebooks-grid">${cards}</div>
        <div style="text-align:center; margin-top: 40px;" class="reveal">
          <a href="/ebooks" class="btn btn-outline" id="home-ver-todos" style="padding: 14px 36px; font-size: 0.9rem; border-color: rgba(255,255,255,0.12); color: #fff;">
            Ver Todos os eBooks →
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- BUNDLE ---- */
  _bundle() {
    const b = bibliotecaBundle;
    const economia = (b.priceFrom - b.priceTo).toFixed(2).replace('.', ',');
    return `
    <section class="section bundle-home section-alt" id="biblioteca">
      <div class="container">
        <div class="bundle-box reveal" style="background: linear-gradient(135deg, #0f0f0f 0%, #161616 100%); border: 1px solid rgba(212,160,23,0.3); border-radius: 16px; padding: 52px 40px; max-width: 900px; margin: 0 auto; position: relative; overflow: hidden;">
          <div style="position:absolute; top:0; left:0; right:0; height: 2px; background: linear-gradient(90deg, transparent, rgba(212,160,23,0.6), transparent);"></div>
          <div style="text-align:center;">
            <div class="section-tag" style="margin-bottom: 16px;">🔱 REPOSITÓRIO EXCLUSIVO</div>
            <h2 style="font-size: clamp(1.6rem, 4vw, 2.4rem); margin-bottom: 10px;">Área de Membros BUUTZKE</h2>
            <p style="color: var(--text-muted); margin-bottom: 32px; font-size: 0.95rem;">Assine para ter acesso ilimitado a todo o acervo de manuscritos, leituras no navegador e ao Círculo de Discussão.</p>
          </div>

          <div class="bundle-items" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,51,0,0.15); border-radius: 10px; padding: 20px; text-align:center;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">🔱</div>
              <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; color: var(--gold); margin-bottom: 4px;">QUIMBANDA</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">O Caminho da Força</div>
              <div style="font-size: 0.75rem; color: #444; margin-top: 6px; text-decoration: line-through;">R$ 39,90</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,51,0,0.15); border-radius: 10px; padding: 20px; text-align:center;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">🔯</div>
              <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; color: var(--gold); margin-bottom: 4px;">GOETIA</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">A Arte da Soberania</div>
              <div style="font-size: 0.75rem; color: #444; margin-top: 6px; text-decoration: line-through;">R$ 49,90</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,51,0,0.15); border-radius: 10px; padding: 20px; text-align:center;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">🌿</div>
              <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; color: var(--gold); margin-bottom: 4px;">GRIMÓRIO DAS ERVAS</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Edição Expandida</div>
              <div style="font-size: 0.75rem; color: #444; margin-top: 6px; text-decoration: line-through;">R$ 39,90</div>
            </div>
          </div>

          <div style="background: rgba(212,160,23,0.08); border: 1px dashed rgba(212,160,23,0.3); border-radius: 10px; padding: 16px 24px; margin-bottom: 32px; text-align:center;">
            <div style="font-size: 0.7rem; letter-spacing: 2px; font-weight: 700; color: var(--gold); margin-bottom: 6px;">🎁 BÔNUS INCLUSO GRÁTIS</div>
            <div style="font-size: 0.9rem; color: var(--text);">Quimbanda: Segredos das Encruzilhadas (Vol. II)</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Avaliado em R$ 39,90 — incluso sem custo adicional</div>
          </div>

            <div style="font-size: 0.85rem; color: #f5c842; font-family:var(--font-title); margin-bottom: 4px;">Plano de Assinatura Mensal ou Anual</div>
            <div style="font-size: 2.8rem; font-family: var(--font-title); color: #fff; font-weight: 700; line-height: 1;">R$ 29,90 <small style="font-size:1rem; color:var(--text-muted);">/ mês</small></div>
            <div style="font-size: 0.78rem; color: #22c55e; margin: 6px 0 24px;">✓ Acesso imediato a todos os livros + Círculo de Conversas de Membros</div>
            <a href="/biblioteca" class="btn btn-primary btn-lg btn-shimmer" id="home-bundle-cta" style="padding: 18px 48px; font-size: 1rem; letter-spacing: 1px;">
              🔱 ACESSAR ÁREA DE MEMBROS
            </a>
            <div style="margin-top: 14px; display:flex; justify-content:center; gap:16px; font-size: 0.75rem; color: #666;">
              <span>⚡ Acesso imediato</span>
              <span>🛡️ 7 dias de garantia</span>
              <span>🔒 Pagamento seguro</span>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ---- POR QUE ESTUDAR PELO BUUTZKE ---- */
  _porqueStudar() {
    const pilares = [
      { icon: '📐', title: 'CONTEÚDO ORGANIZADO', desc: 'Informações estruturadas, com ordem lógica e progressão de aprendizado — sem as contradições que dominam o conteúdo gratuito na internet.' },
      { icon: '💬', title: 'LINGUAGEM DIRETA', desc: 'Assuntos complexos explicados sem transformá-los em textos incompreensíveis ou sensacionalismo desnecessário.' },
      { icon: '🔍', title: 'ESTUDO E PESQUISA', desc: 'Conteúdo desenvolvido a partir de pesquisa aprofundada e experiência prática dentro das tradições abordadas.' },
      { icon: '📱', title: 'ACESSO DIGITAL', desc: 'Estude quando quiser, no seu próprio ritmo, em qualquer dispositivo — celular, tablet ou computador.' },
    ];

    return `
    <section class="section porque-section" id="porque" style="background: var(--bg);">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">DIFERENCIAIS</span>
          <h2 class="section-title">Por que estudar<br>pelo <span class="text-gold">BUUTZKE?</span></h2>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; max-width: 1000px; margin: 0 auto;">
          ${pilares.map((p, i) => `
          <div class="card reveal delay-${i + 1}" style="text-align:center; padding: 36px 24px;">
            <div style="font-size: 2rem; margin-bottom: 16px; filter: drop-shadow(0 0 12px rgba(255,51,0,0.3));">${p.icon}</div>
            <h3 style="font-size: 0.78rem; letter-spacing: 2px; font-family: var(--font-body); font-weight: 700; color: var(--gold); margin-bottom: 12px;">${p.title}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.7;">${p.desc}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- SOBRE ---- */
  _sobre() {
    return `
    <section class="section sobre-home" id="sobre" style="background: var(--bg-surface);">
      <div class="container sobre-grid">
        <div class="sobre-visual reveal" style="justify-content: flex-start;">
          <div class="sobre-photo-wrap" style="max-width: 100%;">
            <img src="/assets/foto-sobre.jpg" alt="Eduardo Souza — BUUTZKE" class="sobre-photo" style="max-height: 700px;">
            <div class="sobre-photo-border"></div>
          </div>
        </div>
        <div class="sobre-text reveal delay-2">
          <span class="section-tag" style="border:none; color:var(--gold); font-size:0.6rem; letter-spacing:4px; margin-bottom:10px; padding:0;">QUEM ESTÁ POR TRÁS DO BUUTZKE?</span>
          <h2 class="section-title" style="font-size: clamp(1.8rem, 4vw, 2.4rem); margin-bottom: 20px;">Eduardo Souza</h2>
          <p style="margin-bottom: 18px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.8;">O BUUTZKE nasceu com o propósito de compartilhar conhecimento sobre Quimbanda, Umbanda, Exu e diferentes vertentes do ocultismo de maneira direta, acessível e sem transformar tradições complexas em simplificações.</p>
          <p style="margin-bottom: 18px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.8;">Aqui você encontra conteúdos, estudos e materiais digitais desenvolvidos para quem deseja conhecer e aprofundar esses assuntos <strong style="color:var(--text);">além das informações superficiais encontradas na internet.</strong></p>
          <div style="display: flex; gap: 32px; margin-bottom: 32px; flex-wrap: wrap;">
            <div style="text-align:center;">
              <div style="font-family: var(--font-title); font-size: 1.8rem; color: var(--gold); font-weight: 700;">+112mil</div>
              <div style="font-size: 0.72rem; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase;">Seguidores</div>
            </div>
            <div style="text-align:center;">
              <div style="font-family: var(--font-title); font-size: 1.8rem; color: var(--gold); font-weight: 700;">5</div>
              <div style="font-size: 0.72rem; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase;">eBooks Publicados</div>
            </div>
            <div style="text-align:center;">
              <div style="font-family: var(--font-title); font-size: 1.8rem; color: var(--gold); font-weight: 700;">DIÁRIO</div>
              <div style="font-size: 0.72rem; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase;">Conteúdo Novo</div>
            </div>
          </div>
          <a href="https://www.instagram.com/buutzke/" target="_blank" class="btn btn-primary" id="sobre-ig" style="padding: 14px 28px;">
            <span style="margin-right:8px">📷</span> SEGUIR NO INSTAGRAM
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- INSTAGRAM ---- */
  _instagram() {
    const vids = [
      { id: 1, title: 'Maria Navalha', url: 'https://www.instagram.com/reel/DXkPahDAloD/', shortcode: 'DXkPahDAloD' },
      { id: 2, title: 'Cigana Puere', url: 'https://www.instagram.com/reel/DYUtkDLC7-e/', shortcode: 'DYUtkDLC7-e' },
      { id: 3, title: 'Exu 7 Facadas', url: 'https://www.instagram.com/reel/DXelfccggMg/', shortcode: 'DXelfccggMg' },
      { id: 4, title: 'Exu Tiriri', url: 'https://www.instagram.com/reel/DYm58pJCWtG/', shortcode: 'DYm58pJCWtG' }
    ];
    return `
    <section class="section ig-section" id="instagram" style="background: var(--bg);">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">NO INSTAGRAM</span>
          <h2 class="section-title" style="font-size: clamp(1.8rem, 4vw, 2.6rem);">+112 mil pessoas acompanham<br>o <span class="text-gold">BUUTZKE</span> diariamente</h2>
          <p class="section-subtitle">Veja alguns dos conteúdos publicados sobre Quimbanda, Umbanda e Ocultismo.</p>
        </div>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          ${vids.map((v, i) => `
          <div class="reveal delay-${i + 1}" style="background: #fff; border-radius: 8px; overflow: hidden; display: flex; justify-content: center;">
            <iframe 
              src="https://www.instagram.com/p/${v.shortcode}/embed/captioned" 
              width="100%" 
              height="580" 
              frameborder="0" 
              scrolling="no" 
              allowtransparency="true" 
              loading="lazy"
              style="background: white; max-width: 400px;">
            </iframe>
          </div>`).join('')}
        </div>
        
        <div style="text-align:center; margin-top:48px;" class="reveal">
          <a href="https://www.instagram.com/buutzke/" target="_blank" class="btn btn-outline" style="border-color: rgba(255,255,255,0.12); color: #fff; padding: 14px 36px; font-size: 0.88rem;" id="home-ver-ig">
            <span style="margin-right:8px">📷</span> VER MAIS NO INSTAGRAM
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- DEPOIMENTOS ---- */
  _depoimentos() {
    const deps = [
      { stars: 5, text: 'Fiz o ritual de abertura de caminhos no dia seguinte que comprei. Em duas semanas veio uma proposta de trabalho que dobrou meu salário. Eu ainda não acredito.', author: 'Marina S.', location: 'Rio de Janeiro / RJ', tag: 'eBook Quimbanda' },
      { stars: 5, text: 'O capítulo sobre os 72 daemons e a adaptação do ritual para o praticante moderno vale mais que qualquer curso de mil reais. Material de altíssimo nível!', author: 'Renata V.', location: 'Porto Alegre / RS', tag: 'eBook Goetia' },
      { stars: 5, text: 'Meu ex voltou. Sem drama, sem novela, do jeito que a Pombagira ensinou. Quem passou por isso sabe o que é. Vale cada centavo.', author: 'Rafael M.', location: 'São Paulo / SP', tag: 'eBook Quimbanda' },
      { stars: 5, text: 'A clareza com que o Eduardo desmistificou a Goetia é surreal. Sempre tive receio de praticar por causa dos mitos da internet. Fiz meu primeiro trabalho e fechei o maior contrato da minha empresa.', author: 'Guilherme B.', location: 'São Paulo / SP', tag: 'eBook Goetia' },
      { stars: 5, text: 'O banho de prosperidade que aprendi trouxe clientes para minha loja já no dia seguinte. O poder das ervas é real, basta saber usar!', author: 'Amanda P.', location: 'Goiânia / GO', tag: 'Grimório das Ervas' },
      { stars: 5, text: 'Levei anos com uma demanda pesada e ninguém resolvia. O livro me deu o feitiço certo e a proteção certa. Hoje durmo em paz pela primeira vez.', author: 'Juliana R.', location: 'Salvador / BA', tag: 'eBook Quimbanda' },
    ];

    const stars = n => '⭐'.repeat(n);

    return `
    <section class="section dep-section" id="depoimentos" style="background: var(--bg-surface);">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">PROVA SOCIAL</span>
          <h2 class="section-title">Quem já estudou pelo <span class="text-gold">BUUTZKE</span></h2>
          <p class="section-subtitle">Resultados reais de pessoas que foram além da superfície.</p>
        </div>
        <div class="dep-grid">
          ${deps.map((d, i) => `
          <div class="dep-card card reveal delay-${(i % 3) + 1}">
            <div style="color: var(--gold); font-size: 0.85rem; margin-bottom: 10px; letter-spacing: 1px;">${stars(d.stars)}</div>
            <div class="dep-quote">"</div>
            <p class="dep-text">${d.text}</p>
            <div class="dep-foot">
              <div>
                <span class="dep-author">${d.author}</span>
                <span style="display:block; font-size:0.72rem; color:var(--text-faint);">${d.location}</span>
              </div>
              <span class="dep-tag">${d.tag}</span>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- FAQ ---- */
  _faq() {
    const faqs = [
      { q: 'Como recebo os eBooks após a compra?', a: 'Imediatamente após a confirmação do pagamento. O PDF é enviado direto no seu e-mail. Funciona em qualquer dispositivo — celular, tablet ou computador.' },
      { q: 'Os materiais são físicos ou digitais?', a: 'Todos os materiais são digitais, em formato PDF de alta resolução. Você recebe acesso imediato e pode baixar quantas vezes quiser.' },
      { q: 'Preciso ter conhecimento prévio para ler os ebooks?', a: 'Não. Os materiais foram desenvolvidos tanto para quem está começando quanto para praticantes experientes. A linguagem é direta e sem jargões desnecessários.' },
      { q: 'Existe garantia?', a: 'Sim. Todos os ebooks têm 7 dias de garantia incondicional pela plataforma Kirvano. Se por qualquer motivo não ficar satisfeito, basta um e-mail para receber 100% do seu dinheiro de volta — sem perguntas.' },
      { q: 'A compra é segura?', a: 'Sim. Os pagamentos são processados pela Kirvano, plataforma com criptografia de ponta a ponta. Aceita cartão de crédito, Pix e boleto.' },
      { q: 'O que é a Biblioteca / Área de Membros?', a: 'É o nosso repositório fechado com acesso contínuo por assinatura a todos os livros e manuscritos, leitor integrado no navegador e canal de discussões e estudos entre membros. Acesse /biblioteca para conhecer.' },
    ];

    return `
    <section class="section faq-section section-alt" id="faq">
      <div class="container" style="max-width:760px">
        <div class="section-header reveal">
          <span class="section-tag">DÚVIDAS</span>
          <h2 class="section-title">Perguntas <span class="text-gold">frequentes</span></h2>
        </div>
        <div class="faq-list">
          ${faqs.map((f, i) => `
          <div class="faq-item reveal" id="faqh-${i}">
            <button class="faq-q" id="faq-btn-${i}">
              <span>${f.q}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-a" id="faq-a-${i}">
              <div class="faq-a-inner"><p>${f.a}</p></div>
            </div>
          </div>`).join('')}
        </div>
        <div class="faq-cta reveal" style="text-align:center;margin-top:48px;">
          <p style="margin-bottom:18px;">Ainda tem dúvidas?</p>
          <a href="${WA}" target="_blank" class="btn btn-primary" id="faq-wa">Fale comigo no WhatsApp</a>
        </div>
      </div>
    </section>`;
  }

  /* ---- Init FAQ accordion ---- */
  _initFaq() {
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  /* ---- Animated counters ---- */
  _initCounters() {
    const targets = document.querySelectorAll('.hstat-n[data-count]');
    if (!targets.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.ceil(end / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= end) { el.textContent = end; clearInterval(timer); }
          else el.textContent = current;
        }, 30);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    targets.forEach(t => obs.observe(t));
  }

  /* ---- Canvas particles ---- */
  _particles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const pts = Array.from({ length: 60 }, () => this._newPt(canvas.width, canvas.height));
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
        p.o -= 0.0015;
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
      x: Math.random() * w, y: h + 10,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.6 + 0.2),
      o: Math.random() * 0.5 + 0.3,
      c: Math.random() > 0.5 ? '#d4a017' : '#c0392b',
    };
  }
}
