import { Router }    from '../router.js';
import { Navbar }    from '../components/Navbar.js';
import { Footer }    from '../components/Footer.js';
import { ebooksData } from '../data/ebooks.js';

const WA = 'https://wa.me/5551992395284';

export class HomePage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('css/home.css');
    this._render();
    Navbar.init();
    Router.initReveal();
    this._particles();
    this._initFaq();
  }

  _render() {
    this.container.innerHTML =
      Navbar.render('home') +
      `<main>
        ${this._hero()}
        ${this._ebooks()}
        ${this._sobre()}
        ${this._atendimentos()}
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
          <div class="hero-badge reveal">💧 QUIMBANDA · EXU · OCULTISMO</div>
          <h1 class="hero-title reveal delay-1">
            O OCULTO <span class="text-gold glow-text">SEM<br>FANTASIAS.</span>
          </h1>
          <p class="hero-sub reveal delay-2">
            Conhecimento real sobre Quimbanda, Exu e espiritualidade.<br>
            Aprenda através de eBooks, conteúdos exclusivos e atendimentos particulares.
          </p>
          <div class="hero-ctas reveal delay-3">
            <a href="/ebooks" class="btn btn-primary" id="hero-ebooks">
               <span style="margin-right:6px">📖</span> CONHECER OS EBOOKS
            </a>
            <a href="${WA}" target="_blank" class="btn btn-outline" id="hero-agendar" style="border-color: rgba(255,255,255,0.1); color: #fff;">
               AGENDAR ATENDIMENTO
            </a>
          </div>
          <div class="hero-stats reveal delay-4">
            <div class="hstat">
              <span class="hstat-n">⭐⭐⭐⭐⭐</span>
              <span class="hstat-l">AUTORIDADE COMPROVADA</span>
            </div>
            <div class="hstat">
              <span class="hstat-n">+100 MIL</span>
              <span class="hstat-l">SEGUIDORES</span>
            </div>
            <div class="hstat">
              <span class="hstat-n">MILHÕES</span>
              <span class="hstat-l">DE VISUALIZAÇÕES</span>
            </div>
            <div class="hstat">
              <span class="hstat-n">DIÁRIO</span>
              <span class="hstat-l">CONTEÚDO NOVO</span>
            </div>
          </div>
        </div>
        <div class="hero-right reveal delay-2">
          <div class="hero-photo-wrap">
            <img src="assets/foto-hero.jpg" alt="Eduardo Souza" class="hero-photo">
            <div class="hero-photo-glow"></div>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ---- EBOOKS ---- */
  _ebooks() {
    const cards = ebooksData.map((e, i) => `
    <div class="ebook-card card reveal delay-${i + 1}" role="button" onclick="Router.go('/ebook/${e.slug}')" style="display: flex; flex-direction: column; height: 100%;">
      <div class="ebook-card-top" style="justify-content:center; margin-bottom: 24px;">
        <div style="font-size: 5rem;">${e.icon}</div>
      </div>
      <h3 style="font-size:1.15rem; letter-spacing:1px; margin-bottom:8px; min-height: 48px; display: flex; align-items: flex-start;">${e.title}</h3>
      <p class="ebook-sub" style="color: var(--gold); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; flex-grow: 1;">${e.subtitle}</p>
      <a href="${e.featured ? '#/ebook/' + e.slug : e.paymentLink}"
         ${!e.featured ? 'target="_blank"' : ''}
         class="btn btn-primary btn-full"
         style="margin-top: auto;"
         onclick="event.stopPropagation()"
         id="ebtn-${e.slug}">
        COMPRAR AGORA
      </a>
    </div>`).join('');

    return `
    <section class="section ebooks-home" id="ebooks">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag" style="border:none; color:var(--gold); font-size:0.6rem; letter-spacing:4px; margin-bottom:10px;">BIBLIOTECA</span>
          <h2 class="section-title" style="font-size: clamp(2rem, 4vw, 2.8rem);">CONHEÇA MEUS<br>eBOOKS</h2>
          <div style="width: 40px; height: 2px; background: var(--gold); margin: 20px auto 0;"></div>
        </div>
        <div class="ebooks-grid">${cards}</div>
      </div>
    </section>`;
  }

  /* ---- SOBRE ---- */
  _sobre() {
    return `
    <section class="section sobre-home" id="sobre" style="background: var(--bg);">
      <div class="container sobre-grid">
        <div class="sobre-visual reveal" style="justify-content: flex-start;">
          <div class="sobre-photo-wrap" style="max-width: 100%;">
            <img src="assets/foto-sobre.jpg" alt="Eduardo Souza" class="sobre-photo" style="max-height: 700px;">
            <div class="sobre-photo-border"></div>
          </div>
        </div>
        <div class="sobre-text reveal delay-2">
          <span class="section-tag" style="border:none; color:var(--gold); font-size:0.6rem; letter-spacing:4px; margin-bottom:10px; padding:0;">O CRIADOR</span>
          <h2 class="section-title" style="font-size: clamp(2rem, 4vw, 2.8rem); margin-bottom: 30px;">Quem é Eduardo?</h2>
          <p style="margin-bottom: 24px; color: var(--text-muted); font-size: 0.95rem;">Criador de conteúdo sobre espiritualidade, Quimbanda e ocultismo.</p>
          <p style="margin-bottom: 24px; color: var(--text-muted); font-size: 0.95rem;">Mais de <strong style="color:var(--text);">100 mil pessoas</strong> acompanham diariamente meus conteúdos nas redes sociais.</p>
          <p style="margin-bottom: 40px; color: var(--text-muted); font-size: 0.95rem;">Meu objetivo é ensinar de forma séria, sem fantasias, baseada em conhecimento real e tradição.</p>
          <a href="https://www.instagram.com/buutzke/" target="_blank" class="btn btn-primary" id="sobre-ig" style="padding: 16px 32px;">
            <span style="margin-right:8px">📷</span> CONHECER MEU INSTAGRAM
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- ATENDIMENTOS ---- */
  _atendimentos() {
    const servicos = [
      { icon: '✨', title: 'CONSULTA DE TAROT',   desc: 'Leitura completa e detalhada dos caminhos da sua vida.',          id: 'srv-tarot',    btn: 'AGENDAR' },
      { icon: '🪙', title: 'ABERTURA FINANCEIRA',  desc: 'Desbloqueie os caminhos da prosperidade e abundância.',          id: 'srv-fin',      btn: 'AGENDAR' },
      { icon: '❤️', title: 'TRABALHO AMOROSO',     desc: 'Retorno, atração e harmonização de relações.',                   id: 'srv-amor',     btn: 'AGENDAR' },
      { icon: '🔥', title: 'LIMPEZA ESPIRITUAL',   desc: 'Descarrego profundo de energias e miasmas negativos.',           id: 'srv-limpeza',  btn: 'AGENDAR' },
      { icon: '🛡️', title: 'PROTEÇÃO ESPIRITUAL',  desc: 'Blindagem e escudo contra demandas e olho gordo.',               id: 'srv-prot',     btn: 'AGENDAR' },
    ];

    const cards = servicos.map((s, i) => `
    <div class="servico-card card reveal delay-${(i % 2) + 1}" style="text-align:left; background:#080808; border:1px solid rgba(255,51,0,0.1); border-radius:12px; padding:32px; box-shadow: inset 0 0 40px rgba(255,51,0,0.02); display: flex; flex-direction: column;">
      <div class="srv-icon" style="color:var(--gold); font-size:1.8rem; margin-bottom:16px;">${s.icon}</div>
      <h3 style="font-family:var(--font-title); font-size:1.2rem; margin-bottom:12px; min-height: 56px; display: flex; align-items: flex-start;">${s.title}</h3>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:24px; flex-grow: 1;">${s.desc}</p>
      <a href="${WA}" target="_blank" class="btn btn-primary btn-full" id="${s.id}" style="box-shadow: 0 4px 20px rgba(255,51,0,0.2); margin-top: auto;">
        <span style="margin-right:8px">💬</span> ${s.btn}
      </a>
    </div>`).join('');

    return `
    <section class="section atend-home" id="atendimentos" style="background: var(--bg);">
      <div class="container" style="max-width: 1180px;">
        <div class="section-header reveal">
          <span class="section-tag" style="border:none; color:var(--gold); font-size:0.6rem; letter-spacing:4px; margin-bottom:10px;">TRABALHOS</span>
          <h2 class="section-title" style="font-size: clamp(2rem, 4vw, 2.8rem);">ATENDIMENTOS</h2>
          <div style="width: 40px; height: 2px; background: var(--gold); margin: 20px auto 0;"></div>
        </div>
        <div class="atend-grid">${cards}</div>
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
          <span class="section-tag" style="border:none; color:var(--gold); font-size:0.6rem; letter-spacing:4px; margin-bottom:10px; padding:0;">NO INSTAGRAM</span>
          <h2 class="section-title" style="font-size: clamp(2rem, 4vw, 2.8rem);">ÚLTIMOS VÍDEOS</h2>
          <div style="width: 40px; height: 2px; background: var(--gold); margin: 20px auto 0;"></div>
        </div>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          ${vids.map((v, i) => `
          <div class="reveal delay-${i + 1}" style="background: #fff; border-radius: 8px; overflow: hidden; display: flex; justify-content: center;">
            <iframe 
              src="https://www.instagram.com/p/${v.shortcode}/embed/captioned" 
              width="100%" 
              height="600" 
              frameborder="0" 
              scrolling="no" 
              allowtransparency="true" 
              style="background: white; max-width: 400px;">
            </iframe>
          </div>`).join('')}
        </div>
        
        <div style="text-align:center; margin-top:50px;" class="reveal">
          <a href="https://www.instagram.com/buutzke/" target="_blank" class="btn btn-outline" style="border-color: rgba(255,255,255,0.1); color: #fff; padding: 16px 32px; font-size: 0.85rem;">
            <span style="margin-right:8px">📷</span> VER MAIS NO INSTAGRAM
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- DEPOIMENTOS ---- */
  _depoimentos() {
    const deps = [
      { text: 'O atendimento mudou minha forma de enxergar a espiritualidade.', author: '— Cliente verificado', tag: 'Consulta de Tarot' },
      { text: 'Material extremamente completo. Superou minhas expectativas em tudo.', author: '— Leitor do eBook', tag: 'Quimbanda: O Caminho da Força' },
      { text: 'Valeu cada centavo. Recomendo de olhos fechados.', author: '— Cliente verificado', tag: 'Trabalho Espiritual' },
      { text: 'Em duas semanas veio uma proposta de trabalho que dobrou meu salário. Eu ainda não acredito.', author: 'Marina S. — Rio de Janeiro', tag: 'eBook Quimbanda' },
      { text: 'Meu ex voltou. Sem drama, sem novela, do jeito que a Pombagira ensinou.', author: 'Rafael M. — São Paulo', tag: 'Trabalho Amoroso' },
      { text: 'O livro me deu o feitiço certo e a proteção certa. Hoje durmo em paz pela primeira vez.', author: 'Juliana R. — Salvador', tag: 'eBook Quimbanda' },
    ];

    return `
    <section class="section dep-section" id="depoimentos">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">Quem já viveu</span>
          <h2 class="section-title">Depoimentos de quem <span class="text-gold">não teve medo</span></h2>
        </div>
        <div class="dep-grid">
          ${deps.map((d, i) => `
          <div class="dep-card card reveal delay-${(i % 3) + 1}">
            <div class="dep-quote">"</div>
            <p class="dep-text">${d.text}</p>
            <div class="dep-foot">
              <span class="dep-author">${d.author}</span>
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
      { q: 'Quanto tempo demora o atendimento?', a: 'Depende do tipo de trabalho. Consultas de Tarot são realizadas em até 48h. Trabalhos espirituais podem levar de 3 a 21 dias conforme a força necessária.' },
      { q: 'Os trabalhos são presenciais?', a: 'Não necessariamente. A maioria dos atendimentos pode ser feita à distância com a mesma eficácia. Entre em contato pelo WhatsApp para alinhamos os detalhes.' },
      { q: 'Como recebo os eBooks?', a: 'Imediatamente após a confirmação do pagamento. O PDF é enviado direto no seu e-mail. Funciona em qualquer dispositivo — celular, tablet ou computador.' },
      { q: 'Os trabalhos espirituais são seguros?', a: 'Sim. Todo trabalho é conduzido com respeito às tradições e dentro de uma ética espiritual séria. Trabalho com responsabilidade e sem promessas vazias.' },
    ];

    return `
    <section class="section faq-section section-alt" id="faq">
      <div class="container" style="max-width:760px">
        <div class="section-header reveal">
          <span class="section-tag">Dúvidas</span>
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
