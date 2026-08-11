import { Router }             from './router.js';
import { HomePage }           from './pages/HomePage.js';
import { LandingEbookPage }   from './pages/LandingEbookPage.js';
import { QuimbandaSalesPage } from './pages/QuimbandaSalesPage.js';
import { LinkBioPage }        from './pages/LinkBioPage.js';
import { EbooksPage }         from './pages/EbooksPage.js';
import { AtendimentosPage }   from './pages/AtendimentosPage.js';
import { SobrePage }          from './pages/SobrePage.js';
import { ObrigadoPage }       from './pages/ObrigadoPage.js';

const loader = document.getElementById('loader');

const router = new Router({
  '/':                                     HomePage,
  '/home':                                 HomePage,
  '/ebooks':                               EbooksPage,
  '/ebook/quimbanda-o-caminho-da-forca':   QuimbandaSalesPage,
  '/ebook/:slug':                          LandingEbookPage,
  '/atendimentos':                         AtendimentosPage,
  '/sobre':                                SobrePage,
  '/linkbio':                              LinkBioPage,
  '/obrigado':                             ObrigadoPage,
});

let started = false;
const start = () => {
  if (started) return;
  started = true;
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 400);
  }
  router.start();
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  start();
} else {
  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener('load', start);
  // Fallback de segurança (máximo 800ms) caso a rede trave algum asset
  setTimeout(start, 800);
}
