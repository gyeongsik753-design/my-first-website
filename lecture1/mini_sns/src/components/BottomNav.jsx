import { Box, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';

// 홈/로그인은 화면 상단 우측(TopBarActions)으로 이동. 하단은 마이페이지만 유지.
export default function BottomNav() {
  const { pathname } = useLocation();
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
