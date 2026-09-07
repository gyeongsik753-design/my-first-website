import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

const TITLE = 'DESIGNER'.split('');

const PARAGRAPHS = [
  '타이밍은 감각이고, 증명은 데이터로 합니다.',
  '결정적 순간을 포착하는 셔터처럼, 시장의 흐름을 날카롭게 읽고 단단한 결과물을 빌드 업합니다.',
  '사용자의 숨은 니즈를 파악해 일상에 스며드는 따뜻한 프로덕트를 만듭니다.',
  '직관에 머물지 않는 가설 검증과 깊이 있는 회고를 통해 끊임없이 사용성을 개선하는 성장형 디자이너 신경식입니다.',
];

const About = () => {
  const titleRef = useRef(null);
  const [inView, setInView] = useState(false);

  const paragraphs = useMemo(() => {
    let wordIndex = 0;
    return PARAGRAPHS.map((paragraph) =>
      paragraph.split(' ').map((word) => ({ word, i: wordIndex++ }))
    );
  }, []);

  useEffect(() => {
    const el = titleRef.current;
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
    <section id="about" className="about">
      <h2
        ref={titleRef}
        className={`about__title${inView ? ' about__title--in' : ''}`}
      >
        {TITLE.map((letter, i) => (
          <span key={i} className="about__letter" style={{ '--i': i }}>
            {letter}
          </span>
        ))}
      </h2>
      <div className={`about__text${inView ? ' about__text--in' : ''}`}>
        {paragraphs.map((words, pi) => (
          <p key={pi}>
            {words.map(({ word, i }, wi) => (
              <Fragment key={wi}>
                <span className="about__word" style={{ '--i': i }}>
                  {word}
                </span>
                {wi < words.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
};

export default About;
