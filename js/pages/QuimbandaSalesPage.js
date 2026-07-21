import { Router }         from '../router.js';
import { Navbar }         from '../components/Navbar.js';
import { Footer }         from '../components/Footer.js';
import { getEbookBySlug } from '../data/ebooks.js';

export class QuimbandaSalesPage {
  constructor(container) {
    this.container = container;
    this.slug  = 'quimbanda-o-caminho-da-forca';
    this.ebook = getEbookBySlug(this.slug);
    Router.loadCSS('/css/landing-ebook.css?v=' + Date.now());

    if (!this.ebook) { this._notFound(); return; }
    this._render();
    Navbar.init();
    Router.initReveal();
    this._timer();
    this._initFaq();
  }

  _render() {
    const e = this.ebook;
    this.container.innerHTML =
      Navbar.render('ebooks') +
      `<main class="landing-main">
        ${this._hero(e)}
        ${this._problema(e)}
        ${this._sobre()}
        ${this._arsenal(e)}
        ${this._sumario(e)}
        ${this._imagine(e)}
        ${this._depoimentos(e)}
        ${this._preco(e)}
        ${this._faq(e)}
        ${this._finalCta(e)}
      </main>` +
      Footer.render();
  }

  /* ---- HERO ---- */
  _hero(e) {
    return `
    <section class="lhero">
      <div class="lhero-orb lhero-orb1"></div>
      <div class="lhero-orb lhero-orb2"></div>
      <div class="container lhero-body" style="display: flex; flex-wrap: wrap; gap: 60px; align-items: center; justify-content: center; text-align: left; position: relative; z-index: 2;">
        
        <div style="flex: 1; min-width: 300px; max-width: 600px;">
          <div class="lhero-badge" style="margin-bottom: 20px; font-size: 0.8rem; letter-spacing: 4px;">✦ LAROYÊ — AXÉ — SARAVÁ ✦</div>
          <h1 class="lhero-title" style="font-size:clamp(2rem,5vw,3rem); margin: 0 0 20px 0; text-align: left; max-width: 100%; animation: none;">${e.heroText}</h1>
          <p class="lhero-sub" style="font-size:1.15rem; color:var(--gold); margin: 0 0 16px 0; text-align: left; max-width: 100%; animation: none;">
            Amor que voltou. Dinheiro que apareceu. Inimigo que se calou. É isso que acontece quando você aprende a trabalhar com os verdadeiros donos das encruzilhadas.
          </p>
          
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <div class="ltimer" id="ltimer" style="margin: 0 0 24px 0;">
              <div class="ltimer-label">⚡ OFERTA RELÂMPAGO — expira em:</div>
              <div class="ltimer-display">
                <div class="ltimer-unit"><span id="th">00</span><small>horas</small></div>
                <div class="ltimer-sep">:</div>
                <div class="ltimer-unit"><span id="tm">00</span><small>min</small></div>
                <div class="ltimer-sep">:</div>
                <div class="ltimer-unit"><span id="ts">00</span><small>seg</small></div>
              </div>
            </div>
            
            <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer lcta" id="hero-cta" style="margin: 0 0 24px 0; padding: 20px 40px; font-size: 1.1rem;">
              Quero Meu Grimório Agora
            </a>
          </div>

          <div class="ltrust" style="justify-content: flex-start; gap: 20px;">
            <span>Acesso imediato</span>
            <span>Pagamento seguro</span>
            <span>7 dias de garantia</span>
          </div>
        </div>

        <div style="flex: 1; min-width: 300px; max-width: 450px; display: flex; justify-content: center; position: relative;">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 120%; height: 120%; background: radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 60%); z-index: 0; filter: blur(30px); pointer-events: none;"></div>
          <img src="${e.imageHome}" alt="${e.title}" style="width: 100%; max-width: 400px; height: auto; border-radius: var(--radius-sm); border: 1px solid var(--gold-border-hover); box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212,160,23,0.15); z-index: 1; transform: perspective(1000px) rotateY(-12deg); transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);" onmouseover="this.style.transform='perspective(1000px) rotateY(0deg) scale(1.02)'" onmouseout="this.style.transform='perspective(1000px) rotateY(-12deg) scale(1)'">
        </div>

      </div>
    </section>`;
  }
  /* ---- PROBLEMA ---- */
  _problema(e) {
    return `
    <section class="section lsection">
      <div class="container" style="max-width:820px">
        <div class="lread-badge reveal">LEIA COM ATENÇÃO</div>
        <h2 class="section-title reveal delay-1">Você já sentiu que alguma coisa te <span class="text-gold">trava?</span></h2>
        <div class="lprob-text reveal delay-2">
          <p>Você trabalha, se esforça, ora, faz tudo "certo" — e mesmo assim os caminhos parecem fechados a sete chaves.</p>
          <p>O dinheiro entra e some. O amor chega e vai embora. As oportunidades passam de raspão. E aquela sensação de ser observado, de ter alguém "torcendo contra"... não é paranoia. É demanda.</p>
          <p>A verdade é dura: rezar não basta. Enquanto você reza, tem gente acendendo vela contra você. E a única linha espiritual que age rápido, sem rodeios, sem esperar mil anos pra resolver o que precisa ser resolvido HOJE...</p>
          <p class="lprob-highlight">...é a linha da esquerda.</p>
        </div>
      </div>
    </section>`;
  }

  /* ---- SOBRE EDUARDO ---- */
  _sobre() {
    return `
    <section class="section lsobre section-alt">
      <div class="container lsobre-inner">
        <div class="lsobre-avatar reveal">
          <div class="lsobre-av-wrap">
            <img src="/assets/foto-sobre.jpg" alt="Eduardo Souza" class="lsobre-av" style="object-fit:cover; border-radius:50%;" />
            <div class="lsobre-av-ring"></div>
          </div>
        </div>
        <div class="lsobre-text reveal delay-2">
          <div class="lsobre-tag">POR EDUARDO SOUZA</div>
          <h3>Mistérios Ocultos</h3>
          <p>"Passei anos estudando o que os livros comuns escondem. O que eu reuni neste grimório é o mesmo conhecimento que muitos pagam fortunas em consultas para acessar — só que direto na fonte, sem intermediário, sem enganação."</p>
        </div>
      </div>
    </section>`;
  }

  /* ---- ARSENAL ---- */
  _arsenal(e) {
    return `
    <section class="section larsenal">
      <div class="container">
        <div class="section-header reveal">
          <div class="lsec-tag">O QUE VOCÊ RECEBE HOJE</div>
          <h2 class="section-title">Um arsenal completo pra <span class="text-gold">virar o jogo</span> da sua vida</h2>
          <p class="section-subtitle">Mais que um ebook. Um manual de guerra espiritual escrito para quem cansou de ser vítima e decidiu tomar as rédeas do próprio destino.</p>
        </div>
        <div class="larsenal-grid">
          ${e.features.map(f => `
          <div class="larsenal-item card reveal">
            <span class="larsenal-check">✦</span>
            <span>${f}</span>
          </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:48px;" class="reveal">
          <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer" id="arsenal-cta">
            Quero Garantir Tudo Isso Agora
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- SUMÁRIO ---- */
  _sumario(e) {
    if (!e.chapters || !e.chapters.length) return '';
    return `
    <section class="section lsumario section-alt">
      <div class="container" style="max-width:860px">
        <div class="section-header reveal">
          <div class="lsec-tag">SUMÁRIO SAGRADO</div>
        </div>
        <div class="lchapters">
          ${e.chapters.map((c, i) => `
          <div class="lchapter card reveal delay-${(i % 3) + 1}">
            <div class="lchapter-num">${c.num}</div>
            <div class="lchapter-body">
              <h4>${c.title}</h4>
              <p>${c.desc}</p>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- IMAGINE ---- */
  _imagine(e) {
    const items = [
      'Com a pessoa certa voltando por vontade própria, sem você implorar.',
      'Com o dinheiro entrando por caminhos que você nem esperava.',
      'Com aquele inimigo, invejoso ou "amigo" falso completamente afastado.',
      'Com uma proteção tão firme que o mau-olhado bate e volta.',
      'E, principalmente, com a certeza de que você tem forças ao seu lado.',
    ];
    return `
    <section class="section limagine">
      <div class="container" style="max-width:820px">
        <div class="section-header reveal">
          <div class="lsec-tag">IMAGINE POR UM INSTANTE</div>
          <h2 class="section-title">Como seria a sua vida em <span class="text-gold">30 dias...</span></h2>
        </div>
        <div class="limagine-list">
          ${items.map((it, i) => `
          <div class="limagine-item reveal delay-${i + 1}">
            <span class="limagine-arrow">↟</span>
            <p>${it}</p>
          </div>`).join('')}
        </div>
        <div class="limagine-footer reveal">
          <p>Isso não é promessa. É o que a Quimbanda faz há séculos.</p>
          <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer" id="imagine-cta">
            Sim, Eu Quero Essa Virada
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- DEPOIMENTOS ---- */
  _depoimentos(e) {
    if (!e.testimonials || !e.testimonials.length) return '';
    return `
    <section class="section ldeps section-alt">
      <div class="container">
        <div class="section-header reveal">
          <div class="lsec-tag">QUEM JÁ ABRIU OS CAMINHOS</div>
          <h2 class="section-title">Depoimentos de quem <span class="text-gold">não teve medo</span></h2>
        </div>
        <div class="ldep-grid">
          ${e.testimonials.map((t, i) => `
          <div class="ldep card reveal delay-${i + 1}">
            <div class="ldep-quote">"</div>
            <p>"${t.text}"</p>
            <div class="ldep-foot">
              <strong>${t.name}</strong>
              <span>${t.location}</span>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- PREÇO ---- */
  _preco(e) {
    return `
    <section class="section lpreco">
      <div class="container" style="max-width:700px">
        <div class="lpreco-box">
          <div class="lpreco-icon">${e.icon}</div>
          <h3 class="lpreco-title">${e.title}</h3>
          <p class="lpreco-sub">${e.subtitle}</p>
          <div class="lpreco-price-area">
            ${e.priceFrom ? `<div class="lpreco-from">De R$ ${e.priceFrom.toFixed(2).replace('.', ',')}</div>` : ''}
            <div class="lpreco-value">
              ${e.priceTo ? `<span class="lpreco-currency">R$</span><span class="lpreco-num">${e.priceTo.toFixed(2).replace('.', ',')}</span>` : '<span>Em breve</span>'}
            </div>
            ${e.priceTo ? '<p class="lpreco-parcel">à vista · ou em até 9x no cartão</p>' : ''}
          </div>
          <div class="lpreco-features">
            <p style="font-weight:600;margin-bottom:14px;color:var(--text)">VOCÊ RECEBE:</p>
            ${e.features.map(f => `<div class="lpreco-feat">✦ ${f}</div>`).join('')}
          </div>
          <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-full btn-shimmer" id="preco-cta">
            Garantir Meu Grimório Agora
          </a>

          <div class="lgarantia">
            <div class="lgarantia-icon">🛡️</div>
            <div>
              <h4>Garantia Blindada de 7 Dias</h4>
              <p>Leia o grimório inteiro. Faça os rituais. Sinta a energia mudar. Se em 7 dias você achar que não é pra você, é só enviar um e-mail e devolvemos 100% do seu dinheiro. Sem burocracia, sem perguntas. Todo o risco é meu.</p>
            </div>
          </div>

          <div class="lpreco-why">
            <h4>Por que o preço é esse?</h4>
            <p>R$ ${e.priceTo ? e.priceTo.toFixed(2).replace('.', ',') : '—'} é menos do que você gasta em uma pizza. E muito menos do que uma única consulta com um pai de santo cobra. Esse valor é promocional e vai subir para R$ ${e.priceFrom ? e.priceFrom.toFixed(0) : '197'} assim que a leva de lançamento se esgotar.</p>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ---- FAQ ---- */
  _faq(e) {
    if (!e.faqs || !e.faqs.length) return '';
    return `
    <section class="section lfaq section-alt">
      <div class="container" style="max-width:760px">
        <div class="section-header reveal">
          <div class="lsec-tag">PERGUNTAS FREQUENTES</div>
          <h2 class="section-title">Antes de cruzar a <span class="text-gold">encruzilhada</span></h2>
        </div>
        <div class="faq-list">
          ${e.faqs.map((f, i) => `
          <div class="faq-item reveal" id="lfaq-${i}">
            <button class="faq-q" id="lfaq-btn-${i}">
              <span>${f.q}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-a">
              <div class="faq-a-inner"><p>${f.a}</p></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- FINAL CTA ---- */
  _finalCta(e) {
    return `
    <section class="section lfinal-cta">
      <div class="container" style="max-width:700px;text-align:center">
        <div class="ornament">✦ A ENCRUZILHADA ESPERA ✦</div>
        <h2 class="section-title" style="margin:24px 0">Duas escolhas. <span class="text-gold">Uma decisão.</span></h2>
        <p style="margin-bottom:12px;">Você pode fechar essa página, voltar pra sua rotina e continuar esperando que as coisas mudem sozinhas.</p>
        <p style="margin-bottom:40px;">Ou pode gastar menos que uma pizza e finalmente ter em mãos o conhecimento que vai virar o jogo.</p>
        <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer" id="final-cta">
          Garantir Meu Grimório Agora
        </a>
        <p style="margin-top:24px;font-size:.85rem;color:var(--text-muted)">Você não chegou aqui por acaso.</p>
        <div class="ornament" style="margin-top:16px;">✦ LAROYÊ ✦ AXÉ ✦ SARAVÁ ✦</div>
      </div>
    </section>`;
  }

  /* ---- TIMER ---- */
  _timer() {
    const key = 'btz_timer_' + this.slug;
    let end = parseInt(sessionStorage.getItem(key));
    if (!end || end < Date.now()) {
      end = Date.now() + (23 * 3600 + 59 * 60 + 59) * 1000;
      sessionStorage.setItem(key, end);
    }
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      const h = Math.floor(left / 3600000);
      const m = Math.floor((left % 3600000) / 60000);
      const s = Math.floor((left % 60000) / 1000);
      const th = document.getElementById('th');
      const tm = document.getElementById('tm');
      const ts = document.getElementById('ts');
      if (th) th.textContent = pad(h);
      if (tm) tm.textContent = pad(m);
      if (ts) ts.textContent = pad(s);
      if (left > 0) this._timerTO = setTimeout(tick, 1000);
    };
    tick();
    window.addEventListener('hashchange', () => clearTimeout(this._timerTO), { once: true });
  }

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

  _notFound() {
    this.container.innerHTML = `
      ${Navbar.render('ebooks')}
      <div style="padding:200px 24px;text-align:center">
        <h2>eBook não encontrado</h2>
        <p style="margin:16px 0">O eBook que você procura não existe.</p>
        <a href="/ebooks" class="btn btn-primary">Ver todos os eBooks</a>
      </div>
      ${Footer.render()}`;
    Navbar.init();
  }
}
