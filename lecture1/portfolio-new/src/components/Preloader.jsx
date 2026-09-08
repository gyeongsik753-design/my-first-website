import { useEffect, useState } from 'react';

const REVEAL_MS = 1700;
const HOLD_MS = 500;
const FADE_MS = 650;

const Preloader = () => {
  const [stage, setStage] = useState('loading');
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setMounted(false);
      return undefined;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const litTimer = window.setTimeout(() => setStage('lit'), REVEAL_MS);
    const fadeTimer = window.setTimeout(() => setStage('fading'), REVEAL_MS + HOLD_MS);
    const doneTimer = window.setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = prevOverflow;
    }, REVEAL_MS + HOLD_MS + FADE_MS);

    return () => {
      window.clearTimeout(litTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!mounted) return null;

  const className = `preloader${stage === 'lit' ? ' preloader--lit' : ''}${
    stage === 'fading' ? ' preloader--fading' : ''
  }`;

  return (
    <div className={className} aria-hidden="true">
      <span className="preloader__flare" />
      <span className="preloader__logo">S.S</span>
    </div>
  );
};

export default Preloader;
