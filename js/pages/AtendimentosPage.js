import { Router } from '../router.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';

const WA_BASE = 'https://wa.me/5551992395284';

export class AtendimentosPage {
  constructor(container) {
    this.container = container;
    Router.loadCSS('/css/atendimentos.css?v=' + Date.now());
    this._render();
    Navbar.init();
    Router.initReveal();
    this._initFaq();
  }

  _render() {
    const servicos = [
      { 
        icon: '🃏', 
        title: 'Consulta de Tarot',   
        desc: 'Leitura profunda e detalhada das encruzilhadas da sua vida. Clareza direta para amor, finanças, caminhos espirituais e tomada de decisões.',
        prazo: 'até 48h úteis',
        badge: 'MAIS PROCURADO',
        id: 'srv-tarot',
        msg: 'Olá Buutzke! Gostaria de agendar uma Consulta de Tarot.'
      },
      { 
        icon: '💰', 
        title: 'Abertura Financeira',  
        desc: 'Desbloqueio de fluxos de prosperidade e atração de oportunidades materiais com fundamento na Quimbanda e Exu do Ouro.',
        prazo: '7 a 21 dias',
        badge: 'ALTA PROCURA',
        id: 'srv-fin',
        msg: 'Olá Buutzke! Gostaria de informações sobre o trabalho de Abertura Financeira.'
      },
      { 
        icon: '❤️', 
        title: 'Trabalho Amoroso',     
        desc: 'Harmonização de casais, quebra de afastamentos e magnetismo pessoal através de Pombagiras e entidades de firmeza amorosa.',
        prazo: '7 a 21 dias',
        badge: 'SIGILOSO',
        id: 'srv-amor',
        msg: 'Olá Buutzke! Gostaria de informações sobre Trabalho Amoroso.'
      },
      { 
        icon: '🔥', 
        title: 'Limpeza Espiritual',   
        desc: 'Descarrego profundo de cargas pesadas, inveja acumulada, miasmas astrais e quebra de demandas espirituais.',
        prazo: '3 a 7 dias',
        badge: 'URGENTE',
        id: 'srv-limpeza',
        msg: 'Olá Buutzke! Preciso de uma Limpeza Espiritual urgente.'
      },
      { 
        icon: '🛡️', 
        title: 'Proteção Espiritual',  
        desc: 'Blindagem e fechamento de corpo ritualístico contra feitiçaria, perseguições astrais e energias nocivas.',
        prazo: '7 a 14 dias',
        badge: 'FUNDAMENTO',
        id: 'srv-prot',
        msg: 'Olá Buutzke! Gostaria de realizar uma Proteção Espiritual.'
      },
    ];

    const faqs = [
      { q: 'Como é feito o agendamento?', a: 'Você clica no botão do atendimento desejado e fala diretamente comigo no WhatsApp. Analiso sua situação, esclareço dúvidas e definimos a melhor conduta.' },
      { q: 'Os atendimentos e trabalhos são à distância?', a: 'Sim. Todo o fundamento ritualístico e as leituras oraculares possuem a mesma força e eficácia à distância, acompanhados por fotos, vídeos e orientações em áudio.' },
      { q: 'Quanto tempo leva para ver resultados?', a: 'O prazo varia conforme a complexidade e a sua situação espiritual. Cada trabalho tem seu tempo de maturação, que é informado com transparência antes de iniciar.' },
      { q: 'Existe garantia de resultado?', a: 'Espiritualidade séria não vende ilusões ou falsas promessas mágicas instantâneas. Garanto dedicação rigorosa, fundamento tradicional de Quimbanda e acompanhamento de verdade.' },
      { q: 'Como funciona o pagamento?', a: 'O pagamento é feito via PIX ou cartão de crédito parcelado de forma 100% segura, alinhado diretamente no WhatsApp antes do início.' },
    ];

    this.container.innerHTML =
      Navbar.render('atendimentos') +
      `<main class="atend-main">
        <!-- Hero -->
        <section class="section atend-hero">
          <div class="atend-hero-glow" aria-hidden="true"></div>
          <div class="container" style="text-align:center; position:relative; z-index:2;">
            <div class="atend-hero-badge reveal">✦ ATENDIMENTOS PARTICULARES ✦</div>
            <h1 class="section-title reveal delay-1" style="font-size:clamp(2.2rem, 5.5vw, 3.4rem); margin-bottom:18px;">
              Trabalhos &amp; Consultas <span class="text-gold">Espirituais</span>
            </h1>
            <p class="section-subtitle reveal delay-2" style="max-width:640px; margin:0 auto 36px; font-size:1.1rem; line-height:1.7;">
              Sem invenções, sem promessas vazias. Conduzido com fundamento, sigilo absoluto e a força real da Quimbanda e dos Oráculos.
            </p>
            <div class="atend-hero-actions reveal delay-3">
              <a href="${WA_BASE}?text=${encodeURIComponent('Olá Buutzke, gostaria de agendar uma consulta/trabalho espiritual.')}" target="_blank" rel="noopener" class="btn btn-primary btn-lg btn-shimmer" id="atend-hero-cta">
                <span>💬</span> Falar com Buutzke no WhatsApp
              </a>
              <div class="atend-hero-trust">
                <span>🔒 Sigilo 100% Garantido</span>
                <span>⚡ Resposta Rápida</span>
                <span>🔱 Tradição e Fundamento</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Serviços -->
        <section class="section atend-servicos">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Atendimentos Oficiais</span>
              <h2 class="section-title">Escolha o seu <span class="text-gold">direcionamento</span></h2>
              <p class="section-subtitle">Selecione o serviço ideal para o momento que você está vivenciando</p>
            </div>
            
            <div class="atend-grid">
              ${servicos.map((s, i) => {
                const waLink = `${WA_BASE}?text=${encodeURIComponent(s.msg)}`;
                return `
                <article class="atend-card card reveal delay-${(i % 3) + 1}" id="card-${s.id}">
                  <div class="atend-card-top">
                    <span class="atend-badge">${s.badge}</span>
                    <span class="atend-prazo">⏱ ${s.prazo}</span>
                  </div>
                  <div class="atend-card-icon" aria-hidden="true">${s.icon}</div>
                  <h3 class="atend-card-title">${s.title}</h3>
                  <p class="atend-card-desc">${s.desc}</p>
                  <div class="atend-card-action">
                    <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-outline atend-card-btn" id="${s.id}">
                      <span>Agendar pelo WhatsApp</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>`;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- Processo -->
        <section class="section atend-processo section-alt">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Metodologia</span>
              <h2 class="section-title">Como funciona o seu <span class="text-gold">atendimento</span></h2>
              <p class="section-subtitle">Passo a passo com clareza, do primeiro contato à entrega</p>
            </div>
            
            <div class="processo-grid">
              ${[
                ['01', 'Primeiro Contato', 'Você clica no botão e me relata a sua situação pelo WhatsApp com total privacidade.'],
                ['02', 'Diagnóstico Real', 'Avalio se o seu caso requer oráculo, limpeza ou trabalho específico de fundamento.'],
                ['03', 'Alinhamento Claro', 'Apresento as orientações, datas e como o procedimento será conduzido.'],
                ['04', 'Execução e Retorno', 'O trabalho é firmado com respeito à tradição e você recebe o retorno detalhado.'],
              ].map(([n, t, d], i) => `
              <div class="prc-step reveal delay-${i + 1}">
                <div class="prc-num">${n}</div>
                <h4>${t}</h4>
                <p>${d}</p>
              </div>`).join('')}
            </div>

            <div style="text-align:center; margin-top:52px;" class="reveal">
              <a href="${WA_BASE}?text=${encodeURIComponent('Olá Buutzke, li o passo a passo e gostaria de dar início ao meu atendimento.')}" target="_blank" rel="noopener" class="btn btn-primary btn-lg btn-shimmer" id="processo-cta">
                Iniciar Meu Atendimento Agora
              </a>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section class="section atend-faq">
          <div class="container" style="max-width:760px">
            <div class="section-header reveal">
              <span class="section-tag">Perguntas Frequentes</span>
              <h2 class="section-title">Dúvidas sobre os <span class="text-gold">trabalhos</span></h2>
            </div>
            
            <div class="faq-list">
              ${faqs.map((f, i) => `
              <div class="faq-item reveal" id="afaq-${i}">
                <button class="faq-q" id="afaq-btn-${i}" aria-expanded="false">
                  <span>${f.q}</span>
                  <span class="faq-icon" aria-hidden="true">+</span>
                </button>
                <div class="faq-a">
                  <div class="faq-a-inner"><p>${f.a}</p></div>
                </div>
              </div>`).join('')}
            </div>

            <div style="text-align:center; margin-top:44px;" class="reveal">
              <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:18px;">Ainda tem alguma dúvida específica sobre o seu caso?</p>
              <a href="${WA_BASE}?text=${encodeURIComponent('Olá Buutzke, tenho uma dúvida sobre os atendimentos.')}" target="_blank" rel="noopener" class="btn btn-outline" id="atend-faq-cta">
                Tirar Dúvida no WhatsApp
              </a>
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
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('open');
          const b = i.querySelector('.faq-q');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
}
