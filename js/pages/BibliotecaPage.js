import { Router }          from '../router.js';
import { Navbar }          from '../components/Navbar.js';
import { Footer }          from '../components/Footer.js';
import { SupabaseService } from '../services/supabase.js';
import { Analytics }       from '../analytics.js';

export class BibliotecaPage {
  constructor(container) {
    this.container = container;
    this.user = SupabaseService.getCurrentUser();
    this.adminSubTab = 'usuarios'; // 'usuarios' | 'acervo' | 'supabase'
    this.currentTab = 'acervo'; // 'acervo' | 'chat' | 'oraculo' | 'conta'
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.books = [];
    this.members = [];
    this.memberFilter = 'todos'; // 'todos' | 'ativo' | 'expirando' | 'expirado' | 'bloqueado'
    this.memberSearchQuery = '';
    this.chatMessages = [];
    this.activeReaderBook = null;
    this.activeReaderChapter = 0;
    this.readerFontSize = 18;
    this.authModalMode = null; // 'login' | 'admin' | null
    this.showNewMemberModal = false;
    this.showNewBookModal = false;
    this.lastCreatedAccess = null; // para exibir WhatsApp copy box

    // Estado do Leitor de PDF Avançado (com virada e rotação de páginas)
    this.pdfDoc = null;
    this.pdfPageNum = 1;
    this.pdfTotalPages = 1;
    this.pdfRotation = 0; // 0, 90, 180, 270 graus
    this.pdfScale = 1.25;
    this.pdfMobileZoom = 1.0; // Zoom proporcional para celular
    this.showReaderSidebar = false; // Sidebar colapsável (não obstrui leitura)
    this.showReaderChat = false; // Chat de membros dentro do leitor
    this.pdfRendering = false;
    this.pdfPagePending = null;
    this.pdfRenderTask = null;
    this.pdfKeyHandler = null;

    Router.loadCSS('/css/area-membros.css?v=' + Date.now());
    document.title = 'Área de Membros & Acervo — BUUTZKE';

    this._init();
  }

  async _init() {
    // Limpa automaticamente qualquer resíduo de URL S3/Storage do navegador
    const savedUrl = localStorage.getItem('buutzke_supabase_url');
    if (savedUrl && (savedUrl.includes('storage.supabase.co') || savedUrl.includes('/s3'))) {
      localStorage.removeItem('buutzke_supabase_url');
      SupabaseService.initClient();
    }

    this.books = await SupabaseService.getRepositoryBooks();
    this.members = await SupabaseService.getCreatedMembersList();
    this.chatMessages = await SupabaseService.getChatMessages();
    this._render();
    Navbar.init();
    Router.initReveal();
    Analytics.trackViewContent({
      content_name: 'Área de Membros & Repositório',
      content_category: 'Assinatura',
      value: 29.90,
      currency: 'BRL'
    });
  }

  _render() {
    this.container.innerHTML =
      Navbar.render('biblioteca') +
      `<main class="membros-wrapper">
        <div class="membros-container">
          ${this._renderContent()}
        </div>
      </main>` +
      Footer.render() +
      this._renderAuthModal() +
      this._renderNewMemberModal() +
      this._renderNewBookModal() +
      this._renderReaderModal();

    this._bindEvents();
  }

  _renderContent() {
    if (!this.user) {
      return this._renderGuestArea();
    }
    if (this.user.role === 'admin') {
      return this._renderAdminArea();
    }
    return this._renderMemberArea();
  }

  /* =====================================================
     1. PAINEL DO ADMINISTRADOR (BUUTZKE)
     ===================================================== */
  _renderAdminArea() {
    const isConfigured = SupabaseService.isConfigured();
    const currentUrl = localStorage.getItem('buutzke_supabase_url') || '';

    return `
      <!-- BANNER DE ADMIN -->
      <div class="admin-badge-banner">
        <div>
          <h2 class="admin-badge-title">
            <span>🔱</span> PAINEL DE CONTROLE ADMINISTRATIVO — BUUTZKE
          </h2>
          <p style="font-size:0.85rem; color:#f0ece0; margin:4px 0 0 0;">
            Gerencie os usuários pagantes, crie acessos instantâneos e controle os manuscritos do Supabase.
          </p>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <button class="btn btn-outline btn-sm" id="btn-toggle-view-mode" style="border-color:#d4a017; color:#f5c842; font-size:0.8rem;">
            👁️ Ver como Membro Comum
          </button>
          <button class="btn btn-outline btn-sm" id="btn-admin-logout" style="border-color:rgba(255,51,0,0.4); color:#ff6666; font-size:0.8rem;">
            🚪 Sair do ADM
          </button>
        </div>
      </div>

      <!-- ALERTA DE CONFIGURAÇÃO DO SUPABASE (se faltar URL) -->
      ${!isConfigured ? `
        <div style="background:rgba(255,165,0,0.12); border:1px solid rgba(255,165,0,0.4); border-radius:12px; padding:16px 20px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.4rem;">⚠️</span>
            <div>
              <strong style="color:#f5c842; font-size:0.95rem;">Supabase aguardando URL do Projeto:</strong>
              <div style="font-size:0.82rem; color:#ccc;">Cole a URL do seu Supabase para ativar a validação direta de logins e sincronizar os ebooks.</div>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-quick-config-supabase" style="font-size:0.82rem;">
            ⚙️ Configurar URL Agora
          </button>
        </div>
      ` : ''}

      <!-- MENSAGEM WHATSAPP GERADA RECENTEMENTE -->
      ${this.lastCreatedAccess ? `
        <div style="background:rgba(37,211,102,0.12); border:1px solid #25d366; border-radius:12px; padding:18px 24px; margin-bottom:24px; animation:fadeIn 0.3s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <strong style="color:#25d366; font-size:0.95rem; display:flex; align-items:center; gap:8px;">
              <span>✓</span> Acesso Criado para: ${this.lastCreatedAccess.name} (${this.lastCreatedAccess.email})
            </strong>
            <button class="btn btn-sm btn-outline" id="btn-dismiss-whatsapp-box" style="font-size:0.75rem; border-color:rgba(255,255,255,0.2);">✕ Fechar</button>
          </div>
          <div style="font-size:0.85rem; color:#eee; background:rgba(0,0,0,0.4); padding:12px 16px; border-radius:8px; font-family:monospace; margin-bottom:12px;">
            🔱 Olá ${this.lastCreatedAccess.name}! Seu acesso ao Repositório BUUTZKE está liberado:<br>
            🔗 Link: ${window.location.origin}/biblioteca<br>
            📧 Login: ${this.lastCreatedAccess.email}<br>
            🔑 Senha: ${this.lastCreatedAccess.password}
          </div>
          <button class="whatsapp-copy-btn" id="btn-copy-wa-message" data-msg="🔱 Olá ${this.lastCreatedAccess.name}! Seu acesso ao Repositório BUUTZKE está liberado:&#10;🔗 Link: ${window.location.origin}/biblioteca&#10;📧 Login: ${this.lastCreatedAccess.email}&#10;🔑 Senha: ${this.lastCreatedAccess.password}&#10;Bons estudos e bem-vindo ao Círculo!">
            📋 Copiar Mensagem Pronta para WhatsApp
          </button>
        </div>
      ` : ''}

      <!-- SUBTABS DO ADMIN -->
      <div class="admin-subtabs">
        <button class="admin-subtab-btn ${this.adminSubTab === 'usuarios' ? 'active' : ''}" data-subtab="usuarios">
          👥 Usuários & Assinantes (${this.members.length})
        </button>
        <button class="admin-subtab-btn ${this.adminSubTab === 'acervo' ? 'active' : ''}" data-subtab="acervo">
          📚 Acervo Supabase (${this.books.length})
        </button>
        <button class="admin-subtab-btn ${this.adminSubTab === 'supabase' ? 'active' : ''}" data-subtab="supabase">
          🌐 Conexão Supabase
        </button>
      </div>

      <!-- CONTEÚDO DA SUBTAB ATIVA -->
      ${this.adminSubTab === 'usuarios' ? this._renderAdminUsuarios() : ''}
      ${this.adminSubTab === 'acervo' ? this._renderAdminAcervo() : ''}
      ${this.adminSubTab === 'supabase' ? this._renderAdminSupabase(isConfigured, currentUrl) : ''}
    `;
  }

  /* ---- SUBTAB: GESTÃO DE USUÁRIOS & EXPIRAÇÕES ---- */
  _renderAdminUsuarios() {
    const totalCount = this.members.length;
    const activeCount = this.members.filter(m => m.status === 'ativo' && !m.isExpired && !m.isExpiringSoon).length;
    const expiringCount = this.members.filter(m => m.status === 'ativo' && m.isExpiringSoon && !m.isExpired).length;
    const expiredCount = this.members.filter(m => m.isExpired || m.status === 'expirado').length;
    const blockedCount = this.members.filter(m => m.status === 'bloqueado').length;

    let filtered = [...this.members];
    if (this.memberFilter === 'ativo') {
      filtered = filtered.filter(m => m.status === 'ativo' && !m.isExpired && !m.isExpiringSoon);
    } else if (this.memberFilter === 'expirando') {
      filtered = filtered.filter(m => m.status === 'ativo' && m.isExpiringSoon && !m.isExpired);
    } else if (this.memberFilter === 'expirado') {
      filtered = filtered.filter(m => m.isExpired || m.status === 'expirado');
    } else if (this.memberFilter === 'bloqueado') {
      filtered = filtered.filter(m => m.status === 'bloqueado');
    }

    if (this.memberSearchQuery && this.memberSearchQuery.trim()) {
      const q = this.memberSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(m =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.plan && m.plan.toLowerCase().includes(q))
      );
    }

    return `
      <!-- CARDS DE MÉTRICAS DE ASSINANTES -->
      <div class="admin-metric-grid">
        <div class="admin-metric-card" style="border-color:rgba(212,160,23,0.3);">
          <div class="admin-metric-num" style="color:#f5c842;">${totalCount}</div>
          <div class="admin-metric-label">Total Cadastrados</div>
        </div>
        <div class="admin-metric-card" style="border-color:rgba(34,197,94,0.3);">
          <div class="admin-metric-num" style="color:#22c55e;">${activeCount}</div>
          <div class="admin-metric-label">🟢 Assinantes Ativos</div>
        </div>
        <div class="admin-metric-card" style="border-color:rgba(245,200,66,0.3);">
          <div class="admin-metric-num" style="color:#f5c842;">${expiringCount}</div>
          <div class="admin-metric-label">⚠️ Expirando em ≤ 5 dias</div>
        </div>
        <div class="admin-metric-card" style="border-color:rgba(239,68,68,0.3);">
          <div class="admin-metric-num" style="color:#ff6666;">${expiredCount}</div>
          <div class="admin-metric-label">🔴 Assinaturas Expiradas</div>
        </div>
      </div>

      <!-- BARRA DE CABEÇALHO & AÇÕES -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:16px;">
        <div>
          <h3 style="font-family:var(--font-title); font-size:1.3rem; color:#fff; margin:0;">
            Painel de Assinantes & Controle de Vencimentos
          </h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin:2px 0 0 0;">
            Sincronizado com Supabase. Acompanhe quem está ativo, expirando e renove em 1 clique.
          </p>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <button class="btn btn-outline" id="btn-sync-members-supabase" style="font-size:0.84rem; padding:8px 16px; border-color:#d4a017; color:#f5c842;">
            🔄 Sincronizar Supabase
          </button>
          <button class="btn btn-primary" id="btn-open-new-member" style="font-size:0.88rem; padding:9px 20px;">
            + Cadastrar Novo Usuário
          </button>
        </div>
      </div>

      <!-- FILTROS & BUSCA -->
      <div class="admin-filter-bar">
        <button class="admin-filter-pill ${this.memberFilter === 'todos' ? 'active' : ''}" data-filter="todos">
          Todos (${totalCount})
        </button>
        <button class="admin-filter-pill ${this.memberFilter === 'ativo' ? 'active' : ''}" data-filter="ativo">
          🟢 Ativos (${activeCount})
        </button>
        <button class="admin-filter-pill ${this.memberFilter === 'expirando' ? 'active' : ''}" data-filter="expirando">
          ⚠️ Expirando (${expiringCount})
        </button>
        <button class="admin-filter-pill ${this.memberFilter === 'expirado' ? 'active' : ''}" data-filter="expirado">
          🔴 Expirados (${expiredCount})
        </button>
        <button class="admin-filter-pill ${this.memberFilter === 'bloqueado' ? 'active' : ''}" data-filter="bloqueado">
          🔒 Bloqueados (${blockedCount})
        </button>

        <div style="margin-left:auto; min-width:240px; flex:1; max-width:320px;">
          <input type="text" id="member-search-input" value="${this.memberSearchQuery || ''}" placeholder="🔍 Buscar nome, e-mail..." style="width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); color:#fff; padding:7px 14px; border-radius:20px; font-size:0.82rem; outline:none;">
        </div>
      </div>

      <!-- TABELA DE MEMBROS -->
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail (Login)</th>
              <th>Senha</th>
              <th>Plano</th>
              <th>Expiração / Validade</th>
              <th>Status</th>
              <th style="text-align:right;">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr><td colspan="7" style="text-align:center; padding:35px; color:var(--text-muted);">Nenhum usuário encontrado para este filtro.</td></tr>
            ` : filtered.map(m => `
              <tr>
                <td><strong>${m.name}</strong></td>
                <td style="color:#d4a017; font-family:monospace; font-size:0.85rem;">${m.email}</td>
                <td><code style="background:rgba(255,255,255,0.06); padding:3px 6px; border-radius:4px; font-size:0.8rem; color:#fff;">${m.password}</code></td>
                <td><span style="font-size:0.82rem; color:#ddd;">${m.plan}</span></td>
                <td>
                  ${m.isLifetime ? `
                    <span class="status-badge vitalicio">♾️ Vitalício</span>
                  ` : m.isExpired ? `
                    <div>
                      <span class="status-badge expirado">🔴 Expirado</span>
                      <div style="font-size:0.72rem; color:#ff6666; margin-top:3px;">
                        Venceu em ${m.expiresAtFormatted} (${Math.abs(m.daysRemaining || 0)}d atrás)
                      </div>
                    </div>
                  ` : m.isExpiringSoon ? `
                    <div>
                      <span class="status-badge expirando">⚠️ Expira em ${m.daysRemaining}d</span>
                      <div style="font-size:0.72rem; color:#f5c842; margin-top:3px;">
                        Até ${m.expiresAtFormatted}
                      </div>
                    </div>
                  ` : `
                    <div>
                      <span class="status-badge ativo">🟢 Válido (${m.daysRemaining}d)</span>
                      <div style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;">
                        Até ${m.expiresAtFormatted}
                      </div>
                    </div>
                  `}
                </td>
                <td>
                  ${m.status === 'bloqueado' ? `
                    <span class="status-badge bloqueado">🔒 Bloqueado</span>
                  ` : m.isExpired ? `
                    <span class="status-badge expirado">✕ Inativo</span>
                  ` : m.isExpiringSoon ? `
                    <span class="status-badge expirando">● Alerta</span>
                  ` : `
                    <span class="status-badge ativo">● Ativo</span>
                  `}
                </td>
                <td style="text-align:right; white-space:nowrap;">
                  <button class="admin-action-btn btn-renew-member" data-id="${m.id}" data-name="${m.name}" title="Adicionar +30 dias de acesso" style="border-color:rgba(34,197,94,0.4); color:#22c55e;">
                    🔄 +30d
                  </button>
                  <button class="whatsapp-copy-btn btn-copy-member-wa"
                          data-name="${m.name}"
                          data-email="${m.email}"
                          data-pass="${m.password}"
                          data-status="${m.status}"
                          data-expired="${m.isExpired}"
                          data-expiring="${m.isExpiringSoon}"
                          data-expires-date="${m.expiresAtFormatted}"
                          title="Copiar mensagem personalizada com link de renovação ou dados de acesso">
                    💬 WhatsApp
                  </button>
                  <button class="admin-action-btn btn-toggle-status" data-id="${m.id}" title="${m.status === 'bloqueado' ? 'Desbloquear Acesso' : 'Bloquear Acesso'}">
                    ${m.status === 'bloqueado' ? '🔓 Liberar' : '🔒 Bloquear'}
                  </button>
                  <button class="admin-action-btn btn-delete-member" data-id="${m.id}" style="color:#ff6666;" title="Excluir Usuário">
                    🗑️
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- CARD SUPABASE POSTGRES INFORMAÇÃO & SQL 1-CLIQUE -->
      <div style="margin-top:24px; background:rgba(0,0,0,0.3); border:1px dashed rgba(212,160,23,0.3); border-radius:12px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
        <div>
          <div style="font-size:0.85rem; font-weight:700; color:#f5c842; display:flex; align-items:center; gap:6px;">
            <span>🗄️</span> Supabase Postgres: Tabela <code>public.membros</code>
          </div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:3px; max-width:600px;">
            Se ainda não criou a tabela no Postgres do Supabase, você pode rodar o script SQL abaixo no SQL Editor do Supabase para manter tudo sincronizado na nuvem.
          </div>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline btn-sm" id="btn-copy-membros-sql" style="font-size:0.78rem; border-color:rgba(212,160,23,0.5); color:#f5c842;">
            📋 Copiar SQL da Tabela
          </button>
        </div>
      </div>
    `;
  }

  /* ---- SUBTAB: GESTÃO DO ACERVO SUPABASE ---- */
  _renderAdminAcervo() {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px;">
        <div>
          <h3 style="font-family:var(--font-title); font-size:1.3rem; color:#fff; margin:0;">
            Manuscritos do Repositório Supabase
          </h3>
          <p style="font-size:0.85rem; color:#22c55e; margin:2px 0 0 0;">
            ✓ Ebooks vendidos na Kirvano foram totalmente isolados e não aparecem nesta área.
          </p>
        </div>
        <button class="btn btn-primary" id="btn-open-new-book" style="font-size:0.88rem; padding:10px 20px;">
          + Adicionar Livro ao Supabase
        </button>
      </div>

        <!-- BOX DE SINCRONIZAÇÃO DO BUCKET -->
        <div style="background:rgba(212,160,23,0.08); border:1px solid rgba(212,160,23,0.3); border-radius:12px; padding:20px 24px; margin-bottom:28px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
            <div>
              <h4 style="font-family:var(--font-title); color:#f5c842; font-size:1.05rem; margin:0 0 4px 0;">
                📦 Sincronização com o Bucket do Supabase Storage
              </h4>
              <p style="font-size:0.8rem; color:#ccc; margin:0;">
                Puxa todos os PDFs que você fez upload diretamente no Storage do seu Supabase.
              </p>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <input type="text" id="input-storage-bucket-name" value="${SupabaseService.getStorageBucketName()}" placeholder="Nome do bucket (ex: Ebooks)" style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:6px; padding:8px 14px; color:#fff; font-size:0.82rem; width:160px; outline:none;">
              <button id="btn-sync-storage-bucket" class="btn btn-primary btn-sm" style="padding:8px 16px; font-size:0.82rem;">
                🔄 Sincronizar Bucket
              </button>
            </div>
          </div>

          <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(212,160,23,0.25); padding:14px 18px; border-radius:8px; font-size:0.82rem; color:#bbb; line-height:1.6;">
            <div style="color:#f5c842; font-weight:700; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <span>⚡ Instrução Rápida para o Supabase:</span>
            </div>
            Para que o site consiga listar e ler todos os seus PDFs sem bloqueios:
            <ol style="margin:6px 0 10px 20px; padding:0;">
              <li>Acesse: <a href="https://supabase.com/dashboard/project/yxgzqxfstbhfbevwjqgd/storage/buckets" target="_blank" style="color:#f5c842; text-decoration:underline;">Supabase Storage → Buckets</a></li>
              <li>Nos <strong>3 pontinhos (...)</strong> ao lado do bucket <strong>Ebooks</strong>, clique em <strong>Edit bucket</strong></li>
              <li>Ative a chave <strong>"Public bucket"</strong> para <strong>ON</strong> e clique em <strong>Save bucket</strong></li>
            </ol>
            <div style="margin-top:8px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; background:rgba(0,0,0,0.6); padding:8px 12px; border-radius:6px;">
              <code style="color:#22c55e; font-size:0.75rem;">UPDATE storage.buckets SET public = true WHERE id = 'Ebooks';</code>
              <button id="btn-copy-supabase-sql" class="btn btn-outline btn-sm" style="font-size:0.72rem; padding:4px 10px; border-color:rgba(212,160,23,0.4); color:#f5c842;">
                📋 Copiar SQL (SQL Editor)
              </button>
            </div>
          </div>
        </div>

      <div class="repo-grid">
        ${this.books.length === 0 ? `
          <div style="grid-column: 1/-1; background:#111116; border:1px dashed rgba(255,255,255,0.15); border-radius:14px; padding:50px 20px; text-align:center;">
            <div style="font-size:2.2rem; margin-bottom:10px;">📦</div>
            <h4 style="font-family:var(--font-title); font-size:1.15rem; color:#fff; margin-bottom:6px;">
              Nenhum arquivo encontrado no bucket "${SupabaseService.getStorageBucketName()}"
            </h4>
            <p style="font-size:0.85rem; color:var(--text-muted); max-width:550px; margin:0 auto 20px auto;">
              Certifique-se de que o bucket no Supabase está como <strong>Public</strong> e com o nome correto acima, ou adicione um livro manualmente.
            </p>
            <button id="btn-retry-sync-bucket" class="btn btn-outline btn-sm" style="border-color:#d4a017; color:#f5c842;">
              🔄 Tentar Sincronizar Novamente
            </button>
          </div>
        ` : this.books.map(b => `
          <div class="repo-card">
            <div class="repo-card-thumb" style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:radial-gradient(circle, #1a1a24, #0a0a0e); border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="font-size:3.2rem; filter:drop-shadow(0 0 10px rgba(212,160,23,0.3));">📄</span>
              <span style="font-size:0.72rem; color:var(--text-muted); margin-top:8px;">${b.fileName || 'PDF Supabase'}</span>
              <div class="repo-card-badge" style="background:rgba(212,160,23,0.25); border-color:#d4a017; color:#f5c842;">
                ${b.badge || 'Supabase'}
              </div>
            </div>
            <div class="repo-card-body">
              <div class="repo-card-cat">${b.category}</div>
              <h3 class="repo-card-title">${b.title}</h3>
              <p class="repo-card-desc">${b.description}</p>
              <div class="repo-card-footer">
                <span class="repo-card-meta">${b.pages}</span>
                <div style="display:flex; gap:8px;">
                  <button class="repo-btn-read btn-open-reader" data-id="${b.id}" style="font-size:0.75rem; padding:6px 12px;">
                    📖 Ler / Visualizar
                  </button>
                  <button class="admin-action-btn btn-delete-book" data-id="${b.id}" style="color:#ff6666;" title="Excluir livro">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ---- SUBTAB: CONEXÃO COM SUPABASE ---- */
  _renderAdminSupabase(isConfigured, currentUrl) {
    return `
      <div style="max-width:760px; background:#111116; border:1px solid rgba(212,160,23,0.3); border-radius:16px; padding:32px; box-shadow:0 10px 40px rgba(0,0,0,0.6);">
        <h3 style="font-family:var(--font-title); font-size:1.4rem; color:#f5c842; margin-bottom:8px;">
          Configuração da API Supabase
        </h3>
        <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6; margin-bottom:24px;">
          Todos os acessos e leituras são validados diretamente contra o seu projeto no Supabase. Para sincronizar o banco e o storage, informe a URL do seu projeto abaixo:
        </p>

        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:16px; margin-bottom:20px;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Chave Pública (Anon / Publishable API Key)</div>
          <code style="color:#f5c842; font-size:0.92rem; word-break:break-all;">sb_publishable_6E5m6roVs0iOZRJCvMznXg_cLAHDYe-</code>
        </div>

        <div class="auth-input-group" style="margin-bottom:20px;">
          <label style="color:#fff; font-weight:600; font-size:0.9rem;">
            URL do Projeto Supabase (Encontre em: Supabase Dashboard → Settings → API → Project URL)
          </label>
          <input type="text" id="input-admin-supabase-url" placeholder="Ex: https://xyzcompany.supabase.co" value="${currentUrl}" style="padding:14px 18px; font-size:0.95rem;">
        </div>

        <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap; margin-bottom:20px;">
          <button id="btn-save-admin-supabase-url" class="btn btn-primary" style="padding:12px 24px;">
            💾 Salvar URL e Conectar
          </button>
          <button id="btn-test-supabase-ping" class="btn btn-outline" style="padding:12px 20px;">
            ⚡ Testar Conexão Agora
          </button>
        </div>

        <div id="supabase-admin-feedback" style="display:${isConfigured ? 'block' : 'none'}; padding:14px; border-radius:8px; font-size:0.85rem; ${isConfigured ? 'background:rgba(34,197,94,0.15); color:#22c55e; border:1px solid rgba(34,197,94,0.3);' : ''}">
          ${isConfigured ? '✓ Supabase configurado e pronto para validação de logins!' : ''}
        </div>
      </div>
    `;
  }

  /* =====================================================
     2. VISÃO DO VISITANTE / NÃO MEMBRO (PAYWALL & OFERTA)
     ===================================================== */
  _renderGuestArea() {
    return `
      <section class="membros-paywall-hero">
        <div class="membros-paywall-badge">✦ REPOSITÓRIO EXCLUSIVO & ÁREA DE MEMBROS ✦</div>
        <h1 class="membros-paywall-title">O Círculo BUUTZKE</h1>
        <p class="membros-paywall-desc">
          Repositório fechado de manuscritos sagrados, estudos profundos de Quimbanda e alta magia cerimonial, leitor online e comunidade de praticantes.
        </p>

        <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap; margin-bottom:40px;">
          <a href="https://pay.kirvano.com/45e4e673-3e4e-4ec6-8d24-19717ab0aa0b" target="_blank" class="btn btn-primary btn-lg btn-shimmer" style="padding:16px 32px; font-size:1rem; text-decoration:none;">
            ⚡ ASSINAR O REPOSITÓRIO
          </a>
          <button class="btn btn-outline btn-lg" id="btn-open-login" style="padding:16px 28px; font-size:0.95rem; border-color:#d4a017; color:#f5c842;">
            🗝️ ENTRAR NA CONTA (LOGIN)
          </button>
        </div>

        <div class="ltrust" style="justify-content:center; gap:24px; margin-bottom:50px;">
          <span>✓ Validação direta de acesso</span>
          <span>✓ Leitura no celular e computador</span>
          <span>✓ Manuscritos exclusivos do acervo</span>
          <span>✓ Cancele quando quiser</span>
        </div>
      </section>

      <!-- PREVIEW DOS LIVROS EXCLUSIVOS TRANCADOS -->
      <section style="margin-bottom:80px;">
        <div style="text-align:center; margin-bottom:30px;">
          <h2 style="font-family:var(--font-title); font-size:1.8rem; color:#fff; margin-bottom:8px;">
            Manuscritos Disponíveis aos Assinantes
          </h2>
          <p style="color:var(--text-muted); font-size:0.92rem;">
            Acervo fechado exclusivo do Círculo (não vendido avulso):
          </p>
        </div>

        <div class="repo-grid">
          ${this.books.map(b => `
            <div class="repo-card">
              <div class="repo-card-thumb">
                <img src="${b.cover}" alt="${b.title}" onerror="this.src='/assets/ebook-cover.jpg'">
                <div class="repo-card-badge">🔒 Exclusivo Membros</div>
              </div>
              <div class="repo-card-body">
                <div class="repo-card-cat">${b.category}</div>
                <h3 class="repo-card-title">${b.title}</h3>
                <p class="repo-card-desc">${b.description}</p>
                <div class="repo-card-footer">
                  <span class="repo-card-meta">📄 ${b.pages} páginas</span>
                  <a href="https://pay.kirvano.com/45e4e673-3e4e-4ec6-8d24-19717ab0aa0b" target="_blank" class="btn btn-outline btn-sm btn-locked-book" style="font-size:0.78rem; padding:6px 12px; border-color:rgba(212,160,23,0.3); color:#f5c842; text-decoration:none; display:inline-flex; align-items:center;">
                    🔒 Desbloquear
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- TABELA DE PLANOS DE ASSINATURA -->
      <section id="planos" style="margin-bottom:80px; scroll-margin-top:100px;">
        <div style="text-align:center; margin-bottom:40px;">
          <div style="font-size:0.8rem; color:#d4a017; font-family:var(--font-title); letter-spacing:2px;">ASSINATURA DO REPOSITÓRIO</div>
          <h2 style="font-family:var(--font-title); font-size:2.2rem; color:#fff; margin-top:6px;">Escolha Seu Plano de Acesso</h2>
          <p style="color:var(--text-muted); font-size:0.95rem; max-width:600px; margin:0 auto;">
            Acesso ilimitado a todos os manuscritos digitais e ao Círculo de Membros.
          </p>
        </div>

        <div class="planos-grid">
          <!-- PLANO MENSAL -->
          <div class="plano-card">
            <h3 class="plano-name">Assinatura Mensal</h3>
            <div class="plano-price">R$ 29,90 <small>/ mês</small></div>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:16px;">Cobrança mensal recorrente. Sem fidelidade.</p>
            <ul class="plano-features">
              <li><span>✓</span> Acesso completo a todo o repositório de livros</li>
              <li><span>✓</span> Leitor digital no navegador com anotações</li>
              <li><span>✓</span> Acesso ao Círculo de Discussão de Membros</li>
              <li><span>✓</span> Novos títulos e atualizações adicionados todo mês</li>
              <li><span>✓</span> Suporte e liberação de acesso imediata</li>
            </ul>
            <a href="https://pay.kirvano.com/45e4e673-3e4e-4ec6-8d24-19717ab0aa0b" target="_blank" class="plano-btn" id="btn-assinar-mensal">
              ASSINAR PLANO MENSAL
            </a>
          </div>

          <!-- PLANO ANUAL -->
          <div class="plano-card featured">
            <div class="plano-ribbon">✦ MAIS VANTAJOSO (45% OFF) ✦</div>
            <h3 class="plano-name" style="color:#f5c842;">Passe Anual do Círculo</h3>
            <div class="plano-price" style="color:#f5c842;">R$ 197 <small>/ ano</small></div>
            <p style="font-size:0.82rem; color:#22c55e; margin-bottom:16px;">Equivale a R$ 16,41 por mês (Economize R$ 161,80)</p>
            <ul class="plano-features">
              <li><span style="color:#f5c842;">✓</span> <strong>Tudo incluso no Plano Mensal</strong></li>
              <li><span style="color:#f5c842;">✓</span> 12 meses de acesso garantido sem reajuste</li>
              <li><span style="color:#f5c842;">✓</span> Acesso prioritário aos lançamentos e manuscritos raros</li>
              <li><span style="color:#f5c842;">✓</span> Canal direto de perguntas no Oráculo do Acervo</li>
              <li><span style="color:#f5c842;">✓</span> Badge exclusiva de Membro Veterano no Círculo</li>
            </ul>
            <a href="https://pay.kirvano.com/45e4e673-3e4e-4ec6-8d24-19717ab0aa0b" target="_blank" class="plano-btn featured" id="btn-assinar-anual">
              ⭐ QUERO O PASSE ANUAL
            </a>
          </div>
        </div>

        <div style="text-align:center; margin-top:20px;">
          <p style="font-size:0.85rem; color:var(--text-muted);">
            Já possui acesso? <a href="#" id="link-guest-login" style="color:#d4a017; font-weight:600; text-decoration:underline;">Clique aqui para fazer login</a>.
          </p>
        </div>
      </section>
    `;
  }

  /* =====================================================
     3. VISÃO DO MEMBRO AUTENTICADO
     ===================================================== */
  _renderMemberArea() {
    const user = this.user;

    return `
      <div class="membros-topbar">
        <div class="membros-profile">
          <div class="membros-avatar">${user.avatar || '🔱'}</div>
          <div class="membros-info">
            <h3>
              ${user.name || 'Iniciado'}
              <span class="membros-badge-vip">${user.plan || 'Assinante Ativo'}</span>
            </h3>
            <p>Membro desde ${user.joinedAt || 'Hoje'} • Acesso ao Repositório Liberado</p>
          </div>
        </div>

        <div class="membros-actions">
          <button class="btn btn-outline btn-sm" id="btn-member-logout" style="font-size:0.8rem; border-color:rgba(255,51,0,0.3); color:#ff6666;">
            🚪 Sair
          </button>
        </div>
      </div>

      <div class="membros-tabs">
        <button class="membros-tab-btn ${this.currentTab === 'acervo' ? 'active' : ''}" data-tab="acervo">
          📖 Acervo de Livros (${this.books.length})
        </button>
        <button class="membros-tab-btn ${this.currentTab === 'chat' ? 'active' : ''}" data-tab="chat">
          💬 Círculo de Conversas (${this.chatMessages.length})
        </button>
        <button class="membros-tab-btn ${this.currentTab === 'oraculo' ? 'active' : ''}" data-tab="oraculo">
          🔮 Oráculo do Acervo
        </button>
      </div>

      <div class="membros-tab-content">
        ${this.currentTab === 'acervo' ? this._renderTabAcervo() : ''}
        ${this.currentTab === 'chat' ? this._renderTabChat() : ''}
        ${this.currentTab === 'oraculo' ? this._renderTabOraculo() : ''}
      </div>

      ${this.currentTab !== 'chat' ? `
        <button class="floating-chat-fab" id="fab-open-chat" title="Abrir Círculo de Conversas dos Membros">
          💬 Chat dos Membros <span style="background:rgba(0,0,0,0.4); padding:2px 7px; border-radius:12px; font-size:0.75rem;">${this.chatMessages.length}</span>
        </button>
      ` : ''}
    `;
  }

  /* ---- ABA MEMBRO: ACERVO ---- */
  _renderTabAcervo() {
    let filtered = this.books;
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(b => b.category.toLowerCase().includes(this.currentCategory.toLowerCase()));
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
    }

    return `
      <div class="repo-controls">
        <div class="repo-search-box">
          <span class="repo-search-icon">🔍</span>
          <input type="text" id="repo-search-input" placeholder="Buscar no repositório..." value="${this.searchQuery}">
        </div>

        <div class="repo-categories">
          <button class="repo-cat-btn ${this.currentCategory === 'all' ? 'active' : ''}" data-cat="all">Todos</button>
          <button class="repo-cat-btn ${this.currentCategory === 'manuscritos' ? 'active' : ''}" data-cat="manuscritos">Manuscritos Ocultos</button>
          <button class="repo-cat-btn ${this.currentCategory === 'quimbanda' ? 'active' : ''}" data-cat="quimbanda">Quimbanda Sagrada</button>
          <button class="repo-cat-btn ${this.currentCategory === 'alta magia' ? 'active' : ''}" data-cat="alta magia">Alta Magia</button>
        </div>
      </div>

      <div class="repo-grid">
        ${filtered.map(b => `
          <div class="repo-card">
            <div class="repo-card-thumb">
              <img src="${b.cover}" alt="${b.title}" onerror="this.src='/assets/ebook-cover.jpg'">
              <div class="repo-card-badge" style="background:rgba(34,197,94,0.2); color:#22c55e; border-color:#22c55e;">✓ Liberado</div>
            </div>
            <div class="repo-card-body">
              <div class="repo-card-cat">${b.category}</div>
              <h3 class="repo-card-title">${b.title}</h3>
              <p class="repo-card-desc">${b.description}</p>
              <div class="repo-card-footer">
                <span class="repo-card-meta">📄 ${b.pages} páginas</span>
                <button class="repo-btn-read btn-open-reader" data-id="${b.id}">
                  📖 Ler Online
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ---- ABA MEMBRO: CHAT ---- */
  _renderTabChat() {
    const isAdmin = this.user?.role === 'admin';

    return `
      <div class="chat-container">
        <div class="chat-header">
          <div>
            <h3 style="display:flex; align-items:center; gap:8px; margin:0;">
              <span class="chat-status-dot"></span>
              Círculo de Discussão & Estudos
            </h3>
            <span style="font-size:0.75rem; color:#22c55e;">● Supabase DB Conectado</span>
          </div>
          ${isAdmin ? `
            <button class="btn btn-outline btn-sm" id="btn-clear-chat" style="font-size:0.75rem; border-color:rgba(255,51,0,0.3); color:#ff6666;">
              🧹 Limpar Todas as Mensagens
            </button>
          ` : ''}
        </div>

        <div class="chat-messages" id="chat-messages-box">
          ${this.chatMessages.length === 0 ? `
            <div style="text-align:center; padding:40px; color:var(--text-muted); font-size:0.9rem;">
              Nenhuma mensagem no Círculo ainda. Seja o primeiro a escrever!
            </div>
          ` : this.chatMessages.map(m => `
            <div class="chat-msg-row ${m.userName === this.user?.name ? 'mine' : ''}">
              <div class="chat-msg-avatar">${m.avatar || '🔱'}</div>
              <div class="chat-msg-content" style="position:relative;">
                <div class="chat-msg-header">
                  <span class="chat-msg-author">${m.userName}</span>
                  <span class="chat-msg-role">${m.userRole || 'Membro'}</span>
                  <span class="chat-msg-time">${m.time}</span>
                  ${(isAdmin || m.userName === this.user?.name) ? `
                    <button class="btn-delete-chat-msg" data-id="${m.id}" title="Apagar mensagem do banco Supabase" style="background:none; border:none; color:#ff6666; cursor:pointer; font-size:0.8rem; margin-left:8px; opacity:0.7; padding:0 4px;">
                      🗑️
                    </button>
                  ` : ''}
                </div>
                <div class="chat-msg-text">${m.text}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <form class="chat-input-bar" id="chat-form">
          <input type="text" id="chat-input-text" placeholder="Escreva sua dúvida ou reflexão sobre os manuscritos..." autocomplete="off">
          <button type="submit" class="chat-btn-send">Enviar ✦</button>
        </form>
      </div>
    `;
  }

  /* ---- ABA MEMBRO: ORÁCULO ---- */
  _renderTabOraculo() {
    return `
      <div class="oraculo-box">
        <div style="text-align:center; margin-bottom:28px;">
          <div style="font-size:2.4rem; margin-bottom:8px;">🔮</div>
          <h2 style="font-family:var(--font-title); font-size:1.8rem; color:#f5c842; margin-bottom:8px;">
            Oráculo do Acervo BUUTZKE
          </h2>
          <p style="color:var(--text-muted); font-size:0.92rem; max-width:640px; margin:0 auto;">
            Consulte os ensinamentos dos manuscritos sagrados do Supabase.
          </p>
        </div>

        <div style="display:flex; gap:10px; margin-bottom:20px;">
          <input type="text" id="oraculo-query" placeholder="Ex: Como consagrar a faca de cabo branco segundo o Grimorium Verum?" style="flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(212,160,23,0.3); border-radius:10px; padding:14px 20px; color:#fff; font-size:0.95rem; outline:none;">
          <button id="btn-consultar-oraculo" class="btn btn-primary" style="padding:0 24px;">
            Consultar ✦
          </button>
        </div>

        <div id="oraculo-result-box" style="display:none; background:rgba(212,160,23,0.06); border:1px solid rgba(212,160,23,0.25); border-radius:12px; padding:24px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; color:#d4a017; font-family:var(--font-title); font-size:0.9rem;">
            <span>📜</span> Resposta dos Manuscritos Sagrados
          </div>
          <div id="oraculo-result-text" style="font-size:0.95rem; line-height:1.8; color:#eee;"></div>
        </div>
      </div>
    `;
  }

  /* =====================================================
     MODAL DE AUTENTICAÇÃO REAL COM O SUPABASE
     ===================================================== */
  _renderAuthModal() {
    if (!this.authModalMode) return '';

    return `
      <div class="auth-modal" id="auth-modal">
        <div class="auth-card">
          <button class="auth-close" id="btn-close-auth">✕</button>

          <div style="text-align:center; margin-bottom:24px;">
            <div style="font-size:1.8rem; margin-bottom:6px;">🗝️</div>
            <h3 style="font-family:var(--font-title); color:#fff; font-size:1.4rem; margin:0 0 6px 0;">
              Entrar no Círculo
            </h3>
            <p style="font-size:0.82rem; color:var(--text-muted); margin:0;">
              Validação direta de acesso com o Supabase
            </p>
          </div>

          ${!SupabaseService.isConfigured() ? `
            <div style="background:rgba(212,160,23,0.1); border:1px solid rgba(212,160,23,0.4); border-radius:10px; padding:14px; margin-bottom:18px;">
              <div style="font-size:0.82rem; color:#f5c842; font-weight:700; margin-bottom:4px;">
                ⚡ Conectar ao seu Supabase
              </div>
              <p style="font-size:0.75rem; color:#ccc; margin-bottom:10px; line-height:1.4;">
                Cole a <strong>URL do Projeto</strong> do seu Supabase (ex: <code>https://xxxx.supabase.co</code>) para validar o login de <code>gabriel.tsanjos@gmail.com</code>:
              </p>
              <div style="display:flex; gap:8px;">
                <input type="text" id="modal-supabase-url" placeholder="https://seu-projeto.supabase.co" style="flex:1; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:6px; padding:8px 12px; color:#fff; font-size:0.8rem; outline:none;">
                <button type="button" id="btn-modal-save-url" class="btn btn-primary" style="padding:8px 14px; font-size:0.78rem;">
                  Salvar
                </button>
              </div>
              <div id="modal-url-feedback" style="display:none; font-size:0.75rem; margin-top:6px;"></div>
            </div>
          ` : ''}

          <form id="auth-form">
            <div class="auth-input-group">
              <label>E-mail cadastrado</label>
              <input type="email" id="auth-email" required placeholder="seuemail@exemplo.com">
            </div>

            <div class="auth-input-group">
              <label>Senha de Acesso</label>
              <input type="password" id="auth-password" required placeholder="••••••••">
            </div>

            <div id="auth-error-msg" style="display:none; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#ff6666; padding:10px 14px; border-radius:8px; font-size:0.82rem; margin-bottom:14px; line-height:1.4;"></div>

            <button type="submit" class="auth-btn-submit" id="auth-btn-submit">
              Acessar Repositório ✦
            </button>
          </form>
        </div>
      </div>
    `;
  }

  /* ---- MODAL: CADASTRAR NOVO MEMBRO (ADMIN) ---- */
  _renderNewMemberModal() {
    if (!this.showNewMemberModal) return '';

    const randomPass = 'mbr' + Math.floor(1000 + Math.random() * 9000);

    return `
      <div class="auth-modal" id="modal-new-member">
        <div class="auth-card" style="max-width:500px;">
          <button class="auth-close" id="btn-close-new-member">✕</button>

          <h3 style="font-family:var(--font-title); font-size:1.3rem; color:#f5c842; margin-bottom:6px;">
            + Cadastrar Novo Membro
          </h3>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:20px;">
            Cria o usuário diretamente no Supabase com data de expiração e gera mensagem pronta para WhatsApp.
          </p>

          <form id="form-create-member">
            <div class="auth-input-group">
              <label>Nome do Cliente / Iniciado</label>
              <input type="text" id="new-member-name" required placeholder="Ex: Marcelo Vieira">
            </div>

            <div class="auth-input-group">
              <label>E-mail do Cliente (Usado para login)</label>
              <input type="email" id="new-member-email" required placeholder="cliente@gmail.com">
            </div>

            <div class="auth-input-group">
              <label>Senha de Acesso (Gerada automaticamente ou personalizada)</label>
              <input type="text" id="new-member-pass" required value="${randomPass}">
            </div>

            <div class="auth-input-group">
              <label>Plano Contratado & Duração do Acesso</label>
              <select id="new-member-plan" style="width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); color:#fff; padding:12px; border-radius:8px; outline:none;">
                <option value="Assinatura Mensal" data-days="30">Assinatura Mensal — 30 Dias (R$ 29,90/mês)</option>
                <option value="Plano Trimestral" data-days="90">Plano Trimestral — 90 Dias</option>
                <option value="Passe Anual" data-days="365">Passe Anual — 365 Dias (R$ 197/ano)</option>
                <option value="Acesso Vitalício" data-days="99999">Acesso Vitalício VIP (Sem expiração)</option>
              </select>
            </div>

            <button type="submit" class="auth-btn-submit" id="btn-submit-create-member">
              Cadastrar no Supabase e Liberar Acesso ✦
            </button>
          </form>
        </div>
      </div>
    `;
  }

  /* ---- MODAL: ADICIONAR LIVRO AO SUPABASE (ADMIN) ---- */
  _renderNewBookModal() {
    if (!this.showNewBookModal) return '';

    return `
      <div class="auth-modal" id="modal-new-book">
        <div class="auth-card" style="max-width:540px;">
          <button class="auth-close" id="btn-close-new-book">✕</button>

          <h3 style="font-family:var(--font-title); font-size:1.3rem; color:#f5c842; margin-bottom:6px;">
            + Cadastrar Livro no Supabase
          </h3>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:20px;">
            Disponibilize um novo manuscrito exclusivo para os membros do repositório.
          </p>

          <form id="form-create-book">
            <div class="auth-input-group">
              <label>Título do Livro / Manuscrito</label>
              <input type="text" id="new-book-title" required placeholder="Ex: Tratado Oculto de Exu Marabô">
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div class="auth-input-group">
                <label>Categoria</label>
                <input type="text" id="new-book-cat" required placeholder="Ex: Quimbanda Sagrada">
              </div>
              <div class="auth-input-group">
                <label>Páginas</label>
                <input type="number" id="new-book-pages" required placeholder="75" value="60">
              </div>
            </div>

            <div class="auth-input-group">
              <label>URL do PDF ou Link no Supabase Storage</label>
              <input type="text" id="new-book-pdf" placeholder="https://...supabase.co/storage/v1/object/public/livros/livro.pdf">
            </div>

            <div class="auth-input-group">
              <label>Descrição do Conteúdo</label>
              <textarea id="new-book-desc" required placeholder="Resumo dos fundamentos e rituais abordados..." style="width:100%; height:80px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:#fff; padding:10px; outline:none; font-family:inherit; font-size:0.88rem;"></textarea>
            </div>

            <button type="submit" class="auth-btn-submit">
              Salvar Livro no Repositório ✦
            </button>
          </form>
        </div>
      </div>
    `;
  }

  /* ---- MODAL: LEITOR DE LIVROS INTERATIVO (OTIMIZADO PARA CELULAR E DESKTOP) ---- */
  _renderReaderModal() {
    if (!this.activeReaderBook) return '';

    const b = this.activeReaderBook;
    const isPdf = Boolean(b.pdfUrl);

    return `
      <div class="reader-modal" id="reader-modal">
        <!-- BARRA SUPERIOR DO LEITOR -->
        <div class="reader-header">
          <div class="reader-title-area">
            <span style="font-size:1.3rem; flex-shrink:0;">📖</span>
            <div class="reader-title-info">
              <h2 class="reader-book-title" title="${b.title}">${b.title}</h2>
              <span class="reader-book-subtitle">${b.category} • Repositório Supabase</span>
            </div>
          </div>

          ${isPdf ? `
            <!-- CONTROLES DESKTOP (Ocultos no celular via CSS) -->
            <div class="reader-desktop-controls">
              <!-- Paginação Desktop -->
              <div class="reader-control-group">
                <button class="reader-btn-icon" id="pdf-btn-prev" title="Página Anterior (Seta Esquerda)">
                  ◀ Anterior
                </button>
                <span class="reader-page-indicator">
                  Pág <input type="number" id="pdf-input-page" min="1" max="${this.pdfTotalPages || 1}" value="${this.pdfPageNum || 1}"> de <strong id="pdf-total-pages">${this.pdfTotalPages || 1}</strong>
                </span>
                <button class="reader-btn-icon" id="pdf-btn-next" title="Próxima Página (Seta Direita)">
                  Próxima ▶
                </button>
              </div>

              <!-- Rotação Desktop -->
              <button class="reader-btn-icon reader-btn-rotate" id="pdf-btn-rotate" title="Girar Página 90° no sentido horário (Tecla R)">
                <span>🔄 Girar 90°</span>
                <span id="pdf-rot-badge" class="reader-badge-rot">${this.pdfRotation}°</span>
              </button>

              <!-- Zoom Desktop -->
              <div class="reader-control-group">
                <button class="reader-btn-icon" id="pdf-btn-zoom-out" title="Diminuir Zoom">🔍 -</button>
                <span id="pdf-zoom-val" class="reader-zoom-val">${Math.round(this.pdfScale * 100)}%</span>
                <button class="reader-btn-icon" id="pdf-btn-zoom-in" title="Aumentar Zoom">🔍 +</button>
                <button class="reader-btn-icon" id="pdf-btn-zoom-fit" title="Ajustar 100%">⛶ 100%</button>
              </div>

              <!-- Chat dos Membros no Leitor (Desktop) -->
              <button class="reader-btn-icon" id="pdf-btn-toggle-chat" title="Chat dos Membros" style="background:${this.showReaderChat ? 'rgba(212,160,23,0.25)' : 'rgba(255,255,255,0.06)'}; border-color:${this.showReaderChat ? '#d4a017' : 'rgba(255,255,255,0.12)'}; color:#f5c842;">
                💬 Chat <span class="reader-badge-rot" style="background:rgba(212,160,23,0.3); color:#f5c842;">${this.chatMessages.length}</span>
              </button>

              <!-- Detalhes do Manuscrito (Desktop) -->
              <button class="reader-btn-icon" id="pdf-btn-toggle-sidebar" title="Ver Informações do Manuscrito">
                ℹ Detalhes
              </button>

              <!-- Abrir Aba -->
              <a href="${b.pdfUrl}" target="_blank" class="reader-btn-icon" title="Abrir PDF original em nova aba" style="text-decoration:none;">
                ⬇ Nova Aba
              </a>

              <!-- Fechar Leitor -->
              <button class="reader-btn-icon reader-btn-close" id="reader-close" title="Fechar Leitor (Esc)">✕</button>
            </div>

            <!-- Ações Topo no Celular -->
            <div class="reader-mobile-header-actions">
              <button class="reader-mobile-top-btn" id="pdf-btn-chat-top-m" title="Chat dos Membros" style="background:${this.showReaderChat ? 'rgba(212,160,23,0.3)' : 'rgba(255,255,255,0.08)'}; border-color:${this.showReaderChat ? '#d4a017' : 'rgba(255,255,255,0.15)'}; color:#f5c842;">
                💬 (${this.chatMessages.length})
              </button>
              <button class="reader-mobile-top-btn" id="pdf-btn-rotate-top-m" title="Girar 90°">🔄 90°</button>
              <button class="reader-mobile-top-btn close-btn" id="reader-close-m" title="Fechar">✕ Fechar</button>
            </div>
          ` : `
            <div class="reader-controls">
              <button class="reader-btn-icon" id="reader-font-dec" title="Diminuir Fonte">A-</button>
              <button class="reader-btn-icon" id="reader-font-inc" title="Aumentar Fonte">A+</button>
              <button class="reader-btn-icon reader-btn-close" id="reader-close" title="Fechar Leitor">✕</button>
            </div>
          `}
        </div>

        <!-- CORPO DO LEITOR (100% da tela dedicado à leitura) -->
        <div class="reader-body">
          <!-- SIDEBAR (Colapsável: oculta por padrão no desktop e sempre oculta no celular) -->
          <div class="reader-sidebar ${this.showReaderSidebar ? 'open' : ''}" id="reader-sidebar">
            <div class="reader-sidebar-header">
              <span class="reader-sidebar-title">Sobre o Manuscrito</span>
              <button class="reader-sidebar-close" id="btn-close-sidebar" title="Ocultar barra">✕</button>
            </div>
            <p class="reader-sidebar-desc">${b.description}</p>
            <div class="reader-sidebar-meta">
              Arquivo: <code>${b.fileName || 'manuscrito.pdf'}</code><br>
              Bucket: <code>${b.bucket || 'Ebooks'}</code>
            </div>

            <div class="reader-sidebar-title" style="margin-top:14px;">⚡ Atalhos do Teclado</div>
            <div class="reader-shortcuts">
              <div><kbd>←</kbd> Página anterior</div>
              <div><kbd>→</kbd> Próxima página</div>
              <div><kbd>R</kbd> Girar 90° página</div>
              <div><kbd>Esc</kbd> Fechar leitor</div>
            </div>
          </div>

          <!-- ÁREA PRINCIPAL DE LEITURA (Ampla, centralizada e fluida) -->
          <div class="reader-content" id="reader-content-scroll">
            ${isPdf ? `
              <!-- Loading Indicator -->
              <div id="pdf-loading-indicator" class="pdf-loading-box">
                <div class="loader-symbol" style="font-size:2.6rem; animation:spin 1.5s infinite linear;">✦</div>
                <p style="margin-top:14px; font-size:0.92rem; font-family:var(--font-title); color:#f5c842;">Abrindo manuscrito do Supabase...</p>
                <span style="font-size:0.75rem; color:var(--text-muted);">Decodificando páginas com alta definição...</span>
              </div>

              <!-- Error Indicator / Fallback caso necessário -->
              <div id="pdf-error-indicator" style="display:none;" class="pdf-error-box">
                <div style="font-size:2rem; margin-bottom:8px;">🛡️</div>
                <h3 style="font-family:var(--font-title); color:#f5c842; font-size:1.1rem; margin-bottom:8px;">
                  Abrir Documento
                </h3>
                <p style="font-size:0.82rem; color:#ccc; margin-bottom:16px;">
                  Clique abaixo para visualizar o PDF completo em nova aba:
                </p>
                <a href="${b.pdfUrl}" target="_blank" class="btn btn-primary btn-sm" style="padding:10px 24px; font-size:0.85rem;">
                  ⬇ Abrir PDF em Nova Aba
                </a>
              </div>

              <!-- Canvas Interativo -->
              <div id="pdf-canvas-container" class="pdf-canvas-wrapper">
                <canvas id="pdf-render-canvas"></canvas>
              </div>
            ` : `
              <div style="max-width:800px; width:100%; font-size:${this.readerFontSize}px; line-height:1.9; padding:20px;">
                <h2 style="font-size:1.5rem; color:#f5c842; font-family:var(--font-title); margin-bottom:20px;">${b.title}</h2>
                <p>${b.chapters[0]?.preview || b.description}</p>
              </div>
            `}
          </div>

          <!-- DRAWER DE CHAT DOS MEMBROS (DENTRO DO LEITOR) -->
          <div class="reader-chat-drawer ${this.showReaderChat ? 'open' : ''}" id="reader-chat-drawer">
            <div class="reader-chat-header">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="chat-status-dot"></span>
                <span style="font-family:var(--font-title); font-size:0.92rem; color:#f5c842;">💬 Chat do Círculo</span>
              </div>
              <button class="reader-chat-close" id="btn-close-reader-chat" title="Fechar Chat">✕</button>
            </div>

            <div class="reader-chat-messages" id="reader-chat-messages-box">
              ${this.chatMessages.length === 0 ? `
                <div style="text-align:center; padding:30px 10px; color:var(--text-muted); font-size:0.82rem;">
                  Nenhuma mensagem ainda. Escreva uma pergunta ou reflexão sobre este manuscrito!
                </div>
              ` : this.chatMessages.map(m => `
                <div class="reader-chat-msg ${m.userName === this.user?.name ? 'mine' : ''}">
                  <div class="reader-chat-msg-author">
                    <span>${m.userName}</span>
                    <span class="reader-chat-msg-time">${m.time}</span>
                  </div>
                  <div class="reader-chat-msg-text">${m.text}</div>
                </div>
              `).join('')}
            </div>

            ${this.user ? `
              <form class="reader-chat-input-bar" id="reader-chat-form">
                <input type="text" id="reader-chat-input-text" placeholder="Comente ou tire dúvidas..." autocomplete="off">
                <button type="submit" class="reader-chat-send">Enviar</button>
              </form>
            ` : `
              <div style="padding:12px; text-align:center; background:rgba(212,160,23,0.08); border-top:1px solid rgba(212,160,23,0.2);">
                <p style="font-size:0.75rem; color:#ccc; margin:0 0 8px 0;">Chat exclusivo para membros ativos.</p>
                <a href="https://pay.kirvano.com/45e4e673-3e4e-4ec6-8d24-19717ab0aa0b" target="_blank" class="btn btn-primary btn-sm" style="font-size:0.75rem; padding:6px 14px; text-decoration:none;">
                  ⚡ Assinar Acesso
                </a>
              </div>
            `}
          </div>
        </div>

        ${isPdf ? `
          <!-- BARRA FLUTUANTE INFERIOR TOUCH PARA CELULAR (Ergonomia total para o polegar) -->
          <div class="reader-mobile-bar">
            <button class="reader-mobile-btn" id="pdf-btn-prev-m" title="Página Anterior">◀ Ant</button>
            <div class="reader-mobile-counter">
              <span id="pdf-mobile-page-num">${this.pdfPageNum || 1}</span> / <span id="pdf-mobile-page-total">${this.pdfTotalPages || 1}</span>
            </div>
            <button class="reader-mobile-btn" id="pdf-btn-next-m" title="Próxima Página">Próx ▶</button>
            <button class="reader-mobile-btn highlight" id="pdf-btn-rotate-m" title="Girar 90 Graus">
              🔄 <span id="pdf-rot-badge-m">${this.pdfRotation}°</span>
            </button>
            <button class="reader-mobile-btn" id="pdf-btn-chat-m" title="Chat dos Membros" style="background:rgba(212,160,23,0.18); border-color:#d4a017; color:#f5c842;">
              💬 Chat
            </button>
            <button class="reader-mobile-btn" id="pdf-btn-zoom-out-m" title="Diminuir Zoom">🔍 -</button>
            <button class="reader-mobile-btn" id="pdf-btn-zoom-in-m" title="Aumentar Zoom">🔍 +</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  /* =====================================================
     EVENTOS E INTERATIVIDADE
     ===================================================== */
  _bindEvents() {
    // Abrir Modal de Login (visitante)
    const btnOpenLogin = this.container.querySelector('#btn-open-login');
    if (btnOpenLogin) {
      btnOpenLogin.addEventListener('click', () => {
        this.authModalMode = 'login';
        this._render();
      });
    }

    const linkGuestLogin = this.container.querySelector('#link-guest-login');
    if (linkGuestLogin) {
      linkGuestLogin.addEventListener('click', (e) => {
        e.preventDefault();
        this.authModalMode = 'login';
        this._render();
      });
    }

    // Salvar URL do Supabase direto pelo Modal de Login
    const btnModalSaveUrl = document.getElementById('btn-modal-save-url');
    if (btnModalSaveUrl) {
      btnModalSaveUrl.addEventListener('click', () => {
        const input = document.getElementById('modal-supabase-url');
        const val = input ? input.value.trim() : '';
        const fb = document.getElementById('modal-url-feedback');
        if (!val || !val.startsWith('http')) {
          if (fb) {
            fb.style.display = 'block';
            fb.style.color = '#ff6666';
            fb.textContent = 'Por favor, insira uma URL válida (ex: https://xxxx.supabase.co)';
          }
          return;
        }
        SupabaseService.setProjectUrl(val);
        if (fb) {
          fb.style.display = 'block';
          fb.style.color = '#22c55e';
          fb.textContent = '✓ Conectado! Agora tente entrar com seu e-mail e senha.';
        }
        setTimeout(() => this._render(), 800);
      });
    }

    // Fechar Modal de Auth
    const btnCloseAuth = document.getElementById('btn-close-auth');
    if (btnCloseAuth) {
      btnCloseAuth.addEventListener('click', () => {
        this.authModalMode = null;
        this._render();
      });
    }

    // Submissão do Formulário de Login (com validação real Supabase)
    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const errMsg = document.getElementById('auth-error-msg');
        const submitBtn = document.getElementById('auth-btn-submit');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Validando no Supabase...';
        errMsg.style.display = 'none';

        try {
          const res = await SupabaseService.signIn(email, password);
          this.user = res.user;
          this.authModalMode = null;
          this._render();
        } catch (err) {
          errMsg.textContent = err.message || 'Erro ao validar credenciais.';
          errMsg.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Tentar Novamente';
        }
      });
    }

    // Logout
    const btnAdminLogout = this.container.querySelector('#btn-admin-logout');
    if (btnAdminLogout) {
      btnAdminLogout.addEventListener('click', async () => {
        await SupabaseService.signOut();
        this.user = null;
        this._render();
      });
    }

    const btnMemberLogout = this.container.querySelector('#btn-member-logout');
    if (btnMemberLogout) {
      btnMemberLogout.addEventListener('click', async () => {
        await SupabaseService.signOut();
        this.user = null;
        this._render();
      });
    }

    // Alternar modo de visualização do Admin (ver como membro)
    const btnToggleView = this.container.querySelector('#btn-toggle-view-mode');
    if (btnToggleView) {
      btnToggleView.addEventListener('click', () => {
        this.user = {
          id: 'preview_member',
          name: 'Buutzke (Visualização)',
          role: 'member',
          plan: 'Assinante Ativo',
          avatar: '🔱',
          joinedAt: 'Hoje'
        };
        this._render();
      });
    }

    // Subtabs do Admin
    this.container.querySelectorAll('.admin-subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.adminSubTab = btn.dataset.subtab;
        this._render();
      });
    });

    // Atalho para configurar Supabase
    const btnQuickConfig = this.container.querySelector('#btn-quick-config-supabase');
    if (btnQuickConfig) {
      btnQuickConfig.addEventListener('click', () => {
        this.adminSubTab = 'supabase';
        this._render();
      });
    }

    // Salvar URL do Supabase no Admin
    const btnSaveAdminUrl = this.container.querySelector('#btn-save-admin-supabase-url');
    if (btnSaveAdminUrl) {
      btnSaveAdminUrl.addEventListener('click', () => {
        const val = document.getElementById('input-admin-supabase-url').value;
        SupabaseService.setProjectUrl(val);
        const fb = document.getElementById('supabase-admin-feedback');
        if (fb) {
          fb.style.display = 'block';
          fb.style.background = 'rgba(34,197,94,0.15)';
          fb.style.color = '#22c55e';
          fb.style.border = '1px solid rgba(34,197,94,0.3)';
          fb.textContent = '✓ URL do Supabase salva com sucesso! O client foi reinicializado.';
        }
      });
    }

    // Testar conexão Supabase ao vivo
    const btnTestPing = this.container.querySelector('#btn-test-supabase-ping');
    if (btnTestPing) {
      btnTestPing.addEventListener('click', async () => {
        btnTestPing.textContent = 'Testando...';
        const res = await SupabaseService.testConnection();
        const fb = document.getElementById('supabase-admin-feedback');
        if (fb) {
          fb.style.display = 'block';
          if (res.success) {
            fb.style.background = 'rgba(34,197,94,0.15)';
            fb.style.color = '#22c55e';
            fb.style.border = '1px solid rgba(34,197,94,0.3)';
            fb.textContent = '✓ ' + res.message;
          } else {
            fb.style.background = 'rgba(239,68,68,0.15)';
            fb.style.color = '#ff6666';
            fb.style.border = '1px solid rgba(239,68,68,0.3)';
            fb.textContent = '✕ ' + res.message;
          }
        }
        btnTestPing.textContent = '⚡ Testar Conexão Agora';
      });
    }

    // Modal de Novo Membro
    const btnOpenNewMember = this.container.querySelector('#btn-open-new-member');
    if (btnOpenNewMember) {
      btnOpenNewMember.addEventListener('click', () => {
        this.showNewMemberModal = true;
        this._render();
      });
    }

    const btnCloseNewMember = document.getElementById('btn-close-new-member');
    if (btnCloseNewMember) {
      btnCloseNewMember.addEventListener('click', () => {
        this.showNewMemberModal = false;
        this._render();
      });
    }

    const formCreateMember = document.getElementById('form-create-member');
    if (formCreateMember) {
      formCreateMember.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('new-member-name').value;
        const email = document.getElementById('new-member-email').value;
        const password = document.getElementById('new-member-pass').value;
        const planSelect = document.getElementById('new-member-plan');
        const plan = planSelect.value;
        const days = parseInt(planSelect.options[planSelect.selectedIndex]?.dataset?.days || '30', 10);

        const submitBtn = document.getElementById('btn-submit-create-member');
        if (submitBtn) submitBtn.textContent = 'Cadastrando no Supabase...';

        await SupabaseService.adminCreateMember({ name, email, password, plan, customDays: days });
        this.members = await SupabaseService.getCreatedMembersList();
        this.showNewMemberModal = false;
        this.lastCreatedAccess = { name, email, password, plan };
        this._render();
      });
    }

    // Sincronizar Supabase manualmente
    const btnSyncSupabase = this.container.querySelector('#btn-sync-members-supabase');
    if (btnSyncSupabase) {
      btnSyncSupabase.addEventListener('click', async () => {
        btnSyncSupabase.textContent = '🔄 Sincronizando...';
        this.members = await SupabaseService.getCreatedMembersList();
        this._render();
      });
    }

    // Filtros de Membros
    this.container.querySelectorAll('.admin-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.memberFilter = pill.dataset.filter || 'todos';
        this._render();
      });
    });

    // Busca de Membros
    const memberSearch = this.container.querySelector('#member-search-input');
    if (memberSearch) {
      memberSearch.addEventListener('input', (e) => {
        this.memberSearchQuery = e.target.value;
        this._render();
        const reInput = document.getElementById('member-search-input');
        if (reInput) {
          reInput.focus();
          reInput.setSelectionRange(reInput.value.length, reInput.value.length);
        }
      });
    }

    // Copiar SQL da Tabela Membros
    const btnCopyMembrosSql = this.container.querySelector('#btn-copy-membros-sql');
    if (btnCopyMembrosSql) {
      btnCopyMembrosSql.addEventListener('click', () => {
        const sql = `CREATE TABLE IF NOT EXISTS public.membros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  plan TEXT DEFAULT 'Assinatura Mensal',
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso Publico Membros" ON public.membros FOR ALL USING (true);`;
        navigator.clipboard.writeText(sql).then(() => {
          btnCopyMembrosSql.textContent = '✓ SQL Copiado!';
          setTimeout(() => { btnCopyMembrosSql.textContent = '📋 Copiar SQL da Tabela'; }, 2000);
        });
      });
    }

    // Renovar +30 dias
    this.container.querySelectorAll('.btn-renew-member').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        btn.textContent = '...';
        await SupabaseService.adminRenewMember(id, 30);
        this.members = await SupabaseService.getCreatedMembersList();
        this._render();
      });
    });

    // Fechar box do WhatsApp
    const btnDismissWa = this.container.querySelector('#btn-dismiss-whatsapp-box');
    if (btnDismissWa) {
      btnDismissWa.addEventListener('click', () => {
        this.lastCreatedAccess = null;
        this._render();
      });
    }

    // Copiar mensagem para WhatsApp (Box superior)
    const btnCopyWa = this.container.querySelector('#btn-copy-wa-message');
    if (btnCopyWa) {
      btnCopyWa.addEventListener('click', () => {
        const msg = btnCopyWa.dataset.msg;
        navigator.clipboard.writeText(msg).then(() => {
          btnCopyWa.textContent = '✓ Mensagem Copiada!';
          setTimeout(() => { btnCopyWa.textContent = '📋 Copiar Mensagem Pronta para WhatsApp'; }, 2000);
        });
      });
    }

    // Botões de ação na tabela de membros (WhatsApp inteligente com link de renovação)
    this.container.querySelectorAll('.btn-copy-member-wa').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const email = btn.dataset.email;
        const pass = btn.dataset.pass;
        const isExpired = btn.dataset.expired === 'true';
        const isExpiring = btn.dataset.expiring === 'true';
        const expDate = btn.dataset.expiresDate || '';

        let text = '';
        if (isExpired) {
          text = `🔱 Olá ${name}! Notamos que seu acesso à Área de Membros e Repositório BUUTZKE expirou em ${expDate}.\n\nPara renovar seu acesso por mais 30 dias e continuar seus estudos com todos os manuscritos sagrados, acesse o link seguro da Kirvano:\n🔗 https://pay.kirvano.com/45e4e673-3e4e-4ec6-8d24-19717ab0aa0b\n\nAssim que confirmar o pagamento, seu acesso é reativado imediatamente!`;
        } else if (isExpiring) {
          text = `🔱 Olá ${name}! Lembramos que sua assinatura do Repositório BUUTZKE está próxima do vencimento (${expDate}).\n\nGaranta a continuidade dos seus estudos renovando pelo link seguro:\n🔗 https://pay.kirvano.com/45e4e673-3e4e-4ec6-8d24-19717ab0aa0b\n\nQualquer dúvida estou à disposição!`;
        } else {
          text = `🔱 Olá ${name}! Seu acesso ao Repositório BUUTZKE está liberado:\n🔗 Link: ${window.location.origin}/biblioteca\n📧 Login: ${email}\n🔑 Senha: ${pass}\n📅 Validade: até ${expDate || '30 dias'}\n\nBons estudos e bem-vindo ao Círculo!`;
        }

        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = '✓ Copiado';
          setTimeout(() => { btn.textContent = '💬 WhatsApp'; }, 2000);
        });
      });
    });

    this.container.querySelectorAll('.btn-toggle-status').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await SupabaseService.adminToggleMemberStatus(id);
        this.members = await SupabaseService.getCreatedMembersList();
        this._render();
      });
    });

    this.container.querySelectorAll('.btn-delete-member').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Deseja realmente remover este usuário?')) {
          const id = btn.dataset.id;
          await SupabaseService.adminDeleteMember(id);
          this.members = await SupabaseService.getCreatedMembersList();
          this._render();
        }
      });
    });

    // Modal de Novo Livro
    const btnOpenNewBook = this.container.querySelector('#btn-open-new-book');
    if (btnOpenNewBook) {
      btnOpenNewBook.addEventListener('click', () => {
        this.showNewBookModal = true;
        this._render();
      });
    }

    const btnCloseNewBook = document.getElementById('btn-close-new-book');
    if (btnCloseNewBook) {
      btnCloseNewBook.addEventListener('click', () => {
        this.showNewBookModal = false;
        this._render();
      });
    }

    const formCreateBook = document.getElementById('form-create-book');
    if (formCreateBook) {
      formCreateBook.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('new-book-title').value;
        const category = document.getElementById('new-book-cat').value;
        const pages = document.getElementById('new-book-pages').value;
        const pdfUrl = document.getElementById('new-book-pdf').value;
        const description = document.getElementById('new-book-desc').value;

        await SupabaseService.adminAddBook({ title, category, pages, pdfUrl, description });
        this.books = await SupabaseService.getRepositoryBooks();
        this.showNewBookModal = false;
        this._render();
      });
    }

    this.container.querySelectorAll('.btn-delete-book').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Deseja remover este livro do repositório?')) {
          const id = btn.dataset.id;
          await SupabaseService.adminDeleteBook(id);
          this.books = await SupabaseService.getRepositoryBooks();
          this._render();
        }
      });
    });

    // Sincronizar Bucket do Supabase Storage
    const triggerSyncBucket = async () => {
      const input = document.getElementById('input-storage-bucket-name');
      if (input && input.value.trim()) {
        SupabaseService.setStorageBucketName(input.value.trim());
      }
      const syncBtn = document.getElementById('btn-sync-storage-bucket');
      if (syncBtn) syncBtn.textContent = '🔄 Sincronizando...';
      this.books = await SupabaseService.getRepositoryBooks();
      this._render();
    };

    const btnSyncBucket = this.container.querySelector('#btn-sync-storage-bucket');
    if (btnSyncBucket) btnSyncBucket.addEventListener('click', triggerSyncBucket);

    const btnRetrySync = this.container.querySelector('#btn-retry-sync-bucket');
    if (btnRetrySync) btnRetrySync.addEventListener('click', triggerSyncBucket);

    const btnCopySql = this.container.querySelector('#btn-copy-supabase-sql');
    if (btnCopySql) {
      btnCopySql.addEventListener('click', () => {
        const sql = `UPDATE storage.buckets SET public = true WHERE id = 'Ebooks';\nCREATE POLICY "Public Ebooks" ON storage.objects FOR SELECT USING (bucket_id = 'Ebooks');`;
        navigator.clipboard.writeText(sql).then(() => {
          btnCopySql.textContent = '✓ SQL Copiado!';
          setTimeout(() => { btnCopySql.textContent = '📋 Copiar SQL (SQL Editor)'; }, 2500);
        });
      });
    }

    // Botão Flutuante de Chat (FAB)
    const fabChat = this.container.querySelector('#fab-open-chat');
    if (fabChat) {
      fabChat.addEventListener('click', () => {
        this.currentTab = 'chat';
        this._render();
        const chatBox = document.getElementById('chat-messages-box');
        if (chatBox) {
          setTimeout(() => { chatBox.scrollTop = chatBox.scrollHeight; }, 60);
        }
      });
    }

    // Auto-scroll do chat na aba de conversas
    if (this.currentTab === 'chat') {
      const chatBox = document.getElementById('chat-messages-box');
      if (chatBox) {
        setTimeout(() => { chatBox.scrollTop = chatBox.scrollHeight; }, 60);
      }
    }

    // Tabs do Membro Comum
    this.container.querySelectorAll('.membros-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTab = btn.dataset.tab;
        this._render();
        if (this.currentTab === 'chat') {
          const chatBox = document.getElementById('chat-messages-box');
          if (chatBox) {
            setTimeout(() => { chatBox.scrollTop = chatBox.scrollHeight; }, 60);
          }
        }
      });
    });

    // Filtros de Categoria do Membro
    this.container.querySelectorAll('.repo-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.dataset.cat;
        this._render();
      });
    });

    // Leitor de Livros
    this.container.querySelectorAll('.btn-open-reader').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const b = this.books.find(x => x.id === id);
        if (b) {
          this.activeReaderBook = b;
          this.activeReaderChapter = 0;
          this._render();
          this._bindReaderControls();
        }
      });
    });

    // Chat
    const chatForm = this.container.querySelector('#chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input-text');
        const text = input.value;
        if (!text.trim()) return;
        input.value = '';

        const newMsg = await SupabaseService.sendChatMessage(text, this.user);
        if (newMsg) {
          this.chatMessages.push(newMsg);
          this._render();
          const chatBox = document.getElementById('chat-messages-box');
          if (chatBox) {
            setTimeout(() => { chatBox.scrollTop = chatBox.scrollHeight; }, 50);
          }
        }
      });
    }

    // Apagar mensagem individual do chat (Supabase DB)
    this.container.querySelectorAll('.btn-delete-chat-msg').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Deseja apagar esta mensagem do banco de dados?')) {
          const id = btn.dataset.id;
          await SupabaseService.deleteChatMessage(id);
          this.chatMessages = await SupabaseService.getChatMessages();
          this._render();
        }
      });
    });

    // Limpar todo o chat (apenas Admin)
    const btnClearChat = this.container.querySelector('#btn-clear-chat');
    if (btnClearChat) {
      btnClearChat.addEventListener('click', async () => {
        if (confirm('Deseja realmente apagar TODAS as mensagens do Círculo no Supabase? Esta ação não pode ser desfeita.')) {
          await SupabaseService.clearAllChatMessages();
          this.chatMessages = await SupabaseService.getChatMessages();
          this._render();
        }
      });
    }

    // Oráculo
    const btnOraculo = this.container.querySelector('#btn-consultar-oraculo');
    const inputOraculo = this.container.querySelector('#oraculo-query');
    if (btnOraculo && inputOraculo) {
      btnOraculo.addEventListener('click', () => {
        const q = inputOraculo.value.toLowerCase().trim();
        if (!q) return;

        let resposta = 'Nos mistérios dos manuscritos sagrados, a eficácia do trabalho depende da exatidão das horas planetárias e da firmeza interior. Consulte o Grimorium Verum e o Tratado dos 7 Reinos para as invocações exatas.';
        if (q.includes('faca') || q.includes('lâmina') || q.includes('cabo')) {
          resposta = '✦ Grimorium Verum (Cap. I): A faca de cabo branco deve ser forjada na hora de Marte ou da Lua crescente, mergulhada em água de poço à meia-noite e consagrada com incenso aromático e as três saudações secretas.';
        } else if (q.includes('reino') || q.includes('exu') || q.includes('encruzilhada')) {
          resposta = '✦ Tratado dos 7 Reinos de Exu: A abertura dos caminhos no Reino da Encruzilhada exige reverência ao ponto de cruzamento. Não se deixa oferenda sem antes riscar a pemba que fecha seu corpo contra interferências.';
        }

        const resBox = document.getElementById('oraculo-result-box');
        const resText = document.getElementById('oraculo-result-text');
        if (resBox && resText) {
          resText.textContent = resposta;
          resBox.style.display = 'block';
        }
      });
    }
  }

  _bindReaderControls() {
    const closeReader = () => {
      if (this.pdfKeyHandler) {
        window.removeEventListener('keydown', this.pdfKeyHandler);
        this.pdfKeyHandler = null;
      }
      if (this.pdfRenderTask) {
        try { this.pdfRenderTask.cancel(); } catch (e) {}
      }
      this.activeReaderBook = null;
      this.pdfDoc = null;
      this.showReaderSidebar = false;
      this.showReaderChat = false;
      this._render();
    };

    // Fechar leitor (Desktop e Celular)
    const btnClose = document.getElementById('reader-close');
    if (btnClose) btnClose.addEventListener('click', closeReader);

    const btnCloseM = document.getElementById('reader-close-m');
    if (btnCloseM) btnCloseM.addEventListener('click', closeReader);

    // Alternar detalhes da sidebar no desktop
    const btnToggleSidebar = document.getElementById('pdf-btn-toggle-sidebar');
    const sidebarEl = document.getElementById('reader-sidebar');
    if (btnToggleSidebar && sidebarEl) {
      btnToggleSidebar.addEventListener('click', () => {
        this.showReaderSidebar = !this.showReaderSidebar;
        sidebarEl.classList.toggle('open', this.showReaderSidebar);
        btnToggleSidebar.style.background = this.showReaderSidebar ? 'rgba(212,160,23,0.25)' : 'transparent';
      });
    }

    const btnCloseSidebar = document.getElementById('btn-close-sidebar');
    if (btnCloseSidebar && sidebarEl) {
      btnCloseSidebar.addEventListener('click', () => {
        this.showReaderSidebar = false;
        sidebarEl.classList.remove('open');
        if (btnToggleSidebar) btnToggleSidebar.style.background = 'transparent';
      });
    }

    // Alternar Drawer de Chat dentro do leitor (Desktop e Celular)
    const toggleChatDrawer = () => {
      this.showReaderChat = !this.showReaderChat;
      const drawer = document.getElementById('reader-chat-drawer');
      if (drawer) {
        drawer.classList.toggle('open', this.showReaderChat);
        if (this.showReaderChat) {
          const msgsBox = document.getElementById('reader-chat-messages-box');
          if (msgsBox) {
            setTimeout(() => { msgsBox.scrollTop = msgsBox.scrollHeight; }, 60);
          }
        }
      }
      const btnChat = document.getElementById('pdf-btn-toggle-chat');
      if (btnChat) btnChat.style.background = this.showReaderChat ? 'rgba(212,160,23,0.25)' : 'rgba(255,255,255,0.06)';
      const btnChatM = document.getElementById('pdf-btn-chat-m');
      if (btnChatM) btnChatM.style.background = this.showReaderChat ? 'rgba(212,160,23,0.35)' : 'rgba(255,255,255,0.06)';
    };

    const btnToggleChat = document.getElementById('pdf-btn-toggle-chat');
    if (btnToggleChat) btnToggleChat.addEventListener('click', toggleChatDrawer);

    const btnChatTopM = document.getElementById('pdf-btn-chat-top-m');
    if (btnChatTopM) btnChatTopM.addEventListener('click', toggleChatDrawer);

    const btnChatM = document.getElementById('pdf-btn-chat-m');
    if (btnChatM) btnChatM.addEventListener('click', toggleChatDrawer);

    const btnCloseReaderChat = document.getElementById('btn-close-reader-chat');
    if (btnCloseReaderChat) {
      btnCloseReaderChat.addEventListener('click', () => {
        this.showReaderChat = false;
        const drawer = document.getElementById('reader-chat-drawer');
        if (drawer) drawer.classList.remove('open');
      });
    }

    // Formulário de envio de mensagem dentro do leitor
    const readerChatForm = document.getElementById('reader-chat-form');
    if (readerChatForm) {
      readerChatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('reader-chat-input-text');
        const text = input ? input.value : '';
        if (!text || !text.trim()) return;
        input.value = '';

        const newMsg = await SupabaseService.sendChatMessage(text, this.user);
        if (newMsg) {
          this.chatMessages.push(newMsg);
          const msgsBox = document.getElementById('reader-chat-messages-box');
          if (msgsBox) {
            const row = document.createElement('div');
            row.className = `reader-chat-msg mine`;
            row.innerHTML = `
              <div class="reader-chat-msg-author">
                <span>${newMsg.userName}</span>
                <span class="reader-chat-msg-time">${newMsg.time}</span>
              </div>
              <div class="reader-chat-msg-text">${newMsg.text}</div>
            `;
            msgsBox.appendChild(row);
            msgsBox.scrollTop = msgsBox.scrollHeight;
          }
        }
      });
    }

    // Se for livro de texto clássico
    const btnInc = document.getElementById('reader-font-inc');
    if (btnInc) {
      btnInc.addEventListener('click', () => {
        this.readerFontSize = Math.min(26, this.readerFontSize + 2);
        const content = document.querySelector('.reader-content');
        if (content) content.style.fontSize = this.readerFontSize + 'px';
      });
    }

    const btnDec = document.getElementById('reader-font-dec');
    if (btnDec) {
      btnDec.addEventListener('click', () => {
        this.readerFontSize = Math.max(14, this.readerFontSize - 2);
        const content = document.querySelector('.reader-content');
        if (content) content.style.fontSize = this.readerFontSize + 'px';
      });
    }

    document.querySelectorAll('.reader-chapter-item').forEach(ch => {
      ch.addEventListener('click', () => {
        this.activeReaderChapter = parseInt(ch.dataset.idx, 10);
        this._render();
        this._bindReaderControls();
      });
    });

    // Se for PDF (Acervo do Supabase)
    if (this.activeReaderBook && this.activeReaderBook.pdfUrl) {
      this._initPdfControls();
      this._initPdfViewer();
    }
  }

  /* ---- CONTROLES DO LEITOR DE PDF (VIRADA DE PÁGINA, ROTAÇÃO 90°, ZOOM) ---- */
  _initPdfControls() {
    // 1. Virar Página Anterior (Desktop e Celular)
    const prevPage = () => {
      if (this.pdfPageNum > 1) {
        this.pdfPageNum--;
        this._queueRenderPage(this.pdfPageNum);
      }
    };
    const btnPrev = document.getElementById('pdf-btn-prev');
    if (btnPrev) btnPrev.addEventListener('click', prevPage);

    const btnPrevM = document.getElementById('pdf-btn-prev-m');
    if (btnPrevM) btnPrevM.addEventListener('click', prevPage);

    // 2. Virar Próxima Página (Desktop e Celular)
    const nextPage = () => {
      if (this.pdfPageNum < this.pdfTotalPages) {
        this.pdfPageNum++;
        this._queueRenderPage(this.pdfPageNum);
      }
    };
    const btnNext = document.getElementById('pdf-btn-next');
    if (btnNext) btnNext.addEventListener('click', nextPage);

    const btnNextM = document.getElementById('pdf-btn-next-m');
    if (btnNextM) btnNextM.addEventListener('click', nextPage);

    // 3. Input de salto direto de página (Desktop)
    const inputPage = document.getElementById('pdf-input-page');
    if (inputPage) {
      const handleJump = () => {
        let val = parseInt(inputPage.value, 10);
        if (isNaN(val)) val = 1;
        val = Math.max(1, Math.min(this.pdfTotalPages || 1, val));
        this.pdfPageNum = val;
        this._queueRenderPage(this.pdfPageNum);
      };
      inputPage.addEventListener('change', handleJump);
      inputPage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleJump();
        }
      });
    }

    // 4. ROTAÇÃO DE PÁGINAS (90° no sentido horário: 0° -> 90° -> 180° -> 270° -> 0°)
    const rotatePage = () => {
      this.pdfRotation = (this.pdfRotation + 90) % 360;
      const b1 = document.getElementById('pdf-rot-badge');
      if (b1) b1.textContent = `${this.pdfRotation}°`;
      const b2 = document.getElementById('pdf-rot-badge-m');
      if (b2) b2.textContent = `${this.pdfRotation}°`;
      this._queueRenderPage(this.pdfPageNum);
    };
    const btnRotate = document.getElementById('pdf-btn-rotate');
    if (btnRotate) btnRotate.addEventListener('click', rotatePage);

    const btnRotateM = document.getElementById('pdf-btn-rotate-m');
    if (btnRotateM) btnRotateM.addEventListener('click', rotatePage);

    const btnRotateTopM = document.getElementById('pdf-btn-rotate-top-m');
    if (btnRotateTopM) btnRotateTopM.addEventListener('click', rotatePage);

    // 5. Zoom Desktop (In / Out / 100%)
    const btnZoomIn = document.getElementById('pdf-btn-zoom-in');
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        this.pdfScale = Math.min(3.0, +(this.pdfScale + 0.2).toFixed(2));
        this._updateZoomBadge();
        this._queueRenderPage(this.pdfPageNum);
      });
    }

    const btnZoomOut = document.getElementById('pdf-btn-zoom-out');
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        this.pdfScale = Math.max(0.6, +(this.pdfScale - 0.2).toFixed(2));
        this._updateZoomBadge();
        this._queueRenderPage(this.pdfPageNum);
      });
    }

    const btnZoomFit = document.getElementById('pdf-btn-zoom-fit');
    if (btnZoomFit) {
      btnZoomFit.addEventListener('click', () => {
        this.pdfScale = 1.25;
        this._updateZoomBadge();
        this._queueRenderPage(this.pdfPageNum);
      });
    }

    // Zoom Celular
    const btnZoomInM = document.getElementById('pdf-btn-zoom-in-m');
    if (btnZoomInM) {
      btnZoomInM.addEventListener('click', () => {
        this.pdfMobileZoom = Math.min(2.5, +( (this.pdfMobileZoom || 1.0) + 0.25 ).toFixed(2));
        this._queueRenderPage(this.pdfPageNum);
      });
    }

    const btnZoomOutM = document.getElementById('pdf-btn-zoom-out-m');
    if (btnZoomOutM) {
      btnZoomOutM.addEventListener('click', () => {
        this.pdfMobileZoom = Math.max(0.75, +( (this.pdfMobileZoom || 1.0) - 0.25 ).toFixed(2));
        this._queueRenderPage(this.pdfPageNum);
      });
    }

    // 6. Atalhos de Teclado
    if (this.pdfKeyHandler) {
      window.removeEventListener('keydown', this.pdfKeyHandler);
    }
    this.pdfKeyHandler = (e) => {
      if (!this.activeReaderBook) return;
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        rotatePage();
      } else if (e.key === 'Escape') {
        const closeBtn = document.getElementById('reader-close') || document.getElementById('reader-close-m');
        if (closeBtn) closeBtn.click();
      }
    };
    window.addEventListener('keydown', this.pdfKeyHandler);

    // 7. Redimensionamento de Tela (Auto-ajuste quando o usuário gira o celular)
    if (!this._resizeBound) {
      this._resizeBound = true;
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        if (!this.activeReaderBook || !this.pdfDoc) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this._queueRenderPage(this.pdfPageNum);
        }, 200);
      });
    }
  }

  _updateZoomBadge() {
    const badge = document.getElementById('pdf-zoom-val');
    if (badge) badge.textContent = `${Math.round(this.pdfScale * 100)}%`;
  }

  /* ---- INICIALIZAÇÃO DA RENDERIZAÇÃO DO PDF.JS ---- */
  async _initPdfViewer() {
    const canvas = document.getElementById('pdf-render-canvas');
    const loading = document.getElementById('pdf-loading-indicator');
    const errorEl = document.getElementById('pdf-error-indicator');
    const totalEl = document.getElementById('pdf-total-pages');
    const totalElM = document.getElementById('pdf-mobile-page-total');
    const inputPage = document.getElementById('pdf-input-page');

    if (!canvas || !this.activeReaderBook) return;

    if (loading) loading.style.display = 'flex';
    if (errorEl) errorEl.style.display = 'none';
    canvas.style.display = 'none';

    try {
      if (!window.pdfjsLib) {
        throw new Error('PDF.js não disponível');
      }

      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const loadingTask = window.pdfjsLib.getDocument({
        url: this.activeReaderBook.pdfUrl,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
        enableXfa: true
      });

      this.pdfDoc = await loadingTask.promise;
      this.pdfTotalPages = this.pdfDoc.numPages;
      this.pdfPageNum = 1;
      this.pdfRotation = 0;

      if (totalEl) totalEl.textContent = this.pdfTotalPages;
      if (totalElM) totalElM.textContent = this.pdfTotalPages;
      if (inputPage) {
        inputPage.max = this.pdfTotalPages;
        inputPage.value = 1;
      }

      if (loading) loading.style.display = 'none';
      canvas.style.display = 'block';

      this._renderPdfPage(this.pdfPageNum);
    } catch (err) {
      console.warn('Leitor direto via Canvas avisou:', err.message);
      if (loading) loading.style.display = 'none';
      if (errorEl) errorEl.style.display = 'block';
    }
  }

  async _renderPdfPage(num) {
    if (!this.pdfDoc) return;
    this.pdfRendering = true;

    const canvas = document.getElementById('pdf-render-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.pdfRenderTask) {
      try { this.pdfRenderTask.cancel(); } catch (e) {}
    }

    try {
      const page = await this.pdfDoc.getPage(num);

      // No celular (< 860px), dimensiona perfeitamente para a largura da tela
      const isMobile = window.innerWidth <= 860;
      let activeScale = this.pdfScale;

      if (isMobile) {
        const unscaledViewport = page.getViewport({ scale: 1.0, rotation: this.pdfRotation });
        const availableWidth = Math.max(280, window.innerWidth - 16);
        const fitScale = availableWidth / unscaledViewport.width;
        activeScale = fitScale * (this.pdfMobileZoom || 1.0);
      }

      const viewport = page.getViewport({ scale: activeScale, rotation: this.pdfRotation });

      // Suporte para retina display (limitado a 2.5 para alta performance)
      const outputScale = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + 'px';
      canvas.style.height = Math.floor(viewport.height) + 'px';

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      const renderContext = {
        canvasContext: ctx,
        transform: transform,
        viewport: viewport
      };

      this.pdfRenderTask = page.render(renderContext);
      await this.pdfRenderTask.promise;
      this.pdfRendering = false;

      if (this.pdfPagePending !== null) {
        const pending = this.pdfPagePending;
        this.pdfPagePending = null;
        this._renderPdfPage(pending);
      }
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.warn('Erro ao renderizar página:', err);
      }
      this.pdfRendering = false;
    }

    // Sincroniza controles (Desktop e Celular)
    const inputPage = document.getElementById('pdf-input-page');
    if (inputPage) inputPage.value = num;

    const mobilePageNum = document.getElementById('pdf-mobile-page-num');
    if (mobilePageNum) mobilePageNum.textContent = num;

    const mobilePageTotal = document.getElementById('pdf-mobile-page-total');
    if (mobilePageTotal) mobilePageTotal.textContent = this.pdfTotalPages || 1;

    const btnPrev = document.getElementById('pdf-btn-prev');
    if (btnPrev) btnPrev.style.opacity = (num <= 1) ? '0.4' : '1';

    const btnPrevM = document.getElementById('pdf-btn-prev-m');
    if (btnPrevM) btnPrevM.style.opacity = (num <= 1) ? '0.4' : '1';

    const btnNext = document.getElementById('pdf-btn-next');
    if (btnNext) btnNext.style.opacity = (num >= this.pdfTotalPages) ? '0.4' : '1';

    const btnNextM = document.getElementById('pdf-btn-next-m');
    if (btnNextM) btnNextM.style.opacity = (num >= this.pdfTotalPages) ? '0.4' : '1';

    const rotBadge = document.getElementById('pdf-rot-badge');
    if (rotBadge) rotBadge.textContent = `${this.pdfRotation}°`;

    const rotBadgeM = document.getElementById('pdf-rot-badge-m');
    if (rotBadgeM) rotBadgeM.textContent = `${this.pdfRotation}°`;
  }

  _queueRenderPage(num) {
    if (this.pdfRendering) {
      this.pdfPagePending = num;
    } else {
      this._renderPdfPage(num);
    }
  }
}
