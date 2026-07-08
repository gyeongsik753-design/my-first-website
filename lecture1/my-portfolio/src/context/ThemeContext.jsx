import { createContext, useContext, useState, useEffect } from 'react';

/* ════════════════════════════════════════════
   ThemeContext — 다크/라이트 모드 관리

   ① localStorage 저장으로 방문 간 선호도 유지
   ② prefers-color-scheme 시스템 기본값 감지
   ③ data-theme 속성을 <html>에 설정 → CSS 변수 전환
   ④ data-theme-switching 속성 → 전환 중 부드러운 transition 활성
   ⑤ 초기 깜빡임 방지: index.html의 인라인 스크립트와 연동
════════════════════════════════════════════ */

const ThemeCtx = createContext({ mode: 'dark', toggle: () => {} });

export const useThemeMode = () => useContext(ThemeCtx);

/* ── 초기 모드 결정 (동기, SSR 안전) ──
   1순위: localStorage 저장값
   2순위: 시스템 prefers-color-scheme
   기본:  'dark'
*/
const getInitialMode = () => {
  try {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  } catch {
    /* localStorage 접근 불가 환경 (iframe, privacy mode) */
  }
  return 'dark';
};

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  /* ── data-theme 속성 동기화 ──
     · data-theme 변경 → CSS 변수 전환 → 색상 자동 교체
     · data-theme-switching → 전환 duration 동안 transition 활성
  */
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    /* 전환 애니메이션 트리거: 400ms 뒤 제거 */
    root.setAttribute('data-theme-switching', '');
    const t = setTimeout(() => root.removeAttribute('data-theme-switching'), 420);
    try {
      localStorage.setItem('portfolio-theme', mode);
    } catch {
      /* noop */
    }
    return () => clearTimeout(t);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeCtx.Provider value={{ mode, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
};
