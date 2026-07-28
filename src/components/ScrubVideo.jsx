import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';

/**
 * Vidéo à fond transparent dont la lecture suit le défilement : elle avance
 * quand on descend, revient en arrière quand on remonte.
 *
 * On ne lit pas la vidéo, on déplace `currentTime` à la main. L'encodage est
 * en toutes images clés, sinon chaque saut obligerait le décodeur à remonter
 * à la clé précédente et le mouvement saccaderait.
 *
 * Une seule source, WebM/VP9 alpha. L'encodage HEVC de secours pour Safari a
 * été écarté : videotoolbox perdait le canal alpha, ce qui aurait affiché un
 * rectangle noir opaque au lieu de rien.
 */
export default function ScrubVideo({ progress, from = 0, to = 1, className = '' }) {
  const videoRef = useRef(null);
  const targetRef = useRef(0);
  const rafRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Le suivi du scroll écrit une cible ; une boucle d'animation rattrape
  // cette cible en douceur, ce qui lisse les à-coups du trackpad.
  useMotionValueEvent(progress, 'change', (v) => {
    const span = to - from || 1;
    targetRef.current = Math.min(Math.max((v - from) / span, 0), 1);
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready) return undefined;

    const tick = () => {
      const duration = video.duration;
      if (duration && Number.isFinite(duration)) {
        const wanted = targetRef.current * duration;
        const current = video.currentTime;
        const next = current + (wanted - current) * 0.18;
        if (Math.abs(wanted - current) > 0.008) {
          video.currentTime = next;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      playsInline
      preload="auto"
      aria-hidden
      onLoadedMetadata={() => setReady(true)}
    >
      <source src="/video/aether.webm" type="video/webm" />
    </video>
  );
}
