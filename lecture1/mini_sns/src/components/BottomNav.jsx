import { Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';

const TABS = [
  { to: '/', match: (p) => p === '/', Icon: HomeOutlinedIcon, ActiveIcon: HomeIcon, label: '홈' },
  {
    to: '/messages',
    match: (p) => p.startsWith('/messages'),
    Icon: ChatBubbleOutlineIcon,
    ActiveIcon: ChatBubbleIcon,
    label: '메시지',
  },
  { to: '/mypage', match: (p) => p === '/mypage', Icon: PersonOutlineIcon, ActiveIcon: PersonIcon, label: '마이페이지' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        zIndex: 10,
      }}
    >
      {TABS.map(({ to, match, Icon, ActiveIcon, label }) => {
        const active = match(pathname);
        const IconComp = active ? ActiveIcon : Icon;
        return (
          <Box
            key={to}
            component={RouterLink}
            to={to}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.3,
              py: 1.2,
              textDecoration: 'none',
              color: active ? 'secondary.main' : 'text.secondary',
            }}
          >
            <IconComp fontSize="small" />
            <Box component="span" sx={{ fontSize: '0.65rem', fontWeight: active ? 800 : 600 }}>
              {label}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
