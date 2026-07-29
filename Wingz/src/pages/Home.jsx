import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import HorizontalStage, { Panel, useStageProgress } from '../components/HorizontalStage';
import MatrixText from '../components/MatrixText';
import ScrubVideo from '../components/ScrubVideo';
import ClipsPanel from '../components/ClipsPanel';
import VideoModal from '../components/VideoModal';
import TrackPlayer from '../components/TrackPlayer';
import Lightbox from '../components/Lightbox';
import ProductCard from '../components/ProductCard';
import { album, tracklist } from '../data/tracklist';
import { photos } from '../data/gallery';
import { products } from '../data/products';
import { useLang } from '../context/LangContext';
import { asset } from '../lib/asset';

/**
 * Boucle de fond très atténuée, fondue sur ses quatre bords.
 * Sans ces dégradés, deux panneaux voisins montrent une arête nette entre
 * leurs vidéos ; ici chaque boucle s'éteint avant de toucher la suivante.
 */
function BackdropLoop({ src, opacity = 0.14 }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity,
          // Le masque éteint la vidéo sur les bords gauche/droit.
          maskImage:
            'linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)',
        }}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />
      {/* Voiles horizontaux, pour que le noir reprenne la main en haut et en bas. */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void to-transparent" />
    </div>
  );
}

/**
 * L'animation Aetherstone, centrée derrière le texte de la page de sortie.
 * Sa lecture est pilotée par la position de défilement, sur la dernière
 * portion du parcours — donc elle avance en descendant et revient en
 * remontant.
 */
function ScrubTrack() {
  const progress = useStageProgress();
  if (!progress) return null;
  return (
    // Masquée sous md : le WebM à canal alpha ne se décode pas de façon
    // fiable sur les navigateurs mobiles (Safari iOS en tête), et affiche
    // un cadre gris cassé au lieu de se fondre dans le fond.
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
      <ScrubVideo
        progress={progress}
        from={0.78}
        to={1}
        className="h-[70%] w-auto max-w-[80%] object-contain opacity-90"
      />
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
  const [playing, setPlaying] = useState(null); // clip vidéo
  const [track, setTrack] = useState(null); // morceau écouté
  const [photo, setPhoto] = useState(null); // photo agrandie
  const [hoveredPhoto, setHoveredPhoto] = useState(null); // légende brouillée au survol
  const [endSeen, setEndSeen] = useState(false); // le panneau final est-il à l'écran ?
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <HorizontalStage
        labels={[
          t('stage.intro'),
          t('stage.album'),
          t('stage.photos'),
          t('stage.clips'),
          t('stage.shop'),
          t('stage.end'),
        ]}
      >
        {/* 1 — Héros */}
        <Panel width="100vw">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={asset('/video/hero-loop.mp4')}
            poster={asset('/img/hero-poster.jpg')}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-black/35" />
          {/* Fondus larges : la vidéo se dissout dans le noir au lieu de couper net. */}
          <div className="absolute inset-y-0 right-0 w-[55vw] bg-gradient-to-r from-transparent via-void/75 to-void" />
          <div className="absolute inset-y-0 left-0 w-[20vw] bg-gradient-to-l from-transparent to-void/80" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-void to-transparent" />

          <div className="relative px-8 md:px-16 lg:px-24">
            <img
              src={asset('/img/logo-wingz@2x.png')}
              alt="WINGZ"
              className="hero-in w-[70vw] max-w-[620px]"
            />
            <MatrixText
              as="p"
              text={`${t('home.newAlbum')} — PARTY LIFE — AETHERSTONE`}
              className="label-tech mt-8 block text-acid/80"
              speed={26}
              settleAfter={1.2}
            />
          </div>

          {/* Le sticker, collé en bas à gauche comme sur la pochette. */}
          <motion.img
            src={asset('/img/logo-partylife.png')}
            alt=""
            aria-hidden
            initial={{ opacity: 0, scale: 0.85, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -9 }}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute bottom-[12vh] left-[6vw] w-28 md:w-40"
          />

        </Panel>

        {/* Respiration entre la vidéo et l'album */}
        <Panel width="28vw" className="pointer-events-none" />

        {/* 2 — Album + tracklist */}
        <Panel center width="min(1150px, 94vw)" className="group/album px-8 md:px-16">
          <BackdropLoop src={asset('/video/bg-1.mp4')} opacity={0.1} />

          {/*
            Pochette à gauche / titres à droite dès le mobile (pas empilés) —
            même disposition qu'en desktop, juste des colonnes plus étroites.
            Le côte-à-côte laisse largement la place (hauteur du bloc = juste
            celle de la tracklist) pour une pochette et des titres à taille
            généreuse, pas juste "ce qui tient".
          */}
          <div className="relative grid grid-cols-[minmax(0,200px)_1fr] gap-5 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative self-start md:self-center"
            >
              {/* Halo violet qui s'allume au survol du panneau — calé sur la
                  pochette elle-même, pas sur tout l'écran. */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[60px] transition-opacity duration-700 group-hover/album:opacity-40"
                style={{ background: 'radial-gradient(circle, #e2fa01 0%, transparent 68%)' }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[70px] transition-opacity duration-700 group-hover/album:opacity-15"
                style={{ background: 'radial-gradient(circle, #51208d 0%, transparent 70%)' }}
              />

              <div className="corners relative">
                <img src={album.cover} alt={album.title} className="w-full" />
              </div>
              <p className="h-display mt-3 text-xl md:mt-5 md:text-3xl">{album.title}</p>
              <p className="label-tech mt-1 !text-[10px] md:mt-2">
                {album.artist} — {album.year}
              </p>
            </motion.div>

            {/* Les titres arrivent un par un. */}
            <ol className="self-center">
              {tracklist.map((tr, i) => (
                <motion.li
                  key={tr.id}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => setTrack(tr)}
                    aria-label={`${t('music.play')} ${tr.title}`}
                    className="group flex w-full items-center gap-3 border-b border-white/10 py-3 text-left transition-colors duration-300 hover:border-acid/60 md:gap-6"
                  >
                    <span className="w-6 shrink-0 text-xs text-white/30 transition-colors duration-300 group-hover:text-acid md:w-7">
                      {tr.number}
                    </span>
                    <span className="h-display flex-1 text-xl leading-tight transition-colors duration-300 group-hover:text-acid md:truncate md:text-2xl">
                      {tr.title}
                      {tr.feat && (
                        <span className="ml-2 text-xs text-white/40">ft. {tr.feat}</span>
                      )}
                    </span>
                    <Play
                      size={14}
                      className="hidden shrink-0 -translate-x-2 text-acid opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block"
                    />
                    <span className="hidden w-10 shrink-0 text-right text-xs text-white/30 transition-colors duration-300 group-hover:text-white/70 md:block">
                      {tr.duration}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ol>
          </div>
        </Panel>

        {/* 3 — Photos */}
        <Panel width="auto" className="px-8 md:px-16">
          <BackdropLoop src={asset('/video/bg-2.mp4')} opacity={0.08} />
          <div className="relative flex items-center gap-6 md:gap-8">
            <div className="mr-4 shrink-0">
              <p className="label-tech mb-4 text-acid/70">{t('home.gallery')}</p>
              <h2 className="h-display text-5xl md:text-7xl">{t('home.photos')}</h2>
            </div>

            {/* Tailles alternées pour casser la grille. */}
            {photos.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => setPhoto(p)}
                onMouseEnter={() => setHoveredPhoto(p.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={`group corners relative shrink-0 ${
                  i % 3 === 0
                    ? 'w-[58vw] sm:w-[38vw] md:w-[26vw]'
                    : i % 3 === 1
                      ? 'w-[45vw] sm:w-[30vw] md:w-[20vw]'
                      : 'w-[51vw] sm:w-[34vw] md:w-[23vw]'
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-coal">
                  <img
                    src={p.src}
                    alt={p.caption}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />
                </div>
                {/* La légende se brouille en glyphes au survol. */}
                <MatrixText
                  as="span"
                  text={p.caption.toUpperCase()}
                  start={hoveredPhoto === p.id}
                  speed={22}
                  settleAfter={1}
                  className="label-tech mt-3 block text-left transition-colors group-hover:text-acid"
                />
              </motion.button>
            ))}
          </div>
        </Panel>

        {/* 4 — Clips */}
        <Panel width="auto">
          <BackdropLoop src={asset('/video/bg-3.mp4')} opacity={0.09} />
          <ClipsPanel onPlay={setPlaying} />
        </Panel>

        {/* 5 — Boutique */}
        <Panel width="auto" className="px-8 md:px-16">
          <BackdropLoop src={asset('/video/bg-4.mp4')} opacity={0.08} />
          <div className="relative flex items-center gap-6 md:gap-8">
            <div className="mr-4 shrink-0">
              <p className="label-tech mb-4 text-acid/70">{t('home.merch')}</p>
              <h2 className="h-display mb-7 text-5xl md:text-7xl">{t('stage.shop')}</h2>
              <Link to="/shop" className="btn-tox">
                <span>{t('home.viewShop')}</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="w-[60vw] shrink-0 sm:w-[36vw] md:w-[22vw] lg:w-[18vw]"
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </Panel>

        {/* 6 — Sortie */}
        <Panel center width="min(1000px, 96vw)" className="px-8 md:px-16">
          {/* Boucle de fond conservée, l'animation Aetherstone se pose dessus. */}
          <BackdropLoop src={asset('/video/bg-3.mp4')} opacity={0.22} />
          <ScrubTrack />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #51208d 0%, transparent 70%)' }}
          />

          {/* Le déclencheur : les textes ne s'animent qu'à l'arrivée du panneau
              à l'écran, pas au chargement de la page. */}
          <motion.div
            className="relative"
            onViewportEnter={() => setEndSeen(true)}
            viewport={{ amount: 0.4 }}
          >
            <div className="text-center md:text-left">
              <MatrixText
                as="p"
                text="OUT NOW"
                start={endSeen}
                className="label-tech mb-4 block text-acid"
                speed={40}
                settleAfter={1.2}
              />
              {/* Sticker danger jaune officiel, pas le lettrage calligraphié. */}
              <motion.img
                src={asset('/img/logo-partylife.png')}
                alt="PARTY LIFE"
                initial={{ opacity: 0, y: 18 }}
                animate={endSeen ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-[min(60vw,340px)] md:mx-0"
              />

              {/* Crédits rédigés en paragraphe plutôt qu'en tableau. */}
              <div className="mt-10 max-w-xl border-t border-acid/25 pt-7">
                <p className="label-tech mb-4 !text-[10px]">Credits</p>
                <p className="text-sm leading-relaxed text-white/70 md:text-base md:leading-relaxed">
                  Edited and Directed by{' '}
                  <span className="text-acid">Aetherstone</span>. Post Production,
                  Visual Treatment &amp; Creative Direction by{' '}
                  <span className="text-acid">Aetherstone</span>.
                </p>
              </div>

              <a
                href="https://www.instagram.com/nadhem_hsini/"
                target="_blank"
                rel="noreferrer"
                className="group mt-8 inline-flex items-center gap-4"
              >
                {/* TODO: remplacer ce lettrage par le vrai logo AETHERSTONE
                    dès réception du fichier — aucun logo fourni à ce jour. */}
                <span className="font-display text-xl uppercase tracking-[0.3em] text-white transition-colors group-hover:text-acid">
                  Aetherstone
                </span>
                <span className="label-tech transition-colors group-hover:text-acid">
                  Instagram ↗
                </span>
              </a>
            </div>
          </motion.div>
        </Panel>
      </HorizontalStage>

      <VideoModal track={playing} onClose={() => setPlaying(null)} />
      <TrackPlayer track={track} onClose={() => setTrack(null)} />
      <Lightbox photo={photo} onClose={() => setPhoto(null)} />
    </>
  );
}
