import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%@';

/**
 * Le texte se compose lettre par lettre, chaque caractère passant par
 * quelques glyphes aléatoires avant de se fixer. Effet terminal / Trinity.
 *
 * Rendu accessible : le texte final est présent dès le départ pour les
 * lecteurs d'écran, seul l'affichage visuel est brouillé.
 */
export default function MatrixText({
  text,
  className = '',
  speed = 28,
  settleAfter = 2,
  start = true,
  as: Tag = 'span',
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!start) return undefined;

    // Respecte le réglage système : pas de brouillage si l'utilisateur a
    // demandé moins d'animations.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(text);
      return undefined;
    }

    frame.current = 0;
    let last = 0;

    const tick = (now) => {
      if (now - last >= speed) {
        last = now;
        const progress = frame.current / settleAfter;
        const out = text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < progress) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');
        setDisplay(out);
        frame.current += 1;
        if (progress >= text.length) {
          setDisplay(text);
          return;
        }
      }
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      setDisplay(text);
    };
  }, [text, speed, settleAfter, start]);

  return (
    <Tag className={className}>
      <span aria-hidden>{display}</span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
