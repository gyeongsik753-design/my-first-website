import { HashRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import { PortfolioProvider } from './context/PortfolioContext';

const App = () => {
  return (
    <PortfolioProvider>
      <HashRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
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
