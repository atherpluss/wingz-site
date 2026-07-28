# WINGZ — Site officiel

Site officiel de **WINGZ** pour l'album **PARTY LIFE** (2026).
React 18 + Vite + Tailwind + Framer Motion + React Router.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # build de production dans dist/
```

## Direction artistique

Palette échantillonnée directement sur l'artwork PARTY LIFE :

| Rôle | Valeur | Usage |
|---|---|---|
| Fond | `#0a0a0a` (`void`) | fond dominant |
| Surface | `#141414` (`coal`) | panneaux, lecteur, tiroir panier |
| Noir violacé | `#201f2c` (`ink`) | issu du fond de pochette |
| Violet | `#51208d` (`violet`) | halos, accents secondaires |
| **Accent** | **`#e2fa01` (`acid`)** | jaune du sticker « PARTY LIFE » |

Le brief proposait rouge sang ou vert néon ; le jaune acide de l'artwork a été
retenu à la place, puisqu'il fait déjà partie de l'identité de l'album.

Typographie : **Anton** (titres, capitales), **Playfair Display** (citations,
remerciements), **Inter** (texte courant).

## Structure

```
src/
  components/   Header, Footer, VideoHero, HorizontalSlider, Tracklist,
                MediaGrid, VideoModal, ShopTeaser, ThankYouSection,
                ProductCard, CartDrawer, MiniPlayer
  pages/        Home, Music (/musique), Shop (/shop), Press (/presse)
  data/         tracklist.js, products.js, press.js, gallery.js
  context/      CartContext.jsx, PlayerContext.jsx
public/
  audio/        les 9 masters MP3
  video/        hero.mp4 (SHAT SHKEKSH), lets-not-pretend.mp4
  img/          pochettes, recadrages de galerie, mockups, fond d'écran
```

## Le slider horizontal

`HorizontalSlider.jsx` est le composant signature. Deux entrées écrivent dans la
même `MotionValue` `x` :

1. le drag Framer Motion sur la rangée d'images ;
2. le pointeur sur la barre de progression, converti en position de drag.

Le curseur est dérivé de `x` par `useTransform`, donc il reste synchrone quelle
que soit la source du mouvement. La largeur déplaçable est mesurée par un
`ResizeObserver` — se fier à l'événement `load` des images échoue quand elles
sont déjà en cache.

## Contenu réel vs à remplacer

**Réel** — tracklist (titres, ordre et durées lues sur les masters), les 9
fichiers audio, les deux clips officiels, les pochettes recto/verso, les
mockups de chandails, le fond d'écran généré depuis l'artwork.

**À remplacer avant mise en ligne** (tous marqués `TODO` dans le code) :

- `src/data/press.js` — les 5 articles sont des placeholders, aucun n'est réel.
  Les adresses `presse@wingz.com` / `booking@wingz.com` sont inventées.
- `public/video/hero.mp4` — 30 Mo, trop lourd pour un chargement de page.
  Produire une boucle courte compressée (~8 s, < 5 Mo).
- `src/data/products.js` — prix et catalogue à confirmer ; les visuels vinyle et
  CD réutilisent la pochette faute de photos produit.
- `Footer.jsx` — liens sociaux et infolettre pointent sur `#`.
- `Header.jsx` — le champ de recherche est visuel, non branché.
- `CartDrawer.jsx` — le bouton « Commander » n'est relié à aucun paiement.

## Accessibilité

Barres de progression (galerie et lecteur) exposées en `role="slider"` avec
navigation aux flèches. Menu mobile, tiroir panier et modale vidéo se ferment
avec `Échap` et bloquent le scroll de la page derrière eux.
