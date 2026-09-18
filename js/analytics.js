/* =====================================================
   BUUTZKE — Custom Analytics Tracker (Google Sheets)
   + Meta Pixel Events
   + TikTok Pixel Events
   ===================================================== */

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwcP0BOGEr4BP07e6MEvUObrklvIc-65lxNsceO3pupTpVwCz-mKhZGnf-uvXRSLNKC0Q/exec';

export class Analytics {
  static getUTMs() {
    try {
      // sessionStorage primeiro; localStorage como fallback para aba reaberta
      const get = key => sessionStorage.getItem(key) || localStorage.getItem(key) || '';
      return {
        utm_source:   get('utm_source'),
        utm_medium:   get('utm_medium'),
        utm_campaign: get('utm_campaign'),
        utm_term:     get('utm_term'),
        utm_content:  get('utm_content'),
      };
    } catch (e) {
      return { utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: '' };
    }
  }

  // Variáveis para rastrear tempo de tela
  static pageEntryTime = Date.now();
  static currentPagePath = window.location.pathname;
  static timeTrackerInitialized = false;

  static fetchQueue = Promise.resolve();

  static sendData(eventType, eventName, eventDetail = '', pathOverride = null) {
    if (WEBHOOK_URL === 'COLE_AQUI_A_URL_DO_GOOGLE_APPS_SCRIPT') return;

    const payload = {
      timestamp: new Date().toISOString(),
      eventType,
      eventName,
      eventDetail,
      pagePath: pathOverride || window.location.pathname,
      ...this.getUTMs()
    };

    this.fetchQueue = this.fetchQueue.then(() => {
      return new Promise(resolve => {
        try {
          fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          console.log(`[Analytics] ${eventType}: ${eventName}`);
        } catch (e) {}
        setTimeout(resolve, 400);
      });
    });
  }

  static getPageName(path) {
    if (path === '/' || path === '') return 'Home';
    if (path === '/biblioteca') return 'Biblioteca BUUTZKE (Bundle)';
    if (path.includes('/ebooks')) return 'Pagina Geral de eBooks';
    if (path.includes('/ebook/')) {
      const name = path.split('/').pop().replace(/-/g, ' ');
      return 'Vendas: ' + name.charAt(0).toUpperCase() + name.slice(1);
    }
    if (path.includes('/obrigado')) return 'Obrigado (Pos-Compra)';
    if (path.includes('/atendimentos')) return 'Atendimentos Espirituais';
    if (path.includes('/sobre')) return 'Sobre o Criador';
    if (path.includes('/linkbio')) return 'Arvore de Links (Bio)';
    return path;
  }

  static trackTimeOnPreviousPage() {
    if (!this.currentPagePath) return;
    const timeSpentSeconds = Math.round((Date.now() - this.pageEntryTime) / 1000);
    if (timeSpentSeconds > 3) {
      const pageName = this.getPageName(this.currentPagePath);
      this.sendData(
        'TEMPO DE TELA',
        'Saiu da Pagina',
        'Ficou ' + timeSpentSeconds + ' segundos na pagina: ' + pageName,
        this.currentPagePath
      );
    }
  }

  static trackPageview() {
    if (this.currentPagePath && this.currentPagePath !== window.location.pathname) {
      this.trackTimeOnPreviousPage();
    }
    const pageName = this.getPageName(window.location.pathname);
    this.sendData('VISITA', 'Acessou a Pagina', pageName);
    this.currentPagePath = window.location.pathname;
    this.pageEntryTime = Date.now();
    if (!this.timeTrackerInitialized) {
      window.addEventListener('beforeunload', () => this.trackTimeOnPreviousPage());
      this.timeTrackerInitialized = true;
    }
  }

  static initClickTracker() {
    document.body.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, .btn');
      if (!target) return;
      let label = target.textContent.trim().substring(0, 50);
      if (!label) label = 'Icone ou Imagem';
      const destination = target.href || '';

      if (window.location.pathname === '/linkbio') {
        this.sendData('CLIQUE_LINKBIO', 'Acessou Link da Bio', 'Botao: "' + label.replace(/\s+/g, ' ') + '" -> ' + destination);
        return;
      }

      if (destination.includes('kirvano.com')) {
        this.trackInitiateCheckout(label);
        this.sendData('CONVERSAO', 'Foi para o Checkout (Kirvano)', 'Botao: "' + label.replace(/\s+/g, ' ') + '"');
      } else if (destination.includes('wa.me')) {
        this.sendData('CONVERSAO', 'Chamou no WhatsApp', 'Botao: "' + label.replace(/\s+/g, ' ') + '"');
      } else if (destination.includes('instagram.com')) {
        this.sendData('CLIQUE', 'Saiu para o Instagram', 'Botao: "' + label.replace(/\s+/g, ' ') + '"');
      } else if (destination.startsWith('http') && !destination.includes(window.location.host)) {
        this.sendData('CLIQUE', 'Saiu para Link Externo', 'Botao: "' + label.replace(/\s+/g, ' ') + '" -> ' + destination);
      } else {
        this.sendData('NAVEGACAO', 'Navegou no Site', 'Clicou em: "' + label.replace(/\s+/g, ' ') + '"');
      }
    });
  }

  /* =========================================================
     PIXEL EVENTS — Meta Pixel + TikTok Pixel
     - trackViewContent: ao acessar landing page de ebook
     - trackInitiateCheckout: ao clicar em ir para checkout
     - trackPurchase: na pagina /obrigado
  ========================================================= */

  static trackViewContent(ebookTitle, price) {
    ebookTitle = ebookTitle || '';
    price = price || 0;
    try {
      if (typeof fbq === 'function') {
        fbq('track', 'ViewContent', {
          content_name: ebookTitle,
          content_type: 'product',
          value: price,
          currency: 'BRL',
        });
      }
      if (typeof ttq !== 'undefined') {
        ttq.track('ViewContent', {
          content_name: ebookTitle,
          value: price,
          currency: 'BRL',
        });
      }
      console.log('[Pixel] ViewContent:', ebookTitle, 'R$', price);
    } catch (e) {}
  }

  static trackInitiateCheckout(buttonLabel) {
    buttonLabel = buttonLabel || '';
    try {
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
          content_name: buttonLabel,
          content_type: 'product',
        });
      }
      if (typeof ttq !== 'undefined') {
        ttq.track('InitiateCheckout', {
          content_name: buttonLabel,
        });
      }
      console.log('[Pixel] InitiateCheckout:', buttonLabel);
    } catch (e) {}
  }

  static trackPurchase(ebookSlug, value) {
    ebookSlug = ebookSlug || '';
    value = value || 0;
    try {
      var contentName = ebookSlug || 'ebook-buutzke';
      if (typeof fbq === 'function') {
        fbq('track', 'Purchase', {
          content_name: contentName,
          content_type: 'product',
          value: value,
          currency: 'BRL',
        });
      }
      if (typeof ttq !== 'undefined') {
        ttq.track('CompletePayment', {
          content_name: contentName,
          value: value,
          currency: 'BRL',
        });
      }
      this.sendData('CONVERSAO', 'COMPRA CONFIRMADA', 'Ebook: ' + contentName + ' | Valor: R$ ' + value);
      console.log('[Pixel] Purchase:', contentName, 'R$', value);
    } catch (e) {}
  }
}
