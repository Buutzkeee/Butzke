import { Router }         from '../router.js';
import { Navbar }         from '../components/Navbar.js';
import { Footer }         from '../components/Footer.js';
import { getEbookBySlug } from '../data/ebooks.js';

export class LandingEbookPage {
  constructor(container, params) {
    this.container = container;
    this.slug  = params.slug;
    this.ebook = getEbookBySlug(this.slug);
    Router.loadCSS('css/landing-ebook.css?v=' + Date.now());

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
        ${this._sobre(e)}
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
      <div class="container lhero-body">
        <div class="lhero-badge">✦ ${e.badge || 'CONTEÚDO EXCLUSIVO'} ✦</div>
        <h1 class="lhero-title" style="font-size:clamp(2.2rem,6vw,3.5rem); margin-bottom: 24px;">${e.title}</h1>
        <p class="lhero-sub" style="font-size:1.15rem; color:var(--gold); margin-bottom:16px;">
          ${e.heroText}
        </p>
        <p style="color:#cccccc; font-size:1rem; max-width:600px; margin:0 auto 32px;">
          ${e.shortDesc}
        </p>
        
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
          <div class="ltimer" id="ltimer" style="margin-bottom: 24px;">
            <div class="ltimer-label">⚡ OFERTA RELÂMPAGO — expira em:</div>
            <div class="ltimer-display">
              <div class="ltimer-unit"><span id="th">00</span><small>horas</small></div>
              <div class="ltimer-sep">:</div>
              <div class="ltimer-unit"><span id="tm">00</span><small>min</small></div>
              <div class="ltimer-sep">:</div>
              <div class="ltimer-unit"><span id="ts">00</span><small>seg</small></div>
            </div>
          </div>
          
          <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer lcta" id="hero-cta" style="margin-bottom: 24px; display: inline-flex;">
            Quero Meu Acesso Agora
          </a>
        </div>

        <div class="ltrust">
          <span>Acesso imediato</span>
          <span>Pagamento seguro</span>
          <span>7 dias de garantia</span>
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
          <p>Muitas pessoas trabalham, se esforçam e fazem tudo "certo" — e mesmo assim os caminhos parecem fechados a sete chaves.</p>
          <p>O conhecimento oculto tem o poder de quebrar essas barreiras. A verdade é dura: apenas desejar e cruzar os braços não basta. Você precisa da ferramenta certa para agir.</p>
          <p>O que você vai descobrir neste material não é teoria de internet. É fundamento prático, ensinado direto da fonte, para você aplicar e ver os resultados.</p>
        </div>
      </div>
    </section>`;
  }

  /* ---- SOBRE EDUARDO ---- */
  _sobre(e) {
    return `
    <section class="section lsobre section-alt">
      <div class="container lsobre-inner">
        <div class="lsobre-avatar reveal">
          <div class="lsobre-av-wrap">
            <img src="assets/foto-sobre.jpg" alt="Eduardo Souza" class="lsobre-av" style="object-fit:cover; border-radius:50%;" />
            <div class="lsobre-av-ring"></div>
          </div>
        </div>
        <div class="lsobre-text reveal delay-2">
          <div class="lsobre-tag">POR EDUARDO SOUZA</div>
          <h3>Mistérios Ocultos</h3>
          <p>"Passei anos estudando o que os livros comuns escondem. O que eu reuni neste material é o mesmo conhecimento que muitos pagam fortunas em consultas para acessar — só que direto na fonte, sem intermediário, sem enganação."</p>
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
          <p class="section-subtitle">Mais que um ebook. Um manual espiritual escrito para quem cansou de ser vítima e decidiu tomar as rédeas do próprio destino.</p>
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
          <div class="lsec-tag">O QUE VOCÊ VAI APRENDER</div>
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
      'Tendo nas mãos o poder de limpar e blindar sua própria energia.',
      'Com os caminhos abertos para o dinheiro e as oportunidades fluírem.',
      'Afastando qualquer influência negativa, inveja ou demanda pesada.',
      'Com uma conexão espiritual muito mais forte e assertiva.',
      'E, principalmente, com a certeza de que você tem conhecimento de verdade.',
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
          <p>Isso não é promessa. É resultado de quem aplica o que está no livro.</p>
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
          <h2 class="section-title">Depoimentos de quem <span class="text-gold">já aplicou</span></h2>
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
            Garantir Meu Acesso Agora
          </a>

          <div class="lgarantia">
            <div class="lgarantia-icon">🛡️</div>
            <div>
              <h4>Garantia Blindada de 7 Dias</h4>
              <p>Leia o material inteiro. Sinta a energia mudar. Se em 7 dias você achar que não é pra você, é só enviar um e-mail e devolvemos 100% do seu dinheiro. Sem burocracia, sem perguntas. Todo o risco é meu.</p>
            </div>
          </div>

          <div class="lpreco-why">
            <h4>Por que o preço é esse?</h4>
            <p>R$ ${e.priceTo ? e.priceTo.toFixed(2).replace('.', ',') : '—'} é menos do que você gasta em uma pizza. E muito menos do que qualquer consulta cobraria. Esse valor é promocional e vai subir para R$ ${e.priceFrom ? e.priceFrom.toFixed(0) : '197'} em breve.</p>
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
          <h2 class="section-title">Ainda tem <span class="text-gold">dúvidas?</span></h2>
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
        <div class="ornament">✦ O CAMINHO ESPERA ✦</div>
        <h2 class="section-title" style="margin:24px 0">Duas escolhas. <span class="text-gold">Uma decisão.</span></h2>
        <p style="margin-bottom:12px;">Você pode fechar essa página, voltar pra sua rotina e continuar esperando que as coisas mudem sozinhas.</p>
        <p style="margin-bottom:40px;">Ou pode gastar menos que uma pizza e finalmente ter em mãos o conhecimento que vai virar o jogo.</p>
        <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer" id="final-cta">
          Garantir Meu Acesso Agora
        </a>
        <p style="margin-top:24px;font-size:.85rem;color:var(--text-muted)">Você não chegou aqui por acaso.</p>
      </div>
    </section>`;
  }

  /* ---- TIMER ---- */
  _timer() {
    const key = 'btz_timer_gen_' + this.slug;
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
        <a href="#/ebooks" class="btn btn-primary">Ver todos os eBooks</a>
      </div>
      ${Footer.render()}`;
    Navbar.init();
  }
}
