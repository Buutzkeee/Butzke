import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { ebooksData } from '../data/ebooks.js';

export class ObrigadoPage {
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    const navbarHtml = Navbar.render('obrigado');
    const footerHtml = Footer.render();
    
    // Pegando os dados do Grimório das Ervas da base de dados
    const grimorio = ebooksData.find(e => e.slug === 'grimorio-das-ervas');

    this.container.innerHTML = `
      ${navbarHtml}
      
      <main class="page-content">
        <!-- Obrigado Hero -->
        <section class="section obrigado-hero" style="min-height: 50vh; display: flex; align-items: center; text-align: center; background: radial-gradient(circle at center, rgba(204,0,0,0.1) 0%, #080808 70%);">
          <div class="container">
            <h1 class="section-title reveal" style="font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 20px;">
              Compra <span class="text-gold">Aprovada!</span>
            </h1>
            <p class="reveal delay-1" style="font-size: 1.1rem; color: #ccc; max-width: 600px; margin: 0 auto 30px;">
              Seu acesso já foi enviado para o e-mail cadastrado na hora da compra. Verifique sua caixa de entrada (e a de spam) nos próximos 2 minutos.
            </p>
            <div class="reveal delay-2" style="font-size: 3rem; margin-bottom: 20px;">📦</div>
            <h3 class="reveal delay-2 text-gold" style="text-transform: uppercase; letter-spacing: 2px; font-size: 1rem;">
              Mas antes de fechar essa página...
            </h3>
          </div>
        </section>

        <!-- Oferta Exclusiva (Cross-sell) -->
        <section class="section section-alt" style="padding-top: 20px; padding-bottom: 80px;">
          <div class="container">
            <div class="upsell-container" style="background: var(--bg-card); border: 1px solid var(--gold-border); border-radius: var(--radius); padding: 40px; display: grid; grid-template-columns: auto 1fr; gap: 40px; align-items: center; box-shadow: var(--shadow-card);">
              
              <div class="upsell-img reveal">
                <img src="${grimorio.image}" alt="${grimorio.title}" style="width: 100%; max-width: 320px; border-radius: var(--radius-sm); border: 1px solid var(--gold-border-hover); box-shadow: 0 0 20px rgba(204,0,0,0.2); display: block;">
              </div>
              
              <div class="upsell-info reveal delay-1">
                <div style="display: inline-block; background: rgba(255,51,0,0.1); border: 1px solid var(--gold); color: var(--gold); padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;">
                  Oferta Única
                </div>
                <h2 style="font-size: 2rem; margin-bottom: 16px;">Potencialize seus <span class="text-red">Resultados</span></h2>
                <p style="color: #aaa; font-size: 1rem; margin-bottom: 24px; line-height: 1.6;">
                  Já que você decidiu transformar a sua realidade, não pare pela metade. Conheça o <strong>${grimorio.title}</strong>, um acervo profundo e secreto para quem deseja manipular o axé vegetal com precisão.
                </p>
                
                <ul style="margin-bottom: 30px;">
                  <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 10px;">
                     <span class="text-gold">✦</span> <span>Banhos de descarrego, prosperidade e atração.</span>
                  </li>
                  <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 10px;">
                     <span class="text-gold">✦</span> <span>Pós mágicos para defesa e ataque na Quimbanda.</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                     <span class="text-gold">✦</span> <span>Fundamentos práticos sem mistificação.</span>
                  </li>
                </ul>

                <a href="${grimorio.paymentLink}" class="btn btn-primary btn-lg btn-shimmer" style="display: block; text-align: center; width: 100%;">
                  ADICIONAR AO MEU ACERVO - R$ ${grimorio.priceTo.toFixed(2).replace('.', ',')}
                </a>
              </div>

            </div>
          </div>
        </section>
      </main>

      ${footerHtml}
    `;

    Navbar.init();

    // Intersection Observer para as animações de fade-in
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    this.container.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Scroll to top automatically
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Analytics
    if (window.Analytics) {
      window.Analytics.sendData('VISITA', 'Acessou a Página', 'Obrigado (Pós-Venda)');
    }
  }
}
