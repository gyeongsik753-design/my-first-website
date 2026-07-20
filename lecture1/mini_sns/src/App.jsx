import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import PostCreate from './pages/PostCreate';
import MyPage from './pages/MyPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

const NAV_HIDDEN_PATHS = ['/login', '/signup', '/create'];

function Layout() {
  const { pathname } = useLocation();
  const showNav = !NAV_HIDDEN_PATHS.includes(pathname) && !pathname.startsWith('/posts/');

  return (
    <Box sx={{ minHeight: '100vh', maxWidth: 480, mx: 'auto', bgcolor: 'background.default' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <PostCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {showNav && <BottomNav />}
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
