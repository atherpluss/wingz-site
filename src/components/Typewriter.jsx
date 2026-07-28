import { useEffect, useRef, useState } from 'react';

/**
 * Texte tapé lettre par lettre, curseur bloc clignotant — façon terminal.
 * Tant que `start` est faux, rien n'est affiché.
 */
export default function Typewriter({ text, className = '', speed = 55, start = true, as: Tag = 'span' }) {
  const [count, setCount] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return undefined;
    }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setCount(text.length);
      return undefined;
    }
    setCount(0);
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(timer.current);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(timer.current);
  }, [text, speed, start]);

  const done = count >= text.length;

  return (
    <Tag className={className}>
      <span aria-hidden>
        {text.slice(0, count)}
        {/* Curseur bloc : clignote une fois la frappe terminée. */}
        <span className={done ? 'animate-pulse' : ''}>█</span>
      </span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
