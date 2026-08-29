import { Router }         from '../router.js';
import { Navbar }         from '../components/Navbar.js';
import { Footer }         from '../components/Footer.js';
import { getEbookBySlug } from '../data/ebooks.js';
import { OfferModal }     from '../components/OfferModal.js';

export class GoetiaSalesPage {
  constructor(container) {
    this.container = container;
    this.slug  = 'goetia-a-arte-da-soberania';
    this.ebook = getEbookBySlug(this.slug);
    Router.loadCSS('/css/landing-ebook.css?v=' + Date.now());

    if (!this.ebook) { this._notFound(); return; }
    this._render();
    Navbar.init();
    Router.initReveal();
    this._timer();
    this._initFaq();
    
    try {
      new OfferModal({ ebookName: 'Goetia: A Arte da Soberania' });
    } catch (e) {}
  }

  _render() {
    const e = this.ebook;
    this.container.innerHTML =
      Navbar.render('ebooks') +
      `<main class="landing-main">
        ${this._hero(e)}
        ${this._quebraTabu(e)}
        ${this._paraQuem(e)}
        ${this._sobre(e)}
        ${this._arsenal(e)}
        ${this._sumario(e)}
        ${this._bonus(e)}
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
    <section class="lhero" style="background: radial-gradient(circle at 50% 20%, rgba(20, 10, 5, 0.95), #060608 80%);">
      <div class="lhero-orb lhero-orb1" style="background: radial-gradient(circle, rgba(234,171,94,0.18), transparent 70%);"></div>
      <div class="lhero-orb lhero-orb2" style="background: radial-gradient(circle, rgba(139,0,0,0.22), transparent 70%);"></div>
      <div class="container lhero-body" style="display: flex; flex-wrap: wrap; gap: 60px; align-items: center; justify-content: center; text-align: left; position: relative; z-index: 2;">
        
        <div style="flex: 1; min-width: 300px; max-width: 620px;">
          <div class="lhero-badge" style="margin-bottom: 20px; font-size: 0.8rem; letter-spacing: 4px; color: var(--gold); display: inline-flex; align-items: center; gap: 8px; background: rgba(234,171,94,0.1); border: 1px solid rgba(234,171,94,0.3); padding: 6px 14px; border-radius: 30px;">
            <span>🔯</span> <span>LEMEGETON CLAVICULA SALOMONIS</span> <span>✦</span> <span>LANÇAMENTO EXCLUSIVO</span>
          </div>
          <h1 class="lhero-title" style="font-size:clamp(2.1rem,5vw,3.2rem); margin: 0 0 20px 0; text-align: left; max-width: 100%; line-height: 1.15; font-family: var(--font-title);">
            A Magia Salomônica Sem Medo, Sem Dogmas e com <span class="text-gold" style="text-shadow: 0 0 25px rgba(234,171,94,0.4);">Poder Real no Mundo Físico</span>
          </h1>
          <p class="lhero-sub" style="font-size:1.15rem; color:#d8cfc4; margin: 0 0 16px 0; text-align: left; max-width: 100%; line-height: 1.6;">
            Aprenda a evocar e direcionar as 72 forças goéticas com segurança, autoridade e precisão para atrair riqueza, soberania pessoal, magnetismo e proteção absoluta.
          </p>
          
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <div class="ltimer" id="ltimer" style="margin: 0 0 24px 0; background: rgba(234,171,94,0.1); border-color: rgba(234,171,94,0.4);">
              <div class="ltimer-label" style="color: var(--gold);">⚡ EDIÇÃO LIMITADA DE LANÇAMENTO — GARANTA SEU ACESSO:</div>
              <div class="ltimer-display">
                <div class="ltimer-unit"><span id="th">00</span><small>horas</small></div>
                <div class="ltimer-sep">:</div>
                <div class="ltimer-unit"><span id="tm">00</span><small>min</small></div>
                <div class="ltimer-sep">:</div>
                <div class="ltimer-unit"><span id="ts">00</span><small>seg</small></div>
              </div>
            </div>
            
            <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer lcta" id="hero-cta" style="margin: 0 0 24px 0; padding: 20px 42px; font-size: 1.15rem; font-weight: 700; letter-spacing: 1px; box-shadow: 0 10px 35px rgba(234,171,94,0.35);">
              ✦ QUERO MEU GRIMÓRIO OFICIAL DE GOETIA
            </a>
          </div>

          <div class="ltrust" style="justify-content: flex-start; gap: 20px; color: #a59d95; font-size: 0.85rem;">
            <span>⚡ Acesso Imediato em PDF</span>
            <span>🔒 Pagamento Seguro Kirvano</span>
            <span>🛡️ 7 Dias de Garantia Total</span>
          </div>
        </div>

        <div style="flex: 1; min-width: 300px; max-width: 450px; display: flex; justify-content: center; position: relative;">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 130%; height: 130%; background: radial-gradient(circle, rgba(234,171,94,0.25) 0%, rgba(139,0,0,0.1) 40%, transparent 70%); z-index: 0; filter: blur(35px); pointer-events: none; animation: pulseGlow 4s ease-in-out infinite;"></div>
          <div style="position: relative; z-index: 1; text-align: center;">
            <img src="${e.imageHome}" alt="${e.title}" style="width: 100%; max-width: 390px; height: auto; border-radius: var(--radius-sm); border: 1px solid rgba(234,171,94,0.6); box-shadow: 0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(234,171,94,0.25); transform: perspective(1000px) rotateY(-10deg); transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);" onmouseover="this.style.transform='perspective(1000px) rotateY(0deg) scale(1.03)'" onmouseout="this.style.transform='perspective(1000px) rotateY(-10deg) scale(1)'">
            <div style="margin-top: 16px; font-family: var(--font-title); font-size: 0.8rem; color: var(--gold); letter-spacing: 2px; text-transform: uppercase;">
              ✦ Edição Oficial Ilustrada e Comentada ✦
            </div>
          </div>
        </div>

      </div>
    </section>`;
  }

  /* ---- QUEBRA DE TABU ---- */
  _quebraTabu(e) {
    return `
    <section class="section lsection" style="border-top: 1px solid rgba(234,171,94,0.15); background: #08080a;">
      <div class="container" style="max-width:860px">
        <div class="lread-badge reveal" style="background: rgba(234,171,94,0.12); color: var(--gold); border-color: rgba(234,171,94,0.3);">A VERDADE OCULTA</div>
        <h2 class="section-title reveal delay-1" style="font-size: clamp(2rem, 4vw, 2.7rem);">
          Por que fizeram você ter <span class="text-gold">medo da Goetia?</span>
        </h2>
        <div class="lprob-text reveal delay-2" style="font-size: 1.05rem; line-height: 1.75; color: #ccc;">
          <p>Durante séculos, a Igreja e o cinema hollywoodiano venderam a ideia de que a Goetia é algo maligno, perigoso ou incontrolável. <strong>Eles precisavam que você acreditasse nisso.</strong></p>
          <p>Porque quem conhece as chaves salomônicas não é refém de dogmas, não depende de terceiros e passa a controlar as próprias circunstâncias materiais: dinheiro, influência, respeito e proteção inabalável.</p>
          <p>O Rei Salomão não construiu seu império e acumulou sabedoria infinita por acaso. Ele dominava a ciência da evocação das 72 forças primordiais — inteligências espirituais prontas para serem direcionadas por quem se coloca em posição de <strong>Soberania</strong>.</p>
          <p class="lprob-highlight" style="color: var(--gold); border-left: 3px solid var(--gold); padding-left: 16px; background: rgba(234,171,94,0.06); padding: 14px 18px; border-radius: 0 8px 8px 0;">
            A Goetia não é sobre se rebaixar a demônios ou vender sua alma. É a arte régia de comandar a sua própria mente e as forças do cosmos como um verdadeiro Rei.
          </p>
        </div>
      </div>
    </section>`;
  }

  /* ---- PARA QUEM É ---- */
  _paraQuem(e) {
    const perfis = [
      { icone: '👑', titulo: 'Quem busca Soberania Pessoal', desc: 'Para quem cansou de ser vítima dos acontecimentos e quer assumir a postura de autoridade na própria vida.' },
      { icone: '💰', titulo: 'Empreendedores e Profissionais', desc: 'Quem deseja destravar novos fluxos de receita, acelerar negociações e atrair prosperidade tangível.' },
      { icone: '🛡️', titulo: 'Buscadores e Ocultistas', desc: 'Praticantes que querem fundamento tradicional, seguro e prático, sem firulas ou invenções modernas.' },
      { icone: '⚡', titulo: 'Iniciantes Corajosos', desc: 'Quem nunca praticou evocação mas quer aprender do jeito certo, seguro e blindado desde o primeiro dia.' }
    ];

    return `
    <section class="section section-alt" style="background: #0d0d10;">
      <div class="container">
        <div class="section-header reveal">
          <div class="lsec-tag" style="color: var(--gold);">DIRECIONAMENTO</div>
          <h2 class="section-title">Para quem foi criado este <span class="text-gold">Grimório Definitivo</span></h2>
          <p class="section-subtitle">Um manual direto, sem linguagem confusa ou pré-requisitos impossíveis.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 40px;">
          ${perfis.map((p, i) => `
          <div class="card reveal delay-${i+1}" style="padding: 28px; background: rgba(18,18,22,0.9); border: 1px solid rgba(234,171,94,0.15); border-radius: 12px; display:flex; flex-direction:column; gap:12px;">
            <div style="font-size: 2.2rem;">${p.icone}</div>
            <h3 style="font-size: 1.15rem; color: #fff; font-family: var(--font-title);">${p.titulo}</h3>
            <p style="font-size: 0.92rem; color: #aaa; line-height: 1.5;">${p.desc}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- SOBRE EDUARDO ---- */
  _sobre(e) {
    return `
    <section class="section lsobre" style="background: #08080a; border-top: 1px solid rgba(234,171,94,0.1); border-bottom: 1px solid rgba(234,171,94,0.1);">
      <div class="container lsobre-inner">
        <div class="lsobre-avatar reveal">
          <div class="lsobre-av-wrap" style="border-color: var(--gold);">
            <img src="/assets/foto-sobre.jpg" alt="Eduardo Souza" class="lsobre-av" style="object-fit:cover; border-radius:50%; border: 2px solid var(--gold);" />
            <div class="lsobre-av-ring" style="border-color: rgba(234,171,94,0.3);"></div>
          </div>
        </div>
        <div class="lsobre-text reveal delay-2">
          <div class="lsobre-tag" style="color: var(--gold);">AUTORIDADE & TRADIÇÃO</div>
          <h3 style="font-family:var(--font-title); font-size: 1.8rem; margin-bottom: 12px;">Eduardo Souza</h3>
          <p style="margin-bottom: 14px; font-size: 1.05rem; line-height: 1.7; color: #ccc;">
            "A Goetia sempre foi tratada com extremos: ou com medo cego e infantil, ou com arrogância e imprudência. Neste grimório, eu coloquei a chave mestra que faltava na literatura de língua portuguesa."
          </p>
          <p style="font-size: 0.95rem; line-height: 1.6; color: #999;">
            Você vai ter em mãos a estrutura pura do Lemegeton traduzida para o dia a dia, com métodos de proteção rigorosos e o passo a passo exato para obter respostas e manifestações materiais sem colocar sua vida ou sua mente em risco.
          </p>
        </div>
      </div>
    </section>`;
  }

  /* ---- ARSENAL ---- */
  _arsenal(e) {
    return `
    <section class="section larsenal" style="background: #0c0c0f;">
      <div class="container">
        <div class="section-header reveal">
          <div class="lsec-tag" style="color:var(--gold);">O QUE ESTÁ INCLUSO</div>
          <h2 class="section-title">O Arsenal Completo para <span class="text-gold">Sua Prática Goética</span></h2>
          <p class="section-subtitle">Tudo o que você precisa para dominar a invocação e evocação das 72 forças sem depender de ninguém.</p>
        </div>
        <div class="larsenal-grid">
          ${e.features.map(f => `
          <div class="larsenal-item card reveal" style="border-color: rgba(234,171,94,0.2); background: rgba(20,20,24,0.8);">
            <span class="larsenal-check" style="color:var(--gold);">✦</span>
            <span style="color: #ddd; font-size: 0.95rem; line-height: 1.5;">${f}</span>
          </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:48px;" class="reveal">
          <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer" id="arsenal-cta" style="padding: 18px 40px; font-size: 1.1rem; box-shadow: 0 8px 30px rgba(234,171,94,0.3);">
            ✦ Quero Garantir Meu Grimório de Goetia
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- SUMÁRIO ---- */
  _sumario(e) {
    if (!e.chapters || !e.chapters.length) return '';
    return `
    <section class="section lsumario section-alt" style="background: #08080a;">
      <div class="container" style="max-width:860px">
        <div class="section-header reveal">
          <div class="lsec-tag" style="color: var(--gold);">CONTEÚDO PROGRAMÁTICO</div>
          <h2 class="section-title">Capítulos do <span class="text-gold">Grimório</span></h2>
          <p class="section-subtitle">Uma jornada estruturada do primeiro contato à maestria dos rituais.</p>
        </div>
        <div class="lchapters">
          ${e.chapters.map((c, i) => `
          <div class="lchapter card reveal delay-${(i % 3) + 1}" style="border: 1px solid rgba(234,171,94,0.2); background: rgba(18,18,22,0.95); margin-bottom: 16px;">
            <div class="lchapter-num" style="background: rgba(234,171,94,0.15); color: var(--gold); border: 1px solid rgba(234,171,94,0.3);">${c.num}</div>
            <div class="lchapter-body">
              <h4 style="color: #fff; font-family: var(--font-title); font-size: 1.15rem; margin-bottom: 6px;">${c.title}</h4>
              <p style="color: #aaa; font-size: 0.92rem; line-height: 1.5;">${c.desc}</p>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- BÔNUS EXCLUSIVOS ---- */
  _bonus(e) {
    const bonuses = [
      {
        num: '01',
        title: 'Tabela de Correspondências Planetárias & Horários Mágicos',
        val: 'R$ 47,00',
        desc: 'O guia rápido para calcular a melhor lua, hora planetária e incenso para cada um dos 72 Daemons, aumentando em 10x o alinhamento energético do ritual.'
      },
      {
        num: '02',
        title: 'Compilado dos 72 Selos em Alta Resolução para Impressão',
        val: 'R$ 37,00',
        desc: 'Todos os 72 sigilos limpos e vetorizados, prontos para você imprimir em papel vegetal, traçar ou consagrar no seu próprio altar de práticas.'
      },
      {
        num: '03',
        title: 'Guia Prático de Blindagem & Banimento Salomoniano',
        val: 'R$ 49,00',
        desc: 'O ritual de fechamento de corpo e limpeza energética pós-evocação que anula qualquer resquício energético indesejado na sua casa.'
      }
    ];

    return `
    <section class="section" style="background: #0d0d12; border-top: 1px solid rgba(234,171,94,0.15); border-bottom: 1px solid rgba(234,171,94,0.15);">
      <div class="container" style="max-width: 900px;">
        <div class="section-header reveal">
          <div class="lsec-tag" style="color: var(--gold);">EXCLUSIVIDADE DESTE LOTE</div>
          <h2 class="section-title">3 Bônus Especiais <span class="text-gold">Inclusos Gratuitamente</span></h2>
          <p class="section-subtitle">Ao garantir seu acesso hoje durante a promoção de lançamento, você recebe estes 3 materiais complementares sem pagar nada a mais.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 36px;">
          ${bonuses.map((b, i) => `
          <div class="card reveal delay-${i+1}" style="padding: 24px; background: rgba(22,22,28,0.9); border: 1px solid rgba(234,171,94,0.25); border-radius: 12px; display: flex; flex-wrap: wrap; gap: 20px; align-items: center; justify-content: space-between;">
            <div style="flex: 1; min-width: 260px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-family: var(--font-title); font-weight: 700; color: var(--gold); font-size: 0.85rem; background: rgba(234,171,94,0.12); padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(234,171,94,0.3);">BÔNUS #${b.num}</span>
                <span style="font-size: 0.8rem; color: #888; text-decoration: line-through;">Vendido separadamente por ${b.val}</span>
              </div>
              <h3 style="font-size: 1.15rem; color: #fff; font-family: var(--font-title); margin-bottom: 6px;">${b.title}</h3>
              <p style="font-size: 0.9rem; color: #aaa; line-height: 1.5;">${b.desc}</p>
            </div>
            <div style="text-align: right; min-width: 110px;">
              <span style="display: inline-block; font-family: var(--font-title); font-size: 1.1rem; color: #4ade80; font-weight: 700; background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); padding: 8px 16px; border-radius: 8px;">
                GRÁTIS
              </span>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- IMAGINE ---- */
  _imagine(e) {
    const items = [
      'Sabendo exatamente qual entidade evocar para acelerar suas metas financeiras e profissionais.',
      'Com o domínio mental para praticar magia com serenidade, respeito e sem nenhum medo irracional.',
      'Utilizando o Círculo e o Selo de Salomão para blindar sua vida contra ataques astrais e inveja.',
      'Sentindo a autoridade espiritual de quem estuda a fonte tradicional do Lemegeton.',
      'E colhendo resultados tangíveis na matéria através de uma prática bem executada.'
    ];
    return `
    <section class="section limagine" style="background: #08080a;">
      <div class="container" style="max-width:820px">
        <div class="section-header reveal">
          <div class="lsec-tag" style="color: var(--gold);">A SUA TRANSFORMAÇÃO</div>
          <h2 class="section-title">Como será a sua prática após <span class="text-gold">ler este Grimório</span></h2>
        </div>
        <div class="limagine-list">
          ${items.map((it, i) => `
          <div class="limagine-item reveal delay-${i + 1}">
            <span class="limagine-arrow" style="color: var(--gold);">✦</span>
            <p style="color: #ddd; font-size: 0.98rem; line-height: 1.6;">${it}</p>
          </div>`).join('')}
        </div>
        <div class="limagine-footer reveal" style="text-align: center; margin-top: 40px;">
          <p style="color: #aaa; margin-bottom: 24px;">A soberania espiritual não é um dom especial de poucos: é um conhecimento que se estuda e se aplica.</p>
          <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer" id="imagine-cta" style="padding: 18px 40px; font-size: 1.1rem; box-shadow: 0 8px 30px rgba(234,171,94,0.3);">
            ✦ Quero Assumir a Soberania Agora
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- DEPOIMENTOS ---- */
  _depoimentos(e) {
    if (!e.testimonials || !e.testimonials.length) return '';
    return `
    <section class="section ldeps section-alt" style="background: #0d0d12;">
      <div class="container">
        <div class="section-header reveal">
          <div class="lsec-tag" style="color: var(--gold);">PROVA SOCIAL</div>
          <h2 class="section-title">O que dizem os praticantes que <span class="text-gold">já aplicaram</span></h2>
        </div>
        <div class="ldep-grid">
          ${e.testimonials.map((t, i) => `
          <div class="ldep card reveal delay-${i + 1}" style="border: 1px solid rgba(234,171,94,0.2); background: rgba(18,18,22,0.9);">
            <div class="ldep-quote" style="color: var(--gold);">"</div>
            <p style="color: #ccc; line-height: 1.6; font-size: 0.95rem;">"${t.text}"</p>
            <div class="ldep-foot">
              <strong style="color: var(--gold);">${t.name}</strong>
              <span style="color: #888;">${t.location}</span>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- PREÇO ---- */
  _preco(e) {
    return `
    <section class="section lpreco" id="oferta" style="background: radial-gradient(circle at center, rgba(30,20,10,0.9), #08080a 85%); border-top: 1px solid rgba(234,171,94,0.2);">
      <div class="container" style="max-width:720px">
        <div class="lpreco-box" style="border: 2px solid var(--gold); box-shadow: 0 0 50px rgba(234,171,94,0.25), 0 20px 60px rgba(0,0,0,0.8); background: #121216; padding: 48px 36px; border-radius: 16px;">
          
          <div class="lpreco-icon" style="font-size: 3rem; margin-bottom: 12px;">${e.icon}</div>
          <div style="display: inline-block; background: rgba(234,171,94,0.15); border: 1px solid var(--gold); color: var(--gold); padding: 4px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">
            ✦ OFERTA EXCLUSIVA DE LANÇAMENTO ✦
          </div>
          
          <h3 class="lpreco-title" style="font-family: var(--font-title); font-size: 1.9rem; margin-bottom: 8px;">${e.title}</h3>
          <p class="lpreco-sub" style="color: #aaa; font-size: 0.95rem; margin-bottom: 24px;">${e.subtitle}</p>
          
          <!-- Box de ancoragem de valor -->
          <div style="background: rgba(0,0,0,0.4); border: 1px dashed rgba(234,171,94,0.3); border-radius: 10px; padding: 16px; margin-bottom: 24px; text-align: left; font-size: 0.88rem; color: #bbb;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
              <span>Grimório Oficial Goetia em PDF:</span>
              <strong style="color: #eee;">R$ 97,00</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
              <span>3 Bônus Exclusivos de Lançamento:</span>
              <strong style="color: #4ade80;">R$ 133,00 (GRÁTIS)</strong>
            </div>
            <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0;"></div>
            <div style="display:flex; justify-content:space-between; font-weight: 700; color: #fff;">
              <span>Valor Total Real:</span>
              <span style="text-decoration: line-through; color: #888;">R$ 230,00</span>
            </div>
          </div>

          <div class="lpreco-price-area" style="margin-bottom: 28px;">
            <div class="lpreco-from" style="font-size: 1rem; color: #888; text-decoration: line-through; margin-bottom: 4px;">De R$ ${e.priceFrom.toFixed(2).replace('.', ',')} por apenas:</div>
            <div class="lpreco-value" style="display: flex; align-items: baseline; justify-content: center; gap: 4px;">
              <span class="lpreco-currency" style="font-size: 1.8rem; color: var(--gold); font-family: var(--font-title);">R$</span>
              <span class="lpreco-num" style="font-size: clamp(3.2rem, 8vw, 4.5rem); font-weight: 900; color: #fff; font-family: var(--font-title); line-height: 1; text-shadow: 0 0 25px rgba(234,171,94,0.4);">${e.priceTo.toFixed(2).replace('.', ',')}</span>
            </div>
            <div style="color: var(--gold); font-size: 0.9rem; margin-top: 6px; font-weight: 600;">
              Ou até 12x no cartão de crédito
            </div>
          </div>

          <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-full btn-shimmer lpreco-btn" id="preco-cta" style="padding: 22px 24px; font-size: 1.2rem; font-weight: 700; border-radius: 8px; box-shadow: 0 10px 40px rgba(234,171,94,0.4);">
            ✦ GARANTIR ACESSO IMEDIATO
          </a>

          <!-- Selos de segurança -->
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-top: 24px; color: #aaa; font-size: 0.8rem;">
            <span>⚡ Entrega Automática Imediata</span>
            <span>🔒 Plataforma 100% Segura</span>
            <span>🛡️ Garantia de 7 Dias</span>
          </div>

          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.85rem; color: #888;">
            <p>Se em até 7 dias você achar que o conteúdo não agregou na sua caminhada mágica, a Kirvano devolve 100% do seu dinheiro sem burocracia.</p>
          </div>

        </div>
      </div>
    </section>`;
  }

  /* ---- FAQ ---- */
  _faq(e) {
    if (!e.faqs || !e.faqs.length) return '';
    return `
    <section class="section lfaq section-alt" style="background: #08080a;">
      <div class="container" style="max-width:800px">
        <div class="section-header reveal">
          <div class="lsec-tag" style="color: var(--gold);">PERGUNTAS FREQUENTES</div>
          <h2 class="section-title">Dúvidas <span class="text-gold">Frequentes</span></h2>
          <p class="section-subtitle">Tudo o que você precisa saber antes de adquirir o grimório.</p>
        </div>
        <div class="lfaq-list">
          ${e.faqs.map((f, i) => `
          <div class="lfaq-item card reveal delay-${(i % 3) + 1}" style="border: 1px solid rgba(234,171,94,0.15); background: rgba(18,18,22,0.85); margin-bottom: 12px;">
            <div class="lfaq-question" style="font-family: var(--font-title); font-size: 1.05rem; color: #f0ece0; padding: 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>${f.q}</span>
              <span class="lfaq-arrow" style="color: var(--gold); font-size: 1.2rem; transition: transform 0.3s;">▼</span>
            </div>
            <div class="lfaq-answer" style="display:none; padding: 0 20px 20px; color: #aaa; line-height: 1.6; font-size: 0.95rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 14px;">
              <p>${f.a}</p>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /* ---- FINAL CTA ---- */
  _finalCta(e) {
    return `
    <section class="section lfinal-cta" style="background: radial-gradient(circle at 50% 50%, rgba(25,15,5,0.9), #060608 80%); padding: 90px 0; text-align: center; border-top: 1px solid rgba(234,171,94,0.2);">
      <div class="container" style="max-width:760px">
        <div class="lhero-badge reveal" style="margin-bottom: 16px; color: var(--gold);">✦ A HORA DA ESCOLHA ✦</div>
        <h2 class="section-title reveal delay-1" style="font-size: clamp(2rem, 4.5vw, 2.8rem); margin-bottom: 18px;">
          Você continuará refém das circunstâncias ou assumirá a <span class="text-gold">Sua Soberania?</span>
        </h2>
        <p style="color: #bbb; font-size: 1.05rem; margin-bottom: 36px; line-height: 1.6;" class="reveal delay-2">
          O Lemegeton é o conhecimento que moldou impérios e atravessou eras. Clique no botão abaixo para desbloquear seu acesso imediato por apenas <strong>R$ ${e.priceTo.toFixed(2).replace('.', ',')}</strong>.
        </p>
        <div class="reveal delay-3">
          <a href="${e.paymentLink}" target="_blank" class="btn btn-primary btn-lg btn-shimmer" id="final-buy-cta" style="padding: 22px 48px; font-size: 1.2rem; font-weight: 700; box-shadow: 0 10px 40px rgba(234,171,94,0.4);">
            ✦ SIM, QUERO O GRIMÓRIO DE GOETIA AGORA
          </a>
        </div>
      </div>
    </section>`;
  }

  /* ---- FAQ ACCORDION ---- */
  _initFaq() {
    this.container.querySelectorAll('.lfaq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const ans = item.querySelector('.lfaq-answer');
        const arrow = q.querySelector('.lfaq-arrow');
        const isVisible = ans.style.display === 'block';

        this.container.querySelectorAll('.lfaq-answer').forEach(a => a.style.display = 'none');
        this.container.querySelectorAll('.lfaq-arrow').forEach(a => a.style.transform = 'rotate(0deg)');

        if (!isVisible) {
          ans.style.display = 'block';
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      });
    });
  }

  /* ---- CRONÔMETRO DE ESCASSEZ ---- */
  _timer() {
    let totalSec = 3 * 3600 + 47 * 60 + 22; // 3h 47m 22s
    const th = document.getElementById('th');
    const tm = document.getElementById('tm');
    const ts = document.getElementById('ts');

    if (!th || !tm || !ts) return;

    const tick = () => {
      if (totalSec <= 0) totalSec = 4 * 3600; // loop
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      th.textContent = String(h).padStart(2, '0');
      tm.textContent = String(m).padStart(2, '0');
      ts.textContent = String(s).padStart(2, '0');
      totalSec--;
    };

    tick();
    this._interval = setInterval(tick, 1000);
  }

  _notFound() {
    this.container.innerHTML = `
      <div style="text-align:center; padding: 120px 20px; color:#fff;">
        <h2>eBook não encontrado</h2>
        <p><a href="/ebooks" style="color:var(--gold);">Voltar para eBooks</a></p>
      </div>`;
  }
}
