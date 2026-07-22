import { Box, IconButton, Button } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useAuth } from '../context/AuthContext';

// 상단 우측 고정 영역: 홈 버튼 + 마이페이지(로그인 시) 또는 로그인 버튼(비로그인 시)
export default function TopBarActions({ showHome = true, showProfile = true }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isMyPage = pathname === '/mypage';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {showHome && (
        <IconButton component={RouterLink} to="/" aria-label="홈으로" color="inherit" size="small">
          <HomeOutlinedIcon />
        </IconButton>
      )}
      {user && showProfile && (
        <IconButton
          component={RouterLink}
          to="/mypage"
          aria-label="마이페이지"
          size="small"
          sx={{ color: isMyPage ? 'secondary.main' : 'inherit' }}
        >
          {isMyPage ? <PersonIcon /> : <PersonOutlineIcon />}
        </IconButton>
      )}
      {!user && (
        <Button
          component={RouterLink}
          to="/login"
          color="secondary"
          size="small"
          sx={{ fontWeight: 700, ml: showHome ? 0.5 : 0 }}
        >
          로그인
        </Button>
      )}
    </Box>
  );
}
