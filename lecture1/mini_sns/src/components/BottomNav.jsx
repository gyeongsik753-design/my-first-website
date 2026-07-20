import { Box, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';

// 기획안 사양: 맨 왼쪽 홈, 맨 오른쪽 설정(=마이페이지), 주요 버튼(글쓰기)은 하단 가운데
export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';
  const isMyPage = pathname === '/mypage';

  return (
    <Box
      component="nav"
      aria-label="하단 내비게이션"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        zIndex: 10,
      }}
    >
      <IconButton
        component={RouterLink}
        to="/"
        aria-label="홈"
        sx={{ width: 48, height: 48, color: isHome ? 'primary.main' : 'text.secondary' }}
      >
        {isHome ? <HomeIcon /> : <HomeOutlinedIcon />}
      </IconButton>

      <IconButton
        onClick={() => navigate('/create')}
        aria-label="게시물 작성"
        sx={{
          width: 56,
          height: 56,
          bgcolor: 'secondary.main',
          color: '#fff',
          '&:hover': { bgcolor: 'secondary.main', opacity: 0.9 },
        }}
      >
        <AddBoxIcon sx={{ fontSize: 28 }} />
      </IconButton>

      <IconButton
        component={RouterLink}
        to="/mypage"
        aria-label="마이페이지 및 설정"
        sx={{ width: 48, height: 48, color: isMyPage ? 'primary.main' : 'text.secondary' }}
      >
        {isMyPage ? <PersonIcon /> : <PersonOutlineIcon />}
      </IconButton>
    </Box>
  );
}
