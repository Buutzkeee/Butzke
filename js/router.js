/* =====================================
   Router — Hash-based SPA routing
   ===================================== */
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.app = document.getElementById('app');
    this.appendUTMs();
    window.addEventListener('hashchange', () => this._navigate());
  }

  start() {
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#/';
    }
    this._navigate();
  }

  appendUTMs() {
    // 1. Save UTMs from the current URL to session storage
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    utmKeys.forEach(key => {
      if (params.has(key)) {
        sessionStorage.setItem(key, params.get(key));
      }
    });

    // 2. Append stored UTMs to all kirvano checkout links
    const appendToLinks = () => {
      document.querySelectorAll('a[href^="https://pay.kirvano.com"]').forEach(link => {
        try {
          const url = new URL(link.href);
          utmKeys.forEach(key => {
            const val = sessionStorage.getItem(key);
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

    // Run it now and also after every route change
    appendToLinks();
    window.addEventListener('hashchange', () => {
      setTimeout(appendToLinks, 300);
    });
  }

  _navigate() {
    const hash = window.location.hash || '#/';
    if (!hash.startsWith('#/')) return; // ignore section anchors

    const path = hash.slice(1) || '/';
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

    if (PageClass) new PageClass(this.app, params);
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
    window.location.hash = '#' + path;
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
