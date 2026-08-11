/* ============================================================
   ExitPopup — Captura lead ao sair das páginas de venda
   Envia para Google Sheets via Apps Script Web App
   ============================================================ */

// ⚠️  SUBSTITUA pela URL do seu Apps Script Web App após publicar
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcDPpFjiTjLOUZ5EWfATCnn9Hpeq0vCgvZaAU9Cr87K1X9OZYgNhlsbYoUnjzZBX04GQ/exec';

export class ExitPopup {
  /**
   * @param {object} options
   * @param {string} options.ebookName  — nome do ebook (para registrar na planilha)
   */
  constructor(options = {}) {
    this.ebookName  = options.ebookName || 'Desconhecido';
    this._shown     = false;
    this._triggered = false;

    // Não exibe duas vezes para o mesmo visitante
    const storageKey = `exit_popup_shown_${this.ebookName.replace(/\s+/g, '_')}`;
    if (localStorage.getItem(storageKey)) return;
    this._storageKey = storageKey;

    this._injectStyles();
    this._buildPopup();
    this._initTriggers();
  }

  /* ---------- Triggers ---------- */
  _initTriggers() {
    // Desktop: mouse sai pelo topo da janela
    this._onMouseLeave = (e) => {
      if (e.clientY <= 10 && !this._triggered) {
        this._trigger();
      }
    };
    document.addEventListener('mouseleave', this._onMouseLeave);

    // Mobile: detectar visibilidade (minimizar / trocar aba)
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
    // Pequeno delay para parecer mais natural
    setTimeout(() => this._show(), 300);
  }

  /* ---------- Render ---------- */
  _buildPopup() {
    const overlay = document.createElement('div');
    overlay.id = 'exit-popup-overlay';
    overlay.innerHTML = `
      <div class="ep-modal" id="ep-modal" role="dialog" aria-modal="true" aria-label="Oferta especial antes de ir embora">
        <!-- Partículas decorativas -->
        <div class="ep-sparks">
          <span class="ep-spark"></span><span class="ep-spark"></span>
          <span class="ep-spark"></span><span class="ep-spark"></span>
        </div>

        <!-- Botão fechar -->
        <button class="ep-close" id="ep-close" aria-label="Fechar">✕</button>

        <!-- Ícone místico -->
        <div class="ep-icon">🔱</div>

        <!-- Headline -->
        <div class="ep-badge">⚡ ESPERA — UMA PALAVRA ANTES DE IR ⚡</div>
        <h2 class="ep-title">Não feche sem pegar<br><span class="ep-gold">seu desconto secreto</span></h2>
        <p class="ep-sub">Deixa seu WhatsApp que eu te mando uma condição especial <strong>só pra você</strong> — direto no seu celular.</p>

        <!-- Formulário -->
        <form class="ep-form" id="ep-form" novalidate>
          <div class="ep-field">
            <label for="ep-nome" class="ep-label">Seu nome</label>
            <input
              type="text"
              id="ep-nome"
              name="nome"
              class="ep-input"
              placeholder="Como posso te chamar?"
              autocomplete="given-name"
              required
            />
          </div>
          <div class="ep-field">
            <label for="ep-whatsapp" class="ep-label">Seu WhatsApp</label>
            <input
              type="tel"
              id="ep-whatsapp"
              name="whatsapp"
              class="ep-input"
              placeholder="(11) 99999-9999"
              autocomplete="tel"
              required
            />
          </div>
          <button type="submit" class="ep-btn" id="ep-submit">
            <span class="ep-btn-icon">📲</span>
            <span class="ep-btn-text">Quero Meu Desconto Secreto</span>
          </button>
        </form>

        <!-- Mensagem de sucesso (oculta) -->
        <div class="ep-success" id="ep-success" style="display:none;">
          <div class="ep-success-icon">✅</div>
          <h3 class="ep-success-title">Recebido com axé! 🔱</h3>
          <p class="ep-success-msg">Te envio a oferta especial no WhatsApp em instantes. Fique de olho!</p>
        </div>

        <!-- Rodapé / link de saída -->
        <button class="ep-skip" id="ep-skip">Não quero desconto, vou sair assim mesmo</button>

        <p class="ep-privacy">🔒 Seus dados são 100% seguros. Zero spam.</p>
      </div>
    `;

    document.body.appendChild(overlay);
    this._overlay = overlay;

    // Eventos
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this._hide();
    });
    document.getElementById('ep-close').addEventListener('click', () => this._hide());
    document.getElementById('ep-skip').addEventListener('click',  () => this._hide());
    document.getElementById('ep-form').addEventListener('submit', (e) => this._handleSubmit(e));

    // Máscara de telefone
    const phoneInput = document.getElementById('ep-whatsapp');
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

  /* ---------- Show / Hide ---------- */
  _show() {
    if (this._shown) return;
    this._shown = true;
    this._overlay.classList.add('ep-visible');
    document.body.style.overflow = 'hidden';
  }

  _hide() {
    this._overlay.classList.remove('ep-visible');
    document.body.style.overflow = '';
    // Marca como visto para não mostrar novamente
    if (this._storageKey) {
      localStorage.setItem(this._storageKey, '1');
    }
    // Remove listeners
    document.removeEventListener('mouseleave', this._onMouseLeave);
    document.removeEventListener('visibilitychange', this._onVisibility);
  }

  /* ---------- Submit ---------- */
  async _handleSubmit(e) {
    e.preventDefault();
    const nome     = document.getElementById('ep-nome').value.trim();
    const whatsapp = document.getElementById('ep-whatsapp').value.trim();

    if (!nome || whatsapp.replace(/\D/g,'').length < 10) {
      this._shake();
      return;
    }

    const btn = document.getElementById('ep-submit');
    btn.disabled = true;
    btn.querySelector('.ep-btn-text').textContent = 'Enviando...';

    const payload = {
      nome,
      whatsapp,
      ebook:  this.ebookName,
      pagina: window.location.pathname,
    };

    try {
      if (APPS_SCRIPT_URL && APPS_SCRIPT_URL !== 'COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT') {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode:   'no-cors',
          // text/plain é o único Content-Type permitido com no-cors
          // O Apps Script ainda recebe o JSON via e.postData.contents
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        });
      } else {
        // Modo desenvolvimento: só loga no console
        console.log('📋 Lead capturado (Apps Script não configurado):', payload);
      }
    } catch (err) {
      console.warn('Erro ao enviar lead:', err);
    }

    // Salva também no localStorage como backup local
    const leads = JSON.parse(localStorage.getItem('btz_leads') || '[]');
    leads.push({ ...payload, timestamp: new Date().toISOString() });
    localStorage.setItem('btz_leads', JSON.stringify(leads));

    // Mostra sucesso
    document.getElementById('ep-form').style.display = 'none';
    document.getElementById('ep-success').style.display = 'block';

    if (this._storageKey) {
      localStorage.setItem(this._storageKey, '1');
    }

    // Fecha automaticamente após 4 segundos
    setTimeout(() => this._hide(), 4000);
  }

  _shake() {
    const modal = document.getElementById('ep-modal');
    modal.classList.remove('ep-shake');
    void modal.offsetWidth;
    modal.classList.add('ep-shake');
    modal.addEventListener('animationend', () => modal.classList.remove('ep-shake'), { once: true });
  }

  /* ---------- Estilos ---------- */
  _injectStyles() {
    if (document.getElementById('exit-popup-styles')) return;
    const style = document.createElement('style');
    style.id = 'exit-popup-styles';
    style.textContent = `
      /* ── Overlay ── */
      #exit-popup-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
        opacity: 0; pointer-events: none;
        transition: opacity 0.4s ease;
      }
      #exit-popup-overlay.ep-visible {
        opacity: 1; pointer-events: all;
      }

      /* ── Modal ── */
      .ep-modal {
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
      #exit-popup-overlay.ep-visible .ep-modal {
        transform: translateY(0) scale(1);
      }

      /* ── Partículas ── */
      .ep-sparks {
        position: absolute; inset: 0; pointer-events: none; overflow: hidden;
      }
      .ep-spark {
        position: absolute;
        width: 3px; height: 3px; border-radius: 50%;
        background: #ff3300;
        animation: epSparkFloat 6s ease-in-out infinite;
        opacity: 0.5;
      }
      .ep-spark:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s;   background: #ff3300; }
      .ep-spark:nth-child(2) { top: 70%; left: 85%; animation-delay: 1.5s; background: #ffd700; }
      .ep-spark:nth-child(3) { top: 30%; left: 90%; animation-delay: 3s;   background: #ff3300; }
      .ep-spark:nth-child(4) { top: 80%; left: 15%; animation-delay: 4.5s; background: #ffd700; }
      @keyframes epSparkFloat {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
        50%       { transform: translateY(-12px) scale(1.4); opacity: 1; }
      }

      /* ── Botão fechar ── */
      .ep-close {
        position: absolute; top: 14px; right: 16px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.08);
        color: #888; font-size: 0.8rem;
        width: 28px; height: 28px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.2s;
      }
      .ep-close:hover { background: rgba(255,51,0,0.2); color: #ff3300; }

      /* ── Ícone ── */
      .ep-icon {
        font-size: 2.2rem; margin-bottom: 12px;
        filter: drop-shadow(0 0 12px rgba(255,51,0,0.5));
        animation: epPulse 2.5s ease-in-out infinite;
      }
      @keyframes epPulse {
        0%, 100% { transform: scale(1); }
        50%       { transform: scale(1.12); }
      }

      /* ── Badge ── */
      .ep-badge {
        display: inline-block;
        background: rgba(255,51,0,0.12);
        border: 1px solid rgba(255,51,0,0.3);
        color: #ff5500; font-size: 0.65rem;
        letter-spacing: 2px; font-weight: 700;
        padding: 5px 14px; border-radius: 50px;
        margin-bottom: 16px;
        font-family: 'Inter', sans-serif;
      }

      /* ── Título ── */
      .ep-title {
        font-family: 'Cinzel', serif;
        font-size: clamp(1.4rem, 4vw, 1.9rem);
        font-weight: 700; color: #f0ece0;
        margin-bottom: 14px; line-height: 1.25;
      }
      .ep-gold { color: #ff3300; }

      /* ── Subtítulo ── */
      .ep-sub {
        color: #999; font-size: 0.95rem;
        line-height: 1.6; margin-bottom: 28px;
      }
      .ep-sub strong { color: #f0ece0; }

      /* ── Formulário ── */
      .ep-form { display: flex; flex-direction: column; gap: 14px; }
      .ep-field { text-align: left; }
      .ep-label {
        display: block; font-size: 0.78rem; font-weight: 600;
        color: #999; letter-spacing: 0.5px; margin-bottom: 6px;
        text-transform: uppercase;
      }
      .ep-input {
        width: 100%; padding: 13px 16px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,51,0,0.2);
        border-radius: 10px;
        color: #f0ece0; font-size: 1rem;
        font-family: 'Inter', sans-serif;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
      }
      .ep-input::placeholder { color: #555; }
      .ep-input:focus {
        border-color: rgba(255,51,0,0.6);
        box-shadow: 0 0 0 3px rgba(255,51,0,0.08);
      }

      /* ── Botão principal ── */
      .ep-btn {
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
      .ep-btn::after {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
        pointer-events: none;
      }
      .ep-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 28px rgba(255,26,26,0.55);
      }
      .ep-btn:active:not(:disabled) { transform: translateY(0); }
      .ep-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .ep-btn-icon { font-size: 1.2rem; }

      /* ── Sucesso ── */
      .ep-success { padding: 20px 0 10px; }
      .ep-success-icon { font-size: 3rem; margin-bottom: 12px; }
      .ep-success-title {
        font-family: 'Cinzel', serif;
        font-size: 1.4rem; color: #f0ece0; margin-bottom: 10px;
      }
      .ep-success-msg { color: #999; font-size: 0.95rem; }

      /* ── Rodapé ── */
      .ep-skip {
        display: block; width: 100%;
        margin-top: 18px;
        color: #555; font-size: 0.78rem;
        background: none; border: none; cursor: pointer;
        transition: color 0.2s; text-decoration: underline;
        font-family: 'Inter', sans-serif;
      }
      .ep-skip:hover { color: #888; }
      .ep-privacy {
        margin-top: 10px;
        color: #444; font-size: 0.72rem;
      }

      /* ── Shake ── */
      @keyframes epShake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-8px); }
        40%       { transform: translateX(8px); }
        60%       { transform: translateX(-5px); }
        80%       { transform: translateX(5px); }
      }
      .ep-shake { animation: epShake 0.4s ease; }

      /* ── Mobile ── */
      @media (max-width: 540px) {
        .ep-modal { padding: 36px 24px 28px; }
        .ep-title { font-size: 1.35rem; }
      }
    `;
    document.head.appendChild(style);
  }
}
