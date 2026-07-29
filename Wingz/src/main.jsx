import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Le site simule un défilement horizontal à partir du scroll vertical natif
// (voir HorizontalStage) : si le navigateur restaure sa position de scroll
// après un F5 (comportement par défaut), on rouvre en plein milieu du
// « faux » défilement horizontal — donc sur le dernier panneau si on avait
// scrollé jusqu'au bout avant de recharger. On désactive cette restauration
// et on repart toujours du haut.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
