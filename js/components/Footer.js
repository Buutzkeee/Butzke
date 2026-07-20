/* ===============================
   Footer Component
   =============================== */
export class Footer {
  static render() {
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="/" class="footer-logo">BUUTZKE</a>
            <p>O oculto sem fantasias. Quimbanda, Exu e espiritualidade real.</p>
            <div class="footer-brand-btns">
              <a href="https://www.instagram.com/buutzke/" target="_blank"
                 class="btn btn-outline" style="padding:8px 16px;font-size:.8rem" id="footer-ig">@buutzke</a>
              <a href="https://wa.me/5551992395284" target="_blank"
                 class="btn btn-primary" style="padding:8px 16px;font-size:.8rem" id="footer-wa">WhatsApp</a>
            </div>
          </div>

          <div class="footer-col">
            <h5>Navegação</h5>
            <ul>
              <li><a href="/" id="fl-home">Home</a></li>
              <li><a href="/ebooks" id="fl-ebooks">eBooks</a></li>
              <li><a href="/atendimentos" id="fl-atend">Atendimentos</a></li>
              <li><a href="/sobre" id="fl-sobre">Sobre</a></li>
              <li><a href="/linkbio" id="fl-linkbio">Link Bio</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h5>Legal</h5>
            <ul>
              <li><a href="https://buutzkez.lovable.app/politica-de-privacidade" target="_blank" id="fl-privacy">Política de Privacidade</a></li>
              <li><a href="https://buutzkez.lovable.app/termos-de-uso" target="_blank" id="fl-terms">Termos de Uso</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 Buutzke. Todos os direitos reservados.</p>
          <p>Feito com fé e fundamento. ✦</p>
        </div>

        <p class="footer-disclaimer">
          Este produto não substitui acompanhamento médico, psicológico ou jurídico.
          Resultados podem variar de acordo com o comprometimento de cada praticante.
        </p>
      </div>
    </footer>`;
  }
}
