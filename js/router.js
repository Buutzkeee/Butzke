import { Analytics } from './analytics.js';

/* =====================================
   Router — History API SPA routing
   ===================================== */
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.app = document.getElementById('app');
    this.appendUTMs();
    this._interceptLinks();
    
    // Iniciar rastreamento de cliques globais
    Analytics.initClickTracker();
    
    window.addEventListener('popstate', () => this._navigate());
  }

  start() {
    this._navigate();
  }

  _interceptLinks() {
    document.body.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('/')) {
        e.preventDefault();
        const path = link.getAttribute('href');
        window.history.pushState(null, '', path);
        this._navigate();
      }
    });
  }

  appendUTMs() {
    try {
      const params = new URLSearchParams(window.location.search);
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      
      utmKeys.forEach(key => {
        if (params.has(key)) {
          try { sessionStorage.setItem(key, params.get(key)); } catch (e) {}
        }
      });

      const appendToLinks = () => {
        document.querySelectorAll('a[href^="https://pay.kirvano.com"]').forEach(link => {
          try {
            const url = new URL(link.href);
            utmKeys.forEach(key => {
              let val = null;
              try { val = sessionStorage.getItem(key); } catch (e) {}
              if (val && !url.searchParams.has(key)) {
                url.searchParams.append(key, val);
              }
            });
            link.href = url.toString();
          } catch (e) {
            // ignore invalid URLs
          }
        });
      };

      appendToLinks();
    } catch (e) {
      console.warn('UTM error:', e);
    }
  }

  _navigate() {
    try {
      let path = window.location.pathname;
      
      if (window.location.hostname.includes('.github.io') && path.startsWith('/Butzke')) {
        path = path.replace('/Butzke', '') || '/';
      }

      let PageClass = null;
      let params = {};

      for (const [pattern, cls] of Object.entries(this.routes)) {
        const result = this._match(pattern, path);
        if (result !== null) {
          PageClass = cls;
          params = result;
          break;
        }
      }

      if (!PageClass) PageClass = this.routes['/'];

      window.scrollTo({ top: 0, behavior: 'instant' });
      this.app.innerHTML = '';

      if (PageClass) {
        try {
          new PageClass(this.app, params);
        } catch (pageErr) {
          console.error('Error rendering page:', pageErr);
        }
      }
      
      setTimeout(() => this.appendUTMs(), 100);

      try {
        Analytics.trackPageview();
      } catch (analyticsErr) {
        console.warn('Analytics pageview error:', analyticsErr);
      }
    } catch (err) {
      console.error('Navigation error:', err);
    }
  }

  _match(pattern, path) {
    const names = [];
    const rx = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
                      .replace(/:([^/]+)/g, (_, n) => { names.push(n); return '([^/]+)'; });
    const m = path.match(new RegExp(`^${rx}$`));
    if (!m) return null;
    const p = {};
    names.forEach((n, i) => p[n] = decodeURIComponent(m[i + 1]));
    return p;
  }

  /* ---- Static helpers ---- */
  static loadCSS(href) {
    document.querySelectorAll('link[data-page-css]').forEach(el => el.remove());
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.setAttribute('data-page-css', 'true');
    document.head.appendChild(l);
  }

  static go(path) {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new Event('popstate'));
  }

  static initReveal() {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }
}

window.Router = Router; // expose globally for inline onclick
