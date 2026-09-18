import { Router }             from './router.js?v=2.2';
import { HomePage }           from './pages/HomePage.js?v=2.2';
import { LandingEbookPage }   from './pages/LandingEbookPage.js?v=2.2';
import { QuimbandaSalesPage } from './pages/QuimbandaSalesPage.js?v=2.2';
import { GoetiaSalesPage }    from './pages/GoetiaSalesPage.js?v=2.2';
import { BibliotecaPage }     from './pages/BibliotecaPage.js?v=2.2';
import { LinkBioPage }        from './pages/LinkBioPage.js?v=2.2';
import { EbooksPage }         from './pages/EbooksPage.js?v=2.2';
import { AtendimentosPage }   from './pages/AtendimentosPage.js?v=2.2';
import { SobrePage }          from './pages/SobrePage.js?v=2.2';
import { ObrigadoPage }       from './pages/ObrigadoPage.js?v=2.2';

const loader = document.getElementById('loader');

const router = new Router({
  '/':                                     HomePage,
  '/home':                                 HomePage,
  '/ebooks':                               EbooksPage,
  '/biblioteca':                           BibliotecaPage,
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
