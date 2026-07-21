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

const start = () => {
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => router.start(), 400);
  }, 900);
};

if (document.readyState === 'complete') {
  start();
} else {
  window.addEventListener('load', start);
}
