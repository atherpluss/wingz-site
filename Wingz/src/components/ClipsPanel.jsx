import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { allVideos, featuredVideos, tracklist } from '../data/tracklist';
import { useLang } from '../context/LangContext';

/**
 * Deux vidéos en avant (le clip LET'S NOT PRETEND et le visualiseur ENTRY FEE),
 * le reste rangé derrière un bouton « voir plus » qui ouvre la liste complète.
 * Les visualiseurs ne prennent pas la place des vrais clips.
 */
export default function ClipsPanel({ onPlay }) {
  const { t } = useLang();
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    if (!listOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setListOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [listOpen]);

  return (
    <>
      <div className="flex h-full items-center px-8 md:px-16 lg:px-24">
        <div>
          <p className="label-tech mb-3 md:mb-4">{t('home.videos')}</p>
          <h2 className="h-display mb-6 text-5xl md:mb-14 md:text-7xl">{t('home.clips')}</h2>

          <div className="flex flex-row gap-3 md:gap-8">
            {featuredVideos.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => onPlay(track)}
                aria-label={`${t('music.play')} ${track.title}`}
                className="group relative w-[62vw] shrink-0 text-left sm:w-[52vw] md:w-[34vw] lg:w-[30vw]"
              >
                <div className="relative aspect-video overflow-hidden bg-coal">
                  {/* Vignette réelle du clip, tirée de YouTube. */}
                  <img
                    src={track.thumb}
                    alt={track.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/50" />
                  <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 transition-all duration-500 group-hover:scale-110 group-hover:border-acid group-hover:bg-acid/10 md:h-16 md:w-16">
                    <Play size={20} className="ml-0.5 text-white group-hover:text-acid" />
                  </span>
                </div>

                <p className="mt-3 font-display text-lg uppercase tracking-wide md:mt-4 md:text-xl">
                  {track.title}
                </p>
                <p className="label-tech mt-1">
                  {track.kind === 'clip' ? t('home.officialClip') : t('home.visualizer')}
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="btn-tox mt-8 md:mt-10"
          >
            <span>{t('home.seeAll')}</span>
          </button>
        </div>
      </div>

      {/*
        Portée vers document.body : ce panneau vit dans la rangée transformée
        (translateX) du stage horizontal, or un `transform` sur un ancêtre
        redéfinit le containing block des descendants `fixed` — sans portail,
        cette fenêtre "fixed inset-0" se retrouvait positionnée à l'intérieur
        de cette rangée géante et coupée par son `overflow-hidden` au lieu de
        couvrir l'écran.
      */}
      {createPortal(
        <AnimatePresence>
        {listOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setListOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={t('home.seeAll')}
            className="fixed inset-0 z-[75] flex items-center justify-center bg-void/92 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full max-w-2xl overflow-y-auto border border-white/12 bg-coal"
            >
              <header className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-coal px-6 py-4">
                <h3 className="font-display text-lg uppercase tracking-wider2">PARTY LIFE</h3>
                <button
                  type="button"
                  onClick={() => setListOpen(false)}
                  aria-label={t('common.close')}
                  className="text-white/60 transition-colors hover:text-acid"
                >
                  <X size={18} />
                </button>
              </header>

              <ul className="px-2 py-2">
                {tracklist.map((track) => {
                  const hasVideo = Boolean(track.youtube || track.localVideo);
                  return (
                    <li key={track.id}>
                      <button
                        type="button"
                        disabled={!hasVideo}
                        onClick={() => {
                          setListOpen(false);
                          onPlay(track);
                        }}
                        className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors enabled:hover:bg-white/5 disabled:cursor-default"
                      >
                        <span className="w-7 shrink-0 text-xs text-white/30">{track.number}</span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block truncate font-display text-lg uppercase tracking-wide transition-colors ${
                              hasVideo ? 'text-white group-hover:text-acid' : 'text-white/35'
                            }`}
                          >
                            {track.title}
                            {track.feat && (
                              <span className="ml-2 text-xs text-white/40">ft. {track.feat}</span>
                            )}
                          </span>
                          <span className="label-tech mt-0.5 block">
                            {hasVideo
                              ? track.kind === 'clip'
                                ? t('home.officialClip')
                                : t('home.visualizer')
                              : t('home.soon')}
                          </span>
                        </span>

                        {hasVideo && (
                          <Play
                            size={15}
                            className="shrink-0 text-white/40 transition-colors group-hover:text-acid"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="label-tech border-t border-white/10 px-6 py-4">
                {t('home.videoCount', allVideos.length, tracklist.length)}
              </p>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
