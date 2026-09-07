import { useEffect, useState } from 'react';
import profilePhoto from '../assets/profile.jpg';
import witfPhoto from '../assets/project-witf-1.png';

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > window.innerHeight * 0.5);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
            <img src={witfPhoto} alt="" />
          </div>
        </div>
      </div>

      <div className="footer__content">
        <h2 className="footer__title">Portfolio</h2>
        <h3 className="footer__name">GyeongSik Shin</h3>
        <p className="footer__contact">gyeongsik5694@naver.com</p>
        <p className="footer__contact">010-9822-5694</p>
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
