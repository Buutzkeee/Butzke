/* =====================================================
   BUUTZKE — Supabase Integration Service 2.0
   Autenticação Direta, Painel Administrativo,
   Gestão de Membros & Acervo Exclusivo (Zero Kirvano)
   ===================================================== */

export const SUPABASE_CONFIG = {
  // Chave pública informada pelo proprietário
  publishableKey: 'sb_publishable_6E5m6roVs0iOZRJCvMznXg_cLAHDYe-',

  // URL do Projeto Supabase Oficial
  defaultUrl: 'https://yxgzqxfstbhfbevwjqgd.supabase.co',

  get url() {
    let saved = localStorage.getItem('buutzke_supabase_url');
    if (saved) {
      saved = saved.trim();
      // Se for URL de S3 ou Storage, limpa imediatamente porque o endpoint S3 responde em XML e quebra o Auth
      if (saved.includes('storage.supabase.co') || saved.includes('/s3')) {
        localStorage.removeItem('buutzke_supabase_url');
        saved = null;
      }
    }
    return saved || this.defaultUrl;
  },
  set url(val) {
    if (val && !val.includes('storage.supabase.co') && !val.includes('/s3')) {
      localStorage.setItem('buutzke_supabase_url', val.trim());
    } else {
      localStorage.removeItem('buutzke_supabase_url');
    }
  }
};

class SupabaseServiceClass {
  constructor() {
    this.client = null;
    this.currentUser = null;
    this.initClient();
    this.loadCachedUser();
  }

  initClient() {
    let url = SUPABASE_CONFIG.url;
    if (url.includes('storage.supabase.co') || url.includes('/s3')) {
      localStorage.removeItem('buutzke_supabase_url');
      url = SUPABASE_CONFIG.defaultUrl;
    }
    const key = SUPABASE_CONFIG.publishableKey;

    if (window.supabase && url && url.startsWith('http')) {
      try {
        this.client = window.supabase.createClient(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
        console.log('✦ Supabase inicializado:', url);
      } catch (e) {
        console.warn('Erro ao inicializar Supabase client:', e);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  loadCachedUser() {
    try {
      const saved = localStorage.getItem('buutzke_member_user');
      if (saved) {
        this.currentUser = JSON.parse(saved);
        if (this.currentUser) {
          const isGabriel = (this.currentUser.email || '').trim().toLowerCase() === 'gabriel.tsanjos@gmail.com';
          if (isGabriel) {
            this.currentUser.role = 'admin';
            this.currentUser.plan = 'Administrador Mestre';
          } else {
            this.currentUser.role = 'member';
            if (this.currentUser.plan === 'Administrador Mestre') {
              this.currentUser.plan = 'Membro Ativo';
            }
          }
        }
      }
    } catch (e) {
      this.currentUser = null;
    }
  }

  saveCachedUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('buutzke_member_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('buutzke_member_user');
    }
  }

  isConfigured() {
    return Boolean(this.client && SUPABASE_CONFIG.url);
  }

  setProjectUrl(newUrl) {
    SUPABASE_CONFIG.url = newUrl;
    this.initClient();
  }

  async testConnection() {
    if (!this.client) {
      return { success: false, message: 'URL do Supabase não configurada ou inválida.' };
    }
    try {
      // Tenta um ping no auth
      const { data, error } = await this.client.auth.getSession();
      if (error) throw error;
      return { success: true, message: 'Conexão ativa com o Supabase!' };
    } catch (err) {
      return { success: false, message: 'Falha ao conectar: ' + err.message };
    }
  }

  // =====================================================
  // AUTENTICAÇÃO REAL COM O SUPABASE
  // =====================================================

  async signIn(email, password) {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Validação direta e real via Supabase Auth
    if (this.client) {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: trimmedEmail,
        password: cleanPassword
      });

      if (error) {
        console.error('Supabase Auth error:', error.message);
        throw new Error(this._translateAuthError(error.message));
      }

      if (!data?.user) {
        throw new Error('Usuário não encontrado no Supabase.');
      }

      const meta = data.user.user_metadata || {};
      const status = meta.status || 'ativo';

      if (status === 'bloqueado' || status === 'inativo') {
        throw new Error('Sua assinatura está suspensa ou inativa. Fale com o suporte.');
      }

      // EXCLUSIVIDADE: Somente gabriel.tsanjos@gmail.com pode ser Administrador
      const isAdminUser = trimmedEmail === 'gabriel.tsanjos@gmail.com';

      const memberUser = {
        id: data.user.id,
        email: data.user.email,
        name: meta.full_name || (isAdminUser ? 'Gabriel (Administrador Buutzke)' : trimmedEmail.split('@')[0]),
        role: isAdminUser ? 'admin' : 'member',
        plan: isAdminUser ? 'Administrador Mestre' : (meta.plan || 'Membro Ativo'),
        status: status,
        avatar: '🔱',
        joinedAt: new Date(data.user.created_at || Date.now()).toLocaleDateString('pt-BR')
      };

      this.saveCachedUser(memberUser);
      return { success: true, user: memberUser };
    }

    // 3. Verificação nos Membros Criados pelo Admin (com checagem de expiração)
    const localMembers = await this.getCreatedMembersList();
    const found = localMembers.find(m => m.email.toLowerCase() === trimmedEmail && m.password === cleanPassword);

    if (found) {
      if (found.status === 'bloqueado') {
        throw new Error('Seu acesso está bloqueado pelo administrador.');
      }
      if (found.isExpired && trimmedEmail !== 'gabriel.tsanjos@gmail.com') {
        throw new Error(`Sua assinatura expirou em ${found.expiresAtFormatted}. Para reativar seu acesso, renove pelo link: https://pay.kirvano.com/45e4e673-3e4e-4ec6-8d24-19717ab0aa0b`);
      }
      const memberUser = {
        id: found.id,
        email: found.email,
        name: found.name,
        role: trimmedEmail === 'gabriel.tsanjos@gmail.com' ? 'admin' : (found.role || 'member'),
        plan: found.plan || 'Membro Ativo',
        status: found.status || 'ativo',
        avatar: '🔱',
        joinedAt: found.createdAt
      };
      this.saveCachedUser(memberUser);
      return { success: true, user: memberUser };
    }

    // Se o Supabase não estiver conectado
    if (!this.client) {
      throw new Error('A URL do seu projeto Supabase (https://xxxx.supabase.co) ainda não foi inserida no sistema. Cole-a no campo abaixo para conectar.');
    }

    throw new Error('E-mail ou senha incorretos. Verifique suas credenciais.');
  }

  async signOut() {
    if (this.client) {
      try {
        await this.client.auth.signOut();
      } catch (e) {}
    }
    this.saveCachedUser(null);
    return { success: true };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAdmin() {
    return Boolean(
      this.currentUser && 
      this.currentUser.email && 
      this.currentUser.email.toLowerCase() === 'gabriel.tsanjos@gmail.com'
    );
  }

  // =====================================================
  // GESTÃO DE USUÁRIOS / CLIENTES PELO ADMIN COM EXPIRAÇÃO
  // =====================================================

  _enrichMemberExpiration(m) {
    if (m.plan === 'Acesso Vitalício' || m.expiresAt === 'vitalicio' || m.expires_at === 'vitalicio') {
      return {
        ...m,
        daysRemaining: 9999,
        isExpired: false,
        isExpiringSoon: false,
        expiresAtFormatted: '♾️ Vitalício',
        status: m.status === 'bloqueado' ? 'bloqueado' : 'ativo'
      };
    }

    let expDate = null;
    if (m.expiresAt && m.expiresAt !== 'vitalicio') {
      expDate = new Date(m.expiresAt);
    } else if (m.expires_at && m.expires_at !== 'vitalicio') {
      expDate = new Date(m.expires_at);
    } else if (m.createdAt || m.created_at) {
      const created = new Date(m.createdAt || m.created_at);
      const days = (m.plan && m.plan.includes('Anual')) ? 365 : 30;
      expDate = new Date(created.getTime() + days * 24 * 60 * 60 * 1000);
    } else {
      expDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    let daysRemaining = 0;
    let isExpired = false;
    let isExpiringSoon = false;

    if (expDate && !isNaN(expDate.getTime())) {
      const diffMs = expDate.getTime() - Date.now();
      daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      isExpired = daysRemaining < 0;
      isExpiringSoon = daysRemaining >= 0 && daysRemaining <= 5;
    }

    let status = m.status || 'ativo';
    if (status !== 'bloqueado') {
      if (isExpired) status = 'expirado';
      else if (isExpiringSoon) status = 'expirando';
      else status = 'ativo';
    }

    return {
      ...m,
      expiresAt: expDate ? expDate.toISOString().split('T')[0] : null,
      expiresAtFormatted: expDate ? expDate.toLocaleDateString('pt-BR') : 'Sem data',
      daysRemaining,
      isExpired,
      isExpiringSoon,
      status
    };
  }

  async getCreatedMembersList() {
    let members = [];
    let synced = false;

    // 1. Tenta buscar da tabela 'membros' no Supabase
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('membros')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          members = data.map(row => ({
            id: row.id,
            name: row.name || row.full_name || 'Iniciado',
            email: row.email,
            password: row.password || 'membrobuutzke',
            plan: row.plan || 'Assinatura Mensal',
            status: row.status || 'ativo',
            createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
            expiresAt: row.expires_at ? new Date(row.expires_at).toISOString().split('T')[0] : null
          }));
          synced = true;
          localStorage.setItem('buutzke_admin_members', JSON.stringify(members));
        }
      } catch (err) {}
    }

    // 2. Se não veio do Supabase, usa o cache local
    if (!synced) {
      try {
        const list = localStorage.getItem('buutzke_admin_members');
        if (list) members = JSON.parse(list);
      } catch (e) {}
    }

    // Se estiver vazio, inicializa com exemplos práticos
    if (!members || members.length === 0) {
      const now = Date.now();
      const initial = [
        {
          id: 'mbr_01',
          name: 'Rafael Guimarães',
          email: 'rafael.oculto@gmail.com',
          password: 'membrobuutzke',
          plan: 'Passe Anual',
          status: 'ativo',
          createdAt: new Date(now - 10 * 86400000).toLocaleDateString('pt-BR'),
          expiresAt: new Date(now + 355 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'mbr_02',
          name: 'Camila Alvarenga',
          email: 'camila.alvarenga@yahoo.com',
          password: 'membrobuutzke',
          plan: 'Assinatura Mensal',
          status: 'expirando',
          createdAt: new Date(now - 26 * 86400000).toLocaleDateString('pt-BR'),
          expiresAt: new Date(now + 4 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'mbr_03',
          name: 'Marcos Vinícius',
          email: 'marcos.vinicius@gmail.com',
          password: 'membrobuutzke',
          plan: 'Assinatura Mensal',
          status: 'expirado',
          createdAt: new Date(now - 35 * 86400000).toLocaleDateString('pt-BR'),
          expiresAt: new Date(now - 5 * 86400000).toISOString().split('T')[0]
        }
      ];
      members = initial;
      localStorage.setItem('buutzke_admin_members', JSON.stringify(initial));
    }

    return members.map(m => this._enrichMemberExpiration(m));
  }

  async adminCreateMember({ name, email, password, plan = 'Assinatura Mensal', customDays = null }) {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    let days = 30;
    if (plan === 'Passe Anual') days = 365;
    else if (plan === 'Acesso Trimestral') days = 90;
    else if (plan === 'Acesso Vitalício') days = null;

    if (customDays && !isNaN(parseInt(customDays, 10))) {
      days = parseInt(customDays, 10);
    }

    const expiresAt = days ? new Date(Date.now() + days * 86400000).toISOString() : 'vitalicio';

    // 1. Tenta criar diretamente no Supabase Auth
    let supabaseUserId = null;
    if (this.client) {
      try {
        const { data } = await this.client.auth.signUp({
          email: trimmedEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: name,
              plan: plan,
              role: 'member',
              status: 'ativo',
              expires_at: expiresAt
            }
          }
        });
        if (data?.user) supabaseUserId = data.user.id;
      } catch (err) {}

      // Tenta gravar na tabela 'membros' do Supabase
      try {
        await this.client.from('membros').insert([{
          name: name.trim(),
          email: trimmedEmail,
          password: cleanPassword,
          plan: plan,
          status: 'ativo',
          created_at: new Date().toISOString(),
          expires_at: expiresAt === 'vitalicio' ? null : expiresAt
        }]);
      } catch (tableErr) {}
    }

    // 2. Persiste na lista do painel do Admin
    let members = await this.getCreatedMembersList();
    const newMember = {
      id: supabaseUserId || 'mbr_' + Date.now(),
      name: name.trim(),
      email: trimmedEmail,
      password: cleanPassword,
      plan: plan,
      status: 'ativo',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      expiresAt: expiresAt === 'vitalicio' ? 'vitalicio' : expiresAt.split('T')[0]
    };

    members.unshift(newMember);
    localStorage.setItem('buutzke_admin_members', JSON.stringify(members));

    return this._enrichMemberExpiration(newMember);
  }

  async adminRenewMember(memberId, additionalDays = 30) {
    let members = await this.getCreatedMembersList();
    const target = members.find(m => m.id === memberId);
    if (!target) return null;

    let base = Date.now();
    if (target.expiresAt && target.expiresAt !== 'vitalicio') {
      const cur = new Date(target.expiresAt).getTime();
      if (cur > base) base = cur;
    }

    const newExp = new Date(base + additionalDays * 86400000);
    target.expiresAt = newExp.toISOString().split('T')[0];
    target.status = 'ativo';

    localStorage.setItem('buutzke_admin_members', JSON.stringify(members));

    if (this.client) {
      try {
        await this.client
          .from('membros')
          .update({
            expires_at: newExp.toISOString(),
            status: 'ativo'
          })
          .eq('email', target.email);
      } catch (e) {}
    }

    return this._enrichMemberExpiration(target);
  }

  async adminToggleMemberStatus(memberId) {
    let members = await this.getCreatedMembersList();
    const target = members.find(m => m.id === memberId);
    if (!target) return null;

    target.status = target.status === 'ativo' ? 'bloqueado' : 'ativo';
    localStorage.setItem('buutzke_admin_members', JSON.stringify(members));

    if (this.client) {
      try {
        await this.client
          .from('membros')
          .update({ status: target.status })
          .eq('email', target.email);
      } catch (e) {}
    }

    return this._enrichMemberExpiration(target);
  }

  async adminDeleteMember(memberId) {
    let members = await this.getCreatedMembersList();
    const target = members.find(m => m.id === memberId);
    members = members.filter(m => m.id !== memberId);
    localStorage.setItem('buutzke_admin_members', JSON.stringify(members));

    if (this.client && target) {
      try {
        await this.client
          .from('membros')
          .delete()
          .eq('email', target.email);
      } catch (e) {}
    }

    return true;
  }

  // =====================================================
  // REPOSITÓRIO EXCLUSIVO SUPABASE (BUCKET STORAGE)
  // ZERO EBOOKS COMERCIAIS DA KIRVANO
  // =====================================================

  getStorageBucketName() {
    return localStorage.getItem('buutzke_storage_bucket') || 'Ebooks';
  }

  setStorageBucketName(name) {
    if (name) localStorage.setItem('buutzke_storage_bucket', name.trim());
  }

  async getRepositoryBooks() {
    const bucketName = this.getStorageBucketName();
    let books = [];

    // 1. Tenta buscar os arquivos direto do Bucket no Supabase Storage
    if (this.client) {
      try {
        const bucketsToTry = [bucketName, 'Ebooks', 'ebooks', 'livros', 'acervo'];
        const uniqueBuckets = [...new Set(bucketsToTry)];

        for (const b of uniqueBuckets) {
          const { data, error } = await this.client.storage.from(b).list('', {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

          if (!error && data && data.length > 0) {
            let allFiles = [];

            for (const item of data) {
              if (!item.name || item.name.startsWith('.')) continue;

              // Se for uma pasta, busca arquivos dentro dela
              if (item.id === null || !item.name.includes('.')) {
                try {
                  const { data: subData } = await this.client.storage.from(b).list(item.name, { limit: 100 });
                  if (subData) {
                    subData.forEach(sf => {
                      if (sf.name && !sf.name.startsWith('.')) {
                        allFiles.push({ ...sf, name: `${item.name}/${sf.name}`, folder: item.name });
                      }
                    });
                  }
                } catch (subErr) {}
              } else {
                allFiles.push(item);
              }
            }

            if (allFiles.length > 0) {
              books = allFiles
                .filter(file => !this._isCommercialEbook(file.name))
                .map((file, idx) => {
                const { data: pubData } = this.client.storage.from(b).getPublicUrl(file.name);
                const publicUrl = pubData?.publicUrl || `${SUPABASE_CONFIG.url}/storage/v1/object/public/${b}/${encodeURIComponent(file.name)}`;
                const cleanTitle = this._formatBookTitle(file.name.split('/').pop() || file.name);
                const sizeMb = file.metadata?.size ? (file.metadata.size / 1024 / 1024).toFixed(1) + ' MB' : '';

                return {
                  id: 'supabase_bucket_' + (file.id || idx),
                  title: cleanTitle,
                  subtitle: `Acervo Supabase (${b}) ${sizeMb ? '• ' + sizeMb : ''}`,
                  category: this._guessCategory(cleanTitle),
                  pages: file.metadata?.mimetype === 'application/pdf' || file.name.endsWith('.pdf') ? 'PDF Oficial' : 'Manuscrito Digital',
                  cover: this._matchCover(cleanTitle),
                  badge: 'Supabase Storage',
                  pdfUrl: publicUrl,
                  fileName: file.name,
                  bucket: b,
                  description: `Livro sagrado disponível no repositório digital de membros. Clique em "Ler Online" para acessar com leitor interativo de páginas e rotação.`,
                  chapters: [
                    {
                      title: cleanTitle,
                      preview: `Arquivo oficial: ${cleanTitle}. Abra no leitor para estudar o conteúdo completo.`
                    }
                  ]
                };
              });

              localStorage.setItem('buutzke_cached_bucket_books', JSON.stringify(books));
              return books;
            }
          }
        }
      } catch (err) {
        console.warn('Erro ao consultar Supabase Storage bucket:', err);
      }
    }

    // 2. Livros customizados adicionados pelo Admin no painel
    const customBooks = this.getCustomAdminBooks();
    if (customBooks.length > 0) {
      return customBooks.filter(b => !this._isCommercialEbook(b.title));
    }

    // 3. Fallback inteligente com os títulos reais do acervo (sem ebooks de venda externa)
    const defaultBucketFiles = [
      { name: 'angel_sigils_hq.pdf', file: 'angel-sigils-hq.pdf' },
      { name: 'magia_pratica_franz_bardon.pdf', file: '3548Magia-Pratica.pdf' },
      { name: 'o_livro_negro_de_satan.pdf', file: '145673548-livro-negro-de-satan-pdf.pdf' },
      { name: 'grimorio_pantacular.pdf', file: '450407869-Grimorio-Pantacular.pdf' },
      { name: 'as_claviculas_de_salomao.pdf', file: 'as-claviculas-de-salomao-a-arte-da-goetia.pdf' }
    ];

    return defaultBucketFiles.map((item, idx) => {
      const cleanTitle = this._formatBookTitle(item.name);
      const publicUrl = `${SUPABASE_CONFIG.url}/storage/v1/object/public/${bucketName}/${encodeURIComponent(item.file)}`;

      return {
        id: 'supabase_ebook_' + idx,
        title: cleanTitle,
        subtitle: `Repositório Supabase (Bucket ${bucketName})`,
        category: this._guessCategory(cleanTitle),
        pages: 'PDF Digital',
        cover: this._matchCover(cleanTitle),
        badge: 'Supabase Storage',
        pdfUrl: publicUrl,
        fileName: item.file,
        bucket: bucketName,
        description: `Manuscrito do repositório digital de membros. Clique em "Ler / Visualizar" para abrir o leitor.`,
        chapters: [
          {
            title: cleanTitle,
            preview: `Arquivo oficial: ${cleanTitle}. Clique no botão abaixo para abrir o documento do Supabase.`
          }
        ]
      };
    });
  }

  getCustomAdminBooks() {
    try {
      const list = localStorage.getItem('buutzke_admin_books');
      if (list) return JSON.parse(list);
    } catch (e) {}
    return [];
  }

  async adminAddBook(bookData) {
    const newBook = {
      id: 'book_' + Date.now(),
      title: bookData.title.trim(),
      subtitle: bookData.subtitle?.trim() || 'Manuscrito Exclusivo de Membros',
      category: bookData.category || 'Manuscritos Ocultos',
      pages: parseInt(bookData.pages, 10) || 50,
      cover: bookData.cover || '/assets/ebook-cover.jpg',
      badge: 'Acervo Supabase',
      pdfUrl: bookData.pdfUrl?.trim() || '',
      description: bookData.description.trim(),
      chapters: [
        {
          title: 'Abertura do Manuscrito',
          preview: bookData.description || 'Documento do repositório Supabase.'
        }
      ]
    };

    if (this.client) {
      try {
        await this.client.from('livros').insert([{
          title: newBook.title,
          subtitle: newBook.subtitle,
          category: newBook.category,
          pages: newBook.pages,
          cover: newBook.cover,
          pdf_url: newBook.pdfUrl,
          description: newBook.description
        }]);
      } catch (e) {}
    }

    const books = this.getCustomAdminBooks();
    books.unshift(newBook);
    localStorage.setItem('buutzke_admin_books', JSON.stringify(books));
    return newBook;
  }

  async adminDeleteBook(bookId) {
    let books = this.getCustomAdminBooks();
    books = books.filter(b => b.id !== bookId);
    localStorage.setItem('buutzke_admin_books', JSON.stringify(books));

    let cached = localStorage.getItem('buutzke_cached_bucket_books');
    if (cached) {
      try {
        let list = JSON.parse(cached).filter(b => b.id !== bookId);
        localStorage.setItem('buutzke_cached_bucket_books', JSON.stringify(list));
      } catch (e) {}
    }

    if (this.client) {
      try {
        await this.client.from('livros').delete().eq('id', bookId);
      } catch (e) {}
    }
    return true;
  }

  _formatBookTitle(filename = '') {
    let title = filename
      .replace(/\.pdf$/i, '')
      .replace(/^(pdfcoffee[-_]com[-_]|qdoc[-_]tips[-_])/i, '')
      .replace(/[-_](pdf[-_]free|acervomistico|pdf|compress)$/i, '')
      .replace(/^\d{3,}[\s_-]*/, '')           // remove timestamps ou IDs longos (ex: 1784578804639-, 3548)
      .replace(/[-_]\d{3,}$/, '')              // remove timestamps no final
      .replace(/[-_]eduardo[-_]souza/gi, '')   // remove assinatura de autor repetitiva
      .replace(/[-_]por[-_]robson[-_]belli/gi, '')
      .trim();

    const lower = title.toLowerCase().replace(/[-_]/g, ' ').trim();

    // Mapeamentos específicos refinados
    if (lower.includes('angel') && lower.includes('sigil')) {
      return 'Angel Sigils: Selos e Assinaturas Angélicas';
    }
    if (lower.includes('magia') && lower.includes('pratica')) {
      return 'Magia Prática (Franz Bardon)';
    }
    if (lower.includes('livro') && lower.includes('negro') && lower.includes('satan')) {
      return 'O Livro Negro de Satan';
    }
    if (lower.includes('clavicula')) {
      return 'As Clavículas de Salomão: A Arte da Goetia';
    }
    if (lower.includes('arvore') && lower.includes('vida')) {
      return 'A Árvore da Vida (Israel Regardie)';
    }
    if (lower.includes('espada') && lower.includes('moises')) {
      return 'A Espada de Moisés (Grimório Hebraico)';
    }
    if (lower.includes('evocacao')) {
      return 'A Prática da Evocação Mágica (Franz Bardon)';
    }
    if (lower.includes('goetia') && lower.includes('ilustrada')) {
      return 'A Goetia Ilustrada (Aleister Crowley)';
    }
    if (lower.includes('quimbanda') && lower.includes('forca')) {
      return 'Quimbanda: O Caminho da Força';
    }
    if (lower.includes('ervas') && lower.includes('sagradas')) {
      return 'Grimório das Ervas Sagradas (Edição Completa)';
    }
    if (lower.includes('encruzilhada')) {
      return 'Quimbanda: Caminho da Encruzilhada';
    }
    if (lower.includes('goetia') && lower.includes('soberania')) {
      return 'Goetia: A Arte da Soberania';
    }
    if (lower.includes('eres') || lower.includes('guardioes') || lower.includes('mirins')) {
      return 'Erês: Guardiões Mirins da Umbanda';
    }
    if (lower.includes('sem') && lower.includes('cabeca')) {
      return 'O Ritual do Sem Cabeça (Akephalos)';
    }
    if (lower.includes('misterios') && lower.includes('egipcios')) {
      return 'Os Mistérios Egípcios de Jâmblico';
    }
    if (lower.includes('pacto') && lower.includes('demonio')) {
      return 'Tratado Prático de Pactos Tradicionais';
    }
    if (lower.includes('propriedades') && lower.includes('ocultas')) {
      return 'Propriedades Ocultas das Ervas e Plantas';
    }
    if (lower.includes('qliphotic') || lower.includes('qabalah')) {
      return 'Qabalah Qliphotic & Magia Goetia';
    }

    // Formatador genérico elegante para qualquer outro arquivo
    return title
      .replace(/[-_]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((w, idx) => {
        const l = w.toLowerCase();
        if (idx > 0 && ['da', 'de', 'do', 'das', 'dos', 'e', 'o', 'a', 'em', 'para', 'com', 'por', 'um', 'uma'].includes(l)) {
          return l;
        }
        return l.charAt(0).toUpperCase() + l.slice(1);
      })
      .join(' ');
  }

  _isCommercialEbook(filename = '') {
    const fn = (filename || '').toLowerCase();
    // 1. Quimbanda: O Caminho da Força (Kirvano R$ 39,90)
    if (fn.includes('caminho_da_forca') || fn.includes('caminho-da-forca') || fn.includes('caminho da força')) return true;
    // 2. Goetia: A Arte da Soberania (Kirvano R$ 49,90)
    if (fn.includes('arte-da-soberania') || fn.includes('arte_da_soberania') || fn.includes('arte da soberania')) return true;
    // 3. Grimório das Ervas Sagradas (Kirvano R$ 39,90)
    if (fn.includes('ervas_sagradas') || fn.includes('ervas-sagradas') || fn.includes('grimorio-das-ervas') || fn.includes('ervas sagradas')) return true;
    // 4. Quimbanda: Caminho da Encruzilhada / Segredos das Encruzilhadas (Kirvano R$ 39,90)
    if (fn.includes('caminho-da-encruzilhada') || fn.includes('caminho_da_encruzilhada') || fn.includes('segredos-das-encruzilhadas') || fn.includes('caminho da encruzilhada')) return true;
    // 5. Erês: Guardiões Mirins da Umbanda (Kirvano R$ 19,00)
    if (fn.includes('eres_guardioes_mirins') || fn.includes('eres-guardioes-mirins') || fn.includes('guardioes_mirins') || fn.includes('guardioes-mirins') || (fn.includes('erês') && fn.includes('guardiões'))) return true;

    return false;
  }

  _matchCover(cleanTitle = '') {
    const t = cleanTitle.toLowerCase();
    if (t.includes('quimbanda') && t.includes('força')) return '/assets/img/quimbanda1.jpg';
    if (t.includes('ervas')) return '/assets/img/grimorio_ervas.jpg';
    if (t.includes('encruzilhada')) return '/assets/img/quimbanda2.jpg';
    if (t.includes('goetia')) return '/assets/img/goetia.jpg';
    if (t.includes('erês') || t.includes('eres')) return '/assets/img/eres.jpg';
    return '/assets/ebook-cover.jpg';
  }

  _guessCategory(title = '') {
    const t = title.toLowerCase();
    if (t.includes('quimbanda') || t.includes('exu') || t.includes('tranqueira') || t.includes('pomba')) return 'Quimbanda Sagrada';
    if (t.includes('goetia') || t.includes('daemon') || t.includes('salomao') || t.includes('clavicula')) return 'Alta Magia & Goetia';
    if (t.includes('erva') || t.includes('folha') || t.includes('banho') || t.includes('defuma')) return 'Botânica Oculta';
    return 'Manuscritos Ocultos';
  }

  // =====================================================
  // CHAT DO CÍRCULO DOS MEMBROS (SALVO NO SUPABASE)
  // =====================================================

  async getChatMessages() {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('mensagens')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data) {
          return data.map(m => ({
            id: m.id,
            userName: m.user_name || m.userName || 'Membro do Círculo',
            userRole: m.user_role || m.userRole || 'Membro Ativo',
            avatar: m.avatar || '🔱',
            text: m.text,
            time: m.created_at ? new Date(m.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : (m.time || 'Agora')
          }));
        }
      } catch (err) {
        console.warn('Tentativa de ler mensagens do Supabase avisou:', err.message);
      }
    }

    const local = localStorage.getItem('buutzke_chat_messages');
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }

    const defaultFeed = [
      {
        id: 'msg_initial_1',
        userName: 'Buutzke',
        userRole: 'Mestre & Fundador',
        avatar: '🔱',
        text: 'Bem-vindos ao Repositório e Círculo Sagrado. Todo o diálogo fica salvo no banco de dados do Supabase para nossos estudos e acompanhamento.',
        time: '20:00'
      }
    ];
    localStorage.setItem('buutzke_chat_messages', JSON.stringify(defaultFeed));
    return defaultFeed;
  }

  async sendChatMessage(text, user) {
    if (!text || !text.trim()) return null;

    const payload = {
      user_name: user?.name || 'Membro do Círculo',
      user_role: user?.role === 'admin' ? 'Mestre & Fundador' : (user?.plan || 'Membro Ativo'),
      avatar: user?.avatar || '🔱',
      text: text.trim(),
      created_at: new Date().toISOString()
    };

    let generatedId = 'msg_' + Date.now();

    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('mensagens')
          .insert([payload])
          .select();

        if (!error && data && data.length > 0) {
          generatedId = data[0].id;
        }
      } catch (e) {
        console.warn('Erro ao inserir mensagem na tabela mensagens do Supabase:', e);
      }
    }

    const newMsg = {
      id: generatedId,
      userName: payload.user_name,
      userRole: payload.user_role,
      avatar: payload.avatar,
      text: payload.text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const msgs = await this.getChatMessages();
      msgs.push(newMsg);
      localStorage.setItem('buutzke_chat_messages', JSON.stringify(msgs));
    } catch (e) {}

    return newMsg;
  }

  async deleteChatMessage(messageId) {
    if (this.client) {
      try {
        await this.client
          .from('mensagens')
          .delete()
          .eq('id', messageId);
      } catch (e) {
        console.warn('Erro ao apagar mensagem no Supabase:', e);
      }
    }

    try {
      let msgs = await this.getChatMessages();
      msgs = msgs.filter(m => String(m.id) !== String(messageId));
      localStorage.setItem('buutzke_chat_messages', JSON.stringify(msgs));
    } catch (e) {}

    return true;
  }

  async clearAllChatMessages() {
    if (this.client) {
      try {
        await this.client
          .from('mensagens')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {}
    }
    localStorage.removeItem('buutzke_chat_messages');
    return true;
  }

  _translateAuthError(msg = '') {
    if (msg.includes('Invalid login credentials')) {
      return 'E-mail ou senha incorretos no Supabase.';
    }
    if (msg.includes('Email not confirmed')) {
      return 'E-mail cadastrado, mas ainda não confirmado no Supabase. Desative "Confirm email" no painel do Supabase se quiser liberar acesso imediato.';
    }
    if (msg.includes('User not found')) {
      return 'Usuário não encontrado. Solicite a liberação do seu acesso.';
    }
    return msg;
  }
}

export const SupabaseService = new SupabaseServiceClass();
