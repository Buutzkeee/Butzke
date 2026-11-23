import { Router } from '../router.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';

export class SobrePage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('/css/sobre.css?v=' + Date.now());
    this._render();
    Navbar.init();
    Router.initReveal();
  }

  _render() {
    this.container.innerHTML =
      Navbar.render('sobre') +
      `<main class="sobre-main">
        <!-- Hero -->
        <section class="section sobre-hero">
          <div class="sobre-hero-glow" aria-hidden="true"></div>
          <div class="container sobre-hero-grid">
            <div class="sp-visual reveal">
              <div class="sp-av-wrap">
                <img src="/assets/foto-perfil.png" alt="Buutzke — Eduardo Souza" class="sp-av" width="240" height="240">
                <div class="sp-av-ring" aria-hidden="true"></div>
                <div class="sp-av-ring ring2" aria-hidden="true"></div>
              </div>
              <div class="sp-float">
                <span class="sp-float-dot"></span>
                <span>@buutzke oficial</span>
              </div>
            </div>
            
            <div class="sp-text reveal delay-2">
              <span class="section-tag">✦ O CRIADOR DO PORTAL ✦</span>
              <h1 class="sp-title">Eduardo <span class="text-gold">Souza</span></h1>
              <p class="sp-tagline">Pesquisador, autor e sacerdote de Quimbanda Tradicional.</p>
              <p class="sp-lead">
                Dedicado a revelar os fundamentos reais da espiritualidade e da feitiçaria tradicional brasileira e salomônica, sem charlatanismo, sem fantasias hollywoodianas e sem mitos.
              </p>
              
              <div class="sp-stats">
                <div class="sp-stat">
                  <span class="sp-stat-num">+112k</span>
                  <span class="sp-stat-label">Seguidores Ativos</span>
                </div>
                <div class="sp-stat">
                  <span class="sp-stat-num">+5.000</span>
                  <span class="sp-stat-label">Leitores de Grimórios</span>
                </div>
                <div class="sp-stat">
                  <span class="sp-stat-num">100%</span>
                  <span class="sp-stat-label">Fundamento &amp; Tradição</span>
                </div>
              </div>
              
              <div class="sp-btns">
                <a href="https://www.instagram.com/buutzke/" target="_blank" rel="noopener" class="btn btn-primary btn-shimmer" id="sp-ig">
                  <span>📸</span> Seguir no Instagram
                </a>
                <a href="https://wa.me/5551992395284?text=Ol%C3%A1%20Buutzke%2C%20gostaria%20de%20conversar." target="_blank" rel="noopener" class="btn btn-outline" id="sp-wa">
                  <span>💬</span> Contato Direto
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Missão -->
        <section class="section sp-missao section-alt">
          <div class="container" style="max-width:860px">
            <div class="section-header reveal">
              <span class="section-tag">Propósito &amp; Fundamento</span>
              <h2 class="section-title">O oculto sem <span class="text-gold">fantasias</span></h2>
            </div>
            <div class="sp-quote-big reveal delay-1">
              <span class="sp-quote-mark" aria-hidden="true">“</span>
              <p>Passei anos estudando e praticando o que a maioria dos livros e falsos mestres esconde ou distorce. O que reuni nos meus grimórios é o conhecimento direto, sem intermediários e sem invenções — direto na raiz da força.</p>
            </div>
            <p class="sp-missao-desc reveal delay-2">
              Meu objetivo é ensinar com rigor, seriedade e responsabilidade. Espiritualidade de raiz não é modismo de internet, não é estética vazia — é um caminho de soberania, disciplina e transformação palpável na sua vida.
            </p>
          </div>
        </section>

        <!-- Tópicos -->
        <section class="section sp-topicos">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Pilares de Conhecimento</span>
              <h2 class="section-title">O que você estuda <span class="text-gold">neste portal</span></h2>
              <p class="section-subtitle">Pilares sólidos que formam todo o ecossistema BUUTZKE</p>
            </div>
            <div class="sp-topicos-grid">
              ${[
                ['🔱', 'Quimbanda Tradicional', 'Fundamento histórico, hierarquias, reinos, assentamentos e firmezas de Exu e Pombagira.'],
                ['🕯️', 'Magia Prática & Rituais', 'Firmezas, defumações, oferendas e práticas com segurança, sem medo e com eficácia real.'],
                ['📚', 'Grimórios em PDF', 'Manuais diretos, densos e explicados para leitura no celular e aplicação prática imediata.'],
                ['🛡️', 'Proteção & Defesa Psíquica', 'Fechamento de corpo, descarregos e quebra de demandas e energias destrutivas.'],
                ['💰', 'Prosperidade & Abertura', 'O trabalho com entidades de caminho para destravar a vida material e financeira.'],
                ['🌿', 'Ervas Sagradas', 'O segredo ancestral das plantas, banhos de axé e preparos alquímicos.'],
              ].map(([icon, title, desc], i) => `
              <div class="sp-topico card reveal delay-${(i % 3) + 1}">
                <div class="sp-top-icon" aria-hidden="true">${icon}</div>
                <h3 class="sp-top-title">${title}</h3>
                <p class="sp-top-desc">${desc}</p>
              </div>`).join('')}
            </div>
          </div>
        </section>

        <!-- CTA Final -->
        <section class="section sp-cta section-alt">
          <div class="container" style="text-align:center; max-width:680px">
            <div class="ornament">✦ BUUTZKE ✦</div>
            <h2 class="section-title reveal" style="margin:20px 0 16px;">
              Pronto para aprofundar <span class="text-gold">seus conhecimentos?</span>
            </h2>
            <p class="section-subtitle reveal delay-1" style="margin-bottom:32px;">
              Acesse agora os grimórios digitais ou agende um atendimento particular diretamente com Eduardo Souza.
            </p>
            <div class="sp-cta-btns reveal delay-2">
              <a href="/ebooks" class="btn btn-primary btn-lg btn-shimmer" id="sp-cta-ebooks">
                <span>📚</span> Conhecer os Grimórios
              </a>
              <a href="/atendimentos" class="btn btn-outline btn-lg" id="sp-cta-atend">
                <span>🕯️</span> Agendar Atendimento
              </a>
            </div>
          </div>
        </section>
      </main>` +
      Footer.render();
  }
}
