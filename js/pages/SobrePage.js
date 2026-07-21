import { Router } from '../router.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';

export class SobrePage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('/css/sobre.css');
    this._render();
    Navbar.init();
    Router.initReveal();
  }

  _render() {
    this.container.innerHTML =
      Navbar.render('sobre') +
      `<main>
        <!-- Hero -->
        <section class="section sobre-page section-alt">
          <div class="container sobre-page-grid">
            <div class="sp-visual reveal">
              <div class="sp-av-wrap">
                <img src="assets/foto-perfil.png" alt="Eduardo Souza" class="sp-av">
                <div class="sp-av-ring"></div>
                <div class="sp-av-ring ring2"></div>
              </div>
              <div class="sp-float">@buutzke</div>
            </div>
            <div class="sp-text reveal delay-2">
              <span class="section-tag">O criador</span>
              <h1 class="section-title">Eduardo <span class="text-gold">Souza</span></h1>
              <p class="sp-lead">Criador de conteúdo sobre espiritualidade, Quimbanda e ocultismo. Mais de 100 mil pessoas acompanham diariamente meus conteúdos nas redes sociais.</p>
              <div class="sp-stats">
                <div class="sp-stat"><span>+100mil</span><small>Seguidores</small></div>
                <div class="sp-stat"><span>Milhões</span><small>de visualizações</small></div>
                <div class="sp-stat"><span>Diário</span><small>Conteúdo novo</small></div>
              </div>
              <div class="sp-btns">
                <a href="https://www.instagram.com/buutzke/" target="_blank" class="btn btn-primary" id="sp-ig">@buutzke no Instagram</a>
                <a href="https://wa.me/5551992395284" target="_blank" class="btn btn-outline" id="sp-wa">WhatsApp</a>
              </div>
            </div>
          </div>
        </section>

        <!-- Missão -->
        <section class="section sp-missao">
          <div class="container" style="max-width:820px">
            <div class="section-header reveal">
              <span class="section-tag">Missão</span>
              <h2 class="section-title">O oculto sem <span class="text-gold">fantasias</span></h2>
            </div>
            <div class="sp-quote-big reveal">
              "Passei anos estudando o que os livros comuns escondem. O que eu reuni é o mesmo conhecimento que muitos pagam fortunas em consultas para acessar — só que direto na fonte, sem intermediário, sem enganação."
            </div>
            <p class="reveal delay-2" style="text-align:center;">
              Meu objetivo é ensinar de forma séria, sem fantasias, baseada em conhecimento real e tradição. Quimbanda não é moda, não é espetáculo — é caminho.
            </p>
          </div>
        </section>

        <!-- Tópicos -->
        <section class="section sp-topicos section-alt">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Conteúdo</span>
              <h2 class="section-title">O que você encontra <span class="text-gold">aqui</span></h2>
            </div>
            <div class="sp-topicos-grid">
              ${[
                ['🔱', 'Quimbanda', 'A tradição real. História, entidades, fundamentos e caminho.'],
                ['🕯️', 'Ritualística', 'Firmezas, oferendas, banhos e práticas seguras e eficazes.'],
                ['📚', 'eBooks', 'Conhecimento condensado e direto. Leia no celular, aplique na vida.'],
                ['🛡️', 'Proteção', 'Como se blindar de energias negativas, inveja e demandas.'],
                ['❤️', 'Amor & Prosperidade', 'A Quimbanda no caminho das realizações materiais.'],
                ['🌿', 'Ervas & Banhos', 'O poder das plantas sagradas aplicado à espiritualidade.'],
              ].map(([icon, title, desc], i) => `
              <div class="sp-topico card reveal delay-${(i % 3) + 1}">
                <div class="sp-top-icon">${icon}</div>
                <h3>${title}</h3>
                <p>${desc}</p>
              </div>`).join('')}
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="section sp-cta">
          <div class="container" style="text-align:center;max-width:600px">
            <div class="ornament">✦ BUUTZKE ✦</div>
            <h2 class="section-title reveal" style="margin:24px 0">Pronto para começar <span class="text-gold">sua jornada?</span></h2>
            <div class="sp-cta-btns reveal delay-1">
              <a href="/ebooks" class="btn btn-primary btn-lg btn-shimmer" id="sp-cta-ebooks">Ver os eBooks</a>
              <a href="/atendimentos" class="btn btn-outline btn-lg" id="sp-cta-atend">Agendar Atendimento</a>
            </div>
          </div>
        </section>
      </main>` +
      Footer.render();
  }
}
