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

    // Enfileira as requisições com 400ms de intervalo para evitar que o Google Sheets engula dados 
    // por tentar salvar 3 linhas no exato mesmo milissegundo (Race Condition do Apps Script).
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
    if (path.includes('/ebooks')) return 'Página Geral de eBooks';
    if (path.includes('/ebook/')) {
      const name = path.split('/').pop().replace(/-/g, ' ');
      return 'Vendas: ' + name.charAt(0).toUpperCase() + name.slice(1);
    }
    if (path.includes('/atendimentos')) return 'Atendimentos Espirituais';
    if (path.includes('/sobre')) return 'Sobre o Criador';
    if (path.includes('/linkbio')) return 'Árvore de Links (Bio)';
    return path;
  }

  static trackTimeOnPreviousPage() {
    if (!this.currentPagePath) return;
    
    const timeSpentSeconds = Math.round((Date.now() - this.pageEntryTime) / 1000);
    
    // Só envia se ficou mais de 3 segundos
    if (timeSpentSeconds > 3) {
      const pageName = this.getPageName(this.currentPagePath);
      
      this.sendData(
        'TEMPO DE TELA', 
        'Saiu da Página', 
        `Ficou ${timeSpentSeconds} segundos na página: ${pageName}`,
        this.currentPagePath // Força a URL do evento a ser da página anterior
      );
    }
  }

  static trackPageview() {
    // 1. Registra o tempo que a pessoa passou na página ANTERIOR
    if (this.currentPagePath && this.currentPagePath !== window.location.pathname) {
      this.trackTimeOnPreviousPage();
    }

    // 2. Avisa que entrou na NOVA página
    const pageName = this.getPageName(window.location.pathname);
    this.sendData('VISITA', 'Acessou a Página', pageName);

    // 3. Reseta o relógio para a NOVA página
    this.currentPagePath = window.location.pathname;
    this.pageEntryTime = Date.now();
    
    // 4. Inicia o rastreador de fechamento de aba (só 1 vez)
    if (!this.timeTrackerInitialized) {
      window.addEventListener('beforeunload', () => this.trackTimeOnPreviousPage());
      this.timeTrackerInitialized = true;
    }
  }

  static initClickTracker() {
    // Intercepta todos os cliques do site globalmente
    document.body.addEventListener('click', (e) => {
      // Procura se o clique foi em um botão (btn) ou um link (a)
      const target = e.target.closest('a, button, .btn');
      if (!target) return;

      let label = target.textContent.trim().substring(0, 50);
      if (!label) label = 'Ícone ou Imagem';
      const destination = target.href || '';

      // Trata especialmente cliques na página de LinkBio
      if (window.location.pathname === '/linkbio') {
        this.sendData('CLIQUE_LINKBIO', 'Acessou Link da Bio', `Botão: "${label.replace(/\s+/g, ' ')}" -> ${destination}`);
        return;
      }

      // Classifica o tipo de clique para ficar bonito na planilha
      if (destination.includes('kirvano.com')) {
        this.sendData('CONVERSÃO', 'Foi para o Checkout (Kirvano)', `Botão: "${label.replace(/\s+/g, ' ')}"`);
      } else if (destination.includes('wa.me')) {
        this.sendData('CONVERSÃO', 'Chamou no WhatsApp', `Botão: "${label.replace(/\s+/g, ' ')}"`);
      } else if (destination.includes('instagram.com')) {
        this.sendData('CLIQUE', 'Saiu para o Instagram', `Botão: "${label.replace(/\s+/g, ' ')}"`);
      } else if (destination.startsWith('http') && !destination.includes(window.location.host)) {
        this.sendData('CLIQUE', 'Saiu para Link Externo', `Botão: "${label.replace(/\s+/g, ' ')}" -> ${destination}`);
      } else {
        this.sendData('NAVEGAÇÃO', 'Navegou no Site', `Clicou em: "${label.replace(/\s+/g, ' ')}"`);
      }
    });
  }
}
