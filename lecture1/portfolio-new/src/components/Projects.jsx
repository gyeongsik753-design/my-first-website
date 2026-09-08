import { useEffect, useState } from 'react';
import projectWitf0 from '../assets/project-witf-0.png';
import projectWitf1 from '../assets/project-witf-1.png';
import projectWitf2 from '../assets/project-witf-2.png';
import projectWitf3 from '../assets/project-witf-3.png';

const WITF_SLIDES = [projectWitf0, projectWitf1, projectWitf2, projectWitf3];
const SLIDE_INTERVAL = 2200;
const CARD_TILT_MAX_DEG = 10;

const Projects = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [witfHovered, setWitfHovered] = useState(false);

  useEffect(() => {
    if (witfHovered) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % WITF_SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => window.clearInterval(timer);
  }, [witfHovered]);

  const handleCardMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * CARD_TILT_MAX_DEG * 2;
    const rotateX = (0.5 - py) * CARD_TILT_MAX_DEG * 2;
    el.style.transform = `scale(1.06) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  const handleWitfEnter = () => setWitfHovered(true);

  const handleWitfLeave = (e) => {
    setWitfHovered(false);
    handleCardLeave(e);
  };

  return (
    <section id="projects" className="projects">
      <h2 className="projects__title">PROJECTS</h2>
      <div className="projects__grid">
        <a
          href="https://gyeongsik753-design.github.io/my-first-website/"
          target="_blank"
          rel="noopener noreferrer"
          className="projects__card projects__card--witf"
          onMouseEnter={handleWitfEnter}
          onMouseMove={handleCardMove}
          onMouseLeave={handleWitfLeave}
        >
          <div className="projects__slideshow">
            {WITF_SLIDES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`WITF 프로젝트 화면 ${i + 1}`}
                className={`projects__slide${i === activeSlide ? ' projects__slide--active' : ''}`}
              />
            ))}
          </div>
        </a>

        <div
          className="projects__card placeholder"
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
        >
          <span className="placeholder__hint">프로젝트 2</span>
        </div>

        <div
          className="projects__card placeholder"
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
        >
          <span className="placeholder__hint">프로젝트 3</span>
        </div>
      </div>
    </section>
  );
};

export default Projects;
