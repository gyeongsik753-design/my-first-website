import { createTheme } from '@mui/material/styles';

// WITF mini_sns — 힙하고 개성있는 패션 SNS 테마
// 메인: 흰색/검정 · 보조: 회색/빨강 (Instagram 참고)
const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    primary: {
      main: '#111111',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E1263F',
    },
    text: {
      primary: '#111111',
      secondary: '#6b6b6b',
    },
    divider: 'rgba(17, 17, 17, 0.1)',
    error: {
      main: '#E1263F',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.2rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  spacing: 8,
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#111111',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(17,17,17,0.08)',
        },
      },
    },
  },
});

export default theme;
