import { useEffect, useRef, useState } from 'react';
import heroCamera from '../assets/hero-camera.png';

const Hero = () => {
  const cameraRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = cameraRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.intersectionRatio >= 0.4);
      },
      { threshold: [0, 0.4] }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero__camera-wrap" ref={cameraRef}>
        <img
          src={heroCamera}
          alt="포트폴리오 카메라"
          className={`hero__camera${inView ? ' hero__camera--in' : ''}`}
        />
        <span className="hero__flash-burst" aria-hidden="true" />
        <div className="hero__lens-marquee" aria-hidden="true">
          <div className="hero__lens-marquee-tilt">
            <div className="hero__lens-marquee-track">
              <span className="hero__lens-marquee-group">PORTFOLIO • </span>
              <span className="hero__lens-marquee-group">PORTFOLIO • </span>
            </div>
          </div>
        </div>
      </div>
      <span className="hero__flash-ambient" aria-hidden="true" />
      <span className="hero__scroll-hint" aria-hidden="true">
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
          <circle className="hero__scroll-hint-dot" cx="8" cy="7" r="2" fill="rgba(255,255,255,0.9)" />
        </svg>
      </span>
    </section>
  );
};

export default Hero;
