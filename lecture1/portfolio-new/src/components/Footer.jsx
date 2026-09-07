import { useEffect, useMemo, useRef, useState } from 'react';
import profilePhoto from '../assets/profile.jpg';

const TITLE_TEXT = 'Portfolio';
const NAME_TEXT = 'GyeongSik Shin';
const EMAIL_TEXT = 'gyeongsik5694@naver.com';
const PHONE_TEXT = '010-9822-5694';

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [inView, setInView] = useState(false);
  const titleRef = useRef(null);

  const { titleLetters, nameLetters, emailLetters, phoneLetters } = useMemo(() => {
    let i = 0;
    const makeLetters = (str) =>
      Array.from(str).map((ch) => ({
        ch: ch === ' ' ? ' ' : ch,
        i: i++,
        tx: randomBetween(-260, 260),
        ty: randomBetween(-180, 180),
        tr: randomBetween(-70, 70),
      }));
    return {
      titleLetters: makeLetters(TITLE_TEXT),
      nameLetters: makeLetters(NAME_TEXT),
      emailLetters: makeLetters(EMAIL_TEXT),
      phoneLetters: makeLetters(PHONE_TEXT),
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > window.innerHeight * 0.5);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.intersectionRatio >= 0.3);
      },
      { threshold: [0, 0.3] }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="footer">
      <div className="footer__orbits" aria-hidden="true">
        <div className="footer__ring footer__ring--a">
          <div className="footer__ring-frame">
            <img src={profilePhoto} alt="" />
          </div>
        </div>
        <div className="footer__ring footer__ring--b">
          <div className="footer__ring-frame">
            <img src={profilePhoto} alt="" />
          </div>
        </div>
      </div>

      <div className="footer__content">
        <h2
          ref={titleRef}
          className={`footer__title${inView ? ' footer__title--in' : ''}`}
        >
          {titleLetters.map(({ ch, i, tx, ty, tr }) => (
            <span
              key={i}
              className="footer__letter"
              style={{ '--i': i, '--tx': `${tx}px`, '--ty': `${ty}px`, '--tr': `${tr}deg` }}
            >
              {ch}
            </span>
          ))}
        </h2>
        <h3 className={`footer__name${inView ? ' footer__name--in' : ''}`}>
          {nameLetters.map(({ ch, i, tx, ty, tr }) => (
            <span
              key={i}
              className="footer__letter"
              style={{ '--i': i, '--tx': `${tx}px`, '--ty': `${ty}px`, '--tr': `${tr}deg` }}
            >
              {ch}
            </span>
          ))}
        </h3>
        <p className={`footer__contact${inView ? ' footer__contact--in' : ''}`}>
          {emailLetters.map(({ ch, i, tx, ty, tr }) => (
            <span
              key={i}
              className="footer__letter"
              style={{ '--i': i, '--tx': `${tx}px`, '--ty': `${ty}px`, '--tr': `${tr}deg` }}
            >
              {ch}
            </span>
          ))}
        </p>
        <p className={`footer__contact${inView ? ' footer__contact--in' : ''}`}>
          {phoneLetters.map(({ ch, i, tx, ty, tr }) => (
            <span
              key={i}
              className="footer__letter"
              style={{ '--i': i, '--tx': `${tx}px`, '--ty': `${ty}px`, '--tr': `${tr}deg` }}
            >
              {ch}
            </span>
          ))}
        </p>
      </div>

      <button
        type="button"
        className={`footer__top-btn${showTopBtn ? ' footer__top-btn--visible' : ''}`}
        onClick={scrollToTop}
        aria-label="맨 위로"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;
