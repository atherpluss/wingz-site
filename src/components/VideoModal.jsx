import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLang } from '../context/LangContext';

/**
 * Lecteur en surimpression. Accepte soit une vidéo locale, soit un ID YouTube.
 * Dans les deux cas la lecture se fait dans le site : on ne sort jamais vers
 * une autre page.
 */
export default function VideoModal({ track, onClose }) {
  const { t } = useLang();
  useEffect(() => {
    if (!track) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [track, onClose]);

  const label = track ? `${track.title}${track.feat ? ` ft. ${track.feat}` : ''}` : '';

  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void/95 p-4 backdrop-blur-sm md:p-10"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="absolute right-5 top-5 text-white/70 transition-colors hover:text-acid md:right-8 md:top-8"
          >
            <X size={26} />
          </button>

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl"
          >
            <div className="aspect-video w-full bg-black">
              {track.youtube ? (
                <iframe
                  key={track.youtube}
                  src={`https://www.youtube-nocookie.com/embed/${track.youtube}?autoplay=1&rel=0&modestbranding=1`}
                  title={label}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <video
                  key={track.localVideo}
                  src={track.localVideo}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full"
                />
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
              <p className="h-display text-2xl">
                {track.title}
                {track.feat && <span className="ml-2 text-white/45">ft. {track.feat}</span>}
              </p>
              <p className="label-tech">
                {track.kind === 'clip' ? t('home.officialClip') : t('home.visualizer')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
