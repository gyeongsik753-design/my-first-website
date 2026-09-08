import { useEffect, useRef, useState } from 'react';
import { SiClaude } from 'react-icons/si';

const LetterBadge = ({ text, background }) => (
  <span className="skills__letter" style={{ background }}>
    {text}
  </span>
);

const FigmaLogo = () => (
  <svg width="16" height="24" viewBox="0 0 38 57" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
  </svg>
);

const SKILLS = [
  {
    name: 'Figma',
    badge: () => (
      <div className="skills__badge">
        <FigmaLogo />
      </div>
    ),
  },
  {
    name: 'Adobe Photoshop',
    badge: () => (
      <LetterBadge text="Ps" background="linear-gradient(135deg, #001E36 0%, #31A8FF 100%)" />
    ),
  },
  {
    name: 'Adobe Illustrator',
    badge: () => (
      <LetterBadge text="Ai" background="linear-gradient(135deg, #330000 0%, #FF9A00 100%)" />
    ),
  },
  {
    name: 'Claude',
    badge: () => (
      <div className="skills__badge">
        <SiClaude size={20} color="#DA7756" />
      </div>
    ),
  },
];

const Skills = () => {
  const listRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = listRef.current;
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

  return (
    <div id="skill" className="skills">
      <h3 className="skills__title">Skills</h3>
      <div
        ref={listRef}
        className={`skills__list${inView ? ' skills__list--in' : ''}`}
      >
        {SKILLS.map(({ name, badge }, i) => (
          <div key={name} className="skills__item" style={{ '--i': i }}>
            {badge()}
            <span className="skills__name">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
