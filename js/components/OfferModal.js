/* ============================================================
   OfferModal — Modal de captura e desconto especial
   ============================================================ */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwel_Dz9nO2VHuRpG-vuqimhHa8WhM5UXmgeVpQGbOBleIKytzA0DofNKUjbvWokh5mxw/exec';

export class OfferModal {
  /**
   * @param {object} options
   * @param {string} options.ebookName — nome do ebook
   */
  constructor(options = {}) {
    this.ebookName  = options.ebookName || 'Desconhecido';
    this._shown     = false;
    this._triggered = false;

    let alreadyShown = false;
    try {
      const storageKey = `offer_modal_shown_${this.ebookName.replace(/\s+/g, '_')}`;
      this._storageKey = storageKey;
      if (localStorage.getItem(storageKey)) alreadyShown = true;
    } catch (e) {
      this._storageKey = null;
    }
    if (alreadyShown) return;

    this._injectStyles();
    this._buildModal();
    this._initTriggers();
  }

  _initTriggers() {
    this._onMouseLeave = (e) => {
      if (e.clientY <= 10 && !this._triggered) {
        this._trigger();
      }
    };
    document.addEventListener('mouseleave', this._onMouseLeave);

    this._onVisibility = () => {
      if (document.visibilityState === 'hidden' && !this._triggered) {
        this._trigger();
      }
    };
    document.addEventListener('visibilitychange', this._onVisibility);
  }

  _trigger() {
    if (this._triggered) return;
    this._triggered = true;
    setTimeout(() => this._show(), 300);
  }

  _buildModal() {
    const overlay = document.createElement('div');
    overlay.id = 'offer-modal-overlay';
    overlay.innerHTML = `
      <div class="om-modal" id="om-modal" role="dialog" aria-modal="true" aria-label="Oferta especial antes de ir embora">
        <div class="om-sparks">
          <span class="om-spark"></span><span class="om-spark"></span>
          <span class="om-spark"></span><span class="om-spark"></span>
        </div>

        <button class="om-close" id="om-close" aria-label="Fechar">✕</button>

        <div class="om-icon">🔱</div>

        <div class="om-badge">⚡ ESPERA — UMA PALAVRA ANTES DE IR ⚡</div>
        <h2 class="om-title">Não feche sem pegar<br><span class="om-gold">seu desconto secreto</span></h2>
        <p class="om-sub">Deixa seu WhatsApp que eu te mando uma condição especial <strong>só pra você</strong> — direto no seu celular.</p>

        <form class="om-form" id="om-form" novalidate>
          <div class="om-field">
            <label for="om-nome" class="om-label">Seu nome</label>
            <input
              type="text"
              id="om-nome"
              name="nome"
              class="om-input"
              placeholder="Como posso te chamar?"
              autocomplete="given-name"
              required
            />
          </div>
          <div class="om-field">
            <label for="om-whatsapp" class="om-label">Seu WhatsApp</label>
            <input
              type="tel"
              id="om-whatsapp"
              name="whatsapp"
              class="om-input"
              placeholder="(11) 99999-9999"
              autocomplete="tel"
              required
            />
          </div>
          <button type="submit" class="om-btn" id="om-submit">
            <span class="om-btn-icon">📲</span>
            <span class="om-btn-text">Quero Meu Desconto Secreto</span>
          </button>
        </form>

        <div class="om-success" id="om-success" style="display:none;">
          <div class="om-success-icon">✅</div>
          <h3 class="om-success-title">Recebido com axé! 🔱</h3>
          <p class="om-success-msg">Te envio a oferta especial no WhatsApp em instantes. Fique de olho!</p>
        </div>

        <button class="om-skip" id="om-skip">Não quero desconto, vou sair assim mesmo</button>
        <p class="om-privacy">🔒 Seus dados são 100% seguros. Zero spam.</p>
      </div>
    `;

    document.body.appendChild(overlay);
    this._overlay = overlay;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this._hide();
    });
    document.getElementById('om-close').addEventListener('click', () => this._hide());
    document.getElementById('om-skip').addEventListener('click',  () => this._hide());
    document.getElementById('om-form').addEventListener('submit', (e) => this._handleSubmit(e));

    const phoneInput = document.getElementById('om-whatsapp');
    phoneInput.addEventListener('input', () => {
      let v = phoneInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        v = `(${v}`;
      }
      phoneInput.value = v;
    });
  }

  _show() {
    if (this._shown) return;
    this._shown = true;
    this._overlay.classList.add('om-visible');
    document.body.style.overflow = 'hidden';
  }

  _hide() {
    this._overlay.classList.remove('om-visible');
    document.body.style.overflow = '';
    if (this._storageKey) {
      try { localStorage.setItem(this._storageKey, '1'); } catch (e) {}
    }
    document.removeEventListener('mouseleave', this._onMouseLeave);
    document.removeEventListener('visibilitychange', this._onVisibility);
  }

  _handleSubmit(e) {
    e.preventDefault();
    const nome     = document.getElementById('om-nome').value.trim();
    const whatsapp = document.getElementById('om-whatsapp').value.trim();

    if (!nome || whatsapp.replace(/\D/g,'').length < 10) {
      this._shake();
      return;
    }

    const btn = document.getElementById('om-submit');
    btn.disabled = true;
    btn.querySelector('.om-btn-text').textContent = 'Enviando...';

    const payload = {
      nome,
      whatsapp,
      ebook:  this.ebookName,
      pagina: window.location.pathname,
    };

    try {
      const leads = JSON.parse(localStorage.getItem('btz_leads') || '[]');
      leads.push({ ...payload, timestamp: new Date().toISOString() });
      localStorage.setItem('btz_leads', JSON.stringify(leads));
    } catch (err) {}

    if (APPS_SCRIPT_URL && APPS_SCRIPT_URL !== 'COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT') {
      try {
        const queryParams = new URLSearchParams(payload).toString();
        const imgPing = new Image();
        imgPing.src = `${APPS_SCRIPT_URL}?${queryParams}`;
      } catch (err) {}
    }

    document.getElementById('om-form').style.display = 'none';
    document.getElementById('om-success').style.display = 'block';

    if (this._storageKey) {
      try { localStorage.setItem(this._storageKey, '1'); } catch (err) {}
    }

    setTimeout(() => this._hide(), 4000);
  }

  _shake() {
    const modal = document.getElementById('om-modal');
    modal.classList.remove('om-shake');
    void modal.offsetWidth;
    modal.classList.add('om-shake');
    modal.addEventListener('animationend', () => modal.classList.remove('om-shake'), { once: true });
  }

  _injectStyles() {
    if (document.getElementById('offer-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'offer-modal-styles';
    style.textContent = `
      #offer-modal-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
        opacity: 0; pointer-events: none;
        transition: opacity 0.4s ease;
      }
      #offer-modal-overlay.om-visible {
        opacity: 1; pointer-events: all;
      }

      .om-modal {
        position: relative;
        background: linear-gradient(160deg, #161616 0%, #0e0e0e 100%);
        border: 1px solid rgba(255,51,0,0.35);
        border-radius: 20px;
        padding: 48px 40px 36px;
        max-width: 500px; width: 100%;
        text-align: center;
        box-shadow:
          0 0 60px rgba(255,51,0,0.12),
          0 30px 80px rgba(0,0,0,0.8),
          inset 0 1px 0 rgba(255,255,255,0.04);
        transform: translateY(30px) scale(0.96);
        transition: transform 0.45s cubic-bezier(0.175,0.885,0.32,1.275);
        overflow: hidden;
      }
      #offer-modal-overlay.om-visible .om-modal {
        transform: translateY(0) scale(1);
      }

      .om-sparks {
        position: absolute; inset: 0; pointer-events: none; overflow: hidden;
      }
      .om-spark {
        position: absolute;
        width: 3px; height: 3px; border-radius: 50%;
        background: #ff3300;
        animation: omSparkFloat 6s ease-in-out infinite;
        opacity: 0.5;
      }
      .om-spark:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s;   background: #ff3300; }
      .om-spark:nth-child(2) { top: 70%; left: 85%; animation-delay: 1.5s; background: #ffd700; }
      .om-spark:nth-child(3) { top: 30%; left: 90%; animation-delay: 3s;   background: #ff3300; }
      .om-spark:nth-child(4) { top: 80%; left: 15%; animation-delay: 4.5s; background: #ffd700; }
      @keyframes omSparkFloat {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
        50%       { transform: translateY(-12px) scale(1.4); opacity: 1; }
      }

      .om-close {
        position: absolute; top: 14px; right: 16px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.08);
        color: #888; font-size: 0.8rem;
        width: 28px; height: 28px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.2s;
      }
      .om-close:hover { background: rgba(255,51,0,0.2); color: #ff3300; }

      .om-icon {
        font-size: 2.2rem; margin-bottom: 12px;
        filter: drop-shadow(0 0 12px rgba(255,51,0,0.5));
        animation: omPulse 2.5s ease-in-out infinite;
      }
      @keyframes omPulse {
        0%, 100% { transform: scale(1); }
        50%       { transform: scale(1.12); }
      }

      .om-badge {
        display: inline-block;
        background: rgba(255,51,0,0.12);
        border: 1px solid rgba(255,51,0,0.3);
        color: #ff5500; font-size: 0.65rem;
        letter-spacing: 2px; font-weight: 700;
        padding: 5px 14px; border-radius: 50px;
        margin-bottom: 16px;
        font-family: 'Inter', sans-serif;
      }

      .om-title {
        font-family: 'Cinzel', serif;
        font-size: clamp(1.4rem, 4vw, 1.9rem);
        font-weight: 700; color: #f0ece0;
        margin-bottom: 14px; line-height: 1.25;
      }
      .om-gold { color: #ff3300; }

      .om-sub {
        color: #999; font-size: 0.95rem;
        line-height: 1.6; margin-bottom: 28px;
      }
      .om-sub strong { color: #f0ece0; }

      .om-form { display: flex; flex-direction: column; gap: 14px; }
      .om-field { text-align: left; }
      .om-label {
        display: block; font-size: 0.78rem; font-weight: 600;
        color: #999; letter-spacing: 0.5px; margin-bottom: 6px;
        text-transform: uppercase;
      }
      .om-input {
        width: 100%; padding: 13px 16px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,51,0,0.2);
        border-radius: 10px;
        color: #f0ece0; font-size: 1rem;
        font-family: 'Inter', sans-serif;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
      }
      .om-input::placeholder { color: #555; }
      .om-input:focus {
        border-color: rgba(255,51,0,0.6);
        box-shadow: 0 0 0 3px rgba(255,51,0,0.08);
      }

      .om-btn {
        margin-top: 6px;
        display: flex; align-items: center; justify-content: center; gap: 10px;
        width: 100%; padding: 16px 24px;
        background: linear-gradient(135deg, #ff1a1a 0%, #cc0000 100%);
        color: #fff; font-size: 1rem; font-weight: 700;
        font-family: 'Cinzel', serif; letter-spacing: 0.5px;
        border: none; border-radius: 12px; cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 20px rgba(255,26,26,0.4);
        position: relative; overflow: hidden;
      }
      .om-btn::after {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
        pointer-events: none;
      }
      .om-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 28px rgba(255,26,26,0.55);
      }
      .om-btn:active:not(:disabled) { transform: translateY(0); }
      .om-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .om-btn-icon { font-size: 1.2rem; }

      .om-success { padding: 20px 0 10px; }
      .om-success-icon { font-size: 3rem; margin-bottom: 12px; }
      .om-success-title {
        font-family: 'Cinzel', serif;
        font-size: 1.4rem; color: #f0ece0; margin-bottom: 10px;
      }
      .om-success-msg { color: #999; font-size: 0.95rem; }

      .om-skip {
        display: block; width: 100%;
        margin-top: 18px;
        color: #555; font-size: 0.78rem;
        background: none; border: none; cursor: pointer;
        transition: color 0.2s; text-decoration: underline;
        font-family: 'Inter', sans-serif;
      }
      .om-skip:hover { color: #888; }
      .om-privacy {
        margin-top: 10px;
        color: #444; font-size: 0.72rem;
      }

      @keyframes omShake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-8px); }
        40%       { transform: translateX(8px); }
        60%       { transform: translateX(-5px); }
        80%       { transform: translateX(5px); }
      }
      .om-shake { animation: omShake 0.4s ease; }

      @media (max-width: 540px) {
        .om-modal { padding: 36px 24px 28px; }
        .om-title { font-size: 1.35rem; }
      }
    `;
    document.head.appendChild(style);
  }
}
