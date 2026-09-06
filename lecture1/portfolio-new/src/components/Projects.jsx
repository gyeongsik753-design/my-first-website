import { useEffect, useState } from 'react';
import projectWitf1 from '../assets/project-witf-1.png';
import projectWitf2 from '../assets/project-witf-2.png';
import projectWitf3 from '../assets/project-witf-3.png';

const WITF_SLIDES = [projectWitf1, projectWitf2, projectWitf3];
const SLIDE_INTERVAL = 2200;

const Projects = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % WITF_SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="projects" className="projects">
      <h2 className="projects__title">PROJECTS</h2>
      <div className="projects__grid">
        <a
          href="https://gyeongsik753-design.github.io/my-first-website/"
          target="_blank"
          rel="noopener noreferrer"
          className="projects__card projects__card--witf"
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

        <div className="projects__card placeholder">
          <span className="placeholder__hint">프로젝트 2</span>
        </div>

        <div className="projects__card placeholder">
          <span className="placeholder__hint">프로젝트 3</span>
        </div>
      </div>
    </section>
  );
};

export default Projects;
