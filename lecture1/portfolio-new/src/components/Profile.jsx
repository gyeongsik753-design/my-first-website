const EDUCATION = [
  { year: '2017', desc: '진주 자동차고등학교 졸업' },
  { year: '2018', desc: '마산대학교 호텔조리과 입학' },
  { year: '2022', desc: '마산대학교 호텔조리과 졸업' },
];

const WORK = [
  { year: '2024', desc: '하이즈항공(항공기 조립)' },
  { year: '2025', desc: '록핀 셀러(피팅모델 및 상세페이지 제작)' },
];

const CERTIFICATION = [
  { year: '2016', desc: '컴퓨터응용밀링기능사' },
  { year: '2016', desc: '자동차운전면허 1종' },
  { year: '2017', desc: '컴퓨터응용선반기능사' },
  { year: '2017', desc: '조리산업기사(한식)' },
  { year: '2025', desc: '사회복지사 2급' },
  { year: '2025', desc: 'acp' },
];

import { useEffect, useMemo, useRef, useState } from 'react';
import profilePhoto from '../assets/profile.jpg';
import Skills from './Skills';

const TILT_MAX_DEG = 12;

const withIndex = (list, offset = 0) => list.map((item, i) => ({ ...item, i: offset + i }));

const Profile = () => {
  const tiltRef = useRef(null);
  const infoRef = useRef(null);
  const [listInView, setListInView] = useState(false);

  const education = useMemo(() => withIndex(EDUCATION), []);
  const work = useMemo(() => withIndex(WORK, EDUCATION.length), []);
  const certification = useMemo(() => withIndex(CERTIFICATION), []);

  useEffect(() => {
    const el = infoRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setListInView(entry.intersectionRatio >= 0.2);
      },
      { threshold: [0, 0.2] }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * TILT_MAX_DEG * 2;
    const rotateX = (0.5 - py) * TILT_MAX_DEG * 2;
    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };

  const handleMouseLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <section id="profile" className="profile">
      <div className="profile__top">
        <div className="profile__photo-col">
          <div className={`profile__photo-wrap${listInView ? ' profile__photo-wrap--in' : ''}`}>
            <span className="profile__photo-label">Profile</span>
            <div
              className="profile__photo-tilt"
              ref={tiltRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img src={profilePhoto} alt="신경식 프로필 사진" className="profile__photo" />
              <span className="profile__photo-glare" aria-hidden="true" />
            </div>
          </div>
          <div className={`profile__meta${listInView ? ' profile__meta--in' : ''}`}>
            <span>Gyeong Sik Shin</span>
            <span>1998 . 09 . 03</span>
          </div>
        </div>

        <div className="profile__right">
          <div
            className={`profile__info${listInView ? ' profile__info--in' : ''}`}
            ref={infoRef}
          >
            <div className="profile__col">
              <h3 className="profile__heading">Education</h3>
              <ul>
                {education.map((item) => (
                  <li key={item.year + item.desc} style={{ '--i': item.i }}>
                    <span className="profile__year">{item.year}</span>
                    <span className="profile__desc">{item.desc}</span>
                  </li>
                ))}
              </ul>

              <h3 className="profile__heading profile__heading--spaced">Work</h3>
              <ul>
                {work.map((item) => (
                  <li key={item.year + item.desc} style={{ '--i': item.i }}>
                    <span className="profile__year">{item.year}</span>
                    <span className="profile__desc">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="profile__col">
              <h3 className="profile__heading">Certification</h3>
              <ul>
                {certification.map((item) => (
                  <li key={item.year + item.desc + item.i} style={{ '--i': item.i }}>
                    <span className="profile__year">{item.year}</span>
                    <span className="profile__desc">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Skills />
        </div>
      </div>
    </section>
  );
};

export default Profile;
