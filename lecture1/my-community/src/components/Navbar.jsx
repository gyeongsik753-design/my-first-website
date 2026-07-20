import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ maxWidth: 960, width: '100%', mx: 'auto' }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: 'primary.main',
            textDecoration: 'none',
          }}
        >
          WITF
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button component={RouterLink} to="/write" variant="contained" color="primary" size="small">
              글쓰기
            </Button>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
              {profile?.name?.[0]?.toUpperCase() ?? '?'}
            </Avatar>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {profile?.name ?? user.email}
            </Typography>
            <Button onClick={handleLogout} color="inherit" size="small">
              로그아웃
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={RouterLink} to="/login" color="inherit" size="small">
              로그인
            </Button>
            <Button component={RouterLink} to="/signup" variant="contained" color="primary" size="small">
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
