import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/** Donne aux panneaux l'avancement du défilement (0 → 1). */
const StageProgress = createContext(null);
export const useStageProgress = () => useContext(StageProgress);

/**
 * Fait défiler le site de droite à gauche.
 *
 * Un conteneur haut de `distance + 1 écran` fournit la course de scroll
 * native ; à l'intérieur, un panneau `sticky` reste collé et sa rangée de
 * sections est translatée horizontalement selon l'avancement du scroll.
 * On garde le scroll natif : la vitesse reste celle du système.
 */
export default function HorizontalStage({ children, labels = [] }) {
  const outerRef = useRef(null);
  const rowRef = useRef(null);
  const [distance, setDistance] = useState(0);

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const overflow = row.scrollWidth - window.innerWidth;
    setDistance(overflow > 0 ? overflow : 0);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (rowRef.current) ro.observe(rowRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Translation liée directement à la position de scroll : la barre de
  // défilement et l'image restent exactement en phase.
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const thumbLeft = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={outerRef} style={{ height: distance ? distance + window.innerHeight : '100svh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div ref={rowRef} style={{ x }} className="flex h-full w-max">
          <StageProgress.Provider value={scrollYProgress}>{children}</StageProgress.Provider>
        </motion.div>

        {/* Repère de progression — on sait toujours où on en est. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-5 md:px-12 md:pb-6">
          <div className="flex items-center gap-4">
            <span className="label-tech shrink-0 !text-[10px]">Scroll</span>

            <div className="relative h-px flex-1 bg-white/15">
              <motion.div
                style={{ scaleX: progressScale }}
                className="absolute inset-0 origin-left bg-acid"
              />
              {/* Curseur en losange, écho au sticker PARTY LIFE. */}
              <motion.div
                style={{ left: thumbLeft }}
                className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-acid"
              />
            </div>

            {/* Jalons de section */}
            <div className="hidden shrink-0 items-center gap-3 md:flex">
              {labels.map((l, i) => (
                <SectionTick
                  key={l}
                  label={l}
                  index={i}
                  total={labels.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Un jalon s'allume quand le défilement atteint sa portion. */
function SectionTick({ label, index, total, progress }) {
  const from = index / total;
  const to = (index + 1) / total;
  const opacity = useTransform(progress, [from - 0.06, from, to, to + 0.06], [0.3, 1, 1, 0.3]);

  return (
    <motion.span style={{ opacity }} className="label-tech !text-[10px]">
      {label}
    </motion.span>
  );
}

/** Une section pleine hauteur dans la rangée horizontale. */
export function Panel({ children, className = '', width = 'auto' }) {
  return (
    <section
      className={`relative flex h-full shrink-0 flex-col justify-center ${className}`}
      style={{ width }}
    >
      {children}
    </section>
  );
}
