import { Box, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';

// 홈/로그인은 화면 상단 우측(TopBarActions)으로 이동. 하단은 글쓰기(가운데)와 마이페이지(오른쪽)만 유지.
export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
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
        justifyContent: 'flex-end',
        px: 3,
        zIndex: 10,
      }}
    >
      <IconButton
        onClick={() => navigate('/create')}
        aria-label="게시물 작성"
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
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
