import { createTheme } from '@mui/material/styles';

// WITF (Where Is The Fit) — 패션 커뮤니티 다크 테마
// 전문적이면서도 친근한 느낌: 깊은 차콜 배경 + 골드 포인트 + 코랄 하이라이트
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0e0e10',
      paper: '#1a1a1d',
    },
    primary: {
      main: '#d4af6a',
      contrastText: '#0e0e10',
    },
    secondary: {
      main: '#ff5c72',
    },
    text: {
      primary: '#f5f3ee',
      secondary: '#a7a4a0',
    },
    divider: 'rgba(245, 243, 238, 0.08)',
    error: {
      main: '#ff5c72',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.125rem', fontWeight: 700, letterSpacing: '0.04em' },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  spacing: 8,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(14, 14, 16, 0.85)',
          backdropFilter: 'blur(8px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
