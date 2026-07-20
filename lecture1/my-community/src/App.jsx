import { HashRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostCreate from './pages/PostCreate';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <PostCreate />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
