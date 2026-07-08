import { HashRouter, Routes, Route } from 'react-router-dom';
import { Box, GlobalStyles } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeModeProvider } from './context/ThemeContext';
import CustomCursor from './components/CustomCursor';

/* ════════════════════════════════════════════
   CSS 커스텀 프로퍼티 (테마 색상 시스템)

   :root           → 다크 모드 기본값
   [data-theme="light"] → 라이트 모드 오버라이드

   html[data-theme-switching] * → 전환 중(420ms) transition 활성
   → 420ms 후 속성 제거, 이후 컴포넌트별 transition 복원
════════════════════════════════════════════ */
const THEME_CSS_VARS = {
  ':root': {
    '--tm-bg-root':     '#050505',
    '--tm-bg-section':  '#000000',
    '--tm-bg-light':    '#ffffff',
    '--tm-bg-gray':     '#F5F5F5',
    '--tm-text-1':      '#ffffff',
    '--tm-text-2':      '#AAAAAA',
    '--tm-text-3':      '#666666',
    '--tm-text-tagline':'#D8D8D8',
    '--tm-border-1':    '#111111',
    '--tm-border-2':    '#333333',
    '--tm-hero-bg':     'linear-gradient(145deg, #060606 0%, #080808 50%, #0e0003 100%)',
    '--tm-name-gradient':'linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.7) 100%)',
    '--tm-navbar-bg':   'rgba(5,5,5,0.88)',
    '--tm-navbar-border':'rgba(255,255,255,0.05)',
    '--tm-social-border':'rgba(255,255,255,0.14)',
    '--tm-social-icon': 'rgba(255,255,255,0.4)',
    '--tm-drawer-bg':   '#050505',
    '--tm-drawer-border':'#1A1A1A',
    '--tm-drawer-label':'#333333',
    '--tm-drawer-link': '#444444',
    '--tm-drawer-btn-border':'#1E1E1E',
    '--tm-drawer-btn-color': '#666666',
  },
  '[data-theme="light"]': {
    '--tm-bg-root':     '#f8f9fa',
    '--tm-bg-section':  '#f0f2f5',
    '--tm-bg-light':    '#ffffff',
    '--tm-bg-gray':     '#edf0f3',
    '--tm-text-1':      '#111111',
    '--tm-text-2':      '#555555',
    '--tm-text-3':      '#777777',
    '--tm-text-tagline':'#333333',
    '--tm-border-1':    '#d8dce4',
    '--tm-border-2':    '#cccccc',
    '--tm-hero-bg':     'linear-gradient(145deg, #f0f2f5 0%, #f5f7fa 50%, #fff5f5 100%)',
    '--tm-name-gradient':'linear-gradient(180deg, #0d0d0d 30%, rgba(13,13,13,0.7) 100%)',
    '--tm-navbar-bg':   'rgba(248,249,250,0.92)',
    '--tm-navbar-border':'rgba(0,0,0,0.08)',
    '--tm-social-border':'rgba(0,0,0,0.12)',
    '--tm-social-icon': 'rgba(0,0,0,0.35)',
    '--tm-drawer-bg':   '#f8f9fa',
    '--tm-drawer-border':'#e0e0e0',
    '--tm-drawer-label':'#999999',
    '--tm-drawer-link': '#777777',
    '--tm-drawer-btn-border':'#dddddd',
    '--tm-drawer-btn-color': '#555555',
  },
  /* 전환 애니메이션: data-theme-switching 속성이 있을 때만 transition 활성 */
  'html[data-theme-switching] *, html[data-theme-switching] *::before, html[data-theme-switching] *::after': {
    transition: 'background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease !important',
  },
};

const App = () => {
  return (
    <PortfolioProvider>
      <ThemeModeProvider>
        {/* CSS 커스텀 프로퍼티 전역 주입 */}
        <GlobalStyles styles={THEME_CSS_VARS} />
        {/* 커스텀 커서 — pointer:fine 기기에서만 활성 */}
        <CustomCursor />
        <HashRouter>
          <Box sx={{ bgcolor: 'var(--tm-bg-root)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                pt: { xs: '56px', sm: '64px' },
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutMe />} />
                <Route path="/projects" element={<Projects />} />
              </Routes>
            </Box>
          </Box>
        </HashRouter>
      </ThemeModeProvider>
    </PortfolioProvider>
  );
};

export default App;
