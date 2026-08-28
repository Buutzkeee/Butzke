import { Router }             from './router.js';
import { HomePage }           from './pages/HomePage.js';
import { LandingEbookPage }   from './pages/LandingEbookPage.js';
import { QuimbandaSalesPage } from './pages/QuimbandaSalesPage.js';
import { GoetiaSalesPage }    from './pages/GoetiaSalesPage.js';
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
  '/ebook/goetia-a-arte-da-soberania':     GoetiaSalesPage,
  '/goetia':                               GoetiaSalesPage,
  '/ebook/:slug':                          LandingEbookPage,
  '/atendimentos':                         AtendimentosPage,
  '/sobre':                                SobrePage,
  '/linkbio':                              LinkBioPage,
  '/obrigado':                             ObrigadoPage,
});

let started = false;

const hideLoader = () => {
  const l = document.getElementById('loader');
  if (l) {
    l.classList.add('fade-out');
    setTimeout(() => {
      l.style.display = 'none';
      if (l.parentNode) l.parentNode.removeChild(l);
    }, 300);
  }
};

const start = () => {
  if (started) return;
  started = true;
  hideLoader();
  try {
    router.start();
  } catch (err) {
    console.error('Error starting router:', err);
  }
};

// Fallback universal: garante que a tela de loading saia no máximo em 500ms
setTimeout(hideLoader, 500);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  start();
} else {
  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener('load', start);
  setTimeout(start, 400);
}
