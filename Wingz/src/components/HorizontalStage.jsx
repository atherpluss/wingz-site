import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/** Donne aux panneaux l'avancement du défilement (0 → 1). */
const StageProgress = createContext(null);
export const useStageProgress = () => useContext(StageProgress);

/** Permet à un panneau `center` de s'enregistrer pour le magnétisme au repos. */
const CenterRegistry = createContext(null);

/**
 * Fait défiler le site de droite à gauche.
 *
 * Un conteneur haut de `distance + 1 écran` fournit la course de scroll
 * native ; à l'intérieur, un panneau `sticky` reste collé et sa rangée de
 * sections est translatée horizontalement selon l'avancement du scroll.
 * On garde le scroll natif : la vitesse reste celle du système.
 *
 * Ce défilement n'a par nature aucun point d'arrêt : chaque panneau glisse en
 * continu selon la position brute du scroll. Pour un panneau plus étroit que
 * l'écran (voir `Panel({ center: true })`), n'importe quel arrêt en cours de
 * transition laisse un bord touché et l'autre non. Le magnétisme ci-dessous
 * corrige ça : une fois le scroll relâché, si un panneau `center` est presque
 * en place, on termine la course jusqu'à le centrer exactement.
 */
export default function HorizontalStage({ children, labels = [] }) {
  const outerRef = useRef(null);
  const rowRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const centerNodesRef = useRef(new Set());

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const overflow = row.scrollWidth - window.innerWidth;
    setDistance(overflow > 0 ? overflow : 0);
  }, []);

  // `useLayoutEffect`, pas `useEffect` : la mesure doit être prête avant la
  // première peinture. Sinon `distance` vaut encore 0 le temps d'un frame,
  // le conteneur scrollable n'a que la hauteur d'un écran, et `useScroll`
  // calcule sa progression sur cette plage quasi nulle — ce qui pousse le
  // panneau final à l'écran au chargement, le temps qu'un scroll ou un
  // toucher force un recalcul avec la vraie distance.
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (rowRef.current) ro.observe(rowRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const registerCenterNode = useCallback((node) => {
    const set = centerNodesRef.current;
    set.add(node);
    return () => set.delete(node);
  }, []);

  // Magnétisme : au repos, si un panneau `center` est à moins de 40% d'écran
  // de sa position centrée, on termine la course jusqu'à lui.
  useEffect(() => {
    let timer = null;

    const settle = () => {
      const vw = window.innerWidth;
      const currentY = window.scrollY;
      const capture = vw * 0.4;
      let best = null;

      centerNodesRef.current.forEach((node) => {
        if (!node.isConnected) return;
        // x = -scrollY à tout instant, donc l'écart entre la position
        // affichée du panneau et 0 (parfaitement calé à gauche de l'écran)
        // est exactement la distance de scroll qu'il reste à parcourir.
        const rectLeft = node.getBoundingClientRect().left;
        if (Math.abs(rectLeft) < 4) return; // déjà calé, rien à faire
        if (Math.abs(rectLeft) > capture) return; // trop loin : on n'interrompt pas le geste
        if (!best || Math.abs(rectLeft) < Math.abs(best.rectLeft)) {
          best = { target: currentY + rectLeft, rectLeft };
        }
      });

      if (best) window.scrollTo({ top: best.target, behavior: 'smooth' });
    };

    const onScroll = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(settle, 140);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

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
          <StageProgress.Provider value={scrollYProgress}>
            <CenterRegistry.Provider value={registerCenterNode}>
              {children}
            </CenterRegistry.Provider>
          </StageProgress.Provider>
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

/**
 * Une section pleine hauteur dans la rangée horizontale.
 *
 * `center` réserve au moins un écran plein pour ce panneau, centre son
 * contenu dedans, et s'enregistre auprès du magnétisme de `HorizontalStage`
 * (voir plus haut) pour se caler pile au centre une fois le scroll relâché.
 * Les panneaux volontairement larges (Photos, Clips, Shop) n'utilisent pas
 * cette option : ils défilent en continu et n'ont pas besoin d'être centrés.
 */
export function Panel({ children, className = '', width = 'auto', center = false }) {
  const register = useContext(CenterRegistry);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!center || !register || !nodeRef.current) return undefined;
    return register(nodeRef.current);
  }, [center, register]);

  if (center) {
    return (
      <div ref={nodeRef} className="flex h-full shrink-0 justify-center" style={{ minWidth: '100vw' }}>
        <section
          className={`relative flex h-full flex-col justify-center ${className}`}
          style={{ width, maxWidth: width }}
        >
          {children}
        </section>
      </div>
    );
  }

  return (
    <section
      className={`relative flex h-full shrink-0 flex-col justify-center ${className}`}
      style={{ width }}
    >
      {children}
    </section>
  );
}
