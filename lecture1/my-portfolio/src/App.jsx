import { HashRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import { PortfolioProvider } from './context/PortfolioContext';
import CustomCursor from './components/CustomCursor';

const App = () => {
  return (
    <PortfolioProvider>
      {/* 커스텀 커서 — 라우터 외부, pointer:fine 기기에서만 활성 */}
      <CustomCursor />
      <HashRouter>
        {/*
          bgcolor: '#050505' — 고정 네비 뒤 배경이 흰색으로 보이지 않도록 다크 처리
          Navbar가 position:fixed 이므로 main에 pt로 공간 확보
        */}
        <Box sx={{ bgcolor: '#050505', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              /* 고정 네비 높이 보정: xs=56px, sm+=64px */
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
    </PortfolioProvider>
  );
};

export default App;
