import { useEffect, useState } from 'react';

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
      <h2 className="footer__title">Portfolio</h2>
      <h3 className="footer__name">GyeongSik Shin</h3>
      <p className="footer__contact">gyeongsik5694@naver.com</p>
      <p className="footer__contact">010-9822-5694</p>

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
