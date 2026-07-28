import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Typewriter from './Typewriter';

/**
 * Visionneuse plein écran, ouverture façon signal intercepté :
 *  - l'image se révèle de haut en bas derrière une ligne de balayage jaune,
 *    d'abord désaturée puis couleur — comme un scan qui se termine ;
 *  - les quatre coins du viseur partent du centre et s'étendent avec l'image ;
 *  - la légende se tape lettre par lettre, curseur bloc.
 */
const CORNERS = [
  { pos: 'left-0 top-0', border: 'border-l-2 border-t-2', x: 60, y: 60 },
  { pos: 'right-0 top-0', border: 'border-r-2 border-t-2', x: -60, y: 60 },
  { pos: 'left-0 bottom-0', border: 'border-l-2 border-b-2', x: 60, y: -60 },
  { pos: 'right-0 bottom-0', border: 'border-r-2 border-b-2', x: -60, y: -60 },
];

export default function Lightbox({ photo, onClose }) {
  useEffect(() => {
    if (!photo) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [photo, onClose]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption}
          className="scanlines fixed inset-0 z-[85] flex items-center justify-center bg-void/96 p-5 backdrop-blur-sm md:p-12"
        >
          {/* Halo violet derrière l'image */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[130px]"
            style={{ background: 'radial-gradient(circle, #51208d 0%, transparent 70%)' }}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-white/30 bg-void text-white transition-colors hover:border-acid hover:bg-acid hover:text-void md:right-9 md:top-9"
          >
            <X size={20} />
          </button>

          <motion.figure
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full"
          >
            <div className="relative overflow-hidden">
              {/* L'image : révélée de haut en bas, N&B contrasté puis couleur. */}
              <motion.img
                key={photo.src}
                src={photo.src}
                alt={photo.caption}
                initial={{
                  clipPath: 'inset(0 0 100% 0)',
                  filter: 'saturate(0) contrast(1.6) brightness(1.15)',
                }}
                animate={{
                  clipPath: 'inset(0 0 0% 0)',
                  filter: 'saturate(1) contrast(1) brightness(1)',
                }}
                transition={{
                  clipPath: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
                  filter: { delay: 0.6, duration: 0.5 },
                }}
                className="max-h-[74vh] w-auto object-contain"
              />

              {/* Ligne de balayage : descend avec la révélation, puis s'éteint. */}
              <motion.div
                aria-hidden
                initial={{ top: '0%', opacity: 1 }}
                animate={{ top: '100%', opacity: [1, 1, 0] }}
                transition={{ duration: 0.78, ease: [0.4, 0, 0.2, 1] }}
                className="pointer-events-none absolute inset-x-0 h-[2px] bg-acid"
                style={{ boxShadow: '0 0 18px 3px rgba(226, 250, 1, 0.65)' }}
              />
            </div>

            {/* Les quatre coins du viseur s'étendent depuis le centre. */}
            {CORNERS.map((c) => (
              <motion.span
                key={c.pos}
                aria-hidden
                initial={{ x: c.x, y: c.y, opacity: 0 }}
                animate={{ x: -0, y: -0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={`pointer-events-none absolute ${c.pos} h-5 w-5 ${c.border} border-acid`}
              />
            ))}

            <figcaption className="mt-4 text-center">
              <Typewriter
                text={photo.caption.toUpperCase()}
                speed={60}
                className="label-tech !text-acid"
              />
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
