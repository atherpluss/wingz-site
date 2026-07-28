import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import MatrixText from './MatrixText';

/**
 * Lecteur en bas d'écran, fixe : il ne bouge pas avec le défilement.
 * Le morceau se lit via l'iframe officielle Spotify, donc rien n'est
 * hébergé ici et l'écoute est comptabilisée sur la plateforme.
 */
export default function TrackPlayer({ track, onClose }) {
  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 140, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[65] border-t border-acid/30 bg-void/95 backdrop-blur-lg"
        >
          {/* Filet jaune animé : le signal est « en ligne ». */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 h-px origin-left bg-acid"
          />

          <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-3 md:gap-8 md:px-10">
            <div className="hidden shrink-0 sm:block">
              <p className="label-tech !text-[9px] text-acid/70">Now playing</p>
              <MatrixText
                as="p"
                text={track.title}
                className="font-display text-base uppercase tracking-wide"
                speed={22}
                settleAfter={1.4}
              />
            </div>

            <div className="min-w-0 flex-1">
              <iframe
                key={track.spotify}
                src={`https://open.spotify.com/embed/track/${track.spotify}?utm_source=generator&theme=0`}
                title={track.title}
                width="100%"
                height="80"
                frameBorder="0"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="w-full"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close player"
              className="shrink-0 text-white/45 transition-colors hover:text-acid"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
