import { Router } from '../router.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';

const WA = 'https://wa.me/5551992395284?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta.';

export class AtendimentosPage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('css/atendimentos.css');
    this._render();
    Navbar.init();
    Router.initReveal();
    this._initFaq();
  }

  _render() {
    const servicos = [
      { icon: '🃏', title: 'Consulta de Tarot',   desc: 'Leitura completa e detalhada dos caminhos da sua vida. Respostas para amor, finanças, saúde e espiritualidade.',       prazo: 'até 48h',       id: 'srv-tarot'   },
      { icon: '💰', title: 'Abertura Financeira',  desc: 'Desbloqueie os caminhos da prosperidade e abundância. Trabalho para atrair oportunidades e destravar o fluxo.',        prazo: '7 a 21 dias',   id: 'srv-fin'     },
      { icon: '❤️', title: 'Trabalho Amoroso',     desc: 'Retorno, atração e harmonização de relações. Pombagiras e Exus no caminho do amor com sabedoria e respeito.',          prazo: '7 a 21 dias',   id: 'srv-amor'    },
      { icon: '🔥', title: 'Limpeza Espiritual',   desc: 'Descarrego profundo de energias e miasmas negativos. Banhos, defumações e firmezas para limpar o campo.',             prazo: '3 a 7 dias',    id: 'srv-limpeza' },
      { icon: '🛡️', title: 'Proteção Espiritual',  desc: 'Blindagem e escudo contra demandas, mau-olhado e inveja. Proteção sólida para você e sua família.',                   prazo: '7 a 14 dias',   id: 'srv-prot'    },
    ];

    const faqs = [
      { q: 'Quanto tempo demora o atendimento?', a: 'Depende do tipo de trabalho. Consultas de Tarot são realizadas em até 48h. Trabalhos espirituais podem levar de 3 a 21 dias conforme a força necessária.' },
      { q: 'Os trabalhos são presenciais?', a: 'Não necessariamente. A maioria dos atendimentos pode ser feita à distância com a mesma eficácia. Entre em contato pelo WhatsApp para alinhamos os detalhes.' },
      { q: 'Os trabalhos espirituais são seguros?', a: 'Sim. Todo trabalho é conduzido com respeito às tradições e dentro de uma ética espiritual séria. Trabalho com responsabilidade e sem promessas vazias.' },
      { q: 'Como funciona o pagamento?', a: 'Alinhamos os valores e condições diretamente pelo WhatsApp antes de qualquer trabalho. Transparência total em todas as etapas.' },
    ];

    this.container.innerHTML =
      Navbar.render('atendimentos') +
      `<main>
        <!-- Hero -->
        <section class="section atend-hero section-alt">
          <div class="container" style="text-align:center">
            <div class="atend-hero-icon reveal">🕯️</div>
            <h1 class="section-title reveal delay-1">Atendimentos <span class="text-gold">espirituais</span></h1>
            <p class="section-subtitle reveal delay-2" style="max-width:600px;margin:0 auto 32px">
              Cada trabalho é conduzido com seriedade, respeito e conhecimento real da tradição de Quimbanda.
            </p>
            <a href="${WA}" target="_blank" class="btn btn-primary btn-lg btn-shimmer reveal delay-3" id="atend-hero-cta">
              Agendar pelo WhatsApp
            </a>
          </div>
        </section>

        <!-- Serviços -->
        <section class="section atend-servicos">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Trabalhos</span>
              <h2 class="section-title">Escolha o seu <span class="text-gold">serviço</span></h2>
            </div>
            <div class="atend-grid">
              ${servicos.map((s, i) => `
              <div class="atend-card card reveal delay-${i + 1}">
                <div class="atend-card-icon">${s.icon}</div>
                <h3>${s.title}</h3>
                <p>${s.desc}</p>
                <div class="atend-prazo">⏱ Prazo: ${s.prazo}</div>
                <a href="${WA}" target="_blank" class="btn btn-outline" id="${s.id}">Agendar no WhatsApp</a>
              </div>`).join('')}
            </div>
          </div>
        </section>

        <!-- Processo -->
        <section class="section atend-processo section-alt">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">O processo</span>
              <h2 class="section-title">Como <span class="text-gold">funciona</span></h2>
            </div>
            <div class="processo-grid">
              ${[
                ['01','Escolha o atendimento','Veja os serviços disponíveis e escolha o que melhor se encaixa no seu momento.'],
                ['02','Fale comigo no WhatsApp','Envie sua mensagem, apresente sua situação e tire todas as dúvidas.'],
                ['03','Receba as orientações','Alinhamos todos os detalhes, valores e prazos antes de começar.'],
                ['04','Atendimento realizado','O trabalho é conduzido e você recebe o retorno completo.'],
              ].map(([n, t, d], i) => `
              <div class="prc-step reveal delay-${i + 1}">
                <div class="prc-num">${n}</div>
                <h4>${t}</h4>
                <p>${d}</p>
              </div>`).join('')}
            </div>
            <div style="text-align:center;margin-top:48px;" class="reveal">
              <a href="${WA}" target="_blank" class="btn btn-primary btn-lg btn-shimmer" id="processo-cta">Começar agora</a>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section class="section atend-faq">
          <div class="container" style="max-width:760px">
            <div class="section-header reveal">
              <span class="section-tag">Dúvidas</span>
              <h2 class="section-title">Perguntas <span class="text-gold">frequentes</span></h2>
            </div>
            <div class="faq-list">
              ${faqs.map((f, i) => `
              <div class="faq-item reveal" id="afaq-${i}">
                <button class="faq-q" id="afaq-btn-${i}">
                  <span>${f.q}</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-a">
                  <div class="faq-a-inner"><p>${f.a}</p></div>
                </div>
              </div>`).join('')}
            </div>
            <div style="text-align:center;margin-top:40px;" class="reveal">
              <a href="${WA}" target="_blank" class="btn btn-primary" id="atend-faq-cta">Fale comigo agora</a>
            </div>
          </div>
        </section>
      </main>` +
      Footer.render();
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
}
