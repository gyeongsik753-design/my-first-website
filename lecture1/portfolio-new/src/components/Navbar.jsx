import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { num: '1', label: 'Home', href: '#home' },
  { num: '2', label: 'About Me', href: '#about' },
  { num: '3', label: 'Profile', href: '#profile' },
  { num: '4', label: 'Projects', href: '#projects' },
  { num: '5', label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [activeHref, setActiveHref] = useState(null);

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ href }) => document.getElementById(href.slice(1))).filter(
      Boolean
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <a href="#home" className="navbar__logo" onClick={() => setActiveHref('#home')}>
          S.S
        </a>
        <div className="navbar__links">
          {NAV_ITEMS.map(({ num, label, href }) => (
            <a
              key={label}
              href={href}
              className={`navbar__item${activeHref === href ? ' navbar__item--active' : ''}`}
              onClick={() => setActiveHref(href)}
            >
              <span className="navbar__num">{num}</span>
              <span className="navbar__label">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
