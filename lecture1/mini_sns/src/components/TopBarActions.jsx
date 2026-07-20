import { Box, IconButton, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useAuth } from '../context/AuthContext';

// 상단 우측 고정 영역: 홈 버튼 + (비로그인 시) 로그인 버튼
export default function TopBarActions({ showHome = true }) {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {showHome && (
        <IconButton component={RouterLink} to="/" aria-label="홈으로" color="inherit" size="small">
          <HomeOutlinedIcon />
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
