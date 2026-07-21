/* =====================================================
   BUUTZKE — Custom Analytics Tracker (Google Sheets)
   ===================================================== */

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwcP0BOGEr4BP07e6MEvUObrklvIc-65lxNsceO3pupTpVwCz-mKhZGnf-uvXRSLNKC0Q/exec';

export class Analytics {
  static getUTMs() {
    return {
      utm_source: sessionStorage.getItem('utm_source') || '',
      utm_medium: sessionStorage.getItem('utm_medium') || '',
      utm_campaign: sessionStorage.getItem('utm_campaign') || '',
      utm_term: sessionStorage.getItem('utm_term') || '',
      utm_content: sessionStorage.getItem('utm_content') || ''
    };
  }

  /**
   * Envia dados para o Google Sheets
   * @param {string} eventType 'PAGEVIEW' ou 'CLICK'
   * @param {string} eventName Nome da ação (ex: 'Acessou Home', 'Clicou Agendar')
   * @param {string} eventDetail Informação extra (ex: 'URL de Destino')
   */
  static async sendData(eventType, eventName, eventDetail = '') {
    if (WEBHOOK_URL === 'COLE_AQUI_A_URL_DO_GOOGLE_APPS_SCRIPT') {
      console.warn('Analytics: Webhook do Google Sheets não configurado.');
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      eventType,
      eventName,
      eventDetail,
      pagePath: window.location.pathname,
      ...this.getUTMs()
    };

    try {
      fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Fundamental para não dar erro de CORS no Sheets
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      console.log(`[Analytics] ${eventType}: ${eventName}`);
    } catch (error) {
      console.error('Erro ao enviar analytics:', error);
    }
  }

  static trackPageview() {
    this.sendData('PAGEVIEW', 'Page Loaded', window.location.pathname);
  }

  static initClickTracker() {
    // Intercepta todos os cliques do site globalmente
    document.body.addEventListener('click', (e) => {
      // Procura se o clique foi em um botão (btn) ou um link (a)
      const target = e.target.closest('a, button, .btn');
      if (!target) return;

      const label = target.textContent.trim().substring(0, 50) || target.id || 'Botão sem nome';
      const destination = target.href || target.getAttribute('id') || '';

      // Verifica se é uma conversão (Kirvano ou WhatsApp)
      if (destination.includes('kirvano.com')) {
        this.sendData('CLICK', 'Checkout (Kirvano)', label + ' -> ' + destination);
      } else if (destination.includes('wa.me')) {
        this.sendData('CLICK', 'Contato WhatsApp', label);
      } else {
        // Cliques gerais (navegação)
        this.sendData('CLICK', 'Interação Geral', label + ' -> ' + destination);
      }
    });
  }
}
